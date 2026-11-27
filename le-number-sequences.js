/* ============================================================
   LumaCubs — Number Order & Sequences (7 distinct mini-games)
   Loaded before le-numbers-math.js; builders via LUMACUBS_NS
   ============================================================ */
(function () {
  "use strict";

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = a[i];
      a[i] = a[j];
      a[j] = t;
    }
    return a;
  }

  function randInt(lo, hi) {
    return lo + Math.floor(Math.random() * (hi - lo + 1));
  }

  function range(lo, hi) {
    const out = [];
    for (let n = lo; n <= hi; n++) out.push(n);
    return out;
  }

  function uniqueNear(answer, lo, hi, count) {
    const set = new Set([answer]);
    let d = 1;
    while (set.size < count && d < 40) {
      if (answer - d >= lo) set.add(answer - d);
      if (set.size >= count) break;
      if (answer + d <= hi) set.add(answer + d);
      d++;
    }
    while (set.size < count) set.add(randInt(lo, hi));
    return shuffle(Array.from(set));
  }

  function numChip(n, cls, attrs) {
    const a = attrs || {};
    const data = Object.keys(a).map((k) => ` data-${k}="${a[k]}"`).join("");
    return `<button type="button" class="le-nm-ns-num ${cls || ""}"${data} aria-label="${n}" draggable="true">${n}</button>`;
  }

  /** Pointer drag for number chips into slots */
  function bindNumDrag(root, itemSel, slotSel, onDrop) {
    let active = null;
    let ghost = null;
    let startX = 0;
    let startY = 0;
    let originParent = null;
    let originNext = null;

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
      active = null;
      originParent = null;
      originNext = null;
      document.body.classList.remove("le-nm-ns-dragging");
    }

    function slotUnder(x, y) {
      const elAt = document.elementFromPoint(x, y);
      return elAt ? elAt.closest(slotSel) : null;
    }

    root.querySelectorAll(itemSel).forEach((item) => {
      item.addEventListener("pointerdown", (e) => {
        if (item.classList.contains("is-placed") || item.disabled) return;
        if (e.button != null && e.button !== 0) return;
        e.preventDefault();
        active = item;
        startX = e.clientX;
        startY = e.clientY;
        originParent = item.parentNode;
        originNext = item.nextSibling;
        item.classList.add("is-dragging");
        document.body.classList.add("le-nm-ns-dragging");
        ghost = item.cloneNode(true);
        ghost.classList.add("le-nm-ns-ghost");
        ghost.style.left = e.clientX - 28 + "px";
        ghost.style.top = e.clientY - 28 + "px";
        document.body.appendChild(ghost);
        item.style.visibility = "hidden";
        try { item.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
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
      function end(e) {
        if (!active || active !== item) return;
        const s = slotUnder(e.clientX || startX, e.clientY || startY);
        let ok = false;
        if (s) ok = !!onDrop(s, item);
        cleanup(!ok);
      }
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
        const ok = !!onDrop(slot, selected);
        if (ok) {
          selected.classList.remove("is-selected");
          selected = null;
        }
      });
    });
  }

  window.LUMACUBS_NS = {
    createBuilders(ctx) {
      const {
        stageEl, promptEl, choicesEl, say, onCorrect, onWrong, snd, confetti,
        sub, getRound, getLocked, getAgeHubReturn, trackPlatformProgress, NUMBER_NAMES,
      } = ctx;

      function nameOf(n) {
        return (NUMBER_NAMES && NUMBER_NAMES[n]) || String(n);
      }

      function tier() {
        const hub = typeof getAgeHubReturn === "function" ? getAgeHubReturn() : "littleExplorers";
        let t = 0;
        if (hub === "curiousLearners") t = 1;
        if (hub === "smartAchievers") t = 2;
        if (sub.level === "B") t = Math.max(t, 1);
        const r = getRound();
        if (r >= 2) t = Math.min(2, t + 1);
        return t;
      }

      function markStart() {
        if (typeof trackPlatformProgress === "function") {
          trackPlatformProgress("le.numbers_math." + sub.id, "started");
        }
      }

      /** Length of sequence chunk within fixed min/max range */
      function seqLen(lo, hi) {
        const span = hi - lo + 1;
        const lens = [Math.min(4, span), Math.min(6, span), Math.min(span, 10)];
        return Math.max(3, lens[tier()] || 4);
      }

      function pickWindow(lo, hi, len) {
        const maxStart = Math.max(lo, hi - len + 1);
        const start = randInt(lo, maxStart);
        return range(start, start + len - 1);
      }

      function finishRound(msg) {
        confetti(12);
        setTimeout(() => onCorrect(msg || "Wonderful!"), 500);
      }

      /* ---- 1) Magical Number Train (1–10 only) ---- */
      function buildTrain() {
        markStart();
        const lo = 1;
        const hi = 10;
        const nums = pickWindow(lo, hi, seqLen(lo, hi));
        const mixed = shuffle(nums.slice());
        const colors = ["#FF8FAB", "#FFD166", "#7ECDB5", "#A8D4F0", "#C9A0FF", "#FFB86B", "#FF6B6B", "#7EB8E0", "#E8B86D", "#A878E0"];

        promptEl.textContent = "Build the number train in order!";
        say("Let's put the numbers in order!");
        choicesEl.innerHTML = "";
        stageEl.innerHTML = `
          <div class="le-nm-ns le-nm-ns-train">
            <div class="le-nm-ns-train-sky" aria-hidden="true"></div>
            <div class="le-nm-ns-engine" aria-hidden="true">🚂</div>
            <div class="le-nm-ns-carriages" id="leNsSlots">
              ${nums.map((n, i) => `
                <div class="le-nm-ns-carriage le-nm-ns-slot" data-expect="${n}" data-i="${i}" style="--ns-car:${colors[i % colors.length]}">
                  <span class="le-nm-ns-carriage-label">?</span>
                </div>`).join("")}
            </div>
            <div class="le-nm-ns-track" aria-hidden="true"></div>
            <div class="le-nm-ns-pool" id="leNsPool">
              ${mixed.map((n) => numChip(n, "is-block", { num: n })).join("")}
            </div>
            <p class="le-nm-tap-hint">Drag or tap numbers into the carriages from smallest to biggest</p>
          </div>`;

        let placed = 0;
        bindNumDrag(stageEl, ".le-nm-ns-num", ".le-nm-ns-slot", (slot, item) => {
          if (getLocked()) return false;
          if (slot.classList.contains("is-filled")) {
            onWrong("That carriage is full!");
            return false;
          }
          const expect = Number(slot.getAttribute("data-expect"));
          const got = Number(item.getAttribute("data-num"));
          if (got !== expect) {
            onWrong("Try " + nameOf(expect) + " for this carriage!");
            say("Find " + nameOf(expect));
            return false;
          }
          item.classList.add("is-placed");
          slot.classList.add("is-filled", "is-lit");
          slot.querySelector(".le-nm-ns-carriage-label").textContent = String(got);
          slot.appendChild(item);
          item.style.visibility = "";
          placed++;
          snd.correct();
          say(nameOf(got));
          if (placed >= nums.length) {
            stageEl.querySelector(".le-nm-ns-train").classList.add("is-chugging");
            say("Choo choo! The train is ready!");
            finishRound("Choo choo! Perfect order!");
          }
          return true;
        });
      }

      /* ---- 2) Sky Balloon Adventure (11–20 only) ---- */
      function buildBalloons() {
        markStart();
        const lo = 11;
        const hi = 20;
        const nums = pickWindow(lo, hi, seqLen(lo, hi));
        const mixed = shuffle(nums.slice());
        let next = 0;

        promptEl.textContent = "Tap the balloons in order from " + nums[0] + " to " + nums[nums.length - 1] + "!";
        say("Tap the balloons in the right order!");
        choicesEl.innerHTML = "";
        stageEl.innerHTML = `
          <div class="le-nm-ns le-nm-ns-sky">
            <div class="le-nm-ns-rainbow" aria-hidden="true"></div>
            <div class="le-nm-ns-teddy-guide" aria-hidden="true">🧸</div>
            <div class="le-nm-ns-balloon-field" id="leNsBalloons">
              ${mixed.map((n, i) => `
                <button type="button" class="le-nm-ns-balloon" data-num="${n}" style="--ns-delay:${i * 0.12}s; --ns-x:${(i * 17) % 80}%; --ns-tone:${i % 6}">
                  <span class="le-nm-ns-balloon-body">${n}</span>
                  <span class="le-nm-ns-balloon-string" aria-hidden="true"></span>
                </button>`).join("")}
            </div>
            <div class="le-nm-ns-order-bar" id="leNsOrderBar"></div>
            <p class="le-nm-tap-hint">Tap the next number balloon — watch them fly!</p>
          </div>`;

        const bar = stageEl.querySelector("#leNsOrderBar");
        stageEl.querySelectorAll(".le-nm-ns-balloon").forEach((btn) => {
          btn.addEventListener("click", () => {
            if (getLocked() || btn.classList.contains("is-flown")) return;
            const n = Number(btn.getAttribute("data-num"));
            if (n !== nums[next]) {
              btn.classList.add("is-wobble");
              setTimeout(() => btn.classList.remove("is-wobble"), 400);
              onWrong("Look for " + nameOf(nums[next]) + "!");
              say("Find " + nameOf(nums[next]));
              return;
            }
            btn.classList.add("is-flown");
            bar.insertAdjacentHTML("beforeend", `<span class="le-nm-ns-order-chip">${n}</span>`);
            next++;
            snd.correct();
            say(nameOf(n));
            if (next >= nums.length) {
              stageEl.querySelector(".le-nm-ns-sky").classList.add("is-rainbow");
              say("Beautiful rainbow trail!");
              finishRound("Rainbow complete!");
            }
          });
        });
      }

      /* ---- 3) Ocean Number Expedition (21–30 only) ---- */
      function buildOcean() {
        markStart();
        const lo = 21;
        const hi = 30;
        const nums = pickWindow(lo, hi, seqLen(lo, hi));
        const mixed = shuffle(nums.slice());

        promptEl.textContent = "Collect the shell numbers in order!";
        say("Let's collect the ocean numbers in order!");
        choicesEl.innerHTML = "";
        stageEl.innerHTML = `
          <div class="le-nm-ns le-nm-ns-ocean">
            <div class="le-nm-ns-chest" id="leNsChest">
              <span class="le-nm-ns-chest-lid"></span>
              <div class="le-nm-ns-chest-slots">
                ${nums.map((n) => `<div class="le-nm-ns-slot le-nm-ns-shell-slot" data-expect="${n}"><span>?</span></div>`).join("")}
              </div>
            </div>
            <div class="le-nm-ns-reef" id="leNsReef">
              ${mixed.map((n, i) => `
                <button type="button" class="le-nm-ns-shell le-nm-ns-num" data-num="${n}" draggable="true" style="--ns-float:${i % 5}">
                  <span>${n}</span>
                </button>`).join("")}
            </div>
            <div class="le-nm-ns-sea-friends" aria-hidden="true">
              <span class="is-turtle">🐢</span><span class="is-fish">🐠</span><span class="is-octo">🐙</span>
            </div>
            <p class="le-nm-tap-hint">Drag shells into the treasure chest in order</p>
          </div>`;

        let placed = 0;
        bindNumDrag(stageEl, ".le-nm-ns-shell", ".le-nm-ns-shell-slot", (slot, item) => {
          if (getLocked()) return false;
          if (slot.classList.contains("is-filled")) return false;
          const expect = Number(slot.getAttribute("data-expect"));
          const got = Number(item.getAttribute("data-num"));
          if (got !== expect) {
            onWrong("That shell opens a different spot!");
            return false;
          }
          item.classList.add("is-placed");
          slot.classList.add("is-filled");
          slot.innerHTML = "";
          slot.appendChild(item);
          item.style.visibility = "";
          placed++;
          snd.correct();
          say(nameOf(got));
          const chest = stageEl.querySelector("#leNsChest");
          chest.classList.add("is-open-" + placed);
          if (placed >= nums.length) {
            chest.classList.add("is-treasure");
            say("Treasure found!");
            finishRound("Magical underwater treasure!");
          }
          return true;
        });
      }

      /* ---- 4) Missing Number Mystery ---- */
      function buildMystery() {
        markStart();
        const t = tier();
        const lo = sub.min || 1;
        const hi = Math.min(sub.max || 20, t === 0 ? 10 : (t === 1 ? 20 : 30));
        const len = t === 0 ? 4 : (t === 1 ? 5 : 6);
        const start = randInt(lo, Math.max(lo, hi - len + 1));
        const seq = range(start, start + len - 1);
        const missCount = t === 0 ? 1 : (t === 2 && Math.random() > 0.5 ? 2 : 1);
        const missIdx = [];
        while (missIdx.length < missCount) {
          const i = randInt(1, seq.length - 2);
          if (!missIdx.includes(i)) missIdx.push(i);
        }
        missIdx.sort((a, b) => a - b);
        const answers = missIdx.map((i) => seq[i]);
        let solved = 0;

        promptEl.textContent = missCount > 1 ? "Find the missing numbers!" : "Find the missing number!";
        say("Find the missing number!");
        choicesEl.innerHTML = "";
        stageEl.innerHTML = `
          <div class="le-nm-ns le-nm-ns-mystery">
            <div class="le-nm-ns-detective" aria-hidden="true">🕵️</div>
            <div class="le-nm-ns-clue-board">
              ${seq.map((n, i) => missIdx.includes(i)
                ? `<span class="le-nm-ns-clue is-miss" data-i="${i}">?</span>`
                : `<span class="le-nm-ns-clue">${n}</span>`).join("")}
            </div>
            <div class="le-nm-ns-clue-choices" id="leNsClues">
              ${uniqueNear(answers[0], Math.max(lo, start - 2), Math.min(hi, start + len + 1), 3 + t)
                .concat(answers.slice(1))
                .filter((v, i, a) => a.indexOf(v) === i)
                .slice(0, 4 + t)
                .map((n) => `<button type="button" class="le-nm-ns-clue-btn" data-num="${n}">${n}</button>`).join("")}
            </div>
            <p class="le-nm-tap-hint">Tap the number that belongs in the mystery spot</p>
            <div class="le-nm-ns-mystery-progress" id="leNsMysteryProg"></div>
          </div>`;

        // rebuild choices to include all answers
        const choiceSet = uniqueNear(answers[0], Math.max(1, start - 3), Math.min(30, start + len + 3), 3 + t);
        answers.forEach((a) => { if (!choiceSet.includes(a)) choiceSet.push(a); });
        const choiceBox = stageEl.querySelector("#leNsClues");
        choiceBox.innerHTML = shuffle(choiceSet).slice(0, Math.max(3, choiceSet.length)).map((n) =>
          `<button type="button" class="le-nm-ns-clue-btn" data-num="${n}">${n}</button>`
        ).join("");

        let focus = 0;
        function highlightMiss() {
          stageEl.querySelectorAll(".le-nm-ns-clue.is-miss").forEach((el, idx) => {
            el.classList.toggle("is-focus", idx === focus && !el.classList.contains("is-solved"));
          });
        }
        highlightMiss();

        choiceBox.querySelectorAll(".le-nm-ns-clue-btn").forEach((btn) => {
          btn.addEventListener("click", () => {
            if (getLocked() || focus >= missIdx.length) return;
            const n = Number(btn.getAttribute("data-num"));
            const need = answers[focus];
            if (n !== need) {
              btn.classList.add("is-wrong");
              setTimeout(() => btn.classList.remove("is-wrong"), 350);
              onWrong("Keep investigating!");
              return;
            }
            const missEls = stageEl.querySelectorAll(".le-nm-ns-clue.is-miss:not(.is-solved)");
            const cell = missEls[0];
            if (cell) {
              cell.textContent = String(n);
              cell.classList.add("is-solved");
              cell.classList.remove("is-focus", "is-miss");
            }
            btn.disabled = true;
            btn.classList.add("is-used");
            solved++;
            focus++;
            snd.correct();
            say(nameOf(n));
            stageEl.querySelector("#leNsMysteryProg").textContent = "Clue " + solved + " solved!";
            if (solved >= missCount) {
              stageEl.querySelector(".le-nm-ns-mystery").classList.add("is-solved");
              finishRound("Mystery solved!");
            } else {
              highlightMiss();
              say("Find the next missing number!");
            }
          });
        });
      }

      /* ---- 5) Before, Between & After — Neighbour Village ---- */
      function buildNeighbours() {
        markStart();
        const t = tier();
        const lo = 1;
        const hi = t === 0 ? 10 : (t === 1 ? 20 : 30);
        const modes = t === 0
          ? ["before", "after"]
          : ["before", "after", "between"];
        const mode = modes[getRound() % modes.length];

        let target;
        let answer;
        let prompt;
        let speak;

        if (mode === "before") {
          target = randInt(lo + 1, hi);
          answer = target - 1;
          prompt = "Which house comes BEFORE " + target + "?";
          speak = "Which number comes before " + nameOf(target) + "?";
        } else if (mode === "after") {
          target = randInt(lo, hi - 1);
          answer = target + 1;
          prompt = "Which house comes AFTER " + target + "?";
          speak = "Which number comes after " + nameOf(target) + "?";
        } else {
          const mid = randInt(lo + 1, hi - 1);
          answer = mid;
          prompt = "Which house is BETWEEN " + (mid - 1) + " and " + (mid + 1) + "?";
          speak = "Which number is between " + nameOf(mid - 1) + " and " + nameOf(mid + 1) + "?";
          target = mid;
        }

        const houseCount = t === 0 ? 3 : 4;
        let houses = uniqueNear(answer, lo, hi, houseCount);
        if (!houses.includes(answer)) houses[0] = answer;
        houses = shuffle(houses);

        promptEl.textContent = prompt;
        say(speak);
        choicesEl.innerHTML = "";
        stageEl.innerHTML = `
          <div class="le-nm-ns le-nm-ns-village">
            <div class="le-nm-ns-village-banner is-${mode}">${mode.toUpperCase()}</div>
            <div class="le-nm-ns-visitor" aria-hidden="true">🐻</div>
            <div class="le-nm-ns-houses">
              ${houses.map((n) => `
                <button type="button" class="le-nm-ns-house" data-num="${n}">
                  <span class="le-nm-ns-roof"></span>
                  <span class="le-nm-ns-door">${n}</span>
                  <span class="le-nm-ns-neighbour" aria-hidden="true">😊</span>
                </button>`).join("")}
            </div>
            <p class="le-nm-tap-hint">Tap the correct neighbouring house</p>
          </div>`;

        stageEl.querySelectorAll(".le-nm-ns-house").forEach((btn) => {
          btn.addEventListener("click", () => {
            if (getLocked()) return;
            const n = Number(btn.getAttribute("data-num"));
            if (n !== answer) {
              btn.classList.add("is-shake");
              setTimeout(() => btn.classList.remove("is-shake"), 400);
              onWrong("Try another house!");
              return;
            }
            btn.classList.add("is-open");
            snd.correct();
            say("Yes! " + nameOf(n));
            finishRound("Happy neighbours!");
          });
        });
      }

      /* ---- 6) Ascending & Descending Mountain ---- */
      function buildMountain() {
        markStart();
        const t = tier();
        const ascending = getRound() % 2 === 0;
        const lo = 1;
        const hi = t === 0 ? 10 : (t === 1 ? 15 : 20);
        const len = t === 0 ? 3 : (t === 1 ? 4 : 5);
        const start = randInt(lo, Math.max(lo, hi - len + 1));
        const nums = range(start, start + len - 1);
        const ordered = ascending ? nums.slice() : nums.slice().reverse();
        const mixed = shuffle(nums.slice());

        promptEl.textContent = ascending
          ? "Climb up — smallest to biggest!"
          : "Slide down — biggest to smallest!";
        say(ascending ? "Arrange from smallest to biggest!" : "Arrange from biggest to smallest!");
        choicesEl.innerHTML = "";
        stageEl.innerHTML = `
          <div class="le-nm-ns le-nm-ns-mountain ${ascending ? "is-up" : "is-down"}">
            <div class="le-nm-ns-summit" aria-hidden="true">🚩</div>
            <div class="le-nm-ns-climber" id="leNsClimber" aria-hidden="true">🧗</div>
            <div class="le-nm-ns-platforms" id="leNsPlatforms">
              ${ordered.map((n, i) => `
                <div class="le-nm-ns-platform le-nm-ns-slot" data-expect="${n}" data-step="${i}">
                  <span class="le-nm-ns-plat-label">?</span>
                </div>`).join("")}
            </div>
            <div class="le-nm-ns-pool">
              ${mixed.map((n) => numChip(n, "is-block", { num: n })).join("")}
            </div>
            <p class="le-nm-tap-hint">${ascending ? "Smallest number goes on the first step" : "Biggest number goes on the first step"}</p>
          </div>`;

        let placed = 0;
        bindNumDrag(stageEl, ".le-nm-ns-num", ".le-nm-ns-platform", (slot, item) => {
          if (getLocked()) return false;
          if (slot.classList.contains("is-filled")) return false;
          const expect = Number(slot.getAttribute("data-expect"));
          const got = Number(item.getAttribute("data-num"));
          if (got !== expect) {
            onWrong(ascending ? "Climb with the next smallest!" : "Slide with the next biggest!");
            return false;
          }
          item.classList.add("is-placed");
          slot.classList.add("is-filled");
          slot.querySelector(".le-nm-ns-plat-label").textContent = String(got);
          slot.appendChild(item);
          item.style.visibility = "";
          placed++;
          const climber = stageEl.querySelector("#leNsClimber");
          climber.style.setProperty("--ns-step", placed);
          climber.classList.add("is-move");
          snd.correct();
          say(nameOf(got));
          if (placed >= ordered.length) {
            stageEl.querySelector(".le-nm-ns-mountain").classList.add("is-done");
            finishRound(ascending ? "You reached the summit!" : "Safe climb down!");
          }
          return true;
        });
      }

      /* ---- 7) Number Pattern Detective ---- */
      function buildPattern() {
        markStart();
        const t = tier();
        let shown;
        let answer;
        let ruleSpeak;

        if (t === 0 || (t === 1 && Math.random() > 0.45)) {
          // repeating ABAB
          const a = randInt(1, 5);
          let b = randInt(1, 6);
          while (b === a) b = randInt(1, 6);
          shown = [a, b, a, b];
          answer = a;
          ruleSpeak = "Look at the repeating pattern!";
        } else if (t === 1 || Math.random() > 0.4) {
          // count by 2
          const start = randInt(1, 4) * 2;
          shown = [start, start + 2, start + 4];
          answer = start + 6;
          ruleSpeak = "Counting by twos!";
        } else {
          // count by 5
          const start = randInt(1, 3) * 5;
          shown = [start, start + 5, start + 10];
          answer = start + 15;
          ruleSpeak = "Counting by fives!";
        }

        const choices = uniqueNear(answer, 1, Math.max(30, answer + 5), 3 + (t > 0 ? 1 : 0));

        promptEl.textContent = "What comes next in the pattern?";
        say(ruleSpeak);
        choicesEl.innerHTML = "";
        stageEl.innerHTML = `
          <div class="le-nm-ns le-nm-ns-lab">
            <div class="le-nm-ns-robot" aria-hidden="true">🤖</div>
            <div class="le-nm-ns-machine">
              <div class="le-nm-ns-pattern-board">
                ${shown.map((n) => `<span class="le-nm-ns-pat-cell">${n}</span>`).join("")}
                <span class="le-nm-ns-pat-cell is-miss">?</span>
              </div>
              <div class="le-nm-ns-gears" aria-hidden="true"><span></span><span></span><span></span></div>
            </div>
            <div class="le-nm-ns-lab-choices">
              ${choices.map((n) => `<button type="button" class="le-nm-ns-lab-btn" data-num="${n}">${n}</button>`).join("")}
            </div>
            <p class="le-nm-tap-hint">Spot the rule, then tap the missing number</p>
          </div>`;

        stageEl.querySelectorAll(".le-nm-ns-lab-btn").forEach((btn) => {
          btn.addEventListener("click", () => {
            if (getLocked()) return;
            const n = Number(btn.getAttribute("data-num"));
            if (n !== answer) {
              btn.classList.add("is-wrong");
              setTimeout(() => btn.classList.remove("is-wrong"), 350);
              onWrong("Look at the pattern again!");
              return;
            }
            const miss = stageEl.querySelector(".le-nm-ns-pat-cell.is-miss");
            if (miss) {
              miss.textContent = String(n);
              miss.classList.remove("is-miss");
              miss.classList.add("is-filled");
            }
            stageEl.querySelector(".le-nm-ns-lab").classList.add("is-active");
            snd.correct();
            say("Amazing! You solved the puzzle!");
            finishRound("Pattern complete!");
          });
        });
      }

      return {
        ns_train: buildTrain,
        ns_balloons: buildBalloons,
        ns_ocean: buildOcean,
        ns_mystery: buildMystery,
        ns_neighbours: buildNeighbours,
        ns_mountain: buildMountain,
        ns_pattern: buildPattern,
      };
    },
  };
})();
