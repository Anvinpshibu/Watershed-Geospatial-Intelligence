use serde::{Deserialize, Serialize};
use watershed_core::{
    calculate_lulc_distribution, calculate_raster_stats, compute_raster_ndvi, compute_raster_ndwi,
    evaluate_priority_zone, evaluate_temporal_change, fuse_spatial_evidence, parse_image_metadata,
    FieldObservation, LulcDistribution, PriorityZoneAssessment, RasterStats, ReportGenerator,
    SatelliteContext, SpatialEvidenceRecord, TemporalChangeAnalysis, TerrainContext, Watershed,
};

#[derive(Debug, Serialize, Deserialize)]
pub struct IngestionResult {
    pub sha256_hash: String,
    pub latitude: Option<f64>,
    pub longitude: Option<f64>,
    pub altitude_m: Option<f64>,
    pub heading_deg: Option<f64>,
    pub timestamp: String,
    pub camera_make: Option<String>,
    pub camera_model: Option<String>,
    pub is_located: bool,
}

#[tauri::command]
pub fn ingest_image_bytes(file_bytes: Vec<u8>) -> Result<IngestionResult, String> {
    let meta = parse_image_metadata(&file_bytes);
    let is_located = meta.location.is_some();
    let (lat, lon, alt) = match meta.location {
        Some(loc) => (Some(loc.latitude), Some(loc.longitude), loc.altitude_m),
        None => (None, None, None),
    };

    Ok(IngestionResult {
        sha256_hash: meta.sha256_hash,
        latitude: lat,
        longitude: lon,
        altitude_m: alt.or(meta.altitude_m),
        heading_deg: meta.heading_deg,
        timestamp: meta.timestamp.to_rfc3339(),
        camera_make: meta.camera_make,
        camera_model: meta.camera_model,
        is_located,
    })
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SpectralIndicesResult {
    pub ndvi: Vec<f64>,
    pub ndwi: Vec<f64>,
    pub ndvi_stats: RasterStats,
    pub ndwi_stats: RasterStats,
}

#[tauri::command]
pub fn compute_spectral_indices(
    red: Vec<f64>,
    green: Vec<f64>,
    nir: Vec<f64>,
) -> Result<SpectralIndicesResult, String> {
    if red.len() != nir.len() || green.len() != nir.len() {
        return Err("Band lengths must be identical".to_string());
    }

    let ndvi = compute_raster_ndvi(&nir, &red);
    let ndwi = compute_raster_ndwi(&green, &nir);

    let ndvi_stats = calculate_raster_stats(&ndvi);
    let ndwi_stats = calculate_raster_stats(&ndwi);

    Ok(SpectralIndicesResult {
        ndvi,
        ndwi,
        ndvi_stats,
        ndwi_stats,
    })
}

#[tauri::command]
pub fn compute_lulc_distribution(
    ndvi: Vec<f64>,
    ndwi: Vec<f64>,
    mndwi: Vec<f64>,
    cell_area_ha: f64,
) -> Result<LulcDistribution, String> {
    if ndvi.len() != ndwi.len() || ndvi.len() != mndwi.len() {
        return Err("Spectral index arrays must have matching dimensions".to_string());
    }

    Ok(calculate_lulc_distribution(&ndvi, &ndwi, &mndwi, cell_area_ha))
}

#[tauri::command]
pub fn assess_priority(
    slope_deg: f64,
    ndvi: f64,
    drainage_distance_m: f64,
    flow_accumulation: f64,
) -> Result<PriorityZoneAssessment, String> {
    Ok(evaluate_priority_zone(
        slope_deg,
        ndvi,
        drainage_distance_m,
        flow_accumulation,
    ))
}

#[tauri::command]
pub fn fuse_evidence(
    observation: FieldObservation,
    satellite: SatelliteContext,
    terrain: TerrainContext,
    model_version: String,
    processing_version: String,
) -> Result<SpatialEvidenceRecord, String> {
    fuse_spatial_evidence(
        &observation,
        &satellite,
        &terrain,
        &model_version,
        &processing_version,
    )
}

#[tauri::command]
pub fn analyze_change(
    baseline_date: String,
    current_date: String,
    ndvi_baseline: Vec<f64>,
    ndvi_current: Vec<f64>,
    water_area_baseline_ha: f64,
    water_area_current_ha: f64,
    cell_area_ha: f64,
) -> Result<TemporalChangeAnalysis, String> {
    if ndvi_baseline.len() != ndvi_current.len() {
        return Err("Baseline and current raster pixel arrays must match in size".to_string());
    }

    Ok(evaluate_temporal_change(
        &baseline_date,
        &current_date,
        &ndvi_baseline,
        &ndvi_current,
        water_area_baseline_ha,
        water_area_current_ha,
        cell_area_ha,
    ))
}

#[tauri::command]
pub fn generate_report(
    watershed: Watershed,
    state: String,
    district: String,
    block: String,
    monitoring_period: String,
    total_photos: usize,
    located_photos: usize,
    interventions_count: usize,
    temporal_summary: watershed_core::TemporalChangeSummary,
    evidence_records: Vec<SpatialEvidenceRecord>,
) -> Result<String, String> {
    Ok(ReportGenerator::generate_markdown_report(
        &watershed,
        &state,
        &district,
        &block,
        &monitoring_period,
        total_photos,
        located_photos,
        interventions_count,
        &temporal_summary,
        &evidence_records,
    ))
}
