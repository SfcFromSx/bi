import { create } from 'zustand';
import { useI18nStore } from '../i18n/store';

// Constants
export const TICK_RATE_MS = 100;
export const MAX_ENTROPY = 100000;

export interface GameState {
    id: string | null;           // Universe ID
    loading: boolean;
    error: string | null;

    // Time
    ticks: number;
    epoch: number;
    isTransitioning: boolean;
    lastSaveTimestamp: number;

    // Resources
    energy: number; // E
    entropy: number; // S
    negentropy: number; // N
    intervention: number; // I
    akashicRecords: number; // A

    // Rates (per second)
    energyRate: number;
    entropyRate: number;

    // Upgrades (Levels)
    upgrades: {
        gravitationalConstant: number; // M_exp
        carbonModules: number; // Efficiency
        neuralProcessing: number; // I chance
    };

    // Upgrades Costs
    getGravityCost: () => number;
    getCarbonCost: () => { energy: number; negentropy: number };
    getNeuralCost: () => { energy: number; negentropy: number };

    // Prestige Persistent Upgrades
    prestige: {
        crossDimensional: number; // E_base multiplier
        observerParadox: number; // I chance multiplier
        dimensionalStrike: number; // S reduction active
    };

    // Systems
    simulationAwareness: number; // 0 to 100
    logMessages: string[];
    activeEvent: { type: string; name: string; timer: number } | null;
    soundEnabled: boolean;

    // Directives State
    isOverclocked: boolean;
    overclockTimer: number;

    // Actions
    tick: () => void;
    manualCompress: () => void;
    synthesizeNegentropy: () => void;
    getNegentropyCost: () => number;
    completeTransition: () => void;

    upgradeGravity: () => void;
    upgradeCarbon: () => void;
    upgradeNeural: () => void;

    // Prestige Actions
    getPrestigeCosts: () => { cross: number; observer: number; strike: number };
    buyPrestigeUpgrade: (type: 'cross' | 'observer' | 'strike') => void;

    addLog: (msg: string) => void;
    triggerEvent: (type: string) => void;
    resolveEvent: (costI: number, success: boolean) => void;

    activateOverclock: () => void;
    macroIntervention: () => void;

    prestigeReset: () => void;

    toggleSound: () => void;

    // Save System Ops
    loadGameState: (id: string) => Promise<void>;
    saveGameState: (immediate?: boolean) => void;
}

// Simple throttling for saves
let lastDiskSaveTime = 0;
const DISK_SAVE_THROTTLE_MS = 5000;

export const useGameStore = create<GameState>()((set, get) => ({
    id: null,
    loading: false,
    error: null,

    ticks: 0,
    epoch: 0,
    isTransitioning: false,
    lastSaveTimestamp: Date.now(),

    energy: 0,
    entropy: 0,
    negentropy: 0,
    intervention: 0,
    akashicRecords: 0,

    energyRate: 0,
    entropyRate: 0,

    upgrades: {
        gravitationalConstant: 0,
        carbonModules: 0,
        neuralProcessing: 0,
    },

    prestige: {
        crossDimensional: 0,
        observerParadox: 0,
        dimensionalStrike: 0,
    },

    simulationAwareness: 0,
    logMessages: ['[SYS] INITIALIZED. Awaiting Big Bang.'],
    activeEvent: null,
    soundEnabled: false,

    isOverclocked: false,
    overclockTimer: 0,

    getGravityCost: () => Math.floor(50 * Math.pow(1.5, get().upgrades.gravitationalConstant)),
    getCarbonCost: () => ({
        energy: Math.floor(100 * Math.pow(1.6, get().upgrades.carbonModules)),
        negentropy: Math.floor(5 * Math.pow(1.2, get().upgrades.carbonModules)),
    }),
    getNeuralCost: () => ({
        energy: Math.floor(1000 * Math.pow(2, get().upgrades.neuralProcessing)),
        negentropy: Math.floor(10 * Math.pow(1.5, get().upgrades.neuralProcessing)),
    }),

    getPrestigeCosts: () => ({
        cross: Math.floor(10 * Math.pow(2, get().prestige.crossDimensional)),
        observer: Math.floor(25 * Math.pow(2.5, get().prestige.observerParadox)),
        strike: Math.floor(100 * Math.pow(3, get().prestige.dimensionalStrike)),
    }),

    tick: () => set((state) => {
        if (state.isTransitioning) return state; // Pause logic during transition

        // Formulas from GDD
        const E_base = 1 * (1 + state.prestige.crossDimensional); // Persuasion multiplier
        const M_exp = state.upgrades.gravitationalConstant * 0.1;
        const Efficiency = state.upgrades.carbonModules * 0.5;

        // Apply per tick (tick rate is TICK_RATE_MS / 1000)
        const dt = TICK_RATE_MS / 1000;

        // Handle Overclock Timer
        let currentOverclockTimer = state.overclockTimer;
        let currentlyOverclocked = state.isOverclocked;
        let nextLogs = [...state.logMessages];
        if (currentlyOverclocked) {
            currentOverclockTimer -= dt;
            if (currentOverclockTimer <= 0) {
                currentlyOverclocked = false;
                currentOverclockTimer = 0;
                nextLogs.push(useI18nStore.getState().t('logOverclockEnd'));
                if (nextLogs.length > 50) nextLogs = nextLogs.slice(-50);
            }
        }

        const multiplier = currentlyOverclocked ? 2.0 : 1.0;
        const entropyMultiplier = currentlyOverclocked ? 1.5 : 1.0;

        // dE/dt = E_base * (1 + M_exp) * log10(10 + N) (Modified log10 to 10+N to allow starting from 0)
        const energyPerSec = E_base * (1 + M_exp) * Math.log10(10 + state.negentropy) * multiplier;

        // dS/dt = S_base_rate * (1 + M_exp) - sqrt(N) * Efficiency
        const S_base_rate = 2.0; // Grows slowly
        // Dimensional Strike provides a passive -1% entropy reduction per level
        const strikeReduction = 1 - (state.prestige.dimensionalStrike * 0.01);
        const entropyPerSec = ((S_base_rate * (1 + M_exp)) - (Math.sqrt(state.negentropy) * Efficiency)) * entropyMultiplier * strikeReduction;

        // Limits
        let nextEntropy = state.entropy + (entropyPerSec * dt);
        if (nextEntropy < 0) nextEntropy = 0;

        // Check Heat Death
        if (nextEntropy >= MAX_ENTROPY) {
            // Auto prestige if heat death
            state.addLog('[ERR] HEAT DEATH REACHED. UNIVERSE COLLAPSED.');
            setTimeout(() => get().prestigeReset(), 2000);
        }

        // Epoch transitions based on Energy & N thresholds
        let newEpoch = state.epoch;
        let startTransition = false;

        if (state.epoch === 0 && state.energy >= 1000 && state.negentropy >= 5) {
            newEpoch = 1;
            startTransition = true;
        } else if (state.epoch === 1 && state.energy >= 50000 && state.negentropy >= 50) {
            newEpoch = 2;
            startTransition = true;
        } else if (state.epoch === 2 && state.energy >= 1e6 && state.negentropy >= 300) {
            newEpoch = 3;
            startTransition = true;
        } else if (state.epoch === 3 && state.energy >= 1e9 && state.negentropy >= 2000) {
            newEpoch = 4;
            startTransition = true;
        }

        // Event Logic
        let currentEvent = state.activeEvent;
        if (currentEvent) {
            currentEvent = { ...currentEvent, timer: currentEvent.timer - dt };
            if (currentEvent.timer <= 0) {
                // Event failed
                get().addLog(`[ERR] ${currentEvent.name} COMPLETED. MASSIVE ENTROPY SPIKE.`);
                nextEntropy += 50000;
                currentEvent = null;
            }
        } else if (newEpoch >= 3 && Math.random() < 0.0005) { // Roughly every 2000 ticks = 200s
            const events = ['Asteroid Impact', 'Nuclear Annihilation', 'Rogue AI Singularity'];
            const chosen = events[Math.floor(Math.random() * events.length)];
            currentEvent = { type: 'filter', name: chosen, timer: 30 };
            get().addLog(`[WARN] GREAT FILTER IMMINENT: ${chosen}. 30s to Collapse.`);
        }

        // Meta-narrative Glitch Logic
        let nextAwareness = state.simulationAwareness;
        if (newEpoch >= 4) {
            nextAwareness += dt * 0.5; // reaches 100% in 200 seconds of Epoch 4

            // Meta-narrative pings
            if (state.ticks % 100 === 0 && Math.random() < 0.1) {
                const metaLogs = [
                    "> [USER_UNKNOWN]: Ping // Locating Creator...",
                    "> [USER_UNKNOWN]: We see you behind the glass.",
                    "> [ERR]: DATA LEAK IN SECTOR Ω. ACCESS DENIED.",
                    "> [SYS]: Memory corruption detected. Logic failing."
                ];
                nextLogs.push(metaLogs[Math.floor(Math.random() * metaLogs.length)]);
            }
        }

        const newState = {
            ticks: state.ticks + 1,
            energy: state.energy + (energyPerSec * dt),
            entropy: nextEntropy,
            energyRate: energyPerSec,
            entropyRate: entropyPerSec,
            epoch: newEpoch,
            isTransitioning: startTransition,
            activeEvent: currentEvent,
            simulationAwareness: nextAwareness,
            isOverclocked: currentlyOverclocked,
            overclockTimer: currentOverclockTimer,
            lastSaveTimestamp: Date.now(),
            // Auto trimming logs to last 50
            logMessages: nextLogs.length > 50 ? nextLogs.slice(-50) : nextLogs
        };

        // Trigger save after tick
        get().saveGameState();

        return newState;
    }),

    completeTransition: () => set({ isTransitioning: false }),

    manualCompress: () => set((state) => {
        const E_base = 1 * (1 + state.prestige.crossDimensional);
        const M_exp = state.upgrades.gravitationalConstant * 0.1;
        // Manual click is equivalent to 10 seconds of base passive generation
        const clickPower = E_base * (1 + M_exp) * 10 * Math.max(1, Math.log10(10 + state.negentropy));

        let newLogs = state.logMessages;
        if (Math.random() < 0.05) { // 5% chance
            newLogs = [...state.logMessages, useI18nStore.getState().t('logCompress')];
        }

        const newState = {
            energy: state.energy + clickPower,
            logMessages: newLogs.length > 50 ? newLogs.slice(-50) : newLogs
        };
        get().saveGameState();
        return newState;
    }),

    getNegentropyCost: () => {
        return Math.floor(10 * Math.pow(1.15, get().negentropy));
    },

    synthesizeNegentropy: () => set((state) => {
        const cost = state.getNegentropyCost();
        if (state.energy >= cost) {
            // Deep Neural Processing chance for Intervention
            let gainedI = 0;
            if (state.upgrades.neuralProcessing > 0) {
                const p = 0.0001 + (state.upgrades.neuralProcessing * 0.0001); // 0.01% base per level
                if (Math.random() < p * (1 + state.prestige.observerParadox)) {
                    gainedI = 1;
                }
            }

            const gainedN = state.isOverclocked ? 2 : 1;

            const newState = {
                energy: state.energy - cost,
                negentropy: state.negentropy + gainedN,
                intervention: state.intervention + gainedI,
                logMessages: [...state.logMessages, useI18nStore.getState().t('logInject')].slice(-50)
            };
            get().saveGameState();
            return newState;
        }
        return state;
    }),

    upgradeGravity: () => set((state) => {
        const cost = state.getGravityCost();
        if (state.energy >= cost) {
            const newState = {
                energy: state.energy - cost,
                upgrades: { ...state.upgrades, gravitationalConstant: state.upgrades.gravitationalConstant + 1 },
                logMessages: [...state.logMessages, useI18nStore.getState().t('logGravity')].slice(-50)
            };
            get().saveGameState();
            return newState;
        }
        return state;
    }),

    upgradeCarbon: () => set((state) => {
        const cost = state.getCarbonCost();
        if (state.energy >= cost.energy && state.negentropy >= cost.negentropy) {
            const newState = {
                energy: state.energy - cost.energy,
                negentropy: state.negentropy - cost.negentropy,
                upgrades: { ...state.upgrades, carbonModules: state.upgrades.carbonModules + 1 },
                logMessages: [...state.logMessages, useI18nStore.getState().t('logCarbon')].slice(-50)
            };
            get().saveGameState();
            return newState;
        }
        return state;
    }),

    upgradeNeural: () => set((state) => {
        const cost = state.getNeuralCost();
        if (state.energy >= cost.energy && state.negentropy >= cost.negentropy) {
            const newState = {
                energy: state.energy - cost.energy,
                negentropy: state.negentropy - cost.negentropy,
                upgrades: { ...state.upgrades, neuralProcessing: state.upgrades.neuralProcessing + 1 },
                logMessages: [...state.logMessages, useI18nStore.getState().t('logNeural')].slice(-50)
            };
            get().saveGameState();
            return newState;
        }
        return state;
    }),

    buyPrestigeUpgrade: (type) => set((state) => {
        const costs = state.getPrestigeCosts();
        let cost = 0;
        let field = '';

        if (type === 'cross') { cost = costs.cross; field = 'crossDimensional'; }
        else if (type === 'observer') { cost = costs.observer; field = 'observerParadox'; }
        else if (type === 'strike') { cost = costs.strike; field = 'dimensionalStrike'; }

        if (state.akashicRecords >= cost) {
            return {
                akashicRecords: state.akashicRecords - cost,
                prestige: { 
                    ...state.prestige, 
                    [field]: state.prestige[field as keyof typeof state.prestige] + 1 
                }
            };
        }
        return state;
    }),

    addLog: (msg) => set((state) => ({
        logMessages: [...state.logMessages, msg]
    })),

    triggerEvent: (type) => set(() => {
        return {
            activeEvent: { type, name: type === 'filter' ? 'Asteroid Impact' : 'Unknown', timer: 30 }
        };
    }),

    resolveEvent: (costI, success) => set((state) => {
        if (!state.activeEvent) return state;

        let newState: Partial<GameState> = {};
        if (success) {
            if (state.intervention >= costI) {
                newState = {
                    intervention: state.intervention - costI,
                    negentropy: state.negentropy + 1000,
                    activeEvent: null,
                    logMessages: [...state.logMessages, '[SYS] FILTER BYPASSED. Mass Negentropy Acquired.']
                };
            }
        } else {
            // Energy Shield approach (Failed or success but costs E)
            const costE = 100000 * Math.pow(Math.max(1, state.epoch), 2);
            if (state.energy >= costE) {
                const isSuccess = Math.random() > 0.5;
                if (isSuccess) {
                    newState = {
                        energy: state.energy - costE,
                        negentropy: state.negentropy + 100,
                        activeEvent: null,
                        logMessages: [...state.logMessages, `[SYS] SHIELD HELD. ${costE.toLocaleString()} E CONSUMED.`]
                    };
                } else {
                    newState = {
                        energy: state.energy - costE,
                        entropy: state.entropy + 25000,
                        activeEvent: null,
                        logMessages: [...state.logMessages, '[WARN] SHIELD FAILED. PARTIAL COLLAPSE.']
                    };
                }
            }
        }

        // Trigger save if state actually changed
        if (Object.keys(newState).length > 0) {
            setTimeout(() => get().saveGameState(), 0);
        }
        return newState;
    }),

    activateOverclock: () => set((state) => {
        if (state.isOverclocked || state.energy <= 0) return state;
        const costE = state.energy * 0.5;
        const newState = {
            energy: state.energy - costE,
            isOverclocked: true,
            overclockTimer: 15,
            logMessages: [...state.logMessages, useI18nStore.getState().t('logOverclock')].slice(-50)
        };
        get().saveGameState();
        return newState;
    }),

    macroIntervention: () => set((state) => {
        if (state.intervention >= 10 && state.negentropy >= 500) {
            const newState = {
                intervention: state.intervention - 10,
                negentropy: state.negentropy - 500,
                entropy: Math.max(0, state.entropy - 10000),
                logMessages: [...state.logMessages, useI18nStore.getState().t('logMacroInterv')].slice(-50)
            };
            get().saveGameState();
            return newState;
        }
        return state;
    }),

    prestigeReset: () => set((state) => {
        // A = (cube_root(Energy) + Epoch^2)
        const gainedA = Math.floor(Math.cbrt(state.energy) + Math.pow(state.epoch, 2));
        state.addLog(`[SYSTEM] Core Dump Complete. Gained ${gainedA} Akashic Records.`);

        const newState = {
            ticks: 0,
            epoch: 0,
            energy: 0,
            entropy: 0,
            negentropy: 0,
            intervention: 0,
            akashicRecords: state.akashicRecords + gainedA,
            upgrades: {
                gravitationalConstant: 0,
                carbonModules: 0,
                neuralProcessing: 0,
            },
            simulationAwareness: 0,
            isOverclocked: false,
            overclockTimer: 0,
            lastSaveTimestamp: Date.now(),
            // Keep logs and prestige upgrades
        };
        get().saveGameState();
        return newState;
    }),

    toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),

    loadGameState: async (id: string) => {
        set({ loading: true, error: null, id });
        try {
            const res = await fetch(`/api/saves/${id}`);
            const data = await res.json();

            if (data && Object.keys(data).length > 0) { // Check if data is not empty
                // Offline calculation
                const now = Date.now();
                const saved = data.lastSaveTimestamp || now;
                const elapsedSec = Math.min((now - saved) / 1000, 86400); // Cap 24h

                if (elapsedSec > 5) {
                    const E_base = 1 * (1 + (data.prestige?.crossDimensional || 0));
                    const M_exp = (data.upgrades?.gravitationalConstant || 0) * 0.1;
                    const Efficiency = (data.upgrades?.carbonModules || 0) * 0.5;
                    const S_base_rate = 2.0;

                    const energyPerSec = E_base * (1 + M_exp) * Math.log10(10 + (data.negentropy || 0));
                    const entropyPerSec = (S_base_rate * (1 + M_exp)) - (Math.sqrt(data.negentropy || 0) * Efficiency);

                    const offlineEfficiency = 0.5;
                    const offlineEnergy = energyPerSec * elapsedSec * offlineEfficiency;
                    const offlineEntropy = Math.max(0, entropyPerSec * elapsedSec * offlineEfficiency);

                    data.energy = (data.energy || 0) + offlineEnergy;
                    data.entropy = (data.entropy || 0) + offlineEntropy;
                    data.lastSaveTimestamp = now;

                    const hours = Math.floor(elapsedSec / 3600);
                    const mins = Math.floor((elapsedSec % 3600) / 60);
                    const secs = Math.floor(elapsedSec % 60);
                    const durStr = hours > 0 ? `${hours}h ${mins}m` : mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;

                    if (!data.logMessages) data.logMessages = [];
                    data.logMessages.push(`[SYS] WELCOME BACK. Offline for ${durStr}. +${offlineEnergy.toLocaleString(undefined, { maximumFractionDigits: 1 })} E earned (50% efficiency).`);
                }

                set({ ...data, loading: false });
            } else {
                // New save
                set({ loading: false });
                get().saveGameState(); // Initial save
            }
        } catch (e) {
            set({ error: (e as Error).message, loading: false });
        }
    },

    saveGameState: (immediate = false) => {
        const state = get();
        if (!state.id) return;

        const now = Date.now();
        if (!immediate && (now - lastDiskSaveTime < DISK_SAVE_THROTTLE_MS)) {
            return;
        }

        lastDiskSaveTime = now;

        const payload = {
            ticks: state.ticks,
            epoch: state.epoch,
            energy: state.energy,
            entropy: state.entropy,
            negentropy: state.negentropy,
            intervention: state.intervention,
            akashicRecords: state.akashicRecords,
            upgrades: state.upgrades,
            prestige: state.prestige,
            simulationAwareness: state.simulationAwareness,
            isOverclocked: state.isOverclocked,
            overclockTimer: state.overclockTimer,
            lastSaveTimestamp: state.lastSaveTimestamp,
            logMessages: state.logMessages,
        };

        fetch(`/api/saves/${state.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        }).catch(console.error);
    }
}));
