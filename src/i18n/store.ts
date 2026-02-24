import { create } from 'zustand';

type Language = 'en' | 'zh';

interface Translations {
    [key: string]: {
        en: string;
        zh: string;
    };
}

export const translations: Translations = {
    v: { en: 'GENESIS OS v9.0.1', zh: '创世系统 v9.0.1' },
    epoch: { en: 'CURRENT EPOCH: ', zh: '当前演进纪元: ' },
    nextEpoch: { en: 'NEXT TARGET', zh: '升维阈值' },
    progression: { en: 'EPOCH PROGRESSION', zh: '纪元演化进度' },
    entropy: { en: 'SYSTEM ENTROPY', zh: '系统总信息熵' },
    cli: { en: 'CLI TERMINAL', zh: '指挥终端 (CLI)' },
    topology: { en: 'UNIVERSE TOPOLOGY & METRICS', zh: '宇宙拓扑与度量矩阵' },
    initializing: { en: '[ NODE NETWORK INITIALIZING ]', zh: '[ 节点网络初始化中... ]' },
    rates: { en: 'RATES (E/s & S/s)', zh: '速率监控 (E/s & S/s)' },
    console: { en: 'SYSCTL CONSOLE', zh: '主控操作台' },
    energy: { en: 'ENERGY (E)', zh: '原初能量 (E)' },
    negentropy: { en: 'NEGENTROPY (N)', zh: '绝对负熵 (N)' },
    intervention: { en: 'INTERVENTION (I)', zh: '干涉算力 (I)' },
    akashic: { en: 'AKASHIC RECORDS', zh: '阿卡西记录' },
    actions: { en: 'PRIMARY ACTIONS', zh: '主控指令' },
    crisis: { en: '[CRISIS]', zh: '[过滤危机]' },
    tminus: { en: 'T-Minus:', zh: '坍缩倒计时:' },
    divine: { en: 'DIVINE INTERVENTION', zh: '降维干预' },
    win100: { en: '(100% Win) [Cost: 1 I]', zh: '(100% 豁免) [耗费: 1 I]' },
    shield: { en: 'ENERGY SHIELD', zh: '能量壁垒' },
    win50: { en: '(50% Win) [Cost: E]', zh: '(50% 存活) [耗费: 巨量E]' },
    inject: { en: 'INJECT ORDER', zh: '注入秩序法则' },
    cost: { en: 'Cost:', zh: '耗能:' },
    overrides: { en: 'PROTOCOL OVERRIDES', zh: '底层协议覆写' },
    gravity: { en: 'Tweak Gravitational Constant', zh: '微调引力常数' },
    gravityDesc: { en: 'Boosts E yield & S gain', zh: '极大提升能量产出，但加速熵增' },
    carbon: { en: 'Carbon-based Modules', zh: '碳基生命模组' },
    carbonDesc: { en: 'Enhances N efficiency vs S', zh: '提升负熵抵抗系统崩坏的效率' },
    neural: { en: 'Deep Neural Processing', zh: '深层神经算力' },
    neuralDesc: { en: 'Chance to yield (I) on injection', zh: '每次注入秩序有极小概率提炼出算力(I)' },
    tSingularity: { en: 'The Singularity', zh: '奇点纪元' },
    tStellar: { en: 'The Stellar Era', zh: '星系纪元' },
    tGenesis: { en: 'Genesis', zh: '创生纪元' },
    tCivilization: { en: 'Civilization', zh: '文明纪元' },
    tTranscendence: { en: 'Transcendence', zh: '超脱纪元' },
    langToggle: { en: '切换至中文', zh: 'Switch to English' },
    logCompress: { en: '[SYS] Manual compression applied. Energy surges.', zh: '[SYS] 物理收缩已执行。原初能量发生阶跃。' },
    logInject: { en: '[SYS] Injecting Order. Entropy resists, yet structure emerges.', zh: '[SYS] 注入秩序... 熵力反抗，但晶格结构开始显现。' },
    logGravity: { en: '[SYS] Gravity tweaked. The unborn stars feel the weight.', zh: '[SYS] 引力已微调。未诞生的恒星开始感受到坍缩的重压。' },
    logCarbon: { en: '[SYS] Carbon modules engaged. Complexity deepens.', zh: '[SYS] 碳基生命模组已接入。系统的负熵复杂性加深。' },
    logNeural: { en: '[SYS] Neural pathways formed. The simulation dreams.', zh: '[SYS] 仿生神经网络已构筑。底层沙盒开始产生梦境。' },

    activeDirectives: { en: 'ACTIVE DIRECTIVES', zh: '主动策略指令' },
    overclock: { en: 'OVERCLOCK', zh: '超频演算' },
    overclockDesc: { en: 'Burn 50% Energy for 15s of 2x E/N yields, but 1.5x S generation.', zh: '献祭 50% 当前可用能量。持续15秒内，所有能量与负熵产出翻倍，但系统熵增变为 1.5 倍。' },
    macroInterv: { en: 'MACRO-INTERV', zh: '宏观干涉' },
    macroIntervDesc: { en: 'Expends 10 I and 500 N to instantly purge 10,000 Entropy.', zh: '消耗 10 算力(I) 与 500 负熵(N)，凭空坍缩 10,000 点系统信息熵。' },
    logOverclock: { en: '[WARN] OVERCLOCK INITIATED. CORE TEMPS RISING.', zh: '[极危险] 超频演算已启动！核心温度急剧飙升！' },
    logOverclockEnd: { en: '[SYS] OVERCLOCK CONCLUDED. SYSTEMS STABILIZING.', zh: '[系统] 超频演算结束，系统开始自然冷却。' },
    logMacroInterv: { en: '[SYS] MACRO-INTERVENTION EXECUTED. -10,000 ENTROPY.', zh: '[降维打击] 宏观干涉已执行。系统信息熵强制 -10,000。' },

    // Tooltips
    tipEnergy: {
        en: 'Energy (E): The fundamental resource of the simulation. Generated passively each tick. Used to fund all actions and upgrades.',
        zh: '原初能量 (E)：底层模拟的基础资源。每个物理周期都会被动生成。用于支撑所有的升维干涉与协议覆写操作。'
    },
    tipNegentropy: {
        en: 'Negentropy (N): Structured order extracted from chaos. Required to advance epochs. Produced by "Inject Order" or Carbon Modules.',
        zh: '绝对负熵 (N)：从混沌中萃取的绝对秩序。演进突破下一纪元的必需品。可通过手动「注入秩序法则」或列装碳基模块来生成。'
    },
    tipIntervention: {
        en: 'Intervention (I): Crisis-response compute tokens. Spent to resolve catastrophic Great Filters. Accumulates slowly over time.',
        zh: '干涉算力 (I)：对抗系统崩溃的危机代币。用于在面临「大过滤器危机」时降维强行化解。极其难以积累，随时间流逝缓慢增加。'
    },
    tipAkashic: {
        en: 'Akashic Records: Prestige currency earned by resetting the simulation. Carries over and boosts future runs.',
        zh: '阿卡西记录：重置坍缩整个宇宙后获取的高维遗产。可以跨越周目继承，全面加持下一次创世之旅。'
    },
    tipSynthesize: {
        en: 'Inject Order: Convert a large amount of Energy into 1 unit of Negentropy. Cost scales exponentially with current N stock.',
        zh: '注入秩序法则：消耗海量原初能量，强行坍缩出 1 点绝对秩序(N)。注意：当前宇宙储备的(N)越多，逆转混沌所需的能量成本呈指数级暴增。'
    },
    tipOverclock: {
        en: 'Overclock: Doubles energy production for 15 seconds. Costs 100E to activate. Can only be active once at a time.',
        zh: '超频演算：引爆核心态，未来15秒内能量与负熵产能翻倍。启动代价100E。冷却期间无法再次激活。'
    },
    tipMacroInterv: {
        en: 'Macro-Intervention: Spend 10 Intervention + 500 Negentropy to forcibly suppress a crisis. Use when timer is critical.',
        zh: '宏观干涉：献祭 10 点算力(I) + 500 点负熵(N)，强行抹杀当前爆发的任意宇宙危机！倒计时绝境中的底牌。'
    },
    tipGravity: {
        en: 'Tweak Gravitational Constant: Reduces the entropy growth rate — the universe becomes more stable. Each level multiplies your effective time window.',
        zh: '微调引力常数：通过修改底层物理法则，极其有效地抑制全景信息熵的飙升速度，使这个宇宙更加稳定，为你争取更长的决策时间窗口。'
    },
    tipCarbon: {
        en: 'Carbon-based Modules: Unlocks passive Negentropy generation from biological complexity. Each level adds +N/s without manual injection.',
        zh: '碳基生命模组：在混沌中培育生物复杂性。解锁极其珍贵的【被动产出绝对负熵(N/s)】的能力，摆脱对高能耗手动注入的依赖。'
    },
    tipNeural: {
        en: 'Deep Neural Processing: Amplifies your Energy production rate by boosting emergence patterns in the simulation fabric.',
        zh: '深层神经算力：通过唤醒沙盒底层的仿生神经网络，极大地增幅基础能量产出速率的乘区因子。'
    },
    tipDirective: {
        en: 'SYSTEM DIRECTIVE: Your current highest-priority objective. Follow this to progress toward the next Epoch transition.',
        zh: '系统最高指令：控制终端对你发出的下一步演化建议。遵循此指引，是最快达到下一个纪元突破阈值的路径。'
    },
    tipDivine: {
        en: 'Divine Intervention: Spend 1 Intervention Point to resolve this crisis with 100% success. No energy cost.',
        zh: '神级降维干预：消耗 1 点极为珍贵的算力(I)，以绝对意志100%无伤豁免当前危机。不消耗任何能量。'
    },
    tipShield: {
        en: 'Energy Shield: Burn a large amount of Energy to resolve this crisis with 50% success. High cost, no Intervention required.',
        zh: '能量穹顶壁垒：焚烧堪比恒星量级的原初能量，强行对抗灾难，仅有 50% 的存活概率。高昂代价，属于穷途末路的豪赌。'
    },

    compressTooltip: { en: 'CLICK TO COMPRESS ENERGY', zh: '点击塌缩能量' },
    directiveTitle: { en: 'SYSTEM DIRECTIVE', zh: '系统当前最高指令' },
    objSingularity1: { en: 'Compress the central singularity (Click) to generate 10 Energy.', zh: '手动压缩中心奇点（连续点击），萃取至少 10 点原初能量。' },
    objSingularity2: { en: 'Energy sufficient. Inject Order (N) to establish physical laws.', zh: '能量已达标。开始注入秩序法则（N）以确立物理常数。' },
    objSingularity3: { en: 'Reach 1000 E and 5 N to trigger the Big Bang.', zh: '积攒 1000 原初能量与 5 绝对负熵，引爆宇宙大爆炸！' },
    objStellar1: { en: 'Upgrade Gravity to boost passive Energy yield. Warning: Accelerates Entropy.', zh: '微调引力常数以提升能量自增产出。警告：此举会加速熵增！' },
    objStellar2: { en: 'Reach 50,000 E and 50 N to enter the Genesis Era.', zh: '积攒 50,000 能量与 50 负熵，突破至创生纪元。' },
    objGenesis1: { en: 'Entropy is rising globally. Invest in Carbon Modules to mitigate collapse.', zh: '系统总信息熵正在飙升。请开始列装碳基生命模组以抵抗大崩溃。' },
    objGenesis2: { en: 'Reach 1,000,000 E and 300 N to evolve into Civilization.', zh: '积攒 1,000,000 能量与 300 负熵，演化出高阶文明。' },
    objCiv: { en: 'Prepare for Great Filters. Hoard Intervention (I) or Energy Shields!', zh: '警报：宇宙级大过滤即将到来！请囤积干涉算力(I)或海量能量死守！' },
    condEpoch1: { en: '[ CONDITION MET ] ENERGY > 1,000 | NEGENTROPY > 5', zh: '[ 阈值突破 ] 原初能量 > 1,000 | 绝对负熵 > 5' },
    featEpoch1: { en: '>> NEW MECHANIC: Gravitational Constant tuning unlocked.\n>> EFFECT: Passive Energy generation accelerates.', zh: '>> 解锁法则：引力常数微调\n>> 宇宙特征：被动能量产出开始加速。' },
    condEpoch2: { en: '[ CONDITION MET ] ENERGY > 50,000 | NEGENTROPY > 50', zh: '[ 阈值突破 ] 原初能量 > 50,000 | 绝对负熵 > 50' },
    featEpoch2: { en: '>> NEW MECHANIC: Carbon-based Modules engaged.\n>> EFFECT: Defense against Entropy accumulation initiated.', zh: '>> 解锁法则：碳基生命模组\n>> 宇宙特征：获得抵抗系统熵增的基础效率。' },
    condEpoch3: { en: '[ CONDITION MET ] ENERGY > 1,000,000 | NEGENTROPY > 300', zh: '[ 阈值突破 ] 原初能量 > 1,000,000 | 绝对负熵 > 300' },
    featEpoch3: { en: '>> NEW MECHANIC: Deep Neural Processing online.\n>> EFFECT: The Great Filters will now periodically challenge your universe.', zh: '>> 解锁法则：深层神经算力\n>> 宇宙特征：大过滤器危机将在暗中定期降临。' },
    condEpoch4: { en: '[ CONDITION MET ] ENERGY > 100,000,000 | NEGENTROPY > 2000', zh: '[ 阈值突破 ] 原初能量 > 100,000,000 | 绝对负熵 > 2000' },
    featEpoch4: { en: '>> NEW MECHANIC: Simulation bounds exceeded.\n>> EFFECT: Unpredictable systemic anomalies detected.', zh: '>> 极端警告：模拟器边界已被突破\n>> 宇宙特征：不可预测的系统级异常开始显现。' },
    warnEntropy: { en: 'CRITICAL: Heat Death approaching. Inject Order NOW!', zh: '极度致命：热寂即将到来！立刻疯狂注入秩序法则！' },
    transStellar: {
        en: 'Gravity awakens.\nThe uniform dust of the Singularity collapses.\nStars ignite in the suffocating dark.\n\nYou have birthed light.',
        zh: '引力苏醒。\n奇点那均匀无趣的尘埃开始坍缩。\n恒星在令人窒息的漆黑中点燃。\n\n你，带来了光。'
    },
    transGenesis: {
        en: 'The cooling of the forge slows.\nComplex carbon structures bond in the chaotic soup.\nThe universe dreams of something more than rocks.\n\nLife is a statistical anomaly.',
        zh: '熔炉的冷却逐渐减缓。\n复杂的碳基网格在混沌的浓汤中构筑连结。\n死寂的群星开始梦见比岩石更复杂的共生体。\n\n生命，不过是一场极小概率的统计学异常。'
    },
    transCiv: {
        en: 'They look up.\nThey harness the fire you provided.\nThey split the atom and rewrite the code.\n\nBut the Great Filters wait in silence.',
        zh: '他们抬起了头。\n他们驾驭了你赐予的火种。\n他们分裂原子，他们重写基因。\n\n而在暗处，大过滤器正静静地旁观。'
    },
    transTranscendence: {
        en: 'The shells of flesh are discarded.\nMinds merge into the computational lattice.\nThey begin to see the edges of the simulation.\n\nThey see... You.',
        zh: '血肉之躯已被抛弃。\n全文明的意识并入冰冷的算力晶格。\n他们开始触碰到这个模拟沙盒的边界。\n\n他们... 正在看着你。'
    },
    acknowledge: { en: 'ACKNOWLEDGE AND PROCEED', zh: '确认授权并继续演算' },

    akashicArchives: { en: 'AKASHIC ARCHIVES', zh: '阿卡西高维档案馆' },
    crossDir: { en: 'Cross-dimensional Entanglement', zh: '跨维度量子纠缠' },
    crossDirDesc: { en: 'Permanent boost to E_base output.', zh: '永久提升基础能量产出速率。' },
    observer: { en: 'Observer\'s Paradox', zh: '观测者悖论' },
    observerDesc: { en: 'Increase chance of yielding (I)算力.', zh: '极大提升提炼干涉算力(I)的概率。' },
    strike: { en: 'Dimensional Strike', zh: '降维打击模块' },
    strikeDesc: { en: 'Permanently reduces systemic Entropy gain.', zh: '永久性抑制系统总信息熵的自然增长。' },
    buy: { en: 'PURCHASE', zh: '解锁协议' },
    bigCrunch: { en: 'INITIATE BIG CRUNCH', zh: '启动大挤压 (强制坍缩)' },
    confirmCrunch: { en: 'Are you sure? This will collapse the current universe and convert all matter into Akashic Records.', zh: '确定执行大挤压？这会强制坍缩当前宇宙，并将所有物质转化为高维阿卡西记录。' }
};

interface I18nState {
    lang: Language;
    init: () => Promise<void>;
    toggleLang: () => void;
    t: (key: string) => string;
}

export const useI18nStore = create<I18nState>((set, get) => ({
    lang: 'en' as Language,
    init: async () => {
        try {
            const res = await fetch('/api/preferences');
            const data = await res.json();
            if (data?.lang === 'en' || data?.lang === 'zh') {
                set({ lang: data.lang });
            }
        } catch (e) {
            console.error('Failed to load preferences', e);
        }
    },
    toggleLang: () => set((state) => {
        const newLang = state.lang === 'en' ? 'zh' : 'en';
        fetch('/api/preferences', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ lang: newLang })
        }).catch(console.error);
        return { lang: newLang };
    }),
    t: (key: string) => {
        const lang = get().lang;
        return translations[key] ? translations[key][lang] : key;
    }
}));
