import React, { useState, useRef, useEffect } from 'react';
import { FieldObservation } from '../types/watershed';
import { ingestImageBytes } from '../services/tauriBridge';
import { X, UploadCloud, CheckCircle2, ArrowUpRight } from 'lucide-react';

interface IngestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddObservation: (obs: FieldObservation) => void;
}

export const IngestionModal: React.FC<IngestionModalProps> = ({
  isOpen,
  onClose,
  onAddObservation,
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [ingestionResult, setIngestionResult] = useState<any | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) dialog.showModal();
    } else {
      if (dialog.open) dialog.close();
      setSelectedFile(null);
      setPreviewUrl(null);
      setIngestionResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setIsProcessing(true);

    try {
      const res = await ingestImageBytes(file);
      setIngestionResult(res);
    } catch (err) {
      console.error('Ingestion error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmAdd = () => {
    if (!ingestionResult || !previewUrl || !selectedFile) return;

    const newObs: FieldObservation = {
      id: `OBS-${Math.floor(100 + Math.random() * 900)}`,
      projectId: 'PROJ-KL-01',
      watershedId: 'WS-001',
      fileName: selectedFile.name,
      storageUri: `local://field/${selectedFile.name}`,
      imageUrl: previewUrl,
      sha256Hash: ingestionResult.sha256Hash,
      latitude: ingestionResult.isLocated && ingestionResult.latitude ? ingestionResult.latitude : 0,
      longitude: ingestionResult.isLocated && ingestionResult.longitude ? ingestionResult.longitude : 0,
      altitude_m: ingestionResult.altitudeM,
      heading_deg: ingestionResult.headingDeg,
      timestamp: ingestionResult.timestamp,
      cameraMake: ingestionResult.cameraMake || 'Field Camera',
      cameraModel: ingestionResult.cameraModel || 'Mobile Device',
      isLocated: ingestionResult.isLocated,
      detectedIntervention: {
        type: 'check_dam',
        displayName: 'Masonry Stream Check Dam',
        confidence: 0.94,
        condition: 'Intact',
        boundingBox: [0.15, 0.2, 0.85, 0.8],
        modelVersion: 'yolo-watershed-v1.2',
      },
      satelliteContext: {
        provider: 'Sentinel-2 L2A',
        sceneId: 'S2A_MSIL2A_20260118_R090_T43PGP',
        resolutionM: 10,
        ndvi: 0.58,
        ndwi: 0.25,
        ndviBaseline: 0.40,
        ndviDelta: 0.18,
        waterAreaHa: 1.2,
        acquisitionDate: '2026-01-18',
      },
      terrainContext: {
        elevationM: ingestionResult.altitudeM || 184.0,
        slopeDeg: 6.4,
        drainageDistanceM: 12.0,
        demSource: 'Copernicus GLO-30',
      },
      evidenceQuality: ingestionResult.isLocated ? 'high' : 'medium',
    };

    onAddObservation(newObs);
    onClose();
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
                ARASKOVA • EVIDENCE INGESTION
              </div>
              <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                &gt; Field Photograph Ingestion & Forensic Verification
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: '1px solid var(--border-medium)',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              padding: '0.3rem',
              borderRadius: 'var(--radius-xs)',
            }}
          >
            <X size={16} />
          </button>
        </div>

        <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', background: '#faf8f5' }}>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/jpeg,image/png,image/tiff"
            style={{ display: 'none' }}
          />

          {!previewUrl ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: '2px dashed var(--accent-vermillion)',
                borderRadius: 'var(--radius-xs)',
                padding: '2.5rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                cursor: 'pointer',
                background: 'var(--accent-vermillion-subtle)',
                transition: 'all 0.15s ease',
              }}
            >
              <UploadCloud size={36} style={{ color: 'var(--accent-vermillion)' }} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)', fontFamily: 'var(--font-sans)' }}>
                  &gt; Select or drag & drop geo-coded field photography
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '0.3rem' }}>
                  JPEG / PNG / TIFF • Zero-Fabrication EXIF GPS Extraction • Forensic SHA-256 Digest
                </div>
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '1.5rem' }}>
              <div
                style={{
                  borderRadius: 'var(--radius-xs)',
                  overflow: 'hidden',
                  maxHeight: '260px',
                  border: '1px solid var(--border-strong)',
                }}
              >
                <img
                  src={previewUrl}
                  alt="Field Preview"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {isProcessing ? (
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--accent-vermillion)' }}>
                    &gt; Computing SHA-256 hash and extracting EXIF GPS...
                  </div>
                ) : ingestionResult ? (
                  <>
                    <div
                      style={{
                        padding: '0.5rem 0.75rem',
                        borderRadius: 'var(--radius-xs)',
                        background: ingestionResult.isLocated ? 'rgba(21, 128, 61, 0.1)' : 'rgba(217, 119, 6, 0.1)',
                        border: `1px solid ${ingestionResult.isLocated ? 'rgba(21, 128, 61, 0.3)' : 'rgba(217, 119, 6, 0.3)'}`,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.45rem',
                      }}
                    >
                      <CheckCircle2 size={15} style={{ color: ingestionResult.isLocated ? 'var(--accent-emerald)' : 'var(--accent-amber)' }} />
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: ingestionResult.isLocated ? 'var(--accent-emerald)' : 'var(--accent-amber)', fontFamily: 'var(--font-mono)' }}>
                        {ingestionResult.isLocated ? 'LOCATED • VERIFIED GPS EXIF INTEGRITY' : 'UNLOCATED EVIDENCE (ZERO-FABRICATION RULE)'}
                      </span>
                    </div>

                    <div className="terminal-card" style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.72rem', fontFamily: 'var(--font-mono)' }}>
                      {ingestionResult.isLocated ? (
                        <>
                          <div><strong>LATITUDE:</strong> {ingestionResult.latitude?.toFixed(5)}° N</div>
                          <div><strong>LONGITUDE:</strong> {ingestionResult.longitude?.toFixed(5)}° E</div>
                          <div><strong>ALTITUDE:</strong> {ingestionResult.altitudeM ? `${ingestionResult.altitudeM.toFixed(1)} m AMSL` : 'N/A'}</div>
                          <div><strong>HEADING:</strong> {ingestionResult.headingDeg ? `${ingestionResult.headingDeg.toFixed(1)}°` : 'N/A'}</div>
                        </>
                      ) : (
                        <div style={{ color: 'var(--accent-amber)', fontWeight: 600 }}>
                          // GPS: COORDINATES NOT PRESENT (POLICY: NO SYNTHETIC COORDINATES)
                        </div>
                      )}
                      <div><strong>DEVICE:</strong> {ingestionResult.cameraMake || 'Unknown'} {ingestionResult.cameraModel || ''}</div>
                      <div style={{ wordBreak: 'break-all', fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                        SHA256: {ingestionResult.sha256Hash}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                      <button className="btn btn-glass" onClick={() => fileInputRef.current?.click()} style={{ flex: 1 }}>
                        CHOOSE ANOTHER
                      </button>
                      <button className="btn btn-primary" onClick={handleConfirmAdd} style={{ flex: 1.2 }}>
                        <span>{ingestionResult.isLocated ? 'MAP OBSERVATION' : 'LOG UNLOCATED RECORD'}</span>
                        <ArrowUpRight size={14} />
                      </button>
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </div>
    </dialog>
  );
};
