import { useGameStore, MAX_ENTROPY } from '../store/gameStore';
import { useUniverseStore } from '../store/universeStore';
import { useI18nStore } from '../i18n/store';
import { Activity, Clock, Globe, Volume2, VolumeX, LogOut } from 'lucide-react';
import './TopBar.css';

export default function TopBar() {
    const { ticks, epoch, entropy, energy, negentropy, soundEnabled, toggleSound } = useGameStore();
    const { exitUniverse } = useUniverseStore();
    const { t, toggleLang } = useI18nStore();

    const entropyPercent = (entropy / MAX_ENTROPY) * 100;

    // Separate E and N progress — each is its own axis
    let eProg = 1, nProg = 1;
    let eTarget = '', nTarget = '';
    if (epoch === 0) {
        eProg = Math.min(1, energy / 1000); nProg = Math.min(1, negentropy / 5);
        eTarget = '1,000E'; nTarget = '5N';
    } else if (epoch === 1) {
        eProg = Math.min(1, energy / 50000); nProg = Math.min(1, negentropy / 50);
        eTarget = '50,000E'; nTarget = '50N';
    } else if (epoch === 2) {
        eProg = Math.min(1, energy / 1000000); nProg = Math.min(1, negentropy / 300);
        eTarget = '1M E'; nTarget = '300N';
    } else if (epoch === 3) {
        eProg = Math.min(1, energy / 100000000); nProg = Math.min(1, negentropy / 2000);
        eTarget = '100M E'; nTarget = '2000N';
    }

    const timeFormatted = `T+${(ticks * 100).toLocaleString()}`;
    const epochKeys = ['tSingularity', 'tStellar', 'tGenesis', 'tCivilization', 'tTranscendence'];
    const currentEpochName = t(epochKeys[epoch] || 'tSingularity');

    return (
        <div className="top-bar">
            {/* LEFT: Brand */}
            <div className="tb-left">
                <button className="tb-exit-btn" onClick={exitUniverse} title="Exit to Multiverse">
                    <LogOut size={16} />
                </button>
                <span className="tb-brand glitch-effect" data-text={t('v')}>{t('v')}</span>
            </div>

            {/* CENTER */}
            <div className="tb-center">
                {/* Dual progress: E and N are two independent axes */}
                {epoch < 4 && (
                    <div className="tb-dual-progress">
                        <div className="tb-dual-bar-row">
                            <span className="tb-bar-label">E</span>
                            <div className="tb-progress-track">
                                <div className="tb-progress-fill" style={{ width: `${eProg * 100}%` }} />
                            </div>
                            <span className="tb-bar-target">{eTarget}</span>
                        </div>
                        <div className="tb-dual-bar-row">
                            <span className="tb-bar-label tb-bar-label--n">N</span>
                            <div className="tb-progress-track">
                                <div className="tb-progress-fill tb-progress-fill--n" style={{ width: `${nProg * 100}%` }} />
                            </div>
                            <span className="tb-bar-target">{nTarget}</span>
                        </div>
                    </div>
                )}

                {/* Divider */}
                {epoch < 4 && <div className="tb-vdivider" />}

                {/* Epoch name */}
                <div className="tb-epoch-block">
                    <span className="tb-meta-label">{t('epoch')}</span>
                    <span className="tb-epoch-name">{currentEpochName.toUpperCase()}</span>
                </div>

                {/* Time */}
                <div className="tb-time-block">
                    <Clock size={13} className="tb-icon" />
                    <span className="tb-time">{timeFormatted}</span>
                </div>

                {/* Simulation Integrity (Awareness inverted) */}
                <div className="tb-integrity-block">
                    <span className="tb-meta-label">INTEGRITY</span>
                    <div className="tb-integrity-bar">
                        <div className="tb-integrity-fill" style={{ width: `${100 - useGameStore.getState().simulationAwareness}%` }}></div>
                    </div>
                </div>
            </div>

            {/* RIGHT: Entropy + Lang toggle */}
            <div className="tb-right">
                <div className="tb-entropy">
                    <div className="tb-entropy-header">
                        <span className="tb-meta-label"><Activity size={12} /> {t('entropy')}</span>
                        <span className={`tb-entropy-val${entropyPercent > 80 ? ' alert' : ''}`}>
                            {entropy.toFixed(1)} / {MAX_ENTROPY}
                        </span>
                    </div>
                    <div className="tb-progress-track tb-progress-track--wide">
                        <div className={`tb-progress-fill${entropyPercent > 80 ? ' alert' : ''}`}
                            style={{ width: `${Math.min(100, entropyPercent)}%` }} />
                    </div>
                </div>
                <button className="tb-lang-btn" onClick={toggleLang}>
                    <Globe size={13} /> {t('langToggle')}
                </button>
                <button className={`tb-lang-btn ${soundEnabled ? 'active' : ''}`} onClick={toggleSound} title="Toggle Ambient Drone">
                    {soundEnabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
                </button>
            </div>
        </div>
    );
}
