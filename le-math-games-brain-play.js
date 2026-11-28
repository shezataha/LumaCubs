/* ============================================================
   LumaCubs — Math Games & Brain Play (complete adventure hub)
   8 distinct mathematical brain games. MG hub only.
   Does NOT duplicate Number Journey ranges, Mystery, Pattern,
   BMC lessons, or other Numbers & Math subcategory activities.
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
    { id: "logic_maze", title: "Magical Logic Maze", blurb: "Find the path to treasure!", art: "maze" },
    { id: "shape_puzzle", title: "Shape Puzzle Builder", blurb: "Build the picture with pieces!", art: "puzzle" },
    { id: "treasure_balance", title: "Treasure Balance Challenge", blurb: "Make the scale balance!", art: "balance" },
    { id: "brain_memory", title: "Brain Memory Challenge", blurb: "Look closely — what changed?", art: "memory" },
    { id: "treasure_hunt", title: "Mathematical Treasure Hunt", blurb: "Follow clues to the treasure!", art: "hunt" },
    { id: "smart_sort", title: "Smart Sorting Puzzle", blurb: "Sort by the secret rule!", art: "sort" },
    { id: "strategy", title: "Smart Strategy Challenge", blurb: "Plan the steps to win!", art: "strategy" },
    { id: "champion", title: "Grand Brain Champion", blurb: "Beat every brain challenge!", art: "champion" },
  ];

  function teddySVG(size) {
    const s = size || 64;
    return `<svg class="le-nm-mg-char" viewBox="0 0 80 90" width="${s}" height="${Math.round(s * 1.12)}" aria-hidden="true">
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
    return `<svg class="le-nm-mg-char" viewBox="0 0 80 90" width="${s}" height="${Math.round(s * 1.12)}" aria-hidden="true">
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

  const OBJ = {
    star: `<span class="le-nm-mg-obj is-star" aria-hidden="true"></span>`,
    key: `<span class="le-nm-mg-obj is-key" aria-hidden="true"></span>`,
    gem: `<span class="le-nm-mg-obj is-gem" aria-hidden="true"></span>`,
    flower: `<span class="le-nm-mg-obj is-flower" aria-hidden="true"></span>`,
    apple: `<span class="le-nm-mg-obj is-apple" aria-hidden="true"></span>`,
    ball: `<span class="le-nm-mg-obj is-ball" aria-hidden="true"></span>`,
    block: `<span class="le-nm-mg-obj is-block" aria-hidden="true"></span>`,
    leaf: `<span class="le-nm-mg-obj is-leaf" aria-hidden="true"></span>`,
    shell: `<span class="le-nm-mg-obj is-shell" aria-hidden="true"></span>`,
    coin: `<span class="le-nm-mg-obj is-coin" aria-hidden="true"></span>`,
    chest: `<span class="le-nm-mg-obj is-chest" aria-hidden="true"></span>`,
    rock: `<span class="le-nm-mg-obj is-rock" aria-hidden="true"></span>`,
    feather: `<span class="le-nm-mg-obj is-feather" aria-hidden="true"></span>`,
    car: `<span class="le-nm-mg-obj is-car" aria-hidden="true"></span>`,
    boat: `<span class="le-nm-mg-obj is-boat" aria-hidden="true"></span>`,
    bird: `<span class="le-nm-mg-obj is-bird" aria-hidden="true"></span>`,
    fish: `<span class="le-nm-mg-obj is-fish" aria-hidden="true"></span>`,
    cup: `<span class="le-nm-mg-obj is-cup" aria-hidden="true"></span>`,
  };

  /* Prebuilt mazes: 0 wall, 1 path, 2 start, 3 goal, 4 collect, 5 blocked */
  const MAZES = {
    tiny: [
      [2, 1, 1],
      [0, 0, 1],
      [0, 0, 3],
    ],
    small: [
      [2, 1, 0, 1],
      [0, 1, 1, 1],
      [0, 0, 5, 1],
      [0, 0, 0, 3],
    ],
    mid: [
      [2, 1, 1, 0, 4],
      [0, 0, 1, 0, 1],
      [1, 1, 1, 1, 1],
      [1, 0, 5, 0, 0],
      [1, 1, 1, 1, 3],
    ],
    big: [
      [2, 1, 0, 1, 1, 4],
      [0, 1, 0, 1, 0, 1],
      [1, 1, 1, 1, 0, 1],
      [1, 0, 5, 0, 1, 1],
      [1, 1, 1, 0, 1, 0],
      [0, 0, 1, 1, 1, 3],
    ],
  };

  function neighbors(r, c, rows, cols) {
    return [[r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]]
      .filter(([rr, cc]) => rr >= 0 && cc >= 0 && rr < rows && cc < cols);
  }

  window.LUMACUBS_MG = {
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
        if (t === 0) return { choices: 2, rounds: 3, complex: false, memoryMs: 2200, maze: "tiny", pieces: 3, steps: 2 };
        if (t === 1) return { choices: 3, rounds: 4, complex: true, memoryMs: 1800, maze: "small", pieces: 4, steps: 3 };
        return { choices: 3, rounds: 5, complex: true, memoryMs: 1400, maze: "mid", pieces: 5, steps: 4, timed: true };
      }

      /* ---------- Intro ---------- */
      function showIntro() {
        if (roundEl) roundEl.textContent = "Intro";
        promptEl.textContent = "Math Games & Brain Play";
        say("Welcome to Maths Game and Brain Play! Let's think, play and solve magical puzzles together!");
        choicesEl.innerHTML = "";
        lock(false);
        stageEl.innerHTML = `
          <div class="le-nm-mg le-nm-mg-intro">
            <div class="le-nm-mg-intro-art">
              ${teddySVG(88)}${bunnySVG(88)}
              <div class="le-nm-mg-sparkles" aria-hidden="true"><span></span><span></span><span></span></div>
            </div>
            <h3>Maths Game &amp; Brain Play</h3>
            <p>Join Teddy and Bunny in a magical brain-play world — mazes, puzzles, memory, treasure hunts and more!</p>
            <button type="button" class="le-nm-choice le-nm-done" id="leMgStart">Start Playing</button>
          </div>`;
        stageEl.querySelector("#leMgStart").addEventListener("click", () => {
          snd.pop();
          seenIntro = true;
          say("Let's find the way to the treasure!");
          showHub();
        });
      }

      /* ---------- Hub ---------- */
      function showHub() {
        if (!seenIntro) { showIntro(); return; }
        if (roundEl) roundEl.textContent = "Explore";
        promptEl.textContent = "Choose a brain game!";
        say("Which brain game shall we try?");
        choicesEl.innerHTML = "";
        lock(false);
        const done = EXERCISES.filter((ex) => exStars(ex.id) > 0).length;
        stageEl.innerHTML = `
          <div class="le-nm-mg le-nm-mg-hub">
            <div class="le-nm-mg-hub-hero">
              ${teddySVG(56)}${bunnySVG(56)}
              <div>
                <h3>Brain Play World</h3>
                <p>${done}/${EXERCISES.length} games complete</p>
              </div>
            </div>
            <div class="le-nm-mg-grid">
              ${EXERCISES.map((ex, i) => {
                const st = exStars(ex.id);
                return `<button type="button" class="le-nm-mg-card${st ? " is-done" : ""}" data-ex="${ex.id}">
                  <span class="le-nm-mg-card-art is-${ex.art}" aria-hidden="true"></span>
                  <span class="le-nm-mg-card-copy">
                    <strong>${i + 1}. ${ex.title}</strong>
                    <em>${ex.blurb}</em>
                    <span>${st ? ("★".repeat(Math.min(3, st)) + " done") : "Tap to play"}</span>
                  </span>
                </button>`;
              }).join("")}
            </div>
          </div>`;
        stageEl.querySelectorAll(".le-nm-mg-card").forEach((btn) => {
          btn.addEventListener("click", () => {
            snd.pop();
            runExercise(btn.getAttribute("data-ex"));
          });
        });
        if (allDone()) {
          confetti(10);
          say("You are a Brain Champion! Keep playing, or finish when you are ready.");
          choicesEl.innerHTML = `
            <button type="button" class="le-nm-choice le-nm-done" id="leMgFinish">Finish adventure</button>`;
          choicesEl.querySelector("#leMgFinish").addEventListener("click", () => {
            snd.pop();
            onCorrect("Brain Champion complete!");
          });
        }
      }

      function endExercise(exId, stars) {
        setExStars(exId, stars);
        confetti(12);
        say(exId === "champion" ? "Amazing thinking! You are a Brain Champion!" : "Amazing thinking!");
        lock(true);
        const finishBtn = allDone()
          ? `<button type="button" class="le-nm-choice le-nm-done" id="leMgFinish">Finish adventure</button>`
          : "";
        choicesEl.innerHTML = `
          <button type="button" class="le-nm-choice le-nm-done" id="leMgAgain">Replay</button>
          <button type="button" class="le-nm-choice" id="leMgHub">More games</button>
          ${finishBtn}`;
        choicesEl.querySelector("#leMgAgain").addEventListener("click", () => { snd.pop(); lock(false); runExercise(exId); });
        choicesEl.querySelector("#leMgHub").addEventListener("click", () => { snd.pop(); lock(false); showHub(); });
        const fin = choicesEl.querySelector("#leMgFinish");
        if (fin) {
          fin.addEventListener("click", () => {
            snd.pop();
            onCorrect("Brain Champion!");
          });
        }
      }

      function showDemo(exId, onReady) {
        const demos = {
          logic_maze: { speak: "Let's find the way to the treasure! Tap the glowing path stones.", tip: "Tap connected path stones to guide Teddy." },
          shape_puzzle: { speak: "Can you complete this puzzle? Drag pieces onto the picture.", tip: "Drag each piece into the matching outline." },
          treasure_balance: { speak: "Think carefully before you choose! Make both sides of the scale match.", tip: "Drag treasures onto the empty pan." },
          brain_memory: { speak: "Look closely. What has changed?", tip: "Watch carefully, then tap what is different." },
          treasure_hunt: { speak: "Can you solve the challenge? Follow each clue to the treasure!", tip: "Tap the place that matches the clue." },
          smart_sort: { speak: "Think carefully! Sort each object by the rule.", tip: "Drag objects into the correct basket." },
          strategy: { speak: "Plan the steps! Choose actions in the right order.", tip: "Tap the next action to unlock the treasure." },
          champion: { speak: "Ready for the Grand Brain Champion Challenge?", tip: "Win short rounds from every brain game!" },
        };
        const d = demos[exId] || demos.logic_maze;
        const ex = EXERCISES.find((e) => e.id === exId);
        if (roundEl) roundEl.textContent = "Learn";
        promptEl.textContent = ex ? ex.title : "Brain Game";
        say(d.speak);
        choicesEl.innerHTML = "";
        lock(false);
        stageEl.innerHTML = `
          <div class="le-nm-mg le-nm-mg-demo">
            <div class="le-nm-mg-demo-art is-${ex ? ex.art : "maze"}">${teddySVG(72)}${bunnySVG(72)}</div>
            <h3>${ex ? ex.title : "Brain Game"}</h3>
            <p>${d.tip}</p>
            <button type="button" class="le-nm-choice le-nm-done" id="leMgPlay">Let's play!</button>
          </div>`;
        stageEl.querySelector("#leMgPlay").addEventListener("click", () => {
          snd.pop();
          onReady();
        });
      }

      function runExercise(exId) {
        const cfg = ageCfg();
        if (exId === "champion") {
          showDemo(exId, () => runChampion(cfg));
          return;
        }
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
          buildRound(exId, cfg, () => {
            if (getLocked()) return;
            lock(true);
            score++;
            snd.correct();
            confetti(6);
            setTimeout(next, 850);
          });
        }
        showDemo(exId, next);
      }

      function buildRound(exId, cfg, onWin) {
        choicesEl.innerHTML = "";
        const map = {
          logic_maze: exMaze,
          shape_puzzle: exPuzzle,
          treasure_balance: exBalance,
          brain_memory: exMemory,
          treasure_hunt: exHunt,
          smart_sort: exSort,
          strategy: exStrategy,
        };
        (map[exId] || exMaze)(cfg, onWin);
      }

      /* ===== 1. Magical Logic Maze ===== */
      function exMaze(cfg, onWin) {
        const t = tier();
        let key = cfg.maze;
        if (t === 2 && cfg.complex && Math.random() > 0.45) key = "big";
        else if (t === 1 && Math.random() > 0.5) key = "mid";
        const grid = MAZES[key].map((row) => row.slice());
        const rows = grid.length, cols = grid[0].length;
        let start = [0, 0], goal = [rows - 1, cols - 1], collectNeeded = 0;
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            if (grid[r][c] === 2) start = [r, c];
            if (grid[r][c] === 3) goal = [r, c];
            if (grid[r][c] === 4) collectNeeded++;
          }
        }
        let pos = start.slice();
        let path = [pos.join(",")];
        let collected = 0;
        const needCollect = collectNeeded > 0 && t > 0;
        promptEl.textContent = needCollect
          ? "Collect the gems, then reach the treasure!"
          : "Find the way to the treasure!";
        say(promptEl.textContent);
        function render() {
          stageEl.innerHTML = `
            <div class="le-nm-mg le-nm-mg-maze is-${key}">
              <div class="le-nm-mg-maze-legend">${teddySVG(36)} → ${OBJ.chest}${needCollect ? " · pick " + OBJ.gem + " first" : ""}</div>
              <div class="le-nm-mg-maze-grid" style="--cols:${cols}">
                ${grid.map((row, r) => row.map((cell, c) => {
                  const here = pos[0] === r && pos[1] === c;
                  const walked = path.includes(r + "," + c);
                  let cls = "le-nm-mg-cell";
                  if (cell === 0) cls += " is-wall";
                  else if (cell === 5) cls += " is-blocked";
                  else cls += " is-path";
                  if (cell === 2) cls += " is-start";
                  if (cell === 3) cls += " is-goal";
                  if (cell === 4) cls += " is-gem";
                  if (walked) cls += " is-walked";
                  if (here) cls += " is-here";
                  const label = cell === 0 ? "wall" : cell === 5 ? "blocked" : cell === 3 ? "treasure" : cell === 4 ? "gem" : "path";
                  return `<button type="button" class="${cls}" data-r="${r}" data-c="${c}" aria-label="${label}">
                    ${here ? teddySVG(28) : (cell === 3 ? OBJ.chest : cell === 4 ? OBJ.gem : cell === 5 ? OBJ.rock : "")}
                  </button>`;
                }).join("")).join("")}
              </div>
              <p class="le-nm-tap-hint">Tap a glowing path stone next to Teddy</p>
              <button type="button" class="le-nm-mg-reset" id="leMgMazeReset">Try again</button>
            </div>`;
          stageEl.querySelector("#leMgMazeReset").addEventListener("click", () => {
            if (getLocked()) return;
            snd.pop();
            pos = start.slice();
            path = [pos.join(",")];
            collected = 0;
            for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
              if (MAZES[key][r][c] === 4) grid[r][c] = 4;
            }
            say("Let's try a new route!");
            render();
          });
          stageEl.querySelectorAll(".le-nm-mg-cell.is-path, .le-nm-mg-cell.is-goal, .le-nm-mg-cell.is-gem, .le-nm-mg-cell.is-start").forEach((btn) => {
            btn.addEventListener("click", () => {
              if (getLocked()) return;
              const r = +btn.getAttribute("data-r");
              const c = +btn.getAttribute("data-c");
              const cell = grid[r][c];
              if (cell === 0 || cell === 5) {
                onWrong("That path is blocked. Try another way!");
                return;
              }
              const adj = Math.abs(r - pos[0]) + Math.abs(c - pos[1]) === 1;
              if (!adj && !(r === pos[0] && c === pos[1])) {
                onWrong("Tap a path next to Teddy!");
                return;
              }
              if (r === pos[0] && c === pos[1]) return;
              pos = [r, c];
              path.push(r + "," + c);
              if (cell === 4) {
                collected++;
                grid[r][c] = 1;
                snd.pop();
                say("Gem collected!");
              }
              if (r === goal[0] && c === goal[1]) {
                if (needCollect && collected < collectNeeded) {
                  onWrong("Collect the gems before the treasure!");
                  render();
                  return;
                }
                say("You found the treasure!");
                onWin();
                return;
              }
              render();
            });
          });
        }
        render();
      }

      /* ===== 2. Shape Puzzle Builder ===== */
      function exPuzzle(cfg, onWin) {
        const builds = [
          { id: "house", slots: ["roof", "wall", "door"], labels: { roof: "Roof", wall: "Wall", door: "Door" } },
          { id: "rocket", slots: ["nose", "body", "fin"], labels: { nose: "Nose", body: "Body", fin: "Fin" } },
          { id: "boat", slots: ["sail", "hull", "flag"], labels: { sail: "Sail", hull: "Hull", flag: "Flag" } },
          { id: "tree", slots: ["canopy", "trunk", "fruit"], labels: { canopy: "Leaves", trunk: "Trunk", fruit: "Fruit" } },
          { id: "animal", slots: ["head", "body", "tail"], labels: { head: "Head", body: "Body", tail: "Tail" } },
        ];
        const build = pick(builds);
        const need = build.slots.slice(0, Math.min(cfg.pieces, build.slots.length));
        const decoys = shuffle(builds.flatMap((b) => b.slots)).filter((s) => !need.includes(s)).slice(0, tier() === 0 ? 0 : 1);
        const pieces = shuffle(need.concat(decoys));
        let placed = 0;
        promptEl.textContent = "Complete the " + build.id + " puzzle!";
        say("Can you complete this puzzle?");
        stageEl.innerHTML = `
          <div class="le-nm-mg le-nm-mg-puzzle is-${build.id}">
            <div class="le-nm-mg-silhouette" id="leMgSil">
              ${need.map((s) => `<div class="le-nm-mg-slot le-nm-mg-puz-slot is-${s}" data-need="${s}" aria-label="${build.labels[s] || s}"></div>`).join("")}
            </div>
            <div class="le-nm-mg-piece-tray">
              ${pieces.map((s) => `<button type="button" class="le-nm-mg-piece le-nm-mg-drag is-${s}" data-piece="${s}" aria-label="${s}"></button>`).join("")}
            </div>
            <p class="le-nm-tap-hint">Drag or tap a piece, then tap its outline</p>
          </div>`;
        bindDrag(stageEl, ".le-nm-mg-drag", ".le-nm-mg-puz-slot", (slot, item) => {
          if (getLocked()) return false;
          const needId = slot.getAttribute("data-need");
          const piece = item.getAttribute("data-piece");
          if (needId !== piece) {
            onWrong("That piece does not fit here!");
            return false;
          }
          if (slot.classList.contains("is-filled")) return false;
          item.classList.add("is-placed");
          slot.classList.add("is-filled");
          slot.appendChild(item.cloneNode(true));
          item.style.visibility = "hidden";
          placed++;
          say("Nice fit!");
          if (placed >= need.length) {
            say("Puzzle complete!");
            onWin();
          }
          return true;
        });
      }

      /* ===== 3. Treasure Balance Challenge ===== */
      function exBalance(cfg, onWin) {
        /* Valid balance: left known weight vs choose right objects that sum equal */
        const weights = tier() === 0
          ? [{ id: "gem", w: 1, html: OBJ.gem }, { id: "coin", w: 1, html: OBJ.coin }, { id: "rock", w: 2, html: OBJ.rock }]
          : [
            { id: "gem", w: 1, html: OBJ.gem },
            { id: "coin", w: 1, html: OBJ.coin },
            { id: "flower", w: 1, html: OBJ.flower },
            { id: "rock", w: 2, html: OBJ.rock },
            { id: "block", w: 2, html: OBJ.block },
            { id: "chest", w: 3, html: OBJ.chest },
          ];
        const target = tier() === 0 ? pick([1, 2]) : pick([2, 3, 4]);
        const leftPool = weights.filter((w) => w.w <= target);
        let leftSum = 0;
        const leftItems = [];
        while (leftSum < target && leftItems.length < 3) {
          const opts = leftPool.filter((w) => w.w <= target - leftSum);
          if (!opts.length) break;
          const o = pick(opts);
          leftItems.push(o);
          leftSum += o.w;
        }
        if (leftSum !== target) {
          leftItems.length = 0;
          leftItems.push(weights.find((w) => w.w === 1) || weights[0]);
          leftSum = leftItems[0].w;
        }
        const goal = leftSum;
        const options = shuffle(weights.slice()).slice(0, Math.min(weights.length, cfg.choices + 1));
        if (!options.some((o) => o.w === goal) && !options.some((o) => o.w <= goal)) {
          options[0] = weights.find((w) => w.w === goal) || weights[0];
        }
        let rightSum = 0;
        promptEl.textContent = "Make the treasure scale balance!";
        say("Think carefully before you choose!");
        function paint(tilt) {
          stageEl.innerHTML = `
            <div class="le-nm-mg le-nm-mg-balance">
              <div class="le-nm-mg-scale ${tilt}">
                <div class="le-nm-mg-beam"></div>
                <div class="le-nm-mg-pan is-left">
                  ${leftItems.map((i) => i.html).join("")}
                  <em>${goal}</em>
                </div>
                <div class="le-nm-mg-pan is-right le-nm-mg-slot" data-pan="right" id="leMgRightPan">
                  <em>Drop here</em>
                </div>
                <div class="le-nm-mg-fulcrum"></div>
              </div>
              <div class="le-nm-mg-piece-tray">
                ${options.map((o) => `<button type="button" class="le-nm-mg-piece le-nm-mg-drag is-weight" data-w="${o.w}" data-id="${o.id}" aria-label="${o.id}">${o.html}<span>${o.w}</span></button>`).join("")}
              </div>
              <p class="le-nm-tap-hint">Put treasures on the empty pan until both sides match</p>
            </div>`;
          bindDrag(stageEl, ".le-nm-mg-drag", ".le-nm-mg-slot", (slot, item) => {
            if (getLocked()) return false;
            const w = +item.getAttribute("data-w");
            rightSum += w;
            item.classList.add("is-placed");
            const pan = stageEl.querySelector("#leMgRightPan");
            pan.querySelector("em")?.remove();
            pan.appendChild(item.cloneNode(true));
            item.style.visibility = "hidden";
            const nextTilt = rightSum === goal ? "is-even" : (rightSum > goal ? "tilt-right" : "tilt-left");
            stageEl.querySelector(".le-nm-mg-scale")?.classList.remove("tilt-left", "tilt-right", "is-even");
            stageEl.querySelector(".le-nm-mg-scale")?.classList.add(nextTilt);
            if (rightSum === goal) {
              say("Perfect balance!");
              onWin();
              return true;
            }
            if (rightSum > goal) {
              onWrong("Too heavy! Try a lighter treasure.");
              rightSum -= w;
              item.classList.remove("is-placed");
              item.style.visibility = "";
              pan.removeChild(pan.lastElementChild);
              if (!pan.querySelector(".le-nm-mg-piece") && !pan.querySelector(".le-nm-mg-obj")) {
                pan.innerHTML = "<em>Drop here</em>";
              }
              return false;
            }
            say("Good! Add a little more.");
            return true;
          });
        }
        paint("tilt-left");
      }

      /* ===== 4. Brain Memory Challenge ===== */
      function exMemory(cfg, onWin) {
        const pool = ["star", "key", "gem", "flower", "apple", "ball", "leaf", "shell", "coin", "bird"];
        const n = tier() === 0 ? 3 : (tier() === 1 ? 4 : 5);
        const shown = shuffle(pool).slice(0, n);
        const modes = tier() === 0
          ? ["missing"]
          : (tier() === 1 ? ["missing", "changed"] : ["missing", "changed", "first"]);
        const mode = pick(modes);
        promptEl.textContent = "Look carefully at the memory shelf!";
        say("Look closely!");
        stageEl.innerHTML = `
          <div class="le-nm-mg le-nm-mg-memory">
            <div class="le-nm-mg-shelf is-show" id="leMgShelf">
              ${shown.map((id, i) => `<span class="le-nm-mg-mem-item" data-id="${id}" data-i="${i}">${OBJ[id]}</span>`).join("")}
            </div>
            <p class="le-nm-tap-hint">Remember these objects…</p>
          </div>`;
        setTimeout(() => {
          if (getLocked()) return;
          let answer = "";
          let choices = [];
          let ask = "";
          if (mode === "missing") {
            answer = pick(shown);
            const remaining = shown.filter((x) => x !== answer);
            stageEl.querySelector("#leMgShelf").innerHTML = remaining.map((id) =>
              `<span class="le-nm-mg-mem-item">${OBJ[id]}</span>`).join("") +
              `<span class="le-nm-mg-mem-item is-empty">?</span>`;
            ask = "Which object disappeared?";
            choices = shuffle([answer].concat(shuffle(pool.filter((x) => x !== answer)).slice(0, cfg.choices - 1)));
          } else if (mode === "changed") {
            answer = pick(shown);
            const intruder = pick(pool.filter((x) => !shown.includes(x)));
            const view = shown.map((x) => (x === answer ? intruder : x));
            stageEl.querySelector("#leMgShelf").innerHTML = view.map((id) =>
              `<span class="le-nm-mg-mem-item" data-id="${id}">${OBJ[id]}</span>`).join("");
            ask = "Which object is new?";
            answer = intruder;
            choices = shuffle([intruder].concat(shuffle(shown).slice(0, cfg.choices - 1)));
          } else {
            answer = shown[0];
            ask = "Which object appeared first?";
            stageEl.querySelector("#leMgShelf").innerHTML = `<span class="le-nm-mg-mem-item is-empty">?</span>`.repeat(n);
            choices = shuffle(shown.slice(0, Math.min(shown.length, cfg.choices)));
          }
          promptEl.textContent = ask;
          say(ask);
          stageEl.querySelector(".le-nm-tap-hint").textContent = "Tap the correct object";
          choicesEl.innerHTML = choices.map((id) =>
            `<button type="button" class="le-nm-choice le-nm-mg-mem-choice" data-id="${id}">${OBJ[id]}</button>`
          ).join("");
          choicesEl.querySelectorAll(".le-nm-mg-mem-choice").forEach((btn) => {
            btn.addEventListener("click", () => {
              if (getLocked()) return;
              if (btn.getAttribute("data-id") === answer) {
                say("Wonderful memory!");
                onWin();
              } else onWrong("Look again in your mind!");
            });
          });
        }, cfg.memoryMs);
      }

      /* ===== 5. Mathematical Treasure Hunt ===== */
      function exHunt(cfg, onWin) {
        const steps = [
          {
            ask: "Which chest has more gems?",
            speak: "Compare the gem groups. Which chest has more?",
            opts: [
              { id: "a", html: OBJ.gem + OBJ.gem + OBJ.gem, ok: true },
              { id: "b", html: OBJ.gem + OBJ.gem, ok: false },
              { id: "c", html: OBJ.gem, ok: false },
            ],
          },
          {
            ask: "Teddy needs 2 keys. Which path has 2 keys?",
            speak: "Find the path with two keys!",
            opts: [
              { id: "a", html: OBJ.key, ok: false },
              { id: "b", html: OBJ.key + OBJ.key, ok: true },
              { id: "c", html: OBJ.key + OBJ.key + OBJ.key, ok: false },
            ],
          },
          {
            ask: "Which map mark matches the star clue?",
            speak: "Follow the star clue!",
            opts: [
              { id: "a", html: OBJ.flower, ok: false },
              { id: "b", html: OBJ.star, ok: true },
              { id: "c", html: OBJ.shell, ok: false },
            ],
          },
          {
            ask: "3 coins were taken from 5. How many left?",
            speak: "Five coins, three taken away. How many left?",
            opts: [
              { id: "a", html: OBJ.coin + OBJ.coin, ok: true, label: "2" },
              { id: "b", html: OBJ.coin, ok: false, label: "1" },
              { id: "c", html: OBJ.coin + OBJ.coin + OBJ.coin, ok: false, label: "3" },
            ],
            minTier: 1,
          },
          {
            ask: "Open the treasure! Which key fits?",
            speak: "Use the golden key to open the chest!",
            opts: [
              { id: "a", html: OBJ.leaf, ok: false },
              { id: "b", html: OBJ.key, ok: true },
              { id: "c", html: OBJ.ball, ok: false },
            ],
          },
        ].filter((s) => !s.minTier || tier() >= s.minTier);
        const chain = shuffle(steps).slice(0, Math.min(cfg.steps, steps.length));
        let step = 0;
        function showStep() {
          const s = chain[step];
          const opts = shuffle(s.opts).slice(0, Math.max(2, Math.min(cfg.choices, s.opts.length)));
          if (!opts.some((o) => o.ok)) opts[0] = s.opts.find((o) => o.ok);
          promptEl.textContent = s.ask;
          say(s.speak);
          stageEl.innerHTML = `
            <div class="le-nm-mg le-nm-mg-hunt">
              <div class="le-nm-mg-hunt-map">
                ${teddySVG(48)}${bunnySVG(40)}
                <div class="le-nm-mg-hunt-progress">${step + 1} / ${chain.length}</div>
                ${OBJ.chest}
              </div>
              <div class="le-nm-mg-hunt-opts">
                ${opts.map((o) => `<button type="button" class="le-nm-mg-hunt-opt" data-ok="${o.ok ? 1 : 0}">${o.html}${o.label ? `<span>${o.label}</span>` : ""}</button>`).join("")}
              </div>
              <p class="le-nm-tap-hint">Tap the correct clue</p>
            </div>`;
          stageEl.querySelectorAll(".le-nm-mg-hunt-opt").forEach((btn) => {
            btn.addEventListener("click", () => {
              if (getLocked()) return;
              if (btn.getAttribute("data-ok") === "1") {
                snd.correct();
                step++;
                if (step >= chain.length) {
                  say("Treasure unlocked!");
                  onWin();
                } else {
                  say("Clue solved! Next clue!");
                  showStep();
                }
              } else onWrong("Try another clue!");
            });
          });
        }
        showStep();
      }

      /* ===== 6. Smart Sorting & Classification ===== */
      function exSort(cfg, onWin) {
        const rules = [
          {
            title: "Things that fly",
            speak: "Put flying things in the basket!",
            ok: ["bird", "feather"],
            pool: ["bird", "feather", "fish", "rock", "apple", "car"],
          },
          {
            title: "Things that float",
            speak: "Sort things that float on water!",
            ok: ["boat", "shell", "leaf"],
            pool: ["boat", "shell", "leaf", "rock", "car", "apple"],
          },
          {
            title: "Nature finds",
            speak: "Sort the nature finds into the basket!",
            ok: ["leaf", "flower", "shell"],
            pool: ["leaf", "flower", "shell", "car", "key", "block"],
          },
          {
            title: "Round toys",
            speak: "Sort the round toys together!",
            ok: ["ball", "coin"],
            pool: ["ball", "coin", "block", "key", "car", "leaf"],
          },
        ];
        const rule = pick(rules);
        const needN = tier() === 0 ? 1 : (tier() === 1 ? 2 : 2);
        const goods = shuffle(rule.ok).slice(0, Math.min(needN, rule.ok.length));
        while (goods.length < needN && rule.ok.length) {
          const extra = pick(rule.ok);
          if (!goods.includes(extra)) goods.push(extra);
          else break;
        }
        const bads = shuffle(rule.pool.filter((x) => !rule.ok.includes(x))).slice(0, tier() === 0 ? 1 : 2);
        const items = shuffle(goods.concat(bads));
        let placedOk = 0;
        promptEl.textContent = rule.title;
        say(rule.speak);
        stageEl.innerHTML = `
          <div class="le-nm-mg le-nm-mg-sort">
            <div class="le-nm-mg-sort-rule">${bunnySVG(40)}<em>${rule.title}</em></div>
            <div class="le-nm-mg-piece-tray">
              ${items.map((id) => `<button type="button" class="le-nm-mg-piece le-nm-mg-drag" data-id="${id}" data-ok="${rule.ok.includes(id) ? 1 : 0}">${OBJ[id] || id}</button>`).join("")}
            </div>
            <div class="le-nm-mg-bins">
              <div class="le-nm-mg-bin le-nm-mg-slot" data-bin="yes"><span>Belongs</span></div>
              <div class="le-nm-mg-bin le-nm-mg-slot is-no" data-bin="no"><span>Does not</span></div>
            </div>
            <p class="le-nm-tap-hint">Drag each object into the correct basket</p>
          </div>`;
        bindDrag(stageEl, ".le-nm-mg-drag", ".le-nm-mg-slot", (slot, item) => {
          if (getLocked()) return false;
          const ok = item.getAttribute("data-ok") === "1";
          const bin = slot.getAttribute("data-bin");
          const correct = (ok && bin === "yes") || (!ok && bin === "no");
          if (!correct) {
            onWrong("That object does not follow the rule!");
            return false;
          }
          item.classList.add("is-placed");
          slot.appendChild(item.cloneNode(true));
          item.style.visibility = "hidden";
          if (ok) placedOk++;
          const left = stageEl.querySelectorAll(".le-nm-mg-drag:not(.is-placed)").length;
          if (left === 0 || placedOk >= goods.length) {
            /* ensure all remaining are judged — require all placed */
            if (left === 0) {
              say("Perfect sorting!");
              onWin();
            } else if (placedOk >= goods.length && [...stageEl.querySelectorAll(".le-nm-mg-drag:not(.is-placed)")].every((n) => n.getAttribute("data-ok") !== "1")) {
              /* still need to place bads */
            }
          }
          if (stageEl.querySelectorAll(".le-nm-mg-drag:not(.is-placed)").length === 0) {
            say("Perfect sorting!");
            onWin();
          }
          return true;
        });
      }

      /* ===== 7. Smart Strategy Challenge ===== */
      function exStrategy(cfg, onWin) {
        const plans = [
          {
            goal: "Reach the treasure!",
            speak: "Plan the steps! First move the block, then open the gate, then get the treasure.",
            steps: [
              { id: "block", label: "Move the block", html: OBJ.block },
              { id: "gate", label: "Open the gate", html: OBJ.key },
              { id: "treasure", label: "Get the treasure", html: OBJ.chest },
            ],
          },
          {
            goal: "Help Bunny cross!",
            speak: "Build the bridge, press the switch, then cross!",
            steps: [
              { id: "bridge", label: "Build bridge", html: OBJ.block },
              { id: "switch", label: "Press switch", html: OBJ.star },
              { id: "cross", label: "Cross over", html: bunnySVG(36) },
            ],
          },
          {
            goal: "Unlock the island!",
            speak: "Collect the key, unlock the door, then take the gem!",
            steps: [
              { id: "key", label: "Collect key", html: OBJ.key },
              { id: "door", label: "Unlock door", html: OBJ.rock },
              { id: "gem", label: "Take gem", html: OBJ.gem },
            ],
          },
        ];
        const plan = pick(plans);
        const need = plan.steps.slice(0, Math.min(cfg.steps, plan.steps.length));
        let nextIdx = 0;
        const decoys = [
          { id: "wait", label: "Wait and rest", html: OBJ.leaf },
          { id: "dance", label: "Dance first", html: OBJ.flower },
        ];
        const actions = shuffle(need.concat(tier() === 0 ? [] : decoys.slice(0, 1)));
        promptEl.textContent = plan.goal;
        say(plan.speak);
        function render() {
          stageEl.innerHTML = `
            <div class="le-nm-mg le-nm-mg-strategy">
              <div class="le-nm-mg-strat-scene">
                ${teddySVG(48)}
                <div class="le-nm-mg-strat-track">
                  ${need.map((s, i) => `<span class="le-nm-mg-strat-node${i < nextIdx ? " is-done" : ""}${i === nextIdx ? " is-next" : ""}">${s.html}</span>`).join('<span class="le-nm-mg-strat-arrow"></span>')}
                </div>
                ${OBJ.chest}
              </div>
              <div class="le-nm-mg-strat-actions">
                ${actions.map((a) => `<button type="button" class="le-nm-mg-strat-act${need.slice(0, nextIdx).some((n) => n.id === a.id) ? " is-used" : ""}" data-id="${a.id}" ${need.slice(0, nextIdx).some((n) => n.id === a.id) ? "disabled" : ""}>${a.html}<span>${a.label}</span></button>`).join("")}
              </div>
              <p class="le-nm-tap-hint">Tap the next action in order</p>
              <button type="button" class="le-nm-mg-reset" id="leMgStratReset">Try a new plan</button>
            </div>`;
          stageEl.querySelector("#leMgStratReset").addEventListener("click", () => {
            if (getLocked()) return;
            snd.pop();
            nextIdx = 0;
            say("New plan! Think carefully.");
            render();
          });
          stageEl.querySelectorAll(".le-nm-mg-strat-act:not([disabled])").forEach((btn) => {
            btn.addEventListener("click", () => {
              if (getLocked()) return;
              const id = btn.getAttribute("data-id");
              if (id !== need[nextIdx].id) {
                onWrong("Not yet! Try a different step.");
                return;
              }
              nextIdx++;
              snd.pop();
              if (nextIdx >= need.length) {
                say("Strategy success!");
                onWin();
              } else {
                say("Great plan! What's next?");
                render();
              }
            });
          });
        }
        render();
      }

      /* ===== 8. Grand Brain Champion ===== */
      function runChampion(cfg) {
        const rounds = [
          { id: "logic_maze", title: "Logic Maze" },
          { id: "shape_puzzle", title: "Spatial Puzzle" },
          { id: "treasure_balance", title: "Balance" },
          { id: "brain_memory", title: "Memory" },
          { id: "treasure_hunt", title: "Treasure Clue" },
          { id: "smart_sort", title: "Classification" },
          { id: "strategy", title: "Strategy" },
        ];
        const chain = tier() === 0 ? rounds.slice(0, 4) : (tier() === 1 ? rounds.slice(0, 6) : rounds);
        let idx = 0;
        let score = 0;
        function nextChamp() {
          if (idx >= chain.length) {
            stageEl.innerHTML = `
              <div class="le-nm-mg le-nm-mg-champ-win">
                ${teddySVG(80)}${bunnySVG(80)}
                <h3>Brain Champion!</h3>
                <p>You solved every challenge station. Amazing thinking!</p>
                <div class="le-nm-mg-trophy" aria-hidden="true"></div>
              </div>`;
            promptEl.textContent = "Brain Champion!";
            say("Amazing thinking! You are a Brain Champion!");
            confetti(18);
            endExercise("champion", score >= chain.length ? 3 : score >= Math.ceil(chain.length * 0.6) ? 2 : 1);
            return;
          }
          const r = chain[idx];
          if (roundEl) roundEl.textContent = "Cup " + (idx + 1) + " / " + chain.length;
          promptEl.textContent = "Champion: " + r.title;
          say("Challenge station: " + r.title);
          lock(false);
          const easyCfg = Object.assign({}, cfg, {
            rounds: 1,
            maze: tier() === 0 ? "tiny" : "small",
            pieces: Math.min(3, cfg.pieces),
            steps: Math.min(3, cfg.steps),
            memoryMs: Math.max(cfg.memoryMs, 1600),
          });
          buildRound(r.id, easyCfg, () => {
            if (getLocked()) return;
            lock(true);
            score++;
            idx++;
            snd.correct();
            confetti(8);
            setTimeout(() => { lock(false); nextChamp(); }, 900);
          });
        }
        nextChamp();
      }

      return function mgAdventure() {
        showHub();
      };
    },
  };
})();
