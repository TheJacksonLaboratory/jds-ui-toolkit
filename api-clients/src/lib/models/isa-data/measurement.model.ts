/**
 * MeasurementSet represents the results and metadata from a single execution
 * of an assay within a study. Each measurement set has a unique measurementId.
 */
export interface MeasurementSet {
  data: MeasurementSetData[];
  metadata: MeasurementSetMetadata;
  searchCategories: Record<string, MeasurementSetCharacteristic>;
}

export interface MeasurementSetMetadata {
  assay_id: number;
  description: string;
  measure_ids: string[];
  measurement_series_id?: string;
  method: string;
  study_id?: number;
  units: string;
  treatment: string;
  variable_name: string;

  characteristics?: Record<string, string[]>;
};

export interface MeasurementSetData {
  time_point?: string;
  value: number | string | boolean;
  custom_attributes?: Record<string, string>;
};

export interface MeasurementSetCharacteristicValue {
  option: string
  count: number;
}

export interface MeasurementSetCharacteristic {
  characteristic: string;
  label: string;
  values?: MeasurementSetCharacteristicValue[];
}