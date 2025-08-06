import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
// services
import { ApiBaseService, ApiBaseServiceFactory } from '../base.service';
// models
import { Response } from '../../models/response';
import { ErrorResponse } from '../../models/error';
import {
  MeasureSeriesMetadata,
  MeasureMetadata,
  IsaCharacteristic
} from '../../models/isa-data/measure.model';
// tokens
import {
  ISA_DATA_SERVICE_CONFIG,
  IsaDataServiceConfig
} from '../../tokens/isa-data-config.token';

/**
 * service for interacting with ISA (Investigation-Study-Assay) data model API.
 */
@Injectable({
  providedIn: 'root'
})
export class ISADataService {
  private readonly apiConfig: IsaDataServiceConfig = inject(ISA_DATA_SERVICE_CONFIG);
  private readonly apiServiceFactory: ApiBaseServiceFactory = inject(ApiBaseServiceFactory);
  private readonly apiBaseService: ApiBaseService;

  constructor() {
    this.apiBaseService = this.apiServiceFactory.create(this.apiConfig.baseUrl);
  }

  getApiBaseUrl(): string {
    return this.apiConfig.baseUrl;
  }

  // measure operations

  /**
   * Fetches measure series metadata for the given measure series IDs and study IDs.
   *
   * @param measureSeriesIds - measure series identifiers to fetch metadata for. ONLY ONE ID IS SUPPORTED.
   * @param studyIds - ONLY ONE ID IS SUPPORTED. REQUIRED!! WILL BE REMOVED IN THE FUTURE.
   *
   * @return Observable<Response<MeasureSeriesMetadata>> - an observable containing the measure series metadata.
   */
  getMeasureSeriesMetadata(measureSeriesIds: string[], studyIds: string[]) :
    Observable<Response<MeasureSeriesMetadata>> {
    if(!measureSeriesIds?.length) {
      const errorResponse: ErrorResponse = {
        code: 'BAD_REQUEST',
        num_code: 400,
        message: 'missing required parameter: measureSeriesIds',
      }

      throw errorResponse;
    }

    const url = this.buildUrl('/measures/metadata', {
      measureSeriesIds: measureSeriesIds.join(','),
      studyId: studyIds.join(',')
    });

    return this.apiBaseService.get<MeasureSeriesMetadata>(url);
  }

  /**
   * THIS METHOD SHOULD NOT BE USED. PLACEHOLDER FOR FUTURE IMPLEMENTATION ONCE THE API GROWS.
   */
  getMeasuresMetadata(measureIds: string[], studyIds: string[]) :
    Observable<Response<MeasureMetadata>>  {
    const reqUrl = '';
    return this.apiBaseService.get<MeasureMetadata>(reqUrl);
  }

  /**
   * Fetches measure series characteristics for the given measure series IDs and study IDs.
   *
   * @param measureSeriesIds - measure series identifiers to fetch metadata for. ONLY ONE ID IS SUPPORTED.
   * @param studyIds - ONLY ONE ID IS SUPPORTED. REQUIRED!! WILL BE REMOVED IN THE FUTURE.
   *
   * @return Observable<Response<MeasureSeriesMetadata>> - an observable containing the measure series metadata.
   */
  getMeasureSeriesCharacteristics(measureSeriesIds: string[], studyIds: string[]) :
    Observable<Response<IsaCharacteristic>> {
    if(!measureSeriesIds?.length) {
      const errorResponse: ErrorResponse = {
        code: 'BAD_REQUEST',
        num_code: 400,
        message: 'missing required parameter: measureSeriesIds',
      };

      throw errorResponse;
    }

    const url = this.buildUrl('/measures/characteristics', {
      measureSeriesIds: measureSeriesIds.join(','),
      studyIds: studyIds.join(',')
    });

    return this.apiBaseService.get(url);
  }

  // ASSAYS: to-be-implemented

  /**
   * Placeholder for assay operations
   * TODO: Implement assay-related methods
   */

  // STUDIES: to-be-implemented

  /**
   * Placeholder for study operations
   * TODO: Implement study-related methods
   */

  // INVESTIGATIONS: to-be-implemented

  /**
   * Placeholder for investigation operations
   * TODO: Implement investigation-related methods
   */

  /**
   * Builds the URL for the ISA data service.
   *
   * @param endpoint - the API endpoint path.
   * @param params - optional query parameters as key-value pairs.
   *
   * @return complete URL with query string parameters.
   */
  private buildUrl(endpoint: string, params: Record<string, string>) {
    const queryParams = new URLSearchParams(params).toString();

    return queryParams ? `${endpoint}?${queryParams}` : endpoint;
  }

  // private buildUrl(path: string, params?: Record<string, string | number | boolean>): string {
  //  let url = `$


  // HEALTH CHECK
  // TO-DO [GIK 05/30/2025]: should be moved outside this service
  getHealthCheck(): Observable<any> {
    return this.apiBaseService!.get<any>('/monitors/servers/health');
  }
}
