import { useEffect } from 'react';
import { useGameStore, TICK_RATE_MS } from './store/gameStore';
import { useUniverseStore } from './store/universeStore';
import { useI18nStore } from './i18n/store';
import TopBar from './components/TopBar';
import LeftPanel from './components/LeftPanel';
import CenterPanel from './components/CenterPanel';
import RightPanel from './components/RightPanel';
import EpochTransition from './components/EpochTransition';
import UniverseSelect from './components/UniverseSelect';
import SoundEngine from './components/SoundEngine';
import './index.css';

function App() {
  const { activeUniverseId } = useUniverseStore();
  const initI18n = useI18nStore(state => state.init);

  const tick = useGameStore(state => state.tick);
  const awareness = useGameStore(state => state.simulationAwareness);
  const isTransitioning = useGameStore(state => state.isTransitioning);
  const loadGameState = useGameStore(state => state.loadGameState);
  const gameLoading = useGameStore(state => state.loading);
  const soundEnabled = useGameStore(state => state.soundEnabled);

  // Initialize preferences on boot
  useEffect(() => {
    initI18n();
  }, [initI18n]);

  // Load game state when universe is selected
  useEffect(() => {
    if (activeUniverseId) {
      loadGameState(activeUniverseId);
    }
  }, [activeUniverseId, loadGameState]);

  // Game Loop
  useEffect(() => {
    if (!activeUniverseId || gameLoading) return;
    const interval = setInterval(() => {
      tick();
    }, TICK_RATE_MS);
    return () => clearInterval(interval);
  }, [tick, activeUniverseId, gameLoading]);

  // Routing
  if (!activeUniverseId) {
    return <UniverseSelect />;
  }

  if (gameLoading) {
    return <div className="universe-select-screen loading">SYNCING SPACETIME CONTINUUM...</div>;
  }

  const glitchClass = awareness > 50 ? 'glitch-effect' : '';

  return (
    <>
      <div className={`layout-container ${glitchClass}`} data-text="SIMULATION BOUNDS EXCEEDED">
        <TopBar />
        <div className="layout-main">
          <LeftPanel />
          <CenterPanel />
          <RightPanel />
        </div>
      </div>
      {isTransitioning && <EpochTransition />}
      <SoundEngine enabled={soundEnabled} />
    </>
  );
}

export default App;
