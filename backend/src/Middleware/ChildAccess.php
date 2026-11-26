<?php
declare(strict_types=1);

namespace LumaCubs\Middleware;

use LumaCubs\Db;
use LumaCubs\Response;
use PDO;

final class ChildAccess
{
    /** Ensure child belongs to parent. Returns child row. */
    public static function requireOwned(int $parentId, int $childId): array
    {
        if ($childId <= 0) {
            Response::error('bad_child', 400);
        }
        $stmt = Db::pdo()->prepare(
            'SELECT id, parent_id, display_name, avatar, age_group_id, learning_level_override,
                    preferred_language, birth_year, date_of_birth, is_active
             FROM children WHERE id = ? AND parent_id = ? AND is_active = 1'
        );
        $stmt->execute([$childId, $parentId]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$row) {
            Response::error('child_not_found', 404);
        }
        return $row;
    }
}