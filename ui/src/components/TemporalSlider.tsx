import React from 'react';
import { Calendar, Play, Pause } from 'lucide-react';

interface TemporalSliderProps {
  currentYear: number;
  setCurrentYear: (year: number) => void;
}

export const TemporalSlider: React.FC<TemporalSliderProps> = ({ currentYear, setCurrentYear }) => {
  const years = [2021, 2022, 2023, 2024, 2025, 2026];
  const [isPlaying, setIsPlaying] = React.useState(false);

  React.useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      const next = currentYear >= 2026 ? 2021 : currentYear + 1;
      setCurrentYear(next);
    }, 1500);
    return () => clearInterval(interval);
  }, [isPlaying, currentYear, setCurrentYear]);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.85rem',
        background: 'rgba(255, 255, 255, 0.88)',
        backdropFilter: 'blur(12px)',
        border: '1px solid var(--border-medium)',
        borderRadius: 'var(--radius-xs)',
        padding: '0.5rem 0.85rem',
        boxShadow: 'var(--shadow-subtle)',
      }}
    >
      <button
        className="btn btn-glass"
        style={{ width: 28, height: 28, padding: 0 }}
        onClick={() => setIsPlaying(!isPlaying)}
        title={isPlaying ? 'Pause Timeline' : 'Play Timeline Time-Lapse'}
      >
        {isPlaying ? <Pause size={12} /> : <Play size={12} />}
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
        <Calendar size={12} style={{ color: 'var(--accent-vermillion)' }} />
        <span>TIMELINE:</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', flex: 1 }}>
        {years.map((y) => (
          <button
            key={y}
            onClick={() => setCurrentYear(y)}
            style={{
              flex: 1,
              padding: '0.3rem 0',
              borderRadius: 'var(--radius-xs)',
              border: y === currentYear ? '1px solid var(--accent-vermillion)' : '1px solid var(--border-subtle)',
              background: y === currentYear ? 'var(--accent-vermillion)' : '#ffffff',
              color: y === currentYear ? '#ffffff' : 'var(--text-primary)',
              fontFamily: 'var(--font-mono)',
              fontWeight: y === currentYear ? 700 : 500,
              fontSize: '0.72rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            {y}
          </button>
        ))}
      </div>
    </div>
  );
};
