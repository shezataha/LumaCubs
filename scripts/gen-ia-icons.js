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

function card(id, bg0, bg1, body) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256" fill="none">
<defs>
  <linearGradient id="bg${id}" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="${bg0}"/>
    <stop offset="100%" stop-color="${bg1}"/>
  </linearGradient>
</defs>
<rect width="256" height="256" rx="56" fill="url(#bg${id})"/>
<circle cx="48" cy="52" r="10" fill="#fff" opacity="0.35"/>
${body}
</svg>`;
}

const icons = {
  ia_together: card(
    "tog",
    "#FFF8E8",
    "#FFE9B8",
    `<circle cx="70" cy="130" r="22" fill="#FF6B6B"/>
     <circle cx="110" cy="130" r="22" fill="#FF6B6B"/>
     <path d="M150 150h70l-8 50H158z" fill="#D4A574"/>
     <circle cx="180" cy="120" r="18" fill="#FF6B6B"/>`
  ),
  ia_one_more: card(
    "one",
    "#EAF8F2",
    "#FFE8F0",
    `<ellipse cx="100" cy="150" rx="40" ry="28" fill="#FFE8DA"/>
     <circle cx="100" cy="110" r="28" fill="#FFE8DA"/>
     <circle cx="180" cy="140" r="26" fill="#FF8FAB"/>
     <text x="180" y="148" text-anchor="middle" font-size="22" font-weight="700" fill="#fff">+1</text>`
  ),
  ia_train: card(
    "trn",
    "#EAF4FF",
    "#C8F0E0",
    `<rect x="40" y="120" width="90" height="40" rx="10" fill="#FF8FAB"/>
     <rect x="50" y="90" width="40" height="35" rx="8" fill="#FFD166"/>
     <circle cx="70" cy="168" r="12" fill="#5B4A7A"/>
     <circle cx="110" cy="168" r="12" fill="#5B4A7A"/>
     <circle cx="170" cy="130" r="18" fill="#FFE8DA"/>
     <circle cx="210" cy="130" r="18" fill="#FFD166"/>`
  ),
  ia_magic: card(
    "mag",
    "#C9A0FF",
    "#7E5FB0",
    `<ellipse cx="128" cy="180" rx="60" ry="16" fill="#5B4A7A"/>
     <path d="M90 170h76l-10-70H100z" fill="#3D3550"/>
     <circle cx="170" cy="90" r="14" fill="#FFD166"/>
     <path d="M60 80l8 20 20 4-20 4-8 20-8-20-20-4 20-4z" fill="#FFD166"/>`
  ),
  ia_story: card(
    "sty",
    "#FFF0F5",
    "#E8D5F5",
    `<circle cx="90" cy="110" r="28" fill="#FFE8DA"/>
     <ellipse cx="90" cy="160" rx="34" ry="24" fill="#FF8FAB"/>
     <circle cx="170" cy="130" r="20" fill="#FFD8C2"/>
     <circle cx="200" cy="150" r="16" fill="#FFD8C2"/>
     <circle cx="155" cy="155" r="16" fill="#FFD8C2"/>`
  ),
  ia_build: card(
    "bld",
    "#FFE29A",
    "#E8D5F5",
    `<rect x="40" y="100" width="50" height="50" rx="12" fill="#A8D4F0"/>
     <text x="65" y="135" text-anchor="middle" fill="#fff" font-size="28" font-weight="700">2</text>
     <circle cx="115" cy="125" r="14" fill="#7ECDB5"/>
     <rect x="108" y="112" width="14" height="26" rx="3" fill="#fff"/>
     <rect x="102" y="118" width="26" height="14" rx="3" fill="#fff"/>
     <rect x="145" y="100" width="50" height="50" rx="12" fill="#C9A0FF"/>
     <text x="170" y="135" text-anchor="middle" fill="#fff" font-size="28" font-weight="700">3</text>
     <rect x="100" y="170" width="56" height="40" rx="12" fill="#FF8FAB" stroke="#fff" stroke-width="3" stroke-dasharray="6 4"/>`
  ),
};

Object.entries(icons).forEach(([name, svg]) => {
  fs.writeFileSync(path.join(dir, name + ".svg"), svg);
  console.log("wrote", name);
});
