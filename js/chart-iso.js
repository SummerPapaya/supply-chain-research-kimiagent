// §1 · P1 theme-native iso units — SCM software market ramp as isometric container stacks.
// 1 box = $5B. Solid = actual, hollow+dashed = forecast. CAGR arc across the tops.
(() => {
  const host = document.getElementById("iso-chart");
  if (!host) return;
  const body = U.frame(host, {
    title: T("The brain, stacked: $35.3B → $97.6B in ten years"),
    sub: T("1 CONTAINER = $5B OF SCM SOFTWARE · SOLID = ACTUAL · HOLLOW+DASHED = FORECAST · CLICK A STACK"),
    src: T("Industry sizing consensus (K1), March 2026 · forecast years flagged"),
  });
  const cv = document.createElement("canvas");
  cv.style.width = "100%"; cv.style.height = "400px"; cv.style.display = "block";
  body.appendChild(cv);
  const B = U.bindCanvas(cv);
  const REDUCE = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const MONO = "Menlo, Consolas, 'PingFang SC', 'Microsoft YaHei', 'Noto Sans CJK SC', monospace", SERIF = "'et-book', Palatino, Georgia, 'Songti SC', 'Noto Serif CJK SC', 'SimSun', serif";
  const clamp = U.clamp;

  const YEARS = [
    { y: 2025, v: 35.3, est: false },
    { y: 2026, v: 39.2, est: false },
    { y: 2030, v: 60.0, est: true },
    { y: 2035, v: 97.57, est: true },
  ];
  const BOX_B = 5;
  YEARS.forEach(d => d.n = Math.round(d.v / BOX_B));

  const proj = (x, y, z, c) => ({
    x: c.cx + (x - y) * c.u * 0.866,
    y: c.baseY + (x + y) * c.u * 0.5 - z * c.u,
  });
  function isoBox(g, c, x, y, z, sx, sy, sz, style) {
    const p = (X, Y, Z) => proj(x + X, y + Y, z + Z, c);
    const A = p(0, 0, sz), Bb = p(sx, 0, sz), C = p(sx, sy, sz), D = p(0, sy, sz);
    const B0 = p(sx, 0, 0), C0 = p(sx, sy, 0), D0 = p(0, sy, 0);
    g.save();
    const faces = [
      { pts: [Bb, C, C0, B0], c: style.side },
      { pts: [D, C, C0, D0], c: style.side2 },
      { pts: [A, Bb, C, D], c: style.top },
    ];
    faces.forEach((f, i) => {
      g.beginPath(); f.pts.forEach((q, j) => j ? g.lineTo(q.x, q.y) : g.moveTo(q.x, q.y)); g.closePath();
      if (style.hollow) {
        g.fillStyle = i === 2 ? "rgba(34,81,255,.06)" : "rgba(34,81,255,.03)";
        g.fill();
        g.setLineDash(i === 2 ? [5, 4] : [3, 3]);
        g.strokeStyle = "rgba(34,81,255,.75)"; g.lineWidth = 1.1; g.stroke(); g.setLineDash([]);
      } else {
        g.fillStyle = f.c; g.fill();
        g.strokeStyle = "rgba(255,255,255,.4)"; g.lineWidth = 0.6; g.stroke();
      }
    });
    g.restore();
  }

  let done = false, raf = 0;
  const stacks = YEARS.map((d, i) => ({ d, i }));
  function draw(prog) {
    const r = cv.getBoundingClientRect();
    const g = B.ctx; B.fit();
    const W = r.width, H = r.height;
    g.clearRect(0, 0, W, H);
    const u = Math.min(W / 46, 13);
    const c0 = { u, baseY: H * 0.72 };
    const isoDrop = 4.4 * u * 0.5;
    const gapX = W / 4.6;
    const tops = [];
    stacks.forEach(({ d, i }) => {
      const cx = W * 0.13 + i * gapX;
      const c = { u, baseY: c0.baseY, cx };
      const born = clamp((prog - i * 0.12) / 0.5, 0, 1);
      const show = Math.floor(d.n * U.smooth(born));
      for (let b = 0; b < show; b++) {
        const col = b % 2;
        isoBox(g, c, (col - 0.5) * 2.2, (b % 2 ? -0.4 : 0.4) - 1, Math.floor(b / 2) * 1.9, 2, 2, 1.7,
          d.est ? { hollow: true } : { top: "#2251ff", side: "#1233b8", side2: "#1a41d8" });
      }
      const topZ = Math.ceil(d.n / 2) * 1.9;
      const tp = proj(0, 0, topZ + 0.6, c);
      tops.push({ x: cx, y: tp.y, d });
      const a = born > 0.6 ? 1 : 0;
      if (a) {
        g.font = `700 17px ${SERIF}`; g.fillStyle = d.est ? "#2251ff" : "#051c2c"; g.textAlign = "center";
        g.fillText("$" + d.v + "B", cx, c0.baseY + isoDrop + 26);
        g.font = `10px ${MONO}`; g.fillStyle = "#42566a";
        g.fillText(d.y + (d.est ? "E" : ""), cx, c0.baseY + isoDrop + 42);
        g.fillStyle = "#8595a6";
        g.fillText(T(d.est ? "FORECAST" : d.y === 2026 ? "CURRENT" : "ACTUAL"), cx, c0.baseY + isoDrop + 56);
        g.textAlign = "left";
      }
    });
    // CAGR arc across tops
    if (prog > 0.7 && tops.length === 4) {
      g.strokeStyle = "rgba(34,81,255,.7)"; g.setLineDash([5, 4]); g.lineWidth = 1.4;
      g.beginPath(); g.moveTo(tops[0].x, tops[0].y - 8);
      g.quadraticCurveTo((tops[0].x + tops[3].x) / 2, Math.min(tops[0].y, tops[3].y) - 66, tops[3].x, tops[3].y - 8);
      g.stroke(); g.setLineDash([]);
      g.font = `700 13px ${SERIF}`; g.fillStyle = "#2251ff"; g.textAlign = "center";
      g.fillText(T("+10.7% CAGR"), (tops[0].x + tops[3].x) / 2, Math.min(tops[0].y, tops[3].y) - 56);
      g.textAlign = "left";
    }
    g.font = `9.5px ${MONO}`; g.fillStyle = "#8595a6";
    g.fillText(T("CLICK A STACK FOR BASIS"), 14, H - 12);
  }

  cv.addEventListener("click", e => {
    const r = cv.getBoundingClientRect();
    const x = e.clientX - r.left, gapX = r.width / 4.6;
    const i = clamp(Math.round((x - r.width * 0.13) / gapX), 0, 3);
    const d = YEARS[i];
    U.showDrill({
      title: `${T("SCM software market")} ${d.y}${d.est ? T(" (forecast)") : ""}`,
      value: "$" + d.v + "B",
      sub: d.est ? T("Consensus forecast at +10.7% CAGR — flagged estimate") : (d.y === 2026 ? T("Current-year sizing") : T("Actual sizing")),
      source: "K1 · industry market sizing consensus, 2026-03",
      x: e.clientX, y: e.clientY,
    });
  });

  const io = new IntersectionObserver(en => {
    if (en[0].isIntersecting) {
      io.disconnect();
      let t0 = null;
      const fr = ts => { if (t0 == null) t0 = ts;
        const p = REDUCE ? 1 : clamp((ts - t0) / 1400, 0, 1);
        draw(p);
        if (p < 1 && !REDUCE) raf = requestAnimationFrame(fr); else done = true; };
      raf = requestAnimationFrame(fr);
      setTimeout(() => { if (!done) { done = true; cancelAnimationFrame(raf); draw(1); } }, 3200);
    }
  }, { threshold: 0.25 });
  io.observe(cv);
  addEventListener("resize", () => { if (done) draw(1); });
})();
