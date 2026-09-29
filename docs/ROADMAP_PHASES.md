# Watershed Geospatial Intelligence Platform (WIP)
## Implementation Roadmap & Phased Execution Plan

**Problem Statement ID:** 26015  
**Target:** Ministry of Rural Development / Department of Land Resources (DoLR)  
**Architecture:** Rust High-Performance Core + Tauri v2 Desktop Engine + Vite/React Modern GIS Digital Twin

---

## Executive Overview

The Watershed Geospatial Intelligence Platform transforms geo-coded field photography from static documentation into verifiable, spatially contextualized evidence by fusing it with satellite Earth observations (Sentinel-2, Landsat, SRISHTI-DRISHTI 30m), DEM terrain analytics, and temporal change metrics.

To provide exceptional performance, offline field capability for rural India, and bulletproof data provenance, the platform combines:
1. **Rust Core Engine (`watershed-core`)**: Native EXIF extraction, SHA-256 cryptographic chain of custody, spatial R-tree indexing, raster index calculation (NDVI, NDWI, MNDWI), DEM slope/aspect analysis, and multimodal spatial evidence fusion.
2. **Tauri v2 Desktop Digital Twin (`src-tauri`)**: Cross-platform desktop application running natively on macOS, Windows, and Linux with access to local gigabyte-scale drone orthomosaics, offline GeoTIFFs, and local SQLite/GeoPackage caching.
3. **Modern Web & Desktop GIS Client (`ui`)**: Glassmorphic dark UI, interactive geospatial canvas, synchronized Before/After temporal comparison, multimodal evidence inspector, and automated DoLR audit reports.

---

## Phase Breakdown

### Phase 0: System Architecture & Foundation (Current)
- [x] PRD analysis & technology stack adaptation (Rust + Tauri + Vite/React + TypeScript).
- [x] Workspace monorepo setup: Cargo workspace (`watershed-core`, `src-tauri`) and UI (`ui/`).
- [x] Standardized data contracts (PRD Appendix A) for observations, interventions, raster products, and evidence fusion records.
- [x] Phase roadmap (`ROADMAP_PHASES.md`) and technical architecture specification (`ARCHITECTURE.md`).

### Phase 1: High-Performance Rust Core Engine (`watershed-core`)
- [x] **Data Models**: Strongly-typed structures for Projects, Watersheds, Observations, Interventions, RasterScenes, and Spatial Evidence Records.
- [x] **EXIF & Image Ingestion**: EXIF parser extracting Lat/Lon, altitude, heading, timestamp, camera make/model, plus SHA-256 cryptographic hashing for tamper-proof evidence.
- [x] **Spatial Mathematics**: Haversine distance, polygon point-in-watershed raycasting, bounding box spatial intersection, and coordinate validation.
- [x] **Remote Sensing Raster Engine**: Fast math for NDVI, NDWI, MNDWI, vegetation stress masking, and DEM slope gradient calculation.
- [x] **Temporal Change Detection**: Two-date pixel/zonal difference calculation ($\Delta\text{NDVI}$, water surface expansion/shrinkage, class transition matrix).
- [x] **Multimodal Evidence Fusion**: Algorithmic fusion of field observation + satellite index + terrain slope + historical delta into verifiable evidence.
- [x] **Automated Report Generator**: Markdown/HTML executive report compilation with cryptographic provenance and limitation disclaimers.
- [x] **Automated Tests**: Unit test suite validating EXIF parsing, spatial containment, raster math, and evidence fusion.

### Phase 2: Tauri v2 Desktop Integration (`src-tauri`)
- [x] Tauri v2 application configuration (`tauri.conf.json`).
- [x] Native IPC command handlers connecting UI to `watershed-core`:
  - `ingest_image_metadata`: Extract EXIF and SHA-256 hash natively.
  - `calculate_indices`: Compute NDVI / NDWI statistics.
  - `detect_temporal_change`: Compute before vs after delta.
  - `fuse_spatial_evidence`: Generate multimodal spatial evidence records.
  - `generate_watershed_report`: Create downloadable DoLR reports.
- [x] File dialogs for local GeoTIFF, Shapefile, and Drone image imports.

### Phase 3: Interactive GIS Digital Twin Interface (`ui`)
- [x] Modern design system: Glassmorphic dark palette, HSL tokens, Outfit/Inter typography, and smooth micro-animations.
- [x] Interactive GIS Map Canvas:
  - Base satellite and topographic tiles.
  - Pilot watershed polygon boundary & drainage stream networks.
  - Real-time layer switcher: True Color Satellite, NDVI vegetation heatmaps, NDWI water masks, DEM elevation/hillshade.
  - Interventions layer (Check dams, Farm ponds, Contour bunds, Percolation tanks).
  - Geo-coded field photo observation pins with cluster support.
- [x] Top-Layer Multimodal Evidence Inspector Modal (compliant with modern web standards and animated dialogs):
  - Field photo display with EXIF metadata badges (GPS, Altitude, Heading, SHA-256).
  - AI classification prediction with confidence score and visual detection box.
  - Satellite environmental context (NDVI, NDWI, 2023 vs 2026 delta).
  - Terrain hydrological context (Elevation, Slope, Drainage proximity).
- [x] Synchronized Before/After Split Viewer: Side-by-side comparative inspection of 2023 baseline vs 2026 current status.
- [x] Temporal Timeline Slider: Interactive scrubbing between monitoring epochs (2021–2026).
- [x] Image Ingestion & Offline Queue Simulator: Drag-and-drop photo upload with EXIF preview and offline sync status for rural deployment.
- [x] Automated Report Generator Modal: Instant interactive preview and download of official DoLR Watershed Intelligence Reports.

### Phase 4: Pilot Benchmark Dataset (`data/pilot_kerala_ws001`)
- [x] Realistic pilot Area of Interest (AOI): Palakkad / Western Ghats Watershed WS-001.
- [x] GeoJSON boundary files: Watershed boundary, drainage network, and 45+ interventions.
- [x] Curated geo-coded field photography metadata with check dams, farm ponds, and contour bunds.
- [x] Pre-computed satellite index statistics (2023 baseline vs 2026 post-intervention).
- [x] Machine-readable dataset manifest (`manifest.json`).

### Phase 5: AI Vision, Remote Sensing & REST Gateway (Completed)
- [x] Computer vision intervention detector (`services/vision/detector.py`) with bounding boxes, confidence scoring, and condition analysis.
- [x] STAC satellite imagery discovery client (`services/satellite/stac_client.py`) querying Sentinel-2 and Landsat scenes for AOI.
- [x] Land-Use / Land-Cover (LULC) rule-based classification module in Rust (`crates/watershed-core/src/lulc.rs`).
- [x] Priority & Risk assessment module in Rust (`crates/watershed-core/src/risk.rs`) computing erosion risk and water stress indices.
- [x] REST API gateway (`services/api/main.py`) providing endpoints for projects, watersheds, satellite search, and analytics.
