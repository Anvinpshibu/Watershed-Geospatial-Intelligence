use crate::models::{GeoPoint, IngestionStatus};
use chrono::{DateTime, NaiveDateTime, Utc};
use sha2::{Digest, Sha256};

/// Extracted image metadata from field photography
#[derive(Debug, Clone)]
pub struct ExtractedImageMetadata {
    pub sha256_hash: String,
    pub location: Option<GeoPoint>,
    pub timestamp: DateTime<Utc>,
    pub altitude_m: Option<f64>,
    pub heading_deg: Option<f64>,
    pub camera_make: Option<String>,
    pub camera_model: Option<String>,
    pub status: IngestionStatus,
}

/// Compute SHA-256 hash of a byte slice for forensic evidence integrity
pub fn compute_sha256(data: &[u8]) -> String {
    let mut hasher = Sha256::new();
    hasher.update(data);
    let result = hasher.finalize();
    format!("{:x}", result)
}

/// Parse image bytes and extract EXIF metadata if present
/// Supports standard JPEG APP1 Exif markers, TIFF byte order, and GPS sub-IFDs
pub fn parse_image_metadata(data: &[u8]) -> ExtractedImageMetadata {
    let sha256_hash = compute_sha256(data);
    
    // Check if this is a valid JPEG (SOI marker 0xFFD8)
    if data.len() > 4 && data[0] == 0xFF && data[1] == 0xD8 {
        if let Some(parsed) = extract_jpeg_exif(data) {
            let is_located = parsed.location.is_some();
            return ExtractedImageMetadata {
                sha256_hash,
                location: parsed.location,
                timestamp: parsed.timestamp.unwrap_or_else(Utc::now),
                altitude_m: parsed.altitude_m,
                heading_deg: parsed.heading_deg,
                camera_make: parsed.camera_make,
                camera_model: parsed.camera_model,
                status: if is_located {
                    IngestionStatus::Located
                } else {
                    IngestionStatus::Unlocated
                },
            };
        }
    }

    // Default when no EXIF or unlocated
    ExtractedImageMetadata {
        sha256_hash,
        location: None,
        timestamp: Utc::now(),
        altitude_m: None,
        heading_deg: None,
        camera_make: None,
        camera_model: None,
        status: IngestionStatus::Unlocated,
    }
}

struct PartialExif {
    location: Option<GeoPoint>,
    timestamp: Option<DateTime<Utc>>,
    altitude_m: Option<f64>,
    heading_deg: Option<f64>,
    camera_make: Option<String>,
    camera_model: Option<String>,
}

fn extract_jpeg_exif(data: &[u8]) -> Option<PartialExif> {
    let mut offset = 2;
    while offset + 4 <= data.len() {
        if data[offset] != 0xFF {
            break;
        }
        let marker = data[offset + 1];
        if marker == 0xDA || marker == 0xD9 {
            // Start of scan or end of image
            break;
        }
        let length = u16::from_be_bytes([data[offset + 2], data[offset + 3]]) as usize;
        if length < 2 || offset + 2 + length > data.len() {
            break;
        }

        // APP1 marker 0xE1 (EXIF)
        if marker == 0xE1 && length >= 8 {
            let app1_data = &data[offset + 4..offset + 2 + length];
            if app1_data.starts_with(b"Exif\0\0") {
                return parse_tiff_exif(&app1_data[6..]);
            }
        }
        offset += 2 + length;
    }
    None
}

fn parse_tiff_exif(tiff: &[u8]) -> Option<PartialExif> {
    if tiff.len() < 8 {
        return None;
    }

    let is_little_endian = match &tiff[0..2] {
        b"II" => true,
        b"MM" => false,
        _ => return None,
    };

    let read_u16 = |buf: &[u8], pos: usize| -> Option<u16> {
        if pos + 2 > buf.len() {
            None
        } else if is_little_endian {
            Some(u16::from_le_bytes([buf[pos], buf[pos + 1]]))
        } else {
            Some(u16::from_be_bytes([buf[pos], buf[pos + 1]]))
        }
    };

    let read_u32 = |buf: &[u8], pos: usize| -> Option<u32> {
        if pos + 4 > buf.len() {
            None
        } else if is_little_endian {
            Some(u32::from_le_bytes([
                buf[pos],
                buf[pos + 1],
                buf[pos + 2],
                buf[pos + 3],
            ]))
        } else {
            Some(u32::from_be_bytes([
                buf[pos],
                buf[pos + 1],
                buf[pos + 2],
                buf[pos + 3],
            ]))
        }
    };

    let ifd0_offset = read_u32(tiff, 4)? as usize;
    if ifd0_offset + 2 > tiff.len() {
        return None;
    }

    let num_entries = read_u16(tiff, ifd0_offset)? as usize;
    let mut gps_ifd_offset = None;
    let mut camera_make = None;
    let mut camera_model = None;
    let mut timestamp_str = None;

    let mut entry_pos = ifd0_offset + 2;
    for _ in 0..num_entries {
        if entry_pos + 12 > tiff.len() {
            break;
        }
        let tag = read_u16(tiff, entry_pos)?;
        let count = read_u32(tiff, entry_pos + 4)? as usize;
        let value_offset = read_u32(tiff, entry_pos + 8)?;

        match tag {
            0x010F => {
                // Make
                if let Some(s) = read_ascii_string(tiff, value_offset as usize, count) {
                    camera_make = Some(s);
                }
            }
            0x0110 => {
                // Model
                if let Some(s) = read_ascii_string(tiff, value_offset as usize, count) {
                    camera_model = Some(s);
                }
            }
            0x0132 | 0x9003 => {
                // DateTime or DateTimeOriginal
                if let Some(s) = read_ascii_string(tiff, value_offset as usize, count) {
                    timestamp_str = Some(s);
                }
            }
            0x8825 => {
                // GPS IFD Pointer
                gps_ifd_offset = Some(value_offset as usize);
            }
            _ => {}
        }
        entry_pos += 12;
    }

    let mut location = None;
    let mut altitude_m = None;
    let mut heading_deg = None;

    if let Some(gps_offset) = gps_ifd_offset {
        if gps_offset + 2 <= tiff.len() {
            let gps_entries = read_u16(tiff, gps_offset).unwrap_or(0) as usize;
            let mut gps_entry_pos = gps_offset + 2;

            let mut lat_ref = 'N';
            let mut lon_ref = 'E';
            let mut raw_lat = None;
            let mut raw_lon = None;

            for _ in 0..gps_entries {
                if gps_entry_pos + 12 > tiff.len() {
                    break;
                }
                let tag = read_u16(tiff, gps_entry_pos).unwrap_or(0);
                let value_offset = read_u32(tiff, gps_entry_pos + 8).unwrap_or(0) as usize;

                match tag {
                    0x0001 => {
                        // GPSLatitudeRef
                        if gps_entry_pos + 8 < tiff.len() {
                            lat_ref = tiff[gps_entry_pos + 8] as char;
                        }
                    }
                    0x0002 => {
                        // GPSLatitude (3 rationals)
                        raw_lat = read_rational_triplet(tiff, value_offset, is_little_endian);
                    }
                    0x0003 => {
                        // GPSLongitudeRef
                        if gps_entry_pos + 8 < tiff.len() {
                            lon_ref = tiff[gps_entry_pos + 8] as char;
                        }
                    }
                    0x0004 => {
                        // GPSLongitude (3 rationals)
                        raw_lon = read_rational_triplet(tiff, value_offset, is_little_endian);
                    }
                    0x0006 => {
                        // GPSAltitude
                        if let Some(alt) = read_single_rational(tiff, value_offset, is_little_endian) {
                            altitude_m = Some(alt);
                        }
                    }
                    0x0011 => {
                        // GPSImgDirection (Heading)
                        if let Some(h) = read_single_rational(tiff, value_offset, is_little_endian) {
                            heading_deg = Some(h);
                        }
                    }
                    _ => {}
                }
                gps_entry_pos += 12;
            }

            if let (Some(dms_lat), Some(dms_lon)) = (raw_lat, raw_lon) {
                let mut lat = dms_lat[0] + dms_lat[1] / 60.0 + dms_lat[2] / 3600.0;
                let mut lon = dms_lon[0] + dms_lon[1] / 60.0 + dms_lon[2] / 3600.0;

                if lat_ref == 'S' || lat_ref == 's' {
                    lat = -lat;
                }
                if lon_ref == 'W' || lon_ref == 'w' {
                    lon = -lon;
                }

                location = Some(GeoPoint {
                    latitude: lat,
                    longitude: lon,
                    altitude_m,
                });
            }
        }
    }

    let timestamp = timestamp_str.and_then(|s| {
        // Standard EXIF format: "YYYY:MM:DD HH:MM:SS"
        NaiveDateTime::parse_from_str(s.trim(), "%Y:%m:%d %H:%M:%S")
            .ok()
            .map(|ndt| DateTime::<Utc>::from_naive_utc_and_offset(ndt, Utc))
    });

    Some(PartialExif {
        location,
        timestamp,
        altitude_m,
        heading_deg,
        camera_make,
        camera_model,
    })
}

fn read_ascii_string(tiff: &[u8], offset: usize, count: usize) -> Option<String> {
    if offset + count <= tiff.len() {
        let slice = &tiff[offset..offset + count];
        let trimmed = if let Some(null_pos) = slice.iter().position(|&b| b == 0) {
            &slice[..null_pos]
        } else {
            slice
        };
        String::from_utf8(trimmed.to_vec()).ok()
    } else {
        None
    }
}

fn read_rational_triplet(tiff: &[u8], offset: usize, is_le: bool) -> Option<[f64; 3]> {
    if offset + 24 > tiff.len() {
        return None;
    }
    let mut result = [0.0; 3];
    for i in 0..3 {
        let pos = offset + i * 8;
        let num = if is_le {
            u32::from_le_bytes([tiff[pos], tiff[pos + 1], tiff[pos + 2], tiff[pos + 3]])
        } else {
            u32::from_be_bytes([tiff[pos], tiff[pos + 1], tiff[pos + 2], tiff[pos + 3]])
        } as f64;
        let den = if is_le {
            u32::from_le_bytes([tiff[pos + 4], tiff[pos + 5], tiff[pos + 6], tiff[pos + 7]])
        } else {
            u32::from_be_bytes([tiff[pos + 4], tiff[pos + 5], tiff[pos + 6], tiff[pos + 7]])
        } as f64;

        if den == 0.0 {
            result[i] = 0.0;
        } else {
            result[i] = num / den;
        }
    }
    Some(result)
}

fn read_single_rational(tiff: &[u8], offset: usize, is_le: bool) -> Option<f64> {
    if offset + 8 > tiff.len() {
        return None;
    }
    let num = if is_le {
        u32::from_le_bytes([tiff[offset], tiff[offset + 1], tiff[offset + 2], tiff[offset + 3]])
    } else {
        u32::from_be_bytes([tiff[offset], tiff[offset + 1], tiff[offset + 2], tiff[offset + 3]])
    } as f64;
    let den = if is_le {
        u32::from_le_bytes([tiff[offset + 4], tiff[offset + 5], tiff[offset + 6], tiff[offset + 7]])
    } else {
        u32::from_be_bytes([tiff[offset + 4], tiff[offset + 5], tiff[offset + 6], tiff[offset + 7]])
    } as f64;

    if den == 0.0 {
        Some(0.0)
    } else {
        Some(num / den)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_sha256_computation() {
        let sample = b"Watershed Geospatial Intelligence DoLR 2026";
        let hash = compute_sha256(sample);
        assert_eq!(hash.len(), 64);
    }

    #[test]
    fn test_unlocated_fallback() {
        let dummy = vec![0u8; 100];
        let meta = parse_image_metadata(&dummy);
        assert_eq!(meta.status, IngestionStatus::Unlocated);
        assert!(meta.location.is_none());
    }

    #[test]
    fn test_real_jpeg_exif_extraction() {
        use std::path::Path;
        let test_path = Path::new("../../data/field_images/CKD_Manikkallu_Kerala_01.jpg");
        if test_path.exists() {
            let data = std::fs::read(test_path).expect("Failed to read actual JPEG file");
            let meta = parse_image_metadata(&data);

            assert_eq!(meta.status, IngestionStatus::Located);
            assert!(meta.location.is_some(), "Location must be present from real EXIF");
            
            let loc = meta.location.unwrap();
            // Expected ~10.7872 N, 76.6691 E
            assert!((loc.latitude - 10.7872).abs() < 0.001, "Latitude mismatch: {}", loc.latitude);
            assert!((loc.longitude - 76.6691).abs() < 0.001, "Longitude mismatch: {}", loc.longitude);
            
            assert_eq!(meta.sha256_hash, "123aebff4fa7ee77a6f7d05541dc96f8ca046ca51e08f33bc8562c6e224bc87d");
            assert_eq!(meta.camera_make.as_deref(), Some("Google"));
            assert!(meta.altitude_m.is_some());
            assert!((meta.altitude_m.unwrap() - 184.2).abs() < 0.1);
        }
    }
}
