use serde::{Deserialize, Serialize};

/// Land-Use / Land-Cover Classes (PRD Section 16 / FR-009)
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum LandCoverClass {
    Water,
    ForestTreeCover,
    Agriculture,
    GrassScrub,
    BarrenDegraded,
    BuiltUp,
    Wetland,
}

impl LandCoverClass {
    pub fn display_name(&self) -> &'static str {
        match self {
            LandCoverClass::Water => "Water Body / Pond",
            LandCoverClass::ForestTreeCover => "Dense Forest / Tree Canopy",
            LandCoverClass::Agriculture => "Cropland / Agriculture",
            LandCoverClass::GrassScrub => "Grassland / Shrub / Scrub",
            LandCoverClass::BarrenDegraded => "Barren / Degraded Land / Exposed Rock",
            LandCoverClass::BuiltUp => "Built-Up / Settlement",
            LandCoverClass::Wetland => "Inundated Wetland",
        }
    }

    pub fn hex_color(&self) -> &'static str {
        match self {
            LandCoverClass::Water => "#0284c7",
            LandCoverClass::ForestTreeCover => "#15803d",
            LandCoverClass::Agriculture => "#84cc16",
            LandCoverClass::GrassScrub => "#a3e635",
            LandCoverClass::BarrenDegraded => "#b45309",
            LandCoverClass::BuiltUp => "#64748b",
            LandCoverClass::Wetland => "#06b6d4",
        }
    }
}

/// Fast rule-based LULC classifier based on spectral indices (NDVI, NDWI, MNDWI)
/// Enables zero-latency offline classification on low-power field edge hardware
pub fn classify_pixel_lulc(ndvi: f64, ndwi: f64, mndwi: f64) -> LandCoverClass {
    if mndwi > 0.1 || ndwi > 0.15 {
        LandCoverClass::Water
    } else if ndwi > -0.05 && ndvi < 0.25 {
        LandCoverClass::Wetland
    } else if ndvi >= 0.60 {
        LandCoverClass::ForestTreeCover
    } else if ndvi >= 0.35 && ndwi < 0.10 {
        LandCoverClass::Agriculture
    } else if ndvi >= 0.20 && ndvi < 0.35 {
        LandCoverClass::GrassScrub
    } else if ndvi >= 0.05 && ndvi < 0.20 {
        LandCoverClass::BarrenDegraded
    } else {
        LandCoverClass::BuiltUp
    }
}

/// Area distribution summary of LULC classes across a watershed Area of Interest (AOI)
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LulcDistribution {
    pub total_cells: usize,
    pub cell_area_ha: f64,
    pub water_area_ha: f64,
    pub forest_area_ha: f64,
    pub agriculture_area_ha: f64,
    pub grass_scrub_area_ha: f64,
    pub barren_degraded_area_ha: f64,
    pub built_up_area_ha: f64,
    pub wetland_area_ha: f64,
}

/// Batch compute LULC area distribution from raster index arrays
pub fn calculate_lulc_distribution(
    ndvi_array: &[f64],
    ndwi_array: &[f64],
    mndwi_array: &[f64],
    cell_area_ha: f64,
) -> LulcDistribution {
    let mut water = 0;
    let mut forest = 0;
    let mut ag = 0;
    let mut grass = 0;
    let mut barren = 0;
    let mut built = 0;
    let mut wetland = 0;
    let mut total = 0;

    for i in 0..ndvi_array.len() {
        let ndvi = ndvi_array[i];
        let ndwi = ndwi_array[i];
        let mndwi = mndwi_array[i];

        if ndvi.is_finite() && ndwi.is_finite() && mndwi.is_finite() {
            total += 1;
            match classify_pixel_lulc(ndvi, ndwi, mndwi) {
                LandCoverClass::Water => water += 1,
                LandCoverClass::ForestTreeCover => forest += 1,
                LandCoverClass::Agriculture => ag += 1,
                LandCoverClass::GrassScrub => grass += 1,
                LandCoverClass::BarrenDegraded => barren += 1,
                LandCoverClass::BuiltUp => built += 1,
                LandCoverClass::Wetland => wetland += 1,
            }
        }
    }

    LulcDistribution {
        total_cells: total,
        cell_area_ha,
        water_area_ha: water as f64 * cell_area_ha,
        forest_area_ha: forest as f64 * cell_area_ha,
        agriculture_area_ha: ag as f64 * cell_area_ha,
        grass_scrub_area_ha: grass as f64 * cell_area_ha,
        barren_degraded_area_ha: barren as f64 * cell_area_ha,
        built_up_area_ha: built as f64 * cell_area_ha,
        wetland_area_ha: wetland as f64 * cell_area_ha,
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_pixel_lulc_classification() {
        assert_eq!(classify_pixel_lulc(0.72, -0.2, -0.3), LandCoverClass::ForestTreeCover);
        assert_eq!(classify_pixel_lulc(0.48, -0.1, -0.1), LandCoverClass::Agriculture);
        assert_eq!(classify_pixel_lulc(-0.15, 0.45, 0.35), LandCoverClass::Water);
        assert_eq!(classify_pixel_lulc(0.12, -0.15, -0.2), LandCoverClass::BarrenDegraded);
    }
}
