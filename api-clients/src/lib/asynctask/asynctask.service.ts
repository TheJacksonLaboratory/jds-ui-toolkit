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

@Injectable({
  providedIn: 'root'
})
export class AsyncTaskService {
  private apiBaseUrl = '/asynctask/api';

  private apiServiceFactory: ApiBaseServiceFactory = inject(ApiBaseServiceFactory);

  private apiService: ApiBaseService =
    this.apiServiceFactory.create(this.apiBaseUrl);

  setApiBaseUrl(baseUrl: string): void {
    this.apiBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;

    // ensure the URL ends with '/asynctask/api'
    if(!this.apiBaseUrl.endsWith('/asynctask/api')) {
      this.apiBaseUrl = '/asynctask/api';
    }

    // recreate the apiService
    this.apiService = this.apiServiceFactory.create(this.apiBaseUrl);
  }

  getApiBaseUrl(): string {
    return this.apiBaseUrl;
  }

  // INPUT
  addInput(inputSubmission: InputSubmission): Observable<Response<Input>> {
    return this.apiService.post<Input>('/inputs', inputSubmission);
  }
  getInput(id: number): Observable<Response<Input>> {
    return this.apiService.get<Input>(`/inputs/${id}`);
  }
  getInputs(): Observable<CollectionResponse<InputReference>> {
    return this.apiService.getCollection<InputReference>('/inputs');
  }

  /**
   * Updates an existing input - only 'name' and 'description' can be updated
   * @param inputId
   * @param name - (optional) name to update
   * @param description - (optional) description to update
   */
  updateInput(inputId: number, name?: string, description?: string): Observable<Response<InputReference>> {
    const body: Partial<InputReference> = {};
    if(name) {
      body.name = name;
    }
    if(description) {
      body.description = description;
    }
    return this.apiService.patch<InputReference>(`/inputs/${inputId}`, body);
  }

  // RUN
  createRun(inputId?: number, inputSubmission?: InputSubmission): Observable<Response<Run>> {
    const url = inputId ? `/runs?input_id=${inputId}` : '/runs';

    return this.apiService.post<Run>(url, inputSubmission || null);
  }

  getRun(id: number): Observable<Response<Run>> {
    return this.apiService.get<Run>(`/runs/${id}`);
  }

  /**
   *
   * @param workflowId - (optional) workflow identifier
   */
  getRuns(workflowId?: string): Observable<CollectionResponse<Run>> {
    const url = workflowId ? `/runs?workflow_id=${workflowId}` : '/runs';

    return this.apiService.getCollection<Run>(url);
  }

  /**
   * Gets the input associated with the specific run ID. One run is associated
   * with only one input, so this function returns a single input object.
   * @param runId
   */
  getRunInput(runId: number): Observable<Response<Input>> {
    return this.apiService.get<Input>(`/runs/${runId}/inputs`);
  }

  /**
   * Gets the result associated with the specific run ID. One run is associated
   * with only one result, so this function returns a single result object.
   * @param runId
   */
  getRunResult(runId: number): Observable<Response<Result>> {
    return this.apiService.get<Result>(`/runs/${runId}/results`);
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

        fetchEventSource(`${this.apiBaseUrl}/runs/events`, {
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

  // RESULT
  getResult(resId: number): Observable<Response<Result>> {
    return this.apiService.get<Result>(`/results/${resId}`);
  }

  getResults(): Observable<CollectionResponse<ResultReference>> {
    return this.apiService.getCollection<ResultReference>('/results');
  }

  /**
   * Updates an existing result record - only 'name' and 'description' can be updated
   * @param resId
   * @param name - (optional) result's name to update
   * @param description - (optional) result's description to update
   */
  updateResult(resId: number, name?: string, description?: string): Observable<Response<ResultReference>> {
    const body: Partial<ResultReference> = {};
    if(name) {
      body.name = name;
    }
    if(description) {
      body.description = description;
    }
    return this.apiService.patch<ResultReference>(`/results/${resId}`, body);
  }

  // HEALTH CHECK
  // TO-DO [GIK 05/30/2025]: needs to be moved outside this service to another
  getHealthCheck(): Observable<any> {
    return this.apiService.get<any>('/monitors/servers/health');
  }
}