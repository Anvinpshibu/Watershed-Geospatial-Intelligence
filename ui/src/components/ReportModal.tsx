import React, { useState, useEffect, useRef } from 'react';
import { FieldObservation, TemporalSummary, WatershedBoundary } from '../types/watershed';
import { generateReportDocument } from '../services/tauriBridge';
import { X, Download, Copy, CheckCircle2, ArrowUpRight } from 'lucide-react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  watershed: WatershedBoundary;
  temporal: TemporalSummary;
  observations: FieldObservation[];
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  watershed,
  temporal,
  observations,
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [reportMarkdown, setReportMarkdown] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) {
        dialog.showModal();
        generateReportDocument(watershed, temporal, observations).then(setReportMarkdown);
      }
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }
  }, [isOpen, watershed, temporal, observations]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(reportMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([reportMarkdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DoLR_Watershed_Monitoring_Report_${watershed.code}.md`;
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
      <div className="modal-container" style={{ maxHeight: '90vh' }}>
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
                ARASKOVA • DoLR REPORT COMPILER
              </div>
              <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                &gt; Official Watershed Monitoring & Audit Report
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button className="btn btn-glass" onClick={handleCopy} style={{ fontSize: '0.75rem' }}>
              {copied ? <CheckCircle2 size={14} style={{ color: 'var(--accent-emerald)' }} /> : <Copy size={14} />}
              <span>{copied ? 'COPIED' : 'COPY MD'}</span>
            </button>
            <button className="btn btn-primary" onClick={handleDownload} style={{ fontSize: '0.75rem' }}>
              <Download size={14} />
              <span>DOWNLOAD REPORT</span>
              <ArrowUpRight size={14} />
            </button>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: '1px solid var(--border-medium)',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                padding: '0.3rem',
                borderRadius: 'var(--radius-xs)',
                marginLeft: '0.4rem',
              }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <div style={{ padding: '1.75rem', overflowY: 'auto', flex: 1, background: '#faf8f5' }}>
          <pre
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.78rem',
              color: 'var(--text-primary)',
              lineHeight: 1.6,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              background: '#ffffff',
              padding: '1.5rem',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-xs)',
            }}
          >
            {reportMarkdown || 'Compiling official report with cryptographic hashes...'}
          </pre>
        </div>
      </div>
    </dialog>
  );
};
