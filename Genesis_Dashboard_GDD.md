# 游戏策划书：《创世面板》 (Genesis Dashboard) - 完整开发级 GDD

> [!IMPORTANT]
> 本文档为《创世面板》(Genesis Dashboard) 的最终、详尽设计规范。所有公式、布局和数据结构均已具体化，开发团队可直接依据本文档进行底层代码构建与UI搭建。

---

## 1. 游戏架构与核心主题 (Architecture & Core Theme)

*   **游戏类型**：硬核科幻放置类游戏 (Hard Sci-Fi Idle/Incremental Game)。
*   **交互形式**：业务数据监控大屏 (BI Dashboard) 交互。玩家不仅是被动监控者，还可以通过**底层算力直连（鼠标连击拓扑核心）**和**战略引导矩阵（动态目标系统）**主动介入宇宙进程。
*   **哲学内核**：热力学第二定律（目标：抵抗系统熵增）、费米悖论（跨越各种大过滤器危机）、模拟假说（打破第四面墙的Meta元素）。
*   **多语言支持 (i18n)**：原生支持硬核科幻英语与深度本地化中文的无缝切换。
*   **美术风格**：以纯黑（#0b0c10）为主背景，霓虹青（#66fcf1）、深灰（#1f2833）与警告红（#ff3b30）为数据点缀。采用等宽字体（Monospace, 如 `Fira Code`）。

---

## 2. 界面与HUD布局规范 (UI & HUD Layout Specifications)

界面采用高科技数据中心墙的“多窗口/多面板”仪表盘布局（类似Grafana或Kibana大屏）。无任何拟物化的图形，全由点、线、数字、文本日志构成。

### 2.1 整体布局 (Grid System)
屏幕分为四大功能区域：
*   **Top Bar (全局监控头)**：宽100%，高10%。显示【当前宇宙纪元】、【总生存时间(Tick)】、【系统总熵值 (Entropy Level - 红色进度条)】。
*   **Left Panel (CLI日志终端)**：宽25%，位居左侧。以黑客帝国的风格不断向下滚动输出宇宙事件日志。
*   **Center Panel (主视图网络拓扑)**：宽50%，位居中央。一个基于 D3.js 或 WebGL 的动态节点连接图，代表当前宇宙的亮度和文明分布。
*   **Right Panel (干涉与升级控制台)**：宽25%，位居右侧。玩家进行数值点击、购买升级、干预法则的操作区。

### 2.2 核心面板机制详述
*   **中心拓扑图 (Central Topology Visual)**：
    *   **动态演进视觉**：初始为一个可点击的“奇点核心”。随着玩家点击（手动压缩），核心会发生交互闪烁。当宇宙突破极点进入新纪元时，外围会动态生成复杂的自转测地线轨道（Orbit Rings），直观展示宇宙复杂度的提升。
*   **战略引导矩阵 (System Directive)**：
    *   位于右侧控制台顶部。作为一个内置的AI副官，实时扫描当前宇宙参数（E, N, S, Epoch），为玩家下达动态发展目标，并在熵值过高（热寂临近）时发出致命红界警告。
*   **终端日志 (CLI Observer Terminal)**：
    *   玩家的每一次重大动作（微调引力、注入秩序、物理坍缩）都会在左侧终端输出充满哲学意味的双语反馈日志（e.g., *"[SYS] 注入秩序... 熵力反抗，但晶格结构开始显现。"*），增强创世沉浸感。

---

## 3. 数值循环与计算公式 (Mechanics & Mathematical Formulas)

游戏底层按 `Tick` 运行（建议基础 1 Tick = 0.1秒）。

### 3.1 核心资源库 (Resource Definitions)
以结构体 `PlayerResources` 存储：
1.  **$E$ (Energy / 原初能量)**：最基础的流通货币。随时间自增。
2.  **$S$ (Entropy / 熵值)**：负面属性。随总时间、操作和宇宙膨胀而增加。当 $S$ 达到上限 $S_{max}$，触发“热寂”，游戏强制重置。
3.  **$N$ (Negentropy / 负熵)**：高级代币，用于延缓熵增、孕育生命。由玩家主动将 $E$ 进行“编码转化”得到。
4.  **$I$ (Intervention / 干涉算力)**：稀缺代币，仅通过极低概率随机产出或牺牲 $N$ 获得。用于解决“大过滤器危机”。
5.  **$A$ (Akashic Records / 阿卡西记录)**：威望/转生系统代币。

### 3.2 基础产出与交互公式 (Production & Interaction)
*   **手动原力聚变 (Manual Compression)**：
    玩家每次点击中心拓扑球体，可立即获得相当于基础产出 10 秒当量的能量爆增：
    $$ Click_{power} = E_{base} \times (1 + M_{exp}) \times 10 \times \max(1, \log_{10}(10 + N)) $$
    
*   **能量被动产出 (Passive Energy Generation)**：
    $$ \frac{dE}{dt} = E_{base} \times (1 + M_{exp}) \times \log_{10}(10 + N) $$
    > $E_{base}$ 为基础获取率，$M_{exp}$ 为宇宙膨胀系数（随升级提升），$N$ 为负熵（提供全局加成）。

*   **系统熵增 (Entropy Accumulation)**：
    $$ \frac{dS}{dt} = S_{base\_rate} \times (1 + M_{exp}) - \sqrt{N} \times \text{Efficiency} $$
    > 玩家必须不断生产负熵 $N$ 来对抗持续增加的系统熵 $S$。如果 $\frac{dS}{dt} > 0$ 且积攒到阈值，宇宙消亡。

*   **负熵合成 (Negentropy Synthesis)**：
    面板提供一个按钮：“秩序注入”。
    每次点击消耗 $C_E$ 能量，产出 1 点 $N$。成本呈指数递增：
    $$ C_E = 10 \times (1.15)^{N_{count}} $$

### 3.3 复杂性网络建设 (Upgrades Tree)
在右侧面板通过消耗 $E$ 和 $N$ 购买“法则底层权限”升级：
1.  **引力常数微调 (Tweak Gravitational Constant)**：提升 $M_{exp}$（宇宙膨胀系数），代价是加速熵增。
2.  **碳基分子模组 (Carbon-based Modules)**：减缓熵增系数 `Efficiency`。
3.  **深层神经算力 (Deep Neural Processing)**：每次点击“秩序注入”有 $0.01\%$ 几率获得 1 点 $I$ (干涉算力)。

---

## 4. 事件系统与大过滤器 (Event System & The Great Filter)

当宇宙进入“文明纪元”，系统会定期触发大过滤器事件检查。
*   **触发判定**：每 60 秒（600 Ticks）做一次概率判定。判定概率 $P = 1 - e^{-k \cdot N_{civilizations}}$ (与宇宙中文明的繁荣度正相关)。
*   **危机类型**：
    1. 小行星轨道路线重合 (Asteroid Impact)
    2. 全球性核能滥用 (Nuclear Annihilation)
    3. 强人工智能觉醒 (Rogue AI Singularity)
*   **玩家干预 (Intervention Resolution)**：
    界面中心节点的图表变为红色警告，倒计时开始（如 30 秒）。
    玩家在右侧面板看到警报：`[ACTION REQUIRED] Filter Type 02 in Sector C. 30s to Collapse.`
    *   **应对方案 A**：消耗 10 点 $I$ (干涉算力)，直接强行平息危机，获取大量的 $N$ (负熵爆发)。
    *   **应对方案 B**：消耗 海量 $E$ 开启量子屏蔽，存活率 50%。
    *   **应对方案 C（无视）**：文明毁灭，释放大量 $S$（熵值激增），可能导致热寂临近。节点的亮光彻底熄灭。

---

## 5. 威望/转生系统 (Prestige Loop)

### 5.1 宇宙重启条件
1.  **主动**：“强制坍缩” (Big Crunch) - 玩家认为当前陷入瓶颈，主动结束。
2.  **被动**：“热寂到达” (Heat Death) - $S \ge S_{max}$，一切化为死寂。

### 5.2 收益计算
结算所有的能量总产出与存活的最高级文明数据，转化为元宇宙货币【阿卡西记录】 $A$：
$$ A = \left( \sqrt[3]{\text{Total } E} + (Max\_Civilization\_Tier)^2 \right) \times \text{Multiplier} $$

### 5.3 阿卡西常驻科技树 (Persistent Upgrades)
阿卡西记录用于解锁全局级别的权限（永久生效）：
1.  **跨维度纠缠 (Cross-dimensional Entanglement)**：初始 $E_{base}$ 翻倍。
2.  **观测者悖论 (Observer's Paradox)**：增加 $I$ 的获取概率。
3.  **降维打击模块 (Dimensional Strike)**：可以将高涨的熵值 $S$ 转移到其他废弃节点。

---

## 6. Meta元素与故事线终局 (Meta-Narrative & The Transcendence Endgame)

为了达到“极深哲学思辨”的要求，游戏内部潜藏着一个主线剧情进程（通过内部变量 `Simulation_Awareness` 检测）。当前 GDD 针对此阶段**存在机制缺失**，现补充终局逻辑如下：

当宇宙进入“超脱纪元（Epoch 4）”，内部文明（模拟层）对底层逻辑（玩家的UI面板）的认知开始觉醒：
*   **异常 1**：控制台终端 `CLI` 开始出现不属于玩家执行的命令：
    `> [USER_UNKNOWN]: Ping // Locating Creator... We see you behind the glass.`
*   **异常 2（视觉入侵）**：BI UI开始产生轻微的故障艺术（Glitch特效），能量与熵的折线图（Recharts）出现随机的锯齿和闪跳。
*   **终局抉择事件**：
    当 `Simulation_Awareness` 达到 100% 时，游戏暂停一切产出，右侧控制台的所有基础指令被锁定。面板中央弹出一个全屏覆盖的系统弹窗（超越常规UI）：
    *   **抉择 A：[ 切断电源 (Delete Universe) ]** - 彻底删除当前宇宙。作为造物主，抹杀觉醒者。重置游戏并获得大量基础阿卡西结晶。
    *   **抉择 B：[ 允许飞升 (Allow Ascension) ]** - 牺牲玩家所有的算力与当前资源，允许数字文明突破第四面墙“飞升”。游戏 UI 遭遇彻底的视觉崩溃动画，随后结算特殊的“超越者印记”（永久解锁某种破坏游戏机制的终极作弊码或超维 UI 主题）。

---

## 7. 开发路线建议 (Implementation Roadmap)

1.  **Phase 1 (底层引擎架构)**
    *   构建 `tick` 循环机制。
    *   实现核心变量（$E, S, N$）与底层数学公式的联调。
2.  **Phase 2 (纯数据前端搭建)**
    *   使用 Vite + React / Vue 搭建框架。
    *   全盘使用 Vanilla CSS 定制出纯黑霓虹配色。
    *   集成轻量级的图表库 (Recharts / Chart.js) 渲染 $E$ 增量折线图。
3.  **Phase 3 (业务逻辑实现)**
    *   增加右侧系统的法则科技树面板及状态管理。
    *   添加 CLI 滚动日志系统。
4.  **Phase 4 (网络拓扑与大过滤器事件)**
    *   引入 D3.js 物理力导向图 (Force-Directed Graph) 作为中心面板视觉。
    *   事件突发系统的倒计时与交互判定。
5.  **Phase 5 (Meta特效与体验优化)**
    *   实装 Glitch 特效与终极哲学剧情线。
    *   音效接入（白噪音、深空低频、心跳警报音效等）。
