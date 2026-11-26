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

final class DashboardController
{
    public static function childDashboard(Request $req): void
    {
        $parent = SessionService::requireParent($req->bearerToken());
        $childId = (int)$req->query('child_id', 0);
        if ($childId <= 0) {
            Response::error('bad_child', 400);
        }
        ChildAccess::requireOwned((int)$parent['id'], $childId);
        AgeService::syncChildAgeGroup(Db::pdo(), $childId);

        $stmt = Db::pdo()->prepare(
            'SELECT c.*, a.code AS age_group_code, a.label AS age_group_label, a.age_min, a.age_max
             FROM children c
             LEFT JOIN age_groups a ON a.id = c.age_group_id
             WHERE c.id = ?'
        );
        $stmt->execute([$childId]);
        $child = AgeService::enrichChildRow($stmt->fetch(PDO::FETCH_ASSOC) ?: []);
        $ageGroupId = (int)($child['resolved_age_group_id'] ?? $child['age_group_id'] ?? 0);
        if ($ageGroupId <= 0) {
            $ageGroupId = 1;
        }

        $lang = strtolower((string)$req->query('lang', $child['preferred_language'] ?? 'en'));
        if (!in_array($lang, ['en', 'ur', 'ar'], true)) {
            $lang = 'en';
        }

        $controls = self::controls($childId);
        $recommended = self::segmentsFor($ageGroupId, $lang, 'recommended');
        $explore = self::segmentsFor($ageGroupId, $lang, 'explore');
        if (!(int)$controls['allow_explore']) {
            $explore = [];
        }
        // Advanced unlock: include next age-group explore items labeled carefully later
        if ((int)$controls['allow_advanced'] && $ageGroupId < 4) {
            $extra = self::segmentsFor($ageGroupId + 1, $lang, 'recommended');
            foreach ($extra as &$row) {
                $row['placement'] = 'explore';
                $row['readiness'] = 'parent_unlocked';
            }
            unset($row);
            $explore = array_merge($explore, $extra);
        }

        $recent = self::recent($childId);
        $progressSummary = self::progressSummary($childId);
        $mathRecommended = self::mathCategories($ageGroupId, $lang, 'recommended');
        $mathExplore = self::mathCategories($ageGroupId, $lang, 'explore');

        Response::ok([
            'child' => $child,
            'age_group_id' => $ageGroupId,
            'controls' => $controls,
            'welcome' => [
                'title' => 'Hi ' . ($child['display_name'] ?? 'friend') . '!',
                'subtitle' => ($child['age_group_label'] ?? 'Little Explorer') . ' learning space',
            ],
            'recommended_segments' => $recommended,
            'explore_segments' => $explore,
            'recommended_math_categories' => $mathRecommended,
            'explore_math_categories' => $mathExplore,
            'recently_played' => $recent,
            'progress' => $progressSummary,
            'achievements' => self::achievements($childId, $lang),
        ]);
    }

    public static function parentOverview(Request $req): void
    {
        $parent = SessionService::requireParent($req->bearerToken());
        $stmt = Db::pdo()->prepare(
            'SELECT c.id, c.display_name, c.avatar, c.age_group_id, c.date_of_birth, c.preferred_language,
                    a.label AS age_group_label
             FROM children c
             LEFT JOIN age_groups a ON a.id = c.age_group_id
             WHERE c.parent_id = ? AND c.is_active = 1
             ORDER BY c.id'
        );
        $stmt->execute([(int)$parent['id']]);
        $kids = [];
        foreach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $row) {
            $row = AgeService::enrichChildRow($row);
            $row['progress'] = self::progressSummary((int)$row['id']);
            $kids[] = $row;
        }
        Response::ok([
            'parent' => $parent,
            'children' => $kids,
        ]);
    }

    /** @return array<string,mixed> */
    private static function controls(int $childId): array
    {
        $stmt = Db::pdo()->prepare(
            'SELECT allow_explore, allow_advanced, max_difficulty, settings_json
             FROM child_learning_controls WHERE child_id = ?'
        );
        $stmt->execute([$childId]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$row) {
            Db::pdo()->prepare(
                'INSERT INTO child_learning_controls (child_id) VALUES (?)'
            )->execute([$childId]);
            return [
                'allow_explore' => 1,
                'allow_advanced' => 0,
                'max_difficulty' => 3,
                'settings' => new \stdClass(),
            ];
        }
        return [
            'allow_explore' => (int)$row['allow_explore'],
            'allow_advanced' => (int)$row['allow_advanced'],
            'max_difficulty' => (int)$row['max_difficulty'],
            'settings' => json_decode((string)($row['settings_json'] ?? '{}'), true) ?: new \stdClass(),
        ];
    }

    /** @return list<array<string,mixed>> */
    private static function segmentsFor(int $ageGroupId, string $lang, string $placement): array
    {
        $stmt = Db::pdo()->prepare(
            'SELECT s.id, s.code, s.sort_order, s.illustration_uri, s.icon_uri,
                    sam.placement, sam.sort_order AS age_sort,
                    COALESCE(t.title, te.title) AS title,
                    COALESCE(t.description, te.description) AS description
             FROM segment_age_map sam
             INNER JOIN learning_segments s ON s.id = sam.segment_id AND s.is_active = 1
             LEFT JOIN learning_segment_translations t
               ON t.segment_id = s.id AND t.lang_code = ?
             LEFT JOIN learning_segment_translations te
               ON te.segment_id = s.id AND te.lang_code = \'en\'
             WHERE sam.age_group_id = ? AND sam.placement = ?
             ORDER BY sam.sort_order, s.sort_order'
        );
        $stmt->execute([$lang, $ageGroupId, $placement]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /** @return list<array<string,mixed>> */
    private static function mathCategories(int $ageGroupId, string $lang, string $placement): array
    {
        $stmt = Db::pdo()->prepare(
            'SELECT sc.id, sc.code, sc.illustration_uri, sc.icon_uri, sc.accent_color,
                    cam.placement, cam.sort_order,
                    COALESCE(t.title, te.title) AS title,
                    COALESCE(t.description, te.description) AS description
             FROM category_age_map cam
             INNER JOIN subcategories sc ON sc.id = cam.subcategory_id AND sc.is_active = 1 AND sc.segment_id = 1
             LEFT JOIN subcategory_translations t
               ON t.subcategory_id = sc.id AND t.lang_code = ?
             LEFT JOIN subcategory_translations te
               ON te.subcategory_id = sc.id AND te.lang_code = \'en\'
             WHERE cam.age_group_id = ? AND cam.placement = ?
             ORDER BY cam.sort_order, sc.sort_order'
        );
        $stmt->execute([$lang, $ageGroupId, $placement]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /** @return list<array<string,mixed>> */
    private static function recent(int $childId): array
    {
        $stmt = Db::pdo()->prepare(
            'SELECT activity_code, status, score, updated_at
             FROM child_progress
             WHERE child_id = ?
             ORDER BY updated_at DESC
             LIMIT 8'
        );
        $stmt->execute([$childId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /** @return array<string,mixed> */
    private static function progressSummary(int $childId): array
    {
        $stmt = Db::pdo()->prepare(
            'SELECT
                SUM(status IN (\'completed\',\'mastered\')) AS completed,
                SUM(status = \'mastered\') AS mastered,
                SUM(status = \'started\') AS started,
                COUNT(*) AS total
             FROM child_progress WHERE child_id = ?'
        );
        $stmt->execute([$childId]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC) ?: [];
        return [
            'completed' => (int)($row['completed'] ?? 0),
            'mastered' => (int)($row['mastered'] ?? 0),
            'started' => (int)($row['started'] ?? 0),
            'total' => (int)($row['total'] ?? 0),
        ];
    }

    /** @return list<array<string,mixed>> */
    private static function achievements(int $childId, string $lang): array
    {
        $stmt = Db::pdo()->prepare(
            'SELECT a.code, a.icon, a.points, ca.earned_at,
                    COALESCE(t.title, te.title) AS title
             FROM child_achievements ca
             INNER JOIN achievements a ON a.id = ca.achievement_id
             LEFT JOIN achievement_translations t ON t.achievement_id = a.id AND t.lang_code = ?
             LEFT JOIN achievement_translations te ON te.achievement_id = a.id AND te.lang_code = \'en\'
             WHERE ca.child_id = ?
             ORDER BY ca.earned_at DESC
             LIMIT 12'
        );
        $stmt->execute([$lang, $childId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
