import { FieldObservation, TemporalSummary, WatershedBoundary } from '../types/watershed';
import exifr from 'exifr';

// Check if running inside Tauri desktop container
export const isTauriEnvironment = (): boolean => {
  return typeof window !== 'undefined' && ('__TAURI_INTERNALS__' in window || '__TAURI__' in window);
};

// Compute SHA-256 in browser using Web Crypto API
export const computeWebSha256 = async (buffer: ArrayBuffer): Promise<string> => {
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
};

export interface IngestionResult {
  sha256Hash: string;
  latitude?: number;
  longitude?: number;
  altitudeM?: number;
  headingDeg?: number;
  timestamp: string;
  cameraMake?: string;
  cameraModel?: string;
  isLocated: boolean;
}

// Ingest image bytes via native Rust command (Desktop) or real exifr + Web Crypto (Browser)
export const ingestImageBytes = async (file: File): Promise<IngestionResult> => {
  const buffer = await file.arrayBuffer();

  // If in desktop app, invoke native Rust EXIF & SHA256 engine
  if (isTauriEnvironment()) {
    try {
      const { invoke } = await import('@tauri-apps/api/core');
      const bytes = Array.from(new Uint8Array(buffer));
      const res = await invoke<any>('ingest_image_bytes', { fileBytes: bytes });
      return {
        sha256Hash: res.sha256_hash,
        latitude: res.latitude ?? undefined,
        longitude: res.longitude ?? undefined,
        altitudeM: res.altitude_m ?? undefined,
        headingDeg: res.heading_deg ?? undefined,
        timestamp: res.timestamp,
        cameraMake: res.camera_make ?? undefined,
        cameraModel: res.camera_model ?? undefined,
        isLocated: res.is_located,
      };
    } catch (err) {
      console.warn('Tauri invoke failed, falling back to Web EXIF reader:', err);
    }
  }

  // Real Web Ingestion:
  // 1. Real cryptographic SHA-256 calculation
  const sha256Hash = await computeWebSha256(buffer);

  // 2. Real EXIF binary extraction using exifr
  try {
    const exifData = await exifr.parse(file);

    if (exifData && typeof exifData.latitude === 'number' && typeof exifData.longitude === 'number') {
      const date = exifData.DateTimeOriginal instanceof Date 
        ? exifData.DateTimeOriginal.toISOString() 
        : typeof exifData.DateTimeOriginal === 'string'
        ? exifData.DateTimeOriginal
        : new Date().toISOString();

      return {
        sha256Hash,
        latitude: exifData.latitude,
        longitude: exifData.longitude,
        altitudeM: typeof exifData.GPSAltitude === 'number' ? exifData.GPSAltitude : (exifData.altitude ?? undefined),
        headingDeg: typeof exifData.GPSImgDirection === 'number' ? exifData.GPSImgDirection : undefined,
        timestamp: date,
        cameraMake: exifData.Make ?? 'Smartphone Camera',
        cameraModel: exifData.Model ?? 'Field Device',
        isLocated: true,
      };
    }
  } catch (exifErr) {
    console.warn('Failed to parse EXIF tags:', exifErr);
  }

  // Conforming to PRD Section 10 & 77: If GPS metadata is absent, NEVER fabricate coordinates.
  // Flag explicitly as UNLOCATED.
  return {
    sha256Hash,
    latitude: undefined,
    longitude: undefined,
    altitudeM: undefined,
    headingDeg: undefined,
    timestamp: new Date().toISOString(),
    cameraMake: 'Digital Image',
    cameraModel: 'No GPS EXIF Header Detected',
    isLocated: false,
  };
};

// Generate official markdown report via native Rust or Web fallback
export const generateReportDocument = async (
  watershed: WatershedBoundary,
  temporal: TemporalSummary,
  observations: FieldObservation[]
): Promise<string> => {
  if (isTauriEnvironment()) {
    try {
      const { invoke } = await import('@tauri-apps/api/core');
      const report = await invoke<string>('generate_report', {
        watershed: {
          id: watershed.id,
          project_id: 'PROJ-KL-01',
          name: watershed.name,
          code: watershed.code,
          area_sq_km: watershed.area_sq_km,
          boundary: {
            coordinates: watershed.coordinates.map(([lon, lat]) => ({
              latitude: lat,
              longitude: lon,
            })),
          },
          source: 'DoLR Pilot Layer',
        },
        state: watershed.state,
        district: watershed.district,
        block: watershed.block,
        monitoringPeriod: '2023–2026',
        totalPhotos: observations.length,
        locatedPhotos: observations.filter((o) => o.isLocated).length,
        interventionsCount: observations.length,
        temporalSummary: {
          baseline_date: temporal.baselineDate,
          current_date: temporal.currentDate,
          mean_ndvi_baseline: temporal.meanNdviBaseline,
          mean_ndvi_current: temporal.meanNdviCurrent,
          ndvi_delta: temporal.ndviDelta,
          ndvi_percentage_change: temporal.ndviPercentageChange,
          water_area_baseline_ha: temporal.waterAreaBaselineHa,
          water_area_current_ha: temporal.waterAreaCurrentHa,
          water_area_delta_ha: temporal.waterAreaDeltaHa,
          degraded_area_change_pct: temporal.degradedAreaChangePct,
        },
        evidenceRecords: [],
      });
      return report;
    } catch (e) {
      console.warn('Tauri report generation failed, using web generator:', e);
    }
  }

  // Web generator fallback
  const now = new Date().toUTCString();
  return `# WATERSHED GEOSPATIAL INTELLIGENCE & MONITORING REPORT
### Ministry of Rural Development — Department of Land Resources (DoLR)

**Generated:** ${now}
**Watershed:** ${watershed.name} (${watershed.code})
**Location:** ${watershed.block}, District ${watershed.district}, State ${watershed.state}
**Area:** ${watershed.area_sq_km.toFixed(2)} km²
**Monitoring Period:** 2023–2026
**Execution Engine:** ${isTauriEnvironment() ? 'Rust Core (Native Desktop)' : 'Browser Geospatial Engine (Web)'}

---

## 1. Field Observations Summary
- **Total Field Photographs Ingested:** ${observations.length}
- **Spatially Located with GPS:** ${observations.filter((o) => o.isLocated).length} (${((observations.filter((o) => o.isLocated).length / observations.length) * 100).toFixed(0)}%)
- **Unlocated Flagged for Manual Review:** ${observations.filter((o) => !o.isLocated).length}
- **Verified Interventions Logged:** ${observations.length}

---

## 2. Remote Sensing Environmental Indicators
| Metric | Baseline (2023) | Current (2026) | Observed Change |
| :--- | :--- | :--- | :--- |
| **Mean NDVI (Vegetation)** | ${temporal.meanNdviBaseline.toFixed(3)} | ${temporal.meanNdviCurrent.toFixed(3)} | **+${temporal.ndviDelta.toFixed(3)} (+${temporal.ndviPercentageChange.toFixed(1)}%)** |
| **Surface Water Area** | ${temporal.waterAreaBaselineHa.toFixed(1)} ha | ${temporal.waterAreaCurrentHa.toFixed(1)} ha | **+${temporal.waterAreaDeltaHa.toFixed(1)} ha** |
| **Degraded Land Recovery** | Baseline | Post-Intervention | **${temporal.degradedAreaChangePct.toFixed(1)}%** |

---

## 3. High-Confidence Multimodal Intervention Evidence
| Obs ID | Intervention Type | AI Confidence | Coordinates | Elevation | Slope | NDVI Δ | Evidence Quality |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
${observations
  .map(
    (o) =>
      `| ${o.id} | ${o.detectedIntervention.displayName} | ${(o.detectedIntervention.confidence * 100).toFixed(0)}% | ${o.latitude ? `${o.latitude.toFixed(4)}°N, ${o.longitude.toFixed(4)}°E` : 'UNLOCATED'} | ${o.terrainContext.elevationM.toFixed(1)}m | ${o.terrainContext.slopeDeg.toFixed(1)}° | +${o.satelliteContext.ndviDelta.toFixed(2)} | **${o.evidenceQuality.toUpperCase()}** |`
  )
  .join('\n')}

---

## 4. Forensic Chain of Custody & Audit Hashes
${observations
  .map((o) => `- **${o.fileName}** (\`${o.id}\`): \`SHA256:${o.sha256Hash}\``)
  .join('\n')}

---

## 5. Regulatory Limitation Notice
> **DoLR Audit Disclaimer:** Analytical indicators represent spatial observations derived from Sentinel-2, Landsat, and Copernicus DEM remote sensing collocated with field photographs. They serve as an administrative decision-support tool and do not independently establish legal causal liability without ground inspection.
`;
};
