import { useGameStore } from '../store/gameStore';
import { useI18nStore } from '../i18n/store';
import { Network, Zap, Crosshair } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from 'react';
import './CenterPanel.css';

type Point = { time: number; energyRate: number; entropyRate: number };

export default function CenterPanel() {
    const epoch = useGameStore(state => state.epoch);
    const negentropy = useGameStore(state => state.negentropy);

    // Rates for graph
    const ticks = useGameStore(state => state.ticks);
    const energyRate = useGameStore(state => state.energyRate);
    const entropyRate = useGameStore(state => state.entropyRate);
    const energy = useGameStore(state => state.energy);

    const manualCompress = useGameStore(state => state.manualCompress);
    const { t } = useI18nStore();
    const [data, setData] = useState<Point[]>([]);

    // Collect chart data every 10 ticks
    useEffect(() => {
        if (ticks % 10 === 0) {
            setData(prev => {
                const newData = [...prev, { time: ticks, energyRate, entropyRate }];
                if (newData.length > 50) return newData.slice(-50);
                return newData;
            });
        }
    }, [ticks, energyRate, entropyRate]);

    // Generate pseudo-random nodes for SVG topology based on epoch and negentropy
    // We use a deterministic approach based on epoch to avoid thrashing on every render
    const nodeCount = epoch < 2 ? 0 : Math.min(50, 10 + Math.floor(Math.sqrt(negentropy)));

    const svgNodes = [];
    if (epoch >= 2) {
        for (let i = 0; i < nodeCount; i++) {
            // Predictable pseudo-random distribution
            const cx = 50 + Math.sin(i * 12.3) * 40;
            const cy = 50 + Math.cos(i * 7.9) * 40;
            const isFlashing = epoch >= 3 && (i % 3 === 0);
            svgNodes.push(
                <circle key={i} cx={`${cx}%`} cy={`${cy}%`} r="1.5" className={isFlashing ? "active-node" : "dormant-node"} />
            );

            // Connect to nearby nodes to form a network
            if (i > 0 && i % 2 !== 0 && epoch >= 2) {
                const prevCx = 50 + Math.sin((i - 1) * 12.3) * 40;
                const prevCy = 50 + Math.cos((i - 1) * 7.9) * 40;
                svgNodes.push(
                    <line key={`l-${i}`} x1={`${cx}%`} y1={`${cy}%`} x2={`${prevCx}%`} y2={`${prevCy}%`} className="network-link" />
                );
            }
        }
    }

    const activeEvent = useGameStore(state => state.activeEvent);
    const awareness = useGameStore(state => state.simulationAwareness);

    return (
        <div className={`center-panel ${activeEvent ? 'crisis-active' : ''} ${awareness > 80 ? 'hyper-glitch' : ''}`}>
            <div className="panel-header">
                <Network size={18} className="icon" />
                <span>OBSERVATION WINDOW</span>
            </div>

            {/* Central Viewport */}
            <div className="topology-view">

                {/* HUD Data Corners */}
                <div className="hud-corners text-xs font-mono text-cyan-500/50 pointer-events-none">
                    <div className="absolute top-4 left-4 flex gap-2 items-center"><Crosshair size={12} /> UL</div>
                    <div className="absolute top-4 right-4 flex gap-2 items-center">UR <Crosshair size={12} /></div>
                    <div className="absolute bottom-4 left-4 flex gap-2 items-center"><Crosshair size={12} /> DL</div>
                    <div className="absolute bottom-4 right-4 flex gap-2 items-center">DR <Crosshair size={12} /></div>
                </div>

                {activeEvent && (
                    <div className="crisis-warning-overlay absolute inset-0 pointer-events-none z-0">
                        <div className="warning-scanner"></div>
                    </div>
                )}

                <div className="tracking-info absolute bottom-12 left-1/2 -translate-x-1/2 text-xs font-mono text-gray-500 text-center pointer-events-none z-10">
                    [ SYS.TRACKING ]<br />
                    ANG_X: {(Math.sin(ticks / 50) * 2).toFixed(2)}°<br />
                    ANG_Y: {(Math.cos(ticks / 40) * 2).toFixed(2)}°<br />
                    ENT_FLUX: {entropyRate.toFixed(1)} /s
                </div>

                <div className="topology-placeholder" style={{ transform: `rotateY(${Math.sin(ticks / 100) * 10}deg) rotateX(${Math.cos(ticks / 100) * 5}deg)` }}>
                    {/* Render procedural SVG network behind the core if epoch >= 2 */}
                    {epoch >= 2 && (
                        <svg className="svg-network pointer-events-none" preserveAspectRatio="none">
                            {svgNodes}
                        </svg>
                    )}

                    <div className={`pulsing-core cursor-pointer ${activeEvent ? 'core-panic' : ''}`}
                        onClick={manualCompress}
                        title={t('compressTooltip')}
                        style={{
                            transform: `scale(${1 + Math.log10(1 + energy) * 0.1})`,
                            boxShadow: `0 0 ${10 + Math.log10(1 + energy) * 2}px ${activeEvent ? 'var(--color-text-alert)' : 'var(--color-accent)'}`
                        }}
                    >
                        {epoch >= 1 && <div className="orbit-ring ring-1 pointer-events-none"></div>}
                        {epoch >= 2 && <div className="orbit-ring ring-2 pointer-events-none"></div>}
                        {epoch >= 3 && <div className="orbit-ring ring-3 pointer-events-none"></div>}
                        {epoch >= 4 && <div className="orbit-ring ring-4-glitch pointer-events-none"></div>}

                        {awareness > 90 && <div className="core-ghost"></div>}
                    </div>
                </div>
            </div>

            <div className="charts-view">
                <div className="chart-container">
                    <div className="chart-title">
                        <Zap size={14} /> {t('rates')}
                    </div>
                    <div className="chart-wrapper">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                                <XAxis dataKey="time" hide />
                                <YAxis hide />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'var(--color-panel)', borderColor: 'var(--color-border)', fontFamily: 'inherit' }}
                                    itemStyle={{ color: 'var(--color-accent)' }}
                                />
                                <Line type="monotone" dataKey="energyRate" stroke="var(--color-accent)" strokeWidth={2} dot={false} isAnimationActive={false} />
                                <Line type="monotone" dataKey="entropyRate" stroke="var(--color-text-alert)" strokeWidth={2} dot={false} isAnimationActive={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
