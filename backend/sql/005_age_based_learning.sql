-- Age-based personalized learning foundation
USE alphabet_game;

-- Child profile enrichment
ALTER TABLE children
  ADD COLUMN date_of_birth DATE NULL AFTER birth_year,
  ADD COLUMN learning_level_override TINYINT NULL DEFAULT NULL AFTER age_group_id;

CREATE TABLE IF NOT EXISTS segment_age_map (
  segment_id    SMALLINT UNSIGNED NOT NULL,
  age_group_id  TINYINT UNSIGNED NOT NULL,
  placement     ENUM('recommended','explore','hidden') NOT NULL DEFAULT 'explore',
  sort_order    SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (segment_id, age_group_id),
  CONSTRAINT fk_sam_seg FOREIGN KEY (segment_id) REFERENCES learning_segments(id) ON DELETE CASCADE,
  CONSTRAINT fk_sam_age FOREIGN KEY (age_group_id) REFERENCES age_groups(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS category_age_map (
  subcategory_id INT UNSIGNED NOT NULL,
  age_group_id   TINYINT UNSIGNED NOT NULL,
  placement      ENUM('recommended','explore','hidden') NOT NULL DEFAULT 'explore',
  sort_order     SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (subcategory_id, age_group_id),
  CONSTRAINT fk_camap_sub FOREIGN KEY (subcategory_id) REFERENCES subcategories(id) ON DELETE CASCADE,
  CONSTRAINT fk_camap_age FOREIGN KEY (age_group_id) REFERENCES age_groups(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS activity_attempts (
  id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  child_id        INT UNSIGNED NOT NULL,
  content_id      INT UNSIGNED NULL,
  activity_code   VARCHAR(100) NOT NULL,
  score           SMALLINT NULL,
  max_score       SMALLINT NULL,
  correct_count   SMALLINT UNSIGNED NULL,
  incorrect_count SMALLINT UNSIGNED NULL,
  duration_sec    INT UNSIGNED NULL,
  meta_json       JSON NULL,
  started_at      TIMESTAMP NULL,
  completed_at    TIMESTAMP NULL,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  KEY idx_aa_child (child_id, created_at),
  CONSTRAINT fk_aa_child FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE,
  CONSTRAINT fk_aa_content FOREIGN KEY (content_id) REFERENCES content_items(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS concept_mastery (
  child_id       INT UNSIGNED NOT NULL,
  concept_code   VARCHAR(100) NOT NULL,
  mastery_score  TINYINT UNSIGNED NOT NULL DEFAULT 0,
  attempt_count  INT UNSIGNED NOT NULL DEFAULT 0,
  last_result    VARCHAR(20) NULL,
  updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (child_id, concept_code),
  CONSTRAINT fk_cm_child FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS child_learning_controls (
  child_id          INT UNSIGNED PRIMARY KEY,
  allow_explore     TINYINT(1) NOT NULL DEFAULT 1,
  allow_advanced    TINYINT(1) NOT NULL DEFAULT 0,
  max_difficulty    TINYINT UNSIGNED NOT NULL DEFAULT 3,
  settings_json     JSON NULL,
  updated_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_clc_child FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Draft segment age placements (approved product direction; curriculum tunable)
DELETE FROM segment_age_map;
INSERT INTO segment_age_map (segment_id, age_group_id, placement, sort_order) VALUES
-- Little Explorers (1)
(1,1,'recommended',1),(2,1,'recommended',2),(3,1,'explore',3),(4,1,'recommended',4),
(5,1,'recommended',5),(6,1,'recommended',6),(7,1,'explore',7),(8,1,'recommended',8),
(9,1,'explore',9),(10,1,'recommended',10),(11,1,'explore',11),(12,1,'hidden',12),(13,1,'hidden',13),
-- Curious Learners (2)
(1,2,'recommended',1),(2,2,'recommended',2),(3,2,'recommended',3),(4,2,'recommended',4),
(5,2,'recommended',5),(6,2,'recommended',6),(7,2,'recommended',7),(8,2,'recommended',8),
(9,2,'recommended',9),(10,2,'recommended',10),(11,2,'recommended',11),(12,2,'explore',12),(13,2,'explore',13),
-- Smart Learners (3)
(1,3,'recommended',1),(2,3,'recommended',2),(3,3,'recommended',3),(4,3,'recommended',4),
(5,3,'explore',5),(6,3,'explore',6),(7,3,'recommended',7),(8,3,'explore',8),
(9,3,'recommended',9),(10,3,'recommended',10),(11,3,'recommended',11),(12,3,'recommended',12),(13,3,'recommended',13),
-- Young Achievers (4)
(1,4,'recommended',1),(2,4,'recommended',2),(3,4,'recommended',3),(4,4,'explore',4),
(5,4,'explore',5),(6,4,'explore',6),(7,4,'recommended',7),(8,4,'explore',8),
(9,4,'recommended',9),(10,4,'explore',10),(11,4,'recommended',11),(12,4,'recommended',12),(13,4,'recommended',13);

-- Draft Numbers & Math category placements (segment 1 categories)
DELETE cam FROM category_age_map cam
  INNER JOIN subcategories sc ON sc.id = cam.subcategory_id
  WHERE sc.segment_id = 1;

INSERT INTO category_age_map (subcategory_id, age_group_id, placement, sort_order)
SELECT sc.id, ag.age_group_id, ag.placement, sc.sort_order
FROM subcategories sc
JOIN (
  SELECT 'number_recognition_number_sense' c, 1 age_group_id, 'recommended' placement UNION ALL
  SELECT 'number_recognition_number_sense', 2, 'recommended' UNION ALL
  SELECT 'number_recognition_number_sense', 3, 'explore' UNION ALL
  SELECT 'number_recognition_number_sense', 4, 'explore' UNION ALL
  SELECT 'counting_quantity', 1, 'recommended' UNION ALL
  SELECT 'counting_quantity', 2, 'recommended' UNION ALL
  SELECT 'counting_quantity', 3, 'explore' UNION ALL
  SELECT 'counting_quantity', 4, 'explore' UNION ALL
  SELECT 'number_tracing_writing', 1, 'recommended' UNION ALL
  SELECT 'number_tracing_writing', 2, 'recommended' UNION ALL
  SELECT 'number_tracing_writing', 3, 'explore' UNION ALL
  SELECT 'number_tracing_writing', 4, 'hidden' UNION ALL
  SELECT 'number_comparison', 1, 'explore' UNION ALL
  SELECT 'number_comparison', 2, 'recommended' UNION ALL
  SELECT 'number_comparison', 3, 'recommended' UNION ALL
  SELECT 'number_comparison', 4, 'explore' UNION ALL
  SELECT 'addition', 1, 'hidden' UNION ALL
  SELECT 'addition', 2, 'explore' UNION ALL
  SELECT 'addition', 3, 'recommended' UNION ALL
  SELECT 'addition', 4, 'recommended' UNION ALL
  SELECT 'subtraction', 1, 'hidden' UNION ALL
  SELECT 'subtraction', 2, 'explore' UNION ALL
  SELECT 'subtraction', 3, 'recommended' UNION ALL
  SELECT 'subtraction', 4, 'recommended' UNION ALL
  SELECT 'multiplication', 1, 'hidden' UNION ALL
  SELECT 'multiplication', 2, 'hidden' UNION ALL
  SELECT 'multiplication', 3, 'explore' UNION ALL
  SELECT 'multiplication', 4, 'recommended' UNION ALL
  SELECT 'division', 1, 'hidden' UNION ALL
  SELECT 'division', 2, 'hidden' UNION ALL
  SELECT 'division', 3, 'explore' UNION ALL
  SELECT 'division', 4, 'recommended' UNION ALL
  SELECT 'skip_counting', 1, 'hidden' UNION ALL
  SELECT 'skip_counting', 2, 'explore' UNION ALL
  SELECT 'skip_counting', 3, 'recommended' UNION ALL
  SELECT 'skip_counting', 4, 'recommended' UNION ALL
  SELECT 'number_patterns_sequences', 1, 'explore' UNION ALL
  SELECT 'number_patterns_sequences', 2, 'recommended' UNION ALL
  SELECT 'number_patterns_sequences', 3, 'recommended' UNION ALL
  SELECT 'number_patterns_sequences', 4, 'recommended' UNION ALL
  SELECT 'fractions', 1, 'hidden' UNION ALL
  SELECT 'fractions', 2, 'explore' UNION ALL
  SELECT 'fractions', 3, 'explore' UNION ALL
  SELECT 'fractions', 4, 'recommended' UNION ALL
  SELECT 'math_patterns_relationships', 1, 'hidden' UNION ALL
  SELECT 'math_patterns_relationships', 2, 'explore' UNION ALL
  SELECT 'math_patterns_relationships', 3, 'recommended' UNION ALL
  SELECT 'math_patterns_relationships', 4, 'recommended' UNION ALL
  SELECT 'basic_mathematical_logic', 1, 'explore' UNION ALL
  SELECT 'basic_mathematical_logic', 2, 'explore' UNION ALL
  SELECT 'basic_mathematical_logic', 3, 'recommended' UNION ALL
  SELECT 'basic_mathematical_logic', 4, 'recommended' UNION ALL
  SELECT 'intro_multiples_factors', 1, 'hidden' UNION ALL
  SELECT 'intro_multiples_factors', 2, 'hidden' UNION ALL
  SELECT 'intro_multiples_factors', 3, 'explore' UNION ALL
  SELECT 'intro_multiples_factors', 4, 'recommended' UNION ALL
  SELECT 'intro_decimals', 1, 'hidden' UNION ALL
  SELECT 'intro_decimals', 2, 'hidden' UNION ALL
  SELECT 'intro_decimals', 3, 'explore' UNION ALL
  SELECT 'intro_decimals', 4, 'recommended' UNION ALL
  SELECT 'place_value_number_system', 1, 'hidden' UNION ALL
  SELECT 'place_value_number_system', 2, 'explore' UNION ALL
  SELECT 'place_value_number_system', 3, 'recommended' UNION ALL
  SELECT 'place_value_number_system', 4, 'recommended'
) ag ON ag.c = sc.code
WHERE sc.segment_id = 1;
