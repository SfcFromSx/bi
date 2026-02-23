/**
 * Vite API Plugin — Local JSON File Storage
 *
 * Adds REST endpoints to the Vite dev server for multi-universe game state persistence.
 * Data is stored as JSON files in ./data/ directory on the host machine.
 *
 * Endpoints:
 *   GET    /api/universes           → list all universes
 *   POST   /api/universes           → create a new universe
 *   DELETE /api/universes/:id       → delete a universe
 *   GET    /api/saves/:id           → load game state for a universe
 *   PUT    /api/saves/:id           → save game state for a universe
 *   GET    /api/preferences         → get global preferences (language, etc.)
 *   PUT    /api/preferences         → save global preferences
 */

import { Plugin } from 'vite';
import fs from 'node:fs';
import path from 'node:path';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const UNIVERSES_FILE = path.join(DATA_DIR, 'universes.json');
const SAVES_DIR = path.join(DATA_DIR, 'saves');
const PREFS_FILE = path.join(DATA_DIR, 'preferences.json');

// Ensure data directories exist
function ensureDirs() {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    if (!fs.existsSync(SAVES_DIR)) fs.mkdirSync(SAVES_DIR, { recursive: true });
}

function readJSON(filePath: string, fallback: unknown = null): unknown {
    try {
        if (!fs.existsSync(filePath)) return fallback;
        return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    } catch {
        return fallback;
    }
}

function writeJSON(filePath: string, data: unknown): void {
    ensureDirs();
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

// Parse JSON body from IncomingMessage
function parseBody(req: import('http').IncomingMessage): Promise<Record<string, unknown>> {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', (chunk: Buffer) => { body += chunk.toString(); });
        req.on('end', () => {
            try {
                resolve(body ? JSON.parse(body) : {});
            } catch (e) {
                reject(e);
            }
        });
    });
}

export default function apiPlugin(): Plugin {
    return {
        name: 'genesis-api',
        configureServer(server) {
            ensureDirs();

            server.middlewares.use(async (req, res, next) => {
                const url = req.url || '';

                // ─── List Universes ──────────────────────────
                if (url === '/api/universes' && req.method === 'GET') {
                    const universes = readJSON(UNIVERSES_FILE, []);
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(universes));
                    return;
                }

                // ─── Create Universe ─────────────────────────
                if (url === '/api/universes' && req.method === 'POST') {
                    const body = await parseBody(req);
                    const universes = (readJSON(UNIVERSES_FILE, []) as Array<Record<string, unknown>>);
                    const id = crypto.randomUUID();
                    const newUniverse = {
                        id,
                        name: body.name || `Universe Ω-${universes.length + 1}`,
                        createdAt: Date.now(),
                        epoch: 0,
                        energy: 0,
                        negentropy: 0,
                        ticks: 0,
                    };
                    universes.push(newUniverse);
                    writeJSON(UNIVERSES_FILE, universes);
                    // Create empty save file
                    writeJSON(path.join(SAVES_DIR, `${id}.json`), null);
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(newUniverse));
                    return;
                }

                // ─── Delete Universe ─────────────────────────
                const deleteMatch = url.match(/^\/api\/universes\/([a-f0-9-]+)$/);
                if (deleteMatch && req.method === 'DELETE') {
                    const id = deleteMatch[1];
                    let universes = (readJSON(UNIVERSES_FILE, []) as Array<Record<string, unknown>>);
                    universes = universes.filter((u) => u.id !== id);
                    writeJSON(UNIVERSES_FILE, universes);
                    // Remove save file
                    const savePath = path.join(SAVES_DIR, `${id}.json`);
                    if (fs.existsSync(savePath)) fs.unlinkSync(savePath);
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ ok: true }));
                    return;
                }

                // ─── Load Game State ─────────────────────────
                const loadMatch = url.match(/^\/api\/saves\/([a-f0-9-]+)$/);
                if (loadMatch && req.method === 'GET') {
                    const id = loadMatch[1];
                    const savePath = path.join(SAVES_DIR, `${id}.json`);
                    const data = readJSON(savePath, null);
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(data));
                    return;
                }

                // ─── Save Game State ─────────────────────────
                const saveMatch = url.match(/^\/api\/saves\/([a-f0-9-]+)$/);
                if (saveMatch && req.method === 'PUT') {
                    const id = saveMatch[1];
                    const body = await parseBody(req);
                    const savePath = path.join(SAVES_DIR, `${id}.json`);
                    writeJSON(savePath, body);

                    // Also update universe preview data
                    const universes = (readJSON(UNIVERSES_FILE, []) as Array<Record<string, unknown>>);
                    const idx = universes.findIndex((u) => u.id === id);
                    if (idx !== -1) {
                        universes[idx].epoch = body.epoch ?? universes[idx].epoch;
                        universes[idx].energy = body.energy ?? universes[idx].energy;
                        universes[idx].negentropy = body.negentropy ?? universes[idx].negentropy;
                        universes[idx].ticks = body.ticks ?? universes[idx].ticks;
                        writeJSON(UNIVERSES_FILE, universes);
                    }
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ ok: true }));
                    return;
                }

                // ─── Get Preferences ─────────────────────────
                if (url === '/api/preferences' && req.method === 'GET') {
                    const prefs = readJSON(PREFS_FILE, { lang: 'en' });
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(prefs));
                    return;
                }

                // ─── Save Preferences ────────────────────────
                if (url === '/api/preferences' && req.method === 'PUT') {
                    const body = await parseBody(req);
                    const existing = (readJSON(PREFS_FILE, {}) as Record<string, unknown>);
                    writeJSON(PREFS_FILE, { ...existing, ...body });
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ ok: true }));
                    return;
                }

                next();
            });
        },
    };
}
