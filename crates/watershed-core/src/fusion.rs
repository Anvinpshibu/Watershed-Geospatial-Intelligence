use crate::models::{
    EvidenceQuality, FieldObservation, ImageEvidenceContract, InterventionEvidenceContract,
    LocationContract, ProvenanceContract, SatelliteContext, SatelliteContextContract,
    SpatialEvidenceRecord, TerrainContext, TerrainContextContract,
};
use chrono::Utc;

/// Multimodal Spatial Evidence Fusion Engine (PRD Section 23, Appendix A)
///
/// Fuses:
/// - Field observation (EXIF, SHA-256 hash, photo metadata)
/// - AI vision interpretation (intervention type, visual condition, confidence)
/// - Satellite context (Sentinel-2 / Landsat NDVI, NDWI, temporal delta)
/// - Terrain context (Copernicus DEM 30m elevation, slope, drainage distance)
pub fn fuse_spatial_evidence(
    observation: &FieldObservation,
    satellite: &SatelliteContext,
    terrain: &TerrainContext,
    model_version: &str,
    processing_version: &str,
) -> Result<SpatialEvidenceRecord, String> {
    let loc = match &observation.location {
        Some(l) => l,
        None => return Err(format!("Observation {} lacks GPS coordinates; unlocated images cannot produce spatial evidence records", observation.id)),
    };

    let detection = observation.detected_intervention.as_ref();
    let intervention_type_str = detection
        .map(|d| d.intervention_type.display_name().to_string())
        .unwrap_or_else(|| "Unclassified Structure".to_string());

    let confidence = detection.map(|d| d.confidence).unwrap_or(0.0);
    let condition_str = detection
        .map(|d| format!("{:?}", d.condition))
        .unwrap_or_else(|| "Unknown".to_string());

    // Evaluate evidence quality rating
    let evidence_quality = if confidence >= 0.85 && terrain.slope_deg >= 0.0 && loc.altitude_m.is_some() {
        EvidenceQuality::High
    } else if confidence >= 0.65 {
        EvidenceQuality::Medium
    } else {
        EvidenceQuality::Low
    };

    Ok(SpatialEvidenceRecord {
        observation_id: observation.id.clone(),
        project_id: observation.project_id.clone(),
        watershed_id: observation.watershed_id.clone(),
        image: ImageEvidenceContract {
            uri: observation.storage_uri.clone(),
            sha256: observation.sha256_hash.clone(),
        },
        location: LocationContract {
            latitude: loc.latitude,
            longitude: loc.longitude,
            crs: "EPSG:4326".to_string(),
        },
        time: observation.timestamp.to_rfc3339(),
        source: "field_geo_photo".to_string(),
        intervention: InterventionEvidenceContract {
            r#type: intervention_type_str,
            confidence,
            condition: condition_str,
        },
        satellite_context: SatelliteContextContract {
            provider: satellite.provider.clone(),
            scene_id: satellite.scene_id.clone(),
            ndvi: satellite.ndvi,
            ndwi: satellite.ndwi,
            ndvi_change: satellite.ndvi_delta,
            water_area_change_ha: satellite.water_area_ha,
        },
        terrain: TerrainContextContract {
            elevation_m: terrain.elevation_m,
            slope_deg: terrain.slope_deg,
            drainage_distance_m: terrain.drainage_distance_m,
        },
        provenance: ProvenanceContract {
            model_version: model_version.to_string(),
            processing_version: processing_version.to_string(),
            timestamp: Utc::now().to_rfc3339(),
            limitations: "Results represent spatial evidence indicators and do not independently establish causal impact without ground validation.".to_string(),
        },
        evidence_quality,
    })
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::models::{
        GeoPoint, IngestionStatus, InterventionCondition, InterventionDetection, InterventionType,
    };
    use chrono::Utc;

    #[test]
    fn test_evidence_fusion_contract() {
        let obs = FieldObservation {
            id: "OBS-001".to_string(),
            project_id: "PROJ-01".to_string(),
            watershed_id: "WS-01".to_string(),
            file_name: "checkdam_01.jpg".to_string(),
            storage_uri: "object://field/checkdam_01.jpg".to_string(),
            sha256_hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855".to_string(),
            location: Some(GeoPoint::with_altitude(10.78, 76.65, 142.0)),
            timestamp: Utc::now(),
            heading_deg: Some(92.0),
            camera_make: Some("Sony".to_string()),
            camera_model: Some("A6700".to_string()),
            status: IngestionStatus::Located,
            detected_intervention: Some(InterventionDetection {
                intervention_type: InterventionType::CheckDam,
                confidence: 0.94,
                condition: InterventionCondition::Intact,
                bounding_box: Some([0.1, 0.2, 0.8, 0.9]),
                model_version: "yolo-watershed-v1".to_string(),
            }),
        };

        let sat = SatelliteContext {
            provider: "Sentinel-2 L2A".to_string(),
            scene_id: "S2A_MSIL2A_20260815".to_string(),
            resolution_m: 10.0,
            ndvi: 0.54,
            ndwi: 0.22,
            ndvi_historical_baseline: Some(0.38),
            ndvi_delta: Some(0.16),
            water_area_ha: Some(2.1),
            acquisition_date: "2026-08-15".to_string(),
        };

        let ter = TerrainContext {
            elevation_m: 142.0,
            slope_deg: 6.4,
            aspect_deg: Some(185.0),
            drainage_distance_m: 14.5,
            dem_source: "Copernicus GLO-30".to_string(),
        };

        let record = fuse_spatial_evidence(&obs, &sat, &ter, "yolo-watershed-v1", "pipeline-v1").unwrap();
        assert_eq!(record.observation_id, "OBS-001");
        assert_eq!(record.intervention.r#type, "Check Dam");
        assert_eq!(record.evidence_quality, EvidenceQuality::High);
    }
}
