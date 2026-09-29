# PRD --- Watershed Geospatial Intelligence & Geo-Coded Image Analysis Platform

**Problem Statement ID:** 26015\
**Problem Statement:** Application of Geospatial Techniques for
visualization and analysis to interpret Geo-Coded Images to enhance
Watershed Development Outcomes\
**Organization:** Ministry of Rural Development\
**Department:** Department of Land Resources (DoLR)\
**Category:** Software\
**Theme:** Agriculture, FoodTech & Rural Development\
**Document Type:** Product Requirements Document (PRD)\
**Version:** 1.0\
**Status:** Implementation Baseline\
**Target:** Smart India Hackathon / research-grade prototype

------------------------------------------------------------------------

# 1. Executive Summary

## 1.1 Product

The proposed product is a **Watershed Geospatial Intelligence &
Monitoring Platform** that integrates geo-coded field photographs, drone
imagery, satellite observations, terrain data, watershed boundaries,
thematic layers, and AI-based image interpretation into one spatial
decision-support system.

The system is not a single AI model. It is an end-to-end geospatial
analytics platform with several analytical engines:

1.  Geo-coded image ingestion and interpretation.
2.  Satellite imagery processing.
3.  Vegetation and water-index generation.
4.  Land-use/land-cover analysis.
5.  Watershed and drainage analysis.
6.  Watershed-intervention detection and inventory.
7.  Temporal change detection.
8.  Field-evidence and satellite-evidence fusion.
9.  Risk/anomaly analysis.
10. Watershed intervention outcome assessment.
11. Interactive GIS visualization.
12. Automated evidence/report generation.

The central product idea is:

> **Convert geo-coded field photographs from documentation into spatial
> evidence by linking them with satellite-derived, terrain-derived and
> temporal environmental indicators.**

The platform should help planners and administrators answer:

-   Where are watershed interventions located?
-   What does the field evidence show?
-   What does satellite data show around those locations?
-   How has vegetation, water or land cover changed?
-   What areas show degradation or improvement?
-   Are interventions spatially aligned with watershed needs?
-   What evidence supports the observed change?
-   What should be inspected in the field next?

------------------------------------------------------------------------

# 2. Problem Statement Context

Watershed development is important for sustainable management of land,
water and natural resources, especially in rural and semi-arid regions
of India.

Existing monitoring workflows can be:

-   manual,
-   fragmented,
-   field-report dependent,
-   difficult to compare spatially,
-   weak in temporal change analysis,
-   disconnected from satellite observations,
-   and limited in converting geo-coded photographs into analytical
    evidence.

Geo-coded photographs are frequently used as documentation rather than
as a structured geospatial dataset.

The proposed system addresses this gap by combining:

**Geo-coded imagery + satellite data + GIS + remote sensing + thematic
mapping + AI + temporal analysis**

into a standardized watershed monitoring framework.

The problem statement specifically identifies the opportunity to use
**SRISHTI-DRISHTI 30 m satellite data** as a source for consistent
spatial analysis. The implementation should therefore support
SRISHTI-DRISHTI as a first-class data source when organizer/department
access is provided, while using openly available satellite datasets for
development and validation.

------------------------------------------------------------------------

# 3. Product Vision

## 3.1 Vision Statement

Build a scalable geospatial evidence platform that transforms field
photographs and Earth-observation data into interpretable, spatially
validated watershed intelligence.

## 3.2 Product Principle

The platform should move the workflow from:

> **Photo → Documentation**

to:

> **Photo → Geolocation → Spatial Context → Satellite Evidence → Change
> Analysis → Intervention Assessment → Decision Support**

------------------------------------------------------------------------

# 4. Goals

## 4.1 Primary Goals

### G1 --- Integrate geo-coded images

Allow users to upload or ingest geo-coded images and automatically
extract:

-   latitude,
-   longitude,
-   timestamp,
-   altitude where available,
-   heading where available,
-   camera/device metadata where available,
-   image quality information.

### G2 --- Integrate satellite observations

Support satellite imagery for:

-   vegetation analysis,
-   water detection,
-   land-use/land-cover analysis,
-   temporal change detection,
-   intervention-context analysis.

### G3 --- Create an interactive GIS environment

Provide layers for:

-   watershed boundaries,
-   sub-watersheds,
-   drainage,
-   elevation,
-   satellite imagery,
-   NDVI,
-   NDWI/MNDWI,
-   land cover,
-   intervention points,
-   geo-coded photographs,
-   drone imagery,
-   risk zones,
-   detected changes.

### G4 --- Interpret geo-coded images

Use computer vision to classify/detect relevant watershed features such
as:

-   check dams,
-   farm ponds,
-   contour bunds,
-   drainage structures,
-   water bodies,
-   vegetation,
-   barren/degraded land,
-   erosion indicators,
-   other intervention categories defined by the final dataset.

### G5 --- Measure temporal change

Compare imagery from two or more dates to identify:

-   vegetation change,
-   water-area change,
-   land-cover change,
-   degradation,
-   intervention-area changes.

### G6 --- Support scientific decision-making

Produce evidence-backed summaries rather than relying on a single AI
score.

### G7 --- Produce standardized reports

Generate a watershed/intervention report containing:

-   maps,
-   statistics,
-   photographs,
-   satellite evidence,
-   temporal comparisons,
-   detected interventions,
-   change metrics,
-   confidence,
-   data provenance.

------------------------------------------------------------------------

# 5. Non-Goals

The MVP will not attempt to:

-   replace official government watershed evaluation procedures;
-   declare an intervention officially successful/failed;
-   replace field officers;
-   provide legal or regulatory certification;
-   guarantee causal attribution between an intervention and
    environmental change;
-   perform nationwide continuous satellite processing;
-   train a massive foundation model from scratch;
-   treat AI predictions as ground truth;
-   infer unsupported socioeconomic outcomes from imagery.

Any prototype index must be explicitly described as an analytical aid,
not an official government rating.

------------------------------------------------------------------------

# 6. Target Users

## 6.1 Primary Users

### District/State watershed planners

Need:

-   spatial overview,
-   intervention inventory,
-   change maps,
-   reports.

### Field officers

Need:

-   map-based intervention records,
-   geo-coded photographs,
-   inspection history,
-   areas requiring verification.

### Program administrators

Need:

-   project monitoring,
-   before/after evidence,
-   standardized reports,
-   intervention coverage.

### GIS/remote-sensing analysts

Need:

-   satellite layers,
-   raster analytics,
-   spatial queries,
-   exportable datasets.

### Researchers

Need:

-   reproducible data,
-   model outputs,
-   temporal observations,
-   validation metrics.

------------------------------------------------------------------------

# 7. Core Product Concept

The system has six major layers:

``` text
┌──────────────────────────────────────────────────────────────┐
│                    USER / DASHBOARD                         │
├──────────────────────────────────────────────────────────────┤
│                    GIS / DIGITAL TWIN                       │
├──────────────────────────────────────────────────────────────┤
│          ANALYTICS / AI / CHANGE DETECTION                  │
├──────────────────────────────────────────────────────────────┤
│        SATELLITE / TERRAIN / FIELD DATA FUSION              │
├──────────────────────────────────────────────────────────────┤
│               DATA INGESTION & PROCESSING                   │
├──────────────────────────────────────────────────────────────┤
│             DATA SOURCES / EXTERNAL DATASETS                │
└──────────────────────────────────────────────────────────────┘
```

------------------------------------------------------------------------

# 8. Functional Requirements

## FR-001 --- User Authentication

The platform shall support role-based access.

Roles:

-   Administrator
-   GIS Analyst
-   Field Officer
-   Researcher
-   Viewer

### Requirements

-   Login/logout.
-   Role-based permissions.
-   Dataset access control.
-   Project/watershed access control.
-   Audit logging.

------------------------------------------------------------------------

# 9. FR-002 --- Project and Watershed Management

Users shall be able to create/select a monitoring project.

Example:

``` text
Project:
Kerala Watershed Pilot

Region:
District → Block → Panchayat

Watershed:
WS-001

Monitoring period:
2023–2026
```

The system shall support:

-   watershed polygon upload,
-   GeoJSON,
-   Shapefile,
-   KML/KMZ where supported,
-   selection from an available watershed layer.

------------------------------------------------------------------------

# 10. FR-003 --- Geo-Coded Image Ingestion

## Input

Supported:

-   JPG/JPEG
-   PNG
-   TIFF where appropriate
-   drone imagery formats that can be converted to supported raster
    formats.

### Metadata extraction

Extract EXIF when available:

``` json
{
  "latitude": 10.12345,
  "longitude": 76.12345,
  "timestamp": "2026-08-21T10:32:00",
  "altitude": 120.5,
  "heading": 82.3,
  "camera": "device metadata",
  "file_hash": "sha256..."
}
```

### If GPS metadata is absent

The system shall:

-   mark the image as unlocated;
-   allow manual placement;
-   allow bulk CSV metadata import;
-   retain the original metadata state.

The system must never fabricate coordinates.

------------------------------------------------------------------------

# 11. FR-004 --- Geo-Coded Image Map

Every located image shall become a spatial feature.

Example:

``` text
📷 Check Dam
10.1234, 76.1234
21-Aug-2026
```

Clicking the point opens:

-   photograph,
-   metadata,
-   detected objects,
-   satellite context,
-   nearby interventions,
-   vegetation index,
-   water index,
-   elevation,
-   historical observations.

------------------------------------------------------------------------

# 12. FR-005 --- Satellite Data Ingestion

The platform shall support:

### Primary official source

**SRISHTI-DRISHTI**

Target resolution specified in the problem statement:

**30 m**

This should be used when official access/data is provided.

### Development/validation sources

-   Sentinel-2
-   Landsat Collection 2
-   Harmonized Landsat and Sentinel-2 where suitable
-   other open Earth-observation sources approved for the project.

------------------------------------------------------------------------

# 13. FR-006 --- Satellite Processing

For each Area of Interest (AOI), the system shall support:

1.  Data discovery.
2.  Cloud filtering.
3.  Spatial clipping.
4.  Reprojection.
5.  Resampling where required.
6.  Band alignment.
7.  Scaling/normalization.
8.  Raster tiling.
9.  Index generation.
10. Temporal compositing.
11. Caching.

------------------------------------------------------------------------

# 14. FR-007 --- Vegetation Analysis

The platform shall calculate NDVI.

Formula:

``` text
NDVI = (NIR - RED) / (NIR + RED)
```

Outputs:

-   raster map,
-   average NDVI,
-   minimum,
-   maximum,
-   percentile statistics,
-   area by NDVI class,
-   temporal NDVI graph.

Example:

``` text
Watershed NDVI

2023: 0.41
2024: 0.46
2025: 0.52
2026: 0.55
```

The system must distinguish observed index change from causal claims.

------------------------------------------------------------------------

# 15. FR-008 --- Water Analysis

Support:

### NDWI

``` text
NDWI = (GREEN - NIR) / (GREEN + NIR)
```

### MNDWI

Where appropriate:

``` text
MNDWI = (GREEN - SWIR) / (GREEN + SWIR)
```

Outputs:

-   water masks,
-   water-body polygons,
-   estimated area,
-   temporal change,
-   nearby intervention relationships.

Example:

``` text
Water body:

2023 → 2.1 ha
2024 → 2.8 ha
2025 → 3.5 ha
2026 → 3.7 ha
```

------------------------------------------------------------------------

# 16. FR-009 --- Land-Use/Land-Cover Analysis

The system shall provide a configurable LULC classification.

Initial classes:

-   Water
-   Forest/Tree Cover
-   Agriculture
-   Grass/Scrub
-   Barren/Degraded
-   Built-up
-   Wetland where supported
-   Other/Unknown

The model should produce:

``` text
Input:
Satellite image

Output:
Class map + confidence map
```

------------------------------------------------------------------------

# 17. FR-010 --- Terrain Analysis

Use a DEM to derive:

-   elevation,
-   slope,
-   aspect,
-   flow direction,
-   flow accumulation,
-   drainage,
-   catchment,
-   terrain roughness where useful.

Terrain layers shall be queryable from the GIS interface.

------------------------------------------------------------------------

# 18. FR-011 --- Drainage Analysis

The platform shall support:

-   stream extraction,
-   drainage network visualization,
-   flow accumulation,
-   watershed/sub-watershed delineation,
-   intervention proximity to drainage,
-   potential drainage-risk zones.

------------------------------------------------------------------------

# 19. FR-012 --- Watershed Intervention Inventory

The platform shall represent intervention assets as spatial objects.

Initial categories:

-   Check Dam
-   Farm Pond
-   Contour Bund
-   Percolation Tank
-   Water Harvesting Structure
-   Drainage Treatment
-   Afforestation/Plantation
-   Other

Each intervention record:

``` json
{
  "id": "INT-0017",
  "type": "check_dam",
  "latitude": 10.123,
  "longitude": 76.456,
  "date": "2026-08-21",
  "source": "field_photo",
  "confidence": 0.91
}
```

------------------------------------------------------------------------

# 20. FR-013 --- Computer Vision Engine

The computer vision system should be modular.

## Phase 1

Use pretrained detection/segmentation models and adapt them to the
watershed classes.

Possible architectures:

-   YOLO family for object detection,
-   SegFormer,
-   U-Net,
-   DeepLab,
-   Mask R-CNN where instance segmentation is required.

The exact model shall be selected after dataset inspection.

## Inputs

-   geo-coded field photographs,
-   drone RGB imagery,
-   satellite imagery where suitable.

## Outputs

-   object class,
-   bounding box/mask,
-   confidence,
-   model version,
-   inference timestamp.

------------------------------------------------------------------------

# 21. FR-014 --- Field Image Condition Analysis

Where the dataset supports it, classify visible conditions:

-   intact,
-   damaged,
-   degraded,
-   water present,
-   vegetation present,
-   erosion visible,
-   unknown.

The system must separate:

**"not detected"**

from:

**"not present."**

A failure to observe an object is not proof of absence.

------------------------------------------------------------------------

# 22. FR-015 --- Change Detection

The platform shall support two-date and multi-date comparison.

Inputs:

``` text
T1 imagery
T2 imagery
```

Outputs:

``` text
Change Map
+
Change Statistics
+
Affected Area
+
Confidence
```

Example:

``` text
Vegetation:
+14.3%

Water:
+8.1%

Barren land:
-5.4%
```

Possible methods:

### Baseline

Index difference:

``` text
ΔNDVI = NDVI(T2) - NDVI(T1)
```

### Advanced

-   image differencing,
-   segmentation comparison,
-   Siamese networks,
-   temporal CNN,
-   transformer-based change detection.

The baseline shall be implemented before advanced models.

------------------------------------------------------------------------

# 23. FR-016 --- Spatial Evidence Fusion

This is a core research feature.

For each geo-coded field image, generate a spatial evidence record.

Example:

``` text
FIELD OBSERVATION
        +
SATELLITE CONTEXT
        +
TERRAIN CONTEXT
        +
TEMPORAL CHANGE
        ↓
SPATIAL EVIDENCE RECORD
```

Example:

``` json
{
  "observation_id": "OBS-017",
  "location": [76.123, 10.456],
  "field_class": "check_dam",
  "field_confidence": 0.93,
  "ndvi_before": 0.32,
  "ndvi_after": 0.48,
  "ndvi_change": 0.16,
  "water_area_before_ha": 1.2,
  "water_area_after_ha": 2.1,
  "elevation_m": 212,
  "slope_deg": 7.2,
  "evidence_quality": "high"
}
```

------------------------------------------------------------------------

# 24. FR-017 --- Intervention Impact Analytics

The system may provide a prototype analytical index based on measurable
indicators.

Possible indicators:

-   vegetation change,
-   water-area change,
-   land-cover change,
-   erosion indicator change,
-   intervention condition,
-   spatial alignment,
-   observation confidence.

Example:

``` text
Intervention Evidence Summary

Vegetation Change       +16%
Water Area Change       +31%
Field Condition         Intact
Satellite Evidence     Consistent
Observation Confidence  High
```

The platform shall not claim that these metrics prove causality.

------------------------------------------------------------------------

# 25. FR-018 --- Risk / Priority Mapping

Create analytical priority layers for:

-   erosion risk,
-   vegetation stress,
-   water scarcity indicators,
-   degraded land,
-   intervention gaps,
-   anomalous change.

Potential inputs:

``` text
Slope
+
Elevation
+
NDVI
+
NDWI
+
Land Cover
+
Drainage
+
Rainfall
+
Historical Change
```

A first version may use a transparent weighted scoring model.

Later versions may use supervised ML.

------------------------------------------------------------------------

# 26. FR-019 --- GIS Visualization

The GIS interface shall support:

### Basemap

-   satellite,
-   terrain,
-   street/topographic where licensed.

### Overlays

-   watershed boundary,
-   sub-watershed,
-   drainage,
-   DEM,
-   NDVI,
-   NDWI,
-   LULC,
-   intervention points,
-   geo-coded photos,
-   drone orthomosaic,
-   risk,
-   change maps.

### Controls

-   opacity,
-   legend,
-   date,
-   layer toggle,
-   map search,
-   AOI selection,
-   spatial filter.

------------------------------------------------------------------------

# 27. FR-020 --- Temporal Slider

Users shall be able to select:

``` text
2019 ── 2020 ── 2021 ── 2022 ── 2023 ── 2024 ── 2025 ── 2026
```

and see the available satellite/field observations.

------------------------------------------------------------------------

# 28. FR-021 --- Before/After Viewer

Provide synchronized comparison:

``` text
┌───────────────────┬───────────────────┐
│ BEFORE            │ AFTER             │
│                   │                   │
│ Satellite         │ Satellite         │
│ NDVI              │ NDVI              │
│ Water             │ Water             │
│ Field photo       │ Field photo       │
└───────────────────┴───────────────────┘
```

------------------------------------------------------------------------

# 29. FR-022 --- Automated Report Generation

Reports shall contain:

## Executive Summary

-   watershed,
-   period,
-   total area,
-   number of interventions,
-   observations.

## Environmental indicators

-   NDVI,
-   NDWI,
-   water area,
-   land cover,
-   terrain.

## Intervention analysis

-   intervention count,
-   locations,
-   types,
-   field evidence.

## Change analysis

-   before/after maps,
-   statistics,
-   charts.

## Confidence and limitations

Every AI-derived section shall include:

-   model version,
-   confidence,
-   source,
-   timestamp,
-   known limitations.

------------------------------------------------------------------------

# 30. Data Sources and Dataset Plan

## 30.1 Problem-Statement Dataset

The problem statement supplied by the user references:

**Additional Information:**

Google Drive folder:

`https://drive.google.com/drive/folders/1ibmzWpl_nK7aBhQurs22R9kqh9fPAQwC`

This resource should be treated as the first dataset/resource to
inspect.

### Important implementation rule

Do not assume that the Drive contains a complete public ML dataset until
it has been inspected.

The ingestion pipeline must therefore be designed to support:

-   organizer-provided imagery,
-   organizer-provided metadata,
-   CSV/JSON metadata,
-   GeoJSON,
-   raster datasets,
-   shapefiles,
-   team-collected imagery.

------------------------------------------------------------------------

# 31. Satellite Dataset Matrix

  --------------------------------------------------------------------------------------------------
  Dataset           Primary use                    Resolution Availability             MVP
  ----------------- ----------------------- ----------------- ------------------------ -------------
  SRISHTI-DRISHTI   Official                30 m stated in PS Organizer/authorized     Required
                    problem-specific                          access                   target
                    satellite analysis                                                 

  Sentinel-2 L2A    Vegetation/water/LULC          10/20/60 m Open/free                Yes

  Landsat           Long-term change / 30 m              30 m Open/public              Yes
  Collection 2 L2                                                                      

  HLS v2            Harmonized Landsat +                 30 m Open                     Optional
                    Sentinel-2                                                         

  Copernicus DEM    Terrain                              30 m Access-controlled/free   Yes if
  GLO-30                                                      registration categories  accessible

  Copernicus DEM    Terrain fallback                     90 m Open/access categories   Fallback
  GLO-90                                                                               
  --------------------------------------------------------------------------------------------------

Sentinel-2 Level-2A provides atmospherically corrected surface
reflectance and scene-classification outputs at 10 m, 20 m and 60 m
depending on band. Sentinel-2 data products are systematically available
free of charge.

Landsat Collection 2 Level-2 Surface Reflectance products are globally
available at 30 m, with products spanning multiple Landsat missions and
decades.

NASA/USGS Harmonized Landsat and Sentinel-2 (HLS) v2 provides harmonized
30 m surface reflectance and global coverage except Antarctica, making
it a useful optional source when consistent multi-sensor time series are
required.

Copernicus DEM GLO-30 provides global 30 m elevation coverage. Access
requirements should be checked during implementation because Copernicus
changed some 30 m service access rules in 2026.

------------------------------------------------------------------------

# 32. Sentinel-2 Dataset Specification

## Recommended product

Sentinel-2 Level-2A Surface Reflectance.

### Useful bands

  Band         Approx. resolution Use
  ---------- -------------------- ------------------
  B2 Blue                    10 m visible
  B3 Green                   10 m water/vegetation
  B4 Red                     10 m vegetation
  B8 NIR                     10 m vegetation
  B11 SWIR                   20 m water/soil
  B12 SWIR                   20 m water/soil

### Derived products

-   NDVI
-   NDWI
-   MNDWI
-   vegetation anomaly
-   water mask
-   RGB composite
-   false-color composite.

------------------------------------------------------------------------

# 33. Landsat Dataset Specification

Recommended:

**Landsat Collection 2 Level-2 Surface Reflectance**

Use for:

-   historical baselines,
-   long-term change,
-   30 m analysis,
-   cross-checking Sentinel-2-derived results.

Landsat Collection 2 Level-2 surface reflectance is provided at 30 m and
has a long historical archive.

------------------------------------------------------------------------

# 34. HLS Dataset

Optional but strategically useful:

**Harmonized Landsat and Sentinel-2 v2**

Use when:

-   consistent 30 m surface reflectance is needed;
-   higher temporal density is useful;
-   cross-sensor normalization would otherwise add complexity.

HLS v2 harmonizes Landsat and Sentinel-2 observations onto a common 30 m
framework and provides global coverage except Antarctica.

------------------------------------------------------------------------

# 35. DEM Dataset

Recommended:

**Copernicus DEM GLO-30**

Use for:

-   elevation,
-   slope,
-   aspect,
-   hydrological terrain,
-   drainage derivation.

Fallback:

**Copernicus DEM GLO-90**

The platform shall store the DEM source and version in metadata.

------------------------------------------------------------------------

# 36. Field/Geo-Coded Image Dataset

This is the most important dataset to resolve from the organizer
material.

### Minimum schema

``` text
image_id
file_path
latitude
longitude
timestamp
altitude
heading
project_id
watershed_id
intervention_id
image_source
image_hash
label
label_confidence
```

### Possible labels

``` text
check_dam
farm_pond
contour_bund
percolation_tank
water_harvesting_structure
drainage_structure
vegetation
erosion
water_body
barren_land
unknown
```

The actual label taxonomy must be updated after inspecting the official
dataset.

------------------------------------------------------------------------

# 37. Drone Dataset

Because the team's main project is drone-based, drone imagery should be
supported as an optional high-resolution observation source.

Recommended metadata:

``` text
image_id
flight_id
latitude
longitude
altitude
yaw
pitch
roll
timestamp
camera
ground_sampling_distance
file_hash
```

Potential outputs:

-   orthomosaic,
-   object detections,
-   segmentation,
-   intervention inspection.

The drone layer must remain technically distinct from the
SRISHTI-DRISHTI satellite source.

------------------------------------------------------------------------

# 38. Rainfall Dataset

Optional environmental context:

-   daily rainfall,
-   accumulated rainfall,
-   anomaly,
-   extreme rainfall periods.

Potential sources can include official Indian meteorological datasets
where licensing/access permits.

Rainfall should be treated as contextual evidence unless a validated
hydrological/causal model is developed.

------------------------------------------------------------------------

# 39. Soil Dataset

Optional:

-   soil texture,
-   organic carbon,
-   drainage class,
-   soil depth,
-   erosion susceptibility.

Potential government/open soil datasets should be used subject to
licensing and spatial coverage.

------------------------------------------------------------------------

# 40. Dataset Acquisition Strategy

## Phase 1

Use:

``` text
Sentinel-2
+
Landsat
+
DEM
+
open watershed boundaries
+
team-generated geo-coded photos
```

## Phase 2

Integrate:

``` text
Organizer dataset
+
SRISHTI-DRISHTI
```

## Phase 3

Add:

``` text
Drone imagery
+
rainfall
+
soil
```

------------------------------------------------------------------------

# 41. Data Processing Pipeline

``` text
RAW DATA
   ↓
Validation
   ↓
Metadata Extraction
   ↓
Coordinate Normalization
   ↓
CRS Standardization
   ↓
Cloud / Quality Filtering
   ↓
Raster Harmonization
   ↓
AOI Clipping
   ↓
Feature Engineering
   ↓
ML Inference
   ↓
Spatial Database
   ↓
GIS Tiles / APIs
   ↓
Dashboard
```

------------------------------------------------------------------------

# 42. Canonical Coordinate System

The database should store geometries using:

**WGS 84 / EPSG:4326**

For metric spatial operations, dynamically transform to an appropriate
projected CRS/UTM zone.

Never calculate distances/areas using raw latitude/longitude degrees.

------------------------------------------------------------------------

# 43. Database Architecture

Recommended:

**PostgreSQL + PostGIS**

## Main tables

### projects

``` text
id
name
description
created_at
owner_id
```

### watersheds

``` text
id
project_id
name
code
geometry
area_sq_km
source
```

### observations

``` text
id
watershed_id
image_id
geometry
timestamp
source
metadata_json
```

### images

``` text
id
storage_uri
sha256
mime_type
width
height
metadata_json
```

### interventions

``` text
id
watershed_id
type
geometry
date
source
confidence
status
```

### satellite_scenes

``` text
id
provider
product
acquisition_time
cloud_cover
geometry
source_uri
```

### raster_products

``` text
id
scene_id
type
resolution
date
storage_uri
statistics_json
```

### detections

``` text
id
image_id
class
geometry
confidence
model_version
```

### change_events

``` text
id
watershed_id
metric
date_before
date_after
geometry
change_value
confidence
```

### reports

``` text
id
project_id
created_at
version
storage_uri
```

------------------------------------------------------------------------

# 44. Storage Architecture

Use object storage for large files.

``` text
Object Storage
│
├── raw/
│   ├── field/
│   ├── drone/
│   └── satellite/
│
├── processed/
│   ├── ndvi/
│   ├── ndwi/
│   ├── lulc/
│   ├── dem/
│   └── change/
│
├── models/
└── reports/
```

PostGIS stores spatial metadata and references.

Do not store large raster binaries directly inside PostgreSQL unless
there is a strong reason.

------------------------------------------------------------------------

# 45. API Architecture

Backend:

**FastAPI**

## Authentication

``` http
POST /api/v1/auth/login
POST /api/v1/auth/refresh
```

## Projects

``` http
GET    /api/v1/projects
POST   /api/v1/projects
GET    /api/v1/projects/{id}
```

## Watersheds

``` http
GET    /api/v1/watersheds
POST   /api/v1/watersheds
GET    /api/v1/watersheds/{id}
```

## Images

``` http
POST /api/v1/images/upload
GET  /api/v1/images/{id}
GET  /api/v1/images?bbox=
```

## Satellite

``` http
GET  /api/v1/satellite/search
POST /api/v1/satellite/process
```

## Analytics

``` http
POST /api/v1/analytics/ndvi
POST /api/v1/analytics/ndwi
POST /api/v1/analytics/lulc
POST /api/v1/analytics/change
POST /api/v1/analytics/risk
```

## AI

``` http
POST /api/v1/ai/detect
POST /api/v1/ai/segment
GET  /api/v1/ai/models
```

## Reports

``` http
POST /api/v1/reports/generate
GET  /api/v1/reports/{id}
```

------------------------------------------------------------------------

# 46. Asynchronous Processing

Raster and ML operations must not block normal API requests.

Use a worker architecture:

``` text
FastAPI
   ↓
Job Queue
   ↓
Worker
   ├── GDAL
   ├── Rasterio
   ├── PyTorch
   └── GeoPandas
        ↓
PostGIS/Object Storage
```

Possible implementation:

-   Celery + Redis,
-   RQ,
-   Dramatiq,
-   or a lightweight internal job queue for the hackathon.

------------------------------------------------------------------------

# 47. Frontend Architecture

Recommended:

-   Next.js
-   TypeScript
-   Tailwind CSS
-   MapLibre GL JS or equivalent
-   component library
-   charting library.

Primary routes:

``` text
/
 /dashboard
 /projects
 /projects/[id]
 /watersheds/[id]
 /map
 /observations
 /interventions
 /analytics
 /change
 /reports
 /settings
```

------------------------------------------------------------------------

# 48. Dashboard Requirements

Top-level KPI cards:

``` text
Total Watershed Area
Interventions
Geo-Coded Observations
Vegetation Change
Water Change
Priority Zones
```

Main visual:

**interactive GIS map**

Secondary:

-   NDVI time series,
-   water-area chart,
-   intervention chart,
-   change statistics,
-   recent field observations.

------------------------------------------------------------------------

# 49. Map Layer Specification

Each layer should have:

``` json
{
  "id": "ndvi-2026-08",
  "name": "NDVI August 2026",
  "type": "raster",
  "date": "2026-08-15",
  "source": "sentinel-2",
  "resolution_m": 10,
  "opacity": 0.7,
  "provenance": {
    "scene_id": "...",
    "processing_version": "..."
  }
}
```

------------------------------------------------------------------------

# 50. AI Model Strategy

## Model A --- Intervention Detector

Input:

Field photo / drone image

Output:

``` text
class
bbox/mask
confidence
```

Start with transfer learning.

------------------------------------------------------------------------

## Model B --- Land-Cover Segmentation

Input:

Satellite image

Output:

Pixel class.

Start with:

-   SegFormer,
-   U-Net,
-   or another lightweight segmentation model.

------------------------------------------------------------------------

## Model C --- Change Detection

Baseline:

``` text
T1 index
T2 index
difference
```

Advanced:

Siamese/temporal model.

------------------------------------------------------------------------

## Model D --- Priority/Risk Model

Baseline:

transparent weighted scoring.

Advanced:

Random Forest / XGBoost / neural network if sufficient labelled data
exists.

------------------------------------------------------------------------

# 51. Model Registry

Every model inference must record:

``` text
model_id
model_version
weights_hash
input_source
preprocessing_version
inference_timestamp
confidence
```

This makes the platform reproducible.

------------------------------------------------------------------------

# 52. Model Evaluation

## Object detection

-   Precision
-   Recall
-   F1
-   mAP@50
-   mAP@50:95

## Segmentation

-   IoU
-   Dice
-   Precision
-   Recall

## Change detection

-   IoU
-   F1
-   precision/recall
-   area error

## Regression/risk prediction

-   MAE
-   RMSE
-   R²
-   calibration metrics where relevant.

------------------------------------------------------------------------

# 53. Geospatial Validation

The system must validate:

-   coordinate correctness,
-   CRS consistency,
-   geometry validity,
-   raster alignment,
-   resolution,
-   temporal alignment,
-   cloud coverage,
-   missing metadata.

Example:

``` text
ERROR:
Image GPS is outside selected watershed.

WARNING:
Satellite acquisition is 43 days away from field observation.

WARNING:
Cloud coverage > configured threshold.

ERROR:
Invalid polygon geometry.
```

------------------------------------------------------------------------

# 54. Data Quality Scoring

Each observation may receive:

``` text
Location Quality
Image Quality
Temporal Alignment
Satellite Availability
AI Confidence
Metadata Completeness
```

Example:

``` text
Evidence Quality: HIGH

GPS: ✓
Timestamp: ✓
Satellite match: ✓
Image quality: ✓
AI confidence: 0.91
```

------------------------------------------------------------------------

# 55. Provenance

Every analytical result must answer:

-   Which source image?
-   Which satellite scene?
-   Which bands?
-   Which processing version?
-   Which model?
-   Which date?
-   Which CRS?
-   Which parameters?

This is critical for scientific credibility.

------------------------------------------------------------------------

# 56. Security Requirements

## Authentication

Use secure sessions/JWT or equivalent.

## Authorization

RBAC.

## File security

-   MIME validation,
-   extension validation,
-   malware scanning where infrastructure allows,
-   size limits,
-   hash generation.

## Audit

Record:

``` text
user
action
timestamp
resource
old value
new value
```

------------------------------------------------------------------------

# 57. Data Integrity

Generate:

-   SHA-256 for uploaded images,
-   SHA-256 for generated reports,
-   model weight digest,
-   source metadata.

This allows evidence reproducibility.

------------------------------------------------------------------------

# 58. Privacy

Geo-coded photographs may contain:

-   faces,
-   license plates,
-   private property,
-   personal information.

The system should support optional:

-   face blurring,
-   license plate blurring,
-   access control,
-   retention policy.

Raw evidence should never be silently overwritten.

------------------------------------------------------------------------

# 59. Offline/Low-Connectivity Considerations

Rural deployment may have unreliable connectivity.

The field application layer should eventually support:

``` text
Capture
 ↓
Local metadata storage
 ↓
Local queue
 ↓
Sync when online
```

For the hackathon, this can be demonstrated as a simulated offline
queue.

------------------------------------------------------------------------

# 60. Drone Integration

The drone is not required to be the entire solution.

Instead:

``` text
DRONE
 ↓
Geo-coded imagery
 ↓
Upload/edge processing
 ↓
Watershed Platform
```

Drone observations can provide high-resolution field evidence while
satellite imagery provides broader spatial context.

Supported drone inputs:

-   JPEG,
-   GeoTIFF,
-   orthomosaic,
-   flight metadata,
-   GPS logs where available.

------------------------------------------------------------------------

# 61. Digital Twin Concept

The platform can represent the watershed as a lightweight digital twin.

``` text
WATERSHED
│
├── Terrain
├── Drainage
├── Land Cover
├── Water
├── Vegetation
├── Interventions
├── Field Observations
├── Satellite Observations
└── Historical Change
```

Every object is spatially linked.

------------------------------------------------------------------------

# 62. Example User Workflow

## Step 1

User creates:

**Kerala Watershed Pilot**

## Step 2

Uploads watershed boundary.

## Step 3

System retrieves available satellite scenes.

## Step 4

System generates:

-   RGB,
-   NDVI,
-   NDWI,
-   LULC.

## Step 5

User uploads 200 geo-coded field images.

## Step 6

System extracts GPS/timestamp.

## Step 7

AI detects:

-   check dams,
-   ponds,
-   erosion,
-   vegetation.

## Step 8

Each observation is spatially joined to:

-   watershed,
-   sub-watershed,
-   drainage,
-   elevation,
-   satellite raster.

## Step 9

User selects:

**2023 vs 2026**

## Step 10

System produces change maps.

## Step 11

User opens an intervention.

``` text
Check Dam #17

Field Evidence:
✓

NDVI:
+0.16

Water:
+1.6 ha

Satellite:
Available

Confidence:
High
```

## Step 12

Generate report.

------------------------------------------------------------------------

# 63. Example Final Report

``` text
WATERSHED MONITORING REPORT

Watershed:
WS-001

Area:
12.4 km²

Monitoring:
2023–2026

--------------------------------

FIELD OBSERVATIONS

Images: 248
Located: 236
Interventions: 43

--------------------------------

VEGETATION

Mean NDVI:
2023  0.41
2026  0.55

Change:
+0.14

--------------------------------

WATER

2023:
4.2 ha

2026:
6.8 ha

Change:
+2.6 ha

--------------------------------

PRIORITY AREAS

High erosion:
7

Vegetation stress:
11

Potential intervention gaps:
5

--------------------------------

DATA SOURCES

Satellite:
Sentinel-2 / Landsat / SRISHTI-DRISHTI where available

Field:
Geo-coded imagery

Terrain:
DEM

--------------------------------

LIMITATIONS

Results represent spatial evidence and
analytical indicators and do not independently
establish causal impact.
```

------------------------------------------------------------------------

# 64. MVP Definition for Hackathon

The MVP must NOT attempt to implement every feature in the problem
statement.

## Must Have

### M1

Interactive watershed map.

### M2

Geo-coded photo upload.

### M3

Satellite imagery.

### M4

NDVI.

### M5

NDWI/MNDWI.

### M6

Intervention/object detection.

### M7

Before/after change analysis.

### M8

Spatial linking of photo + satellite + terrain.

### M9

Watershed statistics.

### M10

Automated report.

------------------------------------------------------------------------

# 65. Demo Scenario

Use one real or representative watershed AOI.

### Demo sequence

1.  Open platform.
2.  Select watershed.
3.  Display satellite imagery.
4.  Toggle NDVI.
5.  Toggle NDWI.
6.  Show watershed boundary.
7.  Upload/ingest geo-coded field images.
8.  Display photographs on map.
9.  Click an intervention.
10. Show AI detection.
11. Show satellite context.
12. Switch to historical date.
13. Show before/after.
14. Show change statistics.
15. Generate report.

Target demo duration:

**5--8 minutes.**

------------------------------------------------------------------------

# 66. Advanced Features After MVP

## A1 --- Multimodal Evidence Engine

Combine:

-   image,
-   satellite,
-   terrain,
-   time,
-   metadata.

## A2 --- Automated Intervention Discovery

Search satellite/drone imagery for likely interventions.

## A3 --- Erosion Hotspot Prediction

Use:

-   slope,
-   flow accumulation,
-   soil,
-   land cover,
-   rainfall,
-   vegetation.

## A4 --- Anomaly Detection

Identify unexpected changes.

## A5 --- Mobile Field App

Offline-first field collection.

## A6 --- Natural Language GIS Assistant

Example:

> "Show interventions where vegetation decreased by more than 15% after
> 2024."

The assistant translates the request into a spatial query.

## A7 --- Drone Mission Planning

From detected priority zones:

``` text
Priority zone
   ↓
Recommended inspection area
   ↓
Drone mission
```

This should be considered an advanced integration with the team's
separate drone project.

------------------------------------------------------------------------

# 67. Research Contribution

The strongest research angle is not the GIS UI.

It is:

## **Multimodal Spatial Evidence Fusion for Watershed Monitoring**

Research question:

> Can geo-coded field observations be systematically fused with
> satellite-derived environmental indicators and terrain context to
> create more interpretable evidence for watershed monitoring?

Potential contribution:

``` text
Geo-coded Image
      +
Satellite
      +
Terrain
      +
Temporal Change
      ↓
Spatial Evidence Representation
      ↓
Watershed Outcome Analytics
```

------------------------------------------------------------------------

# 68. Experimental Design

Create test areas representing:

-   healthy vegetation,
-   degraded land,
-   water bodies,
-   intervention zones,
-   non-intervention zones.

Compare:

### Baseline

Satellite-only.

### Proposed

Satellite + geo-coded field evidence.

Measure:

-   detection precision,
-   spatial consistency,
-   intervention identification,
-   change-detection accuracy,
-   analyst task time.

------------------------------------------------------------------------

# 69. Ablation Studies

For research-grade evaluation:

### Experiment 1

Satellite only.

### Experiment 2

Geo-coded images only.

### Experiment 3

Satellite + field imagery.

### Experiment 4

Satellite + field imagery + terrain.

### Experiment 5

Full temporal multimodal system.

This can demonstrate whether each information source contributes
measurable value.

------------------------------------------------------------------------

# 70. Explainability

Every AI result should show:

``` text
Prediction:
Check Dam

Confidence:
91%

Evidence:
- visual features
- model detection
- spatial context

Model:
watershed-detector-v1.2

Limitations:
occlusion / image quality
```

For segmentation, show:

-   original image,
-   predicted mask,
-   confidence map.

------------------------------------------------------------------------

# 71. Performance Requirements

## Dashboard

Target:

-   initial load \< 3 s for normal project metadata;
-   map interaction should remain responsive;
-   large raster layers should use tiles/COGs rather than full
    downloads.

## API

Target:

-   normal CRUD requests \< 500 ms where practical;
-   asynchronous processing for raster/ML workloads.

## AI

Target:

-   field image inference within a few seconds on GPU;
-   batch inference for large collections.

## Data processing

Processing time should be recorded rather than hidden.

------------------------------------------------------------------------

# 72. Scalability

Architecture should support:

``` text
1 watershed
      ↓
10 watersheds
      ↓
100 watersheds
      ↓
state-scale deployment
```

Do not design the system around one hard-coded location.

All analytics should operate on an AOI.

------------------------------------------------------------------------

# 73. Deployment

Recommended:

``` text
Frontend:
Next.js

API:
FastAPI

Database:
PostgreSQL + PostGIS

Workers:
Python

ML:
PyTorch

Raster:
GDAL / Rasterio / xarray

Object Storage:
S3-compatible

Reverse Proxy:
Nginx

Containers:
Docker
```

------------------------------------------------------------------------

# 74. Suggested Repository

``` text
watershed-intelligence/
│
├── apps/
│   ├── web/
│   └── api/
│
├── services/
│   ├── ingestion/
│   ├── satellite/
│   ├── raster/
│   ├── gis/
│   ├── vision/
│   ├── change_detection/
│   ├── risk/
│   └── reporting/
│
├── ml/
│   ├── detection/
│   ├── segmentation/
│   ├── change/
│   └── risk/
│
├── data/
│   ├── raw/
│   ├── interim/
│   ├── processed/
│   └── samples/
│
├── db/
│   ├── migrations/
│   └── seeds/
│
├── docs/
│
├── scripts/
│
├── tests/
│
└── docker-compose.yml
```

------------------------------------------------------------------------

# 75. Suggested Technology Stack

## Frontend

-   Next.js
-   TypeScript
-   Tailwind CSS
-   MapLibre GL JS
-   Recharts

## Backend

-   Python
-   FastAPI
-   Pydantic
-   SQLAlchemy

## GIS

-   PostGIS
-   GDAL
-   Rasterio
-   GeoPandas
-   Shapely
-   PyProj
-   xarray/rioxarray

## ML

-   PyTorch
-   OpenCV
-   Ultralytics/YOLO or equivalent detector
-   SegFormer/U-Net/DeepLab depending on experiments

## Infrastructure

-   Docker
-   PostgreSQL
-   Redis
-   object storage
-   background workers

------------------------------------------------------------------------

# 76. Acceptance Criteria

The MVP is considered functional when:

### AC-001

A user can create a watershed project.

### AC-002

A watershed boundary can be displayed on an interactive map.

### AC-003

Geo-coded images can be uploaded and mapped automatically.

### AC-004

Images without GPS are flagged rather than incorrectly geolocated.

### AC-005

Satellite imagery can be associated with the AOI.

### AC-006

NDVI can be generated and visualized.

### AC-007

NDWI/MNDWI can be generated and visualized.

### AC-008

At least one LULC workflow works on the pilot AOI.

### AC-009

At least one watershed intervention class can be detected from imagery.

### AC-010

Before/after analysis works for two dates.

### AC-011

A field observation can be linked to satellite/terrain context.

### AC-012

The user can inspect an intervention and see its evidence.

### AC-013

The system can generate a monitoring report.

### AC-014

Every analytical output exposes its source/provenance.

------------------------------------------------------------------------

# 77. Failure Handling

The platform must explicitly handle:

### Missing GPS

``` text
Status: UNLOCATED
Action: Manual placement required
```

### Cloudy satellite scene

``` text
Status: LOW QUALITY
Action: Search alternate acquisition
```

### No historical imagery

``` text
Status: INSUFFICIENT TEMPORAL DATA
```

### AI uncertainty

``` text
Status: LOW CONFIDENCE
Action: Human review
```

### Invalid geometry

``` text
Status: INVALID GEOMETRY
Action: Repair/re-upload
```

------------------------------------------------------------------------

# 78. Human-in-the-Loop

AI must support, not replace, field/GIS experts.

Workflow:

``` text
AI Prediction
     ↓
Analyst Review
     ↓
Accept / Correct / Reject
     ↓
Validated Record
```

Corrections should optionally become training data.

------------------------------------------------------------------------

# 79. Feedback Dataset

Every human correction can become:

``` text
image
+
prediction
+
human label
```

This creates an internal dataset for later fine-tuning.

The platform should track:

``` text
label_source:
AI
human
official
team
```

------------------------------------------------------------------------

# 80. Data Licensing

Every dataset must have:

``` text
source
license
access date
citation
processing method
```

No external imagery should be silently redistributed when licensing does
not permit redistribution.

The application should store references to source datasets where
possible rather than copying restricted source data into public
repositories.

------------------------------------------------------------------------

# 81. Dataset Manifest

Create a machine-readable manifest:

``` json
{
  "dataset_id": "watershed-pilot-v1",
  "region": "pilot_aoi",
  "sources": [
    {
      "name": "Sentinel-2 L2A",
      "provider": "Copernicus",
      "resolution_m": [10,20,60]
    },
    {
      "name": "Landsat Collection 2 Level-2",
      "provider": "USGS",
      "resolution_m": 30
    },
    {
      "name": "Copernicus DEM GLO-30",
      "provider": "Copernicus",
      "resolution_m": 30
    }
  ]
}
```

------------------------------------------------------------------------

# 82. Observability

Track:

-   API latency,
-   processing time,
-   failed jobs,
-   satellite download failures,
-   model inference latency,
-   GPU usage,
-   database latency,
-   storage consumption.

Every processing job gets:

``` text
job_id
status
created_at
started_at
finished_at
error
output
```

------------------------------------------------------------------------

# 83. Security and Integrity of Evidence

For field evidence:

``` text
Original image
      ↓
SHA-256
      ↓
Immutable reference
      ↓
Processing
      ↓
Derived outputs
```

Never overwrite the original file.

------------------------------------------------------------------------

# 84. Success Metrics

## Product metrics

-   percentage of geo-coded images successfully ingested;
-   processing success rate;
-   average analyst time per watershed;
-   report generation time;
-   number of spatial layers available.

## ML metrics

-   detection mAP;
-   segmentation IoU;
-   change detection F1;
-   false positive rate.

## GIS metrics

-   spatial accuracy;
-   geometry validity;
-   raster alignment;
-   coordinate consistency.

## Research metric

Measure whether adding geo-coded field observations improves analytical
performance over satellite-only baselines.

------------------------------------------------------------------------

# 85. Demo Dataset Strategy

For the hackathon, create one strong pilot.

Recommended dataset structure:

``` text
pilot/
│
├── watershed.geojson
├── subwatersheds.geojson
├── drainage.geojson
├── dem.tif
│
├── satellite/
│   ├── before/
│   └── after/
│
├── indices/
│   ├── ndvi/
│   └── ndwi/
│
├── field/
│   ├── images/
│   └── metadata.csv
│
├── interventions/
│   └── interventions.geojson
│
└── labels/
    └── vision_labels.json
```

------------------------------------------------------------------------

# 86. Recommended Development Sequence

## Phase 0 --- Dataset validation

**Do not skip this.**

Inspect the official problem-statement Google Drive material.

Determine:

-   available images,
-   metadata,
-   geographic coverage,
-   labels,
-   satellite files,
-   expected output format.

------------------------------------------------------------------------

## Phase 1 --- GIS foundation

Build:

-   PostGIS,
-   watershed upload,
-   map,
-   geo-coded photo ingestion.

------------------------------------------------------------------------

## Phase 2 --- Remote sensing

Add:

-   satellite discovery,
-   raster processing,
-   NDVI,
-   NDWI,
-   temporal comparison.

------------------------------------------------------------------------

## Phase 3 --- AI

Add:

-   intervention detection,
-   LULC segmentation,
-   confidence.

------------------------------------------------------------------------

## Phase 4 --- Evidence fusion

Connect:

``` text
photo
+
satellite
+
terrain
+
time
```

------------------------------------------------------------------------

## Phase 5 --- Decision support

Add:

-   priority zones,
-   intervention analytics,
-   reports.

------------------------------------------------------------------------

## Phase 6 --- Drone integration

Add:

``` text
drone → geo-coded evidence → platform
```

------------------------------------------------------------------------

# 87. Hackathon Prioritization

## P0 --- Mandatory

-   GIS map
-   watershed boundary
-   geo-coded photo ingestion
-   satellite imagery
-   NDVI
-   NDWI
-   before/after
-   intervention layer
-   report
-   provenance

## P1 --- Strong differentiators

-   AI intervention detection
-   LULC segmentation
-   spatial evidence fusion
-   erosion priority
-   temporal slider
-   drone integration

## P2 --- Research/advanced

-   multimodal model
-   automatic intervention discovery
-   natural-language GIS assistant
-   autonomous drone mission generation
-   online learning
-   advanced temporal transformer.

------------------------------------------------------------------------

# 88. Recommended Team Responsibilities

## AI/ML Engineer

-   detection
-   segmentation
-   change detection
-   evaluation

## GIS/Remote Sensing Engineer

-   satellite
-   raster processing
-   indices
-   watershed analysis

## Backend Engineer

-   FastAPI
-   PostGIS
-   ingestion
-   jobs
-   APIs

## Frontend Engineer

-   GIS interface
-   dashboard
-   temporal comparison
-   report UI

## Drone/Robotics Engineer

-   drone imagery
-   GPS/metadata
-   field acquisition
-   future mission planning.

------------------------------------------------------------------------

# 89. Final Product Architecture

``` text
                    ┌──────────────────────┐
                    │      WEB CLIENT      │
                    │  Next.js + GIS UI    │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │      FASTAPI         │
                    │     API GATEWAY      │
                    └──────────┬───────────┘
                               │
          ┌────────────────────┼────────────────────┐
          │                    │                    │
          ▼                    ▼                    ▼
   ┌────────────┐      ┌─────────────┐      ┌────────────┐
   │ PostGIS    │      │ Job Queue    │      │ Object     │
   │ Spatial DB │      │ / Workers    │      │ Storage    │
   └────────────┘      └──────┬──────┘      └────────────┘
                               │
          ┌────────────────────┼─────────────────────┐
          │                    │                     │
          ▼                    ▼                     ▼
   ┌────────────┐       ┌────────────┐       ┌─────────────┐
   │ Raster     │       │ AI/ML      │       │ Change      │
   │ Engine     │       │ Engine     │       │ Engine      │
   └────────────┘       └────────────┘       └─────────────┘
          │                    │                     │
          └────────────────────┼─────────────────────┘
                               ▼
                    ┌──────────────────────┐
                    │ Evidence Fusion      │
                    │ & Analytics Engine    │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ Watershed Digital    │
                    │ Twin / GIS Layers    │
                    └──────────────────────┘
```

------------------------------------------------------------------------

# 90. Product Differentiation

The product should differentiate itself through:

### 1. Field + satellite fusion

Not merely satellite visualization.

### 2. Spatial evidence

Every observation has a geographic context.

### 3. Temporal intelligence

The system understands change over time.

### 4. AI interpretation

AI converts imagery into structured observations.

### 5. Explainability

Every result exposes evidence and confidence.

### 6. Provenance

Every result can be traced to source data and model versions.

### 7. Drone interoperability

High-resolution drone observations can supplement satellite-scale
coverage.

------------------------------------------------------------------------

# 91. Core Product Statement

The final product can be described as:

> **A multimodal geospatial intelligence platform for watershed
> development that integrates geo-coded field imagery, satellite remote
> sensing, terrain analysis and AI-based image interpretation to produce
> spatially validated evidence, temporal change maps and intervention
> monitoring insights.**

------------------------------------------------------------------------

# 92. One-Line Architecture

``` text
Geo-coded Images + Satellite + Terrain + Time + AI
                        ↓
             Spatial Evidence Fusion
                        ↓
              Watershed Intelligence
```

------------------------------------------------------------------------

# 93. Final Recommendation

The implementation should **not** start by training an AI model.

The correct build order is:

``` text
1. Acquire/inspect official dataset
2. Build GIS data model
3. Ingest geo-coded images
4. Integrate satellite imagery
5. Build NDVI/NDWI
6. Build temporal comparison
7. Add intervention inventory
8. Add AI detection/segmentation
9. Build evidence fusion
10. Build reports
11. Integrate drone imagery
12. Conduct quantitative evaluation
```

This order ensures that the project remains useful even if the available
labeled AI dataset is smaller than expected.

------------------------------------------------------------------------

# 94. Reference Dataset / Official Data Links

## Problem Statement supplementary material

https://drive.google.com/drive/folders/1ibmzWpl_nK7aBhQurs22R9kqh9fPAQwC

## Sentinel-2

Copernicus Data Space Ecosystem:

https://dataspace.copernicus.eu/data-collections/copernicus-sentinel-missions/sentinel-2

Documentation:

https://documentation.dataspace.copernicus.eu/Data/SentinelMissions/Sentinel2.html

## Landsat Collection 2

https://www.usgs.gov/landsat-missions/landsat-collection-2

## Landsat Collection 2 Surface Reflectance

https://www.usgs.gov/landsat-missions/landsat-collection-2-surface-reflectance

## Harmonized Landsat and Sentinel-2

https://www.usgs.gov/publications/harmonized-landsat-and-sentinel-2-version-20-surface-reflectance-dataset

## Copernicus DEM

https://dataspace.copernicus.eu/explore-data/data-collections/copernicus-contributing-missions/collections-description/COP-DEM

------------------------------------------------------------------------

# 95. Open Questions to Resolve Before Implementation

These are the only major unknowns that should be resolved from the
organizer material:

1.  What exact geo-coded image dataset is provided?
2.  What metadata fields are available?
3.  What intervention labels are available?
4.  What watershed/geographic regions are represented?
5.  Is SRISHTI-DRISHTI data directly downloadable by participants?
6.  What exact 30 m products are provided?
7.  What are the required output formats?
8.  Is there ground-truth validation data?
9.  Are there before/after intervention records?
10. What geographic region should the PoC demonstrate?
11. What evaluation criteria will the judges use?
12. What restrictions apply to redistribution of organizer data?

Until these are confirmed, the architecture should remain data-source
agnostic.

------------------------------------------------------------------------

# 96. Definition of Done

The project is complete for the hackathon when a judge can:

1.  Open the application.
2.  Select a watershed.
3.  View its boundary and terrain.
4.  View satellite imagery.
5.  Toggle NDVI and water layers.
6.  View watershed interventions.
7.  Click a geo-coded field photograph.
8.  See its metadata.
9.  See AI interpretation.
10. See surrounding satellite evidence.
11. Compare two dates.
12. View measured changes.
13. Inspect priority areas.
14. Generate an evidence report.
15. Trace the report's findings back to source data.

The project is research-ready when, in addition, it has:

-   a documented dataset,
-   reproducible preprocessing,
-   train/validation/test separation,
-   quantitative ML evaluation,
-   GIS validation,
-   ablation studies,
-   provenance,
-   model versioning,
-   limitations,
-   reproducible deployment instructions.

------------------------------------------------------------------------

# 97. Final Product Definition

**Working name:** Watershed Intelligence Platform (WIP)

**Category:** Geospatial AI / Remote Sensing / Decision Support

**Core input:**

> Geo-coded field imagery + satellite observations + terrain + watershed
> boundaries + temporal data

**Core processing:**

> GIS + remote sensing + computer vision + change detection + spatial
> evidence fusion

**Core output:**

> Interactive watershed digital twin + thematic maps + intervention
> intelligence + temporal change analysis + evidence reports

**Primary research contribution:**

> A reproducible framework for transforming geo-coded field imagery into
> spatially contextualized watershed evidence through fusion with
> satellite and terrain observations.

**Relationship with drone project:**

> The drone system acts as a high-resolution field-observation source,
> while the watershed platform acts as the geospatial intelligence and
> analysis layer. The two systems can integrate without being the same
> product.

------------------------------------------------------------------------

# Appendix A --- Minimum Data Contract

``` json
{
  "observation_id": "OBS-0001",
  "project_id": "PROJ-001",
  "watershed_id": "WS-001",
  "image": {
    "uri": "object://field/OBS-0001.jpg",
    "sha256": "..."
  },
  "location": {
    "latitude": 10.12345,
    "longitude": 76.12345,
    "crs": "EPSG:4326"
  },
  "time": "2026-08-21T10:32:00Z",
  "source": "field",
  "intervention": {
    "type": "check_dam",
    "confidence": 0.91
  },
  "satellite_context": {
    "provider": "sentinel-2",
    "scene_id": "...",
    "ndvi": 0.48,
    "ndwi": 0.21
  },
  "terrain": {
    "elevation_m": 212.4,
    "slope_deg": 7.2
  },
  "provenance": {
    "model_version": "watershed-detector-v1",
    "processing_version": "pipeline-v1"
  }
}
```

------------------------------------------------------------------------

# Appendix B --- Example User Stories

## US-001

As a field officer, I want to upload geo-coded photographs so that every
field observation appears on the watershed map.

## US-002

As a GIS analyst, I want to compare NDVI between two dates so that I can
identify vegetation change.

## US-003

As a program administrator, I want to see intervention locations and
supporting photographs so that I can inspect project coverage.

## US-004

As a researcher, I want to compare satellite-only and multimodal
analysis so that I can quantify the contribution of field evidence.

## US-005

As a field officer, I want to see low-confidence AI predictions so that
I can manually validate them.

## US-006

As an administrator, I want a reproducible report with data provenance
so that analytical findings can be audited.

------------------------------------------------------------------------

# Appendix C --- MVP vs Research Version

  Capability                  Hackathon MVP         Research Version
  --------------------------- --------------------- ---------------------
  GIS                         Yes                   Yes
  Geo-coded images            Yes                   Yes
  Sentinel-2                  Yes                   Yes
  Landsat                     Yes                   Yes
  SRISHTI-DRISHTI             If access available   Yes
  NDVI                        Yes                   Yes
  NDWI/MNDWI                  Yes                   Yes
  DEM                         Yes                   Yes
  LULC                        Basic                 Advanced
  Object detection            Basic                 Fine-tuned
  Change detection            Index baseline        Deep temporal model
  Risk                        Weighted baseline     ML model
  Evidence fusion             Yes                   Multimodal research
  Drone                       Optional              Full integration
  Reports                     Yes                   Reproducible
  Validation                  Basic                 Full benchmark
  Ablation                    No                    Yes
  Human feedback              Optional              Yes
  NLP GIS assistant           No                    Optional
  Autonomous drone planning   No                    Future

------------------------------------------------------------------------

# Appendix D --- Key Principle

> **Do not build an AI demo looking for a problem. Build a geospatial
> monitoring system where AI solves specific interpretation problems.**

The product's foundation is GIS and remote sensing. AI is the
intelligence layer. Geo-coded photographs are the field-evidence layer.
Satellite data is the large-area observation layer. Temporal analysis is
the outcome layer. The dashboard is the decision-support layer.

Together they form the proposed watershed intelligence platform.
