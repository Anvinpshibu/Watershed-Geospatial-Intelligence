import React, { useState } from 'react';
import { FieldObservation, WatershedBoundary } from '../types/watershed';
import { Calendar, ArrowRight } from 'lucide-react';

interface SplitViewerProps {
  watershed: WatershedBoundary;
  observations: FieldObservation[];
  onSelectObservation: (obs: FieldObservation) => void;
}

export const SplitViewer: React.FC<SplitViewerProps> = ({
  watershed,
  observations,
  onSelectObservation,
}) => {
  const [sliderPosition, setSliderPosition] = useState(50); // percentage 0 - 100
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    setSliderPosition((x / rect.width) * 100);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-primary)' }}>
      {/* Top Controls Bar with Araskova Technical Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.85rem 1.75rem',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'rgba(245, 242, 235, 0.95)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
            {watershed.name}
          </span>
          <span className="technical-tag">
            002 — TEMPORAL FUSION
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
            <Calendar size={13} style={{ color: 'var(--accent-vermillion)' }} />
            <span>BASELINE: <strong>15-JAN-2023</strong></span>
          </div>
          <ArrowRight size={13} style={{ color: 'var(--accent-vermillion)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-primary)' }}>
            <Calendar size={13} style={{ color: 'var(--accent-vermillion)' }} />
            <span>POST-INTERVENTION: <strong>18-JAN-2026</strong></span>
          </div>
        </div>
      </div>

      {/* Synchronized Split Visual Container */}
      <div
        style={{
          position: 'relative',
          flex: 1,
          overflow: 'hidden',
          cursor: isDragging ? 'ew-resize' : 'default',
        }}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onMouseMove={handleMouseMove}
      >
        {/* RIGHT LAYER (2026 After - Post-Treatment / Enhanced Green Canopy) */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: '#e8e4d8',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '2.5rem',
          }}
        >
          {/* Faint contour lines on 2026 side */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
            <ellipse cx="65%" cy="45%" rx="240" ry="160" fill="none" stroke="#15803d" strokeWidth="1" opacity="0.15" />
            <ellipse cx="65%" cy="45%" rx="180" ry="120" fill="#22c55e" opacity="0.18" />
            <ellipse cx="75%" cy="60%" rx="90" ry="60" fill="#0284c7" opacity="0.25" />
          </svg>

          <div style={{ alignSelf: 'flex-end', background: '#ffffff', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-xs)', padding: '1rem 1.25rem', boxShadow: 'var(--shadow-panel)', zIndex: 10 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--accent-emerald)', fontWeight: 700, letterSpacing: '0.08em' }}>
              02 // POST-INTERVENTION (JAN 2026)
            </div>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
              Mean NDVI: 0.554 <span style={{ fontSize: '0.85rem', color: 'var(--accent-emerald)' }}>(+34.5% Greening)</span>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              Surface Water Infiltration: 6.8 ha (+2.6 ha)
            </div>

            <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap', maxWidth: 360 }}>
              {observations.slice(0, 4).map((obs) => (
                <button
                  key={obs.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectObservation(obs);
                  }}
                  className="btn btn-glass"
                  style={{ fontSize: '0.68rem', padding: '0.25rem 0.6rem', border: '1px solid var(--border-medium)', background: '#ffffff' }}
                >
                  <span style={{ color: 'var(--accent-vermillion)' }}>●</span> {obs.detectedIntervention.displayName}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* LEFT LAYER (2023 Before - Baseline / Arid Pre-Treatment) */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            width: `${sliderPosition}%`,
            overflow: 'hidden',
            borderRight: '2px solid var(--accent-vermillion)',
            boxShadow: '4px 0 24px rgba(0,0,0,0.12)',
            background: '#ded8c9',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '2.5rem',
          }}
        >
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
            <ellipse cx="40%" cy="45%" rx="160" ry="110" fill="none" stroke="#d9461e" strokeWidth="1" opacity="0.15" />
            <ellipse cx="40%" cy="45%" rx="110" ry="70" fill="#b45309" opacity="0.12" />
            <ellipse cx="50%" cy="65%" rx="45" ry="25" fill="#0284c7" opacity="0.18" />
          </svg>

          <div style={{ background: '#ffffff', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-xs)', padding: '1rem 1.25rem', width: 'fit-content', boxShadow: 'var(--shadow-panel)', zIndex: 10 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--accent-vermillion)', fontWeight: 700, letterSpacing: '0.08em' }}>
              01 // PRE-TREATMENT BASELINE (JAN 2023)
            </div>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
              Mean NDVI: 0.412
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              Surface Water Infiltration: 4.2 ha
            </div>
          </div>
        </div>

        {/* Draggable Divider Handle with Vermillion Box */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: `${sliderPosition}%`,
            width: '2px',
            background: 'var(--accent-vermillion)',
            cursor: 'ew-resize',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 30,
          }}
        >
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 'var(--radius-xs)',
              background: 'var(--accent-vermillion)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '0.7rem',
              boxShadow: '0 2px 8px rgba(217, 70, 30, 0.4)',
              border: '1px solid #ffffff',
            }}
          >
            ↔
          </div>
        </div>
      </div>

      {/* Bottom Summary Strip in Araskova Technical Grid Format */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1rem',
          padding: '1rem 1.75rem',
          borderTop: '1px solid var(--border-subtle)',
          background: 'rgba(245, 242, 235, 0.95)',
        }}
      >
        <div className="terminal-card" style={{ padding: '0.85rem' }}>
          <div className="terminal-prompt-header">
            <span>[001 - VEGETATION]</span>
            <span className="status-done">// POSITIVE</span>
          </div>
          <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--accent-emerald)', fontFamily: 'var(--font-sans)' }}>
            +34.5% Greening
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
            312.4 ha net canopy recovery
          </div>
        </div>

        <div className="terminal-card" style={{ padding: '0.85rem' }}>
          <div className="terminal-prompt-header">
            <span>[002 - WATER INFILTRATION]</span>
            <span className="status-done">// SURPLUS</span>
          </div>
          <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--accent-cyan)', fontFamily: 'var(--font-sans)' }}>
            +2.6 ha (+61.9%)
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
            Check dams & percolation ponds
          </div>
        </div>

        <div className="terminal-card" style={{ padding: '0.85rem' }}>
          <div className="terminal-prompt-header">
            <span>[003 - DEGRADED LAND]</span>
            <span className="status-done">// REDUCED</span>
          </div>
          <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--accent-vermillion)', fontFamily: 'var(--font-sans)' }}>
            -18.2% Barren Area
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
            Vegetated contour bunding
          </div>
        </div>

        <div className="terminal-card" style={{ padding: '0.85rem' }}>
          <div className="terminal-prompt-header">
            <span>[004 - CALIBRATION]</span>
            <span className="status-done">// HIGH</span>
          </div>
          <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-sans)' }}>
            92% Calibrated
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
            Sentinel-2 + Landsat cross-check
          </div>
        </div>
      </div>
    </div>
  );
};
