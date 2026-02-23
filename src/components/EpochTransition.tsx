import { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { useI18nStore } from '../i18n/store';
import './EpochTransition.css';

export default function EpochTransition() {
    const { epoch, completeTransition } = useGameStore();
    const { t } = useI18nStore();
    const [textVisible, setTextVisible] = useState(false);
    const [glitchActive, setGlitchActive] = useState(true);

    // Sequence timing
    useEffect(() => {
        const textTimer = setTimeout(() => {
            setTextVisible(true);
            setGlitchActive(false); // Lessen the glitch when text appears
        }, 1500); // 1.5s of pure static before text

        return () => clearTimeout(textTimer);
    }, []);

    const handleAcknowledge = () => {
        completeTransition();
    };

    const getEpochKey = (e: number) => {
        if (e === 1) return 'transStellar';
        if (e === 2) return 'transGenesis';
        if (e === 3) return 'transCiv';
        if (e >= 4) return 'transTranscendence';
        return 'transStellar'; // Fallback
    };

    const getCondKey = (e: number) => {
        if (e === 1) return 'condEpoch1';
        if (e === 2) return 'condEpoch2';
        if (e === 3) return 'condEpoch3';
        if (e >= 4) return 'condEpoch4';
        return 'condEpoch1';
    };

    const getFeatKey = (e: number) => {
        if (e === 1) return 'featEpoch1';
        if (e === 2) return 'featEpoch2';
        if (e === 3) return 'featEpoch3';
        if (e >= 4) return 'featEpoch4';
        return 'featEpoch1';
    };

    return (
        <div className="epoch-transition-overlay">
            {glitchActive && <div className="static-noise"></div>}
            <div className="scanlines"></div>

            <div className={`transition-content ${textVisible ? 'visible' : ''}`}>
                <div className="epoch-condition glitch-effect" data-text={t(getCondKey(epoch))}>
                    {t(getCondKey(epoch))}
                </div>

                <h1 className="epoch-title glitch-effect" data-text={`[ EPOCH ${epoch} INITIATED ]`}>
                    [ EPOCH {epoch} INITIATED ]
                </h1>

                <div className="epoch-feature">
                    {t(getFeatKey(epoch))}
                </div>

                <div className="typewriter-container">
                    <p className="epoch-philosophy">{t(getEpochKey(epoch))}</p>
                </div>

                <button
                    className="acknowledge-btn"
                    onClick={handleAcknowledge}
                    style={{ opacity: textVisible ? 1 : 0, pointerEvents: textVisible ? 'auto' : 'none' }}
                >
                    {'>'} {t('acknowledge')}
                </button>
            </div>
        </div>
    );
}
