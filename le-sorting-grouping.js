/* ============================================================
   LumaCubs — Sorting & Grouping (8 distinct mini-games)
   Loaded before le-numbers-math.js; builders consumed via LUMACUBS_SG
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

  function pick(arr) {
    return arr[randInt(0, arr.length - 1)];
  }

  /** Extra cartoon SVG icons for Sorting & Grouping */
  function sgExtraIcon(kind, size, tone) {
    const s = size || 68;
    const t = tone == null ? 0 : tone;
    const palette = ["#FF8FAB", "#7ECDB5", "#FFD166", "#A8D4F0", "#C9A0FF", "#FFB86B", "#FF6B6B", "#4F9B78"];
    const c = palette[t % palette.length];
    const shine = `<ellipse cx="22" cy="18" rx="7" ry="4" fill="#fff" opacity=".45"/>`;
    const shapes = {
      circle: `<circle cx="32" cy="32" r="22" fill="${c}"/><circle cx="32" cy="32" r="22" fill="none" stroke="#fff" stroke-width="3" opacity=".35"/>${shine}`,
      square: `<rect x="12" y="12" width="40" height="40" rx="8" fill="${c}"/>${shine}`,
      triangle: `<path d="M32 10 L54 50 H10 Z" fill="${c}"/>${shine}`,
      rectangle: `<rect x="8" y="18" width="48" height="28" rx="8" fill="${c}"/>${shine}`,
      star: `<path d="M32 8l5 14 15 1-11 9 4 15-13-8-13 8 4-15-11-9 15-1z" fill="${c}"/>${shine}`,
      heart: `<path d="M32 52c-18-10-22-24-14-34 6-8 14-4 14 2 0-6 8-10 14-2 8 10 4 24-14 34z" fill="${c}"/>${shine}`,
      frog: `<ellipse cx="32" cy="40" rx="16" ry="12" fill="#7ECDB5"/><circle cx="32" cy="26" r="11" fill="#7ECDB5"/><circle cx="26" cy="24" r="2" fill="#5B4A7A"/><circle cx="38" cy="24" r="2" fill="#5B4A7A"/><ellipse cx="32" cy="32" rx="5" ry="3" fill="#4F9B78"/><ellipse cx="14" cy="42" rx="6" ry="4" fill="#5FBA8A"/><ellipse cx="50" cy="42" rx="6" ry="4" fill="#5FBA8A"/>${shine}`,
      duck: `<ellipse cx="34" cy="36" rx="16" ry="12" fill="#FFD166"/><circle cx="48" cy="24" r="10" fill="#FFD166"/><path d="M54 24h10l-4 4z" fill="#FF8FAB"/><circle cx="50" cy="22" r="1.8" fill="#5B4A7A"/><ellipse cx="22" cy="40" rx="6" ry="4" fill="#E8B84A"/>${shine}`,
      leaf: `<path d="M32 10c18 8 22 28 8 42-18-6-26-24-14-38 2-2 4-4 6-4z" fill="#7ECDB5"/><path d="M32 14c0 20-2 28-8 36" stroke="#4F9B78" stroke-width="2" fill="none"/>${shine}`,
      pear: `<path d="M32 14c10 0 14 10 12 18-2 10 4 20-12 24-16-4-10-14-12-24-2-8 2-18 12-18z" fill="#A8D070"/><rect x="30" y="8" width="4" height="10" rx="2" fill="#8B5A2B"/><ellipse cx="40" cy="14" rx="6" ry="3" fill="#7ECDB5"/>${shine}`,
      pumpkin: `<ellipse cx="32" cy="36" rx="22" ry="18" fill="#FFB86B"/><path d="M18 36c4-10 24-10 28 0M22 40c4 6 16 6 20 0" stroke="#E89A4A" stroke-width="2" fill="none"/><rect x="30" y="12" width="4" height="12" rx="2" fill="#4F9B78"/><ellipse cx="36" cy="14" rx="6" ry="3" fill="#7ECDB5"/>${shine}`,
      deer: `<ellipse cx="32" cy="40" rx="14" ry="12" fill="#E8B86D"/><circle cx="42" cy="28" r="9" fill="#E8B86D"/><path d="M38 16l-4 10M46 14l2 12M34 12l-6-8M50 12l6-8" stroke="#C9845A" stroke-width="2" fill="none"/><circle cx="44" cy="26" r="1.6" fill="#5B4A7A"/>${shine}`,
      fox: `<ellipse cx="32" cy="40" rx="14" ry="11" fill="#FF8FAB"/><circle cx="32" cy="26" r="11" fill="#FF8FAB"/><path d="M20 18l-4-12 12 6M44 18l4-12-12 6" fill="#FF8FAB"/><circle cx="28" cy="24" r="1.8" fill="#5B4A7A"/><circle cx="36" cy="24" r="1.8" fill="#5B4A7A"/><ellipse cx="32" cy="30" rx="4" ry="2.5" fill="#FFF0F5"/>${shine}`,
      bear: `<ellipse cx="32" cy="38" rx="16" ry="14" fill="#C9845A"/><circle cx="32" cy="24" r="12" fill="#C9845A"/><circle cx="18" cy="16" r="7" fill="#A86B3C"/><circle cx="46" cy="16" r="7" fill="#A86B3C"/><circle cx="28" cy="22" r="2" fill="#5B4A7A"/><circle cx="36" cy="22" r="2" fill="#5B4A7A"/><ellipse cx="32" cy="28" rx="4" ry="3" fill="#E8B86D"/>${shine}`,
      squirrel: `<ellipse cx="30" cy="38" rx="12" ry="11" fill="#E8B86D"/><circle cx="40" cy="28" r="9" fill="#E8B86D"/><path d="M14 40c-8-10 0-24 10-18" fill="#C9845A"/><circle cx="42" cy="26" r="1.6" fill="#5B4A7A"/><ellipse cx="48" cy="36" rx="5" ry="4" fill="#C9845A"/>${shine}`,
      dolphin: `<ellipse cx="30" cy="34" rx="18" ry="10" fill="#7EB8E0"/><path d="M40 28c8-10 16-4 18 2-8 0-12 4-14 10" fill="#A8D4F0"/><path d="M18 28c-6-10-2-14 4-10" fill="#7EB8E0"/><circle cx="20" cy="32" r="2" fill="#5B4A7A"/><path d="M44 36l12 6-4-10z" fill="#5F9BC8"/>${shine}`,
      whale: `<ellipse cx="30" cy="36" rx="22" ry="12" fill="#7E5FB0"/><path d="M48 32c10-8 14 0 12 8-6-2-10 0-14 4" fill="#C9A0FF"/><circle cx="16" cy="34" r="2.2" fill="#5B4A7A"/><ellipse cx="24" cy="40" rx="6" ry="3" fill="#fff" opacity=".35"/>${shine}`,
      cow: `<ellipse cx="32" cy="38" rx="18" ry="13" fill="#FFFCF8"/><circle cx="18" cy="30" r="6" fill="#5B4A7A"/><circle cx="42" cy="28" r="5" fill="#5B4A7A"/><circle cx="44" cy="24" r="9" fill="#FFFCF8"/><circle cx="46" cy="22" r="1.6" fill="#5B4A7A"/><ellipse cx="32" cy="44" rx="6" ry="4" fill="#FFD0B8"/><rect x="14" y="46" width="6" height="10" rx="2" fill="#C9B8A8"/><rect x="40" y="46" width="6" height="10" rx="2" fill="#C9B8A8"/>${shine}`,
      sheep: `<ellipse cx="32" cy="38" rx="18" ry="13" fill="#FFFCF8"/><circle cx="44" cy="28" r="9" fill="#FFE8DA"/><circle cx="46" cy="26" r="1.6" fill="#5B4A7A"/><circle cx="22" cy="30" r="6" fill="#F0E8E0"/><circle cx="34" cy="28" r="6" fill="#F0E8E0"/><rect x="16" y="46" width="5" height="10" rx="2" fill="#C9B8A8"/><rect x="40" y="46" width="5" height="10" rx="2" fill="#C9B8A8"/>${shine}`,
      horse: `<ellipse cx="28" cy="38" rx="16" ry="12" fill="#C9845A"/><ellipse cx="46" cy="26" rx="10" ry="8" fill="#C9845A"/><path d="M52 24c8 2 8 10 2 12" stroke="#A86B3C" stroke-width="4" fill="none"/><circle cx="50" cy="24" r="1.6" fill="#5B4A7A"/><path d="M20 20c-4-10 8-12 10-4" fill="#8B5A2B"/><rect x="16" y="46" width="6" height="10" rx="2" fill="#A86B3C"/><rect x="34" y="46" width="6" height="10" rx="2" fill="#A86B3C"/>${shine}`,
      chicken: `<ellipse cx="32" cy="38" rx="14" ry="12" fill="#FFFCF8"/><circle cx="42" cy="28" r="9" fill="#FFFCF8"/><path d="M48 28h8l-4 4z" fill="#FF8FAB"/><path d="M38 18l4-8 4 8" fill="#FF6B6B"/><circle cx="44" cy="26" r="1.6" fill="#5B4A7A"/><ellipse cx="22" cy="42" rx="6" ry="4" fill="#FFD166"/>${shine}`,
      penguin: `<ellipse cx="32" cy="36" rx="14" ry="18" fill="#5B4A7A"/><ellipse cx="32" cy="38" rx="9" ry="12" fill="#FFFCF8"/><circle cx="32" cy="18" r="9" fill="#5B4A7A"/><circle cx="28" cy="16" r="1.6" fill="#fff"/><circle cx="36" cy="16" r="1.6" fill="#fff"/><path d="M32 20h6l-3 4z" fill="#FFB86B"/><ellipse cx="18" cy="36" rx="5" ry="8" fill="#3D3550"/><ellipse cx="46" cy="36" rx="5" ry="8" fill="#3D3550"/>${shine}`,
      seal: `<ellipse cx="34" cy="36" rx="18" ry="12" fill="#C9B8D8"/><circle cx="16" cy="30" r="9" fill="#C9B8D8"/><circle cx="14" cy="28" r="1.8" fill="#5B4A7A"/><path d="M8 32c-4 6 2 8 6 4" fill="#A898C0"/><ellipse cx="48" cy="44" rx="8" ry="5" fill="#A898C0"/>${shine}`,
      polar: `<ellipse cx="32" cy="38" rx="16" ry="14" fill="#FFFCF8"/><circle cx="32" cy="24" r="12" fill="#FFFCF8"/><circle cx="18" cy="16" r="7" fill="#EAF4FF"/><circle cx="46" cy="16" r="7" fill="#EAF4FF"/><circle cx="28" cy="22" r="2" fill="#5B4A7A"/><circle cx="36" cy="22" r="2" fill="#5B4A7A"/><ellipse cx="32" cy="28" rx="4" ry="3" fill="#FFE8DA"/>${shine}`,
      shirt: `<path d="M16 18l16-8 16 8v6l-8-4v28H24V20l-8 4z" fill="${c}"/><rect x="26" y="28" width="12" height="8" rx="2" fill="#fff" opacity=".35"/>${shine}`,
      sock: `<path d="M26 8h12v28c8 4 12 12 4 18-10 8-20 0-14-10l-2-36z" fill="${c}"/><rect x="26" y="8" width="12" height="8" fill="#fff" opacity=".4"/>${shine}`,
      shoe: `<path d="M12 36h36c4 0 8 8 0 10H14c-6 0-6-8-2-10z" fill="${c}"/><rect x="14" y="28" width="22" height="10" rx="4" fill="${c}"/><rect x="16" y="30" width="10" height="4" rx="2" fill="#fff" opacity=".35"/>${shine}`,
      book: `<rect x="14" y="12" width="36" height="42" rx="4" fill="#A8D4F0"/><rect x="18" y="16" width="28" height="34" rx="2" fill="#FFFCF8"/><path d="M22 24h20M22 32h16M22 40h18" stroke="#C9A0FF" stroke-width="2"/><rect x="14" y="12" width="6" height="42" fill="#7EB8E0"/>${shine}`,
      pencil: `<rect x="28" y="8" width="8" height="40" rx="2" fill="#FFD166"/><path d="M28 48l4 10 4-10z" fill="#E8B86D"/><rect x="28" y="8" width="8" height="8" fill="#FF6B6B"/><rect x="28" y="20" width="8" height="4" fill="#fff" opacity=".4"/>`,
      eraser: `<rect x="14" y="24" width="36" height="18" rx="6" fill="#FF8FAB"/><rect x="14" y="24" width="12" height="18" rx="6" fill="#A8D4F0"/>${shine}`,
      notebook: `<rect x="16" y="10" width="32" height="44" rx="4" fill="#7ECDB5"/><rect x="20" y="14" width="24" height="36" rx="2" fill="#FFFCF8"/><path d="M24 22h16M24 30h16M24 38h12" stroke="#A8D4F0" stroke-width="2"/><circle cx="18" cy="20" r="2" fill="#FFD166"/><circle cx="18" cy="32" r="2" fill="#FFD166"/>`,
      milk: `<rect x="20" y="16" width="24" height="36" rx="4" fill="#FFFCF8"/><path d="M22 16h20l-2-8H24z" fill="#A8D4F0"/><rect x="24" y="28" width="16" height="14" rx="2" fill="#EAF4FF"/><ellipse cx="32" cy="20" rx="6" ry="3" fill="#7EB8E0"/>`,
      rose: `<circle cx="32" cy="28" r="14" fill="#FF6B6B"/><circle cx="26" cy="24" r="7" fill="#E84A4A"/><circle cx="38" cy="24" r="7" fill="#FF8FAB"/><rect x="30" y="40" width="4" height="16" rx="2" fill="#4F9B78"/><ellipse cx="24" cy="44" rx="8" ry="4" fill="#7ECDB5"/>${shine}`,
      sunflower: `<circle cx="32" cy="30" r="10" fill="#8B5A2B"/><circle cx="18" cy="20" r="8" fill="#FFD166"/><circle cx="46" cy="20" r="8" fill="#FFD166"/><circle cx="18" cy="40" r="8" fill="#FFD166"/><circle cx="46" cy="40" r="8" fill="#FFD166"/><circle cx="32" cy="14" r="8" fill="#FFD166"/><circle cx="32" cy="46" r="8" fill="#FFD166"/><rect x="30" y="48" width="4" height="12" rx="2" fill="#4F9B78"/>`,
      tulip: `<path d="M32 34c-10-4-14-16-8-24 4 6 8 6 12 0 6 8 2 20-8 24z" fill="#C9A0FF"/><rect x="30" y="34" width="4" height="22" rx="2" fill="#4F9B78"/><ellipse cx="24" cy="44" rx="8" ry="4" fill="#7ECDB5"/>${shine}`,
      daisy: `<circle cx="20" cy="24" r="8" fill="#FFFCF8"/><circle cx="44" cy="24" r="8" fill="#FFFCF8"/><circle cx="20" cy="40" r="8" fill="#FFFCF8"/><circle cx="44" cy="40" r="8" fill="#FFFCF8"/><circle cx="32" cy="18" r="8" fill="#FFFCF8"/><circle cx="32" cy="46" r="8" fill="#FFFCF8"/><circle cx="32" cy="32" r="8" fill="#FFD166"/><rect x="30" y="46" width="4" height="12" rx="2" fill="#4F9B78"/>`,
      cucumber: `<rect x="14" y="24" width="36" height="16" rx="8" fill="#7ECDB5"/><path d="M20 28h4M28 32h4M36 28h4" stroke="#4F9B78" stroke-width="2"/>${shine}`,
      toothbrush: `<rect x="28" y="8" width="8" height="40" rx="3" fill="#A8D4F0"/><rect x="24" y="8" width="16" height="14" rx="4" fill="#FFFCF8"/><path d="M26 10v10M30 10v10M34 10v10M38 10v10" stroke="#C9A0FF" stroke-width="2"/><rect x="28" y="40" width="8" height="12" rx="2" fill="#FFD166"/>`,
      toothpaste: `<rect x="22" y="12" width="20" height="40" rx="6" fill="#7ECDB5"/><rect x="26" y="8" width="12" height="8" rx="2" fill="#A8D4F0"/><circle cx="32" cy="30" r="6" fill="#FFFCF8"/><path d="M28 30h8" stroke="#7ECDB5" stroke-width="2"/>`,
      towel: `<rect x="12" y="16" width="40" height="34" rx="6" fill="#A8D4F0"/><path d="M12 28h40M12 38h40" stroke="#fff" stroke-width="3" opacity=".5"/><rect x="12" y="16" width="40" height="8" rx="4" fill="#7EB8E0"/>`,
      soap: `<rect x="14" y="24" width="36" height="20" rx="8" fill="#E8D5F5"/><ellipse cx="32" cy="34" rx="12" ry="6" fill="#fff" opacity=".45"/><circle cx="40" cy="28" r="4" fill="#C9A0FF" opacity=".5"/>`,
      spoon: `<ellipse cx="32" cy="16" rx="10" ry="12" fill="#C9B8A8"/><rect x="28" y="26" width="8" height="30" rx="3" fill="#A89888"/>`,
      fork: `<path d="M22 8v16M32 8v16M42 8v16" stroke="#C9B8A8" stroke-width="4" stroke-linecap="round"/><rect x="28" y="22" width="8" height="34" rx="3" fill="#A89888"/>`,
      bat: `<rect x="30" y="8" width="4" height="36" rx="2" fill="#C4956A"/><ellipse cx="32" cy="48" rx="10" ry="8" fill="#8B5A2B"/><rect x="28" y="10" width="8" height="10" rx="2" fill="#E8B86D"/>`,
      racket: `<ellipse cx="32" cy="22" rx="16" ry="18" fill="none" stroke="#7ECDB5" stroke-width="4"/><path d="M24 14h16M32 8v28M22 22h20" stroke="#A8D4F0" stroke-width="2"/><rect x="30" y="40" width="4" height="18" rx="2" fill="#C4956A"/>`,
      trousers: `<path d="M18 12h28v18l-6 28h-8l4-28h-8l4 28h-8L18 30z" fill="${c}"/><rect x="28" y="12" width="8" height="10" fill="#fff" opacity=".25"/>`,
      magnifier: `<circle cx="26" cy="26" r="14" fill="none" stroke="#7E5FB0" stroke-width="5"/><circle cx="26" cy="26" r="10" fill="#EAF4FF" opacity=".55"/><rect x="36" y="36" width="8" height="20" rx="3" transform="rotate(45 40 46)" fill="#C4956A"/>`,
      detective: `<circle cx="32" cy="22" r="12" fill="#FFD0B8"/><path d="M16 24c4-14 28-14 32 0" fill="#5B4A7A"/><rect x="14" y="18" width="36" height="8" rx="2" fill="#3D3550"/><rect x="18" y="34" width="28" height="22" rx="8" fill="#7E5FB0"/><circle cx="28" cy="20" r="1.8" fill="#5B4A7A"/><circle cx="36" cy="20" r="1.8" fill="#5B4A7A"/><path d="M28 26c2 2 6 2 8 0" stroke="#E86A8A" stroke-width="1.6" fill="none"/>`,
      football: `<circle cx="32" cy="32" r="20" fill="#FFFCF8"/><path d="M18 24c8 4 20 4 28 0M18 40c8-4 20-4 28 0M32 12v40" stroke="#5B4A7A" stroke-width="2"/><path d="M24 20l8-4 8 4-3 8h-10z" fill="#5B4A7A"/>`,
      sharpener: `<rect x="14" y="20" width="36" height="24" rx="6" fill="#FFD166"/><circle cx="32" cy="32" r="7" fill="#5B4A7A"/><rect x="40" y="24" width="6" height="16" fill="#E8B84A"/>`,
    };
    const body = shapes[kind];
    if (!body) return null;
    return `<svg class="le-nm-qc-ico le-nm-sg-ico" viewBox="0 0 64 64" width="${s}" height="${s}" aria-hidden="true">${body}</svg>`;
  }

  function makeIcon(qcIcon, kind, size, tone) {
    const extra = sgExtraIcon(kind, size, tone);
    if (extra) return extra;
    return qcIcon(kind, size, tone);
  }

  function objBtn(qcIcon, kind, opts) {
    const o = opts || {};
    const size = o.size || 72;
    const tone = o.tone == null ? 0 : o.tone;
    const cls = "le-nm-sg-obj" + (o.cls ? " " + o.cls : "");
    const data = Object.keys(o.data || {}).map((k) => ` data-${k}="${o.data[k]}"`).join("");
    const label = o.label || kind;
    const drag = o.drag !== false ? ` draggable="true"` : "";
    return `<button type="button" class="${cls}" data-kind="${kind}"${data}${drag} aria-label="${label}">${makeIcon(qcIcon, kind, size, tone)}</button>`;
  }

  /**
   * Pointer-friendly drag: works with mouse + touch, blocks page scroll while dragging.
   * onDrop(zoneEl, itemEl) should return true if accepted.
   */
  function bindSortDrag(root, itemSel, zoneSel, onDrop) {
    let active = null;
    let ghost = null;
    let startX = 0;
    let startY = 0;
    let originParent = null;
    let originNext = null;

    function cleanup(restore) {
      if (ghost) {
        ghost.remove();
        ghost = null;
      }
      if (active) {
        active.classList.remove("is-dragging");
        if (restore && originParent) {
          if (originNext && originNext.parentNode === originParent) originParent.insertBefore(active, originNext);
          else originParent.appendChild(active);
        }
        active.style.visibility = "";
      }
      root.querySelectorAll(zoneSel).forEach((z) => z.classList.remove("is-over"));
      active = null;
      originParent = null;
      originNext = null;
      document.body.classList.remove("le-nm-sg-dragging");
    }

    function zoneUnder(x, y) {
      const elAt = document.elementFromPoint(x, y);
      if (!elAt) return null;
      return elAt.closest(zoneSel);
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
        document.body.classList.add("le-nm-sg-dragging");
        ghost = item.cloneNode(true);
        ghost.classList.add("le-nm-sg-ghost");
        ghost.style.left = e.clientX - 36 + "px";
        ghost.style.top = e.clientY - 36 + "px";
        document.body.appendChild(ghost);
        item.style.visibility = "hidden";
        try { item.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
      });

      item.addEventListener("pointermove", (e) => {
        if (!active || active !== item || !ghost) return;
        e.preventDefault();
        ghost.style.left = e.clientX - 36 + "px";
        ghost.style.top = e.clientY - 36 + "px";
        root.querySelectorAll(zoneSel).forEach((z) => z.classList.remove("is-over"));
        const z = zoneUnder(e.clientX, e.clientY);
        if (z) z.classList.add("is-over");
      });

      function end(e) {
        if (!active || active !== item) return;
        const z = zoneUnder(e.clientX || startX, e.clientY || startY);
        root.querySelectorAll(zoneSel).forEach((zone) => zone.classList.remove("is-over"));
        let ok = false;
        if (z) ok = !!onDrop(z, item);
        cleanup(!ok);
      }

      item.addEventListener("pointerup", end);
      item.addEventListener("pointercancel", () => cleanup(true));
    });

    // Also support click-select then tap zone (younger kids)
    let selected = null;
    root.querySelectorAll(itemSel).forEach((item) => {
      item.addEventListener("click", (e) => {
        if (item.classList.contains("is-placed")) return;
        // Ignore click that ends a drag
        if (Math.abs((e.clientX || 0) - startX) > 12 || Math.abs((e.clientY || 0) - startY) > 12) return;
        root.querySelectorAll(itemSel).forEach((n) => n.classList.remove("is-selected"));
        selected = item;
        item.classList.add("is-selected");
      });
    });
    root.querySelectorAll(zoneSel).forEach((zone) => {
      zone.addEventListener("click", () => {
        if (!selected || selected.classList.contains("is-placed")) return;
        const ok = !!onDrop(zone, selected);
        if (ok) {
          selected.classList.remove("is-selected");
          selected = null;
        }
      });
    });
  }

  function celebrateZone(zone) {
    if (!zone) return;
    zone.classList.add("is-success");
    setTimeout(() => zone.classList.remove("is-success"), 450);
  }

  window.LUMACUBS_SG = {
    createBuilders(ctx) {
      const {
        stageEl, promptEl, choicesEl, say, onCorrect, onWrong, snd, confetti,
        qcIcon, qcBounce, sub, getRound, getLocked, getAgeHubReturn, trackPlatformProgress,
      } = ctx;

      function tier() {
        const hub = typeof getAgeHubReturn === "function" ? getAgeHubReturn() : "littleExplorers";
        let t = 0;
        if (hub === "curiousLearners") t = 1;
        if (hub === "smartAchievers") t = 2;
        if (sub.level === "B") t = Math.max(t, 1);
        const r = getRound();
        if (r >= 2) t = Math.min(2, t + 1);
        if (r >= 4 && t < 2) t = Math.min(2, t + 1);
        return t;
      }

      function groupCount() {
        return [2, 3, 4][tier()] || 2;
      }

      function itemCount(perGroup) {
        const base = perGroup || 2;
        return base + (tier() > 0 ? 1 : 0) + (tier() > 1 ? 1 : 0);
      }

      function markStart() {
        if (typeof trackPlatformProgress === "function") {
          trackPlatformProgress("le.numbers_math." + sub.id, "started");
        }
      }

      function placedCount(root) {
        return root.querySelectorAll(".le-nm-sg-obj.is-placed").length;
      }

      function maybeFinish(needed) {
        if (placedCount(stageEl) >= needed) {
          confetti(10);
          setTimeout(() => onCorrect("Wonderful sorting!"), 400);
        }
      }

      /* ---- 1) Rainbow Colour Factory ---- */
      function buildColour() {
        markStart();
        const COLORS = [
          { id: "red", label: "red", hex: "#FF6B6B", items: [
            { kind: "apple", name: "apple" }, { kind: "strawberry", name: "strawberry" }, { kind: "car", name: "car", tone: 0 },
          ]},
          { id: "blue", label: "blue", hex: "#7EB8E0", items: [
            { kind: "fish", name: "fish", tone: 5 }, { kind: "ball", name: "ball" }, { kind: "butterfly", name: "butterfly" },
          ]},
          { id: "yellow", label: "yellow", hex: "#FFD166", items: [
            { kind: "star", name: "star", tone: 2 }, { kind: "duck", name: "duck" }, { kind: "flower", name: "flower", tone: 1 },
          ]},
          { id: "green", label: "green", hex: "#7ECDB5", items: [
            { kind: "leaf", name: "leaf" }, { kind: "frog", name: "frog" }, { kind: "pear", name: "pear" },
          ]},
          { id: "orange", label: "orange", hex: "#FFB86B", items: [
            { kind: "carrot", name: "carrot" }, { kind: "pumpkin", name: "pumpkin" }, { kind: "orange", name: "orange" },
          ]},
          { id: "purple", label: "purple", hex: "#C9A0FF", items: [
            { kind: "grape", name: "grape" }, { kind: "flower", name: "flower", tone: 0 }, { kind: "balloon", name: "balloon", tone: 0 },
          ]},
        ];
        const nGroups = groupCount();
        const chosen = shuffle(COLORS).slice(0, nGroups);
        const per = Math.min(itemCount(2), 3);
        const pool = [];
        chosen.forEach((col) => {
          shuffle(col.items).slice(0, per).forEach((it) => {
            pool.push({ ...it, color: col.id, hex: col.hex });
          });
        });
        const items = shuffle(pool);

        promptEl.textContent = "Send each object to its colour machine!";
        say("Let's send the objects to the matching colour machines!");
        choicesEl.innerHTML = "";
        stageEl.innerHTML = `
          <div class="le-nm-sg le-nm-sg-factory">
            <div class="le-nm-sg-machines">
              ${chosen.map((c) => `
                <div class="le-nm-sg-machine" data-zone="${c.id}" style="--sg-color:${c.hex}">
                  <div class="le-nm-sg-machine-light" aria-hidden="true"></div>
                  <div class="le-nm-sg-machine-slot"></div>
                  <span class="le-nm-sg-machine-label">${c.label}</span>
                </div>`).join("")}
            </div>
            <div class="le-nm-sg-conveyor" aria-label="Conveyor belt">
              <div class="le-nm-sg-belt" id="leSgBelt">
                ${items.map((it, i) => objBtn(qcIcon, it.kind, {
                  size: 70,
                  tone: it.tone || 0,
                  label: it.name,
                  data: { zone: it.color, idx: i },
                  cls: "is-belt",
                })).join("")}
              </div>
            </div>
            <p class="le-nm-tap-hint">Drag or tap an object, then choose its colour machine</p>
          </div>`;

        const need = items.length;
        bindSortDrag(stageEl, ".le-nm-sg-obj", ".le-nm-sg-machine", (zone, item) => {
          if (getLocked()) return false;
          const want = item.getAttribute("data-zone");
          const got = zone.getAttribute("data-zone");
          if (want !== got) {
            onWrong("Try the " + want + " machine!");
            say("Look for the " + want + " machine");
            item.classList.add("is-bounce");
            setTimeout(() => item.classList.remove("is-bounce"), 400);
            return false;
          }
          item.classList.add("is-placed");
          zone.querySelector(".le-nm-sg-machine-slot").appendChild(item);
          item.style.visibility = "";
          celebrateZone(zone);
          snd.correct();
          say("Yes! " + (item.getAttribute("aria-label") || "Perfect"));
          maybeFinish(need);
          return true;
        });
      }

      /* ---- 2) Shape City Builder ---- */
      function buildShape() {
        markStart();
        const SHAPES = [
          { id: "circle", label: "circles", kind: "circle" },
          { id: "square", label: "squares", kind: "square" },
          { id: "triangle", label: "triangles", kind: "triangle" },
          { id: "rectangle", label: "rectangles", kind: "rectangle" },
          { id: "star", label: "stars", kind: "star" },
          { id: "heart", label: "hearts", kind: "heart" },
        ];
        const n = groupCount();
        const chosen = shuffle(SHAPES).slice(0, n);
        const needEach = 1 + (tier() > 0 ? 1 : 0);
        const pool = [];
        chosen.forEach((sh, si) => {
          for (let i = 0; i < needEach; i++) {
            pool.push({ shape: sh.id, kind: sh.kind, tone: (si + i) % 6 });
          }
        });
        const items = shuffle(pool);
        const filled = {};
        chosen.forEach((sh) => { filled[sh.id] = 0; });

        promptEl.textContent = "Build the city — match each shape!";
        say("Can you find the matching shapes for our city?");
        choicesEl.innerHTML = "";
        stageEl.innerHTML = `
          <div class="le-nm-sg le-nm-sg-city">
            <div class="le-nm-sg-stations">
              ${chosen.map((sh) => `
                <div class="le-nm-sg-station" data-zone="${sh.id}">
                  <div class="le-nm-sg-station-pad">${makeIcon(qcIcon, sh.kind, 40, 2)}</div>
                  <div class="le-nm-sg-station-build" id="sgBuild-${sh.id}"></div>
                  <span class="le-nm-sg-station-label">${sh.label}</span>
                  <span class="le-nm-sg-station-count" data-count="${sh.id}">0/${needEach}</span>
                </div>`).join("")}
            </div>
            <div class="le-nm-sg-shape-tray" id="leSgShapes">
              ${items.map((it, i) => objBtn(qcIcon, it.kind, {
                size: 68,
                tone: it.tone,
                label: it.shape,
                data: { zone: it.shape, idx: i },
              })).join("")}
            </div>
            <p class="le-nm-tap-hint">Drag shapes to the matching construction stations</p>
          </div>`;

        const need = items.length;
        bindSortDrag(stageEl, ".le-nm-sg-obj", ".le-nm-sg-station", (zone, item) => {
          if (getLocked()) return false;
          const want = item.getAttribute("data-zone");
          const got = zone.getAttribute("data-zone");
          if (want !== got) {
            onWrong("That station needs " + got + "s!");
            return false;
          }
          item.classList.add("is-placed");
          zone.querySelector(".le-nm-sg-station-pad").appendChild(item);
          item.style.visibility = "";
          filled[got]++;
          const countEl = zone.querySelector("[data-count]");
          if (countEl) countEl.textContent = filled[got] + "/" + needEach;
          if (filled[got] >= needEach) {
            zone.classList.add("is-built");
            const build = zone.querySelector(".le-nm-sg-station-build");
            if (build) build.innerHTML = makeIcon(qcIcon, "block", 48, filled[got]);
            snd.fanfare && snd.fanfare();
            say("A new building!");
          } else {
            snd.correct();
          }
          celebrateZone(zone);
          maybeFinish(need);
          return true;
        });
      }

      /* ---- 3) Animal Habitat Adventure ---- */
      function buildHabitat() {
        markStart();
        const HABITATS = [
          { id: "forest", label: "Forest", emoji: "🌲", animals: [
            { kind: "deer", name: "deer" }, { kind: "fox", name: "fox" }, { kind: "bear", name: "bear" },
            { kind: "rabbit", name: "rabbit" }, { kind: "squirrel", name: "squirrel" },
          ]},
          { id: "ocean", label: "Ocean", emoji: "🌊", animals: [
            { kind: "dolphin", name: "dolphin" }, { kind: "turtle", name: "turtle" }, { kind: "octopus", name: "octopus" },
            { kind: "whale", name: "whale" }, { kind: "fish", name: "fish" },
          ]},
          { id: "farm", label: "Farm", emoji: "🏡", animals: [
            { kind: "cow", name: "cow" }, { kind: "sheep", name: "sheep" }, { kind: "horse", name: "horse" },
            { kind: "chicken", name: "chicken" }, { kind: "duck", name: "duck" },
          ]},
          { id: "snow", label: "Snow", emoji: "❄️", animals: [
            { kind: "polar", name: "polar bear" }, { kind: "penguin", name: "penguin" },
            { kind: "seal", name: "seal" }, { kind: "fox", name: "arctic fox", tone: 5 },
          ]},
        ];
        const n = groupCount();
        const chosen = shuffle(HABITATS).slice(0, n);
        const per = Math.min(2 + (tier() > 1 ? 1 : 0), 3);
        const pool = [];
        chosen.forEach((h) => {
          shuffle(h.animals).slice(0, per).forEach((a) => {
            pool.push({ ...a, habitat: h.id });
          });
        });
        const items = shuffle(pool);
        const focus = items[0];

        promptEl.textContent = "Guide each animal to its habitat!";
        say(focus ? ("Where does the " + focus.name + " live?") : "Find each animal's home!");
        choicesEl.innerHTML = "";
        stageEl.innerHTML = `
          <div class="le-nm-sg le-nm-sg-habitats">
            <div class="le-nm-sg-habitat-map">
              ${chosen.map((h) => `
                <div class="le-nm-sg-habitat is-${h.id}" data-zone="${h.id}">
                  <span class="le-nm-sg-habitat-title">${h.label}</span>
                  <div class="le-nm-sg-habitat-dwell"></div>
                </div>`).join("")}
            </div>
            <div class="le-nm-sg-animal-trail">
              ${items.map((it, i) => objBtn(qcIcon, it.kind, {
                size: 74,
                tone: it.tone || i % 6,
                label: it.name,
                data: { zone: it.habitat, idx: i },
              })).join("")}
            </div>
            <p class="le-nm-tap-hint">Drag animals into forest, ocean, farm or snow</p>
          </div>`;

        const need = items.length;
        bindSortDrag(stageEl, ".le-nm-sg-obj", ".le-nm-sg-habitat", (zone, item) => {
          if (getLocked()) return false;
          const want = item.getAttribute("data-zone");
          const got = zone.getAttribute("data-zone");
          if (want !== got) {
            onWrong("That animal lives somewhere else!");
            say("Try a different habitat");
            return false;
          }
          item.classList.add("is-placed", "is-home");
          zone.querySelector(".le-nm-sg-habitat-dwell").appendChild(item);
          item.style.visibility = "";
          zone.classList.add("is-alive");
          celebrateZone(zone);
          snd.correct();
          say("Home sweet home!");
          maybeFinish(need);
          return true;
        });
      }

      /* ---- 4) Size Sorting Safari ---- */
      function buildSize() {
        markStart();
        const orderMode = tier() > 0 && getRound() % 2 === 1;
        const KINDS = [
          { kind: "elephant", name: "elephant" },
          { kind: "ball", name: "ball" },
          { kind: "tree", name: "tree" },
          { kind: "teddy", name: "teddy" },
          { kind: "apple", name: "fruit" },
        ];
        const family = pick(KINDS);

        if (orderMode) {
          const sizes = shuffle([
            { size: "s", scale: 0.7, label: "small" },
            { size: "m", scale: 0.95, label: "medium" },
            { size: "l", scale: 1.25, label: "large" },
          ]);
          promptEl.textContent = "Arrange from smallest to biggest!";
          say("Let's arrange them from smallest to biggest!");
          choicesEl.innerHTML = "";
          stageEl.innerHTML = `
            <div class="le-nm-sg le-nm-sg-safari is-order">
              <div class="le-nm-sg-size-slots">
                ${["s", "m", "l"].map((sz, i) => `
                  <div class="le-nm-sg-size-slot" data-zone="${sz}" data-ord="${i}">
                    <span>${i === 0 ? "Small" : i === 1 ? "Medium" : "Big"}</span>
                  </div>`).join("")}
              </div>
              <div class="le-nm-sg-size-pool">
                ${sizes.map((sz, i) => `
                  <button type="button" class="le-nm-sg-obj is-size" data-zone="${sz.size}" data-idx="${i}" draggable="true" aria-label="${sz.label} ${family.name}" style="--sg-scale:${sz.scale}">
                    ${makeIcon(qcIcon, family.kind, Math.round(64 * sz.scale), i)}
                  </button>`).join("")}
              </div>
              <p class="le-nm-tap-hint">Put small, then medium, then big</p>
            </div>`;
          bindSortDrag(stageEl, ".le-nm-sg-obj", ".le-nm-sg-size-slot", (zone, item) => {
            if (getLocked()) return false;
            if (zone.querySelector(".le-nm-sg-obj")) {
              onWrong("That spot is taken!");
              return false;
            }
            if (item.getAttribute("data-zone") !== zone.getAttribute("data-zone")) {
              onWrong("Check the size!");
              return false;
            }
            item.classList.add("is-placed");
            zone.appendChild(item);
            item.style.visibility = "";
            celebrateZone(zone);
            snd.correct();
            if (stageEl.querySelectorAll(".le-nm-sg-size-slot .le-nm-sg-obj").length >= 3) {
              confetti(10);
              setTimeout(() => onCorrect("Perfect order!"), 400);
            }
            return true;
          });
          return;
        }

        const SIZES = [
          { id: "s", label: "Small", scale: 0.7 },
          { id: "m", label: "Medium", scale: 1 },
          { id: "l", label: "Large", scale: 1.3 },
        ];
        const nZones = Math.min(3, 2 + (tier() > 0 ? 1 : 0));
        const zones = SIZES.slice(0, nZones);
        const pool = [];
        zones.forEach((z) => {
          const copies = 1 + (tier() > 1 ? 1 : 0);
          for (let i = 0; i < copies; i++) {
            const fam = pick(KINDS);
            pool.push({ ...fam, size: z.id, scale: z.scale });
          }
        });
        const items = shuffle(pool);
        promptEl.textContent = "Sort by size — small, medium, large!";
        say("Let's sort the safari friends by size!");
        choicesEl.innerHTML = "";
        stageEl.innerHTML = `
          <div class="le-nm-sg le-nm-sg-safari">
            <div class="le-nm-sg-size-zones">
              ${zones.map((z) => `
                <div class="le-nm-sg-size-zone is-${z.id}" data-zone="${z.id}">
                  <span class="le-nm-sg-size-label">${z.label}</span>
                  <div class="le-nm-sg-size-pad"></div>
                </div>`).join("")}
            </div>
            <div class="le-nm-sg-size-pool">
              ${items.map((it, i) => `
                <button type="button" class="le-nm-sg-obj is-size" data-zone="${it.size}" data-idx="${i}" draggable="true" aria-label="${it.name}" style="--sg-scale:${it.scale}">
                  ${makeIcon(qcIcon, it.kind, Math.round(64 * it.scale), i)}
                </button>`).join("")}
            </div>
            <p class="le-nm-tap-hint">Drag each friend into the matching size space</p>
          </div>`;
        const need = items.length;
        bindSortDrag(stageEl, ".le-nm-sg-obj", ".le-nm-sg-size-zone", (zone, item) => {
          if (getLocked()) return false;
          if (item.getAttribute("data-zone") !== zone.getAttribute("data-zone")) {
            onWrong("Look at how big it is!");
            return false;
          }
          item.classList.add("is-placed");
          zone.querySelector(".le-nm-sg-size-pad").appendChild(item);
          item.style.visibility = "";
          celebrateZone(zone);
          snd.correct();
          maybeFinish(need);
          return true;
        });
      }

      /* ---- 5) Everyday Objects Organizer ---- */
      function buildRoom() {
        markStart();
        const CATS = [
          { id: "toys", label: "Toy box", items: [
            { kind: "teddy", name: "teddy" }, { kind: "car", name: "car" }, { kind: "doll", name: "doll" }, { kind: "block", name: "blocks" },
          ]},
          { id: "clothes", label: "Wardrobe", items: [
            { kind: "shirt", name: "shirt" }, { kind: "sock", name: "socks" }, { kind: "shoe", name: "shoes" }, { kind: "hat", name: "hat" },
          ]},
          { id: "books", label: "Bookshelf", items: [
            { kind: "book", name: "book" }, { kind: "notebook", name: "storybook" },
          ]},
          { id: "school", label: "Desk", items: [
            { kind: "pencil", name: "pencil" }, { kind: "crayon", name: "crayon" }, { kind: "eraser", name: "eraser" }, { kind: "notebook", name: "notebook" },
          ]},
          { id: "food", label: "Snack shelf", items: [
            { kind: "apple", name: "apple" }, { kind: "banana", name: "banana" }, { kind: "sandwich", name: "sandwich" }, { kind: "milk", name: "milk" },
          ]},
        ];
        // crayon -> use pencil tone stand-in via berry? use pencil with tone
        CATS[3].items[1] = { kind: "pencil", name: "crayon", tone: 3 };

        const n = Math.min(CATS.length, groupCount() + 1);
        const chosen = shuffle(CATS).slice(0, n);
        const per = 1 + (tier() > 0 ? 1 : 0);
        const pool = [];
        chosen.forEach((c) => {
          shuffle(c.items).slice(0, per).forEach((it) => pool.push({ ...it, cat: c.id }));
        });
        const items = shuffle(pool);

        promptEl.textContent = "Tidy the room — put things where they belong!";
        say("Can you put everything in the right place?");
        choicesEl.innerHTML = "";
        stageEl.innerHTML = `
          <div class="le-nm-sg le-nm-sg-room">
            <div class="le-nm-sg-furniture">
              ${chosen.map((c) => `
                <div class="le-nm-sg-furn is-${c.id}" data-zone="${c.id}">
                  <span class="le-nm-sg-furn-label">${c.label}</span>
                  <div class="le-nm-sg-furn-pad"></div>
                </div>`).join("")}
            </div>
            <div class="le-nm-sg-mess">
              ${items.map((it, i) => objBtn(qcIcon, it.kind, {
                size: 68,
                tone: it.tone || i % 6,
                label: it.name,
                data: { zone: it.cat, idx: i },
              })).join("")}
            </div>
            <p class="le-nm-tap-hint">Toys, clothes, books, school things and snacks each have a home</p>
          </div>`;

        const need = items.length;
        bindSortDrag(stageEl, ".le-nm-sg-obj", ".le-nm-sg-furn", (zone, item) => {
          if (getLocked()) return false;
          if (item.getAttribute("data-zone") !== zone.getAttribute("data-zone")) {
            onWrong("That belongs somewhere else!");
            return false;
          }
          item.classList.add("is-placed");
          zone.querySelector(".le-nm-sg-furn-pad").appendChild(item);
          item.style.visibility = "";
          zone.classList.add("is-neat");
          celebrateZone(zone);
          snd.correct();
          say("Nice and tidy!");
          maybeFinish(need);
          return true;
        });
      }

      /* ---- 6) Nature's Grouping Garden ---- */
      function buildGarden() {
        markStart();
        const BEDS = [
          { id: "flowers", label: "Flower bed", items: [
            { kind: "rose", name: "rose" }, { kind: "sunflower", name: "sunflower" },
            { kind: "tulip", name: "tulip" }, { kind: "daisy", name: "daisy" },
          ]},
          { id: "fruits", label: "Fruit trees", items: [
            { kind: "apple", name: "apple" }, { kind: "orange", name: "orange" },
            { kind: "grape", name: "grape" }, { kind: "banana", name: "banana" },
          ]},
          { id: "veggies", label: "Veggie patch", items: [
            { kind: "carrot", name: "carrot" }, { kind: "tomato", name: "tomato" },
            { kind: "pumpkin", name: "pumpkin" }, { kind: "cucumber", name: "cucumber" },
          ]},
          { id: "plants", label: "Leafy plants", items: [
            { kind: "leaf", name: "leaf" }, { kind: "plant", name: "plant" }, { kind: "tree", name: "tree" },
          ]},
        ];
        const n = groupCount();
        const chosen = shuffle(BEDS).slice(0, n);
        const per = 1 + (tier() > 0 ? 1 : 0);
        const pool = [];
        chosen.forEach((b) => {
          shuffle(b.items).slice(0, per).forEach((it) => pool.push({ ...it, bed: b.id }));
        });
        const items = shuffle(pool);

        promptEl.textContent = "Collect and organize the garden!";
        say("Let's collect all the matching garden treasures!");
        choicesEl.innerHTML = "";
        stageEl.innerHTML = `
          <div class="le-nm-sg le-nm-sg-garden">
            <div class="le-nm-sg-beds">
              ${chosen.map((b) => `
                <div class="le-nm-sg-bed is-${b.id}" data-zone="${b.id}">
                  <span class="le-nm-sg-bed-label">${b.label}</span>
                  <div class="le-nm-sg-bed-pad"></div>
                </div>`).join("")}
            </div>
            <div class="le-nm-sg-garden-finds">
              ${items.map((it, i) => objBtn(qcIcon, it.kind, {
                size: 68,
                tone: i % 6,
                label: it.name,
                data: { zone: it.bed, idx: i },
              })).join("")}
            </div>
            <p class="le-nm-tap-hint">Plant flowers, fruits, veggies and leaves in their beds</p>
          </div>`;

        const need = items.length;
        bindSortDrag(stageEl, ".le-nm-sg-obj", ".le-nm-sg-bed", (zone, item) => {
          if (getLocked()) return false;
          if (item.getAttribute("data-zone") !== zone.getAttribute("data-zone")) {
            onWrong("Try a different garden bed!");
            return false;
          }
          item.classList.add("is-placed");
          zone.querySelector(".le-nm-sg-bed-pad").appendChild(item);
          item.style.visibility = "";
          zone.classList.add("is-bloom");
          celebrateZone(zone);
          snd.correct();
          say("Beautiful!");
          maybeFinish(need);
          return true;
        });
      }

      /* ---- 7) Who Belongs Together? ---- */
      function buildBelong() {
        markStart();
        const SETS = [
          { id: "wash", label: "washing up", items: [
            { kind: "toothbrush", name: "toothbrush" }, { kind: "toothpaste", name: "toothpaste" },
            { kind: "towel", name: "towel" }, { kind: "soap", name: "soap" },
          ]},
          { id: "eat", label: "mealtime", items: [
            { kind: "spoon", name: "spoon" }, { kind: "plate", name: "plate" },
            { kind: "cup", name: "cup" }, { kind: "fork", name: "fork" },
          ]},
          { id: "school", label: "school time", items: [
            { kind: "pencil", name: "pencil" }, { kind: "notebook", name: "notebook" },
            { kind: "eraser", name: "eraser" }, { kind: "sharpener", name: "sharpener" },
          ]},
          { id: "sport", label: "playtime sports", items: [
            { kind: "ball", name: "ball" }, { kind: "bat", name: "bat" },
            { kind: "football", name: "football" }, { kind: "racket", name: "racket" },
          ]},
          { id: "wear", label: "getting dressed", items: [
            { kind: "shoe", name: "shoes" }, { kind: "sock", name: "socks" },
            { kind: "shirt", name: "shirt" }, { kind: "trousers", name: "trousers" },
          ]},
        ];
        const target = pick(SETS);
        const distractor = pick(SETS.filter((s) => s.id !== target.id));
        const needN = tier() === 0 ? 2 : (tier() === 1 ? 3 : 3);
        const good = shuffle(target.items).slice(0, needN);
        const badN = tier() === 0 ? 1 : 2;
        const bad = shuffle(distractor.items).slice(0, badN);
        const pool = shuffle([
          ...good.map((it) => ({ ...it, ok: true })),
          ...bad.map((it) => ({ ...it, ok: false })),
        ]);
        let selected = [];

        promptEl.textContent = "Which objects belong together for " + target.label + "?";
        say("Which objects belong in the same group?");
        choicesEl.innerHTML = "";
        stageEl.innerHTML = `
          <div class="le-nm-sg le-nm-sg-belong">
            <div class="le-nm-sg-belong-stage">
              <div class="le-nm-sg-belong-group is-drop" id="leSgBelongDrop">
                <span class="le-nm-sg-belong-title">Group for ${target.label}</span>
                <div class="le-nm-sg-belong-pad" id="leSgBelongPad"></div>
                <span class="le-nm-sg-belong-need">Pick ${needN}</span>
              </div>
              <div class="le-nm-sg-belong-pool">
                ${pool.map((it, i) => objBtn(qcIcon, it.kind, {
                  size: 70,
                  tone: i % 6,
                  label: it.name,
                  drag: false,
                  data: { ok: it.ok ? "1" : "0", idx: i },
                  cls: "is-tap",
                })).join("")}
              </div>
            </div>
            <p class="le-nm-tap-hint">Tap objects that belong together — wrong ones bounce away</p>
          </div>`;

        const pad = stageEl.querySelector("#leSgBelongPad");
        const drop = stageEl.querySelector("#leSgBelongDrop");
        stageEl.querySelectorAll(".le-nm-sg-obj").forEach((btn) => {
          btn.addEventListener("click", () => {
            if (getLocked() || btn.classList.contains("is-placed")) return;
            const ok = btn.getAttribute("data-ok") === "1";
            if (!ok) {
              btn.classList.add("is-bounce");
              setTimeout(() => btn.classList.remove("is-bounce"), 400);
              onWrong("That one doesn't belong in this group!");
              return;
            }
            if (selected.length >= needN) return;
            btn.classList.add("is-placed");
            pad.appendChild(btn);
            selected.push(btn);
            celebrateZone(drop);
            snd.correct();
            say(btn.getAttribute("aria-label") || "Yes!");
            if (selected.length >= needN) {
              drop.classList.add("is-complete");
              confetti(10);
              const scene = document.createElement("div");
              scene.className = "le-nm-sg-belong-unlock";
              scene.innerHTML = makeIcon(qcIcon, "sparkle", 48) + "<p>Group complete!</p>";
              drop.appendChild(scene);
              setTimeout(() => onCorrect("They belong together!"), 700);
            }
          });
        });
      }

      /* ---- 8) Odd One Out Mystery ---- */
      function buildOdd() {
        markStart();
        const PUZZLES = [
          {
            explain: "The toy doesn't belong with the fruits!",
            items: [
              { kind: "apple", name: "apple", odd: false },
              { kind: "banana", name: "banana", odd: false },
              { kind: "orange", name: "orange", odd: false },
              { kind: "car", name: "toy car", odd: true },
            ],
          },
          {
            explain: "The vehicle doesn't belong with the animals!",
            items: [
              { kind: "rabbit", name: "rabbit", odd: false },
              { kind: "cat", name: "cat", odd: false },
              { kind: "bear", name: "bear", odd: false },
              { kind: "train", name: "train", odd: true },
            ],
          },
          {
            explain: "One shape is different!",
            items: [
              { kind: "circle", name: "circle", odd: false, tone: 0 },
              { kind: "circle", name: "circle", odd: false, tone: 2 },
              { kind: "circle", name: "circle", odd: false, tone: 4 },
              { kind: "triangle", name: "triangle", odd: true, tone: 1 },
            ],
          },
          {
            explain: "Food doesn't belong with clothes!",
            items: [
              { kind: "shirt", name: "shirt", odd: false },
              { kind: "sock", name: "socks", odd: false },
              { kind: "shoe", name: "shoes", odd: false },
              { kind: "sandwich", name: "sandwich", odd: true },
            ],
          },
          {
            explain: "The farm animal doesn't live in the sea!",
            items: [
              { kind: "fish", name: "fish", odd: false },
              { kind: "turtle", name: "turtle", odd: false },
              { kind: "dolphin", name: "dolphin", odd: false },
              { kind: "cow", name: "cow", odd: true },
            ],
          },
          {
            explain: "One thing is not for school!",
            items: [
              { kind: "pencil", name: "pencil", odd: false },
              { kind: "notebook", name: "notebook", odd: false },
              { kind: "eraser", name: "eraser", odd: false },
              { kind: "ball", name: "ball", odd: true },
            ],
          },
          {
            explain: "One is not a flower!",
            items: [
              { kind: "rose", name: "rose", odd: false },
              { kind: "tulip", name: "tulip", odd: false },
              { kind: "daisy", name: "daisy", odd: false },
              { kind: "carrot", name: "carrot", odd: true },
            ],
          },
        ];

        let puzzle = pick(PUZZLES);
        if (tier() > 1) {
          // Harder: add a 5th similar distractor sometimes
          puzzle = {
            ...puzzle,
            items: shuffle(puzzle.items.concat([{ kind: puzzle.items[0].kind, name: puzzle.items[0].name, odd: false, tone: 3 }])).slice(0, 5),
          };
          // ensure exactly one odd
          const odds = puzzle.items.filter((x) => x.odd);
          if (odds.length !== 1) {
            puzzle = pick(PUZZLES);
          }
        }
        const items = shuffle(puzzle.items);

        promptEl.textContent = "Find the odd one out!";
        say("Can you find the object that doesn't belong?");
        choicesEl.innerHTML = "";
        stageEl.innerHTML = `
          <div class="le-nm-sg le-nm-sg-odd">
            <div class="le-nm-sg-detective">
              ${makeIcon(qcIcon, "detective", 56)}
              <span class="le-nm-sg-mag">${makeIcon(qcIcon, "magnifier", 40)}</span>
            </div>
            <div class="le-nm-sg-mystery-board">
              ${items.map((it, i) => objBtn(qcIcon, it.kind, {
                size: 88,
                tone: it.tone != null ? it.tone : i % 6,
                label: it.name,
                drag: false,
                data: { odd: it.odd ? "1" : "0", idx: i },
                cls: "is-suspect",
              })).join("")}
            </div>
            <p class="le-nm-tap-hint">Tap the object that does not belong</p>
          </div>`;

        let answered = false;
        stageEl.querySelectorAll(".le-nm-sg-obj").forEach((btn) => {
          btn.addEventListener("click", () => {
            if (getLocked() || answered) return;
            const isOdd = btn.getAttribute("data-odd") === "1";
            if (!isOdd) {
              btn.classList.add("is-bounce");
              setTimeout(() => btn.classList.remove("is-bounce"), 400);
              onWrong("Keep looking — which one is different?");
              say("Hmm, keep investigating!");
              return;
            }
            answered = true;
            btn.classList.add("is-found");
            stageEl.querySelectorAll(".le-nm-sg-obj").forEach((n) => {
              if (n !== btn) n.classList.add("is-dim");
            });
            const tip = document.createElement("p");
            tip.className = "le-nm-sg-odd-explain";
            tip.textContent = puzzle.explain;
            stageEl.querySelector(".le-nm-sg-odd").appendChild(tip);
            snd.correct();
            confetti(12);
            say(puzzle.explain);
            setTimeout(() => onCorrect("Mystery solved!"), 900);
          });
        });
      }

      return {
        sg_colour: buildColour,
        sg_shape: buildShape,
        sg_habitat: buildHabitat,
        sg_size: buildSize,
        sg_room: buildRoom,
        sg_garden: buildGarden,
        sg_belong: buildBelong,
        sg_odd: buildOdd,
      };
    },
  };
})();
