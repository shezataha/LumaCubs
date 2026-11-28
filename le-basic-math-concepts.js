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

  /* Premium concept illustrations — meaning must be obvious before text */
  function figRibbon(len) {
    return `<span class="le-nm-bmc-fig is-ribbon is-${len}" aria-hidden="true"><span class="le-nm-bmc-ribbon-bow"></span><span class="le-nm-bmc-ribbon-body"></span></span>`;
  }
  function figTree(h) {
    return `<span class="le-nm-bmc-fig is-tree is-${h}" aria-hidden="true"><span class="le-nm-bmc-tree-canopy"></span><span class="le-nm-bmc-tree-trunk"></span></span>`;
  }
  function figJar(fill) {
    const n = fill === "full" ? 9 : fill === "half" ? 4 : 0;
    const balls = Array.from({ length: n }, (_, i) => `<i class="le-nm-bmc-ball c${i % 5}"></i>`).join("");
    return `<span class="le-nm-bmc-fig is-jar is-${fill}" aria-hidden="true"><span class="le-nm-bmc-jar-glass">${balls}</span></span>`;
  }
  function figApple() {
    return `<span class="le-nm-bmc-fig is-apple" aria-hidden="true"><span class="le-nm-bmc-fruit-body is-apple"></span><span class="le-nm-bmc-fruit-leaf"></span></span>`;
  }
  function figBanana() {
    return `<span class="le-nm-bmc-fig is-banana" aria-hidden="true"><span class="le-nm-bmc-fruit-body is-banana"></span></span>`;
  }
  function figHouse() {
    return `<span class="le-nm-bmc-fig is-house" aria-hidden="true"><span class="le-nm-bmc-house-roof"></span><span class="le-nm-bmc-house-wall"></span></span>`;
  }
  function figBox() {
    return `<span class="le-nm-bmc-fig is-box" aria-hidden="true"><span class="le-nm-bmc-box-body"></span><span class="le-nm-bmc-box-lid"></span></span>`;
  }
  function figBall() {
    return `<span class="le-nm-bmc-fig is-playball" aria-hidden="true"></span>`;
  }
  function figBird() {
    return `<span class="le-nm-bmc-fig is-bird" aria-hidden="true"></span>`;
  }
  function figFeather() {
    return `<span class="le-nm-bmc-fig is-feather" aria-hidden="true"></span>`;
  }
  function figRock() {
    return `<span class="le-nm-bmc-fig is-rock" aria-hidden="true"></span>`;
  }
  function figAnimal(kind) {
    const colors = { rabbit: "#C9A0FF", bear: "#E8B86D", turtle: "#7ECDB5", fox: "#FF8FAB", duck: "#FFD166" };
    return `<span class="le-nm-bmc-fig is-racer-animal is-${kind}" style="--c:${colors[kind] || "#E8B86D"}" aria-hidden="true"></span>`;
  }

  const CONCEPT_DEMO = {
    big_small: {
      title: "Big & Small",
      speak: "Look! One teddy is big. One teddy is small.",
      explain: "Same kind of teddy — one is big, one is small.",
      art: () => `<div class="le-nm-bmc-demo-pair is-ground">
        <div class="le-nm-bmc-demo-item"><div class="le-nm-bmc-demo-pic is-big">${teddySVG(110)}</div><em>Big</em></div>
        <div class="le-nm-bmc-demo-item"><div class="le-nm-bmc-demo-pic is-small">${teddySVG(48)}</div><em>Small</em></div>
      </div>`,
    },
    long_short: {
      title: "Long & Short",
      speak: "See the long ribbon and the short ribbon.",
      explain: "Compare length — which ribbon stretches farther?",
      art: () => `<div class="le-nm-bmc-demo-stack">
        <div class="le-nm-bmc-demo-item is-row">${figRibbon("long")}<em>Long</em></div>
        <div class="le-nm-bmc-demo-item is-row">${figRibbon("short")}<em>Short</em></div>
      </div>`,
    },
    tall_short: {
      title: "Tall & Short",
      speak: "Both trees stand on the same ground. One is tall. One is short.",
      explain: "Same ground line — the tall tree reaches higher.",
      art: () => `<div class="le-nm-bmc-demo-pair is-ground-line">
        <div class="le-nm-bmc-demo-item">${figTree("tall")}<em>Tall</em></div>
        <div class="le-nm-bmc-demo-item">${figTree("short")}<em>Short</em></div>
      </div>`,
    },
    heavy_light: {
      title: "Heavy & Light",
      speak: "Watch the scale! The heavy rock pulls down. The feather is light.",
      explain: "Heavy makes the scale tip down. Light goes up.",
      art: () => `<div class="le-nm-bmc-demo-scale tilt-left">
        <div class="le-nm-bmc-beam"></div>
        <div class="le-nm-bmc-pan is-left">${figRock()}<em>Heavy</em></div>
        <div class="le-nm-bmc-pan is-right">${figFeather()}<em>Light</em></div>
        <div class="le-nm-bmc-fulcrum"></div>
      </div>`,
    },
    full_empty: {
      title: "Full & Empty",
      speak: "One jar is full of colorful balls. The other jar is empty.",
      explain: "Full means filled up. Empty means nothing inside.",
      art: () => `<div class="le-nm-bmc-demo-pair">
        <div class="le-nm-bmc-demo-item">${figJar("full")}<em>Full</em></div>
        <div class="le-nm-bmc-demo-item">${figJar("empty")}<em>Empty</em></div>
      </div>`,
    },
    same_diff: {
      title: "Same & Different",
      speak: "Two red apples are the same. The banana is different.",
      explain: "Same means matching. Different means not the same.",
      art: () => `<div class="le-nm-bmc-demo-pair">
        <div class="le-nm-bmc-demo-item is-group">${figApple()}${figApple()}<em>Same</em></div>
        <div class="le-nm-bmc-demo-item">${figBanana()}<em>Different</em></div>
      </div>`,
    },
    near_far: {
      title: "Near & Far",
      speak: "One bunny is near the house. Another bunny is far away.",
      explain: "Near means close. Far means a long way away.",
      art: () => `<div class="le-nm-bmc-demo-distance">
        <div class="le-nm-bmc-demo-lane is-near">${bunnySVG(44)}${figHouse()}<em>Near</em></div>
        <div class="le-nm-bmc-demo-lane is-far">${bunnySVG(28)}<span class="le-nm-bmc-gap"></span>${figHouse()}<em>Far</em></div>
      </div>`,
    },
    inside_out: {
      title: "Inside & Outside",
      speak: "One ball is inside the box. One ball is outside the box.",
      explain: "Inside means in the box. Outside means not in the box.",
      art: () => `<div class="le-nm-bmc-demo-pair">
        <div class="le-nm-bmc-demo-item is-inbox"><span class="le-nm-bmc-box-scene is-in">${figBox()}${figBall()}</span><em>Inside</em></div>
        <div class="le-nm-bmc-demo-item is-outbox"><span class="le-nm-bmc-box-scene is-out">${figBox()}${figBall()}</span><em>Outside</em></div>
      </div>`,
    },
    above_below: {
      title: "Above & Below",
      speak: "The bird is above the tree. The bunny is below the tree.",
      explain: "Above means higher up. Below means lower down.",
      art: () => `<div class="le-nm-bmc-demo-vertical">
        <div class="le-nm-bmc-demo-item">${figBird()}<em>Above</em></div>
        ${figTree("mid")}
        <div class="le-nm-bmc-demo-item">${bunnySVG(40)}<em>Below</em></div>
      </div>`,
    },
    left_right: {
      title: "Left & Right",
      speak: "Left is this way. Right is that way. Let's dance!",
      explain: "Left and right are opposite sides.",
      art: () => `<div class="le-nm-bmc-demo-dance">
        <span class="le-nm-bmc-arrow is-left" aria-hidden="true"></span>
        <div class="le-nm-bmc-demo-item">${teddySVG(72)}<em>You</em></div>
        <span class="le-nm-bmc-arrow is-right" aria-hidden="true"></span>
      </div>`,
    },
    first_last: {
      title: "First, Middle & Last",
      speak: "In a line: first at the start, middle in the center, last at the end.",
      explain: "Order matters — first, middle, then last.",
      art: () => `<div class="le-nm-bmc-demo-line">
        <div class="le-nm-bmc-demo-item is-pos">${figAnimal("rabbit")}<em>First</em></div>
        <div class="le-nm-bmc-demo-item is-pos">${figAnimal("bear")}<em>Middle</em></div>
        <div class="le-nm-bmc-demo-item is-pos">${figAnimal("turtle")}<em>Last</em></div>
      </div>`,
    },
  };

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
        // Do NOT auto-call onCorrect here — that finishes the activity and kicks the child out.
        // When everything is done, offer an optional finish button so they can keep replaying.
        if (allDone()) {
          confetti(10);
          say("You discovered every math idea! Keep playing, or finish when you are ready.");
          choicesEl.innerHTML = `
            <button type="button" class="le-nm-choice le-nm-done" id="leBmcFinish">Finish adventure</button>`;
          choicesEl.querySelector("#leBmcFinish").addEventListener("click", () => {
            snd.pop();
            onCorrect("You discovered every math idea!");
          });
        }
      }

      function endExercise(exId, stars) {
        setExStars(exId, stars);
        confetti(10);
        say("Wonderful exploring!");
        lock(true);
        const finishBtn = allDone()
          ? `<button type="button" class="le-nm-choice le-nm-done" id="leBmcFinish">Finish adventure</button>`
          : "";
        choicesEl.innerHTML = `
          <button type="button" class="le-nm-choice le-nm-done" id="leBmcAgain">Replay</button>
          <button type="button" class="le-nm-choice" id="leBmcHub">More adventures</button>
          ${finishBtn}`;
        choicesEl.querySelector("#leBmcAgain").addEventListener("click", () => { snd.pop(); lock(false); runExercise(exId); });
        choicesEl.querySelector("#leBmcHub").addEventListener("click", () => { snd.pop(); lock(false); showHub(); });
        const fin = choicesEl.querySelector("#leBmcFinish");
        if (fin) {
          fin.addEventListener("click", () => {
            snd.pop();
            onCorrect("Amazing math explorer!");
          });
        }
      }

      function showConceptDemo(exId, onReady) {
        const demo = CONCEPT_DEMO[exId];
        if (!demo) { onReady(); return; }
        if (roundEl) roundEl.textContent = "Learn";
        promptEl.textContent = demo.title;
        say(demo.speak);
        choicesEl.innerHTML = "";
        lock(false);
        stageEl.innerHTML = `
          <div class="le-nm-bmc le-nm-bmc-concept-demo">
            <h3 class="le-nm-bmc-concept-title">${demo.title}</h3>
            <div class="le-nm-bmc-concept-art is-${exId}">${demo.art()}</div>
            <p class="le-nm-bmc-concept-explain">${demo.explain}</p>
            <button type="button" class="le-nm-choice le-nm-done" id="leBmcPlay">Let's play!</button>
          </div>`;
        stageEl.querySelector("#leBmcPlay").addEventListener("click", () => {
          snd.pop();
          onReady();
        });
      }

      function runExercise(exId) {
        const cfg = ageCfg();
        let round = 0;
        let score = 0;
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
        showConceptDemo(exId, next);
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
        // Always same object type (teddy) with clear size difference
        const toys = soft || tier() === 0
          ? [{ id: "a", size: "big" }, { id: "b", size: "small" }]
          : shuffle([{ id: "a", size: "big" }, { id: "b", size: "small" }, { id: "c", size: "big" }, { id: "d", size: "small" }]).slice(0, Math.min(3, cfg.objects));
        const target = wantBig ? "big" : "small";
        promptEl.textContent = wantBig ? "Can you find the big teddy?" : "Can you find the small teddy?";
        say(wantBig ? "Can you find the big teddy?" : "Can you find the small teddy?");
        function teddyBtn(t, drag) {
          const sz = t.size === "big" ? 96 : 42;
          return `<button type="button" class="le-nm-bmc-toy is-${t.size}${drag ? " le-nm-bmc-drag" : ""}" data-size="${t.size}" aria-label="${t.size} teddy"${drag ? ' draggable="true"' : ""}>
            ${teddySVG(sz)}
          </button>`;
        }
        const mode = soft ? "tap" : "basket";
        if (mode === "tap") {
          stageEl.innerHTML = `
            <div class="le-nm-bmc le-nm-bmc-toyland">
              <div class="le-nm-bmc-visual-guide" aria-hidden="true">${teddySVG(28)} big · ${teddySVG(16)} small</div>
              <div class="le-nm-bmc-row is-ground">
                ${toys.map((t) => teddyBtn(t, false)).join("")}
              </div>
              <p class="le-nm-tap-hint">Tap the ${target} teddy</p>
            </div>`;
          stageEl.querySelectorAll(".le-nm-bmc-toy").forEach((btn) => {
            btn.addEventListener("click", () => {
              if (getLocked()) return;
              if (btn.getAttribute("data-size") === target) {
                btn.classList.add("is-win");
                say(wantBig ? "Big!" : "Small!");
                onWin();
              } else onWrong(wantBig ? "Look for the bigger teddy!" : "Look for the smaller teddy!");
            });
          });
          return;
        }
        stageEl.innerHTML = `
          <div class="le-nm-bmc le-nm-bmc-toyland">
            <div class="le-nm-bmc-row is-ground" id="leBmcToyPool">
              ${toys.map((t) => teddyBtn(t, true)).join("")}
            </div>
            <div class="le-nm-bmc-baskets">
              <div class="le-nm-bmc-basket le-nm-bmc-slot" data-need="${target}">
                <span>${wantBig ? "Big basket" : "Small basket"}</span>
              </div>
            </div>
            <p class="le-nm-tap-hint">Drag the ${target} teddy into the basket</p>
          </div>`;
        bindDrag(stageEl, ".le-nm-bmc-drag", ".le-nm-bmc-basket", (slot, item) => {
          if (getLocked()) return false;
          const need = slot.getAttribute("data-need");
          if (item.getAttribute("data-size") !== need) {
            onWrong("That teddy does not belong in this basket!");
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
          promptEl.textContent = wantLong ? "Which ribbon is longer?" : "Which ribbon is shorter?";
          say(wantLong ? "Which ribbon is longer?" : "Which ribbon is shorter?");
          stageEl.innerHTML = `
            <div class="le-nm-bmc le-nm-bmc-railway">
              <div class="le-nm-bmc-tracks is-ribbons">
                ${items.map((it) => `
                  <button type="button" class="le-nm-bmc-track is-ribbon-btn is-${it.len}" data-len="${it.len}" aria-label="${it.len} ribbon">
                    ${figRibbon(it.len)}
                  </button>`).join("")}
              </div>
              <p class="le-nm-tap-hint">Tap the ${target} ribbon</p>
            </div>`;
          stageEl.querySelectorAll(".le-nm-bmc-track").forEach((btn) => {
            btn.addEventListener("click", () => {
              if (getLocked()) return;
              const len = btn.getAttribute("data-len");
              if (len === target) {
                btn.classList.add("is-win");
                stageEl.querySelector(".le-nm-bmc-railway").classList.add("is-chug");
                say(wantLong ? "Long!" : "Short!");
                onWin();
              } else if (len === "mid") {
                onWrong("Compare carefully!");
              } else onWrong(wantLong ? "Find the longer ribbon!" : "Find the shorter ribbon!");
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
                  ${figRibbon(it.len)}
                </button>`).join("")}
            </div>
            <p class="le-nm-tap-hint">Place ribbons from longest to shortest</p>
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
          promptEl.textContent = wantTall ? "Which tree is taller?" : "Which tree is shorter?";
          say(wantTall ? "Which tree is taller?" : "Which tree is shorter?");
          const treeSet = soft || tier() === 0
            ? [{ size: "tall" }, { size: "short" }]
            : towers.map((t) => ({ size: t.size === "mid" ? "mid" : t.size }));
          stageEl.innerHTML = `
            <div class="le-nm-bmc le-nm-bmc-build">
              <div class="le-nm-bmc-towers is-trees is-ground-line">
                ${treeSet.map((t) => `
                  <button type="button" class="le-nm-bmc-tower is-tree-btn" data-size="${t.size}" aria-label="${t.size} tree">
                    ${figTree(t.size)}
                  </button>`).join("")}
              </div>
              <p class="le-nm-tap-hint">Tap the ${target} tree · both grow from the same ground</p>
            </div>`;
          stageEl.querySelectorAll(".le-nm-bmc-tower").forEach((btn) => {
            btn.addEventListener("click", () => {
              if (getLocked()) return;
              const sz = btn.getAttribute("data-size");
              if (sz === target) {
                btn.classList.add("is-win");
                say(wantTall ? "Tall!" : "Short!");
                onWin();
              } else onWrong(wantTall ? "Look for the taller tree!" : "Look for the shorter tree!");
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
        // Rock vs feather — size does NOT imply weight (feather can look "big", rock compact)
        const wantHeavy = Math.random() > 0.5;
        promptEl.textContent = wantHeavy ? "Which side is heavier?" : "Which side is lighter?";
        say(wantHeavy ? "Which side is heavier?" : "Which side is lighter?");
        const leftHeavy = Math.random() > 0.5;
        const answer = wantHeavy ? (leftHeavy ? "left" : "right") : (leftHeavy ? "right" : "left");
        const tilt = leftHeavy ? "tilt-left" : "tilt-right";
        const leftFig = leftHeavy ? figRock() : figFeather();
        const rightFig = leftHeavy ? figFeather() : figRock();
        stageEl.innerHTML = `
          <div class="le-nm-bmc le-nm-bmc-lab">
            <div class="le-nm-bmc-scientist">${teddySVG(48)}</div>
            <div class="le-nm-bmc-scale ${tilt}" id="leBmcScale">
              <div class="le-nm-bmc-beam"></div>
              <button type="button" class="le-nm-bmc-pan is-left" data-side="left">
                ${leftFig}
              </button>
              <button type="button" class="le-nm-bmc-pan is-right" data-side="right">
                ${rightFig}
              </button>
              <div class="le-nm-bmc-fulcrum"></div>
            </div>
            <p class="le-nm-tap-hint">Watch which side tips down · tap the ${wantHeavy ? "heavier" : "lighter"} side</p>
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
          promptEl.textContent = want === "full" ? "Can you find the full jar?"
            : want === "empty" ? "Can you find the empty jar?" : "Which jar is half full?";
          say(promptEl.textContent);
          stageEl.innerHTML = `
            <div class="le-nm-bmc le-nm-bmc-picnic">
              <div class="le-nm-bmc-jars">
                ${states.map((st) => `
                  <button type="button" class="le-nm-bmc-jar is-fig is-${st}" data-fill="${st}" aria-label="${st} jar">
                    ${figJar(st)}
                  </button>`).join("")}
              </div>
              <p class="le-nm-tap-hint">Tap the ${want} jar</p>
            </div>`;
          stageEl.querySelectorAll(".le-nm-bmc-jar").forEach((btn) => {
            btn.addEventListener("click", () => {
              if (getLocked()) return;
              if (btn.getAttribute("data-fill") === want) {
                btn.classList.add("is-win");
                say(want === "full" ? "Full!" : want === "empty" ? "Empty!" : "Half full!");
                onWin();
              } else onWrong("Look at the colorful balls inside each jar!");
            });
          });
          return;
        }
        promptEl.textContent = "Fill the jar until it is full!";
        say("Fill the jar until it is full!");
        const need = tier() === 2 ? 5 : 4;
        stageEl.innerHTML = `
          <div class="le-nm-bmc le-nm-bmc-picnic">
            <div class="le-nm-bmc-jar is-fig is-empty is-fillable le-nm-bmc-slot" id="leBmcJar" data-need="${need}">
              <span class="le-nm-bmc-fig is-jar is-empty" id="leBmcJarFig"><span class="le-nm-bmc-jar-glass" id="leBmcFill"></span></span>
            </div>
            <div class="le-nm-bmc-pool">
              ${Array.from({ length: need }, (_, i) => `
                <button type="button" class="le-nm-bmc-berry le-nm-bmc-drag" data-id="${i}" draggable="true"></button>`).join("")}
            </div>
            <p class="le-nm-tap-hint">Drag ${need} colorful balls into the jar</p>
          </div>`;
        let filled = 0;
        const glass = stageEl.querySelector("#leBmcFill");
        bindDrag(stageEl, ".le-nm-bmc-drag", ".le-nm-bmc-slot", (slot, item) => {
          if (getLocked() || item.classList.contains("is-placed")) return false;
          item.classList.add("is-placed");
          item.style.visibility = "hidden";
          filled++;
          glass.insertAdjacentHTML("beforeend", `<i class="le-nm-bmc-ball c${filled % 5}"></i>`);
          stageEl.querySelector("#leBmcJarFig").classList.toggle("is-full", filled >= need);
          stageEl.querySelector("#leBmcJarFig").classList.remove("is-empty");
          slot.classList.toggle("is-full", filled >= need);
          if (filled >= need) {
            say("Full!");
            onWin();
          }
          return true;
        });
      }

      /* ===== 6. Same & Different ===== */
      function exSameDiff(cfg, soft, onWin) {
        function fruitFig(k) {
          if (k === "apple") return figApple();
          if (k === "banana") return figBanana();
          return `<span class="le-nm-bmc-match-dot is-${k}"></span>`;
        }
        const findSame = soft || Math.random() > 0.4;
        if (findSame) {
          // Soft / little: two red apples + one banana
          const items = soft || tier() === 0
            ? shuffle([{ k: "apple" }, { k: "apple" }, { k: "banana" }])
            : shuffle([{ k: "apple" }, { k: "apple" }, { k: "banana" }, { k: "banana" }]).slice(0, Math.min(4, cfg.objects + 1));
          promptEl.textContent = "Find two fruits that are the same!";
          say("Find two red apples that are the same!");
          stageEl.innerHTML = `
            <div class="le-nm-bmc le-nm-bmc-discover">
              <div class="le-nm-bmc-match-row">
                ${items.map((it, i) => `
                  <button type="button" class="le-nm-bmc-match is-fruit is-${it.k}" data-kind="${it.k}" data-i="${i}">${fruitFig(it.k)}</button>`).join("")}
              </div>
              <p class="le-nm-tap-hint">Tap two matching fruits</p>
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
        // Odd one out: apples vs banana
        const items = shuffle(["apple", "apple", "apple", "banana"]).slice(0, tier() === 0 ? 3 : 4);
        if (!items.includes("banana")) items[items.length - 1] = "banana";
        promptEl.textContent = "Which one is different?";
        say("Which one is different?");
        stageEl.innerHTML = `
          <div class="le-nm-bmc le-nm-bmc-discover">
            <div class="le-nm-bmc-match-row">
              ${items.map((k) => `
                <button type="button" class="le-nm-bmc-match is-fruit is-${k}" data-kind="${k}" data-odd="${k === "banana" ? 1 : 0}">${fruitFig(k)}</button>`).join("")}
            </div>
            <p class="le-nm-tap-hint">Tap the different fruit</p>
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
        promptEl.textContent = wantNear ? "Which bunny is near the house?" : "Which bunny is far from the house?";
        say(promptEl.textContent);
        const moveMode = !soft && tier() > 0 && Math.random() > 0.5;
        if (!moveMode) {
          stageEl.innerHTML = `
            <div class="le-nm-bmc le-nm-bmc-playground">
              <div class="le-nm-bmc-scene-ground"></div>
              <div class="le-nm-bmc-dist-scenes">
                <button type="button" class="le-nm-bmc-dist-scene is-near" data-dist="near" aria-label="bunny near house">
                  <span class="le-nm-bmc-dist-inner">${bunnySVG(48)}${figHouse()}</span>
                  <em>Near</em>
                </button>
                <button type="button" class="le-nm-bmc-dist-scene is-far" data-dist="far" aria-label="bunny far from house">
                  <span class="le-nm-bmc-dist-inner">${bunnySVG(36)}<span class="le-nm-bmc-gap"></span>${figHouse()}</span>
                  <em>Far</em>
                </button>
              </div>
              <p class="le-nm-tap-hint">Tap the picture that shows ${wantNear ? "near" : "far"}</p>
            </div>`;
          stageEl.querySelectorAll(".le-nm-bmc-dist-scene").forEach((btn) => {
            btn.addEventListener("click", () => {
              if (getLocked()) return;
              const d = btn.getAttribute("data-dist");
              if ((wantNear && d === "near") || (!wantNear && d === "far")) {
                btn.classList.add("is-win");
                say(wantNear ? "Near!" : "Far!");
                onWin();
              } else onWrong(wantNear ? "Look for the bunny close to the house!" : "Look for the bunny far from the house!");
            });
          });
          return;
        }
        promptEl.textContent = "Move the bunny near the house!";
        say("Move the bunny near the house!");
        stageEl.innerHTML = `
          <div class="le-nm-bmc le-nm-bmc-playground">
            <div class="le-nm-bmc-scene-ground"></div>
            <div class="le-nm-bmc-house-target" id="leBmcBall" aria-hidden="true">${figHouse()}</div>
            <div class="le-nm-bmc-explorer is-movable" id="leBmcExplorer" style="--pos:0">${bunnySVG(52)}</div>
            <div class="le-nm-bmc-move-btns">
              <button type="button" class="le-nm-choice" id="leBmcCloser">Move closer</button>
              <button type="button" class="le-nm-choice" id="leBmcFarther">Move farther</button>
            </div>
            <p class="le-nm-tap-hint">Move closer until the bunny is near the house</p>
          </div>`;
        let pos = 0;
        const explorer = stageEl.querySelector("#leBmcExplorer");
        const house = stageEl.querySelector("#leBmcBall");
        stageEl.querySelector("#leBmcCloser").addEventListener("click", () => {
          if (getLocked()) return;
          pos = Math.min(3, pos + 1);
          explorer.style.setProperty("--pos", pos);
          if (pos >= 3) {
            if (house) house.classList.add("is-near");
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
        const msg = wantIn ? "Put the ball inside the box!" : "Put the ball outside the box!";
        promptEl.textContent = msg;
        say(msg);
        stageEl.innerHTML = `
          <div class="le-nm-bmc le-nm-bmc-animal">
            <div class="le-nm-bmc-zones">
              <div class="le-nm-bmc-zone is-inside le-nm-bmc-slot" data-zone="inside">
                <span class="le-nm-bmc-zone-label">Inside</span>
                ${figBox()}
              </div>
              <div class="le-nm-bmc-zone is-outside le-nm-bmc-slot" data-zone="outside">
                <span class="le-nm-bmc-zone-label">Outside</span>
                ${figBox()}
              </div>
            </div>
            <div class="le-nm-bmc-pool">
              <button type="button" class="le-nm-bmc-move-toy le-nm-bmc-drag is-ball" data-toy="ball" draggable="true">${figBall()}</button>
            </div>
            <p class="le-nm-tap-hint">Drag the ball ${wantIn ? "inside" : "outside"} the box</p>
          </div>`;
        const need = wantIn ? "inside" : "outside";
        bindDrag(stageEl, ".le-nm-bmc-drag", ".le-nm-bmc-zone", (slot, item) => {
          if (getLocked()) return false;
          if (slot.getAttribute("data-zone") !== need) {
            onWrong(wantIn ? "Put it inside the box!" : "Place it outside the box!");
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
          promptEl.textContent = wantAbove ? "What is above the tree?" : "What is below the tree?";
          say(promptEl.textContent);
          stageEl.innerHTML = `
            <div class="le-nm-bmc le-nm-bmc-sky">
              <button type="button" class="le-nm-bmc-sky-obj is-bird is-above" data-pos="above" aria-label="bird above">
                ${figBird()}
              </button>
              <div class="le-nm-bmc-sky-mid" aria-hidden="true">${figTree("mid")}</div>
              <button type="button" class="le-nm-bmc-sky-obj is-bunny is-below" data-pos="below" aria-label="bunny below">
                ${bunnySVG(44)}
              </button>
              <p class="le-nm-tap-hint">Tap who is ${wantAbove ? "above" : "below"} the tree</p>
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
          const posLabel = (i) => (i === 0 ? "First" : i === count - 1 ? "Last" : i === midIdx ? "Middle" : "");
          stageEl.innerHTML = `
            <div class="le-nm-bmc le-nm-bmc-race">
              <div class="le-nm-bmc-track-line" aria-hidden="true"></div>
              <div class="le-nm-bmc-racers">
                ${line.map((a, i) => `
                  <button type="button" class="le-nm-bmc-racer is-${a}" data-idx="${i}" aria-label="${a} ${posLabel(i)}">
                    ${figAnimal(a)}
                    <em class="le-nm-bmc-pos-tag">${posLabel(i)}</em>
                  </button>`).join("")}
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
                <button type="button" class="le-nm-bmc-racer le-nm-bmc-drag is-${a}" data-animal="${a}" draggable="true">${figAnimal(a)}</button>`).join("")}
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
