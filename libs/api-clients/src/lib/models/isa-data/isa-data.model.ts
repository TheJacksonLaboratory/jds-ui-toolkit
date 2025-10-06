/**
 * This module defines the data models for representing the Investigation-Study-Assay (ISA)
 * data model, which is a standard for describing life science experiments and their results.
 *
 * Key Concepts:
 * - Investigation: The overall research project or study.
 * - Study: A specific experimental design within an investigation.
 * - Assay: A specific test or measurement performed on samples within a study.
 *
 * Measures represent the actual data points collected from assay executions, including:
 * - Measure: a single assay results with unique identifier
 * - MeasureSeries: a collection of measures that share common metadata and characteristics
 *
 * Each measure/series contains values, metadata about the experimental conditions,
 * and characteristics that describe sample properties or experimental parameters.
 */

export interface Measure {
  id: string;
  values?: MeasureValue[];
  metadata?: MeasureMetadata;
  characteristics?: IsaCharacteristic[];
}

export interface MeasureSeries {
  id: string;
  values?: MeasureValue[];
  measures?: string[];
  metadata?: MeasureSeriesMetadata;
  characteristics?: IsaCharacteristic[];
}

export interface MeasureMetadata {
  assay_id: number;
  description: string;
  measure_id: number;
  method: string;
  study_id: string;
  units: string;
  treatment: string;
  variable_name: string;

  characteristics?: Record<string, string[]>
}

export interface MeasureSeriesMetadata {
  assay_id: number;
  description: string;
  initiated_at_units: string;
  measure_ids: string[];
  measure_series_id: string;
  measurement_units: string;
  method: string;
  study_id?: number;
  treatment: string;
  treatment_units: string;
  variable_name: string;

  characteristics?: Record<string, string[]>;
};

export interface MeasureValue {
  value: string | number;
  measure_id: string;
  measure_series_id?: string;
  study_id?: string;
  source_id: string;
}

export interface IsaCharacteristicValue {
  value: string | number | boolean | Date;
  label: string; // e.g., 'High', 'Low', 'Positive', '2023-10-01'
  count?: number;
  description?: string; // optional description of the characteristic value
  metadata: Record<string, string>; // additional metadata about the characteristic value
}

export interface IsaCharacteristic {
  name: string;
  value: IsaCharacteristicValue | IsaCharacteristicValue[];
  type?: string; // e.g., 'text', 'numeric', 'date'
  unit?: string; // e.g., 'mg/L', 'Celsius'
  description?: string; // optional description of the characteristic
}
