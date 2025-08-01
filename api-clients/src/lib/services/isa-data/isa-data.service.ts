import { Injectable, inject } from '@angular/core';
import { never, Observable, throwError } from 'rxjs';
// services
import { ApiBaseService, ApiBaseServiceFactory } from '../base.service';
// models
import { CollectionResponse, Response } from '../../models/response';
import { ErrorResponse } from '../../models/error';
import { MeasurementSetMetadata, MeasurementSetCharacteristic } from '../../models/isa-data/measurement.model';

@Injectable({
  providedIn: 'root'
})
export class ISADataService {
  private apiBaseUrl = '';

  private apiServiceFactory: ApiBaseServiceFactory = inject(ApiBaseServiceFactory);

  private apiBaseService: ApiBaseService | undefined;

  setApiBaseUrl(baseUrl: string): void {
    this.apiBaseUrl = baseUrl;

    this.apiBaseService = this.apiServiceFactory.create(this.apiBaseUrl);
  }

  getApiBaseUrl(): string {
    return this.apiBaseUrl;
  }

  // MEASUREMENT SETS
  getMeasurementSetMetadata(
    measureIds?: string[],
    measureSeriesId?: string
  ): Observable<Response<MeasurementSetMetadata>> {
    let url = '/measures/metadata';

    // parameters check: either measurementIds or measurementSeriesId must be provided
    if(!measureIds?.length && !measureSeriesId) {
      const errorResponse: ErrorResponse = {
        code: 'INVALID_PARAMETERS',
        num_code: 0,
        message: 'Either \'measureIds\' or \'measureSeriesId\' must be provided.'
      }

      throw errorResponse;
    }

    // measureIds take precedence over measureSeriesId
    if(measureIds?.length) {
      url += `?measureIds=${measureIds.join(',')}`;
    } else {
      url += `?measureSeriesIds=${measureSeriesId}&studyId=740`;
    }

    return this.apiBaseService!.get<MeasurementSetMetadata>(url);
  }

  getMeasurementSetSearchCharacteristics(
    measureIds?: string[],
    measureSeriesId?: string
  ): Observable<CollectionResponse<MeasurementSetCharacteristic>> {
    let url = '/measures/characteristics';

    // parameters check: either measureIds or measureSeriesId must be provided
    if(!measureIds?.length && !measureSeriesId) {
      const errorResponse: ErrorResponse = {
        code: 'INVALID_PARAMETERS',
        num_code: 0,
        message: 'Either \'measureIds\' or \'measureSeriesId\' must be provided.'
      }

      throw errorResponse;
    }

    // measureIds take precedence over measureSeriesId
    if(measureIds?.length) {
      url += `?measureIds=${measureIds.join(',')}`;
    } else {
      url += `?measureSeriesIds=${measureSeriesId}&studyId=740`;
    }

    return this.apiBaseService!.getCollection<MeasurementSetCharacteristic>(url);
  }

  getMeasurementSetData(

  ): void {

  }

  getMeasurementSetById(): void { }

  // ASSAYS: to-be-implemented

  // STUDIES: to-be-implemented

  // INVESTIGATIONS: to-be-implemented

  // HEALTH CHECK
  // TO-DO [GIK 05/30/2025]: should be moved outside this service
  getHealthCheck(): Observable<any> {
    return this.apiBaseService!.get<any>('/monitors/servers/health');
  }
}
