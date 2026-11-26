<?php
declare(strict_types=1);

namespace LumaCubs\Controllers;

use LumaCubs\Auth\SessionService;
use LumaCubs\Db;
use LumaCubs\Middleware\ChildAccess;
use LumaCubs\Request;
use LumaCubs\Response;
use PDO;

final class SettingsController
{
    public static function getParent(Request $req): void
    {
        $parent = SessionService::requireParent($req->bearerToken());
        $stmt = Db::pdo()->prepare('SELECT settings_json FROM parent_settings WHERE parent_id = ?');
        $stmt->execute([(int)$parent['id']]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $settings = $row ? (json_decode((string)$row['settings_json'], true) ?: []) : [];
        Response::ok(['settings' => $settings]);
    }

    public static function putParent(Request $req): void
    {
        $parent = SessionService::requireParent($req->bearerToken());
        $settings = $req->input('settings', null);
        if (!is_array($settings)) {
            Response::error('bad_settings', 400);
        }
        $allowed = self::sanitizeParentSettings($settings);
        $json = json_encode($allowed, JSON_UNESCAPED_UNICODE);
        Db::pdo()->prepare(
            'INSERT INTO parent_settings (parent_id, settings_json) VALUES (?, ?)
             ON DUPLICATE KEY UPDATE settings_json = VALUES(settings_json), updated_at = NOW()'
        )->execute([(int)$parent['id'], $json]);
        Response::ok(['settings' => $allowed]);
    }

    public static function getChild(Request $req): void
    {
        $parent = SessionService::requireParent($req->bearerToken());
        $childId = (int)$req->param('id');
        ChildAccess::requireOwned((int)$parent['id'], $childId);
        $stmt = Db::pdo()->prepare('SELECT settings_json FROM child_settings WHERE child_id = ?');
        $stmt->execute([$childId]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $settings = $row ? (json_decode((string)$row['settings_json'], true) ?: []) : [];
        Response::ok(['child_id' => $childId, 'settings' => $settings]);
    }

    public static function putChild(Request $req): void
    {
        $parent = SessionService::requireParent($req->bearerToken());
        $childId = (int)$req->param('id');
        ChildAccess::requireOwned((int)$parent['id'], $childId);
        $settings = $req->input('settings', null);
        if (!is_array($settings)) {
            Response::error('bad_settings', 400);
        }
        $allowed = self::sanitizeChildSettings($settings);
        $json = json_encode($allowed, JSON_UNESCAPED_UNICODE);
        Db::pdo()->prepare(
            'INSERT INTO child_settings (child_id, settings_json) VALUES (?, ?)
             ON DUPLICATE KEY UPDATE settings_json = VALUES(settings_json), updated_at = NOW()'
        )->execute([$childId, $json]);
        Response::ok(['child_id' => $childId, 'settings' => $allowed]);
    }

    private static function sanitizeParentSettings(array $in): array
    {
        $out = [];
        if (array_key_exists('speech_on', $in)) {
            $out['speech_on'] = (bool)$in['speech_on'];
        }
        if (isset($in['language']) && in_array($in['language'], ['en', 'ur', 'ar'], true)) {
            $out['language'] = $in['language'];
        }
        if (isset($in['accessibility']) && is_array($in['accessibility'])) {
            $out['accessibility'] = [
                'large_text' => !empty($in['accessibility']['large_text']),
                'reduce_motion' => !empty($in['accessibility']['reduce_motion']),
            ];
        }
        return $out;
    }

    private static function sanitizeChildSettings(array $in): array
    {
        $out = self::sanitizeParentSettings($in);
        return $out;
    }
}