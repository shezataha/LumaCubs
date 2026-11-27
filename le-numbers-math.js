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
      title: "Quantity & Comparison",
      blurb: "Compare quantities in playful real-life scenes!",
      tone: "lilac",
      accent: "#DCC8F5",
      art: ART + "basic_number_comparison.jpg",
      subs: [
        { id: "qc_toys", title: "Toy Shop Challenge", level: "A", type: "qc_toys", min: 1, max: 8, art: SUB_ART + "qc_toys.jpg" },
        { id: "qc_parking", title: "Parking Lot Numbers", level: "A", type: "qc_parking", min: 2, max: 10, art: SUB_ART + "qc_parking.jpg" },
        { id: "qc_picnic", title: "Picnic Preparation", level: "A", type: "qc_picnic", min: 1, max: 8, art: SUB_ART + "qc_picnic.jpg" },
        { id: "qc_g_seeds", title: "Plant the Seeds", level: "A", type: "qc_g_seeds", min: 1, max: 6, art: SUB_ART + "qc_garden.jpg" },
        { id: "qc_g_water", title: "Water the Garden", level: "A", type: "qc_g_water", min: 2, max: 8, art: SUB_ART + "qc_garden.jpg" },
        { id: "qc_g_harvest", title: "Harvest Time", level: "A", type: "qc_g_harvest", min: 1, max: 8, art: SUB_ART + "qc_garden.jpg" },
        { id: "qc_g_visitors", title: "Garden Visitors", level: "B", type: "qc_g_visitors", min: 2, max: 10, art: SUB_ART + "qc_garden.jpg" },
        { id: "qc_g_arrange", title: "Garden Arrangement", level: "B", type: "qc_g_arrange", min: 2, max: 10, art: SUB_ART + "qc_garden.jpg" },
        { id: "qc_g_grow", title: "Watch It Grow", level: "B", type: "qc_g_grow", min: 2, max: 8, art: SUB_ART + "qc_garden.jpg" },
        { id: "qc_aquarium", title: "Aquarium Inspector", level: "B", type: "qc_aquarium", min: 3, max: 20, art: SUB_ART + "qc_aquarium.jpg" },
        { id: "qc_party", title: "Birthday Party Planner", level: "B", type: "qc_party", min: 2, max: 12, art: SUB_ART + "qc_party.jpg" },
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
        { id: "ia_together", title: "Bring Them Together", level: "A", type: "ia_together", min: 1, max: 5, art: SUB_ART + "ia_together.svg" },
        { id: "ia_one_more", title: "Add One More", level: "A", type: "ia_one_more", min: 1, max: 5, art: SUB_ART + "ia_one_more.svg" },
        { id: "ia_train", title: "Addition Train", level: "A", type: "ia_train", min: 1, max: 6, art: SUB_ART + "ia_train.svg" },
        { id: "ia_magic", title: "Magic Number Show", level: "B", type: "ia_magic", min: 1, max: 8, art: SUB_ART + "ia_magic.svg" },
        { id: "ia_story", title: "Addition Story Adventures", level: "B", type: "ia_story", min: 1, max: 8, art: SUB_ART + "ia_story.svg" },
        { id: "ia_build", title: "Build the Addition", level: "B", type: "ia_build", min: 1, max: 10, art: SUB_ART + "ia_build.svg" },
      ],
    },
    {
      id: "sorting_grouping",
      title: "Sorting & Grouping",
      blurb: "Sort, group and discover what belongs together!",
      tone: "coral",
      accent: "#FFD8C8",
      art: ART + "sorting_grouping.jpg",
      subs: [
        { id: "sg_colour_factory", title: "Rainbow Colour Factory", level: "A", type: "sg_colour", blurb: "Send each object to its colour machine!", art: SUB_ART + "sg_colour_factory.svg" },
        { id: "sg_shape_city", title: "Shape City Builder", level: "A", type: "sg_shape", blurb: "Build a city with matching shapes!", art: SUB_ART + "sg_shape_city.svg" },
        { id: "sg_habitats", title: "Animal Habitat Adventure", level: "A", type: "sg_habitat", blurb: "Guide animals to their homes!", art: SUB_ART + "sg_habitats.svg" },
        { id: "sg_size_safari", title: "Size Sorting Safari", level: "A", type: "sg_size", blurb: "Organize small, medium and large!", art: SUB_ART + "sg_size_safari.svg" },
        { id: "sg_room_organize", title: "Everyday Objects Organizer", level: "B", type: "sg_room", blurb: "Tidy the room by purpose!", art: SUB_ART + "sg_room_organize.svg" },
        { id: "sg_garden_group", title: "Nature's Grouping Garden", level: "B", type: "sg_garden", blurb: "Group flowers, fruits and veggies!", art: SUB_ART + "sg_garden_group.svg" },
        { id: "sg_belong", title: "Who Belongs Together?", level: "B", type: "sg_belong", blurb: "Find objects that belong in a set!", art: SUB_ART + "sg_belong.svg" },
        { id: "sg_odd_one", title: "The Odd One Out Mystery", level: "B", type: "sg_odd", blurb: "Spot what doesn't belong!", art: SUB_ART + "sg_odd_one.svg" },
      ],
    },
    {
      id: "number_sequencing",
      title: "Number Order & Sequences",
      blurb: "Journey through numbers, find missing spots, climb and crack patterns!",
      tone: "aqua",
      accent: "#BFDFF2",
      art: ART + "number_sequencing.jpg",
      subs: [
        { id: "ns_journey_1_10", title: "Number Journey 1–10", level: "A", type: "ns_train", min: 1, max: 10, blurb: "Build the magical number train!", art: SUB_ART + "ns_journey_1_10.jpg" },
        { id: "ns_journey_11_20", title: "Number Journey 11–20", level: "A", type: "ns_balloons", min: 11, max: 20, blurb: "Order the sky balloons!", art: SUB_ART + "ns_journey_11_20.jpg" },
        { id: "ns_journey_21_30", title: "Number Journey 21–30", level: "B", type: "ns_ocean", min: 21, max: 30, blurb: "Collect ocean treasure numbers!", art: SUB_ART + "ns_journey_21_30.jpg" },
        { id: "ns_missing_mystery", title: "Missing Number Mystery", level: "A", type: "ns_mystery", min: 1, max: 20, blurb: "Solve the clue board mysteries!", art: SUB_ART + "ns_missing_mystery.jpg" },
        { id: "ns_neighbours", title: "Before, Between & After", level: "A", type: "ns_neighbours", min: 1, max: 20, blurb: "Find number neighbours in the village!", art: SUB_ART + "ns_neighbours.jpg" },
        { id: "ns_asc_desc", title: "Ascending & Descending Adventure", level: "B", type: "ns_mountain", min: 1, max: 20, blurb: "Climb up and slide down with numbers!", art: SUB_ART + "ns_asc_desc.jpg" },
        { id: "ns_pattern_detective", title: "Number Pattern Detective", level: "B", type: "ns_pattern", min: 1, max: 30, blurb: "Crack the pattern laboratory!", art: SUB_ART + "ns_pattern_detective.jpg" },
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
            : (cat.id === "basic_number_comparison"
              ? (cat.subs.length + " unique quantity adventures · tap to play")
              : (cat.id === "sorting_grouping"
                ? "8 unique sorting & grouping mini-games · tap to play"
                : (cat.id === "number_sequencing"
                  ? "7 unique number order adventures · tap to play"
                  : "Level A (2–3) and Level B (3–4) · tap to play")))));
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
            <span>${sub.blurb ? escapeHtml(sub.blurb) : (sub.level === "A" ? "Level A · Early Explorers" : "Level B · Growing Explorers")}</span>
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
      const isSorting = /^sg_/.test(sub.type);
      const isNumberSeq = /^ns_/.test(sub.type);
      const ROUNDS = isExploreOnly ? 1 : (isMemory ? 4 : ((isSorting || isNumberSeq) ? (sub.level === "A" ? 4 : 5) : (sub.level === "A" ? 4 : 5)));
      let round = 0;
      let score = 0;
      let locked = false;
      let lastSpeak = "";
      let wrongTries = 0;
      let exploreSeen = new Set();

      if ((isSorting || isNumberSeq) && typeof trackPlatformProgress === "function") {
        trackPlatformProgress("le.numbers_math." + sub.id, "started");
      }

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
       * Shared SVG+canvas tracer for Number Writing & Tracing.
       * Built like the working countTrace in game.js, with LE modes.
       * CRITICAL: never auto-finish during pointermove — that cut strokes in half.
       */
      function buildNumberTraceRound(mode) {
        const min = sub.min || 1;
        const max = sub.max || 10;
        const n = pickTraceNumber(min, max);
        const def = getTraceDef(n);
        const VB = { w: 220, h: 280 };
        const PASS = mode === "nt_freehand" ? 0.45 : (mode === "nt_complete" ? 0.62 : 0.65);
        const HIT_R = 58;
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
          <div class="le-nm-nt" id="leNtRoot">
            <div class="le-nm-nt-actions" id="leNtActions"></div>
            <p class="le-nm-tap-hint" id="leNtTip">${escapeHtml(def.tip || "Follow the dotted path")}</p>
            <div class="le-nm-nt-board" id="leNtBoard">
              <svg class="le-nm-nt-svg" id="leNtSvg" viewBox="0 0 ${VB.w} ${VB.h}" preserveAspectRatio="xMidYMid meet" aria-hidden="true"></svg>
              <canvas class="le-nm-nt-canvas" id="leNtCanvas" width="320" height="400"></canvas>
            </div>
            <div class="le-nm-nt-progress">
              <div class="le-nm-nt-bar"><span id="leNtFill"></span></div>
              <span id="leNtPct">0%</span>
            </div>
          </div>`;

        const root = stageEl.querySelector("#leNtRoot");
        const board = stageEl.querySelector("#leNtBoard");
        const svg = stageEl.querySelector("#leNtSvg");
        const canvas = stageEl.querySelector("#leNtCanvas");
        const fillEl = stageEl.querySelector("#leNtFill");
        const pctEl = stageEl.querySelector("#leNtPct");
        const actions = stageEl.querySelector("#leNtActions");
        const tipEl = stageEl.querySelector("#leNtTip");
        const ctx = canvas.getContext("2d");
        const svgNS = "http://www.w3.org/2000/svg";
        const pageEl = stageEl.closest(".le-nm-play") || document.body;

        let hitPoints = [];
        let hitCount = 0;
        let drawing = false;
        let lastCanvasPt = null;
        let lastVb = null;
        let ink = 0;
        let completed = false;
        let demoTimer = null;
        let completeStart = null;
        let activePointerId = null;
        let offPathTicks = 0;

        function setupStrokeStyle(cssW) {
          const dpr = Math.min(window.devicePixelRatio || 1, 2);
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          ctx.strokeStyle = "#7E5FB0";
          ctx.lineWidth = Math.max(16, cssW * 0.055);
        }

        function layoutMetrics() {
          const rect = board.getBoundingClientRect();
          const bw = board.clientWidth || rect.width;
          const bh = board.clientHeight || rect.height;
          const borderX = (rect.width - bw) / 2;
          const borderY = (rect.height - bh) / 2;
          const scale = Math.min(bw / VB.w, bh / VB.h) || 1;
          const ox = (bw - VB.w * scale) / 2;
          const oy = (bh - VB.h * scale) / 2;
          return { rect, bw, bh, borderX, borderY, scale, ox, oy };
        }

        function resizeCanvas(clear) {
          const wrapW = (root.clientWidth || stageEl.clientWidth || 320);
          let outerW = Math.max(220, Math.min(300, Math.floor(wrapW)));
          let outerH = Math.floor(outerW * (VB.h / VB.w));
          const maxH = Math.floor(Math.min(window.innerHeight * 0.48, 340));
          if (outerH > maxH) {
            outerH = maxH;
            outerW = Math.floor(outerH * (VB.w / VB.h));
          }
          board.style.width = outerW + "px";
          board.style.height = outerH + "px";

          const cw = board.clientWidth || outerW;
          const ch = board.clientHeight || outerH;
          const dpr = Math.min(window.devicePixelRatio || 1, 2);
          canvas.width = Math.max(1, Math.floor(cw * dpr));
          canvas.height = Math.max(1, Math.floor(ch * dpr));
          canvas.style.width = cw + "px";
          canvas.style.height = ch + "px";
          setupStrokeStyle(cw);
          if (clear) ctx.clearRect(0, 0, cw, ch);
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

        function eventClient(e) {
          if (e.touches && e.touches[0]) return e.touches[0];
          if (e.changedTouches && e.changedTouches[0]) return e.changedTouches[0];
          return e;
        }

        function samplePath(pathEl, step, digitIdx) {
          let len = 0;
          try { len = pathEl.getTotalLength(); } catch (err) { return []; }
          if (!len || !isFinite(len)) return [];
          const pts = [];
          const count = Math.max(24, Math.ceil(len / step));
          for (let i = 0; i <= count; i++) {
            const p = pathEl.getPointAtLength((len * i) / count);
            pts.push({ x: p.x, y: p.y, hit: false, digit: digitIdx == null ? 0 : digitIdx });
          }
          return pts;
        }

        function addStartDot(pt, labelText) {
          if (!pt || mode === "nt_freehand") return;
          const g = document.createElementNS(svgNS, "g");
          g.setAttribute("class", "le-nm-nt-start-g");
          const dot = document.createElementNS(svgNS, "circle");
          dot.setAttribute("cx", pt.x);
          dot.setAttribute("cy", pt.y);
          dot.setAttribute("r", "12");
          dot.setAttribute("fill", "#FF8FAB");
          dot.setAttribute("class", "le-nm-nt-start");
          const label = document.createElementNS(svgNS, "text");
          label.setAttribute("x", pt.x);
          label.setAttribute("y", Math.max(18, pt.y - 18));
          label.setAttribute("text-anchor", "middle");
          label.setAttribute("fill", "#7E5FB0");
          label.setAttribute("font-size", "15");
          label.setAttribute("font-weight", "800");
          label.textContent = labelText || "Start";
          g.appendChild(dot);
          g.appendChild(label);
          svg.appendChild(g);
        }

        function drawGuides() {
          while (svg.firstChild) svg.removeChild(svg.firstChild);
          hitPoints = [];
          hitCount = 0;
          completeStart = null;
          const paths = def.paths || [];
          const pathDigits = def.pathDigits || paths.map((_, i) => (String(n).length > 1 && i >= Math.ceil(paths.length / 2) ? 1 : 0));
          const hideFrom = mode === "nt_complete"
            ? (paths.length <= 1 ? 1 : Math.ceil(paths.length / 2))
            : paths.length;

          paths.forEach((d, idx) => {
            const digitIdx = pathDigits[idx] != null ? pathDigits[idx] : 0;
            const path = document.createElementNS(svgNS, "path");
            path.setAttribute("d", d);
            path.setAttribute("fill", "none");
            path.setAttribute("stroke-linecap", "round");
            path.setAttribute("stroke-linejoin", "round");
            path.setAttribute("class", "le-nm-nt-guide");
            path.setAttribute("data-digit", String(digitIdx));
            if (mode === "nt_freehand") {
              path.setAttribute("stroke", "rgba(126,95,176,0.22)");
              path.setAttribute("stroke-width", "28");
            } else if (mode === "nt_complete" && idx >= hideFrom) {
              path.setAttribute("stroke", "rgba(126,95,176,0.3)");
              path.setAttribute("stroke-width", "16");
              path.setAttribute("stroke-dasharray", "6 12");
            } else if (mode === "nt_complete") {
              path.setAttribute("stroke", "rgba(126,95,176,0.62)");
              path.setAttribute("stroke-width", "18");
            } else {
              path.setAttribute("stroke", "rgba(126,95,176,0.5)");
              path.setAttribute("stroke-width", "18");
              path.setAttribute("stroke-dasharray", "3 16");
            }
            svg.appendChild(path);
            if (!(mode === "nt_complete" && idx < hideFrom && paths.length > 1)) {
              hitPoints = hitPoints.concat(samplePath(path, 5, digitIdx));
            }
          });

          if (mode === "nt_complete" && paths.length === 1) {
            const base = svg.querySelector("path");
            if (base) {
              let len = 0;
              try { len = base.getTotalLength(); } catch (err) { len = 0; }
              if (len > 0) {
                const half = len * 0.42;
                base.setAttribute("stroke", "rgba(126,95,176,0.3)");
                base.setAttribute("stroke-width", "16");
                base.setAttribute("stroke-dasharray", "6 12");
                const solid = document.createElementNS(svgNS, "path");
                solid.setAttribute("d", paths[0]);
                solid.setAttribute("fill", "none");
                solid.setAttribute("stroke", "rgba(126,95,176,0.62)");
                solid.setAttribute("stroke-width", "18");
                solid.setAttribute("stroke-linecap", "round");
                solid.setAttribute("stroke-dasharray", half + " " + (len + 40));
                svg.insertBefore(solid, base);
                hitPoints = [];
                const count = Math.max(18, Math.ceil((len - half) / 5));
                for (let i = 0; i <= count; i++) {
                  const p = base.getPointAtLength(half + ((len - half) * i) / count);
                  hitPoints.push({ x: p.x, y: p.y, hit: false, digit: 0 });
                }
                const gap = base.getPointAtLength(half);
                completeStart = { x: gap.x, y: gap.y };
              }
            }
          }

          addStartDot(completeStart || def.start, "Start");
          // For two-digit numbers, also show where the second digit begins
          if (mode !== "nt_freehand" && def.digitStarts && def.digitStarts[1] && !completeStart) {
            addStartDot(def.digitStarts[1], "Then");
          }
        }

        function updateProgress() {
          const total = hitPoints.length || 1;
          const pct = Math.min(100, Math.round((hitCount / total) * 100));
          fillEl.style.width = pct + "%";
          pctEl.textContent = pct + "%";
          return hitCount / total;
        }

        function clearInk(resetHits) {
          resizeCanvas(true);
          if (resetHits) {
            hitPoints.forEach((p) => { p.hit = false; });
            hitCount = 0;
            ink = 0;
            completed = false;
            offPathTicks = 0;
            updateProgress();
          }
        }

        function markHits(vx, vy) {
          let near = false;
          let gained = 0;
          const r2 = HIT_R * HIT_R;
          const twoDigit = String(n).length > 1;
          // Soft gate: finish most of digit 1 before digit 2 counts
          let allowDigit = 0;
          if (twoDigit) {
            const cov = digitCoverage();
            const first = cov[0];
            allowDigit = (first && first.total && first.hit / first.total >= 0.5) ? 1 : 0;
          }
          for (let i = 0; i < hitPoints.length; i++) {
            const p = hitPoints[i];
            if (p.hit) continue;
            if (twoDigit && (p.digit || 0) > allowDigit) continue;
            const dx = p.x - vx;
            const dy = p.y - vy;
            if ((dx * dx + dy * dy) <= r2) {
              p.hit = true;
              hitCount++;
              gained++;
              near = true;
            }
          }
          if (gained) updateProgress();
          return near;
        }

        function markSegment(v0, v1) {
          if (!v1) return false;
          if (!v0) return markHits(v1.x, v1.y);
          const dist = Math.hypot(v1.x - v0.x, v1.y - v0.y);
          const steps = Math.max(1, Math.ceil(dist / 3));
          let near = false;
          for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            if (markHits(v0.x + (v1.x - v0.x) * t, v0.y + (v1.y - v0.y) * t)) near = true;
          }
          return near;
        }

        function digitCoverage() {
          const map = {};
          hitPoints.forEach((p) => {
            const d = p.digit != null ? p.digit : 0;
            if (!map[d]) map[d] = { hit: 0, total: 0 };
            map[d].total++;
            if (p.hit) map[d].hit++;
          });
          return map;
        }

        function eachDigitDone(minRatio) {
          const cov = digitCoverage();
          const keys = Object.keys(cov);
          if (!keys.length) return false;
          return keys.every((k) => cov[k].total > 0 && (cov[k].hit / cov[k].total) >= minRatio);
        }

        function endCovered() {
          if (hitPoints.length < 8) return hitPoints.filter((p) => p.hit).length >= Math.ceil(hitPoints.length * 0.6);
          // Prefer the last digit's tail for two-digit numbers
          const lastDigit = hitPoints[hitPoints.length - 1] && hitPoints[hitPoints.length - 1].digit;
          const pool = (lastDigit != null)
            ? hitPoints.filter((p) => p.digit === lastDigit)
            : hitPoints;
          const tail = pool.slice(Math.floor(pool.length * 0.7));
          const hits = tail.filter((p) => p.hit).length;
          return hits >= Math.max(2, Math.ceil(tail.length * 0.45));
        }

        function isCompleteEnough() {
          const ratio = hitPoints.length ? hitCount / hitPoints.length : 0;
          if (mode === "nt_freehand") return ratio >= PASS && ink > 22;
          const twoDigit = String(n).length > 1;
          // Two-digit numbers: BOTH digits must be traced — first digit alone is not enough
          if (twoDigit && !eachDigitDone(0.55)) return false;
          return ratio >= PASS && endCovered();
        }

        function promptNextDigit() {
          if (mode === "nt_freehand" || String(n).length < 2) return;
          const cov = digitCoverage();
          const first = cov[0];
          const second = cov[1];
          if (!first || !second || !second.total) return;
          const firstDone = first.hit / first.total >= 0.55;
          const secondLow = second.hit / second.total < 0.35;
          if (firstDone && secondLow) {
            const secondNum = (def.digits && def.digits[1] != null) ? def.digits[1] : String(n).charAt(1);
            tipEl.textContent = "Nice! Now trace the " + secondNum;
          }
        }

        /** Only evaluate completion after a stroke ends — never mid-draw */
        function checkFinishAfterStroke() {
          if (completed || locked || drawing) return;
          promptNextDigit();
          if (isCompleteEnough()) finishTrace();
          else if (String(n).length > 1 && !eachDigitDone(0.55)) {
            const cov = digitCoverage();
            if (cov[0] && cov[0].hit / cov[0].total >= 0.55 && cov[1] && cov[1].hit / cov[1].total < 0.35) {
              tipEl.textContent = "Keep going — finish the second digit too!";
            }
          }
        }

        function setTracingLock(on) {
          document.documentElement.classList.toggle("le-nm-tracing", on);
          document.body.classList.toggle("le-nm-tracing", on);
          pageEl.classList.toggle("is-tracing", on);
        }

        function pointerDown(e) {
          if (completed || locked) return;
          if (activePointerId != null && e.pointerId != null && e.pointerId !== activePointerId) return;
          e.preventDefault();
          e.stopPropagation();
          drawing = true;
          activePointerId = e.pointerId != null ? e.pointerId : 1;
          offPathTicks = 0;
          setTracingLock(true);
          const src = eventClient(e);
          const c = clientToCanvas(src.clientX, src.clientY);
          const v = clientToViewBox(src.clientX, src.clientY);
          lastCanvasPt = c;
          lastVb = v;
          ctx.beginPath();
          ctx.moveTo(c.x, c.y);
          ctx.lineTo(c.x + 0.01, c.y + 0.01);
          ctx.stroke();
          markHits(v.x, v.y);
          try { if (e.pointerId != null) canvas.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
        }

        function pointerMove(e) {
          if (!drawing || completed) return;
          if (activePointerId != null && e.pointerId != null && e.pointerId !== activePointerId) return;
          e.preventDefault();
          const src = eventClient(e);
          const c = clientToCanvas(src.clientX, src.clientY);
          const v = clientToViewBox(src.clientX, src.clientY);
          if (lastCanvasPt) {
            ctx.beginPath();
            ctx.moveTo(lastCanvasPt.x, lastCanvasPt.y);
            ctx.lineTo(c.x, c.y);
            ctx.stroke();
          }
          ink++;
          const near = markSegment(lastVb, v);
          if (!near && mode !== "nt_freehand") {
            offPathTicks++;
            if (offPathTicks === 14 || offPathTicks % 30 === 0) {
              tipEl.textContent = "Almost! Follow the dotted line — keep going!";
            }
          } else if (near) {
            offPathTicks = 0;
            if (/Almost!|dotted/i.test(tipEl.textContent || "")) {
              tipEl.textContent = def.tip || "Keep going — you're doing great!";
            }
          }
          lastCanvasPt = c;
          lastVb = v;
          // Do NOT finish here — finishing mid-move locked drawing and cut strokes short
        }

        function pointerUp(e) {
          if (!drawing) return;
          if (e) {
            e.preventDefault();
            try {
              if (e.pointerId != null && canvas.hasPointerCapture && canvas.hasPointerCapture(e.pointerId)) {
                canvas.releasePointerCapture(e.pointerId);
              }
            } catch (err) { /* ignore */ }
          }
          drawing = false;
          lastCanvasPt = null;
          lastVb = null;
          activePointerId = null;
          setTracingLock(false);
          checkFinishAfterStroke();
        }

        function finishTrace() {
          if (completed || locked) return;
          completed = true;
          drawing = false;
          lastCanvasPt = null;
          lastVb = null;
          activePointerId = null;
          setTracingLock(false);
          tipEl.textContent = "Beautiful number " + n + "!";
          say("Wonderful! Number " + nameOf(n));
          onCorrect("Great tracing!");
        }

        function animateDemo() {
          if (demoTimer) clearInterval(demoTimer);
          const old = svg.querySelector(".le-nm-nt-demo");
          if (old && old.parentNode) old.parentNode.removeChild(old);
          const guide = document.createElementNS(svgNS, "circle");
          guide.setAttribute("r", "11");
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
            i += Math.max(1, Math.floor(allPts.length / 48));
          }, 36);
        }

        function addBtn(label, cls, fn) {
          const b = document.createElement("button");
          b.type = "button";
          b.className = "le-nm-choice le-nm-nt-btn " + (cls || "");
          b.textContent = label;
          b.addEventListener("click", () => {
            if (locked || completed) return;
            snd.pop();
            fn();
          });
          actions.appendChild(b);
        }

        addBtn("Clear", "", () => {
          if (demoTimer) { clearInterval(demoTimer); demoTimer = null; }
          const demo = svg.querySelector(".le-nm-nt-demo");
          if (demo && demo.parentNode) demo.parentNode.removeChild(demo);
          clearInk(true);
          tipEl.textContent = def.tip || "Follow the dotted path";
          say("Try again");
        });
        addBtn("Show me", "", () => animateDemo());
        addBtn("Hear", "", () => say(nameOf(n)));
        addBtn("Done", "le-nm-done", () => {
          if (isCompleteEnough()) finishTrace();
          else onWrong(mode === "nt_freehand"
            ? "Draw the whole number a bit more"
            : "Keep tracing — finish the whole number!");
        });

        ["touchstart", "touchmove", "gesturestart"].forEach((evt) => {
          board.addEventListener(evt, (e) => { e.preventDefault(); }, { passive: false });
        });

        canvas.addEventListener("pointerdown", pointerDown, { passive: false });
        canvas.addEventListener("pointermove", pointerMove, { passive: false });
        canvas.addEventListener("pointerup", pointerUp, { passive: false });
        canvas.addEventListener("pointercancel", pointerUp, { passive: false });
        canvas.addEventListener("lostpointercapture", pointerUp);
        // Older WebViews
        if (!window.PointerEvent) {
          canvas.addEventListener("mousedown", pointerDown, { passive: false });
          canvas.addEventListener("mousemove", pointerMove, { passive: false });
          canvas.addEventListener("mouseup", pointerUp, { passive: false });
          canvas.addEventListener("touchstart", pointerDown, { passive: false });
          canvas.addEventListener("touchmove", pointerMove, { passive: false });
          canvas.addEventListener("touchend", pointerUp, { passive: false });
          canvas.addEventListener("touchcancel", pointerUp, { passive: false });
        }

        resizeCanvas(true);
        drawGuides();
        clearInk(true);
        if (mode === "nt_follow") setTimeout(animateDemo, 300);
        choicesEl.innerHTML = "";
      }

      /* ========== Quantity & Comparison — 6 approved unique games ========== */

      function qcRange() {
        const lo = Math.max(1, sub.min || 1);
        const hi = Math.min(30, sub.max || 8);
        const soft = round < 2 ? Math.min(hi, Math.max(lo, lo + Math.floor((hi - lo) * 0.4))) : hi;
        return { min: lo, max: Math.max(lo, soft), hardMax: hi };
      }

      /** Self-contained cartoon SVG icons — always visible, no external assets */
      function qcIcon(kind, size, tone) {
        const s = size || 68;
        const t = tone == null ? 0 : tone;
        const carColors = ["#FF8FAB", "#7ECDB5", "#FFD166", "#A8D4F0", "#C9A0FF", "#FFB86B"];
        const fishColors = ["#FF8FAB", "#7ECDB5", "#FFD166", "#C9A0FF", "#FF6B6B", "#A8D4F0"];
        const balloonColors = ["#C9A0FF", "#FF8FAB", "#FFD166", "#7ECDB5", "#A8D4F0", "#FFB86B"];
        const flowerPetals = [
          ["#FF8FAB", "#C9A0FF", "#A8D4F0", "#7ECDB5"],
          ["#FFD166", "#FF8FAB", "#C9A0FF", "#7ECDB5"],
          ["#A8D4F0", "#7ECDB5", "#FFD166", "#FF8FAB"],
        ];
        const carBody = carColors[t % carColors.length];
        const fishBody = fishColors[t % fishColors.length];
        const balloonFill = balloonColors[t % balloonColors.length];
        const petals = flowerPetals[t % flowerPetals.length];
        const shine = `<ellipse cx="22" cy="18" rx="7" ry="4" fill="#fff" opacity=".45"/>`;
        const svg = {
          teddy: `<ellipse cx="32" cy="40" rx="18" ry="16" fill="#E8B86D"/><circle cx="16" cy="18" r="10" fill="#D4A574"/><circle cx="48" cy="18" r="10" fill="#D4A574"/><circle cx="32" cy="28" r="14" fill="#E8B86D"/><ellipse cx="32" cy="36" rx="8" ry="6" fill="#F6D7A8"/><circle cx="26" cy="26" r="2.2" fill="#5B4A7A"/><circle cx="38" cy="26" r="2.2" fill="#5B4A7A"/><ellipse cx="32" cy="31" rx="3" ry="2.2" fill="#C9845A"/><path d="M27 34c3 3 7 3 10 0" stroke="#C9845A" stroke-width="1.6" fill="none"/>${shine}`,
          car: `<rect x="6" y="30" width="52" height="16" rx="7" fill="${carBody}"/><path d="M18 30h28l-6-12H24z" fill="#A8D4F0"/><rect x="22" y="20" width="10" height="8" rx="2" fill="#EAF4FF" opacity=".9"/><rect x="34" y="20" width="10" height="8" rx="2" fill="#EAF4FF" opacity=".9"/><circle cx="18" cy="48" r="7" fill="#5B4A7A"/><circle cx="46" cy="48" r="7" fill="#5B4A7A"/><circle cx="18" cy="48" r="3" fill="#FFD166"/><circle cx="46" cy="48" r="3" fill="#FFD166"/><rect x="8" y="34" width="6" height="4" rx="1" fill="#FFD166"/>${shine}`,
          ball: `<circle cx="32" cy="32" r="22" fill="url(#none)"/><circle cx="32" cy="32" r="22" fill="#FF8FAB"/><path d="M12 32h40M32 12v40M16 18c10 8 22 8 32 0M16 46c10-8 22-8 32 0" stroke="#fff" stroke-width="3" fill="none"/><circle cx="32" cy="32" r="22" fill="none" stroke="#E86A8A" stroke-width="2"/>${shine}`,
          block: `<rect x="10" y="12" width="44" height="40" rx="8" fill="#7EB8E0"/><rect x="10" y="12" width="44" height="12" rx="8" fill="#A8D4F0"/><rect x="18" y="28" width="28" height="16" rx="4" fill="#fff" opacity=".35"/><circle cx="20" cy="20" r="4" fill="#FFD166"/><circle cx="32" cy="20" r="4" fill="#FF8FAB"/><circle cx="44" cy="20" r="4" fill="#7ECDB5"/>`,
          doll: `<circle cx="32" cy="16" r="11" fill="#FFD0B8"/><path d="M18 18c4-10 24-10 28 0" fill="#C9A0FF"/><rect x="18" y="28" width="28" height="26" rx="12" fill="#FF8FAB"/><rect x="24" y="34" width="16" height="12" rx="4" fill="#fff" opacity=".35"/><circle cx="28" cy="15" r="1.8" fill="#5B4A7A"/><circle cx="36" cy="15" r="1.8" fill="#5B4A7A"/><path d="M28 20c2.2 2.4 6 2.4 8 0" stroke="#E86A8A" stroke-width="1.8" fill="none"/>`,
          train: `<rect x="6" y="32" width="52" height="14" rx="4" fill="#7ECDB5"/><rect x="8" y="16" width="20" height="18" rx="4" fill="#FFD166"/><rect x="12" y="20" width="10" height="8" rx="2" fill="#A8D4F0"/><rect x="34" y="22" width="16" height="12" rx="3" fill="#FF8FAB"/><circle cx="16" cy="50" r="5.5" fill="#5B4A7A"/><circle cx="32" cy="50" r="5.5" fill="#5B4A7A"/><circle cx="48" cy="50" r="5.5" fill="#5B4A7A"/><rect x="26" y="10" width="5" height="10" rx="2" fill="#C9A0FF"/>${shine}`,
          plane: `<ellipse cx="30" cy="34" rx="24" ry="9" fill="#A8D4F0"/><rect x="26" y="14" width="10" height="22" rx="4" fill="#C9A0FF"/><rect x="10" y="30" width="40" height="7" rx="3" fill="#FF8FAB"/><polygon points="50,34 62,26 62,42" fill="#FFD166"/><circle cx="18" cy="32" r="3" fill="#fff" opacity=".7"/>${shine}`,
          dino: `<ellipse cx="28" cy="38" rx="18" ry="13" fill="#7ECDB5"/><circle cx="46" cy="22" r="11" fill="#7ECDB5"/><path d="M20 12l4 14M28 8l2 14M36 10l0 14" stroke="#4F9B78" stroke-width="4" stroke-linecap="round"/><circle cx="50" cy="20" r="2.2" fill="#5B4A7A"/><rect x="16" y="46" width="7" height="12" rx="2" fill="#4F9B78"/><rect x="32" y="46" width="7" height="12" rx="2" fill="#4F9B78"/><path d="M12 40c-6 2-8 8-4 10" stroke="#4F9B78" stroke-width="4" fill="none"/>${shine}`,
          cup: `<path d="M18 18h28l-5 34H23z" fill="#A8D4F0"/><ellipse cx="32" cy="18" rx="15" ry="5" fill="#7EB8E0"/><path d="M46 22c8 2 10 18 2 26" fill="none" stroke="#7EB8E0" stroke-width="4"/><rect x="24" y="28" width="10" height="14" rx="3" fill="#fff" opacity=".5"/><ellipse cx="32" cy="22" rx="10" ry="3" fill="#FFE8A0" opacity=".8"/>`,
          plate: `<ellipse cx="32" cy="34" rx="26" ry="16" fill="#FFFCF8" stroke="#C9A0FF" stroke-width="4"/><ellipse cx="32" cy="34" rx="14" ry="8" fill="#F3EEFF"/><ellipse cx="24" cy="28" rx="5" ry="3" fill="#fff" opacity=".55"/>`,
          sandwich: `<path d="M10 28h44l-4 8H14z" fill="#F0C987"/><rect x="12" y="34" width="40" height="7" rx="2" fill="#7ECDB5"/><rect x="12" y="40" width="40" height="7" rx="2" fill="#FF8FAB"/><path d="M10 46h44l-4 8H14z" fill="#E8B86D"/><circle cx="24" cy="30" r="2" fill="#C9845A"/>`,
          apple: `<circle cx="32" cy="36" r="17" fill="#FF6B6B"/><path d="M32 22c-4 0-8 4-8 8 4-2 8-2 12 0 0-4-2-8-4-8z" fill="#E84A4A"/><rect x="30" y="12" width="4" height="12" rx="2" fill="#8B5A2B"/><ellipse cx="40" cy="18" rx="8" ry="4" fill="#7ECDB5"/>${shine}`,
          banana: `<path d="M16 40c4-18 28-24 36-8-10-2-22 2-28 12-2 4-6 4-8-4z" fill="#FFD166"/><path d="M18 38c6-12 22-16 30-6" stroke="#E8B84A" stroke-width="3" fill="none"/><ellipse cx="48" cy="30" rx="4" ry="3" fill="#C9845A"/>`,
          juice: `<rect x="20" y="16" width="24" height="36" rx="6" fill="#FFB86B"/><rect x="24" y="22" width="16" height="18" rx="3" fill="#FF8FAB"/><rect x="26" y="8" width="12" height="10" rx="3" fill="#A8D4F0"/><ellipse cx="32" cy="12" rx="8" ry="3" fill="#7EB8E0"/>${shine}`,
          basket: `<ellipse cx="32" cy="20" rx="22" ry="8" fill="#E8C9A0"/><path d="M12 22h40l-5 30H17z" fill="#D4A574"/><path d="M18 22h28l-2 8H20z" fill="#C4956A" opacity=".45"/><path d="M20 12c0-10 24-10 24 0" fill="none" stroke="#C4956A" stroke-width="4"/><rect x="22" y="34" width="8" height="8" rx="2" fill="#FF8FAB"/><rect x="34" y="34" width="8" height="8" rx="2" fill="#7ECDB5"/>`,
          tablecloth: `<rect x="6" y="18" width="52" height="34" rx="6" fill="#FFF8E8"/><path d="M6 28h52M6 40h52M18 18v34M34 18v34M50 18v34" stroke="#FFD166" stroke-width="3"/><rect x="6" y="18" width="52" height="34" rx="6" fill="none" stroke="#E8B86D" stroke-width="2"/>`,
          flower: `<circle cx="20" cy="20" r="9" fill="${petals[0]}"/><circle cx="44" cy="20" r="9" fill="${petals[1]}"/><circle cx="20" cy="40" r="9" fill="${petals[2]}"/><circle cx="44" cy="40" r="9" fill="${petals[3]}"/><circle cx="32" cy="30" r="9" fill="#FFD166"/><rect x="30" y="38" width="4" height="18" rx="2" fill="#4F9B78"/>${shine}`,
          pot: `<path d="M18 30h28l-4 24H22z" fill="#E8A07A"/><rect x="16" y="24" width="32" height="10" rx="4" fill="#C9845A"/><ellipse cx="32" cy="18" rx="10" ry="8" fill="#7ECDB5"/><circle cx="28" cy="14" r="3" fill="#FF8FAB"/><circle cx="36" cy="16" r="3" fill="#C9A0FF"/>`,
          soilpot: `<path d="M16 28h32l-5 28H21z" fill="#E8A07A"/><rect x="14" y="22" width="36" height="10" rx="4" fill="#C9845A"/><ellipse cx="32" cy="24" rx="14" ry="5" fill="#8B5A2B"/><ellipse cx="26" cy="34" rx="3" ry="2" fill="#C9845A" opacity=".5"/>`,
          tree: `<rect x="28" y="36" width="8" height="20" rx="2" fill="#8B5A2B"/><circle cx="32" cy="24" r="16" fill="#4F9B78"/><circle cx="22" cy="28" r="10" fill="#7ECDB5"/><circle cx="42" cy="26" r="11" fill="#5FBA8A"/>${shine}`,
          plant: `<rect x="24" y="40" width="16" height="14" rx="3" fill="#E8A07A"/><path d="M32 40c-8-12-14-18-4-28 2 8 4 16 4 28z" fill="#7ECDB5"/><path d="M32 40c8-12 14-18 4-28-2 8-4 16-4 28z" fill="#4F9B78"/>`,
          butterfly: `<ellipse cx="20" cy="28" rx="12" ry="16" fill="#C9A0FF"/><ellipse cx="44" cy="28" rx="12" ry="16" fill="#FF8FAB"/><ellipse cx="32" cy="32" rx="5" ry="12" fill="#FFD166"/><circle cx="20" cy="24" r="4" fill="#fff" opacity=".45"/><circle cx="44" cy="24" r="4" fill="#fff" opacity=".45"/><path d="M30 20c-2-8 2-12 2-12M34 20c2-8-2-12-2-12" stroke="#5B4A7A" stroke-width="2" fill="none"/>`,
          can: `<rect x="18" y="22" width="28" height="28" rx="6" fill="#A8D4F0"/><path d="M18 28h28" stroke="#7EB8E0" stroke-width="4"/><path d="M42 18c10 2 14 12 8 18" fill="none" stroke="#7EB8E0" stroke-width="4"/><circle cx="46" cy="16" r="5" fill="#7ECDB5"/><rect x="24" y="34" width="12" height="8" rx="2" fill="#fff" opacity=".45"/>`,
          tool: `<rect x="28" y="8" width="8" height="36" rx="3" fill="#C4956A"/><path d="M18 40h28l-4 14H22z" fill="#A8A0B8"/><rect x="26" y="42" width="12" height="6" rx="2" fill="#7E5FB0"/>`,
          seed: `<ellipse cx="32" cy="34" rx="12" ry="16" fill="#C9845A"/><ellipse cx="28" cy="28" rx="4" ry="6" fill="#E8C9A0"/><path d="M32 18c0-6 4-10 4-10" stroke="#4F9B78" stroke-width="2" fill="none"/>`,
          seedpack: `<rect x="14" y="12" width="36" height="44" rx="6" fill="#7ECDB5"/><rect x="18" y="18" width="28" height="20" rx="4" fill="#FFFCF8"/><ellipse cx="32" cy="28" rx="8" ry="10" fill="#C9845A"/><rect x="20" y="42" width="24" height="8" rx="2" fill="#FFD166"/>`,
          sprout: `<rect x="28" y="36" width="8" height="18" rx="2" fill="#4F9B78"/><path d="M32 36c-10-8-14-18-4-24 0 8 2 16 4 24z" fill="#7ECDB5"/><path d="M32 36c10-8 14-18 4-24 0 8-2 16-4 24z" fill="#5FBA8A"/><ellipse cx="32" cy="54" rx="14" ry="5" fill="#C9845A"/>`,
          carrot: `<path d="M32 14l10 36H22z" fill="#FF8FAB"/><path d="M32 14c-6-10 0-12 0-12M32 14c6-10 0-12 0-12M26 12c0-8 12-8 12 0" stroke="#4F9B78" stroke-width="3" fill="none"/><path d="M26 30h12M28 40h8" stroke="#E86A8A" stroke-width="2"/>`,
          tomato: `<circle cx="32" cy="36" r="18" fill="#FF6B6B"/><path d="M32 18c-4 0-8 4-6 8 4-2 8-2 12 0 2-4-2-8-6-8z" fill="#E84A4A"/><path d="M28 14c0-6 8-6 8 0M32 10v8" stroke="#4F9B78" stroke-width="3" stroke-linecap="round"/>${shine}`,
          berry: `<circle cx="24" cy="34" r="10" fill="#C9A0FF"/><circle cx="40" cy="34" r="10" fill="#A878E0"/><circle cx="32" cy="24" r="10" fill="#E8D5F5"/><rect x="30" y="10" width="4" height="10" rx="2" fill="#4F9B78"/><ellipse cx="38" cy="14" rx="6" ry="3" fill="#7ECDB5"/>`,
          strawberry: `<path d="M32 12c-4 0-8 4-10 10-4 12 6 30 10 34 4-4 14-22 10-34-2-6-6-10-10-10z" fill="#FF6B6B"/><path d="M22 14c4-8 16-8 20 0-6 2-14 2-20 0z" fill="#4F9B78"/><circle cx="26" cy="28" r="1.6" fill="#FFD166"/><circle cx="34" cy="34" r="1.6" fill="#FFD166"/><circle cx="30" cy="42" r="1.6" fill="#FFD166"/>`,
          orange: `<circle cx="32" cy="34" r="18" fill="#FFB86B"/><circle cx="32" cy="34" r="18" fill="none" stroke="#E89A4A" stroke-width="2"/><path d="M32 16c-2 6 2 10 0 14" stroke="#E89A4A" stroke-width="2" fill="none"/><ellipse cx="38" cy="16" rx="6" ry="3" fill="#7ECDB5"/><rect x="30" y="12" width="4" height="8" rx="2" fill="#8B5A2B"/>${shine}`,
          grape: `<circle cx="32" cy="22" r="7" fill="#C9A0FF"/><circle cx="24" cy="30" r="7" fill="#A878E0"/><circle cx="40" cy="30" r="7" fill="#A878E0"/><circle cx="28" cy="40" r="7" fill="#8A5CC8"/><circle cx="36" cy="40" r="7" fill="#8A5CC8"/><rect x="30" y="8" width="4" height="10" rx="2" fill="#4F9B78"/>`,
          rabbit: `<ellipse cx="32" cy="40" rx="16" ry="14" fill="#FFE8DA"/><circle cx="32" cy="26" r="12" fill="#FFE8DA"/><ellipse cx="22" cy="10" rx="5" ry="12" fill="#FFD0B8"/><ellipse cx="42" cy="10" rx="5" ry="12" fill="#FFD0B8"/><circle cx="28" cy="24" r="2" fill="#5B4A7A"/><circle cx="36" cy="24" r="2" fill="#5B4A7A"/><ellipse cx="32" cy="30" rx="3" ry="2" fill="#FF8FAB"/>`,
          cat: `<ellipse cx="32" cy="40" rx="16" ry="13" fill="#FFD166"/><circle cx="32" cy="26" r="12" fill="#FFD166"/><path d="M20 18l-6-12 12 6M44 18l6-12-12 6" fill="#FFD166"/><circle cx="27" cy="24" r="2" fill="#5B4A7A"/><circle cx="37" cy="24" r="2" fill="#5B4A7A"/><path d="M28 30c2 2 6 2 8 0" stroke="#E86A8A" stroke-width="2" fill="none"/>`,
          elephant: `<ellipse cx="30" cy="36" rx="18" ry="14" fill="#C9B8D8"/><circle cx="46" cy="28" r="10" fill="#C9B8D8"/><path d="M50 32c8 8 4 20-2 22" stroke="#A898C0" stroke-width="6" fill="none" stroke-linecap="round"/><circle cx="48" cy="26" r="2" fill="#5B4A7A"/><ellipse cx="18" cy="48" rx="5" ry="7" fill="#A898C0"/><ellipse cx="36" cy="48" rx="5" ry="7" fill="#A898C0"/>`,
          magician: `<circle cx="32" cy="22" r="12" fill="#FFD0B8"/><path d="M16 24c4-14 28-14 32 0" fill="#5B4A7A"/><rect x="18" y="34" width="28" height="22" rx="8" fill="#7E5FB0"/><rect x="22" y="12" width="20" height="8" rx="2" fill="#5B4A7A"/><circle cx="28" cy="20" r="1.8" fill="#5B4A7A"/><circle cx="36" cy="20" r="1.8" fill="#5B4A7A"/><path d="M28 26c2 2 6 2 8 0" stroke="#E86A8A" stroke-width="1.6" fill="none"/>`,
          hat: `<ellipse cx="32" cy="48" rx="24" ry="8" fill="#5B4A7A"/><path d="M20 46h24l-4-28H24z" fill="#3D3550"/><rect x="18" y="18" width="28" height="8" rx="3" fill="#FFD166"/><circle cx="40" cy="12" r="5" fill="#FF8FAB"/>`,
          wand: `<rect x="30" y="18" width="4" height="36" rx="2" fill="#C4956A"/><path d="M32 8l3 8 8 1-6 5 2 8-7-4-7 4 2-8-6-5 8-1z" fill="#FFD166"/>`,
          traineng: `<rect x="8" y="28" width="40" height="18" rx="4" fill="#FF8FAB"/><rect x="10" y="14" width="18" height="16" rx="4" fill="#FFD166"/><rect x="14" y="18" width="10" height="8" rx="2" fill="#A8D4F0"/><circle cx="18" cy="50" r="6" fill="#5B4A7A"/><circle cx="38" cy="50" r="6" fill="#5B4A7A"/><rect x="48" y="32" width="10" height="12" rx="2" fill="#7ECDB5"/>`,
          sparkle: `<path d="M32 8l4 16 16 4-16 4-4 16-4-16-16-4 16-4z" fill="#FFD166"/><circle cx="32" cy="32" r="4" fill="#fff" opacity=".5"/>`,
          cookie: `<circle cx="32" cy="32" r="20" fill="#E8B86D"/><circle cx="24" cy="26" r="3" fill="#8B5A2B"/><circle cx="36" cy="24" r="2.5" fill="#8B5A2B"/><circle cx="30" cy="36" r="3" fill="#8B5A2B"/><circle cx="40" cy="38" r="2.5" fill="#8B5A2B"/>`,
          plus: `<circle cx="32" cy="32" r="22" fill="#7ECDB5"/><rect x="28" y="16" width="8" height="32" rx="3" fill="#fff"/><rect x="16" y="28" width="32" height="8" rx="3" fill="#fff"/>`,
          equals: `<circle cx="32" cy="32" r="22" fill="#C9A0FF"/><rect x="16" y="22" width="32" height="8" rx="3" fill="#fff"/><rect x="16" y="34" width="32" height="8" rx="3" fill="#fff"/>`,
          numblock: `<rect x="8" y="8" width="48" height="48" rx="12" fill="#A8D4F0"/><rect x="12" y="12" width="24" height="12" rx="4" fill="#fff" opacity=".35"/>`,
          bee: `<ellipse cx="32" cy="34" rx="14" ry="10" fill="#FFD166"/><path d="M22 34h20M22 28h20M22 40h20" stroke="#5B4A7A" stroke-width="3"/><circle cx="44" cy="30" r="6" fill="#5B4A7A"/><circle cx="46" cy="28" r="1.5" fill="#fff"/><ellipse cx="18" cy="22" rx="10" ry="8" fill="#A8D4F0" opacity=".75"/><ellipse cx="30" cy="18" rx="10" ry="8" fill="#EAF4FF" opacity=".75"/>`,
          ladybug: `<ellipse cx="32" cy="36" rx="18" ry="14" fill="#FF6B6B"/><ellipse cx="32" cy="36" rx="2" ry="14" fill="#5B4A7A"/><circle cx="24" cy="32" r="3" fill="#5B4A7A"/><circle cx="40" cy="32" r="3" fill="#5B4A7A"/><circle cx="28" cy="42" r="2.5" fill="#5B4A7A"/><circle cx="36" cy="42" r="2.5" fill="#5B4A7A"/><circle cx="32" cy="20" r="8" fill="#5B4A7A"/><circle cx="29" cy="18" r="1.5" fill="#fff"/><circle cx="35" cy="18" r="1.5" fill="#fff"/>`,
          soil: `<ellipse cx="32" cy="40" rx="26" ry="12" fill="#8B5A2B"/><ellipse cx="32" cy="36" rx="22" ry="8" fill="#C9845A"/><ellipse cx="22" cy="36" rx="4" ry="2" fill="#6B4423" opacity=".5"/><ellipse cx="40" cy="38" rx="5" ry="2" fill="#6B4423" opacity=".4"/>`,
          fish: `<ellipse cx="28" cy="32" rx="18" ry="12" fill="${fishBody}"/><polygon points="44,32 60,20 60,44" fill="#FFD166"/><circle cx="20" cy="28" r="3" fill="#5B4A7A"/><circle cx="19" cy="27" r="1" fill="#fff"/><path d="M24 36c5 4 12 4 16 0" stroke="#fff" stroke-width="2" fill="none"/><path d="M30 22c2-6 8-6 8-2" fill="${fishBody}"/>${shine}`,
          starfish: `<path d="M32 8l5 16 17 2-13 11 4 16-13-9-13 9 4-16-13-11 17-2z" fill="#FFB86B"/><circle cx="32" cy="30" r="5" fill="#FFD166"/>`,
          turtle: `<ellipse cx="32" cy="34" rx="18" ry="14" fill="#7ECDB5"/><ellipse cx="32" cy="34" rx="12" ry="9" fill="#4F9B78"/><circle cx="48" cy="24" r="8" fill="#7ECDB5"/><circle cx="50" cy="22" r="2" fill="#5B4A7A"/><ellipse cx="14" cy="28" rx="6" ry="4" fill="#5FBA8A"/><ellipse cx="14" cy="40" rx="6" ry="4" fill="#5FBA8A"/><ellipse cx="46" cy="44" rx="6" ry="4" fill="#5FBA8A"/>`,
          jellyfish: `<ellipse cx="32" cy="22" rx="16" ry="12" fill="#C9A0FF"/><path d="M20 30c0 16 4 24 4 24M28 32c0 18 2 26 2 26M36 32c0 18-2 26-2 26M44 30c0 16-4 24-4 24" stroke="#E8D5F5" stroke-width="3" fill="none"/><circle cx="26" cy="20" r="2" fill="#5B4A7A"/><circle cx="38" cy="20" r="2" fill="#5B4A7A"/>${shine}`,
          octopus: `<ellipse cx="32" cy="26" rx="16" ry="14" fill="#C9A0FF"/><circle cx="26" cy="24" r="2.4" fill="#5B4A7A"/><circle cx="38" cy="24" r="2.4" fill="#5B4A7A"/><path d="M18 36c-2 12 2 18 2 18M26 38c0 14 2 18 2 18M32 40c0 14 0 18 0 18M38 38c0 14-2 18-2 18M46 36c2 12-2 18-2 18" stroke="#A878E0" stroke-width="5" stroke-linecap="round" fill="none"/>${shine}`,
          crab: `<ellipse cx="32" cy="34" rx="16" ry="12" fill="#FF8FAB"/><circle cx="24" cy="30" r="2.2" fill="#5B4A7A"/><circle cx="40" cy="30" r="2.2" fill="#5B4A7A"/><path d="M14 28c-8-8-4-16 2-10M50 28c8-8 4-16-2-10" stroke="#E86A8A" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M18 42l-6 8M24 44l-2 8M40 44l2 8M46 42l6 8" stroke="#E86A8A" stroke-width="3" stroke-linecap="round"/>${shine}`,
          seahorse: `<path d="M36 10c10 2 12 14 2 18-6 2-8 6-4 12 6 8-4 16-14 10-6-4-2-12 4-10 4 2 6-2 4-6-4-10 2-20 8-24z" fill="#FFD166"/><circle cx="40" cy="16" r="2.2" fill="#5B4A7A"/><path d="M28 48c-4 6 2 10 8 6" stroke="#E8B84A" stroke-width="4" fill="none" stroke-linecap="round"/>${shine}`,
          shell: `<path d="M12 40c4-22 36-22 40 0-8-6-16-8-20-8s-12 2-20 8z" fill="#FFD8C2"/><path d="M18 38c4-12 24-12 28 0" stroke="#FF8FAB" stroke-width="2" fill="none"/><path d="M24 36c2-6 14-6 16 0M30 34c1-4 4-4 5 0" stroke="#C9A0FF" stroke-width="2" fill="none"/><ellipse cx="32" cy="42" rx="8" ry="4" fill="#F0A98A"/>`,
          treasure: `<rect x="12" y="28" width="40" height="24" rx="4" fill="#C4956A"/><rect x="12" y="28" width="40" height="8" rx="3" fill="#E8B86D"/><circle cx="32" cy="40" r="5" fill="#FFD166"/><rect x="18" y="18" width="10" height="12" rx="2" fill="#FFD166"/><rect x="36" y="16" width="10" height="14" rx="2" fill="#FF8FAB"/><circle cx="24" cy="48" r="3" fill="#7ECDB5"/>`,
          cave: `<path d="M6 52h52V34c0-16-12-26-26-26S6 18 6 34z" fill="#8A7A6A"/><ellipse cx="32" cy="44" rx="14" ry="16" fill="#3D3550"/><ellipse cx="32" cy="46" rx="8" ry="10" fill="#2A2438"/>`,
          pebble: `<ellipse cx="22" cy="36" rx="10" ry="8" fill="#B09A88"/><ellipse cx="38" cy="40" rx="12" ry="7" fill="#C9B8A8"/><ellipse cx="30" cy="30" rx="7" ry="5" fill="#D4C4B4"/>`,
          coral: `<path d="M20 54c0-16 6-20 6-32M32 54c2-18-4-22 2-36M44 54c0-14-6-18-2-30" stroke="#FF8FAB" stroke-width="6" stroke-linecap="round" fill="none"/><circle cx="26" cy="20" r="5" fill="#FFD166"/><circle cx="34" cy="16" r="5" fill="#C9A0FF"/><circle cx="44" cy="22" r="5" fill="#FF8FAB"/>`,
          bubble: `<circle cx="32" cy="32" r="14" fill="#A8D4F0" opacity=".55"/><circle cx="26" cy="26" r="5" fill="#fff" opacity=".75"/>`,
          seaweed: `<path d="M24 58c-4-14 8-16 2-30 8-2 10 10 6 18 8 0 8 10 2 12" fill="none" stroke="#4F9B78" stroke-width="5" stroke-linecap="round"/><path d="M40 58c4-16-6-18 0-32-6-2-8 10-4 18-6 2-6 10 0 14" fill="none" stroke="#7ECDB5" stroke-width="4" stroke-linecap="round"/>`,
          rock: `<ellipse cx="32" cy="40" rx="22" ry="12" fill="#C9B8A8"/><ellipse cx="24" cy="36" rx="9" ry="6" fill="#B09A88"/><ellipse cx="40" cy="38" rx="7" ry="5" fill="#D4C4B4"/>`,
          balloon: `<ellipse cx="32" cy="24" rx="16" ry="20" fill="${balloonFill}"/><path d="M32 44l-4 12h8z" fill="#7E5FB0"/><line x1="32" y1="56" x2="32" y2="62" stroke="#7E5FB0" stroke-width="2"/><ellipse cx="26" cy="16" rx="5" ry="7" fill="#fff" opacity=".35"/>`,
          gift: `<rect x="12" y="26" width="40" height="28" rx="5" fill="#FF8FAB"/><rect x="28" y="26" width="8" height="28" fill="#FFD166"/><rect x="12" y="36" width="40" height="8" fill="#FFD166"/><path d="M32 26c-8-12 8-12 0 0c8-12-8-12 0 0" fill="#C9A0FF"/><rect x="12" y="26" width="40" height="6" rx="3" fill="#E86A8A" opacity=".35"/>`,
          cake: `<rect x="12" y="32" width="40" height="22" rx="5" fill="#FFD8C2"/><rect x="12" y="32" width="40" height="10" rx="4" fill="#FF8FAB"/><rect x="18" y="22" width="28" height="12" rx="4" fill="#FFF0F5"/><rect x="28" y="10" width="8" height="14" rx="2" fill="#FFD166"/><circle cx="32" cy="8" r="4" fill="#FF6B6B"/><circle cx="20" cy="38" r="3" fill="#C9A0FF"/><circle cx="44" cy="38" r="3" fill="#7ECDB5"/>`,
          cupcake: `<path d="M18 30h28l-4 22H22z" fill="#FFD8C2"/><ellipse cx="32" cy="30" rx="16" ry="8" fill="#FF8FAB"/><circle cx="32" cy="18" r="10" fill="#FFF0F5"/><circle cx="32" cy="12" r="4" fill="#FF6B6B"/><rect x="22" y="36" width="4" height="10" rx="1" fill="#C9A0FF"/><rect x="30" y="36" width="4" height="10" rx="1" fill="#FFD166"/><rect x="38" y="36" width="4" height="10" rx="1" fill="#7ECDB5"/>`,
          candle: `<rect x="28" y="24" width="8" height="30" rx="2" fill="#A8D4F0"/><rect x="28" y="30" width="8" height="6" fill="#fff" opacity=".5"/><ellipse cx="32" cy="16" rx="6" ry="10" fill="#FFD166"/><ellipse cx="32" cy="12" rx="3" ry="5" fill="#FF8FAB"/>`,
          hat: `<path d="M12 40h40l-8-18H20z" fill="#C9A0FF"/><ellipse cx="32" cy="22" rx="8" ry="6" fill="#FFD166"/><circle cx="32" cy="12" r="5" fill="#FF8FAB"/><path d="M20 36h6M30 34h6M40 36h6" stroke="#fff" stroke-width="2"/>`,
          ribbon: `<path d="M16 20c8 0 12 8 16 12 4-4 8-12 16-12-6 8-10 16-16 24-6-8-10-16-16-24z" fill="#FF8FAB"/><circle cx="32" cy="34" r="6" fill="#FFD166"/><path d="M26 38l-8 16M38 38l8 16" stroke="#C9A0FF" stroke-width="4" stroke-linecap="round"/>`,
          sign: `<rect x="28" y="28" width="8" height="28" rx="2" fill="#C4956A"/><rect x="12" y="10" width="40" height="24" rx="6" fill="#7ECDB5"/><path d="M22 16h12c6 0 6 10 0 10H28v8h-6zM28 20h4c2 0 2 2 0 2h-4z" fill="#fff"/>`,
        };
        const body = svg[kind] || svg.ball;
        return `<svg class="le-nm-qc-ico" viewBox="0 0 64 64" width="${s}" height="${s}" aria-hidden="true">${body}</svg>`;
      }

      function qcObj(kind, attrs) {
        const a = attrs || {};
        const tone = a.tone == null ? 0 : a.tone;
        const cls = "le-nm-qc-obj is-" + kind + (a.cls ? " " + a.cls : "");
        const data = ` data-kind="${a.kind || kind}" data-tone="${tone}"`;
        const drag = a.drag ? ` draggable="true"` : "";
        const label = a.label || kind;
        const size = a.size || 72;
        if (a.tag === "span") {
          return `<span class="${cls}"${data} aria-hidden="true">${qcIcon(kind, size, tone)}</span>`;
        }
        return `<button type="button" class="${cls}"${data}${drag} aria-label="${label}">${qcIcon(kind, size, tone)}</button>`;
      }

      function qcBounce(node) {
        if (!node) return;
        node.classList.add("is-pop");
        setTimeout(() => node.classList.remove("is-pop"), 320);
      }

      /** 1) Toy Shop Challenge — illustrated shop, drag/tap requested toys into basket */
      function buildToyShopRound() {
        const TOY_CATALOG = [
          { id: "teddy", singular: "teddy bear", plural: "teddy bears", speak: "teddy" },
          { id: "car", singular: "toy car", plural: "toy cars", speak: "car" },
          { id: "ball", singular: "ball", plural: "balls", speak: "ball" },
          { id: "block", singular: "building block", plural: "building blocks", speak: "block" },
          { id: "doll", singular: "doll", plural: "dolls", speak: "doll" },
          { id: "train", singular: "toy train", plural: "toy trains", speak: "train" },
          { id: "plane", singular: "airplane", plural: "airplanes", speak: "plane" },
          { id: "dino", singular: "dinosaur", plural: "dinosaurs", speak: "dinosaur" },
        ];
        const { min, max, hardMax } = qcRange();
        const need = randInt(min, Math.min(max, round < 2 ? Math.min(max, 5) : max));
        const wanted = TOY_CATALOG[randInt(0, TOY_CATALOG.length - 1)];
        const distractorCount = round < 1 ? randInt(2, 3) : randInt(3, 5);
        const shelfKinds = [];
        for (let i = 0; i < need; i++) shelfKinds.push(wanted.id);
        for (let i = 0; i < distractorCount; i++) {
          let other = TOY_CATALOG[randInt(0, TOY_CATALOG.length - 1)].id;
          while (other === wanted.id) other = TOY_CATALOG[randInt(0, TOY_CATALOG.length - 1)].id;
          shelfKinds.push(other);
        }
        // Shuffle shelf
        for (let i = shelfKinds.length - 1; i > 0; i--) {
          const j = randInt(0, i);
          const tmp = shelfKinds[i];
          shelfKinds[i] = shelfKinds[j];
          shelfKinds[j] = tmp;
        }

        function toyFigure(kind, extraClass, size) {
          const sz = size || 72;
          return `<span class="le-nm-shop-toy is-${kind}${extraClass ? " " + extraClass : ""}" data-kind="${kind}" draggable="true" role="button" tabindex="0" aria-label="${kind}">${qcIcon(kind, sz)}</span>`;
        }

        let packed = 0;
        let selected = null;
        wrongTries = 0;
        const orderLabel = need === 1 ? wanted.singular : wanted.plural;
        promptEl.textContent = "Customer wants " + need + " " + orderLabel + "!";
        say("Please find " + nameOf(need) + " " + wanted.speak + (need > 1 ? "s" : ""));

        const rows = [[], []];
        shelfKinds.forEach((kind, i) => rows[i % 2].push(toyFigure(kind)));

        stageEl.innerHTML = `
          <div class="le-nm-qc le-nm-shop">
            <div class="le-nm-shop-scene">
              <div class="le-nm-shop-sign">Toy Shop</div>
              <div class="le-nm-shop-customer">
                <span class="le-nm-shop-avatar" aria-hidden="true">${qcIcon("doll", 48)}</span>
                <div class="le-nm-shop-bubble">
                  ${toyFigure(wanted.id, "is-preview", 44)}
                  <strong>× ${need}</strong>
                </div>
              </div>
              <div class="le-nm-shop-shelves" id="leShopShelves">
                <div class="le-nm-shop-shelf-row">${rows[0].join("")}<span class="le-nm-shop-plank" aria-hidden="true"></span></div>
                <div class="le-nm-shop-shelf-row">${rows[1].join("")}<span class="le-nm-shop-plank" aria-hidden="true"></span></div>
              </div>
              <div class="le-nm-shop-basket is-drop" id="leShopBasket">
                <span class="le-nm-shop-basket-label" id="leShopCount">0 / ${need}</span>
                <div class="le-nm-shop-basket-items" id="leShopItems"></div>
              </div>
            </div>
            <p class="le-nm-tap-hint">Drag or tap the matching toys into the basket</p>
          </div>`;

        const basket = stageEl.querySelector("#leShopBasket");
        const itemsEl = stageEl.querySelector("#leShopItems");
        const countEl = stageEl.querySelector("#leShopCount");
        choicesEl.innerHTML = "";

        function celebrateOrder() {
          promptEl.textContent = "Order complete! Beautiful toys!";
          stageEl.querySelector(".le-nm-tap-hint").textContent = "You packed " + need + " " + orderLabel + "!";
          basket.classList.add("is-done");
          confetti(10);
          say("Wonderful! " + nameOf(need) + " " + wanted.speak + (need > 1 ? "s" : ""));
          setTimeout(() => {
            if (locked) return;
            promptEl.textContent = "How many " + wanted.plural + " did we pack?";
            say("How many " + wanted.speak + "s?");
            renderChoices(uniqueNumsNear(need, min, hardMax, 3).map(v => ({ label: v, value: v })), need);
          }, 700);
        }

        function packToy(node) {
          if (locked || !node || node.classList.contains("is-used") || packed >= need) return;
          const kind = node.getAttribute("data-kind");
          if (kind !== wanted.id) {
            snd.wrong();
            tipWrong(node);
            onWrong("Find the " + wanted.speak + " toys!");
            return;
          }
          node.classList.add("is-used");
          node.classList.remove("is-selected");
          packed++;
          countEl.textContent = packed + " / " + need;
          itemsEl.insertAdjacentHTML("beforeend", toyFigure(kind, "is-packed", 40));
          const packedNode = itemsEl.lastElementChild;
          qcBounce(packedNode);
          snd.pop();
          say(nameOf(packed) + " " + wanted.speak + (packed > 1 ? "s" : ""));
          selected = null;
          if (packed === need) celebrateOrder();
        }

        function tipWrong(node) {
          node.classList.add("is-shake");
          setTimeout(() => node.classList.remove("is-shake"), 420);
        }

        stageEl.querySelectorAll("#leShopShelves .le-nm-shop-toy").forEach((node) => {
          node.addEventListener("click", () => {
            if (locked || node.classList.contains("is-used")) return;
            // Tap-to-select then tap basket, or double-tap style: first tap selects, second packing via basket
            // Toddler-friendly: tap matching toy packs directly
            if (node.getAttribute("data-kind") === wanted.id) {
              packToy(node);
              return;
            }
            stageEl.querySelectorAll("#leShopShelves .le-nm-shop-toy").forEach((x) => x.classList.remove("is-selected"));
            node.classList.add("is-selected");
            selected = node;
            snd.pop();
            tipWrong(node);
            onWrong("That is not a " + wanted.speak + " — try another!");
          });
          node.addEventListener("dragstart", (e) => {
            if (locked || node.classList.contains("is-used")) {
              e.preventDefault();
              return;
            }
            selected = node;
            node.classList.add("is-dragging");
            try { e.dataTransfer.setData("text/plain", node.getAttribute("data-kind") || "toy"); } catch (err) { /* ignore */ }
            e.dataTransfer.effectAllowed = "move";
          });
          node.addEventListener("dragend", () => node.classList.remove("is-dragging"));
        });

        basket.addEventListener("click", () => {
          if (selected) packToy(selected);
        });
        basket.addEventListener("dragover", (e) => {
          e.preventDefault();
          basket.classList.add("is-over");
        });
        basket.addEventListener("dragleave", () => basket.classList.remove("is-over"));
        basket.addEventListener("drop", (e) => {
          e.preventDefault();
          basket.classList.remove("is-over");
          packToy(selected);
        });
      }

      /** 2) Parking Lot Numbers — colourful cars + lot scene */
      function buildParkingRound() {
        const { min, max, hardMax } = qcRange();
        const spots = Math.min(10, Math.max(min + 1, randInt(min + 1, Math.min(max + 2, 10))));
        const carsNeeded = randInt(Math.max(1, min), Math.min(spots - 1, max));
        let parked = 0;
        wrongTries = 0;
        promptEl.textContent = "Park " + carsNeeded + " cars in the lot!";
        say("Park " + nameOf(carsNeeded) + " cars");
        const stalls = Array.from({ length: spots }, (_, i) =>
          `<button type="button" class="le-nm-qc-stall" data-i="${i}" aria-label="parking spot ${i + 1}">
            <span class="le-nm-qc-stall-num">${i + 1}</span>
            <span class="le-nm-qc-stall-mark" aria-hidden="true"></span>
          </button>`
        ).join("");
        const carPool = carsNeeded + 2;
        stageEl.innerHTML = `
          <div class="le-nm-qc le-nm-qc-parking">
            <div class="le-nm-qc-scene is-parking">
              <div class="le-nm-qc-scene-top">
                <span class="le-nm-qc-sign" aria-hidden="true">${qcIcon("sign", 52)}</span>
                <div class="le-nm-shop-sign">Parking Lot</div>
              </div>
              <div class="le-nm-qc-road" aria-hidden="true"></div>
              <div class="le-nm-qc-lot" id="leQcLot">${stalls}</div>
              <div class="le-nm-qc-car-row" id="leQcCars">
                ${Array.from({ length: carPool }, (_, i) =>
                  `<button type="button" class="le-nm-qc-car le-nm-qc-obj is-car" data-tone="${i % 6}" aria-label="car ${i + 1}">${qcIcon("car", 70, i % 6)}</button>`
                ).join("")}
              </div>
            </div>
            <p class="le-nm-tap-hint">Tap a car, then tap an empty parking spot · <span id="leQcParked">0</span> / ${carsNeeded}</p>
          </div>`;
        const parkedEl = stageEl.querySelector("#leQcParked");
        let selectedCar = null;
        stageEl.querySelectorAll("#leQcCars .le-nm-qc-car").forEach((car) => {
          car.addEventListener("click", () => {
            if (locked || car.classList.contains("is-used")) return;
            stageEl.querySelectorAll("#leQcCars .le-nm-qc-car").forEach((c) => c.classList.remove("is-selected"));
            car.classList.add("is-selected");
            selectedCar = car;
            qcBounce(car);
            snd.pop();
          });
        });
        stageEl.querySelectorAll(".le-nm-qc-stall").forEach((stall) => {
          stall.addEventListener("click", () => {
            if (locked || stall.classList.contains("is-full") || !selectedCar || parked >= carsNeeded) return;
            const tone = Number(selectedCar.getAttribute("data-tone") || 0);
            stall.classList.add("is-full");
            stall.insertAdjacentHTML("beforeend", `<span class="le-nm-qc-car is-parked" aria-hidden="true">${qcIcon("car", 44, tone)}</span>`);
            selectedCar.classList.add("is-used");
            selectedCar.classList.remove("is-selected");
            selectedCar = null;
            parked++;
            parkedEl.textContent = String(parked);
            qcBounce(stall);
            snd.pop();
            say(nameOf(parked));
            if (parked === carsNeeded) {
              const empty = spots - parked;
              confetti(8);
              promptEl.textContent = empty === parked
                ? "Filled and empty are the same! How many empty?"
                : (empty > parked ? "Which is more — filled or empty?" : "How many empty spots?");
              if (empty === parked) {
                say("How many empty spots?");
                renderChoices(uniqueNumsNear(empty, 0, hardMax, 3).map(v => ({ label: v, value: v })), empty);
              } else if (empty > parked) {
                say("Which has more?");
                renderChoices([
                  { label: "Filled " + parked, value: "filled" },
                  { label: "Empty " + empty, value: "empty" },
                ], "empty");
              } else {
                say("How many empty spots?");
                renderChoices(uniqueNumsNear(empty, 0, hardMax, 3).map(v => ({ label: v, value: v })), empty);
              }
            }
          });
        });
        choicesEl.innerHTML = "";
      }

      /** 3) Picnic Preparation — mixed picnic items like Toy Shop shelves */
      function buildPicnicRound() {
        const { min, max, hardMax } = qcRange();
        const friends = randInt(Math.max(2, min), Math.min(max, 8));
        const PICNIC = [
          { id: "cup", singular: "cup", plural: "cups", speak: "cup" },
          { id: "plate", singular: "plate", plural: "plates", speak: "plate" },
          { id: "sandwich", singular: "sandwich", plural: "sandwiches", speak: "sandwich" },
          { id: "apple", singular: "apple", plural: "apples", speak: "apple" },
          { id: "banana", singular: "banana", plural: "bananas", speak: "banana" },
          { id: "juice", singular: "juice bottle", plural: "juice bottles", speak: "juice" },
        ];
        const wanted = PICNIC[randInt(0, PICNIC.length - 1)];
        const need = friends;
        const distractors = randInt(2, 4);
        const shelf = [];
        for (let i = 0; i < need; i++) shelf.push(wanted.id);
        for (let i = 0; i < distractors; i++) {
          let other = PICNIC[randInt(0, PICNIC.length - 1)].id;
          while (other === wanted.id) other = PICNIC[randInt(0, PICNIC.length - 1)].id;
          shelf.push(other);
        }
        for (let i = shelf.length - 1; i > 0; i--) {
          const j = randInt(0, i);
          const tmp = shelf[i]; shelf[i] = shelf[j]; shelf[j] = tmp;
        }
        let packed = 0;
        wrongTries = 0;
        const orderLabel = need === 1 ? wanted.singular : wanted.plural;
        promptEl.textContent = "Pick " + need + " " + orderLabel + " for the picnic!";
        say("Pick " + nameOf(need) + " " + wanted.speak + (need > 1 ? "s" : ""));

        function picnicFig(kind, extra, size) {
          return `<button type="button" class="le-nm-qc-supply-item le-nm-qc-obj is-${kind}${extra ? " " + extra : ""}" data-kind="${kind}" aria-label="${kind}">${qcIcon(kind, size || 70)}</button>`;
        }

        stageEl.innerHTML = `
          <div class="le-nm-qc le-nm-qc-picnic">
            <div class="le-nm-qc-scene is-picnic">
              <div class="le-nm-qc-scene-top">
                <span aria-hidden="true">${qcIcon("tablecloth", 48)}</span>
                <div class="le-nm-shop-sign">Picnic Time</div>
                <span aria-hidden="true">${qcIcon("basket", 48)}</span>
              </div>
              <div class="le-nm-qc-friends">
                ${Array.from({ length: friends }, () =>
                  `<span class="le-nm-qc-friend" aria-hidden="true">${qcIcon("doll", 42)}</span>`
                ).join("")}
              </div>
              <div class="le-nm-shop-bubble le-nm-qc-order-bubble">
                ${qcIcon(wanted.id, 44)}
                <strong>× ${need}</strong>
              </div>
              <div class="le-nm-qc-blanket" id="leQcBlanket">
                <span class="le-nm-qc-basket-ico" aria-hidden="true">${qcIcon("basket", 40)}</span>
                <span id="leQcPicnicCount">0 / ${need}</span>
              </div>
              <div class="le-nm-qc-supply" id="leQcSupply">
                ${shelf.map((k) => picnicFig(k)).join("")}
              </div>
            </div>
            <p class="le-nm-tap-hint">Tap the matching ${wanted.plural} onto the picnic blanket</p>
          </div>`;
        const blanket = stageEl.querySelector("#leQcBlanket");
        const countEl = stageEl.querySelector("#leQcPicnicCount");
        stageEl.querySelectorAll("#leQcSupply .le-nm-qc-supply-item").forEach((btn) => {
          btn.addEventListener("click", () => {
            if (locked || btn.classList.contains("is-used") || packed >= need) return;
            const kind = btn.getAttribute("data-kind");
            if (kind !== wanted.id) {
              snd.wrong();
              btn.classList.add("is-shake");
              setTimeout(() => btn.classList.remove("is-shake"), 400);
              onWrong("Find the " + wanted.speak + "!");
              return;
            }
            btn.classList.add("is-used");
            packed++;
            countEl.textContent = packed + " / " + need;
            const bit = document.createElement("span");
            bit.className = "le-nm-qc-supply-item is-" + kind + " is-on-blanket";
            bit.innerHTML = qcIcon(kind, 40);
            blanket.appendChild(bit);
            qcBounce(bit);
            snd.pop();
            say(nameOf(packed));
            if (packed === need) {
              confetti(10);
              promptEl.textContent = "Picnic ready! How many " + wanted.plural + "?";
              say("How many " + wanted.speak + "s?");
              renderChoices(uniqueNumsNear(need, min, hardMax, 3).map(v => ({ label: v, value: v })), need);
            }
          });
        });
        choicesEl.innerHTML = "";
      }

      /* ---- Growing Garden — 6 distinct gardening experiences ---- */

      function gardenScene(title, extraTop, body, hint) {
        return `
          <div class="le-nm-qc le-nm-qc-grow">
            <div class="le-nm-qc-scene is-garden">
              <div class="le-nm-qc-scene-top">
                <span aria-hidden="true">${qcIcon("tree", 48)}</span>
                <div class="le-nm-shop-sign">${title}</div>
                <span aria-hidden="true">${extraTop || qcIcon("butterfly", 44)}</span>
              </div>
              ${body}
            </div>
            <p class="le-nm-tap-hint" id="leQcGrowHint">${hint || ""}</p>
          </div>`;
      }

      function gardenAskHowMany(label, speakWord, n, minN, maxN) {
        confetti(10);
        promptEl.textContent = "How many " + label + "?";
        say("How many " + speakWord + "?");
        const hint = stageEl.querySelector("#leQcGrowHint");
        if (hint) hint.textContent = "Great gardening!";
        renderChoices(uniqueNumsNear(n, minN, maxN, 3).map(v => ({ label: v, value: v })), n);
      }

      /** 1) Plant the Seeds — drag/tap matching seeds into soil plots */
      function buildGardenSeedsRound() {
        const { min, max, hardMax } = qcRange();
        const SEEDS = [
          { id: "seed", singular: "seed", plural: "seeds", speak: "seed" },
          { id: "seedpack", singular: "seed pack", plural: "seed packs", speak: "seed pack" },
        ];
        // Use visual seed variants via tone + also allow flower/seed as plantable kinds
        const kinds = ["seed", "carrot", "tomato"];
        const labels = {
          seed: { singular: "flower seed", plural: "flower seeds", speak: "seed" },
          carrot: { singular: "carrot seed", plural: "carrot seeds", speak: "carrot seed" },
          tomato: { singular: "tomato seed", plural: "tomato seeds", speak: "tomato seed" },
        };
        const wanted = kinds[randInt(0, kinds.length - 1)];
        const need = randInt(Math.max(1, min), Math.min(max, 5));
        const plots = need + randInt(1, 3);
        const pool = [];
        for (let i = 0; i < need; i++) pool.push(wanted);
        while (pool.length < need + randInt(2, 4)) {
          let other = kinds[randInt(0, kinds.length - 1)];
          while (other === wanted) other = kinds[randInt(0, kinds.length - 1)];
          pool.push(other);
        }
        for (let i = pool.length - 1; i > 0; i--) {
          const j = randInt(0, i); const t = pool[i]; pool[i] = pool[j]; pool[j] = t;
        }
        let planted = 0;
        let selected = null;
        wrongTries = 0;
        const meta = labels[wanted];
        const seedLabel = need === 1 ? meta.singular : meta.plural;
        promptEl.textContent = "Plant " + need + " " + seedLabel + " in the soil!";
        say("Plant " + nameOf(need) + " " + meta.speak + (need > 1 ? "s" : ""));
        stageEl.innerHTML = gardenScene("Plant the Seeds", qcIcon("seedpack", 44), `
          <div class="le-nm-g-order">${qcIcon(wanted, 44)}<strong>× ${need}</strong></div>
          <div class="le-nm-g-plots" id="leGPlots">
            ${Array.from({ length: plots }, (_, i) =>
              `<button type="button" class="le-nm-g-plot" data-i="${i}" aria-label="soil plot ${i + 1}">
                ${qcIcon("soil", 52)}
                <span class="le-nm-g-plot-slot"></span>
              </button>`
            ).join("")}
          </div>
          <div class="le-nm-g-pool" id="leGPool">
            ${pool.map((k, i) =>
              `<button type="button" class="le-nm-g-item" data-kind="${k}" draggable="true" aria-label="${k}">${qcIcon(k, 64, i % 3)}</button>`
            ).join("")}
          </div>
          <div class="le-nm-g-count" id="leGCount">0 / ${need}</div>
        `, "Tap a seed, then tap an empty soil plot");
        choicesEl.innerHTML = "";
        const countEl = stageEl.querySelector("#leGCount");

        function plantInto(plot) {
          if (locked || !selected || plot.classList.contains("is-full") || planted >= need) return;
          const kind = selected.getAttribute("data-kind");
          if (kind !== wanted) {
            snd.wrong();
            selected.classList.add("is-shake");
            setTimeout(() => selected.classList.remove("is-shake"), 400);
            onWrong("Find the " + meta.speak + "!");
            return;
          }
          plot.classList.add("is-full");
          plot.querySelector(".le-nm-g-plot-slot").innerHTML = qcIcon(kind, 40);
          selected.classList.add("is-used");
          selected.classList.remove("is-selected");
          selected = null;
          planted++;
          countEl.textContent = planted + " / " + need;
          qcBounce(plot);
          snd.pop();
          say(nameOf(planted));
          if (planted === need) gardenAskHowMany(meta.plural, meta.speak, need, min, hardMax);
        }

        stageEl.querySelectorAll("#leGPool .le-nm-g-item").forEach((btn) => {
          btn.addEventListener("click", () => {
            if (locked || btn.classList.contains("is-used")) return;
            stageEl.querySelectorAll("#leGPool .le-nm-g-item").forEach((x) => x.classList.remove("is-selected"));
            btn.classList.add("is-selected");
            selected = btn;
            snd.pop();
          });
          btn.addEventListener("dragstart", (e) => {
            if (locked || btn.classList.contains("is-used")) { e.preventDefault(); return; }
            selected = btn;
            try { e.dataTransfer.setData("text/plain", btn.getAttribute("data-kind")); } catch (err) { /* ignore */ }
          });
        });
        stageEl.querySelectorAll(".le-nm-g-plot").forEach((plot) => {
          plot.addEventListener("click", () => plantInto(plot));
          plot.addEventListener("dragover", (e) => e.preventDefault());
          plot.addEventListener("drop", (e) => { e.preventDefault(); plantInto(plot); });
        });
      }

      /** 2) Water the Garden — water thirsty plants one by one */
      function buildGardenWaterRound() {
        const { min, max, hardMax } = qcRange();
        const need = randInt(Math.max(2, min), Math.min(max, 6));
        const total = need + randInt(1, 3);
        let watered = 0;
        wrongTries = 0;
        promptEl.textContent = "Water " + need + " thirsty plants!";
        say("Water " + nameOf(need) + " plants");
        const plants = Array.from({ length: total }, (_, i) =>
          `<button type="button" class="le-nm-g-thirsty" data-i="${i}" aria-label="plant ${i + 1}">
            <span class="le-nm-g-thirsty-top">${qcIcon(i % 2 ? "plant" : "flower", 48, i % 3)}</span>
            <span class="le-nm-g-thirsty-pot">${qcIcon("soilpot", 40)}</span>
          </button>`
        ).join("");
        stageEl.innerHTML = gardenScene("Water the Garden", qcIcon("can", 48), `
          <div class="le-nm-g-can-row">
            <button type="button" class="le-nm-g-can is-selected" id="leGCan" aria-label="watering can">${qcIcon("can", 64)}</button>
            <span class="le-nm-g-count" id="leGCount">0 / ${need}</span>
          </div>
          <div class="le-nm-g-thirsty-row" id="leGPlants">${plants}</div>
        `, "Tap each thirsty plant to water it");
        choicesEl.innerHTML = "";
        const countEl = stageEl.querySelector("#leGCount");
        stageEl.querySelectorAll(".le-nm-g-thirsty").forEach((btn) => {
          btn.addEventListener("click", () => {
            if (locked || btn.classList.contains("is-watered") || watered >= need) return;
            btn.classList.add("is-watered", "is-watering-anim");
            btn.querySelector(".le-nm-g-thirsty-top").innerHTML = qcIcon("flower", 52, Number(btn.getAttribute("data-i")) % 3);
            watered++;
            countEl.textContent = watered + " / " + need;
            qcBounce(btn);
            snd.pop();
            say(nameOf(watered));
            if (watered === need) {
              stageEl.querySelectorAll(".le-nm-g-thirsty:not(.is-watered)").forEach((p) => p.classList.add("is-dim"));
              gardenAskHowMany("plants you watered", "plants", need, min, hardMax);
            }
          });
        });
      }

      /** 3) Harvest Time — pick ripe produce into a basket */
      function buildGardenHarvestRound() {
        const { min, max, hardMax } = qcRange();
        const CROPS = [
          { id: "carrot", singular: "carrot", plural: "carrots", speak: "carrot" },
          { id: "tomato", singular: "tomato", plural: "tomatoes", speak: "tomato" },
          { id: "berry", singular: "berry", plural: "berries", speak: "berry" },
          { id: "apple", singular: "apple", plural: "apples", speak: "apple" },
        ];
        const wanted = CROPS[randInt(0, CROPS.length - 1)];
        const need = randInt(Math.max(1, min), Math.min(max, 6));
        const field = [];
        for (let i = 0; i < need; i++) field.push(wanted.id);
        for (let i = 0; i < randInt(3, 5); i++) {
          let other = CROPS[randInt(0, CROPS.length - 1)].id;
          while (other === wanted.id) other = CROPS[randInt(0, CROPS.length - 1)].id;
          field.push(other);
        }
        for (let i = field.length - 1; i > 0; i--) {
          const j = randInt(0, i); const t = field[i]; field[i] = field[j]; field[j] = t;
        }
        let picked = 0;
        wrongTries = 0;
        const label = need === 1 ? wanted.singular : wanted.plural;
        promptEl.textContent = "Harvest " + need + " " + label + "!";
        say("Pick " + nameOf(need) + " " + wanted.speak + (need > 1 ? "s" : ""));
        stageEl.innerHTML = gardenScene("Harvest Time", qcIcon("basket", 48), `
          <div class="le-nm-g-order">${qcIcon(wanted.id, 44)}<strong>× ${need}</strong></div>
          <div class="le-nm-g-basket" id="leGBasket">
            <span id="leGCount">0 / ${need}</span>
            <div class="le-nm-g-basket-items" id="leGItems"></div>
          </div>
          <div class="le-nm-g-pool" id="leGPool">
            ${field.map((k, i) =>
              `<button type="button" class="le-nm-g-item is-crop" data-kind="${k}" aria-label="${k}">${qcIcon(k, 64, i % 3)}</button>`
            ).join("")}
          </div>
        `, "Tap the ripe " + wanted.plural + " to put them in the basket");
        choicesEl.innerHTML = "";
        const countEl = stageEl.querySelector("#leGCount");
        const itemsEl = stageEl.querySelector("#leGItems");
        stageEl.querySelectorAll("#leGPool .le-nm-g-item").forEach((btn) => {
          btn.addEventListener("click", () => {
            if (locked || btn.classList.contains("is-used") || picked >= need) return;
            const kind = btn.getAttribute("data-kind");
            if (kind !== wanted.id) {
              snd.wrong();
              btn.classList.add("is-shake");
              setTimeout(() => btn.classList.remove("is-shake"), 400);
              onWrong("Pick the " + wanted.speak + "!");
              return;
            }
            btn.classList.add("is-used");
            picked++;
            countEl.textContent = picked + " / " + need;
            itemsEl.insertAdjacentHTML("beforeend", `<span class="le-nm-g-caught">${qcIcon(kind, 36)}</span>`);
            qcBounce(itemsEl.lastElementChild);
            snd.pop();
            say(nameOf(picked));
            if (picked === need) gardenAskHowMany(wanted.plural, wanted.speak, need, min, hardMax);
          });
        });
      }

      /** 4) Garden Visitors — guide bees/butterflies/ladybugs to flowers */
      function buildGardenVisitorsRound() {
        const { min, max, hardMax } = qcRange();
        const BUGS = [
          { id: "bee", singular: "bee", plural: "bees", speak: "bee" },
          { id: "butterfly", singular: "butterfly", plural: "butterflies", speak: "butterfly" },
          { id: "ladybug", singular: "ladybug", plural: "ladybugs", speak: "ladybug" },
        ];
        const wanted = BUGS[randInt(0, BUGS.length - 1)];
        const need = randInt(Math.max(2, min), Math.min(max, 6));
        const visitors = [];
        for (let i = 0; i < need; i++) visitors.push(wanted.id);
        for (let i = 0; i < randInt(3, 5); i++) {
          let other = BUGS[randInt(0, BUGS.length - 1)].id;
          while (other === wanted.id) other = BUGS[randInt(0, BUGS.length - 1)].id;
          visitors.push(other);
        }
        for (let i = visitors.length - 1; i > 0; i--) {
          const j = randInt(0, i); const t = visitors[i]; visitors[i] = visitors[j]; visitors[j] = t;
        }
        let guided = 0;
        let selected = null;
        wrongTries = 0;
        const label = need === 1 ? wanted.singular : wanted.plural;
        promptEl.textContent = "Guide " + need + " " + label + " to the flowers!";
        say("Find " + nameOf(need) + " " + wanted.speak + (need > 1 ? "s" : ""));
        stageEl.innerHTML = gardenScene("Garden Visitors", qcIcon("bee", 44), `
          <div class="le-nm-g-order">${qcIcon(wanted.id, 44)}<strong>× ${need}</strong></div>
          <div class="le-nm-g-flowerbed is-drop" id="leGBed">
            ${Array.from({ length: 3 }, (_, i) => `<span aria-hidden="true">${qcIcon("flower", 40, i)}</span>`).join("")}
            <span class="le-nm-g-count" id="leGCount">0 / ${need}</span>
            <div class="le-nm-g-basket-items" id="leGItems"></div>
          </div>
          <div class="le-nm-g-pool" id="leGPool">
            ${visitors.map((k, i) =>
              `<button type="button" class="le-nm-g-item is-bug" data-kind="${k}" draggable="true" aria-label="${k}">${qcIcon(k, 64)}</button>`
            ).join("")}
          </div>
        `, "Tap a visitor, then tap the flower bed — or drag them");
        choicesEl.innerHTML = "";
        const bed = stageEl.querySelector("#leGBed");
        const countEl = stageEl.querySelector("#leGCount");
        const itemsEl = stageEl.querySelector("#leGItems");

        function guide(node) {
          if (locked || !node || node.classList.contains("is-used") || guided >= need) return;
          const kind = node.getAttribute("data-kind");
          if (kind !== wanted.id) {
            snd.wrong();
            node.classList.add("is-shake");
            setTimeout(() => node.classList.remove("is-shake"), 400);
            onWrong("Find the " + wanted.speak + "!");
            return;
          }
          node.classList.add("is-used");
          node.classList.remove("is-selected");
          guided++;
          countEl.textContent = guided + " / " + need;
          itemsEl.insertAdjacentHTML("beforeend", `<span class="le-nm-g-caught">${qcIcon(kind, 36)}</span>`);
          qcBounce(itemsEl.lastElementChild);
          snd.pop();
          say(nameOf(guided));
          selected = null;
          if (guided === need) gardenAskHowMany(wanted.plural, wanted.speak, need, min, hardMax);
        }

        stageEl.querySelectorAll("#leGPool .le-nm-g-item").forEach((btn) => {
          btn.addEventListener("click", () => {
            if (locked || btn.classList.contains("is-used")) return;
            if (btn.getAttribute("data-kind") === wanted.id) { guide(btn); return; }
            stageEl.querySelectorAll("#leGPool .le-nm-g-item").forEach((x) => x.classList.remove("is-selected"));
            btn.classList.add("is-selected");
            selected = btn;
            snd.pop();
            onWrong("That is not a " + wanted.speak + "!");
          });
          btn.addEventListener("dragstart", (e) => {
            if (locked || btn.classList.contains("is-used")) { e.preventDefault(); return; }
            selected = btn;
            try { e.dataTransfer.setData("text/plain", btn.getAttribute("data-kind")); } catch (err) { /* ignore */ }
          });
        });
        bed.addEventListener("click", () => { if (selected) guide(selected); });
        bed.addEventListener("dragover", (e) => e.preventDefault());
        bed.addEventListener("drop", (e) => { e.preventDefault(); guide(selected); });
      }

      /** 5) Garden Arrangement — place pots into garden spots */
      function buildGardenArrangeRound() {
        const { min, max, hardMax } = qcRange();
        const spots = Math.min(10, Math.max(min + 1, randInt(min + 1, Math.min(max + 2, 9))));
        const need = randInt(Math.max(1, min), Math.min(spots - 1, max));
        let placed = 0;
        wrongTries = 0;
        promptEl.textContent = "Arrange " + need + " flower pots in the garden!";
        say("Place " + nameOf(need) + " pots");
        stageEl.innerHTML = gardenScene("Garden Arrangement", qcIcon("tool", 44), `
          <div class="le-nm-g-spots" id="leGSpots">
            ${Array.from({ length: spots }, (_, i) =>
              `<button type="button" class="le-nm-g-spot" data-i="${i}" aria-label="garden spot ${i + 1}">
                <span class="le-nm-g-spot-num">${i + 1}</span>
                ${qcIcon("soil", 40)}
              </button>`
            ).join("")}
          </div>
          <div class="le-nm-g-pool" id="leGPool">
            ${Array.from({ length: need + 2 }, (_, i) =>
              `<button type="button" class="le-nm-g-item is-pot" data-tone="${i % 3}" aria-label="flower pot">
                <span class="le-nm-g-potstack">${qcIcon("flower", 36, i % 3)}${qcIcon("soilpot", 40)}</span>
              </button>`
            ).join("")}
          </div>
          <div class="le-nm-g-count" id="leGCount">0 / ${need}</div>
        `, "Tap a pot, then tap an empty garden spot");
        choicesEl.innerHTML = "";
        const countEl = stageEl.querySelector("#leGCount");
        let selected = null;
        stageEl.querySelectorAll("#leGPool .le-nm-g-item").forEach((btn) => {
          btn.addEventListener("click", () => {
            if (locked || btn.classList.contains("is-used")) return;
            stageEl.querySelectorAll("#leGPool .le-nm-g-item").forEach((x) => x.classList.remove("is-selected"));
            btn.classList.add("is-selected");
            selected = btn;
            snd.pop();
          });
        });
        stageEl.querySelectorAll(".le-nm-g-spot").forEach((spot) => {
          spot.addEventListener("click", () => {
            if (locked || !selected || spot.classList.contains("is-full") || placed >= need) return;
            const tone = Number(selected.getAttribute("data-tone") || 0);
            spot.classList.add("is-full");
            spot.insertAdjacentHTML("beforeend",
              `<span class="le-nm-g-placed">${qcIcon("flower", 32, tone)}${qcIcon("soilpot", 36)}</span>`);
            selected.classList.add("is-used");
            selected.classList.remove("is-selected");
            selected = null;
            placed++;
            countEl.textContent = placed + " / " + need;
            qcBounce(spot);
            snd.pop();
            say(nameOf(placed));
            if (placed === need) {
              const empty = spots - placed;
              confetti(8);
              if (empty !== placed && Math.random() > 0.4) {
                promptEl.textContent = "How many pots did you place?";
                say("How many pots?");
                renderChoices(uniqueNumsNear(need, min, hardMax, 3).map(v => ({ label: v, value: v })), need);
              } else {
                promptEl.textContent = "How many empty spots are left?";
                say("How many empty spots?");
                renderChoices(uniqueNumsNear(empty, 0, hardMax, 3).map(v => ({ label: v, value: v })), empty);
              }
            }
          });
        });
      }

      /** 6) Watch It Grow — sequence seed → sprout → plant → flower + quantity change */
      function buildGardenWatchGrowRound() {
        const { min, max, hardMax } = qcRange();
        const stages = ["seed", "sprout", "plant", "flower"];
        const stageNames = ["seed", "sprout", "plant", "flower"];
        const startCount = randInt(Math.max(2, min), Math.min(max, 5));
        let stage = 0;
        wrongTries = 0;
        promptEl.textContent = "Watch the garden grow — tap Grow!";
        say("Tap grow");

        function paintStage(s, count) {
          const kind = stages[s];
          return Array.from({ length: count }, (_, i) =>
            `<span class="le-nm-g-growcell is-${kind}" aria-hidden="true">${qcIcon(kind, 56, i % 3)}</span>`
          ).join("");
        }

        stageEl.innerHTML = gardenScene("Watch It Grow", qcIcon("sprout", 44), `
          <div class="le-nm-g-stage-rail">
            ${stages.map((k, i) =>
              `<span class="le-nm-g-stage-dot${i === 0 ? " is-on" : ""}" data-s="${i}">${qcIcon(k, 28)}</span>`
            ).join("")}
          </div>
          <div class="le-nm-g-growrow" id="leGGrow">${paintStage(0, startCount)}</div>
          <button type="button" class="le-nm-g-growbtn" id="leGGrowBtn">Grow!</button>
          <div class="le-nm-g-count" id="leGCount">${startCount} seeds</div>
        `, "Tap Grow to see the next stage");
        choicesEl.innerHTML = "";
        const row = stageEl.querySelector("#leGGrow");
        const btn = stageEl.querySelector("#leGGrowBtn");
        const countEl = stageEl.querySelector("#leGCount");

        btn.addEventListener("click", () => {
          if (locked) return;
          if (stage >= stages.length - 1) return;
          stage++;
          row.innerHTML = paintStage(stage, startCount);
          row.querySelectorAll(".le-nm-g-growcell").forEach((c, i) => setTimeout(() => qcBounce(c), i * 40));
          stageEl.querySelectorAll(".le-nm-g-stage-dot").forEach((d) => {
            d.classList.toggle("is-on", Number(d.getAttribute("data-s")) <= stage);
          });
          countEl.textContent = startCount + " " + stageNames[stage] + (startCount > 1 ? "s" : "");
          snd.pop();
          say(stageNames[stage]);
          if (stage === stages.length - 1) {
            btn.disabled = true;
            btn.textContent = "Bloomed!";
            setTimeout(() => {
              // Quantity-change challenge: same count, identify stage OR how many flowers now
              if (Math.random() > 0.4) {
                promptEl.textContent = "How many flowers grew?";
                say("How many flowers?");
                renderChoices(uniqueNumsNear(startCount, min, hardMax, 3).map(v => ({ label: v, value: v })), startCount);
              } else {
                promptEl.textContent = "What did the seeds become?";
                say("What did they become?");
                const opts = [
                  { label: "Seeds", value: "seed", icon: "seed" },
                  { label: "Flowers", value: "flower", icon: "flower" },
                  { label: "Sprouts", value: "sprout", icon: "sprout" },
                ];
                choicesEl.innerHTML = "";
                shuffle(opts).forEach((opt) => {
                  const b = document.createElement("button");
                  b.type = "button";
                  b.className = "le-nm-choice le-nm-g-choice";
                  b.innerHTML = qcIcon(opt.icon, 44) + "<span>" + opt.label + "</span>";
                  b.addEventListener("click", () => {
                    if (locked) return;
                    if (opt.value === "flower") {
                      b.classList.add("is-correct");
                      onCorrect("They became flowers!");
                    } else {
                      b.classList.add("is-wrong");
                      onWrong("Watch again — seeds grow into flowers!");
                    }
                  });
                  choicesEl.appendChild(b);
                });
              }
              confetti(10);
            }, 500);
          }
        });
      }

      function buildGrowGardenRound() {
        // Legacy fallback — route by round through experiences if old type remains
        const modes = [
          buildGardenSeedsRound,
          buildGardenWaterRound,
          buildGardenHarvestRound,
          buildGardenVisitorsRound,
          buildGardenArrangeRound,
          buildGardenWatchGrowRound,
        ];
        modes[round % modes.length]();
      }

      /** 5) Aquarium Inspector — explore underwater zones, collect & compare species */
      function buildAquariumRound() {
        const { min, max, hardMax } = qcRange();
        const SEA = [
          { id: "fish", singular: "tropical fish", plural: "tropical fish", speak: "fish" },
          { id: "turtle", singular: "sea turtle", plural: "sea turtles", speak: "turtle" },
          { id: "jellyfish", singular: "jellyfish", plural: "jellyfish", speak: "jellyfish" },
          { id: "starfish", singular: "starfish", plural: "starfish", speak: "starfish" },
          { id: "octopus", singular: "octopus", plural: "octopuses", speak: "octopus" },
          { id: "crab", singular: "crab", plural: "crabs", speak: "crab" },
          { id: "seahorse", singular: "seahorse", plural: "seahorses", speak: "seahorse" },
          { id: "shell", singular: "seashell", plural: "seashells", speak: "shell" },
        ];
        const ZONES = [
          { id: "reef", title: "Coral Reef", decor: ["coral", "seaweed", "pebble", "bubble", "rock"] },
          { id: "lagoon", title: "Blue Lagoon", decor: ["seaweed", "bubble", "shell", "pebble", "coral"] },
          { id: "cave", title: "Treasure Cave", decor: ["cave", "treasure", "rock", "pebble", "bubble"] },
        ];
        const wanted = SEA[randInt(0, SEA.length - 1)];
        const need = randInt(Math.max(2, min), Math.min(max, round < 2 ? 5 : Math.min(max, 7)));
        // Prefer collect missions; occasional zone-compare for variety
        const mode = round > 0 && Math.random() < 0.35 ? "zone" : "collect";
        wrongTries = 0;

        // Build creature placement: ensure `need` of wanted + distractors across zones
        const creatures = [];
        for (let i = 0; i < need; i++) {
          creatures.push({ kind: wanted.id, tone: i % 6, zone: i % 3 });
        }
        const distractorN = randInt(5, 8);
        for (let i = 0; i < distractorN; i++) {
          let other = SEA[randInt(0, SEA.length - 1)].id;
          while (other === wanted.id) other = SEA[randInt(0, SEA.length - 1)].id;
          creatures.push({ kind: other, tone: i % 6, zone: randInt(0, 2) });
        }
        for (let i = creatures.length - 1; i > 0; i--) {
          const j = randInt(0, i);
          const tmp = creatures[i]; creatures[i] = creatures[j]; creatures[j] = tmp;
        }
        // Re-assign zones evenly after shuffle for visual balance
        creatures.forEach((c, i) => { c.zone = i % 3; });

        function zoneCreatureCounts(kind) {
          return [0, 1, 2].map((z) => creatures.filter((c) => c.zone === z && c.kind === kind).length);
        }

        function decorHtml(zone) {
          return zone.decor.map((k, i) =>
            `<span class="le-nm-aqua-decor is-${k} d${i}" aria-hidden="true">${qcIcon(k, k === "bubble" ? 18 : (k === "cave" || k === "treasure" ? 40 : 32))}</span>`
          ).join("");
        }

        function creatureBtn(c, idx) {
          return `<button type="button" class="le-nm-aqua-critter is-${c.kind}" data-kind="${c.kind}" data-tone="${c.tone}" data-i="${idx}" draggable="true" aria-label="${c.kind}">${qcIcon(c.kind, 58, c.tone)}</button>`;
        }

        const byZone = [[], [], []];
        creatures.forEach((c, idx) => {
          c.idx = idx;
          byZone[c.zone].push(creatureBtn(c, idx));
        });

        if (mode === "collect") {
          let found = 0;
          const orderLabel = need === 1 ? wanted.singular : wanted.plural;
          promptEl.textContent = "Inspect the aquarium — find " + need + " " + orderLabel + "!";
          say("Find " + nameOf(need) + " " + wanted.speak + (need > 1 && wanted.speak !== "fish" && wanted.speak !== "jellyfish" && wanted.speak !== "starfish" ? "s" : ""));
          stageEl.innerHTML = `
            <div class="le-nm-qc le-nm-qc-aqua">
              <div class="le-nm-qc-scene is-aqua">
                <div class="le-nm-qc-scene-top">
                  <span aria-hidden="true">${qcIcon("turtle", 44)}</span>
                  <div class="le-nm-shop-sign">Aquarium Inspector</div>
                  <span aria-hidden="true">${qcIcon("treasure", 44)}</span>
                </div>
                <div class="le-nm-aqua-clipboard">
                  ${qcIcon(wanted.id, 48, 0)}
                  <div>
                    <strong>Find × ${need}</strong>
                    <span>${wanted.plural}</span>
                  </div>
                </div>
                <div class="le-nm-aqua-zones" id="leAquaZones">
                  ${ZONES.map((z, zi) => `
                    <div class="le-nm-aqua-zone is-${z.id}" data-zone="${zi}">
                      <div class="le-nm-aqua-zone-title">${z.title}</div>
                      <div class="le-nm-aqua-zone-water">
                        ${decorHtml(z)}
                        <div class="le-nm-aqua-critters">${byZone[zi].join("")}</div>
                      </div>
                    </div>`).join("")}
                </div>
                <div class="le-nm-aqua-net is-drop" id="leAquaNet">
                  <span class="le-nm-aqua-net-label" id="leAquaCount">0 / ${need}</span>
                  <div class="le-nm-aqua-net-items" id="leAquaItems"></div>
                </div>
              </div>
              <p class="le-nm-tap-hint">Tap or drag the matching sea creatures into the net</p>
            </div>`;

          const net = stageEl.querySelector("#leAquaNet");
          const itemsEl = stageEl.querySelector("#leAquaItems");
          const countEl = stageEl.querySelector("#leAquaCount");
          let selected = null;
          choicesEl.innerHTML = "";

          function collect(node) {
            if (locked || !node || node.classList.contains("is-used") || found >= need) return;
            const kind = node.getAttribute("data-kind");
            if (kind !== wanted.id) {
              snd.wrong();
              node.classList.add("is-shake");
              setTimeout(() => node.classList.remove("is-shake"), 400);
              onWrong("Look for the " + wanted.speak + "!");
              return;
            }
            const tone = Number(node.getAttribute("data-tone") || 0);
            node.classList.add("is-used");
            node.classList.remove("is-selected");
            found++;
            countEl.textContent = found + " / " + need;
            itemsEl.insertAdjacentHTML("beforeend",
              `<span class="le-nm-aqua-caught" aria-hidden="true">${qcIcon(kind, 36, tone)}</span>`);
            qcBounce(itemsEl.lastElementChild);
            snd.pop();
            say(nameOf(found));
            selected = null;
            if (found === need) {
              confetti(12);
              promptEl.textContent = "Inspection complete! How many " + wanted.plural + "?";
              say("How many " + wanted.speak + "?");
              stageEl.querySelector(".le-nm-tap-hint").textContent = "You found every " + wanted.singular + "!";
              net.classList.add("is-done");
              renderChoices(uniqueNumsNear(need, min, hardMax, 3).map(v => ({ label: v, value: v })), need);
            }
          }

          stageEl.querySelectorAll(".le-nm-aqua-critter").forEach((node) => {
            node.addEventListener("click", () => {
              if (locked || node.classList.contains("is-used")) return;
              if (node.getAttribute("data-kind") === wanted.id) {
                collect(node);
                return;
              }
              stageEl.querySelectorAll(".le-nm-aqua-critter").forEach((x) => x.classList.remove("is-selected"));
              node.classList.add("is-selected");
              selected = node;
              snd.pop();
              node.classList.add("is-shake");
              setTimeout(() => node.classList.remove("is-shake"), 400);
              onWrong("That is not a " + wanted.speak + "!");
            });
            node.addEventListener("dragstart", (e) => {
              if (locked || node.classList.contains("is-used")) { e.preventDefault(); return; }
              selected = node;
              node.classList.add("is-dragging");
              try { e.dataTransfer.setData("text/plain", node.getAttribute("data-kind") || "sea"); } catch (err) { /* ignore */ }
              e.dataTransfer.effectAllowed = "move";
            });
            node.addEventListener("dragend", () => node.classList.remove("is-dragging"));
          });
          net.addEventListener("click", () => { if (selected) collect(selected); });
          net.addEventListener("dragover", (e) => { e.preventDefault(); net.classList.add("is-over"); });
          net.addEventListener("dragleave", () => net.classList.remove("is-over"));
          net.addEventListener("drop", (e) => {
            e.preventDefault();
            net.classList.remove("is-over");
            collect(selected);
          });
          return;
        }

        // Zone-compare mode: which zone has more of the wanted species?
        let finalCounts = zoneCreatureCounts(wanted.id);
        if (finalCounts[0] === finalCounts[1] && finalCounts[1] === finalCounts[2]) {
          const donor = creatures.find((c) => c.kind === wanted.id && c.zone !== 0);
          if (donor) donor.zone = 0;
          else {
            const convert = creatures.find((c) => c.kind !== wanted.id && c.zone === 0);
            if (convert) convert.kind = wanted.id;
          }
          finalCounts = zoneCreatureCounts(wanted.id);
        }
        // If still tied between top two, bump zone 0
        const maxCount = Math.max(...finalCounts);
        if (finalCounts.filter((n) => n === maxCount).length > 1) {
          const bump = creatures.find((c) => c.kind !== wanted.id && c.zone === 0);
          if (bump) bump.kind = wanted.id;
          else creatures.push({ kind: wanted.id, tone: 2, zone: 0, idx: creatures.length });
          finalCounts = zoneCreatureCounts(wanted.id);
        }
        const winner = finalCounts.indexOf(Math.max(...finalCounts));
        byZone[0] = []; byZone[1] = []; byZone[2] = [];
        creatures.forEach((c, idx) => { byZone[c.zone].push(creatureBtn(c, idx)); });

        promptEl.textContent = "Which zone has more " + wanted.plural + "?";
        say("Which zone has more " + wanted.speak + "?");
        stageEl.innerHTML = `
          <div class="le-nm-qc le-nm-qc-aqua">
            <div class="le-nm-qc-scene is-aqua">
              <div class="le-nm-qc-scene-top">
                <span aria-hidden="true">${qcIcon("seahorse", 44)}</span>
                <div class="le-nm-shop-sign">Aquarium Inspector</div>
                <span aria-hidden="true">${qcIcon("octopus", 44)}</span>
              </div>
              <div class="le-nm-aqua-clipboard">
                ${qcIcon(wanted.id, 48, 0)}
                <div>
                  <strong>Compare</strong>
                  <span>${wanted.plural}</span>
                </div>
              </div>
              <div class="le-nm-aqua-zones is-compare" id="leAquaZones">
                ${ZONES.map((z, zi) => `
                  <button type="button" class="le-nm-aqua-zone is-${z.id} is-pickable" data-zone="${zi}" aria-label="${z.title}">
                    <div class="le-nm-aqua-zone-title">${z.title}</div>
                    <div class="le-nm-aqua-zone-water">
                      ${decorHtml(z)}
                      <div class="le-nm-aqua-critters">${byZone[zi].join("")}</div>
                    </div>
                  </button>`).join("")}
              </div>
            </div>
            <p class="le-nm-tap-hint">Count the ${wanted.plural} in each zone, then tap the bigger zone</p>
          </div>`;
        choicesEl.innerHTML = "";
        // Critters in compare mode are visual only (pointer-events none via CSS on zone pick)
        stageEl.querySelectorAll(".le-nm-aqua-zone.is-pickable").forEach((zoneBtn) => {
          zoneBtn.addEventListener("click", () => {
            if (locked) return;
            qcBounce(zoneBtn);
            if (Number(zoneBtn.getAttribute("data-zone")) === winner) {
              confetti(10);
              onCorrect("Great inspecting!");
            } else onWrong("Count the " + wanted.speak + " in each zone again!");
          });
        });
      }

      /** 6) Birthday Party Planner — balloons + party decorations */
      function buildPartyRound() {
        const { min, max, hardMax } = qcRange();
        const PARTY = [
          { id: "balloon", singular: "balloon", plural: "balloons", speak: "balloon" },
          { id: "cupcake", singular: "cupcake", plural: "cupcakes", speak: "cupcake" },
          { id: "gift", singular: "gift", plural: "gifts", speak: "gift" },
          { id: "hat", singular: "party hat", plural: "party hats", speak: "hat" },
        ];
        const wanted = PARTY[Math.random() > 0.55 ? 0 : randInt(0, PARTY.length - 1)];
        const need = randInt(min, max);
        const distractors = randInt(2, 4);
        const pool = [];
        for (let i = 0; i < need; i++) pool.push(wanted.id);
        for (let i = 0; i < distractors; i++) {
          let other = PARTY[randInt(0, PARTY.length - 1)].id;
          while (other === wanted.id) other = PARTY[randInt(0, PARTY.length - 1)].id;
          pool.push(other);
        }
        for (let i = pool.length - 1; i > 0; i--) {
          const j = randInt(0, i);
          const tmp = pool[i]; pool[i] = pool[j]; pool[j] = tmp;
        }
        let hung = 0;
        wrongTries = 0;
        const orderLabel = need === 1 ? wanted.singular : wanted.plural;
        promptEl.textContent = "Hang " + need + " " + orderLabel + " for the party!";
        say("Hang " + nameOf(need) + " " + wanted.speak + (need > 1 ? "s" : ""));
        stageEl.innerHTML = `
          <div class="le-nm-qc le-nm-qc-party">
            <div class="le-nm-qc-scene is-party">
              <div class="le-nm-qc-scene-top">
                <span aria-hidden="true">${qcIcon("cake", 48)}</span>
                <div class="le-nm-shop-sign">Birthday Party</div>
                <span aria-hidden="true">${qcIcon("ribbon", 48)}</span>
              </div>
              <div class="le-nm-qc-party-decor" aria-hidden="true">
                ${["cake", "cupcake", "gift", "candle", "hat", "ribbon"].map((k) =>
                  `<span class="le-nm-qc-party-extra">${qcIcon(k, 46)}</span>`
                ).join("")}
              </div>
              <div class="le-nm-shop-bubble le-nm-qc-order-bubble">
                ${qcIcon(wanted.id, 44, 0)}
                <strong>× ${need}</strong>
              </div>
              <div class="le-nm-qc-string" id="leQcString">
                <span class="le-nm-qc-party-count" id="leQcHung">0 / ${need}</span>
              </div>
              <div class="le-nm-qc-balloon-pool" id="leQcBalloons">
                ${pool.map((k, i) =>
                  `<button type="button" class="le-nm-qc-balloon le-nm-qc-obj is-${k} tone-${i % 6}" data-kind="${k}" aria-label="${k}">${qcIcon(k, 70, i % 6)}</button>`
                ).join("")}
              </div>
            </div>
            <p class="le-nm-tap-hint">Tap the matching ${wanted.plural} to hang them up</p>
          </div>`;
        const stringEl = stageEl.querySelector("#leQcString");
        const hungEl = stageEl.querySelector("#leQcHung");
        stageEl.querySelectorAll("#leQcBalloons .le-nm-qc-balloon").forEach((btn) => {
          btn.addEventListener("click", () => {
            if (locked || btn.classList.contains("is-used") || hung >= need) return;
            const kind = btn.getAttribute("data-kind");
            if (kind !== wanted.id) {
              snd.wrong();
              btn.classList.add("is-shake");
              setTimeout(() => btn.classList.remove("is-shake"), 400);
              onWrong("Find the " + wanted.speak + "!");
              return;
            }
            const tone = Number(btn.className.match(/tone-(\d+)/)?.[1] || hung % 6);
            btn.classList.add("is-used");
            hung++;
            hungEl.textContent = hung + " / " + need;
            const b = document.createElement("span");
            b.className = "le-nm-qc-balloon is-hung is-" + kind;
            b.innerHTML = qcIcon(kind, 40, tone);
            stringEl.appendChild(b);
            qcBounce(b);
            snd.pop();
            say(nameOf(hung));
            if (hung === need) {
              confetti(12);
              promptEl.textContent = "Party time! How many " + wanted.plural + "?";
              say("How many " + wanted.speak + "s?");
              renderChoices(uniqueNumsNear(need, min, hardMax, 3).map(v => ({ label: v, value: v })), need);
            }
          });
        });
        choicesEl.innerHTML = "";
      }

      /* ========== Introduction to Addition — 6 unique experiences ========== */

      function iaRange() {
        const lo = Math.max(1, sub.min || 1);
        const hi = Math.min(10, sub.max || 5);
        const soft = round < 2 ? Math.min(hi, Math.max(lo + 1, lo + Math.floor((hi - lo) * 0.45))) : hi;
        return { min: lo, max: Math.max(lo, soft), hardMax: hi };
      }

      function iaSumPair(sumMax) {
        const maxSum = Math.max(2, sumMax);
        let a = randInt(1, Math.max(1, Math.floor(maxSum / 2)));
        let b = randInt(1, Math.max(1, maxSum - a));
        while (a + b > maxSum) b = randInt(1, Math.max(1, maxSum - a));
        if (a + b < 2) b = 1;
        return { a, b, sum: a + b };
      }

      function iaNum(n, size) {
        const s = size || 56;
        return `<span class="le-nm-ia-num" style="width:${s}px;height:${s}px;font-size:${Math.round(s * 0.48)}px">${n}</span>`;
      }

      function iaObjs(kind, count, size, cls) {
        return Array.from({ length: count }, (_, i) =>
          `<span class="le-nm-ia-obj ${cls || ""}" data-i="${i}">${qcIcon(kind, size || 52, i % 6)}</span>`
        ).join("");
      }

      function iaRevealTotal(sum, msg) {
        confetti(12);
        stageEl.insertAdjacentHTML("beforeend",
          `<div class="le-nm-ia-total-pop" id="leIaTotal">${iaNum(sum, 88)}<p>${msg || "Altogether!"}</p></div>`);
        say(nameOf(sum));
        setTimeout(() => onCorrect(msg || ("Altogether " + sum + "!")), 1100);
      }

      /** 1) Bring Them Together — drag two fruit groups into one basket */
      function buildIaTogetherRound() {
        const { max, hardMax } = iaRange();
        const fruits = ["apple", "banana", "strawberry", "orange", "grape"];
        const kind = fruits[randInt(0, fruits.length - 1)];
        const { a, b, sum } = iaSumPair(Math.min(max, 5));
        wrongTries = 0;
        let putA = false;
        let putB = false;
        promptEl.textContent = "Let's bring them together!";
        say("Let's bring them together");
        stageEl.innerHTML = `
          <div class="le-nm-ia le-nm-ia-together">
            <div class="le-nm-ia-scene is-fruit">
              <div class="le-nm-ia-mascot" aria-hidden="true">${qcIcon("doll", 52)}</div>
              <div class="le-nm-ia-groups">
                <div class="le-nm-ia-side is-left" id="leIaGroupA" data-side="a" draggable="true">
                  <span class="le-nm-ia-badge">${a}</span>
                  <div class="le-nm-ia-pile">${iaObjs(kind, a, 54)}</div>
                </div>
                <div class="le-nm-ia-basket is-drop" id="leIaBasket">
                  ${qcIcon("basket", 64)}
                  <div class="le-nm-ia-basket-items" id="leIaItems"></div>
                  <span class="le-nm-ia-basket-label">Basket</span>
                </div>
                <div class="le-nm-ia-side is-right" id="leIaGroupB" data-side="b" draggable="true">
                  <span class="le-nm-ia-badge">${b}</span>
                  <div class="le-nm-ia-pile">${iaObjs(kind, b, 54)}</div>
                </div>
              </div>
            </div>
            <p class="le-nm-tap-hint">Drag or tap each group into the basket</p>
          </div>`;
        choicesEl.innerHTML = "";
        const basket = stageEl.querySelector("#leIaBasket");
        const items = stageEl.querySelector("#leIaItems");
        let selected = null;

        function dropSide(side) {
          if (locked) return;
          if (side === "a" && putA) return;
          if (side === "b" && putB) return;
          const group = stageEl.querySelector(side === "a" ? "#leIaGroupA" : "#leIaGroupB");
          const count = side === "a" ? a : b;
          group.classList.add("is-empty");
          items.insertAdjacentHTML("beforeend", iaObjs(kind, count, 40, "is-in"));
          items.querySelectorAll(".le-nm-ia-obj.is-in:not(.is-popped)").forEach((n, i) => {
            n.classList.add("is-popped");
            setTimeout(() => qcBounce(n), i * 60);
          });
          if (side === "a") putA = true; else putB = true;
          snd.pop();
          say(nameOf(count));
          selected = null;
          if (putA && putB) {
            basket.classList.add("is-full");
            promptEl.textContent = "Counting altogether…";
            let said = 0;
            const bits = items.querySelectorAll(".le-nm-ia-obj");
            const tick = () => {
              if (said >= bits.length) {
                iaRevealTotal(sum, sum + " altogether!");
                return;
              }
              bits[said].classList.add("is-counted");
              say(nameOf(said + 1));
              said++;
              setTimeout(tick, 420);
            };
            setTimeout(tick, 350);
          }
        }

        stageEl.querySelectorAll(".le-nm-ia-side").forEach((sideEl) => {
          sideEl.addEventListener("click", () => {
            if (locked || sideEl.classList.contains("is-empty")) return;
            selected = sideEl.getAttribute("data-side");
            stageEl.querySelectorAll(".le-nm-ia-side").forEach((s) => s.classList.remove("is-selected"));
            sideEl.classList.add("is-selected");
            snd.pop();
          });
          sideEl.addEventListener("dragstart", (e) => {
            if (sideEl.classList.contains("is-empty")) { e.preventDefault(); return; }
            selected = sideEl.getAttribute("data-side");
            sideEl.classList.add("is-dragging");
            try { e.dataTransfer.setData("text/plain", selected); } catch (err) { /* ignore */ }
          });
          sideEl.addEventListener("dragend", () => sideEl.classList.remove("is-dragging"));
        });
        basket.addEventListener("click", () => { if (selected) dropSide(selected); });
        basket.addEventListener("dragover", (e) => { e.preventDefault(); basket.classList.add("is-over"); });
        basket.addEventListener("dragleave", () => basket.classList.remove("is-over"));
        basket.addEventListener("drop", (e) => {
          e.preventDefault();
          basket.classList.remove("is-over");
          if (selected) dropSide(selected);
        });
      }

      /** 2) Add One More — add exactly one object to a collection */
      function buildIaOneMoreRound() {
        const { min, max } = iaRange();
        const kinds = [
          { id: "carrot", who: "rabbit" },
          { id: "apple", who: "teddy" },
          { id: "flower", who: "rabbit" },
          { id: "berry", who: "cat" },
        ];
        const pick = kinds[randInt(0, kinds.length - 1)];
        const n = randInt(Math.max(1, min), Math.min(max, 4));
        const total = n + 1;
        wrongTries = 0;
        promptEl.textContent = "Add one more!";
        say("Add one more");
        stageEl.innerHTML = `
          <div class="le-nm-ia le-nm-ia-onemore">
            <div class="le-nm-ia-scene is-animal">
              <div class="le-nm-ia-hero">
                ${qcIcon(pick.who, 64)}
                <div class="le-nm-ia-collection" id="leIaColl">
                  <span class="le-nm-ia-badge" id="leIaBadge">${n}</span>
                  ${iaObjs(pick.id, n, 50)}
                </div>
              </div>
              <div class="le-nm-ia-choices-row" id="leIaPool">
                ${Array.from({ length: 4 }, (_, i) => {
                  const k = i === 0 ? pick.id : (i === 1 ? "flower" : (i === 2 ? "carrot" : "apple"));
                  return `<button type="button" class="le-nm-ia-pick" data-kind="${k}" aria-label="${k}">${qcIcon(k, 58, i)}</button>`;
                }).join("")}
              </div>
            </div>
            <p class="le-nm-tap-hint">Tap exactly one ${pick.id} to add</p>
          </div>`;
        choicesEl.innerHTML = "";
        const coll = stageEl.querySelector("#leIaColl");
        const badge = stageEl.querySelector("#leIaBadge");
        stageEl.querySelectorAll(".le-nm-ia-pick").forEach((btn) => {
          btn.addEventListener("click", () => {
            if (locked) return;
            if (btn.getAttribute("data-kind") !== pick.id) {
              snd.wrong();
              btn.classList.add("is-shake");
              setTimeout(() => btn.classList.remove("is-shake"), 400);
              onWrong("Add one " + pick.id + "!");
              return;
            }
            locked = true;
            btn.classList.add("is-used");
            stageEl.querySelectorAll(".le-nm-ia-pick").forEach((p) => p.classList.add("is-used"));
            const bit = document.createElement("span");
            bit.className = "le-nm-ia-obj is-new";
            bit.innerHTML = qcIcon(pick.id, 50);
            coll.appendChild(bit);
            qcBounce(bit);
            badge.textContent = String(total);
            badge.classList.add("is-bump");
            snd.pop();
            say(nameOf(n) + ". Add one. " + nameOf(total));
            promptEl.textContent = n + " and one more is " + total + "!";
            setTimeout(() => iaRevealTotal(total, "Now " + total + "!"), 700);
          });
        });
      }

      /** 3) Addition Train — passengers board at stations */
      function buildIaTrainRound() {
        const { max } = iaRange();
        const animals = ["rabbit", "teddy", "cat", "elephant"];
        const start = randInt(1, 2);
        const add1 = randInt(1, Math.min(2, max - start - 1));
        const add2 = randInt(1, Math.max(1, Math.min(2, max - start - add1)));
        const sum = start + add1 + add2;
        wrongTries = 0;
        let boarded1 = 0;
        let boarded2 = 0;
        let phase = "station1";
        const startKind = animals[randInt(0, animals.length - 1)];

        function passHtml(kind, count, extraCls) {
          return Array.from({ length: count }, (_, i) =>
            `<button type="button" class="le-nm-ia-pass ${extraCls || ""}" data-kind="${kind}" data-i="${i}" aria-label="passenger">${qcIcon(kind, 48, i)}</button>`
          ).join("");
        }

        promptEl.textContent = "The train is ready — passengers wait at the station!";
        say("Help passengers board the train");
        stageEl.innerHTML = `
          <div class="le-nm-ia le-nm-ia-train">
            <div class="le-nm-ia-scene is-rail">
              <div class="le-nm-ia-station-sign" id="leIaStation">Station 1</div>
              <div class="le-nm-ia-traincar" id="leIaCar">
                ${qcIcon("traineng", 70)}
                <div class="le-nm-ia-carriages" id="leIaPassengers">${passHtml(startKind, start, "is-onboard")}</div>
                <span class="le-nm-ia-badge" id="leIaBadge">${start}</span>
              </div>
              <div class="le-nm-ia-track" aria-hidden="true"></div>
              <div class="le-nm-ia-platform" id="leIaPlatform">
                ${passHtml(animals[1], add1, "is-waiting")}
              </div>
            </div>
            <p class="le-nm-tap-hint" id="leIaHint">Tap waiting passengers to board · ${start} on the train</p>
          </div>`;
        choicesEl.innerHTML = "";
        const platform = stageEl.querySelector("#leIaPlatform");
        const passengers = stageEl.querySelector("#leIaPassengers");
        const badge = stageEl.querySelector("#leIaBadge");
        const hint = stageEl.querySelector("#leIaHint");
        const station = stageEl.querySelector("#leIaStation");

        function updateBadge(n) {
          badge.textContent = String(n);
          badge.classList.remove("is-bump");
          void badge.offsetWidth;
          badge.classList.add("is-bump");
        }

        function bindWaiting() {
          platform.querySelectorAll(".le-nm-ia-pass.is-waiting").forEach((btn) => {
            btn.addEventListener("click", () => {
              if (locked || btn.classList.contains("is-used")) return;
              if (phase === "station1") {
                btn.classList.add("is-used");
                passengers.insertAdjacentHTML("beforeend",
                  `<span class="le-nm-ia-pass is-onboard">${qcIcon(btn.getAttribute("data-kind"), 48)}</span>`);
                boarded1++;
                updateBadge(start + boarded1);
                snd.pop();
                say(nameOf(start + boarded1));
                if (boarded1 >= add1) {
                  phase = "travel";
                  locked = true;
                  hint.textContent = "Choo choo! Next station…";
                  say("Next station");
                  stageEl.querySelector(".le-nm-ia-traincar").classList.add("is-moving");
                  setTimeout(() => {
                    stageEl.querySelector(".le-nm-ia-traincar").classList.remove("is-moving");
                    phase = "station2";
                    locked = false;
                    station.textContent = "Station 2";
                    platform.innerHTML = passHtml(animals[2], add2, "is-waiting");
                    hint.textContent = "More friends! Tap them to board";
                    say("More passengers");
                    bindWaiting();
                  }, 900);
                }
              } else if (phase === "station2") {
                btn.classList.add("is-used");
                passengers.insertAdjacentHTML("beforeend",
                  `<span class="le-nm-ia-pass is-onboard">${qcIcon(btn.getAttribute("data-kind"), 48)}</span>`);
                boarded2++;
                updateBadge(start + add1 + boarded2);
                snd.pop();
                say(nameOf(start + add1 + boarded2));
                if (boarded2 >= add2) {
                  phase = "done";
                  locked = true;
                  station.textContent = "Destination!";
                  hint.textContent = "All aboard — let's count everyone!";
                  say("Let's count everyone");
                  setTimeout(() => {
                    locked = false;
                    iaRevealTotal(sum, sum + " passengers!");
                  }, 600);
                }
              }
            });
          });
        }
        bindWaiting();
      }

      /** 4) Magic Number Show — magician makes more objects appear */
      function buildIaMagicRound() {
        const { max, hardMax } = iaRange();
        const props = ["balloon", "star", "teddy", "flower", "sparkle"];
        // reuse star via sparkle/flower; star may not exist - use sparkle
        const kind = ["balloon", "teddy", "flower", "cupcake"][randInt(0, 3)];
        const { a, b, sum } = iaSumPair(Math.min(max, 6));
        wrongTries = 0;
        let revealed = false;
        promptEl.textContent = "Count the magic objects, then tap the hat!";
        say("Count, then tap the magic hat");
        stageEl.innerHTML = `
          <div class="le-nm-ia le-nm-ia-magic">
            <div class="le-nm-ia-scene is-stage">
              <div class="le-nm-ia-curtains" aria-hidden="true"></div>
              <div class="le-nm-ia-magician">${qcIcon("magician", 72)}</div>
              <div class="le-nm-ia-stage-floor" id="leIaStage">
                ${iaObjs(kind, a, 54, "is-start")}
              </div>
              <button type="button" class="le-nm-ia-hat" id="leIaHat" aria-label="magic hat">
                ${qcIcon("hat", 72)}${qcIcon("wand", 40)}
              </button>
            </div>
            <p class="le-nm-tap-hint" id="leIaHint">First there are ${a}. Tap the hat for more magic!</p>
          </div>`;
        choicesEl.innerHTML = "";
        const stageFloor = stageEl.querySelector("#leIaStage");
        const hint = stageEl.querySelector("#leIaHint");
        stageEl.querySelector("#leIaHat").addEventListener("click", () => {
          if (locked || revealed) return;
          revealed = true;
          locked = true;
          snd.pop();
          say("Abracadabra!");
          stageEl.querySelector("#leIaHat").classList.add("is-cast");
          let i = 0;
          const addNext = () => {
            if (i >= b) {
              hint.textContent = "How many altogether now?";
              promptEl.textContent = "How many do you see now?";
              say("How many altogether?");
              locked = false;
              renderChoices(uniqueNumsNear(sum, 1, hardMax, 3).map(v => ({ label: v, value: v })), sum);
              return;
            }
            const el = document.createElement("span");
            el.className = "le-nm-ia-obj is-magic";
            el.innerHTML = qcIcon(kind, 54, i + 2);
            stageFloor.appendChild(el);
            qcBounce(el);
            snd.pop();
            i++;
            setTimeout(addNext, 380);
          };
          setTimeout(addNext, 280);
        });
      }

      /** 5) Addition Story Adventures — narration-driven short stories */
      function buildIaStoryRound() {
        const { max, hardMax } = iaRange();
        const { a, b, sum } = iaSumPair(Math.min(max, 6));
        const stories = [
          {
            setting: "party",
            who: "rabbit",
            friend: "teddy",
            item: "cupcake",
            open: "A little rabbit has cupcakes for a party.",
            add: "A teddy friend brings more cupcakes!",
          },
          {
            setting: "picnic",
            who: "cat",
            friend: "rabbit",
            item: "cookie",
            open: "A kitty packs cookies for a picnic.",
            add: "A bunny friend brings more cookies!",
          },
          {
            setting: "garden",
            who: "bird",
            friend: "butterfly",
            item: "berry",
            open: "A bird finds berries in the garden.",
            add: "A butterfly shows even more berries!",
          },
          {
            setting: "park",
            who: "teddy",
            friend: "cat",
            item: "balloon",
            open: "A teddy holds balloons at the park.",
            add: "A cat friend brings more balloons!",
          },
        ];
        // bird may not exist - use plane or doll. Check - no bird. Use rabbit for bird stories or add bird quickly.
        const story = stories[randInt(0, stories.length - 1)];
        if (story.who === "bird") story.who = "rabbit";
        wrongTries = 0;
        let step = 0;
        promptEl.textContent = "Story time!";
        say(story.open);

        function render() {
          if (step === 0) {
            stageEl.innerHTML = `
              <div class="le-nm-ia le-nm-ia-story is-${story.setting}">
                <div class="le-nm-ia-scene is-story">
                  <div class="le-nm-ia-story-cast">${qcIcon(story.who, 64)}</div>
                  <div class="le-nm-ia-story-objs">${iaObjs(story.item, a, 52)}</div>
                  <p class="le-nm-ia-story-line">${story.open} <strong>${a}</strong></p>
                  <button type="button" class="le-nm-ia-next" id="leIaNext">What happens next?</button>
                </div>
              </div>`;
            choicesEl.innerHTML = "";
            stageEl.querySelector("#leIaNext").addEventListener("click", () => {
              step = 1;
              snd.pop();
              say(story.add);
              render();
            });
          } else if (step === 1) {
            stageEl.innerHTML = `
              <div class="le-nm-ia le-nm-ia-story is-${story.setting}">
                <div class="le-nm-ia-scene is-story">
                  <div class="le-nm-ia-story-cast">${qcIcon(story.who, 56)}${qcIcon(story.friend, 56)}</div>
                  <div class="le-nm-ia-story-objs">
                    ${iaObjs(story.item, a, 48, "is-start")}
                    <span class="le-nm-ia-plus-lite">${qcIcon("plus", 36)}</span>
                    ${iaObjs(story.item, b, 48, "is-new")}
                  </div>
                  <p class="le-nm-ia-story-line">${story.add} <strong>+ ${b}</strong></p>
                  <button type="button" class="le-nm-ia-next" id="leIaNext">How many altogether?</button>
                </div>
              </div>`;
            choicesEl.innerHTML = "";
            stageEl.querySelectorAll(".le-nm-ia-obj.is-new").forEach((n, i) => setTimeout(() => qcBounce(n), i * 80));
            stageEl.querySelector("#leIaNext").addEventListener("click", () => {
              step = 2;
              snd.pop();
              promptEl.textContent = "How many " + story.item + "s altogether?";
              say("How many altogether?");
              stageEl.innerHTML = `
                <div class="le-nm-ia le-nm-ia-story is-${story.setting}">
                  <div class="le-nm-ia-scene is-story">
                    <div class="le-nm-ia-story-cast">${qcIcon(story.who, 52)}${qcIcon(story.friend, 52)}</div>
                    <div class="le-nm-ia-story-objs">${iaObjs(story.item, sum, 52)}</div>
                    <p class="le-nm-ia-story-line">${a} + ${b} = ?</p>
                  </div>
                </div>`;
              renderChoices(uniqueNumsNear(sum, 1, hardMax, 3).map(v => ({ label: v, value: v })), sum);
            });
          }
        }
        render();
      }

      /** 6) Build the Addition — drag the answer number block into the equation */
      function buildIaBuildRound() {
        const { max, hardMax } = iaRange();
        const kind = ["block", "apple", "star", "ball"][randInt(0, 3)];
        // star may not exist - use sparkle
        const objKind = kind === "star" ? "sparkle" : kind;
        const { a, b, sum } = iaSumPair(Math.min(max, 8));
        wrongTries = 0;
        const options = uniqueNumsNear(sum, 1, hardMax, 3);
        promptEl.textContent = "Build the addition — find the missing number!";
        say("Find the missing number");
        stageEl.innerHTML = `
          <div class="le-nm-ia le-nm-ia-build">
            <div class="le-nm-ia-scene is-workshop">
              <div class="le-nm-ia-mascot">${qcIcon("teddy", 52)}</div>
              <div class="le-nm-ia-visual-eq">
                <div class="le-nm-ia-eq-group">${iaObjs(objKind, a, 40)}</div>
                <span>${qcIcon("plus", 40)}</span>
                <div class="le-nm-ia-eq-group">${iaObjs(objKind, b, 40)}</div>
              </div>
              <div class="le-nm-ia-equation">
                ${iaNum(a, 64)}
                <span class="le-nm-ia-sym">${qcIcon("plus", 44)}</span>
                ${iaNum(b, 64)}
                <span class="le-nm-ia-sym">${qcIcon("equals", 44)}</span>
                <div class="le-nm-ia-answer-slot is-drop" id="leIaSlot" aria-label="answer slot"></div>
              </div>
              <div class="le-nm-ia-blocks" id="leIaBlocks">
                ${options.map((n) =>
                  `<button type="button" class="le-nm-ia-block" data-n="${n}" draggable="true" aria-label="${n}">${iaNum(n, 64)}</button>`
                ).join("")}
              </div>
            </div>
            <p class="le-nm-tap-hint">Drag or tap the correct number block into the empty space</p>
          </div>`;
        choicesEl.innerHTML = "";
        const slot = stageEl.querySelector("#leIaSlot");
        let selected = null;

        function place(n, btn) {
          if (locked) return;
          if (Number(n) !== sum) {
            snd.wrong();
            if (btn) {
              btn.classList.add("is-shake");
              setTimeout(() => btn.classList.remove("is-shake"), 400);
            }
            onWrong("Count both groups again!");
            return;
          }
          locked = true;
          slot.classList.add("is-filled");
          slot.innerHTML = iaNum(sum, 64);
          if (btn) btn.classList.add("is-used");
          qcBounce(slot);
          snd.correct();
          promptEl.textContent = a + " + " + b + " = " + sum + "!";
          say(nameOf(a) + " plus " + nameOf(b) + " equals " + nameOf(sum));
          confetti(12);
          setTimeout(() => onCorrect("Perfect equation!"), 900);
        }

        stageEl.querySelectorAll(".le-nm-ia-block").forEach((btn) => {
          btn.addEventListener("click", () => {
            if (locked) return;
            selected = btn;
            stageEl.querySelectorAll(".le-nm-ia-block").forEach((b) => b.classList.remove("is-selected"));
            btn.classList.add("is-selected");
            place(btn.getAttribute("data-n"), btn);
          });
          btn.addEventListener("dragstart", (e) => {
            selected = btn;
            try { e.dataTransfer.setData("text/plain", btn.getAttribute("data-n")); } catch (err) { /* ignore */ }
          });
        });
        slot.addEventListener("dragover", (e) => { e.preventDefault(); slot.classList.add("is-over"); });
        slot.addEventListener("dragleave", () => slot.classList.remove("is-over"));
        slot.addEventListener("drop", (e) => {
          e.preventDefault();
          slot.classList.remove("is-over");
          if (selected) place(selected.getAttribute("data-n"), selected);
        });
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

        if (type === "qc_toys") { buildToyShopRound(); return; }
        if (type === "qc_parking") { buildParkingRound(); return; }
        if (type === "qc_picnic") { buildPicnicRound(); return; }
        if (type === "qc_garden") { buildGrowGardenRound(); return; }
        if (type === "qc_g_seeds") { buildGardenSeedsRound(); return; }
        if (type === "qc_g_water") { buildGardenWaterRound(); return; }
        if (type === "qc_g_harvest") { buildGardenHarvestRound(); return; }
        if (type === "qc_g_visitors") { buildGardenVisitorsRound(); return; }
        if (type === "qc_g_arrange") { buildGardenArrangeRound(); return; }
        if (type === "qc_g_grow") { buildGardenWatchGrowRound(); return; }
        if (type === "qc_aquarium") { buildAquariumRound(); return; }
        if (type === "qc_party") { buildPartyRound(); return; }

        if (type === "ia_together") { buildIaTogetherRound(); return; }
        if (type === "ia_one_more") { buildIaOneMoreRound(); return; }
        if (type === "ia_train") { buildIaTrainRound(); return; }
        if (type === "ia_magic") { buildIaMagicRound(); return; }
        if (type === "ia_story") { buildIaStoryRound(); return; }
        if (type === "ia_build") { buildIaBuildRound(); return; }

        if (window.LUMACUBS_SG && typeof window.LUMACUBS_SG.createBuilders === "function") {
          if (!page._sgBuilders) {
            page._sgBuilders = window.LUMACUBS_SG.createBuilders({
              stageEl,
              promptEl,
              choicesEl,
              say,
              onCorrect,
              onWrong,
              snd,
              confetti,
              qcIcon,
              qcBounce,
              sub,
              getRound: () => round,
              getLocked: () => locked,
              getAgeHubReturn,
              trackPlatformProgress,
            });
          }
          if (page._sgBuilders[type]) {
            page._sgBuilders[type]();
            return;
          }
        }

        if (window.LUMACUBS_NS && typeof window.LUMACUBS_NS.createBuilders === "function") {
          if (!page._nsBuilders) {
            page._nsBuilders = window.LUMACUBS_NS.createBuilders({
              stageEl,
              promptEl,
              choicesEl,
              say,
              onCorrect,
              onWrong,
              snd,
              confetti,
              sub,
              getRound: () => round,
              getLocked: () => locked,
              getAgeHubReturn,
              trackPlatformProgress,
              NUMBER_NAMES,
            });
          }
          if (page._nsBuilders[type]) {
            page._nsBuilders[type]();
            return;
          }
        }

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
      const nextSub = cat && cat.subs && sub
        ? cat.subs[cat.subs.findIndex((s) => s.id === sub.id) + 1]
        : null;
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
            ${nextSub ? `<button type="button" class="le-nm-choice le-nm-done" id="leNmNext">Next: ${escapeHtml(nextSub.title)}</button>` : ""}
            <button type="button" class="le-nm-choice" id="leNmBackCat">More in this category</button>
            <button type="button" class="le-nm-choice" id="leNmBackHub">All math categories</button>
          </div>
        </div>`;
      api.screenRoot.appendChild(page);
      snd.fanfare();
      speak("Well done!");
      confetti(16);
      page.querySelector("#leNmAgain").addEventListener("click", () => { snd.pop(); go("leMathPlay", { cat, sub }); });
      const nextBtn = page.querySelector("#leNmNext");
      if (nextBtn && nextSub) {
        nextBtn.addEventListener("click", () => { snd.pop(); go("leMathPlay", { cat, sub: nextSub }); });
      }
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
