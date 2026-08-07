// §2 · P3 wall-chart timeline — 16 milestones, Nov 2023 → Jul 2026.
// Era bands + double-line axis + greedily layered plaques; stems in stemLayer, plaques last.
(() => {
  const host = document.getElementById("timeline-chart");
  if (!host) return;
  const body = U.frame(host, {
    title: T("Thirty-two months of rewiring, event by event"),
    sub: T("RED FRAME = CRISIS · BLUE FRAME = CURRENT WINDOW · BLUE BAND = POLICY REWIRING ERA · CLICK A PLAQUE"),
    src: T("Anchors K7–K9, K12–K15, K21 · each plaque drills to its dated source"),
  });
  const W = 924, H = 430, ml = 30, mr = 30, axisY = H - 54;
  const svg = d3.select(body).append("svg")
    .attr("viewBox", `0 0 ${W} ${H}`).attr("width", "100%").attr("height", H);
  const REDUCE = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const evs = RPT.timeline.map(d => ({ ...d, date: new Date(d.d) }));
  const x = d3.scaleTime()
    .domain([new Date("2023-10-15"), new Date("2026-08-15")])
    .range([ml, W - mr]);

  // era bands
  const eras = [
    { a: "2023-11-01", b: "2025-01-01", name: "RED SEA CRISIS ERA", col: "rgba(194,47,78,.05)", tc: "#c22f4e" },
    { a: "2025-01-01", b: "2026-08-15", name: "POLICY REWIRING ERA", col: "rgba(34,81,255,.06)", tc: "#2251ff" },
  ];
  eras.forEach(e => {
    svg.append("rect").attr("x", x(new Date(e.a))).attr("width", x(new Date(e.b)) - x(new Date(e.a)))
      .attr("y", 20).attr("height", axisY - 30).attr("fill", e.col);
    svg.append("text").attr("x", (x(new Date(e.a)) + x(new Date(e.b))) / 2).attr("y", 34)
      .attr("text-anchor", "middle").attr("font-family", "Menlo, Consolas, 'PingFang SC', 'Microsoft YaHei', 'Noto Sans CJK SC', monospace")
      .attr("font-size", 9).attr("letter-spacing", ".12em").attr("fill", e.tc)
      .text(T(e.name));
  });

  // double-line axis + year ticks
  const axisG = svg.append("g");
  [axisY, axisY + 5].forEach(yy => {
    axisG.append("line").attr("x1", ml).attr("x2", W - mr).attr("y1", yy).attr("y2", yy)
      .attr("stroke", "#051c2c").attr("stroke-width", yy === axisY ? 1.4 : 0.7);
  });
  ["2023", "2024", "2025", "2026"].forEach(y => {
    const xx = x(new Date(y + "-01-01"));
    axisG.append("line").attr("x1", xx).attr("x2", xx).attr("y1", axisY - 5).attr("y2", axisY + 10)
      .attr("stroke", "#051c2c").attr("stroke-width", 1);
    axisG.append("text").attr("x", xx + 4).attr("y", axisY + 24)
      .attr("font-family", "Menlo, Consolas, 'PingFang SC', 'Microsoft YaHei', 'Noto Sans CJK SC', monospace").attr("font-size", 11).attr("fill", "#051c2c")
      .text(y);
  });

  // greedy plaque layering (with edge clamping)
  const plaqueW = t => { let w = 0; for (const ch of t) w += ch.charCodeAt(0) > 0x2E7F ? 11.5 : 6.35; return w + 30; };
  const layers = [];
  const placed = evs.map(e => {
    const cxRaw = x(e.date), w = plaqueW(e.t);
    const cx = Math.max(8 + w / 2, Math.min(cxRaw, W - 8 - w / 2));   // clamp inside canvas
    let li = 0;
    while (layers[li] != null && layers[li] > cx - w / 2 - 10) li++;
    layers[li] = cx + w / 2 + 10;
    return { e, cx, cxRaw, w, li };
  });
  const maxLayer = Math.max(...placed.map(p => p.li));
  const layerH = Math.min(46, (axisY - 60) / (maxLayer + 1));

  const stemLayer = svg.append("g"), plaqueLayer = svg.append("g");
  const plaques = [];
  placed.forEach(({ e, cx, cxRaw, w, li }, idx) => {
    const py = axisY - 24 - (li + 1) * layerH;
    const crash = e.sev === "crash", cur = e.y === "2026";
    const st = stemLayer.append("g").attr("opacity", 0);
    // stem: from plaque bottom edge down to the true date on the axis
    st.append("line").attr("x1", cx).attr("x2", cxRaw).attr("y1", py + 22).attr("y2", axisY - 4)
      .attr("stroke", crash ? "#c22f4e" : "#8595a6").attr("stroke-width", 0.8);
    st.append("circle").attr("cx", cxRaw).attr("cy", axisY - 4).attr("r", 2.4)
      .attr("fill", crash ? "#c22f4e" : "#051c2c");
    const gp = plaqueLayer.append("g").attr("opacity", 0).attr("cursor", "pointer").attr("data-drill-keep", "");
    gp.append("rect")
      .attr("x", cx - w / 2).attr("y", py).attr("width", w).attr("height", 22)
      .attr("fill", "#ffffff")
      .attr("stroke", crash ? "#c22f4e" : cur ? "#2251ff" : "#051c2c")
      .attr("stroke-width", cur ? 1.6 : 1)
      .attr("stroke-dasharray", cur && !crash ? "4 3" : "none");
    gp.append("text").attr("x", cx - w / 2 + 6).attr("y", py + 15)
      .attr("font-family", "Menlo, Consolas, 'PingFang SC', 'Microsoft YaHei', 'Noto Sans CJK SC', monospace").attr("font-size", 9).attr("fill", "#8595a6")
      .text(e.d.slice(2, 7).replace("-", "/"));
    gp.append("text").attr("x", cx - w / 2 + 32).attr("y", py + 15)
      .attr("font-family", "'et-book', Palatino, Georgia, 'Songti SC', 'Noto Serif CJK SC', 'SimSun', serif").attr("font-weight", 700)
      .attr("font-size", 11).attr("fill", crash ? "#c22f4e" : "#051c2c")
      .text(e.t);
    gp.on("click", ev => {
      const src = (window.SRCS || []).find(s => s.id === e.k);
      U.showDrill({
        title: e.t, value: e.d,
        sub: e.note, source: src ? `${src.id} · ${src.cite}, ${src.date}` : e.k,
        x: ev.clientX, y: ev.clientY,
      });
    });
    plaques.push({ st, g: gp });
  });

  function play() {
    plaques.forEach((p, i) => {
      if (REDUCE) { p.st.attr("opacity", 1); p.g.attr("opacity", 1); return; }
      p.st.transition().delay(i * 90).duration(350).attr("opacity", 1);
      p.g.transition().delay(i * 90 + 120).duration(350).attr("opacity", 1);
    });
    setTimeout(() => plaques.forEach(p => { p.st.interrupt().attr("opacity", 1); p.g.interrupt().attr("opacity", 1); }),
      plaques.length * 110 + 1200);
  }
  const io = new IntersectionObserver(en => { if (en[0].isIntersecting) { io.disconnect(); play(); } }, { threshold: 0.2 });
  io.observe(svg.node());
})();
