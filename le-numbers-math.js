/* ============================================================
   LumaCubs — Little Explorers Numbers & Math (ages 2–4)
   Registered into the main game engine via LUMACUBS_REGISTER_LE_MATH
   ============================================================ */
(function () {
  "use strict";

  const ART = "assets/home/little-explorers/numbers-math/categories/";
  const FALLBACK = "assets/segments/numbers-math/illustrations/_fallback.svg";

  const OBJECTS = ["🍎", "⭐", "🔵", "🟡", "🟢", "🧸", "🎈", "🍓", "🍊", "🍩"];

  const CURRICULUM = [
    {
      id: "number_recognition",
      title: "Number Recognition",
      blurb: "Spot and name friendly numbers!",
      tone: "peach",
      accent: "#FFD8C2",
      art: ART + "number_recognition.jpg",
      subs: [
        { id: "nr_1_5", title: "Recognize numbers 1–5", level: "A", type: "pick_number", max: 5 },
        { id: "nr_1_10", title: "Recognize numbers 1–10", level: "B", type: "pick_number", max: 10 },
        { id: "nr_pic_match", title: "Number and picture matching", level: "A", type: "match_qty", max: 5 },
        { id: "nr_identify", title: "Identify the correct number", level: "B", type: "pick_number", max: 10 },
        { id: "nr_find", title: "Find the number", level: "A", type: "find_number", max: 5 },
        { id: "nr_names", title: "Number names (basic exposure)", level: "B", type: "number_names", max: 10 },
      ],
    },
    {
      id: "counting_quantity",
      title: "Counting & Quantity",
      blurb: "Count toys, fruits, and fun things!",
      tone: "mint",
      accent: "#C8F0E0",
      art: ART + "counting_quantity.jpg",
      subs: [
        { id: "cq_1_5", title: "Count 1–5 objects", level: "A", type: "count_objects", max: 5 },
        { id: "cq_1_10", title: "Count 1–10 objects", level: "B", type: "count_objects", max: 10 },
        { id: "cq_familiar", title: "Count familiar objects", level: "A", type: "count_objects", max: 5 },
        { id: "cq_match", title: "Match number with quantity", level: "B", type: "match_qty", max: 10 },
        { id: "cq_pictures", title: "Count objects in pictures", level: "B", type: "count_objects", max: 8 },
        { id: "cq_one_to_one", title: "One-to-one counting", level: "A", type: "tap_count", max: 5 },
      ],
    },
    {
      id: "number_tracing",
      title: "Number Tracing",
      blurb: "Trace soft number shapes!",
      tone: "sky",
      accent: "#A8D4F0",
      art: ART + "number_tracing.jpg",
      subs: [
        { id: "nt_1_5", title: "Trace numbers 1–5", level: "A", type: "trace", max: 5 },
        { id: "nt_1_10", title: "Trace numbers 1–10", level: "B", type: "trace", max: 10 },
        { id: "nt_follow", title: "Follow number shapes", level: "A", type: "trace", max: 5 },
        { id: "nt_formation", title: "Number formation practice", level: "B", type: "trace", max: 10 },
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
      blurb: "What number comes next?",
      tone: "aqua",
      accent: "#BFDFF2",
      art: ART + "number_sequencing.jpg",
      subs: [
        { id: "ns_1_5", title: "Arrange numbers 1–5", level: "A", type: "arrange", max: 5 },
        { id: "ns_1_10", title: "Arrange numbers 1–10", level: "B", type: "arrange", max: 10 },
        { id: "ns_forward", title: "Forward number sequence", level: "A", type: "next_number", max: 5 },
        { id: "ns_next", title: "Identify the next number", level: "B", type: "next_number", max: 10 },
        { id: "ns_before_after", title: "Before and after (basic introduction)", level: "B", type: "before_after", max: 10 },
      ],
    },
    {
      id: "missing_numbers_patterns",
      title: "Missing Numbers & Patterns",
      blurb: "Find what is missing!",
      tone: "violet",
      accent: "#D5C8F5",
      art: ART + "missing_numbers_patterns.jpg",
      subs: [
        { id: "mp_miss_5", title: "Find missing numbers 1–5", level: "A", type: "missing", max: 5 },
        { id: "mp_miss_10", title: "Find missing numbers 1–10", level: "B", type: "missing", max: 10 },
        { id: "mp_complete", title: "Complete simple number sequences", level: "B", type: "missing", max: 10 },
        { id: "mp_comes_next", title: "Identify what comes next", level: "A", type: "next_number", max: 5 },
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

  function objectRow(n, emoji) {
    const e = emoji || pickObject();
    return Array.from({ length: n }, () => `<span class="le-nm-obj" aria-hidden="true">${e}</span>`).join("");
  }

  window.LUMACUBS_REGISTER_LE_MATH = function registerLEMath(api) {
    const {
      VIEWS, go, el, snd, speak, toast, confetti, LS, escapeHtml, trackPlatformProgress,
      titleEl, setAgeHubReturn, setLeMathCatReturn,
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
      setAgeHubReturn("littleExplorers");
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

      wrap.appendChild(el("div", "home-section-label", `
        <h3>Subcategories</h3>
        <p>Level A (2–3) and Level B (3–4) · tap to play</p>`));

      const ul = el("div", "subcat-list");
      cat.subs.forEach((sub, i) => {
        const done = starsFor(sub.id);
        const item = el("button", "subcat-item tone-" + (i % 4) + (done ? " is-done" : ""), `
          <strong>${escapeHtml(sub.title)}</strong>
          <span>${sub.level === "A" ? "Level A · Early Explorers" : "Level B · Growing Explorers"}</span>
          <em class="subcat-soon">${done ? ("⭐".repeat(Math.min(3, done)) + " done") : "Tap to play"}</em>
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

      const ROUNDS = sub.level === "A" ? 4 : 5;
      let round = 0;
      let score = 0;
      let locked = false;

      const page = el("div", "le-nm-play");
      page.innerHTML = `
        <div class="le-nm-play-top">
          <span class="le-nm-play-cat">${escapeHtml(cat.title)}</span>
          <span class="le-nm-play-round" id="leNmRound">1 / ${ROUNDS}</span>
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
      }

      function finish() {
        const stars = score >= ROUNDS ? 3 : score >= Math.ceil(ROUNDS * 0.6) ? 2 : 1;
        markDone(sub.id, stars);
        go("leMathResult", { cat, sub, score, rounds: ROUNDS, stars });
      }

      function onCorrect() {
        score++;
        snd.correct();
        confetti(8);
        setFeedback("Great job!", true);
        speak("Great job!");
        locked = true;
        setTimeout(nextRound, 700);
      }

      function onWrong(hint) {
        snd.wrong();
        setFeedback(hint || "Try again!", false);
        speak(hint || "Try again");
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
            if (val === answer) onCorrect();
            else onWrong();
            if (onPick) onPick(val === answer);
          });
          choicesEl.appendChild(b);
        });
      }

      function buildRound() {
        clearBoard();
        roundEl.textContent = (round + 1) + " / " + ROUNDS;
        const max = sub.max || 5;
        const type = sub.type;
        const emoji = pickObject();

        if (type === "pick_number" || type === "find_number" || type === "number_names") {
          const n = randInt(1, max);
          promptEl.textContent = type === "number_names" ? ("Tap the number " + numberWord(n)) : ("Find number " + n);
          speak(promptEl.textContent);
          stageEl.innerHTML = `<div class="le-nm-big-num">${n}</div>`;
          if (type === "find_number") {
            stageEl.innerHTML = `<div class="le-nm-prompt-soft">Which one is <b>${n}</b>?</div>`;
          }
          const opts = shuffle(uniqueNums(n, max, 3)).map(v => ({ label: v, value: v }));
          renderChoices(opts, n);
          return;
        }

        if (type === "count_objects" || type === "tap_count") {
          const n = randInt(1, Math.min(max, type === "tap_count" ? 5 : max));
          promptEl.textContent = "How many do you see?";
          speak("How many?");
          if (type === "tap_count") {
            let tapped = 0;
            stageEl.innerHTML = `<div class="le-nm-objects" id="leTapObjs">${objectRow(n, emoji)}</div>
              <p class="le-nm-tap-hint">Tap each one · <span id="leTapCount">0</span>/${n}</p>`;
            const counter = stageEl.querySelector("#leTapCount");
            stageEl.querySelectorAll(".le-nm-obj").forEach((node) => {
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
            stageEl.innerHTML = `<div class="le-nm-objects">${objectRow(n, emoji)}</div>`;
            renderChoices(uniqueNums(n, max, 3).map(v => ({ label: v, value: v })), n);
          }
          return;
        }

        if (type === "match_qty") {
          const n = randInt(1, Math.min(max, 8));
          promptEl.textContent = "Match the number to the group";
          speak("Match the number");
          stageEl.innerHTML = `<div class="le-nm-objects">${objectRow(n, emoji)}</div>`;
          renderChoices(uniqueNums(n, max, 3).map(v => ({ label: v, value: v })), n);
          return;
        }

        if (type === "more_less") {
          let a = randInt(1, Math.min(max, 8));
          let b = randInt(1, Math.min(max, 8));
          while (a === b) b = randInt(1, Math.min(max, 8));
          const askMore = Math.random() > 0.35;
          promptEl.textContent = askMore ? "Which group has more?" : "Which group has less?";
          speak(promptEl.textContent);
          stageEl.innerHTML = `
            <div class="le-nm-compare">
              <button type="button" class="le-nm-group-pick" data-side="a"><span class="le-nm-objects">${objectRow(a, emoji)}</span></button>
              <button type="button" class="le-nm-group-pick" data-side="b"><span class="le-nm-objects">${objectRow(b, pickObject())}</span></button>
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
          speak(promptEl.textContent);
          stageEl.innerHTML = `
            <div class="le-nm-compare">
              <div class="le-nm-group-view"><span class="le-nm-objects">${objectRow(n, emoji)}</span></div>
              <div class="le-nm-group-view"><span class="le-nm-objects">${objectRow(other, pickObject())}</span></div>
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
          promptEl.textContent = "How many altogether?";
          speak("How many altogether?");
          stageEl.innerHTML = `
            <div class="le-nm-add">
              <div class="le-nm-group-view"><span class="le-nm-objects">${objectRow(a, emoji)}</span></div>
              <span class="le-nm-plus">＋</span>
              <div class="le-nm-group-view"><span class="le-nm-objects">${objectRow(b, pickObject())}</span></div>
            </div>`;
          renderChoices(uniqueNums(sum, sumMax, 3).map(v => ({ label: v, value: v })), sum);
          return;
        }

        if (type === "make_group") {
          const target = sub.target || 2;
          promptEl.textContent = "Make a group of " + target;
          speak("Make a group of " + target);
          let selected = 0;
          const pool = target + 2;
          stageEl.innerHTML = `<div class="le-nm-objects" id="leMakePool">${objectRow(pool, emoji)}</div>
            <p class="le-nm-tap-hint">Selected: <span id="leMakeCount">0</span> / ${target}</p>`;
          const counter = stageEl.querySelector("#leMakeCount");
          stageEl.querySelectorAll(".le-nm-obj").forEach((node) => {
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
          const n = randInt(1, Math.max(2, max - 1));
          if (type === "before_after" && Math.random() > 0.5 && n > 1) {
            promptEl.textContent = "What comes before " + n + "?";
            speak(promptEl.textContent);
            renderChoices(uniqueNums(n - 1, max, 3).map(v => ({ label: v, value: v })), n - 1);
            stageEl.innerHTML = `<div class="le-nm-big-num">? → ${n}</div>`;
          } else {
            promptEl.textContent = "What comes after " + n + "?";
            speak(promptEl.textContent);
            stageEl.innerHTML = `<div class="le-nm-big-num">${n} → ?</div>`;
            renderChoices(uniqueNums(n + 1, max, 3).map(v => ({ label: v, value: v })), n + 1);
          }
          return;
        }

        if (type === "missing") {
          const end = Math.min(max, randInt(4, max));
          const miss = randInt(2, end - 1);
          const seq = [];
          for (let i = 1; i <= end; i++) seq.push(i === miss ? "?" : String(i));
          promptEl.textContent = "Which number is missing?";
          speak("Which number is missing?");
          stageEl.innerHTML = `<div class="le-nm-seq">${seq.map(s => `<span class="le-nm-seq-item${s === "?" ? " miss" : ""}">${s}</span>`).join("")}</div>`;
          renderChoices(uniqueNums(miss, max, 3).map(v => ({ label: v, value: v })), miss);
          return;
        }

        if (type === "arrange") {
          const end = Math.min(max, sub.level === "A" ? 5 : 6);
          const nums = shuffle(Array.from({ length: end }, (_, i) => i + 1));
          let nextExpect = 1;
          promptEl.textContent = "Tap numbers in order";
          speak("Tap numbers in order");
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
          promptEl.textContent = "What comes next in the pattern?";
          speak("What comes next?");
          stageEl.innerHTML = `<div class="le-nm-pattern">
            <span class="le-nm-objects">${objectRow(base, emoji)}</span>
            <span class="le-nm-objects">${objectRow(base, emoji)}</span>
            <span class="le-nm-objects">${objectRow(base, emoji)}</span>
            <span class="le-nm-seq-item miss">?</span>
          </div>`;
          renderChoices(uniqueNums(base, 5, 3).map(v => ({ label: v, value: v })), base);
          return;
        }

        if (type === "one_many") {
          const many = Math.random() > 0.5;
          promptEl.textContent = many ? "Tap the MANY group" : "Tap the ONE";
          speak(promptEl.textContent);
          stageEl.innerHTML = `
            <div class="le-nm-compare">
              <button type="button" class="le-nm-group-pick" data-side="one"><span class="le-nm-objects">${objectRow(1, emoji)}</span></button>
              <button type="button" class="le-nm-group-pick" data-side="many"><span class="le-nm-objects">${objectRow(randInt(3, 5), pickObject())}</span></button>
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
          speak("Which plate has none?");
          stageEl.innerHTML = `
            <div class="le-nm-compare">
              <button type="button" class="le-nm-group-pick" data-side="some"><span class="le-nm-objects">${objectRow(randInt(1, 3), emoji)}</span></button>
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
          speak(promptEl.textContent);
          const total = 4;
          let selected = 0;
          stageEl.innerHTML = `<div class="le-nm-objects" id="leAllSome">${objectRow(total, "⭐")}</div>`;
          stageEl.querySelectorAll(".le-nm-obj").forEach((node) => {
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
          promptEl.textContent = "How many are in the WHOLE group?";
          speak("How many in the whole group?");
          stageEl.innerHTML = `
            <div class="le-nm-part-whole">
              <div class="le-nm-group-view"><p>Part</p><span class="le-nm-objects">${objectRow(part, emoji)}</span></div>
              <div class="le-nm-group-view is-whole"><p>Whole</p><span class="le-nm-objects">${objectRow(whole, emoji)}</span></div>
            </div>`;
          renderChoices(uniqueNums(whole, max, 3).map(v => ({ label: v, value: v })), whole);
          return;
        }

        if (type === "trace") {
          const n = randInt(1, Math.min(max, 10));
          promptEl.textContent = "Trace number " + n + " with your finger";
          speak("Trace number " + n);
          stageEl.innerHTML = `
            <div class="le-nm-trace-wrap">
              <div class="le-nm-trace-ghost">${n}</div>
              <canvas class="le-nm-trace-canvas" id="leTrace" width="320" height="240"></canvas>
            </div>
            <p class="le-nm-tap-hint">Draw on the number, then tap Done</p>`;
          const canvas = stageEl.querySelector("#leTrace");
          const ctx = canvas.getContext("2d");
          ctx.lineWidth = 10;
          ctx.lineCap = "round";
          ctx.strokeStyle = "#7E5FB0";
          let drawing = false;
          let ink = 0;
          const pos = (e) => {
            const r = canvas.getBoundingClientRect();
            const src = e.touches ? e.touches[0] : e;
            return { x: (src.clientX - r.left) * (canvas.width / r.width), y: (src.clientY - r.top) * (canvas.height / r.height) };
          };
          const start = (e) => { e.preventDefault(); drawing = true; const p = pos(e); ctx.beginPath(); ctx.moveTo(p.x, p.y); };
          const move = (e) => {
            if (!drawing) return;
            e.preventDefault();
            const p = pos(e);
            ctx.lineTo(p.x, p.y);
            ctx.stroke();
            ink++;
          };
          const end = () => { drawing = false; };
          canvas.addEventListener("mousedown", start);
          canvas.addEventListener("mousemove", move);
          canvas.addEventListener("mouseup", end);
          canvas.addEventListener("mouseleave", end);
          canvas.addEventListener("touchstart", start, { passive: false });
          canvas.addEventListener("touchmove", move, { passive: false });
          canvas.addEventListener("touchend", end);
          const doneBtn = document.createElement("button");
          doneBtn.type = "button";
          doneBtn.className = "le-nm-choice le-nm-done";
          doneBtn.textContent = "Done";
          doneBtn.addEventListener("click", () => {
            if (locked) return;
            if (ink > 12) onCorrect();
            else onWrong("Draw a little more!");
          });
          choicesEl.appendChild(doneBtn);
          return;
        }

        if (type === "number_memory") {
          const n = randInt(1, Math.min(max, 9));
          promptEl.textContent = "Remember this number!";
          speak("Remember this number");
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
      const set = new Set([answer]);
      while (set.size < count) set.add(randInt(1, Math.max(max, answer)));
      return Array.from(set);
    }

    function numberWord(n) {
      return ["zero","one","two","three","four","five","six","seven","eight","nine","ten",
        "eleven","twelve","thirteen","fourteen","fifteen","sixteen","seventeen","eighteen","nineteen","twenty"][n] || String(n);
    }

    return { CURRICULUM };
  };
})();
