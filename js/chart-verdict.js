// §6 · P18 verdict scale — two-case verdict weighed physically.
// Left pan: "efficiency endures" (3 weights). Right pan: "structural rewiring" (5).
// Dashed weights hover outside = upgrade triggers. Red-hatched seal = falsification strip.
(() => {
  const host = document.getElementById("verdict-chart");
  if (!host) return;
  const body = U.frame(host, {
    title: T("The evidence, weighed"),
    sub: T("TILT IS QUALITATIVE — NOT A SCORE · DASHED WEIGHTS = TRIGGERS NOT YET MET · RED SEAL = FALSIFICATION · CLICK ANY PIECE"),
    src: T("Weights & triggers compiled from K7–K16 · verdict is a research judgment (K19)"),
  });
  const cv = document.createElement("canvas");
  cv.style.width = "100%"; cv.style.height = "500px"; cv.style.display = "block";
  body.appendChild(cv);
  const B = U.bindCanvas(cv);
  const REDUCE = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const W = 880, H = 500;
  const SERIF = "'et-book', Palatino, Georgia, 'Songti SC', 'Noto Serif CJK SC', 'SimSun', serif", MONO = "Menlo, Consolas, 'PingFang SC', 'Microsoft YaHei', 'Noto Sans CJK SC', monospace";
  const clamp = U.clamp, V = RPT.verdict;

  const FX = { x: 400, y: 128 }, beamL = 200;
  const tilt = 0.055;
  // Label rails live OUTSIDE the beam's x-span (200–600): left rail right-aligned
  // at 168, right rail left-aligned at 656 — the beam can never strike text.
  const hits = [];
  function halo(g, txt, x, y, o = {}) {
    g.font = `${o.b ? "700 " : ""}${o.s || 12}px ${o.mono ? MONO : SERIF}`;
    g.textAlign = o.al || "center";
    g.lineWidth = 4; g.strokeStyle = "rgba(255,255,255,.92)"; g.lineJoin = "round";
    g.strokeText(txt, x, y); g.fillStyle = o.col || "#051c2c"; g.fillText(txt, x, y);
    g.textAlign = "left";
  }
  function weight(g, x, y, w, h, col, dashed) {
    g.save();
    if (dashed) g.setLineDash([5, 4]);
    g.beginPath();
    g.moveTo(x - w / 2 + 7, y - h); g.lineTo(x + w / 2 - 7, y - h);
    g.lineTo(x + w / 2, y); g.lineTo(x - w / 2, y); g.closePath();
    if (dashed) { g.fillStyle = "rgba(34,81,255,.05)"; g.fill(); g.strokeStyle = "#2251ff"; }
    else { g.fillStyle = col; g.fill(); g.strokeStyle = "rgba(5,28,44,.5)"; }
    g.lineWidth = 1.2; g.stroke(); g.setLineDash([]);
    g.beginPath(); g.arc(x, y - h - 5, 5, 0, U.TAU);
    if (dashed) { g.setLineDash([3, 3]); g.strokeStyle = "#2251ff"; g.stroke(); g.setLineDash([]); }
    else { g.fillStyle = col; g.fill(); }
    g.restore();
  }
  // side label: two lines, vertically centered on the weight, anchored left or right.
  // Overflow is ellipsized; trailing commas/articles/prepositions are stripped first.
  // maxW: hard pixel budget — font shrinks (min 7.8px) before anything can clip.
  function sideLabel(g, txt, x, yMid, align, col, cap = 30, maxW = 0) {
    const words = txt.split(" "); let l1 = "", l2 = "", on1 = true, dropped = false;
    words.forEach(wd => { if (on1 && (l1 + " " + wd).trim().length <= cap) l1 = (l1 + " " + wd).trim();
      else { on1 = false; if (!dropped && (l2 + " " + wd).trim().length <= cap + 2) l2 = (l2 + " " + wd).trim(); else dropped = true; } });
    if (dropped) {
      l2 = l2.replace(/[,\s]+(a|an|the|of|is|not|and|or|to|&|\+|for|with|by|in|on|at)$/i, "").replace(/[,\s]+$/, "") + " …";
    }
    let fs = 9.5;
    if (maxW > 0) {
      g.font = `${fs}px ${MONO}`;
      const need = Math.max(g.measureText(l1).width, l2 ? g.measureText(l2).width : 0);
      if (need > maxW) fs = Math.max(7.8, fs * maxW / need);
    }
    halo(g, l1, x, yMid - (l2 ? 3 : -3), { s: fs, mono: 1, col: col || "#42566a", al: align });
    if (l2) halo(g, l2, x, yMid + 10, { s: fs, mono: 1, col: col || "#42566a", al: align });
  }

  function draw(prog) {
    B.fit();
    const g = B.ctx;
    g.setTransform(cv.width / W, 0, 0, cv.height / H, 0, 0);
    g.clearRect(0, 0, W, H);
    hits.length = 0;
    const a = U.smooth(prog);

    // pillar
    g.strokeStyle = "#051c2c"; g.lineWidth = 3;
    g.beginPath(); g.moveTo(FX.x, FX.y - 6); g.lineTo(FX.x, 380); g.stroke();
    g.beginPath(); g.moveTo(FX.x - 46, 380); g.lineTo(FX.x + 46, 380); g.stroke();
    // fulcrum dial
    g.save(); g.translate(FX.x, FX.y);
    for (let i = -3; i <= 3; i++) {
      const ang = -Math.PI / 2 + i * 0.22;
      g.strokeStyle = i > 0 ? "#2251ff" : i < 0 ? "#42566a" : "#051c2c";
      g.lineWidth = i === 0 ? 2 : 1;
      g.beginPath(); g.moveTo(Math.cos(ang) * 18, Math.sin(ang) * 18); g.lineTo(Math.cos(ang) * 26, Math.sin(ang) * 26); g.stroke();
    }
    g.strokeStyle = "#2251ff"; g.lineWidth = 2.4;
    g.beginPath(); g.moveTo(0, 0); g.lineTo(Math.cos(-Math.PI / 2 + 0.33) * 30, Math.sin(-Math.PI / 2 + 0.33) * 30); g.stroke();
    g.restore();
    g.fillStyle = "#051c2c"; g.beginPath(); g.arc(FX.x, FX.y, 4.5, 0, U.TAU); g.fill();

    // beam
    const th = tilt * a;
    g.save(); g.translate(FX.x, FX.y); g.rotate(th);
    g.strokeStyle = "#051c2c"; g.lineWidth = 4; g.lineCap = "round";
    g.beginPath(); g.moveTo(-beamL, 0); g.lineTo(beamL, 0); g.stroke();
    g.restore();
    const ends = [-1, 1].map(s => ({ x: FX.x + s * beamL * Math.cos(th), y: FX.y + s * beamL * Math.sin(th) }));
    ends.forEach((e, idx) => {
      const s = idx === 0 ? -1 : 1;
      const chainL = 74, px = e.x, py = e.y + chainL;
      g.strokeStyle = "#42566a"; g.lineWidth = 1.1;
      [-26, 0, 26].forEach(dx => {
        g.beginPath(); g.moveTo(e.x, e.y); g.lineTo(px + dx * 0.6, py); g.stroke();
      });
      g.beginPath(); g.moveTo(px - 44, py); g.lineTo(px + 44, py);
      g.lineTo(px + 30, py + 12); g.lineTo(px - 30, py + 12); g.closePath();
      g.fillStyle = "#eef1f6"; g.fill(); g.strokeStyle = "#051c2c"; g.lineWidth = 1.4; g.stroke();
      const list = s < 0 ? V.left_w : V.right_w;
      list.forEach((wt, wi) => {
        const born = clamp((a * 1.35 - wi * 0.14 - (s > 0 ? 0.06 : 0)), 0, 1);
        if (born <= 0) return;
        const wy = py - wi * 34 - 8;
        const wx = px;
        const yMid = wy - 12;
        g.save(); g.globalAlpha = born;
        weight(g, wx, wy, 58 - wi * 4, 24, s < 0 ? "#42566a" : "#2251ff", false);
        if (s < 0) {
          sideLabel(g, wt, 168, yMid, "right", undefined, 28, 160);
        } else {
          g.strokeStyle = "rgba(66,86,106,.4)"; g.lineWidth = 1;
          g.beginPath(); g.moveTo(wx + 34, yMid + 2); g.lineTo(650, yMid + 2); g.stroke();
          sideLabel(g, wt, 656, yMid, "left", undefined, 36, 216);
        }
        g.restore();
        hits.push({ x: wx, y: yMid, w: 64, h: 34, kind: "weight", side: s, i: wi });
        hits.push({ x: s < 0 ? 88 : 763, y: yMid, w: s < 0 ? 176 : 234, h: 32, kind: "weight", side: s, i: wi });
      });
      if (s < 0) halo(g, T("EFFICIENCY ENDURES"), px, py + 50, { b: 1, s: 12.5, col: "#42566a" });
      else halo(g, T("STRUCTURAL REWIRING"), 648, py + 50, { b: 1, s: 12.5, col: "#1233b8", al: "right" });
    });

    // dashed trigger weights — right rail, below the weight labels (marker + text rows)
    halo(g, T("UPGRADE TRIGGERS"), 656, 218, { s: 9, mono: 1, col: "#2251ff", al: "left" });
    V.triggers.forEach((tr, i) => {
      const ty = 232 + i * 32;
      const born = clamp(a * 1.4 - 0.5 - i * 0.12, 0, 1);
      if (born <= 0) return;
      g.save(); g.globalAlpha = born;
      weight(g, 668, ty + 7, 22, 12, null, true);
      sideLabel(g, tr, 684, ty - 3, "left", "#2251ff", 25, 188);
      g.restore();
      hits.push({ x: 772, y: ty - 3, w: 216, h: 30, kind: "trigger", i });
    });

    // readout plaque
    g.fillStyle = "#051c2c";
    g.fillRect(FX.x - 150, 268, 300, 44);
    g.fillStyle = "#ffffff"; g.font = `700 12.5px ${SERIF}`; g.textAlign = "center";
    g.fillText(T("Resilience-first is the baseline;"), FX.x, 285);
    g.fillText(T("efficiency survives inside it"), FX.x, 301);
    g.textAlign = "left";
    hits.push({ x: FX.x, y: 290, w: 300, h: 44, kind: "verdict" });

    // falsification seal
    const sy = 420;
    g.save();
    g.beginPath(); g.rect(90, sy, 700, 56); g.clip();
    g.fillStyle = "rgba(194,47,78,.09)"; g.fillRect(90, sy, 700, 56);
    g.strokeStyle = "rgba(194,47,78,.5)"; g.lineWidth = 1;
    for (let xx = 60; xx < 820; xx += 12) { g.beginPath(); g.moveTo(xx, sy + 58); g.lineTo(xx + 30, sy - 2); g.stroke(); }
    g.restore();
    g.strokeStyle = "#c22f4e"; g.lineWidth = 1.4; g.strokeRect(90, sy, 700, 56);
    halo(g, T("FALSIFICATION SEAL — THE VERDICT IS WRONG IF ANY STRIP TRIPS"), 440, sy + 14, { s: 9, mono: 1, col: "#c22f4e" });
    V.falsify.forEach((f, i) => {
      const fx = 100 + i * 232, fw = 224;
      g.fillStyle = "#ffffff"; g.strokeStyle = "#c22f4e"; g.lineWidth = 1;
      g.fillRect(fx, sy + 20, fw, 28); g.strokeRect(fx, sy + 20, fw, 28);
      g.font = `9px ${MONO}`; g.fillStyle = "#051c2c";
      const t1 = f.length > 36 ? f.slice(0, 36) + "…" : f;
      g.fillText(t1, fx + 8, sy + 37);
      hits.push({ x: fx + fw / 2, y: sy + 34, w: fw, h: 28, kind: "falsify", i });
    });
  }

  const DRILLS = {
    weight: (side, i) => ({
      title: (side < 0 ? T("Efficiency case · evidence ") : T("Rewiring case · evidence ")) + (i + 1),
      value: side < 0 ? V.left_w[i].split("—")[0].trim() : V.right_w[i].split("—")[0].trim(),
      sub: (side < 0 ? V.left_w[i] : V.right_w[i]),
      source: T("Evidence compiled from K7–K16 · grading is a research judgment (K19)"),
    }),
    trigger: i => ({
      title: T("Upgrade trigger ") + (i + 1), value: T("NOT YET MET"),
      sub: V.triggers[i] + T(" · Reading upgrades only when all triggers land on the pan."),
      source: T("K19 · research framework, 2026-07-19"),
    }),
    falsify: i => ({ title: T("Falsification strip ") + (i + 1), value: T("TRIP = VERDICT WRONG"), sub: V.falsify[i], source: T("K19 · falsification discipline") }),
    verdict: () => ({ title: T("Current verdict"), value: T("RESILIENCE-FIRST BASELINE"), sub: T("Tilt is qualitative, not a score. Review cadence: quarterly, or on any trigger/falsification event."), source: T("K19 · research judgment, 2026-07-19") }),
  };
  cv.addEventListener("click", e => {
    const r = cv.getBoundingClientRect();
    const x = (e.clientX - r.left) * (W / r.width), y = (e.clientY - r.top) * (H / r.height);
    for (const h0 of hits) {
      if (Math.abs(x - h0.x) < h0.w / 2 && Math.abs(y - h0.y) < h0.h / 2 + 8) {
        const d = h0.kind === "weight" ? DRILLS.weight(h0.side, h0.i) : h0.kind === "trigger" ? DRILLS.trigger(h0.i) : h0.kind === "falsify" ? DRILLS.falsify(h0.i) : DRILLS.verdict();
        U.showDrill({ ...d, x: e.clientX, y: e.clientY });
        return;
      }
    }
  });

  let raf = 0, done = false;
  function fullDraw(p) { draw(p); }
  const io = new IntersectionObserver(en => {
    if (en[0].isIntersecting) {
      io.disconnect();
      let t0 = null;
      const fr = ts => { if (t0 == null) t0 = ts;
        const p = REDUCE ? 1 : clamp((ts - t0) / 1700, 0, 1);
        draw(p);
        if (p < 1 && !REDUCE) raf = requestAnimationFrame(fr); else done = true; };
      raf = requestAnimationFrame(fr);
      setTimeout(() => { if (!done) { done = true; cancelAnimationFrame(raf); draw(1); } }, 3600);
    }
  }, { threshold: 0.25 });
  io.observe(cv);
  addEventListener("resize", () => { if (done) draw(1); });
})();
