<?php
declare(strict_types=1);

namespace LumaCubs\Controllers;

use LumaCubs\Auth\SessionService;
use LumaCubs\Db;
use LumaCubs\Middleware\ChildAccess;
use LumaCubs\Request;
use LumaCubs\Response;
use PDO;

final class ProgressController
{
    public static function list(Request $req): void
    {
        $parent = SessionService::requireParent($req->bearerToken());
        $childId = (int)$req->query('child_id', 0);
        ChildAccess::requireOwned((int)$parent['id'], $childId);

        $stmt = Db::pdo()->prepare(
            'SELECT activity_code, content_id, status, score, time_spent_sec, started_at, completed_at, updated_at
             FROM child_progress WHERE child_id = ? ORDER BY updated_at DESC LIMIT 500'
        );
        $stmt->execute([$childId]);
        Response::ok(['child_id' => $childId, 'progress' => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
    }

    public static function upsert(Request $req): void
    {
        $parent = SessionService::requireParent($req->bearerToken());
        $childId = $req->int('child_id');
        ChildAccess::requireOwned((int)$parent['id'], $childId);

        $activity = $req->string('activity_code');
        if ($activity === '' || mb_strlen($activity) > 100) {
            Response::error('bad_activity_code', 400);
        }
        $status = $req->string('status', 'started');
        if (!in_array($status, ['started', 'completed', 'mastered'], true)) {
            Response::error('bad_status', 400);
        }
        $contentId = $req->int('content_id', 0) ?: null;
        $score = $req->input('score', null);
        $score = $score === null || $score === '' ? null : (int)$score;
        $timeSpent = $req->int('time_spent_sec', 0) ?: null;
        $meta = $req->input('meta', null);
        $metaJson = is_array($meta) ? json_encode($meta, JSON_UNESCAPED_UNICODE) : null;

        $pdo = Db::pdo();
        $pdo->prepare(
            'INSERT INTO child_progress
               (child_id, content_id, activity_code, status, score, time_spent_sec, meta_json, started_at, completed_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), IF(? IN (\'completed\',\'mastered\'), NOW(), NULL))
             ON DUPLICATE KEY UPDATE
               content_id = COALESCE(VALUES(content_id), content_id),
               status = VALUES(status),
               score = COALESCE(VALUES(score), score),
               time_spent_sec = COALESCE(VALUES(time_spent_sec), time_spent_sec),
               meta_json = COALESCE(VALUES(meta_json), meta_json),
               completed_at = IF(VALUES(status) IN (\'completed\',\'mastered\'), COALESCE(completed_at, NOW()), completed_at),
               updated_at = NOW()'
        )->execute([$childId, $contentId, $activity, $status, $score, $timeSpent, $metaJson, $status]);

        $pdo->prepare(
            'INSERT INTO progress_events (child_id, activity_code, event_type, payload_json)
             VALUES (?, ?, ?, ?)'
        )->execute([
            $childId,
            $activity,
            $status,
            json_encode(['score' => $score, 'content_id' => $contentId], JSON_UNESCAPED_UNICODE),
        ]);

        Response::ok(['message' => 'progress_saved']);
    }

    public static function achievements(Request $req): void
    {
        $parent = SessionService::requireParent($req->bearerToken());
        $childId = (int)$req->query('child_id', 0);
        ChildAccess::requireOwned((int)$parent['id'], $childId);
        $lang = strtolower((string)$req->query('lang', 'en'));
        if (!in_array($lang, ['en', 'ur', 'ar'], true)) {
            $lang = 'en';
        }

        $stmt = Db::pdo()->prepare(
            'SELECT a.id, a.code, a.icon, a.points, ca.earned_at,
                    COALESCE(t.title, te.title) AS title,
                    COALESCE(t.description, te.description) AS description
             FROM child_achievements ca
             INNER JOIN achievements a ON a.id = ca.achievement_id
             LEFT JOIN achievement_translations t ON t.achievement_id = a.id AND t.lang_code = ?
             LEFT JOIN achievement_translations te ON te.achievement_id = a.id AND te.lang_code = \'en\'
             WHERE ca.child_id = ?
             ORDER BY ca.earned_at DESC'
        );
        $stmt->execute([$lang, $childId]);
        Response::ok(['child_id' => $childId, 'achievements' => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
    }
}