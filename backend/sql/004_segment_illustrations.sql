-- Add illustration paths for the 13 learning segments.
-- Clears corrupted emoji icon placeholders (????).

USE alphabet_game;

-- ALTER TABLE learning_segments
--   ADD COLUMN illustration_uri VARCHAR(255) NULL AFTER icon,
--   ADD COLUMN icon_uri VARCHAR(255) NULL AFTER illustration_uri;

UPDATE learning_segments SET
  illustration_uri = CONCAT('assets/segments/illustrations/', code, '.svg'),
  icon_uri = CONCAT('assets/segments/icons/', code, '.svg'),
  icon = NULL
WHERE is_active = 1;
