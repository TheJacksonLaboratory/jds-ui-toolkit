import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subscriber, throwError } from 'rxjs';

import { EventSourceMessage, fetchEventSource } from '@microsoft/fetch-event-source';
// models
import { CollectionResponse, Response } from '../models/response';
import { 
  Input, 
  InputReference, 
  InputSubmission, 
  Result, 
  ResultReference, 
  Run 
} from '../models/asynctask';
import { FatalError, RetriableError } from '../classes/error-types';


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
   * Calls the fetchEventSource() function, which is a wrapper around the native
   * EventSource API. This function is used to establish connection to an API
   * endpoint and listen to event streaming data associated with task runs.
   *
   * @return an observable that emits run events
   */
  getRunEvents(accessToken: string): Observable<Run> {

    // observable constructor argument is 'subscribe()' method implementation
    return new Observable<Run>(
      (subscriber: Subscriber<Run>) => {

        // abort controller to cancel the request (on component destroy)
        const abortController = new AbortController();

        fetchEventSource(`${this.baseUrl}/runs/events`, {
          method: 'GET',
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Authorization': `Bearer ${accessToken}`
          },
          async onopen(response): Promise<void> {
            // check that media type is 'text/event-stream'
            const contentType = response.headers.get('content-type');

            if(!contentType?.startsWith('text/event-stream')) {
              // TODO [GIK 5/13/2025]: fatal error to be handled in G3-631
            }

            // resolve promise (without returning any value)
            if(response.ok && response.status === 200)  return;

            // opening SSE connection failed
            if(response.status >= 400 && response.status < 500 && response.status !== 429) {
              // TODO [GIK 5/13/2025]: fatal error to be handled in G3-631
            }

            // automatically retry on any other non-fatal status
            // TODO [GIK 5/13/2025]: retryable error to be handled in G3-631
          },
          onmessage(event: EventSourceMessage) {
            try {
              const run: Run = JSON.parse(event.data) as Run;

              subscriber.next(run);
            } catch(error ) {
              // TODO [GIK 5/13/2025]: fatal error to be handled in G3-631
            }
          },
          onclose(): void {
            console.log("closing connection");

            subscriber.complete(); // observable completes
          },
          onerror(error: Error): void {
            // TODO [GIK 5/13/2025]: fatal error to be handled in G3-631
          },
          signal: abortController.signal
        }).catch(error => {
          // setup and execution error handling
          // TODO [GIK 5/13/2025]: fatal error to be handled in G3-631
        });

        // cleanup when the observable is unsubscribed
        return () => {
          abortController.abort(); // abort the request
        }

      });
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
