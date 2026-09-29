use crate::models::{GeoPoint, Polygon};

/// Earth's mean radius in meters (WGS84 spherical approximation)
const EARTH_RADIUS_METERS: f64 = 6_371_008.8;

/// Validate whether a coordinate is valid within WGS84 bounds
pub fn is_valid_coordinate(lat: f64, lon: f64) -> bool {
    lat >= -90.0 && lat <= 90.0 && lon >= -180.0 && lon <= 180.0 && !lat.is_nan() && !lon.is_nan()
}

/// Calculate the great-circle distance between two points in meters using the Haversine formula
pub fn haversine_distance_meters(p1: &GeoPoint, p2: &GeoPoint) -> f64 {
    let lat1_rad = p1.latitude.to_radians();
    let lon1_rad = p1.longitude.to_radians();
    let lat2_rad = p2.latitude.to_radians();
    let lon2_rad = p2.longitude.to_radians();

    let dlat = lat2_rad - lat1_rad;
    let dlon = lon2_rad - lon1_rad;

    let a = (dlat / 2.0).sin().powi(2)
        + lat1_rad.cos() * lat2_rad.cos() * (dlon / 2.0).sin().powi(2);
    let c = 2.0 * a.sqrt().atan2((1.0 - a).sqrt());

    EARTH_RADIUS_METERS * c
}

/// Calculate approximate bearing from point 1 to point 2 in degrees (0..360)
pub fn initial_bearing_deg(p1: &GeoPoint, p2: &GeoPoint) -> f64 {
    let lat1_rad = p1.latitude.to_radians();
    let lon1_rad = p1.longitude.to_radians();
    let lat2_rad = p2.latitude.to_radians();
    let lon2_rad = p2.longitude.to_radians();

    let dlon = lon2_rad - lon1_rad;

    let y = dlon.sin() * lat2_rad.cos();
    let x = lat1_rad.cos() * lat2_rad.sin() - lat1_rad.sin() * lat2_rad.cos() * dlon.cos();

    let brng = y.atan2(x).to_degrees();
    (brng + 360.0) % 360.0
}

/// Find the minimum distance from a point to a polyline (e.g. stream/drainage line) in meters
pub fn distance_to_polyline_meters(point: &GeoPoint, polyline: &[GeoPoint]) -> f64 {
    if polyline.is_empty() {
        return f64::MAX;
    }
    if polyline.len() == 1 {
        return haversine_distance_meters(point, &polyline[0]);
    }

    let mut min_distance = f64::MAX;
    for i in 0..polyline.len() - 1 {
        let seg_start = &polyline[i];
        let seg_end = &polyline[i + 1];
        let d = point_to_segment_distance(point, seg_start, seg_end);
        if d < min_distance {
            min_distance = d;
        }
    }
    min_distance
}

/// Helper: distance from point P to line segment AB in meters
fn point_to_segment_distance(p: &GeoPoint, a: &GeoPoint, b: &GeoPoint) -> f64 {
    // Project using planar approximation locally since segment is small
    let d_ab = haversine_distance_meters(a, b);
    if d_ab < 1e-6 {
        return haversine_distance_meters(p, a);
    }

    // Vectors in meters relative to A
    let dx = (b.longitude - a.longitude) * 111_320.0 * a.latitude.to_radians().cos();
    let dy = (b.latitude - a.latitude) * 110_540.0;

    let px = (p.longitude - a.longitude) * 111_320.0 * a.latitude.to_radians().cos();
    let py = (p.latitude - a.latitude) * 110_540.0;

    let segment_len_sq = dx * dx + dy * dy;
    let t = ((px * dx + py * dy) / segment_len_sq).clamp(0.0, 1.0);

    let proj_x = t * dx;
    let proj_y = t * dy;

    let diff_x = px - proj_x;
    let diff_y = py - proj_y;

    (diff_x * diff_x + diff_y * diff_y).sqrt()
}

/// Test whether an observation point falls within the given watershed polygon
pub fn validate_point_in_watershed(point: &GeoPoint, watershed_boundary: &Polygon) -> bool {
    watershed_boundary.contains_point(point)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_valid_coordinates() {
        assert!(is_valid_coordinate(10.5, 76.5));
        assert!(!is_valid_coordinate(95.0, 76.5));
        assert!(!is_valid_coordinate(10.5, 185.0));
    }

    #[test]
    fn test_haversine_distance() {
        // Palakkad to Coimbatore (~45km)
        let p1 = GeoPoint::new(10.7867, 76.6548);
        let p2 = GeoPoint::new(11.0168, 76.9558);
        let dist = haversine_distance_meters(&p1, &p2);
        assert!((dist - 41_500.0).abs() < 5_000.0);
    }

    #[test]
    fn test_point_in_polygon() {
        let polygon = Polygon {
            coordinates: vec![
                GeoPoint::new(10.0, 76.0),
                GeoPoint::new(11.0, 76.0),
                GeoPoint::new(11.0, 77.0),
                GeoPoint::new(10.0, 77.0),
            ],
        };

        let inside = GeoPoint::new(10.5, 76.5);
        let outside = GeoPoint::new(11.5, 76.5);

        assert!(polygon.contains_point(&inside));
        assert!(!polygon.contains_point(&outside));
    }
}
