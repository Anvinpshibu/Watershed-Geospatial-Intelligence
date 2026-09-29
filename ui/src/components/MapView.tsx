import React, { useState, useMemo } from 'react';
import { DrainageStream, FieldObservation, WatershedBoundary } from '../types/watershed';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface MapViewProps {
  watershed: WatershedBoundary;
  streams: DrainageStream[];
  observations: FieldObservation[];
  onSelectObservation: (obs: FieldObservation) => void;
  activeLayer: 'satellite' | 'ndvi' | 'ndwi' | 'dem';
  showInterventions: boolean;
  showStreams: boolean;
  showPhotos: boolean;
}

export const MapView: React.FC<MapViewProps> = ({
  watershed,
  streams,
  observations,
  onSelectObservation,
  activeLayer,
  showInterventions,
  showStreams,
  showPhotos,
}) => {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [hoveredObs, setHoveredObs] = useState<FieldObservation | null>(null);

  // Compute bounding box and projection scales
  const bounds = useMemo(() => {
    let minLon = Infinity,
      maxLon = -Infinity,
      minLat = Infinity,
      maxLat = -Infinity;
    watershed.coordinates.forEach(([lon, lat]) => {
      if (lon < minLon) minLon = lon;
      if (lon > maxLon) maxLon = lon;
      if (lat < minLat) minLat = lat;
      if (lat > maxLat) maxLat = lat;
    });
    return { minLon, maxLon, minLat, maxLat };
  }, [watershed]);

  const width = 800;
  const height = 550;
  const padding = 50;

  // Project geographic lon, lat to SVG x, y
  const project = (lon: number, lat: number) => {
    const x =
      padding +
      ((lon - bounds.minLon) / (bounds.maxLon - bounds.minLon)) * (width - 2 * padding);
    const y =
      height -
      (padding +
        ((lat - bounds.minLat) / (bounds.maxLat - bounds.minLat)) * (height - 2 * padding));
    return [x, y];
  };

  const polygonPath = useMemo(() => {
    return (
      watershed.coordinates
        .map(([lon, lat], i) => {
          const [x, y] = project(lon, lat);
          return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
        })
        .join(' ') + ' Z'
    );
  }, [watershed, bounds]);

  return (
    <div className="map-viewport" style={{ userSelect: 'none' }}>
      {/* Massive Araskova Background Typography Watermark */}
      <div className="brand-watermark">
        ARASKOVA
      </div>

      {/* Top Technical Metadata Header inside Map */}
      <div
        style={{
          position: 'absolute',
          top: '1rem',
          left: '1.25rem',
          right: '1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pointerEvents: 'none',
          zIndex: 30,
          fontFamily: 'var(--font-mono)',
          fontSize: '0.68rem',
          color: 'var(--text-muted)',
          letterSpacing: '0.08em',
        }}
      >
        <div style={{ pointerEvents: 'auto', background: 'rgba(255, 255, 255, 0.75)', padding: '0.3rem 0.6rem', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xs)' }}>
          <span style={{ color: 'var(--accent-vermillion)', fontWeight: 600 }}>001 — AOI</span> [76.625°E, 10.772°N] // EPSG:4326
        </div>

        <div style={{ pointerEvents: 'auto', background: 'rgba(255, 255, 255, 0.75)', padding: '0.3rem 0.6rem', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xs)' }}>
          KERALA RESEARCH LAB • PALAKKAD WS-001 • <span style={{ color: 'var(--accent-emerald)', fontWeight: 600 }}>LIVE DIGITAL TWIN</span>
        </div>
      </div>

      {/* Zoom / Pan Controls */}
      <div
        style={{
          position: 'absolute',
          bottom: '1.5rem',
          right: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.4rem',
          zIndex: 40,
        }}
      >
        <button
          className="btn btn-glass"
          style={{ width: 34, height: 34, padding: 0 }}
          onClick={() => setZoom((z) => Math.min(z + 0.25, 2.5))}
          title="Zoom In"
        >
          <ZoomIn size={16} />
        </button>
        <button
          className="btn btn-glass"
          style={{ width: 34, height: 34, padding: 0 }}
          onClick={() => setZoom((z) => Math.max(z - 0.25, 0.75))}
          title="Zoom Out"
        >
          <ZoomOut size={16} />
        </button>
        <button
          className="btn btn-glass"
          style={{ width: 34, height: 34, padding: 0 }}
          onClick={() => {
            setZoom(1);
            setPan({ x: 0, y: 0 });
          }}
          title="Reset View"
        >
          <RotateCcw size={16} />
        </button>
      </div>

      {/* Dynamic Map Legend & Layer Status */}
      <div
        style={{
          position: 'absolute',
          bottom: '1.5rem',
          left: '1.5rem',
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(12px)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-xs)',
          padding: '0.75rem 1rem',
          fontSize: '0.75rem',
          zIndex: 40,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.4rem',
          boxShadow: 'var(--shadow-subtle)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: '0.7rem', color: 'var(--text-primary)', textTransform: 'uppercase' }}>
          {activeLayer === 'satellite' && <span>🛰️ Sentinel-2 L2A (10m True Color)</span>}
          {activeLayer === 'ndvi' && <span>🌿 Normalized Difference Vegetation Index (NDVI)</span>}
          {activeLayer === 'ndwi' && <span>💧 Modified Water Index (NDWI/MNDWI)</span>}
          {activeLayer === 'dem' && <span>⛰️ Copernicus DEM GLO-30 (Elevation Hillshade)</span>}
        </div>

        {activeLayer === 'ndvi' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.68rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>0.10 (Barren)</span>
            <div
              style={{
                width: 140,
                height: 6,
                borderRadius: 2,
                background: 'linear-gradient(to right, #fef08a, #84cc16, #15803d, #064e3b)',
              }}
            />
            <span style={{ color: 'var(--accent-emerald)', fontWeight: 600 }}>0.85 (Canopy)</span>
          </div>
        )}

        {activeLayer === 'ndwi' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.68rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Dry Soil</span>
            <div
              style={{
                width: 140,
                height: 6,
                borderRadius: 2,
                background: 'linear-gradient(to right, #e2e8f0, #38bdf8, #0284c7, #0369a1)',
              }}
            />
            <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>Water Body</span>
          </div>
        )}
      </div>

      {/* Main Interactive SVG Map Canvas */}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        style={{
          width: '100%',
          height: '100%',
          transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
          transformOrigin: 'center center',
          transition: 'transform 0.2s ease-out',
        }}
      >
        <defs>
          {/* Subtle Layer Gradients matching parchment & Araskova aesthetic */}
          <radialGradient id="satGradient" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#d5d0c2" />
            <stop offset="60%" stopColor="#c5bea8" />
            <stop offset="100%" stopColor="#b4ab92" />
          </radialGradient>

          <radialGradient id="ndviGradient" cx="45%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#86efac" stopOpacity="0.45" />
            <stop offset="50%" stopColor="#22c55e" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#15803d" stopOpacity="0.18" />
          </radialGradient>

          <radialGradient id="ndwiGradient" cx="55%" cy="60%" r="50%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.5" />
            <stop offset="70%" stopColor="#0284c7" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#0369a1" stopOpacity="0.1" />
          </radialGradient>

          <radialGradient id="demGradient" cx="40%" cy="20%" r="70%">
            <stop offset="0%" stopColor="#fed7aa" stopOpacity="0.45" />
            <stop offset="40%" stopColor="#f97316" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#c2410c" stopOpacity="0.15" />
          </radialGradient>
        </defs>

        {/* Delicate Topographic Contour Rings sweeping across map (Signature Araskova Look) */}
        <g opacity="0.18" stroke="#d9461e" strokeWidth="1" fill="none">
          <ellipse cx="400" cy="275" rx="360" ry="240" />
          <ellipse cx="420" cy="265" rx="310" ry="200" />
          <ellipse cx="440" cy="255" rx="260" ry="165" />
          <ellipse cx="460" cy="245" rx="200" ry="125" />
          <ellipse cx="475" cy="235" rx="140" ry="85" />
          <ellipse cx="490" cy="225" rx="80" ry="45" />
        </g>

        {/* Watershed Outer Polygon Base Fill */}
        <path
          d={polygonPath}
          fill={
            activeLayer === 'satellite'
              ? 'url(#satGradient)'
              : activeLayer === 'ndvi'
              ? 'url(#ndviGradient)'
              : activeLayer === 'ndwi'
              ? 'url(#ndwiGradient)'
              : 'url(#demGradient)'
          }
          stroke="#121212"
          strokeWidth="2"
          style={{
            filter: 'drop-shadow(0px 6px 16px rgba(0, 0, 0, 0.08))',
            transition: 'all 0.3s ease',
          }}
        />

        {/* Drainage Stream Networks in Technical Ink */}
        {showStreams &&
          streams.map((stream) => {
            const streamPath = stream.coordinates
              .map(([lon, lat], i) => {
                const [x, y] = project(lon, lat);
                return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
              })
              .join(' ');
            return (
              <g key={stream.id}>
                <path
                  d={streamPath}
                  stroke="#0369a1"
                  strokeWidth={stream.order === 3 ? 3 : stream.order === 2 ? 2 : 1.4}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.85"
                />
                <path
                  d={streamPath}
                  stroke="#38bdf8"
                  strokeWidth={stream.order === 3 ? 1.2 : 0.8}
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray="5 3"
                  opacity="0.9"
                />
              </g>
            );
          })}

        {/* Watershed Intervention Asset Markers */}
        {showInterventions &&
          observations.map((obs) => {
            const [x, y] = project(obs.longitude, obs.latitude);
            return (
              <g key={`int-${obs.id}`} transform={`translate(${x}, ${y - 18})`} opacity="0.9">
                <rect x="-16" y="-7" width="32" height="12" rx="2" fill="#ffffff" stroke="#121212" strokeWidth="1" />
                <text x="0" y="2" textAnchor="middle" fill="#121212" fontSize="7" fontFamily="var(--font-mono)" fontWeight="700">
                  {obs.detectedIntervention.type.replace('_', ' ').toUpperCase().slice(0, 5)}
                </text>
              </g>
            );
          })}

        {/* Geo-Coded Field Photography Observation Markers in Araskova Vermillion */}
        {showPhotos &&
          observations.map((obs) => {
            const [x, y] = project(obs.longitude, obs.latitude);
            const isHovered = hoveredObs?.id === obs.id;

            return (
              <g
                key={obs.id}
                transform={`translate(${x}, ${y})`}
                style={{ cursor: 'pointer' }}
                onClick={() => onSelectObservation(obs)}
                onMouseEnter={() => setHoveredObs(obs)}
                onMouseLeave={() => setHoveredObs(null)}
              >
                {/* Outer vermillion ring */}
                <circle
                  r={isHovered ? 16 : 10}
                  fill="none"
                  stroke="#d9461e"
                  strokeWidth="1.5"
                  opacity={isHovered ? 0.9 : 0.4}
                  style={{ transition: 'all 0.15s ease' }}
                />

                {/* Inner marker body */}
                <circle
                  r={isHovered ? 8 : 6}
                  fill="#d9461e"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />

                {/* Pin ID Label */}
                <text
                  x="0"
                  y="2.5"
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="7"
                  fontFamily="var(--font-mono)"
                  fontWeight="bold"
                >
                  {obs.id.replace('OBS-', '')}
                </text>
              </g>
            );
          })}
      </svg>

      {/* Hover Floating Technical Tooltip */}
      {hoveredObs && (
        <div
          style={{
            position: 'absolute',
            top: '4.5rem',
            right: '1.5rem',
            background: 'rgba(255, 255, 255, 0.96)',
            backdropFilter: 'blur(8px)',
            border: '1px solid var(--border-strong)',
            borderRadius: 'var(--radius-xs)',
            padding: '0.85rem 1rem',
            boxShadow: 'var(--shadow-elevated)',
            pointerEvents: 'none',
            zIndex: 50,
            maxWidth: 290,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.3rem' }}>
            <span style={{ fontSize: '0.68rem', color: 'var(--accent-vermillion)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
              // {hoveredObs.id}
            </span>
            <span
              style={{
                fontSize: '0.65rem',
                fontWeight: 700,
                padding: '0.1rem 0.35rem',
                borderRadius: 'var(--radius-xs)',
                background: 'var(--accent-vermillion-subtle)',
                color: 'var(--accent-vermillion)',
                border: '1px solid var(--accent-vermillion-border)',
                fontFamily: 'var(--font-mono)',
              }}
            >
              {(hoveredObs.detectedIntervention.confidence * 100).toFixed(0)}% CONFIDENCE
            </span>
          </div>

          {/* Authentic Field Photo Thumbnail */}
          <div style={{ width: '100%', height: '110px', borderRadius: 'var(--radius-xs)', overflow: 'hidden', marginBottom: '0.5rem', border: '1px solid var(--border-subtle)', background: '#111' }}>
            <img src={hoveredObs.imageUrl} alt={hoveredObs.fileName} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </div>

          <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)', marginBottom: '0.3rem', fontFamily: 'var(--font-sans)' }}>
            {hoveredObs.detectedIntervention.displayName}
          </div>

          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.2rem', fontFamily: 'var(--font-mono)' }}>
            <div>GPS: {hoveredObs.latitude.toFixed(4)}°N, {hoveredObs.longitude.toFixed(4)}°E</div>
            <div>ELEV: {hoveredObs.terrainContext.elevationM.toFixed(1)}m • SLOPE: {hoveredObs.terrainContext.slopeDeg.toFixed(1)}°</div>
            <div style={{ color: 'var(--accent-vermillion)', fontWeight: 600 }}>
              NDVI CHANGE: +{hoveredObs.satelliteContext.ndviDelta.toFixed(2)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
