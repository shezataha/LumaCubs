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

  const EXERCISES = [
    { id: "case", title: "The Missing Number Case", blurb: "Tap the missing number on the clue board!", art: "case" },
    { id: "stones", title: "Find the Empty Spot", blurb: "Drag a stone onto the forest path!", art: "stones" },
    { id: "bridge", title: "The Broken Number Bridge", blurb: "Repair the bridge so teddy can cross!", art: "bridge" },
    { id: "boxes", title: "Mystery Number Boxes", blurb: "Open boxes, then place the number!", art: "boxes" },
    { id: "stations", title: "Missing Number Train Station", blurb: "Fix the missing station sign!", art: "stations" },
    { id: "rescue", title: "Number Sequence Rescue", blurb: "Build platforms to rescue a friend!", art: "rescue" },
    { id: "multi", title: "Multiple Missing Numbers", blurb: "Fill every empty puzzle slot!", art: "multi" },
    { id: "final", title: "Detective Final Mission", blurb: "Solve every clue and open the chest!", art: "final" },
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
      let cluesUnlocked = 0;

      function nameOf(n) { return (NUMBER_NAMES && NUMBER_NAMES[n]) || String(n); }
      function tier() {
        const hub = typeof getAgeHubReturn === "function" ? getAgeHubReturn() : "littleExplorers";
        let t = 0;
        if (hub === "curiousLearners") t = 1;
        if (hub === "smartAchievers") t = 2;
        return t;
      }
      function progKey() { return "leMathProgress"; }
      function getProg() {
        if (LS && typeof LS.get === "function") return LS.get(progKey(), {}) || {};
        try { return JSON.parse(localStorage.getItem("mad:" + progKey()) || "{}"); } catch (e) { return {}; }
      }
      function setExStars(exId, stars) {
        const p = getProg();
        const key = sub.id + "__" + exId;
        p[key] = Math.max(p[key] || 0, stars || 1);
        if (LS && typeof LS.set === "function") LS.set(progKey(), p);
        else try { localStorage.setItem("mad:" + progKey(), JSON.stringify(p)); } catch (e) { /* */ }
        if (typeof trackPlatformProgress === "function") {
          trackPlatformProgress("le.numbers_math." + key, "completed");
        }
      }
      function exStars(exId) { return getProg()[sub.id + "__" + exId] || 0; }
      function allDone() { return EXERCISES.every((ex) => exStars(ex.id) > 0); }

      function ageCfg(exId) {
        const t = tier();
        const roundN = exId === "final" ? (t === 0 ? 3 : 4) : (t === 0 ? 3 : t === 1 ? 4 : 5);
        // Little explorers: start gentler with 1–5, then expand to 10 across rounds via start bias
        if (t === 0) return { lo: 1, hi: 10, softHi: 5, choices: 2, miss: 1, len: 4, rounds: roundN };
        if (t === 1) return { lo: 1, hi: 20, softHi: 12, choices: 3, miss: 1, len: 5, rounds: roundN };
        return { lo: 1, hi: 30, softHi: 20, choices: 3, miss: 2, len: 6, rounds: roundN };
      }

      function makeSeq(cfg, opts) {
        const o = Object.assign({}, cfg, opts || {});
        const hi = o.useSoft ? Math.min(o.hi, o.softHi || o.hi) : o.hi;
        const len = Math.min(o.len, hi - o.lo + 1);
        const start = randInt(o.lo, Math.max(o.lo, hi - len + 1));
        const seq = range(start, start + len - 1);
        const missCount = Math.min(o.miss, Math.max(1, len - 2));
        const missIdx = [];
        while (missIdx.length < missCount) {
          const i = randInt(1, seq.length - 2);
          if (!missIdx.includes(i)) missIdx.push(i);
        }
        missIdx.sort((a, b) => a - b);
        return { seq, missIdx, answers: missIdx.map((i) => seq[i]), start, cfg: o };
      }

      function choices(answer, cfg) {
        let set = uniqueNear(answer, cfg.lo, cfg.hi, cfg.choices);
        if (!set.includes(answer)) set[0] = answer;
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
            <p>Join Detective Teddy! Find missing numbers, collect clues, and open the mystery treasure chest.</p>
            <button type="button" class="le-nm-choice le-nm-done" id="leMnStart">Start Adventure</button>
          </div>`;
        stageEl.querySelector("#leMnStart").addEventListener("click", () => {
          snd.pop();
          seenIntro = true;
          say("Can you find the missing number?");
          showHub();
        });
      }

      /* ---------- Hub ---------- */
      function showHub() {
        if (!seenIntro) { showIntro(); return; }
        if (roundEl) roundEl.textContent = "Cases";
        promptEl.textContent = "Choose a mystery case!";
        say("Look carefully at the clues!");
        choicesEl.innerHTML = "";
        lock(false);
        const done = EXERCISES.filter((ex) => exStars(ex.id) > 0).length;
        stageEl.innerHTML = `
          <div class="le-nm-mn le-nm-mn-hub">
            <div class="le-nm-mn-hub-hero">
              ${teddySVG(64)}
              <div>
                <h3>Detective Headquarters</h3>
                <p>${done}/${EXERCISES.length} cases solved · clues ready for the final mission</p>
              </div>
            </div>
            <div class="le-nm-mn-grid">
              ${EXERCISES.map((ex, i) => {
                const st = exStars(ex.id);
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
          </div>`;
        stageEl.querySelectorAll(".le-nm-mn-card").forEach((btn) => {
          btn.addEventListener("click", () => {
            snd.pop();
            runExercise(btn.getAttribute("data-ex"));
          });
        });
        // Do NOT auto-call onCorrect — that exits the activity immediately.
        if (allDone()) {
          confetti(10);
          say("You solved every mystery! Keep playing, or finish when you are ready.");
          choicesEl.innerHTML = `
            <button type="button" class="le-nm-choice le-nm-done" id="leMnFinish">Finish adventure</button>`;
          choicesEl.querySelector("#leMnFinish").addEventListener("click", () => {
            snd.pop();
            onCorrect("You solved every mystery!");
          });
        }
      }

      function endExercise(exId, stars) {
        setExStars(exId, stars);
        cluesUnlocked = Math.min(8, cluesUnlocked + 1);
        confetti(10);
        say("You solved the mystery!");
        lock(true);
        const finishBtn = allDone()
          ? `<button type="button" class="le-nm-choice le-nm-done" id="leMnFinish">Finish adventure</button>`
          : "";
        choicesEl.innerHTML = `
          <button type="button" class="le-nm-choice le-nm-done" id="leMnAgain">Replay</button>
          <button type="button" class="le-nm-choice" id="leMnHub">More cases</button>
          ${finishBtn}`;
        choicesEl.querySelector("#leMnAgain").addEventListener("click", () => { snd.pop(); lock(false); runExercise(exId); });
        choicesEl.querySelector("#leMnHub").addEventListener("click", () => { snd.pop(); lock(false); showHub(); });
        const fin = choicesEl.querySelector("#leMnFinish");
        if (fin) {
          fin.addEventListener("click", () => {
            snd.pop();
            onCorrect("Amazing detective work!");
          });
        }
      }

      function runExercise(exId) {
        const cfg = ageCfg(exId);
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

      /* ===== Exercise 1: Case ===== */
      function exCase(cfg, soft, onWin) {
        const data = makeSeq(cfg, { miss: 1, useSoft: soft });
        const answer = data.answers[0];
        const miss = data.missIdx[0];
        const opts = choices(answer, cfg);
        promptEl.textContent = "Can you find the missing number?";
        say("Can you find the missing number?");
        stageEl.innerHTML = `
          <div class="le-nm-mn le-nm-mn-case">
            <div class="le-nm-mn-deco is-case" aria-hidden="true"><span class="le-nm-mn-foot"></span><span class="le-nm-mn-foot"></span><span class="le-nm-mn-pin"></span></div>
            <div class="le-nm-mn-scene-top">${teddySVG(56)}<span class="le-nm-mn-glass-badge" aria-hidden="true"></span></div>
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
            say("Amazing detective work!");
            onWin();
          });
        });
      }

      /* ===== Exercise 2: Stones ===== */
      function exStones(cfg, soft, onWin) {
        const data = makeSeq(cfg, { miss: 1, useSoft: soft });
        const answer = data.answers[0];
        const miss = data.missIdx[0];
        const pool = choices(answer, cfg);
        promptEl.textContent = "Drag the correct stone into the empty spot!";
        say("Which number belongs here?");
        stageEl.innerHTML = `
          <div class="le-nm-mn le-nm-mn-stones">
            <div class="le-nm-mn-forest" aria-hidden="true"></div>
            <div class="le-nm-mn-deco is-river" aria-hidden="true"></div>
            <div class="le-nm-mn-path">
              ${data.seq.map((n, i) => i === miss
                ? `<div class="le-nm-mn-stone-slot le-nm-ns-slot is-empty" data-expect="${answer}"><span>?</span></div>`
                : `<div class="le-nm-mn-stone is-fixed">${n}</div>`).join("")}
            </div>
            <div class="le-nm-mn-walker" id="leMnWalk" aria-hidden="true">${teddySVG(40)}</div>
            <div class="le-nm-mn-pool">
              ${pool.map((n) => `<button type="button" class="le-nm-ns-num le-nm-mn-drag" data-num="${n}" draggable="true">${n}</button>`).join("")}
            </div>
            <p class="le-nm-tap-hint">Drag or tap a stone, then the empty spot</p>
          </div>`;
        bindNumDrag(stageEl, ".le-nm-mn-drag", ".le-nm-mn-stone-slot", (slot, item) => {
          if (getLocked()) return false;
          const got = Number(item.getAttribute("data-num"));
          if (got !== answer) { onWrong("Try another stepping stone!"); return false; }
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

      /* ===== Exercise 3: Bridge ===== */
      function exBridge(cfg, soft, onWin) {
        const missWant = tier() === 0 ? 1 : Math.min(2, soft ? 1 : cfg.miss);
        const data = makeSeq(cfg, { miss: missWant, useSoft: soft });
        let focus = 0;
        promptEl.textContent = "Repair the broken number bridge!";
        say("Which number belongs here?");
        const poolNums = shuffle(data.answers.concat(choices(data.answers[0], cfg)))
          .filter((v, i, a) => a.indexOf(v) === i).slice(0, cfg.choices + data.answers.length - 1);
        stageEl.innerHTML = `
          <div class="le-nm-mn le-nm-mn-bridge">
            <div class="le-nm-mn-deco is-falls" aria-hidden="true"><span></span><span></span></div>
            <div class="le-nm-mn-water" aria-hidden="true"></div>
            <div class="le-nm-mn-bridge-row">
              ${data.seq.map((n, i) => data.missIdx.includes(i)
                ? `<div class="le-nm-mn-plank le-nm-ns-slot is-gap" data-expect="${n}" data-ord="${data.missIdx.indexOf(i)}"><span>?</span></div>`
                : `<div class="le-nm-mn-plank is-ok">${n}</div>`).join("")}
            </div>
            <div class="le-nm-mn-crosser" id="leMnCross" aria-hidden="true">${teddySVG(42)}</div>
            <div class="le-nm-mn-pool">
              ${poolNums.map((n) => `<button type="button" class="le-nm-ns-num le-nm-mn-drag" data-num="${n}" draggable="true">${n}</button>`).join("")}
            </div>
            <p class="le-nm-tap-hint">Place missing planks left to right</p>
          </div>`;
        let placed = 0;
        bindNumDrag(stageEl, ".le-nm-mn-drag", ".le-nm-mn-plank.is-gap", (slot, item) => {
          if (getLocked() || slot.classList.contains("is-filled")) return false;
          const expect = Number(slot.getAttribute("data-expect"));
          const ord = Number(slot.getAttribute("data-ord"));
          const got = Number(item.getAttribute("data-num"));
          if (ord !== focus) { onWrong("Fix the next broken section first!"); return false; }
          if (got !== expect) { onWrong("That plank doesn't fit!"); return false; }
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

      /* ===== Exercise 4: Boxes ===== */
      function exBoxes(cfg, soft, onWin) {
        const data = makeSeq(cfg, { miss: 1, useSoft: soft });
        const answer = data.answers[0];
        const opts = choices(answer, cfg);
        promptEl.textContent = "Open the mystery boxes, then pick the number!";
        say("Look carefully at the clues!");
        stageEl.innerHTML = `
          <div class="le-nm-mn le-nm-mn-boxes">
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
          say("Treasure unlocked!");
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

      /* ===== Exercise 5: Stations ===== */
      function exStations(cfg, soft, onWin) {
        const data = makeSeq(cfg, { miss: 1, useSoft: soft });
        const answer = data.answers[0];
        const opts = choices(answer, cfg);
        promptEl.textContent = "Which station number is missing?";
        say("Which number belongs here?");
        stageEl.innerHTML = `
          <div class="le-nm-mn le-nm-mn-stations">
            <div class="le-nm-mn-deco is-rail" aria-hidden="true"><span class="le-nm-mn-signal"></span></div>
            <div class="le-nm-mn-train" aria-hidden="true"></div>
            <div class="le-nm-mn-station-row">
              ${data.seq.map((n, i) => i === data.missIdx[0]
                ? `<div class="le-nm-mn-station is-miss">?</div>`
                : `<div class="le-nm-mn-station">${n}</div>`).join("")}
            </div>
            <div class="le-nm-mn-clues">
              ${opts.map((n) => `<button type="button" class="le-nm-mn-clue" data-num="${n}">${n}</button>`).join("")}
            </div>
            <p class="le-nm-tap-hint">Tap the correct station number — the train will move!</p>
          </div>`;
        stageEl.querySelectorAll(".le-nm-mn-clue").forEach((btn) => {
          btn.addEventListener("click", () => {
            if (getLocked()) return;
            const n = Number(btn.getAttribute("data-num"));
            if (n !== answer) { btn.classList.add("is-wrong"); onWrong("Check the station order!"); return; }
            const miss = stageEl.querySelector(".le-nm-mn-station.is-miss");
            miss.textContent = String(n);
            miss.classList.add("is-solved");
            miss.classList.remove("is-miss");
            stageEl.querySelector(".le-nm-mn-stations").classList.add("is-moving");
            say(nameOf(n));
            onWin();
          });
        });
      }

      /* ===== Exercise 6: Rescue ===== */
      function exRescue(cfg, soft, onWin) {
        const missWant = tier() === 0 ? 1 : Math.min(2, soft ? 1 : cfg.miss);
        const data = makeSeq(cfg, { miss: missWant, useSoft: soft });
        let focus = 0;
        promptEl.textContent = "Build the path and rescue your friend!";
        say("Can you find the missing number?");
        const poolNums = shuffle(data.answers.concat(uniqueNear(data.answers[0], data.cfg.lo, data.cfg.hi, 2)))
          .filter((v, i, a) => a.indexOf(v) === i).slice(0, cfg.choices + 1);
        stageEl.innerHTML = `
          <div class="le-nm-mn le-nm-mn-rescue">
            <div class="le-nm-mn-island" aria-hidden="true"></div>
            <div class="le-nm-mn-friend" id="leMnFriend" aria-hidden="true"></div>
            <div class="le-nm-mn-platforms">
              ${data.seq.map((n, i) => data.missIdx.includes(i)
                ? `<div class="le-nm-mn-plat le-nm-ns-slot is-gap" data-expect="${n}" data-ord="${data.missIdx.indexOf(i)}">?</div>`
                : `<div class="le-nm-mn-plat is-ok">${n}</div>`).join("")}
            </div>
            <div class="le-nm-mn-pool">
              ${poolNums.map((n) => `<button type="button" class="le-nm-ns-num le-nm-mn-drag" data-num="${n}" draggable="true">${n}</button>`).join("")}
            </div>
            <p class="le-nm-tap-hint">Fill missing platforms from left to right</p>
          </div>`;
        let placed = 0;
        bindNumDrag(stageEl, ".le-nm-mn-drag", ".le-nm-mn-plat.is-gap", (slot, item) => {
          if (getLocked()) return false;
          if (Number(slot.getAttribute("data-ord")) !== focus) { onWrong("Rescue the next gap first!"); return false; }
          const got = Number(item.getAttribute("data-num"));
          const expect = Number(slot.getAttribute("data-expect"));
          if (got !== expect) { onWrong("That platform number is wrong!"); return false; }
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

      /* ===== Exercise 7: Multi missing (drag tiles) ===== */
      function exMulti(cfg, soft, onWin) {
        const missWant = Math.max(2, Math.min(tier() === 0 ? 2 : (soft ? 2 : 3), cfg.len - 2));
        const data = makeSeq(Object.assign({}, cfg, { len: Math.max(5, cfg.len) }), { miss: missWant, useSoft: soft });
        let focus = 0;
        promptEl.textContent = "Fill every empty spot in order!";
        say("Find the missing numbers!");
        const poolNums = shuffle(data.answers.concat(uniqueNear(data.answers[0], data.cfg.lo, data.cfg.hi, cfg.choices)))
          .filter((v, i, a) => a.indexOf(v) === i).slice(0, cfg.choices + data.answers.length);
        stageEl.innerHTML = `
          <div class="le-nm-mn le-nm-mn-multi">
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
        // highlight current
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

      /* ===== Exercise 8: Final mission ===== */
      function exFinal(cfg, soft, onWin) {
        // Escalate: soft rounds = 1 missing; later rounds allow 2 (age-gated)
        const data = makeSeq(cfg, { miss: soft ? 1 : Math.min(2, cfg.miss), useSoft: soft, len: soft ? 4 : Math.max(5, cfg.len) });
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
              say("You solved the mystery!");
              onWin();
            });
          });
          return;
        }
        // multi-missing final
        const poolNums = shuffle(data.answers.concat(uniqueNear(data.answers[0], data.cfg.lo, data.cfg.hi, cfg.choices)))
          .filter((v, i, a) => a.indexOf(v) === i).slice(0, cfg.choices + data.answers.length);
        stageEl.innerHTML = `
          <div class="le-nm-mn le-nm-mn-final">
            <div class="le-nm-mn-map" aria-hidden="true"></div>
            <div class="le-nm-mn-chest" id="leMnChest" aria-hidden="true"></div>
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
