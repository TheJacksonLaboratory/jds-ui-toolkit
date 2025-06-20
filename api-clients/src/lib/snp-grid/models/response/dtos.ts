import { SNP, SNPSearchRegion } from "../../../mvar/models/response/dtos";

export interface MusterHealthCheck {
  status: string;
  timestamp: string;
}

export interface MusterMetadata {
  total_number_of_SNPs: number;
  last_updated: string;
  version: string;
  total_number_of_strains: number;
}

export interface Strain {
  bq_sample_id: number;
  mpd_strainid: number;
  strainname: string;
  straintype: string;
}

export interface Gene {
  symbol: string;
  chr: string;
  start_position: number;
  end_position: number;
  strand: string;
  description: string;
  mginum: string;
  markertype: string;
  centimorgan: number;
  featuretype: string;
}

export interface ReferenceSNP {
  chr: string;
  start_position: number;
  end_position?: number; // added later
  rsid: string;
}

export interface MusterSearchParameters {
  bq_sample_ids: null;
  genes: string | null; // stringified array
  genes_data: Gene[];
  limit: number;
  mpd_strain_ids: string; // stringified array
  next_region: string | null;
  offset: number;
  query_regions: {
    chromosome: string;
    regions: SNPSearchRegion[];
  }[];
  regions: SNPSearchRegion[];
  rsids: string | null; //stringified array
  rsids_data: ReferenceSNP[];
  strain_limit: number;
  strain_names: null;
  dataset: Dataset;
}

export interface SNPSearchProperties {
  strains: number[];
  strains_b?: number[];
  rsids?: string[];
  regions?: string[];
  assembly: string;
  genes?: string[];
  offset?: number;
  dataset_id?: number;
  is_unique_row?: boolean;
}

export interface GenotypeResults {
  message: string | null;
  next_region: string;
  parameter: MusterSearchParameters;
  snps: SNP[];
  status: string;
  total_rows: number;
}

export enum DatasetStatus {
  Queued = 'queued',
  Loading = 'loading',
  Done = 'done',
  Archived = 'archived',
}

export interface Dataset {
  id: number,
  display_name: string,
  sort_by: number,
  year: string,
  procedure: string,
  panel: string,
  sex: string,
  dataset_name: string,
  source: string,
  status: DatasetStatus,
  num_of_strains: number,
  pubmed: string,
  description: string,
  assembly_version: string,
}
