# LumaCubs — Master Age-Group Structure (FINAL)

**Do not change this architecture without explicit approval.**

## The three age groups

| ID | Code | Label | Internal assignment | Display |
|----|------|-------|---------------------|---------|
| 1 | `little_explorers` | Little Explorers | 2 to under 4 years | 2–4 Years |
| 2 | `curious_learners` | Curious Learners | 4 to under 6 years | 4–6 Years |
| 3 | `smart_achievers` | Smart Achievers | 6 to 8 years | 6–8 Years |

## Rules

- Never create additional age groups.
- Never rename these groups.
- Never split them into smaller sections.
- Never replace them with alternative age ranges.
- Assignment must be **non-overlapping** (completed years of age).
- All dashboards, segments, categories, activities, and recommendations must follow this structure.
- Only **learning content within** each age group may evolve after review and approval.

## Implementation pointers

- PHP: `backend/src/AgeService.php` (`MASTER_GROUPS`, `ageGroupIdForAge`)
- Frontend: `MASTER_AGE_GROUPS` in `game.js`
- SQL lock/migration: `backend/sql/006_master_age_groups.sql`
- Legacy id `4` (Young Achievers) is retired and maps into Smart Achievers
