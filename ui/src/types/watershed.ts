export interface GeoPoint {
  latitude: f64;
  longitude: f64;
  altitude_m?: f64;
}

export type f64 = number;

export interface WatershedBoundary {
  id: string;
  name: string;
  code: string;
  area_sq_km: number;
  state: string;
  district: string;
  block: string;
  drainage_order: number;
  mean_elevation_m: number;
  mean_slope_deg: number;
  coordinates: [number, number][]; // [lon, lat]
}

export interface DrainageStream {
  id: string;
  name: string;
  order: number;
  length_km: number;
  coordinates: [number, number][]; // [lon, lat]
}

export type InterventionType =
  | 'check_dam'
  | 'farm_pond'
  | 'contour_bund'
  | 'percolation_tank'
  | 'water_harvesting_structure'
  | 'drainage_treatment'
  | 'afforestation';

export interface FieldObservation {
  id: string;
  projectId: string;
  watershedId: string;
  fileName: string;
  storageUri: string;
  imageUrl: string;
  sha256Hash: string;
  latitude: number;
  longitude: number;
  altitude_m: number;
  heading_deg: number;
  timestamp: string;
  cameraMake: string;
  cameraModel: string;
  isLocated: boolean;
  detectedIntervention: {
    type: InterventionType;
    displayName: string;
    confidence: number;
    condition: 'Intact' | 'Damaged' | 'Degraded' | 'WaterPresent' | 'VegetationPresent';
    boundingBox?: [number, number, number, number]; // [x1, y1, x2, y2]
    modelVersion: string;
  };
  satelliteContext: {
    provider: string;
    sceneId: string;
    resolutionM: number;
    ndvi: number;
    ndwi: number;
    ndviBaseline: number;
    ndviDelta: number;
    waterAreaHa: number;
    acquisitionDate: string;
  };
  terrainContext: {
    elevationM: number;
    slopeDeg: number;
    drainageDistanceM: number;
    demSource: string;
  };
  evidenceQuality: 'high' | 'medium' | 'low';
}

export interface TemporalSummary {
  baselineDate: string;
  currentDate: string;
  meanNdviBaseline: number;
  meanNdviCurrent: number;
  ndviDelta: number;
  ndviPercentageChange: number;
  waterAreaBaselineHa: number;
  waterAreaCurrentHa: number;
  waterAreaDeltaHa: number;
  degradedAreaChangePct: number;
  significantGreeningHa: number;
  significantBrowningHa: number;
}
