// COVER A · The yard, all the way up — infinite recursion of the theme atom.
// What recurses is the OBJECT: a plan-view container ship, zooming out until it
// becomes one cell of a 3x3 fleet block, which becomes one cell of a larger block…
// T(g+1) is pre-rendered as exactly 3x3 of T(g), so the 3:1 zoom snap is seamless.
(() => {
  const cv = document.getElementById("cover-canvas");
  if (!cv) return;
  const S = 260;                       // tile px
  const REDUCE = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ── Ship tile (plan view): hull + bow + stern tower + deck container cells ──
  function drawShip(g, rng) {
    const w = S, h = S;
    g.clearRect(0, 0, w, h);
    const hw = w * 0.86, hh = h * 0.34, x0 = (w - hw) / 2, y0 = (h - hh) / 2;
    // wake trace
    g.strokeStyle = "rgba(34,81,255,.16)"; g.lineWidth = 1;
    for (let i = 0; i < 3; i++) {
      g.beginPath();
      g.moveTo(x0 - 8 - i * 7, y0 + hh * (0.3 + i * 0.2));
      g.lineTo(x0 - 26 - i * 12, y0 + hh * (0.3 + i * 0.2));
      g.stroke();
    }
    // hull with raked bow (bow right)
    const bow = hw * 0.16;
    g.beginPath();
    g.moveTo(x0, y0); g.lineTo(x0 + hw - bow, y0);
    g.lineTo(x0 + hw, y0 + hh / 2); g.lineTo(x0 + hw - bow, y0 + hh);
    g.lineTo(x0, y0 + hh); g.closePath();
    g.fillStyle = "#12314a"; g.fill();
    g.strokeStyle = "rgba(5,28,44,.9)"; g.lineWidth = 1.5; g.stroke();
    // red boot-top stripe along hull base
    g.beginPath();
    g.moveTo(x0 + 2, y0 + hh - 5); g.lineTo(x0 + hw - bow + 4, y0 + hh - 5);
    g.lineTo(x0 + hw - 3, y0 + hh / 2 + 4);
    g.strokeStyle = "rgba(194,47,78,.55)"; g.lineWidth = 2.4; g.stroke();
    // deck container cells
    const cols = 9, rows = 4, cw = (hw - bow - 26) / cols, ch = (hh - 14) / rows;
    const blues = ["#2251ff", "#1233b8", "#7d9bff", "#42566a", "#1b3f63"];
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      if (rng() < 0.12) continue;      // empty slots
      g.fillStyle = blues[(rng() * blues.length) | 0];
      g.globalAlpha = 0.72 + rng() * 0.26;
      g.fillRect(x0 + 14 + c * cw + 1, y0 + 7 + r * ch + 1, cw - 2, ch - 2);
    }
    g.globalAlpha = 1;
    // stern accommodation tower
    g.fillStyle = "#eef1f6"; g.strokeStyle = "#051c2c"; g.lineWidth = 1.2;
    g.fillRect(x0 + 4, y0 + hh * 0.18, 9, hh * 0.64); g.strokeRect(x0 + 4, y0 + hh * 0.18, 9, hh * 0.64);
    g.fillStyle = "#2251ff"; g.fillRect(x0 + 6.5, y0 + hh * 0.18 - 4, 4, 5); // funnel
    // bow tip marker
    g.fillStyle = "rgba(34,81,255,.85)";
    g.beginPath(); g.arc(x0 + hw - 4, y0 + hh / 2, 2, 0, U.TAU); g.fill();
  }

  // ── Recursive textures: T(0)=ship; T(n)=3x3 of T(n-1) ──
  const variants = [];
  for (let v = 0; v < 6; v++) {
    const c = document.createElement("canvas"); c.width = c.height = S;
    drawShip(c.getContext("2d"), U.makeRng(1234 + v * 77));
    variants.push(c);
  }
  const TILES = [];
  function buildLevel(n) {
    if (n === 0) return variants;
    const prev = buildLevel(n - 1), out = [];
    for (let v = 0; v < 3; v++) {
      const c = document.createElement("canvas"); c.width = c.height = S * 3;
      const g = c.getContext("2d"), rng = U.makeRng(555 + n * 31 + v * 7);
      for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++)
        g.drawImage(prev[(rng() * prev.length) | 0], i * S, j * S);
      out.push(c);
    }
    return out;
  }
  for (let n = 0; n <= 4; n++) TILES.push(buildLevel(n));

  // ── Animation state ──
  let g = 0, t = 0, last = 0, raf = 0, born = {};   // born["i,j"] = phase at birth
  let active = false;
  const gate = U.visGate(document.getElementById("cover"));
  const BFS = [[0,0],[-1,0],[0,-1],[1,0],[0,1],[-1,-1],[1,-1],[-1,1],[1,1]]; // birth order
  function reset(gNew) {
    g = gNew;
    born = {};
    if (REDUCE) BFS.forEach(([i, j]) => born[i + "," + j] = 0);   // completed frame
    else born["0,0"] = 0;
  }

  function draw(now) {
    const { w, h } = B.fit();
    const ctx = B.ctx;
    ctx.clearRect(0, 0, w, h);
    const dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016); last = now;
    if (!REDUCE) t += dt / 12;                        // 12s per layer
    if (t >= 1) { t = 0; reset(Math.min(g + 1, 3)); }
    if (REDUCE) t = 0.999;
    // field lives right of the text column
    const base = Math.min(w * 0.40, h * 0.62);
    const cs = base * Math.pow(3, -t);
    const cx = w * 0.70, cy = h * 0.52;
    const lvl = TILES[Math.min(g, 3)], rngPick = (i, j) => lvl[((i * 7 + j * 13 + 100) % 3)];
    // birth ring
    BFS.forEach(([i, j], k) => {
      const key = i + "," + j;
      if (born[key] == null && t > 0.08 + k * 0.075) born[key] = t;
    });
    // draw 3x3 neighborhood
    for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) {
      const key = i + "," + j, b = born[key];
      if (b == null) continue;
      const age = REDUCE ? 1 : Math.min(1, (t - b) / 0.09);
      const size = cs * (0.6 + 0.4 * U.smooth(age));
      ctx.globalAlpha = age;
      ctx.drawImage(rngPick(i, j), cx + i * cs - size / 2, cy + j * cs - size / 2, size, size);
      ctx.globalAlpha = 1;
      // birth flash
      if (age < 1) {
        ctx.strokeStyle = `rgba(34,81,255,${(1 - age) * 0.85})`;
        ctx.lineWidth = 2;
        ctx.strokeRect(cx + i * cs - size / 2, cy + j * cs - size / 2, size, size);
      }
    }
    // viewfinder on center cell
    const fh = cs / 2, L = cs * 0.12;
    ctx.strokeStyle = `rgba(34,81,255,${0.55 + 0.3 * Math.sin(t * Math.PI)})`;
    ctx.lineWidth = 2;
    [[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([sx, sy]) => {
      ctx.beginPath();
      ctx.moveTo(cx + sx * fh, cy + sy * fh - sy * L);
      ctx.lineTo(cx + sx * fh, cy + sy * fh);
      ctx.lineTo(cx + sx * fh - sx * L, cy + sy * fh);
      ctx.stroke();
    });
    // left wash keeps the text column readable
    const wash = ctx.createLinearGradient(0, 0, w * 0.62, 0);
    wash.addColorStop(0, "rgba(255,255,255,1)");
    wash.addColorStop(0.82, "rgba(255,255,255,.92)");
    wash.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = wash;
    ctx.fillRect(0, 0, w * 0.62, h);
    // caption
    ctx.font = "11px Menlo, Consolas, 'PingFang SC', 'Microsoft YaHei', 'Noto Sans CJK SC', monospace";
    ctx.fillStyle = "rgba(66,86,106,.9)";
    ctx.textAlign = "right";
    ctx.fillText(T("RECURSION LAYER") + " " + (g + 1) + T(" · EVERY SHIP, ONE CELL ON A LARGER CAPACITY MAP"), w - 36, h - 30);
    ctx.textAlign = "left";
    raf = 0;
    if (!REDUCE && active && gate.visible()) raf = requestAnimationFrame(draw);
  }

  const B = U.bindCanvas(cv);
  addEventListener("resize", () => { if (cv.style.display !== "none") draw(last || 0); });
  window.COVER_A = {
    setActive(on) {
      cancelAnimationFrame(raf); raf = 0; active = on;
      if (on) { B.fit(); reset(0); t = 0; last = 0;
        if (REDUCE) requestAnimationFrame(() => { B.fit(); draw(0); });
        else if (gate.visible()) raf = requestAnimationFrame(draw);
      }
    }
  };
  gate.on(() => { if (active && !REDUCE && !raf) raf = requestAnimationFrame(draw); });
})();
