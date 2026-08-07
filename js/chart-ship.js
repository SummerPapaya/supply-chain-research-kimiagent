// §0 signature · P17 evidence object — the report's eight hardest numbers hung on the
// semantic sites of a container ship (draft marks=rates, bridge=AI, wake=missing transits…).
(() => {
  const host = document.getElementById("ship-chart");
  if (!host) return;
  const body = U.frame(host, {
    title: T("The state of the network, measured where it is measured"),
    sub: T("SIDE ELEVATION · 1 DECK BOX = $1T OF ANNUAL LOGISTICS · CLICK ANY SITE FOR BASIS & SOURCE"),
    src: T("Anchors K1–K21 · dated sources in the register below"),
  });
  const cv = document.createElement("canvas");
  cv.style.width = "100%"; cv.style.height = "430px"; cv.style.display = "block";
  body.appendChild(cv);
  const B = U.bindCanvas(cv);
  const REDUCE = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const W = 880, H = 430;
  const clamp = U.clamp;

  const SERIF = "'et-book', Palatino, Georgia, 'Songti SC', 'Noto Serif CJK SC', 'SimSun', serif", MONO = "Menlo, Consolas, 'PingFang SC', 'Microsoft YaHei', 'Noto Sans CJK SC', monospace";
  const hullY = 250;           // deck line
  const sites = [];
  function site(n, hx, hy, drawFn, hitW, hitH) {
    sites.push({ n, hx, hy, drawFn, hitW: hitW || 120, hitH: hitH || 46 });
  }
  function halo(g, txt, x, y, opt = {}) {
    g.font = `${opt.b ? "700 " : ""}${opt.s || 12}px ${opt.mono ? MONO : SERIF}`;
    g.textAlign = opt.al || "left";
    g.lineWidth = 4; g.strokeStyle = opt.haloCol || "rgba(255,255,255,.92)"; g.lineJoin = "round";
    g.strokeText(txt, x, y);
    g.fillStyle = opt.col || "#051c2c";
    g.fillText(txt, x, y);
    g.textAlign = "left";
  }

  function drawShip(g, prog) {
    g.clearRect(0, 0, W, H);
    // sea
    g.fillStyle = "rgba(34,81,255,.045)"; g.fillRect(0, hullY + 58, W, H - hullY - 58);
    g.strokeStyle = "rgba(34,81,255,.35)"; g.setLineDash([6, 5]); g.lineWidth = 1;
    g.beginPath(); g.moveTo(0, hullY + 58); g.lineTo(W, hullY + 58); g.stroke(); g.setLineDash([]);
    halo(g, T("SEA LINE"), 20, hullY + 80, { mono: 1, s: 9, col: "#8595a6" });

    const hx = 120, hw = 620, bow = 90;      // hull from x=120 to 740, bow to 830
    // hull topside (ink) above water, red bottom below
    g.beginPath();
    g.moveTo(hx, hullY); g.lineTo(hx + hw, hullY);
    g.lineTo(hx + hw + bow, hullY + 34); g.lineTo(hx + hw + bow - 22, hullY + 58);
    g.lineTo(hx + 10, hullY + 58); g.lineTo(hx, hullY + 30); g.closePath();
    g.fillStyle = "#12314a"; g.fill();
    // red boot below waterline
    g.beginPath();
    g.moveTo(hx + 10, hullY + 58); g.lineTo(hx + hw + bow - 22, hullY + 58);
    g.lineTo(hx + hw + bow - 60, hullY + 92); g.lineTo(hx + 40, hullY + 92); g.closePath();
    g.fillStyle = "#8e2438"; g.fill();

    // deck container stacks (1 box = $1T → 31 boxes)
    const stacks = [[180,4],[245,5],[310,3],[375,5],[440,4],[505,3],[570,4],[635,3]];
    let drawn = 0; const total = stacks.reduce((s, x) => s + x[1], 0);
    const bw = 46, bh = 15;
    const blues = ["#2251ff", "#1233b8", "#7d9bff", "#42566a"];
    stacks.forEach(([sx, n], si) => {
      for (let r = 0; r < n; r++) {
        const idx = drawn + r;
        if (idx / total > prog) continue;
        g.fillStyle = blues[(si + r) % 4];
        g.globalAlpha = 0.9;
        g.fillRect(sx, hullY - (r + 1) * (bh + 2), bw, bh);
        g.globalAlpha = 1;
        g.strokeStyle = "rgba(255,255,255,.5)"; g.lineWidth = 0.6;
        g.strokeRect(sx, hullY - (r + 1) * (bh + 2), bw, bh);
      }
      drawn += n;
    });
    // accommodation tower (stern, left)
    if (prog > 0.15) {
      g.fillStyle = "#eef1f6"; g.strokeStyle = "#051c2c"; g.lineWidth = 1.2;
      g.fillRect(hx + 18, hullY - 92, 56, 92); g.strokeRect(hx + 18, hullY - 92, 56, 92);
      for (let r = 0; r < 5; r++) {
        g.fillStyle = "#1233b8";
        g.fillRect(hx + 24, hullY - 84 + r * 16, 44, 5);
      }
      // funnel
      g.fillStyle = "#2251ff"; g.fillRect(hx + 30, hullY - 116, 30, 24);
      g.fillStyle = "#051c2c"; g.fillRect(hx + 30, hullY - 116, 30, 7);
    }
    // radar mast
    g.strokeStyle = "#051c2c"; g.lineWidth = 2;
    g.beginPath(); g.moveTo(hx + 46, hullY - 92); g.lineTo(hx + 46, hullY - 128); g.stroke();
  }

  function drawSites(g, prog) {
    const a = U.smooth(clamp((prog - 0.25) / 0.6, 0, 1));
    sites.forEach((s, i) => { if (a > i / sites.length) s.drawFn(g, clamp(a * sites.length - i, 0, 1)); });
    // ground line
    g.strokeStyle = "#051c2c"; g.lineWidth = 1.5;
    g.beginPath(); g.moveTo(60, hullY + 92); g.lineTo(850, hullY + 92); g.stroke();
  }

  // ── the eight sites ──
  // 1 bridge → AI adoption (compact stacked label left of the tower)
  site(1, 166, hullY - 150, (g, a) => {
    g.globalAlpha = a;
    g.strokeStyle = "#2251ff"; g.lineWidth = 1.2;
    g.beginPath(); g.moveTo(166, hullY - 128); g.lineTo(166, hullY - 148); g.stroke();
    g.fillStyle = "#2251ff"; g.beginPath(); g.arc(166, hullY - 128, 3, 0, U.TAU); g.fill();
    halo(g, "41%", 128, hullY - 156, { b: 1, s: 21, col: "#2251ff" });
    halo(g, T("USE AI DAILY"), 128, hullY - 141, { mono: 1, s: 9, col: "#42566a" });
    halo(g, "MHI 2026", 128, hullY - 129, { mono: 1, s: 8.5, col: "#8595a6" });
    g.globalAlpha = 1;
  }, 130, 50);
  // 2 draft marks → WCI (inside the dark topside band: ticks left, text right)
  site(2, 640, hullY + 34, (g, a) => {
    const HULL = "#12314a";
    g.globalAlpha = a;
    g.strokeStyle = "#ffffff"; g.lineWidth = 2;
    for (let i = 0; i < 5; i++) { g.beginPath(); g.moveTo(596 + i * 12, hullY + 14); g.lineTo(596 + i * 12, hullY + 50); g.stroke(); }
    halo(g, "$3,549", 662, hullY + 28, { b: 1, s: 19, col: "#ffffff", haloCol: HULL });
    halo(g, T("WCI PER 40FT · +3% W/W"), 662, hullY + 42, { mono: 1, s: 9, col: "#ffffff", haloCol: HULL });
    halo(g, "DREWRY 2026-06-11", 662, hullY + 53, { mono: 1, s: 8.5, col: "#7d9bff", haloCol: HULL });
    g.globalAlpha = 1;
  }, 300, 56);
  // 3 funnel → trade growth (smoke drifts right, clear of the 41% block)
  site(3, 210, hullY - 210, (g, a) => {
    g.globalAlpha = a;
    g.fillStyle = "rgba(125,155,255,.5)";
    for (let i = 0; i < 3; i++) { g.beginPath(); g.arc(168 + i * 13, hullY - 126 - i * 12, 3.6 + i * 2.2, 0, U.TAU); g.fill(); }
    halo(g, "+1.9%", 236, hullY - 172, { b: 1, s: 18, col: "#051c2c", al: "left" });
    halo(g, T("WTO WORLD TRADE 2026F"), 236, hullY - 158, { mono: 1, s: 9, col: "#42566a" });
    g.globalAlpha = 1;
  }, 190, 44);
  // 4 deck stacks → logistics body
  site(4, 470, hullY - 130, (g, a) => {
    g.globalAlpha = a;
    g.strokeStyle = "#051c2c"; g.lineWidth = 1;
    g.beginPath(); g.moveTo(470, hullY - 82); g.lineTo(470, hullY - 122); g.stroke();
    g.fillStyle = "#051c2c"; g.beginPath(); g.arc(470, hullY - 82, 2.5, 0, U.TAU); g.fill();
    halo(g, "$11.97T", 396, hullY - 130, { b: 1, s: 20 });
    halo(g, T("GLOBAL LOGISTICS BODY · 1 BOX = $1T"), 396, hullY - 114, { mono: 1, s: 9, col: "#42566a" });
    g.globalAlpha = 1;
  }, 190, 60);
  // 5 stern tag → tariff
  site(5, 92, hullY + 20, (g, a) => {
    g.globalAlpha = a;
    g.strokeStyle = "#051c2c"; g.lineWidth = 1;
    g.beginPath(); g.moveTo(120, hullY + 18); g.lineTo(88, hullY + 4); g.stroke();
    g.fillStyle = "#ffffff"; g.strokeStyle = "#051c2c";
    g.save(); g.translate(58, hullY - 12); g.rotate(-0.12);
    g.fillRect(0, 0, 92, 34); g.strokeRect(0, 0, 92, 34);
    g.fillStyle = "#c22f4e"; g.font = `700 15px ${SERIF}`; g.fillText("15%", 10, 16);
    g.fillStyle = "#42566a"; g.font = `8.5px ${MONO}`; g.fillText(T("EU–US TARIFF"), 10, 27);
    g.restore(); g.globalAlpha = 1;
  }, 110, 50);
  // 6 wake → Suez gap
  site(6, 70, hullY + 66, (g, a) => {
    g.globalAlpha = a;
    g.strokeStyle = "#c22f4e"; g.lineWidth = 1.4; g.setLineDash([4, 4]);
    g.beginPath(); g.moveTo(118, hullY + 66); g.lineTo(40, hullY + 66); g.stroke(); g.setLineDash([]);
    halo(g, T("−60% SUEZ TRANSITS — THE MISSING WAKE"), 26, hullY + 52, { mono: 1, s: 9.5, col: "#c22f4e" });
    g.globalAlpha = 1;
  }, 220, 40);
  // 7 hull marking → SCM market (painted on the hull, direct fill — no halo on dark paint)
  site(7, 400, hullY + 40, (g, a) => {
    g.globalAlpha = a;
    g.font = `700 20px ${SERIF}`; g.fillStyle = "rgba(255,255,255,.95)";
    g.fillText(T("SCM SOFTWARE $39.2B"), 300, hullY + 46);
    g.font = `9px ${MONO}`; g.fillStyle = "rgba(255,255,255,.75)";
    g.fillText(T("2026 · +10.7% CAGR TO $97.6B BY 2035"), 300, hullY + 60);
    g.globalAlpha = 1;
  }, 250, 40);
  // 8 CSRD plaque on bow (lifted above the deck line, clear of the WCI block)
  site(8, 800, hullY - 4, (g, a) => {
    g.globalAlpha = a;
    g.fillStyle = "#ffffff"; g.strokeStyle = "#051c2c"; g.lineWidth = 1.2;
    g.fillRect(782, hullY - 34, 88, 30); g.strokeRect(782, hullY - 34, 88, 30);
    g.fillStyle = "#051c2c"; g.font = `700 12px ${SERIF}`; g.fillText("−80%", 792, hullY - 20);
    g.fillStyle = "#42566a"; g.font = `8px ${MONO}`; g.fillText(T("CSRD SCOPE"), 830, hullY - 20);
    halo(g, "OMNIBUS (EU) 2026/470", 736, hullY - 44, { mono: 1, s: 8.5, col: "#42566a" });
    g.globalAlpha = 1;
  }, 130, 56);

  const DRILLS = {
    1: { title: T("AI at work"), value: "41%", sub: T("Supply-chain staff using AI daily — up from ~20% in 2024"), source: "K11 · MHI Annual Industry Report 2026, 2026-03" },
    2: { title: T("Drewry WCI composite"), value: "$3,549", delta: 3, sub: T("Per 40ft container; Shanghai→NY $5,870 (+7%)"), source: "K4 · Drewry WCI, 2026-06-11" },
    3: { title: T("World trade volume"), value: "+1.9%", sub: T("2026 forecast, downgraded on tariff shock"), source: "K3 · WTO, 2026-04" },
    4: { title: T("Global logistics market"), value: "$11.97T", sub: T("All modes, annual; 3PL segment ≈ $1.8T"), source: "K2 · industry consensus, 2026-01" },
    5: { title: T("EU–US tariff baseline"), value: "15%", sub: T("In force 2026-07-01; sectoral carve-outs under negotiation"), source: "K7 · EC/USTR framework, 2026-07-01" },
    6: { title: T("Suez transits"), value: "−60%", sub: T("Vs pre-crisis; Maersk MECL resumed 2026-03-20, most capacity still via the Cape"), source: "K8 · carrier advisories, 2026-06" },
    7: { title: T("SCM software market"), value: "$39.2B", sub: T("2026; $35.3B 2025 → $97.6B 2035E at +10.7% CAGR"), source: "K1 · market sizing consensus, 2026-03" },
    8: { title: T("CSRD scope reduction"), value: "−80%", sub: T("Omnibus Directive (EU) 2026/470; CSDDD deferred to 2029"), source: "K9 · EU Official Journal, 2026-02-24" },
  };

  cv.addEventListener("click", e => {
    const r = cv.getBoundingClientRect();
    const x = (e.clientX - r.left) * (W / r.width), y = (e.clientY - r.top) * (H / r.height);
    for (const s of sites) {
      if (Math.abs(x - s.hx) < s.hitW / 2 && Math.abs(y - s.hy) < s.hitH / 2) {
        const d = DRILLS[s.n];
        U.showDrill({ ...d, x: e.clientX, y: e.clientY });
        return;
      }
    }
  });

  function fullDraw(prog) {
    B.fit();
    const g = B.ctx;
    g.setTransform(cv.width / W, 0, 0, cv.height / H, 0, 0);
    drawShip(g, U.smooth(prog));
    drawSites(g, prog);
  }
  let raf = 0, t0 = null, done = false;
  function frame(ts) {
    if (t0 == null) t0 = ts;
    const prog = REDUCE ? 1 : clamp((ts - t0) / 1600, 0, 1);
    fullDraw(prog);
    if (prog < 1 && !REDUCE) raf = requestAnimationFrame(frame);
    else done = true;
  }
  const io = new IntersectionObserver(en => {
    if (en[0].isIntersecting && !done) {
      cancelAnimationFrame(raf); t0 = null;
      raf = requestAnimationFrame(frame);
      setTimeout(() => { if (!done) { done = true; cancelAnimationFrame(raf); fullDraw(1); } }, 3000);
      io.disconnect();
    }
  }, { threshold: 0.25 });
  io.observe(cv);
  addEventListener("resize", () => { if (done) fullDraw(1); });
})();
