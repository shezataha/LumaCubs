-- LumaCubs MASTER age-group structure (FINAL)
-- 1 Little Explorers  — 2 to under 4
-- 2 Curious Learners  — 4 to under 6
-- 3 Smart Achievers   — 6 to 8
-- Do not add/rename/split groups without explicit approval.
USE alphabet_game;

-- Move any legacy Young Achievers (id 4) children into Smart Achievers (id 3)
UPDATE children SET age_group_id = 3 WHERE age_group_id = 4;

-- Drop legacy map rows for retired group 4 (content stays; only age placement rows)
DELETE FROM segment_age_map WHERE age_group_id = 4;
DELETE FROM category_age_map WHERE age_group_id = 4;
DELETE FROM content_age_map WHERE age_group_id = 4;

-- Remove retired age group
DELETE FROM age_groups WHERE id = 4;

-- Lock the three master groups
UPDATE age_groups
SET code = 'little_explorers',
    label = 'Little Explorers',
    age_min = 2,
    age_max = 3,
    sort_order = 1
WHERE id = 1;

UPDATE age_groups
SET code = 'curious_learners',
    label = 'Curious Learners',
    age_min = 4,
    age_max = 5,
    sort_order = 2
WHERE id = 2;

UPDATE age_groups
SET code = 'smart_achievers',
    label = 'Smart Achievers',
    age_min = 6,
    age_max = 8,
    sort_order = 3
WHERE id = 3;

-- Ensure rows exist even on fresh DBs that somehow skipped seeds
INSERT INTO age_groups (id, code, label, age_min, age_max, sort_order) VALUES
  (1, 'little_explorers', 'Little Explorers', 2, 3, 1),
  (2, 'curious_learners', 'Curious Learners', 4, 5, 2),
  (3, 'smart_achievers',  'Smart Achievers',  6, 8, 3)
ON DUPLICATE KEY UPDATE
  code = VALUES(code),
  label = VALUES(label),
  age_min = VALUES(age_min),
  age_max = VALUES(age_max),
  sort_order = VALUES(sort_order);
