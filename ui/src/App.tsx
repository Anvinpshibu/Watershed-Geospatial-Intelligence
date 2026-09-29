import React, { useState } from 'react';
import { Header } from './components/Header';
import { MapView } from './components/MapView';
import { LayerControl } from './components/LayerControl';
import { AnalyticsPanel } from './components/AnalyticsPanel';
import { SplitViewer } from './components/SplitViewer';
import { EvidenceModal } from './components/EvidenceModal';
import { ReportModal } from './components/ReportModal';
import { IngestionModal } from './components/IngestionModal';
import { TemporalSlider } from './components/TemporalSlider';
import {
  drainageStreams,
  fieldObservations,
  pilotWatershed,
  temporalSummary,
} from './services/fieldData';
import { FieldObservation } from './types/watershed';

export const App: React.FC = () => {
  const [activeView, setActiveView] = useState<'map' | 'split'>('map');
  const [activeLayer, setActiveLayer] = useState<'satellite' | 'ndvi' | 'ndwi' | 'dem'>('ndvi');
  const [showStreams, setShowStreams] = useState(true);
  const [showInterventions, setShowInterventions] = useState(true);
  const [showPhotos, setShowPhotos] = useState(true);

  const [observations, setObservations] = useState<FieldObservation[]>(fieldObservations);
  const [selectedObservation, setSelectedObservation] = useState<FieldObservation | null>(null);

  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isIngestOpen, setIsIngestOpen] = useState(false);
  const [currentYear, setCurrentYear] = useState(2026);

  const handleAddObservation = (newObs: FieldObservation) => {
    setObservations((prev) => [newObs, ...prev]);
    setSelectedObservation(newObs);
  };

  return (
    <>
      <Header
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenReport={() => setIsReportOpen(true)}
        onOpenIngest={() => setIsIngestOpen(true)}
      />

      <main className="app-main">
        {/* Left Sidebar: Watershed Information & GIS Layers */}
        <aside className="sidebar-panel">
          <div className="panel-header">
            <span>001 — TARGET AOI</span>
            <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-vermillion)', fontWeight: 600 }}>
              {pilotWatershed.code}
            </span>
          </div>

          <div className="panel-content">
            {/* Araskova Terminal Prompt Card (Matching screenshot) */}
            <div className="terminal-card active-accent">
              <div className="terminal-prompt-header">
                <span>ARASKOVA • WATERSHED</span>
                <span className="status-done">// ONLINE</span>
              </div>

              <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                &gt; {pilotWatershed.name}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.73rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                <div>STATE: <strong>{pilotWatershed.state}</strong> • DIST: <strong>{pilotWatershed.district}</strong></div>
                <div>BLOCK: <strong>{pilotWatershed.block}</strong></div>
                <div style={{ display: 'flex', gap: '0.85rem', marginTop: '0.3rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.4rem' }}>
                  <span>AREA: <strong style={{ color: 'var(--text-primary)' }}>{pilotWatershed.area_sq_km} km²</strong></span>
                  <span>SLOPE: <strong style={{ color: 'var(--text-primary)' }}>{pilotWatershed.mean_slope_deg}°</strong></span>
                </div>
              </div>
            </div>

            {/* GIS Layer Controls in Araskova Wireframe Style */}
            <LayerControl
              activeLayer={activeLayer}
              setActiveLayer={setActiveLayer}
              showStreams={showStreams}
              setShowStreams={setShowStreams}
              showInterventions={showInterventions}
              setShowInterventions={setShowInterventions}
              showPhotos={showPhotos}
              setShowPhotos={setShowPhotos}
            />

            {/* Araskova Research Footer Note */}
            <div
              style={{
                marginTop: 'auto',
                padding: '0.85rem',
                borderRadius: 'var(--radius-xs)',
                background: '#ffffff',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.7rem',
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-muted)',
                lineHeight: 1.5,
              }}
            >
              <div style={{ color: 'var(--accent-vermillion)', fontWeight: 700, marginBottom: '0.2rem' }}>
                SHELL 001 • ARASKOVA LABS
              </div>
              <div>
                Kerala, India • Est. 2026. Earth observation collocated with geo-coded field evidence for DoLR Problem Statement 26015.
              </div>
            </div>
          </div>
        </aside>

        {/* Center Canvas: Interactive Digital Twin Map OR Synchronized Split Viewer */}
        <section style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
          {activeView === 'map' ? (
            <>
              {/* Floating Top Timeline Slider */}
              <div style={{ position: 'absolute', top: '2.8rem', left: '1rem', right: '1rem', zIndex: 30, pointerEvents: 'none' }}>
                <div style={{ pointerEvents: 'auto', maxWidth: 460, margin: '0 auto' }}>
                  <TemporalSlider currentYear={currentYear} setCurrentYear={setCurrentYear} />
                </div>
              </div>

              <MapView
                watershed={pilotWatershed}
                streams={drainageStreams}
                observations={observations}
                onSelectObservation={setSelectedObservation}
                activeLayer={activeLayer}
                showInterventions={showInterventions}
                showStreams={showStreams}
                showPhotos={showPhotos}
              />
            </>
          ) : (
            <SplitViewer
              watershed={pilotWatershed}
              observations={observations}
              onSelectObservation={setSelectedObservation}
            />
          )}
        </section>

        {/* Right Sidebar: Analytics, KPIs & Observations Stream */}
        <AnalyticsPanel
          watershed={pilotWatershed}
          observations={observations}
          temporal={temporalSummary}
          onSelectObservation={setSelectedObservation}
        />
      </main>

      {/* Top-layer Animated Modals */}
      <EvidenceModal
        observation={selectedObservation}
        onClose={() => setSelectedObservation(null)}
      />

      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        watershed={pilotWatershed}
        temporal={temporalSummary}
        observations={observations}
      />

      <IngestionModal
        isOpen={isIngestOpen}
        onClose={() => setIsIngestOpen(false)}
        onAddObservation={handleAddObservation}
      />
    </>
  );
};
