import { useGameStore, MAX_ENTROPY } from '../store/gameStore';
import { useI18nStore } from '../i18n/store';
import { Cpu, Fingerprint, ShieldAlert, Target } from 'lucide-react';
import './RightPanel.css';

export default function RightPanel() {
    const state = useGameStore();
    const { t } = useI18nStore();

    const formatE = (val: number) => val.toLocaleString(undefined, { maximumFractionDigits: 1 });

    const getDirective = () => {
        if (state.entropy > (MAX_ENTROPY * 0.8)) {
            return { text: t('warnEntropy'), alert: true };
        }

        if (state.epoch === 0) {
            if (state.energy < 10 && state.negentropy === 0) return { text: t('objSingularity1') };
            if (state.negentropy === 0) return { text: t('objSingularity2') };
            return { text: t('objSingularity3') };
        }
        if (state.epoch === 1) {
            if (state.upgrades.gravitationalConstant === 0) return { text: t('objStellar1') };
            return { text: t('objStellar2') };
        }
        if (state.epoch === 2) {
            if (state.upgrades.carbonModules === 0) return { text: t('objGenesis1') };
            return { text: t('objGenesis2') };
        }
        return { text: t('objCiv') };
    };

    return (
        <div className="right-panel">
            <div className="panel-header">
                <Cpu size={18} className="icon" />
                <span>{t('console')}</span>
            </div>

            {/* Strategic Directive */}
            <div className="directive-box" data-tooltip={t('tipDirective')}>
                <div className="directive-header">
                    <Target size={14} className="icon" />
                    <span>{t('directiveTitle')}</span>
                </div>
                <div className={`directive-content ${getDirective().alert ? 'text-alert glitch-effect' : 'highlight'}`} data-text={getDirective().alert ? getDirective().text : ''}>
                    {getDirective().text}
                </div>
            </div>

            {/* 2x2 Resource Grid */}
            <div className="resources-grid">
                <div className="resource-item" data-tooltip={t('tipEnergy')}>
                    <span className="res-label">{t('energy')}</span>
                    <span className="res-value highlight">{formatE(state.energy)}</span>
                    <span className="res-rate">+{formatE(state.energyRate)}/s</span>
                </div>
                <div className="resource-item" data-tooltip={t('tipNegentropy')}>
                    <span className="res-label">{t('negentropy')}</span>
                    <span className="res-value">{state.negentropy.toLocaleString()}</span>
                </div>
                <div className="resource-item" data-tooltip={t('tipIntervention')}>
                    <span className="res-label">{t('intervention')}</span>
                    <span className="res-value text-alert">{state.intervention}</span>
                </div>
                <div className="resource-item" data-tooltip={t('tipAkashic')}>
                    <span className="res-label text-dim">{t('akashic')}</span>
                    <span className="res-value text-dim">{state.akashicRecords}</span>
                </div>
            </div>

            {/* Primary Action */}
            <div className="primary-action-box">
                <h3 className="section-title">{t('actions')}</h3>

                {state.activeEvent && (
                    <div className="event-alert-box" style={{ background: 'var(--color-alert-dim)', border: '1px solid var(--color-text-alert)', padding: '10px', marginBottom: '10px' }}>
                        <h4 style={{ color: 'var(--color-text-alert)', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem' }}>
                            <ShieldAlert size={14} /> {t('crisis')} {state.activeEvent.name}
                        </h4>
                        <p style={{ fontSize: '0.75rem', margin: '4px 0' }}>{t('tminus')} {state.activeEvent.timer.toFixed(1)}s</p>
                        <div style={{ display: 'flex', gap: '5px', marginTop: '6px' }}>
                            <button
                                className="action-btn"
                                style={{ borderColor: 'var(--color-text-alert)', color: 'var(--color-text-alert)', fontSize: '0.7rem', flex: 1 }}
                                disabled={state.intervention < 1}
                                onClick={() => state.resolveEvent(1, true)}
                                data-tooltip={t('tipDivine')}
                            >
                                {t('divine')} (100%)
                            </button>
                            <button
                                className="action-btn"
                                style={{ fontSize: '0.7rem', flex: 1 }}
                                disabled={state.energy < 100000 * Math.pow(Math.max(1, state.epoch), 2)}
                                onClick={() => state.resolveEvent(0, false)}
                                data-tooltip={t('tipShield')}
                            >
                                {t('shield')} (50%)
                            </button>
                        </div>
                    </div>
                )}

                <button
                    className="action-btn synthesize-btn"
                    disabled={state.energy < state.getNegentropyCost()}
                    onClick={state.synthesizeNegentropy}
                    data-tooltip={t('tipSynthesize')}
                >
                    <Fingerprint size={14} />
                    <span>{t('inject')} ({formatE(state.getNegentropyCost())} E)</span>
                </button>
            </div>

            {/* Directives Grid */}
            <div className="directives-section">
                <h3 className="section-title" style={{ color: 'var(--color-text-alert)' }}>{t('activeDirectives')}</h3>
                <div className="directives-grid">
                    <button
                        className="action-btn"
                        style={{
                            borderColor: state.isOverclocked ? 'var(--color-accent)' : '',
                            color: state.isOverclocked ? 'var(--color-accent)' : '',
                            flexDirection: 'column', gap: '4px', padding: '10px 4px'
                        }}
                        disabled={state.isOverclocked || state.energy < 100}
                        onClick={state.activateOverclock}
                        data-tooltip={t('tipOverclock')}
                    >
                        <span style={{ fontWeight: 'bold' }}>{t('overclock')}</span>
                        <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>
                            {state.isOverclocked ? `${state.overclockTimer.toFixed(1)}s` : '-50% E'}
                        </span>
                    </button>

                    <button
                        className="action-btn"
                        style={{ flexDirection: 'column', gap: '4px', padding: '10px 4px' }}
                        disabled={state.intervention < 10 || state.negentropy < 500}
                        onClick={state.macroIntervention}
                        data-tooltip={t('tipMacroInterv')}
                    >
                        <span style={{ fontWeight: 'bold' }}>{t('macroInterv')}</span>
                        <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>10 I / 500 N</span>
                    </button>
                </div>
            </div>

            {/* Compact Upgrades */}
            <div className="upgrades-section">
                <h3 className="section-title">{t('overrides')}</h3>

                <div className={`upgrade-capsule ${state.energy < state.getGravityCost() ? 'disabled' : ''}`} data-tooltip={t('tipGravity')}>
                    <div className="upg-capsule-info">
                        <span className="upg-title">{t('gravity')}</span>
                        <span className="upg-lvl">Lv {state.upgrades.gravitationalConstant}</span>
                    </div>
                    <button disabled={state.energy < state.getGravityCost()} onClick={state.upgradeGravity}>
                        {formatE(state.getGravityCost())} E
                    </button>
                </div>

                <div className={`upgrade-capsule ${state.energy < state.getCarbonCost().energy || state.negentropy < state.getCarbonCost().negentropy ? 'disabled' : ''}`} data-tooltip={t('tipCarbon')}>
                    <div className="upg-capsule-info">
                        <span className="upg-title">{t('carbon')}</span>
                        <span className="upg-lvl">Lv {state.upgrades.carbonModules}</span>
                    </div>
                    <button disabled={state.energy < state.getCarbonCost().energy || state.negentropy < state.getCarbonCost().negentropy} onClick={state.upgradeCarbon}>
                        {formatE(state.getCarbonCost().energy)}E / {state.getCarbonCost().negentropy}N
                    </button>
                </div>

                <div className={`upgrade-capsule ${state.energy < state.getNeuralCost().energy || state.negentropy < state.getNeuralCost().negentropy ? 'disabled' : ''}`} data-tooltip={t('tipNeural')}>
                    <div className="upg-capsule-info">
                        <span className="upg-title">{t('neural')}</span>
                        <span className="upg-lvl">Lv {state.upgrades.neuralProcessing}</span>
                    </div>
                    <button disabled={state.energy < state.getNeuralCost().energy || state.negentropy < state.getNeuralCost().negentropy} onClick={state.upgradeNeural}>
                        {formatE(state.getNeuralCost().energy)}E / {state.getNeuralCost().negentropy}N
                    </button>
                </div>
            </div>
        </div>
    );
}
