-- English Language & Literacy subcategory illustrations (Little Explorers theme)
USE alphabet_game;

UPDATE subcategories
SET illustration_uri = 'assets/home/little-explorers/english-literacy/subcategories/alphabet_letters.jpg',
    icon_uri = 'assets/home/little-explorers/english-literacy/subcategories/alphabet_letters.jpg',
    accent_color = '#A8D4F0'
WHERE code = 'alphabet_letters' AND segment_id = 2;

UPDATE subcategories
SET illustration_uri = 'assets/home/little-explorers/english-literacy/subcategories/phonics_sounds.jpg',
    icon_uri = 'assets/home/little-explorers/english-literacy/subcategories/phonics_sounds.jpg',
    accent_color = '#C8F0E0'
WHERE code = 'phonics_sounds' AND segment_id = 2;

UPDATE subcategories
SET illustration_uri = 'assets/home/little-explorers/english-literacy/subcategories/sight_words.jpg',
    icon_uri = 'assets/home/little-explorers/english-literacy/subcategories/sight_words.jpg',
    accent_color = '#FFD8C2'
WHERE code = 'sight_words' AND segment_id = 2;

UPDATE subcategories
SET illustration_uri = 'assets/home/little-explorers/english-literacy/subcategories/listening_speaking.jpg',
    icon_uri = 'assets/home/little-explorers/english-literacy/subcategories/listening_speaking.jpg',
    accent_color = '#FFE29A'
WHERE code = 'listening_speaking' AND segment_id = 2;

UPDATE subcategories
SET illustration_uri = 'assets/home/little-explorers/english-literacy/subcategories/early_reading.jpg',
    icon_uri = 'assets/home/little-explorers/english-literacy/subcategories/early_reading.jpg',
    accent_color = '#E8D5F5'
WHERE code = 'early_reading' AND segment_id = 2;
