<?php
declare(strict_types=1);

namespace LumaCubs;

use DateTimeImmutable;
use PDO;

/**
 * Master age-group structure (FINAL — do not change without explicit approval):
 * 1) Little Explorers  — 2 to under 4 years
 * 2) Curious Learners  — 4 to under 6 years
 * 3) Smart Achievers   — 6 to 8 years
 */
final class AgeService
{
    public const GROUP_LITTLE_EXPLORERS = 1;
    public const GROUP_CURIOUS_LEARNERS = 2;
    public const GROUP_SMART_ACHIEVERS = 3;

    public const MASTER_GROUPS = [
        self::GROUP_LITTLE_EXPLORERS => [
            'id' => self::GROUP_LITTLE_EXPLORERS,
            'code' => 'little_explorers',
            'label' => 'Little Explorers',
            'display_ages' => '2–4 Years',
            'age_min_inclusive' => 2,
            'age_max_exclusive' => 4,
        ],
        self::GROUP_CURIOUS_LEARNERS => [
            'id' => self::GROUP_CURIOUS_LEARNERS,
            'code' => 'curious_learners',
            'label' => 'Curious Learners',
            'display_ages' => '4–6 Years',
            'age_min_inclusive' => 4,
            'age_max_exclusive' => 6,
        ],
        self::GROUP_SMART_ACHIEVERS => [
            'id' => self::GROUP_SMART_ACHIEVERS,
            'code' => 'smart_achievers',
            'label' => 'Smart Achievers',
            'display_ages' => '6–8 Years',
            'age_min_inclusive' => 6,
            'age_max_exclusive' => 9, // inclusive through age 8
        ],
    ];

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

    /**
     * Non-overlapping assignment by completed years of age:
     * - under 4 → Little Explorers (also maps 0–1 safely to earliest stage)
     * - 4–5 → Curious Learners
     * - 6–8 (+ older capped) → Smart Achievers
     */
    public static function ageGroupIdForAge(?int $age): ?int
    {
        if ($age === null || $age < 0) {
            return null;
        }
        if ($age < 4) {
            return self::GROUP_LITTLE_EXPLORERS;
        }
        if ($age < 6) {
            return self::GROUP_CURIOUS_LEARNERS;
        }
        return self::GROUP_SMART_ACHIEVERS;
    }

    public static function resolveAgeGroupId(?string $dob, ?int $explicitAgeGroupId, ?int $overrideLevel = null): ?int
    {
        $fromDob = self::ageGroupIdForAge(self::ageFromDob($dob));
        // DOB is source of truth when present; otherwise use stored/explicit id.
        $base = $fromDob ?? $explicitAgeGroupId;
        if ($base === null) {
            return null;
        }
        // Legacy id 4 (retired Young Achievers) maps into Smart Achievers.
        if ($base === 4) {
            $base = self::GROUP_SMART_ACHIEVERS;
        }
        $base = max(self::GROUP_LITTLE_EXPLORERS, min(self::GROUP_SMART_ACHIEVERS, $base));
        if ($overrideLevel === null || $overrideLevel === 0) {
            return $base;
        }
        $shifted = $base + (int)$overrideLevel;
        return max(self::GROUP_LITTLE_EXPLORERS, min(self::GROUP_SMART_ACHIEVERS, $shifted));
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
        if ($resolved !== null && isset(self::MASTER_GROUPS[$resolved])) {
            $meta = self::MASTER_GROUPS[$resolved];
            $row['age_group_code'] = $meta['code'];
            $row['age_group_label'] = $meta['label'];
            $row['age_group_display_ages'] = $meta['display_ages'];
        }
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
