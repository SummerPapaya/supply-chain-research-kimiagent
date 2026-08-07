// DOM-rendered signature charts: P5 hot-topics matrix · trend radar table ·
// P13 adoption gate ladder · P9 nearshoring pictograms · P7 scenario odds board.
// Each block is an independent IIFE — one failure cannot affect the others.

// ── §4 · P5 hot topics matrix heat table ──
(() => {
  const host = document.getElementById("hot-chart");
  if (!host) return;
  const body = U.frame(host, {
    title: T("Five debates, one heat scale"),
    sub: T("HEAT 1–5 = SALIENCE × CONSEQUENCE · ★ = RUNNING HOTTEST · CLICK ANY ROW FOR THE FULL BRIEF"),
    src: T("K7–K11, K14 · dated anchors per topic"),
  });
  const dots = n => Array.from({ length: 5 }, (_, i) =>
    `<span style="display:inline-block;width:9px;height:9px;border-radius:50%;margin-right:3px;background:${i < n ? "#2251ff" : "#dbe2ea"}"></span>`).join("");
  const tbl = document.createElement("table");
  tbl.className = "dt";
  tbl.innerHTML = `<thead><tr>
    <th style="width:26%">${T("TOPIC")}</th><th style="width:9%">${T("HEAT")}</th>
    <th style="width:24%">${T("HAPPENING NOW")}</th><th style="width:21%">${T("COST & NETWORK EFFECT")}</th><th style="width:20%">${T("WHAT TO WATCH")}</th></tr></thead>`;
  const tb = document.createElement("tbody");
  RPT.hot_topics.forEach(t => {
    const tr = document.createElement("tr");
    tr.style.cursor = "pointer"; tr.setAttribute("data-drill-keep", "");
    if (t.heat >= 5) tr.className = "hl";
    tr.innerHTML = `
      <td><b>${t.t}</b>${t.heat >= 5 ? ' <span style="color:#2251ff">★</span>' : ""}</td>
      <td>${dots(t.heat)}</td>
      <td>${t.happening}</td>
      <td>${t.cost}<br><span style="color:#42566a">${t.network}</span></td>
      <td>${t.watch}</td>`;
    tr.onclick = e => {
      const src = (window.SRCS || []).find(s => s.id === t.k);
      U.showDrill({
        title: t.t, value: "●".repeat(t.heat) + "○".repeat(5 - t.heat),
        sub: `${t.happening}${T(" · Tech angle: ")}${t.tech}`,
        source: src ? `${src.id} · ${src.cite}, ${src.date}` : t.k,
        x: e.clientX, y: e.clientY,
      });
    };
    tb.appendChild(tr);
  });
  tbl.appendChild(tb); body.appendChild(tbl);
  const leg = document.createElement("p");
  leg.className = "chart-src";
  leg.textContent = T("★ = the two debates running hottest at mid-2026 · heat is a research judgment (K19)");
  body.appendChild(leg);
})();

// ── §5 · Gartner 2026 technology radar (three themes) ──
(() => {
  const host = document.getElementById("trend-chart");
  if (!host) return;
  const body = U.frame(host, {
    title: T("Gartner's 2026 radar, clustered into three budget themes"),
    sub: T("EIGHT NAMED TECHNOLOGIES · THEME ORDER = WHERE 2026 BUDGETS ARE MOVING · CLICK A THEME"),
    src: T("Gartner Supply Chain Technology Trends 2026 (K10), May 2026"),
  });
  const wrap = document.createElement("div");
  wrap.className = "term-mag";
  RPT.trends.forEach((th, i) => {
    const el = document.createElement("article");
    el.className = "term"; el.tabIndex = 0; el.setAttribute("data-drill-keep", "");
    el.innerHTML = `
      <h3 class="t-abbr">${["01", "02", "03"][i]}</h3>
      <p class="t-full">${th.theme}</p>
      <p class="t-gist">${th.items[0].split("—")[0].trim()}…</p>
      <div class="t-more">${th.items.map(x => `<p>· ${x}</p>`).join("")}</div>
      <p class="t-hint">${T("Hover for the full cluster")}</p>`;
    el.onclick = e => U.showDrill({
      title: th.theme, value: th.items.length + T(" technologies"),
      sub: th.items.join(" · "),
      source: T("K10 · Gartner Supply Chain Technology Trends 2026, 2026-05"),
      x: e.clientX, y: e.clientY,
    });
    wrap.appendChild(el);
  });
  body.appendChild(wrap);
})();

// ── §5 · P13 adoption gate ladder ──
(() => {
  const host = document.getElementById("gate-chart");
  if (!host) return;
  const body = U.frame(host, {
    title: T("What actually gates AI adoption, ranked by rigidity"),
    sub: T("10-CELL SCORE = RIGIDITY · SOLID SQUARE = NO BYPASS · ↳ = WORKAROUND ROUTE · CLICK A GATE"),
    src: T("Research compilation from K10, K11 · rigidity scores are graded judgments"),
  });
  const gates = [
    { n: "DATA QUALITY & INTEGRATION", basis: "Agents act on data; bad masters = bad autonomous decisions", score: 9, bypass: null, hot: true },
    { n: "GOVERNANCE & LIABILITY", basis: "Who signs when an agent books the wrong freight? EU AI Act guidance pending", score: 8, bypass: "human-in-the-loop tiers for high-value decisions" },
    { n: "LEGACY SYSTEM DEBT", basis: "ERP/TMS from the 2010s resist agent hooks; middleware bridges exist", score: 7, bypass: "overlay platforms (o9, Kinaxis-style) above the legacy core" },
    { n: "TALENT & CHANGE", basis: "58% rank talent top challenge; planners become exception supervisors", score: 6, bypass: "cobot-style assistive rollouts before full autonomy" },
    { n: "SECURITY & IP", basis: "Multi-tier supplier data in shared models raises leakage risk", score: 5, bypass: "private model instances, federated learning" },
    { n: "BUDGET", basis: "Cheapest constraint: agentic tools increasingly SaaS-priced per workflow", score: 3, bypass: "freight-audit and planning pilots pay back <12 months" },
  ];
  if (CN) RPT_CN.gates.forEach((gc, i) => { gates[i].n = gc.n; gates[i].basis = gc.basis; gates[i].bypass = gc.bypass; });
  const list = document.createElement("div");
  gates.forEach((g0, i) => {
    const row = document.createElement("div");
    row.style.cssText = "display:grid;grid-template-columns:44px 26px 1fr 200px 1fr;gap:14px;align-items:center;padding:13px 0;border-bottom:1px solid #eef1f6;cursor:pointer";
    row.setAttribute("data-drill-keep", "");
    const cells = Array.from({ length: 10 }, (_, c) =>
      `<span style="display:inline-block;width:11px;height:11px;margin-right:3px;background:${c < g0.score ? (g0.hot ? "#c22f4e" : "#2251ff") : "#eef1f6"}"></span>`).join("");
    row.innerHTML = `
      <span style="font-family:Menlo, Consolas, 'PingFang SC', 'Microsoft YaHei', 'Noto Sans CJK SC', monospace;font-size:19px;color:#8595a6">${String(i + 1).padStart(2, "0")}</span>
      <span style="width:13px;height:13px;display:inline-block;${g0.bypass ? "border:1.4px solid #2251ff" : "background:#051c2c"}"></span>
      <span><b style="font-family:'et-book', Palatino, Georgia, 'Songti SC', 'Noto Serif CJK SC', 'SimSun', serif;font-size:14px">${g0.n}</b><br>
        <span style="font-size:12.5px;color:#42566a">${g0.basis}</span></span>
      <span style="font-family:Menlo, Consolas, 'PingFang SC', 'Microsoft YaHei', 'Noto Sans CJK SC', monospace;font-size:9px">${cells}<b style="margin-left:4px">${g0.score}</b></span>
      <span style="font-size:12px;${g0.bypass ? "color:#1233b8" : "color:#c22f4e;border:1px solid #c22f4e;padding:2px 8px;font-family:Menlo, Consolas, 'PingFang SC', 'Microsoft YaHei', 'Noto Sans CJK SC', monospace;font-size:9.5px;letter-spacing:.08em;justify-self:start"}">
        ${g0.bypass ? "↳ " + g0.bypass : T("NO BYPASS")}</span>`;
    row.onclick = e => U.showDrill({
      title: g0.n, value: T("rigidity ") + g0.score + "/10",
      sub: g0.basis + (g0.bypass ? T(" · Bypass: ") + g0.bypass : T(" · No known bypass — this gate binds hardest.")),
      source: T("K10/K11 compilation · graded research judgment (K19)"),
      x: e.clientX, y: e.clientY,
    });
    list.appendChild(row);
  });
  body.appendChild(list);
})();

// ── §5 · P9 nearshoring small-multiples pictograms ──
(() => {
  const host = document.getElementById("near-chart");
  if (!host) return;
  const body = U.frame(host, {
    title: T("The reshoring arithmetic, four ways"),
    sub: T("FOUR PANELS, FOUR BASES OF THE SAME SHIFT · THE BOLDED NOTE IS THE COUNTERINTUITIVE ONE · CLICK A PANEL"),
    src: T("K6, K11, K14 · official statistics compiled June–July 2026"),
  });
  const grid = document.createElement("div");
  grid.style.cssText = "display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:1px;background:#dbe2ea;border:1px solid #dbe2ea";
  const DRILLS = [
    { title: T("New supply bases"), value: "+73%", sub: T("Egypt textile & apparel exports y/y H1 2026 · Vietnam +22% · Mexico nearshoring FDI +31% · India electronics +18%"), source: T("K14 · national trade statistics, 2026-06") },
    { title: T("Robot density"), value: "700K+", sub: T("Annual industrial-robot installations 2026E; 542K installed 2024 — record fleet as reshoring meets labor scarcity"), source: T("K6 · IFR World Robotics, 2026-03") },
    { title: T("US warehouse gap"), value: "370K", sub: T("Unfilled US warehousing & storage openings; 58% rank hiring/retention the top challenge"), source: T("K11 · MHI Annual Industry Report 2026, 2026-03") },
    { title: T("AI at work"), value: "41%", sub: T("Supply-chain staff using AI daily, up from ~20% in 2024; agentic AI named Gartner's #1 2026 trend"), source: T("K10/K11 · Gartner & MHI 2026") },
  ];
  RPT.nearshore.forEach((p, i) => {
    const el = document.createElement("div");
    el.style.cssText = "background:#fff;padding:20px 18px;cursor:pointer";
    el.setAttribute("data-drill-keep", "");
    const bold = i === 1;
    el.innerHTML = `
      <div style="font-family:Menlo, Consolas, 'PingFang SC', 'Microsoft YaHei', 'Noto Sans CJK SC', monospace;font-size:9px;letter-spacing:.14em;color:#8595a6">${p.panel}</div>
      <div style="font-family:'et-book', Palatino, Georgia, 'Songti SC', 'Noto Serif CJK SC', 'SimSun', serif;font-weight:700;font-size:34px;color:#2251ff;margin:6px 0 2px">${p.big}</div>
      <div style="font-size:13px;line-height:1.4">${p.lab}</div>
      <div style="font-size:11.5px;color:#42566a;margin-top:8px;${bold ? "font-weight:700;color:#1233b8" : ""}">${p.sub}</div>`;
    el.onclick = e => U.showDrill({ ...DRILLS[i], x: e.clientX, y: e.clientY });
    grid.appendChild(el);
  });
  body.appendChild(grid);
  const strip = document.createElement("p");
  strip.style.cssText = "margin-top:12px;font-size:14px;border-top:1.5px solid #051c2c;padding-top:10px";
  strip.innerHTML = T(`The paradox beneficiary: <b>automation vendors</b> — reshoring was sold as a jobs story, but at 370K unfilled openings it is robots, at record installations, that staff the reshored factories.`);
  body.appendChild(strip);
})();

// ── §5 · P7 scenario odds board ──
(() => {
  const host = document.getElementById("odds-chart");
  if (!host) return;
  const body = U.frame(host, {
    title: T("H2 2026: four scenarios, graded odds"),
    sub: T("RANGES = SUBJECTIVE PROBABILITY BANDS (LOW–HIGH), NOT MARKET-IMPLIED · ★ = BASE CASE · CLICK A PATH"),
    src: T("Research judgment (K19) on evidence from K4, K7, K8, K16"),
  });
  const wrap = document.createElement("div");
  const X0 = 240, X1 = 860;
  RPT.odds.forEach((o, i) => {
    const row = document.createElement("div");
    row.style.cssText = `display:grid;grid-template-columns:220px 1fr;gap:18px;padding:16px 0;border-bottom:1px solid #eef1f6;cursor:pointer;${i === 0 ? "background:rgba(34,81,255,.05);padding-left:10px" : ""}`;
    row.setAttribute("data-drill-keep", "");
    const spanW = X1 - X0;
    const l = o.lo / 100 * spanW, w = (o.hi - o.lo) / 100 * spanW;
    row.innerHTML = `
      <div>
        <div style="font-family:'et-book', Palatino, Georgia, 'Songti SC', 'Noto Serif CJK SC', 'SimSun', serif;font-weight:700;font-size:15px">${o.name}${i === 0 ? ' <span style="font-family:Menlo,Consolas,monospace;font-size:8.5px;background:#2251ff;color:#fff;padding:2px 7px;letter-spacing:.1em">' + T("BASE") + '</span>' : ""}</div>
        <div style="font-size:12px;color:#42566a;margin-top:3px">${o.bound}</div>
      </div>
      <div style="position:relative;height:52px">
        <svg viewBox="0 0 ${spanW} 52" width="100%" height="52" preserveAspectRatio="none" style="position:absolute;inset:0">
          ${[25, 50, 75].map(v => `<line x1="${v / 100 * spanW}" x2="${v / 100 * spanW}" y1="8" y2="40" stroke="#eef1f6"/>`).join("")}
          <line x1="${l}" x2="${l + w}" y1="24" y2="24" stroke="#2251ff" stroke-width="2"/>
          <circle cx="${l}" cy="24" r="5" fill="#1233b8"/><circle cx="${l + w}" cy="24" r="5" fill="#2251ff"/>
        </svg>
        <span style="position:absolute;left:${o.lo}%;top:36px;font-family:Menlo, Consolas, 'PingFang SC', 'Microsoft YaHei', 'Noto Sans CJK SC', monospace;font-size:10px;color:#1233b8;transform:translateX(-50%)">${o.lo}%</span>
        <span style="position:absolute;left:${o.hi}%;top:36px;font-family:Menlo, Consolas, 'PingFang SC', 'Microsoft YaHei', 'Noto Sans CJK SC', monospace;font-size:10px;color:#2251ff;transform:translateX(-50%)">${o.hi}%</span>
      </div>`;
    row.onclick = e => U.showDrill({
      title: o.name, value: o.lo + "–" + o.hi + "%",
      sub: T("Evidence: ") + o.ev + T(" · Boundary: ") + o.bound,
      source: T("K19 · subjective research judgment, 2026-07-19"),
      x: e.clientX, y: e.clientY,
    });
    wrap.appendChild(row);
  });
  body.appendChild(wrap);
  const foot = document.createElement("p");
  foot.className = "chart-src";
  foot.textContent = T("Kill-switch: any single scenario can be invalidated by the falsification strip in §6 — probabilities re-grade on tariff reviews, Suez resumption pace, and WCI breaks.");
  body.appendChild(foot);
})();
