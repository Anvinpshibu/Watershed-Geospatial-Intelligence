# Architecture & System Design: Watershed Geospatial Intelligence Platform

## 1. High-Level Architecture Overview

The system is designed as a **hybrid native desktop and modern web platform**, powered by a high-performance **Rust core (`watershed-core`)**, packaged as a **Tauri v2 application** for native desktop field operation, and deployable as a high-efficiency **web client**.

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        USER INTERFACE (UI)                             │
│   Vite + React 19 + TypeScript + Modern CSS + Interactive GIS Engine   │
├────────────────────────────────────────────────────────────────────────┤
│                 DUAL-MODE ADAPTER (tauriBridge.ts)                     │
│    (Auto-detects Tauri v2 desktop context vs browser/REST web context) │
├───────────────────────────────────┬────────────────────────────────────┤
│         TAURI DESKTOP (Native)    │           WEB / SERVER API         │
│   Tauri IPC Commands (Invoke)     │    FastAPI / WebAssembly Service   │
├───────────────────────────────────┴────────────────────────────────────┤
│                 RUST CORE ENGINE (`watershed-core`)                    │
│   ├── models: Strongly-typed schemas (PRD Appendix A Data Contract)    │
│   ├── exif: Zero-copy EXIF parsing & SHA-256 evidence hashing          │
│   ├── geo: Point-in-polygon raycasting, spatial R-tree, Haversine      │
│   ├── raster: Fast NDVI, NDWI, MNDWI calculations, DEM slope/aspect    │
│   ├── change: Multi-temporal difference detection & area stats         │
│   ├── fusion: Multimodal Evidence Fusion (Photo + Sat + DEM + Time)    │
│   ├── db: Offline SQLite/GeoPackage caching & rural sync queue         │
│   └── report: Automated DoLR executive & audit report generator        │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Why Rust & Tauri for Watershed Geospatial Intelligence?

### 2.1 Rust for Core Geospatial Intelligence
1. **Computational Speed**: Calculating spectral indices (NDVI, NDWI) and pixel-level change across satellite rasters requires processing millions of float values per scene. Rust's zero-cost abstractions, SIMD vectorization, and memory safety without garbage collection latency provide 10-50x speedups over pure interpreted Python or JavaScript.
2. **Cryptographic Chain of Custody**: Government watershed audits require verifiable evidence. Rust calculates fast SHA-256 digests of every uploaded field photo and generates tamper-evident provenance metadata.
3. **Robust Spatial Geometry**: Native geometry math (point-in-watershed raycasting, bounding box intersection, slope calculation from elevation matrices) runs with microsecond latency.
4. **Offline Rural Readiness**: Rural field officers in watershed blocks often operate with zero cellular connectivity. A native Rust core with embedded SQLite enables full offline ingestion, metadata extraction, validation, and queueing.

### 2.2 Tauri v2 for Desktop GIS Digital Twin
1. **Tiny Binary & Minimal Memory**: Unlike Electron which packages an entire Chromium + Node.js bundle (~150MB+), Tauri uses the OS native webview (WebKit on macOS, WebView2 on Windows) yielding lightweight binaries (~10-15MB) and ultra-low RAM usage.
2. **Direct Local File Access**: Desktop field analysts can load 10GB+ drone orthomosaics, shapefiles, and local GeoTIFFs directly from SD cards or local storage without browser memory ceilings or upload bottlenecks.
3. **Cross-Platform**: Compiles natively for macOS, Windows, and Linux.

---

## 3. Data Flow: Multimodal Evidence Fusion

The core innovation defined in the PRD (Section 23 & Appendix A) is converting isolated field photos into **Multimodal Spatial Evidence**:

```text
Field Photograph (JPG/PNG)
     │
     ▼
[Rust EXIF Engine] ──────────► Lat/Lon, Altitude, Heading, Timestamp, SHA-256
     │
     ▼
[Rust Spatial Index] ────────► Validates Point inside Watershed Boundary & Sub-basin
     │
     ▼
[Satellite Context] ─────────► Collocates Sentinel-2 / Landsat / SRISHTI-DRISHTI scene
     │                         Extracts baseline (2023) and current (2026) NDVI & NDWI
     ▼
[DEM Terrain Context] ───────► Queries Copernicus DEM 30m for Elevation & Slope
     │
     ▼
[AI Vision Interpretation] ──► Detects Check Dam / Farm Pond / Contour Bund (Confidence: 91%)
     │
     ▼
[Evidence Fusion Engine] ────► Synthesizes Official Spatial Evidence Record (JSON contract)
     │
     ▼
[Digital Twin GIS Map] ──────► Clickable Interactive Pin with Multimodal Card & Report
```

---

## 4. Security, Provenance & Privacy

1. **SHA-256 Hashing**: Every image uploaded receives an immutable SHA-256 digest at ingestion time to guarantee evidence integrity for DoLR audits.
2. **Coordinate Integrity**: The system never hallucinates or fabricates coordinates; missing GPS photos are explicitly marked as `UNLOCATED` and routed to manual placement.
3. **No Causal Overclaims**: In strict accordance with PRD Section 5 & 24, derived indices are reported as observed spatial indicators rather than unilateral proof of causal success.
