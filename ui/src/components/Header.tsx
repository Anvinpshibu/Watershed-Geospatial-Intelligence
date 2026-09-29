import React from 'react';
import { FileText, UploadCloud, Cpu, Globe, ArrowUpRight } from 'lucide-react';
import { isTauriEnvironment } from '../services/tauriBridge';

interface HeaderProps {
  onOpenReport: () => void;
  onOpenIngest: () => void;
  activeView: 'map' | 'split';
  setActiveView: (view: 'map' | 'split') => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenReport,
  onOpenIngest,
  activeView,
  setActiveView,
}) => {
  const isTauri = isTauriEnvironment();

  return (
    <header className="app-header">
      <div className="brand-section">
        {/* Araskova Signature Brand Badge */}
        <div className="brand-badge">
          <div className="vermillion-box">A</div>
          <span>ARASKOVA</span>
        </div>

        <div className="technical-tag">
          001 — WATERSHED INTEL
        </div>

        <div className="header-meta-label" style={{ display: 'none', md: 'block' } as any}>
          KERALA'S 1ST DEEP TECH RESEARCH LAB • GEOSPATIAL AI & DoLR
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        {/* Runtime Engine Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'var(--font-mono)', fontSize: '0.7rem' }}>
          {isTauri ? (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-primary)', background: '#ffffff', padding: '0.3rem 0.6rem', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-xs)' }}>
              <Cpu size={12} style={{ color: 'var(--accent-vermillion)' }} />
              <strong>RUST NATIVE // TAURI v2</strong>
            </span>
          ) : (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-secondary)', background: 'rgba(255, 255, 255, 0.6)', padding: '0.3rem 0.6rem', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xs)' }}>
              <Globe size={12} style={{ color: 'var(--accent-vermillion)' }} />
              WEB GEOSPATIAL ENGINE
            </span>
          )}
        </div>

        {/* View Switcher Tabs (01 MAP / 02 SPLIT) */}
        <div style={{ display: 'flex', background: 'rgba(18, 18, 18, 0.04)', borderRadius: 'var(--radius-xs)', padding: '2px', border: '1px solid var(--border-subtle)' }}>
          <button
            className={`btn btn-glass ${activeView === 'map' ? 'active' : ''}`}
            onClick={() => setActiveView('map')}
            style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem', border: 'none' }}
          >
            01 DIGITAL TWIN
          </button>
          <button
            className={`btn btn-glass ${activeView === 'split' ? 'active' : ''}`}
            onClick={() => setActiveView('split')}
            style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem', border: 'none' }}
          >
            02 TEMPORAL SPLIT
          </button>
        </div>

        <button className="btn btn-glass" onClick={onOpenIngest}>
          <UploadCloud size={14} />
          <span>INGEST PHOTO</span>
        </button>

        {/* Vermillion CTA Button matching screenshot 'LET'S TALK' button */}
        <button className="btn btn-primary" onClick={onOpenReport}>
          <FileText size={14} />
          <span>DoLR AUDIT REPORT</span>
          <ArrowUpRight size={14} />
        </button>
      </div>
    </header>
  );
};
