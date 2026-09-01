/**
 * MON-DRAIN ENGINEER — Engineering Types & Schemas
 * Standardized data models for Mongolian road drainage, hydrology, culverts and GIS.
 */

export type Language = 'mn' | 'en';

export type NavigationTab =
  | 'home'
  | 'projects'
  | 'import'
  | 'terrain'
  | 'road-analysis'
  | 'hydrology'
  | 'culvert'
  | 'map'
  | 'profile'
  | 'report'
  | 'history'
  | 'settings';

export type CulvertType = 'CIRCULAR_PIPE' | 'RECTANGULAR_BOX';

export type HydraulicStatus = 'ADEQUATE' | 'INADEQUATE' | 'CHECK_REQUIRED';

export type CoordinateSystem = 'WGS84' | 'UTM_ZONE_48N' | 'UTM_ZONE_49N' | 'MSK_42' | 'LOCAL_ROAD_GRID';

export interface CRSInfo {
  sourceCRS: CoordinateSystem;
  projectCRS: CoordinateSystem;
  demCRS: CoordinateSystem;
  roadCRS: CoordinateSystem;
  datumName?: string;
  projectionNotes?: string;
}

export interface RoadVertex {
  lat: number;
  lng: number;
  elevation?: number;
  chainageM?: number; // Distance in meters from start
}

export interface RoadAlignment {
  id: string;
  name: string;
  totalLengthKm: number;
  samplingSpacingM: 25 | 50 | 100 | 200 | 500;
  vertices: RoadVertex[];
  sampledPoints: {
    index: number;
    chainageM: number;
    chainageFormatted: string; // e.g. "KM 12+450"
    lat: number;
    lng: number;
    elevation: number;
    isCulvertLocation?: boolean;
    drainagePointId?: string;
  }[];
  crs: CoordinateSystem;
  importedFileName?: string;
  importedAt?: string;
}

export interface DemGridData {
  id: string;
  fileName: string;
  width: number;
  height: number;
  cellSizeM: number;
  bounds: {
    minLat: number;
    maxLat: number;
    minLng: number;
    maxLng: number;
  };
  minElevation: number;
  maxElevation: number;
  noDataValue: number;
  crs: CoordinateSystem;
  elevationMatrix: number[][]; // 2D grid
  flowDirectionMatrix?: number[][]; // D8 direction grid (1..8)
  flowAccumulationMatrix?: number[][]; // Cell accumulation count
  isProcessed: boolean;
  sinkFilled: boolean;
  flowDirectionMethod: 'D8' | 'D_INFINITY';
  accumulationThreshold: number; // e.g. 500 cells
  importedAt: string;
}

export interface CircularPipeDesign {
  diameterMm: number; // e.g. 300, 400, 500, 600, 800, 1000, 1200, 1500, 1800, 2000
  numberOfBarrels: number; // 1, 2, 3...
  lengthM: number;
  slopePercent: number; // e.g. 1.5%
  manningN: number; // e.g. 0.013, 0.015
  inletCondition: 'BEVELED_EDGE' | 'SQUARE_EDGE' | 'HEADWALL_WINGWALLS' | 'PROJECTING';
  outletCondition: 'FREE_OUTFALL' | 'SUBMERGED';
  tailwaterDepthM?: number;
  headwaterDepthM?: number;
  // Calculated hydraulic results
  crossSectionAreaM2: number;
  wettedPerimeterM: number;
  hydraulicRadiusM: number;
  fullCapacityQ: number; // m3/s
  actualCapacityQ: number; // m3/s (multiplied by barrels)
  flowVelocityMs: number; // m/s
  capacityRatio: number; // Qcap / Qreq
}

export interface BoxCulvertDesign {
  clearWidthM: number; // B (m) e.g. 1.0, 1.5, 2.0, 2.5, 3.0
  clearHeightM: number; // H (m) e.g. 1.0, 1.5, 2.0, 2.5, 3.0
  numberOfCells: number; // 1, 2, 3...
  lengthM: number;
  slopePercent: number; // e.g. 1.5%
  manningN: number; // e.g. 0.013, 0.015
  inletCondition: 'WINGWALLS_30_75' | 'SQUARE_HEADWALL' | 'CHAMFERED';
  outletCondition: 'FREE_OUTFALL' | 'SUBMERGED';
  tailwaterDepthM?: number;
  headwaterDepthM?: number;
  // Calculated hydraulic results
  singleCellAreaM2: number;
  totalAreaM2: number;
  wettedPerimeterM: number;
  hydraulicRadiusM: number;
  singleCellCapacityQ: number; // m3/s
  totalCapacityQ: number; // m3/s
  flowVelocityMs: number; // m/s
  capacityRatio: number; // Qcap / Qreq
}

export interface DrainageCrossingPoint {
  id: string; // e.g. "D-001"
  roadKm: number; // in km, e.g. 12.450
  chainageFormatted: string; // "KM 12+450"
  lat: number;
  lng: number;
  elevationM: number;
  
  // Hydrology & Catchment
  catchmentAreaKm2: number;
  catchmentAreaHa: number;
  flowPathLengthM: number;
  highestUpstreamElevM: number;
  outletElevM: number;
  elevationDiffM: number;
  averageSlopePercent: number;
  averageSlopeDec: number;
  timeOfConcentrationMin: number;
  tcMethod: 'KIRPICH' | 'MANUAL' | 'MONGOLIAN_BNbD';
  
  // Design Rainfall & Rational Method
  returnPeriodYears: number; // T (e.g. 25, 50, 100)
  rainfallIntensityMmHr: number; // i (mm/hr)
  rainfallDurationMin: number;
  rainfallSourceRef: string;
  runoffCoefficientC: number; // C (e.g. 0.50)
  runoffLandUseType: string;
  peakDischargeQ: number; // Q = 0.278 * C * i * A (m3/s)
  
  // Culvert selection & Hydraulics
  culvertType: CulvertType;
  circularConfig?: CircularPipeDesign;
  boxConfig?: BoxCulvertDesign;
  hydraulicCapacityQ: number;
  capacityRatio: number;
  hydraulicStatus: HydraulicStatus;
  
  // Spacing & Spacing Analysis
  distanceFromPreviousCulvertM?: number;
  isAutoDetected: boolean;
  engineeringReviewStatus: 'APPROVED' | 'REQUIRES_FIELD_CHECK' | 'PENDING_REVIEW';
  remarks?: string;
  
  // Watershed & Flow path geometry
  watershedPolygon?: [number, number][]; // [lat, lng] array
  flowPathPolyline?: [number, number][]; // [lat, lng] array
}

export interface ProjectMetadata {
  id: string;
  name: string;
  projectNumber: string;
  client: string;
  roadName: string;
  province: string; // Аймаг (e.g. Төв аймаг, Дархан-Уул)
  soum: string; // Сум (e.g. Жаргалант, Хонгор)
  roadSection: string; // e.g. "PK 0+000 - PK 45+800"
  engineer: string;
  date: string;
  notes: string;
  crsInfo: CRSInfo;
  createdAt: string;
  updatedAt: string;
}

export interface Project extends ProjectMetadata {
  roadAlignment?: RoadAlignment;
  demData?: DemGridData;
  drainagePoints: DrainageCrossingPoint[];
  calculationSettings: {
    defaultManningPipe: number;
    defaultManningBox: number;
    defaultRunoffC: number;
    defaultReturnPeriod: number;
    defaultRainfallIntensity: number;
    flowAccumulationThreshold: number;
    demResolutionM: number;
    culvertSpacingWarnMaxM: number;
    culvertSpacingWarnMinM: number;
  };
  auditLogs: {
    id: string;
    timestamp: string;
    action: string;
    author: string;
    details: string;
  }[];
}
