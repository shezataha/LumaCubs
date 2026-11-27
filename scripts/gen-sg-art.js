const fs = require("fs");
const path = require("path");

const dir = path.join(
  "assets",
  "home",
  "little-explorers",
  "numbers-math",
  "subcategories"
);
fs.mkdirSync(dir, { recursive: true });

function card(id, bg, accent, body) {
  return [
    '<svg xmlns="http://www.w3.org/2000/svg" width="480" height="360" viewBox="0 0 480 360" role="img">',
    "<defs>",
    `<linearGradient id="g${id}" x1="0" y1="0" x2="1" y2="1">`,
    `<stop offset="0%" stop-color="${bg}"/>`,
    `<stop offset="100%" stop-color="${accent}"/>`,
    "</linearGradient>",
    "</defs>",
    `<rect width="480" height="360" rx="36" fill="url(#g${id})"/>`,
    body,
    "</svg>",
  ].join("");
}

const files = {
  sg_colour_factory: card(
    "cf",
    "#FFF0F5",
    "#FFD0DC",
    [
      '<circle cx="120" cy="180" r="40" fill="#FF6B6B"/>',
      '<circle cx="220" cy="180" r="40" fill="#A8D4F0"/>',
      '<circle cx="320" cy="180" r="40" fill="#FFD166"/>',
      '<circle cx="380" cy="120" r="18" fill="#7ECDB5"/>',
      '<rect x="80" y="250" width="320" height="28" rx="10" fill="#C9A0FF" opacity=".5"/>',
    ].join("")
  ),
  sg_shape_city: card(
    "sc",
    "#F0F7FF",
    "#D6E8FF",
    [
      '<rect x="90" y="160" width="70" height="70" rx="8" fill="#FFD166"/>',
      '<circle cx="230" cy="195" r="36" fill="#FF8FAB"/>',
      '<path d="M300 230 L340 150 L380 230Z" fill="#7ECDB5"/>',
      '<rect x="120" y="250" width="40" height="50" fill="#A8D4F0"/>',
      '<rect x="200" y="230" width="50" height="70" fill="#C9A0FF"/>',
      '<rect x="300" y="240" width="45" height="60" fill="#FFB86B"/>',
    ].join("")
  ),
  sg_habitats: card(
    "hb",
    "#EAF8F3",
    "#C8F0E0",
    [
      '<ellipse cx="120" cy="220" rx="70" ry="40" fill="#4F9B78"/>',
      '<ellipse cx="280" cy="200" rx="80" ry="50" fill="#A8D4F0"/>',
      '<circle cx="380" cy="160" r="36" fill="#FFFCF8"/>',
      '<circle cx="140" cy="160" r="22" fill="#E8B86D"/>',
      '<circle cx="260" cy="170" r="18" fill="#7EB8E0"/>',
    ].join("")
  ),
  sg_size_safari: card(
    "sz",
    "#FFF8E8",
    "#FFE29A",
    [
      '<ellipse cx="120" cy="210" rx="28" ry="22" fill="#C9B8D8"/>',
      '<ellipse cx="220" cy="200" rx="40" ry="30" fill="#C9B8D8"/>',
      '<ellipse cx="340" cy="190" rx="55" ry="40" fill="#C9B8D8"/>',
      '<circle cx="380" cy="100" r="16" fill="#FFD166"/>',
    ].join("")
  ),
  sg_room_organize: card(
    "rm",
    "#F6F0FC",
    "#E8D5F5",
    [
      '<rect x="70" y="120" width="120" height="160" rx="12" fill="#FFD8C2"/>',
      '<rect x="220" y="140" width="90" height="140" rx="10" fill="#A8D4F0"/>',
      '<rect x="340" y="160" width="80" height="120" rx="10" fill="#7ECDB5"/>',
      '<circle cx="120" cy="180" r="18" fill="#E8B86D"/>',
    ].join("")
  ),
  sg_garden_group: card(
    "gg",
    "#E8F6E8",
    "#C8F0E0",
    [
      '<circle cx="140" cy="180" r="28" fill="#FF8FAB"/>',
      '<circle cx="230" cy="170" r="30" fill="#FFD166"/>',
      '<circle cx="320" cy="185" r="26" fill="#7ECDB5"/>',
      '<rect x="220" y="210" width="20" height="50" fill="#4F9B78"/>',
      '<ellipse cx="240" cy="280" rx="120" ry="24" fill="#8B5A2B" opacity=".35"/>',
    ].join("")
  ),
  sg_belong: card(
    "bl",
    "#F3EEFF",
    "#E0D0F5",
    [
      '<rect x="90" y="140" width="70" height="50" rx="8" fill="#A8D4F0"/>',
      '<rect x="180" y="150" width="50" height="40" rx="8" fill="#FFD166"/>',
      '<circle cx="300" cy="170" r="28" fill="#FF8FAB"/>',
      '<rect x="350" y="150" width="40" height="50" rx="6" fill="#7ECDB5"/>',
      '<rect x="120" y="230" width="240" height="60" rx="16" fill="#fff" opacity=".7"/>',
    ].join("")
  ),
  sg_odd_one: card(
    "od",
    "#FFF5F0",
    "#FFD8C8",
    [
      '<circle cx="120" cy="180" r="34" fill="#FF6B6B"/>',
      '<circle cx="220" cy="180" r="34" fill="#FFB86B"/>',
      '<circle cx="320" cy="180" r="34" fill="#FFD166"/>',
      '<rect x="360" y="150" width="55" height="55" rx="10" fill="#C9A0FF"/>',
      '<circle cx="400" cy="100" r="14" fill="#FFD166"/>',
    ].join("")
  ),
};

for (const [name, svg] of Object.entries(files)) {
  fs.writeFileSync(path.join(dir, name + ".svg"), svg);
}
console.log("wrote", Object.keys(files).length, "SG art cards");
