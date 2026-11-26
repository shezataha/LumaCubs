<?php
declare(strict_types=1);

namespace LumaCubs\Controllers;

use LumaCubs\Auth\SessionService;
use LumaCubs\Db;
use LumaCubs\Middleware\ChildAccess;
use LumaCubs\Request;
use LumaCubs\Response;
use PDO;

final class ChildrenController
{
    public static function list(Request $req): void
    {
        $parent = SessionService::requireParent($req->bearerToken());
        $stmt = Db::pdo()->prepare(
            'SELECT c.id, c.display_name, c.avatar, c.age_group_id, c.preferred_language, c.birth_year,
                    a.code AS age_group_code, a.label AS age_group_label
             FROM children c
             LEFT JOIN age_groups a ON a.id = c.age_group_id
             WHERE c.parent_id = ? AND c.is_active = 1
             ORDER BY c.id ASC'
        );
        $stmt->execute([(int)$parent['id']]);
        Response::ok(['children' => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
    }

    public static function create(Request $req): void
    {
        $parent = SessionService::requireParent($req->bearerToken());
        $name = $req->string('display_name');
        if ($name === '') {
            $name = $req->string('name');
        }
        if ($name === '' || mb_strlen($name) > 60) {
            Response::error('bad_name', 400);
        }
        $avatar = $req->string('avatar', '🧸');
        if ($avatar === '' || mb_strlen($avatar) > 8) {
            $avatar = '🧸';
        }
        $ageGroupId = $req->int('age_group_id', 0);
        $ageGroupId = $ageGroupId > 0 ? $ageGroupId : null;
        $lang = $req->string('preferred_language', 'en') ?: 'en';
        if (!in_array($lang, ['en', 'ur', 'ar'], true)) {
            Response::error('bad_language', 400);
        }
        $birthYear = $req->int('birth_year', 0) ?: null;
        if ($birthYear !== null && ($birthYear < 2010 || $birthYear > (int)date('Y'))) {
            Response::error('bad_birth_year', 400);
        }

        $pdo = Db::pdo();
        $pdo->prepare(
            'INSERT INTO children (parent_id, display_name, avatar, age_group_id, preferred_language, birth_year)
             VALUES (?, ?, ?, ?, ?, ?)'
        )->execute([(int)$parent['id'], $name, $avatar, $ageGroupId, $lang, $birthYear]);
        $id = (int)$pdo->lastInsertId();
        $pdo->prepare(
            'INSERT INTO child_settings (child_id, settings_json) VALUES (?, ?)'
        )->execute([$id, json_encode([
            'speech_on' => true,
            'language' => $lang,
            'accessibility' => new \stdClass(),
        ], JSON_UNESCAPED_UNICODE)]);

        Response::ok([
            'child' => [
                'id' => $id,
                'display_name' => $name,
                'avatar' => $avatar,
                'age_group_id' => $ageGroupId,
                'preferred_language' => $lang,
                'birth_year' => $birthYear,
            ],
        ], 201);
    }

    public static function update(Request $req): void
    {
        $parent = SessionService::requireParent($req->bearerToken());
        $childId = (int)$req->param('id');
        ChildAccess::requireOwned((int)$parent['id'], $childId);

        $fields = [];
        $params = [];
        $name = $req->string('display_name');
        if ($name === '') {
            $name = $req->string('name');
        }
        if ($name !== '') {
            if (mb_strlen($name) > 60) {
                Response::error('bad_name', 400);
            }
            $fields[] = 'display_name = ?';
            $params[] = $name;
        }
        $avatar = $req->string('avatar');
        if ($avatar !== '') {
            if (mb_strlen($avatar) > 8) {
                Response::error('bad_avatar', 400);
            }
            $fields[] = 'avatar = ?';
            $params[] = $avatar;
        }
        if ($req->input('age_group_id', null) !== null) {
            $age = $req->int('age_group_id', 0);
            $fields[] = 'age_group_id = ?';
            $params[] = $age > 0 ? $age : null;
        }
        $lang = $req->string('preferred_language');
        if ($lang !== '') {
            if (!in_array($lang, ['en', 'ur', 'ar'], true)) {
                Response::error('bad_language', 400);
            }
            $fields[] = 'preferred_language = ?';
            $params[] = $lang;
        }
        if ($req->input('birth_year', null) !== null) {
            $by = $req->int('birth_year', 0);
            $fields[] = 'birth_year = ?';
            $params[] = $by > 0 ? $by : null;
        }
        if (!$fields) {
            Response::error('nothing_to_update', 400);
        }
        $params[] = $childId;
        Db::pdo()->prepare(
            'UPDATE children SET ' . implode(', ', $fields) . ', updated_at = NOW() WHERE id = ?'
        )->execute($params);

        Response::ok(['message' => 'updated']);
    }

    public static function deactivate(Request $req): void
    {
        $parent = SessionService::requireParent($req->bearerToken());
        $childId = (int)$req->param('id');
        ChildAccess::requireOwned((int)$parent['id'], $childId);
        Db::pdo()->prepare('UPDATE children SET is_active = 0, updated_at = NOW() WHERE id = ?')
            ->execute([$childId]);
        Response::ok(['message' => 'deactivated']);
    }
}