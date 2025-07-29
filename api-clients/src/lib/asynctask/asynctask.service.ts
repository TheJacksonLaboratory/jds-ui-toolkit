import { Injectable, inject } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';
import { fetchEventSource, EventSourceMessage } from '@microsoft/fetch-event-source';
// services
import { ApiBaseService, ApiBaseServiceFactory } from '../base.service';
// models
import {
  Input,
  InputReference,
  InputSubmission,
  Result,
  ResultReference,
  Run
} from './asynctask.model';
import { CollectionResponse, Response } from '../models/response';
import { ErrorResponse } from '../models/error';

@Injectable({
  providedIn: 'root'
})
export class AsyncTaskService {
  // TO-DO [GIK 7/9/2025]: move 'https://astra-dev.jax.org' to an environment variable
  private apiBaseUrl = '/asynctask/api';

  private apiServiceFactory: ApiBaseServiceFactory = inject(ApiBaseServiceFactory);

  private apiBaseService: ApiBaseService =
    this.apiServiceFactory.create(this.apiBaseUrl);

  setApiBaseUrl(baseUrl: string): void {
    this.apiBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;

    // ensure the URL ends with '/asynctask/api'
    if(!this.apiBaseUrl.endsWith('asynctask/api')) {
      this.apiBaseUrl = `${this.apiBaseUrl}/asynctask/api`;
    }

    // recreate the apiService
    this.apiBaseService = this.apiServiceFactory.create(this.apiBaseUrl);
  }

  getApiBaseUrl(): string {
    return this.apiBaseUrl;
  }

  // INPUT
  addInput(inputSubmission: InputSubmission): Observable<Response<Input>> {
    return this.apiBaseService.post<Input>('/inputs', inputSubmission);
  }
  getInput(id: number): Observable<Response<Input>> {
    return this.apiBaseService.get<Input>(`/inputs/${id}`);
  }
  getInputs(): Observable<CollectionResponse<InputReference>> {
    return this.apiBaseService.getCollection<InputReference>('/inputs');
  }

  /**
   * Updates an existing input - only 'name' and 'description' can be updated
   * @param inputId
   * @param name - (optional) name to update
   * @param description - (optional) description to update
   */
  updateInput(inputId: number, name?: string, description?: string): Observable<Response<InputReference>> {
    let url = `/inputs/${inputId}?`;
    if(name !== undefined) {
      url += `name=${name}&`;
    }
    if(description !== undefined) {
      url += `description=${description}`;
    }

    return this.apiBaseService.patch<InputReference>(url, null);
  }

  // RUN
  createRun(inputId?: number, inputSubmission?: InputSubmission): Observable<Response<Run>> {
    const url = inputId ? `/runs?input_id=${inputId}` : '/runs';

    return this.apiBaseService.post<Run>(url, inputSubmission || null);
  }

  getRun(id: number): Observable<Response<Run>> {
    return this.apiBaseService.get<Run>(`/runs/${id}`);
  }

  /**
   *
   * @param workflowId - (optional) workflow identifier
   */
  getRuns(workflowId?: string): Observable<CollectionResponse<Run>> {
    const url = (workflowId ? `/runs?workflow_id=${workflowId}` : '/runs');

    return this.apiBaseService.getCollection<Run>(url);
  }

  /**
   * Gets the input associated with the specific run ID. One run is associated
   * with only one input, so this function returns a single input object.
   * @param runId
   */
  getRunInput(runId: number): Observable<Response<Input>> {
    return this.apiBaseService.get<Input>(`/runs/${runId}/inputs`);
  }

  /**
   * Gets the result associated with the specific run ID. One run is associated
   * with only one result, so this function returns a single result object.
   * @param runId
   */
  getRunResult(runId: number): Observable<Response<Result>> {
    return this.apiBaseService.get<Result>(`/runs/${runId}/results`);
  }

  /**
   * Calls the fetchEventSource() function, which is a wrapper around the native
   * EventSource API. This function is used to establish connection to an API
   * endpoint and listen to event streaming data associated with task runs.
   * TO-DO [GIK 7/9/2025]: needs to add a reconnect logic
   * @return an observable that emits run events
   */
  getRunEvents(accessToken: string): Observable<Run> {
    const api = this.apiBaseService
    // observable constructor argument is 'subscribe()' method implementation
    return new Observable<Run>(
      (subscriber: Subscriber<Run>) => {
        // abort controller to cancel the request (on component destroy)
        const abortController = new AbortController();

        fetchEventSource(`${this.apiBaseUrl}/runs/events`, {
          method: 'GET',
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Authorization': `Bearer ${accessToken}`
          },

          async onopen(response): Promise<void> {
            // SSE media type must be 'text/event-stream'
            const contentType = response.headers.get('content-type');

            if(!contentType?.startsWith('text/event-stream')) {
              const errorResponse: ErrorResponse = {
                code: 'INVALID_CONTENT_TYPE',
                num_code: response.status,
                message: `Expected content-type to be text/event-stream, but got: ${contentType}`
              };
              throw errorResponse;
            }

            // resolve promise (without returning anything), which indicates that the connection is open
            if(response.ok && response.status === 200)  return;

            // opening SSE connection failed
            if(response.status >= 400 && response.status < 500 && response.status !== 429) {
              const errorResponse: ErrorResponse = {
                code: 'RESOURCE_NOT_FOUND',
                num_code: response.status,
                message: 'Resource not found or access denied'
              }
              throw errorResponse;
            }
          },
          onmessage(event: EventSourceMessage) {
            try {
              const run: Run = JSON.parse(event.data) as Run;
              subscriber.next(run);
            } catch(error) {
              const errorResponse: ErrorResponse = {
                code: 'PARSE_ERROR',
                num_code: 0,
                message: `Failed to parse event data: ${event.data}`
              }
              throw errorResponse;
            }
          },
          onclose(): void {
            subscriber.complete();
          },
          onerror(errorRes: ErrorResponse): void {
            // send an error message to subscriber's error handler
            subscriber.error(errorRes);
            // rethrow the error to stop the operation
            throw errorRes;
          },
          signal: abortController.signal
        });

        return () => {
          abortController.abort(); // close connection on unsubscribe
        }
      });
  }

  // RESULT
  getResult(resId: number): Observable<Response<Result>> {
    return this.apiBaseService.get<Result>(`/results/${resId}`);
  }

  getResults(): Observable<CollectionResponse<ResultReference>> {
    return this.apiBaseService.getCollection<ResultReference>('/results');
  }

  /**
   * Updates an existing result record - 'name' and 'description' can be updated
   * @param resId
   * @param name - (optional) result's name to update
   * @param description - (optional) result's description to update
   */
  updateResult(resId: number, name?: string, description?: string): Observable<Response<ResultReference>> {
    let url = `/results/${resId}?`;
    if(name !== undefined) {
      url += `name=${name}&`;
    }
    if(description !== undefined) {
      url += `description=${description}`;
    }
    
    return this.apiBaseService.patch<ResultReference>(url, null);
  }

  // HEALTH CHECK
  // TO-DO [GIK 05/30/2025]: should be moved outside this service
  getHealthCheck(): Observable<any> {
    return this.apiBaseService.get<any>('/monitors/servers/health');
  }
}
