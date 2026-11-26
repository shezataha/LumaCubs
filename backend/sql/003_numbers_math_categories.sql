-- Segment 01 – Numbers & Math: approved 16 main categories
-- Replaces Segment 01 placeholders only. Other segments untouched.
-- Subcategory topic shells intentionally empty until approved hierarchy is provided.

USE alphabet_game;

-- Add media columns if missing (run manually on older MariaDB if needed):
-- ALTER TABLE subcategories
--   ADD COLUMN illustration_uri VARCHAR(255) NULL AFTER is_active,
--   ADD COLUMN icon_uri VARCHAR(255) NULL AFTER illustration_uri,
--   ADD COLUMN accent_color VARCHAR(16) NULL AFTER icon_uri,
--   ADD COLUMN metadata_json JSON NULL AFTER accent_color;

CREATE TABLE IF NOT EXISTS content_links (
  id               BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  content_id       INT UNSIGNED NOT NULL,
  subcategory_id   INT UNSIGNED NULL,
  topic_id         INT UNSIGNED NULL,
  UNIQUE KEY uq_content_link (content_id, subcategory_id, topic_id),
  CONSTRAINT fk_cl_content FOREIGN KEY (content_id) REFERENCES content_items(id) ON DELETE CASCADE,
  CONSTRAINT fk_cl_sub FOREIGN KEY (subcategory_id) REFERENCES subcategories(id) ON DELETE CASCADE,
  CONSTRAINT fk_cl_topic FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Remove only Segment 01 placeholder categories (ids may vary; filter by segment)
DELETE st FROM subcategory_translations st
  INNER JOIN subcategories sc ON sc.id = st.subcategory_id
  WHERE sc.segment_id = 1;

DELETE FROM subcategories WHERE segment_id = 1;

INSERT INTO subcategories
  (segment_id, code, sort_order, is_active, illustration_uri, icon_uri, accent_color, metadata_json)
VALUES
(1, 'number_recognition_number_sense', 1,  1,
 'assets/segments/numbers-math/illustrations/number_recognition_number_sense.svg',
 'assets/segments/numbers-math/icons/number_recognition_number_sense.svg',
 '#FFD8C2',
 JSON_OBJECT('suitable_age_group_ids', JSON_ARRAY(1,2,3,4), 'intro_age_group_id', 1, 'number_range_min', NULL, 'number_range_max', NULL, 'formal_arithmetic', false)),
(1, 'counting_quantity', 2, 1,
 'assets/segments/numbers-math/illustrations/counting_quantity.svg',
 'assets/segments/numbers-math/icons/counting_quantity.svg',
 '#C8F0E0',
 JSON_OBJECT('suitable_age_group_ids', JSON_ARRAY(1,2,3,4), 'intro_age_group_id', 1, 'number_range_min', NULL, 'number_range_max', NULL, 'formal_arithmetic', false)),
(1, 'number_tracing_writing', 3, 1,
 'assets/segments/numbers-math/illustrations/number_tracing_writing.svg',
 'assets/segments/numbers-math/icons/number_tracing_writing.svg',
 '#E8D5F5',
 JSON_OBJECT('suitable_age_group_ids', JSON_ARRAY(1,2,3,4), 'intro_age_group_id', 1, 'number_range_min', NULL, 'number_range_max', NULL, 'formal_arithmetic', false)),
(1, 'number_comparison', 4, 1,
 'assets/segments/numbers-math/illustrations/number_comparison.svg',
 'assets/segments/numbers-math/icons/number_comparison.svg',
 '#A8D4F0',
 JSON_OBJECT('suitable_age_group_ids', JSON_ARRAY(2,3,4), 'intro_age_group_id', 2, 'number_range_min', NULL, 'number_range_max', NULL, 'formal_arithmetic', false)),
(1, 'addition', 5, 1,
 'assets/segments/numbers-math/illustrations/addition.svg',
 'assets/segments/numbers-math/icons/addition.svg',
 '#FFB4C8',
 JSON_OBJECT('suitable_age_group_ids', JSON_ARRAY(2,3,4), 'intro_age_group_id', 2, 'number_range_min', NULL, 'number_range_max', NULL, 'formal_arithmetic', true)),
(1, 'subtraction', 6, 1,
 'assets/segments/numbers-math/illustrations/subtraction.svg',
 'assets/segments/numbers-math/icons/subtraction.svg',
 '#F0A98A',
 JSON_OBJECT('suitable_age_group_ids', JSON_ARRAY(2,3,4), 'intro_age_group_id', 2, 'number_range_min', NULL, 'number_range_max', NULL, 'formal_arithmetic', true)),
(1, 'multiplication', 7, 1,
 'assets/segments/numbers-math/illustrations/multiplication.svg',
 'assets/segments/numbers-math/icons/multiplication.svg',
 '#B89AD9',
 JSON_OBJECT('suitable_age_group_ids', JSON_ARRAY(3,4), 'intro_age_group_id', 3, 'number_range_min', NULL, 'number_range_max', NULL, 'formal_arithmetic', true)),
(1, 'division', 8, 1,
 'assets/segments/numbers-math/illustrations/division.svg',
 'assets/segments/numbers-math/icons/division.svg',
 '#7ECDB5',
 JSON_OBJECT('suitable_age_group_ids', JSON_ARRAY(3,4), 'intro_age_group_id', 3, 'number_range_min', NULL, 'number_range_max', NULL, 'formal_arithmetic', true)),
(1, 'skip_counting', 9, 1,
 'assets/segments/numbers-math/illustrations/skip_counting.svg',
 'assets/segments/numbers-math/icons/skip_counting.svg',
 '#FFE29A',
 JSON_OBJECT('suitable_age_group_ids', JSON_ARRAY(2,3,4), 'intro_age_group_id', 2, 'number_range_min', NULL, 'number_range_max', NULL, 'formal_arithmetic', false)),
(1, 'number_patterns_sequences', 10, 1,
 'assets/segments/numbers-math/illustrations/number_patterns_sequences.svg',
 'assets/segments/numbers-math/icons/number_patterns_sequences.svg',
 '#C9B1E8',
 JSON_OBJECT('suitable_age_group_ids', JSON_ARRAY(2,3,4), 'intro_age_group_id', 2, 'number_range_min', NULL, 'number_range_max', NULL, 'formal_arithmetic', false)),
(1, 'fractions', 11, 1,
 'assets/segments/numbers-math/illustrations/fractions.svg',
 'assets/segments/numbers-math/icons/fractions.svg',
 '#FFC9A8',
 JSON_OBJECT('suitable_age_group_ids', JSON_ARRAY(3,4), 'intro_age_group_id', 3, 'number_range_min', NULL, 'number_range_max', NULL, 'formal_arithmetic', true)),
(1, 'math_patterns_relationships', 12, 1,
 'assets/segments/numbers-math/illustrations/math_patterns_relationships.svg',
 'assets/segments/numbers-math/icons/math_patterns_relationships.svg',
 '#A8E6CF',
 JSON_OBJECT('suitable_age_group_ids', JSON_ARRAY(3,4), 'intro_age_group_id', 3, 'number_range_min', NULL, 'number_range_max', NULL, 'formal_arithmetic', false)),
(1, 'basic_mathematical_logic', 13, 1,
 'assets/segments/numbers-math/illustrations/basic_mathematical_logic.svg',
 'assets/segments/numbers-math/icons/basic_mathematical_logic.svg',
 '#D4C4F0',
 JSON_OBJECT('suitable_age_group_ids', JSON_ARRAY(3,4), 'intro_age_group_id', 3, 'number_range_min', NULL, 'number_range_max', NULL, 'formal_arithmetic', false)),
(1, 'intro_multiples_factors', 14, 1,
 'assets/segments/numbers-math/illustrations/intro_multiples_factors.svg',
 'assets/segments/numbers-math/icons/intro_multiples_factors.svg',
 '#F6D6AE',
 JSON_OBJECT('suitable_age_group_ids', JSON_ARRAY(4), 'intro_age_group_id', 4, 'number_range_min', NULL, 'number_range_max', NULL, 'formal_arithmetic', true)),
(1, 'intro_decimals', 15, 1,
 'assets/segments/numbers-math/illustrations/intro_decimals.svg',
 'assets/segments/numbers-math/icons/intro_decimals.svg',
 '#F0D5E8',
 JSON_OBJECT('suitable_age_group_ids', JSON_ARRAY(4), 'intro_age_group_id', 4, 'number_range_min', NULL, 'number_range_max', NULL, 'formal_arithmetic', true)),
(1, 'place_value_number_system', 16, 1,
 'assets/segments/numbers-math/illustrations/place_value_number_system.svg',
 'assets/segments/numbers-math/icons/place_value_number_system.svg',
 '#B8E0D2',
 JSON_OBJECT('suitable_age_group_ids', JSON_ARRAY(3,4), 'intro_age_group_id', 3, 'number_range_min', NULL, 'number_range_max', NULL, 'formal_arithmetic', true));

-- English titles: exact approved names
INSERT INTO subcategory_translations (subcategory_id, lang_code, title, description)
SELECT id, 'en', title, description FROM (
  SELECT 'number_recognition_number_sense' AS code, 'Number Recognition & Number Sense' AS title, 'Spot, name, and understand numbers' AS description UNION ALL
  SELECT 'counting_quantity', 'Counting & Quantity', 'Count objects and build quantity sense' UNION ALL
  SELECT 'number_tracing_writing', 'Number Tracing & Writing', 'Trace and write numbers with care' UNION ALL
  SELECT 'number_comparison', 'Number Comparison', 'Compare numbers: more, less, and equal' UNION ALL
  SELECT 'addition', 'Addition', 'Put groups together to make more' UNION ALL
  SELECT 'subtraction', 'Subtraction', 'Take away and find what is left' UNION ALL
  SELECT 'multiplication', 'Multiplication', 'Make equal groups again and again' UNION ALL
  SELECT 'division', 'Division', 'Share equally into fair groups' UNION ALL
  SELECT 'skip_counting', 'Skip Counting', 'Count in steps like 2s, 5s, and 10s' UNION ALL
  SELECT 'number_patterns_sequences', 'Number Patterns & Sequences', 'Find what comes next in a number path' UNION ALL
  SELECT 'fractions', 'Fractions', 'Explore parts of a whole' UNION ALL
  SELECT 'math_patterns_relationships', 'Mathematical Patterns & Relationships', 'See how numbers connect and relate' UNION ALL
  SELECT 'basic_mathematical_logic', 'Basic Mathematical Logic', 'Solve gentle number puzzles and reason' UNION ALL
  SELECT 'intro_multiples_factors', 'Introduction to Multiples & Factors', 'Discover multiples and factors' UNION ALL
  SELECT 'intro_decimals', 'Introduction to Decimals', 'Meet numbers with a decimal point' UNION ALL
  SELECT 'place_value_number_system', 'Place Value & Number System', 'Ones, tens, hundreds, and number value'
) x
JOIN subcategories sc ON sc.code = x.code AND sc.segment_id = 1;

INSERT INTO subcategory_translations (subcategory_id, lang_code, title, description)
SELECT id, 'ur', title, description FROM (
  SELECT 'number_recognition_number_sense' AS code, 'نمبر کی پہچان اور سمجھ' AS title, 'نمبر دیکھیں، نام لیں اور سمجھیں' AS description UNION ALL
  SELECT 'counting_quantity', 'گنتی اور مقدار', 'اشیاء گنیں اور مقدار سمجھیں' UNION ALL
  SELECT 'number_tracing_writing', 'نمبر لکھائی اور ٹریس', 'نمبر ٹریس کریں اور لکھیں' UNION ALL
  SELECT 'number_comparison', 'نمبر کا موازنہ', 'زیادہ، کم اور برابر' UNION ALL
  SELECT 'addition', 'جمع', 'گروپوں کو اکٹھا کریں' UNION ALL
  SELECT 'subtraction', 'تفریق', 'گھٹائیں اور باقی معلوم کریں' UNION ALL
  SELECT 'multiplication', 'ضرب', 'برابر گروپ بنائیں' UNION ALL
  SELECT 'division', 'تقسیم', 'برابر بانٹیں' UNION ALL
  SELECT 'skip_counting', 'چھوڑ کر گنتی', '۲، ۵، ۱۰ کے قدم' UNION ALL
  SELECT 'number_patterns_sequences', 'نمبر پیٹرن اور ترتیب', 'اگلا نمبر تلاش کریں' UNION ALL
  SELECT 'fractions', 'کسر', 'پورے کے حصے' UNION ALL
  SELECT 'math_patterns_relationships', 'ریاضی تعلقات', 'نمبر کیسے جڑتے ہیں' UNION ALL
  SELECT 'basic_mathematical_logic', 'بنیادی ریاضی منطق', 'نرم نمبر پہیلیاں' UNION ALL
  SELECT 'intro_multiples_factors', 'مضارب اور عوامل کا تعارف', 'مضارب اور عوامل' UNION ALL
  SELECT 'intro_decimals', 'اعشاریہ کا تعارف', 'اعشاریہ نمبر' UNION ALL
  SELECT 'place_value_number_system', 'مقامی قدر', 'اکائی، دھائی، سیکڑہ'
) x
JOIN subcategories sc ON sc.code = x.code AND sc.segment_id = 1;

INSERT INTO subcategory_translations (subcategory_id, lang_code, title, description)
SELECT id, 'ar', title, description FROM (
  SELECT 'number_recognition_number_sense' AS code, 'التعرّف على الأعداد والإحساس بها' AS title, 'لاحظ الأعداد وسمِّها وافهمها' AS description UNION ALL
  SELECT 'counting_quantity', 'العد والكمية', 'عُد الأشياء وابنِ حس الكمية' UNION ALL
  SELECT 'number_tracing_writing', 'تتبع الأعداد وكتابتها', 'تتبّع الأعداد واكتبها بعناية' UNION ALL
  SELECT 'number_comparison', 'مقارنة الأعداد', 'أكثر وأقل ويساوي' UNION ALL
  SELECT 'addition', 'الجمع', 'اجمع المجموعات معًا' UNION ALL
  SELECT 'subtraction', 'الطرح', 'أزل واعرف ما تبقّى' UNION ALL
  SELECT 'multiplication', 'الضرب', 'كوّن مجموعات متساوية' UNION ALL
  SELECT 'division', 'القسمة', 'وزّع بالتساوي' UNION ALL
  SELECT 'skip_counting', 'العد القفزي', 'عُد بخطوات مثل 2 و5 و10' UNION ALL
  SELECT 'number_patterns_sequences', 'أنماط الأعداد والتسلسل', 'اكتشف العدد التالي' UNION ALL
  SELECT 'fractions', 'الكسور', 'استكشف أجزاء الكل' UNION ALL
  SELECT 'math_patterns_relationships', 'الأنماط والعلاقات الرياضية', 'اكتشف روابط الأعداد' UNION ALL
  SELECT 'basic_mathematical_logic', 'المنطق الرياضي الأساسي', 'أحجيات أعداد لطيفة' UNION ALL
  SELECT 'intro_multiples_factors', 'مقدمة في المضاعفات والعوامل', 'تعرّف إلى المضاعفات والعوامل' UNION ALL
  SELECT 'intro_decimals', 'مقدمة في الأعداد العشرية', 'تعرّف إلى الفاصلة العشرية' UNION ALL
  SELECT 'place_value_number_system', 'القيمة المنزلية ونظام الأعداد', 'الآحاد والعشرات والمئات'
) x
JOIN subcategories sc ON sc.code = x.code AND sc.segment_id = 1;