# Watershed Geospatial Intelligence & Geo-Coded Image Analysis Platform

**Problem Statement ID:** 26015  
**Organization:** Ministry of Rural Development — Department of Land Resources (DoLR)  
**Architecture:** Rust High-Performance Core + Tauri v2 Desktop Engine + Vite/React Modern GIS Digital Twin  

---

## 1. Executive Summary

This platform implements an end-to-end geospatial intelligence system that transforms geo-coded field photography from static documentation into **cryptographically verified, spatially contextualized evidence** by fusing it with satellite Earth observations (Sentinel-2, Landsat, SRISHTI-DRISHTI 30m), DEM terrain analytics, and temporal change metrics.

### Key Capabilities
- **Rust Core Engine (`watershed-core`)**: Native EXIF extraction, SHA-256 evidence hashing, raycasting point-in-polygon containment, fast NDVI/NDWI/MNDWI raster math, Horn's DEM slope derivation, and Multimodal Spatial Evidence Fusion (PRD Appendix A).
- **Tauri v2 Desktop App (`src-tauri`)**: Cross-platform desktop application running natively on macOS, Windows, and Linux with access to local gigabyte-scale drone orthomosaics, offline GeoTIFFs, and local SQLite caching for offline rural field deployment.
- **Interactive GIS Digital Twin Client (`ui`)**: Glassmorphic dark UI, vector watershed boundary rendering, drainage stream network, continuous spectral index heatmaps, Before/After synchronized temporal split viewer, multimodal evidence inspector, and automated official DoLR monitoring reports.

---

## 2. Phased Development Roadmap

The platform is organized into actionable phases as documented in [docs/ROADMAP_PHASES.md](file:///Users/anvinpshibu/Documents/Projects-Araskova/Geo-spatial/docs/ROADMAP_PHASES.md):

| Phase | Component | Status | Deliverables |
| :--- | :--- | :--- | :--- |
| **Phase 0** | **System Architecture & Contracts** | **Completed** | Cargo workspace, PRD Appendix A data contracts, system design. |
| **Phase 1** | **Rust Geospatial Core (`watershed-core`)** | **Completed** | EXIF parser, SHA-256 digest, spatial math, raster spectral indices, Horn DEM slope, temporal differencing, evidence fusion, and automated unit test suite. |
| **Phase 2** | **Tauri v2 Desktop Integration (`src-tauri`)** | **Completed** | Tauri v2 desktop app, IPC commands for native metadata ingestion, spectral processing, evidence fusion, and markdown report compilation. |
| **Phase 3** | **Interactive GIS Digital Twin (`ui`)** | **Completed** | Vite + React + TypeScript web & desktop UI with layer controls (Satellite, NDVI, NDWI, DEM), animated top-layer Evidence Modal, and 2023 vs 2026 Split Viewer. |
| **Phase 4** | **Benchmark Pilot Dataset (`data`)** | **Completed** | Palakkad Western Ghats WS-001 watershed boundary, drainage streams, field observations, pre-computed indices, and dataset manifest. |
| **Phase 5** | **AI Vision & Advanced Sidecars** | *Upcoming* | Embedded YOLOv11 / SegFormer ONNX models and automated Copernicus STAC tile fetcher. |

---

## 3. Project Structure

```text
Geo-spatial/
├── Cargo.toml                     # Cargo workspace definition
├── crates/
│   └── watershed-core/            # High-performance Rust geospatial engine
│       ├── Cargo.toml
│       └── src/
│           ├── lib.rs
│           ├── models.rs          # Strongly-typed schemas (PRD Appendix A)
│           ├── exif.rs            # EXIF extraction & SHA-256 evidence hashing
│           ├── geo.rs             # Haversine distance, point-in-polygon raycasting
│           ├── raster.rs          # NDVI, NDWI, MNDWI, Horn DEM slope math
│           ├── change.rs          # Two-date temporal change detection
│           ├── fusion.rs          # Multimodal Spatial Evidence Fusion engine
│           └── report.rs          # Automated DoLR monitoring report generator
├── src-tauri/                     # Tauri v2 native desktop application
│   ├── Cargo.toml
│   ├── tauri.conf.json
│   ├── build.rs
│   └── src/
│       ├── main.rs
│       ├── lib.rs
│       └── commands.rs            # Tauri IPC command handlers
├── ui/                            # Modern GIS Digital Twin frontend
│   ├── package.json
│   ├── vite.config.ts
│   ├── index.html
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       ├── styles/index.css       # Glassmorphism & HSL design tokens
│       ├── components/
│       │   ├── Header.tsx         # DoLR brand & dual-mode engine status
│       │   ├── MapView.tsx        # Interactive GIS vector & raster canvas
│       │   ├── LayerControl.tsx   # GIS layer switcher & overlays
│       │   ├── SplitViewer.tsx    # Synchronized 2023 vs 2026 Before/After viewer
│       │   ├── EvidenceModal.tsx  # Top-layer animated multimodal evidence inspector
│       │   ├── TemporalSlider.tsx # 2021-2026 timeline scrubber
│       │   ├── AnalyticsPanel.tsx # KPIs, risk zones, and observations stream
│       │   ├── IngestionModal.tsx # Photo upload & EXIF verification
│       │   └── ReportModal.tsx    # Official DoLR report preview & export
│       ├── services/
│       │   ├── tauriBridge.ts     # Dual-mode bridge (Desktop IPC / Web engine)
│       │   └── mockData.ts        # Palakkad WS-001 benchmark dataset
│       └── types/watershed.ts     # TypeScript data contracts
├── data/
│   ├── pilot_kerala_ws001/        # GeoJSON boundaries, drainage & interventions
│   └── manifest.json              # Dataset provenance manifest (PRD Section 81)
├── docs/
│   ├── ROADMAP_PHASES.md          # Phased execution plan
│   └── ARCHITECTURE.md            # System architecture specification
└── README.md
```

---

## 4. How to Run

### 4.1 Running the Web GIS Digital Twin
```bash
cd ui
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

To build the optimized production web bundle:
```bash
cd ui
npm run build
```

### 4.2 Running the Native Desktop Application (Tauri v2)
Ensure you have Rust and Cargo installed:
```bash
# Run in development mode
npx @tauri-apps/cli dev

# Or build the native release desktop app
npx @tauri-apps/cli build
```

### 4.3 Running the Rust Core Test Suite
```bash
cargo test --package watershed-core
```
This executes all 12 unit tests verifying:
- Haversine metric distances and bearing calculations
- Point-in-polygon raycasting containment for watershed boundaries
- EXIF extraction and SHA-256 evidence hashing
- NDVI, NDWI, and MNDWI raster calculations
- Horn's DEM terrain slope algorithm
- Two-date temporal change differencing
- Multimodal Spatial Evidence Fusion conforming to PRD Appendix A
- Official DoLR report generation
