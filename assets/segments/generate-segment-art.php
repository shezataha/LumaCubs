<?php
declare(strict_types=1);

$root = __DIR__;
$illDir = $root . '/illustrations';
$iconDir = $root . '/icons';
@mkdir($illDir, 0777, true);
@mkdir($iconDir, 0777, true);

function svg(string $body, int $w, int $h): string
{
    return '<?xml version="1.0" encoding="UTF-8"?>' . "\n"
        . '<svg xmlns="http://www.w3.org/2000/svg" width="' . $w . '" height="' . $h . '" viewBox="0 0 ' . $w . ' ' . $h . '" fill="none">'
        . $body . '</svg>';
}

function bg(string $id, string $c1, string $c2, int $w = 480, int $h = 360): string
{
    return "<defs><linearGradient id='{$id}' x1='0' y1='0' x2='1' y2='1'>"
        . "<stop offset='0%' stop-color='{$c1}'/><stop offset='100%' stop-color='{$c2}'/></linearGradient></defs>"
        . "<rect width='{$w}' height='{$h}' rx='36' fill='url(#{$id})'/>";
}

function soft(string $cx, string $cy, string $r, string $fill): string
{
    return "<circle cx='{$cx}' cy='{$cy}' r='{$r}' fill='{$fill}' opacity='0.2'/>";
}

$segments = [
    'numbers_math' => [
        'c1' => '#FFF8F0', 'c2' => '#FFD8C2', 'a' => '#FF8F6B',
        'ill' => function ($a) {
            return soft('420', '50', '60', $a)
                . "<rect x='80' y='110' width='70' height='70' rx='18' fill='#FFB4A2'/>"
                . "<text x='115' y='158' text-anchor='middle' font-family='Nunito,Arial,sans-serif' font-size='34' font-weight='800' fill='#5C4F6E'>1</text>"
                . "<rect x='175' y='140' width='70' height='70' rx='18' fill='#A8E6CF'/>"
                . "<text x='210' y='188' text-anchor='middle' font-family='Nunito,Arial,sans-serif' font-size='34' font-weight='800' fill='#5C4F6E'>2</text>"
                . "<rect x='270' y='110' width='70' height='70' rx='18' fill='#C9B1E8'/>"
                . "<text x='305' y='158' text-anchor='middle' font-family='Nunito,Arial,sans-serif' font-size='34' font-weight='800' fill='#5C4F6E'>3</text>"
                . "<circle cx='380' cy='240' r='28' fill='#FFE29A'/>"
                . "<circle cx='120' cy='250' r='22' fill='#A8D4F0'/>";
        },
        'icon' => function ($a) {
            return "<rect width='128' height='128' rx='28' fill='#FFD8C2'/>"
                . "<rect x='22' y='40' width='36' height='36' rx='10' fill='#FFB4A2'/>"
                . "<text x='40' y='66' text-anchor='middle' font-family='Nunito,Arial,sans-serif' font-size='18' font-weight='800' fill='#5C4F6E'>1</text>"
                . "<rect x='70' y='52' width='36' height='36' rx='10' fill='#A8E6CF'/>"
                . "<text x='88' y='78' text-anchor='middle' font-family='Nunito,Arial,sans-serif' font-size='18' font-weight='800' fill='#5C4F6E'>2</text>";
        },
    ],
    'english_literacy' => [
        'c1' => '#F3F8FF', 'c2' => '#A8D4F0', 'a' => '#4F9BC8',
        'ill' => function ($a) {
            return soft('60', '60', '50', $a)
                . "<rect x='100' y='90' width='160' height='200' rx='18' fill='#fff' stroke='{$a}' stroke-width='6'/>"
                . "<rect x='120' y='120' width='120' height='14' rx='7' fill='#C9B1E8'/>"
                . "<rect x='120' y='150' width='100' height='14' rx='7' fill='#FFB4C8'/>"
                . "<rect x='120' y='180' width='110' height='14' rx='7' fill='#A8E6CF'/>"
                . "<text x='310' y='180' font-family='Nunito,Arial,sans-serif' font-size='72' font-weight='800' fill='{$a}'>A</text>"
                . "<text x='370' y='240' font-family='Nunito,Arial,sans-serif' font-size='48' font-weight='800' fill='#7E5FB0'>B</text>";
        },
        'icon' => function ($a) {
            return "<rect width='128' height='128' rx='28' fill='#A8D4F0'/>"
                . "<text x='64' y='82' text-anchor='middle' font-family='Nunito,Arial,sans-serif' font-size='54' font-weight='800' fill='#5C4F6E'>Aa</text>";
        },
    ],
    'urdu_literacy' => [
        'c1' => '#FFF7FB', 'c2' => '#F0D5E8', 'a' => '#C97AAD',
        'ill' => function ($a) {
            return soft('400', '70', '55', $a)
                . "<rect x='90' y='100' width='180' height='180' rx='24' fill='#fff' stroke='{$a}' stroke-width='6'/>"
                . "<path d='M130 160 Q180 120 230 170 Q180 210 130 160' fill='{$a}' opacity='0.85'/>"
                . "<circle cx='340' cy='180' r='50' fill='#FFB4C8'/>"
                . "<path d='M320 180 h40 M340 160 v40' stroke='#fff' stroke-width='8' stroke-linecap='round'/>"
                . "<rect x='300' y='250' width='120' height='20' rx='10' fill='#C9B1E8'/>";
        },
        'icon' => function ($a) {
            return "<rect width='128' height='128' rx='28' fill='#F0D5E8'/>"
                . "<path d='M34 70 Q64 30 94 70 Q64 100 34 70' fill='{$a}'/>"
                . "<circle cx='64' cy='72' r='8' fill='#fff'/>";
        },
    ],
    'world_around_us' => [
        'c1' => '#F2FFF8', 'c2' => '#C8F0E0', 'a' => '#4FBF98',
        'ill' => function ($a) {
            return soft('70', '280', '60', $a)
                . "<circle cx='240' cy='170' r='100' fill='#7ECDB5'/>"
                . "<ellipse cx='210' cy='140' rx='36' ry='22' fill='#3FA88C'/>"
                . "<ellipse cx='280' cy='190' rx='40' ry='24' fill='#3FA88C'/>"
                . "<circle cx='120' cy='240' r='28' fill='#FFB894'/>"
                . "<rect x='340' y='200' width='50' height='70' rx='10' fill='#A8D4F0'/>"
                . "<polygon points='340,200 365,160 390,200' fill='#FFB4C8'/>";
        },
        'icon' => function ($a) {
            return "<rect width='128' height='128' rx='28' fill='#C8F0E0'/>"
                . "<circle cx='64' cy='64' r='36' fill='#5BB894'/>"
                . "<ellipse cx='52' cy='56' rx='12' ry='8' fill='#3FA88C'/>"
                . "<ellipse cx='78' cy='74' rx='14' ry='9' fill='#3FA88C'/>";
        },
    ],
    'colors_shapes_patterns' => [
        'c1' => '#FFF8F4', 'c2' => '#FFD8C2', 'a' => '#E89560',
        'ill' => function ($a) {
            return soft('400', '60', '50', $a)
                . "<circle cx='130' cy='160' r='50' fill='#FFB4C8'/>"
                . "<rect x='210' y='110' width='90' height='90' rx='18' fill='#A8E6CF'/>"
                . "<polygon points='360,110 410,200 310,200' fill='#FFE29A'/>"
                . "<circle cx='180' cy='260' r='24' fill='#C9B1E8'/>"
                . "<rect x='250' y='240' width='48' height='48' rx='12' fill='#A8D4F0'/>";
        },
        'icon' => function ($a) {
            return "<rect width='128' height='128' rx='28' fill='#FFD8C2'/>"
                . "<circle cx='44' cy='56' r='20' fill='#FFB4C8'/>"
                . "<rect x='68' y='40' width='36' height='36' rx='8' fill='#A8E6CF'/>"
                . "<polygon points='64,100 88,70 112,100' fill='#FFE29A'/>";
        },
    ],
    'music_rhymes_movement' => [
        'c1' => '#F7F2FF', 'c2' => '#C9B1E8', 'a' => '#8E6FC0',
        'ill' => function ($a) {
            return soft('60', '60', '45', $a)
                . "<ellipse cx='180' cy='210' rx='70' ry='50' fill='#B89AD9'/>"
                . "<rect x='240' y='90' width='18' height='130' rx='8' fill='#5C4F6E'/>"
                . "<circle cx='249' cy='90' r='22' fill='#FFB4C8'/>"
                . "<path d='M300 140 q40 -40 80 0' stroke='#FFB894' stroke-width='10' fill='none' stroke-linecap='round'/>"
                . "<path d='M320 180 q50 -30 90 10' stroke='#A8E6CF' stroke-width='10' fill='none' stroke-linecap='round'/>"
                . "<circle cx='120' cy='120' r='16' fill='#FFE29A'/>";
        },
        'icon' => function ($a) {
            return "<rect width='128' height='128' rx='28' fill='#C9B1E8'/>"
                . "<rect x='58' y='28' width='12' height='70' rx='6' fill='#5C4F6E'/>"
                . "<circle cx='64' cy='28' r='14' fill='#FFB4C8'/>"
                . "<ellipse cx='48' cy='90' rx='28' ry='18' fill='#B89AD9'/>";
        },
    ],
    'games_brain_play' => [
        'c1' => '#F3FFF9', 'c2' => '#A8E6CF', 'a' => '#4FBF98',
        'ill' => function ($a) {
            return soft('420', '280', '55', $a)
                . "<rect x='90' y='100' width='90' height='90' rx='18' fill='#7ECDB5'/>"
                . "<rect x='200' y='100' width='90' height='90' rx='18' fill='#fff' stroke='#FFB4C8' stroke-width='6'/>"
                . "<rect x='90' y='210' width='90' height='90' rx='18' fill='#fff' stroke='#C9B1E8' stroke-width='6'/>"
                . "<rect x='200' y='210' width='90' height='90' rx='18' fill='#FFE29A'/>"
                . "<circle cx='360' cy='160' r='40' fill='#FFB4C8'/>"
                . "<circle cx='360' cy='160' r='18' fill='#fff'/>";
        },
        'icon' => function ($a) {
            return "<rect width='128' height='128' rx='28' fill='#A8E6CF'/>"
                . "<rect x='24' y='24' width='34' height='34' rx='8' fill='#5BB894'/>"
                . "<rect x='70' y='24' width='34' height='34' rx='8' fill='#fff' stroke='#FFB4C8' stroke-width='4'/>"
                . "<rect x='24' y='70' width='34' height='34' rx='8' fill='#fff' stroke='#C9B1E8' stroke-width='4'/>"
                . "<rect x='70' y='70' width='34' height='34' rx='8' fill='#FFE29A'/>";
        },
    ],
    'creativity_art' => [
        'c1' => '#FFF5F8', 'c2' => '#FFB4C8', 'a' => '#E8799A',
        'ill' => function ($a) {
            return soft('70', '280', '55', $a)
                . "<rect x='110' y='90' width='180' height='180' rx='20' fill='#fff' stroke='#E8D5F5' stroke-width='6'/>"
                . "<circle cx='160' cy='150' r='20' fill='#FFB4C8'/>"
                . "<rect x='200' y='140' width='50' height='50' rx='10' fill='#A8E6CF'/>"
                . "<polygon points='160,220 200,170 240,220' fill='#FFE29A'/>"
                . "<g transform='translate(340 120) rotate(20)'>"
                . "<rect x='0' y='0' width='24' height='140' rx='8' fill='#F4A261'/>"
                . "<rect x='0' y='0' width='24' height='34' rx='8' fill='#FF8F6B'/>"
                . "<path d='M0 140 L12 175 L24 140 Z' fill='#5C4F6E'/>"
                . "</g>";
        },
        'icon' => function ($a) {
            return "<rect width='128' height='128' rx='28' fill='#FFB4C8'/>"
                . "<circle cx='46' cy='56' r='16' fill='#fff'/>"
                . "<rect x='66' y='44' width='28' height='28' rx='6' fill='#A8E6CF'/>"
                . "<polygon points='40,96 64,68 88,96' fill='#FFE29A'/>";
        },
    ],
    'basic_islamic_studies' => [
        'c1' => '#F7FBF8', 'c2' => '#D4EDE3', 'a' => '#5AAE96',
        'ill' => function ($a) {
            return soft('400', '70', '50', $a)
                . "<path d='M240 80 L280 160 L360 160 L295 210 L320 290 L240 240 L160 290 L185 210 L120 160 L200 160 Z' fill='#7ECDB5'/>"
                . "<circle cx='240' cy='180' r='26' fill='#fff' opacity='0.35'/>"
                . "<rect x='100' y='300' width='280' height='18' rx='9' fill='#C9B1E8' opacity='0.7'/>";
        },
        'icon' => function ($a) {
            return "<rect width='128' height='128' rx='28' fill='#D4EDE3'/>"
                . "<path d='M64 24 L76 52 L108 52 L82 70 L92 100 L64 82 L36 100 L46 70 L20 52 L52 52 Z' fill='#5AAE96'/>";
        },
    ],
    'life_skills_discovery' => [
        'c1' => '#FFF9F2', 'c2' => '#FFE0C2', 'a' => '#E0A06A',
        'ill' => function ($a) {
            return soft('60', '60', '45', $a)
                . "<rect x='120' y='140' width='100' height='130' rx='20' fill='#FFB894'/>"
                . "<circle cx='170' cy='120' r='36' fill='#FFD8C2'/>"
                . "<rect x='260' y='170' width='70' height='50' rx='12' fill='#A8E6CF'/>"
                . "<rect x='280' y='150' width='30' height='30' rx='8' fill='#A8D4F0'/>"
                . "<circle cx='360' cy='220' r='34' fill='#C9B1E8'/>"
                . "<path d='M100 300 H400' stroke='#E8D5F5' stroke-width='10' stroke-linecap='round'/>";
        },
        'icon' => function ($a) {
            return "<rect width='128' height='128' rx='28' fill='#FFE0C2'/>"
                . "<circle cx='64' cy='42' r='18' fill='#FFD8C2'/>"
                . "<rect x='40' y='62' width='48' height='42' rx='14' fill='#FFB894'/>";
        },
    ],
    'science_nature' => [
        'c1' => '#F2FFF9', 'c2' => '#B8E0D2', 'a' => '#5AAE96',
        'ill' => function ($a) {
            return soft('420', '50', '55', $a)
                . "<rect x='210' y='180' width='18' height='110' rx='8' fill='#8B6B4A'/>"
                . "<circle cx='220' cy='150' r='55' fill='#5BB894'/>"
                . "<circle cx='180' cy='170' r='30' fill='#7ECDB5'/>"
                . "<circle cx='260' cy='170' r='30' fill='#7ECDB5'/>"
                . "<circle cx='120' cy='100' r='34' fill='#FFE29A'/>"
                . "<circle cx='360' cy='240' r='28' fill='#A8D4F0'/>"
                . "<path d='M80 300 Q240 250 400 300' stroke='#C8F0E0' stroke-width='16' fill='none'/>";
        },
        'icon' => function ($a) {
            return "<rect width='128' height='128' rx='28' fill='#B8E0D2'/>"
                . "<rect x='58' y='70' width='12' height='36' rx='5' fill='#8B6B4A'/>"
                . "<circle cx='64' cy='54' r='24' fill='#5BB894'/>"
                . "<circle cx='28' cy='36' r='14' fill='#FFE29A'/>";
        },
    ],
    'digital_world_technology' => [
        'c1' => '#F4F7FF', 'c2' => '#C5D4F5', 'a' => '#6B86C9',
        'ill' => function ($a) {
            return soft('70', '280', '50', $a)
                . "<rect x='120' y='90' width='240' height='160' rx='22' fill='#fff' stroke='{$a}' stroke-width='8'/>"
                . "<rect x='145' y='115' width='190' height='100' rx='12' fill='#A8D4F0'/>"
                . "<circle cx='240' cy='165' r='28' fill='#FFB4C8'/>"
                . "<rect x='190' y='270' width='100' height='18' rx='9' fill='#C9B1E8'/>"
                . "<circle cx='380' cy='110' r='18' fill='#A8E6CF'/>"
                . "<circle cx='100' cy='120' r='14' fill='#FFE29A'/>";
        },
        'icon' => function ($a) {
            return "<rect width='128' height='128' rx='28' fill='#C5D4F5'/>"
                . "<rect x='28' y='34' width='72' height='50' rx='10' fill='#fff' stroke='{$a}' stroke-width='5'/>"
                . "<rect x='40' y='44' width='48' height='28' rx='6' fill='#A8D4F0'/>"
                . "<rect x='48' y='92' width='32' height='10' rx='5' fill='#C9B1E8'/>";
        },
    ],
    'everyday_math_money' => [
        'c1' => '#FFFBEA', 'c2' => '#FFE29A', 'a' => '#E0B84A',
        'ill' => function ($a) {
            return soft('60', '60', '45', $a)
                . "<circle cx='170' cy='170' r='60' fill='#F0C85A'/>"
                . "<circle cx='170' cy='170' r='42' fill='#FFE29A' stroke='#D4A017' stroke-width='4'/>"
                . "<text x='170' y='182' text-anchor='middle' font-family='Nunito,Arial,sans-serif' font-size='34' font-weight='800' fill='#5C4F6E'>10</text>"
                . "<rect x='280' y='130' width='120' height='70' rx='14' fill='#A8E6CF'/>"
                . "<rect x='300' y='150' width='80' height='12' rx='6' fill='#fff' opacity='0.7'/>"
                . "<rect x='300' y='172' width='50' height='12' rx='6' fill='#fff' opacity='0.7'/>"
                . "<circle cx='360' cy='250' r='34' fill='#FFB4C8'/>";
        },
        'icon' => function ($a) {
            return "<rect width='128' height='128' rx='28' fill='#FFE29A'/>"
                . "<circle cx='64' cy='64' r='34' fill='#F0C85A'/>"
                . "<circle cx='64' cy='64' r='22' fill='#FFE29A' stroke='#D4A017' stroke-width='3'/>"
                . "<text x='64' y='72' text-anchor='middle' font-family='Nunito,Arial,sans-serif' font-size='18' font-weight='800' fill='#5C4F6E'>10</text>";
        },
    ],
];

foreach ($segments as $code => $spec) {
    $id = 'sg_' . preg_replace('/[^a-z0-9]/i', '', $code);
    $ill = bg($id, $spec['c1'], $spec['c2']) . ($spec['ill'])($spec['a']);
    $icon = ($spec['icon'])($spec['a']);
    file_put_contents($illDir . '/' . $code . '.svg', svg($ill, 480, 360));
    file_put_contents($iconDir . '/' . $code . '.svg', svg($icon, 128, 128));
}

// Shared fallback (no question marks)
$fb = bg('sgfb', '#FFFCF8', '#E8D5F5')
    . "<circle cx='150' cy='170' r='40' fill='#FFB4C8'/>"
    . "<rect x='220' y='130' width='80' height='80' rx='18' fill='#A8E6CF'/>"
    . "<circle cx='350' cy='170' r='40' fill='#FFE29A'/>";
file_put_contents($illDir . '/_fallback.svg', svg($fb, 480, 360));

echo 'Generated ' . count($segments) . " segment illustrations + icons\n";
