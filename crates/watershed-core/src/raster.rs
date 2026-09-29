use serde::{Deserialize, Serialize};

/// Summary statistical distribution of a raster index layer
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RasterStats {
    pub min: f64,
    pub max: f64,
    pub mean: f64,
    pub std_dev: f64,
    pub count: usize,
    pub valid_count: usize,
}

/// Compute NDVI for a pair of NIR and RED reflectance values
/// Formula: (NIR - RED) / (NIR + RED)
#[inline]
pub fn compute_pixel_ndvi(nir: f64, red: f64) -> f64 {
    let denom = nir + red;
    if denom.abs() < 1e-6 {
        0.0
    } else {
        ((nir - red) / denom).clamp(-1.0, 1.0)
    }
}

/// Compute NDWI (McFeeters) for a pair of GREEN and NIR reflectance values
/// Formula: (GREEN - NIR) / (GREEN + NIR)
#[inline]
pub fn compute_pixel_ndwi(green: f64, nir: f64) -> f64 {
    let denom = green + nir;
    if denom.abs() < 1e-6 {
        0.0
    } else {
        ((green - nir) / denom).clamp(-1.0, 1.0)
    }
}

/// Compute MNDWI (Xu) for a pair of GREEN and SWIR reflectance values
/// Formula: (GREEN - SWIR) / (GREEN + SWIR)
#[inline]
pub fn compute_pixel_mndwi(green: f64, swir: f64) -> f64 {
    let denom = green + swir;
    if denom.abs() < 1e-6 {
        0.0
    } else {
        ((green - swir) / denom).clamp(-1.0, 1.0)
    }
}

/// Batch compute NDVI raster array from NIR and RED arrays
pub fn compute_raster_ndvi(nir: &[f64], red: &[f64]) -> Vec<f64> {
    assert_eq!(nir.len(), red.len(), "NIR and RED band lengths must match");
    nir.iter()
        .zip(red.iter())
        .map(|(&n, &r)| compute_pixel_ndvi(n, r))
        .collect()
}

/// Batch compute NDWI raster array from GREEN and NIR arrays
pub fn compute_raster_ndwi(green: &[f64], nir: &[f64]) -> Vec<f64> {
    assert_eq!(green.len(), nir.len(), "GREEN and NIR band lengths must match");
    green
        .iter()
        .zip(nir.iter())
        .map(|(&g, &n)| compute_pixel_ndwi(g, n))
        .collect()
}

/// Calculate summary statistics from a slice of raster values, ignoring NaN or infinity
pub fn calculate_raster_stats(values: &[f64]) -> RasterStats {
    let count = values.len();
    if count == 0 {
        return RasterStats {
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            std_dev: 0.0,
            count: 0,
            valid_count: 0,
        };
    }

    let mut valid_count = 0;
    let mut sum = 0.0;
    let mut min = f64::MAX;
    let mut max = f64::MIN;

    for &v in values {
        if v.is_finite() {
            valid_count += 1;
            sum += v;
            if v < min {
                min = v;
            }
            if v > max {
                max = v;
            }
        }
    }

    if valid_count == 0 {
        return RasterStats {
            min: 0.0,
            max: 0.0,
            mean: 0.0,
            std_dev: 0.0,
            count,
            valid_count: 0,
        };
    }

    let mean = sum / (valid_count as f64);
    let mut variance_sum = 0.0;
    for &v in values {
        if v.is_finite() {
            variance_sum += (v - mean).powi(2);
        }
    }
    let std_dev = (variance_sum / (valid_count as f64)).sqrt();

    RasterStats {
        min,
        max,
        mean,
        std_dev,
        count,
        valid_count,
    }
}

/// Calculate DEM terrain slope in degrees using Horn's algorithm from a 3x3 elevation cell window:
///
/// [ a, b, c ]
/// [ d, e, f ]
/// [ g, h, i ]
///
/// cell_size_m: spatial resolution in meters (e.g. 30.0 for Copernicus GLO-30)
pub fn calculate_dem_slope_deg(elevation_window_3x3: &[f64; 9], cell_size_m: f64) -> f64 {
    let [a, b, c, d, _e, f, g, h, i] = *elevation_window_3x3;

    let dz_dx = ((c + 2.0 * f + i) - (a + 2.0 * d + g)) / (8.0 * cell_size_m);
    let dz_dy = ((g + 2.0 * h + i) - (a + 2.0 * b + c)) / (8.0 * cell_size_m);

    let rise_run = (dz_dx * dz_dx + dz_dy * dz_dy).sqrt();
    rise_run.atan().to_degrees()
}

/// Classify vegetation health from NDVI value
pub fn classify_ndvi(ndvi: f64) -> &'static str {
    if ndvi < 0.0 {
        "Water / Inundated"
    } else if ndvi < 0.15 {
        "Barren / Rock / Built-up"
    } else if ndvi < 0.3 {
        "Sparse / Stressed Vegetation"
    } else if ndvi < 0.5 {
        "Moderate / Shrub / Dry Agriculture"
    } else {
        "Dense / Healthy Green Canopy"
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_ndvi_calculation() {
        let nir = 0.45;
        let red = 0.15;
        let ndvi = compute_pixel_ndvi(nir, red);
        // (0.45 - 0.15) / (0.45 + 0.15) = 0.30 / 0.60 = 0.50
        assert!((ndvi - 0.50).abs() < 1e-4);
    }

    #[test]
    fn test_ndwi_calculation() {
        let green = 0.30;
        let nir = 0.10;
        let ndwi = compute_pixel_ndwi(green, nir);
        // (0.30 - 0.10) / (0.30 + 0.10) = 0.20 / 0.40 = 0.50
        assert!((ndwi - 0.50).abs() < 1e-4);
    }

    #[test]
    fn test_raster_statistics() {
        let vals = vec![0.1, 0.2, 0.3, 0.4, 0.5];
        let stats = calculate_raster_stats(&vals);
        assert!((stats.mean - 0.3).abs() < 1e-4);
        assert!((stats.min - 0.1).abs() < 1e-4);
        assert!((stats.max - 0.5).abs() < 1e-4);
    }

    #[test]
    fn test_dem_slope_flat() {
        let flat = [100.0; 9];
        let slope = calculate_dem_slope_deg(&flat, 30.0);
        assert!((slope - 0.0).abs() < 1e-4);
    }
}
