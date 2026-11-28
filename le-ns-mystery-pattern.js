/* ============================================================
   LumaCubs — Missing Number Mystery (8) + Number Pattern Detective (8)
   Nested exercise hubs under Number Order & Sequences
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
    root.querySelectorAll(itemSel).forEach((item) => {
      item.addEventListener("pointerdown", (e) => {
        if (item.classList.contains("is-placed") || item.disabled) return;
        if (e.button != null && e.button !== 0) return;
        e.preventDefault();
        active = item; startX = e.clientX; startY = e.clientY;
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
        cleanup(!ok);
      };
      item.addEventListener("pointerup", end);
      item.addEventListener("pointercancel", () => cleanup(true));
    });
    let selected = null;
    root.querySelectorAll(itemSel).forEach((item) => {
      item.addEventListener("click", (e) => {
        if (item.classList.contains("is-placed")) return;
        if (Math.abs((e.clientX || 0) - startX) > 12 || Math.abs((e.clientY || 0) - startY) > 12) return;
        root.querySelectorAll(itemSel).forEach((n) => n.classList.remove("is-selected"));
        selected = item;
        item.classList.add("is-selected");
      });
    });
    root.querySelectorAll(slotSel).forEach((slot) => {
      slot.addEventListener("click", () => {
        if (!selected || selected.classList.contains("is-placed")) return;
        if (onDrop(slot, selected)) { selected.classList.remove("is-selected"); selected = null; }
      });
    });
  }

  const MYSTERY_EX = [
    { id: "case", title: "The Missing Number Case", blurb: "Pick the missing number clue!", tone: "hq" },
    { id: "stones", title: "Find the Empty Spot", blurb: "Drag the stone onto the path!", tone: "forest" },
    { id: "bridge", title: "The Broken Number Bridge", blurb: "Repair the bridge numbers!", tone: "river" },
    { id: "boxes", title: "Mystery Number Boxes", blurb: "Open boxes and place the number!", tone: "treasure" },
    { id: "stations", title: "Missing Number Train Track", blurb: "Fix the missing station!", tone: "rail" },
    { id: "rescue", title: "Number Sequence Rescue", blurb: "Build a safe platform path!", tone: "island" },
    { id: "multi", title: "Multiple Missing Numbers", blurb: "Fill every empty spot!", tone: "puzzle" },
    { id: "final", title: "Detective Final Mission", blurb: "Solve the clue cases!", tone: "finale" },
  ];

  const PATTERN_EX = [
    { id: "robot", title: "Robot Pattern Machine", blurb: "Feed the robot the next number!", tone: "robot" },
    { id: "beads", title: "Colorful Number Beads", blurb: "Attach the next bead!", tone: "beads" },
    { id: "rocket", title: "Skip Counting Rocket", blurb: "Launch to the next planet!", tone: "space" },
    { id: "garden", title: "Growing Number Garden", blurb: "Bloom the next flower!", tone: "garden" },
    { id: "conveyor", title: "Pattern Conveyor Factory", blurb: "Place the next block!", tone: "factory" },
    { id: "wall", title: "Number Pattern Puzzle Wall", blurb: "Solve the wall patterns!", tone: "wall" },
    { id: "rule", title: "Discover the Secret Rule", blurb: "Find the rule, then the number!", tone: "rule" },
    { id: "grand", title: "Grand Pattern Challenge", blurb: "Power up the laboratory!", tone: "grand" },
  ];

  window.LUMACUBS_NS_MP = {
    createHubs(ctx) {
      const {
        stageEl, promptEl, choicesEl, say, onCorrect, onWrong, snd, confetti,
        sub, getLocked, setLocked, getAgeHubReturn, trackPlatformProgress, NUMBER_NAMES, LS, roundEl,
      } = ctx;

      function nameOf(n) { return (NUMBER_NAMES && NUMBER_NAMES[n]) || String(n); }
      function tier() {
        const hub = typeof getAgeHubReturn === "function" ? getAgeHubReturn() : "littleExplorers";
        let t = 0;
        if (hub === "curiousLearners") t = 1;
        if (hub === "smartAchievers") t = 2;
        if (sub.level === "B") t = Math.max(t, 1);
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
      function allDone(list) { return list.every((ex) => exStars(ex.id) > 0); }

      function ageRange() {
        const t = tier();
        if (t === 0) return { lo: 1, hi: 10, choices: 2, miss: 1, len: 4, rounds: 3 };
        if (t === 1) return { lo: 1, hi: 20, choices: 3, miss: 1, len: 5, rounds: 4 };
        return { lo: 1, hi: 30, choices: 4, miss: 2, len: 6, rounds: 5 };
      }

      function makeMissingSeq(opts) {
        const cfg = Object.assign(ageRange(), opts || {});
        const missCount = Math.min(cfg.miss, cfg.forceMiss || cfg.miss);
        const len = cfg.len;
        const start = randInt(cfg.lo, Math.max(cfg.lo, cfg.hi - len + 1));
        const seq = range(start, start + len - 1);
        const missIdx = [];
        while (missIdx.length < missCount) {
          const i = randInt(1, seq.length - 2);
          if (!missIdx.includes(i)) missIdx.push(i);
        }
        missIdx.sort((a, b) => a - b);
        return { seq, missIdx, answers: missIdx.map((i) => seq[i]), start, cfg };
      }

      function choiceBtns(answer, cfg, extra) {
        let set = uniqueNear(answer, cfg.lo, cfg.hi, cfg.choices);
        (extra || []).forEach((n) => { if (!set.includes(n)) set.push(n); });
        set = shuffle(set).slice(0, Math.max(cfg.choices, 2));
        if (!set.includes(answer)) set[0] = answer;
        return shuffle(set);
      }

      function unlockParentIfReady(list, doneMsg) {
        if (!allDone(list)) return;
        // Offer finish — do not auto-exit (onCorrect ends the whole activity)
        confetti(10);
        say(doneMsg + " Keep playing, or finish when you are ready.");
        choicesEl.innerHTML = `
          <button type="button" class="le-nm-choice le-nm-done" id="leMpFinish">Finish adventure</button>`;
        const fin = choicesEl.querySelector("#leMpFinish");
        if (fin) {
          fin.addEventListener("click", () => {
            snd.pop();
            onCorrect(doneMsg);
          });
        }
      }

      /* ========== MYSTERY HUB ========== */
      function mysteryHub() {
        if (roundEl) roundEl.textContent = "Cases";
        promptEl.textContent = "Choose a mystery case!";
        say("Can you find the missing number?");
        choicesEl.innerHTML = "";
        if (typeof setLocked === "function") setLocked(false);
        const done = MYSTERY_EX.filter((ex) => exStars(ex.id) > 0).length;
        stageEl.innerHTML = `
          <div class="le-nm-mp le-nm-mp-mystery-hub">
            <div class="le-nm-mp-hero is-mystery">
              <div class="le-nm-mp-mascot is-detective" aria-hidden="true">
                <span class="le-nm-mp-hat"></span>
                <span class="le-nm-mp-face"></span>
                <span class="le-nm-mp-glass"></span>
              </div>
              <div>
                <h3>Detective Headquarters</h3>
                <p>Solve ${MYSTERY_EX.length} missing-number cases · ${done}/${MYSTERY_EX.length} solved</p>
              </div>
            </div>
            <div class="le-nm-mp-grid">
              ${MYSTERY_EX.map((ex, i) => {
                const st = exStars(ex.id);
                return `<button type="button" class="le-nm-mp-card tone-${ex.tone}${st ? " is-done" : ""}" data-ex="${ex.id}">
                  <span class="le-nm-mp-card-art is-${ex.id}" aria-hidden="true"></span>
                  <span class="le-nm-mp-card-copy">
                    <strong>${i + 1}. ${ex.title}</strong>
                    <em>${ex.blurb}</em>
                    <span>${st ? ("★".repeat(Math.min(3, st)) + " done") : "Tap to play"}</span>
                  </span>
                </button>`;
              }).join("")}
            </div>
          </div>`;
        stageEl.querySelectorAll(".le-nm-mp-card").forEach((btn) => {
          btn.addEventListener("click", () => {
            snd.pop();
            runMysteryExercise(btn.getAttribute("data-ex"));
          });
        });
        unlockParentIfReady(MYSTERY_EX, "All mysteries solved!");
      }

      function endMysteryExercise(exId, stars, msg) {
        setExStars(exId, stars);
        confetti(10);
        say(msg || "Amazing detective work!");
        if (typeof setLocked === "function") setLocked(true);
        const finish = allDone(MYSTERY_EX)
          ? `<button type="button" class="le-nm-choice le-nm-done" id="leMpFinish">Finish adventure</button>`
          : "";
        choicesEl.innerHTML = `
          <button type="button" class="le-nm-choice le-nm-done" id="leMpBackHub">More cases</button>
          ${finish}`;
        choicesEl.querySelector("#leMpBackHub").addEventListener("click", () => {
          snd.pop();
          if (typeof setLocked === "function") setLocked(false);
          mysteryHub();
        });
        const fin = choicesEl.querySelector("#leMpFinish");
        if (fin) {
          fin.addEventListener("click", () => {
            snd.pop();
            onCorrect("All mysteries solved!");
          });
        }
      }

      function runMysteryExercise(exId) {
        const cfg = ageRange();
        let round = 0;
        let score = 0;
        const rounds = exId === "final" ? Math.max(3, cfg.rounds) : cfg.rounds;
        if (roundEl) roundEl.textContent = "1 / " + rounds;

        function next() {
          round++;
          if (roundEl) roundEl.textContent = Math.min(round, rounds) + " / " + rounds;
          if (round > rounds) {
            endMysteryExercise(exId, score >= rounds ? 3 : (score >= Math.ceil(rounds * 0.6) ? 2 : 1), "Case closed!");
            return;
          }
          if (typeof setLocked === "function") setLocked(false);
          buildMysteryRound(exId, cfg, () => {
            score++;
            snd.correct();
            confetti(6);
            if (typeof setLocked === "function") setLocked(true);
            setTimeout(next, 750);
          });
        }
        next();
      }

      function buildMysteryRound(exId, cfg, onWin) {
        choicesEl.innerHTML = "";
        if (exId === "case") return mysteryCase(cfg, onWin);
        if (exId === "stones") return mysteryStones(cfg, onWin);
        if (exId === "bridge") return mysteryBridge(cfg, onWin);
        if (exId === "boxes") return mysteryBoxes(cfg, onWin);
        if (exId === "stations") return mysteryStations(cfg, onWin);
        if (exId === "rescue") return mysteryRescue(cfg, onWin);
        if (exId === "multi") return mysteryMulti(cfg, onWin);
        return mysteryFinal(cfg, onWin);
      }

      /* Ex1 tap select */
      function mysteryCase(cfg, onWin) {
        const { seq, missIdx, answers } = makeMissingSeq(cfg);
        const answer = answers[0];
        const miss = missIdx[0];
        promptEl.textContent = "Can you find the missing number?";
        say("Can you find the missing number?");
        const opts = choiceBtns(answer, cfg);
        stageEl.innerHTML = `
          <div class="le-nm-mp le-nm-mp-case">
            <div class="le-nm-mp-board">
              ${seq.map((n, i) => i === miss
                ? `<span class="le-nm-mp-slot is-miss">?</span>`
                : `<span class="le-nm-mp-slot">${n}</span>`).join("")}
            </div>
            <div class="le-nm-mp-clues">
              ${opts.map((n) => `<button type="button" class="le-nm-mp-clue" data-num="${n}">${n}</button>`).join("")}
            </div>
            <p class="le-nm-tap-hint">Tap the correct number clue card</p>
          </div>`;
        stageEl.querySelectorAll(".le-nm-mp-clue").forEach((btn) => {
          btn.addEventListener("click", () => {
            if (getLocked()) return;
            const n = Number(btn.getAttribute("data-num"));
            if (n !== answer) {
              btn.classList.add("is-wrong");
              onWrong("Look carefully at the number clues!");
              return;
            }
            stageEl.querySelector(".le-nm-mp-slot.is-miss").textContent = String(n);
            stageEl.querySelector(".le-nm-mp-slot.is-miss").classList.add("is-solved");
            stageEl.querySelector(".le-nm-mp-case").classList.add("is-clue");
            say("Amazing detective work!");
            onWin();
          });
        });
      }

      /* Ex2 drag stone */
      function mysteryStones(cfg, onWin) {
        const { seq, missIdx, answers } = makeMissingSeq(Object.assign({}, cfg, { miss: 1 }));
        const answer = answers[0];
        const miss = missIdx[0];
        const pool = choiceBtns(answer, cfg);
        promptEl.textContent = "Drag the correct stone into the empty spot!";
        say("Which number belongs in the empty space?");
        stageEl.innerHTML = `
          <div class="le-nm-mp le-nm-mp-stones">
            <div class="le-nm-mp-path">
              ${seq.map((n, i) => i === miss
                ? `<div class="le-nm-mp-stone-slot le-nm-ns-slot is-empty" data-expect="${answer}"><span>?</span></div>`
                : `<div class="le-nm-mp-stone is-fixed">${n}</div>`).join("")}
            </div>
            <div class="le-nm-mp-walker" aria-hidden="true"></div>
            <div class="le-nm-mp-stone-pool">
              ${pool.map((n) => `<button type="button" class="le-nm-ns-num le-nm-mp-stone-drag" data-num="${n}" draggable="true">${n}</button>`).join("")}
            </div>
            <p class="le-nm-tap-hint">Drag or tap a stone, then the empty spot</p>
          </div>`;
        bindNumDrag(stageEl, ".le-nm-mp-stone-drag", ".le-nm-mp-stone-slot", (slot, item) => {
          if (getLocked()) return false;
          const got = Number(item.getAttribute("data-num"));
          if (got !== answer) { onWrong("Try another stepping stone!"); return false; }
          item.classList.add("is-placed");
          slot.classList.add("is-filled");
          slot.innerHTML = "";
          slot.appendChild(item);
          item.style.visibility = "";
          stageEl.querySelector(".le-nm-mp-stones").classList.add("is-crossed");
          say(nameOf(got));
          onWin();
          return true;
        });
      }

      /* Ex3 bridge repair */
      function mysteryBridge(cfg, onWin) {
        const missWant = tier() === 0 ? 1 : Math.min(2, cfg.miss);
        const data = makeMissingSeq(Object.assign({}, cfg, { miss: missWant, forceMiss: missWant }));
        let focus = 0;
        promptEl.textContent = "Repair the broken number bridge!";
        say("Which number belongs in the empty space?");
        stageEl.innerHTML = `
          <div class="le-nm-mp le-nm-mp-bridge">
            <div class="le-nm-mp-river" aria-hidden="true"></div>
            <div class="le-nm-mp-bridge-row">
              ${data.seq.map((n, i) => data.missIdx.includes(i)
                ? `<div class="le-nm-mp-plank le-nm-ns-slot is-gap" data-expect="${n}" data-ord="${data.missIdx.indexOf(i)}"><span>?</span></div>`
                : `<div class="le-nm-mp-plank is-ok">${n}</div>`).join("")}
            </div>
            <div class="le-nm-mp-plank-pool">
              ${shuffle(data.answers.concat(choiceBtns(data.answers[0], cfg).filter((n) => !data.answers.includes(n))).slice(0, cfg.choices + data.answers.length - 1))
                .filter((v, i, a) => a.indexOf(v) === i)
                .map((n) => `<button type="button" class="le-nm-ns-num le-nm-mp-plank-drag" data-num="${n}" draggable="true">${n}</button>`).join("")}
            </div>
            <p class="le-nm-tap-hint">Place missing planks in order from left to right</p>
          </div>`;
        let placed = 0;
        bindNumDrag(stageEl, ".le-nm-mp-plank-drag", ".le-nm-mp-plank.is-gap", (slot, item) => {
          if (getLocked()) return false;
          if (slot.classList.contains("is-filled")) return false;
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
            stageEl.querySelector(".le-nm-mp-bridge").classList.add("is-repaired");
            onWin();
          }
          return true;
        });
      }

      /* Ex4 mystery boxes */
      function mysteryBoxes(cfg, onWin) {
        const { seq, missIdx, answers } = makeMissingSeq(Object.assign({}, cfg, { miss: 1 }));
        const answer = answers[0];
        const opts = choiceBtns(answer, cfg);
        promptEl.textContent = "Open the boxes, then place the missing number!";
        say("Look carefully at the number clues!");
        stageEl.innerHTML = `
          <div class="le-nm-mp le-nm-mp-boxes">
            <div class="le-nm-mp-board mini">
              ${seq.map((n, i) => i === missIdx[0]
                ? `<span class="le-nm-mp-slot is-miss le-nm-ns-slot" data-expect="${answer}">?</span>`
                : `<span class="le-nm-mp-slot">${n}</span>`).join("")}
            </div>
            <div class="le-nm-mp-box-row">
              ${opts.map((n, i) => `
                <button type="button" class="le-nm-mp-box" data-num="${n}">
                  <span class="le-nm-mp-box-lid"></span>
                  <span class="le-nm-mp-box-num">${n}</span>
                </button>`).join("")}
            </div>
            <div class="le-nm-mp-box-pool" id="leMpBoxPool"></div>
            <p class="le-nm-tap-hint">Tap a box to open it, then drag the number into the sequence</p>
          </div>`;
        const pool = stageEl.querySelector("#leMpBoxPool");
        stageEl.querySelectorAll(".le-nm-mp-box").forEach((box) => {
          box.addEventListener("click", () => {
            if (box.classList.contains("is-open")) return;
            box.classList.add("is-open");
            snd.pop();
            const n = box.getAttribute("data-num");
            pool.insertAdjacentHTML("beforeend",
              `<button type="button" class="le-nm-ns-num le-nm-mp-box-chip" data-num="${n}" draggable="true">${n}</button>`);
            bindNumDrag(stageEl, ".le-nm-mp-box-chip", ".le-nm-mp-slot.is-miss", (slot, item) => {
              if (getLocked()) return false;
              const got = Number(item.getAttribute("data-num"));
              if (got !== answer) { onWrong("Open another box!"); return false; }
              item.classList.add("is-placed");
              slot.textContent = String(got);
              slot.classList.add("is-solved");
              slot.appendChild(item);
              item.style.visibility = "";
              stageEl.querySelector(".le-nm-mp-boxes").classList.add("is-sparkle");
              onWin();
              return true;
            });
          });
        });
      }

      /* Ex5 missing station (tap, not full train arrange) */
      function mysteryStations(cfg, onWin) {
        const { seq, missIdx, answers } = makeMissingSeq(Object.assign({}, cfg, { miss: 1 }));
        const answer = answers[0];
        const opts = choiceBtns(answer, cfg);
        promptEl.textContent = "Which number is missing from the station?";
        say("Which number belongs in the empty space?");
        stageEl.innerHTML = `
          <div class="le-nm-mp le-nm-mp-stations">
            <div class="le-nm-mp-train-mini" aria-hidden="true"></div>
            <div class="le-nm-mp-station-row">
              ${seq.map((n, i) => i === missIdx[0]
                ? `<div class="le-nm-mp-station is-miss">?</div>`
                : `<div class="le-nm-mp-station">${n}</div>`).join("")}
            </div>
            <div class="le-nm-mp-clues">
              ${opts.map((n) => `<button type="button" class="le-nm-mp-clue" data-num="${n}">${n}</button>`).join("")}
            </div>
            <p class="le-nm-tap-hint">Tap the correct station number</p>
          </div>`;
        stageEl.querySelectorAll(".le-nm-mp-clue").forEach((btn) => {
          btn.addEventListener("click", () => {
            if (getLocked()) return;
            const n = Number(btn.getAttribute("data-num"));
            if (n !== answer) { onWrong("Check the station order!"); return; }
            stageEl.querySelector(".le-nm-mp-station.is-miss").textContent = String(n);
            stageEl.querySelector(".le-nm-mp-stations").classList.add("is-moving");
            say(nameOf(n));
            onWin();
          });
        });
      }

      /* Ex6 rescue platforms */
      function mysteryRescue(cfg, onWin) {
        const missWant = tier() === 0 ? 1 : Math.min(2, cfg.miss);
        const data = makeMissingSeq(Object.assign({}, cfg, { miss: missWant }));
        let focus = 0;
        promptEl.textContent = "Complete the path to rescue your friend!";
        say("Can you find the missing number?");
        stageEl.innerHTML = `
          <div class="le-nm-mp le-nm-mp-rescue">
            <div class="le-nm-mp-hero-char" aria-hidden="true"></div>
            <div class="le-nm-mp-platforms">
              ${data.seq.map((n, i) => data.missIdx.includes(i)
                ? `<div class="le-nm-mp-plat le-nm-ns-slot is-gap" data-expect="${n}" data-ord="${data.missIdx.indexOf(i)}">?</div>`
                : `<div class="le-nm-mp-plat is-ok">${n}</div>`).join("")}
            </div>
            <div class="le-nm-mp-plank-pool">
              ${shuffle(data.answers.concat(uniqueNear(data.answers[0], data.cfg.lo, data.cfg.hi, 2)))
                .filter((v, i, a) => a.indexOf(v) === i).slice(0, cfg.choices + 1)
                .map((n) => `<button type="button" class="le-nm-ns-num" data-num="${n}" draggable="true">${n}</button>`).join("")}
            </div>
            <p class="le-nm-tap-hint">Fill missing platforms from left to right</p>
          </div>`;
        let placed = 0;
        bindNumDrag(stageEl, ".le-nm-ns-num", ".le-nm-mp-plat.is-gap", (slot, item) => {
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
          stageEl.querySelector(".le-nm-mp-hero-char").style.setProperty("--mp-step", placed);
          if (placed >= data.answers.length) {
            stageEl.querySelector(".le-nm-mp-rescue").classList.add("is-saved");
            onWin();
          }
          return true;
        });
      }

      /* Ex7 multiple missing */
      function mysteryMulti(cfg, onWin) {
        const missWant = Math.max(2, Math.min(tier() === 0 ? 2 : 3, cfg.len - 2));
        const data = makeMissingSeq(Object.assign({}, cfg, { miss: missWant, forceMiss: missWant, len: Math.max(5, cfg.len) }));
        let focus = 0;
        promptEl.textContent = "Fill every empty spot in order!";
        say("Find the missing numbers!");
        stageEl.innerHTML = `
          <div class="le-nm-mp le-nm-mp-multi">
            <div class="le-nm-mp-board">
              ${data.seq.map((n, i) => data.missIdx.includes(i)
                ? `<span class="le-nm-mp-slot is-miss" data-expect="${n}" data-ord="${data.missIdx.indexOf(i)}">?</span>`
                : `<span class="le-nm-mp-slot">${n}</span>`).join("")}
            </div>
            <div class="le-nm-mp-clues">
              ${shuffle(data.answers.concat(uniqueNear(data.answers[0], data.cfg.lo, data.cfg.hi, cfg.choices)))
                .filter((v, i, a) => a.indexOf(v) === i).slice(0, cfg.choices + data.answers.length)
                .map((n) => `<button type="button" class="le-nm-mp-clue" data-num="${n}">${n}</button>`).join("")}
            </div>
            <p class="le-nm-tap-hint">Tap numbers for each empty slot from left to right</p>
          </div>`;
        let placed = 0;
        stageEl.querySelectorAll(".le-nm-mp-clue").forEach((btn) => {
          btn.addEventListener("click", () => {
            if (getLocked() || btn.disabled) return;
            const need = data.answers[focus];
            const n = Number(btn.getAttribute("data-num"));
            if (n !== need) { onWrong("Fill the highlighted empty spot!"); return; }
            const cell = stageEl.querySelector('.le-nm-mp-slot.is-miss[data-ord="' + focus + '"]');
            if (cell) { cell.textContent = String(n); cell.classList.add("is-solved"); cell.classList.remove("is-miss"); }
            btn.disabled = true; btn.classList.add("is-used");
            placed++; focus++;
            say(nameOf(n));
            if (placed >= data.answers.length) {
              stageEl.querySelector(".le-nm-mp-multi").classList.add("is-done");
              onWin();
            }
          });
        });
      }

      /* Ex8 final mission — series of short cases in one round set */
      function mysteryFinal(cfg, onWin) {
        // One short case per round callback — same as case but with treasure meter
        mysteryCase(cfg, () => {
          stageEl.insertAdjacentHTML("beforeend", `<div class="le-nm-mp-chest-pop">Clue unlocked!</div>`);
          onWin();
        });
        promptEl.textContent = "Final mission — solve the clue!";
        say("Amazing detective work starts now!");
      }

      /* ========== PATTERN HUB ========== */
      function patternHub() {
        if (roundEl) roundEl.textContent = "Labs";
        promptEl.textContent = "Choose a pattern laboratory!";
        say("Look at the pattern. Can you discover the rule?");
        choicesEl.innerHTML = "";
        if (typeof setLocked === "function") setLocked(false);
        const done = PATTERN_EX.filter((ex) => exStars(ex.id) > 0).length;
        stageEl.innerHTML = `
          <div class="le-nm-mp le-nm-mp-pattern-hub">
            <div class="le-nm-mp-hero is-lab">
              <div class="le-nm-mp-mascot is-robot" aria-hidden="true">
                <span class="le-nm-mp-bot-head"></span>
                <span class="le-nm-mp-bot-body"></span>
              </div>
              <div>
                <h3>Pattern Laboratory</h3>
                <p>Discover ${PATTERN_EX.length} pattern machines · ${done}/${PATTERN_EX.length} powered</p>
              </div>
            </div>
            <div class="le-nm-mp-grid">
              ${PATTERN_EX.map((ex, i) => {
                const st = exStars(ex.id);
                return `<button type="button" class="le-nm-mp-card tone-${ex.tone}${st ? " is-done" : ""}" data-ex="${ex.id}">
                  <span class="le-nm-mp-card-art is-${ex.id}" aria-hidden="true"></span>
                  <span class="le-nm-mp-card-copy">
                    <strong>${i + 1}. ${ex.title}</strong>
                    <em>${ex.blurb}</em>
                    <span>${st ? ("★".repeat(Math.min(3, st)) + " done") : "Tap to play"}</span>
                  </span>
                </button>`;
              }).join("")}
            </div>
          </div>`;
        stageEl.querySelectorAll(".le-nm-mp-card").forEach((btn) => {
          btn.addEventListener("click", () => {
            snd.pop();
            runPatternExercise(btn.getAttribute("data-ex"));
          });
        });
        unlockParentIfReady(PATTERN_EX, "Laboratory complete!");
      }

      function endPatternExercise(exId, stars) {
        setExStars(exId, stars);
        confetti(10);
        say("Fantastic! You solved the pattern!");
        if (typeof setLocked === "function") setLocked(true);
        const finish = allDone(PATTERN_EX)
          ? `<button type="button" class="le-nm-choice le-nm-done" id="leMpFinish">Finish adventure</button>`
          : "";
        choicesEl.innerHTML = `
          <button type="button" class="le-nm-choice le-nm-done" id="leMpBackHub">More labs</button>
          ${finish}`;
        choicesEl.querySelector("#leMpBackHub").addEventListener("click", () => {
          snd.pop();
          if (typeof setLocked === "function") setLocked(false);
          patternHub();
        });
        const fin = choicesEl.querySelector("#leMpFinish");
        if (fin) {
          fin.addEventListener("click", () => {
            snd.pop();
            onCorrect("Laboratory complete!");
          });
        }
      }

      function runPatternExercise(exId) {
        const cfg = ageRange();
        let round = 0;
        let score = 0;
        const rounds = exId === "grand" ? Math.max(4, cfg.rounds) : cfg.rounds;
        if (roundEl) roundEl.textContent = "1 / " + rounds;
        function next() {
          round++;
          if (roundEl) roundEl.textContent = Math.min(round, rounds) + " / " + rounds;
          if (round > rounds) {
            endPatternExercise(exId, score >= rounds ? 3 : (score >= Math.ceil(rounds * 0.6) ? 2 : 1));
            return;
          }
          if (typeof setLocked === "function") setLocked(false);
          buildPatternRound(exId, cfg, () => {
            score++;
            snd.correct();
            confetti(6);
            if (typeof setLocked === "function") setLocked(true);
            setTimeout(next, 750);
          });
        }
        next();
      }

      function makePattern(exId) {
        const t = tier();
        // Returns { shown, answer, ruleLabel, kind }
        if (exId === "rocket" || (exId === "wall" && t > 0) || (exId === "grand" && t > 0 && Math.random() > 0.4)) {
          const steps = t === 0 ? [2] : (t === 1 ? [2, 5] : [2, 5, 10]);
          const step = steps[randInt(0, steps.length - 1)];
          const start = step * randInt(1, t === 0 ? 3 : 5);
          const shown = [start, start + step, start + step * 2];
          if (t > 0) shown.push(start + step * 3);
          return { shown, answer: shown[shown.length - 1] + step, ruleLabel: "Add " + step, kind: "skip" };
        }
        if (exId === "garden" || exId === "rule" || (exId === "grand" && Math.random() > 0.5)) {
          const step = t === 0 ? 1 : (t === 1 ? (Math.random() > 0.5 ? 1 : 2) : [1, 2, 5][randInt(0, 2)]);
          const start = randInt(1, 6);
          const shown = [start, start + step, start + step * 2, start + step * 3];
          return { shown: shown.slice(0, t === 0 ? 3 : 4), answer: start + step * (t === 0 ? 3 : 4), ruleLabel: "Add " + step, kind: "grow" };
        }
        // repeating
        if (t === 0) {
          const a = randInt(1, 5);
          let b = randInt(1, 6);
          while (b === a) b = randInt(1, 6);
          return { shown: [a, b, a, b], answer: a, ruleLabel: "Repeat " + a + ", " + b, kind: "repeat" };
        }
        const a = randInt(1, 6);
        let b = randInt(1, 8);
        while (b === a) b = randInt(1, 8);
        if (t >= 2 && Math.random() > 0.5) {
          const c = randInt(1, 9);
          return { shown: [a, b, c, a, b], answer: c, ruleLabel: "Repeat " + a + ", " + b + ", " + c, kind: "repeat" };
        }
        return { shown: [a, b, a, b], answer: a, ruleLabel: "Repeat " + a + ", " + b, kind: "repeat" };
      }

      function patternChoices(pat, cfg) {
        return choiceBtns(pat.answer, { lo: 1, hi: Math.max(30, pat.answer + 5), choices: cfg.choices });
      }

      function buildPatternRound(exId, cfg, onWin) {
        choicesEl.innerHTML = "";
        const pat = makePattern(exId);
        if (exId === "robot") return patternRobot(pat, cfg, onWin);
        if (exId === "beads") return patternBeads(pat, cfg, onWin);
        if (exId === "rocket") return patternRocket(pat, cfg, onWin);
        if (exId === "garden") return patternGarden(pat, cfg, onWin);
        if (exId === "conveyor") return patternConveyor(pat, cfg, onWin);
        if (exId === "wall") return patternWall(pat, cfg, onWin);
        if (exId === "rule") return patternRule(pat, cfg, onWin);
        return patternGrand(pat, cfg, onWin);
      }

      function wireTapChoices(rootSel, answer, onWin, okMsg) {
        stageEl.querySelectorAll(rootSel).forEach((btn) => {
          btn.addEventListener("click", () => {
            if (getLocked()) return;
            const n = Number(btn.getAttribute("data-num"));
            if (n !== answer) { btn.classList.add("is-wrong"); onWrong("Watch how the numbers change!"); return; }
            const miss = stageEl.querySelector(".is-miss, .le-nm-mp-next-slot");
            if (miss) { miss.textContent = String(n); miss.classList.add("is-filled"); miss.classList.remove("is-miss"); }
            say(okMsg || "Fantastic! You solved the pattern!");
            onWin();
          });
        });
      }

      function patternRobot(pat, cfg, onWin) {
        promptEl.textContent = "What number comes next for the robot?";
        say("What number comes next?");
        const opts = patternChoices(pat, cfg);
        stageEl.innerHTML = `
          <div class="le-nm-mp le-nm-mp-robot">
            <div class="le-nm-mp-robot-body" aria-hidden="true"><span class="le-nm-mp-bot-head"></span><span class="le-nm-mp-bot-body"></span></div>
            <div class="le-nm-mp-screen">
              ${pat.shown.map((n) => `<span class="le-nm-mp-pat">${n}</span>`).join("")}
              <span class="le-nm-mp-pat is-miss le-nm-ns-slot" data-expect="${pat.answer}">?</span>
            </div>
            <div class="le-nm-mp-block-pool">
              ${opts.map((n) => `<button type="button" class="le-nm-ns-num" data-num="${n}" draggable="true">${n}</button>`).join("")}
            </div>
            <p class="le-nm-tap-hint">Drag or tap the next number into the robot screen</p>
          </div>`;
        bindNumDrag(stageEl, ".le-nm-ns-num", ".le-nm-mp-pat.is-miss", (slot, item) => {
          if (getLocked()) return false;
          const got = Number(item.getAttribute("data-num"));
          if (got !== pat.answer) { onWrong("Look at the repeating pattern!"); return false; }
          item.classList.add("is-placed");
          slot.classList.add("is-filled");
          slot.textContent = String(got);
          slot.appendChild(item);
          item.style.visibility = "";
          stageEl.querySelector(".le-nm-mp-robot").classList.add("is-happy");
          onWin();
          return true;
        });
      }

      function patternBeads(pat, cfg, onWin) {
        promptEl.textContent = "Attach the next number bead!";
        say("What number comes next?");
        const opts = patternChoices(pat, cfg);
        stageEl.innerHTML = `
          <div class="le-nm-mp le-nm-mp-beads">
            <div class="le-nm-mp-string">
              ${pat.shown.map((n, i) => `<span class="le-nm-mp-bead t${i % 4}">${n}</span>`).join("")}
              <span class="le-nm-mp-bead is-miss le-nm-ns-slot" data-expect="${pat.answer}">?</span>
            </div>
            <div class="le-nm-mp-block-pool">
              ${opts.map((n) => `<button type="button" class="le-nm-ns-num le-nm-mp-bead-drag t0" data-num="${n}" draggable="true">${n}</button>`).join("")}
            </div>
            <p class="le-nm-tap-hint">Place the next bead on the string</p>
          </div>`;
        bindNumDrag(stageEl, ".le-nm-mp-bead-drag", ".le-nm-mp-bead.is-miss", (slot, item) => {
          if (getLocked()) return false;
          if (Number(item.getAttribute("data-num")) !== pat.answer) { onWrong("Try another bead!"); return false; }
          item.classList.add("is-placed");
          slot.classList.add("is-filled");
          slot.textContent = String(pat.answer);
          onWin();
          return true;
        });
      }

      function patternRocket(pat, cfg, onWin) {
        promptEl.textContent = "Which planet number is next?";
        say("Watch how the numbers change!");
        const opts = patternChoices(pat, cfg);
        stageEl.innerHTML = `
          <div class="le-nm-mp le-nm-mp-space">
            <div class="le-nm-mp-planets">
              ${pat.shown.map((n) => `<span class="le-nm-mp-planet">${n}</span>`).join("")}
              <span class="le-nm-mp-planet is-miss">?</span>
            </div>
            <div class="le-nm-mp-rocket" aria-hidden="true"></div>
            <div class="le-nm-mp-clues">
              ${opts.map((n) => `<button type="button" class="le-nm-mp-clue" data-num="${n}">${n}</button>`).join("")}
            </div>
            <p class="le-nm-tap-hint">Skip-counting: ${pat.ruleLabel}</p>
          </div>`;
        wireTapChoices(".le-nm-mp-clue", pat.answer, () => {
          stageEl.querySelector(".le-nm-mp-space").classList.add("is-launch");
          onWin();
        });
      }

      function patternGarden(pat, cfg, onWin) {
        promptEl.textContent = "Which flower number blooms next?";
        say("What number comes next?");
        const opts = patternChoices(pat, cfg);
        stageEl.innerHTML = `
          <div class="le-nm-mp le-nm-mp-pgarden">
            <div class="le-nm-mp-flowers">
              ${pat.shown.map((n, i) => `<span class="le-nm-mp-flower f${i % 3}">${n}</span>`).join("")}
              <span class="le-nm-mp-flower is-miss">?</span>
            </div>
            <div class="le-nm-mp-clues">
              ${opts.map((n) => `<button type="button" class="le-nm-mp-clue" data-num="${n}">${n}</button>`).join("")}
            </div>
            <p class="le-nm-tap-hint">Growing pattern — ${pat.ruleLabel}</p>
          </div>`;
        wireTapChoices(".le-nm-mp-clue", pat.answer, () => {
          stageEl.querySelector(".le-nm-mp-pgarden").classList.add("is-bloom");
          onWin();
        });
      }

      function patternConveyor(pat, cfg, onWin) {
        promptEl.textContent = "Place the next block on the conveyor!";
        say("What number comes next?");
        const opts = patternChoices(pat, cfg);
        stageEl.innerHTML = `
          <div class="le-nm-mp le-nm-mp-conveyor">
            <div class="le-nm-mp-belt">
              ${pat.shown.map((n) => `<span class="le-nm-mp-cblock">${n}</span>`).join("")}
              <span class="le-nm-mp-cblock is-miss le-nm-ns-slot" data-expect="${pat.answer}">?</span>
            </div>
            <div class="le-nm-mp-block-pool">
              ${opts.map((n) => `<button type="button" class="le-nm-ns-num" data-num="${n}" draggable="true">${n}</button>`).join("")}
            </div>
            <p class="le-nm-tap-hint">Drag the matching number onto the belt</p>
          </div>`;
        bindNumDrag(stageEl, ".le-nm-ns-num", ".le-nm-mp-cblock.is-miss", (slot, item) => {
          if (getLocked()) return false;
          if (Number(item.getAttribute("data-num")) !== pat.answer) { onWrong("That block breaks the pattern!"); return false; }
          item.classList.add("is-placed");
          slot.classList.add("is-filled");
          slot.textContent = String(pat.answer);
          stageEl.querySelector(".le-nm-mp-conveyor").classList.add("is-run");
          onWin();
          return true;
        });
      }

      function patternWall(pat, cfg, onWin) {
        promptEl.textContent = "Solve the puzzle wall — what comes next?";
        say("Look at the pattern. Can you discover the rule?");
        const opts = patternChoices(pat, cfg);
        stageEl.innerHTML = `
          <div class="le-nm-mp le-nm-mp-wall">
            <div class="le-nm-mp-wall-board">
              ${pat.shown.map((n) => `<span class="le-nm-mp-tile">${n}</span>`).join("")}
              <span class="le-nm-mp-tile is-miss">?</span>
            </div>
            <div class="le-nm-mp-clues">
              ${opts.map((n) => `<button type="button" class="le-nm-mp-clue" data-num="${n}">${n}</button>`).join("")}
            </div>
            <p class="le-nm-tap-hint">${pat.ruleLabel}</p>
          </div>`;
        wireTapChoices(".le-nm-mp-clue", pat.answer, () => {
          stageEl.querySelector(".le-nm-mp-wall").classList.add("is-solved");
          onWin();
        });
      }

      function patternRule(pat, cfg, onWin) {
        promptEl.textContent = "Discover the secret rule, then the next number!";
        say("Look at the pattern. Can you discover the rule?");
        const opts = patternChoices(pat, cfg);
        const rules = shuffle([
          { id: pat.ruleLabel, ok: true },
          { id: "Add 3", ok: false },
          { id: "Repeat 9, 8", ok: false },
        ].filter((r, i, a) => a.findIndex((x) => x.id === r.id) === i)).slice(0, 3);
        if (!rules.some((r) => r.ok)) rules[0] = { id: pat.ruleLabel, ok: true };
        let ruleOk = false;
        stageEl.innerHTML = `
          <div class="le-nm-mp le-nm-mp-rule">
            <div class="le-nm-mp-wall-board">
              ${pat.shown.map((n) => `<span class="le-nm-mp-tile">${n}</span>`).join("")}
              <span class="le-nm-mp-tile is-miss">?</span>
            </div>
            <p class="le-nm-mp-rule-q">1) What is the rule?</p>
            <div class="le-nm-mp-rules">
              ${shuffle(rules).map((r) => `<button type="button" class="le-nm-mp-rule-btn" data-ok="${r.ok ? 1 : 0}">${r.id}</button>`).join("")}
            </div>
            <p class="le-nm-mp-rule-q is-next hidden" id="leMpRuleNext">2) What number comes next?</p>
            <div class="le-nm-mp-clues hidden" id="leMpRuleNums">
              ${opts.map((n) => `<button type="button" class="le-nm-mp-clue" data-num="${n}">${n}</button>`).join("")}
            </div>
          </div>`;
        stageEl.querySelectorAll(".le-nm-mp-rule-btn").forEach((btn) => {
          btn.addEventListener("click", () => {
            if (getLocked() || ruleOk) return;
            if (btn.getAttribute("data-ok") !== "1") { onWrong("Check the steps between numbers!"); return; }
            ruleOk = true;
            btn.classList.add("is-ok");
            stageEl.querySelector("#leMpRuleNext").classList.remove("hidden");
            stageEl.querySelector("#leMpRuleNums").classList.remove("hidden");
            say("Now find what comes next!");
            snd.pop();
          });
        });
        stageEl.querySelectorAll("#leMpRuleNums .le-nm-mp-clue").forEach((btn) => {
          btn.addEventListener("click", () => {
            if (getLocked()) return;
            if (!ruleOk) { onWrong("Pick the rule first!"); return; }
            const n = Number(btn.getAttribute("data-num"));
            if (n !== pat.answer) { btn.classList.add("is-wrong"); onWrong("Watch how the numbers change!"); return; }
            const miss = stageEl.querySelector(".is-miss");
            if (miss) { miss.textContent = String(n); miss.classList.add("is-filled"); miss.classList.remove("is-miss"); }
            stageEl.querySelector(".le-nm-mp-rule").classList.add("is-solved");
            say("Fantastic! You solved the pattern!");
            onWin();
          });
        });
      }

      function patternGrand(pat, cfg, onWin) {
        patternWall(pat, cfg, () => {
          stageEl.insertAdjacentHTML("beforeend", `<div class="le-nm-mp-chest-pop">Station powered!</div>`);
          onWin();
        });
        promptEl.textContent = "Grand challenge — power the lab!";
        say("Fantastic pattern adventure!");
      }

      return {
        ns_mystery: mysteryHub,
        ns_pattern: patternHub,
      };
    },
  };
})();
