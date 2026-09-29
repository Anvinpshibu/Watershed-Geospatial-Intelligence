import React from 'react';
import { FieldObservation, TemporalSummary, WatershedBoundary } from '../types/watershed';
import { TrendingUp, Droplets, ChevronRight } from 'lucide-react';

interface AnalyticsPanelProps {
  watershed: WatershedBoundary;
  observations: FieldObservation[];
  temporal: TemporalSummary;
  onSelectObservation: (obs: FieldObservation) => void;
}

export const AnalyticsPanel: React.FC<AnalyticsPanelProps> = ({
  watershed,
  observations,
  temporal,
  onSelectObservation,
}) => {
  return (
    <aside className="sidebar-panel right">
      <div className="panel-header">
        <span>ANALYTICS & OBSERVATIONS</span>
        <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-vermillion)', fontWeight: 600 }}>
          {watershed.code}
        </span>
      </div>

      <div className="panel-content">
        {/* KPI Grid in Araskova Wireframe Terminal Style */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
          <div className="terminal-card" style={{ padding: '0.75rem' }}>
            <div className="terminal-prompt-header">
              <span>[001 - AREA]</span>
            </div>
            <div className="kpi-value">{watershed.area_sq_km} <span style={{ fontSize: '0.75rem', fontWeight: 500 }}>km²</span></div>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Order {watershed.drainage_order} Basin</span>
          </div>

          <div className="terminal-card" style={{ padding: '0.75rem' }}>
            <div className="terminal-prompt-header">
              <span>[002 - INTERVENTIONS]</span>
            </div>
            <div className="kpi-value" style={{ color: 'var(--accent-vermillion)' }}>
              {observations.length}
            </div>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>100% Spatially Mapped</span>
          </div>

          <div className="terminal-card" style={{ padding: '0.75rem' }}>
            <div className="terminal-prompt-header">
              <span>[003 - NDVI DELTA]</span>
            </div>
            <div className="kpi-value" style={{ color: 'var(--accent-emerald)' }}>
              +{temporal.ndviDelta.toFixed(3)}
            </div>
            <span className="kpi-delta positive">
              <TrendingUp size={11} /> +{temporal.ndviPercentageChange.toFixed(1)}%
            </span>
          </div>

          <div className="terminal-card" style={{ padding: '0.75rem' }}>
            <div className="terminal-prompt-header">
              <span>[004 - WATER AREA]</span>
            </div>
            <div className="kpi-value" style={{ color: 'var(--accent-cyan)' }}>
              {temporal.waterAreaCurrentHa} <span style={{ fontSize: '0.75rem', fontWeight: 500 }}>ha</span>
            </div>
            <span className="kpi-delta positive">
              <Droplets size={11} /> +{temporal.waterAreaDeltaHa} ha gain
            </span>
          </div>
        </div>

        {/* Priority & Risk Mapping (FR-018) */}
        <div className="terminal-card" style={{ padding: '0.9rem' }}>
          <div className="terminal-prompt-header">
            <span>[TREATMENT PRIORITIES // FR-018]</span>
            <span className="status-done">ACTIVE</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.72rem', fontFamily: 'var(--font-mono)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0.5rem', background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xs)' }}>
              <span style={{ color: 'var(--accent-vermillion)', fontWeight: 600 }}>HIGH EROSION (&gt;12° SLOPE)</span>
              <span style={{ fontWeight: 700 }}>3 SITES</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0.5rem', background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xs)' }}>
              <span style={{ color: 'var(--accent-amber)', fontWeight: 600 }}>VEGETATION WATER STRESS</span>
              <span style={{ fontWeight: 700 }}>2 SITES</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0.5rem', background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xs)' }}>
              <span style={{ color: 'var(--accent-emerald)', fontWeight: 600 }}>CHECK DAM SITES RECOMMENDED</span>
              <span style={{ fontWeight: 700 }}>4 SITES</span>
            </div>
          </div>
        </div>

        {/* Field Observations Stream */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            <span>// FIELD EVIDENCE STREAM</span>
            <span>{observations.length} RECORDS</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', maxHeight: '280px', overflowY: 'auto' }}>
            {observations.map((obs) => (
              <div
                key={obs.id}
                className="terminal-card"
                style={{
                  padding: '0.6rem 0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  background: '#ffffff',
                }}
                onClick={() => onSelectObservation(obs)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <img
                    src={obs.imageUrl}
                    alt={obs.fileName}
                    style={{ width: 34, height: 34, borderRadius: 'var(--radius-xs)', objectFit: 'cover', border: '1px solid var(--border-medium)' }}
                  />
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-sans)' }}>
                      {obs.detectedIntervention.displayName}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      {obs.id} • {(obs.detectedIntervention.confidence * 100).toFixed(0)}% CONF
                    </div>
                  </div>
                </div>

                <ChevronRight size={14} style={{ color: 'var(--accent-vermillion)' }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};
