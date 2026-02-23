import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { useI18nStore } from '../i18n/store';
import { Terminal } from 'lucide-react';
import './LeftPanel.css';

export default function LeftPanel() {
    const logMessages = useGameStore(state => state.logMessages);
    const { t } = useI18nStore();
    const endRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logMessages]);

    return (
        <div className="left-panel">
            <div className="panel-header">
                <Terminal size={18} className="icon" />
                <span>{t('cli')}</span>
            </div>
            <div className="log-container">
                {logMessages.map((msg, idx) => {
                    let msgClass = 'log-info';
                    if (msg.includes('[WARN]')) msgClass = 'log-warn';
                    if (msg.includes('[ERR]')) msgClass = 'log-error';

                    return (
                        <div key={idx} className={`log-entry ${msgClass}`}>
                            <span className="prompt">{'>'} </span>
                            {msg}
                        </div>
                    );
                })}
                <div ref={endRef} />
            </div>
        </div>
    );
}
