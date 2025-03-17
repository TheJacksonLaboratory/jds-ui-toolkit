import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { CollectionResponse, Response } from '../models/response';
import { 
  Input, 
  InputReference, 
  InputSubmission, 
  Result, 
  ResultReference, 
  Run 
} from '../models/asynctask';

/**
 * Service for interacting with the Async Task API
 * Provides methods for managing inputs, runs, and results
 */
@Injectable({
  providedIn: 'root'
})
export class AsyncTaskService {
  private baseUrl = '/asynctask/api';

  constructor(private http: HttpClient) {}

  /**
   * Configure the base URL for the service
   * @param url - the base URL to use for API requests
   */
  setBaseUrl(url: string): void {
    this.baseUrl = url.endsWith('/') ? url.slice(0, -1) : url;
    
    // Ensure the URL ends with the expected path
    if (!this.baseUrl.endsWith('/asynctask/api')) {
      this.baseUrl = `${this.baseUrl}/asynctask/api`;
    }
  }

  /**
   * Get the current base URL
   */
  getBaseUrl(): string {
    return this.baseUrl;
  }

  // Input methods

  /**
   * Get all inputs
   */
  getInputs(): Observable<CollectionResponse<InputReference>> {
    return this.http.get<CollectionResponse<InputReference>>(`${this.baseUrl}/inputs`);
  }

  /**
   * Create a new input
   * @param inputSubmission - the input data to submit
   */
  addInput(inputSubmission: InputSubmission): Observable<Response<Input>> {
    return this.http.post<Response<Input>>(`${this.baseUrl}/inputs`, inputSubmission);
  }

  /**
   * Get an input by its ID
   * @param inputId - the input ID
   */
  getInput(inputId: number): Observable<Response<Input>> {
    return this.http.get<Response<Input>>(`${this.baseUrl}/inputs/${inputId}`);
  }

  /**
   * Update an input by ID
   * @param inputId - the input ID
   * @param name - optional new name
   * @param description - optional new description
   */
  updateInput(inputId: number, name?: string, description?: string): Observable<Response<InputReference>> {
    let url = `${this.baseUrl}/inputs/${inputId}?`;
    if (name !== undefined) {
      url += `name=${name}&`;
    }
    if (description !== undefined) {
      url += `description=${description}`;
    }
    return this.http.patch<Response<InputReference>>(url, null);
  }

  // Run methods

  /**
   * Get all runs visible to a user
   * @param workflowId - optional workflow ID filter
   */
  getRuns(workflowId?: string): Observable<CollectionResponse<Run>> {
    let url = `${this.baseUrl}/runs`;
    if (workflowId) {
      url += `?workflow_id=${workflowId}`;
    }
    return this.http.get<CollectionResponse<Run>>(url);
  }

  /**
   * Create a new run
   * @param inputId - optional input ID
   * @param inputSubmission - optional input submission data
   */
  createRun(inputId?: number, inputSubmission?: InputSubmission): Observable<Response<Run>> {
    let url = `${this.baseUrl}/runs`;
    if (inputId !== undefined) {
      url += `?input_id=${inputId}`;
    }
    return this.http.post<Response<Run>>(url, inputSubmission || null);
  }

  /**
   * Stream run events
   */
  getRunEvents(): Observable<Run> {
    return this.http.get<Run>(`${this.baseUrl}/runs/events`);
  }

  /**
   * Get a run by its ID
   * @param runId - the run ID
   */
  getRun(runId: number): Observable<Response<Run>> {
    return this.http.get<Response<Run>>(`${this.baseUrl}/runs/${runId}`);
  }

  /**
   * Get a run's results by the run ID
   * @param runId - the run ID
   */
  getRunResults(runId: number): Observable<Response<Result>> {
    return this.http.get<Response<Result>>(`${this.baseUrl}/runs/${runId}/results`);
  }

  /**
   * Get a run's inputs by the run ID
   * @param runId - the run ID
   */
  getRunInputs(runId: number): Observable<Response<Input>> {
    return this.http.get<Response<Input>>(`${this.baseUrl}/runs/${runId}/inputs`);
  }

  // Result methods

  /**
   * Get all results
   */
  getResults(): Observable<CollectionResponse<ResultReference>> {
    return this.http.get<CollectionResponse<ResultReference>>(`${this.baseUrl}/results`);
  }

  /**
   * Get a result by its ID
   * @param resultId - the result ID
   */
  getResult(resultId: number): Observable<Response<Result>> {
    try {
      return this.http.get<Response<Result>>(`${this.baseUrl}/results/${resultId}`);
    } catch (error) {
      return throwError(error);
    }
  }

  /**
   * Update a result by its ID
   * @param resultId - the result ID
   * @param name - optional new name
   * @param description - optional new description
   */
  updateResult(resultId: number, name?: string, description?: string): Observable<Response<ResultReference>> {
    try {
      let url = `${this.baseUrl}/results/${resultId}?`;
      if (name !== undefined) {
        url += `name=${name}&`;
      }
      if (description !== undefined) {
        url += `description=${description}`;
      }
      return this.http.patch<Response<ResultReference>>(url, null);
    } catch (error) {
      return throwError(error);
    }
  }

  /**
   * Get health check status
   */
  getHealthCheck(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/monitors/servers/health`);
  }
}