<?php
declare(strict_types=1);

namespace LumaCubs\Controllers;

use LumaCubs\Db;
use LumaCubs\Request;
use LumaCubs\Response;
use PDO;

final class CatalogController
{
    public static function ageGroups(Request $req): void
    {
        $rows = Db::pdo()->query(
            'SELECT id, code, label, age_min, age_max, sort_order FROM age_groups ORDER BY sort_order'
        )->fetchAll(PDO::FETCH_ASSOC);
        Response::ok(['age_groups' => $rows]);
    }

    public static function languages(Request $req): void
    {
        $rows = Db::pdo()->query(
            'SELECT code, label, direction FROM languages WHERE is_active = 1 ORDER BY code'
        )->fetchAll(PDO::FETCH_ASSOC);
        Response::ok(['languages' => $rows]);
    }

    public static function segments(Request $req): void
    {
        $lang = self::lang($req);
        $stmt = Db::pdo()->prepare(
            'SELECT s.id, s.code, s.sort_order, s.icon,
                    COALESCE(t.title, te.title) AS title,
                    COALESCE(t.description, te.description) AS description
             FROM learning_segments s
             LEFT JOIN learning_segment_translations t
               ON t.segment_id = s.id AND t.lang_code = ?
             LEFT JOIN learning_segment_translations te
               ON te.segment_id = s.id AND te.lang_code = \'en\'
             WHERE s.is_active = 1
             ORDER BY s.sort_order'
        );
        $stmt->execute([$lang]);
        Response::ok(['lang' => $lang, 'segments' => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
    }

    /** Categories under a segment (DB table: subcategories). */
    public static function subcategories(Request $req): void
    {
        $segmentId = (int)$req->param('id');
        $lang = self::lang($req);
        $rows = self::fetchCategories($segmentId, $lang);
        Response::ok([
            'segment_id' => $segmentId,
            'lang' => $lang,
            'categories' => $rows,
            // backward-compatible alias
            'subcategories' => $rows,
        ]);
    }

    /** Alias route for clarity. */
    public static function categories(Request $req): void
    {
        self::subcategories($req);
    }

    public static function categoryTopics(Request $req): void
    {
        $categoryId = (int)$req->param('id');
        $lang = self::lang($req);
        $stmt = Db::pdo()->prepare(
            'SELECT tp.id, tp.code, tp.sort_order,
                    COALESCE(t.title, te.title) AS title,
                    COALESCE(t.description, te.description) AS description
             FROM topics tp
             LEFT JOIN topic_translations t
               ON t.topic_id = tp.id AND t.lang_code = ?
             LEFT JOIN topic_translations te
               ON te.topic_id = tp.id AND te.lang_code = \'en\'
             WHERE tp.subcategory_id = ? AND tp.is_active = 1
             ORDER BY tp.sort_order, tp.id'
        );
        $stmt->execute([$lang, $categoryId]);
        Response::ok([
            'category_id' => $categoryId,
            'lang' => $lang,
            'topics' => $stmt->fetchAll(PDO::FETCH_ASSOC),
        ]);
    }

    public static function content(Request $req): void
    {
        $lang = self::lang($req);
        $segmentId = (int)$req->query('segment_id', 0);
        $categoryId = (int)$req->query('category_id', 0);
        if ($categoryId <= 0) {
            $categoryId = (int)$req->query('subcategory_id', 0);
        }
        $ageGroupId = (int)$req->query('age_group_id', 0);
        $publishedOnly = ((string)$req->query('published', '1')) !== '0';

        $sql = 'SELECT c.id, c.code, c.content_type, c.difficulty, c.estimated_minutes,
                       c.segment_id, c.subcategory_id, c.topic_id, c.media_uri, c.is_published,
                       COALESCE(tr.title, tre.title) AS title,
                       COALESCE(tr.summary, tre.summary) AS summary
                FROM content_items c
                LEFT JOIN content_translations tr
                  ON tr.content_id = c.id AND tr.lang_code = ?
                LEFT JOIN content_translations tre
                  ON tre.content_id = c.id AND tre.lang_code = \'en\'';
        $params = [$lang];

        if ($ageGroupId > 0) {
            $sql .= ' INNER JOIN content_age_map cam ON cam.content_id = c.id AND cam.age_group_id = ?';
            $params[] = $ageGroupId;
        }
        $sql .= ' WHERE 1=1';
        if ($publishedOnly) {
            $sql .= ' AND c.is_published = 1';
        }
        if ($segmentId > 0) {
            $sql .= ' AND c.segment_id = ?';
            $params[] = $segmentId;
        }
        if ($categoryId > 0) {
            $sql .= ' AND (c.subcategory_id = ? OR EXISTS (
              SELECT 1 FROM content_links cl WHERE cl.content_id = c.id AND cl.subcategory_id = ?
            ))';
            $params[] = $categoryId;
            $params[] = $categoryId;
        }
        $sql .= ' ORDER BY c.id ASC LIMIT 200';

        $stmt = Db::pdo()->prepare($sql);
        $stmt->execute($params);
        Response::ok([
            'lang' => $lang,
            'filters' => [
                'segment_id' => $segmentId ?: null,
                'category_id' => $categoryId ?: null,
                'age_group_id' => $ageGroupId ?: null,
                'published' => $publishedOnly,
            ],
            'content' => $stmt->fetchAll(PDO::FETCH_ASSOC),
        ]);
    }

    private static function lang(Request $req): string
    {
        $lang = strtolower((string)$req->query('lang', 'en'));
        return in_array($lang, ['en', 'ur', 'ar'], true) ? $lang : 'en';
    }

    /** @return list<array<string,mixed>> */
    private static function fetchCategories(int $segmentId, string $lang): array
    {
        $stmt = Db::pdo()->prepare(
            'SELECT sc.id, sc.code, sc.sort_order, sc.illustration_uri, sc.icon_uri, sc.accent_color, sc.metadata_json,
                    COALESCE(t.title, te.title) AS title,
                    COALESCE(t.description, te.description) AS description
             FROM subcategories sc
             LEFT JOIN subcategory_translations t
               ON t.subcategory_id = sc.id AND t.lang_code = ?
             LEFT JOIN subcategory_translations te
               ON te.subcategory_id = sc.id AND te.lang_code = \'en\'
             WHERE sc.segment_id = ? AND sc.is_active = 1
             ORDER BY sc.sort_order, sc.id'
        );
        $stmt->execute([$lang, $segmentId]);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        foreach ($rows as &$row) {
            $meta = [];
            if (!empty($row['metadata_json'])) {
                $decoded = json_decode((string)$row['metadata_json'], true);
                if (is_array($decoded)) {
                    $meta = $decoded;
                }
            }
            $row['metadata'] = $meta;
            unset($row['metadata_json']);
            $ages = $meta['suitable_age_group_ids'] ?? [];
            $row['age_label'] = self::ageLabel($ages);
            $row['activity_count'] = 0; // ready for future aggregation
        }
        unset($row);
        return $rows;
    }

    /** @param list<int|string> $ageIds */
    private static function ageLabel(array $ageIds): string
    {
        $ids = [];
        foreach ($ageIds as $id) {
            $id = (int)$id;
            if ($id >= 1 && $id <= 4) {
                $ids[$id] = true;
            }
        }
        $ids = array_keys($ids);
        sort($ids);
        if (!$ids) {
            return 'Ages 2–8';
        }
        $bounds = [
            1 => ['2', '3'],
            2 => ['4', '5'],
            3 => ['6', '7'],
            4 => ['8', '8'],
        ];
        $low = $bounds[$ids[0]][0];
        $high = $bounds[$ids[count($ids) - 1]][1];
        return $low === $high ? ('Age ' . $low) : ('Ages ' . $low . '–' . $high);
    }
}
