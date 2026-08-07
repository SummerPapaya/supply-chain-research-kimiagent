// COVER C · Blueprint wireframe of the same exploded geometry + the 4-way mode switcher.
(() => {
  const cv = document.getElementById("cover-canvas-w");
  if (!cv) return;
  const REDUCE = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const LAYERS = [
    { id: "hull",  lw: 46, ld: 13, th: 3.4, z: 0,    col: "#c22f4e", name: "THE HULL — FREIGHT FLOOR" },
    { id: "holds", lw: 42, ld: 11.5, th: 2.6, z: 4.4, col: "#2251ff", name: "THE HOLDS — CAPACITY VS CHOKEPOINTS" },
    { id: "deck",  lw: 40, ld: 10.5, th: 3.2, z: 8.4, col: "#1233b8", name: "THE DECK — VOLUME" },
    { id: "tower", lw: 9, ld: 10.5, th: 5.2, z: 13.4, stern: true, col: "#42566a", name: "THE BRIDGE — THE BRAIN" },
  ];
  let k = 1, target = 1, t = 0, last = 0, raf = 0, yaw = Math.PI / 4;
  const clamp = U.clamp;

  function cam(w, h) {
    const leftBound = 0.585 * w, right = w - 332;
    let u = Math.min((right - leftBound) / 46, h * 0.0132);
    if (u < 5.6) u = Math.min((w - 80 - leftBound) / 46, h * 0.0132);
    return { cx: (leftBound + right) / 2, cy: h * 0.56, u };
  }
  const proj = (x, y, z, c) => {
    const rx = x * Math.cos(yaw) - y * Math.sin(yaw);
    const ry = x * Math.sin(yaw) + y * Math.cos(yaw);
    return { x: c.cx + rx * c.u, y: c.cy + ry * c.u * 0.5 - z * c.u };
  };

  function wireBox(g, c, cx0, cz, lw, ld, th, col, alpha) {
    const p = (x, y, z) => proj(x - cx0, y, z, c);
    const zb = cz, zt = cz + th;
    const cs = [
      p(-lw/2,-ld/2,zb), p(lw/2,-ld/2,zb), p(lw/2,ld/2,zb), p(-lw/2,ld/2,zb),
      p(-lw/2,-ld/2,zt), p(lw/2,-ld/2,zt), p(lw/2,ld/2,zt), p(-lw/2,ld/2,zt)];
    const edges = [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
    g.save();
    // white veil on top face for front/back layering
    g.globalAlpha = alpha * 0.55; g.fillStyle = "#ffffff";
    g.beginPath(); [4,5,6,7].forEach((ix, i) => i ? g.lineTo(cs[ix].x, cs[ix].y) : g.moveTo(cs[ix].x, cs[ix].y));
    g.closePath(); g.fill();
    edges.forEach(([a, b], ei) => {
      const top = a >= 4 && b >= 4;
      g.strokeStyle = col; g.globalAlpha = alpha * (top ? 0.85 : ei >= 8 ? 0.7 : 0.4);
      g.lineWidth = top ? 1.4 : 1;
      g.beginPath(); g.moveTo(cs[a].x, cs[a].y); g.lineTo(cs[b].x, cs[b].y); g.stroke();
    });
    g.restore();
    return cs;
  }

  function draw(now) {
    const { w, h } = B.fit();
    const g = B.ctx;
    const dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016); last = now;
    t += dt; yaw = Math.PI / 4 + 0.25 * Math.sin(t * 0.11);
    k += (target - k) * (1 - Math.exp(-dt / 0.5));
    const c = cam(w, h);
    g.clearRect(0, 0, w, h);

    // drafting grid + registration marks
    g.strokeStyle = "rgba(34,81,255,.07)"; g.lineWidth = 1;
    for (let x = 0; x < w; x += 52) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); }
    for (let y = 0; y < h; y += 52) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
    g.strokeStyle = "rgba(34,81,255,.6)";
    [[30,30],[w-30,30],[30,h-30],[w-30,h-30]].forEach(([x, y]) => {
      g.beginPath(); g.moveTo(x-8, y); g.lineTo(x+8, y); g.moveTo(x, y-8); g.lineTo(x, y+8); g.stroke();
    });

    const sep = k * 10.5, zMid = -0.2;
    const anchors = [];
    LAYERS.forEach((L, i) => {
      const lay = clamp(k * 1.55 - i * 0.17, 0, 1);
      const z = zMid + L.z + U.smooth(lay) * sep + Math.sin(t * 0.9 + i) * 0.12 * k;
      const cx0 = L.stern ? -LAYERS[0].lw/2 + L.lw/2 + 2.5 : 0;
      const cs = wireBox(g, c, cx0, z, L.lw, L.ld, L.th, L.col, 1);
      // hairline detail: hatch grid on holds
      if (L.id === "holds") {
        g.save(); g.strokeStyle = L.col; g.globalAlpha = 0.35; g.lineWidth = 0.7;
        for (let ix = 1; ix < 8; ix++) {
          const q0 = proj(cx0 - L.lw/2 + ix * L.lw/8, -L.ld/2, z + L.th, c), q1 = proj(cx0 - L.lw/2 + ix * L.lw/8, L.ld/2, z + L.th, c);
          g.beginPath(); g.moveTo(q0.x, q0.y); g.lineTo(q1.x, q1.y); g.stroke();
        }
        g.restore();
      }
      anchors.push({ L, x: Math.max(cs[5].x, cs[6].x), y: (cs[5].y + cs[6].y) / 2 });
    });

    // leader lines + drafting labels
    if (k > 0.45) {
      const lx = w - 320; let ly = h * 0.2;
      g.save(); g.globalAlpha = clamp((k - 0.45) * 2.4, 0, 1);
      anchors.forEach(({ L, x, y }) => {
        ly = Math.max(ly, y - 10);
        g.strokeStyle = "rgba(66,86,106,.6)"; g.lineWidth = 1;
        g.beginPath(); g.moveTo(x + 6, y); g.lineTo(lx - 10, ly + 3); g.stroke();
        g.strokeStyle = L.col; g.beginPath(); g.arc(lx - 5, ly + 3, 3, 0, U.TAU); g.stroke();
        g.font = "700 12px 'et-book', Palatino, Georgia, 'Songti SC', 'Noto Serif CJK SC', 'SimSun', serif"; g.fillStyle = "#051c2c";
        g.fillText(T(L.name), lx, ly);
        g.font = "9.5px Menlo, Consolas, 'PingFang SC', 'Microsoft YaHei', 'Noto Sans CJK SC', monospace"; g.fillStyle = "#42566a";
        g.fillText(`L${L.lw}×W${L.ld}×H${L.th}${T(" · SCALE NTS")}`, lx, ly + 14);
        ly += 56;
      });
      g.restore();
    }

    // left wash keeps the text column readable
    const wash = g.createLinearGradient(0, 0, w * 0.58, 0);
    wash.addColorStop(0, "rgba(255,255,255,1)");
    wash.addColorStop(0.85, "rgba(255,255,255,.9)");
    wash.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = wash;
    g.fillRect(0, 0, w * 0.58, h);

    // signature strip
    g.font = "10.5px Menlo, Consolas, 'PingFang SC', 'Microsoft YaHei', 'Noto Sans CJK SC', monospace"; g.fillStyle = "rgba(66,86,106,.95)"; g.textAlign = "right";
    g.fillText(`${T("FIG. 2 · BLUEPRINT · 4 COLUMNS · SCALE NTS · ")}${T(k > 0.5 ? "EXPLODED — CLICK TO ASSEMBLE" : "ASSEMBLED — CLICK TO EXPLODE")}`, w - 40, h - 44);
    g.strokeStyle = "rgba(5,28,44,.4)"; g.strokeRect(w - 356, h - 64, 316, 30);
    g.textAlign = "left";
    if (!REDUCE) raf = requestAnimationFrame(draw);
  }

  const B = U.bindCanvas(cv);
  cv.addEventListener("click", e => {
    if (e.target.closest("button, a, .chip, .cover-mode")) return;
    target = target > 0.5 ? 0 : 1;
  });
  addEventListener("resize", () => { if (cv.style.display !== "none") draw(last || 0); });
  window.COVER_W = {
    setActive(on) {
      cancelAnimationFrame(raf);
      if (on) { B.fit(); last = 0; k = target = 1;
        if (REDUCE) requestAnimationFrame(() => { B.fit(); draw(0); });
        else raf = requestAnimationFrame(draw); }
    }
  };

  // ── 4-way switcher (owns all covers) ──
  const cvs = { rec: document.getElementById("cover-canvas"), x: document.getElementById("cover-canvas-x"),
                w: document.getElementById("cover-canvas-w"), d: document.getElementById("cover-canvas-x") };
  const pills = [...document.querySelectorAll("#cover-mode button")];
  function setMode(m) {
    pills.forEach(b => b.classList.toggle("on", b.dataset.mode === m));
    [cvs.rec, cvs.w].forEach(el => el.style.display = "none");
    cvs.x.style.display = "none";
    cvs[m].style.display = "";
    COVER_A.setActive(m === "rec");
    COVER_X.setActive(m === "x" || m === "d", { intro: m === "d" });
    COVER_W.setActive(m === "w");
    try { localStorage.setItem("cover-mode", m); } catch (_) {}
    history.replaceState(null, "", "#cover-" + m);
  }
  pills.forEach(b => b.addEventListener("click", () => setMode(b.dataset.mode)));
  const init = (location.hash.match(/cover-(rec|x|w|d)/) || [])[1]
    || (() => { try { return localStorage.getItem("cover-mode"); } catch (_) { return null; } })() || "rec";
  setMode(["rec","x","w","d"].includes(init) ? init : "rec");
})();
