use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

/// WGS84 Geographic Coordinate Point
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct GeoPoint {
    pub latitude: f64,
    pub longitude: f64,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub altitude_m: Option<f64>,
}

impl GeoPoint {
    pub fn new(latitude: f64, longitude: f64) -> Self {
        Self {
            latitude,
            longitude,
            altitude_m: None,
        }
    }

    pub fn with_altitude(latitude: f64, longitude: f64, altitude: f64) -> Self {
        Self {
            latitude,
            longitude,
            altitude_m: Some(altitude),
        }
    }
}

/// Geographic Bounding Box
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct BoundingBox {
    pub min_lat: f64,
    pub min_lon: f64,
    pub max_lat: f64,
    pub max_lon: f64,
}

impl BoundingBox {
    pub fn contains(&self, point: &GeoPoint) -> bool {
        point.latitude >= self.min_lat
            && point.latitude <= self.max_lat
            && point.longitude >= self.min_lon
            && point.longitude <= self.max_lon
    }
}

/// 2D Polygon boundary (outer ring of coordinates)
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct Polygon {
    pub coordinates: Vec<GeoPoint>,
}

impl Polygon {
    /// Ray-casting algorithm to test whether a coordinate point lies inside this polygon
    pub fn contains_point(&self, point: &GeoPoint) -> bool {
        let n = self.coordinates.len();
        if n < 3 {
            return false;
        }

        let mut inside = false;
        let mut j = n - 1;

        for i in 0..n {
            let pi = &self.coordinates[i];
            let pj = &self.coordinates[j];

            if ((pi.latitude > point.latitude) != (pj.latitude > point.latitude))
                && (point.longitude
                    < (pj.longitude - pi.longitude) * (point.latitude - pi.latitude)
                        / (pj.latitude - pi.latitude)
                        + pi.longitude)
            {
                inside = !inside;
            }
            j = i;
        }

        inside
    }

    /// Compute approximate bounding box
    pub fn bounding_box(&self) -> Option<BoundingBox> {
        if self.coordinates.is_empty() {
            return None;
        }

        let mut min_lat = self.coordinates[0].latitude;
        let mut max_lat = self.coordinates[0].latitude;
        let mut min_lon = self.coordinates[0].longitude;
        let mut max_lon = self.coordinates[0].longitude;

        for pt in &self.coordinates {
            if pt.latitude < min_lat {
                min_lat = pt.latitude;
            }
            if pt.latitude > max_lat {
                max_lat = pt.latitude;
            }
            if pt.longitude < min_lon {
                min_lon = pt.longitude;
            }
            if pt.longitude > max_lon {
                max_lon = pt.longitude;
            }
        }

        Some(BoundingBox {
            min_lat,
            min_lon,
            max_lat,
            max_lon,
        })
    }
}

/// Watershed Project Entity (FR-002)
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Project {
    pub id: String,
    pub name: String,
    pub description: String,
    pub state: String,
    pub district: String,
    pub block: String,
    pub monitoring_period: String,
    pub created_at: DateTime<Utc>,
}

/// Watershed Boundary Entity (FR-002)
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Watershed {
    pub id: String,
    pub project_id: String,
    pub name: String,
    pub code: String,
    pub area_sq_km: f64,
    pub boundary: Polygon,
    pub source: String,
}

/// Ingestion Status for Geo-Coded Images (FR-003)
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub enum IngestionStatus {
    Located,
    Unlocated,
    PendingValidation,
}

/// Geo-Coded Field Photograph Observation (FR-003, FR-004)
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FieldObservation {
    pub id: String,
    pub project_id: String,
    pub watershed_id: String,
    pub file_name: String,
    pub storage_uri: String,
    pub sha256_hash: String,
    pub location: Option<GeoPoint>,
    pub timestamp: DateTime<Utc>,
    pub heading_deg: Option<f64>,
    pub camera_make: Option<String>,
    pub camera_model: Option<String>,
    pub status: IngestionStatus,
    pub detected_intervention: Option<InterventionDetection>,
}

/// Watershed Intervention Types (FR-012)
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum InterventionType {
    CheckDam,
    FarmPond,
    ContourBund,
    PercolationTank,
    WaterHarvestingStructure,
    DrainageTreatment,
    Afforestation,
    Other(String),
}

impl InterventionType {
    pub fn display_name(&self) -> &str {
        match self {
            InterventionType::CheckDam => "Check Dam",
            InterventionType::FarmPond => "Farm Pond",
            InterventionType::ContourBund => "Contour Bund",
            InterventionType::PercolationTank => "Percolation Tank",
            InterventionType::WaterHarvestingStructure => "Water Harvesting Structure",
            InterventionType::DrainageTreatment => "Drainage Treatment",
            InterventionType::Afforestation => "Afforestation / Plantation",
            InterventionType::Other(s) => s.as_str(),
        }
    }
}

/// Visual condition of an intervention (FR-014)
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum InterventionCondition {
    Intact,
    Damaged,
    Degraded,
    WaterPresent,
    VegetationPresent,
    ErosionVisible,
    Unknown,
}

/// AI Detection Result for an image (FR-013)
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct InterventionDetection {
    pub intervention_type: InterventionType,
    pub confidence: f64,
    pub condition: InterventionCondition,
    pub bounding_box: Option<[f64; 4]>, // [x_min, y_min, x_max, y_max] normalized (0.0 - 1.0)
    pub model_version: String,
}

/// Intervention Asset Object in the Spatial Registry (FR-012)
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct InterventionRecord {
    pub id: String,
    pub watershed_id: String,
    pub intervention_type: InterventionType,
    pub location: GeoPoint,
    pub date: String,
    pub source: String,
    pub confidence: f64,
    pub condition: InterventionCondition,
    pub supporting_observation_ids: Vec<String>,
}

/// Satellite Environmental Context
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SatelliteContext {
    pub provider: String,
    pub scene_id: String,
    pub resolution_m: f64,
    pub ndvi: f64,
    pub ndwi: f64,
    pub ndvi_historical_baseline: Option<f64>,
    pub ndvi_delta: Option<f64>,
    pub water_area_ha: Option<f64>,
    pub acquisition_date: String,
}

/// Terrain Environmental Context (FR-010, FR-011)
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TerrainContext {
    pub elevation_m: f64,
    pub slope_deg: f64,
    pub aspect_deg: Option<f64>,
    pub drainage_distance_m: f64,
    pub dem_source: String,
}

/// Quality rating of fused spatial evidence
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum EvidenceQuality {
    High,
    Medium,
    Low,
}

/// Official Multimodal Spatial Evidence Record (Appendix A Data Contract)
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SpatialEvidenceRecord {
    pub observation_id: String,
    pub project_id: String,
    pub watershed_id: String,
    pub image: ImageEvidenceContract,
    pub location: LocationContract,
    pub time: String,
    pub source: String,
    pub intervention: InterventionEvidenceContract,
    pub satellite_context: SatelliteContextContract,
    pub terrain: TerrainContextContract,
    pub provenance: ProvenanceContract,
    pub evidence_quality: EvidenceQuality,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ImageEvidenceContract {
    pub uri: String,
    pub sha256: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LocationContract {
    pub latitude: f64,
    pub longitude: f64,
    pub crs: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct InterventionEvidenceContract {
    pub r#type: String,
    pub confidence: f64,
    pub condition: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SatelliteContextContract {
    pub provider: String,
    pub scene_id: String,
    pub ndvi: f64,
    pub ndwi: f64,
    pub ndvi_change: Option<f64>,
    pub water_area_change_ha: Option<f64>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TerrainContextContract {
    pub elevation_m: f64,
    pub slope_deg: f64,
    pub drainage_distance_m: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ProvenanceContract {
    pub model_version: String,
    pub processing_version: String,
    pub timestamp: String,
    pub limitations: String,
}

/// Temporal Change Summary (FR-015)
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TemporalChangeSummary {
    pub baseline_date: String,
    pub current_date: String,
    pub mean_ndvi_baseline: f64,
    pub mean_ndvi_current: f64,
    pub ndvi_delta: f64,
    pub ndvi_percentage_change: f64,
    pub water_area_baseline_ha: f64,
    pub water_area_current_ha: f64,
    pub water_area_delta_ha: f64,
    pub degraded_area_change_pct: f64,
}
