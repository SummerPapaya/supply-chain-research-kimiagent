// main.js — scroll engine (chips + era rail), table population, source register.
(() => {
  // chips smooth scroll
  document.querySelectorAll("[data-goto]").forEach(b =>
    b.addEventListener("click", () => {
      const el = document.querySelector(b.dataset.goto);
      if (el) el.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    }));

  // era rail dots
  const rail = document.getElementById("rail-track");
  const secs = [...document.querySelectorAll("main [data-win], #cover")];
  const dots = secs.map(sec => {
    const d = document.createElement("button");
    d.style.cssText = "width:8px;height:8px;border-radius:50%;border:1px solid #8595a6;background:transparent;cursor:pointer;padding:0";
    d.title = sec.id;
    d.onclick = () => sec.scrollIntoView({ behavior: "smooth", block: "start" });
    rail.appendChild(d);
    new IntersectionObserver(en => {
      if (en[0].isIntersecting) {
        dots.forEach(x => { x.style.background = "transparent"; x.style.borderColor = "#8595a6"; });
        d.style.background = "#2251ff"; d.style.borderColor = "#2251ff";
        const ry = document.getElementById("rail-year");
        if (ry) ry.textContent = sec.dataset.win === "dynamics" ? "2023–26" : "2026";
      }
    }, { rootMargin: "-45% 0px -45% 0px" }).observe(sec);
    return d;
  });

  // CN: swap the source register to its Chinese mirror before building any DOM from it
  if (window.CN && window.SRCS && window.SRCS_CN) {
    SRCS.forEach(s => { const c = SRCS_CN[s.id]; if (c) { s.fact = c.fact; s.cite = c.cite; } });
  }

  // adjacent-markets table
  const adjBody = document.querySelector("#adj-table tbody");
  if (adjBody) {
    const SRC_FOR = ["K2", "K2", "K1", "K5"];
    RPT.market_size.adjacents.forEach((a, i) => {
      const tr = document.createElement("tr");
      if (i === 2) tr.className = "hl";
      tr.style.cursor = "pointer"; tr.setAttribute("data-drill-keep", "");
      tr.innerHTML = `<td><b>${a.name}</b></td><td>${a.unit === "USD T" ? "$" + a.v2025 + "T" : "$" + a.v2025 + "B"}</td><td>${a.cagr}</td><td>${a.note}</td>`;
      tr.onclick = e => U.showDrill({
        title: a.name, value: (a.unit === "USD T" ? "$" + a.v2025 + "T" : "$" + a.v2025 + "B") + " (2025)",
        sub: a.note + T(" · Growth: ") + a.cagr,
        source: SRC_FOR[i] + T(" · industry sizing consensus, 2026"),
        x: e.clientX, y: e.clientY,
      });
      adjBody.appendChild(tr);
    });
  }

  // top-25 table (first 10 on page, click drills for context)
  const t25 = document.querySelector("#top25-table tbody");
  if (t25) {
    const NOTES = CN
      ? { 1: "蝉联第1——循环性 + AI编排", 2: "AI时代的供应链架构师", 3: "车队级零售自动化", 4: "美妆科技需求感知", 5: "数字孪生老将" }
      : { 1: "Repeat #1 — circularity + AI orchestration", 2: "AI-era supply-chain architect", 3: "Retail automation at fleet scale", 4: "Beauty-tech demand sensing", 5: "Digital twin veteran" };
    RPT.top25.slice(0, 10).forEach(([rank, co, score]) => {
      const tr = document.createElement("tr");
      if (rank <= 3) tr.className = "hl";
      tr.style.cursor = "pointer"; tr.setAttribute("data-drill-keep", "");
      tr.innerHTML = `<td>${rank}</td><td><b>${co}</b></td><td>${score.toFixed(2)}</td><td>${NOTES[rank] || "—"}</td>`;
      tr.onclick = e => U.showDrill({
        title: co, value: "#" + rank + " · " + score.toFixed(2),
        sub: T("Gartner Supply Chain Top 25 (2026) composite of business metrics + peer/analyst opinion. Full 25 compiled in data layer."),
        source: "K12 · Gartner Supply Chain Top 25, 2026-05-19",
        x: e.clientX, y: e.clientY,
      });
      t25.appendChild(tr);
    });
  }

  // source register
  const sl = document.getElementById("source-list");
  if (sl && window.SRCS) {
    const CAT = CN ? { company: "公司披露", broker: "券商研究", industry: "行业与官方", kimi: "研究汇编" }
      : { company: "Company disclosure", broker: "Broker research", industry: "Industry & official", kimi: "Research compilation" };
    SRCS.forEach(s => {
      const row = document.createElement("div");
      row.className = "src-row";
      row.innerHTML = `
        <span class="s-fact"><span style="font-family:var(--mono);font-size:10.5px;color:var(--ink-lo);margin-right:6px">${s.id}</span><span class="src-cat ${s.cat}">${CAT[s.cat] || s.cat}</span>${s.fact}</span>
        <span class="s-cite">${s.cite} · <b>${s.date}</b></span>`;
      sl.appendChild(row);
    });
  }

  // entrance fade for prose and frames
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const els = document.querySelectorAll(".prose, .chart-frame, table.dt");
    els.forEach(el => { el.style.opacity = 0; el.style.transform = "translateY(14px)"; el.style.transition = "opacity .6s ease, transform .6s ease"; });
    const io = new IntersectionObserver(es => es.forEach(en => {
      if (en.isIntersecting) { en.target.style.opacity = 1; en.target.style.transform = "none"; io.unobserve(en.target); }
    }), { threshold: 0.08 });
    els.forEach(el => io.observe(el));
  }
})();
