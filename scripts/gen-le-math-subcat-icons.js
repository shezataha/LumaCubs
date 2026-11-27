/**
 * Generate unique subcategory icons for Little Explorers Numbers & Math.
 * Soft pastel illustrated cards matching LumaCubs theme.
 */
const fs = require("fs");
const path = require("path");

const dir = path.join(
  __dirname,
  "..",
  "assets",
  "home",
  "little-explorers",
  "numbers-math",
  "subcategories"
);
fs.mkdirSync(dir, { recursive: true });

function soft(id, fills) {
  return `
<defs>
  <linearGradient id="bg${id}" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="${fills[0]}"/>
    <stop offset="100%" stop-color="${fills[1]}"/>
  </linearGradient>
  <filter id="sh${id}" x="-20%" y="-20%" width="140%" height="140%">
    <feDropShadow dx="0" dy="3" stdDeviation="2.2" flood-color="#5B4A7A" flood-opacity="0.18"/>
  </filter>
</defs>`;
}

function card(id, bg0, bg1, body) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256" fill="none">
${soft(id, [bg0, bg1])}
<rect width="256" height="256" rx="56" fill="url(#bg${id})"/>
<circle cx="48" cy="52" r="10" fill="#fff" opacity="0.35"/>
<circle cx="210" cy="40" r="7" fill="#fff" opacity="0.28"/>
<circle cx="222" cy="78" r="5" fill="#fff" opacity="0.22"/>
<g filter="url(#sh${id})">${body}</g>
</svg>`;
}

function nb(x, y, n, color, s = 54) {
  return `<g transform="translate(${x},${y})">
    <ellipse cx="${s / 2}" cy="${s + 6}" rx="${s * 0.36}" ry="6" fill="#5B4A7A" opacity="0.14"/>
    <rect width="${s}" height="${s}" rx="${s * 0.28}" fill="${color}"/>
    <rect x="6" y="5" width="${s * 0.55}" height="${s * 0.28}" rx="10" fill="#fff" opacity="0.28"/>
    <text x="${s / 2}" y="${s * 0.7}" text-anchor="middle" font-family="Verdana, Geneva, sans-serif" font-size="${Math.round(s * 0.52)}" font-weight="700" fill="#fff">${n}</text>
  </g>`;
}

function apple(x, y, s = 28) {
  return `<g transform="translate(${x},${y})">
    <ellipse cx="${s / 2}" cy="${s + 4}" rx="${s * 0.35}" ry="4" fill="#5B4A7A" opacity="0.12"/>
    <circle cx="${s / 2}" cy="${s / 2}" r="${s / 2}" fill="#FF6B6B"/>
    <circle cx="${s * 0.35}" cy="${s * 0.35}" r="${s * 0.16}" fill="#fff" opacity="0.35"/>
    <rect x="${s * 0.45}" y="-2" width="4" height="10" rx="2" fill="#8B5A2B"/>
    <ellipse cx="${s * 0.7}" cy="4" rx="8" ry="5" fill="#7ECDB5" transform="rotate(20 ${s * 0.7} 4)"/>
  </g>`;
}

function star(x, y, s = 26, c = "#FFD166") {
  return `<g transform="translate(${x},${y})">
    <path d="M${s / 2} 2 L${s * 0.62} ${s * 0.38} L${s - 2} ${s * 0.4} L${s * 0.68} ${s * 0.62} L${s * 0.78} ${s - 2} L${s / 2} ${s * 0.74} L${s * 0.22} ${s - 2} L${s * 0.32} ${s * 0.62} L2 ${s * 0.4} L${s * 0.38} ${s * 0.38} Z" fill="${c}"/>
    <circle cx="${s * 0.4}" cy="${s * 0.35}" r="${s * 0.1}" fill="#fff" opacity="0.35"/>
  </g>`;
}

function book(x, y, s = 70, c = "#A8D4F0") {
  return `<g transform="translate(${x},${y})">
    <ellipse cx="${s / 2}" cy="${s * 0.92}" rx="${s * 0.4}" ry="6" fill="#5B4A7A" opacity="0.12"/>
    <path d="M8 12 C28 4, ${s / 2 - 4} 4, ${s / 2} 12 L${s / 2} ${s - 8} C${s / 2 - 4} ${s - 16}, 28 ${s - 16}, 8 ${s - 8} Z" fill="${c}"/>
    <path d="M${s - 8} 12 C${s - 28} 4, ${s / 2 + 4} 4, ${s / 2} 12 L${s / 2} ${s - 8} C${s / 2 + 4} ${s - 16}, ${s - 28} ${s - 16}, ${s - 8} ${s - 8} Z" fill="#FFE29A"/>
    <rect x="${s / 2 - 2}" y="10" width="4" height="${s - 20}" rx="2" fill="#E8D5F5"/>
  </g>`;
}

function crayon(x, y, rot = -25) {
  return `<g transform="translate(${x},${y}) rotate(${rot})">
    <rect x="0" y="8" width="70" height="18" rx="6" fill="#FF8FAB"/>
    <rect x="0" y="8" width="18" height="18" rx="6" fill="#FFD166"/>
    <polygon points="70,8 88,17 70,26" fill="#FF6B8A"/>
    <rect x="8" y="10" width="40" height="6" rx="3" fill="#fff" opacity="0.25"/>
  </g>`;
}

function block(x, y, n, c, s = 48) {
  return `<g transform="translate(${x},${y})">
    <rect y="6" width="${s}" height="${s}" rx="12" fill="#5B4A7A" opacity="0.12"/>
    <rect width="${s}" height="${s}" rx="12" fill="${c}"/>
    <rect x="6" y="5" width="${s * 0.5}" height="${s * 0.22}" rx="8" fill="#fff" opacity="0.3"/>
    <text x="${s / 2}" y="${s * 0.68}" text-anchor="middle" font-family="Verdana, Geneva, sans-serif" font-size="${Math.round(s * 0.48)}" font-weight="700" fill="#fff">${n}</text>
  </g>`;
}

function magnifier(x, y) {
  return `<g transform="translate(${x},${y})">
    <circle cx="38" cy="38" r="28" fill="#EAF8F2" stroke="#7ECDB5" stroke-width="10"/>
    <circle cx="30" cy="30" r="10" fill="#fff" opacity="0.45"/>
    <rect x="54" y="54" width="14" height="40" rx="7" fill="#8B5A2B" transform="rotate(45 54 54)"/>
  </g>`;
}

function tray(x, y, w = 120) {
  return `<rect x="${x}" y="${y}" width="${w}" height="18" rx="9" fill="#E8D5F5" opacity="0.7"/>`;
}

function teddy(x, y) {
  return `<g transform="translate(${x},${y})">
    <ellipse cx="55" cy="70" rx="50" ry="18" fill="#5B4A7A" opacity="0.1"/>
    <circle cx="35" cy="45" r="28" fill="#D4A574"/>
    <circle cx="75" cy="45" r="28" fill="#D4A574"/>
    <circle cx="55" cy="58" r="32" fill="#E8B888"/>
    <circle cx="45" cy="50" r="5" fill="#5B4A7A"/>
    <circle cx="68" cy="50" r="5" fill="#5B4A7A"/>
    <ellipse cx="56" cy="62" rx="7" ry="5" fill="#C97B63"/>
  </g>`;
}

const icons = {
  nr_1_5: card("nr15", "#FFE8D6", "#FFD0B8", nb(40, 90, "1", "#FFD166", 48) + nb(100, 70, "3", "#C9A0FF", 52) + nb(162, 95, "5", "#7ECDB5", 48)),
  nr_1_10: card("nr110", "#EAF4FF", "#C8E0F8", nb(28, 100, "1", "#FFD166", 40) + nb(72, 78, "4", "#FF8FAB", 44) + nb(120, 60, "7", "#A8D4F0", 48) + nb(172, 85, "10", "#7ECDB5", 46)),
  nr_meet_1_10: card(
    "nrm110",
    "#FFE8D6",
    "#FFD0B8",
    nb(30, 95, "1", "#FFD166", 42) +
      nb(78, 80, "4", "#FF8FAB", 46) +
      nb(128, 95, "7", "#C9A0FF", 42) +
      nb(178, 80, "10", "#7ECDB5", 46)
  ),
  nr_pic_match: card("nrpm", "#FFF0F4", "#FFE0EA", apple(40, 90, 42) + apple(95, 110, 36) + nb(150, 78, "3", "#C9A0FF", 58)),
  nr_identify: card("nrid", "#F3EEFF", "#E0D4FF", nb(88, 70, "?", "#C9A0FF", 72) + star(40, 50, 24, "#FFD166") + star(180, 160, 22, "#FF8FAB") + star(48, 170, 18, "#7ECDB5")),
  nr_find: card("nrfd", "#EAF8F2", "#C8F0E0", magnifier(55, 55) + nb(150, 120, "4", "#FFD166", 52)),
  nr_names: card("nrnm", "#FFF8E8", "#FFE9B8", book(88, 70, 80, "#A8D4F0") + nb(40, 140, "2", "#FF8FAB", 40) + nb(170, 145, "5", "#7ECDB5", 40)),
  nr_detective: card(
    "nrdet",
    "#EAF8F2",
    "#C8F0E0",
    magnifier(40, 50) +
      nb(145, 70, "7", "#FFD166", 48) +
      nb(170, 140, "3", "#FF8FAB", 36) +
      star(55, 160, 22, "#C9A0FF")
  ),
  nr_memory_match: card(
    "nrmem",
    "#F3EEFF",
    "#E0D4FF",
    `<rect x="40" y="70" width="70" height="90" rx="16" fill="#C9A0FF"/>` +
      `<rect x="146" y="70" width="70" height="90" rx="16" fill="#FFE29A"/>` +
      `<text x="75" y="130" text-anchor="middle" font-family="Verdana" font-size="34" font-weight="700" fill="#fff">?</text>` +
      `<text x="181" y="130" text-anchor="middle" font-family="Verdana" font-size="34" font-weight="700" fill="#7E5FB0">5</text>`
  ),
  nr_names_sounds: card(
    "nrns",
    "#FFF8E8",
    "#FFE9B8",
    book(70, 60, 90, "#A8D4F0") +
      `<circle cx="175" cy="150" r="28" fill="#FF8FAB"/>` +
      `<path d="M168 140 L168 160 L185 150 Z" fill="#fff"/>` +
      nb(40, 150, "8", "#7ECDB5", 36)
  ),
  nr_builder: card(
    "nrbuild",
    "#EAF4FF",
    "#C8E0F8",
    nb(50, 80, "2", "#A8D4F0", 56) +
      `<rect x="130" y="78" width="70" height="86" rx="18" fill="none" stroke="#C9A0FF" stroke-width="5" stroke-dasharray="10 8"/>` +
      `<text x="165" y="138" text-anchor="middle" font-family="Verdana" font-size="40" font-weight="700" fill="#C9A0FF">?</text>` +
      nb(150, 175, "8", "#FFD166", 34)
  ),

  cq_1_5: card("cq15", "#EAF8F2", "#C8F0E0", apple(36, 100, 34) + apple(78, 115, 34) + apple(120, 100, 34) + apple(162, 115, 34) + apple(100, 55, 34)),
  cq_1_10: card(
    "cq110",
    "#FFF0E8",
    "#FFDCC8",
    Array.from({ length: 10 }, (_, i) =>
      star(28 + (i % 5) * 40, 70 + Math.floor(i / 5) * 55, 28, ["#FFD166", "#FF8FAB", "#C9A0FF", "#7ECDB5", "#A8D4F0"][i % 5])
    ).join("")
  ),
  cq_familiar: card("cqfam", "#FFF5F0", "#FFE0D0", teddy(70, 85) + star(40, 40, 20) + star(190, 50, 18, "#FF8FAB")),
  cq_match: card("cqmt", "#F0F7FF", "#D6E8FF", apple(40, 100, 36) + apple(85, 100, 36) + nb(150, 85, "2", "#A8D4F0", 60)),
  cq_pictures: card(
    "cqpic",
    "#FFF0F8",
    "#FFDCEC",
    `<rect x="48" y="48" width="160" height="140" rx="24" fill="#fff" opacity="0.55"/>` +
      apple(70, 80, 32) +
      apple(120, 95, 32) +
      apple(95, 140, 32) +
      star(170, 70, 22, "#FFD166")
  ),
  cq_one_to_one: card(
    "cq1to1",
    "#F6F0FC",
    "#E8D5F5",
    apple(40, 70, 30) + nb(40, 130, "1", "#C9A0FF", 36) + apple(110, 70, 30) + nb(110, 130, "2", "#FF8FAB", 36) + apple(180, 70, 30) + nb(180, 130, "3", "#7ECDB5", 36)
  ),
  cq_1_20: card(
    "cq120",
    "#EAF8F2",
    "#C8F0E0",
    nb(40, 70, "10", "#7ECDB5", 48) +
      nb(110, 70, "10", "#A8D4F0", 48) +
      `<text x="128" y="170" text-anchor="middle" font-family="Verdana" font-size="28" font-weight="700" fill="#5B4A7A">20</text>` +
      star(190, 150, 22, "#FFD166")
  ),
  cq_1_30: card(
    "cq130",
    "#FFF0E8",
    "#FFDCC8",
    nb(28, 75, "10", "#FFD166", 42) +
      nb(90, 75, "10", "#FF8FAB", 42) +
      nb(152, 75, "10", "#C9A0FF", 42) +
      `<text x="128" y="175" text-anchor="middle" font-family="Verdana" font-size="30" font-weight="700" fill="#5B4A7A">30</text>`
  ),
  cq_count_1_10: card(
    "cqcnt10",
    "#EAF8F2",
    "#C8F0E0",
    apple(40, 90, 34) + apple(90, 110, 34) + apple(140, 90, 34) + star(190, 120, 26, "#FFD166") +
      `<text x="128" y="70" text-anchor="middle" font-family="Verdana" font-size="22" font-weight="700" fill="#5B4A7A">1–10</text>`
  ),
  cq_count_11_20: card(
    "cqcnt20",
    "#FFF0E8",
    "#FFDCC8",
    `<circle cx="70" cy="110" r="36" fill="#F5D0E8"/>` +
      `<circle cx="58" cy="100" r="6" fill="#5B4A7A"/>` +
      `<circle cx="82" cy="100" r="6" fill="#5B4A7A"/>` +
      apple(140, 90, 30) + apple(180, 110, 30) + apple(155, 140, 28) +
      `<text x="70" y="175" text-anchor="middle" font-family="Verdana" font-size="18" font-weight="700" fill="#7E5FB0">Feed</text>`
  ),
  cq_count_21_30: card(
    "cqcnt30",
    "#EAF4FF",
    "#A8D4F0",
    `<ellipse cx="70" cy="120" rx="34" ry="20" fill="#FFD166"/>` +
      `<ellipse cx="130" cy="100" rx="28" ry="16" fill="#FF8FAB"/>` +
      `<circle cx="180" cy="130" r="16" fill="#fff" opacity="0.7"/>` +
      `<text x="128" y="185" text-anchor="middle" font-family="Verdana" font-size="20" font-weight="700" fill="#5B4A7A">21–30</text>`
  ),
  cq_one_by_one: card(
    "cqobo",
    "#F6F0FC",
    "#E8D5F5",
    apple(40, 70, 30) + nb(40, 130, "1", "#C9A0FF", 36) +
      apple(110, 70, 30) + nb(110, 130, "2", "#FF8FAB", 36) +
      apple(180, 70, 30) + nb(180, 130, "3", "#7ECDB5", 36)
  ),
  cq_around_us: card(
    "cqaru",
    "#FFF8E8",
    "#FFE9B8",
    `<rect x="40" y="55" width="176" height="130" rx="22" fill="#C8E8FF" opacity="0.7"/>` +
      `<rect x="40" y="140" width="176" height="45" fill="#B8E0A8" opacity="0.85"/>` +
      star(70, 80, 24) + star(120, 95, 22, "#FF8FAB") + star(170, 75, 24, "#A8D4F0")
  ),
  cq_sounds: card(
    "cqsnd",
    "#F3EEFF",
    "#E0D4FF",
    `<circle cx="90" cy="120" r="34" fill="#FF8FAB"/>` +
      `<path d="M82 108 L82 132 L102 120 Z" fill="#fff"/>` +
      nb(150, 95, "4", "#C9A0FF", 52) +
      star(190, 160, 20, "#FFD166")
  ),

  nr_meet_11_20: card(
    "nrm1120",
    "#EAF4FF",
    "#C8E0F8",
    nb(40, 90, "11", "#A8D4F0", 48) + nb(105, 75, "15", "#7ECDB5", 52) + nb(170, 95, "20", "#C9A0FF", 48)
  ),
  nr_meet_21_30: card(
    "nrm2130",
    "#FFF8E8",
    "#FFE9B8",
    nb(36, 90, "21", "#FFD166", 48) + nb(100, 75, "25", "#FF8FAB", 52) + nb(168, 95, "30", "#7ECDB5", 48)
  ),
  nr_find_bigger: card(
    "nrfbig",
    "#F3EEFF",
    "#E0D4FF",
    magnifier(45, 55) + nb(145, 110, "24", "#C9A0FF", 58)
  ),

  nt_1_10: card(
    "nt110",
    "#FFF0F4",
    "#FFE0EA",
    crayon(40, 160, -30) +
      `<text x="128" y="130" text-anchor="middle" font-family="Verdana, Geneva, sans-serif" font-size="88" font-weight="700" fill="#FF8FAB" opacity="0.35" stroke="#FF8FAB" stroke-width="3" stroke-dasharray="12 10">8</text>`
  ),
  nt_11_20: card(
    "nt1120",
    "#EAF4FF",
    "#C8E0F8",
    crayon(36, 168, -25) +
      `<text x="128" y="128" text-anchor="middle" font-family="Verdana, Geneva, sans-serif" font-size="72" font-weight="700" fill="#A8D4F0" opacity="0.4" stroke="#7EB8E0" stroke-width="3" stroke-dasharray="10 9">15</text>` +
      `<circle cx="78" cy="78" r="10" fill="#FF8FAB"/>`
  ),
  nt_21_30: card(
    "nt2130",
    "#FFF8E8",
    "#FFE9B8",
    crayon(170, 155, 35) +
      `<text x="118" y="130" text-anchor="middle" font-family="Verdana, Geneva, sans-serif" font-size="68" font-weight="700" fill="#FFD166" opacity="0.45" stroke="#E8B84A" stroke-width="3" stroke-dasharray="10 9">27</text>` +
      `<circle cx="72" cy="86" r="10" fill="#FF8FAB"/>`
  ),
  nt_follow: card(
    "ntfol",
    "#EAF8F2",
    "#C8F0E0",
    `<path d="M60 160 C60 70, 160 70, 160 160" stroke="#7ECDB5" stroke-width="16" fill="none" stroke-linecap="round" stroke-dasharray="16 12"/>` +
      `<circle cx="60" cy="160" r="12" fill="#FFD166"/>` +
      crayon(140, 150)
  ),
  nt_complete: card(
    "ntcomp",
    "#F3EEFF",
    "#E0D4FF",
    `<path d="M70 70 C70 40, 140 40, 140 90 C140 140, 70 140, 70 180" stroke="#C9A0FF" stroke-width="14" fill="none" stroke-linecap="round"/>` +
      `<path d="M70 180 C70 220, 140 220, 140 180" stroke="#C9A0FF" stroke-width="14" fill="none" stroke-linecap="round" stroke-dasharray="8 12" opacity="0.45"/>` +
      crayon(155, 175, 20)
  ),
  nt_freehand: card(
    "ntfree",
    "#FFF0F4",
    "#FFE0EA",
    `<rect x="48" y="55" width="160" height="140" rx="18" fill="#FFFCF8" stroke="#FF8FAB" stroke-width="4"/>` +
      crayon(70, 170, -15) +
      `<path d="M95 90 L95 170 M95 90 C95 70, 135 70, 135 100 C135 130, 95 130, 95 150" stroke="#7E5FB0" stroke-width="10" fill="none" stroke-linecap="round"/>`
  ),

  bc_more_less: card(
    "bcml",
    "#FFF0E8",
    "#FFDCC8",
    apple(40, 90, 30) +
      apple(75, 110, 30) +
      apple(55, 140, 30) +
      apple(150, 100, 30) +
      apple(185, 100, 30) +
      apple(150, 140, 30) +
      apple(185, 140, 30) +
      apple(167, 70, 30) +
      `<text x="100" y="200" text-anchor="middle" font-family="Verdana" font-size="28" font-weight="700" fill="#FF8FAB">&lt;</text>`
  ),
  bc_same: card(
    "bcsame",
    "#EAF8F2",
    "#C8F0E0",
    apple(50, 100, 32) +
      apple(90, 100, 32) +
      apple(70, 145, 32) +
      apple(150, 100, 32) +
      apple(190, 100, 32) +
      apple(170, 145, 32) +
      `<text x="128" y="80" text-anchor="middle" font-family="Verdana" font-size="32" font-weight="700" fill="#7ECDB5">=</text>`
  ),
  bc_big_small: card(
    "bcbs",
    "#F3EEFF",
    "#E0D4FF",
    `<ellipse cx="80" cy="150" rx="50" ry="28" fill="#C9A0FF" opacity="0.85"/>` +
      apple(55, 120, 28) +
      apple(85, 125, 28) +
      apple(70, 95, 28) +
      `<ellipse cx="180" cy="160" rx="28" ry="18" fill="#A8D4F0" opacity="0.85"/>` +
      apple(168, 140, 22)
  ),
  bc_compare: card(
    "bccmp",
    "#F0F7FF",
    "#D6E8FF",
    star(40, 80, 26) +
      star(70, 110, 26) +
      star(50, 140, 26) +
      star(150, 70, 26, "#FF8FAB") +
      star(185, 95, 26, "#FF8FAB") +
      star(150, 120, 26, "#FF8FAB") +
      star(185, 145, 26, "#FF8FAB") +
      star(167, 170, 26, "#FF8FAB")
  ),
  bc_identify_more: card(
    "bcidm",
    "#FFF5F0",
    "#FFE0D0",
    `<rect x="36" y="70" width="80" height="110" rx="20" fill="#fff" opacity="0.45" stroke="#FFD166" stroke-width="4"/>` +
      apple(50, 90, 28) +
      apple(75, 120, 28) +
      `<rect x="140" y="70" width="80" height="110" rx="20" fill="#fff" opacity="0.55" stroke="#7ECDB5" stroke-width="5"/>` +
      apple(152, 85, 26) +
      apple(178, 110, 26) +
      apple(155, 140, 26) +
      star(190, 155, 18, "#FFD166")
  ),

  ia_objects: card(
    "iaobj",
    "#FFF8E8",
    "#FFE9B8",
    apple(40, 110, 30) +
      apple(75, 110, 30) +
      `<text x="118" y="140" font-family="Verdana" font-size="36" font-weight="700" fill="#FFD166">+</text>` +
      apple(145, 110, 30) +
      `<text x="190" y="140" font-family="Verdana" font-size="36" font-weight="700" fill="#FF8FAB">=</text>` +
      nb(200, 95, "3", "#7ECDB5", 40)
  ),
  ia_visual: card(
    "iavis",
    "#EAF8F2",
    "#C8F0E0",
    star(40, 100, 28) +
      star(75, 100, 28) +
      `<text x="115" y="125" font-family="Verdana" font-size="32" font-weight="700" fill="#7ECDB5">+</text>` +
      star(140, 100, 28, "#FF8FAB") +
      `<text x="180" y="125" font-family="Verdana" font-size="32" font-weight="700" fill="#C9A0FF">=</text>` +
      nb(195, 85, "3", "#A8D4F0", 42)
  ),
  ia_picture: card(
    "iapic",
    "#FFF0F4",
    "#FFE0EA",
    `<rect x="40" y="60" width="176" height="130" rx="22" fill="#fff" opacity="0.5"/>` +
      apple(60, 90, 28) +
      apple(95, 90, 28) +
      `<text x="135" y="115" font-family="Verdana" font-size="28" font-weight="700" fill="#FF8FAB">+</text>` +
      apple(155, 90, 28) +
      `<text x="100" y="165" font-family="Verdana" font-size="28" font-weight="700" fill="#C9A0FF">= 3</text>`
  ),
  ia_within_5: card(
    "iaw5",
    "#F3EEFF",
    "#E0D4FF",
    nb(40, 90, "2", "#C9A0FF", 48) +
      `<text x="105" y="130" font-family="Verdana" font-size="36" font-weight="700" fill="#FFD166">+</text>` +
      nb(125, 90, "3", "#FF8FAB", 48) +
      `<text x="185" y="130" font-family="Verdana" font-size="28" font-weight="700" fill="#7ECDB5">&lt;5</text>`
  ),
  ia_within_10: card(
    "iaw10",
    "#EAF4FF",
    "#C8E0F8",
    nb(35, 95, "4", "#A8D4F0", 46) +
      `<text x="100" y="132" font-family="Verdana" font-size="34" font-weight="700" fill="#FFD166">+</text>` +
      nb(120, 95, "5", "#7ECDB5", 46) +
      `<text x="180" y="132" font-family="Verdana" font-size="26" font-weight="700" fill="#FF8FAB">&lt;10</text>`
  ),

  sg_by_qty: card(
    "sgqty",
    "#FFF0E8",
    "#FFDCC8",
    `<rect x="30" y="70" width="70" height="100" rx="18" fill="#FFE29A" opacity="0.7"/>` +
      apple(42, 90, 28) +
      `<rect x="120" y="70" width="100" height="100" rx="18" fill="#C8F0E0" opacity="0.7"/>` +
      apple(135, 85, 26) +
      apple(170, 85, 26) +
      apple(150, 125, 26)
  ),
  sg_count_groups: card(
    "sgcg",
    "#EAF8F2",
    "#C8F0E0",
    star(40, 80, 24) +
      star(70, 80, 24) +
      nb(45, 130, "2", "#7ECDB5", 36) +
      star(140, 80, 24, "#FF8FAB") +
      star(175, 80, 24, "#FF8FAB") +
      star(157, 115, 24, "#FF8FAB") +
      nb(150, 155, "3", "#FF8FAB", 36)
  ),
  sg_groups_2: card("sg2", "#F0F7FF", "#D6E8FF", apple(50, 90, 34) + apple(95, 90, 34) + nb(145, 95, "2", "#A8D4F0", 55) + tray(40, 160, 120)),
  sg_groups_3: card("sg3", "#F6F0FC", "#E8D5F5", apple(40, 85, 30) + apple(80, 85, 30) + apple(60, 125, 30) + nb(145, 95, "3", "#C9A0FF", 55) + tray(35, 175, 110)),
  sg_equal: card(
    "sgeq",
    "#FFF8E8",
    "#FFE9B8",
    star(40, 100, 28) +
      star(75, 100, 28) +
      `<text x="120" y="125" font-family="Verdana" font-size="34" font-weight="700" fill="#FFD166">=</text>` +
      apple(145, 95, 30) +
      apple(185, 95, 30)
  ),

  ns_1_5: card(
    "ns15",
    "#EAF4FF",
    "#C8E0F8",
    nb(20, 95, "1", "#FFD166", 38) + nb(62, 95, "2", "#FF8FAB", 38) + nb(104, 95, "3", "#C9A0FF", 38) + nb(146, 95, "4", "#7ECDB5", 38) + nb(188, 95, "5", "#A8D4F0", 38)
  ),
  ns_1_10: card(
    "ns110",
    "#FFF0F4",
    "#FFE0EA",
    nb(16, 70, "1", "#FFD166", 32) +
      nb(52, 70, "2", "#FF8FAB", 32) +
      nb(88, 70, "3", "#C9A0FF", 32) +
      nb(124, 70, "4", "#7ECDB5", 32) +
      nb(160, 70, "5", "#A8D4F0", 32) +
      nb(34, 125, "6", "#FFD166", 32) +
      nb(70, 125, "7", "#FF8FAB", 32) +
      nb(106, 125, "8", "#C9A0FF", 32) +
      nb(142, 125, "9", "#7ECDB5", 32) +
      nb(178, 125, "10", "#A8D4F0", 34)
  ),
  ns_1_20: card(
    "ns120",
    "#EAF8F2",
    "#C8F0E0",
    nb(30, 95, "16", "#7ECDB5", 44) +
      nb(90, 95, "17", "#A8D4F0", 44) +
      nb(150, 95, "18", "#C9A0FF", 44) +
      `<text x="210" y="128" font-family="Verdana" font-size="22" font-weight="700" fill="#FFD166">…</text>`
  ),
  ns_forward: card(
    "nsfwd",
    "#EAF8F2",
    "#C8F0E0",
    nb(40, 95, "1", "#7ECDB5", 44) +
      nb(95, 95, "2", "#A8D4F0", 44) +
      nb(150, 95, "3", "#C9A0FF", 44) +
      `<path d="M200 115 L225 115" stroke="#FFD166" stroke-width="8" stroke-linecap="round"/>` +
      `<polygon points="220,100 240,115 220,130" fill="#FFD166"/>`
  ),
  ns_next: card("nsnext", "#F3EEFF", "#E0D4FF", nb(40, 95, "4", "#C9A0FF", 48) + nb(100, 95, "5", "#FF8FAB", 48) + nb(160, 95, "?", "#FFD166", 48)),
  ns_before_after: card(
    "nsba",
    "#FFF8E8",
    "#FFE9B8",
    nb(30, 95, "3", "#A8D4F0", 44) +
      `<text x="90" y="130" font-family="Verdana" font-size="22" font-weight="700" fill="#8A7AA8">&lt;</text>` +
      nb(105, 85, "4", "#FFD166", 52) +
      `<text x="170" y="130" font-family="Verdana" font-size="22" font-weight="700" fill="#8A7AA8">&gt;</text>` +
      nb(180, 95, "5", "#FF8FAB", 44)
  ),

  mp_miss_5: card("mpm5", "#F0F7FF", "#D6E8FF", nb(30, 95, "1", "#A8D4F0", 42) + nb(80, 95, "2", "#7ECDB5", 42) + nb(130, 95, "?", "#FFD166", 42) + nb(180, 95, "4", "#FF8FAB", 42)),
  mp_miss_10: card(
    "mpm10",
    "#FFF0E8",
    "#FFDCC8",
    nb(20, 95, "6", "#FFD166", 40) + nb(68, 95, "7", "#FF8FAB", 40) + nb(116, 95, "?", "#C9A0FF", 40) + nb(164, 95, "9", "#7ECDB5", 40) + nb(205, 110, "10", "#A8D4F0", 36)
  ),
  mp_miss_20: card(
    "mpm20",
    "#F0F7FF",
    "#D6E8FF",
    nb(20, 95, "14", "#A8D4F0", 40) + nb(72, 95, "15", "#7ECDB5", 40) + nb(124, 95, "?", "#FFD166", 40) + nb(176, 95, "17", "#FF8FAB", 40)
  ),
  mp_miss_30: card(
    "mpm30",
    "#F6F0FC",
    "#E8D5F5",
    nb(20, 95, "25", "#C9A0FF", 40) + nb(72, 95, "26", "#FF8FAB", 40) + nb(124, 95, "?", "#FFD166", 40) + nb(176, 95, "28", "#7ECDB5", 40)
  ),
  mp_complete: card(
    "mpcomp",
    "#EAF8F2",
    "#C8F0E0",
    nb(35, 100, "2", "#7ECDB5", 44) + nb(90, 100, "3", "#A8D4F0", 44) + nb(145, 100, "_", "#E8D5F5", 44) + nb(195, 100, "5", "#FF8FAB", 44)
  ),
  mp_comes_next: card("mpnext", "#F6F0FC", "#E8D5F5", star(40, 100, 30) + star(90, 100, 30, "#FF8FAB") + star(140, 100, 30) + nb(185, 95, "?", "#FFD166", 48)),
  mp_patterns: card(
    "mppat",
    "#FFF0F4",
    "#FFE0EA",
    apple(30, 100, 28) + star(70, 100, 28) + apple(110, 100, 28) + star(150, 100, 28) + nb(190, 95, "?", "#C9A0FF", 42)
  ),

  bmc_one_many: card(
    "bmcom",
    "#EAF8F2",
    "#C8F0E0",
    apple(50, 100, 40) +
      `<text x="55" y="175" font-family="Verdana" font-size="16" font-weight="700" fill="#7ECDB5">ONE</text>` +
      apple(130, 85, 26) +
      apple(165, 85, 26) +
      apple(145, 120, 26) +
      apple(180, 120, 26) +
      `<text x="145" y="175" font-family="Verdana" font-size="16" font-weight="700" fill="#FF8FAB">MANY</text>`
  ),
  bmc_zero: card(
    "bmc0",
    "#F0F7FF",
    "#D6E8FF",
    nb(88, 70, "0", "#A8D4F0", 70) +
      `<rect x="60" y="160" width="130" height="40" rx="14" fill="#fff" opacity="0.5" stroke="#C9A0FF" stroke-width="3" stroke-dasharray="8 6"/>` +
      `<text x="125" y="186" text-anchor="middle" font-family="Verdana" font-size="16" font-weight="700" fill="#8A7AA8">none</text>`
  ),
  bmc_all_some: card(
    "bmcas",
    "#FFF8E8",
    "#FFE9B8",
    star(40, 80, 24) +
      star(75, 80, 24) +
      star(110, 80, 24) +
      star(145, 80, 24) +
      star(180, 80, 24) +
      `<text x="50" y="140" font-family="Verdana" font-size="18" font-weight="700" fill="#FFD166">ALL</text>` +
      star(40, 155, 24, "#FF8FAB") +
      star(75, 155, 24, "#FF8FAB") +
      `<text x="120" y="175" font-family="Verdana" font-size="18" font-weight="700" fill="#FF8FAB">SOME</text>`
  ),
  bmc_same_diff: card(
    "bmcsd",
    "#FFF0E8",
    "#FFDCC8",
    apple(40, 90, 32) +
      apple(80, 90, 32) +
      `<text x="55" y="150" font-family="Verdana" font-size="14" font-weight="700" fill="#7ECDB5">same</text>` +
      apple(145, 85, 32) +
      star(185, 90, 32) +
      `<text x="150" y="150" font-family="Verdana" font-size="14" font-weight="700" fill="#FF8FAB">diff</text>`
  ),
  bmc_part_whole: card(
    "bmcpw",
    "#F3EEFF",
    "#E0D4FF",
    `<circle cx="128" cy="120" r="70" fill="#C9A0FF" opacity="0.35"/>` +
      `<path d="M128 50 A70 70 0 0 1 128 190 Z" fill="#FF8FAB" opacity="0.75"/>` +
      `<path d="M128 50 A70 70 0 0 0 128 190 Z" fill="#A8D4F0" opacity="0.75"/>` +
      `<text x="95" y="125" font-family="Verdana" font-size="16" font-weight="700" fill="#fff">part</text>` +
      `<text x="140" y="125" font-family="Verdana" font-size="16" font-weight="700" fill="#fff">part</text>`
  ),

  mg_match: card("mgm", "#FFF0F4", "#FFE0EA", nb(45, 85, "3", "#FF8FAB", 50) + apple(140, 80, 36) + apple(175, 100, 30) + apple(150, 125, 30) + star(60, 160, 20, "#FFD166")),
  mg_count_tap: card(
    "mgct",
    "#EAF8F2",
    "#C8F0E0",
    star(50, 70, 28) +
      star(100, 55, 28, "#FF8FAB") +
      star(150, 70, 28, "#C9A0FF") +
      `<g transform="translate(95,130)"><ellipse cx="30" cy="50" rx="28" ry="10" fill="#5B4A7A" opacity="0.12"/><circle cx="30" cy="30" r="26" fill="#FFD166"/><circle cx="22" cy="22" r="8" fill="#fff" opacity="0.35"/><text x="30" y="38" text-anchor="middle" font-family="Verdana" font-size="14" font-weight="700" fill="#fff">TAP</text></g>`
  ),
  mg_find: card("mgfind", "#EAF4FF", "#C8E0F8", magnifier(40, 50) + nb(140, 100, "7", "#A8D4F0", 58) + star(200, 60, 18, "#FFD166")),
  mg_puzzle: card(
    "mgpuz",
    "#F6F0FC",
    "#E8D5F5",
    `<path d="M40 80 h50 v40 h-20 a12 12 0 1 0 0 24 h20 v40 h-50 a12 12 0 1 1 0 -24 v-16 a12 12 0 1 1 0 -24 z" fill="#C9A0FF"/>` +
      `<path d="M110 80 h50 a12 12 0 1 1 0 24 v16 a12 12 0 1 1 0 24 h-50 v-40 h20 a12 12 0 1 0 0 -24 h-20 z" fill="#FFD166"/>` +
      nb(175, 120, "5", "#7ECDB5", 44)
  ),
  mg_count: card(
    "mgcnt",
    "#FFF8E8",
    "#FFE9B8",
    apple(40, 70, 28) +
      apple(80, 70, 28) +
      apple(120, 70, 28) +
      apple(60, 110, 28) +
      apple(100, 110, 28) +
      apple(140, 110, 28) +
      apple(80, 150, 28) +
      nb(175, 120, "7", "#FF8FAB", 48)
  ),
  mg_quiz: card(
    "mgquiz",
    "#FFF0E8",
    "#FFDCC8",
    nb(40, 90, "1", "#FFD166", 44) +
      `<text x="95" y="125" font-family="Verdana" font-size="32" font-weight="700" fill="#FF8FAB">+</text>` +
      nb(115, 90, "2", "#7ECDB5", 44) +
      `<text x="175" y="125" font-family="Verdana" font-size="32" font-weight="700" fill="#C9A0FF">?</text>` +
      star(190, 160, 22)
  ),
  mg_memory: card(
    "mgmem",
    "#F0F7FF",
    "#D6E8FF",
    `<rect x="40" y="70" width="70" height="90" rx="16" fill="#A8D4F0"/><text x="75" y="128" text-anchor="middle" font-family="Verdana" font-size="36" font-weight="700" fill="#fff">3</text>` +
      `<rect x="140" y="70" width="70" height="90" rx="16" fill="#C9A0FF"/><circle cx="175" cy="105" r="10" fill="#fff" opacity="0.5"/><circle cx="175" cy="130" r="10" fill="#fff" opacity="0.5"/>`
  ),
};

let n = 0;
for (const [id, svg] of Object.entries(icons)) {
  fs.writeFileSync(path.join(dir, id + ".svg"), svg);
  n += 1;
}
console.log("Wrote", n, "subcategory icons to", dir);
