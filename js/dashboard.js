// Persistent right-rail dashboard (P14) — "where are you in the cycle" context.
// Window badge + phase bar + dot-matrix globe with chokepoint nodes + S&P YTD
// halftone curve + 4 stat blocks + 12-entity cohort cells + live-refresh status.
(() => {
  const cv = document.getElementById("dash-canvas");
  if (!cv) return;
  const B = U.bindCanvas(cv);
  const REDUCE = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const MONO = "Menlo, Consolas, 'PingFang SC', 'Microsoft YaHei', 'Noto Sans CJK SC', monospace", SERIF = "'et-book', Palatino, Georgia, 'Songti SC', 'Noto Serif CJK SC', 'SimSun', serif";
  let cur = "frame", t = 0, last = 0, raf = 0, land = null;

  const WINS = {
    frame:    { title: "THE REWIRED NETWORK", sub: "sector deep dive · 2026-07-17", stats: [["WCI", "$3,549"], ["SCM SW", "$39.2B"], ["TRADE 26F", "+1.9%"], ["SUEZ", "−60%"]] },
    overview: { title: "§1 INDUSTRY OVERVIEW", sub: "layers & league table", stats: [["LOGISTICS", "$11.97T"], ["3PL", "$1.8T"], ["SCM SW", "$39.2B"], ["CAGR", "+10.7%"]] },
    dynamics: { title: "§2 INDUSTRY DYNAMICS", sub: "32 months of rewiring", stats: [["EVENTS", "16"], ["ERAS", "2"], ["TARIFF", "15%"], ["CSRD", "−80%"]] },
    markets:  { title: "§3 MARKET PERFORMANCE", sub: "panel vs S&P 500", stats: [["LEADER", "XPO +47%"], ["LAGGARD", "GXO −2%"], ["S&P 500", "+9.7%"], ["PANEL", "10 UP / 2 DN"]] },
    topics:   { title: "§4 HOT TOPICS", sub: "five debates graded", stats: [["HOTTEST", "TARIFFS"], ["ALSO HOT", "AGENTIC AI"], ["PRICED IN", "RED SEA"], ["SLOW BURN", "CARBON"]] },
    trends:   { title: "§5 KEY TRENDS", sub: "tech, gates, scenarios", stats: [["AI DAILY", "41%"], ["CSCO PILOTS", "51%"], ["OPENINGS", "370K"], ["ROBOTS", "700K+"]] },
    verdict:  { title: "§6 VERDICT", sub: "resilience-first baseline", stats: [["WEIGHTS L", "3"], ["WEIGHTS R", "5"], ["TRIGGERS", "3"], ["FALSIFY", "3"]] },
  };

  fetch("vendor/world-land-110m.json").then(r => r.json()).then(tp => {
    land = topojson.feature(tp, tp.objects.land);
    if (REDUCE) draw(0);   // single-shot mode: redraw once land arrives
  }).catch(() => {});

  function globe(g, cx, cy, R) {
    if (!land) return;
    const proj = d3.geoEquirectangular().translate([cx, cy]).scale(R / 1.62);
    const pts = [];
    g.fillStyle = "rgba(66,86,106,.4)";
    for (let lat = -60; lat <= 75; lat += 3) for (let lon = -180; lon <= 180; lon += 3) {
      if (!d3.geoContains(land, [lon, lat])) continue;
      const p = proj([lon, lat]);
      if (p) pts.push(p);
    }
    pts.forEach(p => g.fillRect(p[0], p[1], 1.5, 1.5));
    const labels = [];
    RPT.globe_nodes.forEach(n => {
      const p = proj([n.lon, n.lat]);
      if (!p) return;
      const pulse = n.hot && !REDUCE ? (Math.sin(t * 3 + n.lon) * 0.5 + 0.5) : 0.5;
      g.fillStyle = n.hot ? `rgba(194,47,78,${0.55 + pulse * 0.45})` : "rgba(34,81,255,.85)";
      g.beginPath(); g.arc(p[0], p[1], n.hot ? 3 + pulse * 2 : 2.6, 0, U.TAU); g.fill();
      if (n.hot && !REDUCE) {
        g.strokeStyle = `rgba(194,47,78,${0.5 - pulse * 0.4})`; g.lineWidth = 1;
        g.beginPath(); g.arc(p[0], p[1], 5 + pulse * 7, 0, U.TAU); g.stroke();
      }
      labels.push({ name: n.name, x: p[0], y: p[1], hot: n.hot });
    });
    labels.sort((a, b) => a.y - b.y);
    for (let i = 1; i < labels.length; i++) if (labels[i].y - labels[i - 1].y < 11) labels[i].y = labels[i - 1].y + 11;
    g.font = `8px ${MONO}`;
    labels.forEach(l => {
      g.strokeStyle = "rgba(133,149,166,.6)"; g.lineWidth = 0.7;
      g.beginPath(); g.moveTo(l.x + 4, l.y - 2); g.lineTo(l.x + 12, l.y); g.stroke();
      g.fillStyle = l.hot ? "#c22f4e" : "#42566a";
      g.fillText(l.name, l.x + 14, l.y + 3);
    });
  }

  function draw(now) {
    const dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016); last = now; t += dt;
    const { w, h } = B.fit();
    const g = B.ctx;
    g.clearRect(0, 0, w, h);
    const W = w; let y = 26;
    const WN = WINS[cur] || WINS.frame;

    g.fillStyle = "#2251ff"; g.fillRect(24, y, 8, 8);
    g.font = `9px ${MONO}`; g.fillStyle = "#8595a6";
    g.fillText(T("CYCLE DASHBOARD"), 40, y + 7);
    y += 22;
    g.font = `700 17px ${SERIF}`; g.fillStyle = "#051c2c";
    g.fillText(T(WN.title), 24, y + 6); y += 18;
    g.font = `9.5px ${MONO}`; g.fillStyle = "#42566a";
    g.fillText(T(WN.sub).toUpperCase(), 24, y + 4); y += 20;

    const ph = RPT.phase, pw = (W - 48) / ph.names.length;
    ph.names.forEach((n, i) => {
      const on = i === ph.cur - 1;
      g.fillStyle = on ? "#2251ff" : i < ph.cur - 1 ? "#7d9bff" : "#eef1f6";
      g.fillRect(24 + i * pw + 1, y, pw - 2, 7);
      if (on && !REDUCE && Math.sin(t * 2.4) > 0) { g.fillStyle = "rgba(34,81,255,.3)"; g.fillRect(24 + i * pw + 1, y - 2, pw - 2, 11); }
    });
    y += 13;
    g.font = `8px ${MONO}`; g.fillStyle = "#2251ff";
    g.fillText(T("NOW: ") + ph.curName.toUpperCase(), 24, y + 6); y += 18;

    globe(g, W / 2, y + 88, 118); y += 186;

    // S&P 500 YTD halftone curve
    const series = RPT.ytd_weekly.GSPC;
    const n = 72, pts = [];
    for (let i = 0; i < n; i++) {
      const f = i / (n - 1) * (series.length - 1), i0 = Math.floor(f), f1 = f - i0;
      const v = series[i0][1] * (1 - f1) + (series[Math.min(i0 + 1, series.length - 1)][1]) * f1;
      pts.push(v);
    }
    const lo = Math.min(...pts), hi = Math.max(...pts), ch = 66, cy0 = y + 28;
    g.fillStyle = "rgba(34,81,255,.5)";
    pts.forEach((v, i) => {
      const px = 24 + i * (W - 48) / (n - 1);
      const py = cy0 + (hi - v) / (hi - lo) * ch;
      const r = 0.8 + (v - lo) / (hi - lo) * 2.2;
      g.beginPath(); g.arc(px, py, r, 0, U.TAU); g.fill();
    });
    const lastY = cy0 + (hi - pts[n - 1]) / (hi - lo) * ch;
    g.fillStyle = "#2251ff"; g.beginPath(); g.arc(24 + (W - 48) - 2, lastY, 3, 0, U.TAU); g.fill();
    g.font = `700 15px ${SERIF}`; g.lineWidth = 5; g.strokeStyle = "rgba(255,255,255,.92)";
    const sp = RPT.market_snap.find(d => d.key === "GSPC");
    const lab = `S&P 500  +${sp.ytd}% ${T("YTD")}`;
    g.strokeText(lab, 26, cy0 - 8); g.fillStyle = "#051c2c"; g.fillText(lab, 26, cy0 - 8);
    g.font = `8px ${MONO}`; g.fillStyle = "#8595a6";
    g.fillText(T("WEEKLY · JAN → JUL 2026"), 26, cy0 + ch + 14);
    y = cy0 + ch + 26;

    const sw = (W - 48) / 2;
    WN.stats.forEach(([k2, v], i) => {
      const sx = 24 + (i % 2) * sw, sy = y + Math.floor(i / 2) * 44;
      g.font = `8.5px ${MONO}`; g.fillStyle = "#8595a6"; g.fillText(T(k2), sx, sy);
      g.font = `700 15px ${SERIF}`; g.fillStyle = "#051c2c"; g.fillText(T(v), sx, sy + 19);
    });
    y += 96;

    g.font = `8.5px ${MONO}`; g.fillStyle = "#8595a6"; g.fillText(T("PANEL COHORT · YTD"), 24, y); y += 8;
    const cw = (W - 48) / 4;
    RPT.market_snap.forEach((d, i) => {
      const sx = 24 + (i % 4) * cw, sy = y + Math.floor(i / 4) * 30;
      g.fillStyle = d.ytd >= 0 ? "rgba(34,81,255,.08)" : "rgba(194,47,78,.08)";
      g.fillRect(sx + 1, sy, cw - 2, 26);
      g.font = `8px ${MONO}`; g.fillStyle = "#42566a"; g.fillText(d.short.toUpperCase().slice(0, 14), sx + 5, sy + 11);
      g.font = `700 10px ${MONO}`; g.fillStyle = d.ytd >= 0 ? "#2251ff" : "#c22f4e";
      g.fillText((d.ytd >= 0 ? "+" : "") + d.ytd + "%", sx + 5, sy + 22);
    });
    y += 3 * 30 + 14;

    g.font = `8.5px ${MONO}`;
    const LS = (window.LIVE && LIVE.state) || { mode: "snapshot" };
    const qLabel = { live: "LIVE", cache: "CACHE", failed: "SNAPSHOT", snapshot: "SNAPSHOT" }[LS.mode] || "SNAPSHOT";
    g.fillStyle = LS.mode === "live" ? "#008a6d" : (LS.mode === "cache" ? "#b07a10" : "#8595a6");
    g.fillText(T("QUOTES: ") + T(qLabel), 24, y + 4);

    if (!REDUCE) raf = requestAnimationFrame(draw);
  }

  function setWin(win) { if (WINS[win] && win !== cur) { cur = win; if (REDUCE) draw(0); } }
  document.querySelectorAll("[data-win]").forEach(sec => {
    new IntersectionObserver(en => { if (en[0].isIntersecting) setWin(sec.dataset.win); },
      { rootMargin: "-40% 0px -50% 0px" }).observe(sec);
  });

  // Theme contract: the rail is hidden on the cover and slides in (.on) once
  // the reader enters the chapters; hidden again when the cover is in view.
  const rail = document.getElementById("dash-rail");
  const coverEl = document.getElementById("cover");
  const syncRail = () => {
    const threshold = coverEl ? coverEl.offsetHeight * 0.55 : innerHeight * 0.55;
    rail.classList.toggle("on", window.scrollY > threshold);
  };
  addEventListener("scroll", syncRail, { passive: true });
  addEventListener("resize", syncRail);
  syncRail();
  if (REDUCE) { draw(0); addEventListener("resize", () => draw(0)); }
  else { raf = requestAnimationFrame(draw); }
})();
