/* ============================================================
   Lumacubs — game engine
   Modes: Learn, Find It, Picture Match, Letter Match, Memory
   ============================================================ */

(function () {
  "use strict";

  /* ------------------------------ storage ------------------------------ */

  const LS = {
    get(k, d) {
      try { const r = localStorage.getItem("mad:" + k); return r == null ? d : JSON.parse(r); }
      catch (e) { return d; }
    },
    set(k, v) {
      try { localStorage.setItem("mad:" + k, JSON.stringify(v)); } catch (e) {}
      scheduleSave();
    },
    del(k) { try { localStorage.removeItem("mad:" + k); } catch (e) {} },
  };

  /* ------------------------- server API (MariaDB) ------------------------- */

  const CFG = window.LUMACUBS_CONFIG || {};
  const API_URL = CFG.legacyApi || "api.php";
  const FOUNDATION_API = String(CFG.foundationApi || "http://127.0.0.1:8081").replace(/\/$/, "");
  const CATALOG_LANG = CFG.catalogLang || "en";

  let serverMode = false;      // legacy api.php available
  let platformMode = false;    // new foundation API available
  let activeProfile = null;
  let parentSession = null;    // { token, parent, childId }
  let catalogSegments = null;
  let saveTimer = null;

  const SEGMENT_ART_FALLBACK = "assets/segments/illustrations/_fallback.svg";

  const FALLBACK_SEGMENTS = [
    { id: 1,  code: "numbers_math", title: "Numbers & Math", description: "Explore number sense, counting, and growing math skills for ages 2–8." },
    { id: 2,  code: "english_literacy", title: "English Language & Literacy" },
    { id: 3,  code: "urdu_literacy", title: "Urdu Language & Literacy" },
    { id: 4,  code: "world_around_us", title: "World Around Us" },
    { id: 5,  code: "colors_shapes_patterns", title: "Colors, Shapes & Patterns" },
    { id: 6,  code: "music_rhymes_movement", title: "Music, Rhymes & Movement" },
    { id: 7,  code: "games_brain_play", title: "Games & Brain Play" },
    { id: 8,  code: "creativity_art", title: "Creativity & Art" },
    { id: 9,  code: "basic_islamic_studies", title: "Basic Islamic Studies" },
    { id: 10, code: "life_skills_discovery", title: "Life Skills & Discovery" },
    { id: 11, code: "science_nature", title: "Science & Nature" },
    { id: 12, code: "digital_world_technology", title: "Digital World & Technology" },
    { id: 13, code: "everyday_math_money", title: "Everyday Mathematics & Money Skills" },
  ].map(s => Object.assign({}, s, {
    illustration_uri: "assets/segments/illustrations/" + s.code + ".svg",
    icon_uri: "assets/segments/icons/" + s.code + ".svg",
    icon: null,
  }));

  const ENGLISH_LITERACY_ART_BASE = "assets/home/little-explorers/english-literacy/subcategories/";
  const ENGLISH_LITERACY_ART = {
    alphabet_letters: ENGLISH_LITERACY_ART_BASE + "alphabet_letters.jpg",
    phonics_sounds: ENGLISH_LITERACY_ART_BASE + "phonics_sounds.jpg",
    sight_words: ENGLISH_LITERACY_ART_BASE + "sight_words.jpg",
    listening_speaking: ENGLISH_LITERACY_ART_BASE + "listening_speaking.jpg",
    early_reading: ENGLISH_LITERACY_ART_BASE + "early_reading.jpg",
  };

  const FALLBACK_ENGLISH_SUBCATEGORIES = [
    { id: 6, code: "alphabet_letters", title: "Alphabet Letters", description: "Meet A to Z", accent_color: "#A8D4F0" },
    { id: 7, code: "phonics_sounds", title: "Phonics Sounds", description: "Hear letter sounds", accent_color: "#C8F0E0" },
    { id: 8, code: "sight_words", title: "Sight Words", description: "Read common little words", accent_color: "#FFD8C2" },
    { id: 9, code: "listening_speaking", title: "Listening & Speaking", description: "Talk and listen with joy", accent_color: "#FFE29A" },
    { id: 10, code: "early_reading", title: "Early Reading", description: "First reading steps", accent_color: "#E8D5F5" },
  ].map(sc => Object.assign({}, sc, {
    illustration_uri: ENGLISH_LITERACY_ART[sc.code],
    icon_uri: ENGLISH_LITERACY_ART[sc.code],
  }));

  const FALLBACK_MATH_CATEGORIES = [
    { id: 101, code: "number_recognition_number_sense", title: "Number Recognition & Number Sense", description: "Spot, name, and understand numbers", accent_color: "#FFD8C2", age_label: "Ages 2–8" },
    { id: 102, code: "counting_quantity", title: "Counting Skills", description: "Count objects and build quantity sense from 1 to 30", accent_color: "#C8F0E0", age_label: "Ages 2–8" },
    { id: 103, code: "number_tracing_writing", title: "Number Tracing & Writing", description: "Trace and write numbers with care", accent_color: "#E8D5F5", age_label: "Ages 2–8" },
    { id: 104, code: "number_comparison", title: "Number Comparison", description: "Compare numbers: more, less, and equal", accent_color: "#A8D4F0", age_label: "Ages 4–8" },
    { id: 105, code: "addition", title: "Addition", description: "Put groups together to make more", accent_color: "#FFB4C8", age_label: "Ages 4–8" },
    { id: 106, code: "subtraction", title: "Subtraction", description: "Take away and find what is left", accent_color: "#F0A98A", age_label: "Ages 4–8" },
    { id: 107, code: "multiplication", title: "Multiplication", description: "Make equal groups again and again", accent_color: "#B89AD9", age_label: "Ages 6–8" },
    { id: 108, code: "division", title: "Division", description: "Share equally into fair groups", accent_color: "#7ECDB5", age_label: "Ages 6–8" },
    { id: 109, code: "skip_counting", title: "Skip Counting", description: "Count in steps like 2s, 5s, and 10s", accent_color: "#FFE29A", age_label: "Ages 4–8" },
    { id: 110, code: "number_patterns_sequences", title: "Number Patterns & Sequences", description: "Find what comes next in a number path", accent_color: "#C9B1E8", age_label: "Ages 4–8" },
    { id: 111, code: "fractions", title: "Fractions", description: "Explore parts of a whole", accent_color: "#FFC9A8", age_label: "Ages 6–8" },
    { id: 112, code: "math_patterns_relationships", title: "Mathematical Patterns & Relationships", description: "See how numbers connect and relate", accent_color: "#A8E6CF", age_label: "Ages 6–8" },
    { id: 113, code: "basic_mathematical_logic", title: "Basic Mathematical Logic", description: "Solve gentle number puzzles and reason", accent_color: "#D4C4F0", age_label: "Ages 6–8" },
    { id: 114, code: "intro_multiples_factors", title: "Introduction to Multiples & Factors", description: "Discover multiples and factors", accent_color: "#F6D6AE", age_label: "Age 8" },
    { id: 115, code: "intro_decimals", title: "Introduction to Decimals", description: "Meet numbers with a decimal point", accent_color: "#F0D5E8", age_label: "Age 8" },
    { id: 116, code: "place_value_number_system", title: "Place Value & Number System", description: "Ones, tens, hundreds, and number value", accent_color: "#B8E0D2", age_label: "Ages 6–8" },
  ].map(c => Object.assign({}, c, {
    illustration_uri: "assets/segments/numbers-math/illustrations/" + c.code + ".svg",
    icon_uri: "assets/segments/numbers-math/icons/" + c.code + ".svg",
    activity_count: 0,
    metadata: {},
  }));

  const SEGMENT_ACTIVITIES = {
    numbers_math: [
      { id: "learnCount", emoji: "🔢", label: "Learn Numbers" },
      { id: "count", emoji: "🧮", label: "Counting Fun" },
      { id: "countQuiz", emoji: "🎯", label: "Count the Objects" },
      { id: "countTrace", emoji: "✏️", label: "Number Trace" },
      { id: "countTogether", emoji: "👩‍🏫", label: "Count Together" },
    ],
    english_literacy: [
      { id: "learn", label: "Learn Letters", art: ENGLISH_LITERACY_ART_BASE + "alphabet_letters.jpg" },
      { id: "find", label: "Find It", art: ENGLISH_LITERACY_ART_BASE + "phonics_sounds.jpg" },
      { id: "matchPic", label: "Picture Match", art: ENGLISH_LITERACY_ART_BASE + "sight_words.jpg" },
      { id: "matchCase", label: "Letter Match", art: ENGLISH_LITERACY_ART_BASE + "early_reading.jpg" },
    ],
    colors_shapes_patterns: [
      { id: "colors", emoji: "🎨", label: "Colors" },
    ],
    music_rhymes_movement: [
      { id: "poems", emoji: "📝", label: "Poems" },
    ],
    games_brain_play: [
      { id: "memory", emoji: "🃏", label: "Memory Fun" },
      { id: "find", emoji: "🔊", label: "Find It" },
    ],
    creativity_art: [
      { id: "coloring", emoji: "🎨", label: "Coloring Fun" },
    ],
    world_around_us: [
      { id: "fruits", emoji: "🍎", label: "Fruits" },
      { id: "vegetables", emoji: "🥕", label: "Vegetables" },
    ],
    life_skills_discovery: [
      { id: "fruits", emoji: "🍎", label: "Fruits" },
      { id: "vegetables", emoji: "🥕", label: "Vegetables" },
      { id: "stickers", emoji: "⭐", label: "Sticker Book" },
    ],
  };

  async function apiCall(action, params, method) {
    let url = API_URL + "?action=" + encodeURIComponent(action);
    const opts = { method: method || "GET" };
    if (method === "POST" && params) {
      opts.headers = { "Content-Type": "application/x-www-form-urlencoded" };
      opts.body = new URLSearchParams(params).toString();
    } else if (params) {
      url += "&" + new URLSearchParams(params).toString();
    }
    const ctrl = typeof AbortController !== "undefined" ? new AbortController() : null;
    if (ctrl) {
      opts.signal = ctrl.signal;
      setTimeout(() => ctrl.abort(), 4000);
    }
    try {
      const res = await fetch(url, opts);
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      return null;
    }
  }

  async function platformCall(path, options) {
    options = options || {};
    const method = options.method || "GET";
    const headers = Object.assign({ "Accept": "application/json" }, options.headers || {});
    if (parentSession && parentSession.token) {
      headers.Authorization = "Bearer " + parentSession.token;
    }
    let url = FOUNDATION_API + path;
    const opts = { method, headers };
    if (options.body != null) {
      headers["Content-Type"] = "application/json";
      opts.body = JSON.stringify(options.body);
    }
    const ctrl = typeof AbortController !== "undefined" ? new AbortController() : null;
    if (ctrl) {
      opts.signal = ctrl.signal;
      setTimeout(() => ctrl.abort(), 5000);
    }
    try {
      const res = await fetch(url, opts);
      const data = await res.json().catch(() => null);
      if (!data) return null;
      data._status = res.status;
      return data;
    } catch (e) {
      return null;
    }
  }

  function normalizeSegment(seg) {
    const s = Object.assign({}, seg);
    if (!s.illustration_uri && s.code) {
      s.illustration_uri = "assets/segments/illustrations/" + s.code + ".svg";
    }
    if (!s.icon_uri && s.code) {
      s.icon_uri = "assets/segments/icons/" + s.code + ".svg";
    }
    // Never keep corrupted emoji placeholders like ????
    if (s.icon && (/^\?+$/.test(String(s.icon)) || /[\uFFFD]/.test(String(s.icon)))) {
      s.icon = null;
    }
    return s;
  }

  async function loadCatalogSegments() {
    if (catalogSegments && catalogSegments.length) return catalogSegments;
    if (platformMode) {
      const data = await platformCall("/segments?lang=" + encodeURIComponent(CATALOG_LANG));
      if (data && data.ok && Array.isArray(data.segments) && data.segments.length) {
        catalogSegments = data.segments.map(normalizeSegment);
        return catalogSegments;
      }
    }
    catalogSegments = FALLBACK_SEGMENTS.slice();
    return catalogSegments;
  }

  function persistParentSession() {
    if (parentSession) LS.set("parentSession", parentSession);
    else LS.del("parentSession");
  }

  async function trackPlatformProgress(activityCode, status) {
    if (!platformMode || !parentSession || !parentSession.token || !parentSession.childId) return;
    await platformCall("/progress", {
      method: "POST",
      body: {
        child_id: parentSession.childId,
        activity_code: activityCode,
        status: status || "started",
      },
    });
  }

  function scheduleSave() {
    if (!serverMode || !activeProfile) return;
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(saveNow, 700);
  }

  async function saveNow() {
    if (saveTimer) { clearTimeout(saveTimer); saveTimer = null; }
    if (!serverMode || !activeProfile) return;
    // Platform parent/child ids are not legacy user ids
    if (activeProfile.platform || typeof activeProfile.id === "string") return;
    await apiCall("save", {
      id: activeProfile.id,
      stickers: JSON.stringify(stickers),
      levels: JSON.stringify(levels),
      speech_on: speechOn ? 1 : 0,
    }, "POST");
  }

  let stickers = LS.get("stickers", {});
  let speechOn = LS.get("speechOn", true);
  let levels = LS.get("levels", {});

  /* ------------------------------ helpers ------------------------------ */

  const $ = (s, r) => (r || document).querySelector(s);

  function el(tag, cls, html) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }

  function shuffle(a) {
    a = a.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = (Math.random() * (i + 1)) | 0;
      const t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function pick(arr, n) { return shuffle(arr).slice(0, n); }

  function byLetter(l) { return ALPHABET.find(x => x.letter === l); }

  function pickLetterAvoiding(exclude) {
    let l;
    do { l = ALPHABET[(Math.random() * ALPHABET.length) | 0].letter; }
    while (exclude && l === exclude && ALPHABET.length > 1);
    return l;
  }

  // Round tokens kill any pending timers when the screen or round changes.
  let token = 0;
  function later(fn, ms) {
    const t = token;
    setTimeout(() => { if (t === token) fn(); }, ms);
  }

  function wobble(node) {
    node.classList.remove("wobble");
    void node.offsetWidth; // restart animation
    node.classList.add("wobble");
  }

  /* ------------------------------ colors & scene ------------------------------ */

  const TINTS = [
    ["#ff6b9d", "#ffe4ee"], ["#4d96ff", "#e3efff"], ["#6bcb77", "#e3f8ea"],
    ["#ff9f43", "#fff0de"], ["#a78bfa", "#efeaff"], ["#f43f5e", "#ffe4e9"],
    ["#0ea5e9", "#e0f4ff"], ["#f59e0b", "#fff4d6"], ["#10b981", "#dcfcef"],
    ["#8b5cf6", "#ece4ff"], ["#ec4899", "#fde4f1"], ["#14b8a6", "#d9f5f1"],
  ];
  function tintFor(i) { return TINTS[i % TINTS.length]; }
  function tintStyle(i) {
    const t = tintFor(i);
    return `--accent:${t[0]};--soft:${t[1]}`;
  }

  const AVATARS = ["🐻", "🦊", "🐼", "🐸", "🐱", "🐰", "🐨", "🐵"];
  const CONFETTI_EMOJI = ["🎉", "⭐", "✨", "🍬", "🎈", "🌟"];

  // Floating sky decorations (runs once at boot)
  function initBg() {
    const bg = document.getElementById("bg");
    if (!bg) return;
    const add = (cls, html, style) => {
      const n = el("span", "deco " + cls, html);
      n.style.cssText = style;
      bg.appendChild(n);
    };
    // clouds drifting across
    for (let i = 0; i < 4; i++) {
      add("cloud", "☁️",
        `top:${4 + i * 17}%;animation-duration:${46 + i * 14}s;animation-delay:-${i * 17}s`);
    }
    // balloons swaying
    for (let i = 0; i < 3; i++) {
      add("balloon", ["🎈", "🎀", "🪁"][i],
        `left:${10 + i * 34}%;animation-duration:${3.4 + i * 0.9}s;animation-delay:-${i * 1.3}s;top:${14 + i * 24}%`);
    }
    // twinkling sparkles
    for (let i = 0; i < 6; i++) {
      add("spark", i % 2 ? "✨" : "⭐",
        `left:${6 + i * 16}%;top:${8 + ((i * 37) % 70)}%;animation-duration:${2 + (i % 3)}s;animation-delay:-${i * 0.7}s`);
    }
    // rising soap bubbles
    for (let i = 0; i < 5; i++) {
      const size = 16 + ((i * 13) % 30);
      add("bubble", "",
        `left:${8 + i * 19}%;bottom:-8%;width:${size}px;height:${size}px;` +
        `animation-duration:${11 + i * 3}s;animation-delay:-${i * 4}s`);
    }
  }

  /* ------------------------------ speech ------------------------------ */

  let voices = [];
  function refreshVoices() {
    try { voices = speechSynthesis.getVoices() || []; } catch (e) { voices = []; }
  }
  if ("speechSynthesis" in window) {
    refreshVoices();
    speechSynthesis.onvoiceschanged = refreshVoices;
  }

  let lastThrottle = 0;
  let speakTimer = null;
  let speakToken = 0;

  function pickVoice() {
    const en = voices.filter(v => v.lang && /^en/i.test(v.lang));
    return (
      en.find(v => /samantha|zira|aria|jenny|female|google us english/i.test(v.name || "")) ||
      en[0]
    );
  }

  function speak(text, opts) {
    opts = opts || {};
    if (!("speechSynthesis" in window) || !text) return;
    if (!speechOn && !opts.force) return;
    if (opts.throttle) {
      const now = Date.now();
      if (now - lastThrottle < 1600) return;
      lastThrottle = now;
    }
    // Chrome/Edge often drop speech if speak() runs immediately after cancel().
    // Delay slightly and resume if the engine got stuck paused.
    const myToken = ++speakToken;
    try {
      if (speakTimer) { clearTimeout(speakTimer); speakTimer = null; }
      speechSynthesis.cancel();
    } catch (e) {}

    speakTimer = setTimeout(() => {
      speakTimer = null;
      if (myToken !== speakToken) return;
      try {
        if (speechSynthesis.paused) speechSynthesis.resume();
        const u = new SpeechSynthesisUtterance(text);
        u.rate = opts.rate == null ? 0.85 : opts.rate;
        u.pitch = opts.pitch == null ? 1.1 : opts.pitch;
        u.volume = opts.volume == null ? 1 : opts.volume;
        const chosen = pickVoice();
        if (chosen) u.voice = chosen;
        speechSynthesis.speak(u);
        // Some Chrome builds need a second resume after queueing.
        if (speechSynthesis.paused) speechSynthesis.resume();
      } catch (e) {}
    }, 55);
  }

  /* Promise-based speech for synced highlighting (Count Together) */
  function speakLine(text, opts) {
    opts = opts || {};
    return new Promise(resolve => {
      let settled = false;
      const finish = () => {
        if (settled) return;
        settled = true;
        resolve();
      };
      if (!("speechSynthesis" in window) || !text) {
        later(finish, 350);
        return;
      }
      if (!speechOn && !opts.force) {
        later(finish, 450);
        return;
      }
      const myToken = ++speakToken;
      try {
        if (speakTimer) { clearTimeout(speakTimer); speakTimer = null; }
        speechSynthesis.cancel();
      } catch (e) {}
      speakTimer = setTimeout(() => {
        speakTimer = null;
        if (myToken !== speakToken) { finish(); return; }
        try {
          if (speechSynthesis.paused) speechSynthesis.resume();
          const u = new SpeechSynthesisUtterance(text);
          u.rate = opts.rate == null ? 0.86 : opts.rate;
          u.pitch = opts.pitch == null ? 1.14 : opts.pitch;
          u.volume = opts.volume == null ? 1 : opts.volume;
          const chosen = pickVoice();
          if (chosen) u.voice = chosen;
          u.onend = finish;
          u.onerror = finish;
          speechSynthesis.speak(u);
          if (speechSynthesis.paused) speechSynthesis.resume();
          // Safety net if onend never fires
          setTimeout(finish, Math.min(8000, 1200 + String(text).length * 120));
        } catch (e) {
          finish();
        }
      }, 55);
    });
  }

  /* ------------------------------ sounds ------------------------------ */

  let actx = null;
  function audio() {
    if (!actx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      actx = new AC();
    }
    if (actx.state === "suspended") actx.resume().catch(() => {});
    return actx;
  }

  function tone(freq, delay, dur, type, vol) {
    const c = audio();
    if (!c) return;
    try {
      const t0 = c.currentTime + (delay || 0);
      const osc = c.createOscillator();
      const g = c.createGain();
      osc.type = type || "sine";
      osc.frequency.setValueAtTime(freq, t0);
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(vol || 0.15, t0 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      osc.connect(g);
      g.connect(c.destination);
      osc.start(t0);
      osc.stop(t0 + dur + 0.06);
    } catch (e) {}
  }

  const snd = {
    correct() { [523.25, 659.25, 783.99].forEach((f, i) => tone(f, i * 0.08, 0.22, "triangle", 0.15)); },
    wrong()   { tone(340, 0, 0.14, "sine", 0.11); tone(262, 0.13, 0.18, "sine", 0.11); },
    fanfare() {
      [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, i * 0.1, 0.3, "triangle", 0.15));
      tone(1318.5, 0.42, 0.4, "triangle", 0.13);
    },
    pop()    { tone(700, 0, 0.07, "square", 0.07); tone(1150, 0.05, 0.09, "square", 0.06); },
    flip()   { tone(520, 0, 0.06, "triangle", 0.08); },
    sticker(){ tone(880, 0, 0.08, "sine", 0.13); tone(1318.5, 0.07, 0.13, "sine", 0.11); },
  };

  // Unlock audio on the first touch anywhere.
  document.addEventListener("pointerdown", function unlock() {
    audio();
    document.removeEventListener("pointerdown", unlock);
  });

  /* ------------------------------ fx ------------------------------ */

  const fx = $("#fx");

  function confetti(count) {
    const colors = ["#ff6b9d", "#ffd93d", "#6bcb77", "#4d96ff", "#ff9f43", "#a78bfa"];
    for (let i = 0; i < (count || 22); i++) {
      const isEmoji = i % 4 === 3;
      const p = el("span", "confetti" + (isEmoji ? " emoji" : ""),
        isEmoji ? CONFETTI_EMOJI[(Math.random() * CONFETTI_EMOJI.length) | 0] : "");
      p.style.left = (5 + Math.random() * 90) + "vw";
      if (!isEmoji) {
        p.style.background = colors[(Math.random() * colors.length) | 0];
        if (Math.random() < 0.4) p.style.borderRadius = "50%";
      }
      p.style.animationDuration = (0.9 + Math.random() * 0.8) + "s";
      p.style.animationDelay = (Math.random() * 0.35) + "s";
      fx.appendChild(p);
      setTimeout(() => p.remove(), 2400);
    }
  }

  function toast(msg) {
    fx.querySelectorAll(".toast").forEach(t => t.remove());
    const t = el("div", "toast", msg);
    fx.appendChild(t);
    setTimeout(() => t.remove(), 1600);
  }

  /* ------------------------------ stickers ------------------------------ */

  function stickerCount() {
    return Object.keys(stickers).filter(k => stickers[k]).length;
  }

  function award(letter) {
    if (stickers[letter]) return false;
    stickers[letter] = true;
    LS.set("stickers", stickers);
    snd.sticker();
    const item = byLetter(letter);
    toast(`⭐ New sticker! ${item ? item.emoji : ""} ${letter}`);
    confetti(10);
    return true;
  }

  /* ------------------------------ difficulty ------------------------------ */

  const MAX_LEVEL = { find: 2, matchPic: 2, matchCase: 2, memory: 3, countQuiz: 2 };
  const streaks = {};
  const misses = {};

  function levelOf(g) { const v = levels[g]; return typeof v === "number" ? v : 0; }

  function noteCorrect(g) {
    streaks[g] = (streaks[g] || 0) + 1;
    misses[g] = 0;
    if (streaks[g] >= 3 && levelOf(g) < MAX_LEVEL[g]) {
      levels[g] = levelOf(g) + 1;
      LS.set("levels", levels);
      streaks[g] = 0;
      snd.fanfare();
      toast("🌟 Level up!");
    }
  }

  function noteWrong(g) {
    streaks[g] = 0;
    misses[g] = (misses[g] || 0) + 1;
    if (misses[g] >= 3 && levelOf(g) > 0) {
      levels[g] = levelOf(g) - 1;
      LS.set("levels", levels);
      misses[g] = 0;
    }
  }

  function levelStars(g) {
    const wrap = el("div", "level-stars");
    const total = MAX_LEVEL[g] + 1;
    for (let i = 0; i < total; i++) {
      wrap.appendChild(el("span", "star" + (i <= levelOf(g) ? " on" : ""), i <= levelOf(g) ? "⭐" : "☆"));
    }
    return wrap;
  }

  /* ------------------------------ navigation ------------------------------ */

  const screenRoot = $("#screen");
  const titleEl = $("#title");
  const backBtn = $("#backBtn");

  let current = "home";
  let ageHubReturn = null; // e.g. "littleExplorers" when browsing from an age dashboard

  function go(name, arg) {
    token++;
    speakToken++;
    if (speakTimer) { clearTimeout(speakTimer); speakTimer = null; }
    stopPoemAudio();
    try { if ("speechSynthesis" in window) speechSynthesis.cancel(); } catch (e) {}
    current = name;
    if (name === "home" || name === "auth") ageHubReturn = null;
    screenRoot.innerHTML = "";
    const hideBack = name === "home" || name === "auth" || name === "forgot" || name === "reset"
      || name === "childPicker" || name === "ageDashboard";
    backBtn.classList.toggle("hidden", hideBack);
    if (typeof VIEWS[name] !== "function") {
      console.warn("Unknown view:", name);
      VIEWS.home();
      return;
    }
    VIEWS[name](arg);
    window.scrollTo(0, 0);
  }

  let segmentReturn = null;
  let leMathCatReturn = null;

  backBtn.addEventListener("click", () => {
    snd.pop();
    if (current === "poemReader") go("poems");
    else if (current === "mathCategory" && segmentReturn) go("segment", segmentReturn);
    else if (current === "leMathPlay" || current === "leMathResult") {
      if (leMathCatReturn) go("leMathCat", leMathCatReturn);
      else go("leNumbersMath");
    }
    else if (current === "leMathCat") go("leNumbersMath");
    else if (current === "leNumbersMath") {
      if (ageHubReturn) go(ageHubReturn);
      else go("littleExplorers");
    }
    else if (current === "segment") {
      if (ageHubReturn) go(ageHubReturn);
      else if (parentSession && parentSession.childId) go("ageDashboard");
      else go("home");
    }
    else if (current === "littleExplorers") go("home");
    else if (current === "auth") go("home");
    else if (parentSession && parentSession.childId && current !== "ageDashboard") go("ageDashboard");
    else go("home");
  });

  function ageGroupsShort(meta) {
    const ids = (meta && meta.suitable_age_group_ids) || [];
    const map = { 1: "2–4", 2: "4–6", 3: "6–8" };
    // Legacy id 4 (retired) → Smart Achievers band
    const normalized = ids.map(id => (Number(id) === 4 ? 3 : Number(id)));
    const parts = normalized.map(id => map[id]).filter(Boolean);
    if (!parts.length) return "Ages 2–8";
    if (parts.length === 1) return "Ages " + parts[0];
    return "Ages " + parts[0] + " · " + parts[parts.length - 1];
  }

  function masterAgeGroupForYears(ageYears) {
    if (ageYears == null || ageYears < 0) return null;
    if (ageYears < 4) return MASTER_AGE_GROUPS[0];
    if (ageYears < 6) return MASTER_AGE_GROUPS[1];
    return MASTER_AGE_GROUPS[2];
  }

  function assetUrl(path) {
    if (!path) return "";
    if (/^https?:\/\//i.test(path)) return path;
    return path.replace(/^\//, "");
  }

  const MATH_ILLUSTRATION_FALLBACK = "assets/segments/numbers-math/illustrations/_fallback.svg";

  function mathIllustrationHtml(cat) {
    const accent = cat.accent_color || "#E8D5F5";
    const ill = assetUrl(cat.illustration_uri) || MATH_ILLUSTRATION_FALLBACK;
    const title = escapeHtml(cat.title || cat.code || "Category");
    return `<span class="math-card-art" style="background:${escapeHtml(accent)}33">
      <img class="math-card-illustration" src="${escapeHtml(ill)}" alt="${title}"
        width="480" height="360" loading="eager" decoding="async"
        onerror="if(!this.dataset.fb){this.dataset.fb='1';this.src='${MATH_ILLUSTRATION_FALLBACK}';}">
    </span>`;
  }

  function subcategoryIllustrationUri(sc, segmentCode) {
    if (sc && sc.illustration_uri) return assetUrl(sc.illustration_uri);
    if (sc && sc.icon_uri) return assetUrl(sc.icon_uri);
    const code = sc && sc.code;
    if (segmentCode === "english_literacy" && code && ENGLISH_LITERACY_ART[code]) {
      return ENGLISH_LITERACY_ART[code];
    }
    if (code && ENGLISH_LITERACY_ART[code]) return ENGLISH_LITERACY_ART[code];
    return SEGMENT_ART_FALLBACK;
  }

  function subcategoryArtHtml(sc, segmentCode) {
    const title = escapeHtml((sc && (sc.title || sc.code)) || "Topic");
    const src = escapeHtml(subcategoryIllustrationUri(sc, segmentCode));
    return `<span class="subcat-art" aria-hidden="true">
      <img class="subcat-illustration" src="${src}" alt=""
        width="96" height="96" loading="lazy" decoding="async"
        onerror="if(!this.dataset.fb){this.dataset.fb='1';this.src='${SEGMENT_ART_FALLBACK}';}">
    </span>`;
  }

  function segmentIllustrationUri(seg) {
    if (seg && seg.illustration_uri) return assetUrl(seg.illustration_uri);
    if (seg && seg.code) return "assets/segments/illustrations/" + seg.code + ".svg";
    return SEGMENT_ART_FALLBACK;
  }

  function segmentCardArtHtml(seg) {
    const title = escapeHtml((seg && (seg.title || seg.code)) || "Learning path");
    const src = escapeHtml(segmentIllustrationUri(seg));
    return `<span class="segment-art">
      <img class="segment-illustration" src="${src}" alt="${title}"
        width="480" height="360" loading="eager" decoding="async"
        onerror="if(!this.dataset.fb){this.dataset.fb='1';this.src='${SEGMENT_ART_FALLBACK}';}">
    </span>`;
  }

  /* ------------------------------ views ------------------------------ */

  const VIEWS = {};

  /* -------- MASTER age groups (FINAL — do not rename/split/add) --------
     1) Little Explorers  — 2 to under 4
     2) Curious Learners  — 4 to under 6
     3) Smart Achievers   — 6 to 8
     Only learning content inside each group may evolve after approval. */

  const MASTER_AGE_GROUPS = Object.freeze([
    Object.freeze({
      id: 1,
      code: "little_explorers",
      slug: "little-explorers",
      name: "Little Explorers",
      ages: "2–4 Years",
      ageMinInclusive: 2,
      ageMaxExclusive: 4,
    }),
    Object.freeze({
      id: 2,
      code: "curious_learners",
      slug: "curious-learners",
      name: "Curious Learners",
      ages: "4–6 Years",
      ageMinInclusive: 4,
      ageMaxExclusive: 6,
    }),
    Object.freeze({
      id: 3,
      code: "smart_achievers",
      slug: "smart-achievers",
      name: "Smart Achievers",
      ages: "6–8 Years",
      ageMinInclusive: 6,
      ageMaxExclusive: 9,
    }),
  ]);

  const HOME_AGE_SECTIONS = [
    {
      id: "little_explorers",
      slug: "little-explorers",
      name: "Little Explorers",
      ages: "2–4 Years",
      description: "Soft first steps — colors, sounds, counting play, and gentle discovery.",
      illustration: "assets/home/age-groups/little-explorers.svg",
      tone: "peach",
    },
    {
      id: "curious_learners",
      slug: "curious-learners",
      name: "Curious Learners",
      ages: "4–6 Years",
      description: "Letters, numbers, stories, and playful puzzles for growing minds.",
      illustration: "assets/home/age-groups/curious-learners.svg",
      tone: "mint",
    },
    {
      id: "smart_achievers",
      slug: "smart-achievers",
      name: "Smart Achievers",
      ages: "6–8 Years",
      description: "Bigger challenges, sharper thinking, and proud learning moments.",
      illustration: "assets/home/age-groups/smart-achievers.svg",
      tone: "sun",
    },
  ];

  function selectHomeAgeSection(section) {
    if (!section) return;
    LS.set("selectedHomeAge", {
      id: section.id,
      slug: section.slug,
      name: section.name,
      ages: section.ages,
      selectedAt: Date.now(),
    });
    // Navigation-ready hook for Phase 2 age spaces (no new dashboard in Phase 1).
    try {
      if (window.history && window.history.replaceState) {
        window.history.replaceState({ ageSection: section.slug }, "", "#age/" + section.slug);
      } else {
        window.location.hash = "age/" + section.slug;
      }
    } catch (e) {}
  }

  VIEWS.home = function () {
    titleEl.textContent = "LumaCubs";

    const greeting = activeProfile
      ? "Hi " + escapeHtml(activeProfile.name) + "! Pick an age path to begin."
      : "Choose the learning path that fits your little cub.";

    const saved = LS.get("selectedHomeAge", null);

    const wrap = el("div", "home-age-page");
    wrap.innerHTML = `
      <section class="home-age-intro" aria-label="LumaCubs welcome">
        <p class="home-age-brand">LumaCubs</p>
        <h2 class="home-age-headline">Little Learners, Big Discoveries</h2>
        <p class="home-age-sub">${greeting}</p>
      </section>
      <section class="home-age-grid" aria-label="Age learning sections"></section>
      <p class="home-age-note">Grown-up tip: open the menu for stickers, poems, and classic activities.</p>
    `;

    const grid = wrap.querySelector(".home-age-grid");
    HOME_AGE_SECTIONS.forEach((section, index) => {
      const isSelected = saved && saved.id === section.id;
      const card = document.createElement("a");
      card.className = "age-home-card tone-" + section.tone + (isSelected ? " is-selected" : "");
      card.href = "#age/" + section.slug;
      card.setAttribute("data-age-section", section.id);
      card.setAttribute("aria-label", section.name + ", " + section.ages);
      card.style.setProperty("--age-card-delay", (index * 70) + "ms");
      card.innerHTML = `
        <span class="age-home-art">
          <img
            src="${escapeHtml(section.illustration)}"
            alt=""
            width="640"
            height="480"
            loading="eager"
            decoding="async"
            draggable="false"
          >
        </span>
        <span class="age-home-body">
          <span class="age-home-ages">${escapeHtml(section.ages)}</span>
          <span class="age-home-name">${escapeHtml(section.name)}</span>
          <span class="age-home-desc">${escapeHtml(section.description)}</span>
          <span class="age-home-cta">Explore path</span>
        </span>
      `;
      card.addEventListener("click", (e) => {
        e.preventDefault();
        snd.pop();
        selectHomeAgeSection(section);
        grid.querySelectorAll(".age-home-card").forEach(c => c.classList.remove("is-selected"));
        card.classList.add("is-selected");
        trackPlatformProgress("home.age." + section.id, "started");
        if (section.id === "little_explorers") {
          go("littleExplorers");
          return;
        }
        speak(section.name);
        toast(section.name + " · coming next");
      });
      grid.appendChild(card);
    });

    screenRoot.appendChild(wrap);
  };

  /* -------- Little Explorers (2–4) dashboard -------- */

  const LITTLE_EXPLORERS_SEGMENTS = [
    { id: 1,  code: "numbers_math", title: "Numbers & Math", description: "Let's count and play with numbers!", tone: "peach" },
    { id: 2,  code: "english_literacy", title: "English Language & Literacy", description: "Discover letters, words and sounds!", tone: "sky" },
    { id: 3,  code: "urdu_literacy", title: "Urdu Language & Literacy", description: "Explore Urdu letters and words!", tone: "lilac" },
    { id: 4,  code: "world_around_us", title: "World Around Us", description: "Discover people, places and things!", tone: "mint" },
    { id: 5,  code: "colors_shapes_patterns", title: "Colors, Shapes & Patterns", description: "Explore colors, shapes and patterns!", tone: "rose" },
    { id: 6,  code: "music_rhymes_movement", title: "Music, Rhymes & Movement", description: "Sing, dance and have fun!", tone: "violet" },
    { id: 7,  code: "games_brain_play", title: "Games & Brain Play", description: "Play fun thinking games!", tone: "aqua" },
    { id: 8,  code: "creativity_art", title: "Creativity & Art", description: "Draw, color and create!", tone: "sun" },
    { id: 9,  code: "basic_islamic_studies", title: "Basic Islamic Studies", description: "Discover simple Islamic learning!", tone: "sage" },
    { id: 10, code: "life_skills_discovery", title: "Life Skills & Discovery", description: "Learn everyday skills through play!", tone: "coral" },
    { id: 11, code: "science_nature", title: "Science & Nature", description: "Explore animals, plants and nature!", tone: "leaf" },
  ].map(s => Object.assign({}, s, {
    illustration: "assets/home/little-explorers/segments/" + s.code + ".jpg",
    illustration_uri: "assets/home/little-explorers/segments/" + s.code + ".jpg",
    icon_uri: "assets/segments/icons/" + s.code + ".svg",
  }));

  const LITTLE_EXPLORERS_HERO = "assets/home/little-explorers/hero.jpg";
  const LE_ILLUSTRATION_FALLBACK = "assets/segments/illustrations/_fallback.svg";

  function openLittleExplorersSegment(leSeg) {
    ageHubReturn = "littleExplorers";
    trackPlatformProgress("little_explorers.segment." + (leSeg && leSeg.code), "started");
    // Dedicated Little Explorers Numbers & Math experience
    if (leSeg && leSeg.code === "numbers_math") {
      go("leNumbersMath");
      return;
    }
    const catalog = (catalogSegments || []).find(s => Number(s.id) === Number(leSeg.id) || s.code === leSeg.code);
    const payload = Object.assign({}, catalog || {}, {
      id: leSeg.id,
      code: leSeg.code,
      title: leSeg.title,
      description: leSeg.description,
      illustration_uri: leSeg.illustration_uri || (catalog && catalog.illustration_uri),
      icon_uri: leSeg.icon_uri || (catalog && catalog.icon_uri),
      fromAgeHub: "littleExplorers",
    });
    go("segment", payload);
  }

  VIEWS.littleExplorers = function () {
    ageHubReturn = "littleExplorers";
    titleEl.textContent = "Little Explorers";

    const childName = (activeProfile && activeProfile.childId && activeProfile.name)
      ? activeProfile.name
      : null;
    const avatar = (activeProfile && activeProfile.avatar) ? activeProfile.avatar : "🧸";
    const welcomeTitle = childName
      ? ("Hello, " + childName + "!")
      : "Hello, Little Explorer!";

    const page = el("div", "le-dash");
    page.innerHTML = `
      <header class="le-dash-header">
        <div class="le-dash-header-deco" aria-hidden="true">
          <span class="le-deco le-deco-a"></span>
          <span class="le-deco le-deco-b"></span>
          <span class="le-deco le-deco-c"></span>
        </div>
        <div class="le-dash-brand-row">
          <div class="le-dash-brand-text">
            <p class="le-dash-brand">LumaCubs</p>
            <p class="le-dash-ages">Little Explorers · 2–4 Years</p>
          </div>
          <div class="le-dash-profile" aria-label="Child profile">
            <span class="le-dash-avatar">${escapeHtml(avatar)}</span>
          </div>
        </div>
        <h2 class="le-dash-welcome">${escapeHtml(welcomeTitle)}</h2>
        <p class="le-dash-subtitle">Let's discover something fun today!</p>
      </header>

      <section class="le-hero" aria-label="Welcome hero">
        <div class="le-hero-art">
          <img
            src="${LITTLE_EXPLORERS_HERO}"
            alt="Friendly Luma cub ready to explore with toys and colors"
            width="640"
            height="480"
            loading="eager"
            decoding="async"
            onerror="if(!this.dataset.fb){this.dataset.fb='1';this.src='${LE_ILLUSTRATION_FALLBACK}';}"
          >
        </div>
        <div class="le-hero-copy">
          <h3>Your learning world is ready</h3>
          <p>Tap a colorful path and start exploring.</p>
          <button type="button" class="le-hero-cta" id="leLetsExplore">Let's Explore</button>
        </div>
      </section>

      <section class="le-segments" aria-label="Learning segments">
        <div class="le-section-label">
          <h3>Explore Your Learning World</h3>
          <p>11 playful paths for little explorers</p>
        </div>
        <div class="le-segment-grid" id="leSegmentGrid"></div>
      </section>
    `;

    const grid = page.querySelector("#leSegmentGrid");
    LITTLE_EXPLORERS_SEGMENTS.forEach((seg, i) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "le-segment-card tone-" + seg.tone;
      card.setAttribute("aria-label", seg.title);
      card.style.setProperty("--le-delay", (i * 45) + "ms");
      card.innerHTML = `
        <span class="le-segment-art">
          <img
            src="${escapeHtml(seg.illustration)}"
            alt="${escapeHtml(seg.title)}"
            width="640"
            height="480"
            loading="lazy"
            decoding="async"
            draggable="false"
            onerror="if(!this.dataset.fb){this.dataset.fb='1';this.src='${LE_ILLUSTRATION_FALLBACK}';}"
          >
        </span>
        <span class="le-segment-body">
          <span class="le-segment-name">${escapeHtml(seg.title)}</span>
          <span class="le-segment-desc">${escapeHtml(seg.description)}</span>
        </span>
      `;
      card.addEventListener("click", () => {
        snd.pop();
        speak(seg.title);
        openLittleExplorersSegment(seg);
      });
      grid.appendChild(card);
    });

    page.querySelector("#leLetsExplore").addEventListener("click", () => {
      snd.pop();
      const first = grid.querySelector(".le-segment-card");
      if (first) {
        first.focus();
        first.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      speak("Explore your learning world");
    });

    screenRoot.appendChild(page);
    speak(welcomeTitle);
  };

  /* -------- learning segment hub -------- */

  VIEWS.segment = function (segment) {
    const seg = segment || FALLBACK_SEGMENTS[0];
    segmentReturn = seg;
    titleEl.textContent = seg.title || "Learning Path";
    const isMath = seg.code === "numbers_math";
    const rtl = CATALOG_LANG === "ur" || CATALOG_LANG === "ar";

    const wrap = el("div", "segment-hub" + (isMath ? " math-hub" : ""));
    if (rtl) wrap.setAttribute("dir", "rtl");
    wrap.appendChild(el("div", "segment-hub-hero", `
      <div class="segment-hub-art">${segmentCardArtHtml(seg)}</div>
      <h2>${escapeHtml(seg.title || seg.code)}</h2>
      <p>${escapeHtml(seg.description || (isMath
        ? "Explore number sense, counting, and growing math skills for ages 2–8."
        : "Age-ready activities for this learning path. More lessons will appear here as content is published."))}</p>
    `));

    const activities = SEGMENT_ACTIVITIES[seg.code] || [];
    if (activities.length) {
      wrap.appendChild(el("div", "home-section-label", `
        <h3>Available now</h3>
        <p>Play these activities in this path</p>`));
      const grid = el("div", "mode-grid");
      activities.forEach((m, i) => {
        const art = m.art
          ? `<span class="m-art"><img src="${escapeHtml(m.art)}" alt="" width="72" height="72" loading="lazy" decoding="async" onerror="if(!this.dataset.fb){this.dataset.fb='1';this.src='${SEGMENT_ART_FALLBACK}';}"></span>`
          : `<span class="m-emoji">${m.emoji || ""}</span>`;
        const b = el(
          "button",
          "mode-btn" + (m.art ? " has-art" : "") + " tone-" + (i % 4),
          `${art}<span class="m-label">${escapeHtml(m.label)}</span>`
        );
        b.addEventListener("click", () => {
          snd.pop();
          trackPlatformProgress("activity." + m.id, "started");
          go(m.id);
        });
        grid.appendChild(b);
      });
      wrap.appendChild(grid);
    } else if (!isMath) {
      wrap.appendChild(el("div", "segment-empty", `
        <h3>Coming soon</h3>
        <p>This path is ready in the catalog. Lessons and games will be added next.</p>
      `));
    }

    const subWrap = el("div", "segment-subs");
    subWrap.innerHTML = `<p class="segment-subs-note">Loading ${isMath ? "categories" : "topics"}…</p>`;
    wrap.appendChild(subWrap);
    screenRoot.appendChild(wrap);

    function renderCategoryList(list) {
      if (!list.length) {
        subWrap.innerHTML = `<p class="segment-subs-note">Categories will appear here when published.</p>`;
        return;
      }
      subWrap.innerHTML = "";
      subWrap.appendChild(el("div", "home-section-label", `
        <h3>${isMath ? "Math categories" : "Learning topics"}</h3>
        <p>${list.length} ${isMath ? "learning paths" : "topics"} ready to explore</p>`));

      if (isMath) {
        const grid = el("div", "math-category-grid");
        list.forEach(cat => {
          const accent = cat.accent_color || "#E8D5F5";
          const card = el("button", "math-category-card", `
            ${mathIllustrationHtml(cat)}
            <span class="math-card-body">
              <strong class="math-card-title">${escapeHtml(cat.title || cat.code)}</strong>
              <span class="math-card-desc">${escapeHtml(cat.description || "")}</span>
              <span class="math-card-meta">
                <span>${escapeHtml(cat.age_label || ageGroupsShort(cat.metadata))}</span>
                <span>${Number(cat.activity_count || 0)} activities</span>
              </span>
            </span>
          `);
          card.type = "button";
          card.style.setProperty("--math-accent", accent);
          card.addEventListener("click", () => {
            snd.pop();
            trackPlatformProgress("category." + (cat.code || cat.id), "started");
            go("mathCategory", { segment: seg, category: cat });
          });
          grid.appendChild(card);
        });
        subWrap.appendChild(grid);
        return;
      }

      const isEnglish = seg.code === "english_literacy";
      const ul = el("div", "subcat-list" + (isEnglish ? " illustrated-subcat-list" : ""));
      list.forEach((sc, i) => {
        if (isEnglish && sc && sc.code && !sc.illustration_uri && ENGLISH_LITERACY_ART[sc.code]) {
          sc.illustration_uri = ENGLISH_LITERACY_ART[sc.code];
        }
        const item = el(
          "button",
          "subcat-item" + (isEnglish ? " illustrated-subcat-item" : "") + " tone-" + (i % 4),
          (isEnglish ? subcategoryArtHtml(sc, seg.code) : "") +
          `<span class="subcat-copy">
            <strong>${escapeHtml(sc.title || sc.code)}</strong>
            <span>${escapeHtml(sc.description || "Coming soon")}</span>
            <em class="subcat-soon">Lessons coming soon</em>
          </span>`
        );
        item.type = "button";
        item.addEventListener("click", () => {
          snd.pop();
          trackPlatformProgress("subcategory." + (sc.code || sc.id), "started");
          toast((sc.title || "Topic") + " — lessons coming soon");
        });
        ul.appendChild(item);
      });
      subWrap.appendChild(ul);
    }

    if (platformMode && seg.id) {
      let endpoint = isMath
        ? "/segments/" + encodeURIComponent(seg.id) + "/categories?lang=" + encodeURIComponent(CATALOG_LANG)
        : "/segments/" + encodeURIComponent(seg.id) + "/subcategories?lang=" + encodeURIComponent(CATALOG_LANG);
      const ageId = activeProfile && activeProfile.ageGroupId;
      if (ageId) endpoint += "&age_group_id=" + encodeURIComponent(ageId);
      platformCall(endpoint).then(data => {
        if (current !== "segment") return;
        let list = (data && data.ok) ? (data.categories || data.subcategories || []) : [];
        if (isMath && !list.length) list = FALLBACK_MATH_CATEGORIES.slice();
        if (!isMath && seg.code === "english_literacy" && !list.length) {
          list = FALLBACK_ENGLISH_SUBCATEGORIES.slice();
        }
        renderCategoryList(list);
      });
    } else if (isMath) {
      renderCategoryList(FALLBACK_MATH_CATEGORIES.slice());
    } else if (seg.code === "english_literacy") {
      renderCategoryList(FALLBACK_ENGLISH_SUBCATEGORIES.slice());
    } else {
      subWrap.innerHTML = `<p class="segment-subs-note">Connect the API to load learning categories for this path.</p>`;
    }
  };

  /* -------- Numbers & Math category shell -------- */

  VIEWS.mathCategory = function (payload) {
    const seg = (payload && payload.segment) || segmentReturn || FALLBACK_SEGMENTS[0];
    const cat = (payload && payload.category) || {};
    segmentReturn = seg;
    titleEl.textContent = cat.title || "Category";
    const rtl = CATALOG_LANG === "ur" || CATALOG_LANG === "ar";
    const wrap = el("div", "math-category-page");
    if (rtl) wrap.setAttribute("dir", "rtl");

    const accent = cat.accent_color || "#E8D5F5";
    const heroIll = assetUrl(cat.illustration_uri) || MATH_ILLUSTRATION_FALLBACK;

    wrap.appendChild(el("div", "math-category-hero", `
      <div class="math-category-hero-art" style="background:${escapeHtml(accent)}33">
        <img class="math-card-illustration" src="${escapeHtml(heroIll)}" alt="${escapeHtml(cat.title || "Category")}"
          width="480" height="360" loading="eager" decoding="async"
          onerror="if(!this.dataset.fb){this.dataset.fb='1';this.src='${MATH_ILLUSTRATION_FALLBACK}';}">
      </div>
      <div class="math-category-hero-text">
        <h2>${escapeHtml(cat.title || cat.code || "Category")}</h2>
        <p>${escapeHtml(cat.description || "")}</p>
        <div class="math-card-meta">
          <span>${escapeHtml(cat.age_label || ageGroupsShort(cat.metadata))}</span>
          <span>Progress ready</span>
        </div>
      </div>
    `));

    const linked = SEGMENT_ACTIVITIES.numbers_math || [];
    if (linked.length) {
      wrap.appendChild(el("div", "home-section-label", `
        <h3>Try related play</h3>
        <p>Existing LumaCubs activities while lessons are prepared</p>`));
      const grid = el("div", "mode-grid");
      linked.slice(0, 4).forEach((m, i) => {
        const b = el(
          "button",
          "mode-btn tone-" + (i % 4),
          `<span class="m-emoji">${m.emoji}</span><span class="m-label">${m.label}</span>`
        );
        b.addEventListener("click", () => {
          snd.pop();
          trackPlatformProgress("activity." + m.id, "started");
          go(m.id);
        });
        grid.appendChild(b);
      });
      wrap.appendChild(grid);
    }

    const topicsWrap = el("div", "segment-subs");
    topicsWrap.innerHTML = `<p class="segment-subs-note">Loading subcategories…</p>`;
    wrap.appendChild(topicsWrap);
    screenRoot.appendChild(wrap);

    if (platformMode && cat.id) {
      platformCall("/categories/" + encodeURIComponent(cat.id) + "/topics?lang=" + encodeURIComponent(CATALOG_LANG))
        .then(data => {
          if (current !== "mathCategory") return;
          const topics = (data && data.ok && data.topics) ? data.topics : [];
          topicsWrap.innerHTML = "";
          topicsWrap.appendChild(el("div", "home-section-label", `
            <h3>Subcategories</h3>
            <p>${topics.length ? topics.length + " topics" : "Approved subcategory list will appear here next"}</p>`));
          if (!topics.length) {
            topicsWrap.appendChild(el("div", "segment-empty", `
              <h3>Coming soon</h3>
              <p>Subcategory hierarchy for this category will be added from the approved list. No invented lessons are shown.</p>
            `));
            return;
          }
          const ul = el("div", "subcat-list");
          topics.forEach((tp, i) => {
            const item = el("button", "subcat-item tone-" + (i % 4), `
              <strong>${escapeHtml(tp.title || tp.code)}</strong>
              <span>${escapeHtml(tp.description || "Coming soon")}</span>
              <em class="subcat-soon">Activities coming soon</em>
            `);
            item.type = "button";
            item.addEventListener("click", () => {
              snd.pop();
              trackPlatformProgress("topic." + (tp.code || tp.id), "started");
              toast("🌱 " + (tp.title || "Topic") + " — activities coming soon");
            });
            ul.appendChild(item);
          });
          topicsWrap.appendChild(ul);
        });
    } else {
      topicsWrap.innerHTML = `<p class="segment-subs-note">Connect the API to load subcategories.</p>`;
    }
  };

  /* -------- profile picker (server mode) -------- */

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  VIEWS.auth = function (mode) {
    mode = mode || "login";
    titleEl.textContent = mode === "login" ? "🔑 Login" : "📝 Sign Up";

    const wrap = el("div", "auth-wrap");

    if (mode === "login") {
      const box = el("div", "auth-box", `
        <h2>Welcome back! 👋</h2>
        <input class="auth-input" type="email" id="authEmail" placeholder="Email" autocomplete="email">
        <input class="auth-input" type="password" id="authPass" placeholder="Password" autocomplete="current-password">
        <label class="auth-remember"><input type="checkbox" id="authRemember"> Remember me</label>
        <button class="p-btn auth-submit" id="authLoginBtn">🔑 Login</button>
        <p class="auth-switch"><a href="#" id="forgotPassLink">Forgot password?</a> · <a href="#" id="switchToSignup">Sign up</a></p>
        <button class="p-btn plain auth-guest" id="authGuestBtn">👤 Continue as Guest</button>
      `);
      wrap.appendChild(box);

      screenRoot.appendChild(wrap);

      const emailInput = box.querySelector("#authEmail");
      const passInput = box.querySelector("#authPass");

      box.querySelector("#authLoginBtn").addEventListener("click", async () => {
        const email = emailInput.value.trim();
        const password = passInput.value;
        if (!email || !password) {
          toast("⚠️ Enter email and password");
          snd.wrong();
          return;
        }
        if (platformMode) {
          const data = await platformCall("/auth/login", { method: "POST", body: { email, password } });
          if (!data || !data.ok) {
            toast("❌ " + (data && data.error === "invalid_credentials" ? "Wrong email or password" : "Login failed"));
            snd.wrong();
            return;
          }
          await activateParentSession(data);
          return;
        }
        const data = await apiCall("login", { email, password }, "POST");
        if (!data || !data.ok) {
          toast("❌ " + (data && data.error === "invalid_credentials" ? "Wrong email or password" : "Login failed"));
          snd.wrong();
          return;
        }
        await loadProfileById(data.id, data.name, data.avatar);
      });

      box.querySelector("#switchToSignup").addEventListener("click", (e) => {
        e.preventDefault();
        snd.pop();
        go("auth", "signup");
      });

      const forgotLink = box.querySelector("#forgotPassLink");
      if (forgotLink) {
        forgotLink.addEventListener("click", (e) => {
          e.preventDefault();
          snd.pop();
          go("forgot");
        });
      }

      box.querySelector("#authGuestBtn").addEventListener("click", () => {
        snd.pop();
        activeProfile = null;
        stickers = LS.get("stickers", {});
        levels = LS.get("levels", {});
        go("home");
      });

      setTimeout(() => emailInput.focus(), 120);
    } else {
      let chosen = AVATARS[0];
      const box = el("div", "auth-box", `
        <h2>Create Account ✨</h2>
        <input class="auth-input" type="text" id="signupName" placeholder="Your name" maxlength="50" autocomplete="name">
        <input class="auth-input" type="email" id="signupEmail" placeholder="Email" autocomplete="email">
        <input class="auth-input" type="password" id="signupPass" placeholder="Password (min 8 chars)" autocomplete="new-password">
        <input class="auth-input" type="text" id="signupChild" placeholder="Child's name (optional)" maxlength="60">
        <label class="auth-field-label" for="signupDob">Child's birthday (optional)</label>
        <input class="auth-input" type="date" id="signupDob" max="">
        <div class="avatar-picker" id="signupAvatarPicker"></div>
        <button class="p-btn auth-submit" id="signupBtn">✨ Create Account</button>
        <p class="auth-switch">Already have account? <a href="#" id="switchToLogin">Login here</a></p>
      `);
      const dobInput = box.querySelector("#signupDob");
      if (dobInput) dobInput.max = new Date().toISOString().slice(0, 10);
      wrap.appendChild(box);
      screenRoot.appendChild(wrap);

      const nameInput = box.querySelector("#signupName");
      const emailInput = box.querySelector("#signupEmail");
      const passInput = box.querySelector("#signupPass");
      const picker = box.querySelector("#signupAvatarPicker");

      AVATARS.forEach((a, i) => {
        const b = el("button", "avatar-opt" + (i === 0 ? " sel" : ""), a);
        b.addEventListener("click", () => {
          picker.querySelectorAll(".avatar-opt").forEach(x => x.classList.remove("sel"));
          b.classList.add("sel");
          chosen = a;
          snd.pop();
        });
        picker.appendChild(b);
      });

      box.querySelector("#signupBtn").addEventListener("click", async () => {
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passInput.value;
        const childName = (box.querySelector("#signupChild") || {}).value
          ? box.querySelector("#signupChild").value.trim()
          : "";
        if (!name) { toast("⚠️ Enter your name"); snd.wrong(); nameInput.focus(); return; }
        if (!email) { toast("⚠️ Enter your email"); snd.wrong(); emailInput.focus(); return; }
        if (password.length < (platformMode ? 8 : 4)) {
          toast("⚠️ Password must be " + (platformMode ? "8" : "4") + "+ chars");
          snd.wrong();
          passInput.focus();
          return;
        }

        if (platformMode) {
          const childDob = (box.querySelector("#signupDob") || {}).value || "";
          const data = await platformCall("/auth/register", {
            method: "POST",
            body: {
              display_name: name,
              email,
              password,
              child_name: childName || name.split(/\s+/)[0],
              avatar: chosen,
              preferred_language: CATALOG_LANG,
              date_of_birth: childDob || undefined,
            },
          });
          if (!data || !data.ok) {
            const err = data && data.error;
            const msg = err === "email_taken" ? "Email already registered" :
                        err === "bad_email" ? "Invalid email" :
                        err === "bad_password" ? "Password too short" : "Signup failed";
            toast("❌ " + msg);
            snd.wrong();
            return;
          }
          snd.fanfare();
          confetti(20);
          await activateParentSession(data);
          return;
        }

        const data = await apiCall("register", { name, email, password, avatar: chosen }, "POST");
        if (!data || !data.ok) {
          const err = data && data.error;
          const msg = err === "email_taken" ? "Email already registered" :
                      err === "bad_email" ? "Invalid email" :
                      err === "bad_password" ? "Password too short" : "Signup failed";
          toast("❌ " + msg);
          snd.wrong();
          return;
        }
        snd.fanfare();
        confetti(20);
        toast(`🎉 Welcome, ${name}!`);
        await loadProfileById(data.id, data.name, data.avatar);
      });

      box.querySelector("#switchToLogin").addEventListener("click", (e) => {
        e.preventDefault();
        snd.pop();
        go("auth", "login");
      });

      setTimeout(() => nameInput.focus(), 120);
    }

    speak(mode === "login" ? "Login to play!" : "Create your account!");
  };

  /* -------- child picker (platform) -------- */

  VIEWS.childPicker = function (opts) {
    opts = opts || {};
    titleEl.textContent = "Who is learning?";
    const wrap = el("div", "child-picker-wrap");
    wrap.innerHTML = `<div class="child-picker-loading">Loading profiles…</div>`;
    screenRoot.appendChild(wrap);

    async function render() {
      const kidsRes = await platformCall("/children");
      const children = (kidsRes && kidsRes.ok && kidsRes.children) ? kidsRes.children : [];
      if (opts.seedChild && opts.seedChild.id && !children.find(c => c.id === opts.seedChild.id)) {
        children.unshift(opts.seedChild);
      }
      opts.seedChild = null;

      wrap.innerHTML = "";
      const head = el("div", "child-picker-head", `
        <h2>Who is learning today?</h2>
        <p>Pick a child profile — we'll open their age-ready learning space.</p>`);
      wrap.appendChild(head);

      const list = el("div", "child-picker-grid");
      if (!children.length) {
        list.innerHTML = `<p class="child-picker-empty">No child profiles yet. Add one below to get started.</p>`;
      } else {
        children.forEach((c, i) => {
          const ageBit = c.age_group_label
            ? escapeHtml(c.age_group_label)
            : (c.age_years != null ? ("Age " + c.age_years) : "Add birthday");
          const card = el("button", "child-pick-card tone-" + (i % 4), `
            <span class="child-pick-avatar">${escapeHtml(c.avatar || "🧸")}</span>
            <span class="child-pick-name">${escapeHtml(c.display_name || "Learner")}</span>
            <span class="child-pick-meta">${ageBit}</span>`);
          card.type = "button";
          card.addEventListener("click", async () => {
            snd.pop();
            if (!c.date_of_birth) {
              showDobPrompt(c);
              return;
            }
            await selectChildAndEnter(c);
          });
          list.appendChild(card);
        });
      }
      wrap.appendChild(list);

      const form = el("div", "child-create-box", `
        <h3>Add a child</h3>
        <input class="auth-input" type="text" id="newChildName" placeholder="Child's name" maxlength="60">
        <label class="auth-field-label" for="newChildDob">Birthday</label>
        <input class="auth-input" type="date" id="newChildDob" max="">
        <button type="button" class="p-btn auth-submit" id="newChildBtn">Add & continue</button>
        <button type="button" class="p-btn plain" id="pickerGuestHome">Browse all activities (guest-style)</button>`);
      wrap.appendChild(form);
      const dobEl = form.querySelector("#newChildDob");
      dobEl.max = new Date().toISOString().slice(0, 10);

      form.querySelector("#newChildBtn").addEventListener("click", async () => {
        const name = form.querySelector("#newChildName").value.trim();
        const dob = dobEl.value;
        if (!name) { toast("⚠️ Enter a name"); snd.wrong(); return; }
        if (!dob) { toast("⚠️ Birthday helps us pick the right age group"); snd.wrong(); return; }
        const created = await platformCall("/children", {
          method: "POST",
          body: {
            display_name: name,
            date_of_birth: dob,
            avatar: "🧸",
            preferred_language: CATALOG_LANG,
          },
        });
        if (!created || !created.ok || !created.child) {
          toast("❌ Could not create profile");
          snd.wrong();
          return;
        }
        snd.correct();
        await selectChildAndEnter(created.child);
      });

      form.querySelector("#pickerGuestHome").addEventListener("click", () => {
        snd.pop();
        go("home");
      });
    }

    function showDobPrompt(child) {
      const overlay = el("div", "dob-overlay");
      overlay.innerHTML = `
        <div class="dob-card">
          <h3>Add ${escapeHtml(child.display_name || "child")}'s birthday</h3>
          <p>We use birthday only to choose the right learning stage.</p>
          <input class="auth-input" type="date" id="fixDob" max="">
          <button type="button" class="p-btn" id="saveDobBtn">Save & continue</button>
          <button type="button" class="p-btn plain" id="skipDobBtn">Continue without birthday</button>
        </div>`;
      document.body.appendChild(overlay);
      const input = overlay.querySelector("#fixDob");
      input.max = new Date().toISOString().slice(0, 10);
      overlay.querySelector("#saveDobBtn").addEventListener("click", async () => {
        const dob = input.value;
        if (!dob) { toast("⚠️ Pick a birthday"); return; }
        const upd = await platformCall("/children/" + encodeURIComponent(child.id), {
          method: "PATCH",
          body: { date_of_birth: dob },
        });
        overlay.remove();
        if (upd && upd.ok && upd.child) {
          await selectChildAndEnter(upd.child);
        } else {
          child.date_of_birth = dob;
          await selectChildAndEnter(child);
        }
      });
      overlay.querySelector("#skipDobBtn").addEventListener("click", async () => {
        overlay.remove();
        await selectChildAndEnter(child);
      });
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) overlay.remove();
      });
    }

    render();
    speak("Who is learning today?");
  };

  /* -------- age dashboard (platform child) -------- */

  VIEWS.ageDashboard = function () {
    titleEl.textContent = "Your learning space";
    const wrap = el("div", "age-dash-wrap");
    wrap.innerHTML = `<div class="segment-loading">Opening learning space…</div>`;
    screenRoot.appendChild(wrap);

    const childId = parentSession && parentSession.childId;
    if (!childId) {
      go("childPicker");
      return;
    }

    platformCall(
      "/dashboard/child?child_id=" + encodeURIComponent(childId)
      + "&lang=" + encodeURIComponent(CATALOG_LANG)
    ).then(data => {
      if (!data || !data.ok) {
        wrap.innerHTML = `<p class="segment-subs-note">Could not load dashboard. <button type="button" class="p-btn" id="dashRetry">Try again</button></p>`;
        const retry = wrap.querySelector("#dashRetry");
        if (retry) retry.addEventListener("click", () => go("ageDashboard"));
        return;
      }

      if (data.child) applySelectedChild(data.child, parentSession.parent);
      updateSidebarUI();

      const welcome = data.welcome || {};
      const progress = data.progress || {};
      const recommended = (data.recommended_segments || []).map(normalizeSegment);
      const explore = (data.explore_segments || []).map(normalizeSegment);
      const mathRec = data.recommended_math_categories || [];
      const mathExplore = data.explore_math_categories || [];
      const childAgeCode = (data.child && (data.child.age_group_code || data.child.resolved_age_group_code)) || "";
      const isLittleExplorer = childAgeCode === "little_explorers"
        || Number(data.child && (data.child.resolved_age_group_id || data.child.age_group_id)) === 1;

      wrap.innerHTML = "";
      wrap.appendChild(el("section", "age-dash-hero", `
        <p class="age-dash-kicker">${escapeHtml(data.child && data.child.age_group_label ? data.child.age_group_label : "Learning stage")}</p>
        <h2>${escapeHtml(welcome.title || ("Hi " + (activeProfile && activeProfile.name) + "!"))}</h2>
        <p>${escapeHtml(welcome.subtitle || "Age-ready paths for today")}</p>
        <div class="age-dash-stats">
          <span>${progress.completed || 0} completed</span>
          <span>${progress.mastered || 0} mastered</span>
          <span>${progress.started || 0} started</span>
        </div>
        <div class="age-dash-actions">
          <button type="button" class="p-btn" id="dashExploreAll">Explore all paths</button>
          <button type="button" class="p-btn plain" id="dashSwitchChild">Switch child</button>
        </div>`));

      function openAgeDashSegment(seg) {
        snd.pop();
        trackPlatformProgress("segment." + (seg.code || seg.id), "started");
        if (isLittleExplorer && seg.code === "numbers_math" && typeof VIEWS.leNumbersMath === "function") {
          ageHubReturn = "ageDashboard";
          go("leNumbersMath");
          return;
        }
        if (isLittleExplorer) {
          openLittleExplorersSegment(seg);
          return;
        }
        go("segment", seg);
      }

      function appendSegmentSection(title, subtitle, items, placementClass) {
        const section = el("section", "age-dash-section");
        section.appendChild(el("div", "home-section-label", `<h3>${title}</h3><p>${subtitle}</p>`));
        const grid = el("div", "segment-grid " + (placementClass || ""));
        if (!items.length) {
          grid.innerHTML = `<p class="segment-subs-note">Nothing here yet for this stage.</p>`;
        } else {
          items.forEach((seg, i) => {
            const card = el("button", "segment-card tone-" + (i % 4), `
              ${segmentCardArtHtml(seg)}
              <span class="segment-title">${escapeHtml(seg.title || seg.code)}</span>
              <span class="segment-meta">${placementClass === "is-explore" ? "Explore" : "Recommended"}</span>`);
            card.type = "button";
            card.addEventListener("click", () => openAgeDashSegment(seg));
            grid.appendChild(card);
          });
        }
        section.appendChild(grid);
        wrap.appendChild(section);
      }

      appendSegmentSection("Recommended for you", "Matched to this age stage", recommended, "is-recommended");
      appendSegmentSection("Explore more", "Optional paths you can try anytime", explore, "is-explore");

      if (mathRec.length || mathExplore.length) {
        const mathSec = el("section", "age-dash-section");
        mathSec.appendChild(el("div", "home-section-label", `
          <h3>Numbers & Math picks</h3>
          <p>Category starters for this age</p>`));
        const mathGrid = el("div", "math-category-grid");
        const mathSeg = recommended.find(s => Number(s.id) === 1)
          || explore.find(s => Number(s.id) === 1)
          || { id: 1, code: "numbers_math", title: "Numbers & Math" };
        mathRec.concat(mathExplore).slice(0, 8).forEach((cat) => {
          const accent = cat.accent_color || "#E8D5F5";
          const card = el("button", "math-category-card", `
            ${mathIllustrationHtml(cat)}
            <span class="math-card-body">
              <strong class="math-card-title">${escapeHtml(cat.title || cat.code)}</strong>
              <span class="math-card-meta">
                <span>${cat.placement === "explore" ? "Explore" : "Recommended"}</span>
              </span>
            </span>`);
          card.type = "button";
          card.style.setProperty("--math-accent", accent);
          card.addEventListener("click", () => {
            snd.pop();
            trackPlatformProgress("category." + (cat.code || cat.id), "started");
            if (isLittleExplorer && typeof VIEWS.leNumbersMath === "function") {
              ageHubReturn = "ageDashboard";
              go("leNumbersMath");
              return;
            }
            go("mathCategory", { segment: mathSeg, category: cat });
          });
          mathGrid.appendChild(card);
        });
        mathSec.appendChild(mathGrid);
        wrap.appendChild(mathSec);
      }

      wrap.querySelector("#dashExploreAll").addEventListener("click", () => {
        snd.pop();
        go("home");
      });
      wrap.querySelector("#dashSwitchChild").addEventListener("click", () => {
        snd.pop();
        go("childPicker");
      });

      speak(welcome.title || ("Hi " + (activeProfile && activeProfile.name)));
    });
  };

  async function loadProfileById(id, name, avatar) {
    const t = token;
    const data = await apiCall("load", { id });
    if (t !== token) return;
    if (!data || !data.ok) { toast("⚠️ Could not load profile"); return; }

    activeProfile = { id: data.profile.id, name: data.profile.name, avatar: data.profile.avatar };
    stickers = data.profile.stickers || {};
    levels = data.profile.levels || {};
    speechOn = data.profile.speech_on !== false;
    LS.set("authProfile", activeProfile.id);
    updateParentUI();
    updateSidebarUI();

    snd.correct();
    speak(`Hi ${data.profile.name}! Let's play!`);
    go("home");
  }

  function applySelectedChild(child, parent) {
    const p = parent || (parentSession && parentSession.parent) || {};
    if (!parentSession) {
      parentSession = { token: null, parent: p, childId: null };
    }
    parentSession.parent = p;
    parentSession.childId = child ? child.id : null;
    persistParentSession();
    activeProfile = {
      id: child ? ("child:" + child.id) : ("parent:" + (p.id || "parent")),
      name: (child && child.display_name) || p.display_name || "Learner",
      avatar: (child && child.avatar) || "🧸",
      parentId: p.id,
      childId: child ? child.id : null,
      ageGroupId: child ? (child.resolved_age_group_id || child.age_group_id) : null,
      ageYears: child ? child.age_years : null,
      ageGroupLabel: child ? child.age_group_label : null,
      dateOfBirth: child ? child.date_of_birth : null,
      platform: true,
    };
  }

  async function activateParentSession(authData) {
    const parent = authData.parent || {};
    parentSession = {
      token: authData.token,
      parent: parent,
      childId: null,
    };
    persistParentSession();
    stickers = LS.get("stickers", {});
    levels = LS.get("levels", {});
    activeProfile = {
      id: "parent:" + parent.id,
      name: parent.display_name || "Parent",
      avatar: "🧸",
      parentId: parent.id,
      childId: null,
      platform: true,
    };
    updateParentUI();
    updateSidebarUI();
    snd.correct();
    toast("🎉 Welcome, " + (parent.display_name || "friend") + "!");
    go("childPicker", { seedChild: authData.child || null });
  }

  async function restoreParentSession() {
    const saved = LS.get("parentSession", null);
    if (!saved || !saved.token) return false;
    parentSession = saved;
    const me = await platformCall("/auth/me");
    if (!me || !me.ok) {
      parentSession = null;
      persistParentSession();
      return false;
    }
    parentSession.parent = me.parent;
    const kids = await platformCall("/children");
    let child = null;
    if (kids && kids.ok && kids.children && kids.children.length && saved.childId) {
      child = kids.children.find(c => c.id === saved.childId) || null;
    }
    if (child) {
      applySelectedChild(child, me.parent);
    } else {
      parentSession.childId = null;
      persistParentSession();
      activeProfile = {
        id: "parent:" + me.parent.id,
        name: me.parent.display_name || "Parent",
        avatar: "🧸",
        parentId: me.parent.id,
        childId: null,
        platform: true,
      };
    }
    return true;
  }

  async function selectChildAndEnter(child) {
    if (!child || !child.id) return;
    const res = await platformCall("/children/" + encodeURIComponent(child.id) + "/select", {
      method: "POST",
      body: { child_id: child.id },
    });
    const full = (res && res.ok && res.child) ? res.child : child;
    applySelectedChild(full, parentSession && parentSession.parent);
    updateParentUI();
    updateSidebarUI();
    speak("Hi " + activeProfile.name + "!");
    toast("Hi " + activeProfile.name + "!");
    go("ageDashboard");
  }

  /* -------- forgot password -------- */

  VIEWS.forgot = function () {
    titleEl.textContent = "🔑 Forgot Password";

    const wrap = el("div", "auth-wrap");
    const box = el("div", "auth-box", `
      <h2>Reset your password</h2>
      <p style="text-align:center;font-size:14px;opacity:0.8;margin:0 0 8px">Enter your registered email to get a reset token.</p>
      <input class="auth-input" type="email" id="forgotEmail" placeholder="Email" autocomplete="email">
      <button class="p-btn auth-submit" id="forgotBtn">📧 Get Reset Token</button>
      <div id="forgotResult" class="forgot-result hidden"></div>
      <p class="auth-switch"><a href="#" id="backToLogin">Back to login</a></p>
    `);
    wrap.appendChild(box);
    screenRoot.appendChild(wrap);

    box.querySelector("#forgotBtn").addEventListener("click", async () => {
      const email = box.querySelector("#forgotEmail").value.trim();
      if (!email) { toast("⚠️ Enter your email"); snd.wrong(); return; }
      const data = await apiCall("forgot_password", { email }, "POST");
      const result = box.querySelector("#forgotResult");
      if (!data || !data.ok) {
        toast("❌ " + (data && data.error === "email_not_found" ? "Email not found" : "Failed"));
        snd.wrong();
        return;
      }
      result.classList.remove("hidden");
      result.innerHTML = `<p style="font-size:13px;word-break:break-all;margin:0">Token: <b>${data.token}</b></p><p style="font-size:12px;opacity:0.7;margin:4px 0 0">Expires: ${data.expires}</p><button class="p-btn" id="goResetBtn" style="margin-top:10px;width:100%">Reset Password →</button>`;
      snd.correct();
      toast("✅ Reset token generated");
      result.querySelector("#goResetBtn").addEventListener("click", () => {
        snd.pop();
        go("reset", data.token);
      });
    });

    box.querySelector("#backToLogin").addEventListener("click", (e) => {
      e.preventDefault();
      snd.pop();
      go("auth", "login");
    });

    setTimeout(() => box.querySelector("#forgotEmail").focus(), 120);
  };

  /* -------- reset password -------- */

  VIEWS.reset = function (token) {
    titleEl.textContent = "🔒 Reset Password";

    const wrap = el("div", "auth-wrap");
    const box = el("div", "auth-box", `
      <h2>Set new password</h2>
      <input class="auth-input" type="password" id="resetToken" placeholder="Reset token" value="${token || ''}" autocomplete="off">
      <input class="auth-input" type="password" id="resetPass" placeholder="New password (min 8 chars)" autocomplete="new-password">
      <input class="auth-input" type="password" id="resetPass2" placeholder="Confirm password" autocomplete="new-password">
      <button class="p-btn auth-submit" id="resetBtn2">🔒 Reset Password</button>
      <p class="auth-switch"><a href="#" id="backToLogin2">Back to login</a></p>
    `);
    wrap.appendChild(box);
    screenRoot.appendChild(wrap);

    box.querySelector("#resetBtn2").addEventListener("click", async () => {
      const tok = box.querySelector("#resetToken").value.trim();
      const pass = box.querySelector("#resetPass").value;
      const pass2 = box.querySelector("#resetPass2").value;
      if (!tok) { toast("⚠️ Enter reset token"); snd.wrong(); return; }
      if (pass.length < 8) { toast("⚠️ Password must be 8+ chars"); snd.wrong(); return; }
      if (pass !== pass2) { toast("⚠️ Passwords don't match"); snd.wrong(); return; }
      const data = await apiCall("reset_password", { token: tok, password: pass }, "POST");
      if (!data || !data.ok) {
        const err = data && data.error;
        const msg = err === "invalid_token" ? "Invalid token" :
                    err === "token_expired" ? "Token expired" :
                    err === "bad_password" ? "Password too short" : "Reset failed";
        toast("❌ " + msg);
        snd.wrong();
        return;
      }
      snd.correct();
      toast("✅ Password reset! Please login.");
      go("auth", "login");
    });

    box.querySelector("#backToLogin2").addEventListener("click", (e) => {
      e.preventDefault();
      snd.pop();
      go("auth", "login");
    });

    setTimeout(() => box.querySelector("#resetPass").focus(), 120);
  };

  /* -------- profile view/edit -------- */

  VIEWS.profile = function () {
    if (!activeProfile) { go("auth", "login"); return; }
    titleEl.textContent = "👤 My Profile";

    const wrap = el("div", "profile-view");
    const data = activeProfile;
    const joinedDate = new Date().toLocaleDateString();

    const card = el("div", "profile-card-view", `
      <div class="pv-avatar">${data.avatar}</div>
      <div class="pv-name">${escapeHtml(data.name)}</div>
      <div class="pv-email">${escapeHtml(data.email || '')}</div>
      <div class="pv-joined">Joined: ${joinedDate}</div>
    `);
    wrap.appendChild(card);

    const editBox = el("div", "auth-box", `
      <h2>Edit Profile</h2>
      <input class="auth-input" type="text" id="editName" placeholder="Display name" value="${escapeHtml(data.name)}">
      <div class="avatar-picker" id="editAvatarPicker"></div>
      <input class="auth-input" type="password" id="editPass" placeholder="New password (leave blank to keep)">
      <button class="p-btn auth-submit" id="editSaveBtn">💾 Save Changes</button>
    `);
    wrap.appendChild(editBox);

    let chosen = data.avatar;
    const picker = editBox.querySelector("#editAvatarPicker");
    AVATARS.forEach((a, i) => {
      const b = el("button", "avatar-opt" + (a === chosen ? " sel" : ""), a);
      b.addEventListener("click", () => {
        picker.querySelectorAll(".avatar-opt").forEach(x => x.classList.remove("sel"));
        b.classList.add("sel");
        chosen = a;
        snd.pop();
      });
      picker.appendChild(b);
    });

    editBox.querySelector("#editSaveBtn").addEventListener("click", async () => {
      const name = editBox.querySelector("#editName").value.trim();
      const password = editBox.querySelector("#editPass").value;
      if (!name) { toast("⚠️ Name required"); snd.wrong(); return; }
      const params = { id: activeProfile.id, name, avatar: chosen };
      if (password && password.length >= 8) params.password = password;
      const res = await apiCall("update_profile", params, "POST");
      if (!res || !res.ok) { toast("❌ Update failed"); snd.wrong(); return; }
      activeProfile.name = name;
      activeProfile.avatar = chosen;
      LS.set("authProfile", activeProfile.id);
      updateSidebarUI();
      snd.correct();
      toast("✅ Profile updated!");
    });

    screenRoot.appendChild(wrap);
    speak("Here is your profile. You can edit your name, avatar, or password.");
  };

  /* -------- learn -------- */

  VIEWS.learn = function () {
    titleEl.textContent = "📖 Learn the Letters";

    const grid = el("div", "grid learn-grid");
    ALPHABET.forEach((item, i) => {
      const cardWrap = el("div", "learn-card-wrap");
      const card = el("button", "card learn-card",
        `<span class="emoji-bubble">${item.emoji}</span><span class="letter">${item.letter}</span>`);
      card.setAttribute("style", tintStyle(i));
      card.style.animationDelay = (i * 0.03) + "s";
      card.addEventListener("click", () => openLearn(item));

      const speaker = el("button", "learn-card-speaker", "🔊");
      speaker.type = "button";
      speaker.setAttribute("aria-label", `Hear ${item.letter}, ${item.word}`);
      speaker.title = `Hear ${item.letter} and ${item.word}`;
      speaker.addEventListener("click", () => {
        snd.pop();
        sayLetterAndWord(item);
      });

      cardWrap.append(card, speaker);
      grid.appendChild(cardWrap);
    });
    screenRoot.appendChild(grid);
  };

  function sayLetterAndWord(item) {
    const sound = PHONICS[item.letter] || item.letter;
    // Letter name + phonics sound + word (e.g. "A. ah. Apple.")
    speak(`${item.letter}. ${sound}. ${item.word}.`, { rate: 0.72, pitch: 1.14, volume: 0.9 });
  }

  function openLearn(item) {
    snd.pop();
    let currentIndex = Math.max(0, ALPHABET.findIndex(x => x.letter === item.letter));
    let flipped = false;
    let slideLock = false;

    const overlay = el("div", "overlay");
    const box = el("div", "popup learn-popup", `
      <button class="close-btn" aria-label="Close">✖</button>
      <div class="learn-slider" aria-live="polite">
        <div class="learn-slide">
          <button type="button" class="flip-card" aria-label="Flip card">
            <span class="flip-inner">
              <span class="flip-face flip-front">
                <span class="learn-emoji learn-emoji-front"></span>
                <span class="learn-letter"></span>
                <span class="learn-phonics"></span>
                <span class="flip-cue">Tap to see the word</span>
              </span>
              <span class="flip-face flip-back">
                <span class="learn-emoji learn-emoji-back"></span>
                <span class="learn-word"></span>
                <span class="learn-phonics-back"></span>
              </span>
            </span>
          </button>
        </div>
      </div>
      <div class="learn-nav">
        <button class="learn-nav-btn previous" aria-label="Previous letter">←</button>
        <span class="learn-nav-counter"></span>
        <button class="learn-nav-btn next" aria-label="Next letter">→</button>
      </div>
      <div class="hint">👆 Swipe letters · tap card to flip · 🔊 hear again</div>`);
    overlay.appendChild(box);
    document.body.appendChild(overlay);

    const slider = $(".learn-slider", box);
    const slide = $(".learn-slide", box);
    const flipCard = $(".flip-card", box);
    const emojiFront = $(".learn-emoji-front", box);
    const emojiBack = $(".learn-emoji-back", box);
    const letter = $(".learn-letter", box);
    const word = $(".learn-word", box);
    const phonicsEl = $(".learn-phonics", box);
    const phonicsBack = $(".learn-phonics-back", box);
    const counter = $(".learn-nav-counter", box);
    const previous = $(".learn-nav-btn.previous", box);
    const next = $(".learn-nav-btn.next", box);

    const setFlipped = (on) => {
      flipped = !!on;
      flipCard.classList.toggle("is-flipped", flipped);
    };

    const showLetter = (opts) => {
      opts = opts || {};
      const currentItem = ALPHABET[currentIndex];
      const tint = tintFor(currentIndex);
      const sound = PHONICS[currentItem.letter] || currentItem.letter;
      box.setAttribute("style", `--accent:${tint[0]};--soft:${tint[1]}`);
      emojiFront.textContent = currentItem.emoji;
      emojiBack.textContent = currentItem.emoji;
      letter.textContent = currentItem.letter;
      word.textContent = currentItem.word;
      phonicsEl.textContent = `🔊 /${sound}/`;
      phonicsBack.textContent = `${currentItem.letter} says /${sound}/`;
      counter.textContent = `${currentItem.letter} of ${ALPHABET.length}`;
      previous.disabled = currentIndex === 0;
      next.disabled = currentIndex === ALPHABET.length - 1;
      flipCard.setAttribute(
        "aria-label",
        flipped
          ? `${currentItem.letter} says ${sound}. ${currentItem.letter} is for ${currentItem.word}. Tap to flip back.`
          : `Letter ${currentItem.letter} says ${sound}. Tap to flip.`
      );
      award(currentItem.letter);
      if (opts.speak !== false) sayLetterAndWord(currentItem);
    };

    const goTo = (index, direction) => {
      if (slideLock) return;
      const nextIndex = Math.max(0, Math.min(ALPHABET.length - 1, index));
      if (nextIndex === currentIndex) return;
      slideLock = true;
      setFlipped(false);
      const outClass = direction < 0 ? "slide-out-right" : "slide-out-left";
      const inClass = direction < 0 ? "slide-in-left" : "slide-in-right";
      slide.classList.remove("slide-out-left", "slide-out-right", "slide-in-left", "slide-in-right");
      void slide.offsetWidth;
      slide.classList.add(outClass);
      later(() => {
        currentIndex = nextIndex;
        showLetter();
        slide.classList.remove(outClass);
        void slide.offsetWidth;
        slide.classList.add(inClass);
        later(() => {
          slide.classList.remove(inClass);
          slideLock = false;
        }, 220);
      }, 160);
    };

    previous.addEventListener("click", () => {
      if (currentIndex === 0 || slideLock) return;
      snd.pop();
      goTo(currentIndex - 1, -1);
    });
    next.addEventListener("click", () => {
      if (currentIndex === ALPHABET.length - 1 || slideLock) return;
      snd.pop();
      goTo(currentIndex + 1, 1);
    });

    flipCard.addEventListener("click", e => {
      e.stopPropagation();
      if (slideLock) return;
      snd.flip();
      setFlipped(!flipped);
      sayLetterAndWord(ALPHABET[currentIndex]);
    });

    // Horizontal swipe between letters (ignore tiny moves / vertical scrolls).
    let touchStartX = 0;
    let touchStartY = 0;
    let swiping = false;
    slider.addEventListener("touchstart", e => {
      if (!e.touches || !e.touches[0]) return;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      swiping = true;
    }, { passive: true });
    slider.addEventListener("touchend", e => {
      if (!swiping) return;
      swiping = false;
      const t = e.changedTouches && e.changedTouches[0];
      if (!t) return;
      const dx = t.clientX - touchStartX;
      const dy = t.clientY - touchStartY;
      if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy)) return;
      if (dx < 0) {
        if (currentIndex < ALPHABET.length - 1 && !slideLock) {
          snd.pop();
          goTo(currentIndex + 1, 1);
        }
      } else if (currentIndex > 0 && !slideLock) {
        snd.pop();
        goTo(currentIndex - 1, -1);
      }
    }, { passive: true });

    // Pointer drag support for desktop / mouse.
    let pointerStartX = null;
    slider.addEventListener("pointerdown", e => {
      if (e.pointerType === "touch") return;
      if (e.button != null && e.button !== 0) return;
      pointerStartX = e.clientX;
    });
    slider.addEventListener("pointerup", e => {
      if (pointerStartX == null || e.pointerType === "touch") return;
      const dx = e.clientX - pointerStartX;
      pointerStartX = null;
      if (Math.abs(dx) < 56) return;
      if (dx < 0) {
        if (currentIndex < ALPHABET.length - 1 && !slideLock) {
          snd.pop();
          goTo(currentIndex + 1, 1);
        }
      } else if (currentIndex > 0 && !slideLock) {
        snd.pop();
        goTo(currentIndex - 1, -1);
      }
    });
    slider.addEventListener("pointercancel", () => { pointerStartX = null; });

    $(".close-btn", box).addEventListener("click", e => {
      e.stopPropagation();
      overlay.remove();
    });
    overlay.addEventListener("click", e => {
      if (e.target === overlay) overlay.remove();
    });

    showLetter();
  }

  /* -------- Learn Numbers (same style as Learn Letters) -------- */

  VIEWS.learnCount = function () {
    titleEl.textContent = "🔢 Learn the Numbers";

    const grid = el("div", "grid learn-grid");
    NUMBERS_1_20.forEach((item, i) => {
      const theme = item.theme || COUNT_THEMES[i % COUNT_THEMES.length];
      const cardWrap = el("div", "learn-card-wrap");
      const card = el("button", "card learn-card",
        `<span class="emoji-bubble">${theme.emoji}</span><span class="letter">${item.n}</span>`);
      card.setAttribute("style", tintStyle(i));
      card.style.animationDelay = (i * 0.03) + "s";
      card.addEventListener("click", () => openLearnNumber(item));

      const speaker = el("button", "learn-card-speaker", "🔊");
      speaker.type = "button";
      speaker.setAttribute("aria-label", `Hear ${item.n}, ${item.word}`);
      speaker.title = `Hear ${item.n} and ${item.word}`;
      speaker.addEventListener("click", () => {
        snd.pop();
        sayLearnNumber(item);
      });

      cardWrap.append(card, speaker);
      grid.appendChild(cardWrap);
    });
    screenRoot.appendChild(grid);
    speak("Let's learn the numbers!");
  };

  function sayLearnNumber(item) {
    // Word only once — avoids "5" + "Five" double sound
    speak(item.word + ".", { rate: 0.78, pitch: 1.12, volume: 0.9 });
  }

  function openLearnNumber(item) {
    snd.pop();
    let currentIndex = Math.max(0, NUMBERS_1_20.findIndex(x => x.n === item.n));
    let flipped = false;
    let slideLock = false;

    const overlay = el("div", "overlay");
    const box = el("div", "popup learn-popup", `
      <button class="close-btn" aria-label="Close">✖</button>
      <div class="learn-slider" aria-live="polite">
        <div class="learn-slide">
          <button type="button" class="flip-card" aria-label="Flip card">
            <span class="flip-inner">
              <span class="flip-face flip-front">
                <span class="learn-emoji learn-emoji-front"></span>
                <span class="learn-letter count-display"></span>
                <span class="learn-phonics"></span>
                <span class="flip-cue">Tap to see the word</span>
              </span>
              <span class="flip-face flip-back">
                <span class="learn-emoji learn-emoji-back"></span>
                <span class="learn-word"></span>
                <span class="learn-phonics-back"></span>
              </span>
            </span>
          </button>
        </div>
      </div>
      <div class="learn-nav">
        <button class="learn-nav-btn previous" aria-label="Previous number">←</button>
        <span class="learn-nav-counter"></span>
        <button class="learn-nav-btn next" aria-label="Next number">→</button>
      </div>
      <div class="hint">👆 Swipe numbers · tap card to flip · 🔊 hear again</div>`);
    overlay.appendChild(box);
    document.body.appendChild(overlay);

    const slider = $(".learn-slider", box);
    const slide = $(".learn-slide", box);
    const flipCard = $(".flip-card", box);
    const emojiFront = $(".learn-emoji-front", box);
    const emojiBack = $(".learn-emoji-back", box);
    const numberEl = $(".count-display", box);
    const word = $(".learn-word", box);
    const phonicsEl = $(".learn-phonics", box);
    const phonicsBack = $(".learn-phonics-back", box);
    const counter = $(".learn-nav-counter", box);
    const previous = $(".learn-nav-btn.previous", box);
    const next = $(".learn-nav-btn.next", box);

    const setFlipped = (on) => {
      flipped = !!on;
      flipCard.classList.toggle("is-flipped", flipped);
    };

    const showNumber = (opts) => {
      opts = opts || {};
      const currentItem = NUMBERS_1_20[currentIndex];
      const theme = currentItem.theme || COUNT_THEMES[(currentItem.n - 1) % COUNT_THEMES.length];
      const tint = tintFor(currentIndex);
      box.setAttribute("style", `--accent:${tint[0]};--soft:${tint[1]}`);
      emojiFront.textContent = theme.emoji;
      emojiBack.textContent = theme.emoji;
      numberEl.textContent = String(currentItem.n);
      word.textContent = currentItem.word;
      phonicsEl.textContent = `🔊 ${currentItem.word}`;
      phonicsBack.textContent = `${currentItem.n} is ${currentItem.word}`;
      counter.textContent = `${currentItem.n} of ${NUMBERS_1_20.length}`;
      previous.disabled = currentIndex === 0;
      next.disabled = currentIndex === NUMBERS_1_20.length - 1;
      flipCard.setAttribute(
        "aria-label",
        flipped
          ? `${currentItem.n} is ${currentItem.word}. Tap to flip back.`
          : `Number ${currentItem.n}. Tap to see the word.`
      );
      if (opts.speak !== false) sayLearnNumber(currentItem);
    };

    const goTo = (index, direction) => {
      if (slideLock) return;
      const nextIndex = Math.max(0, Math.min(NUMBERS_1_20.length - 1, index));
      if (nextIndex === currentIndex) return;
      slideLock = true;
      setFlipped(false);
      const outClass = direction < 0 ? "slide-out-right" : "slide-out-left";
      const inClass = direction < 0 ? "slide-in-left" : "slide-in-right";
      slide.classList.remove("slide-out-left", "slide-out-right", "slide-in-left", "slide-in-right");
      void slide.offsetWidth;
      slide.classList.add(outClass);
      later(() => {
        currentIndex = nextIndex;
        showNumber();
        slide.classList.remove(outClass);
        void slide.offsetWidth;
        slide.classList.add(inClass);
        later(() => {
          slide.classList.remove(inClass);
          slideLock = false;
        }, 220);
      }, 160);
    };

    previous.addEventListener("click", () => {
      if (currentIndex === 0 || slideLock) return;
      snd.pop();
      goTo(currentIndex - 1, -1);
    });
    next.addEventListener("click", () => {
      if (currentIndex === NUMBERS_1_20.length - 1 || slideLock) return;
      snd.pop();
      goTo(currentIndex + 1, 1);
    });

    flipCard.addEventListener("click", e => {
      e.stopPropagation();
      if (slideLock) return;
      snd.flip();
      setFlipped(!flipped);
      sayLearnNumber(NUMBERS_1_20[currentIndex]);
    });

    let touchStartX = 0;
    let touchStartY = 0;
    let swiping = false;
    slider.addEventListener("touchstart", e => {
      if (!e.touches || !e.touches[0]) return;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      swiping = true;
    }, { passive: true });
    slider.addEventListener("touchend", e => {
      if (!swiping) return;
      swiping = false;
      const t = e.changedTouches && e.changedTouches[0];
      if (!t) return;
      const dx = t.clientX - touchStartX;
      const dy = t.clientY - touchStartY;
      if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy)) return;
      if (dx < 0) {
        if (currentIndex < NUMBERS_1_20.length - 1 && !slideLock) {
          snd.pop();
          goTo(currentIndex + 1, 1);
        }
      } else if (currentIndex > 0 && !slideLock) {
        snd.pop();
        goTo(currentIndex - 1, -1);
      }
    }, { passive: true });

    let pointerStartX = null;
    slider.addEventListener("pointerdown", e => {
      if (e.pointerType === "touch") return;
      if (e.button != null && e.button !== 0) return;
      pointerStartX = e.clientX;
    });
    slider.addEventListener("pointerup", e => {
      if (pointerStartX == null || e.pointerType === "touch") return;
      const dx = e.clientX - pointerStartX;
      pointerStartX = null;
      if (Math.abs(dx) < 56) return;
      if (dx < 0) {
        if (currentIndex < NUMBERS_1_20.length - 1 && !slideLock) {
          snd.pop();
          goTo(currentIndex + 1, 1);
        }
      } else if (currentIndex > 0 && !slideLock) {
        snd.pop();
        goTo(currentIndex - 1, -1);
      }
    });
    slider.addEventListener("pointercancel", () => { pointerStartX = null; });

    $(".close-btn", box).addEventListener("click", e => {
      e.stopPropagation();
      overlay.remove();
    });
    overlay.addEventListener("click", e => {
      if (e.target === overlay) overlay.remove();
    });

    showNumber();
  }

  /* -------- counting (interactive 1–20 + classic 21–100) -------- */

  VIEWS.count = function () {
    titleEl.textContent = "🔢 Let's Count!";

    const wrap = el("div", "count-wrap");
    wrap.appendChild(el("div", "count-hero", `
      <div class="count-hero-badge">1 – 20</div>
      <h2 class="count-hero-title">Tap a number & count the toys!</h2>
      <p class="count-hero-sub">Big numbers · cute objects · listen & count along</p>`));

    const launches = el("div", "count-launches");
    const learnLaunch = el("button", "count-game-launch count-learn-launch", `
      <span class="count-game-launch-emoji">🔢</span>
      <span class="count-game-launch-text">
        <strong>Learn Numbers</strong>
        <small>Just like Learn Letters — flip cards for 1 to 20</small>
      </span>
      <span class="count-game-launch-go">Learn →</span>`);
    learnLaunch.type = "button";
    learnLaunch.addEventListener("click", () => { snd.pop(); go("learnCount"); });
    launches.appendChild(learnLaunch);
    const gameLaunch = el("button", "count-game-launch", `
      <span class="count-game-launch-emoji">🎯</span>
      <span class="count-game-launch-text">
        <strong>Count the Objects</strong>
        <small>How many can you count? Fun quiz game!</small>
      </span>
      <span class="count-game-launch-go">Play →</span>`);
    gameLaunch.type = "button";
    gameLaunch.addEventListener("click", () => { snd.pop(); go("countQuiz"); });

    const traceLaunch = el("button", "count-game-launch count-trace-launch", `
      <span class="count-game-launch-emoji">✏️</span>
      <span class="count-game-launch-text">
        <strong>Number Trace</strong>
        <small>Trace dotted numbers 1–30 with your finger!</small>
      </span>
      <span class="count-game-launch-go">Trace →</span>`);
    traceLaunch.type = "button";
    traceLaunch.addEventListener("click", () => { snd.pop(); go("countTrace"); });

    const togetherLaunch = el("button", "count-game-launch count-together-launch", `
      <span class="count-game-launch-emoji">👩‍🏫</span>
      <span class="count-game-launch-text">
        <strong>Let's Count Together!</strong>
        <small>A friendly teacher counts objects with you</small>
      </span>
      <span class="count-game-launch-go">Start →</span>`);
    togetherLaunch.type = "button";
    togetherLaunch.addEventListener("click", () => { snd.pop(); go("countTogether"); });

    launches.append(gameLaunch, traceLaunch, togetherLaunch);
    wrap.appendChild(launches);

    const pad = el("div", "count-pad");
    NUMBERS_1_20.forEach((item, i) => {
      const theme = item.theme || COUNT_THEMES[i];
      const btn = el("button", "count-pad-btn", `
        <span class="count-pad-emoji">${theme.emoji}</span>
        <span class="count-pad-num">${item.n}</span>`);
      btn.type = "button";
      btn.style.setProperty("--pad-color", theme.color);
      btn.style.animationDelay = (i * 0.03) + "s";
      btn.setAttribute("aria-label", `Count ${item.word}`);
      btn.addEventListener("click", () => {
        snd.pop();
        openCountPlay(item);
      });
      pad.appendChild(btn);
    });
    wrap.appendChild(pad);

    // Preserve 21–100 classic grid behind a toggle
    const more = el("div", "count-more");
    const moreBtn = el("button", "count-more-toggle", "📚 More numbers 21–100");
    moreBtn.type = "button";
    const morePanel = el("div", "count-more-panel hidden");
    const filters = el("div", "count-filters");
    const grid = el("div", "grid count-grid");
    let activeRange = "21";
    let moreOpen = false;

    const ranges = [
      { id: "21", label: "21–30" },
      { id: "31", label: "31–40" },
      { id: "41", label: "41–50" },
      { id: "51", label: "51–60" },
      { id: "61", label: "61–70" },
      { id: "71", label: "71–80" },
      { id: "81", label: "81–90" },
      { id: "91", label: "91–100" },
    ];

    const renderMoreGrid = () => {
      grid.innerHTML = "";
      const start = parseInt(activeRange, 10);
      NUMBERS.filter(item => item.n >= start && item.n < start + 10).forEach((item, i) => {
        const cardWrap = el("div", "learn-card-wrap count-card-wrap");
        const card = el("button", "card learn-card count-card",
          `<span class="emoji-bubble">${item.emoji}</span><span class="letter count-num">${item.n}</span>`);
        card.setAttribute("style", tintStyle((item.n - 1) % TINTS.length));
        card.style.animationDelay = (i * 0.02) + "s";
        card.addEventListener("click", () => openCount(item));
        const speaker = el("button", "learn-card-speaker", "🔊");
        speaker.type = "button";
        speaker.setAttribute("aria-label", `Hear ${item.word}`);
        speaker.addEventListener("click", () => { snd.pop(); sayNumber(item); });
        cardWrap.append(card, speaker);
        grid.appendChild(cardWrap);
      });
    };

    ranges.forEach(r => {
      const chip = el("button", "count-chip" + (r.id === "21" ? " sel" : ""), r.label);
      chip.type = "button";
      chip.addEventListener("click", () => {
        snd.pop();
        activeRange = r.id;
        filters.querySelectorAll(".count-chip").forEach(c => c.classList.remove("sel"));
        chip.classList.add("sel");
        renderMoreGrid();
      });
      filters.appendChild(chip);
    });
    morePanel.append(filters, grid);

    moreBtn.addEventListener("click", () => {
      snd.pop();
      moreOpen = !moreOpen;
      morePanel.classList.toggle("hidden", !moreOpen);
      moreBtn.textContent = moreOpen ? "🔼 Hide 21–100" : "📚 More numbers 21–100";
      if (moreOpen) renderMoreGrid();
    });

    more.append(moreBtn, morePanel);
    wrap.appendChild(more);
    screenRoot.appendChild(wrap);
    speak("Let's count! Tap a number.");
  };

  function sayNumber(item) {
    // Speak the word once only — saying both "5" and "Five" sounds like a double.
    speak(`Number ${item.word}.`, { rate: 0.78, pitch: 1.12, volume: 0.9 });
  }

  function sayCountStep(n) {
    speak(String(n), { rate: 0.85, pitch: 1.15, volume: 0.95 });
  }

  /* -------- Let's Count Together! (guided teacher) -------- */

  VIEWS.countTogether = function () {
    titleEl.textContent = "👩‍🏫 Count Together";

    let amount = 4;
    let theme = COUNT_THEMES[9]; // cupcakes default; will randomize
    let runId = 0;
    let busy = false;

    const wrap = el("div", "together-wrap");

    const teacher = el("div", "together-teacher", `
      <div class="together-teacher-art" aria-hidden="true">
        <svg class="teacher-svg" viewBox="0 0 160 160" role="img" aria-label="Friendly teacher">
          <defs>
            <linearGradient id="teacherFace" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stop-color="#ffe0b2"/>
              <stop offset="1" stop-color="#ffcc80"/>
            </linearGradient>
            <linearGradient id="teacherHair" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stop-color="#6d4c41"/>
              <stop offset="1" stop-color="#4e342e"/>
            </linearGradient>
          </defs>
          <ellipse cx="80" cy="138" rx="46" ry="12" fill="rgba(59,59,92,0.12)"/>
          <path d="M34 78 Q80 18 126 78 L118 92 Q80 48 42 92 Z" fill="url(#teacherHair)"/>
          <circle cx="80" cy="86" r="46" fill="url(#teacherFace)" stroke="#fff" stroke-width="5"/>
          <circle class="teacher-eye" cx="64" cy="82" r="6" fill="#3b3b5c"/>
          <circle class="teacher-eye" cx="96" cy="82" r="6" fill="#3b3b5c"/>
          <circle cx="52" cy="96" r="8" fill="#ff8a80" opacity="0.55"/>
          <circle cx="108" cy="96" r="8" fill="#ff8a80" opacity="0.55"/>
          <path class="teacher-smile" d="M62 104 Q80 118 98 104" fill="none" stroke="#3b3b5c" stroke-width="5" stroke-linecap="round"/>
          <ellipse class="teacher-mouth talk" cx="80" cy="108" rx="7" ry="5" fill="#e57373" opacity="0"/>
          <path d="M48 128 Q80 148 112 128 L108 158 L52 158 Z" fill="#4facfe"/>
          <circle cx="128" cy="70" r="14" fill="#ffd93d" stroke="#fff" stroke-width="3"/>
          <text x="128" y="75" text-anchor="middle" font-size="14" font-weight="900" fill="#3b3b5c">★</text>
        </svg>
      </div>
      <div class="together-bubble">
        <div class="together-bubble-text">Hi! Pick a number, then press Start.</div>
      </div>`);

    const picker = el("div", "together-picker");
    for (let n = 1; n <= 20; n++) {
      const b = el("button", "together-pick" + (n === amount ? " sel" : ""), String(n));
      b.type = "button";
      b.addEventListener("click", () => {
        if (busy) return;
        snd.pop();
        amount = n;
        picker.querySelectorAll(".together-pick").forEach(x => x.classList.remove("sel"));
        b.classList.add("sel");
        theme = COUNT_THEMES[(Math.random() * COUNT_THEMES.length) | 0];
        renderStage(false);
        setBubble(`Great! Let's get ready to count ${amount} ${theme.label}.`);
      });
      picker.appendChild(b);
    }

    const meta = el("div", "together-meta");
    const stage = el("div", "together-stage");
    const actions = el("div", "together-actions");
    const startBtn = el("button", "together-btn start", "▶️ Start Counting");
    const replayBtn = el("button", "together-btn replay", "🔁 Replay");
    const againBtn = el("button", "together-btn again", "🎲 Count Again");
    startBtn.type = replayBtn.type = againBtn.type = "button";
    actions.append(startBtn, replayBtn, againBtn);

    wrap.append(teacher, picker, meta, stage, actions);
    screenRoot.appendChild(wrap);

    const bubbleText = $(".together-bubble-text", teacher);
    const teacherArt = $(".together-teacher-art", teacher);

    function setBubble(msg) {
      bubbleText.textContent = msg;
    }

    function setTalking(on) {
      teacherArt.classList.toggle("is-talking", !!on);
      teacherArt.classList.toggle("is-happy", !on);
    }

    function renderStage(animate) {
      meta.innerHTML = `
        <span class="together-meta-badge">${amount}</span>
        <span class="together-meta-label">${theme.emoji} ${amount} ${theme.label}</span>`;
      stage.innerHTML = "";
      stage.style.setProperty("--obj-color", theme.color);
      for (let i = 0; i < amount; i++) {
        const obj = el("span", "together-obj" + (animate ? " spawn" : ""), theme.emoji);
        obj.style.animationDelay = (i * 0.05) + "s";
        obj.setAttribute("aria-hidden", "true");
        stage.appendChild(obj);
      }
    }

    function clearHighlights() {
      stage.querySelectorAll(".together-obj").forEach(o => o.classList.remove("lit", "pop", "counted"));
    }

    async function runSequence() {
      const myRun = ++runId;
      busy = true;
      startBtn.disabled = replayBtn.disabled = againBtn.disabled = true;
      picker.querySelectorAll(".together-pick").forEach(b => { b.disabled = true; });
      clearHighlights();
      setTalking(true);

      const stillHere = () => myRun === runId && current === "countTogether";

      setBubble("Let's count together!");
      await speakLine("Let's count together!", { rate: 0.88, pitch: 1.14 });
      if (!stillHere()) return;

      const objs = [...stage.querySelectorAll(".together-obj")];
      for (let i = 0; i < objs.length; i++) {
        if (!stillHere()) return;
        objs.forEach(o => o.classList.remove("lit", "pop"));
        objs[i].classList.add("lit", "pop", "counted");
        objs[i].scrollIntoView({ block: "nearest", behavior: "smooth" });
        const word = numberWord(i + 1);
        setBubble(word + "!");
        snd.pop();
        setTalking(true);
        await speakLine(word, { rate: 0.82, pitch: 1.16 });
        setTalking(false);
        if (!stillHere()) return;
      }

      objs.forEach(o => o.classList.add("lit"));
      const finale = `Amazing! ${numberWord(amount)} ${theme.label}!`;
      setBubble(finale);
      setTalking(true);
      teacherArt.classList.add("is-celebrate");
      snd.fanfare();
      confetti(26);
      await speakLine(finale, { rate: 0.88, pitch: 1.14 });
      setTalking(false);
      if (!stillHere()) return;

      toast("🎉 " + finale);
      busy = false;
      startBtn.disabled = replayBtn.disabled = againBtn.disabled = false;
      picker.querySelectorAll(".together-pick").forEach(b => { b.disabled = false; });
      later(() => teacherArt.classList.remove("is-celebrate"), 1200);
    }

    function freshThemeKeepAmount() {
      theme = COUNT_THEMES[(Math.random() * COUNT_THEMES.length) | 0];
      renderStage(true);
      setBubble(`Ready! ${amount} ${theme.label}. Press Start or Replay.`);
    }

    startBtn.addEventListener("click", () => {
      if (busy) return;
      snd.pop();
      runSequence();
    });
    replayBtn.addEventListener("click", () => {
      if (busy) return;
      snd.pop();
      clearHighlights();
      runSequence();
    });
    againBtn.addEventListener("click", () => {
      if (busy) return;
      snd.pop();
      amount = 1 + ((Math.random() * 20) | 0);
      picker.querySelectorAll(".together-pick").forEach(b => {
        b.classList.toggle("sel", parseInt(b.textContent, 10) === amount);
      });
      theme = COUNT_THEMES[(Math.random() * COUNT_THEMES.length) | 0];
      renderStage(true);
      setBubble(`New ones! ${amount} ${theme.label}. Let's count together!`);
      runSequence();
    });

    // Initial setup: 4 bananas-style random fruit-ish theme
    amount = 4;
    theme = COUNT_THEMES.find(t => /banana|apple|cupcake|star|balloon/i.test(t.label)) || COUNT_THEMES[0];
    picker.querySelectorAll(".together-pick").forEach(b => {
      b.classList.toggle("sel", parseInt(b.textContent, 10) === amount);
    });
    renderStage(true);
    setBubble("Hi! Pick a number, then press Start Counting.");
    speak("Let's count together! Pick a number and press start.", { rate: 0.88 });
  };

  /* -------- Count the Objects quiz game -------- */

  VIEWS.countQuiz = function () {
    titleEl.textContent = "🎯 Count the Objects";
    let locked = false;
    let roundScore = 0;

    const DIFF = [
      { min: 1, max: 5,  label: "Easy" },
      { min: 3, max: 8,  label: "Medium" },
      { min: 5, max: 12, label: "Tricky" },
    ];

    const wrap = el("div", "count-quiz-wrap");
    const header = el("div", "count-quiz-header");
    const stars = levelStars("countQuiz");
    const levelLabel = el("div", "count-quiz-level");
    header.append(stars, levelLabel);

    const ask = el("div", "count-quiz-ask");
    const stage = el("div", "count-quiz-stage");
    const choices = el("div", "count-quiz-choices");
    const feedback = el("div", "count-quiz-feedback");
    feedback.setAttribute("role", "status");
    feedback.setAttribute("aria-live", "polite");

    const hearAsk = el("button", "count-quiz-hear", "🔊 Hear the question");
    hearAsk.type = "button";

    wrap.append(header, ask, hearAsk, stage, choices, feedback);
    screenRoot.appendChild(wrap);

    function difficulty() {
      return DIFF[Math.min(levelOf("countQuiz"), DIFF.length - 1)];
    }

    function makeChoices(answer, maxN) {
      const opts = new Set([answer]);
      let guard = 0;
      while (opts.size < 3 && guard++ < 40) {
        const delta = (Math.random() < 0.5 ? -1 : 1) * (1 + ((Math.random() * 2) | 0));
        let n = answer + delta;
        if (n < 1) n = answer + 1 + ((Math.random() * 2) | 0);
        if (n > maxN) n = Math.max(1, answer - 1 - ((Math.random() * 2) | 0));
        if (n !== answer && n >= 1 && n <= Math.max(maxN, 12)) opts.add(n);
      }
      // fill if needed
      let fill = 1;
      while (opts.size < 3 && fill <= 20) {
        if (fill !== answer) opts.add(fill);
        fill++;
      }
      return shuffle([...opts]).slice(0, 3);
    }

    function round() {
      token++;
      locked = false;
      feedback.textContent = "";
      feedback.className = "count-quiz-feedback";
      choices.innerHTML = "";
      stage.innerHTML = "";

      const diff = difficulty();
      levelLabel.textContent = `Level: ${diff.label} · ⭐ ${roundScore} correct`;
      const answer = diff.min + ((Math.random() * (diff.max - diff.min + 1)) | 0);
      const theme = COUNT_THEMES[(Math.random() * COUNT_THEMES.length) | 0];
      stage.style.setProperty("--obj-color", theme.color);

      ask.innerHTML = `
        <div class="count-quiz-prompt">How many can you count?</div>
        <div class="count-quiz-theme">${theme.emoji} ${theme.label}</div>`;

      for (let i = 0; i < answer; i++) {
        const obj = el("span", "count-quiz-obj spawn", theme.emoji);
        obj.style.animationDelay = (i * 0.05) + "s";
        obj.setAttribute("aria-hidden", "true");
        stage.appendChild(obj);
      }

      const sayQuestion = () => {
        speak(`How many ${theme.label} can you count?`, { rate: 0.82, pitch: 1.12 });
      };
      hearAsk.onclick = () => { snd.pop(); sayQuestion(); };

      makeChoices(answer, diff.max).forEach(n => {
        const btn = el("button", "count-quiz-choice", String(n));
        btn.type = "button";
        btn.setAttribute("aria-label", `Choose ${n}`);
        btn.addEventListener("click", () => {
          if (locked) return;
          if (n === answer) {
            locked = true;
            btn.classList.add("correct");
            choices.querySelectorAll(".count-quiz-choice").forEach(b => {
              b.disabled = true;
              if (b !== btn) b.classList.add("dim");
            });
            stage.querySelectorAll(".count-quiz-obj").forEach((o, i) => {
              later(() => o.classList.add("lit", "pop"), i * 70);
            });
            roundScore++;
            noteCorrect("countQuiz");
            snd.fanfare();
            confetti(28);
            feedback.className = "count-quiz-feedback yes";
            feedback.textContent = "🎉 Amazing! You got it right!";
            speak("Amazing! You got it right!", { rate: 0.9, pitch: 1.15 });
            toast("🎉 Amazing!");
            later(() => {
              header.querySelector(".level-stars")?.replaceWith(levelStars("countQuiz"));
              round();
            }, 1800);
          } else {
            noteWrong("countQuiz");
            snd.wrong();
            wobble(btn);
            btn.classList.add("wrong");
            later(() => btn.classList.remove("wrong"), 500);
            feedback.className = "count-quiz-feedback no";
            feedback.textContent = "💛 Oops! Try again — you can do it!";
            speak("Try again! You can do it!", { throttle: true, rate: 0.9, pitch: 1.1 });
          }
        });
        choices.appendChild(btn);
      });

      later(sayQuestion, 280);
    }

    round();
  };

  /* -------- Number Tracing 1–30 -------- */

  VIEWS.countTrace = function () {
    titleEl.textContent = "✏️ Number Trace";

    let digitIndex = 0;
    let drawing = false;
    let completed = false;
    let lastPt = null;
    let lastVb = null;
    let hitPoints = [];
    let hitCount = 0;
    const PASS = 0.32; // toddler-friendly — about 1/3 of the path
    const HIT_R = 58;  // fat-finger friendly (viewBox units)
    const VB = { w: 200, h: 280 };
    const svgNS = "http://www.w3.org/2000/svg";

    const wrap = el("div", "trace-wrap");
    const picker = el("div", "trace-picker");
    const tip = el("div", "trace-tip");
    const board = el("div", "trace-board");
    const progressWrap = el("div", "trace-progress-wrap", `
      <div class="trace-progress-bar"><div class="trace-progress-fill"></div></div>
      <span class="trace-progress-label">0%</span>`);
    const actions = el("div", "trace-actions");
    const status = el("div", "trace-status");
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");

    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("viewBox", `0 0 ${VB.w} ${VB.h}`);
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
    svg.setAttribute("class", "trace-svg");
    svg.setAttribute("aria-hidden", "true");

    const canvas = el("canvas", "trace-canvas");
    canvas.setAttribute("aria-label", "Tracing canvas");
    board.append(svg, canvas);

    const clearBtn = el("button", "trace-btn clear", "🧹 Clear");
    const retryBtn = el("button", "trace-btn retry", "🔄 Retry");
    const hearBtn = el("button", "trace-btn hear", "🔊 Hear");
    clearBtn.type = retryBtn.type = hearBtn.type = "button";
    actions.append(clearBtn, retryBtn, hearBtn);

    wrap.append(picker, tip, board, progressWrap, actions, status);
    screenRoot.appendChild(wrap);

    const fillEl = $(".trace-progress-fill", progressWrap);
    const labelEl = $(".trace-progress-label", progressWrap);
    const ctx = canvas.getContext("2d");

    TRACE_NUMBERS.forEach((digit, i) => {
      const b = el("button", "trace-pick" + (i === 0 ? " sel" : ""), String(digit.n));
      b.type = "button";
      b.setAttribute("aria-label", `Trace number ${digit.n}`);
      b.addEventListener("click", () => {
        snd.pop();
        digitIndex = i;
        picker.querySelectorAll(".trace-pick").forEach(x => x.classList.remove("sel"));
        b.classList.add("sel");
        loadDigit(true);
      });
      picker.appendChild(b);
    });

    /* Shared layout: board content box ↔ viewBox (same math for ink + hits) */
    function layoutMetrics() {
      const rect = board.getBoundingClientRect();
      const bw = board.clientWidth || rect.width;
      const bh = board.clientHeight || rect.height;
      const borderX = (rect.width - bw) / 2;
      const borderY = (rect.height - bh) / 2;
      const scale = Math.min(bw / VB.w, bh / VB.h);
      const ox = (bw - VB.w * scale) / 2;
      const oy = (bh - VB.h * scale) / 2;
      return { rect, bw, bh, borderX, borderY, scale, ox, oy };
    }

    function samplePathEl(pathEl, step) {
      let len = 0;
      try { len = pathEl.getTotalLength(); } catch (e) { return []; }
      if (!len || !isFinite(len)) return [];
      const pts = [];
      const n = Math.max(24, Math.ceil(len / step));
      for (let i = 0; i <= n; i++) {
        const p = pathEl.getPointAtLength((len * i) / n);
        pts.push({ x: p.x, y: p.y, hit: false });
      }
      return pts;
    }

    function setupStrokeStyle(cssW) {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = "#ff6b9d";
      ctx.lineWidth = Math.max(18, cssW * 0.06);
    }

    function resizeCanvas() {
      const avail = wrap.getBoundingClientRect().width || 320;
      let outerW = Math.max(280, Math.floor(avail));
      let outerH = Math.floor(outerW * (VB.h / VB.w));
      if (outerH > 460) {
        outerH = 460;
        outerW = Math.floor(outerH * (VB.w / VB.h));
      }
      board.style.width = outerW + "px";
      board.style.height = outerH + "px";
      board.style.marginLeft = "auto";
      board.style.marginRight = "auto";

      // Match SVG exactly: use content box (border-box subtracts the 4px border)
      const cw = board.clientWidth || outerW;
      const ch = board.clientHeight || outerH;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(cw * dpr));
      canvas.height = Math.max(1, Math.floor(ch * dpr));
      canvas.style.width = cw + "px";
      canvas.style.height = ch + "px";
      setupStrokeStyle(cw);
      ctx.clearRect(0, 0, cw, ch);
    }

    function clientToViewBox(clientX, clientY) {
      const m = layoutMetrics();
      const x = clientX - m.rect.left - m.borderX;
      const y = clientY - m.rect.top - m.borderY;
      return {
        x: (x - m.ox) / m.scale,
        y: (y - m.oy) / m.scale,
      };
    }

    function clientToCanvas(clientX, clientY) {
      const m = layoutMetrics();
      return {
        x: clientX - m.rect.left - m.borderX,
        y: clientY - m.rect.top - m.borderY,
      };
    }

    function celebrate() {
      if (completed) return;
      completed = true;
      status.className = "trace-status yes";
      status.textContent = "🎉 Amazing tracing! You did it!";
      snd.fanfare();
      confetti(30);
      toast("🎉 Perfect tracing!");
      const digit = TRACE_NUMBERS[digitIndex];
      speak(`Amazing! You traced number ${digit.word}!`, { rate: 0.9, pitch: 1.15 });
      board.classList.add("trace-done");
    }

    function updateProgress() {
      if (!hitPoints.length) {
        fillEl.style.width = "0%";
        labelEl.textContent = "0%";
        return;
      }
      const pct = Math.round((hitCount / hitPoints.length) * 100);
      fillEl.style.width = pct + "%";
      labelEl.textContent = pct + "%";
      if (!completed && hitCount / hitPoints.length >= PASS) celebrate();
    }

    function markHits(vx, vy) {
      let gained = 0;
      const r2 = HIT_R * HIT_R;
      for (let i = 0; i < hitPoints.length; i++) {
        const p = hitPoints[i];
        if (p.hit) continue;
        const dx = p.x - vx;
        const dy = p.y - vy;
        if (dx * dx + dy * dy <= r2) {
          p.hit = true;
          hitCount++;
          gained++;
        }
      }
      if (gained) updateProgress();
    }

    function markSegment(v0, v1) {
      if (!v1) return;
      if (!v0) { markHits(v1.x, v1.y); return; }
      const dist = Math.hypot(v1.x - v0.x, v1.y - v0.y);
      const steps = Math.max(1, Math.ceil(dist / 3));
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        markHits(v0.x + (v1.x - v0.x) * t, v0.y + (v1.y - v0.y) * t);
      }
    }

    function clearInk(resetHits) {
      const cw = board.clientWidth || 280;
      const ch = board.clientHeight || 280;
      setupStrokeStyle(cw);
      ctx.clearRect(0, 0, cw, ch);
      if (resetHits) {
        hitPoints.forEach(p => { p.hit = false; });
        hitCount = 0;
        completed = false;
        board.classList.remove("trace-done");
        status.className = "trace-status";
        status.textContent = "Trace on the purple dots — progress goes up!";
        updateProgress();
      }
    }

    function rebuildHitsFromDom() {
      hitPoints = [];
      hitCount = 0;
      svg.querySelectorAll(".trace-path-dots").forEach(pathEl => {
        hitPoints = hitPoints.concat(samplePathEl(pathEl, 4));
      });
    }

    function loadDigit(speakIt) {
      const digit = TRACE_NUMBERS[digitIndex];
      tip.innerHTML = `
        <div class="trace-tip-num">${digit.n}</div>
        <div class="trace-tip-text">
          <strong>Trace ${digit.n}</strong>
          <span>${digit.tip}</span>
        </div>`;

      svg.innerHTML = "";
      const guide = document.createElementNS(svgNS, "g");
      guide.setAttribute("class", "trace-guide");
      (digit.paths || []).forEach(d => {
        const path = document.createElementNS(svgNS, "path");
        path.setAttribute("d", d);
        path.setAttribute("class", "trace-path-dots");
        guide.appendChild(path);
      });
      const start = digit.start || { x: 100, y: 40 };
      const arrow = document.createElementNS(svgNS, "g");
      arrow.setAttribute("class", "trace-arrow");
      arrow.setAttribute("transform", `translate(${start.x}, ${start.y})`);
      arrow.innerHTML = `
        <circle class="trace-start-dot" r="10" cx="0" cy="0"></circle>
        <path class="trace-arrow-head" d="M 0 18 L -12 40 L 0 34 L 12 40 Z"></path>
        <text class="trace-start-label" x="0" y="-18" text-anchor="middle">Start</text>`;
      svg.append(guide, arrow);

      completed = false;
      board.classList.remove("trace-done");
      resizeCanvas();
      rebuildHitsFromDom();
      clearInk(true);

      if (!hitPoints.length) {
        status.textContent = "⚠️ Could not load this number. Try another.";
      } else {
        status.textContent = "Follow Start → trace the purple dots!";
      }
      if (speakIt) {
        speak(`Let's trace number ${digit.word}. ${digit.tip}.`, { rate: 0.82, pitch: 1.1 });
      }
    }

    function pointerDown(e) {
      if (completed) return;
      e.preventDefault();
      drawing = true;
      try { canvas.setPointerCapture(e.pointerId); } catch (err) {}
      const c = clientToCanvas(e.clientX, e.clientY);
      const v = clientToViewBox(e.clientX, e.clientY);
      lastPt = c;
      lastVb = v;
      ctx.beginPath();
      ctx.moveTo(c.x, c.y);
      ctx.lineTo(c.x + 0.01, c.y + 0.01);
      ctx.stroke();
      markHits(v.x, v.y);
    }

    function pointerMove(e) {
      if (!drawing || completed) return;
      e.preventDefault();
      const c = clientToCanvas(e.clientX, e.clientY);
      const v = clientToViewBox(e.clientX, e.clientY);
      if (lastPt) {
        ctx.beginPath();
        ctx.moveTo(lastPt.x, lastPt.y);
        ctx.lineTo(c.x, c.y);
        ctx.stroke();
      }
      markSegment(lastVb, v);
      lastPt = c;
      lastVb = v;
    }

    function pointerUp() {
      if (!drawing) return;
      drawing = false;
      lastPt = null;
      lastVb = null;
    }

    canvas.addEventListener("pointerdown", pointerDown, { passive: false });
    canvas.addEventListener("pointermove", pointerMove, { passive: false });
    canvas.addEventListener("pointerup", pointerUp);
    canvas.addEventListener("pointercancel", pointerUp);
    canvas.addEventListener("lostpointercapture", pointerUp);

    clearBtn.addEventListener("click", () => {
      snd.pop();
      clearInk(true);
      speak("Cleared! Try again.", { rate: 0.9 });
    });
    retryBtn.addEventListener("click", () => {
      snd.pop();
      loadDigit(true);
    });
    hearBtn.addEventListener("click", () => {
      snd.pop();
      const digit = TRACE_NUMBERS[digitIndex];
      speak(`Number ${digit.word}. ${digit.tip}.`, { rate: 0.82, pitch: 1.1 });
    });

    const resizeToken = token;
    const onResize = () => {
      if (token !== resizeToken) {
        window.removeEventListener("resize", onResize);
        return;
      }
      const pct = hitPoints.length ? hitCount / hitPoints.length : 0;
      resizeCanvas();
      fillEl.style.width = Math.round(pct * 100) + "%";
      labelEl.textContent = Math.round(pct * 100) + "%";
    };
    window.addEventListener("resize", onResize);

    later(() => loadDigit(true), 30);
  };

  /* Interactive counting playground for 1–20 */
  function openCountPlay(item) {
    snd.pop();
    let currentIndex = Math.max(0, NUMBERS_1_20.findIndex(x => x.n === item.n));
    let counting = false;
    let countGen = 0;

    const overlay = el("div", "overlay count-play-overlay");
    const box = el("div", "popup count-play-popup");
    box.innerHTML = `
      <button class="close-btn" aria-label="Close">✖</button>
      <div class="count-play-top">
        <div class="count-play-number" aria-live="polite"></div>
        <div class="count-play-word"></div>
        <div class="count-play-theme"></div>
      </div>
      <div class="count-play-stage" role="list" aria-label="Counting objects"></div>
      <div class="count-play-actions">
        <button type="button" class="count-play-btn hear">🔊 Hear</button>
        <button type="button" class="count-play-btn count">✨ Count with me</button>
      </div>
      <div class="learn-nav count-play-nav">
        <button class="learn-nav-btn previous" aria-label="Previous number">←</button>
        <span class="learn-nav-counter"></span>
        <button class="learn-nav-btn next" aria-label="Next number">→</button>
      </div>
      <div class="hint">Tap objects or press Count with me!</div>`;
    overlay.appendChild(box);
    document.body.appendChild(overlay);

    const numberEl = $(".count-play-number", box);
    const wordEl = $(".count-play-word", box);
    const themeEl = $(".count-play-theme", box);
    const stage = $(".count-play-stage", box);
    const hearBtn = $(".count-play-btn.hear", box);
    const countBtn = $(".count-play-btn.count", box);
    const counter = $(".learn-nav-counter", box);
    const previous = $(".learn-nav-btn.previous", box);
    const next = $(".learn-nav-btn.next", box);

    const stopCounting = () => {
      countGen++;
      counting = false;
      countBtn.disabled = false;
      countBtn.textContent = "✨ Count with me";
    };

    const renderObjects = (current, animateIn) => {
      const theme = current.theme || COUNT_THEMES[(current.n - 1) % COUNT_THEMES.length];
      stage.innerHTML = "";
      stage.style.setProperty("--obj-color", theme.color);
      for (let i = 0; i < current.n; i++) {
        const obj = el("button", "count-obj" + (animateIn ? " spawn" : ""), theme.emoji);
        obj.type = "button";
        obj.setAttribute("role", "listitem");
        obj.setAttribute("aria-label", `${theme.label} ${i + 1}`);
        obj.style.animationDelay = animateIn ? (i * 0.06) + "s" : "0s";
        obj.addEventListener("click", () => {
          if (counting) return;
          stage.querySelectorAll(".count-obj").forEach(o => o.classList.remove("lit", "pop"));
          obj.classList.add("lit", "pop");
          snd.pop();
          sayCountStep(i + 1);
        });
        stage.appendChild(obj);
      }
    };

    const showPlay = (opts) => {
      opts = opts || {};
      stopCounting();
      const current = NUMBERS_1_20[currentIndex];
      const theme = current.theme || COUNT_THEMES[(current.n - 1) % COUNT_THEMES.length];
      const tint = tintFor((current.n - 1) % TINTS.length);
      box.setAttribute("style", `--accent:${tint[0]};--soft:${tint[1]};--obj-color:${theme.color}`);
      numberEl.textContent = String(current.n);
      wordEl.textContent = current.word;
      themeEl.textContent = `${current.n} ${theme.label}`;
      counter.textContent = `${current.n} of 20`;
      previous.disabled = currentIndex === 0;
      next.disabled = currentIndex === NUMBERS_1_20.length - 1;
      renderObjects(current, true);
      if (opts.speak !== false) later(() => sayNumber(current), 180);
    };

    const countAlong = () => {
      if (counting) return;
      const current = NUMBERS_1_20[currentIndex];
      const objs = [...stage.querySelectorAll(".count-obj")];
      if (!objs.length) return;
      counting = true;
      const gen = ++countGen;
      countBtn.disabled = true;
      countBtn.textContent = "Counting…";
      objs.forEach(o => o.classList.remove("lit", "pop"));

      objs.forEach((obj, i) => {
        later(() => {
          if (gen !== countGen) return;
          objs.forEach(o => o.classList.remove("lit", "pop"));
          obj.classList.add("lit", "pop");
          obj.scrollIntoView({ block: "nearest", behavior: "smooth" });
          snd.pop();
          sayCountStep(i + 1);
          if (i === objs.length - 1) {
            later(() => {
              if (gen !== countGen) return;
              confetti(14);
              snd.fanfare();
              sayNumber(current);
              stopCounting();
            }, 650);
          }
        }, i * 720);
      });
    };

    hearBtn.addEventListener("click", () => {
      snd.pop();
      sayNumber(NUMBERS_1_20[currentIndex]);
    });
    countBtn.addEventListener("click", () => {
      snd.pop();
      countAlong();
    });
    previous.addEventListener("click", () => {
      if (currentIndex === 0 || counting) return;
      snd.pop();
      currentIndex--;
      showPlay();
    });
    next.addEventListener("click", () => {
      if (currentIndex === NUMBERS_1_20.length - 1 || counting) return;
      snd.pop();
      currentIndex++;
      showPlay();
    });

    $(".close-btn", box).addEventListener("click", e => {
      e.stopPropagation();
      stopCounting();
      overlay.remove();
    });
    overlay.addEventListener("click", e => {
      if (e.target === overlay) {
        stopCounting();
        overlay.remove();
      }
    });

    showPlay({ speak: false });
    later(() => sayNumber(NUMBERS_1_20[currentIndex]), 220);
  }

  /* Classic flip cards for numbers 21–100 (preserved) */
  function openCount(item) {
    snd.pop();
    let currentIndex = Math.max(0, NUMBERS.findIndex(x => x.n === item.n));
    let flipped = false;
    let slideLock = false;

    const overlay = el("div", "overlay");
    const box = el("div", "popup learn-popup", `
      <button class="close-btn" aria-label="Close">✖</button>
      <div class="learn-slider" aria-live="polite">
        <div class="learn-slide">
          <button type="button" class="flip-card" aria-label="Flip card">
            <span class="flip-inner">
              <span class="flip-face flip-front">
                <span class="learn-emoji learn-emoji-front"></span>
                <span class="learn-letter count-display"></span>
                <span class="flip-cue">Tap to see the word</span>
              </span>
              <span class="flip-face flip-back">
                <span class="learn-emoji learn-emoji-back"></span>
                <span class="learn-word"></span>
                <span class="learn-phonics-back"></span>
              </span>
            </span>
          </button>
        </div>
      </div>
      <div class="learn-nav">
        <button class="learn-nav-btn previous" aria-label="Previous number">←</button>
        <span class="learn-nav-counter"></span>
        <button class="learn-nav-btn next" aria-label="Next number">→</button>
      </div>
      <div class="hint">👆 Swipe numbers · tap card to flip · 🔊 hear again</div>`);
    overlay.appendChild(box);
    document.body.appendChild(overlay);

    const slider = $(".learn-slider", box);
    const slide = $(".learn-slide", box);
    const flipCard = $(".flip-card", box);
    const emojiFront = $(".learn-emoji-front", box);
    const emojiBack = $(".learn-emoji-back", box);
    const numberEl = $(".count-display", box);
    const word = $(".learn-word", box);
    const wordHint = $(".learn-phonics-back", box);
    const counter = $(".learn-nav-counter", box);
    const previous = $(".learn-nav-btn.previous", box);
    const next = $(".learn-nav-btn.next", box);

    const setFlipped = (on) => {
      flipped = !!on;
      flipCard.classList.toggle("is-flipped", flipped);
    };

    const showNumber = (opts) => {
      opts = opts || {};
      const currentItem = NUMBERS[currentIndex];
      const tint = tintFor((currentItem.n - 1) % TINTS.length);
      box.setAttribute("style", `--accent:${tint[0]};--soft:${tint[1]}`);
      emojiFront.textContent = currentItem.emoji;
      emojiBack.textContent = currentItem.emoji;
      numberEl.textContent = String(currentItem.n);
      word.textContent = currentItem.word;
      wordHint.textContent = `Number ${currentItem.n}`;
      counter.textContent = `${currentItem.n} of ${NUMBERS.length}`;
      previous.disabled = currentIndex === 0;
      next.disabled = currentIndex === NUMBERS.length - 1;
      if (opts.speak !== false) sayNumber(currentItem);
    };

    const goTo = (index, direction) => {
      if (slideLock) return;
      const nextIndex = Math.max(0, Math.min(NUMBERS.length - 1, index));
      if (nextIndex === currentIndex) return;
      slideLock = true;
      setFlipped(false);
      const outClass = direction < 0 ? "slide-out-right" : "slide-out-left";
      const inClass = direction < 0 ? "slide-in-left" : "slide-in-right";
      slide.classList.remove("slide-out-left", "slide-out-right", "slide-in-left", "slide-in-right");
      void slide.offsetWidth;
      slide.classList.add(outClass);
      later(() => {
        currentIndex = nextIndex;
        showNumber();
        slide.classList.remove(outClass);
        void slide.offsetWidth;
        slide.classList.add(inClass);
        later(() => {
          slide.classList.remove(inClass);
          slideLock = false;
        }, 220);
      }, 160);
    };

    previous.addEventListener("click", () => {
      if (currentIndex === 0 || slideLock) return;
      snd.pop();
      goTo(currentIndex - 1, -1);
    });
    next.addEventListener("click", () => {
      if (currentIndex === NUMBERS.length - 1 || slideLock) return;
      snd.pop();
      goTo(currentIndex + 1, 1);
    });
    flipCard.addEventListener("click", e => {
      e.stopPropagation();
      if (slideLock) return;
      snd.flip();
      setFlipped(!flipped);
      sayNumber(NUMBERS[currentIndex]);
    });

    let touchStartX = 0;
    let touchStartY = 0;
    let swiping = false;
    slider.addEventListener("touchstart", e => {
      if (!e.touches || !e.touches[0]) return;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      swiping = true;
    }, { passive: true });
    slider.addEventListener("touchend", e => {
      if (!swiping) return;
      swiping = false;
      const t = e.changedTouches && e.changedTouches[0];
      if (!t) return;
      const dx = t.clientX - touchStartX;
      const dy = t.clientY - touchStartY;
      if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy)) return;
      if (dx < 0) {
        if (currentIndex < NUMBERS.length - 1 && !slideLock) { snd.pop(); goTo(currentIndex + 1, 1); }
      } else if (currentIndex > 0 && !slideLock) { snd.pop(); goTo(currentIndex - 1, -1); }
    }, { passive: true });

    $(".close-btn", box).addEventListener("click", e => {
      e.stopPropagation();
      overlay.remove();
    });
    overlay.addEventListener("click", e => {
      if (e.target === overlay) overlay.remove();
    });

    showNumber();
  }

  /* -------- find it -------- */

  VIEWS.find = function () {
    titleEl.textContent = "🔊 Find It";
    let lastLetter = null;

    function round() {
      token++;
      const n = [3, 4, 5][Math.min(levelOf("find"), 2)];
      const target = byLetter(pickLetterAvoiding(lastLetter));
      lastLetter = target.letter;

      const others = pick(ALPHABET.filter(x => x.letter !== target.letter), n - 1);
      const choices = shuffle([target].concat(others));

      screenRoot.innerHTML = "";
      const wrap = el("div", "find-wrap");

      const promptText = `Can you find the ${target.word.toLowerCase()}? ${PHONICS[target.letter] || target.letter} for ${target.word}.`;
      const sayPrompt = () => speak(promptText);

      const ask = el("div", "ask-row");
      const avatar = el("div", "ask-avatar", AVATARS[(Math.random() * AVATARS.length) | 0]);
      const bubble = el("div", "speech-bubble");
      const repeat = el("button", "repeat-btn", "🔊");
      repeat.setAttribute("aria-label", "Hear the question again");
      repeat.addEventListener("click", () => { snd.pop(); sayPrompt(); });
      bubble.append(el("span", "prompt-text", promptText), repeat);
      ask.append(avatar, bubble);

      const grid = el("div", "choice-grid");
      let done = false;

      choices.forEach((item, idx) => {
        const card = el("button", "card",
          `<span class="emoji-bubble">${item.emoji}</span><span class="word">${item.word}</span>`);
        card.setAttribute("style", tintStyle(idx + target.letter.charCodeAt(0)));
        card.addEventListener("click", () => {
          if (done) return;
          if (item.letter === target.letter) {
            done = true;
            card.classList.add("right");
            snd.correct();
            confetti(16);
            noteCorrect("find");
            award(target.letter);
            speak(`Yes! ${item.word}!`);
            later(round, 1500);
          } else {
            wobble(card);
            snd.wrong();
            noteWrong("find");
            speak("Try again!", { throttle: true });
          }
        });
        grid.appendChild(card);
      });

      wrap.append(ask, levelStars("find"), grid);
      screenRoot.appendChild(wrap);
      sayPrompt();
    }

    round();
  };

  /* -------- matching (picture & letter-case) -------- */

  function startMatch(mode) {
    const isPic = mode === "matchPic";
    titleEl.textContent = isPic ? "🍎 Picture Match" : "🔤 Letter Match";
    const inst = isPic
      ? "Match each letter to its picture!"
      : "Match the big letter to the small letter!";

    function round() {
      token++;
      const n = [3, 4, 5][Math.min(levelOf(mode), 2)];
      const letters = pick(ALPHABET, n);

      const rights = shuffle(letters.map(l => ({
        letter: l.letter,
        face: isPic ? l.emoji : l.letter.toLowerCase(),
        word: l.word,
        isEmoji: isPic,
      })));

      screenRoot.innerHTML = "";
      const wrap = el("div", "match-wrap");

      const head = el("div", "match-head");
      const instBtn = el("button", "repeat-btn small", "🔊");
      instBtn.setAttribute("aria-label", "Hear the instructions again");
      instBtn.addEventListener("click", () => { snd.pop(); speak(inst); });
      head.append(instBtn, levelStars(mode));

      const board = el("div", "match-board");
      const leftCol = el("div", "match-col");
      const rightCol = el("div", "match-col");
      const leftWrap = el("div", "match-col-wrap");
      const rightWrap = el("div", "match-col-wrap");
      leftWrap.append(el("div", "col-chip", "🔤"), leftCol);
      rightWrap.append(el("div", "col-chip", isPic ? "🖼️" : "abc"), rightCol);

      let selected = null;
      let matchedCount = 0;
      let done = false;

      letters.forEach(l => {
        const card = el("button", "card left-card", `<span>${l.letter}</span>`);
        card.dataset.pair = l.letter;
        card.addEventListener("click", () => {
          if (done || card.classList.contains("matched")) return;
          if (selected === card) {
            card.classList.remove("selected");
            selected = null;
            return;
          }
          if (selected) selected.classList.remove("selected");
          selected = card;
          card.classList.add("selected");
          snd.pop();
          speak(`${PHONICS[l.letter] || l.letter}. ${l.letter}`);
        });
        leftCol.appendChild(card);
      });

      rights.forEach(r => {
        const inner = r.isEmoji
          ? `<span class="pair-emoji">${r.face}</span>`
          : `<span class="lower">${r.face}</span>`;
        const card = el("button", "card right-card", inner);
        card.dataset.pair = r.letter;

        card.addEventListener("click", () => {
          if (done || card.classList.contains("matched")) return;

          if (!selected) {
            wobble(card);
            snd.wrong();
            speak("Tap a letter first!", { throttle: true });
            return;
          }

          if (selected.dataset.pair === card.dataset.pair) {
            const left = selected;
            selected = null;
            left.classList.remove("selected");
            left.classList.add("matched");
            card.classList.add("matched");
            matchedCount++;

            snd.correct();
            confetti(8);
            noteCorrect(mode);
            award(r.letter);
            speak(isPic ? r.word : `${PHONICS[r.letter] || r.letter}. ${r.letter}`);

            if (matchedCount === n) {
              done = true;
              later(() => { snd.fanfare(); confetti(30); speak("Well done!"); }, 350);
              later(round, 1900);
            }
          } else {
            const left = selected;
            selected = null;
            left.classList.remove("selected");
            wobble(left);
            wobble(card);
            snd.wrong();
            noteWrong(mode);
            speak("Try again!", { throttle: true });
          }
        });

        rightCol.appendChild(card);
      });

      board.append(leftWrap, rightWrap);
      wrap.append(head, board);
      screenRoot.appendChild(wrap);
      speak(inst);
    }

    round();
  }

  VIEWS.matchPic = function () { startMatch("matchPic"); };
  VIEWS.matchCase = function () { startMatch("matchCase"); };

  /* -------- memory -------- */

  VIEWS.memory = function () {
    titleEl.textContent = "🃏 Memory Fun";

    const configs = [
      { pairs: 4, type: "emoji" },
      { pairs: 6, type: "emoji" },
      { pairs: 4, type: "lp" },   // letter <-> picture pairs
      { pairs: 6, type: "lp" },
    ];

    function round() {
      token++;
      const cfg = configs[Math.min(levelOf("memory"), configs.length - 1)];
      const letters = pick(ALPHABET, cfg.pairs);

      let cards = [];
      letters.forEach(l => {
        if (cfg.type === "emoji") {
          cards.push({ match: l.letter, face: l.emoji, letter: l.letter });
          cards.push({ match: l.letter, face: l.emoji, letter: l.letter });
        } else {
          cards.push({ match: l.letter, face: l.letter, letter: l.letter });
          cards.push({ match: l.letter, face: l.emoji, letter: l.letter });
        }
      });
      cards = shuffle(cards);

      screenRoot.innerHTML = "";
      const wrap = el("div", "mem-wrap");
      wrap.appendChild(levelStars("memory"));

      const grid = el("div", "memory-grid");

      let flipped = [];
      let lock = false;
      let found = 0;
      let done = false;

      cards.forEach((data, i) => {
        const btn = el("button", "mem-card", `
          <span class="mem-inner">
            <span class="mem-face mem-back">⭐</span>
            <span class="mem-face mem-front">${data.face}</span>
          </span>`);
        btn.style.setProperty("--rot", (((i * 37) % 7) - 3) + "deg");

        btn.addEventListener("click", () => {
          if (done || lock) return;
          if (btn.classList.contains("flipped") || btn.classList.contains("done")) return;

          btn.classList.add("flipped");
          snd.flip();
          flipped.push({ btn, data });

          if (flipped.length === 2) {
            lock = true;
            const a = flipped[0];
            const b = flipped[1];

            if (a.data.match === b.data.match) {
              later(() => {
                a.btn.classList.add("done");
                b.btn.classList.add("done");
                snd.correct();
                award(a.data.letter);
                found++;
                flipped = [];
                lock = false;
                if (found === cfg.pairs) {
                  done = true;
                  snd.fanfare();
                  confetti(30);
                  speak("Well done! You found them all!");
                  later(round, 2300);
                }
              }, 420);
            } else {
              later(() => {
                a.btn.classList.remove("flipped");
                b.btn.classList.remove("flipped");
                snd.wrong();
                flipped = [];
                lock = false;
              }, 950);
            }
          }
        });

        grid.appendChild(btn);
      });

      wrap.appendChild(grid);
      screenRoot.appendChild(wrap);
      speak(cfg.type === "emoji"
        ? "Find the matching pairs!"
        : "Find the letter and its picture!");
    }

    round();
  };

  /* -------- fruits -------- */

  VIEWS.fruits = function () {
    titleEl.textContent = "🍎 Fruits";

    const wrap = el("div", "fv-wrap");
    const grid = el("div", "fv-grid");

    FRUITS.forEach((item, i) => {
      const card = el("button", "fv-card", `
        <span class="fv-emoji">${item.emoji}</span>
        <span class="fv-name">${item.name}</span>
      `);
      card.style.animationDelay = (i * 0.04) + "s";
      card.addEventListener("click", () => {
        snd.pop();
        speak(item.name);
        toast(`${item.emoji} ${item.name}`);
        confetti(5);
      });
      grid.appendChild(card);
    });

    wrap.appendChild(grid);
    screenRoot.appendChild(wrap);
    speak("Tap a fruit to hear its name!");
  };

  /* -------- vegetables -------- */

  VIEWS.vegetables = function () {
    titleEl.textContent = "🥕 Vegetables";

    const wrap = el("div", "fv-wrap");
    const grid = el("div", "fv-grid");

    VEGETABLES.forEach((item, i) => {
      const card = el("button", "fv-card", `
        <span class="fv-emoji">${item.emoji}</span>
        <span class="fv-name">${item.name}</span>
      `);
      card.style.animationDelay = (i * 0.04) + "s";
      card.addEventListener("click", () => {
        snd.pop();
        speak(item.name);
        toast(`${item.emoji} ${item.name}`);
        confetti(5);
      });
      grid.appendChild(card);
    });

    wrap.appendChild(grid);
    screenRoot.appendChild(wrap);
    speak("Tap a vegetable to hear its name!");
  };

  /* -------- colors -------- */

  VIEWS.colors = function () {
    titleEl.textContent = "🎨 Colors";

    const COLORS = [
      { name: "Red",    hex: "#ff3b30", emoji: "🔴" },
      { name: "Orange", hex: "#ff9500", emoji: "🟠" },
      { name: "Yellow", hex: "#ffcc00", emoji: "🟡" },
      { name: "Green",  hex: "#34c759", emoji: "🟢" },
      { name: "Blue",   hex: "#007aff", emoji: "🔵" },
      { name: "Purple", hex: "#af52de", emoji: "🟣" },
      { name: "Pink",   hex: "#ff2d55", emoji: "🩷" },
      { name: "Brown",  hex: "#8b5a2b", emoji: "🟤" },
      { name: "Black",  hex: "#000000", emoji: "⚫" },
      { name: "White",  hex: "#ffffff", emoji: "⚪" },
    ];

    const wrap = el("div", "colors-wrap");
    const grid = el("div", "colors-grid");

    COLORS.forEach((c, i) => {
      const card = el("button", "color-card", `
        <span class="color-swatch-big" style="background:${c.hex}"></span>
        <span class="color-name">${c.name}</span>
        <span class="color-emoji">${c.emoji}</span>
      `);
      card.style.animationDelay = (i * 0.05) + "s";
      card.addEventListener("click", () => {
        snd.pop();
        speak(c.name);
        toast(`${c.emoji} ${c.name}`);
        confetti(8);
      });
      grid.appendChild(card);
    });

    wrap.appendChild(grid);
    screenRoot.appendChild(wrap);
    speak("Tap a color to hear its name!");
  };

  /* -------- coloring -------- */

  VIEWS.coloring = function () {
    titleEl.textContent = "🎨 Coloring Fun";

    const colors = ["#ff3b30", "#ff9500", "#ffcc00", "#34c759", "#007aff", "#af52de", "#ff2d55", "#8b5a2b", "#000000", "#ffffff"];
    let selectedColor = colors[0];
    let items = pick(FRUITS_VEGGIES, 6);

    const wrap = el("div", "coloring-wrap");

    const palette = el("div", "color-palette");
    colors.forEach((c, i) => {
      const swatch = el("button", "color-swatch" + (i === 0 ? " sel" : ""), "");
      swatch.style.background = c;
      swatch.addEventListener("click", () => {
        palette.querySelectorAll(".color-swatch").forEach(s => s.classList.remove("sel"));
        swatch.classList.add("sel");
        selectedColor = c;
        snd.pop();
      });
      palette.appendChild(swatch);
    });
    wrap.appendChild(palette);

    const grid = el("div", "coloring-grid");
    items.forEach((item, idx) => {
      const card = el("div", "coloring-card", `
        <div class="coloring-emoji" data-idx="${idx}">${item.emoji}</div>
        <div class="coloring-name">${item.name}</div>
      `);
      const emojiEl = card.querySelector(".coloring-emoji");
      emojiEl.addEventListener("click", () => {
        emojiEl.style.filter = `drop-shadow(0 0 0 ${selectedColor}) hue-rotate(0deg)`;
        emojiEl.style.background = selectedColor;
        emojiEl.style.borderRadius = "50%";
        emojiEl.style.padding = "8px";
        snd.pop();
        toast(`🎨 ${item.name} colored!`);
      });
      grid.appendChild(card);
    });
    wrap.appendChild(grid);

    const hint = el("div", "coloring-hint", "👆 Pick a color, then tap a fruit or vegetable to color it!");
    wrap.appendChild(hint);

    screenRoot.appendChild(wrap);
    speak("Pick a color and tap to color the fruits and vegetables!");
  };

  /* -------- sticker book -------- */

  VIEWS.stickers = function () {
    titleEl.textContent = "⭐ Sticker Book";

    const wrap = el("div", "sticker-wrap");
    const count = stickerCount();
    wrap.appendChild(el("div", "progress-wrap", `
      <div class="progress-label">⭐ ${count} of 26 stickers</div>
      <div class="progress-bar"><div class="progress-fill" style="width:${Math.round((count / 26) * 100)}%"></div></div>`));

    const grid = el("div", "sticker-grid");
    ALPHABET.forEach((item, i) => {
      const got = !!stickers[item.letter];
      const cell = el("button", "sticker" + (got ? "" : " locked"),
        `<span class="s-emoji">${item.emoji}</span><span class="s-letter">${item.letter}</span>`);
      cell.setAttribute("style", tintStyle(i));

      if (got) {
        cell.addEventListener("click", () => {
          snd.pop();
          speak(`${PHONICS[item.letter] || item.letter}. ${item.letter} is for ${item.word}!`);
        });
      } else {
        cell.addEventListener("click", () => {
          wobble(cell);
          speak("Play a game to earn me!", { throttle: true });
        });
      }
      grid.appendChild(cell);
    });

    wrap.appendChild(grid);
    screenRoot.appendChild(wrap);
  };

  /* -------- poems -------- */

  VIEWS.poems = function () {
    titleEl.textContent = "📝 Poems";

    const wrap = el("div", "poem-list");
    POEMS.forEach((p, i) => {
      const card = el("button", "poem-card", `
        <span class="poem-emoji">${p.emoji}</span>
        <span class="poem-texts">
          <span class="poem-title">${p.title}</span>
          <span class="poem-meta">${p.lines.length} lines · tap to listen</span>
        </span>`);
      card.setAttribute("style", tintStyle(i) + `;animation-delay:${(i * 0.04).toFixed(2)}s`);
      card.addEventListener("click", () => { snd.pop(); go("poemReader", p.id); });
      wrap.appendChild(card);
    });

    screenRoot.appendChild(wrap);
  };

  let activePoemAudio = null;
  let activeSongPreview = null;

  function stopSongPreview() {
    if ("speechSynthesis" in window) speechSynthesis.cancel();
    if (!activeSongPreview) return;
    const preview = activeSongPreview;
    activeSongPreview = null;
    clearInterval(preview.timer);
    if (preview.context.state !== "closed") {
      preview.context.close().catch(() => toast("⚠️ Could not stop poem preview audio."));
    }
  }

  function stopPoemAudio() {
    stopSongPreview();
    if (activePoemAudio) {
      activePoemAudio.pause();
      activePoemAudio.removeAttribute("src");
      activePoemAudio.load();
      activePoemAudio = null;
    }
    document.querySelectorAll(".poem-line.active").forEach(n => n.classList.remove("active"));
  }

  VIEWS.poemReader = function (id) {
    const poem = POEMS.find(p => p.id === id) || POEMS[0];
    titleEl.textContent = poem.title;

    stopPoemAudio();
    const wrap = el("div", "poem-reader");
    const head = el("div", "reader-head");
    const linesBox = el("div", "poem-lines");
    const status = el("div", "reader-hint");
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");

    const audio = new Audio();
    audio.preload = "none";
    activePoemAudio = audio;
    const audioSrc = poem.audio || null;
    let sourceLoaded = false;
    let pendingLineIndex = null;
    let fallbackMode = !audioSrc;
    let playRequested = false;
    let pendingStartLine = 0;

    const lineStarts = poem.lineStarts;
    const hasLineTimings = Array.isArray(lineStarts) &&
      lineStarts.length === poem.lines.length &&
      lineStarts.every((time, index) =>
        Number.isFinite(time) && time >= 0 && (!index || time >= lineStarts[index - 1]));
    const audioLineTime = index => hasLineTimings
      ? lineStarts[index]
      : audio.duration * index / poem.lines.length;

    const updateHighlight = () => {
      if (!Number.isFinite(audio.duration) || audio.duration <= 0) return;
      const currentLine = hasLineTimings
        ? lineStarts.reduce((line, start, index) => audio.currentTime >= start ? index : line, 0)
        : Math.min(poem.lines.length - 1, Math.floor(audio.currentTime / audio.duration * poem.lines.length));
      poemLines.forEach((line, index) => line.classList.toggle("active", index === currentLine));
    };

    const startInstrumentalPreview = (fromLine, restart) => {
      fallbackMode = true;
      const startLine = Math.max(0, Math.min(fromLine || 0, poem.lines.length - 1));
      if (activeSongPreview && activeSongPreview.startLine === startLine && !restart) return;
      stopSongPreview();
      const AudioContextType = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextType) {
        status.textContent = "🎵 Audio preview is not supported in this browser.";
        return;
      }

      let context;
      try { context = new AudioContextType(); }
      catch (e) {
        status.textContent = "⚠️ Could not start poem audio in this browser.";
        return;
      }
      const master = context.createGain();
      master.gain.value = 0.24;
      master.connect(context.destination);
      const lineDurations = poem.lines.map(line =>
        Math.max(2.4, Math.min(4.5, line.trim().split(/\s+/).length * 0.48)));
      const starts = [];
      let totalDuration = 0;
      lineDurations.forEach(duration => {
        starts.push(totalDuration);
        totalDuration += duration;
      });
      const startAt = context.currentTime + 0.08;
      const playNote = (frequency, offset, duration, type, volume) => {
        const oscillator = context.createOscillator();
        const envelope = context.createGain();
        const noteStart = startAt + offset;
        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, noteStart);
        envelope.gain.setValueAtTime(0.001, noteStart);
        envelope.gain.linearRampToValueAtTime(volume, noteStart + 0.025);
        envelope.gain.exponentialRampToValueAtTime(0.001, noteStart + duration);
        oscillator.connect(envelope);
        envelope.connect(master);
        oscillator.start(noteStart);
        oscillator.stop(noteStart + duration + 0.02);
      };

      const scale = [261.63, 293.66, 329.63, 392, 440, 523.25, 587.33, 659.25];
      const motif = [0, 2, 4, 2, 3, 2];
      const roots = [130.81, 174.61, 196, 146.83];
      for (let line = startLine; line < poem.lines.length; line++) {
        const duration = lineDurations[line];
        const offset = starts[line] - starts[startLine];
        const root = roots[line % roots.length];
        playNote(root, offset, 0.72, "triangle", 0.07);
        playNote(root * 1.25, offset + 0.04, 0.62, "triangle", 0.035);
        playNote(root * 1.5, offset + 0.08, 0.56, "triangle", 0.035);
        const spacing = duration / motif.length;
        motif.forEach((step, index) => {
          const frequency = scale[(step + line) % scale.length];
          const noteOffset = offset + index * spacing;
          playNote(frequency, noteOffset, spacing * 0.78, "sine", 0.075);
          playNote(frequency * 2, noteOffset, spacing * 0.48, "sine", 0.018);
        });
      }

      const preview = {
        context,
        startLine,
        wallStart: performance.now(),
        elapsedBeforePause: 0,
        paused: true,
        lastSpokenLine: -1,
        timer: null,
      };
      activeSongPreview = preview;
      preview.timer = setInterval(() => {
        const elapsed = preview.elapsedBeforePause +
          (preview.paused ? 0 : (performance.now() - preview.wallStart) / 1000);
        const poemTime = starts[startLine] + elapsed;
        let currentLine = startLine;
        for (let i = startLine + 1; i < starts.length; i++) {
          if (poemTime >= starts[i]) currentLine = i;
          else break;
        }
        poemLines.forEach((line, index) => line.classList.toggle("active", index === currentLine));
        if (currentLine !== preview.lastSpokenLine) {
          preview.lastSpokenLine = currentLine;
          if (speechOn && "speechSynthesis" in window) {
            try {
              refreshVoices();
              const utterance = new SpeechSynthesisUtterance(poem.lines[currentLine]);
              utterance.lang = "en-GB";
              utterance.rate = 0.82;
              utterance.pitch = 1.15;
              utterance.volume = 0.85;
              const voice = pickVoice();
              if (voice) utterance.voice = voice;
              speechSynthesis.cancel();
              speechSynthesis.speak(utterance);
            } catch (e) {
              status.textContent = "🎵 Instrumental preview only — spoken lyrics are unavailable.";
            }
          }
        }
        if (elapsed >= totalDuration - starts[startLine]) {
          clearInterval(preview.timer);
          poemLines.forEach(line => line.classList.remove("active"));
          if ("speechSynthesis" in window) speechSynthesis.cancel();
          status.textContent = "🎵 Preview ended. It used spoken lyrics, not singing.";
          activeSongPreview = null;
          context.close().catch(() => toast("⚠️ Could not stop poem preview audio."));
        }
      }, 100);

      context.resume().then(() => {
        if (activeSongPreview === preview) {
          preview.wallStart = performance.now();
          preview.paused = false;
        }
      }).catch(() => {
        status.textContent = "⚠️ Tap Play to start the instrumental preview.";
      });
      status.textContent = speechOn
        ? "🎵 Instrumental + soft spoken lyrics — not singing."
        : "🎵 Instrumental preview — turn Speech on for spoken lyrics (not singing).";
    };

    const play = (startLine, restart) => {
      pendingStartLine = startLine || 0;
      playRequested = true;
      if (fallbackMode) {
        startInstrumentalPreview(pendingStartLine, restart);
        return;
      }
      if (!sourceLoaded) {
        audio.src = audioSrc;
        sourceLoaded = true;
      }
      if (restart && audio.readyState > 0) audio.currentTime = 0;
      else if (pendingLineIndex !== null && audio.readyState > 0) {
        audio.currentTime = audioLineTime(pendingLineIndex);
        pendingLineIndex = null;
      }
      audio.play().catch(() => {
        if (playRequested) {
          fallbackMode = true;
          status.textContent = "🎵 Sung track unavailable. Tap Play for an instrumental preview (no vocals).";
        }
      });
    };

    const addControl = (label, icon, action) => {
      const button = el("button", "repeat-btn", icon);
      button.setAttribute("aria-label", label);
      button.addEventListener("click", () => { snd.pop(); action(); });
      head.appendChild(button);
    };

    addControl("Play poem audio", "▶️", () => play(0, true));
    addControl("Pause audio", "⏸️", () => {
      playRequested = false;
      if (activeSongPreview) {
        const preview = activeSongPreview;
        if (!preview.paused) {
          preview.elapsedBeforePause += (performance.now() - preview.wallStart) / 1000;
          preview.paused = true;
        }
        if ("speechSynthesis" in window) speechSynthesis.pause();
        preview.context.suspend().catch(() => {
          status.textContent = "⚠️ Could not pause poem preview audio.";
        });
      }
      else audio.pause();
    });
    addControl("Resume audio", "⏯️", () => {
      playRequested = true;
      if (activeSongPreview) {
        const preview = activeSongPreview;
        if ("speechSynthesis" in window) speechSynthesis.resume();
        preview.context.resume().then(() => {
          if (activeSongPreview === preview) {
            preview.wallStart = performance.now();
            preview.paused = false;
          }
        }).catch(() => {
          status.textContent = "⚠️ Could not resume poem preview audio.";
        });
      }
      else play(pendingStartLine, false);
    });
    addControl("Replay audio", "🔁", () => {
      playRequested = true;
      if (fallbackMode) startInstrumentalPreview(0, true);
      else play(0, true);
    });
    head.appendChild(el("div", "reader-title", `${poem.emoji} ${poem.title}`));

    const poemLines = [];
    poem.lines.forEach((line, idx) => {
      const ln = el("div", "poem-line", line);
      ln.addEventListener("click", () => {
        if (fallbackMode) {
          play(idx, true);
        } else {
          if (audio.readyState === 0) pendingLineIndex = idx;
          else if (audio.readyState > 0) audio.currentTime = audioLineTime(idx);
          play(idx, false);
        }
      });
      poemLines.push(ln);
      linesBox.appendChild(ln);
    });

    status.textContent = fallbackMode
      ? `🎵 Play uses music${speechOn ? " + spoken lyrics" : ""}, not singing. Add a licensed MP3 for vocals.`
      : `🎵 Ready to play the sung recording: ${audioSrc}`;
    audio.addEventListener("loadedmetadata", () => {
      if (pendingLineIndex !== null) {
        audio.currentTime = audioLineTime(pendingLineIndex);
        pendingLineIndex = null;
      }
      status.textContent = hasLineTimings
        ? "🎵 Song ready — lyrics will highlight in sync."
        : "🎵 Song ready — add line start times for exact lyric sync.";
    });
    audio.addEventListener("timeupdate", updateHighlight);
    audio.addEventListener("ended", () => {
      poemLines.forEach(line => line.classList.remove("active"));
      status.textContent = "🎵 Song finished — tap Replay to hear it again.";
    });
    audio.addEventListener("error", () => {
      fallbackMode = true;
      status.textContent = `🎵 Sung track missing. Check ${audioSrc}, then tap Play for an instrumental preview.`;
    });

    wrap.append(head, linesBox, status);
    screenRoot.appendChild(wrap);
  };

  /* ------------------------------ parent gate ------------------------------ */

  const parentBtn = $("#parentBtn");
  const parentModal = $("#parentModal");
  const speechToggle = $("#speechToggle");
  const resetBtn = $("#resetBtn");
  const closeParent = $("#closeParent");
  const switchBtn = $("#switchBtn");

  let holdTimer = null;

  function updateParentUI() {
    speechToggle.textContent = speechOn ? "🔊 Speech: On" : "🔇 Speech: Off";
    switchBtn.classList.toggle("hidden", !serverMode || !activeProfile);
    if (typeof updateSidebarUI === "function") updateSidebarUI();
  }

  switchBtn.addEventListener("click", async () => {
    closeParentModal();
    await saveNow();
    if (platformMode && parentSession && parentSession.token) {
      go("childPicker");
      return;
    }
    go("auth", "login");
  });

  function openParent() {
    updateParentUI();
    parentModal.classList.remove("hidden");
    snd.pop();
  }

  function closeParentModal() {
    parentModal.classList.add("hidden");
  }

  parentBtn.addEventListener("pointerdown", () => {
    parentBtn.classList.add("holding");
    holdTimer = setTimeout(() => {
      holdTimer = null;
      parentBtn.classList.remove("holding");
      openParent();
    }, 3000);
  });

  ["pointerup", "pointerleave", "pointercancel"].forEach(ev => {
    parentBtn.addEventListener(ev, () => {
      parentBtn.classList.remove("holding");
      if (holdTimer) { clearTimeout(holdTimer); holdTimer = null; }
    });
  });

  speechToggle.addEventListener("click", () => {
    speechOn = !speechOn;
    LS.set("speechOn", speechOn);
    updateParentUI();
    if (speechOn) speak("Hello!");
    else try { speechSynthesis.cancel(); } catch (e) {}
  });

  resetBtn.addEventListener("click", () => {
    if (confirm("Reset all stickers and difficulty levels? This cannot be undone.")) {
      LS.del("stickers");
      LS.del("levels");
      stickers = {};
      levels = {};
      Object.keys(streaks).forEach(k => delete streaks[k]);
      Object.keys(misses).forEach(k => delete misses[k]);
      scheduleSave(); // push the cleared state to the database too
      closeParentModal();
      toast("🧹 Progress reset");
      go("home");
    }
  });

  closeParent.addEventListener("click", closeParentModal);

  /* ------------------------------ sidebar ------------------------------ */

  const menuBtn = $("#menuBtn");
  const sidebar = $("#sidebar");
  const sidebarOverlay = $("#sidebarOverlay");
  const sidebarClose = $("#sidebarClose");
  const sidebarAvatar = $("#sidebarAvatar");
  const sidebarName = $("#sidebarName");
  const sidebarStatus = $("#sidebarStatus");
  const sidebarLogin = $("#sidebarLogin");
  const sidebarLogout = $("#sidebarLogout");
  const sidebarSpeech = $("#sidebarSpeech");
  const sidebarReset = $("#sidebarReset");

  function openSidebar() {
    updateSidebarUI();
    sidebar.classList.remove("hidden");
    sidebarOverlay.classList.remove("hidden");
    snd.pop();
  }
  function closeSidebar() {
    sidebar.classList.add("hidden");
    sidebarOverlay.classList.add("hidden");
  }

  function updateSidebarUI() {
    if (activeProfile) {
      sidebarAvatar.textContent = activeProfile.avatar;
      sidebarName.textContent = activeProfile.name;
      if (activeProfile.platform && activeProfile.childId) {
        sidebarStatus.textContent = activeProfile.ageGroupLabel
          || (activeProfile.ageYears != null ? ("Age " + activeProfile.ageYears) : "Child profile");
      } else if (activeProfile.platform) {
        sidebarStatus.textContent = "Parent account";
      } else {
        sidebarStatus.textContent = serverMode ? "Logged in" : "Guest mode";
      }
      sidebarLogin.classList.add("hidden");
      sidebarLogout.classList.remove("hidden");
    } else {
      sidebarAvatar.textContent = "👤";
      sidebarName.textContent = "Guest";
      sidebarStatus.textContent = (platformMode || serverMode) ? "Not logged in" : "Offline mode";
      sidebarLogin.classList.remove("hidden");
      sidebarLogout.classList.add("hidden");
    }
    sidebarSpeech.textContent = speechOn ? "🔊 Speech: On" : "🔇 Speech: Off";
  }

  menuBtn.addEventListener("click", openSidebar);
  sidebarClose.addEventListener("click", closeSidebar);
  sidebarOverlay.addEventListener("click", closeSidebar);

  sidebarLogin.addEventListener("click", () => {
    closeSidebar();
    if (platformMode || serverMode) {
      saveNow();
      go("auth", "login");
    } else {
      toast("👤 Guest mode — no login available offline");
    }
  });

  sidebarLogout.addEventListener("click", async () => {
    closeSidebar();
    await saveNow();
    if (parentSession && parentSession.token) {
      await platformCall("/auth/logout", { method: "POST" });
    }
    activeProfile = null;
    parentSession = null;
    persistParentSession();
    LS.del("authProfile");
    stickers = LS.get("stickers", {});
    levels = LS.get("levels", {});
    speechOn = LS.get("speechOn", true);
    updateParentUI();
    updateSidebarUI();
    toast("🚪 Logged out");
    go((platformMode || serverMode) ? "auth" : "home");
  });

  sidebarSpeech.addEventListener("click", () => {
    speechOn = !speechOn;
    LS.set("speechOn", speechOn);
    updateParentUI();
    updateSidebarUI();
    sidebarSpeech.textContent = speechOn ? "🔊 Speech: On" : "🔇 Speech: Off";
  });

  sidebarReset.addEventListener("click", () => {
    if (confirm("Reset all stickers and difficulty levels? This cannot be undone.")) {
      LS.del("stickers");
      LS.del("levels");
      stickers = {};
      levels = {};
      Object.keys(streaks).forEach(k => delete streaks[k]);
      Object.keys(misses).forEach(k => delete misses[k]);
      scheduleSave();
      closeSidebar();
      toast("🧹 Progress reset");
      go("home");
    }
  });

  // sidebar nav links
  document.querySelectorAll(".sidebar-link").forEach(btn => {
    btn.addEventListener("click", () => {
      const view = btn.getAttribute("data-go");
      closeSidebar();
      if (view === "stickers") go("stickers");
      else if (view === "poems") go("poems");
      else if (view === "coloring") go("coloring");
      else if (view === "profile") go("profile");
      else if (view === "fruits") go("fruits");
      else if (view === "vegetables") go("vegetables");
      else if (view === "colors") go("colors");
      else go("home");
    });
  });
  parentModal.addEventListener("click", e => {
    if (e.target === parentModal) closeParentModal();
  });

  document.addEventListener("keydown", e => {
    if (e.key !== "Escape") return;
    if (!parentModal.classList.contains("hidden")) { closeParentModal(); return; }
    const overlay = document.querySelector(".overlay");
    if (overlay) overlay.remove();
  });

  /* -------- Little Explorers Numbers & Math extension -------- */
  if (typeof window.LUMACUBS_REGISTER_LE_MATH === "function") {
    window.LUMACUBS_REGISTER_LE_MATH({
      VIEWS,
      go,
      el,
      snd,
      speak,
      toast,
      confetti,
      LS,
      escapeHtml,
      trackPlatformProgress,
      titleEl,
      screenRoot,
      setAgeHubReturn: (v) => { ageHubReturn = v; },
      getAgeHubReturn: () => ageHubReturn,
      getCurrent: () => current,
      setLeMathCatReturn: (cat) => { leMathCatReturn = cat; },
    });
  }

  /* ------------------------------ start ------------------------------ */

  async function boot() {
    initBg();
    const [legacyPing, foundationPing] = await Promise.all([
      apiCall("ping"),
      platformCall("/health"),
    ]);
    serverMode = !!(legacyPing && legacyPing.ok);
    platformMode = !!(foundationPing && foundationPing.ok);
    await loadCatalogSegments();

    // Prefer home so Learning paths are always visible for guests.
    // Restored parent+child opens the age dashboard; parent-only opens picker.
    if (platformMode) {
      const restored = await restoreParentSession();
      if (restored) {
        updateParentUI();
        updateSidebarUI();
        if (parentSession && parentSession.childId) go("ageDashboard");
        else go("childPicker");
        return;
      }
    }

    if (serverMode) {
      const savedId = LS.get("authProfile", null);
      if (savedId) {
        const data = await apiCall("load", { id: savedId });
        if (data && data.ok) {
          activeProfile = { id: data.profile.id, name: data.profile.name, avatar: data.profile.avatar };
          stickers = data.profile.stickers || {};
          levels = data.profile.levels || {};
          speechOn = data.profile.speech_on !== false;
        }
      }
    }

    updateParentUI();
    updateSidebarUI();
    go("home");
    if (/#age\/little-explorers/i.test(String(location.hash || ""))) {
      go("littleExplorers");
    }
  }

  // flush pending progress right before the page is hidden or closed
  window.addEventListener("pagehide", () => { saveNow(); });
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") saveNow();
  });

  boot();
})();
