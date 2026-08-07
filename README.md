<!-- BADGES -->
<div align="center">

![Static](https://img.shields.io/badge/type-static%20site-051c2c?style=flat-square)
![No Framework](https://img.shields.io/badge/framework-none-2251ff?style=flat-square)
![D3.js](https://img.shields.io/badge/D3.js-v7-f9a03b?style=flat-square&logo=d3.js&logoColor=white)
![Bilingual](https://img.shields.io/badge/i18n-EN%20%2F%20%E4%B8%AD%E6%96%87-008a6d?style=flat-square)
![License: Code MIT](https://img.shields.io/badge/license%20(code)-MIT-b07a10?style=flat-square)
![License: Content CC BY--NC 4.0](https://img.shields.io/badge/license%20(content)-CC%20BY--NC%204.0-008a6d?style=flat-square)

</div>

<!-- ANIMATED HERO SVG -->
<p align="center">
  <img src="assets/hero.svg" alt="Global Supply Chain 2026 · 全球供应链 2026 — animated container ship hero" width="880" />
</p>

<div align="center">
  <h1>Global Supply Chain 2026 · 全球供应链 2026</h1>
  <p><b>Industry Research Brief — Logistics, Software &amp; Automation</b><br/>行业研究简报 — 物流、软件与自动化</p>
  <p><a href="#english"><b>English</b></a> · <a href="#中文"><b>中文</b></a></p>
</div>

---

<a id="english"></a>

# English

## Overview

This repository contains a **fully self-contained interactive research report** on the global supply chain management industry at mid-2026. It is not a web app framework — it is a single editorial product: hand-built HTML, vanilla JavaScript, and D3.js visualizations, bundled into one portable HTML file.

The report examines three layers of the supply chain industry:

| Layer | What it is | Size | Growth |
|:------|:-----------|:-----|:-------|
| **Physical** | Ships, ports, warehouses, trucks | **$11.97T** | Cyclical |
| **Planning** | SCM software (planning, execution, WMS/TMS) | **$39.2B** (2026) | **+10.7% CAGR** |
| **Automation** | Warehouse robotics & automation | **~$29B** | Mid-teens CAGR |

The physical network is being **re-priced by policy** — a 15% EU–US tariff baseline, a half-blockaded Suez Canal, and carbon that now carries a cash cost. The planning layer is being **rebuilt around agentic AI**, with 51% of chief supply-chain officers already piloting autonomous decision agents.

---

## Report structure

The report unfolds in seven sections, each with prose, interactive charts, and click-to-drill data:

| § | Section | What it covers |
|:--|:--------|:---------------|
| **Cover** | Container-ship engine | Four animated cover variants (yard recursion, ship layers, blueprint, unboxing) |
| **§0** | Key findings | The eight hardest numbers, hung on a ship at their real measurement sites |
| **§1** | Industry overview | Market sizing, adjacent-markets table, Gartner Top 25 |
| **§2** | Industry dynamics | 32-month timeline from first Houthi attack to EU–US tariff framework |
| **§3** | Market performance | 12-entity equity panel marked to Jul 17 + live refresh + WCI freight lanes |
| **§4** | Hot topics | Five debates graded on heat and consequence |
| **§5** | Key trends | Gartner 2026 tech radar, adoption gates, nearshoring, scenario odds |
| **§6** | Verdict | A physical scale weighing the structural-rewiring case vs. status quo |
| **Sources** | Method & sources | 24-anchor register (K1–K24), evidence grading, measurement discipline |

---

## Tech stack

```
Frontend        Vanilla HTML / CSS / JavaScript (no framework, no build step)
Visualization   D3.js v7 · TopoJSON · HTML Canvas
Bundling        Python 3 script (bundle.py → dist-single.html)
Data            Inline JSON in data.js (no backend, no database)
Live quotes     stooq.com public CSV endpoints (no API key)
i18n            Custom bilingual system (EN / 中文) with runtime toggle
Fonts           ET Book (base64-inlined, CSP-safe)
```

**Zero dependencies at runtime** — `vendor/` ships d3.min.js and topojson-client.min.js. Everything else is hand-rolled.

---

## Project layout

```
supply-chain-research-kimiagent/
├── index.html              # Entry point — loads all sections, scripts, styles
├── bundle.py               # Bundles everything into a single dist-single.html
├── dist-single.html        # Pre-bundled single-file artifact (752 KB)
├── .gitignore
├── css/
│   ├── style.css           # Base theme: white surface / deep-navy ink / electric-blue
│   └── fonts.css           # ET Book font, base64-inlined
├── js/
│   ├── data.js             # Market data, Top 25, adjacent markets (inline JSON)
│   ├── sources.js          # 24-anchor source register (K1–K24)
│   ├── i18n.js             # Bilingual EN/CN translation system
│   ├── utils.js            # Shared utilities (drill card, frame builder)
│   ├── cover.js            # Cover artwork A — container-ship yard recursion
│   ├── cover-exploded.js   # Cover artwork B — ship in layers
│   ├── cover-wire.js       # Cover artwork C/D — blueprint & unboxing
│   ├── chart-ship.js       # §0 — ship diagram with 8 key numbers
│   ├── chart-iso.js        # §1 — industry isometric sizing chart
│   ├── chart-timeline.js   # §2 — 32-month event timeline
│   ├── chart-live.js       # §3 — live stock quote refresh widget
│   ├── chart-multi.js      # §3 — 12-entity equity panel
│   ├── chart-wci.js        # §3 — Drewry WCI freight rate lanes
│   ├── chart-dom.js        # §4 — hot topics heatmap
│   ├── chart-verdict.js    # §6 — verdict scale visualization
│   └── dashboard.js        # Right-rail cycle dashboard + world map
└── vendor/
    ├── d3.min.js            # D3.js v7
    ├── topojson-client.min.js
    └── world-land-110m.json # World map topology (110m resolution)
```

---

## Getting started

### Option A — Open directly

```bash
# Clone the repository
git clone https://github.com/SummerPapaya/supply-chain-research-kimiagent.git
cd supply-chain-research-kimiagent

# Open in any browser
open index.html          # macOS
xdg-open index.html      # Linux
start index.html         # Windows
```

### Option B — Serve locally (recommended for live data)

```bash
# Python 3
python3 -m http.server 8000

# Then visit http://localhost:8000
```

> The live quote refresh widget (§3) fetches from `stooq.com` — this may be blocked by CORS when opening `index.html` via `file://`. Use a local server for the full experience. When unreachable, it **honestly falls back** to the verified Jul 17 snapshot with a visible label.

### Option C — Use the pre-bundled single file

`dist-single.html` is a complete 752 KB self-contained artifact — all CSS, JS, fonts, and map data inlined. Open it anywhere, no server needed.

### Rebuild the bundle

```bash
python3 bundle.py                 # → dist-single.html
python3 bundle.py custom.html     # → custom.html
```

---

## Design language

The report follows a strict editorial design system:

| Token | Value | Usage |
|:------|:------|:------|
| `--paper` | `#ffffff` | Page background |
| `--ink` | `#051c2c` | Primary text (deep navy) |
| `--red` | `#2251ff` | Electric blue accent (emphasis, active states) |
| `--green` | `#008a6d` | Positive values |
| `--neg` | `#c22f4e` | Negative / risk |
| `--gold` | `#b07a10` | Derived / flagged data |
| `--serif` | ET Book | Body text & headings |
| `--mono` | Menlo / Consolas | Data labels, numbers, metadata |

**Principles:** white surfaces, no card shadows on prose, magazine-style term columns, borderless right rail, click-to-drill on every data point, honestly-labeled fallbacks.

---

## Data & methodology

- **Market data** marked to the **2026-07-17 close** (DHL.DE & MAERSK-B.CO: 2026-07-16, their last exchange sessions)
- **YTD indexes** are weekly closes rebased to 100 at the first 2026 weekly close
- **WCI prior-week values** back-computed from published week-on-week percentages — flagged as `[derived]`
- **Scenario probabilities** are subjective research judgments, not market-implied odds
- **Source register** (K1–K24) documents every number the report leans on, with dated sources classified by tier: company disclosure, broker research, industry & official, research compilation
- **No ratings, no price targets, no investment advice**

---

## Live data

The §3 refresh widget pulls real-time stock quotes from **stooq.com** — a public CSV endpoint requiring **no API key and no authentication**. It covers 12 entities:

```
UPS · FDX · DHL.DE · EXPD · CHRW · JBHT · XPO · GXO · ZIM · MAERSK-B.CO · MANH · ^SPX
```

Behavior:
- 9-second timeout per request
- Results cached to `localStorage` (`scm-live`)
- On failure: **visible label** says "LIVE ENDPOINT UNREACHABLE — SHOWING VERIFIED SNAPSHOT" and falls back to the Jul 17 close
- **Never silently** substitutes stale data

---

## Internationalization

The report is **bilingual** — English and Chinese (中文) — with a runtime toggle (top-right button). Every text string, chart label, and source citation has a paired translation. The choice persists in `localStorage` as `scm-lang`.

---

## Browser support

| Browser | Status |
|:--------|:-------|
| Chrome 90+ | ✅ Full |
| Firefox 88+ | ✅ Full |
| Safari 15+ | ✅ Full |
| Edge 90+ | ✅ Full |
| Mobile Safari | ⚠️ Charts render; layout optimized for desktop |
| IE 11 | ❌ Not supported (uses ES6+, Canvas, IntersectionObserver) |

---

## License

This project is **dual-licensed**:

| What | License | File |
|:-----|:--------|:-----|
| **Source code** (HTML, CSS, JS, `bundle.py`) | [MIT](https://opensource.org/licenses/MIT) | [LICENSE](LICENSE) |
| **Report content** (research text, data, chart designs, `dist-single.html`) | [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/) | [LICENSE-CONTENT](LICENSE-CONTENT) |

You may freely reuse the code, including commercially. You may share and adapt the report content **non-commercially** with attribution.

---

<a id="中文"></a>

# 中文

## 项目概览

本仓库包含一份**完全自包含的交互式研究报告**，聚焦2026年年中的全球供应链管理行业。它不是 Web 应用框架——而是一个完整的编辑产品：手工编写的 HTML、原生 JavaScript 和 D3.js 可视化，打包为一个可移植的 HTML 文件。

报告审视了供应链行业的三个层级：

| 层级 | 定义 | 规模 | 增速 |
|:-----|:-----|:-----|:-----|
| **实体层** | 船舶、港口、仓库、卡车 | **$11.97T** | 周期性 |
| **计划层** | SCM软件（计划、执行、仓储/运输管理） | **$39.2B**（2026） | **+10.7% 复合增速** |
| **自动化层** | 仓储机器人与自动化 | **约$29B** | 复合增速15%左右 |

实体网络正被**政策重新定价**——15%的美欧基准关税、半封锁的苏伊士运河、以及如今带有现金成本的碳排放。计划层正围绕**智能体AI**重构，51%的首席供应链官已在试点自主决策代理。

---

## 报告结构

报告分为七个章节，每个章节包含叙事文本、交互图表和点击下钻数据：

| § | 章节 | 内容概述 |
|:--|:-----|:---------|
| **封面** | 集装箱船引擎 | 四种动画封面变体（堆场递归、船体分层、蓝图线框、开箱） |
| **§0** | 核心发现 | 八个最硬的数字，挂在船体上真实会被读取的位置 |
| **§1** | 行业综述 | 市场规模、相邻市场表、Gartner Top 25 |
| **§2** | 行业动态 | 从胡塞武装首次袭击到美欧关税框架的32个月时间线 |
| **§3** | 市场表现 | 12只股票面板（标记至7月17日）+ 实时刷新 + WCI运价航线 |
| **§4** | 热门议题 | 五大辩论，按热度与后果评级 |
| **§5** | 重点趋势 | Gartner 2026技术雷达、采用门槛、近岸外包、情景赔率 |
| **§6** | 结论 | 一架天平，称量结构性重构论点与现状论点 |
| **来源** | 方法与来源 | 24条锚点来源登记册（K1–K24）、证据分级、测量纪律 |

---

## 技术栈

```
前端            原生 HTML / CSS / JavaScript（无框架、无构建步骤）
可视化          D3.js v7 · TopoJSON · HTML Canvas
打包            Python 3 脚本（bundle.py → dist-single.html）
数据            data.js 内联 JSON（无后端、无数据库）
实时行情        stooq.com 公开 CSV 接口（无需 API 密钥）
国际化          自定义双语系统（EN / 中文），运行时切换
字体            ET Book（base64 内联，CSP 安全）
```

**运行时零外部依赖** — `vendor/` 仅包含 d3.min.js 和 topojson-client.min.js，其余全部手写。

---

## 项目结构

```
supply-chain-research-kimiagent/
├── index.html              # 入口——加载所有章节、脚本、样式
├── bundle.py               # 将所有内容打包为单个 dist-single.html
├── dist-single.html        # 预打包单文件产物（752 KB）
├── .gitignore
├── css/
│   ├── style.css           # 基础主题：白色表面 / 深海军蓝墨色 / 电蓝色
│   └── fonts.css           # ET Book 字体，base64 内联
├── js/
│   ├── data.js             # 市场数据、Top 25、相邻市场（内联 JSON）
│   ├── sources.js          # 24条锚点来源登记册（K1–K24）
│   ├── i18n.js             # 中英双语翻译系统
│   ├── utils.js            # 共享工具（下钻卡片、框架构建器）
│   ├── cover.js            # 封面动效 A——集装箱堆场递归
│   ├── cover-exploded.js   # 封面动效 B——船体分层
│   ├── cover-wire.js       # 封面动效 C/D——蓝图与开箱
│   ├── chart-ship.js       # §0——带8个关键数字的船体图
│   ├── chart-iso.js        # §1——行业等距规模图
│   ├── chart-timeline.js   # §2——32个月事件时间线
│   ├── chart-live.js       # §3——实时股票行情刷新组件
│   ├── chart-multi.js      # §3——12只股票面板
│   ├── chart-wci.js        # §3——Drewry WCI 运价航线
│   ├── chart-dom.js        # §4——热门议题热力图
│   ├── chart-verdict.js    # §6——结论天平可视化
│   └── dashboard.js        # 右栏周期仪表盘 + 世界地图
└── vendor/
    ├── d3.min.js            # D3.js v7
    ├── topojson-client.min.js
    └── world-land-110m.json # 世界地图拓扑（110m 分辨率）
```

---

## 快速开始

### 方式 A — 直接打开

```bash
# 克隆仓库
git clone https://github.com/SummerPapaya/supply-chain-research-kimiagent.git
cd supply-chain-research-kimiagent

# 在浏览器中打开
open index.html          # macOS
xdg-open index.html      # Linux
start index.html         # Windows
```

### 方式 B — 本地服务器（推荐，支持实时数据）

```bash
# Python 3
python3 -m http.server 8000

# 然后访问 http://localhost:8000
```

> §3 的实时行情刷新组件从 `stooq.com` 拉取数据——通过 `file://` 直接打开 `index.html` 时可能被 CORS 阻止。使用本地服务器可获得完整体验。当端点不可达时，组件会**诚实地回退**到7月17日的已验证快照，并显示可见标签。

### 方式 C — 使用预打包单文件

`dist-single.html` 是一个 752 KB 的完整自包含文件——所有 CSS、JS、字体和地图数据已内联。在任何地方打开，无需服务器。

### 重新打包

```bash
python3 bundle.py                 # → dist-single.html
python3 bundle.py custom.html     # → custom.html
```

---

## 设计语言

报告遵循严格的编辑设计系统：

| 变量 | 色值 | 用途 |
|:-----|:-----|:-----|
| `--paper` | `#ffffff` | 页面背景 |
| `--ink` | `#051c2c` | 正文（深海军蓝） |
| `--red` | `#2251ff` | 电蓝色强调（强调、激活状态） |
| `--green` | `#008a6d` | 正值 |
| `--neg` | `#c22f4e` | 负值 / 风险 |
| `--gold` | `#b07a10` | 推算 / 标注数据 |
| `--serif` | ET Book | 正文与标题 |
| `--mono` | Menlo / Consolas | 数据标签、数字、元数据 |

**原则：** 白色表面、正文无卡片阴影、杂志式术语栏、无边框右栏、每个数据点可点击下钻、诚实标注的回退。

---

## 数据与方法

- **市场数据**标记至 **2026年7月17日收盘价**（DHL.DE 与 MAERSK-B.CO：2026-07-16，为其最后交易日）
- **YTD指数**为每周收盘价，以2026年首个周收盘价重定基为100
- **WCI 前周数值**由已发布的环比百分比反推——标注为 `[derived]`
- **情景概率**是主观研究判断，不是市场隐含赔率
- **来源登记册**（K1–K24）记录报告依赖的每个数字，注明日期的来源按层级分类：公司披露、券商研究、行业与官方、研究汇编
- **无评级、无目标价、不构成投资建议**

---

## 实时数据

§3 刷新组件从 **stooq.com** 拉取实时股票报价——公开 CSV 接口，**无需 API 密钥、无需认证**。覆盖12个标的：

```
UPS · FDX · DHL.DE · EXPD · CHRW · JBHT · XPO · GXO · ZIM · MAERSK-B.CO · MANH · ^SPX
```

行为：
- 每次请求超时9秒
- 结果缓存到 `localStorage`（`scm-live`）
- 失败时：**可见标签**显示"实时端点不可达——显示已验证快照"，并回退至7月17日收盘价
- **绝不静默**替换过期数据

---

## 国际化

报告支持**双语**——英文与中文——通过右上角按钮运行时切换。每个文本字符串、图表标签和来源引用都有配对翻译。选择持久化到 `localStorage` 的 `scm-lang`。

---

## 浏览器支持

| 浏览器 | 状态 |
|:-------|:-----|
| Chrome 90+ | ✅ 完整支持 |
| Firefox 88+ | ✅ 完整支持 |
| Safari 15+ | ✅ 完整支持 |
| Edge 90+ | ✅ 完整支持 |
| 移动端 Safari | ⚠️ 图表可渲染；布局针对桌面优化 |
| IE 11 | ❌ 不支持（使用 ES6+、Canvas、IntersectionObserver） |

---

## 开源协议

本项目采用**双许可**：

| 对象 | 许可协议 | 文件 |
|:-----|:---------|:-----|
| **源代码**（HTML、CSS、JS、`bundle.py`） | [MIT](https://opensource.org/licenses/MIT) | [LICENSE](LICENSE) |
| **报告内容**（研究文本、数据、图表设计、`dist-single.html`） | [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/deed.zh-hans) | [LICENSE-CONTENT](LICENSE-CONTENT) |

代码可自由使用（包括商业用途）；报告内容可**非商业**地共享与演绎，但须署名。

---

<div align="center">
  <sub>Interactive research edition · Compiled 2026-07-19 · No investment advice</sub>
  <br/>
  <sub>交互研究版 · 编纂于2026-07-19 · 不构成投资建议</sub>
  <br/>
  <sub>Evidence graded: company primary &gt; cross-check &gt; broker relay &gt; derived [flagged] · 证据分级：公司一手披露 &gt; 交叉核验 &gt; 券商转述 &gt; 推算值[标注]</sub>
</div>
