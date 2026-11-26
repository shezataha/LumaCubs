<?php
declare(strict_types=1);

namespace LumaCubs\Controllers;

use LumaCubs\AgeService;
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
            'SELECT c.id, c.display_name, c.avatar, c.age_group_id, c.learning_level_override,
                    c.preferred_language, c.birth_year, c.date_of_birth,
                    a.code AS age_group_code, a.label AS age_group_label, a.age_min, a.age_max
             FROM children c
             LEFT JOIN age_groups a ON a.id = c.age_group_id
             WHERE c.parent_id = ? AND c.is_active = 1
             ORDER BY c.id ASC'
        );
        $stmt->execute([(int)$parent['id']]);
        $rows = array_map([AgeService::class, 'enrichChildRow'], $stmt->fetchAll(PDO::FETCH_ASSOC));
        Response::ok(['children' => $rows]);
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
        $avatar = $req->string('avatar', 'cub');
        if ($avatar === '' || mb_strlen($avatar) > 8) {
            $avatar = 'cub';
        }
        $lang = $req->string('preferred_language', 'en') ?: 'en';
        if (!in_array($lang, ['en', 'ur', 'ar'], true)) {
            Response::error('bad_language', 400);
        }

        $dob = self::parseDob($req);
        $birthYear = $dob ? (int)substr($dob, 0, 4) : ($req->int('birth_year', 0) ?: null);
        $ageGroupId = AgeService::ageGroupIdForAge(AgeService::ageFromDob($dob));
        if ($ageGroupId === null) {
            $ageGroupId = $req->int('age_group_id', 0) ?: null;
        }

        $pdo = Db::pdo();
        $pdo->prepare(
            'INSERT INTO children
              (parent_id, display_name, avatar, age_group_id, preferred_language, birth_year, date_of_birth)
             VALUES (?, ?, ?, ?, ?, ?, ?)'
        )->execute([(int)$parent['id'], $name, $avatar, $ageGroupId, $lang, $birthYear, $dob]);
        $id = (int)$pdo->lastInsertId();

        $pdo->prepare(
            'INSERT INTO child_settings (child_id, settings_json) VALUES (?, ?)'
        )->execute([$id, json_encode([
            'speech_on' => true,
            'language' => $lang,
            'accessibility' => new \stdClass(),
        ], JSON_UNESCAPED_UNICODE)]);

        $pdo->prepare(
            'INSERT INTO child_learning_controls (child_id, allow_explore, allow_advanced, max_difficulty)
             VALUES (?, 1, 0, 3)
             ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP'
        )->execute([$id]);

        $child = self::fetchOne((int)$parent['id'], $id);
        Response::ok(['child' => $child], 201);
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
        $lang = $req->string('preferred_language');
        if ($lang !== '') {
            if (!in_array($lang, ['en', 'ur', 'ar'], true)) {
                Response::error('bad_language', 400);
            }
            $fields[] = 'preferred_language = ?';
            $params[] = $lang;
        }
        if ($req->input('date_of_birth', null) !== null || $req->input('dob', null) !== null) {
            $dob = self::parseDob($req);
            $fields[] = 'date_of_birth = ?';
            $params[] = $dob;
            if ($dob) {
                $fields[] = 'birth_year = ?';
                $params[] = (int)substr($dob, 0, 4);
                $fields[] = 'age_group_id = ?';
                $params[] = AgeService::ageGroupIdForAge(AgeService::ageFromDob($dob));
            }
        }
        if ($req->input('learning_level_override', null) !== null) {
            $ovr = $req->int('learning_level_override', 0);
            if ($ovr < -1 || $ovr > 1) {
                Response::error('bad_level_override', 400);
            }
            $fields[] = 'learning_level_override = ?';
            $params[] = $ovr;
        }
        if ($req->input('age_group_id', null) !== null && $req->input('date_of_birth', null) === null && $req->input('dob', null) === null) {
            // Manual age group only when DOB not being set this request
            $age = $req->int('age_group_id', 0);
            $fields[] = 'age_group_id = ?';
            $params[] = $age > 0 ? $age : null;
        }

        if (!$fields) {
            Response::error('nothing_to_update', 400);
        }
        $params[] = $childId;
        Db::pdo()->prepare(
            'UPDATE children SET ' . implode(', ', $fields) . ', updated_at = NOW() WHERE id = ?'
        )->execute($params);

        AgeService::syncChildAgeGroup(Db::pdo(), $childId);
        Response::ok(['child' => self::fetchOne((int)$parent['id'], $childId), 'message' => 'updated']);
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

    public static function select(Request $req): void
    {
        $parent = SessionService::requireParent($req->bearerToken());
        $childId = $req->int('child_id');
        if ($childId <= 0) {
            $childId = (int)$req->param('id');
        }
        $child = ChildAccess::requireOwned((int)$parent['id'], $childId);
        AgeService::syncChildAgeGroup(Db::pdo(), $childId);
        $full = self::fetchOne((int)$parent['id'], $childId);
        Response::ok(['child' => $full, 'selected' => true]);
    }

    private static function parseDob(Request $req): ?string
    {
        $raw = $req->string('date_of_birth');
        if ($raw === '') {
            $raw = $req->string('dob');
        }
        if ($raw === '') {
            return null;
        }
        if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $raw)) {
            Response::error('bad_dob', 400);
        }
        $ts = strtotime($raw);
        if ($ts === false || $ts > time()) {
            Response::error('bad_dob', 400);
        }
        $age = AgeService::ageFromDob($raw);
        if ($age !== null && $age > 12) {
            Response::error('dob_out_of_range', 400);
        }
        return $raw;
    }

    /** @return array<string,mixed>|null */
    private static function fetchOne(int $parentId, int $childId): ?array
    {
        $stmt = Db::pdo()->prepare(
            'SELECT c.id, c.display_name, c.avatar, c.age_group_id, c.learning_level_override,
                    c.preferred_language, c.birth_year, c.date_of_birth,
                    a.code AS age_group_code, a.label AS age_group_label, a.age_min, a.age_max
             FROM children c
             LEFT JOIN age_groups a ON a.id = c.age_group_id
             WHERE c.parent_id = ? AND c.id = ? AND c.is_active = 1'
        );
        $stmt->execute([$parentId, $childId]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row ? AgeService::enrichChildRow($row) : null;
    }
}
