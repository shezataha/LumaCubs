<?php
declare(strict_types=1);

/**
 * Generates rich educational SVG illustrations + compact icons
 * for Segment 01 Numbers & Math categories.
 */

$root = __DIR__;
$iconsDir = $root . '/icons';
$illsDir = $root . '/illustrations';
@mkdir($iconsDir, 0777, true);
@mkdir($illsDir, 0777, true);

function svg(string $body, int $w, int $h): string
{
    return '<?xml version="1.0" encoding="UTF-8"?>' . "\n"
        . '<svg xmlns="http://www.w3.org/2000/svg" width="' . $w . '" height="' . $h . '" viewBox="0 0 ' . $w . ' ' . $h . '" fill="none">'
        . $body . '</svg>';
}

function bubble(string $cx, string $cy, string $r, string $fill, string $op = '0.22'): string
{
    return "<circle cx='{$cx}' cy='{$cy}' r='{$r}' fill='{$fill}' opacity='{$op}'/>";
}

function numBadge(int $x, int $y, string $n, string $fill, string $ink = '#5C4F6E'): string
{
    return "<g>"
        . "<rect x='{$x}' y='{$y}' width='56' height='56' rx='16' fill='{$fill}'/>"
        . "<text x='" . ($x + 28) . "' y='" . ($y + 38) . "' text-anchor='middle' font-family='Nunito, Fredoka, Arial, sans-serif' font-size='28' font-weight='800' fill='{$ink}'>{$n}</text>"
        . "</g>";
}

function block(int $x, int $y, int $w, int $h, string $fill): string
{
    return "<rect x='{$x}' y='{$y}' width='{$w}' height='{$h}' rx='10' fill='{$fill}'/>"
        . "<rect x='{$x}' y='{$y}' width='{$w}' height='" . max(8, (int)($h * 0.22)) . "' rx='10' fill='#ffffff' opacity='0.28'/>";
}

function toy(int $cx, int $cy, string $fill): string
{
    return "<circle cx='{$cx}' cy='{$cy}' r='18' fill='{$fill}'/>"
        . "<circle cx='" . ($cx - 6) . "' cy='" . ($cy - 5) . "' r='4' fill='#fff' opacity='0.55'/>";
}

$specs = [
    'number_recognition_number_sense' => [
        'bg' => ['#FFF8F0', '#FFD8C2'], 'accent' => '#FF8F6B', 'ink' => '#5C4F6E',
        'ill' => function ($a, $ink) {
            return bubble('420', '50', '70', $a)
                . bubble('60', '300', '80', $a, '0.18')
                . numBadge(70, 90, '1', '#FFB4A2')
                . numBadge(170, 140, '2', '#FFD093')
                . numBadge(270, 80, '3', '#A8E6CF')
                . numBadge(340, 170, '4', '#C9B1E8')
                . numBadge(120, 220, '5', '#A8D4F0')
                . "<circle cx='400' cy='250' r='28' fill='{$a}' opacity='0.35'/>";
        },
        'icon' => function ($a, $ink) {
            return "<rect width='128' height='128' rx='28' fill='#FFD8C2'/>"
                . numBadge(16, 36, '1', '#FFB4A2', $ink)
                . numBadge(56, 20, '2', '#A8E6CF', $ink)
                . numBadge(36, 70, '3', '#C9B1E8', $ink);
        },
    ],
    'counting_quantity' => [
        'bg' => ['#F3FFF9', '#C8F0E0'], 'accent' => '#4FBF98', 'ink' => '#5C4F6E',
        'ill' => function ($a, $ink) {
            return bubble('400', '40', '60', $a)
                . block(70, 200, 50, 90, '#7ECDB5')
                . block(135, 150, 50, 140, '#5BB894')
                . block(200, 110, 50, 180, '#3FA88C')
                . toy(300, 230, '#FFB4C8')
                . toy(360, 230, '#FFE29A')
                . toy(420, 230, '#C9B1E8')
                . "<text x='90' y='80' font-family='Nunito, Arial, sans-serif' font-size='36' font-weight='800' fill='{$ink}'>1 2 3</text>";
        },
        'icon' => function ($a, $ink) {
            return "<rect width='128' height='128' rx='28' fill='#C8F0E0'/>"
                . block(22, 70, 24, 36, '#7ECDB5')
                . block(52, 50, 24, 56, '#5BB894')
                . block(82, 30, 24, 76, '#3FA88C');
        },
    ],
    'number_tracing_writing' => [
        'bg' => ['#FAF6FF', '#E8D5F5'], 'accent' => '#9B7BC8', 'ink' => '#5C4F6E',
        'ill' => function ($a, $ink) {
            return bubble('70', '60', '55', $a)
                . "<path d='M140 260 C140 120 300 120 300 260' stroke='{$a}' stroke-width='22' fill='none' stroke-linecap='round' stroke-dasharray='18 16' opacity='0.55'/>"
                . "<path d='M140 260 C140 120 300 120 300 260' stroke='{$ink}' stroke-width='8' fill='none' stroke-linecap='round'/>"
                . "<g transform='translate(320 70) rotate(25)'>"
                . "<rect x='0' y='0' width='28' height='150' rx='10' fill='#FFB894'/>"
                . "<rect x='0' y='0' width='28' height='36' rx='10' fill='#F4A261'/>"
                . "<path d='M0 150 L14 190 L28 150 Z' fill='{$ink}'/>"
                . "</g>";
        },
        'icon' => function ($a, $ink) {
            return "<rect width='128' height='128' rx='28' fill='#E8D5F5'/>"
                . "<path d='M34 92 C34 40 94 40 94 92' stroke='{$a}' stroke-width='10' fill='none' stroke-linecap='round' stroke-dasharray='6 8'/>"
                . "<path d='M86 28 l18 42 -18 8 z' fill='{$ink}'/>";
        },
    ],
    'number_comparison' => [
        'bg' => ['#F2F9FF', '#A8D4F0'], 'accent' => '#4F9BC8', 'ink' => '#5C4F6E',
        'ill' => function ($a, $ink) {
            return bubble('420', '280', '70', $a)
                . numBadge(70, 140, '3', '#A8E6CF')
                . "<path d='M190 120 L270 180 L190 240' stroke='{$a}' stroke-width='18' fill='none' stroke-linecap='round' stroke-linejoin='round'/>"
                . numBadge(300, 140, '7', '#FFB4C8')
                . "<text x='210' y='310' font-family='Nunito, Arial, sans-serif' font-size='28' font-weight='800' fill='{$ink}'>less · more</text>";
        },
        'icon' => function ($a, $ink) {
            return "<rect width='128' height='128' rx='28' fill='#A8D4F0'/>"
                . "<path d='M34 36 L78 64 L34 92' stroke='{$ink}' stroke-width='12' fill='none' stroke-linecap='round' stroke-linejoin='round'/>"
                . "<path d='M94 36 L50 64 L94 92' stroke='{$a}' stroke-width='8' fill='none' stroke-linecap='round' opacity='0.45'/>";
        },
    ],
    'addition' => [
        'bg' => ['#FFF5F8', '#FFB4C8'], 'accent' => '#E8799A', 'ink' => '#5C4F6E',
        'ill' => function ($a, $ink) {
            return bubble('60', '60', '50', $a)
                . toy(110, 200, '#FF8FAB')
                . toy(170, 200, '#FF8FAB')
                . "<rect x='220' y='170' width='40' height='14' rx='7' fill='{$ink}'/>"
                . "<rect x='233' y='157' width='14' height='40' rx='7' fill='{$ink}'/>"
                . toy(300, 200, '#A8E6CF')
                . toy(360, 200, '#A8E6CF')
                . toy(420, 200, '#A8E6CF')
                . "<text x='150' y='100' font-family='Nunito, Arial, sans-serif' font-size='42' font-weight='800' fill='{$a}'>2 + 3</text>";
        },
        'icon' => function ($a, $ink) {
            return "<rect width='128' height='128' rx='28' fill='#FFB4C8'/>"
                . "<rect x='56' y='28' width='16' height='72' rx='8' fill='{$ink}'/>"
                . "<rect x='28' y='56' width='72' height='16' rx='8' fill='{$ink}'/>";
        },
    ],
    'subtraction' => [
        'bg' => ['#FFF6F0', '#F0A98A'], 'accent' => '#D97B55', 'ink' => '#5C4F6E',
        'ill' => function ($a, $ink) {
            return bubble('400', '70', '55', $a)
                . toy(120, 200, '#FFB894')
                . toy(190, 200, '#FFB894')
                . toy(260, 200, '#FFB894')
                . "<g opacity='0.35'>" . toy(330, 200, '#FFB894') . toy(400, 200, '#FFB894') . "</g>"
                . "<rect x='300' y='110' width='70' height='16' rx='8' fill='{$ink}'/>"
                . "<path d='M360 90 l40 -40' stroke='{$a}' stroke-width='8' stroke-linecap='round'/>"
                . "<text x='120' y='100' font-family='Nunito, Arial, sans-serif' font-size='36' font-weight='800' fill='{$ink}'>5 − 2</text>";
        },
        'icon' => function ($a, $ink) {
            return "<rect width='128' height='128' rx='28' fill='#F0A98A'/>"
                . "<circle cx='40' cy='64' r='16' fill='#FFD8C2'/>"
                . "<circle cx='72' cy='64' r='16' fill='#FFD8C2' opacity='0.45'/>"
                . "<rect x='96' y='56' width='18' height='16' rx='8' fill='{$ink}'/>";
        },
    ],
    'multiplication' => [
        'bg' => ['#F7F2FF', '#B89AD9'], 'accent' => '#7E5FB0', 'ink' => '#5C4F6E',
        'ill' => function ($a, $ink) {
            return bubble('70', '280', '60', $a)
                . toy(120, 140, '#C9B1E8') . toy(180, 140, '#C9B1E8') . toy(240, 140, '#C9B1E8')
                . toy(120, 220, '#FFB4C8') . toy(180, 220, '#FFB4C8') . toy(240, 220, '#FFB4C8')
                . toy(120, 300, '#A8E6CF') . toy(180, 300, '#A8E6CF') . toy(240, 300, '#A8E6CF')
                . "<text x='300' y='200' font-family='Nunito, Arial, sans-serif' font-size='40' font-weight='800' fill='{$a}'>3 × 3</text>";
        },
        'icon' => function ($a, $ink) {
            return "<rect width='128' height='128' rx='28' fill='#B89AD9'/>"
                . "<circle cx='40' cy='40' r='12' fill='#fff'/><circle cx='64' cy='40' r='12' fill='#fff'/><circle cx='88' cy='40' r='12' fill='#fff'/>"
                . "<circle cx='40' cy='88' r='12' fill='#fff'/><circle cx='64' cy='88' r='12' fill='#fff'/><circle cx='88' cy='88' r='12' fill='#fff'/>";
        },
    ],
    'division' => [
        'bg' => ['#F0FFF8', '#7ECDB5'], 'accent' => '#3FA88C', 'ink' => '#5C4F6E',
        'ill' => function ($a, $ink) {
            return bubble('420', '60', '55', $a)
                . "<rect x='60' y='80' width='160' height='100' rx='24' fill='#C8F0E0'/>"
                . toy(100, 130, '#FFB4C8') . toy(160, 130, '#FFB4C8')
                . "<rect x='260' y='80' width='160' height='100' rx='24' fill='#C8F0E0'/>"
                . toy(300, 130, '#FFB4C8') . toy(360, 130, '#FFB4C8')
                . "<rect x='160' y='220' width='160' height='100' rx='24' fill='#C8F0E0'/>"
                . toy(200, 270, '#FFB4C8') . toy(260, 270, '#FFB4C8')
                . "<text x='170' y='50' font-family='Nunito, Arial, sans-serif' font-size='34' font-weight='800' fill='{$ink}'>Share equally</text>";
        },
        'icon' => function ($a, $ink) {
            return "<rect width='128' height='128' rx='28' fill='#7ECDB5'/>"
                . "<circle cx='40' cy='44' r='14' fill='#fff'/><circle cx='40' cy='84' r='14' fill='#fff'/>"
                . "<circle cx='88' cy='44' r='14' fill='#fff'/><circle cx='88' cy='84' r='14' fill='#fff'/>"
                . "<rect x='58' y='58' width='12' height='12' rx='6' fill='{$ink}'/>";
        },
    ],
    'skip_counting' => [
        'bg' => ['#FFFBEA', '#FFE29A'], 'accent' => '#E0B84A', 'ink' => '#5C4F6E',
        'ill' => function ($a, $ink) {
            return bubble('60', '60', '45', $a)
                . "<ellipse cx='90' cy='250' rx='48' ry='28' fill='#FFD18A'/>"
                . "<text x='90' y='258' text-anchor='middle' font-family='Nunito, Arial, sans-serif' font-size='28' font-weight='800' fill='{$ink}'>2</text>"
                . "<ellipse cx='190' cy='200' rx='48' ry='28' fill='#FFC56D'/>"
                . "<text x='190' y='208' text-anchor='middle' font-family='Nunito, Arial, sans-serif' font-size='28' font-weight='800' fill='{$ink}'>4</text>"
                . "<ellipse cx='290' cy='150' rx='48' ry='28' fill='#FFB84D'/>"
                . "<text x='290' y='158' text-anchor='middle' font-family='Nunito, Arial, sans-serif' font-size='28' font-weight='800' fill='{$ink}'>6</text>"
                . "<ellipse cx='390' cy='100' rx='48' ry='28' fill='#F0A83A'/>"
                . "<text x='390' y='108' text-anchor='middle' font-family='Nunito, Arial, sans-serif' font-size='28' font-weight='800' fill='{$ink}'>8</text>";
        },
        'icon' => function ($a, $ink) {
            return "<rect width='128' height='128' rx='28' fill='#FFE29A'/>"
                . "<ellipse cx='30' cy='90' rx='18' ry='12' fill='#F0A83A'/>"
                . "<ellipse cx='64' cy='68' rx='18' ry='12' fill='#F0A83A'/>"
                . "<ellipse cx='98' cy='46' rx='18' ry='12' fill='#F0A83A'/>";
        },
    ],
    'number_patterns_sequences' => [
        'bg' => ['#F8F3FF', '#C9B1E8'], 'accent' => '#8E6FC0', 'ink' => '#5C4F6E',
        'ill' => function ($a, $ink) {
            return bubble('420', '280', '60', $a)
                . "<circle cx='90' cy='180' r='34' fill='#FFB4C8'/>"
                . block(150, 146, 68, 68, '#A8E6CF')
                . "<circle cx='290' cy='180' r='34' fill='#FFB4C8'/>"
                . block(350, 146, 68, 68, '#A8E6CF')
                . "<text x='120' y='90' font-family='Nunito, Arial, sans-serif' font-size='32' font-weight='800' fill='{$ink}'>What comes next?</text>"
                . "<rect x='200' y='250' width='80' height='50' rx='14' fill='#fff' stroke='{$a}' stroke-width='4' stroke-dasharray='8 8'/>";
        },
        'icon' => function ($a, $ink) {
            return "<rect width='128' height='128' rx='28' fill='#C9B1E8'/>"
                . "<circle cx='32' cy='64' r='14' fill='#FFB4C8'/>"
                . "<rect x='52' y='50' width='28' height='28' rx='8' fill='#A8E6CF'/>"
                . "<circle cx='100' cy='64' r='14' fill='#FFB4C8'/>";
        },
    ],
    'fractions' => [
        'bg' => ['#FFF7F0', '#FFC9A8'], 'accent' => '#E89560', 'ink' => '#5C4F6E',
        'ill' => function ($a, $ink) {
            return bubble('70', '70', '50', $a)
                . "<circle cx='170' cy='180' r='90' fill='#FFE0C8' stroke='{$a}' stroke-width='8'/>"
                . "<path d='M170 90 A90 90 0 0 1 170 270 Z' fill='{$a}'/>"
                . "<circle cx='360' cy='180' r='70' fill='#FFE0C8' stroke='{$a}' stroke-width='8'/>"
                . "<path d='M360 110 A70 70 0 0 1 420 200 L360 180 Z' fill='#FFB894'/>"
                . "<text x='150' y='320' font-family='Nunito, Arial, sans-serif' font-size='34' font-weight='800' fill='{$ink}'>½  ·  ¼</text>";
        },
        'icon' => function ($a, $ink) {
            return "<rect width='128' height='128' rx='28' fill='#FFC9A8'/>"
                . "<circle cx='64' cy='64' r='36' fill='#fff' stroke='{$a}' stroke-width='6'/>"
                . "<path d='M64 28 A36 36 0 0 1 64 100 Z' fill='{$a}'/>";
        },
    ],
    'math_patterns_relationships' => [
        'bg' => ['#F2FFF9', '#A8E6CF'], 'accent' => '#4FBF98', 'ink' => '#5C4F6E',
        'ill' => function ($a, $ink) {
            return bubble('400', '50', '55', $a)
                . "<circle cx='130' cy='180' r='55' fill='#7ECDB5'/>"
                . "<text x='130' y='190' text-anchor='middle' font-family='Nunito, Arial, sans-serif' font-size='30' font-weight='800' fill='#fff'>2</text>"
                . "<circle cx='350' cy='180' r='55' fill='#7ECDB5'/>"
                . "<text x='350' y='190' text-anchor='middle' font-family='Nunito, Arial, sans-serif' font-size='30' font-weight='800' fill='#fff'>3</text>"
                . "<circle cx='240' cy='180' r='48' fill='#fff' stroke='{$ink}' stroke-width='6'/>"
                . "<text x='240' y='190' text-anchor='middle' font-family='Nunito, Arial, sans-serif' font-size='30' font-weight='800' fill='{$ink}'>5</text>"
                . "<text x='150' y='300' font-family='Nunito, Arial, sans-serif' font-size='28' font-weight='800' fill='{$ink}'>Number bonds</text>";
        },
        'icon' => function ($a, $ink) {
            return "<rect width='128' height='128' rx='28' fill='#A8E6CF'/>"
                . "<circle cx='40' cy='64' r='20' fill='#5BB894'/>"
                . "<circle cx='88' cy='64' r='20' fill='#5BB894'/>"
                . "<circle cx='64' cy='64' r='16' fill='#fff' stroke='{$ink}' stroke-width='4'/>";
        },
    ],
    'basic_mathematical_logic' => [
        'bg' => ['#F7F3FF', '#D4C4F0'], 'accent' => '#8B74C4', 'ink' => '#5C4F6E',
        'ill' => function ($a, $ink) {
            return bubble('60', '280', '55', $a)
                . block(90, 90, 90, 90, '#C9B1E8')
                . "<text x='135' y='148' text-anchor='middle' font-family='Nunito, Arial, sans-serif' font-size='36' font-weight='800' fill='#fff'>2</text>"
                . "<rect x='210' y='90' width='90' height='90' rx='18' fill='#fff' stroke='#FFB4C8' stroke-width='6' stroke-dasharray='10 8'/>"
                . "<circle cx='255' cy='135' r='12' fill='#FFB4C8'/>"
                . block(90, 210, 90, 90, '#A8E6CF')
                . "<text x='135' y='268' text-anchor='middle' font-family='Nunito, Arial, sans-serif' font-size='36' font-weight='800' fill='#fff'>4</text>"
                . block(210, 210, 90, 90, '#FFE29A')
                . "<text x='255' y='268' text-anchor='middle' font-family='Nunito, Arial, sans-serif' font-size='36' font-weight='800' fill='{$ink}'>6</text>"
                . "<text x='330' y='180' font-family='Nunito, Arial, sans-serif' font-size='28' font-weight='800' fill='{$ink}'>Puzzle</text>";
        },
        'icon' => function ($a, $ink) {
            return "<rect width='128' height='128' rx='28' fill='#D4C4F0'/>"
                . "<rect x='24' y='24' width='34' height='34' rx='10' fill='#C9B1E8'/>"
                . "<rect x='70' y='24' width='34' height='34' rx='10' fill='#fff' stroke='{$ink}' stroke-width='4'/>"
                . "<rect x='24' y='70' width='34' height='34' rx='10' fill='#fff' stroke='{$ink}' stroke-width='4'/>"
                . "<rect x='70' y='70' width='34' height='34' rx='10' fill='#A8E6CF'/>";
        },
    ],
    'intro_multiples_factors' => [
        'bg' => ['#FFF8EF', '#F6D6AE'], 'accent' => '#D4A066', 'ink' => '#5C4F6E',
        'ill' => function ($a, $ink) {
            return bubble('400', '60', '50', $a)
                . block(80, 120, 48, 48, '#F0B27A') . block(140, 120, 48, 48, '#F0B27A') . block(200, 120, 48, 48, '#F0B27A') . block(260, 120, 48, 48, '#F0B27A')
                . block(80, 180, 48, 48, '#E89560') . block(140, 180, 48, 48, '#E89560') . block(200, 180, 48, 48, '#E89560') . block(260, 180, 48, 48, '#E89560')
                . block(80, 240, 48, 48, '#D97B55') . block(140, 240, 48, 48, '#D97B55') . block(200, 240, 48, 48, '#D97B55') . block(260, 240, 48, 48, '#D97B55')
                . "<text x='330' y='200' font-family='Nunito, Arial, sans-serif' font-size='28' font-weight='800' fill='{$ink}'>Groups</text>";
        },
        'icon' => function ($a, $ink) {
            return "<rect width='128' height='128' rx='28' fill='#F6D6AE'/>"
                . block(24, 28, 22, 22, '#E89560') . block(52, 28, 22, 22, '#E89560') . block(80, 28, 22, 22, '#E89560')
                . block(24, 56, 22, 22, '#E89560') . block(52, 56, 22, 22, '#E89560') . block(80, 56, 22, 22, '#E89560');
        },
    ],
    'intro_decimals' => [
        'bg' => ['#FFF5FB', '#F0D5E8'], 'accent' => '#C97AAD', 'ink' => '#5C4F6E',
        'ill' => function ($a, $ink) {
            return bubble('70', '280', '60', $a)
                . "<text x='90' y='200' font-family='Nunito, Arial, sans-serif' font-size='96' font-weight='800' fill='{$a}'>3</text>"
                . "<circle cx='190' cy='230' r='14' fill='{$ink}'/>"
                . "<text x='220' y='200' font-family='Nunito, Arial, sans-serif' font-size='96' font-weight='800' fill='#E8799A'>14</text>"
                . "<rect x='100' y='250' width='280' height='28' rx='14' fill='#fff' opacity='0.7'/>"
                . "<text x='140' y='320' font-family='Nunito, Arial, sans-serif' font-size='28' font-weight='800' fill='{$ink}'>Decimal numbers</text>";
        },
        'icon' => function ($a, $ink) {
            return "<rect width='128' height='128' rx='28' fill='#F0D5E8'/>"
                . "<text x='24' y='82' font-family='Nunito, Arial, sans-serif' font-size='42' font-weight='800' fill='{$a}'>3</text>"
                . "<circle cx='62' cy='88' r='6' fill='{$ink}'/>"
                . "<text x='72' y='82' font-family='Nunito, Arial, sans-serif' font-size='42' font-weight='800' fill='{$a}'>5</text>";
        },
    ],
    'place_value_number_system' => [
        'bg' => ['#F2FFFB', '#B8E0D2'], 'accent' => '#5AAE96', 'ink' => '#5C4F6E',
        'ill' => function ($a, $ink) {
            return bubble('420', '280', '55', $a)
                . block(70, 220, 40, 70, '#8ED9BE')
                . "<text x='90' y='320' text-anchor='middle' font-family='Nunito, Arial, sans-serif' font-size='18' font-weight='800' fill='{$ink}'>1s</text>"
                . block(150, 160, 50, 130, '#5BB894')
                . block(210, 160, 50, 130, '#5BB894')
                . "<text x='205' y='320' text-anchor='middle' font-family='Nunito, Arial, sans-serif' font-size='18' font-weight='800' fill='{$ink}'>10s</text>"
                . block(300, 90, 120, 200, '#3FA88C')
                . "<text x='360' y='320' text-anchor='middle' font-family='Nunito, Arial, sans-serif' font-size='18' font-weight='800' fill='{$ink}'>100s</text>"
                . "<text x='120' y='60' font-family='Nunito, Arial, sans-serif' font-size='30' font-weight='800' fill='{$ink}'>Place value</text>";
        },
        'icon' => function ($a, $ink) {
            return "<rect width='128' height='128' rx='28' fill='#B8E0D2'/>"
                . block(20, 70, 18, 36, '#8ED9BE')
                . block(48, 48, 22, 58, '#5BB894')
                . block(80, 28, 28, 78, '#3FA88C');
        },
    ],
];

foreach ($specs as $code => $spec) {
    [$bg1, $bg2] = $spec['bg'];
    $a = $spec['accent'];
    $ink = $spec['ink'];
    $gradId = 'g_' . preg_replace('/[^a-z0-9]/i', '', $code);

    $illBody = "<defs><linearGradient id='{$gradId}' x1='0' y1='0' x2='1' y2='1'>"
        . "<stop offset='0%' stop-color='{$bg1}'/><stop offset='100%' stop-color='{$bg2}'/></linearGradient></defs>"
        . "<rect width='480' height='360' rx='36' fill='url(#{$gradId})'/>"
        . ($spec['ill'])($a, $ink);

    $iconBody = ($spec['icon'])($a, $ink);

    file_put_contents($illsDir . '/' . $code . '.svg', svg($illBody, 480, 360));
    file_put_contents($iconsDir . '/' . $code . '.svg', svg($iconBody, 128, 128));
}

echo 'Generated ' . count($specs) . " illustration + icon pairs\n";
