/* ============================================================
   LumaCubs — Little Explorers Numbers & Math (ages 2–4)
   Registered into the main game engine via LUMACUBS_REGISTER_LE_MATH
   ============================================================ */
(function () {
  "use strict";

  const ART = "assets/home/little-explorers/numbers-math/categories/";
  const SUB_ART = "assets/home/little-explorers/numbers-math/subcategories/";
  const FALLBACK = "assets/segments/numbers-math/illustrations/_fallback.svg";

  const OBJECTS = ["🍎", "⭐", "🔵", "🟡", "🟢", "🧸", "🎈", "🍓", "🍊", "🍩"];
  const TOKEN_KINDS = ["apple", "star", "ball", "berry", "block"];
  const NUMBER_NAMES = {
    1: "One", 2: "Two", 3: "Three", 4: "Four", 5: "Five",
    6: "Six", 7: "Seven", 8: "Eight", 9: "Nine", 10: "Ten",
    11: "Eleven", 12: "Twelve", 13: "Thirteen", 14: "Fourteen", 15: "Fifteen",
    16: "Sixteen", 17: "Seventeen", 18: "Eighteen", 19: "Nineteen", 20: "Twenty",
    21: "Twenty-one", 22: "Twenty-two", 23: "Twenty-three", 24: "Twenty-four", 25: "Twenty-five",
    26: "Twenty-six", 27: "Twenty-seven", 28: "Twenty-eight", 29: "Twenty-nine", 30: "Thirty",
  };

  const CURRICULUM = [
    {
      id: "number_recognition",
      title: "Number Recognition",
      blurb: "Explore, find, match, listen, and build numbers 1–30!",
      tone: "peach",
      accent: "#FFD8C2",
      art: ART + "number_recognition.jpg",
      subs: [
        { id: "nr_meet_1_10", title: "Meet Numbers 1–10", level: "A", type: "nr_explorer", min: 1, max: 10, art: SUB_ART + "nr_meet_1_10.svg" },
        { id: "nr_meet_11_20", title: "Meet Numbers 11–20", level: "B", type: "nr_train", min: 11, max: 20, art: SUB_ART + "nr_meet_11_20.svg" },
        { id: "nr_meet_21_30", title: "Meet Numbers 21–30", level: "B", type: "nr_balloons", min: 21, max: 30, art: SUB_ART + "nr_meet_21_30.svg" },
        { id: "nr_detective", title: "Number Detective", level: "A", type: "nr_detective", min: 1, max: 30, art: SUB_ART + "nr_detective.svg" },
        { id: "nr_memory_match", title: "Number Memory Match", level: "A", type: "nr_memory", min: 1, max: 20, art: SUB_ART + "nr_memory_match.svg" },
        { id: "nr_names_sounds", title: "Number Names & Sounds", level: "B", type: "nr_listen", min: 1, max: 30, art: SUB_ART + "nr_names_sounds.svg" },
        { id: "nr_builder", title: "Number Builder", level: "B", type: "nr_builder", min: 1, max: 30, art: SUB_ART + "nr_builder.svg" },
      ],
    },
    {
      id: "counting_quantity",
      title: "Counting Skills",
      blurb: "Count from 1 to 30 through playful adventures!",
      tone: "mint",
      accent: "#C8F0E0",
      art: ART + "counting_quantity.jpg",
      subs: [
        { id: "cq_count_1_10", title: "Count 1–10", level: "A", type: "cq_garden", min: 1, max: 10, art: SUB_ART + "cq_count_1_10.svg" },
        { id: "cq_count_11_20", title: "Count 11–20", level: "B", type: "cq_feed", min: 11, max: 20, art: SUB_ART + "cq_count_11_20.svg" },
        { id: "cq_count_21_30", title: "Count 21–30", level: "B", type: "cq_underwater", min: 21, max: 30, art: SUB_ART + "cq_count_21_30.svg" },
        { id: "cq_one_by_one", title: "One-by-One Counting", level: "A", type: "cq_tap", min: 1, max: 10, art: SUB_ART + "cq_one_by_one.svg" },
        { id: "cq_around_us", title: "Count Around Us", level: "A", type: "cq_around", min: 1, max: 15, art: SUB_ART + "cq_around_us.svg" },
        { id: "cq_sounds", title: "Count Sounds & Actions", level: "B", type: "cq_sounds", min: 1, max: 10, art: SUB_ART + "cq_sounds.svg" },
      ],
    },
    {
      id: "number_tracing",
      title: "Number Writing & Tracing",
      blurb: "Trace and write numbers 1–30 with gentle guides!",
      tone: "sky",
      accent: "#A8D4F0",
      art: ART + "number_tracing.jpg",
      subs: [
        { id: "nt_1_10", title: "Number Tracing 1–10", level: "A", type: "nt_guided", min: 1, max: 10, art: SUB_ART + "nt_1_10.svg" },
        { id: "nt_11_20", title: "Number Tracing 11–20", level: "B", type: "nt_guided", min: 11, max: 20, art: SUB_ART + "nt_11_20.svg" },
        { id: "nt_21_30", title: "Number Tracing 21–30", level: "B", type: "nt_guided", min: 21, max: 30, art: SUB_ART + "nt_21_30.svg" },
        { id: "nt_follow", title: "Follow the Number Path", level: "A", type: "nt_follow", min: 1, max: 15, art: SUB_ART + "nt_follow.svg" },
        { id: "nt_complete", title: "Complete the Number", level: "B", type: "nt_complete", min: 1, max: 20, art: SUB_ART + "nt_complete.svg" },
        { id: "nt_freehand", title: "Freehand Number Practice", level: "B", type: "nt_freehand", min: 1, max: 30, art: SUB_ART + "nt_freehand.svg" },
      ],
    },
    {
      id: "basic_number_comparison",
      title: "Basic Number Comparison",
      blurb: "Which group has more?",
      tone: "lilac",
      accent: "#DCC8F5",
      art: ART + "basic_number_comparison.jpg",
      subs: [
        { id: "bc_more_less", title: "More and less", level: "A", type: "more_less", max: 5 },
        { id: "bc_same", title: "Same quantity", level: "A", type: "same_qty", max: 5 },
        { id: "bc_big_small", title: "Big group and small group", level: "A", type: "more_less", max: 6 },
        { id: "bc_compare", title: "Compare groups of objects", level: "B", type: "more_less", max: 10 },
        { id: "bc_identify_more", title: "Identify the group with more objects", level: "B", type: "more_less", max: 8 },
      ],
    },
    {
      id: "introduction_to_addition",
      title: "Introduction to Addition",
      blurb: "Put groups together!",
      tone: "sun",
      accent: "#FFE29A",
      art: ART + "introduction_to_addition.jpg",
      subs: [
        { id: "ia_objects", title: "Addition using objects", level: "B", type: "add_groups", max: 5 },
        { id: "ia_visual", title: "Add two groups visually", level: "A", type: "add_groups", max: 4 },
        { id: "ia_picture", title: "Picture-based addition", level: "B", type: "add_groups", max: 5 },
        { id: "ia_within_5", title: "Simple addition within 5", level: "B", type: "add_groups", max: 5 },
        { id: "ia_within_10", title: "Introduction to adding within 10", level: "B", type: "add_groups", max: 10 },
      ],
    },
    {
      id: "sorting_grouping",
      title: "Sorting & Grouping",
      blurb: "Make little groups!",
      tone: "coral",
      accent: "#FFD8C8",
      art: ART + "sorting_grouping.jpg",
      subs: [
        { id: "sg_by_qty", title: "Group objects by quantity", level: "A", type: "sort_qty", max: 5 },
        { id: "sg_count_groups", title: "Count objects in groups", level: "A", type: "count_objects", max: 5 },
        { id: "sg_groups_2", title: "Make groups of 2", level: "A", type: "make_group", target: 2 },
        { id: "sg_groups_3", title: "Make groups of 3", level: "B", type: "make_group", target: 3 },
        { id: "sg_equal", title: "Match equal groups", level: "B", type: "same_qty", max: 6 },
      ],
    },
    {
      id: "number_sequencing",
      title: "Number Sequencing",
      blurb: "What number comes next — up to 30!",
      tone: "aqua",
      accent: "#BFDFF2",
      art: ART + "number_sequencing.jpg",
      subs: [
        { id: "ns_1_5", title: "Arrange numbers 1–5", level: "A", type: "arrange", max: 5 },
        { id: "ns_1_10", title: "Arrange numbers 1–10", level: "A", type: "arrange", max: 10 },
        { id: "ns_1_20", title: "Arrange numbers around 11–20", level: "B", type: "arrange", min: 11, max: 20 },
        { id: "ns_forward", title: "Forward number sequence", level: "A", type: "next_number", max: 10 },
        { id: "ns_next", title: "Identify the next number (to 30)", level: "B", type: "next_number", max: 30 },
        { id: "ns_before_after", title: "Before and after (to 30)", level: "B", type: "before_after", max: 30 },
      ],
    },
    {
      id: "missing_numbers_patterns",
      title: "Missing Numbers & Patterns",
      blurb: "Find what is missing — up to 30!",
      tone: "violet",
      accent: "#D5C8F5",
      art: ART + "missing_numbers_patterns.jpg",
      subs: [
        { id: "mp_miss_5", title: "Find missing numbers 1–5", level: "A", type: "missing", max: 5 },
        { id: "mp_miss_10", title: "Find missing numbers 1–10", level: "A", type: "missing", max: 10 },
        { id: "mp_miss_20", title: "Find missing numbers 11–20", level: "B", type: "missing", min: 11, max: 20 },
        { id: "mp_miss_30", title: "Find missing numbers 21–30", level: "B", type: "missing", min: 21, max: 30 },
        { id: "mp_complete", title: "Complete number sequences", level: "B", type: "missing", max: 30 },
        { id: "mp_comes_next", title: "Identify what comes next", level: "A", type: "next_number", max: 10 },
        { id: "mp_patterns", title: "Simple repeating quantity patterns", level: "B", type: "qty_pattern", max: 4 },
      ],
    },
    {
      id: "basic_mathematical_concepts",
      title: "Basic Mathematical Concepts",
      blurb: "One, many, same, and different!",
      tone: "sage",
      accent: "#C8F0E0",
      art: ART + "basic_mathematical_concepts.jpg",
      subs: [
        { id: "bmc_one_many", title: "One and many", level: "A", type: "one_many", max: 5 },
        { id: "bmc_zero", title: "None and zero (visual introduction)", level: "A", type: "none_zero", max: 3 },
        { id: "bmc_all_some", title: "All and some", level: "B", type: "all_some", max: 6 },
        { id: "bmc_same_diff", title: "Same and different quantities", level: "A", type: "same_qty", max: 5 },
        { id: "bmc_part_whole", title: "Part and whole (simple visual exposure)", level: "B", type: "part_whole", max: 4 },
      ],
    },
    {
      id: "math_games_brain_play",
      title: "Math Games & Brain Play",
      blurb: "Play and learn with numbers!",
      tone: "rose",
      accent: "#FFD0DC",
      art: ART + "math_games_brain_play.jpg",
      subs: [
        { id: "mg_match", title: "Number matching game", level: "A", type: "match_qty", max: 5 },
        { id: "mg_count_tap", title: "Count and tap", level: "A", type: "tap_count", max: 5 },
        { id: "mg_find", title: "Find the correct number", level: "A", type: "pick_number", max: 5 },
        { id: "mg_puzzle", title: "Number puzzle", level: "B", type: "arrange", max: 5 },
        { id: "mg_count", title: "Count the objects", level: "B", type: "count_objects", max: 10 },
        { id: "mg_quiz", title: "Simple math quiz", level: "B", type: "add_groups", max: 5 },
        { id: "mg_memory", title: "Number memory game", level: "B", type: "number_memory", max: 6 },
      ],
    },
  ];

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function randInt(min, max) {
    return min + Math.floor(Math.random() * (max - min + 1));
  }

  function pickObject() {
    return OBJECTS[randInt(0, OBJECTS.length - 1)];
  }

  function pickToken() {
    return TOKEN_KINDS[randInt(0, TOKEN_KINDS.length - 1)];
  }

  function objectRow(n, emoji) {
    const e = emoji || pickObject();
    return Array.from({ length: n }, () => `<span class="le-nm-obj" aria-hidden="true">${e}</span>`).join("");
  }

  function tokenRow(n, kind) {
    const k = kind || pickToken();
    return Array.from({ length: n }, () =>
      `<span class="le-nm-token le-nm-token-${k}" aria-hidden="true"></span>`
    ).join("");
  }

  /** Visual quantity: small groups for tiny counts, tens-frames for bigger (up to 30). */
  function qtyVisual(n, kind) {
    const k = kind || pickToken();
    const count = Math.max(0, Math.min(30, n | 0));
    if (count <= 12) {
      return `<div class="le-nm-objects le-nm-token-row">${tokenRow(count, k)}</div>`;
    }
    const tens = Math.floor(count / 10);
    const ones = count % 10;
    let html = `<div class="le-nm-qty-groups" aria-hidden="true">`;
    for (let t = 0; t < tens; t++) {
      html += `<div class="le-nm-ten-frame le-nm-token-row is-dense">${tokenRow(10, k)}</div>`;
    }
    if (ones > 0) {
      html += `<div class="le-nm-ten-frame le-nm-token-row is-dense">${tokenRow(ones, k)}</div>`;
    }
    html += `</div>`;
    return html;
  }

  function subArtSrc(sub) {
    if (sub && sub.art) return sub.art;
    // Categories 2–10 ship SVG icons; Cat 1 uses explicit .jpg via sub.art
    if (sub && sub.id) return SUB_ART + sub.id + ".svg";
    return FALLBACK;
  }

  window.LUMACUBS_REGISTER_LE_MATH = function registerLEMath(api) {
    const {
      VIEWS, go, el, snd, speak, toast, confetti, LS, escapeHtml, trackPlatformProgress,
      titleEl, setAgeHubReturn, getAgeHubReturn, setLeMathCatReturn,
    } = api;

    const progressKey = "leMathProgress";

    function getProgress() {
      return LS.get(progressKey, {}) || {};
    }

    function markDone(subId, stars) {
      const p = getProgress();
      const prev = p[subId] || 0;
      p[subId] = Math.max(prev, stars || 1);
      LS.set(progressKey, p);
      trackPlatformProgress("le.numbers_math." + subId, "completed");
    }

    function starsFor(subId) {
      return getProgress()[subId] || 0;
    }

    function categoryStars(cat) {
      const vals = cat.subs.map(s => starsFor(s.id));
      const earned = vals.filter(v => v > 0).length;
      return { earned, total: cat.subs.length };
    }

    /* ---------- hub: reuse existing math-hub / math-category-card UI ---------- */
    VIEWS.leNumbersMath = function () {
      // Keep ageDashboard return when opened from a logged-in child hub
      if (typeof getAgeHubReturn === "function" && getAgeHubReturn() !== "ageDashboard") {
        setAgeHubReturn("littleExplorers");
      } else if (typeof getAgeHubReturn !== "function") {
        setAgeHubReturn("littleExplorers");
      }
      titleEl.textContent = "Numbers & Math";

      const wrap = el("div", "segment-hub math-hub le-nm-existing");
      wrap.appendChild(el("div", "segment-hub-hero", `
        <div class="segment-hub-art">
          <span class="segment-art">
            <img class="segment-illustration" src="assets/home/little-explorers/segments/numbers_math.jpg"
              alt="Numbers and Math" width="480" height="360" loading="eager"
              onerror="if(!this.dataset.fb){this.dataset.fb='1';this.src='${FALLBACK}';}">
          </span>
        </div>
        <h2>Numbers & Math</h2>
        <p>Let's count and play with numbers! Little Explorers · 2–4 Years</p>
        <div class="math-card-meta" style="justify-content:center;margin-top:10px">
          <span>Level A · 2–3</span>
          <span>Level B · 3–4</span>
        </div>
      `));

      const section = el("div", "segment-subs");
      section.appendChild(el("div", "home-section-label", `
        <h3>Math categories</h3>
        <p>10 learning paths ready to explore</p>`));
      const grid = el("div", "math-category-grid");
      CURRICULUM.forEach((cat) => {
        const st = categoryStars(cat);
        const accent = cat.accent || "#E8D5F5";
        const card = el("button", "math-category-card", `
          <span class="math-card-art" style="background:${escapeHtml(accent)}33">
            <img class="math-card-illustration" src="${escapeHtml(cat.art)}" alt="${escapeHtml(cat.title)}"
              width="480" height="360" loading="lazy"
              onerror="if(!this.dataset.fb){this.dataset.fb='1';this.src='${FALLBACK}';}">
          </span>
          <span class="math-card-body">
            <strong class="math-card-title">${escapeHtml(cat.title)}</strong>
            <span class="math-card-desc">${escapeHtml(cat.blurb)}</span>
            <span class="math-card-meta">
              <span>Ages 2–4</span>
              <span>⭐ ${st.earned}/${st.total}</span>
            </span>
          </span>
        `);
        card.type = "button";
        card.style.setProperty("--math-accent", accent);
        card.addEventListener("click", () => {
          snd.pop();
          speak(cat.title);
          go("leMathCat", cat);
        });
        grid.appendChild(card);
      });
      section.appendChild(grid);
      wrap.appendChild(section);
      api.screenRoot.appendChild(wrap);
      speak("Numbers and Math");
    };

    /* ---------- category: reuse math-category-page + subcat-list ---------- */
    VIEWS.leMathCat = function (cat) {
      if (!cat || !cat.subs) {
        go("leNumbersMath");
        return;
      }
      if (typeof setLeMathCatReturn === "function") setLeMathCatReturn(cat);
      titleEl.textContent = cat.title;
      const accent = cat.accent || "#E8D5F5";

      const wrap = el("div", "math-category-page le-nm-existing");
      wrap.appendChild(el("div", "math-category-hero", `
        <div class="math-category-hero-art" style="background:${escapeHtml(accent)}33">
          <img class="math-card-illustration" src="${escapeHtml(cat.art)}" alt="${escapeHtml(cat.title)}"
            width="480" height="360" loading="eager"
            onerror="if(!this.dataset.fb){this.dataset.fb='1';this.src='${FALLBACK}';}">
        </div>
        <div class="math-category-hero-text">
          <h2>${escapeHtml(cat.title)}</h2>
          <p>${escapeHtml(cat.blurb)}</p>
          <div class="math-card-meta">
            <span>Little Explorers · 2–4</span>
            <span>${cat.subs.length} activities</span>
          </div>
        </div>
      `));

      const catHint = cat.id === "number_recognition"
        ? "7 unique number recognition adventures · tap to play"
        : (cat.id === "counting_quantity"
          ? "6 unique counting adventures · tap to play"
          : (cat.id === "number_tracing"
            ? "6 unique tracing adventures · tap to play"
            : "Level A (2–3) and Level B (3–4) · tap to play"));
      wrap.appendChild(el("div", "home-section-label", `
        <h3>Subcategories</h3>
        <p>${catHint}</p>`));

      const ul = el("div", "subcat-list le-nm-subcat-list");
      cat.subs.forEach((sub, i) => {
        const done = starsFor(sub.id);
        const iconSrc = escapeHtml(subArtSrc(sub));
        const item = el("button", "subcat-item le-nm-subcat-item tone-" + (i % 4) + (done ? " is-done" : ""), `
          <span class="subcat-art" aria-hidden="true">
            <img class="subcat-illustration" src="${iconSrc}" alt=""
              width="96" height="96" loading="lazy"
              onerror="if(!this.dataset.fb){this.dataset.fb='1';this.src='${FALLBACK}';}">
          </span>
          <span class="subcat-copy">
            <strong>${escapeHtml(sub.title)}</strong>
            <span>${sub.level === "A" ? "Level A · Early Explorers" : "Level B · Growing Explorers"}</span>
            <em class="subcat-soon">${done ? ("★".repeat(Math.min(3, done)) + " done") : "Tap to play"}</em>
          </span>
        `);
        item.type = "button";
        item.addEventListener("click", () => {
          snd.pop();
          speak(sub.title);
          go("leMathPlay", { cat, sub });
        });
        ul.appendChild(item);
      });
      wrap.appendChild(ul);
      api.screenRoot.appendChild(wrap);
    };

    /* ---------- activity runner ---------- */
    VIEWS.leMathPlay = function (payload) {
      const cat = payload && payload.cat;
      const sub = payload && payload.sub;
      if (!cat || !sub) {
        go("leNumbersMath");
        return;
      }
      if (typeof setLeMathCatReturn === "function") setLeMathCatReturn(cat);
      titleEl.textContent = sub.title;

      const isExploreOnly = /^(nr_explorer|nr_train|nr_balloons)$/.test(sub.type);
      const isMemory = sub.type === "nr_memory" || sub.type === "match_same";
      const ROUNDS = isExploreOnly ? 1 : (isMemory ? 4 : (sub.level === "A" ? 4 : 5));
      let round = 0;
      let score = 0;
      let locked = false;
      let lastSpeak = "";
      let wrongTries = 0;
      let exploreSeen = new Set();

      const page = el("div", "le-nm-play");
      page.innerHTML = `
        <div class="le-nm-play-top">
          <span class="le-nm-play-cat">${escapeHtml(cat.title)}</span>
          <div class="le-nm-play-top-right">
            <button type="button" class="le-nm-replay" id="leNmReplay" aria-label="Replay audio">Replay</button>
            <span class="le-nm-play-round" id="leNmRound">${isExploreOnly ? "Explore" : ("1 / " + ROUNDS)}</span>
          </div>
        </div>
        <div class="le-nm-play-prompt" id="leNmPrompt"></div>
        <div class="le-nm-play-stage" id="leNmStage"></div>
        <div class="le-nm-play-choices" id="leNmChoices"></div>
        <div class="le-nm-play-feedback" id="leNmFeedback" aria-live="polite"></div>
      `;
      api.screenRoot.appendChild(page);

      const promptEl = page.querySelector("#leNmPrompt");
      const stageEl = page.querySelector("#leNmStage");
      const choicesEl = page.querySelector("#leNmChoices");
      const feedbackEl = page.querySelector("#leNmFeedback");
      const roundEl = page.querySelector("#leNmRound");
      const replayBtn = page.querySelector("#leNmReplay");

      replayBtn.addEventListener("click", () => {
        snd.pop();
        if (lastSpeak) speak(lastSpeak);
      });

      function say(text) {
        lastSpeak = text || "";
        if (text) speak(text);
      }

      function setFeedback(msg, ok) {
        feedbackEl.textContent = msg;
        feedbackEl.className = "le-nm-play-feedback " + (ok ? "ok" : "bad");
      }

      function clearBoard() {
        stageEl.innerHTML = "";
        choicesEl.innerHTML = "";
        feedbackEl.textContent = "";
        feedbackEl.className = "le-nm-play-feedback";
        locked = false;
        wrongTries = 0;
      }

      function finish() {
        const stars = score >= ROUNDS ? 3 : score >= Math.ceil(ROUNDS * 0.6) ? 2 : 1;
        markDone(sub.id, stars);
        go("leMathResult", { cat, sub, score, rounds: ROUNDS, stars });
      }

      function onCorrect(msg) {
        score++;
        snd.correct();
        confetti(8);
        setFeedback(msg || "Great job!", true);
        say(msg || "Great job!");
        locked = true;
        setTimeout(nextRound, 850);
      }

      function onWrong(hint) {
        wrongTries++;
        snd.wrong();
        const soft = hint || (wrongTries >= 2 ? "Look again — you can do it!" : "Try again!");
        setFeedback(soft, false);
        say(soft);
      }

      function hintForAnswer(answer, options) {
        if (answer == null) return "Look again!";
        const match = (options || []).find((opt) => {
          const val = opt && opt.value != null ? opt.value : opt;
          return val === answer;
        });
        if (match && match.label != null) return "Find " + match.label;
        if (typeof answer === "number") return "Find " + answer;
        if (answer === "same") return "Find Same";
        if (answer === "diff") return "Find Different";
        return "Look again!";
      }

      function renderChoices(options, answer, onPick) {
        choicesEl.innerHTML = "";
        shuffle(options).forEach((opt) => {
          const b = document.createElement("button");
          b.type = "button";
          b.className = "le-nm-choice";
          b.textContent = String(opt.label != null ? opt.label : opt);
          b.addEventListener("click", () => {
            if (locked) return;
            const val = opt.value != null ? opt.value : opt;
            if (val === answer) {
              b.classList.add("is-correct");
              onCorrect();
            } else {
              b.classList.add("is-wrong");
              onWrong(wrongTries >= 1 ? hintForAnswer(answer, options) : null);
              if (onPick) onPick(false);
            }
            if (onPick && val === answer) onPick(true);
          });
          choicesEl.appendChild(b);
        });
      }

      function nameOf(n) {
        return NUMBER_NAMES[n] || numberWord(n);
      }

      function finishExplore() {
        const min = sub.min || 1;
        const max = sub.max || 10;
        const total = max - min + 1;
        const seen = exploreSeen.size;
        score = seen >= total ? ROUNDS : (seen >= Math.ceil(total * 0.5) ? Math.max(1, ROUNDS - 1) : 1);
        const stars = seen >= total ? 3 : seen >= 3 ? 2 : 1;
        markDone(sub.id, stars);
        go("leMathResult", { cat, sub, score: seen, rounds: total, stars });
      }

      function mountExploreDone() {
        choicesEl.innerHTML = "";
        const need = Math.min(3, (sub.max || 10) - (sub.min || 1) + 1);
        if (exploreSeen.size < need) return;
        const done = document.createElement("button");
        done.type = "button";
        done.className = "le-nm-choice le-nm-done";
        done.textContent = exploreSeen.size >= ((sub.max || 10) - (sub.min || 1) + 1)
          ? "Great exploring!"
          : "I'm done exploring";
        done.addEventListener("click", () => {
          if (locked) return;
          locked = true;
          snd.correct();
          confetti(10);
          say("Great job!");
          setTimeout(finishExplore, 700);
        });
        choicesEl.appendChild(done);
      }

      function showExploreFocus(n, kind) {
        const preview = stageEl.querySelector("#leExploreFocus");
        if (!preview) return;
        const spoken = nameOf(n);
        let visual;
        if (n <= 10) {
          visual = `<div class="le-nm-objects le-nm-token-row">${tokenRow(n, kind)}</div>`;
        } else {
          const digits = String(n).split("");
          visual = `
            <div class="le-nm-digit-split" aria-hidden="true">
              ${digits.map((d) => `<span class="le-nm-digit-chip">${d}</span>`).join("")}
            </div>
            <p class="le-nm-prompt-soft">${digits.length > 1 ? "Two-digit number · " + digits.join(" and ") : ""}</p>`;
        }
        preview.innerHTML = `
          <div class="le-nm-big-num le-nm-big-num-soft is-pop">${n}</div>
          <p class="le-nm-name-tag">${escapeHtml(spoken)}</p>
          ${visual}`;
        say(spoken);
        setFeedback("Wonderful! " + spoken, true);
      }

      /* --- 1) Interactive Number Explorer (1–10) --- */
      function startNumberExplorer() {
        clearBoard();
        const min = sub.min || 1;
        const max = sub.max || 10;
        roundEl.textContent = "Explore";
        promptEl.textContent = "Let's explore numbers!";
        say("Let's explore numbers!");
        stageEl.innerHTML = `
          <div class="le-nm-explorer">
            <div class="le-nm-block-pad" id="leBlockPad"></div>
            <div class="le-nm-explore" id="leExploreFocus">
              <p class="le-nm-prompt-soft">Tap a colorful number block</p>
            </div>
          </div>`;
        const pad = stageEl.querySelector("#leBlockPad");
        const tones = ["peach", "mint", "sky", "lilac", "sun", "coral", "aqua", "violet", "sage", "rose"];
        for (let n = min; n <= max; n++) {
          const b = document.createElement("button");
          b.type = "button";
          b.className = "le-nm-num-block tone-" + tones[(n - 1) % tones.length];
          b.textContent = String(n);
          b.addEventListener("click", () => {
            snd.pop();
            pad.querySelectorAll(".le-nm-num-block").forEach((x) => x.classList.remove("is-active"));
            b.classList.add("is-active", "is-seen");
            exploreSeen.add(n);
            showExploreFocus(n, pickToken());
            roundEl.textContent = exploreSeen.size + " / " + (max - min + 1);
            mountExploreDone();
          });
          pad.appendChild(b);
        }
      }

      /* --- 2) Number Train Adventure (11–20) --- */
      function startNumberTrain() {
        clearBoard();
        const min = sub.min || 11;
        const max = sub.max || 20;
        roundEl.textContent = "Explore";
        promptEl.textContent = "Hop on the number train!";
        say("Hop on the number train!");
        stageEl.innerHTML = `
          <div class="le-nm-train-wrap">
            <div class="le-nm-train" id="leTrain">
              <div class="le-nm-train-engine" aria-hidden="true">
                <span class="le-nm-train-cab"></span>
                <span class="le-nm-train-stack"></span>
                <span class="le-nm-train-wheel"></span>
                <span class="le-nm-train-wheel"></span>
              </div>
            </div>
            <div class="le-nm-explore" id="leExploreFocus">
              <p class="le-nm-prompt-soft">Tap a carriage to meet its number</p>
            </div>
          </div>`;
        const train = stageEl.querySelector("#leTrain");
        for (let n = min; n <= max; n++) {
          const car = document.createElement("button");
          car.type = "button";
          car.className = "le-nm-train-car";
          car.innerHTML = `<span class="le-nm-train-car-num">${n}</span><span class="le-nm-train-wheel"></span><span class="le-nm-train-wheel"></span>`;
          car.addEventListener("click", () => {
            snd.pop();
            train.querySelectorAll(".le-nm-train-car").forEach((x) => x.classList.remove("is-active"));
            car.classList.add("is-active", "is-seen");
            exploreSeen.add(n);
            showExploreFocus(n, pickToken());
            roundEl.textContent = exploreSeen.size + " / " + (max - min + 1);
            mountExploreDone();
          });
          train.appendChild(car);
        }
      }

      /* --- 3) Number Balloon Adventure (21–30) --- */
      function startNumberBalloons() {
        clearBoard();
        const min = sub.min || 21;
        const max = sub.max || 30;
        roundEl.textContent = "Explore";
        promptEl.textContent = "Tap a number balloon!";
        say("Tap a number balloon!");
        const colors = ["#FF8FAB", "#FFD166", "#7ECDB5", "#A8D4F0", "#C9A0FF", "#FFB4A2", "#9BE7C4", "#F6A6FF", "#FFE29A", "#8FD3FF"];
        stageEl.innerHTML = `
          <div class="le-nm-balloon-sky" id="leBalloonSky"></div>
          <div class="le-nm-explore" id="leExploreFocus">
            <p class="le-nm-prompt-soft">Catch a balloon to meet its number</p>
          </div>`;
        const sky = stageEl.querySelector("#leBalloonSky");
        for (let n = min; n <= max; n++) {
          const i = n - min;
          const b = document.createElement("button");
          b.type = "button";
          b.className = "le-nm-balloon";
          b.style.setProperty("--balloon", colors[i % colors.length]);
          b.style.setProperty("--bx", (8 + (i % 5) * 18) + "%");
          b.style.setProperty("--by", (8 + Math.floor(i / 5) * 38 + (i % 2) * 8) + "%");
          b.style.setProperty("--delay", ((i % 5) * 0.35) + "s");
          b.innerHTML = `<span class="le-nm-balloon-body">${n}</span><span class="le-nm-balloon-string"></span>`;
          b.addEventListener("click", () => {
            if (locked) return;
            snd.pop();
            b.classList.add("is-pop", "is-seen");
            exploreSeen.add(n);
            showExploreFocus(n, pickToken());
            roundEl.textContent = exploreSeen.size + " / " + (max - min + 1);
            mountExploreDone();
          });
          sky.appendChild(b);
        }
      }

      /* --- 4) Number Detective — Find the Hidden Number --- */
      function buildDetectiveRound() {
        const early = round < 2;
        const mid = round < 4;
        const min = early ? 1 : (mid ? 1 : 11);
        const max = early ? 10 : (mid ? 20 : 30);
        const n = randInt(min, max);
        const listenOnly = round % 2 === 1;
        const decoCount = early ? 5 : (mid ? 7 : 8);
        const deco = shuffle(uniqueNumsInRange(n, Math.max(1, n - 6), Math.min(30, n + 6), decoCount));
        wrongTries = 0;
        promptEl.textContent = listenOnly ? "Listen carefully — find that number!" : "Can you find this number?";
        say(listenOnly ? nameOf(n) : ("Can you find number " + nameOf(n) + "?"));
        stageEl.innerHTML = `
          <div class="le-nm-detective">
            ${listenOnly
              ? `<div class="le-nm-target-chip is-listen">🔎 Find the number you hear</div>`
              : `<div class="le-nm-target-chip">Find <strong>${n}</strong></div>`}
            <div class="le-nm-detective-scene" id="leDetectScene"></div>
            <button type="button" class="le-nm-replay le-nm-replay-inline" id="leHearAgain">Hear again</button>
          </div>`;
        const again = stageEl.querySelector("#leHearAgain");
        if (again) again.addEventListener("click", () => { snd.pop(); say(nameOf(n)); });
        const scene = stageEl.querySelector("#leDetectScene");
        const props = ["cloud", "star", "bush", "ball", "block"];
        deco.forEach((v, i) => {
          const b = document.createElement("button");
          b.type = "button";
          b.className = "le-nm-hide-num prop-" + props[i % props.length];
          b.textContent = String(v);
          b.style.setProperty("--fx", (6 + Math.random() * 78) + "%");
          b.style.setProperty("--fy", (10 + Math.random() * 62) + "%");
          b.style.setProperty("--rot", ((Math.random() * 24) - 12) + "deg");
          b.addEventListener("click", () => {
            if (locked) return;
            if (v === n) {
              b.classList.add("is-found");
              onCorrect("You found it!");
            } else {
              b.classList.add("is-wrong");
              onWrong(wrongTries >= 1 ? ("Look for " + n) : "Keep searching!");
            }
          });
          scene.appendChild(b);
        });
        choicesEl.innerHTML = "";
      }

      /* --- 5) Number Memory Match — Flip & Remember --- */
      function buildMemoryRound() {
        const pairCount = round < 1 ? 2 : (round < 3 ? 3 : 4);
        const poolMax = round < 2 ? 10 : 20;
        const values = shuffle(Array.from({ length: poolMax }, (_, i) => i + 1)).slice(0, pairCount);
        const cards = shuffle(values.concat(values).map((v, idx) => ({ id: idx + "-" + v, value: v })));
        let first = null;
        let matched = 0;
        let busy = false;

        promptEl.textContent = "Flip & remember!";
        say("Flip and remember the numbers");
        stageEl.innerHTML = `<div class="le-nm-memory" id="leMemory"></div>`;
        const board = stageEl.querySelector("#leMemory");

        cards.forEach((card) => {
          const b = document.createElement("button");
          b.type = "button";
          b.className = "le-nm-mem-card";
          b.setAttribute("data-value", String(card.value));
          b.innerHTML = `<span class="le-nm-mem-back" aria-hidden="true"></span><span class="le-nm-mem-front">${card.value}</span>`;
          b.addEventListener("click", () => {
            if (locked || busy || b.classList.contains("is-matched") || b.classList.contains("is-open")) return;
            snd.pop();
            b.classList.add("is-open");
            say(nameOf(card.value));
            if (!first) {
              first = b;
              return;
            }
            busy = true;
            if (first.getAttribute("data-value") === b.getAttribute("data-value")) {
              first.classList.add("is-matched");
              b.classList.add("is-matched");
              matched++;
              first = null;
              busy = false;
              say("Nice match!");
              if (matched >= pairCount) onCorrect("Perfect match!");
            } else {
              const a = first;
              setTimeout(() => {
                a.classList.remove("is-open");
                b.classList.remove("is-open");
                first = null;
                busy = false;
                onWrong("Find two the same");
              }, 650);
            }
          });
          board.appendChild(b);
        });
        choicesEl.innerHTML = "";
      }

      /* --- 6) Number Names & Sounds — Listen & Discover --- */
      function buildListenRound() {
        const bands = [
          { min: 1, max: 10 },
          { min: 1, max: 10 },
          { min: 11, max: 20 },
          { min: 11, max: 20 },
          { min: 21, max: 30 },
        ];
        const band = bands[Math.min(round, bands.length - 1)];
        const n = randInt(band.min, band.max);
        const name = nameOf(n);
        const showNames = round % 2 === 1;
        wrongTries = 0;

        promptEl.textContent = "Listen carefully!";
        say(name);
        stageEl.innerHTML = `
          <div class="le-nm-listen-discover">
            <div class="le-nm-listen-card">
              <p class="le-nm-prompt-soft">${showNames ? "Which name did you hear?" : "Which number did you hear?"}</p>
              <button type="button" class="le-nm-replay le-nm-replay-inline" id="leHearAgain">Hear again</button>
            </div>
            <div class="le-nm-listen-reveal" id="leListenReveal" hidden>
              <div class="le-nm-big-num le-nm-big-num-soft">${n}</div>
              <p class="le-nm-name-tag">${escapeHtml(name)}</p>
            </div>
          </div>`;
        const again = stageEl.querySelector("#leHearAgain");
        if (again) again.addEventListener("click", () => { snd.pop(); say(name); });

        const opts = uniqueNumsNear(n, band.min, band.max, 3).map((v) => ({
          label: showNames ? nameOf(v) : v,
          value: v,
        }));
        renderChoices(opts, n, (ok) => {
          if (ok) {
            const reveal = stageEl.querySelector("#leListenReveal");
            if (reveal) reveal.hidden = false;
          }
        });
      }

      /* --- 7) Number Builder — Build the Number --- */
      function buildBuilderRound() {
        const bands = [
          { min: 1, max: 9 },
          { min: 1, max: 10 },
          { min: 11, max: 20 },
          { min: 11, max: 20 },
          { min: 21, max: 30 },
        ];
        const band = bands[Math.min(round, bands.length - 1)];
        const n = randInt(band.min, band.max);
        const digits = String(n).split("");
        const missIdx = digits.length === 1 ? 0 : (Math.random() > 0.5 ? 0 : 1);
        const need = digits[missIdx];
        const wrongPool = shuffle(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].filter((d) => d !== need)).slice(0, 2);
        const pieces = shuffle([need].concat(wrongPool));
        wrongTries = 0;

        promptEl.textContent = "Let's build the number!";
        say("Let's build the number " + nameOf(n));
        stageEl.innerHTML = `
          <div class="le-nm-builder">
            <p class="le-nm-prompt-soft">Fit the missing piece</p>
            <div class="le-nm-builder-board" id="leBuildBoard">
              ${digits.map((d, i) => (
                i === missIdx
                  ? `<span class="le-nm-builder-slot" data-need="${d}">?</span>`
                  : `<span class="le-nm-builder-digit">${d}</span>`
              )).join("")}
            </div>
            <div class="le-nm-builder-pieces" id="leBuildPieces"></div>
          </div>`;
        const slot = stageEl.querySelector(".le-nm-builder-slot");
        const piecesBox = stageEl.querySelector("#leBuildPieces");
        let selected = null;

        function complete(pieceEl) {
          if (locked) return;
          slot.textContent = need;
          slot.classList.add("is-filled");
          pieceEl.classList.add("is-used");
          say(nameOf(n));
          onCorrect("Beautiful number!");
        }

        function tryPlace(digit, pieceEl) {
          if (locked) return;
          if (digit === need && pieceEl) complete(pieceEl);
          else onWrong("Try a different piece");
        }

        pieces.forEach((d) => {
          const p = document.createElement("button");
          p.type = "button";
          p.className = "le-nm-builder-piece";
          p.textContent = d;
          p.setAttribute("draggable", "true");
          p.setAttribute("data-digit", d);
          p.addEventListener("dragstart", (e) => {
            e.dataTransfer.setData("text/plain", d);
            p.classList.add("is-dragging");
          });
          p.addEventListener("dragend", () => p.classList.remove("is-dragging"));
          // Touch-friendly: tap piece, then tap the empty slot
          p.addEventListener("click", () => {
            if (locked || p.classList.contains("is-used")) return;
            snd.pop();
            piecesBox.querySelectorAll(".le-nm-builder-piece").forEach((x) => x.classList.remove("is-selected"));
            p.classList.add("is-selected");
            selected = p;
          });
          // Pointer drag for tablets (fallback to tap-tap if cancelled)
          p.addEventListener("pointerdown", (e) => {
            if (locked || p.classList.contains("is-used") || e.pointerType === "mouse") return;
            p.setPointerCapture(e.pointerId);
            p.classList.add("is-dragging", "is-selected");
            selected = p;
          });
          p.addEventListener("pointerup", (e) => {
            if (!p.classList.contains("is-dragging")) return;
            p.classList.remove("is-dragging");
            const elAt = document.elementFromPoint(e.clientX, e.clientY);
            if (elAt && (elAt === slot || slot.contains(elAt))) {
              tryPlace(d, p);
            }
          });
          piecesBox.appendChild(p);
        });

        slot.addEventListener("dragover", (e) => { e.preventDefault(); slot.classList.add("is-over"); });
        slot.addEventListener("dragleave", () => slot.classList.remove("is-over"));
        slot.addEventListener("drop", (e) => {
          e.preventDefault();
          slot.classList.remove("is-over");
          const d = e.dataTransfer.getData("text/plain");
          const pieceEl = piecesBox.querySelector('[data-digit="' + d + '"]:not(.is-used)');
          tryPlace(d, pieceEl);
        });
        slot.addEventListener("click", () => {
          if (locked || !selected) return;
          tryPlace(selected.getAttribute("data-digit"), selected);
        });
        choicesEl.innerHTML = "";
      }

      /* ========== Counting Skills — 6 approved unique games ========== */

      function cqRange() {
        return { min: sub.min || 1, max: sub.max || 5 };
      }

      /** 1) Count 1–10 — Counting Garden (tap to count with highlights) */
      function buildGardenRound() {
        const { min, max } = cqRange();
        const n = randInt(min, max);
        const kinds = ["apple", "berry", "star"];
        const kind = kinds[randInt(0, kinds.length - 1)];
        const labels = { apple: "apples", berry: "berries", star: "flowers" };
        let counted = 0;
        wrongTries = 0;
        promptEl.textContent = "Count the " + labels[kind] + " in the garden!";
        say("Let's count the " + labels[kind] + " in the garden");
        const buds = Array.from({ length: n }, (_, i) => {
          const left = 6 + (i % 5) * 18 + Math.random() * 3;
          const top = 14 + Math.floor(i / 5) * 32 + Math.random() * 5;
          return `<button type="button" class="le-nm-garden-item le-nm-token le-nm-token-${kind}" data-i="${i}" style="left:${left}%;top:${top}%" aria-label="item"></button>`;
        }).join("");
        stageEl.innerHTML = `
          <div class="le-nm-cq-garden">
            <div class="le-nm-garden-scene" id="leGarden">${buds}</div>
            <p class="le-nm-tap-hint">Tap each one · <span id="leGardenCount">0</span> / ${n}</p>
            <div class="le-nm-total-chip" id="leGardenTotal" hidden>Total: <strong>${n}</strong></div>
          </div>`;
        const counter = stageEl.querySelector("#leGardenCount");
        const totalChip = stageEl.querySelector("#leGardenTotal");
        stageEl.querySelectorAll(".le-nm-garden-item").forEach((node) => {
          node.addEventListener("click", () => {
            if (locked || node.classList.contains("is-counted")) return;
            node.classList.add("is-counted");
            counted++;
            counter.textContent = String(counted);
            snd.pop();
            say(nameOf(counted));
            if (counted === n) {
              totalChip.hidden = false;
              promptEl.textContent = "How many altogether?";
              say("How many altogether?");
              renderChoices(uniqueNumsNear(n, min, max, 3).map(v => ({ label: v, value: v })), n);
            }
          });
        });
        choicesEl.innerHTML = "";
      }

      /** 2) Count 11–20 — Feed the Animals (drag/tap food into basket) */
      function buildFeedRound() {
        const { min, max } = cqRange();
        const need = randInt(min, max);
        const pool = need + randInt(2, 4);
        const animals = [
          { tone: "bunny", name: "bunny" },
          { tone: "bear", name: "bear" },
          { tone: "fox", name: "fox" },
          { tone: "panda", name: "panda" },
        ];
        const animal = animals[randInt(0, animals.length - 1)];
        let fed = 0;
        wrongTries = 0;
        promptEl.textContent = "Feed the " + animal.name + " " + need + " treats!";
        say("Feed the " + animal.name + " " + nameOf(need) + " treats");
        stageEl.innerHTML = `
          <div class="le-nm-cq-feed">
            <div class="le-nm-animal-card">
              <span class="le-nm-animal-face is-${animal.tone}" aria-hidden="true"></span>
              <p class="le-nm-prompt-soft">I want <strong>${need}</strong> treats!</p>
              <div class="le-nm-feed-basket" id="leBasket" data-need="${need}">
                <span class="le-nm-basket-count" id="leFedCount">0 / ${need}</span>
              </div>
            </div>
            <div class="le-nm-feed-pool le-nm-token-row" id="leFeedPool">${tokenRow(pool, "apple")}</div>
            <p class="le-nm-tap-hint">Tap a treat, then tap the basket</p>
          </div>`;
        const basket = stageEl.querySelector("#leBasket");
        const fedEl = stageEl.querySelector("#leFedCount");
        let selected = null;

        function addTreat(piece) {
          if (locked || !piece || piece.classList.contains("is-used") || fed >= need) return;
          piece.classList.add("is-used");
          fed++;
          fedEl.textContent = fed + " / " + need;
          const crumb = document.createElement("span");
          crumb.className = "le-nm-token le-nm-token-apple le-nm-basket-treat";
          basket.appendChild(crumb);
          snd.pop();
          say(nameOf(fed));
          selected = null;
          if (fed === need) {
            promptEl.textContent = "Yum! How many treats did we give?";
            say("How many treats?");
            renderChoices(uniqueNumsNear(need, min, max, 3).map(v => ({ label: v, value: v })), need);
          }
        }

        stageEl.querySelectorAll("#leFeedPool .le-nm-token").forEach((node) => {
          node.classList.add("is-tappable");
          node.setAttribute("draggable", "true");
          node.addEventListener("click", () => {
            if (locked || node.classList.contains("is-used")) return;
            stageEl.querySelectorAll("#leFeedPool .le-nm-token").forEach((x) => x.classList.remove("is-selected"));
            node.classList.add("is-selected");
            selected = node;
            snd.pop();
          });
          node.addEventListener("dragstart", (e) => {
            e.dataTransfer.setData("text/plain", "treat");
            selected = node;
            node.classList.add("is-dragging");
          });
          node.addEventListener("dragend", () => node.classList.remove("is-dragging"));
        });
        basket.addEventListener("dragover", (e) => { e.preventDefault(); basket.classList.add("is-over"); });
        basket.addEventListener("dragleave", () => basket.classList.remove("is-over"));
        basket.addEventListener("drop", (e) => {
          e.preventDefault();
          basket.classList.remove("is-over");
          addTreat(selected);
        });
        basket.addEventListener("click", () => addTreat(selected));
        choicesEl.innerHTML = "";
      }

      /** 3) Count 21–30 — Underwater Counting Adventure */
      function buildUnderwaterRound() {
        const { min, max } = cqRange();
        const n = randInt(min, max);
        let counted = 0;
        wrongTries = 0;
        promptEl.textContent = "Count the sea creatures!";
        say("Dive in! Count the sea creatures");
        const creatures = Array.from({ length: n }, (_, i) => {
          const left = 4 + (i % 6) * 15 + Math.random() * 2;
          const top = 10 + Math.floor(i / 6) * 22 + Math.random() * 4;
          const tone = ["fish", "bubble", "star"][i % 3];
          return `<button type="button" class="le-nm-sea-item is-${tone}" data-i="${i}" style="left:${left}%;top:${top}%" aria-label="creature"></button>`;
        }).join("");
        stageEl.innerHTML = `
          <div class="le-nm-cq-sea">
            <div class="le-nm-sea-scene" id="leSea">${creatures}</div>
            <p class="le-nm-tap-hint">Tap to count · <span id="leSeaCount">0</span> / ${n}</p>
            <div class="le-nm-total-chip" id="leSeaTotal" hidden>Total: <strong>${n}</strong></div>
          </div>`;
        const counter = stageEl.querySelector("#leSeaCount");
        const totalChip = stageEl.querySelector("#leSeaTotal");
        stageEl.querySelectorAll(".le-nm-sea-item").forEach((node) => {
          node.addEventListener("click", () => {
            if (locked || node.classList.contains("is-counted")) return;
            node.classList.add("is-counted");
            counted++;
            counter.textContent = String(counted);
            snd.pop();
            say(nameOf(counted));
            if (counted === n) {
              totalChip.hidden = false;
              promptEl.textContent = "How many creatures did you find?";
              say("How many creatures?");
              renderChoices(uniqueNumsNear(n, min, max, 3).map(v => ({ label: v, value: v })), n);
            }
          });
        });
        choicesEl.innerHTML = "";
      }

      /** 4) One-by-One Counting — Tap Every Object */
      function buildCqTapRound() {
        const { min, max } = cqRange();
        const softMax = round < 2 ? Math.min(max, 5) : Math.min(max, 10);
        const n = randInt(min, softMax);
        const kind = pickToken();
        let tapped = 0;
        wrongTries = 0;
        promptEl.textContent = "Tap every object — one by one!";
        say("Tap every object one by one");
        stageEl.innerHTML = `
          <div class="le-nm-cq-tap">
            <div class="le-nm-objects le-nm-token-row" id="leTapObjs">${tokenRow(n, kind)}</div>
            <p class="le-nm-tap-hint">Each object once · <span id="leTapCount">0</span> / ${n}</p>
            <div class="le-nm-total-chip" id="leTapTotal" hidden>Final count: <strong>${n}</strong></div>
          </div>`;
        const counter = stageEl.querySelector("#leTapCount");
        const totalChip = stageEl.querySelector("#leTapTotal");
        stageEl.querySelectorAll(".le-nm-token").forEach((node) => {
          node.classList.add("is-tappable");
          node.addEventListener("click", () => {
            if (locked || node.classList.contains("is-tapped")) return;
            node.classList.add("is-tapped");
            tapped++;
            counter.textContent = String(tapped);
            snd.pop();
            say(nameOf(tapped));
            if (tapped === n) {
              totalChip.hidden = false;
              onCorrect("Great one-by-one counting!");
            }
          });
        });
        choicesEl.innerHTML = "";
      }

      /** 5) Count Around Us — Counting Explorer (real-life scenes) */
      function buildAroundRound() {
        const scenes = [
          { id: "park", title: "park", ask: "birds", prompt: "How many birds are in the park?", cls: "scene-park", itemCls: "is-bird" },
          { id: "kitchen", title: "kitchen", ask: "apples", prompt: "How many apples are in the kitchen?", cls: "scene-kitchen", itemCls: "is-apple" },
          { id: "bedroom", title: "bedroom", ask: "stars", prompt: "How many stars are in the bedroom?", cls: "scene-bedroom", itemCls: "is-star" },
          { id: "playground", title: "playground", ask: "balls", prompt: "How many balls are in the playground?", cls: "scene-play", itemCls: "is-ball" },
          { id: "garden", title: "garden", ask: "flowers", prompt: "How many flowers are in the garden?", cls: "scene-garden", itemCls: "is-flower" },
        ];
        const scene = scenes[round % scenes.length];
        const { min, max } = cqRange();
        const softMax = round < 2 ? Math.min(max, 8) : Math.min(max, 12);
        const n = randInt(Math.max(min, 2), softMax);
        wrongTries = 0;
        promptEl.textContent = scene.prompt;
        say(scene.prompt);
        const items = Array.from({ length: n }, (_, i) => {
          const left = 8 + (i % 4) * 22 + Math.random() * 4;
          const top = 18 + Math.floor(i / 4) * 28 + Math.random() * 6;
          return `<span class="le-nm-scene-item ${scene.itemCls}" style="left:${left}%;top:${top}%" aria-hidden="true"></span>`;
        }).join("");
        stageEl.innerHTML = `
          <div class="le-nm-cq-around">
            <p class="le-nm-scene-label">${escapeHtml(scene.title)}</p>
            <div class="le-nm-life-scene ${scene.cls}">${items}</div>
            <p class="le-nm-tap-hint">Look carefully, then choose the total</p>
          </div>`;
        renderChoices(uniqueNumsNear(n, 1, Math.max(softMax, n), 3).map(v => ({ label: v, value: v })), n);
      }

      /** 6) Count Sounds & Actions — Listen & Count */
      function buildSoundsRound() {
        const { min, max } = cqRange();
        const softMax = round < 2 ? Math.min(max, 5) : Math.min(max, 8);
        const n = randInt(Math.max(min, 2), softMax);
        const actions = [
          { id: "clap", label: "claps", speak: "clap" },
          { id: "drum", label: "drum beats", speak: "drum" },
          { id: "jump", label: "jumps", speak: "jump" },
          { id: "knock", label: "knocks", speak: "knock" },
        ];
        const action = actions[round % actions.length];
        let playing = false;
        wrongTries = 0;

        promptEl.textContent = "Listen carefully!";
        stageEl.innerHTML = `
          <div class="le-nm-cq-sounds">
            <div class="le-nm-sound-card">
              <p class="le-nm-prompt-soft">How many ${escapeHtml(action.label)}?</p>
              <div class="le-nm-sound-visual" id="leSoundVisual" aria-hidden="true"></div>
              <button type="button" class="le-nm-replay le-nm-replay-inline" id="lePlaySounds">Play sounds</button>
            </div>
            <div class="le-nm-sound-reveal" id="leSoundReveal" hidden>
              <p class="le-nm-prompt-soft">You heard <strong>${n}</strong> ${escapeHtml(action.label)}</p>
            </div>
          </div>`;

        async function playSequence() {
          if (playing) return;
          playing = true;
          const visual = stageEl.querySelector("#leSoundVisual");
          visual.innerHTML = "";
          for (let i = 1; i <= n; i++) {
            say(action.speak);
            const beat = document.createElement("span");
            beat.className = "le-nm-sound-beat is-" + action.id;
            beat.textContent = String(i);
            visual.appendChild(beat);
            snd.pop();
            await new Promise((r) => setTimeout(r, 650));
          }
          playing = false;
          promptEl.textContent = "How many " + action.label + " did you hear?";
          say("How many " + action.label + " did you hear?");
        }

        const playBtn = stageEl.querySelector("#lePlaySounds");
        playBtn.addEventListener("click", () => { snd.pop(); playSequence(); });
        // Auto-play once
        setTimeout(playSequence, 400);

        renderChoices(uniqueNumsNear(n, 1, softMax, 3).map(v => ({ label: v, value: v })), n, (ok) => {
          if (ok) {
            const reveal = stageEl.querySelector("#leSoundReveal");
            if (reveal) reveal.hidden = false;
          }
        });
      }

      /* ========== Number Writing & Tracing — 6 approved unique games ========== */

      function pickTraceNumber(min, max) {
        const lo = Math.max(1, min || 1);
        const hi = Math.min(30, max || 10);
        // Prefer smaller numbers early in a session for ages 2–3
        const soft = round < 2 ? Math.min(hi, Math.max(lo, lo + Math.floor((hi - lo) * 0.35))) : hi;
        return randInt(lo, Math.max(lo, soft));
      }

      function getTraceDef(n) {
        if (typeof TRACE_NUMBERS !== "undefined" && TRACE_NUMBERS[n - 1]) return TRACE_NUMBERS[n - 1];
        return {
          n,
          word: nameOf(n),
          paths: ["M 100 40 L 100 240"],
          start: { x: 100, y: 40 },
          tip: "Follow the dots",
        };
      }

      /**
       * Shared SVG+canvas tracer.
       * mode: guided | follow | complete | freehand
       */
      function buildNumberTraceRound(mode) {
        const min = sub.min || 1;
        const max = sub.max || 10;
        const n = pickTraceNumber(min, max);
        const def = getTraceDef(n);
        const VB = { w: 220, h: 280 };
        const PASS = mode === "nt_freehand" ? 0.18 : (mode === "nt_complete" ? 0.28 : 0.32);
        const HIT_R = mode === "nt_freehand" ? 72 : 56;
        wrongTries = 0;

        promptEl.textContent = mode === "nt_freehand"
          ? ("Draw number " + n + " your own way!")
          : (mode === "nt_complete"
            ? ("Complete number " + n)
            : (mode === "nt_follow"
              ? ("Watch, then follow the path for " + n)
              : ("Trace number " + n)));
        say((mode === "nt_follow" ? "Watch carefully. " : "") + "Number " + nameOf(n));

        stageEl.innerHTML = `
          <div class="le-nm-nt">
            <p class="le-nm-tap-hint" id="leNtTip">${escapeHtml(def.tip || "Follow the dotted path")}</p>
            <div class="le-nm-nt-board" id="leNtBoard">
              <svg class="le-nm-nt-svg" id="leNtSvg" viewBox="0 0 ${VB.w} ${VB.h}" aria-hidden="true"></svg>
              <canvas class="le-nm-nt-canvas" id="leNtCanvas" width="320" height="400"></canvas>
            </div>
            <div class="le-nm-nt-progress">
              <div class="le-nm-nt-bar"><span id="leNtFill"></span></div>
              <span id="leNtPct">0%</span>
            </div>
            <div class="le-nm-nt-actions" id="leNtActions"></div>
          </div>`;

        const board = stageEl.querySelector("#leNtBoard");
        const svg = stageEl.querySelector("#leNtSvg");
        const canvas = stageEl.querySelector("#leNtCanvas");
        const fillEl = stageEl.querySelector("#leNtFill");
        const pctEl = stageEl.querySelector("#leNtPct");
        const actions = stageEl.querySelector("#leNtActions");
        const tipEl = stageEl.querySelector("#leNtTip");
        const ctx = canvas.getContext("2d");
        const svgNS = "http://www.w3.org/2000/svg";

        let hitPoints = [];
        let drawing = false;
        let lastPt = null;
        let ink = 0;
        let completed = false;
        let demoTimer = null;
        let completeStart = null;

        function layout() {
          const w = board.clientWidth || 320;
          const h = Math.min(420, Math.floor(w * (VB.h / VB.w)));
          board.style.height = h + "px";
          const dpr = Math.min(window.devicePixelRatio || 1, 2);
          canvas.width = Math.floor(w * dpr);
          canvas.height = Math.floor(h * dpr);
          canvas.style.width = w + "px";
          canvas.style.height = h + "px";
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          ctx.strokeStyle = "#7E5FB0";
          ctx.lineWidth = Math.max(14, w * 0.045);
        }

        function metrics() {
          const rect = board.getBoundingClientRect();
          const bw = board.clientWidth || rect.width;
          const bh = board.clientHeight || rect.height;
          const scale = Math.min(bw / VB.w, bh / VB.h);
          const ox = (bw - VB.w * scale) / 2;
          const oy = (bh - VB.h * scale) / 2;
          return { rect, bw, bh, scale, ox, oy };
        }

        function samplePath(pathEl, step) {
          let len = 0;
          try { len = pathEl.getTotalLength(); } catch (e) { return []; }
          if (!len) return [];
          const pts = [];
          const count = Math.max(20, Math.ceil(len / step));
          for (let i = 0; i <= count; i++) {
            const p = pathEl.getPointAtLength((len * i) / count);
            pts.push({ x: p.x, y: p.y, hit: false });
          }
          return pts;
        }

        function drawGuides() {
          while (svg.firstChild) svg.removeChild(svg.firstChild);
          hitPoints = [];
          const paths = def.paths || [];
          const hideFrom = mode === "nt_complete"
            ? (paths.length <= 1 ? 1 : Math.ceil(paths.length / 2))
            : paths.length;

          paths.forEach((d, idx) => {
            const path = document.createElementNS(svgNS, "path");
            path.setAttribute("d", d);
            path.setAttribute("fill", "none");
            path.setAttribute("stroke-linecap", "round");
            path.setAttribute("stroke-linejoin", "round");
            if (mode === "nt_freehand") {
              path.setAttribute("stroke", "rgba(126,95,176,0.18)");
              path.setAttribute("stroke-width", "28");
            } else if (mode === "nt_complete" && idx >= hideFrom) {
              path.setAttribute("stroke", "rgba(126,95,176,0.22)");
              path.setAttribute("stroke-width", "10");
              path.setAttribute("stroke-dasharray", "4 14");
            } else if (mode === "nt_complete") {
              // Already-drawn stroke (solid)
              path.setAttribute("stroke", "rgba(126,95,176,0.55)");
              path.setAttribute("stroke-width", "14");
            } else {
              path.setAttribute("stroke", "rgba(126,95,176,0.35)");
              path.setAttribute("stroke-width", "12");
              path.setAttribute("stroke-dasharray", "8 12");
            }
            svg.appendChild(path);
            // Complete mode: only score the missing strokes / missing half
            if (mode === "nt_complete" && idx < hideFrom && paths.length > 1) {
              // Multi-stroke complete: only the missing strokes count toward progress
              /* skip pre-drawn paths for scoring */
            } else {
              hitPoints = hitPoints.concat(samplePath(path, mode === "nt_freehand" ? 18 : 12));
            }
          });

          // Single-stroke complete: show first half as solid, score only the second half
          if (mode === "nt_complete" && paths.length === 1) {
            const base = svg.querySelector("path");
            if (base) {
              let len = 0;
              try { len = base.getTotalLength(); } catch (e) { len = 0; }
              if (len > 0) {
                const half = len * 0.45;
                base.setAttribute("stroke", "rgba(126,95,176,0.22)");
                base.setAttribute("stroke-width", "10");
                base.setAttribute("stroke-dasharray", "4 14");
                const solid = document.createElementNS(svgNS, "path");
                solid.setAttribute("d", paths[0]);
                solid.setAttribute("fill", "none");
                solid.setAttribute("stroke", "rgba(126,95,176,0.55)");
                solid.setAttribute("stroke-width", "14");
                solid.setAttribute("stroke-linecap", "round");
                solid.setAttribute("stroke-dasharray", half + " " + (len + 20));
                solid.setAttribute("stroke-dashoffset", "0");
                svg.insertBefore(solid, base);
                hitPoints = [];
                const count = Math.max(16, Math.ceil((len - half) / 12));
                for (let i = 0; i <= count; i++) {
                  const p = base.getPointAtLength(half + ((len - half) * i) / count);
                  hitPoints.push({ x: p.x, y: p.y, hit: false });
                }
                const gap = base.getPointAtLength(half);
                completeStart = { x: gap.x, y: gap.y };
              }
            }
          }

          const startPt = completeStart || def.start;
          if (startPt && mode !== "nt_freehand") {
            const dot = document.createElementNS(svgNS, "circle");
            dot.setAttribute("cx", startPt.x);
            dot.setAttribute("cy", startPt.y);
            dot.setAttribute("r", "10");
            dot.setAttribute("fill", "#FF8FAB");
            dot.setAttribute("class", "le-nm-nt-start");
            svg.appendChild(dot);
            const label = document.createElementNS(svgNS, "text");
            label.setAttribute("x", startPt.x);
            label.setAttribute("y", startPt.y - 16);
            label.setAttribute("text-anchor", "middle");
            label.setAttribute("fill", "#7E5FB0");
            label.setAttribute("font-size", "14");
            label.setAttribute("font-weight", "800");
            label.textContent = "Start";
            svg.appendChild(label);
          }
        }

        function clearInk() {
          layout();
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          hitPoints.forEach((p) => { p.hit = false; });
          ink = 0;
          completed = false;
          updateProgress();
        }

        function updateProgress() {
          const total = hitPoints.length || 1;
          const hits = hitPoints.filter((p) => p.hit).length;
          const pct = Math.min(100, Math.round((hits / total) * 100));
          fillEl.style.width = pct + "%";
          pctEl.textContent = pct + "%";
          return hits / total;
        }

        function clientToVb(e) {
          const m = metrics();
          const src = e.touches && e.touches[0] ? e.touches[0] : e;
          const x = src.clientX - m.rect.left;
          const y = src.clientY - m.rect.top;
          return {
            cssX: x,
            cssY: y,
            vbX: (x - m.ox) / m.scale,
            vbY: (y - m.oy) / m.scale,
          };
        }

        function markHits(vbX, vbY) {
          let near = false;
          hitPoints.forEach((p) => {
            const dx = p.x - vbX;
            const dy = p.y - vbY;
            if ((dx * dx + dy * dy) <= HIT_R * HIT_R) {
              p.hit = true;
              near = true;
            }
          });
          return near;
        }

        function pointerDown(e) {
          if (completed || locked) return;
          e.preventDefault();
          drawing = true;
          const p = clientToVb(e);
          lastPt = p;
          ctx.beginPath();
          ctx.moveTo(p.cssX, p.cssY);
          markHits(p.vbX, p.vbY);
          updateProgress();
        }

        function pointerMove(e) {
          if (!drawing || completed || locked) return;
          e.preventDefault();
          const p = clientToVb(e);
          ctx.lineTo(p.cssX, p.cssY);
          ctx.stroke();
          ink++;
          const near = markHits(p.vbX, p.vbY);
          if (!near && mode !== "nt_freehand" && ink % 8 === 0) {
            tipEl.textContent = "Stay on the dotted path — you can do it!";
          }
          const ratio = updateProgress();
          if (ratio >= PASS && (mode === "nt_freehand" ? ink > 18 : true)) {
            finishTrace();
          }
          lastPt = p;
        }

        function pointerUp() {
          drawing = false;
          lastPt = null;
        }

        function finishTrace() {
          if (completed || locked) return;
          completed = true;
          tipEl.textContent = "Beautiful number " + n + "!";
          say("Wonderful! Number " + nameOf(n));
          onCorrect("Great tracing!");
        }

        function animateDemo() {
          if (demoTimer) clearInterval(demoTimer);
          const guide = document.createElementNS(svgNS, "circle");
          guide.setAttribute("r", "9");
          guide.setAttribute("fill", "#FFD166");
          guide.setAttribute("class", "le-nm-nt-demo");
          svg.appendChild(guide);
          const allPts = hitPoints.slice();
          let i = 0;
          tipEl.textContent = "Watch the glowing path…";
          demoTimer = setInterval(() => {
            if (i >= allPts.length) {
              clearInterval(demoTimer);
              demoTimer = null;
              if (guide.parentNode) guide.parentNode.removeChild(guide);
              tipEl.textContent = "Now you try! Start at the pink dot.";
              say("Now you try");
              return;
            }
            const p = allPts[i];
            guide.setAttribute("cx", p.x);
            guide.setAttribute("cy", p.y);
            i += Math.max(1, Math.floor(allPts.length / 40));
          }, 40);
        }

        // Controls
        function addBtn(label, cls, fn) {
          const b = document.createElement("button");
          b.type = "button";
          b.className = "le-nm-choice le-nm-nt-btn " + (cls || "");
          b.textContent = label;
          b.addEventListener("click", () => { if (!locked) { snd.pop(); fn(); } });
          actions.appendChild(b);
          return b;
        }
        addBtn("Clear", "", () => {
          clearInk();
          tipEl.textContent = def.tip || "Follow the dotted path";
          say("Try again");
        });
        addBtn("Show me", "", () => animateDemo());
        addBtn("Hear", "", () => say(nameOf(n)));
        if (mode !== "nt_freehand") {
          addBtn("Done", "le-nm-done", () => {
            const ratio = updateProgress();
            if (ratio >= PASS * 0.85 || ink > 40) finishTrace();
            else onWrong("Trace a little more along the path");
          });
        } else {
          addBtn("Done", "le-nm-done", () => {
            if (ink > 20) finishTrace();
            else onWrong("Draw the number a bit more");
          });
        }

        canvas.addEventListener("mousedown", pointerDown);
        canvas.addEventListener("mousemove", pointerMove);
        canvas.addEventListener("mouseup", pointerUp);
        canvas.addEventListener("mouseleave", pointerUp);
        canvas.addEventListener("touchstart", pointerDown, { passive: false });
        canvas.addEventListener("touchmove", pointerMove, { passive: false });
        canvas.addEventListener("touchend", pointerUp);

        layout();
        drawGuides();
        clearInk();
        if (mode === "nt_follow") setTimeout(animateDemo, 350);
        choicesEl.innerHTML = "";
      }

      function buildRound() {
        clearBoard();
        const type = sub.type;

        if (type === "nr_explorer") {
          startNumberExplorer();
          return;
        }
        if (type === "nr_train") {
          startNumberTrain();
          return;
        }
        if (type === "nr_balloons") {
          startNumberBalloons();
          return;
        }

        roundEl.textContent = (round + 1) + " / " + ROUNDS;
        const max = sub.max || 5;

        if (type === "nr_detective") {
          buildDetectiveRound();
          return;
        }
        if (type === "nr_memory" || type === "match_same") {
          buildMemoryRound();
          return;
        }
        if (type === "nr_listen" || type === "number_names") {
          buildListenRound();
          return;
        }
        if (type === "nr_builder") {
          buildBuilderRound();
          return;
        }

        if (type === "cq_garden") { buildGardenRound(); return; }
        if (type === "cq_feed") { buildFeedRound(); return; }
        if (type === "cq_underwater") { buildUnderwaterRound(); return; }
        if (type === "cq_tap") { buildCqTapRound(); return; }
        if (type === "cq_around") { buildAroundRound(); return; }
        if (type === "cq_sounds") { buildSoundsRound(); return; }

        if (type === "nt_guided" || type === "nt_follow" || type === "nt_complete" || type === "nt_freehand" || type === "trace") {
          buildNumberTraceRound(type === "trace" ? "nt_guided" : type);
          return;
        }

        if (type === "pick_number") {
          const n = randInt(1, max);
          promptEl.textContent = "Find number " + n;
          say(promptEl.textContent);
          stageEl.innerHTML = `<div class="le-nm-big-num">${n}</div>`;
          renderChoices(uniqueNums(n, max, 3).map(v => ({ label: v, value: v })), n);
          return;
        }

        if (type === "count_objects" || type === "tap_count") {
          const min = sub.min || 1;
          const tapMax = Math.min(max, 10);
          const n = type === "tap_count"
            ? randInt(min, tapMax)
            : randInt(min, max);
          const kind = pickToken();
          const countPrompt = type === "tap_count"
            ? "Tap each one to count"
            : (sub.id === "cq_familiar"
              ? "Count the toys"
              : (sub.id === "cq_pictures"
                ? "Count in the picture"
                : (n > 10 ? "Count the groups — how many?" : "How many do you see?")));
          promptEl.textContent = countPrompt;
          say(type === "tap_count" ? "Tap each one" : "How many?");
          if (type === "tap_count") {
            let tapped = 0;
            stageEl.innerHTML = `<div class="le-nm-objects le-nm-token-row" id="leTapObjs">${tokenRow(n, kind)}</div>
              <p class="le-nm-tap-hint">Tap each one · <span id="leTapCount">0</span>/${n}</p>`;
            const counter = stageEl.querySelector("#leTapCount");
            stageEl.querySelectorAll(".le-nm-token").forEach((node) => {
              node.classList.add("is-tappable");
              node.addEventListener("click", () => {
                if (locked || node.classList.contains("is-tapped")) return;
                node.classList.add("is-tapped");
                tapped++;
                counter.textContent = String(tapped);
                snd.pop();
                if (tapped === n) onCorrect();
              });
            });
            choicesEl.innerHTML = "";
          } else {
            stageEl.innerHTML = qtyVisual(n, kind);
            renderChoices(uniqueNumsNear(n, min, max, 3).map(v => ({ label: v, value: v })), n);
          }
          return;
        }

        if (type === "match_qty") {
          const min = sub.min || 1;
          const n = randInt(min, max);
          const kind = pickToken();
          promptEl.textContent = "Match the number to the group";
          say("Match the number");
          stageEl.innerHTML = qtyVisual(n, kind);
          renderChoices(uniqueNumsNear(n, min, max, 3).map(v => ({ label: v, value: v })), n);
          return;
        }

        if (type === "sort_qty") {
          const target = randInt(1, Math.min(max, 5));
          const distractors = [];
          while (distractors.length < 2) {
            const d = randInt(1, Math.min(max, 5));
            if (d !== target && !distractors.includes(d)) distractors.push(d);
          }
          const groups = shuffle([
            { side: "a", count: target },
            { side: "b", count: distractors[0] },
            { side: "c", count: distractors[1] },
          ]);
          promptEl.textContent = "Which group has " + target + "?";
          say("Which group has " + NUMBER_NAMES[target]);
          stageEl.innerHTML = `<div class="le-nm-compare le-nm-compare-3">
            ${groups.map((g) => `
              <button type="button" class="le-nm-group-pick" data-side="${g.side}">
                <span class="le-nm-objects le-nm-token-row">${tokenRow(g.count, pickToken())}</span>
              </button>`).join("")}
          </div>`;
          const answer = groups.find((g) => g.count === target).side;
          stageEl.querySelectorAll(".le-nm-group-pick").forEach((btn) => {
            btn.addEventListener("click", () => {
              if (locked) return;
              if (btn.getAttribute("data-side") === answer) onCorrect();
              else onWrong("Find the group of " + target);
            });
          });
          return;
        }

        if (type === "more_less") {
          let a = randInt(1, Math.min(max, 8));
          let b = randInt(1, Math.min(max, 8));
          while (a === b) b = randInt(1, Math.min(max, 8));
          const askMore = Math.random() > 0.35;
          promptEl.textContent = askMore ? "Which group has more?" : "Which group has less?";
          say(promptEl.textContent);
          stageEl.innerHTML = `
            <div class="le-nm-compare">
              <button type="button" class="le-nm-group-pick" data-side="a"><span class="le-nm-objects le-nm-token-row">${tokenRow(a)}</span></button>
              <button type="button" class="le-nm-group-pick" data-side="b"><span class="le-nm-objects le-nm-token-row">${tokenRow(b)}</span></button>
            </div>`;
          const answer = askMore ? (a > b ? "a" : "b") : (a < b ? "a" : "b");
          stageEl.querySelectorAll(".le-nm-group-pick").forEach((btn) => {
            btn.addEventListener("click", () => {
              if (locked) return;
              if (btn.getAttribute("data-side") === answer) onCorrect();
              else onWrong("Look carefully!");
            });
          });
          return;
        }

        if (type === "same_qty") {
          const n = randInt(2, Math.min(max, 6));
          const same = Math.random() > 0.4;
          const other = same ? n : (n === 2 ? 3 : n - 1);
          promptEl.textContent = "Are the groups the same?";
          say(promptEl.textContent);
          stageEl.innerHTML = `
            <div class="le-nm-compare">
              <div class="le-nm-group-view"><span class="le-nm-objects le-nm-token-row">${tokenRow(n)}</span></div>
              <div class="le-nm-group-view"><span class="le-nm-objects le-nm-token-row">${tokenRow(other)}</span></div>
            </div>`;
          renderChoices([
            { label: "Same", value: "same" },
            { label: "Different", value: "diff" },
          ], same ? "same" : "diff");
          return;
        }

        if (type === "add_groups") {
          const sumMax = Math.min(max, 10);
          let a = randInt(1, Math.max(1, Math.floor(sumMax / 2)));
          let b = randInt(1, Math.max(1, sumMax - a));
          while (a + b > sumMax) b = randInt(1, Math.max(1, sumMax - a));
          const sum = a + b;
          const kind = pickToken();
          promptEl.textContent = "How many altogether?";
          say("How many altogether?");
          stageEl.innerHTML = `
            <div class="le-nm-add">
              <div class="le-nm-group-view"><span class="le-nm-objects le-nm-token-row">${tokenRow(a, kind)}</span></div>
              <span class="le-nm-plus">＋</span>
              <div class="le-nm-group-view"><span class="le-nm-objects le-nm-token-row">${tokenRow(b, kind)}</span></div>
            </div>`;
          renderChoices(uniqueNums(sum, sumMax, 3).map(v => ({ label: v, value: v })), sum);
          return;
        }

        if (type === "make_group") {
          const target = sub.target || 2;
          const kind = pickToken();
          promptEl.textContent = "Make a group of " + target;
          say("Make a group of " + target);
          let selected = 0;
          const pool = target + 2;
          stageEl.innerHTML = `<div class="le-nm-objects le-nm-token-row" id="leMakePool">${tokenRow(pool, kind)}</div>
            <p class="le-nm-tap-hint">Selected: <span id="leMakeCount">0</span> / ${target}</p>`;
          const counter = stageEl.querySelector("#leMakeCount");
          stageEl.querySelectorAll(".le-nm-token").forEach((node) => {
            node.classList.add("is-tappable");
            node.addEventListener("click", () => {
              if (locked) return;
              if (node.classList.contains("is-tapped")) {
                node.classList.remove("is-tapped");
                selected = Math.max(0, selected - 1);
              } else {
                if (selected >= target) return;
                node.classList.add("is-tapped");
                selected++;
              }
              counter.textContent = String(selected);
              snd.pop();
              if (selected === target) onCorrect();
            });
          });
          return;
        }

        if (type === "next_number" || type === "before_after") {
          const min = sub.min || 1;
          const n = randInt(Math.max(min, 1), Math.max(min + 1, max - 1));
          if (type === "before_after" && Math.random() > 0.5 && n > min) {
            promptEl.textContent = "What comes before " + n + "?";
            say(promptEl.textContent);
            renderChoices(uniqueNumsNear(n - 1, min, max, 3).map(v => ({ label: v, value: v })), n - 1);
            stageEl.innerHTML = `<div class="le-nm-big-num">? → ${n}</div>`;
          } else {
            const ask = Math.min(n, max - 1);
            promptEl.textContent = "What comes after " + ask + "?";
            say(promptEl.textContent);
            stageEl.innerHTML = `<div class="le-nm-big-num">${ask} → ?</div>`;
            renderChoices(uniqueNumsNear(ask + 1, min, max, 3).map(v => ({ label: v, value: v })), ask + 1);
          }
          return;
        }

        if (type === "missing") {
          const min = sub.min || 1;
          const span = Math.min(5, Math.max(3, max - min + 1));
          const start = randInt(min, Math.max(min, max - span + 1));
          const end = start + span - 1;
          const miss = randInt(start + 1, end - 1);
          const seq = [];
          for (let i = start; i <= end; i++) seq.push(i === miss ? "?" : String(i));
          promptEl.textContent = "Which number is missing?";
          say("Which number is missing?");
          stageEl.innerHTML = `<div class="le-nm-seq">${seq.map(s => `<span class="le-nm-seq-item${s === "?" ? " miss" : ""}">${s}</span>`).join("")}</div>`;
          renderChoices(uniqueNumsNear(miss, start, end, 3).map(v => ({ label: v, value: v })), miss);
          return;
        }

        if (type === "arrange") {
          const min = sub.min || 1;
          const span = Math.min(sub.level === "A" ? 5 : 6, Math.max(3, max - min + 1));
          const start = randInt(min, Math.max(min, max - span + 1));
          const end = start + span - 1;
          const nums = shuffle(Array.from({ length: span }, (_, i) => start + i));
          let nextExpect = start;
          promptEl.textContent = start === 1 && end <= 10
            ? "Tap numbers in order"
            : ("Tap " + start + " to " + end + " in order");
          say("Tap numbers in order");
          stageEl.innerHTML = `<div class="le-nm-arrange" id="leArrange"></div>`;
          const box = stageEl.querySelector("#leArrange");
          nums.forEach((n) => {
            const b = document.createElement("button");
            b.type = "button";
            b.className = "le-nm-choice le-nm-arrange-btn";
            b.textContent = String(n);
            b.addEventListener("click", () => {
              if (locked || b.disabled) return;
              if (n === nextExpect) {
                b.disabled = true;
                b.classList.add("is-done");
                snd.pop();
                nextExpect++;
                if (nextExpect > end) onCorrect();
              } else onWrong("Start from the smallest!");
            });
            box.appendChild(b);
          });
          return;
        }

        if (type === "qty_pattern") {
          const base = randInt(1, 3);
          const kind = pickToken();
          promptEl.textContent = "What comes next in the pattern?";
          say("What comes next?");
          stageEl.innerHTML = `<div class="le-nm-pattern">
            <span class="le-nm-objects le-nm-token-row">${tokenRow(base, kind)}</span>
            <span class="le-nm-objects le-nm-token-row">${tokenRow(base, kind)}</span>
            <span class="le-nm-objects le-nm-token-row">${tokenRow(base, kind)}</span>
            <span class="le-nm-seq-item miss">?</span>
          </div>`;
          renderChoices(uniqueNums(base, 5, 3).map(v => ({ label: v, value: v })), base);
          return;
        }

        if (type === "one_many") {
          const many = Math.random() > 0.5;
          promptEl.textContent = many ? "Tap the MANY group" : "Tap the ONE";
          say(promptEl.textContent);
          stageEl.innerHTML = `
            <div class="le-nm-compare">
              <button type="button" class="le-nm-group-pick" data-side="one"><span class="le-nm-objects le-nm-token-row">${tokenRow(1)}</span></button>
              <button type="button" class="le-nm-group-pick" data-side="many"><span class="le-nm-objects le-nm-token-row">${tokenRow(randInt(3, 5))}</span></button>
            </div>`;
          const answer = many ? "many" : "one";
          stageEl.querySelectorAll(".le-nm-group-pick").forEach((btn) => {
            btn.addEventListener("click", () => {
              if (locked) return;
              if (btn.getAttribute("data-side") === answer) onCorrect();
              else onWrong();
            });
          });
          return;
        }

        if (type === "none_zero") {
          promptEl.textContent = "Which plate has none?";
          say("Which plate has none?");
          stageEl.innerHTML = `
            <div class="le-nm-compare">
              <button type="button" class="le-nm-group-pick" data-side="some"><span class="le-nm-objects le-nm-token-row">${tokenRow(randInt(1, 3))}</span></button>
              <button type="button" class="le-nm-group-pick" data-side="none"><span class="le-nm-empty">Empty</span></button>
            </div>`;
          stageEl.querySelectorAll(".le-nm-group-pick").forEach((btn) => {
            btn.addEventListener("click", () => {
              if (locked) return;
              if (btn.getAttribute("data-side") === "none") onCorrect();
              else onWrong();
            });
          });
          return;
        }

        if (type === "all_some") {
          const askAll = Math.random() > 0.5;
          promptEl.textContent = askAll ? "Tap ALL the stars" : "Tap SOME (not all)";
          say(promptEl.textContent);
          const total = 4;
          let selected = 0;
          stageEl.innerHTML = `<div class="le-nm-objects le-nm-token-row" id="leAllSome">${tokenRow(total, "star")}</div>`;
          stageEl.querySelectorAll(".le-nm-token").forEach((node) => {
            node.classList.add("is-tappable");
            node.addEventListener("click", () => {
              if (locked) return;
              if (!node.classList.contains("is-tapped")) {
                node.classList.add("is-tapped");
                selected++;
                snd.pop();
              }
            });
          });
          const doneBtn = document.createElement("button");
          doneBtn.type = "button";
          doneBtn.className = "le-nm-choice le-nm-done";
          doneBtn.textContent = "Done";
          doneBtn.addEventListener("click", () => {
            if (locked) return;
            if (askAll && selected === total) onCorrect();
            else if (!askAll && selected > 0 && selected < total) onCorrect();
            else onWrong("Try again!");
          });
          choicesEl.appendChild(doneBtn);
          return;
        }

        if (type === "part_whole") {
          const whole = randInt(3, Math.min(max, 5));
          const part = randInt(1, whole - 1);
          const kind = pickToken();
          promptEl.textContent = "How many are in the WHOLE group?";
          say("How many in the whole group?");
          stageEl.innerHTML = `
            <div class="le-nm-part-whole">
              <div class="le-nm-group-view"><p>Part</p><span class="le-nm-objects le-nm-token-row">${tokenRow(part, kind)}</span></div>
              <div class="le-nm-group-view is-whole"><p>Whole</p><span class="le-nm-objects le-nm-token-row">${tokenRow(whole, kind)}</span></div>
            </div>`;
          renderChoices(uniqueNums(whole, max, 3).map(v => ({ label: v, value: v })), whole);
          return;
        }

        if (type === "number_memory") {
          const n = randInt(1, Math.min(max, 9));
          promptEl.textContent = "Remember this number!";
          say("Remember this number");
          stageEl.innerHTML = `<div class="le-nm-big-num" id="leMemNum">${n}</div>`;
          setTimeout(() => {
            if (api.getCurrent && api.getCurrent() !== "leMathPlay") return;
            stageEl.innerHTML = `<div class="le-nm-prompt-soft">Which number did you see?</div>`;
            renderChoices(uniqueNums(n, max, 3).map(v => ({ label: v, value: v })), n);
          }, 1200);
          return;
        }

        // fallback
        promptEl.textContent = "Find number 1";
        say("Find number one");
        stageEl.innerHTML = `<div class="le-nm-big-num">1</div>`;
        renderChoices([{ label: 1, value: 1 }, { label: 2, value: 2 }, { label: 3, value: 3 }], 1);
      }

      function nextRound() {
        round++;
        if (round >= ROUNDS) finish();
        else buildRound();
      }

      buildRound();
    };

    VIEWS.leMathResult = function (payload) {
      const cat = payload && payload.cat;
      const sub = payload && payload.sub;
      const stars = (payload && payload.stars) || 1;
      const score = (payload && payload.score) || 0;
      const rounds = (payload && payload.rounds) || 1;
      titleEl.textContent = "Well done!";
      const page = el("div", "le-nm-result");
      page.innerHTML = `
        <div class="le-nm-result-card">
          <p class="le-nm-kicker">${escapeHtml((cat && cat.title) || "Numbers & Math")}</p>
          <h2>${escapeHtml((sub && sub.title) || "Activity complete")}</h2>
          <div class="le-nm-result-stars">${"⭐".repeat(stars)}</div>
          <p>You got ${score} of ${rounds}!</p>
          <div class="le-nm-result-actions">
            <button type="button" class="le-nm-choice le-nm-done" id="leNmAgain">Play again</button>
            <button type="button" class="le-nm-choice" id="leNmBackCat">More in this category</button>
            <button type="button" class="le-nm-choice" id="leNmBackHub">All math categories</button>
          </div>
        </div>`;
      api.screenRoot.appendChild(page);
      snd.fanfare();
      speak("Well done!");
      confetti(16);
      page.querySelector("#leNmAgain").addEventListener("click", () => { snd.pop(); go("leMathPlay", { cat, sub }); });
      page.querySelector("#leNmBackCat").addEventListener("click", () => { snd.pop(); go("leMathCat", cat); });
      page.querySelector("#leNmBackHub").addEventListener("click", () => { snd.pop(); go("leNumbersMath"); });
    };

    function uniqueNums(answer, max, count) {
      return uniqueNumsNear(answer, 1, Math.max(max, answer), count);
    }

    function uniqueNumsInRange(answer, min, max, count) {
      const set = new Set([answer]);
      let guard = 0;
      while (set.size < count && guard < 40) {
        set.add(randInt(min, max));
        guard++;
      }
      return Array.from(set);
    }

    /** Nearby distractors so teens/twenties aren't mixed with tiny numbers. */
    function uniqueNumsNear(answer, min, max, count) {
      const lo = Math.min(min, max);
      const hi = Math.max(min, max);
      const set = new Set([answer]);
      let delta = 1;
      while (set.size < count && delta <= 30) {
        if (answer - delta >= lo) set.add(answer - delta);
        if (set.size >= count) break;
        if (answer + delta <= hi) set.add(answer + delta);
        delta++;
      }
      // Fallback fill if band is tiny
      let guard = 0;
      while (set.size < count && guard < 40) {
        set.add(randInt(lo, hi));
        guard++;
      }
      return Array.from(set);
    }

    function numberWord(n) {
      return NUMBER_NAMES[n] || String(n);
    }

    return { CURRICULUM };
  };
})();
