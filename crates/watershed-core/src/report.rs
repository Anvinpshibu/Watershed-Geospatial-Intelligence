use crate::models::{SpatialEvidenceRecord, TemporalChangeSummary, Watershed};
use chrono::Utc;

/// Automated Watershed Monitoring & Evidence Report Generator (FR-022, PRD Section 63)
pub struct ReportGenerator;

impl ReportGenerator {
    pub fn generate_markdown_report(
        watershed: &Watershed,
        state: &str,
        district: &str,
        block: &str,
        monitoring_period: &str,
        total_photos: usize,
        located_photos: usize,
        interventions_count: usize,
        temporal_summary: &TemporalChangeSummary,
        evidence_records: &[SpatialEvidenceRecord],
    ) -> String {
        let timestamp = Utc::now().format("%Y-%m-%d %H:%M:%S UTC").to_string();

        let mut report = String::new();

        report.push_str("# WATERSHED GEOSPATIAL INTELLIGENCE & MONITORING REPORT\n");
        report.push_str("### Ministry of Rural Development — Department of Land Resources (DoLR)\n\n");
        report.push_str(&format!("**Generated:** {}\n", timestamp));
        report.push_str(&format!("**Watershed Name:** {} ({})\n", watershed.name, watershed.code));
        report.push_str(&format!("**Administrative Unit:** {}, District {}, State {}\n", block, district, state));
        report.push_str(&format!("**Total Watershed Area:** {:.2} km²\n", watershed.area_sq_km));
        report.push_str(&format!("**Monitoring Period:** {}\n\n", monitoring_period));

        report.push_str("---\n\n");

        report.push_str("## 1. Field Observations Summary\n\n");
        report.push_str(&format!("- **Total Field Photographs Ingested:** {}\n", total_photos));
        report.push_str(&format!("- **Spatially Located with GPS:** {} ({:.1}%)\n", located_photos, (located_photos as f64 / total_photos.max(1) as f64) * 100.0));
        report.push_str(&format!("- **Unlocated Flagged for Review:** {}\n", total_photos.saturating_sub(located_photos)));
        report.push_str(&format!("- **Verified Interventions Logged:** {}\n\n", interventions_count));

        report.push_str("---\n\n");

        report.push_str("## 2. Remote Sensing Environmental Indicators\n\n");
        report.push_str("| Metric | Baseline (" );
        report.push_str(&temporal_summary.baseline_date);
        report.push_str(") | Current (");
        report.push_str(&temporal_summary.current_date);
        report.push_str(") | Observed Change |\n");
        report.push_str("| :--- | :--- | :--- | :--- |\n");
        report.push_str(&format!(
            "| **Mean NDVI (Vegetation)** | {:.3} | {:.3} | **{:+.3} ({:+.1}%)** |\n",
            temporal_summary.mean_ndvi_baseline,
            temporal_summary.mean_ndvi_current,
            temporal_summary.ndvi_delta,
            temporal_summary.ndvi_percentage_change
        ));
        report.push_str(&format!(
            "| **Surface Water Area** | {:.1} ha | {:.1} ha | **{:+.1} ha** |\n",
            temporal_summary.water_area_baseline_ha,
            temporal_summary.water_area_current_ha,
            temporal_summary.water_area_delta_ha
        ));
        report.push_str(&format!(
            "| **Degraded Land Metric** | Baseline Index | Post-Treatment | **{:+.1}%** |\n\n",
            temporal_summary.degraded_area_change_pct
        ));

        report.push_str("---\n\n");

        report.push_str("## 3. High-Confidence Multimodal Intervention Evidence\n\n");
        report.push_str("| Obs ID | Intervention | Confidence | Coordinates | Slope | NDVI Δ | Evidence Quality |\n");
        report.push_str("| :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n");

        for rec in evidence_records.iter().take(15) {
            let ndvi_delta_str = rec
                .satellite_context
                .ndvi_change
                .map(|d| format!("{:+.2}", d))
                .unwrap_or_else(|| "N/A".to_string());
            report.push_str(&format!(
                "| {} | {} | {:.0}% | {:.4}°N, {:.4}°E | {:.1}° | {} | {:?} |\n",
                rec.observation_id,
                rec.intervention.r#type,
                rec.intervention.confidence * 100.0,
                rec.location.latitude,
                rec.location.longitude,
                rec.terrain.slope_deg,
                ndvi_delta_str,
                rec.evidence_quality
            ));
        }

        report.push_str("\n---\n\n");

        report.push_str("## 4. Data Provenance, Audit Integrity & Limitations\n\n");
        report.push_str("- **Satellite Sensors:** Sentinel-2 L2A (10m), Landsat 8/9 C2 L2 (30m), SRISHTI-DRISHTI 30m compatible\n");
        report.push_str("- **Digital Elevation Model:** Copernicus DEM GLO-30 (30m spatial resolution)\n");
        report.push_str("- **AI Model Pipeline:** YOLOv11-Watershed-Detection (v1.2) + Multimodal Spatial Evidence Fusion Engine (v1.0)\n");
        report.push_str("- **Forensic Chain of Custody:** SHA-256 cryptographic digests generated at photo ingestion.\n\n");
        report.push_str("> [!IMPORTANT]\n");
        report.push_str("> **Limitation Notice:** In accordance with DoLR standards, analytical indicators represent observed spatial correlations and environmental metrics. They serve as a decision-support aid and do not independently establish causal legal attribution without ground officer verification.\n");

        report
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::models::{GeoPoint, Polygon, TemporalChangeSummary};

    #[test]
    fn test_report_generation() {
        let ws = Watershed {
            id: "WS-001".to_string(),
            project_id: "PROJ-01".to_string(),
            name: "Palakkad Watershed WS-001".to_string(),
            code: "KL-PKD-001".to_string(),
            area_sq_km: 12.4,
            boundary: Polygon {
                coordinates: vec![GeoPoint::new(10.7, 76.6), GeoPoint::new(10.8, 76.6), GeoPoint::new(10.8, 76.7)],
            },
            source: "Pilot Shapefile".to_string(),
        };

        let temp = TemporalChangeSummary {
            baseline_date: "2023-01".to_string(),
            current_date: "2026-01".to_string(),
            mean_ndvi_baseline: 0.41,
            mean_ndvi_current: 0.55,
            ndvi_delta: 0.14,
            ndvi_percentage_change: 34.1,
            water_area_baseline_ha: 4.2,
            water_area_current_ha: 6.8,
            water_area_delta_ha: 2.6,
            degraded_area_change_pct: -15.4,
        };

        let report = ReportGenerator::generate_markdown_report(&ws, "Kerala", "Palakkad", "Chittur", "2023–2026", 248, 236, 43, &temp, &[]);
        assert!(report.contains("Palakkad Watershed WS-001"));
        assert!(report.contains("0.41"));
        assert!(report.contains("0.55"));
    }
}
