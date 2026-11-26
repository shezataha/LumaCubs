<?php
declare(strict_types=1);

$root = __DIR__;
$icons = $root . '/icons';
$ills = $root . '/illustrations';

$palette = [
  'number_recognition_number_sense' => ['#FFD8C2', '#FF9F7A', '#5C4F6E'],
  'counting_quantity' => ['#C8F0E0', '#5BB894', '#5C4F6E'],
  'number_tracing_writing' => ['#E8D5F5', '#9B7BC8', '#5C4F6E'],
  'number_comparison' => ['#A8D4F0', '#4F9BC8', '#5C4F6E'],
  'addition' => ['#FFB4C8', '#E8799A', '#5C4F6E'],
  'subtraction' => ['#F0A98A', '#D97B55', '#5C4F6E'],
  'multiplication' => ['#B89AD9', '#7E5FB0', '#5C4F6E'],
  'division' => ['#7ECDB5', '#3FA88C', '#5C4F6E'],
  'skip_counting' => ['#FFE29A', '#E0B84A', '#5C4F6E'],
  'number_patterns_sequences' => ['#C9B1E8', '#8E6FC0', '#5C4F6E'],
  'fractions' => ['#FFC9A8', '#E89560', '#5C4F6E'],
  'math_patterns_relationships' => ['#A8E6CF', '#4FBF98', '#5C4F6E'],
  'basic_mathematical_logic' => ['#D4C4F0', '#8B74C4', '#5C4F6E'],
  'intro_multiples_factors' => ['#F6D6AE', '#D4A066', '#5C4F6E'],
  'intro_decimals' => ['#F0D5E8', '#C97AAD', '#5C4F6E'],
  'place_value_number_system' => ['#B8E0D2', '#5AAE96', '#5C4F6E'],
];

function svgWrap(string $inner, int $w, int $h): string
{
    return '<?xml version="1.0" encoding="UTF-8"?>' . "\n" .
      '<svg xmlns="http://www.w3.org/2000/svg" width="' . $w . '" height="' . $h . '" viewBox="0 0 ' . $w . ' ' . $h . '" role="img">' .
      $inner . '</svg>';
}

foreach ($palette as $code => [$bg, $accent, $ink]) {
    // ICON 128x128
    $iconInner = match ($code) {
        'number_recognition_number_sense' =>
          "<rect width='128' height='128' rx='28' fill='{$bg}'/>" .
          "<text x='28' y='78' font-size='42' font-family='Segoe UI, Arial' font-weight='700' fill='{$accent}'>1</text>" .
          "<text x='58' y='62' font-size='28' font-family='Segoe UI, Arial' font-weight='700' fill='{$ink}'>2</text>" .
          "<text x='78' y='92' font-size='34' font-family='Segoe UI, Arial' font-weight='700' fill='{$accent}'>3</text>",
        'counting_quantity' =>
          "<rect width='128' height='128' rx='28' fill='{$bg}'/>" .
          "<rect x='24' y='70' width='22' height='22' rx='6' fill='{$accent}'/>" .
          "<rect x='53' y='54' width='22' height='38' rx='6' fill='{$accent}'/>" .
          "<rect x='82' y='38' width='22' height='54' rx='6' fill='{$accent}'/>",
        'number_tracing_writing' =>
          "<rect width='128' height='128' rx='28' fill='{$bg}'/>" .
          "<path d='M40 88 C40 48 88 48 88 88' stroke='{$accent}' stroke-width='8' fill='none' stroke-linecap='round' stroke-dasharray='6 10'/>" .
          "<path d='M86 34 l18 40 -18 8 z' fill='{$ink}'/>",
        'number_comparison' =>
          "<rect width='128' height='128' rx='28' fill='{$bg}'/>" .
          "<path d='M34 40 L70 64 L34 88' stroke='{$accent}' stroke-width='10' fill='none' stroke-linecap='round' stroke-linejoin='round'/>" .
          "<path d='M94 40 L58 64 L94 88' stroke='{$ink}' stroke-width='10' fill='none' stroke-linecap='round' stroke-linejoin='round' opacity='0.35'/>",
        'addition' =>
          "<rect width='128' height='128' rx='28' fill='{$bg}'/>" .
          "<rect x='56' y='30' width='16' height='68' rx='8' fill='{$accent}'/>" .
          "<rect x='30' y='56' width='68' height='16' rx='8' fill='{$accent}'/>",
        'subtraction' =>
          "<rect width='128' height='128' rx='28' fill='{$bg}'/>" .
          "<circle cx='40' cy='64' r='14' fill='{$accent}'/>" .
          "<circle cx='70' cy='64' r='14' fill='{$accent}' opacity='0.45'/>" .
          "<rect x='92' y='56' width='18' height='16' rx='8' fill='{$ink}'/>",
        'multiplication' =>
          "<rect width='128' height='128' rx='28' fill='{$bg}'/>" .
          "<circle cx='40' cy='44' r='10' fill='{$accent}'/><circle cx='64' cy='44' r='10' fill='{$accent}'/><circle cx='88' cy='44' r='10' fill='{$accent}'/>" .
          "<circle cx='40' cy='84' r='10' fill='{$accent}'/><circle cx='64' cy='84' r='10' fill='{$accent}'/><circle cx='88' cy='84' r='10' fill='{$accent}'/>",
        'division' =>
          "<rect width='128' height='128' rx='28' fill='{$bg}'/>" .
          "<circle cx='40' cy='50' r='12' fill='{$accent}'/><circle cx='40' cy='78' r='12' fill='{$accent}'/>" .
          "<circle cx='88' cy='50' r='12' fill='{$accent}'/><circle cx='88' cy='78' r='12' fill='{$accent}'/>" .
          "<rect x='58' y='58' width='12' height='12' rx='6' fill='{$ink}'/>",
        'skip_counting' =>
          "<rect width='128' height='128' rx='28' fill='{$bg}'/>" .
          "<ellipse cx='30' cy='86' rx='16' ry='10' fill='{$accent}'/>" .
          "<ellipse cx='64' cy='70' rx='16' ry='10' fill='{$accent}'/>" .
          "<ellipse cx='98' cy='54' rx='16' ry='10' fill='{$accent}'/>",
        'number_patterns_sequences' =>
          "<rect width='128' height='128' rx='28' fill='{$bg}'/>" .
          "<circle cx='32' cy='64' r='12' fill='{$accent}'/>" .
          "<rect x='52' y='52' width='24' height='24' rx='6' fill='{$ink}' opacity='0.7'/>" .
          "<circle cx='96' cy='64' r='12' fill='{$accent}'/>",
        'fractions' =>
          "<rect width='128' height='128' rx='28' fill='{$bg}'/>" .
          "<circle cx='64' cy='64' r='34' fill='#fff' stroke='{$accent}' stroke-width='6'/>" .
          "<path d='M64 30 A34 34 0 0 1 64 98 Z' fill='{$accent}'/>",
        'math_patterns_relationships' =>
          "<rect width='128' height='128' rx='28' fill='{$bg}'/>" .
          "<circle cx='40' cy='64' r='18' fill='{$accent}'/>" .
          "<circle cx='88' cy='64' r='18' fill='{$accent}'/>" .
          "<circle cx='64' cy='64' r='14' fill='#fff' stroke='{$ink}' stroke-width='4'/>",
        'basic_mathematical_logic' =>
          "<rect width='128' height='128' rx='28' fill='{$bg}'/>" .
          "<rect x='28' y='28' width='30' height='30' rx='8' fill='{$accent}'/>" .
          "<rect x='70' y='28' width='30' height='30' rx='8' fill='#fff' stroke='{$ink}' stroke-width='4'/>" .
          "<rect x='28' y='70' width='30' height='30' rx='8' fill='#fff' stroke='{$ink}' stroke-width='4'/>" .
          "<rect x='70' y='70' width='30' height='30' rx='8' fill='{$accent}'/>",
        'intro_multiples_factors' =>
          "<rect width='128' height='128' rx='28' fill='{$bg}'/>" .
          "<rect x='24' y='28' width='20' height='20' rx='5' fill='{$accent}'/>" .
          "<rect x='48' y='28' width='20' height='20' rx='5' fill='{$accent}'/>" .
          "<rect x='72' y='28' width='20' height='20' rx='5' fill='{$accent}'/>" .
          "<rect x='24' y='54' width='20' height='20' rx='5' fill='{$accent}'/>" .
          "<rect x='48' y='54' width='20' height='20' rx='5' fill='{$accent}'/>" .
          "<rect x='72' y='54' width='20' height='20' rx='5' fill='{$accent}'/>",
        'intro_decimals' =>
          "<rect width='128' height='128' rx='28' fill='{$bg}'/>" .
          "<text x='30' y='82' font-size='48' font-family='Segoe UI, Arial' font-weight='700' fill='{$accent}'>3</text>" .
          "<circle cx='68' cy='90' r='6' fill='{$ink}'/>" .
          "<text x='78' y='82' font-size='48' font-family='Segoe UI, Arial' font-weight='700' fill='{$accent}'>14</text>",
        'place_value_number_system' =>
          "<rect width='128' height='128' rx='28' fill='{$bg}'/>" .
          "<rect x='22' y='70' width='18' height='28' rx='4' fill='{$accent}'/>" .
          "<rect x='46' y='50' width='18' height='48' rx='4' fill='{$accent}'/>" .
          "<rect x='70' y='34' width='18' height='64' rx='4' fill='{$accent}'/>" .
          "<rect x='94' y='22' width='18' height='76' rx='4' fill='{$ink}' opacity='0.55'/>",
        default => "<rect width='128' height='128' rx='28' fill='{$bg}'/>",
    };
    file_put_contents($icons . '/' . $code . '.svg', svgWrap($iconInner, 128, 128));

    // ILLUSTRATION 480x360
    $illInner =
      "<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>" .
      "<stop offset='0%' stop-color='#FFFCF8'/><stop offset='100%' stop-color='{$bg}'/></linearGradient></defs>" .
      "<rect width='480' height='360' rx='36' fill='url(#g)'/>" .
      "<circle cx='420' cy='48' r='40' fill='{$accent}' opacity='0.18'/>" .
      "<circle cx='56' cy='300' r='50' fill='{$accent}' opacity='0.16'/>" .
      // scale icon motif into center via nested group approximation: redraw larger motif
      "<g transform='translate(176,90) scale(1.4)'>" . preg_replace('/^<rect width=\'128\' height=\'128\' rx=\'28\' fill=\'[^\']+\'\/>/', '', $iconInner) . "</g>";
    // Fix: iconInner includes bg rect - strip for illustration center
    $motif = preg_replace('/^<rect width=\'128\' height=\'128\' rx=\'28\' fill=\'[^\']+\'\/>/', '', $iconInner);
    $illInner =
      "<defs><linearGradient id='g{$code}' x1='0' y1='0' x2='1' y2='1'>" .
      "<stop offset='0%' stop-color='#FFFCF8'/><stop offset='100%' stop-color='{$bg}'/></linearGradient></defs>" .
      "<rect width='480' height='360' rx='36' fill='url(#g{$code})'/>" .
      "<circle cx='420' cy='48' r='40' fill='{$accent}' opacity='0.18'/>" .
      "<circle cx='56' cy='300' r='50' fill='{$accent}' opacity='0.16'/>" .
      "<g transform='translate(176,90) scale(1.4)'>{$motif}</g>";
    file_put_contents($ills . '/' . $code . '.svg', svgWrap($illInner, 480, 360));
}

echo "Generated " . count($palette) . " icon+illustration pairs\n";
