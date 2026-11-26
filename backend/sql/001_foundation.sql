-- LumaCubs backend foundation schema (MariaDB / MySQL)
-- Safe to run on existing alphabet_game database.
-- Preserves legacy tables: users, password_resets, user_favorites, user_progress

USE alphabet_game;

-- ---------- reference data ----------

CREATE TABLE IF NOT EXISTS age_groups (
  id          TINYINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code        VARCHAR(32)  NOT NULL UNIQUE,
  label       VARCHAR(80)  NOT NULL,
  age_min     TINYINT UNSIGNED NOT NULL,
  age_max     TINYINT UNSIGNED NOT NULL,
  sort_order  TINYINT UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS languages (
  code        CHAR(5)      NOT NULL PRIMARY KEY,
  label       VARCHAR(60)  NOT NULL,
  direction   ENUM('ltr','rtl') NOT NULL DEFAULT 'ltr',
  is_active   TINYINT(1)   NOT NULL DEFAULT 1
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS learning_segments (
  id          SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code        VARCHAR(64)  NOT NULL UNIQUE,
  sort_order  SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  icon        VARCHAR(16)  NULL,
  is_active   TINYINT(1)   NOT NULL DEFAULT 1,
  created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS learning_segment_translations (
  segment_id  SMALLINT UNSIGNED NOT NULL,
  lang_code   CHAR(5)      NOT NULL,
  title       VARCHAR(160) NOT NULL,
  description TEXT         NULL,
  PRIMARY KEY (segment_id, lang_code),
  CONSTRAINT fk_seg_tr_seg FOREIGN KEY (segment_id) REFERENCES learning_segments(id) ON DELETE CASCADE,
  CONSTRAINT fk_seg_tr_lang FOREIGN KEY (lang_code) REFERENCES languages(code)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS subcategories (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  segment_id  SMALLINT UNSIGNED NOT NULL,
  code        VARCHAR(64)  NOT NULL,
  sort_order  SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  is_active   TINYINT(1)   NOT NULL DEFAULT 1,
  UNIQUE KEY uq_subcat (segment_id, code),
  CONSTRAINT fk_subcat_seg FOREIGN KEY (segment_id) REFERENCES learning_segments(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS subcategory_translations (
  subcategory_id INT UNSIGNED NOT NULL,
  lang_code      CHAR(5)      NOT NULL,
  title          VARCHAR(160) NOT NULL,
  description    TEXT         NULL,
  PRIMARY KEY (subcategory_id, lang_code),
  CONSTRAINT fk_sub_tr_sub FOREIGN KEY (subcategory_id) REFERENCES subcategories(id) ON DELETE CASCADE,
  CONSTRAINT fk_sub_tr_lang FOREIGN KEY (lang_code) REFERENCES languages(code)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS topics (
  id               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  subcategory_id   INT UNSIGNED NOT NULL,
  code             VARCHAR(80)  NOT NULL,
  sort_order       SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  is_active        TINYINT(1)   NOT NULL DEFAULT 1,
  UNIQUE KEY uq_topic (subcategory_id, code),
  CONSTRAINT fk_topic_sub FOREIGN KEY (subcategory_id) REFERENCES subcategories(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS topic_translations (
  topic_id    INT UNSIGNED NOT NULL,
  lang_code   CHAR(5)      NOT NULL,
  title       VARCHAR(160) NOT NULL,
  description TEXT         NULL,
  PRIMARY KEY (topic_id, lang_code),
  CONSTRAINT fk_topic_tr_topic FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE,
  CONSTRAINT fk_topic_tr_lang FOREIGN KEY (lang_code) REFERENCES languages(code)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS content_items (
  id               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  topic_id         INT UNSIGNED NULL,
  subcategory_id   INT UNSIGNED NULL,
  segment_id       SMALLINT UNSIGNED NOT NULL,
  content_type     VARCHAR(40)  NOT NULL DEFAULT 'activity',
  code             VARCHAR(100) NOT NULL,
  difficulty       TINYINT UNSIGNED NOT NULL DEFAULT 1,
  estimated_minutes TINYINT UNSIGNED NULL,
  media_uri        VARCHAR(255) NULL,
  metadata_json    JSON         NULL,
  is_published     TINYINT(1)   NOT NULL DEFAULT 0,
  created_at       TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_content_code (code),
  KEY idx_content_segment (segment_id),
  CONSTRAINT fk_content_seg FOREIGN KEY (segment_id) REFERENCES learning_segments(id),
  CONSTRAINT fk_content_sub FOREIGN KEY (subcategory_id) REFERENCES subcategories(id) ON DELETE SET NULL,
  CONSTRAINT fk_content_topic FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS content_translations (
  content_id  INT UNSIGNED NOT NULL,
  lang_code   CHAR(5)      NOT NULL,
  title       VARCHAR(200) NOT NULL,
  summary     TEXT         NULL,
  body_json   JSON         NULL,
  PRIMARY KEY (content_id, lang_code),
  CONSTRAINT fk_ct_content FOREIGN KEY (content_id) REFERENCES content_items(id) ON DELETE CASCADE,
  CONSTRAINT fk_ct_lang FOREIGN KEY (lang_code) REFERENCES languages(code)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS content_age_map (
  content_id    INT UNSIGNED NOT NULL,
  age_group_id  TINYINT UNSIGNED NOT NULL,
  PRIMARY KEY (content_id, age_group_id),
  CONSTRAINT fk_cam_content FOREIGN KEY (content_id) REFERENCES content_items(id) ON DELETE CASCADE,
  CONSTRAINT fk_cam_age FOREIGN KEY (age_group_id) REFERENCES age_groups(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------- accounts ----------

CREATE TABLE IF NOT EXISTS parents (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email         VARCHAR(120) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  display_name  VARCHAR(80)  NOT NULL,
  legacy_user_id INT         NULL,
  created_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_parents_legacy (legacy_user_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS parent_sessions (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  parent_id   INT UNSIGNED NOT NULL,
  token_hash  CHAR(64)     NOT NULL UNIQUE,
  expires_at  DATETIME     NOT NULL,
  created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_ps_parent FOREIGN KEY (parent_id) REFERENCES parents(id) ON DELETE CASCADE,
  KEY idx_ps_expires (expires_at)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  parent_id   INT UNSIGNED NOT NULL,
  token_hash  CHAR(64)     NOT NULL UNIQUE,
  expires_at  DATETIME     NOT NULL,
  used_at     DATETIME     NULL,
  created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_prt_parent FOREIGN KEY (parent_id) REFERENCES parents(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS children (
  id                  INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  parent_id           INT UNSIGNED NOT NULL,
  display_name        VARCHAR(60)  NOT NULL,
  avatar              VARCHAR(16)  NOT NULL DEFAULT 'cub',
  age_group_id        TINYINT UNSIGNED NULL,
  preferred_language  CHAR(5)      NOT NULL DEFAULT 'en',
  birth_year          SMALLINT UNSIGNED NULL,
  is_active           TINYINT(1)   NOT NULL DEFAULT 1,
  created_at          TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  updated_at          TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_child_parent FOREIGN KEY (parent_id) REFERENCES parents(id) ON DELETE CASCADE,
  CONSTRAINT fk_child_age FOREIGN KEY (age_group_id) REFERENCES age_groups(id) ON DELETE SET NULL,
  CONSTRAINT fk_child_lang FOREIGN KEY (preferred_language) REFERENCES languages(code)
) ENGINE=InnoDB;

-- ---------- progress & rewards ----------

CREATE TABLE IF NOT EXISTS child_progress (
  id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  child_id        INT UNSIGNED NOT NULL,
  content_id      INT UNSIGNED NULL,
  activity_code   VARCHAR(100) NOT NULL,
  status          ENUM('started','completed','mastered') NOT NULL DEFAULT 'started',
  score           SMALLINT NULL,
  time_spent_sec  INT UNSIGNED NULL,
  meta_json       JSON NULL,
  started_at      TIMESTAMP NULL,
  completed_at    TIMESTAMP NULL,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_child_activity (child_id, activity_code),
  CONSTRAINT fk_cp_child FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE,
  CONSTRAINT fk_cp_content FOREIGN KEY (content_id) REFERENCES content_items(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS progress_events (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  child_id      INT UNSIGNED NOT NULL,
  activity_code VARCHAR(100) NOT NULL,
  event_type    VARCHAR(40)  NOT NULL,
  payload_json  JSON NULL,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  KEY idx_pe_child (child_id, created_at),
  CONSTRAINT fk_pe_child FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS achievements (
  id          SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code        VARCHAR(64) NOT NULL UNIQUE,
  icon        VARCHAR(16) NULL,
  points      SMALLINT UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS achievement_translations (
  achievement_id SMALLINT UNSIGNED NOT NULL,
  lang_code      CHAR(5) NOT NULL,
  title          VARCHAR(120) NOT NULL,
  description    TEXT NULL,
  PRIMARY KEY (achievement_id, lang_code),
  CONSTRAINT fk_ach_tr_ach FOREIGN KEY (achievement_id) REFERENCES achievements(id) ON DELETE CASCADE,
  CONSTRAINT fk_ach_tr_lang FOREIGN KEY (lang_code) REFERENCES languages(code)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS child_achievements (
  child_id       INT UNSIGNED NOT NULL,
  achievement_id SMALLINT UNSIGNED NOT NULL,
  earned_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (child_id, achievement_id),
  CONSTRAINT fk_ca_child FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE,
  CONSTRAINT fk_ca_ach FOREIGN KEY (achievement_id) REFERENCES achievements(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS rewards (
  id          SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code        VARCHAR(64) NOT NULL UNIQUE,
  reward_type VARCHAR(40) NOT NULL DEFAULT 'sticker',
  icon        VARCHAR(16) NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS reward_translations (
  reward_id   SMALLINT UNSIGNED NOT NULL,
  lang_code   CHAR(5) NOT NULL,
  title       VARCHAR(120) NOT NULL,
  description TEXT NULL,
  PRIMARY KEY (reward_id, lang_code),
  CONSTRAINT fk_rw_tr_rw FOREIGN KEY (reward_id) REFERENCES rewards(id) ON DELETE CASCADE,
  CONSTRAINT fk_rw_tr_lang FOREIGN KEY (lang_code) REFERENCES languages(code)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS child_rewards (
  id         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  child_id   INT UNSIGNED NOT NULL,
  reward_id  SMALLINT UNSIGNED NOT NULL,
  qty        INT UNSIGNED NOT NULL DEFAULT 1,
  earned_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_child_reward (child_id, reward_id),
  CONSTRAINT fk_cr_child FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE,
  CONSTRAINT fk_cr_reward FOREIGN KEY (reward_id) REFERENCES rewards(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------- settings ----------

CREATE TABLE IF NOT EXISTS parent_settings (
  parent_id   INT UNSIGNED PRIMARY KEY,
  settings_json JSON NOT NULL,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_pset_parent FOREIGN KEY (parent_id) REFERENCES parents(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS child_settings (
  child_id    INT UNSIGNED PRIMARY KEY,
  settings_json JSON NOT NULL,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_cset_child FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------- seeds ----------

INSERT IGNORE INTO age_groups (id, code, label, age_min, age_max, sort_order) VALUES
  (1, 'little_explorers',  'Little Explorers',  2, 3, 1),
  (2, 'curious_learners',  'Curious Learners',  4, 5, 2),
  (3, 'smart_learners',    'Smart Learners',    6, 7, 3),
  (4, 'young_achievers',   'Young Achievers',   8, 8, 4);

INSERT IGNORE INTO languages (code, label, direction, is_active) VALUES
  ('en', 'English', 'ltr', 1),
  ('ur', 'Urdu',    'rtl', 1),
  ('ar', 'Arabic',  'rtl', 1);

INSERT IGNORE INTO learning_segments (id, code, sort_order, icon, is_active) VALUES
  (1,  'numbers_math',              1,  '🔢', 1),
  (2,  'english_literacy',          2,  '🔤', 1),
  (3,  'urdu_literacy',             3,  '📝', 1),
  (4,  'world_around_us',           4,  '🌍', 1),
  (5,  'colors_shapes_patterns',    5,  '🎨', 1),
  (6,  'music_rhymes_movement',     6,  '🎵', 1),
  (7,  'games_brain_play',          7,  '🧠', 1),
  (8,  'creativity_art',            8,  '✏️', 1),
  (9,  'basic_islamic_studies',     9,  '🌙', 1),
  (10, 'life_skills_discovery',    10,  '🌱', 1),
  (11, 'science_nature',           11,  '🔬', 1),
  (12, 'digital_world_technology', 12,  '💻', 1),
  (13, 'everyday_math_money',      13,  '💰', 1);

INSERT IGNORE INTO learning_segment_translations (segment_id, lang_code, title, description) VALUES
  (1,  'en', 'Numbers & Math', 'Counting, number sense, and early math'),
  (2,  'en', 'English Language & Literacy', 'Letters, phonics, words, and reading readiness'),
  (3,  'en', 'Urdu Language & Literacy', 'Urdu letters, sounds, and early reading'),
  (4,  'en', 'World Around Us', 'People, places, community, and everyday life'),
  (5,  'en', 'Colors, Shapes & Patterns', 'Visual discrimination and early geometry'),
  (6,  'en', 'Music, Rhymes & Movement', 'Songs, rhythm, and active play'),
  (7,  'en', 'Games & Brain Play', 'Memory, puzzles, and thinking games'),
  (8,  'en', 'Creativity & Art', 'Drawing, coloring, and creative expression'),
  (9,  'en', 'Basic Islamic Studies', 'Age-appropriate faith and values learning'),
  (10, 'en', 'Life Skills & Discovery', 'Independence, routines, and discovery'),
  (11, 'en', 'Science & Nature', 'Curiosity about living things and the natural world'),
  (12, 'en', 'Digital World & Technology', 'Safe, guided early digital literacy'),
  (13, 'en', 'Everyday Mathematics & Money Skills', 'Practical math for daily life');

INSERT IGNORE INTO learning_segment_translations (segment_id, lang_code, title, description) VALUES
  (1,  'ur', 'نمبر اور ریاضی', NULL),
  (2,  'ur', 'انگریزی زبان و خواندگی', NULL),
  (3,  'ur', 'اردو زبان و خواندگی', NULL),
  (4,  'ur', 'ہمارا ارد گرد', NULL),
  (5,  'ur', 'رنگ، شکلیں اور پیٹرن', NULL),
  (6,  'ur', 'موسیقی، نظمیں اور حرکت', NULL),
  (7,  'ur', 'کھیل اور ذہنی مشق', NULL),
  (8,  'ur', 'تخلیق اور آرٹ', NULL),
  (9,  'ur', 'بنیادی اسلامی تعلیم', NULL),
  (10, 'ur', 'زندگی کی مہارتیں', NULL),
  (11, 'ur', 'سائنس اور فطرت', NULL),
  (12, 'ur', 'ڈیجیٹل دنیا', NULL),
  (13, 'ur', 'روزمرہ ریاضی اور پیسے', NULL);

INSERT IGNORE INTO learning_segment_translations (segment_id, lang_code, title, description) VALUES
  (1,  'ar', 'الأرقام والرياضيات', NULL),
  (2,  'ar', 'اللغة الإنجليزية والقراءة', NULL),
  (3,  'ar', 'اللغة الأردية والقراءة', NULL),
  (4,  'ar', 'العالم من حولنا', NULL),
  (5,  'ar', 'الألوان والأشكال والأنماط', NULL),
  (6,  'ar', 'الموسيقى والأناشيد والحركة', NULL),
  (7,  'ar', 'الألعاب وتنمية التفكير', NULL),
  (8,  'ar', 'الإبداع والفن', NULL),
  (9,  'ar', 'دراسات إسلامية أساسية', NULL),
  (10, 'ar', 'مهارات الحياة والاكتشاف', NULL),
  (11, 'ar', 'العلوم والطبيعة', NULL),
  (12, 'ar', 'العالم الرقمي والتكنولوجيا', NULL),
  (13, 'ar', 'رياضيات الحياة اليومية والنقود', NULL);