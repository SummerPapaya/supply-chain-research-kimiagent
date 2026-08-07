// §3 · P22 small-multiples panel array — 12 entities, same-scale weekly YTD paths.
// Segment buttons drill down (parcel/forward/ocean/software/benchmark); click again to drill up.
(() => {
  const host = document.getElementById("multi-chart");
  if (!host) return;
  const body = U.frame(host, {
    title: T("Twelve paths through the same six months, one scale"),
    sub: T("WEEKLY CLOSES REBASED TO 100 · SHARED Y-AXIS ACROSS ALL PANELS · SEGMENT BUTTONS DRILL · CLICK A PANEL"),
    src: T("Yahoo Finance weekly closes, 2026-01-23 → 2026-07-17 (K21)"),
  });
  const SEGS = [["all", "ALL"], ["parcel", "PARCEL"], ["forward", "FORWARD & BROKER"], ["ocean", "OCEAN"], ["software", "SOFTWARE"], ["benchmark", "BENCHMARK"]];
  const segBar = document.createElement("div");
  segBar.style.cssText = "display:flex;gap:8px;flex-wrap:wrap;margin:4px 0 14px";
  body.appendChild(segBar);
  const wrap = document.createElement("div");
  wrap.style.cssText = "display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:18px 14px";
  body.appendChild(wrap);

  const all = RPT.market_snap.map(d => ({ ...d, series: RPT.ytd_weekly[d.key] }));
  const lo = Math.min(...all.flatMap(d => d.series.map(p => p[1])));
  const hi = Math.max(...all.flatMap(d => d.series.map(p => p[1])));
  let cur = "all";

  SEGS.forEach(([key, lab]) => {
    const b = document.createElement("button");
    b.textContent = T(lab);
    b.dataset.seg = key;
    b.style.cssText = "font-family:Menlo, Consolas, 'PingFang SC', 'Microsoft YaHei', 'Noto Sans CJK SC', monospace;font-size:10px;letter-spacing:.1em;padding:6px 13px;border:1px solid #051c2c;background:#fff;color:#051c2c;cursor:pointer";
    b.onclick = () => { cur = (cur === key ? "all" : key); render(); };
    segBar.appendChild(b);
  });

  function render() {
    [...segBar.children].forEach(b => {
      const on = b.dataset.seg === cur;
      b.style.background = on ? "#051c2c" : "#fff";
      b.style.color = on ? "#fff" : "#051c2c";
    });
    wrap.innerHTML = "";
    const list = all.filter(d => cur === "all" || d.seg === cur);
    wrap.style.gridTemplateColumns = `repeat(${list.length <= 3 ? list.length : 4},minmax(0,1fr))`;
    list.forEach(d => {
      const panel = document.createElement("div");
      panel.style.cssText = "cursor:pointer";
      panel.setAttribute("data-drill-keep", "");
      const pw = 210, ph = 118, padL = 4, padB = 16;
      const xs = (i) => padL + i * (pw - padL - 6) / (d.series.length - 1);
      const ys = (v) => 8 + (hi - v) * (ph - padB - 18) / (hi - lo);
      const up = d.series[d.series.length - 1][1] >= 100;
      const col = up ? "#2251ff" : "#c22f4e";
      const pts = d.series.map((p, i) => `${xs(i)},${ys(p[1])}`).join(" ");
      const area = `${padL},${ys(100)} ` + pts + ` ${xs(d.series.length - 1)},${ys(100)}`;
      const vHi = Math.max(...d.series.map(p => p[1])), vLo = Math.min(...d.series.map(p => p[1]));
      panel.innerHTML = `
        <svg viewBox="0 0 ${pw} ${ph}" width="100%" height="${ph}" style="display:block">
          <line x1="${padL}" x2="${pw - 6}" y1="${ys(100)}" y2="${ys(100)}" stroke="#8595a6" stroke-width="0.8" stroke-dasharray="3 3"/>
          <polygon points="${area}" fill="${col}" opacity="0.07"/>
          <polyline points="${pts}" fill="none" stroke="${col}" stroke-width="1.6"/>
          <circle cx="${xs(d.series.length - 1)}" cy="${ys(d.series[d.series.length - 1][1])}" r="2.6" fill="${col}"/>
          <text x="${pw - 4}" y="${ys(vHi) + 3}" text-anchor="end" font-family="Menlo, Consolas, 'PingFang SC', 'Microsoft YaHei', 'Noto Sans CJK SC', monospace" font-size="8" fill="#8595a6">${vHi.toFixed(0)}</text>
          <text x="${pw - 4}" y="${ys(vLo) + 3}" text-anchor="end" font-family="Menlo, Consolas, 'PingFang SC', 'Microsoft YaHei', 'Noto Sans CJK SC', monospace" font-size="8" fill="#8595a6">${vLo.toFixed(0)}</text>
          <text x="${padL}" y="${ph - 3}" font-family="Menlo, Consolas, 'PingFang SC', 'Microsoft YaHei', 'Noto Sans CJK SC', monospace" font-size="8" fill="#8595a6">JAN</text>
          <text x="${pw - 6}" y="${ph - 3}" text-anchor="end" font-family="Menlo, Consolas, 'PingFang SC', 'Microsoft YaHei', 'Noto Sans CJK SC', monospace" font-size="8" fill="#8595a6">JUL</text>
        </svg>
        <div style="display:flex;justify-content:space-between;align-items:baseline;border-top:1px solid #eef1f6;padding-top:5px">
          <span style="font-family:'et-book', Palatino, Georgia, 'Songti SC', 'Noto Serif CJK SC', 'SimSun', serif;font-weight:700;font-size:13px">${d.short}</span>
          <span style="font-family:Menlo, Consolas, 'PingFang SC', 'Microsoft YaHei', 'Noto Sans CJK SC', monospace;font-size:11px;color:${col}">${d.ytd >= 0 ? "+" : ""}${d.ytd}%</span>
        </div>
        <div style="font-family:Menlo, Consolas, 'PingFang SC', 'Microsoft YaHei', 'Noto Sans CJK SC', monospace;font-size:8.5px;color:#8595a6;letter-spacing:.08em">${d.ticker} · ${T(d.seg.toUpperCase())}</div>`;
      panel.onclick = e => U.showDrill({
        title: d.name, value: `${d.ytd >= 0 ? "+" : ""}${d.ytd}% ${T("YTD")}`,
        sub: `${d.ccy} ${d.price} · ${T("day")} ${d.chg >= 0 ? "+" : ""}${d.chg}% · ${T("52-wk")} ${d.lo52}–${d.hi52} · ${T("P/E")} ${d.pe ?? "—"}`,
        source: `K21 · Yahoo Finance, close ${d.last_date}`,
        x: e.clientX, y: e.clientY,
      });
      wrap.appendChild(panel);
    });
    const note = document.createElement("div");
    note.style.cssText = "grid-column:1/-1;border-top:1.5px solid #051c2c;padding-top:10px;font-family:'et-book', Palatino, Georgia, 'Songti SC', 'Noto Serif CJK SC', 'SimSun', serif;font-size:14px";
    note.innerHTML = cur === "all"
      ? T(`Read across the row: <b>freight-cycle leverage leads</b> (XPO +47%, J.B. Hunt +44%), ocean holds the disruption premium, and the two laggards — GXO and Manhattan Associates — are exactly the two stories the market has <i>not</i> yet underwritten.`)
      : `${T("Drilled to")} <b>${T(cur.toUpperCase())}</b>${T(" · click the same segment again to drill back up to the full panel.")}`;
    wrap.appendChild(note);
  }
  render();
})();
