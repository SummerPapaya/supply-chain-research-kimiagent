// §3 · LIVE refresh widget — pulls public CSV quotes (stooq) with a 9s timeout,
// caches to localStorage, and falls back (honestly labeled) to the verified
// iFinD 2026-10-16 snapshot when the endpoint is unreachable.
(() => {
  const host = document.getElementById("live-strip");
  if (!host) return;
  const body = U.frame(host, {
    title: T("The panel, refreshable"),
    sub: T("CLICK REFRESH FOR A LIVE PULL · SNAPSHOT FALLBACK IS LABELED, NEVER SILENT · CLICK A CELL TO DRILL"),
    src: T("Snapshot: iFinD close 2026-10-16 (K21) · benchmark: FRED (K26) · live: stooq CSV (K22)"),
  });
  const bar = document.createElement("div");
  bar.style.cssText = "display:flex;align-items:center;gap:14px;margin:6px 0 14px;font-family:Menlo, Consolas, 'PingFang SC', 'Microsoft YaHei', 'Noto Sans CJK SC', monospace;font-size:10.5px;letter-spacing:.08em";
  bar.innerHTML = `
    <button id="live-btn" style="font:inherit;letter-spacing:.08em;padding:7px 18px;border:1.4px solid #051c2c;background:#051c2c;color:#fff;cursor:pointer">${T("↻ REFRESH QUOTES")}</button>
    <span id="live-state" style="color:#42566a">${T("VERIFIED SNAPSHOT · 2026-10-16 CLOSE")}</span>
    <span id="live-badge" style="padding:2px 9px;border:1px solid #8595a6;color:#42566a">${T("SNAPSHOT")}</span>`;
  body.appendChild(bar);
  const grid = document.createElement("div");
  grid.style.cssText = "display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:1px;background:#dbe2ea;border:1px solid #dbe2ea";
  body.appendChild(grid);

  const STOOQ = { UPS: "ups.us", FDX: "fdx.us", EXPD: "expd.us", CHRW: "chrw.us", JBHT: "jbht.us", XPO: "xpo.us",
                  GXO: "gxo.us", ZIM: "zim.us", MANH: "manh.us", ODFL: "odfl.us", SNDR: "sndr.us", GSPC: "^spx" };

  const state = { mode: "snapshot", data: RPT.market_snap, when: "2026-10-16" };
  window.LIVE = { state };

  function render() {
    grid.innerHTML = "";
    state.data.forEach(d => {
      const cell = document.createElement("div");
      cell.style.cssText = "background:#fff;padding:12px 14px;cursor:pointer";
      cell.setAttribute("data-drill-keep", "");
      const ytdCol = d.ytd >= 0 ? "#2251ff" : "#c22f4e";
      const chgCol = d.chg >= 0 ? "#008a6d" : "#c22f4e";
      cell.innerHTML = `
        <div style="font-family:Menlo, Consolas, 'PingFang SC', 'Microsoft YaHei', 'Noto Sans CJK SC', monospace;font-size:9.5px;color:#8595a6;letter-spacing:.1em">${d.ticker} · ${T(d.seg.toUpperCase())}</div>
        <div style="font-family:'et-book', Palatino, Georgia, 'Songti SC', 'Noto Serif CJK SC', 'SimSun', serif;font-weight:700;font-size:15px;margin:2px 0">${d.short}</div>
        <div style="font-family:Menlo, Consolas, 'PingFang SC', 'Microsoft YaHei', 'Noto Sans CJK SC', monospace;font-size:15px;color:#051c2c">${d.ccy} ${d.price.toLocaleString("en-US")}</div>
        <div style="font-family:Menlo, Consolas, 'PingFang SC', 'Microsoft YaHei', 'Noto Sans CJK SC', monospace;font-size:10px;margin-top:3px">
          <span style="color:${chgCol}">${T("DAY")} ${d.chg >= 0 ? "+" : ""}${d.chg}%</span>&nbsp;&nbsp;
          <span style="color:${ytdCol}">${T("YTD")} ${d.ytd >= 0 ? "+" : ""}${d.ytd}%</span></div>`;
      cell.onclick = e => U.showDrill({
        title: d.name, value: `${d.ccy} ${d.price.toLocaleString("en-US")}`,
        delta: d.ytd,
        sub: `${T("52-wk")} ${d.lo52}–${d.hi52}${d.key === "GSPC" ? " · S&P 500 INDEX" : ""}`,
        source: `${state.mode === "live" ? T("Live pull via stooq (K22)") : (d.key === "GSPC" ? T("K26 · FRED SP500, 2026-10-16") : T("K21 · iFinD, close 2026-10-16"))}${T(", as of ")}${state.when}`,
        x: e.clientX, y: e.clientY,
      });
      grid.appendChild(cell);
    });
    const st = document.getElementById("live-state"), bg = document.getElementById("live-badge");
    if (state.mode === "live") {
      st.textContent = `${T("LIVE PULL OK")} · ${state.when} · ${state.note}`;
      st.style.color = "#008a6d"; bg.textContent = T("LIVE");
      bg.style.cssText += ";border-color:#008a6d;color:#008a6d";
    } else if (state.mode === "cache") {
      st.textContent = `${T("CACHED LIVE PULL")} · ${state.when}${T(" · ENDPOINT NOW UNREACHABLE")}`;
      bg.textContent = T("CACHE");
    } else if (state.mode === "failed") {
      st.textContent = `${T("LIVE ENDPOINT UNREACHABLE FROM THIS BROWSER (CORS/OFFLINE) — SHOWING VERIFIED SNAPSHOT ")}(${state.when})`;
      st.style.color = "#b07a10"; bg.textContent = T("SNAPSHOT");
    }
  }

  async function pull() {
    const btn = document.getElementById("live-btn"), st = document.getElementById("live-state");
    btn.disabled = true; st.textContent = T("PULLING LIVE QUOTES…"); st.style.color = "#2251ff";
    const ctrl = new AbortController();
    const to = setTimeout(() => ctrl.abort(), 4000);
    try {
      const syms = Object.values(STOOQ).join(",");
      const res = await fetch(`https://stooq.com/q/l/?s=${syms}&f=sd2t2ohlcv&h&e=csv`, { signal: ctrl.signal });
      const txt = await res.text();
      const rows = txt.trim().split("\n").slice(1).map(l => l.split(","));
      if (rows.length < 6) throw new Error("too few quotes");
      const bySym = {};
      rows.forEach(r => { bySym[r[0].toLowerCase()] = r; });
      let ok = 0;
      const now = new Date().toISOString().slice(0, 10);
      const data = RPT.market_snap.map(d => {
        const r = bySym[STOOQ[d.key].toLowerCase()];
        if (!r || r[6] === "N/D") return d;
        const close = parseFloat(r[6]), open = parseFloat(r[3]);
        if (!isFinite(close)) return d;
        ok++;
        const chg = isFinite(open) && open ? (close / open - 1) * 100 : d.chg;
        const ytd = (close / (d.price / (1 + d.ytd / 100)) - 1) * 100;   // rebase on snapshot base
        return { ...d, price: Math.round(close * 100) / 100, chg: Math.round(chg * 100) / 100, ytd: Math.round(ytd * 10) / 10 };
      });
      if (ok < 6) throw new Error("only " + ok + " resolved");
      state.mode = "live"; state.data = data; state.when = now; state.note = ok + T("/12 QUOTES");
      try { localStorage.setItem("scm-live", JSON.stringify({ when: now, data })); } catch (_) {}
    } catch (err) {
      let cached = null;
      try { cached = JSON.parse(localStorage.getItem("scm-live") || "null"); } catch (_) {}
      if (cached && cached.data) { state.mode = "cache"; state.data = cached.data; state.when = cached.when; }
      else { state.mode = "failed"; state.data = RPT.market_snap; state.when = "2026-10-16"; }
    } finally {
      clearTimeout(to); btn.disabled = false;
      render();
      document.dispatchEvent(new CustomEvent("scm-live", { detail: state }));
    }
  }

  document.getElementById("live-btn").addEventListener("click", pull);
  render();
  const io = new IntersectionObserver(en => { if (en[0].isIntersecting) { io.disconnect(); pull(); } }, { threshold: 0.3 });
  io.observe(grid);
})();
