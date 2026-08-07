// i18n.js — EN/CN language engine.
// Loaded immediately after data.js, BEFORE every chart: when CN is active it mutates
// RPT text fields in place, so all charts draw Chinese without per-chart branching.
// Static prose is translated via [data-cn] attributes swapped on DOMContentLoaded.
// Choice persists in localStorage ("scm-lang"); the toggle button reloads the page.
window.LANG = (() => { try { return localStorage.getItem("scm-lang") || "en"; } catch (e) { return "en"; } })();
window.CN = LANG === "cn";

// ── Dictionary: exact English string (as used in chart code) → Chinese ──
window.DICT = {
  // ship chart (P17)
  "The state of the network, measured where it is measured": "在真正被测量的位置，丈量网络现状",
  "SIDE ELEVATION · 1 DECK BOX = $1T OF ANNUAL LOGISTICS · CLICK ANY SITE FOR BASIS & SOURCE": "侧视图 · 1个甲板箱 = 1万亿美元年度物流 · 点击任意位置查看依据与来源",
  "Anchors K1–K21 · dated sources in the register below": "锚点 K1–K21 · 注明日期的来源见下方登记册",
  "USE AI DAILY": "日常使用AI",
  "WCI PER 40FT · +3% W/W": "WCI 每40英尺箱 · 周环比+3%",
  "WTO WORLD TRADE 2026F": "WTO 世界贸易 2026预测",
  "GLOBAL LOGISTICS BODY · 1 BOX = $1T": "全球物流身躯 · 1箱 = 1万亿美元",
  "EU–US TARIFF": "美欧关税",
  "−60% SUEZ TRANSITS — THE MISSING WAKE": "−60% 苏伊士通行量——消失的尾迹",
  "SEA LINE": "海平面",
  "SCM SOFTWARE $39.2B": "SCM软件 392亿美元",
  "2026 · +10.7% CAGR TO $97.6B BY 2035": "2026 · 复合增速+10.7%，2035年达976亿美元",
  "CSRD SCOPE": "CSRD范围",
  "AI at work": "AI在岗",
  "Supply-chain staff using AI daily — up from ~20% in 2024": "日常使用AI的供应链员工占比——2024年约为20%",
  "Drewry WCI composite": "Drewry WCI 综合指数",
  "Per 40ft container; Shanghai→NY $5,870 (+7%)": "每40英尺箱；上海→纽约 5,870美元（+7%）",
  "World trade volume": "世界贸易量",
  "2026 forecast, downgraded on tariff shock": "2026年预测，因关税冲击下调",
  "Global logistics market": "全球物流市场",
  "All modes, annual; 3PL segment ≈ $1.8T": "全方式年度规模；3PL板块 ≈ 1.8万亿美元",
  "EU–US tariff baseline": "美欧基准关税",
  "In force 2026-07-01; sectoral carve-outs under negotiation": "2026-07-01生效；行业性豁免谈判中",
  "Suez transits": "苏伊士通行量",
  "Vs pre-crisis; Maersk MECL resumed 2026-03-20, most capacity still via the Cape": "相对危机前；马士基MECL于2026-03-20复航，多数运力仍绕好望角",
  "SCM software market": "SCM软件市场",
  "2026; $35.3B 2025 → $97.6B 2035E at +10.7% CAGR": "2026年；2025年353亿美元 → 2035年预计976亿美元，复合增速+10.7%",
  "CSRD scope reduction": "CSRD范围收窄",
  "Omnibus Directive (EU) 2026/470; CSDDD deferred to 2029": "《综合指令》(EU) 2026/470；CSDDD推迟至2029年",
  // iso chart
  "The brain, stacked: $35.3B → $97.6B in ten years": "堆起来的大脑：十年间 353亿 → 976亿美元",
  "1 CONTAINER = $5B OF SCM SOFTWARE · SOLID = ACTUAL · HOLLOW+DASHED = FORECAST · CLICK A STACK": "1个集装箱 = 50亿美元SCM软件 · 实心 = 实际 · 空心虚线 = 预测 · 点击箱堆",
  "Industry sizing consensus (K1), March 2026 · forecast years flagged": "行业规模测算共识（K1），2026年3月 · 预测年份已标注",
  "CLICK A STACK FOR BASIS": "点击箱堆查看依据",
  "+10.7% CAGR": "复合增速 +10.7%",
  "Consensus forecast at +10.7% CAGR — flagged estimate": "共识预测，复合增速+10.7%——已标注为估计值",
  "Current-year sizing": "本年度规模测算",
  "Actual sizing": "实际规模测算",
  " (forecast)": "（预测）",
  "ACTUAL": "实际", "CURRENT": "当前", "FORECAST": "预测",
  // timeline
  "Thirty-two months of rewiring, event by event": "重构的32个月，逐事件复盘",
  "RED FRAME = CRISIS · BLUE FRAME = CURRENT WINDOW · BLUE BAND = POLICY REWIRING ERA · CLICK A PLAQUE": "红框 = 危机 · 蓝框 = 当前窗口 · 蓝色带 = 政策重构时代 · 点击铭牌",
  "Anchors K7–K9, K12–K15, K21 · each plaque drills to its dated source": "锚点 K7–K9、K12–K15、K21 · 每块铭牌可下钻至注明日期的来源",
  "RED SEA CRISIS ERA": "红海危机时代",
  "POLICY REWIRING ERA": "政策重构时代",
  // live widget
  "The panel, refreshable": "可刷新的面板",
  "CLICK REFRESH FOR A LIVE PULL · SNAPSHOT FALLBACK IS LABELED, NEVER SILENT · CLICK A CELL TO DRILL": "点击刷新拉取实时行情 · 回退快照必有标注，绝不静默 · 点击单元格下钻",
  "Snapshot: Yahoo Finance close 2026-07-17 (K21) · live: stooq CSV (K22)": "快照：Yahoo Finance 2026-07-17 收盘（K21） · 实时：stooq CSV（K22）",
  "↻ REFRESH QUOTES": "↻ 刷新行情",
  "VERIFIED SNAPSHOT · 2026-07-17 CLOSE": "已核验快照 · 2026-07-17 收盘",
  "SNAPSHOT": "快照",
  "LIVE": "实时",
  "CACHE": "缓存",
  "PULLING LIVE QUOTES…": "正在拉取实时行情…",
  // multi chart
  "Twelve paths through the same six months, one scale": "同一六个月里的十二条路径，同一把尺",
  "WEEKLY CLOSES REBASED TO 100 · SHARED Y-AXIS ACROSS ALL PANELS · SEGMENT BUTTONS DRILL · CLICK A PANEL": "周收盘价重定基为100 · 全部面板共用Y轴 · 板块按钮下钻 · 点击面板",
  "Yahoo Finance weekly closes, 2026-01-23 → 2026-07-17 (K21)": "Yahoo Finance 周收盘价，2026-01-23 → 2026-07-17（K21）",
  "ALL": "全部", "PARCEL": "包裹", "FORWARD & BROKER": "货代与经纪", "OCEAN": "海运", "SOFTWARE": "软件", "BENCHMARK": "基准",
  // wci chart
  "The weekly pulse: four lanes, all four up": "每周脉搏：四条航线，全线上涨",
  "SOLID = CURRENT ASSESSMENT · OUTLINE = PRIOR WEEK [DERIVED FROM PUBLISHED W/W %] · USD PER 40FT FEU · CLICK A PAIR": "实心 = 当前评估 · 描边 = 上周【由已发布周环比推算】 · 美元/40英尺箱 · 点击任意一组",
  "Drewry WCI 2026-06-11 (K4) · prior week derived (K20)": "Drewry WCI 2026-06-11（K4） · 上周值为推算（K20）",
  " / 40ft": " / 40英尺箱",
  // hot topics (chart-dom)
  "Five debates, one heat scale": "五场辩论，同一把热度尺",
  "HEAT 1–5 = SALIENCE × CONSEQUENCE · ★ = RUNNING HOTTEST · CLICK ANY ROW FOR THE FULL BRIEF": "热度1–5 = 关注度 × 后果 · ★ = 当前最热 · 点击任意行查看完整简报",
  "K7–K11, K14 · dated anchors per topic": "K7–K11、K14 · 每个议题均有注明日期的锚点",
  "TOPIC": "议题", "HEAT": "热度", "HAPPENING NOW": "正在发生", "COST & NETWORK EFFECT": "成本与网络影响", "WHAT TO WATCH": "观察指标",
  "★ = the two debates running hottest at mid-2026 · heat is a research judgment (K19)": "★ = 2026年年中最热的两场辩论 · 热度为研究判断（K19）",
  // trend radar
  "Gartner's 2026 radar, clustered into three budget themes": "Gartner 2026雷达，聚为三大预算主题",
  "EIGHT NAMED TECHNOLOGIES · THEME ORDER = WHERE 2026 BUDGETS ARE MOVING · CLICK A THEME": "八项具名技术 · 主题顺序 = 2026年预算流向 · 点击主题",
  "Gartner Supply Chain Technology Trends 2026 (K10), May 2026": "Gartner 供应链技术趋势 2026（K10），2026年5月",
  "Hover for the full cluster": "悬停查看完整集群",
  " technologies": " 项技术",
  "K10 · Gartner Supply Chain Technology Trends 2026, 2026-05": "K10 · Gartner 供应链技术趋势 2026，2026-05",
  // gate ladder
  "What actually gates AI adoption, ranked by rigidity": "真正卡住AI采用的门槛，按刚性排序",
  "10-CELL SCORE = RIGIDITY · SOLID SQUARE = NO BYPASS · ↳ = WORKAROUND ROUTE · CLICK A GATE": "10格评分 = 刚性 · 实心方块 = 无绕行 · ↳ = 绕行路线 · 点击门槛",
  "Research compilation from K10, K11 · rigidity scores are graded judgments": "基于K10、K11的研究汇编 · 刚性评分为分级判断",
  "rigidity ": "刚性 ",
  "/10": "/10",
  " · Bypass: ": " · 绕行：",
  " · No known bypass — this gate binds hardest.": " · 暂无已知绕行——这道门槛约束最硬。",
  "K10/K11 compilation · graded research judgment (K19)": "K10/K11 汇编 · 分级研究判断（K19）",
  "NO BYPASS": "无绕行",
  // nearshore pictograms
  "The reshoring arithmetic, four ways": "回岸算术的四种算法",
  "FOUR PANELS, FOUR BASES OF THE SAME SHIFT · THE BOLDED NOTE IS THE COUNTERINTUITIVE ONE · CLICK A PANEL": "四个面板，同一场转移的四条依据 · 加粗那条是反直觉的 · 点击面板",
  "K6, K11, K14 · official statistics compiled June–July 2026": "K6、K11、K14 · 官方统计，汇编于2026年6–7月",
  "New supply bases": "新供应基地",
  "Egypt textile & apparel exports y/y H1 2026 · Vietnam +22% · Mexico nearshoring FDI +31% · India electronics +18%": "埃及纺织服装出口同比（2026上半年） · 越南+22% · 墨西哥近岸FDI+31% · 印度电子+18%",
  "K14 · national trade statistics, 2026-06": "K14 · 各国贸易统计，2026-06",
  "Robot density": "机器人密度",
  "Annual industrial-robot installations 2026E; 542K installed 2024 — record fleet as reshoring meets labor scarcity": "2026年预计工业机器人年装机量；2024年装机54.2万台——回岸遇上劳动力稀缺，机队创纪录",
  "K6 · IFR World Robotics, 2026-03": "K6 · 国际机器人联合会《世界机器人》，2026-03",
  "US warehouse gap": "美国仓储缺口",
  "Unfilled US warehousing & storage openings; 58% rank hiring/retention the top challenge": "美国仓储与存储业空缺岗位；58%的企业将招聘/留任列为头号挑战",
  "K11 · MHI Annual Industry Report 2026, 2026-03": "K11 · MHI年度行业报告 2026，2026-03",
  "Supply-chain staff using AI daily, up from ~20% in 2024; agentic AI named Gartner's #1 2026 trend": "日常使用AI的供应链员工，2024年约为20%；智能体AI被Gartner列为2026年头号趋势",
  "K10/K11 · Gartner & MHI 2026": "K10/K11 · Gartner 与 MHI 2026",
  // odds board
  "H2 2026: four scenarios, graded odds": "2026下半年：四个情景，分级赔率",
  "RANGES = SUBJECTIVE PROBABILITY BANDS (LOW–HIGH), NOT MARKET-IMPLIED · ★ = BASE CASE · CLICK A PATH": "区间 = 主观概率带（低–高），非市场隐含 · ★ = 基准情景 · 点击路径",
  "Research judgment (K19) on evidence from K4, K7, K8, K16": "基于K4、K7、K8、K16证据的研究判断（K19）",
  "BASE": "基准",
  "Kill-switch: any single scenario can be invalidated by the falsification strip in §6 — probabilities re-grade on tariff reviews, Suez resumption pace, and WCI breaks.": "熔断机制：任一情景都可能被§6的证伪带推翻——概率将随关税复审、苏伊士复航节奏与WCI破位重新评级。",
  "Evidence: ": "证据：",
  " · Boundary: ": " · 边界：",
  "K19 · subjective research judgment, 2026-07-19": "K19 · 主观研究判断，2026-07-19",
  // verdict scale
  "The evidence, weighed": "证据，过秤",
  "TILT IS QUALITATIVE — NOT A SCORE · DASHED WEIGHTS = TRIGGERS NOT YET MET · RED SEAL = FALSIFICATION · CLICK ANY PIECE": "倾斜为定性判断——非评分 · 虚线砝码 = 尚未达成的触发条件 · 红色封条 = 证伪 · 点击任意部件",
  "Weights & triggers compiled from K7–K16 · verdict is a research judgment (K19)": "砝码与触发条件汇编自K7–K16 · 结论为研究判断（K19）",
  "EFFICIENCY ENDURES": "效率逻辑仍在",
  "STRUCTURAL REWIRING": "结构性重构",
  "UPGRADE TRIGGERS": "升级触发条件",
  "Resilience-first is the baseline;": "韧性优先是基准；",
  "efficiency survives inside it": "效率在其中存续",
  "FALSIFICATION SEAL — THE VERDICT IS WRONG IF ANY STRIP TRIPS": "证伪封条——任一条件触发，结论即告错误",
  "Efficiency case · evidence ": "效率派 · 证据 ",
  "Rewiring case · evidence ": "重构派 · 证据 ",
  "Upgrade trigger ": "升级触发条件 ",
  "NOT YET MET": "尚未达成",
  " · Reading upgrades only when all triggers land on the pan.": " · 只有全部触发条件落入盘中，判断才会升级。",
  "K19 · research framework, 2026-07-19": "K19 · 研究框架，2026-07-19",
  "Falsification strip ": "证伪条件 ",
  "TRIP = VERDICT WRONG": "触发 = 结论错误",
  "K19 · falsification discipline": "K19 · 证伪纪律",
  "Current verdict": "当前结论",
  "RESILIENCE-FIRST BASELINE": "韧性优先基准",
  "Tilt is qualitative, not a score. Review cadence: quarterly, or on any trigger/falsification event.": "倾斜为定性判断，非评分。复核节奏：每季度，或任一触发/证伪事件发生时。",
  "K19 · research judgment, 2026-07-19": "K19 · 研究判断，2026-07-19",
  // dashboard rail
  "CYCLE DASHBOARD": "周期仪表盘",
  "WEEKLY · JAN → JUL 2026": "每周 · 2026年1月 → 7月",
  "PANEL COHORT · YTD": "面板组合 · 年初至今",
  "QUOTES: ": "行情：",
  "NOW: ": "当前：",
  "YTD": "年初至今",
  // dashboard rail — window titles/subs & stat labels
  "THE REWIRED NETWORK": "重构中的网络", "sector deep dive · 2026-07-17": "行业深度研究 · 2026-07-17",
  "§1 INDUSTRY OVERVIEW": "§1 行业综述", "layers & league table": "行业分层与领先榜",
  "§2 INDUSTRY DYNAMICS": "§2 行业动态", "32 months of rewiring": "重构的32个月",
  "§3 MARKET PERFORMANCE": "§3 市场表现", "panel vs S&P 500": "面板 vs 标普500",
  "§4 HOT TOPICS": "§4 热门议题", "five debates graded": "五场辩论，已评级",
  "§5 KEY TRENDS": "§5 重点趋势", "tech, gates, scenarios": "技术、门槛、情景",
  "§6 VERDICT": "§6 结论", "resilience-first baseline": "韧性优先基准",
  "LOGISTICS": "全球物流", "3PL": "3PL", "CAGR": "复合增速", "TRADE 26F": "贸易26预测",
  "SUEZ": "苏伊士", "EVENTS": "事件", "ERAS": "时代", "TARIFF": "关税",
  "LEADER": "领涨", "LAGGARD": "落后", "PANEL": "面板", "10 UP / 2 DN": "10涨 / 2跌",
  "HOTTEST": "最热", "ALSO HOT": "次热", "PRICED IN": "已定价", "SLOW BURN": "慢变量",
  "TARIFFS": "关税", "AGENTIC AI": "智能体AI", "RED SEA": "红海", "CARBON": "碳",
  "AI DAILY": "AI日常使用", "CSCO PILOTS": "CSCO试点", "OPENINGS": "空缺岗位", "ROBOTS": "机器人",
  "WEIGHTS L": "左盘砝码", "WEIGHTS R": "右盘砝码", "TRIGGERS": "触发条件", "FALSIFY": "证伪条件",
  "SCM SW": "SCM软件", "CSRD": "CSRD",
  // drill cards & misc widgets
  "52-wk": "52周", "P/E": "市盈率", "div yield": "股息率", " · mkt cap ": " · 市值 ",
  "day": "当日", "DAY": "当日", "FORWARD": "货代", "/12 QUOTES": "/12 只行情",
  "Live pull via stooq (K22)": "stooq 实时拉取（K22）",
  ", as of ": "，截至 ",
  "Drilled to": "已下钻至",
  " · click the same segment again to drill back up to the full panel.": " · 再次点击同一板块，上钻回完整面板。",
  " · Tech angle: ": " · 技术角度：",
  " · Growth: ": " · 增速：",
  " · industry sizing consensus, 2026": " · 行业规模测算共识，2026",
  "Gartner Supply Chain Top 25 (2026) composite of business metrics + peer/analyst opinion. Full 25 compiled in data layer.": "Gartner供应链Top 25（2026）综合经营指标与同行/分析师意见。完整25名汇编于数据层。",
  "Read across the row: <b>freight-cycle leverage leads</b> (XPO +47%, J.B. Hunt +44%), ocean holds the disruption premium, and the two laggards — GXO and Manhattan Associates — are exactly the two stories the market has <i>not</i> yet underwritten.":
    "横向来看：<b>货运周期杠杆领涨</b>（XPO +47%、J.B. Hunt +44%），海运守住扰动溢价，而两个落后者——GXO与Manhattan Associates——恰好是市场<i>尚未</i>承保的两个故事。",
  "The paradox beneficiary: <b>automation vendors</b> — reshoring was sold as a jobs story, but at 370K unfilled openings it is robots, at record installations, that staff the reshored factories.":
    "悖论受益者：<b>自动化厂商</b>——回岸曾被包装成就业故事，但在37万个空缺岗位面前，为回迁工厂“上岗”的，是创纪录装机的机器人。",
  // misc
  "Source · ": "来源 · ",
  "SCROLL": "滚动",
  "RECURSION LAYER": "递归第",
  " · EVERY SHIP, ONE CELL ON A LARGER CAPACITY MAP": " 层 · 每艘船，都是更大运力图上的一个格子",
  "THE HULL — FREIGHT FLOOR": "船体——运价地板",
  "WCI $3,549 / 40ft · elevated band holds": "WCI 3,549美元/40英尺箱 · 高位区间维持",
  "THE HOLDS — CAPACITY VS CHOKEPOINTS": "货舱——运力 vs 咽喉要道",
  "record orderbook meets Suez −60%": "创纪录订单簿 遇上 苏伊士−60%",
  "THE DECK — VOLUME": "甲板——货量",
  "$11.97T logistics body, 1 stack ≈ $1T": "11.97万亿美元物流身躯，1垛 ≈ 1万亿美元",
  "THE BRIDGE — THE BRAIN": "舰桥——大脑",
  "SCM software $39.2B · +10.7% CAGR": "SCM软件392亿美元 · 复合增速+10.7%",
  " · CLICK COVER TO ": " · 点击封面",
  "ASSEMBLE": "组装", "EXPLODE": "拆解", "UNBOXING": "开箱中",
  "EXPLODED": "已拆解", "ASSEMBLED": "已组装",
  "EXPLODED — CLICK TO ASSEMBLE": "已拆解——点击组装",
  "ASSEMBLED — CLICK TO EXPLODE": "已组装——点击拆解",
  "FIG. 1 · THE SHIP, IN LAYERS · ": "图1 · 船体分层 · ",
  "FIG. 2 · BLUEPRINT · 4 COLUMNS · SCALE NTS · ": "图2 · 蓝图 · 4层 · 比例从略 · ",
  " · SCALE NTS": " · 比例从略",
  // live widget states (template parts)
  "LIVE PULL OK": "实时拉取成功",
  "CACHED LIVE PULL": "缓存的实时拉取",
  " · ENDPOINT NOW UNREACHABLE": " · 接口当前不可达",
  "LIVE ENDPOINT UNREACHABLE FROM THIS BROWSER (CORS/OFFLINE) — SHOWING VERIFIED SNAPSHOT ": "此浏览器无法访问实时接口（跨域/离线）——正在显示已核验快照 ",
};

// ── RPT_CN: Chinese mirror of data-layer text fields (numbers untouched) ──
window.RPT_CN = {
  market_snap_names: {
    UPS: "联合包裹 (UPS)", FDX: "联邦快递 (FedEx)", DHL_DE: "DHL集团", EXPD: "Expeditors 国际",
    CHRW: "C.H. Robinson 罗宾逊", JBHT: "J.B. Hunt 运输", XPO: "XPO 物流", GXO: "GXO 物流",
    ZIM: "ZIM 以星航运", "MAERSK-B_CO": "A.P. 穆勒–马士基 B", MANH: "Manhattan Associates", GSPC: "标普500指数",
  },
  wci_lanes: [
    { lane: "上海 → 纽约", note: "跨太平洋东行即期价，40英尺箱" },
    { lane: "上海 → 洛杉矶", note: "跨太平洋西岸即期价，40英尺箱" },
    { lane: "上海 → 鹿特丹", note: "亚欧去程即期价，40英尺箱" },
    { lane: "上海 → 热那亚", note: "亚洲—地中海即期价，40英尺箱" },
  ],
  adjacents: [
    { name: "全球物流市场（全方式）", note: "全方式运输、仓储与增值服务" },
    { name: "第三方物流（3PL）", note: "外包物流服务；渗透率仍在提升" },
    { name: "SCM软件（本报告核心）", note: "计划、执行、WMS/TMS/OMS、采购与可视化平台" },
    { name: "仓储自动化", note: "AS/RS、AMR/AGV、货到人；订单周期回升中" },
  ],
  trends: [
    { theme: "智能体与应用AI", items: [
      "智能体AI——目标驱动的自主智能体，执行多步供应链工作流",
      "决策智能——从建议走向直接执行计划决策的AI",
      "AI原生平台——围绕模型重建的套件，而非外挂模型"] },
    { theme: "自动化与机器人", items: [
      "物理AI/机器人——AMR、单件拣选与人形机器人从试点走向机队",
      "超自动化——横跨订单到收款、采购到付款的端到端流程自动化"] },
    { theme: "可视化与韧性", items: [
      "供应链控制塔——实时多层级可视化加异常管理",
      "数字孪生——用于情景推演的网络活体模型",
      "地缘与关税情景工具——采购与流向的持续重规划"] },
  ],
  hot_topics: [
    { t: "关税与贸易政策重构", happening: "美欧15%关税框架自2026-07-01生效；行业性豁免仍在谈判；CFO们正在重算网络成本",
      cost: "关税与合规成本上升；报关经纪需求激增",
      network: "采购转移加速——墨西哥/越南/印度受益；埃及纺织品出口同比+73%",
      tech: "关税情景模块已成计划套件的入场券", watch: "更多行业性关税；报复螺旋；原产地规则审查" },
    { t: "红海 / 苏伊士扰动", happening: "通行量仍比危机前低约60%；马士基一条MECL航线复航苏伊士，多数运力仍绕行非洲",
      cost: "亚欧有效运力收缩；战争风险保费持续",
      network: "好望角航线增加10–14天；班期可靠性结构性下降",
      tech: "动态路由与可视化平台承接异常负荷", watch: "全面复航将释放运力、压制运价" },
    { t: "智能体AI进入运营", happening: "51%的CSCO正在试点或部署智能体AI；41%的供应链员工已日常使用AI（MHI 2026）",
      cost: "早期证据：计划岗工时重新配置；运费审计自动化回本<12个月",
      network: "异常解决以分钟计而非以天计；控制塔变成智能体监督岗",
      tech: "Gartner 2026：智能体AI为头号具名技术趋势", watch: "自主决策的治理与责任框架" },
    { t: "欧盟可持续监管落地", happening: "CBAM于2026-01-01进入付费阶段；CSRD范围被《综合指令》(EU) 2026/470收窄",
      cost: "钢铁、铝、水泥、化肥进口的碳成本进入落地成本科目",
      network: "供应商排放数据成为采购标准；范围三数据竞赛",
      tech: "碳核算与SCM套件合流；审计追踪被要求", watch: "CBAM向下游产品扩展的审议" },
    { t: "劳动力与人才挤压", happening: "58%的企业称人才是头号挑战（MHI 2026）；美国约37万个仓储岗位空缺",
      cost: "仓储工资以中个位数上涨；紧张都市圈有留任溢价",
      network: "自动化ROI如今靠劳动力稀缺立论，而非仅靠吞吐",
      tech: "机器人与WES采用提前；电商履约中的协作机器人", watch: "移民政策；旺季工资脉冲" },
  ],
  odds: [
    { name: "软着陆正常化", bound: "基准情景——需求稳住，运价缓降，无新增冲击",
      ev: "货量恢复中；WCI脱离高点；库存再平衡完成；资本开支纪律维持" },
    { name: "关税升级第二波", bound: "行业性关税扩大；报复；落地成本冲击重定价网络",
      ev: "美欧政治日程；豁免谈判停滞；抢跑式进口脉冲" },
    { name: "运力过剩运价战", bound: "苏伊士全面复航 + 创纪录新船交付淹没运力；即期价崩塌",
      ev: "订单簿/船队比处高位；红海正常化中；承运人定价纪律脆弱" },
    { name: "黑天鹅供应冲击", bound: "霍尔木兹、台海、网络或气候事件切断关键动脉",
      ev: "咽喉要道集中度上升；保险定价缓步抬升；单点故障已绘制" },
  ],
  verdict: {
    left_w: ["成本逻辑仍在——离岸经济性能扛住15%关税", "AI生产率真实——智能体工具削减计划与异常成本", "货运周期自筑底——承运人纪律+拆船托住运价"],
    right_w: ["关税是结构——政策重构以十年计，非昙花一现", "51% CSCO试点智能体——能力鸿沟快速复利", "韧性已成预算——多源采购进入董事会科目", "碳有了现金价——CBAM让排放进入落地成本", "人才稀缺——37万岗位空缺倒逼自动化，无论周期"],
    triggers: ["美欧关税复审扩大行业覆盖", "苏伊士全面复航重灌运力 → 运价战考验", "智能体AI治理框架成文（欧盟AI法案指引）"],
    falsify: ["WCI综合指数连续8周低于2,000美元（需求失守）", "美国仓储就业同比转负（自动化过度）", "平均关税回滚至10%以下（政策逆转）"],
  },
  nearshore: [
    { panel: "新供应基地", lab: "埃及纺织服装出口同比（2026上半年）", sub: "越南+22% · 墨西哥近岸FDI+31% · 印度PLI驱动电子+18%【据官方发布推算】" },
    { panel: "机器人密度", lab: "2026年预计工业机器人年装机量", sub: "2024年装机54.2万台（IFR）；回岸遇上劳动力稀缺，机队创纪录" },
    { panel: "美国仓储缺口", lab: "美国仓储与存储业空缺岗位", sub: "MHI 2026：58%的受访企业将招聘/留任列为头号挑战" },
    { panel: "AI在岗", lab: "日常使用AI的供应链员工（MHI 2026）", sub: "2024年约为20%；智能体AI被Gartner列为2026年头号趋势" },
  ],
  phase: { names: ["危机", "复苏", "重构", "AI建设期", "下一周期"], curName: "重构 + AI建设期" },
  globe_nodes: { suez: "苏伊士", hormuz: "霍尔木兹", panama: "巴拿马", rotterdam: "鹿特丹", ny: "纽约", la: "洛杉矶", shanghai: "上海" },
  timeline: [
    { t: "胡塞袭击开始", note: "曼德海峡袭击迫使大规模绕行好望角；亚欧运价数周内翻三倍" },
    { t: "美英空袭也门", note: "升级锁定绕行；苏伊士通行量下跌约60%" },
    { t: "巴尔的摩大桥坍塌", note: "美东运力冲击；滚装与散货改道数月" },
    { t: "欧盟CBAM过渡登记全面运行", note: "隐含排放报告在付费阶段前收紧" },
    { t: "美东码头罢工（3天）", note: "1977年以来首次全海岸罢工；自动化条款推迟至2027" },
    { t: "美国关税计划公布", note: "对等关税框架触发抢跑式进口脉冲" },
    { t: "“解放日”关税", note: "政策冲击顶点；WCI剧烈反复；订舱先冻结后激增" },
    { t: "霍尔木兹保险重定价", note: "以伊交火；海湾通行战争风险保费飙升" },
    { t: "中美港口费休战", note: "相互港口费暂停12个月；跨太平洋企稳" },
    { t: "CBAM付费阶段启动", note: "证书开始缴纳——碳成为落地成本科目" },
    { t: "《综合指令》(EU) 2026/470", note: "CSRD范围收窄约80%；CSDDD推迟至2029并提高门槛" },
    { t: "马士基MECL航线复航苏伊士", note: "首个结构性回归；全面复航仍有条件" },
    { t: "Gartner供应链Top 25（2026）", note: "施耐德电气蝉联第1；AI编排成为决定性差异化" },
    { t: "WCI 3,549美元（周环比+3%）", note: "关税抢跑遇上运力消化，Drewry综合指数维持高位区间" },
    { t: "美欧15%关税框架生效", note: "对欧盟商品15%基准关税；行业性豁免继续谈判" },
    { t: "本报告市场快照", note: "12家供应链股票面板，Yahoo Finance 2026-07-17收盘" },
  ],
  gates: [
    { n: "数据质量与集成", basis: "智能体按数据行动；主数据差 = 自主决策错", score: 9, bypass: null, hot: true },
    { n: "治理与责任", basis: "智能体订错舱，谁来签字？欧盟AI法案指引待定", score: 8, bypass: "高价值决策采用人在环分级" },
    { n: "遗留系统债务", basis: "2010年代的ERP/TMS难以挂载智能体；中间件可桥接", score: 7, bypass: "在遗留核心之上叠加平台（o9、Kinaxis式）" },
    { n: "人才与变革", basis: "58%将人才列为头号挑战；计划员转型异常监督员", score: 6, bypass: "先协作式辅助上线，再走向全自主" },
    { n: "安全与知识产权", basis: "多层级供应商数据进入共享模型，泄漏风险上升", score: 5, bypass: "私有化模型实例、联邦学习" },
    { n: "预算", basis: "最便宜的约束：智能体工具日益按工作流SaaS计价", score: 3, bypass: "运费审计与计划试点回本<12个月" },
  ],
};

// ── Sources register CN mirror (applied in main.js, which loads after sources.js) ──
window.SRCS_CN = {
  K1:  { fact: "SCM软件市场 353亿美元（2025）→ 392亿美元（2026），复合增速+10.7%，2035年预计976亿美元", cite: "行业规模测算汇编（Precedence/Fortune Business Insights 共识区间），2026年版" },
  K2:  { fact: "全球物流市场 ≈ 11.97万亿美元（2025）；3PL板块 ≈ 1.8万亿美元", cite: "物流市场研究共识（Grand View / Armstrong & Associates 式估计），2026年展望版" },
  K3:  { fact: "WTO：世界货物贸易量增速 +1.9%（2026预测），因关税冲击下调", cite: "WTO《全球贸易展望与统计》，2026年4月" },
  K4:  { fact: "Drewry世界集装箱指数综合值 3,549美元/40英尺箱，周环比+3%；上海→纽约 5,870美元（+7%）、→洛杉矶 4,683美元（+3%）、→鹿特丹 3,768美元（+5%）、→热那亚 5,139美元（+1%）", cite: "Drewry WCI 每周评估，2026年6月11日" },
  K5:  { fact: "仓储自动化市场 ≈ 290亿美元（2025），复合增速15%左右；订单周期回升中", cite: "仓储自动化市场研究共识，2026年版" },
  K6:  { fact: "IFR：2024年工业机器人装机54.2万台；2026年装机量跟踪在70万台以上", cite: "国际机器人联合会《世界机器人》2025/2026更新" },
  K7:  { fact: "美欧关税框架生效：对欧盟商品15%基准关税；行业性豁免谈判中", cite: "欧盟委员会 / USTR 联合框架声明，2026年7月" },
  K8:  { fact: "苏伊士通行量较危机前低约60%；马士基于2026-03-20复航一条MECL航线；多数运力仍绕好望角（+10–14天）", cite: "承运人公告（马士基）与苏伊士运河管理局通行统计，汇编于2026年6月" },
  K9:  { fact: "CBAM于2026-01-01进入付费阶段；CSRD范围被《综合指令》(EU) 2026/470收窄约80%；CSDDD推迟至2029", cite: "《欧盟官方公报》，指令 (EU) 2026/470；欧盟CBAM实施时间表" },
  K10: { fact: "51%的CSCO正在试点或部署智能体AI；智能体AI被Gartner列为2026年供应链头号技术趋势", cite: "Gartner《供应链技术趋势2026》；CSCO调研汇编，2026年5月" },
  K11: { fact: "MHI 2026：41%的供应链员工日常使用AI；58%将人才列为头号挑战；美国约37万个仓储岗位空缺", cite: "MHI年度行业报告 2026（与德勤合作），2026年3月" },
  K12: { fact: "Gartner供应链Top 25（2026）：施耐德电气第1（5.82）、英伟达第2（5.79）、沃尔玛第3（5.51）", cite: "Gartner供应链Top 25，2026年版" },
  K13: { fact: "Drewry WCI方法论：8条主要东西航线的40英尺箱即期运价", cite: "Drewry Supply Chain Advisors，WCI方法论说明" },
  K14: { fact: "埃及纺织服装出口同比+73%（2026上半年）；越南+22%；墨西哥近岸FDI+31%", cite: "各国贸易统计与出口委员会发布，汇编于2026年6月" },
  K15: { fact: "马士基MECL航线结构性恢复苏伊士通行，为首家承运人", cite: "A.P. 穆勒–马士基客户公告，2026年3月20日" },
  K16: { fact: "海运订单簿/船队比接近周期高位；2026–27年交付量创TEU纪录", cite: "券商研究汇编（Clarksons/Alphaliner 转述），2026年5月" },
  K17: { fact: "巴拿马运河吃水限制放宽；通行槽位正常化", cite: "巴拿马运河管理局通告，2026年1月" },
  K18: { fact: "霍尔木兹海峡：全球约20%的石油液体经此通过；2025-06交火后战争险重新定价", cite: "EIA咽喉要道统计；海事保险市场纪要，2026年6月" },
  K19: { fact: "情景概率为主观研究判断，非市场隐含赔率", cite: "本报告研究汇编与情景框架" },
  K20: { fact: "WCI上周值由已发布周环比反推【推算】", cite: "基于K4推算；方法说明见§3" },
  K21: { fact: "12家供应链股票面板：价格、日涨跌、年初至今、市值、市盈率、股息率、52周区间", cite: "Yahoo Finance（经数据插件），2026-07-17收盘；DHL.DE 与 MAERSK-B.CO 为2026-07-16收盘" },
  K22: { fact: "实时行情刷新使用 stooq.com CSV 接口，失败时回退快照", cite: "实现说明——见§3刷新组件" },
  K23: { fact: "ILA/USMX 自动化条款推迟至2027年主合同谈判", cite: "ILA–USMX 联合声明，汇编于2026年4月" },
  K24: { fact: "关税生效日前的抢跑式进口脉冲扭曲跨太平洋货量", cite: "洛杉矶/纽约港吞吐量统计与承运人评论，2026年6月" },
};

// T(): translate an exact English chart string; falls back to English.
window.T = s => (CN && DICT[s]) || s;

// ── Apply the data-layer mirror before any chart script runs ──
if (CN && window.RPT) {
  const R = RPT, C = RPT_CN;
  R.market_snap.forEach(d => { if (C.market_snap_names[d.key]) d.name = C.market_snap_names[d.key]; });
  R.wci.lanes.forEach((l, i) => { if (C.wci_lanes[i]) { l.lane = C.wci_lanes[i].lane; l.note = C.wci_lanes[i].note; } });
  R.market_size.adjacents.forEach((a, i) => { if (C.adjacents[i]) { a.name = C.adjacents[i].name; a.note = C.adjacents[i].note; } });
  R.trends.forEach((t, i) => { if (C.trends[i]) { t.theme = C.trends[i].theme; t.items = C.trends[i].items; } });
  R.hot_topics.forEach((t, i) => { if (C.hot_topics[i]) Object.assign(t, C.hot_topics[i]); });
  R.odds.forEach((o, i) => { if (C.odds[i]) Object.assign(o, C.odds[i]); });
  R.verdict.left_w = C.verdict.left_w; R.verdict.right_w = C.verdict.right_w;
  R.verdict.triggers = C.verdict.triggers; R.verdict.falsify = C.verdict.falsify;
  R.nearshore.forEach((p, i) => { if (C.nearshore[i]) Object.assign(p, C.nearshore[i]); });
  R.phase.names = C.phase.names; R.phase.curName = C.phase.curName;
  R.globe_nodes.forEach(n => { if (C.globe_nodes[n.id]) n.name = C.globe_nodes[n.id]; });
  R.timeline.forEach((e, i) => { if (C.timeline[i]) { e.t = C.timeline[i].t; e.note = C.timeline[i].note; } });
  document.documentElement.lang = "zh-CN";
  document.title = "供应链 2026 · 交互研究版";
  const md = document.querySelector('meta[name="description"]');
  if (md) md.setAttribute("content", "2026年年中的供应链管理：390亿美元的软件市场正围绕智能体AI重建，而关税、咽喉要道与碳定价正在重构它所规划的实体网络。");
}

// ── Swap static prose ([data-cn]) + wire the language toggle ──
document.addEventListener("DOMContentLoaded", () => {
  if (CN) {
    document.querySelectorAll("[data-cn]").forEach(el => { el.innerHTML = el.dataset.cn; });
    document.querySelectorAll("title[data-cn]").forEach(el => { document.title = el.dataset.cn; });
  }
  const btn = document.getElementById("lang-toggle");
  if (btn) {
    btn.textContent = CN ? "EN" : "中文";
    btn.setAttribute("aria-label", CN ? "Switch to English" : "切换到中文");
    btn.addEventListener("click", () => {
      try { localStorage.setItem("scm-lang", CN ? "en" : "cn"); } catch (e) {}
      location.reload();
    });
  }
});
