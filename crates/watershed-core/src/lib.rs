pub mod change;
pub mod exif;
pub mod fusion;
pub mod geo;
pub mod lulc;
pub mod models;
pub mod raster;
pub mod report;
pub mod risk;

pub use change::{evaluate_temporal_change, TemporalChangeAnalysis};
pub use exif::{compute_sha256, parse_image_metadata, ExtractedImageMetadata};
pub use fusion::fuse_spatial_evidence;
pub use geo::{
    distance_to_polyline_meters, haversine_distance_meters, initial_bearing_deg,
    is_valid_coordinate, validate_point_in_watershed,
};
pub use lulc::{calculate_lulc_distribution, classify_pixel_lulc, LandCoverClass, LulcDistribution};
pub use models::*;
pub use raster::{
    calculate_dem_slope_deg, calculate_raster_stats, classify_ndvi, compute_pixel_mndwi,
    compute_pixel_ndvi, compute_pixel_ndwi, compute_raster_ndvi, compute_raster_ndwi, RasterStats,
};
pub use report::ReportGenerator;
pub use risk::{evaluate_priority_zone, PriorityZoneAssessment, RiskLevel};
