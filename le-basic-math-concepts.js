/* ============================================================
   LumaCubs — Basic Mathematical Concepts (complete discovery world)
   11 spatial / comparative concept adventures. BMC hub only.
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
  function pick(arr) { return arr[randInt(0, arr.length - 1)]; }

  function bindDrag(root, itemSel, slotSel, onDrop) {
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
    { id: "big_small", title: "Big & Small Adventure", blurb: "Find big and small toys!", art: "toyland" },
    { id: "long_short", title: "Long & Short Railway", blurb: "Compare tracks and ribbons!", art: "railway" },
    { id: "tall_short", title: "Tall & Short Tower Builder", blurb: "Spot tall and short towers!", art: "build" },
    { id: "heavy_light", title: "Heavy & Light Balance Lab", blurb: "Watch the scale tip!", art: "lab" },
    { id: "full_empty", title: "Full & Empty Picnic", blurb: "Fill jars and empty cups!", art: "picnic" },
    { id: "same_diff", title: "Same & Different Discovery", blurb: "Match pairs and find odd ones!", art: "discover" },
    { id: "near_far", title: "Near & Far Explorer", blurb: "Who is near the teddy?", art: "play" },
    { id: "inside_out", title: "Inside & Outside Adventure", blurb: "Put toys in or out!", art: "animal" },
    { id: "above_below", title: "Above & Below Sky Adventure", blurb: "Balloons above, flowers below!", art: "sky" },
    { id: "left_right", title: "Left & Right Dance Party", blurb: "Dance left and right!", art: "dance" },
    { id: "first_last", title: "First, Middle & Last Race", blurb: "Who is first in the race?", art: "race" },
  ];

  function teddySVG(size) {
    const s = size || 64;
    return `<svg class="le-nm-bmc-char" viewBox="0 0 80 90" width="${s}" height="${Math.round(s * 1.12)}" aria-hidden="true">
      <ellipse cx="40" cy="82" rx="22" ry="6" fill="#5B4A7A" opacity=".15"/>
      <ellipse cx="40" cy="58" rx="24" ry="22" fill="#E8B86D"/>
      <circle cx="18" cy="28" r="11" fill="#D4A574"/><circle cx="62" cy="28" r="11" fill="#D4A574"/>
      <circle cx="40" cy="36" r="20" fill="#E8B86D"/>
      <circle cx="33" cy="34" r="2.4" fill="#5B4A7A"/><circle cx="47" cy="34" r="2.4" fill="#5B4A7A"/>
      <ellipse cx="40" cy="42" rx="4" ry="3" fill="#C9845A"/>
      <path d="M34 48c4 4 8 4 12 0" stroke="#C9845A" stroke-width="2" fill="none"/>
    </svg>`;
  }
  function bunnySVG(size) {
    const s = size || 64;
    return `<svg class="le-nm-bmc-char" viewBox="0 0 80 90" width="${s}" height="${Math.round(s * 1.12)}" aria-hidden="true">
      <ellipse cx="40" cy="82" rx="20" ry="5" fill="#5B4A7A" opacity=".15"/>
      <ellipse cx="28" cy="18" rx="8" ry="20" fill="#C9A0FF"/><ellipse cx="52" cy="18" rx="8" ry="20" fill="#C9A0FF"/>
      <ellipse cx="28" cy="20" rx="3" ry="10" fill="#F6D7A8"/><ellipse cx="52" cy="20" rx="3" ry="10" fill="#F6D7A8"/>
      <ellipse cx="40" cy="55" rx="22" ry="24" fill="#C9A0FF"/>
      <circle cx="40" cy="40" r="18" fill="#C9A0FF"/>
      <circle cx="33" cy="38" r="2.2" fill="#5B4A7A"/><circle cx="47" cy="38" r="2.2" fill="#5B4A7A"/>
      <ellipse cx="40" cy="46" rx="4" ry="3" fill="#E8A0C0"/>
      <path d="M34 52c4 3 8 3 12 0" stroke="#7E5FB0" stroke-width="2" fill="none"/>
    </svg>`;
  }

  window.LUMACUBS_BMC = {
    create(ctx) {
      const {
        stageEl, promptEl, choicesEl, say, onCorrect, onWrong, snd, confetti,
        sub, getLocked, setLocked, getAgeHubReturn, trackPlatformProgress, LS, roundEl,
      } = ctx;

      let seenIntro = false;

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
      function lock(v) { if (typeof setLocked === "function") setLocked(!!v); }
      function ageCfg() {
        const t = tier();
        if (t === 0) return { choices: 2, rounds: 3, complex: false, objects: 2 };
        if (t === 1) return { choices: 3, rounds: 4, complex: true, objects: 3 };
        return { choices: 3, rounds: 5, complex: true, objects: 4, timed: true };
      }

      /* ---------- Intro ---------- */
      function showIntro() {
        if (roundEl) roundEl.textContent = "Intro";
        promptEl.textContent = "Basic Mathematical Concepts";
        say("Welcome to our magical math discovery world!");
        choicesEl.innerHTML = "";
        lock(false);
        stageEl.innerHTML = `
          <div class="le-nm-bmc le-nm-bmc-intro">
            <div class="le-nm-bmc-intro-art">
              ${teddySVG(88)}${bunnySVG(88)}
              <div class="le-nm-bmc-sparkles" aria-hidden="true"><span></span><span></span><span></span></div>
            </div>
            <h3>Basic Mathematical Concepts</h3>
            <p>Join Teddy and Bunny! Explore big and small, near and far, left and right, and many more magical ideas.</p>
            <button type="button" class="le-nm-choice le-nm-done" id="leBmcStart">Start Learning</button>
          </div>`;
        stageEl.querySelector("#leBmcStart").addEventListener("click", () => {
          snd.pop();
          seenIntro = true;
          say("Let's explore together!");
          showHub();
        });
      }

      /* ---------- Hub ---------- */
      function showHub() {
        if (!seenIntro) { showIntro(); return; }
        if (roundEl) roundEl.textContent = "Explore";
        promptEl.textContent = "Choose a discovery adventure!";
        say("Which adventure shall we try?");
        choicesEl.innerHTML = "";
        lock(false);
        const done = EXERCISES.filter((ex) => exStars(ex.id) > 0).length;
        stageEl.innerHTML = `
          <div class="le-nm-bmc le-nm-bmc-hub">
            <div class="le-nm-bmc-hub-hero">
              ${teddySVG(56)}${bunnySVG(56)}
              <div>
                <h3>Math Discovery World</h3>
                <p>${done}/${EXERCISES.length} adventures complete</p>
              </div>
            </div>
            <div class="le-nm-bmc-grid">
              ${EXERCISES.map((ex, i) => {
                const st = exStars(ex.id);
                return `<button type="button" class="le-nm-bmc-card${st ? " is-done" : ""}" data-ex="${ex.id}">
                  <span class="le-nm-bmc-card-art is-${ex.art}" aria-hidden="true"></span>
                  <span class="le-nm-bmc-card-copy">
                    <strong>${i + 1}. ${ex.title}</strong>
                    <em>${ex.blurb}</em>
                    <span>${st ? ("★".repeat(Math.min(3, st)) + " done") : "Tap to play"}</span>
                  </span>
                </button>`;
              }).join("")}
            </div>
          </div>`;
        stageEl.querySelectorAll(".le-nm-bmc-card").forEach((btn) => {
          btn.addEventListener("click", () => {
            snd.pop();
            runExercise(btn.getAttribute("data-ex"));
          });
        });
        if (allDone()) {
          confetti(14);
          setTimeout(() => onCorrect("You discovered every math idea!"), 700);
        }
      }

      function endExercise(exId, stars) {
        setExStars(exId, stars);
        confetti(10);
        say("Wonderful exploring!");
        lock(true);
        choicesEl.innerHTML = `
          <button type="button" class="le-nm-choice le-nm-done" id="leBmcAgain">Replay</button>
          <button type="button" class="le-nm-choice" id="leBmcHub">More adventures</button>`;
        choicesEl.querySelector("#leBmcAgain").addEventListener("click", () => { snd.pop(); lock(false); runExercise(exId); });
        choicesEl.querySelector("#leBmcHub").addEventListener("click", () => { snd.pop(); lock(false); showHub(); });
        if (allDone()) setTimeout(() => onCorrect("Amazing math explorer!"), 500);
      }

      function runExercise(exId) {
        const cfg = ageCfg();
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
          buildRound(exId, cfg, round <= 2, () => {
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
          big_small: exBigSmall, long_short: exLongShort, tall_short: exTallShort,
          heavy_light: exHeavyLight, full_empty: exFullEmpty, same_diff: exSameDiff,
          near_far: exNearFar, inside_out: exInsideOut, above_below: exAboveBelow,
          left_right: exLeftRight, first_last: exFirstLast,
        };
        (map[exId] || exBigSmall)(cfg, soft, onWin);
      }

      /* ===== 1. Big & Small ===== */
      function exBigSmall(cfg, soft, onWin) {
        const wantBig = Math.random() > 0.5;
        const toys = soft || tier() === 0
          ? [{ id: "a", size: "big", label: "teddy" }, { id: "b", size: "small", label: "teddy" }]
          : shuffle([
            { id: "a", size: "big", label: "ball" },
            { id: "b", size: "small", label: "ball" },
            { id: "c", size: "big", label: "block" },
            { id: "d", size: "small", label: "block" },
          ]).slice(0, cfg.objects);
        const target = wantBig ? "big" : "small";
        promptEl.textContent = wantBig ? "Can you find the big toy?" : "Can you find the small toy?";
        say(wantBig ? "Can you find the big teddy?" : "Can you find the small toy?");
        const mode = soft ? "tap" : "basket";
        if (mode === "tap") {
          stageEl.innerHTML = `
            <div class="le-nm-bmc le-nm-bmc-toyland">
              <div class="le-nm-bmc-deco is-toyland" aria-hidden="true"></div>
              <div class="le-nm-bmc-row">
                ${toys.map((t) => `
                  <button type="button" class="le-nm-bmc-toy is-${t.size} is-${t.label}" data-size="${t.size}" aria-label="${t.size} ${t.label}">
                    <span class="le-nm-bmc-toy-body"></span>
                  </button>`).join("")}
              </div>
              <p class="le-nm-tap-hint">Tap the ${target} one</p>
            </div>`;
          stageEl.querySelectorAll(".le-nm-bmc-toy").forEach((btn) => {
            btn.addEventListener("click", () => {
              if (getLocked()) return;
              if (btn.getAttribute("data-size") === target) {
                btn.classList.add("is-win");
                say(wantBig ? "Big!" : "Small!");
                onWin();
              } else onWrong(wantBig ? "Look for the bigger toy!" : "Look for the smaller toy!");
            });
          });
          return;
        }
        stageEl.innerHTML = `
          <div class="le-nm-bmc le-nm-bmc-toyland">
            <div class="le-nm-bmc-deco is-toyland" aria-hidden="true"></div>
            <div class="le-nm-bmc-row" id="leBmcToyPool">
              ${toys.map((t) => `
                <button type="button" class="le-nm-bmc-toy le-nm-bmc-drag is-${t.size} is-${t.label}" data-size="${t.size}" draggable="true">
                  <span class="le-nm-bmc-toy-body"></span>
                </button>`).join("")}
            </div>
            <div class="le-nm-bmc-baskets">
              <div class="le-nm-bmc-basket le-nm-bmc-slot" data-need="${target}">
                <span>${wantBig ? "Big basket" : "Small basket"}</span>
              </div>
            </div>
            <p class="le-nm-tap-hint">Drag the ${target} toy into the basket</p>
          </div>`;
        bindDrag(stageEl, ".le-nm-bmc-drag", ".le-nm-bmc-basket", (slot, item) => {
          if (getLocked()) return false;
          const need = slot.getAttribute("data-need");
          if (item.getAttribute("data-size") !== need) {
            onWrong("That toy does not belong in this basket!");
            return false;
          }
          item.classList.add("is-placed");
          slot.appendChild(item);
          item.style.visibility = "";
          say(wantBig ? "Big!" : "Small!");
          onWin();
          return true;
        });
      }

      /* ===== 2. Long & Short ===== */
      function exLongShort(cfg, soft, onWin) {
        const wantLong = Math.random() > 0.5;
        const items = soft || tier() === 0
          ? [{ id: "l", len: "long" }, { id: "s", len: "short" }]
          : shuffle([{ id: "a", len: "long" }, { id: "b", len: "short" }, { id: "c", len: "mid" }]).slice(0, Math.min(3, cfg.objects));
        const target = wantLong ? "long" : "short";
        promptEl.textContent = wantLong ? "Which train track is longer?" : "Which one is shorter?";
        say(wantLong ? "Which train track is longer?" : "Which one is shorter?");
        const buildMode = !soft && tier() > 0;
        if (!buildMode) {
          stageEl.innerHTML = `
            <div class="le-nm-bmc le-nm-bmc-railway">
              <div class="le-nm-bmc-deco is-railshop" aria-hidden="true"></div>
              <div class="le-nm-bmc-tracks">
                ${items.map((it) => `
                  <button type="button" class="le-nm-bmc-track is-${it.len}" data-len="${it.len}" aria-label="${it.len} track">
                    <span class="le-nm-bmc-track-bar"></span>
                  </button>`).join("")}
              </div>
              <p class="le-nm-tap-hint">Tap the ${target} track</p>
            </div>`;
          stageEl.querySelectorAll(".le-nm-bmc-track").forEach((btn) => {
            btn.addEventListener("click", () => {
              if (getLocked()) return;
              const len = btn.getAttribute("data-len");
              if (len === target || (target === "long" && len === "long") || (target === "short" && len === "short")) {
                if (len === "mid") { onWrong("Compare carefully!"); return; }
                btn.classList.add("is-win");
                stageEl.querySelector(".le-nm-bmc-railway").classList.add("is-chug");
                say(wantLong ? "Long!" : "Short!");
                onWin();
              } else onWrong(wantLong ? "Find the longer track!" : "Find the shorter track!");
            });
          });
          return;
        }
        // Arrange longest-first to build railway
        const order = shuffle([{ id: "1", len: "long" }, { id: "2", len: "mid" }, { id: "3", len: "short" }]);
        promptEl.textContent = "Build the railway: longest track first!";
        say("Let's build a railway with the longest track first!");
        stageEl.innerHTML = `
          <div class="le-nm-bmc le-nm-bmc-railway">
            <div class="le-nm-bmc-train-run" id="leBmcTrain" aria-hidden="true"></div>
            <div class="le-nm-bmc-build-slots">
              <div class="le-nm-bmc-slot is-track" data-ord="0" data-expect="long">1</div>
              <div class="le-nm-bmc-slot is-track" data-ord="1" data-expect="mid">2</div>
              <div class="le-nm-bmc-slot is-track" data-ord="2" data-expect="short">3</div>
            </div>
            <div class="le-nm-bmc-pool">
              ${order.map((it) => `
                <button type="button" class="le-nm-bmc-track le-nm-bmc-drag is-${it.len}" data-len="${it.len}" draggable="true">
                  <span class="le-nm-bmc-track-bar"></span>
                </button>`).join("")}
            </div>
            <p class="le-nm-tap-hint">Place tracks from longest to shortest</p>
          </div>`;
        let focus = 0, placed = 0;
        bindDrag(stageEl, ".le-nm-bmc-drag", ".le-nm-bmc-slot.is-track", (slot, item) => {
          if (getLocked() || slot.classList.contains("is-filled")) return false;
          if (Number(slot.getAttribute("data-ord")) !== focus) {
            onWrong("Place the next track in order!");
            return false;
          }
          if (item.getAttribute("data-len") !== slot.getAttribute("data-expect")) {
            onWrong("That track length is not right!");
            return false;
          }
          item.classList.add("is-placed");
          slot.classList.add("is-filled");
          slot.innerHTML = "";
          slot.appendChild(item);
          item.style.visibility = "";
          placed++; focus++;
          if (placed >= 3) {
            stageEl.querySelector(".le-nm-bmc-railway").classList.add("is-chug");
            onWin();
          }
          return true;
        });
      }

      /* ===== 3. Tall & Short ===== */
      function exTallShort(cfg, soft, onWin) {
        const wantTall = Math.random() > 0.5;
        const towers = soft || tier() === 0
          ? [{ h: 4, size: "tall" }, { h: 1, size: "short" }]
          : shuffle([{ h: 5, size: "tall" }, { h: 3, size: "mid" }, { h: 1, size: "short" }]).slice(0, Math.min(3, cfg.objects));
        const target = wantTall ? "tall" : "short";
        const stackMode = !soft && tier() > 0 && Math.random() > 0.45;
        if (!stackMode) {
          promptEl.textContent = wantTall ? "Which tower is taller?" : "Which tower is shorter?";
          say(wantTall ? "Let's find the tall tower!" : "Which tower is shorter?");
          stageEl.innerHTML = `
            <div class="le-nm-bmc le-nm-bmc-build">
              <div class="le-nm-bmc-deco is-site" aria-hidden="true"></div>
              <div class="le-nm-bmc-towers">
                ${towers.map((t, i) => `
                  <button type="button" class="le-nm-bmc-tower" data-size="${t.size}" aria-label="${t.size} tower">
                    ${Array.from({ length: t.h }, () => `<span class="le-nm-bmc-block"></span>`).join("")}
                  </button>`).join("")}
              </div>
              <p class="le-nm-tap-hint">Tap the ${target} tower</p>
            </div>`;
          stageEl.querySelectorAll(".le-nm-bmc-tower").forEach((btn) => {
            btn.addEventListener("click", () => {
              if (getLocked()) return;
              const sz = btn.getAttribute("data-size");
              if (sz === target) {
                btn.classList.add("is-win");
                say(wantTall ? "Tall!" : "Short!");
                onWin();
              } else onWrong(wantTall ? "Look for the taller tower!" : "Look for the shorter tower!");
            });
          });
          return;
        }
        const need = tier() === 2 ? 4 : 3;
        promptEl.textContent = "Let's build a tall tower!";
        say("Let's build a tall tower!");
        stageEl.innerHTML = `
          <div class="le-nm-bmc le-nm-bmc-build">
            <div class="le-nm-bmc-stack-target" id="leBmcStack" data-need="${need}"></div>
            <div class="le-nm-bmc-pool">
              ${Array.from({ length: need + 1 }, (_, i) => `
                <button type="button" class="le-nm-bmc-block-btn le-nm-bmc-drag" data-id="${i}" draggable="true"></button>`).join("")}
            </div>
            <p class="le-nm-tap-hint">Stack ${need} blocks to make a tall tower</p>
          </div>`;
        let stacked = 0;
        bindDrag(stageEl, ".le-nm-bmc-drag", ".le-nm-bmc-stack-target", (slot, item) => {
          if (getLocked() || item.classList.contains("is-placed")) return false;
          item.classList.add("is-placed");
          slot.appendChild(item);
          item.style.visibility = "";
          stacked++;
          say(String(stacked));
          if (stacked >= need) {
            slot.classList.add("is-win");
            onWin();
          }
          return true;
        });
      }

      /* ===== 4. Heavy & Light ===== */
      function exHeavyLight(cfg, soft, onWin) {
        // Visual mass cues: rock vs feather-like balloon, book vs leaf — size matches weight for kids
        const pairs = [
          { heavy: { id: "rock", label: "rock" }, light: { id: "balloon", label: "balloon" } },
          { heavy: { id: "book", label: "book" }, light: { id: "leaf", label: "leaf" } },
          { heavy: { id: "apple", label: "apple" }, light: { id: "feather", label: "feather" } },
        ];
        const pair = pick(pairs);
        const wantHeavy = Math.random() > 0.5;
        promptEl.textContent = wantHeavy ? "Which side is heavier?" : "Which side is lighter?";
        say(wantHeavy ? "Which side is heavier?" : "Which object is lighter?");
        const leftHeavy = Math.random() > 0.5;
        const left = leftHeavy ? pair.heavy : pair.light;
        const right = leftHeavy ? pair.light : pair.heavy;
        const answer = wantHeavy ? (leftHeavy ? "left" : "right") : (leftHeavy ? "right" : "left");
        const tilt = leftHeavy ? "tilt-left" : "tilt-right";
        stageEl.innerHTML = `
          <div class="le-nm-bmc le-nm-bmc-lab">
            <div class="le-nm-bmc-scientist">${teddySVG(48)}</div>
            <div class="le-nm-bmc-scale ${tilt}" id="leBmcScale">
              <div class="le-nm-bmc-beam"></div>
              <button type="button" class="le-nm-bmc-pan is-left" data-side="left">
                <span class="le-nm-bmc-obj is-${left.id}" title="${left.label}"></span>
              </button>
              <button type="button" class="le-nm-bmc-pan is-right" data-side="right">
                <span class="le-nm-bmc-obj is-${right.id}" title="${right.label}"></span>
              </button>
              <div class="le-nm-bmc-fulcrum"></div>
            </div>
            <p class="le-nm-tap-hint">Watch the scale · tap the ${wantHeavy ? "heavier" : "lighter"} side</p>
          </div>`;
        stageEl.querySelectorAll(".le-nm-bmc-pan").forEach((btn) => {
          btn.addEventListener("click", () => {
            if (getLocked()) return;
            if (btn.getAttribute("data-side") === answer) {
              btn.classList.add("is-win");
              say(wantHeavy ? "Heavy!" : "Light!");
              onWin();
            } else onWrong(wantHeavy ? "The scale tips toward the heavier side!" : "The lighter side goes up!");
          });
        });
      }

      /* ===== 5. Full & Empty ===== */
      function exFullEmpty(cfg, soft, onWin) {
        const states = soft || tier() === 0
          ? ["full", "empty"]
          : shuffle(["full", "empty", "half"]).slice(0, Math.min(3, cfg.objects));
        const askHalf = tier() > 0 && !soft && states.includes("half") && Math.random() > 0.5;
        const want = askHalf ? "half" : (Math.random() > 0.5 ? "full" : "empty");
        const fillMode = !soft && tier() > 0 && want === "full" && Math.random() > 0.4;
        if (!fillMode) {
          promptEl.textContent = want === "full" ? "Can you find the full cup?"
            : want === "empty" ? "Can you find the empty cup?" : "Which jar is half full?";
          say(promptEl.textContent);
          stageEl.innerHTML = `
            <div class="le-nm-bmc le-nm-bmc-picnic">
              <div class="le-nm-bmc-deco is-picnic" aria-hidden="true"></div>
              <div class="le-nm-bmc-jars">
                ${states.map((st) => `
                  <button type="button" class="le-nm-bmc-jar is-${st}" data-fill="${st}" aria-label="${st} jar">
                    <span class="le-nm-bmc-fill"></span>
                  </button>`).join("")}
              </div>
              <p class="le-nm-tap-hint">Tap the ${want} container</p>
            </div>`;
          stageEl.querySelectorAll(".le-nm-bmc-jar").forEach((btn) => {
            btn.addEventListener("click", () => {
              if (getLocked()) return;
              if (btn.getAttribute("data-fill") === want) {
                btn.classList.add("is-win");
                say(want === "full" ? "Full!" : want === "empty" ? "Empty!" : "Half full!");
                onWin();
              } else onWrong("Look at how full each jar is!");
            });
          });
          return;
        }
        promptEl.textContent = "Fill the jar until it is full!";
        say("Fill the jar until it is full!");
        const need = tier() === 2 ? 5 : 4;
        stageEl.innerHTML = `
          <div class="le-nm-bmc le-nm-bmc-picnic">
            <div class="le-nm-bmc-jar is-empty is-fillable le-nm-bmc-slot" id="leBmcJar" data-need="${need}">
              <span class="le-nm-bmc-fill" id="leBmcFill" style="--fill:0"></span>
            </div>
            <div class="le-nm-bmc-pool">
              ${Array.from({ length: need }, (_, i) => `
                <button type="button" class="le-nm-bmc-berry le-nm-bmc-drag" data-id="${i}" draggable="true"></button>`).join("")}
            </div>
            <p class="le-nm-tap-hint">Drag ${need} berries into the jar</p>
          </div>`;
        let filled = 0;
        bindDrag(stageEl, ".le-nm-bmc-drag", ".le-nm-bmc-slot", (slot, item) => {
          if (getLocked() || item.classList.contains("is-placed")) return false;
          item.classList.add("is-placed");
          item.style.visibility = "hidden";
          filled++;
          const pct = Math.round((filled / need) * 100);
          stageEl.querySelector("#leBmcFill").style.setProperty("--fill", pct);
          slot.classList.toggle("is-full", filled >= need);
          slot.classList.remove("is-empty");
          if (filled >= need) {
            say("Full!");
            onWin();
          }
          return true;
        });
      }

      /* ===== 6. Same & Different ===== */
      function exSameDiff(cfg, soft, onWin) {
        const kinds = ["car", "star", "apple", "duck", "block"];
        const findSame = soft || Math.random() > 0.4;
        if (findSame) {
          const match = pick(kinds);
          const other = pick(kinds.filter((k) => k !== match));
          const items = tier() === 0
            ? shuffle([{ k: match, pair: "a" }, { k: match, pair: "b" }, { k: other, pair: "x" }])
            : shuffle([{ k: match, pair: "a" }, { k: match, pair: "b" }, { k: other, pair: "x" }, { k: pick(kinds.filter((k) => k !== match)), pair: "y" }]).slice(0, cfg.objects + 1);
          promptEl.textContent = "Find two toys that are the same!";
          say("Find two toys that are the same!");
          stageEl.innerHTML = `
            <div class="le-nm-bmc le-nm-bmc-discover">
              <div class="le-nm-bmc-deco is-room" aria-hidden="true"></div>
              <div class="le-nm-bmc-match-row">
                ${items.map((it, i) => `
                  <button type="button" class="le-nm-bmc-match is-${it.k}" data-kind="${it.k}" data-i="${i}"></button>`).join("")}
              </div>
              <p class="le-nm-tap-hint">Tap two matching toys</p>
            </div>`;
          let first = null;
          stageEl.querySelectorAll(".le-nm-bmc-match").forEach((btn) => {
            btn.addEventListener("click", () => {
              if (getLocked() || btn.classList.contains("is-paired")) return;
              if (!first) {
                first = btn;
                btn.classList.add("is-picked");
                snd.pop();
                return;
              }
              if (first === btn) return;
              if (first.getAttribute("data-kind") === btn.getAttribute("data-kind")) {
                first.classList.add("is-paired");
                btn.classList.add("is-paired");
                say("Same!");
                onWin();
              } else {
                first.classList.remove("is-picked");
                onWrong("Those are different — try matching ones!");
                first = null;
              }
            });
          });
          return;
        }
        // Odd one out
        const base = pick(kinds);
        const odd = pick(kinds.filter((k) => k !== base));
        const items = shuffle([base, base, base, odd]).slice(0, tier() === 0 ? 3 : 4);
        if (!items.includes(odd)) items[items.length - 1] = odd;
        promptEl.textContent = "Which one is different?";
        say("Which one is different?");
        stageEl.innerHTML = `
          <div class="le-nm-bmc le-nm-bmc-discover">
            <div class="le-nm-bmc-match-row">
              ${items.map((k, i) => `
                <button type="button" class="le-nm-bmc-match is-${k}" data-kind="${k}" data-odd="${k === odd ? 1 : 0}"></button>`).join("")}
            </div>
            <p class="le-nm-tap-hint">Tap the different one</p>
          </div>`;
        stageEl.querySelectorAll(".le-nm-bmc-match").forEach((btn) => {
          btn.addEventListener("click", () => {
            if (getLocked()) return;
            if (btn.getAttribute("data-odd") === "1") {
              btn.classList.add("is-paired");
              say("Different!");
              onWin();
            } else onWrong("That one matches the others!");
          });
        });
      }

      /* ===== 7. Near & Far ===== */
      function exNearFar(cfg, soft, onWin) {
        const wantNear = Math.random() > 0.5;
        const objs = soft || tier() === 0
          ? [{ id: "tree", dist: "far" }, { id: "ball", dist: "near" }]
          : shuffle([{ id: "tree", dist: "far" }, { id: "house", dist: "far" }, { id: "ball", dist: "near" }, { id: "flower", dist: "near" }]).slice(0, cfg.objects);
        promptEl.textContent = wantNear ? "What is near the teddy?" : "What is far from the teddy?";
        say(wantNear ? "What is near the teddy?" : "What is far from the teddy?");
        const moveMode = !soft && tier() > 0 && Math.random() > 0.5;
        if (!moveMode) {
          stageEl.innerHTML = `
            <div class="le-nm-bmc le-nm-bmc-playground">
              <div class="le-nm-bmc-scene-ground"></div>
              <div class="le-nm-bmc-explorer" id="leBmcExplorer">${teddySVG(52)}</div>
              <div class="le-nm-bmc-dist-row">
                ${objs.map((o) => `
                  <button type="button" class="le-nm-bmc-dist-obj is-${o.id} is-${o.dist}" data-dist="${o.dist}" aria-label="${o.dist} ${o.id}"></button>`).join("")}
              </div>
              <p class="le-nm-tap-hint">Tap the object that is ${wantNear ? "near" : "far"}</p>
            </div>`;
          stageEl.querySelectorAll(".le-nm-bmc-dist-obj").forEach((btn) => {
            btn.addEventListener("click", () => {
              if (getLocked()) return;
              const d = btn.getAttribute("data-dist");
              if ((wantNear && d === "near") || (!wantNear && d === "far")) {
                btn.classList.add("is-win");
                say(wantNear ? "Near!" : "Far!");
                onWin();
              } else onWrong(wantNear ? "Look closer to teddy!" : "Look farther away!");
            });
          });
          return;
        }
        promptEl.textContent = "Move teddy near the ball!";
        say("Move teddy near the ball!");
        stageEl.innerHTML = `
          <div class="le-nm-bmc le-nm-bmc-playground">
            <div class="le-nm-bmc-scene-ground"></div>
            <div class="le-nm-bmc-dist-obj is-ball is-far" id="leBmcBall" aria-hidden="true"></div>
            <div class="le-nm-bmc-explorer is-movable" id="leBmcExplorer" style="--pos:0">${teddySVG(52)}</div>
            <div class="le-nm-bmc-move-btns">
              <button type="button" class="le-nm-choice" id="leBmcCloser">Move closer</button>
              <button type="button" class="le-nm-choice" id="leBmcFarther">Move farther</button>
            </div>
            <p class="le-nm-tap-hint">Move closer until teddy is near the ball</p>
          </div>`;
        let pos = 0;
        const explorer = stageEl.querySelector("#leBmcExplorer");
        const ball = stageEl.querySelector("#leBmcBall");
        stageEl.querySelector("#leBmcCloser").addEventListener("click", () => {
          if (getLocked()) return;
          pos = Math.min(3, pos + 1);
          explorer.style.setProperty("--pos", pos);
          if (pos >= 3) {
            ball.classList.remove("is-far");
            ball.classList.add("is-near");
            explorer.classList.add("is-near");
            say("Near!");
            onWin();
          } else snd.pop();
        });
        stageEl.querySelector("#leBmcFarther").addEventListener("click", () => {
          if (getLocked()) return;
          pos = Math.max(0, pos - 1);
          explorer.style.setProperty("--pos", pos);
          snd.pop();
        });
      }

      /* ===== 8. Inside & Outside ===== */
      function exInsideOut(cfg, soft, onWin) {
        const wantIn = Math.random() > 0.5;
        const msg = wantIn ? "Put the ball inside the box!" : "Put the bunny outside the house!";
        promptEl.textContent = msg;
        say(msg);
        const toy = wantIn ? "ball" : "bunny";
        stageEl.innerHTML = `
          <div class="le-nm-bmc le-nm-bmc-animal">
            <div class="le-nm-bmc-zones">
              <div class="le-nm-bmc-zone is-inside le-nm-bmc-slot" data-zone="inside">
                <span class="le-nm-bmc-zone-label">Inside</span>
                <span class="le-nm-bmc-box-house" aria-hidden="true"></span>
              </div>
              <div class="le-nm-bmc-zone is-outside le-nm-bmc-slot" data-zone="outside">
                <span class="le-nm-bmc-zone-label">Outside</span>
              </div>
            </div>
            <div class="le-nm-bmc-pool">
              <button type="button" class="le-nm-bmc-move-toy le-nm-bmc-drag is-${toy}" data-toy="${toy}" draggable="true"></button>
            </div>
            <p class="le-nm-tap-hint">Drag the ${toy} ${wantIn ? "inside" : "outside"}</p>
          </div>`;
        const need = wantIn ? "inside" : "outside";
        bindDrag(stageEl, ".le-nm-bmc-drag", ".le-nm-bmc-zone", (slot, item) => {
          if (getLocked()) return false;
          if (slot.getAttribute("data-zone") !== need) {
            onWrong(wantIn ? "Put it inside the box!" : "Place it outside!");
            return false;
          }
          item.classList.add("is-placed");
          slot.appendChild(item);
          item.style.visibility = "";
          say(wantIn ? "Inside!" : "Outside!");
          onWin();
          return true;
        });
      }

      /* ===== 9. Above & Below ===== */
      function exAboveBelow(cfg, soft, onWin) {
        const wantAbove = Math.random() > 0.5;
        const placeMode = !soft && tier() > 0 && Math.random() > 0.4;
        if (!placeMode) {
          promptEl.textContent = wantAbove ? "What is above the tree?" : "What is below the cloud?";
          say(wantAbove ? "What is above the tree?" : "What is below the cloud?");
          stageEl.innerHTML = `
            <div class="le-nm-bmc le-nm-bmc-sky">
              <button type="button" class="le-nm-bmc-sky-obj is-bird is-above" data-pos="above" aria-label="bird above"></button>
              <div class="le-nm-bmc-sky-mid" aria-hidden="true">
                <span class="le-nm-bmc-cloud"></span>
                <span class="le-nm-bmc-tree"></span>
              </div>
              <button type="button" class="le-nm-bmc-sky-obj is-flower is-below" data-pos="below" aria-label="flower below"></button>
              <p class="le-nm-tap-hint">Tap the object ${wantAbove ? "above" : "below"}</p>
            </div>`;
          stageEl.querySelectorAll(".le-nm-bmc-sky-obj").forEach((btn) => {
            btn.addEventListener("click", () => {
              if (getLocked()) return;
              const pos = btn.getAttribute("data-pos");
              if ((wantAbove && pos === "above") || (!wantAbove && pos === "below")) {
                btn.classList.add("is-win");
                say(wantAbove ? "Above!" : "Below!");
                onWin();
              } else onWrong(wantAbove ? "Look higher up!" : "Look down below!");
            });
          });
          return;
        }
        promptEl.textContent = wantAbove ? "Move the balloon above the cloud!" : "Move the flower below the cloud!";
        say(promptEl.textContent);
        const item = wantAbove ? "balloon" : "flower";
        stageEl.innerHTML = `
          <div class="le-nm-bmc le-nm-bmc-sky">
            <div class="le-nm-bmc-sky-slot is-above le-nm-bmc-slot" data-pos="above"><span>Above</span></div>
            <div class="le-nm-bmc-cloud-line" aria-hidden="true"></div>
            <div class="le-nm-bmc-sky-slot is-below le-nm-bmc-slot" data-pos="below"><span>Below</span></div>
            <div class="le-nm-bmc-pool">
              <button type="button" class="le-nm-bmc-sky-drag le-nm-bmc-drag is-${item}" data-item="${item}" draggable="true"></button>
            </div>
            <p class="le-nm-tap-hint">Drag to the ${wantAbove ? "above" : "below"} spot</p>
          </div>`;
        const need = wantAbove ? "above" : "below";
        bindDrag(stageEl, ".le-nm-bmc-drag", ".le-nm-bmc-sky-slot", (slot, it) => {
          if (getLocked()) return false;
          if (slot.getAttribute("data-pos") !== need) {
            onWrong(wantAbove ? "Place it above!" : "Place it below!");
            return false;
          }
          it.classList.add("is-placed");
          slot.appendChild(it);
          it.style.visibility = "";
          say(wantAbove ? "Above!" : "Below!");
          onWin();
          return true;
        });
      }

      /* ===== 10. Left & Right ===== */
      function exLeftRight(cfg, soft, onWin) {
        const wantLeft = Math.random() > 0.5;
        const danceMode = !soft && tier() > 0;
        if (!danceMode) {
          promptEl.textContent = wantLeft ? "Which side is LEFT?" : "Which side is RIGHT?";
          say(wantLeft ? "Move the bunny to the left!" : "Which side is right?");
          stageEl.innerHTML = `
            <div class="le-nm-bmc le-nm-bmc-dance">
              <div class="le-nm-bmc-dance-floor">
                <button type="button" class="le-nm-bmc-side is-left" data-dir="left">
                  <span class="le-nm-bmc-arrow is-left" aria-hidden="true"></span>
                  Left
                </button>
                <div class="le-nm-bmc-dancer">${bunnySVG(56)}</div>
                <button type="button" class="le-nm-bmc-side is-right" data-dir="right">
                  <span class="le-nm-bmc-arrow is-right" aria-hidden="true"></span>
                  Right
                </button>
              </div>
              <p class="le-nm-tap-hint">From the bunny's view · tap ${wantLeft ? "left" : "right"}</p>
            </div>`;
          stageEl.querySelectorAll(".le-nm-bmc-side").forEach((btn) => {
            btn.addEventListener("click", () => {
              if (getLocked()) return;
              const dir = btn.getAttribute("data-dir");
              if ((wantLeft && dir === "left") || (!wantLeft && dir === "right")) {
                stageEl.querySelector(".le-nm-bmc-dancer").classList.add(wantLeft ? "go-left" : "go-right");
                say(wantLeft ? "Left!" : "Right!");
                onWin();
              } else onWrong(wantLeft ? "Try the other side — left!" : "Try the other side — right!");
            });
          });
          return;
        }
        // Sequence of left/right moves
        const steps = tier() === 2 ? 3 : 2;
        const seq = Array.from({ length: steps }, () => (Math.random() > 0.5 ? "left" : "right"));
        let step = 0;
        promptEl.textContent = "Dance! Follow the arrows!";
        say(seq[0] === "left" ? "Move left!" : "Move right!");
        stageEl.innerHTML = `
          <div class="le-nm-bmc le-nm-bmc-dance">
            <div class="le-nm-bmc-cue" id="leBmcCue">${seq[0] === "left" ? "← Left" : "Right →"}</div>
            <div class="le-nm-bmc-dancer" id="leBmcDancer">${teddySVG(56)}</div>
            <div class="le-nm-bmc-dance-btns">
              <button type="button" class="le-nm-bmc-side is-left" data-dir="left"><span class="le-nm-bmc-arrow is-left"></span>Left</button>
              <button type="button" class="le-nm-bmc-side is-right" data-dir="right"><span class="le-nm-bmc-arrow is-right"></span>Right</button>
            </div>
            <p class="le-nm-tap-hint">Step ${step + 1} of ${steps}</p>
          </div>`;
        const hint = stageEl.querySelector(".le-nm-tap-hint");
        const cue = stageEl.querySelector("#leBmcCue");
        const dancer = stageEl.querySelector("#leBmcDancer");
        stageEl.querySelectorAll(".le-nm-bmc-side").forEach((btn) => {
          btn.addEventListener("click", () => {
            if (getLocked()) return;
            const dir = btn.getAttribute("data-dir");
            if (dir !== seq[step]) {
              onWrong(seq[step] === "left" ? "Dance to the left!" : "Dance to the right!");
              return;
            }
            dancer.classList.remove("go-left", "go-right");
            void dancer.offsetWidth;
            dancer.classList.add(dir === "left" ? "go-left" : "go-right");
            step++;
            if (step >= steps) {
              say("Left and right — great dancing!");
              onWin();
              return;
            }
            snd.pop();
            cue.textContent = seq[step] === "left" ? "← Left" : "Right →";
            hint.textContent = "Step " + (step + 1) + " of " + steps;
            say(seq[step] === "left" ? "Move left!" : "Move right!");
          });
        });
      }

      /* ===== 11. First, Middle & Last ===== */
      function exFirstLast(cfg, soft, onWin) {
        const animals = ["rabbit", "bear", "turtle", "fox", "duck"];
        const count = soft || tier() === 0 ? 3 : Math.min(5, Math.max(3, cfg.objects));
        const line = shuffle(animals).slice(0, count);
        const roles = ["first", "middle", "last"];
        let want = pick(tier() === 0 ? ["first", "last"] : roles);
        if (want === "middle" && count < 3) want = "first";
        const arrangeMode = !soft && tier() > 0 && Math.random() > 0.45;
        if (!arrangeMode) {
          const midIdx = Math.floor((count - 1) / 2);
          const answerIdx = want === "first" ? 0 : want === "last" ? count - 1 : midIdx;
          promptEl.textContent = want === "first" ? "Who is first in the race?"
            : want === "last" ? "Who is last?" : "Who is in the middle?";
          say(promptEl.textContent);
          stageEl.innerHTML = `
            <div class="le-nm-bmc le-nm-bmc-race">
              <div class="le-nm-bmc-track-line" aria-hidden="true"></div>
              <div class="le-nm-bmc-racers">
                ${line.map((a, i) => `
                  <button type="button" class="le-nm-bmc-racer is-${a}" data-idx="${i}" aria-label="${a} position ${i + 1}"></button>`).join("")}
              </div>
              <p class="le-nm-tap-hint">Tap who is ${want}</p>
            </div>`;
          stageEl.querySelectorAll(".le-nm-bmc-racer").forEach((btn) => {
            btn.addEventListener("click", () => {
              if (getLocked()) return;
              if (Number(btn.getAttribute("data-idx")) === answerIdx) {
                btn.classList.add("is-win");
                say(want === "first" ? "First!" : want === "last" ? "Last!" : "Middle!");
                onWin();
              } else onWrong("Check the line from left to right!");
            });
          });
          return;
        }
        // Arrange: put rabbit first
        const pool = shuffle(["rabbit", "bear", "turtle"]);
        promptEl.textContent = "Line them up: rabbit first, bear middle, turtle last!";
        say("Put the rabbit first!");
        stageEl.innerHTML = `
          <div class="le-nm-bmc le-nm-bmc-race">
            <div class="le-nm-bmc-race-slots">
              <div class="le-nm-bmc-slot is-race" data-ord="0" data-expect="rabbit">First</div>
              <div class="le-nm-bmc-slot is-race" data-ord="1" data-expect="bear">Middle</div>
              <div class="le-nm-bmc-slot is-race" data-ord="2" data-expect="turtle">Last</div>
            </div>
            <div class="le-nm-bmc-pool">
              ${pool.map((a) => `
                <button type="button" class="le-nm-bmc-racer le-nm-bmc-drag is-${a}" data-animal="${a}" draggable="true"></button>`).join("")}
            </div>
            <p class="le-nm-tap-hint">Drag each animal into the correct place</p>
          </div>`;
        let focus = 0, placed = 0;
        bindDrag(stageEl, ".le-nm-bmc-drag", ".le-nm-bmc-slot.is-race", (slot, item) => {
          if (getLocked() || slot.classList.contains("is-filled")) return false;
          if (Number(slot.getAttribute("data-ord")) !== focus) {
            onWrong("Fill the next spot in order!");
            return false;
          }
          if (item.getAttribute("data-animal") !== slot.getAttribute("data-expect")) {
            onWrong("That animal belongs in a different place!");
            return false;
          }
          item.classList.add("is-placed");
          slot.classList.add("is-filled");
          slot.innerHTML = "";
          slot.appendChild(item);
          item.style.visibility = "";
          placed++; focus++;
          if (placed >= 3) {
            say("First, middle, and last — perfect!");
            onWin();
          }
          return true;
        });
      }

      return function bmcAdventure() {
        if (typeof trackPlatformProgress === "function") {
          trackPlatformProgress("le.numbers_math." + sub.id, "started");
        }
        showIntro();
      };
    },
  };
})();
