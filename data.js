/* Lumacubs — daily-life essentials for every letter */
const ALPHABET = [
  { letter: "A", word: "Apple",      emoji: "🍎" },
  { letter: "B", word: "Ball",       emoji: "⚽" },
  { letter: "C", word: "Cup",        emoji: "☕" },
  { letter: "D", word: "Door",       emoji: "🚪" },
  { letter: "E", word: "Egg",        emoji: "🥚" },
  { letter: "F", word: "Fork",       emoji: "🍴" },
  { letter: "G", word: "Grapes",     emoji: "🍇" },
  { letter: "H", word: "Hat",        emoji: "🎩" },
  { letter: "I", word: "Ice Cream",  emoji: "🍦" },
  { letter: "J", word: "Juice",      emoji: "🧃" },
  { letter: "K", word: "Keys",       emoji: "🔑" },
  { letter: "L", word: "Lamp",       emoji: "💡" },
  { letter: "M", word: "Milk",       emoji: "🥛" },
  { letter: "N", word: "Napkin",     emoji: "🧻" },
  { letter: "O", word: "Orange",     emoji: "🍊" },
  { letter: "P", word: "Plate",      emoji: "🍽️" },
  { letter: "Q", word: "Quilt",      emoji: "🛏️" },
  { letter: "R", word: "Rice",       emoji: "🍚" },
  { letter: "S", word: "Soap",       emoji: "🧼" },
  { letter: "T", word: "Toothbrush", emoji: "🪥" },
  { letter: "U", word: "Umbrella",   emoji: "☂️" },
  { letter: "V", word: "Vegetables", emoji: "🥦" },
  { letter: "W", word: "Water",      emoji: "💧" },
  { letter: "X", word: "Xylophone",  emoji: "🎵" },
  { letter: "Y", word: "Yogurt",     emoji: "🥣" },
  { letter: "Z", word: "Zipper",     emoji: "🧥" },
];

/* Phonics sounds for each letter (short vowel / consonant sound) */
const PHONICS = {
  A: "ah", B: "buh", C: "kuh", D: "duh", E: "eh", F: "fuh",
  G: "guh", H: "huh", I: "ih", J: "juh", K: "kuh", L: "luh",
  M: "muh", N: "nuh", O: "oh", P: "puh", Q: "kwuh", R: "ruh",
  S: "sss", T: "tuh", U: "uh", V: "vuh", W: "wuh", X: "ks",
  Y: "yuh", Z: "zzz",
};

/* Counting 1–100 — number, spoken word name, and a fun emoji */
const NUMBER_ONES = [
  "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
];
const NUMBER_TEENS = [
  "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen",
  "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen",
];
const NUMBER_TENS = [
  "", "", "Twenty", "Thirty", "Forty", "Fifty",
  "Sixty", "Seventy", "Eighty", "Ninety",
];
const COUNT_EMOJIS = [
  "⭐", "🔵", "🟢", "🟡", "🟣", "🟠", "❤️", "💎", "🌟", "🎈",
  "🍎", "🐶", "🌸", "🦋", "🐟", "🌈", "🍭", "🧁", "🧸", "🚀",
];

/* Cute object themes for interactive counting (1–20) */
const COUNT_THEMES = [
  { emoji: "🍎", label: "apples",    color: "#ff6b6b" },
  { emoji: "⭐", label: "stars",     color: "#ffd93d" },
  { emoji: "🎈", label: "balloons",  color: "#ff6b9d" },
  { emoji: "🧸", label: "teddy bears", color: "#d4a574" },
  { emoji: "🐶", label: "puppies",   color: "#ffa94d" },
  { emoji: "🐱", label: "kittens",   color: "#ff922b" },
  { emoji: "🦋", label: "butterflies", color: "#a78bfa" },
  { emoji: "🐟", label: "fish",      color: "#4dabf7" },
  { emoji: "🌸", label: "flowers",   color: "#f783ac" },
  { emoji: "🧁", label: "cupcakes",  color: "#ff8787" },
  { emoji: "🚗", label: "cars",      color: "#74c0fc" },
  { emoji: "🚀", label: "rockets",   color: "#845ef7" },
  { emoji: "🌈", label: "rainbows",  color: "#63e6be" },
  { emoji: "🍭", label: "lollipops", color: "#ff6bcb" },
  { emoji: "🏀", label: "balls",     color: "#ff922b" },
  { emoji: "🦆", label: "ducks",     color: "#fcc419" },
  { emoji: "🐸", label: "frogs",     color: "#51cf66" },
  { emoji: "🐰", label: "bunnies",   color: "#e599f7" },
  { emoji: "🍌", label: "bananas",   color: "#ffd43b" },
  { emoji: "💎", label: "gems",      color: "#3bc9db" },
];

function numberWord(n) {
  n = n | 0;
  if (n < 1 || n > 100) return String(n);
  if (n === 100) return "One Hundred";
  if (n < 10) return NUMBER_ONES[n];
  if (n < 20) return NUMBER_TEENS[n - 10];
  const tens = (n / 10) | 0;
  const ones = n % 10;
  return ones ? NUMBER_TENS[tens] + "-" + NUMBER_ONES[ones] : NUMBER_TENS[tens];
}

const NUMBERS = Array.from({ length: 100 }, (_, i) => {
  const n = i + 1;
  const theme = COUNT_THEMES[(n - 1) % COUNT_THEMES.length];
  return {
    n,
    word: numberWord(n),
    emoji: n <= 20 ? theme.emoji : COUNT_EMOJIS[i % COUNT_EMOJIS.length],
    theme: n <= 20 ? theme : null,
  };
});

const NUMBERS_1_20 = NUMBERS.slice(0, 20);

/* Digit glyphs for tracing (local box ~0–90 x 40–240), composed into 1–30 */
const TRACE_GLYPHS = {
  0: {
    paths: ["M 45 70 Q 14 70 14 140 Q 14 210 45 210 Q 76 210 76 140 Q 76 70 45 70"],
    start: { x: 45, y: 70 },
  },
  1: {
    paths: ["M 45 48 L 45 236"],
    start: { x: 45, y: 48 },
  },
  2: {
    paths: ["M 16 78 Q 16 42 45 42 Q 78 42 78 78 Q 78 118 18 168 L 78 236"],
    start: { x: 16, y: 78 },
  },
  3: {
    paths: ["M 18 70 Q 18 42 45 42 Q 78 42 78 78 Q 78 110 50 118 Q 78 126 78 168 Q 78 220 45 220 Q 18 220 18 190"],
    start: { x: 18, y: 70 },
  },
  4: {
    paths: ["M 70 42 L 14 168 L 80 168", "M 70 42 L 70 236"],
    start: { x: 70, y: 42 },
  },
  5: {
    paths: ["M 74 48 L 20 48 L 16 128 Q 16 108 45 108 Q 78 108 78 168 Q 78 228 45 228 Q 16 228 16 188"],
    start: { x: 74, y: 48 },
  },
  6: {
    paths: ["M 66 58 Q 16 90 16 160 Q 16 230 45 230 Q 78 230 78 176 Q 78 128 45 128 Q 24 128 24 160"],
    start: { x: 66, y: 58 },
  },
  7: {
    paths: ["M 14 52 L 78 52 L 40 236"],
    start: { x: 14, y: 52 },
  },
  8: {
    paths: ["M 45 42 Q 78 42 78 90 Q 78 124 45 140 Q 12 156 12 198 Q 12 240 45 240 Q 78 240 78 198 Q 78 156 45 140 Q 12 124 12 90 Q 12 42 45 42"],
    start: { x: 45, y: 42 },
  },
  9: {
    paths: ["M 66 160 Q 66 108 45 108 Q 14 108 14 156 Q 14 204 45 204 Q 74 204 74 156 L 74 58 Q 74 42 45 42 Q 18 42 14 78"],
    start: { x: 66, y: 160 },
  },
};

/* Shift absolute M/L/Q path coordinates by dx (no SVG transforms needed) */
function offsetPathD(d, dx) {
  if (!dx) return d;
  return d.replace(/([MLQ])([^MLQ]*)/gi, (_, cmd, body) => {
    const nums = body.trim().split(/[\s,]+/).filter(Boolean).map(parseFloat);
    const out = nums.map((v, i) => (i % 2 === 0 ? Math.round((v + dx) * 100) / 100 : v));
    return cmd + " " + out.join(" ");
  });
}

function buildTraceNumber(n) {
  const digits = String(n).split("").map(d => parseInt(d, 10));
  const two = digits.length > 1;
  const slots = digits.map((digit, i) => ({
    digit,
    dx: two ? 12 + i * 96 : 55,
  }));
  const paths = [];
  let start = null;
  slots.forEach((slot, idx) => {
    const glyph = TRACE_GLYPHS[slot.digit];
    glyph.paths.forEach(d => {
      paths.push(offsetPathD(d, slot.dx));
    });
    if (idx === 0) {
      start = { x: glyph.start.x + slot.dx, y: glyph.start.y };
    }
  });
  const tip = two
    ? `Trace ${digits[0]}, then ${digits[1]}`
    : (
      [
        "",
        "Start at the top and go straight down",
        "Curve across the top, then slide down and across",
        "Make two bumps from top to bottom",
        "Down the slant, across, then down the tall line",
        "Across the top, down, then around the belly",
        "Curl down from the top and loop around",
        "Across the top, then down the diagonal",
        "Trace the top loop, then the bottom loop",
        "Around the circle, then down the stick",
      ][n] || "Follow the dots"
    );
  return {
    n,
    word: numberWord(n),
    paths,
    start,
    tip,
  };
}

/* Traceable numbers 1–30 */
const TRACE_NUMBERS = Array.from({ length: 30 }, (_, i) => buildTraceNumber(i + 1));

/* Extra fruits & vegetables for coloring and matching games */
const FRUITS = [
  { name: "Apple",      emoji: "🍎", color: "#ff3b30" },
  { name: "Banana",     emoji: "🍌", color: "#ffcc00" },
  { name: "Orange",     emoji: "🍊", color: "#ff9500" },
  { name: "Grapes",     emoji: "🍇", color: "#af52de" },
  { name: "Strawberry", emoji: "🍓", color: "#ff2d55" },
  { name: "Watermelon", emoji: "🍉", color: "#34c759" },
  { name: "Mango",      emoji: "🥭", color: "#ff9500" },
  { name: "Pineapple",  emoji: "🍍", color: "#ffcc00" },
  { name: "Peach",      emoji: "🍑", color: "#ff9f89" },
  { name: "Cherry",     emoji: "🍒", color: "#ff3b30" },
  { name: "Lemon",      emoji: "🍋", color: "#ffcc00" },
  { name: "Coconut",    emoji: "🥥", color: "#8b5a2b" },
  { name: "Avocado",    emoji: "🥑", color: "#34c759" },
];

const VEGETABLES = [
  { name: "Carrot",     emoji: "🥕", color: "#ff9500" },
  { name: "Broccoli",   emoji: "🥦", color: "#34c759" },
  { name: "Tomato",     emoji: "🍅", color: "#ff3b30" },
  { name: "Corn",       emoji: "🌽", color: "#ffcc00" },
  { name: "Cucumber",   emoji: "🥒", color: "#34c759" },
  { name: "Potato",     emoji: "🥔", color: "#c4a882" },
  { name: "Onion",      emoji: "🧅", color: "#d4a574" },
  { name: "Pepper",     emoji: "🌶️", color: "#ff3b30" },
  { name: "Eggplant",   emoji: "🍆", color: "#af52de" },
  { name: "Garlic",     emoji: "🧄", color: "#f5f5dc" },
  { name: "Mushroom",   emoji: "🍄", color: "#d4a574" },
  { name: "Lettuce",    emoji: "🥬", color: "#34c759" },
  { name: "Pumpkin",    emoji: "🎃", color: "#ff9500" },
];

const FRUITS_VEGGIES = [...FRUITS, ...VEGETABLES];

/* Poems — read aloud line by line with highlighting.
   Classic nursery rhymes are traditional/public domain. */
const POEMS = [
  {
    id: "twinkle",
    title: "Twinkle, Twinkle, Little Star",
    emoji: "⭐",
    lines: [
      "Twinkle, twinkle, little star,",
      "How I wonder what you are!",
      "Up above the world so high,",
      "Like a diamond in the sky.",
      "Twinkle, twinkle, little star,",
      "How I wonder what you are!",
    ],
  },
  {
    id: "baa",
    title: "Baa Baa Black Sheep",
    emoji: "🐑",
    lines: [
      "Baa, baa, black sheep,",
      "Have you any wool?",
      "Yes, sir, yes, sir,",
      "Three bags full.",
      "One for the master,",
      "One for the dame,",
      "And one for the little boy",
      "Who lives down the lane.",
    ],
  },
  {
    id: "humpty",
    title: "Humpty Dumpty",
    emoji: "🥚",
    lines: [
      "Humpty Dumpty sat on a wall,",
      "Humpty Dumpty had a great fall.",
      "All the king's horses and all the king's men",
      "Couldn't put Humpty together again.",
    ],
  },
  {
    id: "mary",
    title: "Mary Had a Little Lamb",
    emoji: "🐑",
    lines: [
      "Mary had a little lamb,",
      "Its fleece was white as snow;",
      "And everywhere that Mary went,",
      "The lamb was sure to go.",
      "It followed her to school one day,",
      "Which was against the rule;",
      "It made the children laugh and play,",
      "To see a lamb at school.",
    ],
  },
  {
    id: "jack",
    title: "Jack and Jill",
    emoji: "🪣",
    lines: [
      "Jack and Jill went up the hill",
      "To fetch a pail of water.",
      "Jack fell down and broke his crown,",
      "And Jill came tumbling after.",
    ],
  },
  {
    id: "rowboat",
    title: "Row, Row, Row Your Boat",
    emoji: "🚣",
    lines: [
      "Row, row, row your boat,",
      "Gently down the stream.",
      "Merrily, merrily, merrily, merrily,",
      "Life is but a dream.",
    ],
  },
  {
    id: "spider",
    title: "Itsy Bitsy Spider",
    emoji: "🕷️",
    lines: [
      "The itsy bitsy spider",
      "Climbed up the water spout.",
      "Down came the rain",
      "And washed the spider out.",
      "Out came the sun",
      "And dried up all the rain,",
      "And the itsy bitsy spider",
      "Climbed up the spout again.",
    ],
  },
  {
    id: "hickory",
    title: "Hickory Dickory Dock",
    emoji: "🐭",
    lines: [
      "Hickory dickory dock,",
      "The mouse ran up the clock.",
      "The clock struck one,",
      "The mouse ran down,",
      "Hickory dickory dock.",
    ],
  },
  {
    id: "diddle",
    title: "Hey Diddle Diddle",
    emoji: "🐱",
    lines: [
      "Hey diddle diddle,",
      "The cat and the fiddle,",
      "The cow jumped over the moon.",
      "The little dog laughed",
      "To see such sport,",
      "And the dish ran away with the spoon.",
    ],
  },
  {
    id: "london",
    title: "London Bridge",
    emoji: "🌉",
    lines: [
      "London Bridge is falling down,",
      "Falling down, falling down.",
      "London Bridge is falling down,",
      "My fair lady.",
    ],
  },
  {
    id: "patcake",
    title: "Pat-a-Cake",
    emoji: "🍰",
    lines: [
      "Pat-a-cake, pat-a-cake,",
      "Baker's man.",
      "Bake me a cake",
      "As fast as you can.",
      "Pat it and prick it",
      "And mark it with B,",
      "And put it in the oven",
      "For baby and me.",
    ],
  },
  {
    id: "rainrain",
    title: "Rain, Rain, Go Away",
    emoji: "🌧️",
    lines: [
      "Rain, rain, go away,",
      "Come again another day.",
      "Little Johnny wants to play.",
      "Rain, rain, go away.",
    ],
  },
  {
    id: "bopeep",
    title: "Little Bo Peep",
    emoji: "🐑",
    lines: [
      "Little Bo Peep has lost her sheep,",
      "And doesn't know where to find them.",
      "Leave them alone, and they'll come home,",
      "Wagging their tails behind them.",
    ],
  },
  {
    id: "muffet",
    title: "Little Miss Muffet",
    emoji: "🕷️",
    lines: [
      "Little Miss Muffet",
      "Sat on a tuffet,",
      "Eating her curds and whey.",
      "Along came a spider",
      "Who sat down beside her,",
      "And frightened Miss Muffet away.",
    ],
  },
  {
    id: "buckle",
    title: "One, Two, Buckle My Shoe",
    emoji: "👟",
    lines: [
      "One, two, buckle my shoe.",
      "Three, four, knock at the door.",
      "Five, six, pick up sticks.",
      "Seven, eight, lay them straight.",
      "Nine, ten, a big fat hen.",
    ],
  },
  {
    id: "macdonald",
    title: "Old MacDonald Had a Farm",
    emoji: "🐄",
    lines: [
      "Old MacDonald had a farm,",
      "E-I-E-I-O.",
      "And on that farm he had a cow,",
      "E-I-E-I-O.",
      "With a moo moo here,",
      "And a moo moo there,",
      "Here a moo, there a moo,",
      "Everywhere a moo moo.",
      "Old MacDonald had a farm,",
      "E-I-E-I-O.",
    ],
  },
  {
    id: "ringrosie",
    title: "Ring Around the Rosie",
    emoji: "🌹",
    lines: [
      "Ring around the rosie,",
      "A pocket full of posies.",
      "Ashes, ashes,",
      "We all fall down!",
    ],
  },
  {
    id: "threeblind",
    title: "Three Blind Mice",
    emoji: "🐭",
    lines: [
      "Three blind mice,",
      "Three blind mice.",
      "See how they run,",
      "See how they run.",
      "They all ran after the farmer's wife,",
      "Who cut off their tails with a carving knife.",
      "Did you ever see such a sight in your life,",
      "As three blind mice?",
    ],
  },
  {
    id: "abc",
    title: "My Alphabet Poem",
    emoji: "📝",
    lines: [
      "A is for apple, crisp and sweet.",
      "B is for ball; bounce to the beat.",
      "C is for cup; sip milk with glee.",
      "D is for door; come play with me.",
      "E is for egg, a tasty treat.",
      "F is for fork, to help us eat.",
      "G is for grapes that grow on vines.",
      "H is for hat that fits just fine.",
      "I is for ice cream, cold and sweet.",
      "J is for juice, a fruity treat.",
      "K is for keys that jingle bright.",
      "L is for lamp to light the night.",
      "M is for milk, cool in a cup.",
      "N is for napkins; pick one up.",
      "O is for orange, round and sweet.",
      "P is for plate, a tasty treat.",
      "Q is for quilt, cozy at night.",
      "R is for rice, a yummy bite.",
      "S is for soap to scrub and shine.",
      "T is for toothbrush, teeth so fine.",
      "U is for umbrella; stay dry.",
      "V is for veggies; please do try.",
      "W is for water, sip each day.",
      "X is for xylophone; hooray.",
      "Y is for yogurt, cool and white.",
      "Z is for zipper, pull it tight.",
    ],
  },
];