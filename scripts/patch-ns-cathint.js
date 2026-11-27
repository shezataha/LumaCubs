const fs = require("fs");
const p = "le-numbers-math.js";
let s = fs.readFileSync(p, "utf8");
const marker = 'cat.id === "sorting_grouping"';
const start = s.indexOf(marker);
if (start < 0) {
  console.error("sorting_grouping hint not found");
  process.exit(1);
}
const semi = s.indexOf(";", start);
const chunk = s.slice(start, semi + 1);
console.log("OLD:", JSON.stringify(chunk));
const repl =
  'cat.id === "sorting_grouping"\n' +
  '                ? "8 unique sorting & grouping mini-games · tap to play"\n' +
  '                : (cat.id === "number_sequencing"\n' +
  '                  ? "7 unique number order adventures · tap to play"\n' +
  '                  : "Level A (2–3) and Level B (3–4) · tap to play")));';
s = s.slice(0, start) + repl + s.slice(semi + 1);
fs.writeFileSync(p, s);
console.log("patched");
