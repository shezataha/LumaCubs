<?php
declare(strict_types=1);

namespace LumaCubs;

use DateTimeImmutable;
use PDO;

final class AgeService
{
    public static function ageFromDob(?string $dob): ?int
    {
        if ($dob === null || $dob === '') {
            return null;
        }
        try {
            $birth = new DateTimeImmutable($dob);
        } catch (\Exception $e) {
            return null;
        }
        $now = new DateTimeImmutable('today');
        if ($birth > $now) {
            return null;
        }
        return (int)$birth->diff($now)->y;
    }

    public static function ageGroupIdForAge(?int $age): ?int
    {
        if ($age === null || $age < 0) {
            return null;
        }
        if ($age <= 3) {
            return 1; // Little Explorers 2–3 (also maps age 0–1 safely to earliest stage)
        }
        if ($age <= 5) {
            return 2;
        }
        if ($age <= 7) {
            return 3;
        }
        return 4; // 8+
    }

    public static function resolveAgeGroupId(?string $dob, ?int $explicitAgeGroupId, ?int $overrideLevel = null): ?int
    {
        $fromDob = self::ageGroupIdForAge(self::ageFromDob($dob));
        $base = $explicitAgeGroupId ?: $fromDob;
        if ($base === null) {
            return null;
        }
        if ($overrideLevel === null || $overrideLevel === 0) {
            return $base;
        }
        $shifted = $base + (int)$overrideLevel;
        return max(1, min(4, $shifted));
    }

    /** @return array<string,mixed> */
    public static function enrichChildRow(array $row): array
    {
        $dob = $row['date_of_birth'] ?? null;
        $age = self::ageFromDob(is_string($dob) ? $dob : null);
        $override = isset($row['learning_level_override']) && $row['learning_level_override'] !== null
            ? (int)$row['learning_level_override'] : null;
        $storedGroup = isset($row['age_group_id']) && $row['age_group_id'] !== null
            ? (int)$row['age_group_id'] : null;
        $resolved = self::resolveAgeGroupId(
            is_string($dob) ? $dob : null,
            $storedGroup,
            $override
        );
        $row['age_years'] = $age;
        $row['resolved_age_group_id'] = $resolved;
        return $row;
    }

    public static function syncChildAgeGroup(PDO $pdo, int $childId): void
    {
        $stmt = $pdo->prepare(
            'SELECT date_of_birth, age_group_id, learning_level_override FROM children WHERE id = ?'
        );
        $stmt->execute([$childId]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$row) {
            return;
        }
        $resolved = self::resolveAgeGroupId(
            $row['date_of_birth'] !== null ? (string)$row['date_of_birth'] : null,
            $row['age_group_id'] !== null ? (int)$row['age_group_id'] : null,
            $row['learning_level_override'] !== null ? (int)$row['learning_level_override'] : null
        );
        if ($resolved !== null) {
            $pdo->prepare('UPDATE children SET age_group_id = ? WHERE id = ?')->execute([$resolved, $childId]);
        }
    }
}
