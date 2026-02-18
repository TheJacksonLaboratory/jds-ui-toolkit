import { Injectable, inject } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { catchError, map, Observable } from "rxjs";

import {
  Dataset, DatasetStatus,
  Gene, GenotypeResults,
  MusterHealthCheck,
  MusterMetadata,
  ReferenceSNP,
  SNPSearchProperties,
  Strain
} from './models/response/dtos';
import { SNPSearchRegion } from '../mvar/models/response/dtos';
import { SNP_GRID_SERVICE_CONFIG, SnpGridServiceConfig } from '../../tokens/snp-grid-config.token';

@Injectable({
  providedIn: 'root'
})
export class SnpGridService {
  private readonly config: SnpGridServiceConfig = inject(SNP_GRID_SERVICE_CONFIG);
  private readonly http = inject(HttpClient);

  private api: string;

  constructor() {
    this.api = this.config.apiUrl;
  }

  /**
   * Returns the result of a health check for the API
   */
  getHealthCheck(): Observable<MusterHealthCheck> {
    return this.http.get<MusterHealthCheck>(`${this.api}/healthcheck`);
  }

  /**
   * Returns the metadata on the MUSter DB
   */
  getMusterMetadata(): Observable<MusterMetadata> {
    return this.http.get<MusterMetadata>(`${this.api}/db_info`).pipe(
      catchError((err) => {
        throw err;
      }),
    );
  }

  /**
   * Returns strains available in the API and takes an optional limit; by default the limit is set
   * to 5000 to get all strains
   * @param limit - maximum number of strains to be returned
   */
  getStrains(limit = 5000): Observable<Strain[]> {
    return this.http.get<Strain[]>(`${this.api}/strains/?limit=${limit}`).pipe(
      map((strains) => strains.filter((s) => s.mpd_strainid))
    );
  }

  /**
   * Returns a list of known genes whose symbols/coordinates start with the specified value.
   * @param searchValue - value to use for the "starts with" filter
   * @param limit - maximum number of genes to return, default is 20
   */
  getGenes(searchValue: string, limit = 20): Observable<Gene[]> {
    return this.http.get<Gene[]>(`${this.api}/genes/?symbol=${searchValue}%&limit=${limit}`);
  }

  /**
   * Returns the gene that matches the specified gene symbol
   * @param geneSymbol - symbol to use to get the associated gene info
   */
  getGene(geneSymbol: string): Observable<Gene | null> {
    return this.http
      .get<Gene[]>(`${this.api}/genes/?symbol=${geneSymbol}`)
      .pipe(map((genes) => (genes.length ? genes[0] : null)));
  }

  /**
   * Returns true if the specified gene symbol is valid from the perspective of MUSter
   * @param geneSymbol - symbol to use to check the validity of
   */
  isGeneSymbolValid(geneSymbol: string): Observable<boolean> {
    return this.getGene(geneSymbol).pipe(
      map((g: Gene | null) => g !== null && geneSymbol.toLowerCase() === g.symbol.toLowerCase()),
    );
  }

  /**
   * Returns list of known reference SNP (RS) data which includes IDs and coordinates
   * @param searchValue - value to use to filter the search results
   * @param limit - maximum number of results to return, default is 20
   */
  getReferenceSNPs(searchValue: string, limit = 20): Observable<ReferenceSNP[]> {
    return this.http.get<ReferenceSNP[]>(`${this.api}/rsids/?rsid=${searchValue}%&limit=${limit}`);
  }

  /**
   * Returns the RS info that matches the specified rsID
   * @param rsid - the RSID to use to get the associated RS info
   */
  getReferenceSNP(rsid: string): Observable<ReferenceSNP | null> {
    return this.http
      .get<ReferenceSNP[]>(`${this.api}/rsids/?rsid=${rsid}`)
      .pipe(map((rsids) => (rsids.length ? { ...rsids[0], end_position: rsids[0].start_position } : null)));
  }

  /**
   * Returns true if the specified rsID is valid from the perspective of MUSter
   * @param rsid - rsID to use to check the validity of
   */
  isRSIDValid(rsid: string): Observable<boolean> {
    return this.getReferenceSNP(rsid).pipe(
      map((rs: ReferenceSNP | null) => rs !== null && rsid.toLowerCase() === rs.rsid.toLowerCase()),
    );
  }

  /**
   * Returns the SNP results generated from the query constructed from the specified parameters and page
   * @param parameters - search properties (strain IDs, regions, assembly version, etc.)
   * @param page - requested page, which is 0-indexed. The 0th page is the initial page
   * @param pageSize - number of records to show per page. Default of 5000
   */
  getGenotypes(parameters: SNPSearchProperties, page = 0, pageSize = 5000): Observable<GenotypeResults> {
    let constructedURL =
      `${this.api}/snps/?` +
      `assembly=${parameters.assembly}&` +
      `mpd_strain_ids=${parameters.strains.join(',')}&` +
      `limit=${pageSize}`;

    if (parameters.strains_b?.length) {
      constructedURL += `&mpd_strain_ids_b=${parameters.strains_b.join(',')}&strain_limit=${parameters.strains.length + parameters.strains_b.length}`;
    } else {
      constructedURL += `&strain_limit=${parameters.strains.length}`
    }

    if (parameters.rsids?.length) {
      constructedURL += `&rsids=${parameters.rsids.join(',')}`;
    }

    if (parameters.genes?.length) {
      constructedURL += `&genes=${parameters.genes.join(',')}`;
    }

    if (parameters.regions?.length) {
      constructedURL += `&regions=${parameters.regions.join(',')}`;
    }

    if (parameters.dataset_id) {
      constructedURL += `&dataset_id=${parameters.dataset_id}`;
    }

    if (parameters.is_unique_row) {
      constructedURL += `&is_unique_row=${parameters.is_unique_row}`;
    }

    if (page) {
      constructedURL += `&offset=${pageSize * page}`;
    }

    return this.http.get<GenotypeResults>(constructedURL);
  }

  /**
   * Returns the URL that will generate a download (in file form) for the specified strain IDs and regions
   * @param strains - list of mpd_strain_ids to query SNPs for
   * @param regions - list of SNPSearchRegions to query SNPs for (chromosome, start and end)
   * @param dataset_id - ID of the dataset to query SNPs for
   * @param is_unique_row - boolean for polymorphism filtering - true for only rows with polymorphism, false for all
   * @param limit - the limit of the number of result rows to include in the download - you're likely to
   *                prefer to pass the total number of rows generated by the query itself, which is included
   *                as part of the GenotypeResults returned by getGenotypes()
   */
  getGenotypeDownloadURLForCurrentData(strains: number[], regions: SNPSearchRegion[], dataset_id: number | undefined, is_unique_row = false,  limit: number): string {
    if (!dataset_id) {
      // default to the GenomeMuster dataset id
      dataset_id = 2;
    }
    const stringifiedRegions = `regions=${regions
      .map((reg) => `${reg.chromosome}:${reg.start_position}-${reg.end_position}`)
      .join(',')}`;
    const stringifiedStrains = `mpd_strain_ids=${strains.join(',')}`;
    return `${this.api}/snps/download?dataset_id=${dataset_id}&${stringifiedStrains}&${stringifiedRegions}&limit=${limit}&is_unique_row=${is_unique_row}`;
  }

  /**
   * Returns the dataset with the given ID
   * @param id
   */
  getDataset(id: number): Observable<Dataset> {
    return this.http.get<Dataset>(`${this.api}/datasets/${id}`)
  }

  /**
   * Returns a list of Datasets that match the given criteria
   * @param status  The value of the status to be used for filtering
   * @param limit   The maximum number of records to return
   */
  findDatasets(status: DatasetStatus, limit = 50): Observable<Dataset[]> {
    let url = `${this.api}/datasets`;
    url += `/?limit=${limit}`;
    if (status) {
      url += `&status=${status}`;
    }
    return this.http.get<Dataset[]>(url);
  }

  /**
   * Return a list of strains that match the given criteria
   * @param datasetId  The ID of the dataset from which to fetch the strains
   * @param limit      The maximum number of records to return
   */
  datasetStrains(datasetId: number, limit = 5000): Observable<Strain[]> {
    const url = `${this.api}/dataset_strain/?dataset_id=${datasetId}&limit=${limit}`;
    return this.http.get<Strain[]>(url);
  }

}
