import React from 'react';
import { ShieldCheck, Waves, Camera } from 'lucide-react';

interface LayerControlProps {
  activeLayer: 'satellite' | 'ndvi' | 'ndwi' | 'dem';
  setActiveLayer: (layer: 'satellite' | 'ndvi' | 'ndwi' | 'dem') => void;
  showInterventions: boolean;
  setShowInterventions: (val: boolean) => void;
  showStreams: boolean;
  setShowStreams: (val: boolean) => void;
  showPhotos: boolean;
  setShowPhotos: (val: boolean) => void;
}

export const LayerControl: React.FC<LayerControlProps> = ({
  activeLayer,
  setActiveLayer,
  showInterventions,
  setShowInterventions,
  showStreams,
  setShowStreams,
  showPhotos,
  setShowPhotos,
}) => {
  return (
    <div className="terminal-card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
      <div className="terminal-prompt-header">
        <span>[001 - RASTER LAYERS]</span>
        <span className="status-done">CALIBRATED</span>
      </div>

      {/* Raster Mode Selection */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
        <button
          className={`btn btn-glass ${activeLayer === 'satellite' ? 'active' : ''}`}
          onClick={() => setActiveLayer('satellite')}
          style={{ fontSize: '0.72rem', padding: '0.45rem 0.5rem', justifyContent: 'flex-start' }}
        >
          🛰️ TRUE COLOR
        </button>
        <button
          className={`btn btn-glass ${activeLayer === 'ndvi' ? 'active' : ''}`}
          onClick={() => setActiveLayer('ndvi')}
          style={{ fontSize: '0.72rem', padding: '0.45rem 0.5rem', justifyContent: 'flex-start' }}
        >
          🌿 NDVI VEG
        </button>
        <button
          className={`btn btn-glass ${activeLayer === 'ndwi' ? 'active' : ''}`}
          onClick={() => setActiveLayer('ndwi')}
          style={{ fontSize: '0.72rem', padding: '0.45rem 0.5rem', justifyContent: 'flex-start' }}
        >
          💧 NDWI WATER
        </button>
        <button
          className={`btn btn-glass ${activeLayer === 'dem' ? 'active' : ''}`}
          onClick={() => setActiveLayer('dem')}
          style={{ fontSize: '0.72rem', padding: '0.45rem 0.5rem', justifyContent: 'flex-start' }}
        >
          ⛰️ DEM RELIEF
        </button>
      </div>

      <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
        <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em' }}>
          // VECTOR OVERLAYS
        </span>

        <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <Waves size={13} style={{ color: 'var(--accent-cyan)' }} />
            <span>Drainage Streams</span>
          </div>
          <input
            type="checkbox"
            checked={showStreams}
            onChange={(e) => setShowStreams(e.target.checked)}
            style={{ accentColor: 'var(--accent-vermillion)', cursor: 'pointer' }}
          />
        </label>

        <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <Camera size={13} style={{ color: 'var(--accent-vermillion)' }} />
            <span>Geo-Coded Photos</span>
          </div>
          <input
            type="checkbox"
            checked={showPhotos}
            onChange={(e) => setShowPhotos(e.target.checked)}
            style={{ accentColor: 'var(--accent-vermillion)', cursor: 'pointer' }}
          />
        </label>

        <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <ShieldCheck size={13} style={{ color: 'var(--accent-emerald)' }} />
            <span>Intervention Assets</span>
          </div>
          <input
            type="checkbox"
            checked={showInterventions}
            onChange={(e) => setShowInterventions(e.target.checked)}
            style={{ accentColor: 'var(--accent-vermillion)', cursor: 'pointer' }}
          />
        </label>
      </div>
    </div>
  );
};
