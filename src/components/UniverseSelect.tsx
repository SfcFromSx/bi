import { useEffect, useState } from 'react';
import { useUniverseStore } from '../store/universeStore';
import { Plus, Trash2, Power } from 'lucide-react';
import './UniverseSelect.css';

export default function UniverseSelect() {
    const { universes, loading, error, fetchUniverses, createUniverse, selectUniverse, deleteUniverse } = useUniverseStore();
    const [newName, setNewName] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [createError, setCreateError] = useState<string | null>(null);

    useEffect(() => {
        fetchUniverses();
    }, [fetchUniverses]);

    const handleCreate = async () => {
        const name = newName.trim();
        if (!name) return;
        setCreateError(null);
        setIsCreating(true);
        try {
            await createUniverse(name);
            setNewName('');
        } catch (e) {
            setCreateError((e as Error).message);
        } finally {
            setIsCreating(false);
        }
    };

    if (loading && universes.length === 0) {
        return <div className="universe-select-screen loading">INITIALIZING SENSORS...</div>;
    }

    if (error) {
        return <div className="universe-select-screen error">CRITICAL ERROR: {error}</div>;
    }

    return (
        <div className="universe-select-screen">
            <div className="select-header">
                <h1>SUPERCLUSTER <span>NAVIGATOR</span></h1>
                <p>Select a localized spacetime continuum to observe and intervene.</p>
            </div>

            <div className="universe-grid">
                {/* Create Card */}
                <div className="universe-card create-card">
                    <div className="create-content">
                        <Plus size={48} className="create-icon" />
                        <input
                            type="text"
                            placeholder="Enter Universe Designation..."
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                            disabled={isCreating}
                        />
                        <button className="primary-btn" onClick={handleCreate} disabled={!newName.trim() || isCreating}>
                            INITIALIZE NEW BIG BANG
                        </button>
                        {createError && <p className="create-error">{createError}</p>}
                    </div>
                </div>

                {/* Existing Universes */}
                {universes.map(u => (
                    <div key={u.id} className="universe-card">
                        <div className="card-top">
                            <h3>{u.name}</h3>
                            <button className="delete-btn" onClick={() => deleteUniverse(u.id)} title="Delete Universe">
                                <Trash2 size={16} />
                            </button>
                        </div>

                        <div className="card-stats">
                            <div className="stat-row">
                                <span className="stat-label">EPOCH</span>
                                <span className="stat-value highlight">{u.epoch}</span>
                            </div>
                            <div className="stat-row">
                                <span className="stat-label">ENERGY</span>
                                <span className="stat-value">{Number(u.energy || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                            </div>
                            <div className="stat-row">
                                <span className="stat-label">TICKS</span>
                                <span className="stat-value">{u.ticks}</span>
                            </div>
                        </div>

                        <div className="card-bottom">
                            <span className="created-at">Created: {new Date(u.createdAt).toLocaleDateString()}</span>
                            <button className="enter-btn" onClick={() => selectUniverse(u.id)}>
                                <Power size={14} /> JUMP IN
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
