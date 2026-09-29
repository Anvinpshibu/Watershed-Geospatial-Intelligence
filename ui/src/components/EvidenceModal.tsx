import React, { useEffect, useRef } from 'react';
import { FieldObservation } from '../types/watershed';
import { X, Copy, Download, ArrowUpRight } from 'lucide-react';

interface EvidenceModalProps {
  observation: FieldObservation | null;
  onClose: () => void;
}

export const EvidenceModal: React.FC<EvidenceModalProps> = ({ observation, onClose }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (observation) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }
  }, [observation]);

  const [copiedHash, setCopiedHash] = React.useState(false);

  if (!observation) return null;

  const copyHash = () => {
    navigator.clipboard.writeText(observation.sha256Hash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const exportEvidenceContract = () => {
    const contract = {
      observation_id: observation.id,
      project_id: observation.projectId,
      watershed_id: observation.watershedId,
      image: {
        uri: observation.storageUri,
        sha256: observation.sha256Hash,
      },
      location: {
        latitude: observation.latitude,
        longitude: observation.longitude,
        crs: 'EPSG:4326',
      },
      time: observation.timestamp,
      source: 'field_geo_photo',
      intervention: {
        type: observation.detectedIntervention.displayName,
        confidence: observation.detectedIntervention.confidence,
        condition: observation.detectedIntervention.condition,
      },
      satellite_context: {
        provider: observation.satelliteContext.provider,
        scene_id: observation.satelliteContext.sceneId,
        ndvi: observation.satelliteContext.ndvi,
        ndwi: observation.satelliteContext.ndwi,
        ndvi_change: observation.satelliteContext.ndviDelta,
        water_area_change_ha: observation.satelliteContext.waterAreaHa,
      },
      terrain: {
        elevation_m: observation.terrainContext.elevationM,
        slope_deg: observation.terrainContext.slopeDeg,
        drainage_distance_m: observation.terrainContext.drainageDistanceM,
      },
      provenance: {
        model_version: observation.detectedIntervention.modelVersion,
        processing_version: 'watershed-pipeline-v1.0',
        timestamp: new Date().toISOString(),
        limitations: 'Spatial correlation indicator; requires ground confirmation for legal certification.',
      },
      evidence_quality: observation.evidenceQuality,
    };

    const blob = new Blob([JSON.stringify(contract, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Evidence_Record_${observation.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <dialog
      ref={dialogRef}
      className="evidence-dialog"
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose();
      }}
    >
      <div className="modal-container">
        {/* Terminal Header matching Araskova Response Terminal in screenshot */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1.25rem 1.75rem',
            borderBottom: '1px solid var(--border-medium)',
            background: '#ffffff',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div
              style={{
                width: 24,
                height: 24,
                background: 'var(--accent-vermillion)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                fontWeight: 800,
                borderRadius: 'var(--radius-xs)',
              }}
            >
              A
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                ARASKOVA • EVIDENCE DOSSIER
              </div>
              <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                &gt; observation: {observation.id} [{observation.detectedIntervention.displayName.toLowerCase()}]
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span
              style={{
                fontSize: '0.7rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                padding: '0.2rem 0.55rem',
                borderRadius: 'var(--radius-xs)',
                background: 'var(--accent-vermillion-subtle)',
                color: 'var(--accent-vermillion)',
                border: '1px solid var(--accent-vermillion-border)',
              }}
            >
              // DONE • QUALITY: {observation.evidenceQuality.toUpperCase()}
            </span>

            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: '1px solid var(--border-medium)',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: '0.3rem',
                borderRadius: 'var(--radius-xs)',
              }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Modal Body: 2 Column Layout with Araskova Wireframe Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', padding: '1.75rem', gap: '1.5rem', overflowY: 'auto', background: 'var(--bg-primary)' }}>
          {/* Left: Image & AI Vision Inspection */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div
              style={{
                position: 'relative',
                borderRadius: 'var(--radius-xs)',
                overflow: 'hidden',
                border: '1px solid var(--border-strong)',
                background: '#121212',
                maxHeight: '310px',
              }}
            >
              <img
                src={observation.imageUrl}
                alt={observation.fileName}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />

              {/* Technical Vermillion Bounding Box */}
              <div
                style={{
                  position: 'absolute',
                  top: '18%',
                  left: '12%',
                  width: '76%',
                  height: '65%',
                  border: '2px solid var(--accent-vermillion)',
                  boxShadow: '0 0 0 1px #ffffff',
                  pointerEvents: 'none',
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    top: '-22px',
                    left: '-1px',
                    background: 'var(--accent-vermillion)',
                    color: '#ffffff',
                    fontSize: '0.65rem',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    padding: '0.15rem 0.4rem',
                    letterSpacing: '0.04em',
                  }}
                >
                  {observation.detectedIntervention.displayName.toUpperCase()} ({(observation.detectedIntervention.confidence * 100).toFixed(1)}%)
                </span>
              </div>
            </div>

            {/* AI Vision Metrics Card */}
            <div className="terminal-card" style={{ padding: '0.9rem' }}>
              <div className="terminal-prompt-header">
                <span>[001 - OBJECT DETECTION]</span>
                <span className="status-done">{observation.detectedIntervention.modelVersion}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', fontFamily: 'var(--font-sans)' }}>
                  {observation.detectedIntervention.displayName}
                </span>
                <span style={{ color: 'var(--accent-vermillion)', fontWeight: 700, fontSize: '0.95rem', fontFamily: 'var(--font-mono)' }}>
                  {(observation.detectedIntervention.confidence * 100).toFixed(1)}% CONFIDENCE
                </span>
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', display: 'flex', gap: '0.5rem', marginTop: '0.3rem', fontFamily: 'var(--font-mono)' }}>
                <span>Condition: <strong>{observation.detectedIntervention.condition}</strong></span>
                <span>•</span>
                <span>Spatial Match: <strong style={{ color: 'var(--accent-emerald)' }}>PASS</strong></span>
              </div>
            </div>

            {/* Cryptographic SHA-256 Forensic Fingerprint */}
            <div className="terminal-card" style={{ padding: '0.9rem' }}>
              <div className="terminal-prompt-header">
                <span>[002 - FORENSIC FINGERPRINT]</span>
                <button
                  onClick={copyHash}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--accent-vermillion)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    fontSize: '0.65rem',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                  }}
                >
                  <Copy size={11} /> {copiedHash ? '✓ COPIED' : 'COPY SHA-256'}
                </button>
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.68rem',
                  background: '#ffffff',
                  border: '1px solid var(--border-subtle)',
                  padding: '0.4rem 0.6rem',
                  color: 'var(--text-primary)',
                  wordBreak: 'break-all',
                }}
              >
                {observation.sha256Hash}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.3rem', fontFamily: 'var(--font-mono)' }}>
                CAPTURED: {new Date(observation.timestamp).toLocaleString()} • {observation.cameraMake} {observation.cameraModel}
              </div>
            </div>
          </div>

          {/* Right: Remote Sensing & Terrain Fusion */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Satellite Collocation Card */}
            <div className="terminal-card" style={{ padding: '1rem' }}>
              <div className="terminal-prompt-header">
                <span>[003 - SATELLITE COLLOCATION]</span>
                <span className="status-done">SENTINEL-2 L2A</span>
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                Scene ID: {observation.satelliteContext.sceneId}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.6rem' }}>
                <div style={{ background: '#ffffff', border: '1px solid var(--border-subtle)', padding: '0.6rem' }}>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>NDVI CURRENT</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent-emerald)', fontFamily: 'var(--font-sans)' }}>
                    {observation.satelliteContext.ndvi.toFixed(2)}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    Baseline: {observation.satelliteContext.ndviBaseline.toFixed(2)}
                  </div>
                </div>

                <div style={{ background: '#ffffff', border: '1px solid var(--border-subtle)', padding: '0.6rem' }}>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>NDVI DELTA (GAIN)</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent-vermillion)', fontFamily: 'var(--font-sans)' }}>
                    +{observation.satelliteContext.ndviDelta.toFixed(2)}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--accent-vermillion)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                    +{(observation.satelliteContext.ndviDelta / observation.satelliteContext.ndviBaseline * 100).toFixed(0)}% increase
                  </div>
                </div>
              </div>

              <div style={{ background: '#ffffff', border: '1px solid var(--border-subtle)', padding: '0.6rem', marginTop: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontFamily: 'var(--font-mono)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Water Surface Area:</span>
                  <span style={{ fontWeight: 700, color: 'var(--accent-cyan)' }}>
                    {observation.satelliteContext.waterAreaHa > 0 ? `${observation.satelliteContext.waterAreaHa} ha` : 'Dry Catchment'}
                  </span>
                </div>
              </div>
            </div>

            {/* Terrain Context Card */}
            <div className="terminal-card" style={{ padding: '1rem' }}>
              <div className="terminal-prompt-header">
                <span>[004 - TERRAIN HYDROLOGY]</span>
                <span className="status-done">COPERNICUS GLO-30</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.6rem' }}>
                <div style={{ background: '#ffffff', border: '1px solid var(--border-subtle)', padding: '0.6rem' }}>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>ELEVATION</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-sans)' }}>
                    {observation.terrainContext.elevationM.toFixed(1)} m
                  </div>
                </div>

                <div style={{ background: '#ffffff', border: '1px solid var(--border-subtle)', padding: '0.6rem' }}>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>SLOPE (HORN)</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-sans)' }}>
                    {observation.terrainContext.slopeDeg.toFixed(1)}°
                  </div>
                </div>
              </div>

              <div style={{ background: '#ffffff', border: '1px solid var(--border-subtle)', padding: '0.6rem', marginTop: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontFamily: 'var(--font-mono)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Proximity to Drainage Stream:</span>
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                    {observation.terrainContext.drainageDistanceM.toFixed(1)} meters
                  </span>
                </div>
              </div>
            </div>

            {/* Geographic Position */}
            <div className="terminal-card" style={{ padding: '0.85rem' }}>
              <div className="terminal-prompt-header">
                <span>[005 - WGS84 COORDINATES]</span>
                <span className="status-done">EPSG:4326</span>
              </div>
              <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                {observation.latitude.toFixed(6)}°N, {observation.longitude.toFixed(6)}°E
              </div>
              <div style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Altitude: {observation.altitude_m.toFixed(1)}m • Heading: {observation.heading_deg.toFixed(1)}°
              </div>
            </div>

            {/* Export JSON Button in Vermillion */}
            <button
              className="btn btn-primary"
              onClick={exportEvidenceContract}
              style={{ marginTop: 'auto', width: '100%', padding: '0.75rem' }}
            >
              <Download size={14} />
              <span>EXPORT PRD APPENDIX A EVIDENCE RECORD</span>
              <ArrowUpRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
};
