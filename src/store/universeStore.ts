import { create } from 'zustand';

// ─── Types ───────────────────────────────────────────────────────────────────
export interface UniverseMeta {
    id: string;
    name: string;
    createdAt: number;
    epoch: number;
    energy: number;
    negentropy: number;
    ticks: number;
}

interface UniverseListState {
    universes: UniverseMeta[];
    activeUniverseId: string | null;
    loading: boolean;
    error: string | null;

    // Actions
    fetchUniverses: () => Promise<void>;
    createUniverse: (name: string) => Promise<string>;
    deleteUniverse: (id: string) => Promise<void>;
    selectUniverse: (id: string) => void;
    exitUniverse: () => void;
}

// ─── Store ───────────────────────────────────────────────────────────────────
export const useUniverseStore = create<UniverseListState>((set, get) => ({
    universes: [],
    activeUniverseId: null,
    loading: true,
    error: null,

    fetchUniverses: async () => {
        set({ loading: true, error: null });
        try {
            const res = await fetch('/api/universes');
            const universes: UniverseMeta[] = await res.json();
            // Sort newest first
            universes.sort((a, b) => b.createdAt - a.createdAt);
            set({ universes, loading: false });
        } catch (e) {
            set({ error: (e as Error).message, loading: false });
        }
    },

    createUniverse: async (name: string) => {
        const res = await fetch('/api/universes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name }),
        });
        const newUniverse: UniverseMeta = await res.json();
        // Refresh list
        await get().fetchUniverses();
        return newUniverse.id;
    },

    deleteUniverse: async (id: string) => {
        await fetch(`/api/universes/${id}`, { method: 'DELETE' });
        if (get().activeUniverseId === id) {
            set({ activeUniverseId: null });
        }
        await get().fetchUniverses();
    },

    selectUniverse: (id: string) => {
        set({ activeUniverseId: id });
    },

    exitUniverse: () => {
        set({ activeUniverseId: null });
    },
}));
