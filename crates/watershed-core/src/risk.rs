use serde::{Deserialize, Serialize};

/// Risk Category Rating
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum RiskLevel {
    Critical,
    High,
    Moderate,
    Low,
}

/// Priority Assessment for a Watershed Zone (FR-018)
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PriorityZoneAssessment {
    pub erosion_risk_score: f64, // 0.0 - 100.0
    pub erosion_risk_level: RiskLevel,
    pub water_stress_score: f64, // 0.0 - 100.0
    pub water_stress_level: RiskLevel,
    pub recommended_intervention: String,
    pub rationale: String,
}

/// Compute weighted priority risk score based on slope, NDVI vegetation cover, and drainage proximity
///
/// Inputs:
/// - slope_deg: terrain slope from Copernicus DEM (e.g. 0.0 to 45.0 degrees)
/// - ndvi: current vegetation index (-1.0 to 1.0)
/// - drainage_distance_m: distance in meters to nearest stream channel
/// - flow_accumulation: hydrological flow accumulation metric
pub fn evaluate_priority_zone(
    slope_deg: f64,
    ndvi: f64,
    drainage_distance_m: f64,
    flow_accumulation: f64,
) -> PriorityZoneAssessment {
    // 1. Erosion Risk Model (RUSLE-inspired weighting):
    // Higher slope increases erosion exponentially.
    // Lower NDVI (lack of root canopy) exposes topsoil.
    // Proximity to drainage channel amplifies gully cutting.
    let slope_factor = (slope_deg / 30.0).clamp(0.0, 1.0) * 45.0; // up to 45 pts
    let veg_exposure_factor = (1.0 - (ndvi.clamp(0.0, 0.8) / 0.8)) * 35.0; // up to 35 pts
    let stream_proximity_factor = if drainage_distance_m < 20.0 {
        20.0
    } else if drainage_distance_m < 50.0 {
        12.0
    } else {
        4.0
    };

    let erosion_score = (slope_factor + veg_exposure_factor + stream_proximity_factor).clamp(0.0, 100.0);
    let erosion_risk_level = if erosion_score >= 70.0 {
        RiskLevel::Critical
    } else if erosion_score >= 50.0 {
        RiskLevel::High
    } else if erosion_score >= 30.0 {
        RiskLevel::Moderate
    } else {
        RiskLevel::Low
    };

    // 2. Water Stress Model:
    // Low NDVI + high distance from perennial drainage + low flow accumulation
    let water_stress_score = ((1.0 - ndvi.clamp(0.0, 0.7) / 0.7) * 50.0
        + (drainage_distance_m.min(300.0) / 300.0) * 35.0
        + (1.0 - (flow_accumulation.min(500.0) / 500.0)) * 15.0)
        .clamp(0.0, 100.0);

    let water_stress_level = if water_stress_score >= 70.0 {
        RiskLevel::Critical
    } else if water_stress_score >= 50.0 {
        RiskLevel::High
    } else if water_stress_score >= 30.0 {
        RiskLevel::Moderate
    } else {
        RiskLevel::Low
    };

    // 3. Recommended Intervention Logic
    let (recommendation, rationale) = if drainage_distance_m < 30.0 && slope_deg < 10.0 {
        (
            "Masonry / Boulder Check Dam".to_string(),
            "Low slope active stream corridor suitable for surface runoff retention and silt deposition.".to_string(),
        )
    } else if slope_deg >= 12.0 && ndvi < 0.35 {
        (
            "Catchment Afforestation & Continuous Contour Trenches (CCT)".to_string(),
            "Steep degraded hillside prone to topsoil washout; biological stabilization required.".to_string(),
        )
    } else if slope_deg < 6.0 && water_stress_score >= 55.0 {
        (
            "Community Percolation Tank / Farm Pond".to_string(),
            "Gentle terrain with high water deficit; optimal for localized groundwater recharge.".to_string(),
        )
    } else {
        (
            "Vegetative Contour Bunding".to_string(),
            "Standard soil moisture retention and runoff deceleration.".to_string(),
        )
    };

    PriorityZoneAssessment {
        erosion_risk_score: erosion_score,
        erosion_risk_level,
        water_stress_score,
        water_stress_level,
        recommended_intervention: recommendation,
        rationale,
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_steep_degraded_slope_assessment() {
        let assessment = evaluate_priority_zone(16.5, 0.18, 120.0, 45.0);
        assert!(assessment.erosion_risk_score >= 50.0);
        assert_eq!(assessment.recommended_intervention, "Catchment Afforestation & Continuous Contour Trenches (CCT)");
    }

    #[test]
    fn test_stream_check_dam_assessment() {
        let assessment = evaluate_priority_zone(5.2, 0.42, 12.0, 350.0);
        assert_eq!(assessment.recommended_intervention, "Masonry / Boulder Check Dam");
    }
}
