# Genesis Dashboard (创世面板)

[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

A hard sci-fi incremental/idle game built as a high-tech Business Intelligence (BI) monitoring dashboard. You are the Architect, observing and intervening in a simulated universe while battling the inevitable heat death (Entropy).

## 🌌 The Premise

In *Genesis Dashboard*, you don't just "play" a game; you monitor a spacetime continuum. Using a minimalist, data-driven interface, you manage resources, adjust fundamental physical constants, and guide civilizations through the "Great Filters" of existence.

### Core Mechanics
- **Resource Management**: Balance **Energy (E)**, **Negentropy (N)**, and **Intervention (I)**.
- **Entropy Struggle**: Every action and the passage of time increases **Entropy (S)**. If it reaches maximum, the universe suffers "Heat Death" and must be reset.
- **Prestige System**: Collapse your universe into **Akashic Records (A)** to unlock permanent cross-dimensional upgrades.
- **Meta-Narrative**: As your simulation gains awareness, the boundary between the game and your reality begins to blur.

## 🛠 Tech Stack

- **Framework**: React 19 + TypeScript
- **Bundler**: Vite
- **State Management**: Zustand (with local persistence)
- **Visuals**: Vanilla CSS (Neon-Noir aesthetic) + Lucide Icons
- **Data Visualization**: Recharts (for real-time resource flux monitoring)
- **Persistence**: Custom Vite API Plugin (local JSON storage in `./data/`)

## 🚀 Getting Started

### Prerequisites
- Node.js (Latest LTS recommended)
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/SfcFromSx/bi.git
   cd bi/v2
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev -- --port 8888
   ```

4. **Open your browser**:
   Navigate to `http://localhost:8888` to begin the simulation.

## 📂 Project Structure

```text
├── data/               # Local JSON storage for universes and saves
├── src/
│   ├── components/     # UI Panels (TopBar, LeftPanel, CenterPanel, RightPanel)
│   ├── store/          # Zustand game logic and universe management
│   ├── i18n/           # Bilingual support (EN/ZH)
│   └── assets/         # Static assets and global styles
├── vite-api-plugin.ts  # Custom plugin for local file persistence
└── package.json
```

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

---
*"[SYS] INITIALIZED. Awaiting Big Bang."*
