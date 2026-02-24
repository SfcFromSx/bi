import { useEffect, useRef } from 'react';
import { useGameStore, MAX_ENTROPY } from '../store/gameStore';

export default function SoundEngine({ enabled }: { enabled: boolean }) {
    const entropy = useGameStore(state => state.entropy);
    const epoch = useGameStore(state => state.epoch);
    const awareness = useGameStore(state => state.simulationAwareness);

    const audioContextRef = useRef<AudioContext | null>(null);
    const gainNodeRef = useRef<GainNode | null>(null);
    const osc1Ref = useRef<OscillatorNode | null>(null);
    const osc2Ref = useRef<OscillatorNode | null>(null);
    const filterRef = useRef<BiquadFilterNode | null>(null);

    useEffect(() => {
        if (enabled && !audioContextRef.current) {
            const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
            const ctx = new AudioContextClass();
            audioContextRef.current = ctx;

            const masterGain = ctx.createGain();
            masterGain.gain.value = 0.05; // Low volume drone
            masterGain.connect(ctx.destination);
            gainNodeRef.current = masterGain;

            const filter = ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.value = 400;
            filter.Q.value = 5;
            filter.connect(masterGain);
            filterRef.current = filter;

            // Deep Drone
            const osc1 = ctx.createOscillator();
            osc1.type = 'sawtooth';
            osc1.frequency.value = 40; // 40Hz
            osc1.connect(filter);
            osc1.start();
            osc1Ref.current = osc1;

            // Harmonic Drone
            const osc2 = ctx.createOscillator();
            osc2.type = 'sine';
            osc2.frequency.value = 60; // 60Hz
            osc2.connect(filter);
            osc2.start();
            osc2Ref.current = osc2;
        }

        if (!enabled && audioContextRef.current) {
            audioContextRef.current.close();
            audioContextRef.current = null;
        }

        return () => {
            if (audioContextRef.current) {
                audioContextRef.current.close();
                audioContextRef.current = null;
            }
        };
    }, [enabled]);

    // Modulate sound based on game state
    useEffect(() => {
        if (!audioContextRef.current || !osc1Ref.current || !osc2Ref.current || !filterRef.current) return;

        const entropyRatio = entropy / MAX_ENTROPY;

        // As entropy rises, frequency jitter increases and filter opens
        osc1Ref.current.frequency.setTargetAtTime(40 + entropyRatio * 5, audioContextRef.current.currentTime, 0.5);
        osc2Ref.current.frequency.setTargetAtTime(60 + epoch * 10, audioContextRef.current.currentTime, 0.5);

        // Filter frequency goes up with awareness (higher "tension")
        const filterFreq = 400 + (awareness * 10);
        filterRef.current.frequency.setTargetAtTime(filterFreq, audioContextRef.current.currentTime, 0.5);

    }, [entropy, epoch, awareness]);

    return null;
}
