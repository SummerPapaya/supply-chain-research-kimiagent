// COVER B + D · Realistic-material exploded view of the theme atom (container ship),
// plus the unboxing opener (D): crate rattle → lid burst → layers eject → B's exploded state.
(() => {
  const cv = document.getElementById("cover-canvas-x");
  if (!cv) return;
  const REDUCE = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Layers bottom→top. Each: size (lw=length, ld=depth, th=thickness), lift z, material, thesis.
  const LAYERS = [
    { id: "hull",  lw: 46, ld: 13, th: 3.4, z: 0,
      col: { top: "#8e2438", side: "#5e1626", side2: "#701b2d" },
      head: "THE HULL — FREIGHT FLOOR", sub: "WCI $3,549 / 40ft · elevated band holds",
      thes: "hull", hot: false },
    { id: "holds", lw: 42, ld: 11.5, th: 2.6, z: 4.4,
      col: { top: "#12314a", side: "#0b2033", side2: "#0e2740" },
      head: "THE HOLDS — CAPACITY VS CHOKEPOINTS", sub: "record orderbook meets Suez −60%",
      thes: "holds", hot: true },          // hardest constraint → semantic red label
    { id: "deck",  lw: 40, ld: 10.5, th: 3.2, z: 8.4,
      col: { top: "#2251ff", side: "#1233b8", side2: "#1a41d8" },
      head: "THE DECK — VOLUME", sub: "$11.97T logistics body, 1 stack ≈ $1T",
      thes: "deck", hot: false },
    { id: "tower", lw: 9, ld: 10.5, th: 5.2, z: 13.4, stern: true,
      col: { top: "#f2f5f9", side: "#c8d3de", side2: "#dbe2ea" },
      head: "THE BRIDGE — THE BRAIN", sub: "SCM software $39.2B · +10.7% CAGR",
      thes: "tower", hot: false },
  ];

  // ── state ──
  let k = 0, target = 0, t = 0, last = 0, raf = 0, yaw = Math.PI / 4, mouseX = 0;
  let intro = null;   // D timeline state
  const clamp = U.clamp, lerp = U.lerp;
  const backOut = x => { const c = 1.70158 * 1.5; x = clamp(x, 0, 1) - 1; return 1 + (c + 1) * x * x * x + c * x * x; };

  function cam(w, h) {
    const leftBound = 0.585 * w, right = w - 332;
    let u = Math.min((right - leftBound) / 46, h * 0.0132);
    let labelMode = true;
    if (u < 5.6) { labelMode = false; u = Math.min((w - 80 - leftBound) / 46, h * 0.0132); }
    if (intro) u = Math.max(5, u) * intro.uK;
    return { cx: (leftBound + (labelMode ? right : w - 40)) / 2, cy: h * 0.56, u, labelMode };
  }
  function proj(x, y, z, c) {
    const rx = x * Math.cos(yaw) - y * Math.sin(yaw);
    const ry = x * Math.sin(yaw) + y * Math.cos(yaw);
    return { x: c.cx + rx * c.u, y: c.cy + ry * c.u * 0.5 - z * c.u };
  }
  // axonometric box: painter-sorted sides + top, with gloss/shade
  function box(g, c, cx0, cz, lw, ld, th, col, alpha) {
    const p = (x, y, z) => proj(x - cx0, y, z, c);
    const yb = cz, zt = cz + th;
    const A = p(-lw/2, -ld/2, yb), Bb = p(lw/2, -ld/2, yb), C = p(lw/2, ld/2, yb), D = p(-lw/2, ld/2, yb);
    const A2 = p(-lw/2, -ld/2, zt), B2 = p(lw/2, -ld/2, zt), C2 = p(lw/2, ld/2, zt), D2 = p(-lw/2, ld/2, zt);
    g.save(); g.globalAlpha = alpha;
    const faces = [
      { pts: [Bb, C, C2, B2], col: col.side },      // right side
      { pts: [C, D, D2, C2], col: col.side2 },      // left side
      { pts: [A2, B2, C2, D2], col: col.top },      // top
    ];
    faces.forEach((f, fi) => {
      g.beginPath(); f.pts.forEach((q, i) => i ? g.lineTo(q.x, q.y) : g.moveTo(q.x, q.y)); g.closePath();
      if (fi < 2) {
        const gr = g.createLinearGradient(0, f.pts[0].y, 0, f.pts[2].y);
        gr.addColorStop(0, f.col); gr.addColorStop(1, shade(f.col, -18));
        g.fillStyle = gr;
      } else g.fillStyle = f.col;
      g.fill();
      g.strokeStyle = "rgba(5,28,44,.35)"; g.lineWidth = 0.8; g.stroke();
      if (fi === 2) {   // top-face bevel
        g.strokeStyle = "rgba(255,255,255,.55)"; g.lineWidth = 1;
        g.beginPath(); g.moveTo(A2.x, A2.y); g.lineTo(B2.x, B2.y); g.stroke();
      }
    });
    g.restore();
    return { A2, B2, C2, D2, C, D };
  }
  function shade(hex, d) {
    const n = parseInt(hex.slice(1), 16);
    const r = clamp((n >> 16) + d, 0, 255), gg = clamp((n >> 8 & 255) + d, 0, 255), b = clamp((n & 255) + d, 0, 255);
    return `rgb(${r},${gg},${b})`;
  }

  // identity detail per layer (drawn on top face)
  function detail(g, c, L, cx0, cz, alpha) {
    const p = (x, y, z) => proj(x - cx0, y, z, c);
    g.save(); g.globalAlpha = alpha;
    if (L.id === "hull") {
      // draft marks along the hull side
      g.strokeStyle = "rgba(255,255,255,.75)"; g.lineWidth = 1;
      for (let i = 0; i < 6; i++) {
        const q0 = p(-L.lw/2 + 4 + i * 7, L.ld/2 + 0.02, cz + 0.6), q1 = p(-L.lw/2 + 4 + i * 7, L.ld/2 + 0.02, cz + 1.8);
        g.beginPath(); g.moveTo(q0.x, q0.y); g.lineTo(q1.x, q1.y); g.stroke();
      }
      // bulbous bow hint
      const bb = p(L.lw/2 - 2, 0, cz + 1);
      g.fillStyle = "rgba(255,255,255,.5)";
      g.beginPath(); g.arc(bb.x, bb.y, 2.2, 0, U.TAU); g.fill();
    }
    if (L.id === "holds") {
      // hatch-cover grid on the top face
      g.strokeStyle = "rgba(125,155,255,.5)"; g.lineWidth = 0.9;
      for (let i = 1; i < 8; i++) {
        const q0 = p(-L.lw/2 + i * L.lw / 8, -L.ld/2, cz + L.th), q1 = p(-L.lw/2 + i * L.lw / 8, L.ld/2, cz + L.th);
        g.beginPath(); g.moveTo(q0.x, q0.y); g.lineTo(q1.x, q1.y); g.stroke();
      }
      for (let j = 1; j < 3; j++) {
        const q0 = p(-L.lw/2, -L.ld/2 + j * L.ld / 3, cz + L.th), q1 = p(L.lw/2, -L.ld/2 + j * L.ld / 3, cz + L.th);
        g.beginPath(); g.moveTo(q0.x, q0.y); g.lineTo(q1.x, q1.y); g.stroke();
      }
    }
    if (L.id === "deck") {
      // container stacks: small boxes on the top face
      const rng = U.makeRng(42);
      const blues = ["#7d9bff", "#eef1f6", "#1233b8", "#42566a"];
      for (let i = 0; i < 9; i++) for (let j = 0; j < 3; j++) {
        if (rng() < 0.18) continue;
        const bx = -L.lw/2 + 3 + i * 4.1, by = -L.ld/2 + 1.4 + j * 3.3, bh = 0.9 + rng() * 1.1;
        box(g, c, cx0 - bx, cz + L.th, 3.4, 2.6, bh,
            { top: blues[(rng() * 4) | 0], side: "#1233b8", side2: "#1a41d8" }, alpha * 0.95);
      }
    }
    if (L.id === "tower") {
      // funnel with blue band + window strips
      box(g, c, cx0 + L.lw/2 - 2.5, cz + L.th, 2.2, 4, 2.6, { top: "#2251ff", side: "#1233b8", side2: "#1a41d8" }, alpha);
      g.strokeStyle = "rgba(5,28,44,.55)"; g.lineWidth = 1;
      for (let r = 1; r <= 3; r++) {
        const q0 = p(-L.lw/2, -L.ld/2 + 0.02, cz + L.th - r * 1.1), q1 = p(L.lw/2, -L.ld/2 + 0.02, cz + L.th - r * 1.1);
        g.beginPath(); g.moveTo(q0.x, q0.y); g.lineTo(q1.x, q1.y); g.stroke();
      }
    }
    g.restore();
  }

  // crate (D): four wood walls + independent lid
  function crate(g, c, zMid, wallA, lidState) {
    if (wallA <= 0.01 && !lidState) return;
    const wood = { top: "#c9a15e", side: "#a67f42", side2: "#b58c4d" };
    const lw = 37, ld = 12.5, th = 16;
    g.save();
    if (wallA > 0.01) {
      const mk = (x, y, w2) => {
        const A = proj(x - w2/2, y, zMid, c), Bb = proj(x + w2/2, y, zMid, c);
        const B2 = proj(x + w2/2, y, zMid + th, c), A2 = proj(x - w2/2, y, zMid + th, c);
        g.beginPath(); g.moveTo(A.x, A.y); g.lineTo(Bb.x, Bb.y); g.lineTo(B2.x, B2.y); g.lineTo(A2.x, A2.y); g.closePath();
      };
      g.globalAlpha = wallA * 0.96;
      // far wall
      mk(0, -ld/2, lw * 2); g.fillStyle = wood.side; g.fill();
      // left wall
      const mkL = () => {
        const A = proj(-lw, -ld/2, zMid, c), Bb = proj(-lw, ld/2, zMid, c);
        const B2 = proj(-lw, ld/2, zMid + th, c), A2 = proj(-lw, -ld/2, zMid + th, c);
        g.beginPath(); g.moveTo(A.x, A.y); g.lineTo(Bb.x, Bb.y); g.lineTo(B2.x, B2.y); g.lineTo(A2.x, A2.y); g.closePath();
      };
      mkL(); g.fillStyle = wood.side2; g.fill();
      // near wall with plank seams
      mk(0, ld/2, lw * 2); g.fillStyle = wood.top; g.fill();
      // right wall
      const mkR = () => {
        const A = proj(lw, -ld/2, zMid, c), Bb = proj(lw, ld/2, zMid, c);
        const B2 = proj(lw, ld/2, zMid + th, c), A2 = proj(lw, -ld/2, zMid + th, c);
        g.beginPath(); g.moveTo(A.x, A.y); g.lineTo(Bb.x, Bb.y); g.lineTo(B2.x, B2.y); g.lineTo(A2.x, A2.y); g.closePath();
      };
      mkR(); g.fillStyle = wood.side; g.fill();
      g.strokeStyle = "rgba(90,60,20,.5)"; g.lineWidth = 1;
      for (let i = 1; i < 8; i++) {
        const q0 = proj(-lw + i * lw * 2 / 8, ld/2 + 0.4, zMid, c), q1 = proj(-lw + i * lw * 2 / 8, ld/2 + 0.4, zMid + th, c);
        g.beginPath(); g.moveTo(q0.x, q0.y); g.lineTo(q1.x, q1.y); g.stroke();
      }
      // stencil on the near wall (upright mono at wall center, sized to fit the wall)
      const cxm = proj(0, ld/2 + 0.4, zMid + th * 0.48, c);
      const wallPx = Math.abs(proj(lw, ld/2, zMid, c).x - proj(-lw, ld/2, zMid, c).x);
      const fs = Math.min(c.u * 1.3, wallPx / 26);
      g.font = `700 ${Math.max(8.5, fs)}px Menlo, Consolas, 'PingFang SC', 'Microsoft YaHei', 'Noto Sans CJK SC', monospace`;
      g.textAlign = "center"; g.fillStyle = "rgba(60,38,8,.78)";
      g.fillText("FRAGILE · THIS SIDE UP ↑", cxm.x, cxm.y);
      g.textAlign = "left";
    }
    if (lidState) {
      g.translate(lidState.dx, lidState.dy); g.rotate(lidState.rot); g.globalAlpha = lidState.a;
      const lw2 = 40, ld2 = 14.5, zt = zMid + th + 0.4;
      const A = proj(-lw2/2, -ld2/2, zt, c), Bb = proj(lw2/2, -ld2/2, zt, c),
            C = proj(lw2/2, ld2/2, zt, c), D = proj(-lw2/2, ld2/2, zt, c);
      g.beginPath(); g.moveTo(A.x, A.y); g.lineTo(Bb.x, Bb.y); g.lineTo(C.x, C.y); g.lineTo(D.x, D.y); g.closePath();
      g.fillStyle = "#c9a15e"; g.fill();
      g.strokeStyle = "rgba(90,60,20,.65)"; g.lineWidth = 1.2; g.stroke();
      g.strokeStyle = "rgba(90,60,20,.8)";
      g.beginPath(); g.moveTo(A.x, A.y); g.lineTo(C.x, C.y); g.moveTo(Bb.x, Bb.y); g.lineTo(D.x, D.y); g.stroke();
    }
    g.restore();
  }

  let particles = [];
  function burst(cx, cy, n, spread) {
    const rng = U.makeRng((t * 997) | 0);
    for (let i = 0; i < n; i++) particles.push({
      x: cx, y: cy, vx: (rng() - 0.5) * spread, vy: -rng() * spread * 0.9,
      g: 340 + rng() * 200, life: 1, col: rng() < 0.6 ? "#a67f42" : "#8595a6", r: 1.5 + rng() * 2.5 });
  }

  function draw(now) {
    const { w, h } = B.fit();
    const g2 = B.ctx;
    const dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016); last = now;
    t += dt;
    yaw = Math.PI / 4 + 0.3 * Math.sin(t * 0.11) + mouseX * 0.11 + (intro ? intro.yawExtra : 0);
    const c = cam(w, h);

    // D timeline — wall-clock driven (correct speed even on janky frames)
    let wallA = 0, lidState = null, shk = 0;
    if (intro && intro.on) {
      const TW = (now - intro.t0) / 1000;
      intro.t = TW;
      if (TW < 0.5) { shk = 1.2 + 1.2 * Math.abs(Math.sin(TW * 34)); wallA = 1; }
      else {
        if (!intro.lidOff) { intro.lidOff = true; burst(c.cx, c.cy - 16 * c.u, 26, 190); shk = 15; }
        const lt = clamp((TW - 0.5) / 0.85, 0, 1);
        lidState = lt < 1 ? { dx: -150 * (1 - Math.pow(1 - lt, 3)), dy: -40 * (1 - Math.pow(1 - lt, 3)),
                              rot: -0.85 * lt, a: 1 - lt * lt } : null;
        wallA = clamp(1 - (TW - 0.55) / 0.45, 0, 1);
        if (TW >= 0.6 && !intro.ej) { intro.ej = true; burst(c.cx, c.cy, 30, 240); }
        intro.k = TW < 0.6 ? 0 : backOut((TW - 0.6) / 1.4);
        intro.uK = lerp(1.16, 1, clamp((TW - 0.55) / 1.55, 0, 1));
        intro.yawExtra = lerp(0.55, 0, clamp((TW - 0.55) / 1.55, 0, 1));
        shk = Math.max(shk, intro.shk || 0);
      }
      intro.shk = shk * Math.exp(-dt * 5.5);
      k = intro.k;
      if (TW >= 2.95) { intro = null; k = 1; target = 1; particles = []; }
    } else {
      k += (target - k) * (1 - Math.exp(-dt / 0.5));
    }

    g2.clearRect(0, 0, w, h);
    g2.save();
    if (shk > 0.05) g2.translate(Math.sin(t * 96) * shk, Math.cos(t * 81) * shk * 0.7);

    // ground shadow
    const gs = proj(0, 0, -0.4, c);
    const gr = g2.createRadialGradient(gs.x, gs.y, 4, gs.x, gs.y, 30 * c.u);
    gr.addColorStop(0, "rgba(5,28,44,.16)"); gr.addColorStop(1, "rgba(5,28,44,0)");
    g2.fillStyle = gr;
    g2.beginPath(); g2.ellipse(gs.x, gs.y, 30 * c.u, 9 * c.u, 0, 0, U.TAU); g2.fill();

    const zMid = -0.2;
    crate(g2, c, zMid, wallA, lidState);

    // layers with staggered explosion
    const sep = k * 10.5;
    const labelAnchors = [];
    LAYERS.forEach((L, i) => {
      const lay = clamp(k * 1.55 - i * 0.17, 0, 1);
      const ez = U.smooth(lay) * sep;
      const breathe = Math.sin(t * 0.9 + i * 1.4) * 0.14 * k;
      const cx0 = L.stern ? -LAYERS[0].lw/2 + L.lw/2 + 2.5 : 0;
      const z = zMid + L.z + ez + breathe;
      const alpha = intro ? clamp((k - 0.05) * 2, 0, 1) : 1;
      // soft plate shadow between layers
      if (lay > 0.05 && i > 0) {
        const sh = proj(cx0, 0, z - 1.2, c);
        g2.fillStyle = `rgba(5,28,44,${clamp(0.2 - ez * 0.012, 0.03, 0.2)})`;
        g2.beginPath(); g2.ellipse(sh.x, sh.y, L.lw * 0.5 * c.u, L.ld * 0.5 * c.u * 0.5, 0, 0, U.TAU); g2.fill();
      }
      box(g2, c, cx0, z, L.lw, L.ld, L.th, L.col, alpha);
      detail(g2, c, L, cx0, z, alpha);
      // label anchor: rightmost projected top corner
      const a = proj(cx0 + L.lw/2, -L.ld/2, z + L.th, c), b = proj(cx0 + L.lw/2, L.ld/2, z + L.th, c);
      labelAnchors.push({ L, x: Math.max(a.x, b.x), y: (a.y + b.y) / 2 });
    });

    // label column
    const la = clamp((k - 0.45) * 2.4, 0, 1);
    if (c.labelMode && la > 0.01) {
      const lx = w - 320;
      g2.save(); g2.globalAlpha = la;
      let ly = h * 0.2;
      labelAnchors.forEach(({ L, x, y }) => {
        ly = Math.max(ly, y - 10);
        g2.strokeStyle = L.hot ? "rgba(194,47,78,.8)" : "rgba(66,86,106,.55)";
        g2.lineWidth = 1;
        g2.beginPath(); g2.moveTo(x + 6, y); g2.lineTo(lx - 8, ly + 4); g2.stroke();
        g2.fillStyle = L.hot ? "#c22f4e" : "#051c2c";
        g2.beginPath(); g2.arc(lx - 4, ly + 4, 2, 0, U.TAU); g2.fill();
        g2.font = "700 13px 'et-book', Palatino, Georgia, 'Songti SC', 'Noto Serif CJK SC', 'SimSun', serif";
        g2.fillStyle = L.hot ? "#c22f4e" : "#051c2c";
        g2.fillText(T(L.head), lx, ly);
        g2.font = "10.5px Menlo, Consolas, 'PingFang SC', 'Microsoft YaHei', 'Noto Sans CJK SC', monospace";
        g2.fillStyle = "#42566a";
        g2.fillText(T(L.sub).toUpperCase().slice(0, 38), lx, ly + 15);
        ly += 58;
      });
      g2.restore();
    }

    // particles
    particles = particles.filter(p => p.life > 0);
    particles.forEach(p => {
      p.x += p.vx * dt; p.y += p.vy * dt; p.vy += p.g * dt; p.life -= dt * 0.9;
      g2.globalAlpha = clamp(p.life, 0, 1) * 0.8; g2.fillStyle = p.col;
      g2.fillRect(p.x, p.y, p.r, p.r); g2.globalAlpha = 1;
    });
    g2.restore();

    // left wash keeps the text column readable
    const wash = g2.createLinearGradient(0, 0, w * 0.58, 0);
    wash.addColorStop(0, "rgba(255,255,255,1)");
    wash.addColorStop(0.85, "rgba(255,255,255,.9)");
    wash.addColorStop(1, "rgba(255,255,255,0)");
    g2.fillStyle = wash;
    g2.fillRect(0, 0, w * 0.58, h);

    // caption + signature strip
    g2.font = "10.5px Menlo, Consolas, 'PingFang SC', 'Microsoft YaHei', 'Noto Sans CJK SC', monospace";
    g2.fillStyle = "rgba(66,86,106,.9)"; g2.textAlign = "right";
    const state = T(intro ? "UNBOXING" : (k > 0.5 ? "EXPLODED" : "ASSEMBLED"));
    const hint = intro ? "" : `${T(" · CLICK COVER TO ")}${T(k > 0.5 ? "ASSEMBLE" : "EXPLODE")}`;
    g2.fillText(`${T("FIG. 1 · THE SHIP, IN LAYERS · ")}${state}${hint}`, w - 36, h - 30);
    g2.textAlign = "left";

    if (!REDUCE) raf = requestAnimationFrame(draw);
  }

  const B = U.bindCanvas(cv);
  cv.addEventListener("mousemove", e => { mouseX = (e.clientX / innerWidth - 0.5) * 2; });
  cv.addEventListener("click", e => {
    if (e.target.closest("button, a, .chip, .cover-mode")) return;
    if (intro) return;
    target = target > 0.5 ? 0 : 1;
  });
  cv.addEventListener("dblclick", e => {
    if (e.target.closest("button, a, .chip, .cover-mode")) return;
    startIntro();
  });
  function startIntro() {
    intro = { on: true, t0: performance.now(), t: 0, k: 0, uK: 1.16, yawExtra: 0.55, shk: 0, lidOff: false, ej: false };
    k = 0; particles = [];
  }
  addEventListener("resize", () => { if (cv.style.display !== "none") draw(last || 0); });

  window.COVER_X = {
    setActive(on, opt) {
      cancelAnimationFrame(raf);
      if (on) {
        B.fit(); last = 0;
        if (opt && opt.intro && !REDUCE) startIntro();
        else { intro = null; k = target = 1; }
        if (REDUCE) { intro = null; k = target = 1; requestAnimationFrame(() => { B.fit(); draw(0); }); }
        else raf = requestAnimationFrame(draw);
      }
    },
    playIntro: startIntro,
  };
})();
