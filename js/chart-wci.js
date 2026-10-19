// §3 · P11 paired bars + ratio labels — four WCI headhaul lanes, current vs prior week.
(() => {
  const host = document.getElementById("wci-chart");
  if (!host) return;
  const body = U.frame(host, {
    title: T("The weekly pulse: two oceans diverging"),
    sub: T("SOLID = CURRENT ASSESSMENT · OUTLINE = PRIOR WEEK [DERIVED FROM PUBLISHED W/W %] · USD PER 40FT FEU · CLICK A PAIR"),
    src: T("Drewry WCI 2026-10-15 (K25) · prior week derived (K20)"),
  });
  const W = 924, H = 330, ml = 190, mr = 90, mt = 26;
  const svg = d3.select(body).append("svg").attr("viewBox", `0 0 ${W} ${H}`).attr("width", "100%").attr("height", H);
  const REDUCE = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const lanes = RPT.wci.lanes;
  const maxV = d3.max(lanes, d => d.v) * 1.12;
  const x = d3.scaleLinear().domain([0, maxV]).range([ml, W - mr]);
  const rowH = (H - mt - 40) / lanes.length;

  [0, 2000, 4000, 6000].forEach(v => {
    svg.append("line").attr("x1", x(v)).attr("x2", x(v)).attr("y1", mt - 8).attr("y2", H - 40)
      .attr("stroke", "#eef1f6").attr("stroke-width", 1);
    svg.append("text").attr("x", x(v)).attr("y", H - 26).attr("text-anchor", "middle")
      .attr("font-family", "Menlo, Consolas, 'PingFang SC', 'Microsoft YaHei', 'Noto Sans CJK SC', monospace").attr("font-size", 9.5).attr("fill", "#8595a6")
      .text("$" + v.toLocaleString("en-US"));
  });

  const rows = svg.selectAll("g.lane").data(lanes).enter().append("g")
    .attr("transform", (d, i) => `translate(0,${mt + i * rowH})`).attr("cursor", "pointer").attr("data-drill-keep", "");
  rows.append("text").attr("x", ml - 12).attr("y", rowH / 2 - 2)
    .attr("text-anchor", "end").attr("font-family", "'et-book', Palatino, Georgia, 'Songti SC', 'Noto Serif CJK SC', 'SimSun', serif")
    .attr("font-weight", 700).attr("font-size", 13).attr("fill", "#051c2c").text(d => d.lane);
  rows.append("text").attr("x", ml - 12).attr("y", rowH / 2 + 13)
    .attr("text-anchor", "end").attr("font-family", "Menlo, Consolas, 'PingFang SC', 'Microsoft YaHei', 'Noto Sans CJK SC', monospace")
    .attr("font-size", 8.5).attr("fill", "#8595a6").text(d => d.note.toUpperCase().slice(0, 34));
  rows.append("rect").attr("class", "prior")
    .attr("x", ml).attr("y", rowH / 2 - 17).attr("height", 14)
    .attr("width", REDUCE ? d => x(d.prior) - ml : 0)
    .attr("fill", "none").attr("stroke", "#42566a").attr("stroke-width", 1.1);
  rows.append("rect").attr("class", "cur")
    .attr("x", ml).attr("y", rowH / 2 + 1).attr("height", 14)
    .attr("width", REDUCE ? d => x(d.v) - ml : 0)
    .attr("fill", "#2251ff").attr("opacity", 0.92);
  rows.append("text").attr("class", "ratio")
    .attr("x", d => x(d.v) + 8).attr("y", rowH / 2 + 12)
    .attr("font-family", "Menlo, Consolas, 'PingFang SC', 'Microsoft YaHei', 'Noto Sans CJK SC', monospace").attr("font-size", 11).attr("font-weight", 700)
    .attr("fill", d => d.chg >= 5 ? "#2251ff" : "#051c2c")
    .attr("opacity", REDUCE ? 1 : 0)
    .text(d => `${d.chg >= 0 ? "+" : ""}${d.chg}%  $${d.v.toLocaleString("en-US")}`);
  rows.on("click", (ev, d) => U.showDrill({
    title: d.lane, value: "$" + d.v.toLocaleString("en-US") + T(" / 40ft"), delta: d.chg,
    sub: CN ? `${d.note}。上周 $${d.prior.toLocaleString("en-US")}【由已发布周环比 ${d.chg >= 0 ? "+" : ""}${d.chg}% 推算】。` : `${d.note}. Prior week $${d.prior.toLocaleString("en-US")} [derived from published ${d.chg >= 0 ? "+" : ""}${d.chg}% w/w].`,
    source: "K25 · Drewry WCI, 2026-10-15 · K20 derived prior week",
    x: ev.clientX, y: ev.clientY,
  }));

  svg.append("text").attr("x", ml).attr("y", H - 8)
    .attr("font-family", "Menlo, Consolas, 'PingFang SC', 'Microsoft YaHei', 'Noto Sans CJK SC', monospace").attr("font-size", 10).attr("fill", "#42566a")
    .text(CN
      ? `综合指数 $${RPT.wci.composite.toLocaleString("en-US")}（周环比 +${RPT.wci.composite_chg}%） · 评估日 ${RPT.wci.date} · 八条东西航线`
      : `COMPOSITE $${RPT.wci.composite.toLocaleString("en-US")} (+${RPT.wci.composite_chg}% W/W) · ASSESSED ${RPT.wci.date} · EIGHT EAST–WEST LANES`);

  function play() {
    if (REDUCE) return;
    rows.select("rect.prior").transition().delay((d, i) => i * 120).duration(600).attr("width", d => x(d.prior) - ml);
    rows.select("rect.cur").transition().delay((d, i) => i * 120 + 150).duration(700).attr("width", d => x(d.v) - ml);
    rows.select("text.ratio").transition().delay((d, i) => i * 120 + 700).duration(300).attr("opacity", 1);
    setTimeout(() => {
      rows.select("rect.prior").interrupt().attr("width", d => x(d.prior) - ml);
      rows.select("rect.cur").interrupt().attr("width", d => x(d.v) - ml);
      rows.select("text.ratio").interrupt().attr("opacity", 1);
    }, 2400);
  }
  const io = new IntersectionObserver(en => { if (en[0].isIntersecting) { io.disconnect(); play(); } }, { threshold: 0.25 });
  io.observe(svg.node());
})();
