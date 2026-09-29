use crate::models::TemporalChangeSummary;
use serde::{Deserialize, Serialize};

/// Detailed breakdown of temporal change across a watershed
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TemporalChangeAnalysis {
    pub summary: TemporalChangeSummary,
    pub significant_greening_area_ha: f64,
    pub significant_browning_area_ha: f64,
    pub stable_area_ha: f64,
    pub water_expansion_area_ha: f64,
    pub confidence_score: f64,
    pub interpretation: String,
}

/// Compute temporal change metrics between two observation epochs
pub fn evaluate_temporal_change(
    baseline_date: &str,
    current_date: &str,
    ndvi_baseline: &[f64],
    ndvi_current: &[f64],
    water_area_baseline_ha: f64,
    water_area_current_ha: f64,
    cell_area_ha: f64,
) -> TemporalChangeAnalysis {
    assert_eq!(
        ndvi_baseline.len(),
        ndvi_current.len(),
        "Baseline and current raster pixel counts must match"
    );

    let mut sum_base = 0.0;
    let mut sum_curr = 0.0;
    let mut valid_count = 0;

    let mut greening_cells = 0;
    let mut browning_cells = 0;
    let mut stable_cells = 0;

    for (&b, &c) in ndvi_baseline.iter().zip(ndvi_current.iter()) {
        if b.is_finite() && c.is_finite() {
            valid_count += 1;
            sum_base += b;
            sum_curr += c;

            let delta = c - b;
            if delta >= 0.10 {
                greening_cells += 1;
            } else if delta <= -0.10 {
                browning_cells += 1;
            } else {
                stable_cells += 1;
            }
        }
    }

    let mean_base = if valid_count > 0 {
        sum_base / valid_count as f64
    } else {
        0.0
    };
    let mean_curr = if valid_count > 0 {
        sum_curr / valid_count as f64
    } else {
        0.0
    };

    let ndvi_delta = mean_curr - mean_base;
    let ndvi_pct_change = if mean_base.abs() > 1e-4 {
        (ndvi_delta / mean_base) * 100.0
    } else {
        0.0
    };

    let water_delta_ha = water_area_current_ha - water_area_baseline_ha;

    let greening_ha = greening_cells as f64 * cell_area_ha;
    let browning_ha = browning_cells as f64 * cell_area_ha;
    let stable_ha = stable_cells as f64 * cell_area_ha;

    let degraded_change_pct = if greening_ha > browning_ha {
        -((greening_ha - browning_ha) / (greening_ha + browning_ha + stable_ha).max(1.0)) * 100.0
    } else {
        ((browning_ha - greening_ha) / (greening_ha + browning_ha + stable_ha).max(1.0)) * 100.0
    };

    let interpretation = format!(
        "Watershed monitoring from {} to {}: Mean NDVI changed from {:.2} to {:.2} ({:+.1}%), water storage changed by {:+.1} ha. {} ha exhibited significant greening.",
        baseline_date,
        current_date,
        mean_base,
        mean_curr,
        ndvi_pct_change,
        water_delta_ha,
        greening_ha.round()
    );

    TemporalChangeAnalysis {
        summary: TemporalChangeSummary {
            baseline_date: baseline_date.to_string(),
            current_date: current_date.to_string(),
            mean_ndvi_baseline: mean_base,
            mean_ndvi_current: mean_curr,
            ndvi_delta,
            ndvi_percentage_change: ndvi_pct_change,
            water_area_baseline_ha,
            water_area_current_ha,
            water_area_delta_ha: water_delta_ha,
            degraded_area_change_pct: degraded_change_pct,
        },
        significant_greening_area_ha: greening_ha,
        significant_browning_area_ha: browning_ha,
        stable_area_ha: stable_ha,
        water_expansion_area_ha: water_delta_ha.max(0.0),
        confidence_score: 0.92,
        interpretation,
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_temporal_change_greening() {
        let base = vec![0.30, 0.35, 0.40, 0.25];
        let curr = vec![0.45, 0.50, 0.52, 0.40];
        let analysis = evaluate_temporal_change("2023-01", "2026-01", &base, &curr, 2.5, 4.0, 0.09);
        assert!(analysis.summary.ndvi_delta > 0.0);
        assert_eq!(analysis.summary.water_area_delta_ha, 1.5);
    }
}
