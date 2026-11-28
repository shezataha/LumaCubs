/* ============================================================
   LumaCubs — Missing Number Mystery (complete adventure)
   Overrides ns_mystery only; Number Pattern Detective untouched
   ============================================================ */
(function () {
  "use strict";

  function shuffle(a) {
    const arr = a.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = arr[i]; arr[i] = arr[j]; arr[j] = t;
    }
    return arr;
  }
  function randInt(lo, hi) { return lo + Math.floor(Math.random() * (hi - lo + 1)); }
  function range(lo, hi) { const o = []; for (let n = lo; n <= hi; n++) o.push(n); return o; }
  function uniqueNear(answer, lo, hi, count) {
    const set = new Set([answer]);
    let d = 1;
    while (set.size < count && d < 50) {
      if (answer - d >= lo) set.add(answer - d);
      if (set.size >= count) break;
      if (answer + d <= hi) set.add(answer + d);
      d++;
    }
    while (set.size < count) set.add(randInt(lo, hi));
    return shuffle(Array.from(set));
  }

  function bindNumDrag(root, itemSel, slotSel, onDrop) {
    let active = null, ghost = null, startX = 0, startY = 0, originParent = null, originNext = null;
    let selected = null, moved = false;
    function cleanup(restore) {
      if (ghost) { ghost.remove(); ghost = null; }
      if (active) {
        active.classList.remove("is-dragging");
        if (restore && originParent) {
          if (originNext && originNext.parentNode === originParent) originParent.insertBefore(active, originNext);
          else originParent.appendChild(active);
        }
        active.style.visibility = "";
      }
      root.querySelectorAll(slotSel).forEach((s) => s.classList.remove("is-over"));
      active = null; originParent = null; originNext = null;
      document.body.classList.remove("le-nm-ns-dragging");
    }
    function slotUnder(x, y) {
      const el = document.elementFromPoint(x, y);
      return el ? el.closest(slotSel) : null;
    }
    function selectItem(item) {
      root.querySelectorAll(itemSel).forEach((n) => n.classList.remove("is-selected"));
      selected = item;
      item.classList.add("is-selected");
    }
    function wireItem(item) {
      if (item.dataset.dragBound) return;
      item.dataset.dragBound = "1";
      item.addEventListener("pointerdown", (e) => {
        if (item.classList.contains("is-placed") || item.disabled) return;
        if (e.button != null && e.button !== 0) return;
        e.preventDefault();
        active = item; moved = false; startX = e.clientX; startY = e.clientY;
        originParent = item.parentNode; originNext = item.nextSibling;
        item.classList.add("is-dragging");
        document.body.classList.add("le-nm-ns-dragging");
        ghost = item.cloneNode(true);
        ghost.classList.add("le-nm-ns-ghost");
        ghost.style.left = e.clientX - 28 + "px";
        ghost.style.top = e.clientY - 28 + "px";
        document.body.appendChild(ghost);
        item.style.visibility = "hidden";
        try { item.setPointerCapture(e.pointerId); } catch (err) { /* */ }
      });
      item.addEventListener("pointermove", (e) => {
        if (!active || active !== item || !ghost) return;
        e.preventDefault();
        if (Math.abs(e.clientX - startX) > 6 || Math.abs(e.clientY - startY) > 6) moved = true;
        ghost.style.left = e.clientX - 28 + "px";
        ghost.style.top = e.clientY - 28 + "px";
        root.querySelectorAll(slotSel).forEach((s) => s.classList.remove("is-over"));
        const s = slotUnder(e.clientX, e.clientY);
        if (s) s.classList.add("is-over");
      });
      const end = (e) => {
        if (!active || active !== item) return;
        const s = slotUnder(e.clientX || startX, e.clientY || startY);
        let ok = false;
        if (s) ok = !!onDrop(s, item);
        const wasTap = !moved;
        cleanup(!ok);
        if (!ok && wasTap) selectItem(item);
      };
      item.addEventListener("pointerup", end);
      item.addEventListener("pointercancel", () => cleanup(true));
      item.addEventListener("click", () => {
        if (item.classList.contains("is-placed")) return;
        selectItem(item);
      });
    }
    function wireSlots() {
      root.querySelectorAll(slotSel).forEach((slot) => {
        if (slot.dataset.slotBound) return;
        slot.dataset.slotBound = "1";
        slot.addEventListener("click", () => {
          if (!selected || selected.classList.contains("is-placed")) return;
          if (onDrop(slot, selected)) {
            selected.classList.remove("is-selected");
            selected = null;
          }
        });
      });
    }
    root.querySelectorAll(itemSel).forEach(wireItem);
    wireSlots();
    const mo = new MutationObserver(() => {
      root.querySelectorAll(itemSel).forEach(wireItem);
      wireSlots();
    });
    mo.observe(root, { childList: true, subtree: true });
    return () => mo.disconnect();
  }

  /* Three range levels inside ONE Missing Number Mystery subcategory */
  const LEVELS = [
    { id: "r1_10", title: "Missing Numbers 1–10", blurb: "Simple sequences with one missing number.", lo: 1, hi: 10, art: "lvl1" },
    { id: "r11_20", title: "Missing Numbers 11–20", blurb: "New places to hide — try two gaps!", lo: 11, hi: 20, art: "lvl2" },
    { id: "r21_30", title: "Missing Numbers 21–30", blurb: "Longer sequences and bigger mysteries!", lo: 21, hi: 30, art: "lvl3" },
  ];

  const EXERCISES = [
    { id: "case", title: "Detective Clue Board", blurb: "Find the missing number using visual clues!", art: "case" },
    { id: "stones", title: "Number Tile Workshop", blurb: "Drag the correct number tile into place!", art: "stones" },
    { id: "bridge", title: "Garden Path Puzzle", blurb: "Complete the numbered stepping stones!", art: "bridge" },
    { id: "boxes", title: "Mystery Box Discovery", blurb: "Open boxes to reveal missing numbers!", art: "boxes" },
    { id: "stations", title: "Number Neighbour Challenge", blurb: "Find the missing neighbouring number!", art: "stations" },
    { id: "rescue", title: "Number Window Puzzle", blurb: "Complete sequences across number windows!", art: "rescue" },
    { id: "multi", title: "Multiple Gap Challenge", blurb: "Fill two or more missing positions!", art: "multi" },
    { id: "final", title: "Final Mystery Mission", blurb: "Combine challenges from your number range!", art: "final" },
  ];

  function teddySVG(size) {
    const s = size || 72;
    return `<svg class="le-nm-mn-teddy" viewBox="0 0 80 90" width="${s}" height="${Math.round(s * 1.12)}" aria-hidden="true">
      <ellipse cx="40" cy="82" rx="22" ry="6" fill="#5B4A7A" opacity=".15"/>
      <ellipse cx="40" cy="58" rx="24" ry="22" fill="#E8B86D"/>
      <circle cx="18" cy="28" r="11" fill="#D4A574"/><circle cx="62" cy="28" r="11" fill="#D4A574"/>
      <circle cx="40" cy="36" r="20" fill="#E8B86D"/>
      <path d="M22 22c4-14 32-14 36 0" fill="#5B4A7A"/>
      <rect x="24" y="14" width="32" height="10" rx="3" fill="#3D3550"/>
      <circle cx="56" cy="40" r="10" fill="none" stroke="#7E5FB0" stroke-width="3"/>
      <line x1="63" y1="47" x2="72" y2="58" stroke="#C4956A" stroke-width="3" stroke-linecap="round"/>
      <circle cx="33" cy="34" r="2.4" fill="#5B4A7A"/><circle cx="47" cy="34" r="2.4" fill="#5B4A7A"/>
      <ellipse cx="40" cy="42" rx="4" ry="3" fill="#C9845A"/>
      <path d="M34 48c4 4 8 4 12 0" stroke="#C9845A" stroke-width="2" fill="none"/>
      <ellipse cx="40" cy="52" rx="10" ry="7" fill="#F6D7A8"/>
    </svg>`;
  }

  window.LUMACUBS_MYSTERY = {
    create(ctx) {
      const {
        stageEl, promptEl, choicesEl, say, onCorrect, onWrong, snd, confetti,
        sub, getLocked, setLocked, getAgeHubReturn, trackPlatformProgress, NUMBER_NAMES, LS, roundEl,
      } = ctx;

      let seenIntro = false;
      let currentLevel = null;

      function nameOf(n) { return (NUMBER_NAMES && NUMBER_NAMES[n]) || String(n); }
      function tier() {
        const hub = typeof getAgeHubReturn === "function" ? getAgeHubReturn() : "littleExplorers";
        if (hub === "curiousLearners") return 1;
        if (hub === "smartAchievers") return 2;
        return 0;
      }
      function progKey() { return "leMathProgress"; }
      function getProg() {
        if (LS && typeof LS.get === "function") return LS.get(progKey(), {}) || {};
        try { return JSON.parse(localStorage.getItem("mad:" + progKey()) || "{}"); } catch (e) { return {}; }
      }
      function saveProg(p) {
        if (LS && typeof LS.set === "function") LS.set(progKey(), p);
        else try { localStorage.setItem("mad:" + progKey(), JSON.stringify(p)); } catch (e) { /* */ }
      }
      function exProgKey(levelId, exId) { return sub.id + "__" + levelId + "__" + exId; }
      function legacyExKey(exId) { return sub.id + "__" + exId; }
      function setExStars(levelId, exId, stars) {
        const p = getProg();
        const key = exProgKey(levelId, exId);
        p[key] = Math.max(p[key] || 0, stars || 1);
        /* Level completion stamp */
        const lvlKey = sub.id + "__" + levelId;
        const doneCount = EXERCISES.filter((ex) => (p[exProgKey(levelId, ex.id)] || 0) > 0).length;
        p[lvlKey] = Math.max(p[lvlKey] || 0, doneCount >= EXERCISES.length ? 3 : (doneCount >= 4 ? 2 : 1));
        saveProg(p);
        if (typeof trackPlatformProgress === "function") {
          trackPlatformProgress("le.numbers_math." + key, "completed");
          trackPlatformProgress("le.numbers_math." + lvlKey, "progress");
        }
      }
      function exStars(levelId, exId) {
        const p = getProg();
        const v = p[exProgKey(levelId, exId)];
        if (v) return v;
        /* Migrate legacy flat keys into Level 1 only */
        if (levelId === "r1_10") return p[legacyExKey(exId)] || 0;
        return 0;
      }
      function levelStars(levelId) { return getProg()[sub.id + "__" + levelId] || 0; }
      function levelComplete(levelId) { return EXERCISES.every((ex) => exStars(levelId, ex.id) > 0); }
      function recommendedLevels() {
        const t = tier();
        if (t === 0) return ["r1_10"];
        if (t === 1) return ["r1_10", "r11_20"];
        return ["r1_10", "r11_20", "r21_30"];
      }
      function allRecommendedDone() {
        return recommendedLevels().every((id) => levelComplete(id));
      }

      /* Config is ALWAYS locked to the selected level range — never mixes ranges */
      function levelCfg(levelId, exId) {
        const lvl = LEVELS.find((l) => l.id === levelId) || LEVELS[0];
        const t = tier();
        const roundN = exId === "final" ? (t === 0 ? 3 : 4) : (t === 0 ? 3 : t === 1 ? 4 : 5);
        if (lvl.id === "r1_10") {
          return { lo: 1, hi: 10, choices: t === 0 ? 2 : 3, miss: 1, len: t === 0 ? 4 : 5, rounds: roundN, allowEndGap: t > 0, allowMulti: false };
        }
        if (lvl.id === "r11_20") {
          return { lo: 11, hi: 20, choices: 3, miss: t === 0 ? 1 : 2, len: 5, rounds: roundN, allowEndGap: true, allowMulti: true };
        }
        return { lo: 21, hi: 30, choices: 3, miss: 2, len: t === 2 ? 6 : 5, rounds: roundN, allowEndGap: true, allowMulti: true };
      }

      function makeSeq(cfg, opts) {
        const o = Object.assign({}, cfg, opts || {});
        /* Soft = easier pattern inside the SAME range (never expands or mixes ranges) */
        const lo = o.lo;
        const hi = o.hi;
        let len = Math.min(o.len || 4, hi - lo + 1);
        if (o.soft) len = Math.min(len, o.softLen || Math.max(3, len - 1));
        len = Math.max(3, len);
        const start = randInt(lo, Math.max(lo, hi - len + 1));
        const seq = range(start, start + len - 1);
        /* Safety: every term must stay inside [lo, hi] */
        if (seq[0] < lo || seq[seq.length - 1] > hi) {
          return makeSeq(cfg, Object.assign({}, opts, { len: Math.min(3, hi - lo + 1) }));
        }
        let missCount = Math.min(o.miss || 1, Math.max(1, len - 1));
        if (o.soft) missCount = 1;
        if (!o.allowMulti && !o.forceMulti) missCount = 1;
        missCount = Math.min(missCount, len - 1);
        const missIdx = [];
        const canEnd = !!o.allowEndGap && !o.soft;
        const minI = canEnd ? 0 : 1;
        const maxI = canEnd ? len - 1 : Math.max(1, len - 2);
        while (missIdx.length < missCount) {
          const i = randInt(minI, maxI);
          if (!missIdx.includes(i)) missIdx.push(i);
          if (missIdx.length < missCount && missIdx.length >= (maxI - minI + 1)) break;
        }
        if (!missIdx.length) missIdx.push(Math.min(1, len - 1));
        missIdx.sort((a, b) => a - b);
        return { seq, missIdx, answers: missIdx.map((i) => seq[i]), start, cfg: Object.assign({}, o, { lo, hi }) };
      }

      function choices(answer, cfg) {
        let set = uniqueNear(answer, cfg.lo, cfg.hi, cfg.choices);
        if (!set.includes(answer)) set[0] = answer;
        /* Never offer numbers outside the level range */
        set = set.filter((n) => n >= cfg.lo && n <= cfg.hi);
        while (set.length < cfg.choices) {
          const n = randInt(cfg.lo, cfg.hi);
          if (!set.includes(n)) set.push(n);
        }
        return shuffle(set).slice(0, cfg.choices);
      }

      function lock(v) { if (typeof setLocked === "function") setLocked(!!v); }

      /* ---------- Intro ---------- */
      function showIntro() {
        if (roundEl) roundEl.textContent = "Intro";
        promptEl.textContent = "Missing Number Mystery";
        say("Welcome, little detective!");
        choicesEl.innerHTML = "";
        lock(false);
        stageEl.innerHTML = `
          <div class="le-nm-mn le-nm-mn-intro">
            <div class="le-nm-mn-intro-art">
              ${teddySVG(110)}
              <div class="le-nm-mn-sparkles" aria-hidden="true"><span></span><span></span><span></span></div>
            </div>
            <h3>Missing Number Mystery</h3>
            <p>Join Detective Teddy! Solve mysteries in three number ranges: 1–10, 11–20 and 21–30.</p>
            <button type="button" class="le-nm-choice le-nm-done" id="leMnStart">Start Adventure</button>
          </div>`;
        stageEl.querySelector("#leMnStart").addEventListener("click", () => {
          snd.pop();
          seenIntro = true;
          say("Choose your number mystery level!");
          showLevelSelect();
        });
      }

      /* ---------- Level select (3 ranges) ---------- */
      function showLevelSelect() {
        if (!seenIntro) { showIntro(); return; }
        currentLevel = null;
        if (roundEl) roundEl.textContent = "Levels";
        promptEl.textContent = "Choose a number range!";
        say("Which mystery level shall we solve?");
        choicesEl.innerHTML = "";
        lock(false);
        const rec = recommendedLevels();
        stageEl.innerHTML = `
          <div class="le-nm-mn le-nm-mn-hub">
            <div class="le-nm-mn-hub-hero">
              ${teddySVG(64)}
              <div>
                <h3>Mystery Number Levels</h3>
                <p>All three ranges stay in this adventure — pick a level to play its 8 cases.</p>
              </div>
            </div>
            <div class="le-nm-mn-level-grid">
              ${LEVELS.map((lvl, i) => {
                const done = EXERCISES.filter((ex) => exStars(lvl.id, ex.id) > 0).length;
                const complete = levelComplete(lvl.id);
                const isRec = rec.includes(lvl.id);
                return `<button type="button" class="le-nm-mn-level-card${complete ? " is-done" : ""}${isRec ? " is-recommended" : ""}" data-level="${lvl.id}">
                  <span class="le-nm-mn-level-badge">Level ${i + 1}</span>
                  <span class="le-nm-mn-card-art is-${lvl.art}" aria-hidden="true"></span>
                  <span class="le-nm-mn-card-copy">
                    <strong>${lvl.title}</strong>
                    <em>${lvl.blurb}</em>
                    <span>${complete ? "★ Level complete" : (done + "/" + EXERCISES.length + " cases · " + (isRec ? "Recommended" : "Open to explore"))}</span>
                  </span>
                </button>`;
              }).join("")}
            </div>
          </div>`;
        stageEl.querySelectorAll(".le-nm-mn-level-card").forEach((btn) => {
          btn.addEventListener("click", () => {
            snd.pop();
            showHub(btn.getAttribute("data-level"));
          });
        });
        if (allRecommendedDone()) {
          confetti(10);
          say("You solved every recommended mystery! Keep exploring, or finish when you are ready.");
          choicesEl.innerHTML = `
            <button type="button" class="le-nm-choice le-nm-done" id="leMnFinish">Finish adventure</button>`;
          choicesEl.querySelector("#leMnFinish").addEventListener("click", () => {
            snd.pop();
            onCorrect("You solved every mystery!");
          });
        }
      }

      /* ---------- Exercise hub (inside a level) ---------- */
      function showHub(levelId) {
        if (!seenIntro) { showIntro(); return; }
        const lvl = LEVELS.find((l) => l.id === levelId) || LEVELS[0];
        currentLevel = lvl.id;
        if (roundEl) roundEl.textContent = lvl.title.replace("Missing Numbers ", "");
        promptEl.textContent = "Choose a mystery case!";
        say("Look carefully at the clues!");
        choicesEl.innerHTML = "";
        lock(false);
        const done = EXERCISES.filter((ex) => exStars(lvl.id, ex.id) > 0).length;
        stageEl.innerHTML = `
          <div class="le-nm-mn le-nm-mn-hub">
            <div class="le-nm-mn-hub-hero">
              ${teddySVG(64)}
              <div>
                <h3>${lvl.title}</h3>
                <p>${done}/${EXERCISES.length} cases solved · numbers stay between ${lvl.lo} and ${lvl.hi}</p>
              </div>
            </div>
            <div class="le-nm-mn-grid">
              ${EXERCISES.map((ex, i) => {
                const st = exStars(lvl.id, ex.id);
                return `<button type="button" class="le-nm-mn-card${st ? " is-done" : ""}" data-ex="${ex.id}">
                  <span class="le-nm-mn-card-art is-${ex.art}" aria-hidden="true"></span>
                  <span class="le-nm-mn-card-copy">
                    <strong>${i + 1}. ${ex.title}</strong>
                    <em>${ex.blurb}</em>
                    <span>${st ? ("★".repeat(Math.min(3, st)) + " done") : "Tap to play"}</span>
                  </span>
                </button>`;
              }).join("")}
            </div>
            <button type="button" class="le-nm-mn-back-levels" id="leMnLevels">← All number levels</button>
          </div>`;
        stageEl.querySelector("#leMnLevels").addEventListener("click", () => {
          snd.pop();
          showLevelSelect();
        });
        stageEl.querySelectorAll(".le-nm-mn-card").forEach((btn) => {
          btn.addEventListener("click", () => {
            snd.pop();
            runExercise(btn.getAttribute("data-ex"));
          });
        });
        if (levelComplete(lvl.id) && allRecommendedDone()) {
          confetti(8);
          choicesEl.innerHTML = `
            <button type="button" class="le-nm-choice le-nm-done" id="leMnFinish">Finish adventure</button>`;
          choicesEl.querySelector("#leMnFinish").addEventListener("click", () => {
            snd.pop();
            onCorrect("You solved every mystery!");
          });
        }
      }

      function endExercise(exId, stars) {
        const levelId = currentLevel || "r1_10";
        setExStars(levelId, exId, stars);
        confetti(10);
        say("You solved the mystery!");
        lock(true);
        const finishBtn = allRecommendedDone()
          ? `<button type="button" class="le-nm-choice le-nm-done" id="leMnFinish">Finish adventure</button>`
          : "";
        choicesEl.innerHTML = `
          <button type="button" class="le-nm-choice le-nm-done" id="leMnAgain">Replay</button>
          <button type="button" class="le-nm-choice" id="leMnHub">More cases</button>
          <button type="button" class="le-nm-choice" id="leMnLevelsEnd">Number levels</button>
          ${finishBtn}`;
        choicesEl.querySelector("#leMnAgain").addEventListener("click", () => { snd.pop(); lock(false); runExercise(exId); });
        choicesEl.querySelector("#leMnHub").addEventListener("click", () => { snd.pop(); lock(false); showHub(levelId); });
        choicesEl.querySelector("#leMnLevelsEnd").addEventListener("click", () => { snd.pop(); lock(false); showLevelSelect(); });
        const fin = choicesEl.querySelector("#leMnFinish");
        if (fin) {
          fin.addEventListener("click", () => {
            snd.pop();
            onCorrect("Amazing detective work!");
          });
        }
      }

      function runExercise(exId) {
        const levelId = currentLevel || "r1_10";
        const cfg = levelCfg(levelId, exId);
        let round = 0;
        let score = 0;
        if (roundEl) roundEl.textContent = "1 / " + cfg.rounds;

        function next() {
          round++;
          if (roundEl) roundEl.textContent = Math.min(round, cfg.rounds) + " / " + cfg.rounds;
          if (round > cfg.rounds) {
            endExercise(exId, score >= cfg.rounds ? 3 : score >= Math.ceil(cfg.rounds * 0.6) ? 2 : 1);
            return;
          }
          lock(false);
          const soft = round <= 2;
          buildRound(exId, cfg, soft, () => {
            if (getLocked()) return;
            lock(true);
            score++;
            snd.correct();
            confetti(6);
            setTimeout(next, 850);
          });
        }
        next();
      }

      function buildRound(exId, cfg, soft, onWin) {
        choicesEl.innerHTML = "";
        const map = {
          case: exCase, stones: exStones, bridge: exBridge, boxes: exBoxes,
          stations: exStations, rescue: exRescue, multi: exMulti, final: exFinal,
        };
        (map[exId] || exCase)(cfg, soft, onWin);
      }

      /* ===== 1. Detective Clue Board ===== */
      function exCase(cfg, soft, onWin) {
        const data = makeSeq(cfg, { miss: 1, soft });
        const answer = data.answers[0];
        const miss = data.missIdx[0];
        const opts = choices(answer, cfg);
        promptEl.textContent = "Can you find the missing number?";
        say("Can you find the missing number?");
        stageEl.innerHTML = `
          <div class="le-nm-mn le-nm-mn-case">
            <div class="le-nm-mn-deco is-case" aria-hidden="true"><span class="le-nm-mn-foot"></span><span class="le-nm-mn-foot"></span><span class="le-nm-mn-pin"></span></div>
            <div class="le-nm-mn-scene-top">${teddySVG(56)}<span class="le-nm-mn-glass-badge" aria-hidden="true"></span></div>
            <div class="le-nm-mn-range-chip">${cfg.lo}–${cfg.hi}</div>
            <div class="le-nm-mn-board">
              ${data.seq.map((n, i) => i === miss
                ? `<span class="le-nm-mn-slot is-miss">?</span>`
                : `<span class="le-nm-mn-slot">${n}</span>`).join("")}
            </div>
            <div class="le-nm-mn-clues">
              ${opts.map((n) => `<button type="button" class="le-nm-mn-clue" data-num="${n}">${n}</button>`).join("")}
            </div>
            <p class="le-nm-tap-hint">Tap the correct number clue card</p>
            <div class="le-nm-mn-clue-reveal" id="leMnClue" hidden>Clue found!</div>
          </div>`;
        stageEl.querySelectorAll(".le-nm-mn-clue").forEach((btn) => {
          btn.addEventListener("click", () => {
            if (getLocked()) return;
            const n = Number(btn.getAttribute("data-num"));
            if (n !== answer) {
              btn.classList.add("is-wrong");
              onWrong(soft ? "Try the number that fits between its neighbours!" : "Look carefully at the number clues!");
              return;
            }
            const cell = stageEl.querySelector(".le-nm-mn-slot.is-miss");
            cell.textContent = String(n);
            cell.classList.add("is-solved");
            cell.classList.remove("is-miss");
            stageEl.querySelector("#leMnClue").hidden = false;
            stageEl.querySelector(".le-nm-mn-case").classList.add("is-win");
            say("Amazing detective work! " + nameOf(n));
            onWin();
          });
        });
      }

      /* ===== 2. Number Tile Workshop ===== */
      function exStones(cfg, soft, onWin) {
        const data = makeSeq(cfg, { miss: 1, soft });
        const answer = data.answers[0];
        const miss = data.missIdx[0];
        const pool = choices(answer, cfg);
        promptEl.textContent = "Drag the correct number tile into place!";
        say("Which number belongs here?");
        stageEl.innerHTML = `
          <div class="le-nm-mn le-nm-mn-stones">
            <div class="le-nm-mn-forest" aria-hidden="true"></div>
            <div class="le-nm-mn-deco is-river" aria-hidden="true"></div>
            <div class="le-nm-mn-range-chip">${cfg.lo}–${cfg.hi}</div>
            <div class="le-nm-mn-path">
              ${data.seq.map((n, i) => i === miss
                ? `<div class="le-nm-mn-stone-slot le-nm-ns-slot is-empty" data-expect="${answer}"><span>?</span></div>`
                : `<div class="le-nm-mn-stone is-fixed">${n}</div>`).join("")}
            </div>
            <div class="le-nm-mn-walker" id="leMnWalk" aria-hidden="true">${teddySVG(40)}</div>
            <div class="le-nm-mn-pool">
              ${pool.map((n) => `<button type="button" class="le-nm-ns-num le-nm-mn-drag" data-num="${n}" draggable="true">${n}</button>`).join("")}
            </div>
            <p class="le-nm-tap-hint">Drag or tap a tile, then the empty spot</p>
          </div>`;
        bindNumDrag(stageEl, ".le-nm-mn-drag", ".le-nm-mn-stone-slot", (slot, item) => {
          if (getLocked()) return false;
          const got = Number(item.getAttribute("data-num"));
          if (got !== answer) { onWrong("Try another number tile!"); return false; }
          item.classList.add("is-placed");
          slot.classList.add("is-filled");
          slot.innerHTML = "";
          slot.appendChild(item);
          item.style.visibility = "";
          stageEl.querySelector(".le-nm-mn-stones").classList.add("is-crossed");
          stageEl.querySelector("#leMnWalk").classList.add("is-walk");
          say(nameOf(got));
          onWin();
          return true;
        });
      }

      /* ===== 3. Garden Path Puzzle ===== */
      function exBridge(cfg, soft, onWin) {
        const missWant = soft || !cfg.allowMulti ? 1 : Math.min(2, cfg.miss);
        const data = makeSeq(cfg, { miss: missWant, soft, allowMulti: cfg.allowMulti });
        let focus = 0;
        promptEl.textContent = "Complete the garden path of numbers!";
        say("Which number belongs here?");
        const poolNums = shuffle(data.answers.concat(choices(data.answers[0], cfg)))
          .filter((v, i, a) => a.indexOf(v) === i)
          .filter((n) => n >= cfg.lo && n <= cfg.hi)
          .slice(0, cfg.choices + data.answers.length - 1);
        stageEl.innerHTML = `
          <div class="le-nm-mn le-nm-mn-bridge">
            <div class="le-nm-mn-deco is-falls" aria-hidden="true"><span></span><span></span></div>
            <div class="le-nm-mn-water" aria-hidden="true"></div>
            <div class="le-nm-mn-range-chip">${cfg.lo}–${cfg.hi}</div>
            <div class="le-nm-mn-bridge-row">
              ${data.seq.map((n, i) => data.missIdx.includes(i)
                ? `<div class="le-nm-mn-plank le-nm-ns-slot is-gap" data-expect="${n}" data-ord="${data.missIdx.indexOf(i)}"><span>?</span></div>`
                : `<div class="le-nm-mn-plank is-ok">${n}</div>`).join("")}
            </div>
            <div class="le-nm-mn-crosser" id="leMnCross" aria-hidden="true">${teddySVG(42)}</div>
            <div class="le-nm-mn-pool">
              ${poolNums.map((n) => `<button type="button" class="le-nm-ns-num le-nm-mn-drag" data-num="${n}" draggable="true">${n}</button>`).join("")}
            </div>
            <p class="le-nm-tap-hint">Place missing stepping stones left to right</p>
          </div>`;
        let placed = 0;
        bindNumDrag(stageEl, ".le-nm-mn-drag", ".le-nm-mn-plank.is-gap", (slot, item) => {
          if (getLocked() || slot.classList.contains("is-filled")) return false;
          const expect = Number(slot.getAttribute("data-expect"));
          const ord = Number(slot.getAttribute("data-ord"));
          const got = Number(item.getAttribute("data-num"));
          if (ord !== focus) { onWrong("Fix the next garden stone first!"); return false; }
          if (got !== expect) { onWrong("That number doesn't fit the path!"); return false; }
          item.classList.add("is-placed");
          slot.classList.add("is-filled");
          slot.innerHTML = "";
          slot.appendChild(item);
          item.style.visibility = "";
          placed++; focus++;
          say(nameOf(got));
          if (placed >= data.answers.length) {
            stageEl.querySelector(".le-nm-mn-bridge").classList.add("is-repaired");
            stageEl.querySelector("#leMnCross").classList.add("is-cross");
            onWin();
          }
          return true;
        });
      }

      /* ===== 4. Mystery Box Discovery ===== */
      function exBoxes(cfg, soft, onWin) {
        const data = makeSeq(cfg, { miss: 1, soft });
        const answer = data.answers[0];
        const opts = choices(answer, cfg);
        promptEl.textContent = "Open the mystery boxes, then pick the number!";
        say("Look carefully at the clues!");
        stageEl.innerHTML = `
          <div class="le-nm-mn le-nm-mn-boxes">
            <div class="le-nm-mn-range-chip">${cfg.lo}–${cfg.hi}</div>
            <div class="le-nm-mn-board mini">
              ${data.seq.map((n, i) => i === data.missIdx[0]
                ? `<span class="le-nm-mn-slot is-miss" data-expect="${answer}">?</span>`
                : `<span class="le-nm-mn-slot">${n}</span>`).join("")}
            </div>
            <div class="le-nm-mn-box-row">
              ${opts.map((n) => `
                <button type="button" class="le-nm-mn-box" data-num="${n}">
                  <span class="le-nm-mn-box-lid"></span>
                  <span class="le-nm-mn-box-num">${n}</span>
                </button>`).join("")}
            </div>
            <p class="le-nm-tap-hint">Tap a box to open · tap again to choose that number</p>
          </div>`;
        function placeAnswer(n) {
          if (getLocked()) return;
          if (n !== answer) {
            onWrong("Open another box — that number is not the treasure!");
            return;
          }
          const slot = stageEl.querySelector(".le-nm-mn-slot.is-miss");
          if (!slot) return;
          slot.textContent = String(n);
          slot.classList.add("is-solved");
          slot.classList.remove("is-miss");
          stageEl.querySelector(".le-nm-mn-boxes").classList.add("is-sparkle");
          say("Treasure unlocked! " + nameOf(n));
          onWin();
        }
        stageEl.querySelectorAll(".le-nm-mn-box").forEach((box) => {
          box.addEventListener("click", () => {
            if (getLocked()) return;
            if (!box.classList.contains("is-open")) {
              box.classList.add("is-open");
              snd.pop();
              say(nameOf(Number(box.getAttribute("data-num"))));
              return;
            }
            placeAnswer(Number(box.getAttribute("data-num")));
          });
        });
      }

      /* ===== 5. Number Neighbour Challenge ===== */
      function exStations(cfg, soft, onWin) {
        const data = makeSeq(cfg, { miss: 1, soft, allowEndGap: false });
        const miss = data.missIdx[0];
        const answer = data.answers[0];
        const left = miss > 0 ? data.seq[miss - 1] : null;
        const right = miss < data.seq.length - 1 ? data.seq[miss + 1] : null;
        const opts = choices(answer, cfg);
        promptEl.textContent = "Which neighbouring number is missing?";
        say(left != null && right != null
          ? ("What number sits between " + nameOf(left) + " and " + nameOf(right) + "?")
          : "Which number belongs here?");
        stageEl.innerHTML = `
          <div class="le-nm-mn le-nm-mn-stations">
            <div class="le-nm-mn-deco is-rail" aria-hidden="true"><span class="le-nm-mn-signal"></span></div>
            <div class="le-nm-mn-range-chip">${cfg.lo}–${cfg.hi}</div>
            <div class="le-nm-mn-neighbour-hint">
              ${left != null ? `<span class="le-nm-mn-slot is-neighbour">${left}</span>` : `<span class="le-nm-mn-slot is-ghost">·</span>`}
              <span class="le-nm-mn-slot is-miss">?</span>
              ${right != null ? `<span class="le-nm-mn-slot is-neighbour">${right}</span>` : `<span class="le-nm-mn-slot is-ghost">·</span>`}
            </div>
            <div class="le-nm-mn-station-row">
              ${data.seq.map((n, i) => i === miss
                ? `<div class="le-nm-mn-station is-miss">?</div>`
                : `<div class="le-nm-mn-station${i === miss - 1 || i === miss + 1 ? " is-neighbour" : ""}">${n}</div>`).join("")}
            </div>
            <div class="le-nm-mn-clues">
              ${opts.map((n) => `<button type="button" class="le-nm-mn-clue" data-num="${n}">${n}</button>`).join("")}
            </div>
            <p class="le-nm-tap-hint">Tap the number that fits between its neighbours</p>
          </div>`;
        stageEl.querySelectorAll(".le-nm-mn-clue").forEach((btn) => {
          btn.addEventListener("click", () => {
            if (getLocked()) return;
            const n = Number(btn.getAttribute("data-num"));
            if (n !== answer) { btn.classList.add("is-wrong"); onWrong("Check the neighbours!"); return; }
            stageEl.querySelectorAll(".le-nm-mn-station.is-miss, .le-nm-mn-slot.is-miss").forEach((missEl) => {
              missEl.textContent = String(n);
              missEl.classList.add("is-solved");
              missEl.classList.remove("is-miss");
            });
            stageEl.querySelector(".le-nm-mn-stations").classList.add("is-moving");
            say(nameOf(n));
            onWin();
          });
        });
      }

      /* ===== 6. Number Window Puzzle ===== */
      function exRescue(cfg, soft, onWin) {
        const missWant = soft || !cfg.allowMulti ? 1 : Math.min(2, cfg.miss);
        const data = makeSeq(cfg, { miss: missWant, soft, allowMulti: cfg.allowMulti });
        let focus = 0;
        promptEl.textContent = "Complete the number windows!";
        say("Can you find the missing number?");
        const poolNums = shuffle(data.answers.concat(uniqueNear(data.answers[0], cfg.lo, cfg.hi, 2)))
          .filter((v, i, a) => a.indexOf(v) === i)
          .filter((n) => n >= cfg.lo && n <= cfg.hi)
          .slice(0, cfg.choices + 1);
        stageEl.innerHTML = `
          <div class="le-nm-mn le-nm-mn-rescue">
            <div class="le-nm-mn-island" aria-hidden="true"></div>
            <div class="le-nm-mn-friend" id="leMnFriend" aria-hidden="true"></div>
            <div class="le-nm-mn-range-chip">${cfg.lo}–${cfg.hi}</div>
            <div class="le-nm-mn-platforms le-nm-mn-windows">
              ${data.seq.map((n, i) => data.missIdx.includes(i)
                ? `<div class="le-nm-mn-plat le-nm-ns-slot is-gap is-window" data-expect="${n}" data-ord="${data.missIdx.indexOf(i)}">?</div>`
                : `<div class="le-nm-mn-plat is-ok is-window">${n}</div>`).join("")}
            </div>
            <div class="le-nm-mn-pool">
              ${poolNums.map((n) => `<button type="button" class="le-nm-ns-num le-nm-mn-drag" data-num="${n}" draggable="true">${n}</button>`).join("")}
            </div>
            <p class="le-nm-tap-hint">Fill missing windows from left to right</p>
          </div>`;
        let placed = 0;
        bindNumDrag(stageEl, ".le-nm-mn-drag", ".le-nm-mn-plat.is-gap", (slot, item) => {
          if (getLocked()) return false;
          if (Number(slot.getAttribute("data-ord")) !== focus) { onWrong("Fill the next window first!"); return false; }
          const got = Number(item.getAttribute("data-num"));
          const expect = Number(slot.getAttribute("data-expect"));
          if (got !== expect) { onWrong("That number does not belong in this window!"); return false; }
          item.classList.add("is-placed");
          slot.classList.add("is-filled");
          slot.innerHTML = "";
          slot.appendChild(item);
          item.style.visibility = "";
          placed++; focus++;
          stageEl.querySelector("#leMnFriend").style.setProperty("--mn-step", placed);
          say(nameOf(got));
          if (placed >= data.answers.length) {
            stageEl.querySelector(".le-nm-mn-rescue").classList.add("is-saved");
            onWin();
          }
          return true;
        });
      }

      /* ===== 7. Multiple Gap Challenge ===== */
      function exMulti(cfg, soft, onWin) {
        const maxMiss = cfg.allowMulti ? (soft ? 2 : Math.min(3, cfg.miss + 1)) : 2;
        const missWant = Math.max(2, Math.min(maxMiss, Math.max(2, cfg.len - 2)));
        const data = makeSeq(Object.assign({}, cfg, { len: Math.max(5, cfg.len), allowMulti: true }), {
          miss: missWant, soft: false, forceMulti: true, allowEndGap: cfg.allowEndGap,
        });
        let focus = 0;
        promptEl.textContent = "Fill every empty spot in order!";
        say("Find the missing numbers!");
        const poolNums = shuffle(data.answers.concat(uniqueNear(data.answers[0], cfg.lo, cfg.hi, cfg.choices)))
          .filter((v, i, a) => a.indexOf(v) === i)
          .filter((n) => n >= cfg.lo && n <= cfg.hi)
          .slice(0, cfg.choices + data.answers.length);
        stageEl.innerHTML = `
          <div class="le-nm-mn le-nm-mn-multi">
            <div class="le-nm-mn-range-chip">${cfg.lo}–${cfg.hi}</div>
            <div class="le-nm-mn-board">
              ${data.seq.map((n, i) => data.missIdx.includes(i)
                ? `<div class="le-nm-mn-slot is-miss le-nm-ns-slot" data-expect="${n}" data-ord="${data.missIdx.indexOf(i)}">?</div>`
                : `<div class="le-nm-mn-slot">${n}</div>`).join("")}
            </div>
            <div class="le-nm-mn-pool">
              ${poolNums.map((n) => `<button type="button" class="le-nm-ns-num le-nm-mn-drag" data-num="${n}" draggable="true">${n}</button>`).join("")}
            </div>
            <p class="le-nm-tap-hint">Drag tiles into each empty slot from left to right</p>
          </div>`;
        let placed = 0;
        function highlight() {
          stageEl.querySelectorAll(".le-nm-mn-slot.is-miss").forEach((el) => {
            el.classList.toggle("is-focus", Number(el.getAttribute("data-ord")) === focus);
          });
        }
        highlight();
        bindNumDrag(stageEl, ".le-nm-mn-drag", ".le-nm-mn-slot.is-miss", (slot, item) => {
          if (getLocked() || slot.classList.contains("is-filled")) return false;
          const ord = Number(slot.getAttribute("data-ord"));
          const expect = Number(slot.getAttribute("data-expect"));
          const got = Number(item.getAttribute("data-num"));
          if (ord !== focus) { onWrong("Fill the glowing empty spot first!"); return false; }
          if (got !== expect) { onWrong("That number doesn't belong there!"); return false; }
          item.classList.add("is-placed");
          slot.classList.add("is-filled", "is-solved");
          slot.classList.remove("is-miss", "is-focus");
          slot.innerHTML = "";
          slot.appendChild(item);
          item.style.visibility = "";
          placed++; focus++;
          highlight();
          say(nameOf(got));
          if (placed >= data.answers.length) {
            stageEl.querySelector(".le-nm-mn-multi").classList.add("is-done");
            onWin();
          }
          return true;
        });
      }

      /* ===== 8. Final Mystery Mission ===== */
      function exFinal(cfg, soft, onWin) {
        const missWant = soft || !cfg.allowMulti ? 1 : Math.min(2, cfg.miss);
        const data = makeSeq(cfg, {
          miss: missWant,
          soft,
          allowMulti: cfg.allowMulti,
          len: soft ? Math.min(4, cfg.len) : Math.max(5, cfg.len),
        });
        let focus = 0;
        promptEl.textContent = "Final mission — unlock the treasure chest!";
        say("Welcome, little detective! Solve the final clues!");
        const single = data.answers.length === 1;
        if (single) {
          const answer = data.answers[0];
          const opts = choices(answer, cfg);
          stageEl.innerHTML = `
            <div class="le-nm-mn le-nm-mn-final">
              <div class="le-nm-mn-map" aria-hidden="true"></div>
              <div class="le-nm-mn-chest" id="leMnChest" aria-hidden="true"></div>
              <div class="le-nm-mn-range-chip">${cfg.lo}–${cfg.hi}</div>
              <div class="le-nm-mn-board">
                ${data.seq.map((n, i) => i === data.missIdx[0]
                  ? `<span class="le-nm-mn-slot is-miss">?</span>`
                  : `<span class="le-nm-mn-slot">${n}</span>`).join("")}
              </div>
              <div class="le-nm-mn-clues">
                ${opts.map((n) => `<button type="button" class="le-nm-mn-clue" data-num="${n}">${n}</button>`).join("")}
              </div>
              <p class="le-nm-tap-hint">Solve this clue to unlock the chest</p>
            </div>`;
          stageEl.querySelectorAll(".le-nm-mn-clue").forEach((btn) => {
            btn.addEventListener("click", () => {
              if (getLocked()) return;
              const n = Number(btn.getAttribute("data-num"));
              if (n !== answer) { btn.classList.add("is-wrong"); onWrong("Keep investigating!"); return; }
              const cell = stageEl.querySelector(".le-nm-mn-slot.is-miss");
              cell.textContent = String(n);
              cell.classList.add("is-solved");
              stageEl.querySelector("#leMnChest").classList.add("is-open");
              stageEl.querySelector(".le-nm-mn-final").classList.add("is-win");
              say("You solved the mystery! " + nameOf(n));
              onWin();
            });
          });
          return;
        }
        const poolNums = shuffle(data.answers.concat(uniqueNear(data.answers[0], cfg.lo, cfg.hi, cfg.choices)))
          .filter((v, i, a) => a.indexOf(v) === i)
          .filter((n) => n >= cfg.lo && n <= cfg.hi)
          .slice(0, cfg.choices + data.answers.length);
        stageEl.innerHTML = `
          <div class="le-nm-mn le-nm-mn-final">
            <div class="le-nm-mn-map" aria-hidden="true"></div>
            <div class="le-nm-mn-chest" id="leMnChest" aria-hidden="true"></div>
            <div class="le-nm-mn-range-chip">${cfg.lo}–${cfg.hi}</div>
            <div class="le-nm-mn-board">
              ${data.seq.map((n, i) => data.missIdx.includes(i)
                ? `<div class="le-nm-mn-slot is-miss le-nm-ns-slot" data-expect="${n}" data-ord="${data.missIdx.indexOf(i)}">?</div>`
                : `<div class="le-nm-mn-slot">${n}</div>`).join("")}
            </div>
            <div class="le-nm-mn-pool">
              ${poolNums.map((n) => `<button type="button" class="le-nm-ns-num le-nm-mn-drag" data-num="${n}" draggable="true">${n}</button>`).join("")}
            </div>
            <p class="le-nm-tap-hint">Fill every clue slot to open the treasure</p>
          </div>`;
        let placed = 0;
        function highlight() {
          stageEl.querySelectorAll(".le-nm-mn-slot.is-miss").forEach((el) => {
            el.classList.toggle("is-focus", Number(el.getAttribute("data-ord")) === focus);
          });
        }
        highlight();
        bindNumDrag(stageEl, ".le-nm-mn-drag", ".le-nm-mn-slot.is-miss", (slot, item) => {
          if (getLocked() || slot.classList.contains("is-filled")) return false;
          const ord = Number(slot.getAttribute("data-ord"));
          const expect = Number(slot.getAttribute("data-expect"));
          const got = Number(item.getAttribute("data-num"));
          if (ord !== focus) { onWrong("Solve the glowing clue first!"); return false; }
          if (got !== expect) { onWrong("Keep investigating!"); return false; }
          item.classList.add("is-placed");
          slot.classList.add("is-filled", "is-solved");
          slot.classList.remove("is-miss", "is-focus");
          slot.innerHTML = "";
          slot.appendChild(item);
          item.style.visibility = "";
          placed++; focus++;
          highlight();
          say(nameOf(got));
          if (placed >= data.answers.length) {
            stageEl.querySelector("#leMnChest").classList.add("is-open");
            stageEl.querySelector(".le-nm-mn-final").classList.add("is-win");
            onWin();
          }
          return true;
        });
      }

      return function mysteryAdventure() {
        if (typeof trackPlatformProgress === "function") {
          trackPlatformProgress("le.numbers_math." + sub.id, "started");
        }
        showIntro();
      };
    },
  };
})();
