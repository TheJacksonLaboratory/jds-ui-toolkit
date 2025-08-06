import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';

// models
import { ErrorResponse } from './../models/error';
import { Response, CollectionResponse } from './../models/response';

@Injectable({
  providedIn: 'root'
})
export class ApiBaseServiceFactory {
  constructor(private http: HttpClient) { }

  create(baseUrl: string): ApiBaseService {
    return new ApiBaseService(this.http, baseUrl);
  }
}

export class ApiBaseService {
  constructor(
    private http: HttpClient,
    private baseUrl: string,
  ) {}

  /**
   * Handles API response errors and HTTP errors
   * @param response The API response
   * @private
   */
  private handleResponse<T>(
    response: Response<T> | CollectionResponse<T>,
  ): Response<T> | CollectionResponse<T> {
    if(response.errors) {
      // TO-DO: [GIK 6/6/2025] once the API service has the capabilities to respond
      // with meaningful validation and analytical errors, this will need to be
      // updated to typecast these into the ErrorResponse model and rethrow the error object
      throw new Error(response.errors.join(', '));
    }
    return response;
  }

  /**
   * Handles HTTP errors by catching them and rethrowing a consistent
   * error response that contains an error code, numeric code, and
   * a user-friendly message.
   * TO-DO: [GIK 6/10/2025] consider adding error logging capabilities to an external service
   * @param error an error object, typically an HttpErrorResponse
   * @returns an Observable that emits an ErrorResponse object
   */
  private handleHttpError(error: any): Observable<never> {
    let errorResponse: ErrorResponse;

    // errors returned on the Observable response stream
    // will be wrapped in an HttpErrorResponse class
    if(error.name === 'HttpErrorResponse') {
      errorResponse = {
        code: error.statusText || 'HTTP_ERROR',
        num_code: error.status,
        message: this.getErrorMessage(error),
      };
    } else {
      errorResponse = {
        code: 'UNKNOWN_ERROR',
        num_code: 0,
        message: error.message || 'An unknown error occurred',
      }
    }

    return throwError(() => errorResponse);
  }

  /**
   * Get a user-friendly error message based on the HTTP status code
   *
   * @param error
   * @return a string containing the error message
   */
  getErrorMessage(error: HttpErrorResponse): string {
    switch(error.status) {
      case 400:
        return 'Bad request - malformed request syntax or invalid parameters';
        break;
      case 401:
        return 'Unauthorized - authentication required or invalid credentials';
        break;
      case 403:
        return 'Forbidden - the authenticated user does not have permission to perform the operation';
        break;
      case 404:
        return 'Not found - the requested resource does not exist';
        break;
      case 422:
        return 'Unprocessable content - the request is correctly formed but contained semantic errors';
        break;
      case 500:
        return 'Internal Server Error - generic server-side error';
        break;
      default:
        return `Unexpected error occurred - status code: ${error.status}`;
    }
  }

  /**
   * Get a single resource
   * @param url The endpoint URL
   * @param params Optional query parameters
   */
  get<T>(url: string, params?: HttpParams): Observable<Response<T>> {
    return this.http.get<Response<T>>(`${this.baseUrl}${url}`, { params }).pipe(
      map((response) => this.handleResponse(response)),
      catchError((error) => this.handleHttpError(error)),
    );
  }

  /**
   * Get a collection of resources
   * @param url The endpoint URL
   * @param params Optional query parameters
   */
  private handleCollectionResponse<T>(
    response: CollectionResponse<T>,
  ): CollectionResponse<T> {
    if (response.errors) {
      throw new Error(response.errors.join(', '));
    }
    return response;
  }

  getCollection<T>(
    url: string,
    params?: HttpParams,
  ): Observable<CollectionResponse<T>> {
    return this.http
      .get<CollectionResponse<T>>(`${this.baseUrl}${url}`, { params })
      .pipe(
        map((response) => this.handleCollectionResponse(response)),
        catchError((error) => this.handleHttpError(error)),
      );
  }

  /**
   * Create a new resource
   * @param url The endpoint URL
   * @param body The resource to create
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  post<T>(url: string, body: any): Observable<Response<T>> {
    return this.http.post<Response<T>>(`${this.baseUrl}${url}`, body).pipe(
      map((response) => this.handleResponse(response)),
      catchError((error) => this.handleHttpError(error)),
    );
  }

  /**
   * Update an existing resource
   * @param url The endpoint URL
   * @param body The resource updates
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  put<T>(url: string, body: any): Observable<Response<T>> {
    return this.http.put<Response<T>>(`${this.baseUrl}${url}`, body).pipe(
      map((response) => this.handleResponse(response)),
      catchError((error) => this.handleHttpError(error)),
    );
  }

  /**
   * Partially update an existing resource
   * @param url The endpoint URL
   * @param body The partial resource updates
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  patch<T>(url: string, body: any): Observable<Response<T>> {
    return this.http.patch<Response<T>>(`${this.baseUrl}${url}`, body).pipe(
      map((response) => this.handleResponse(response)),
      catchError((error) => this.handleHttpError(error)),
    );
  }

  /**
   * Delete a resource
   * @param url The endpoint URL
   */
  delete<T>(url: string): Observable<Response<T>> {
    return this.http.delete<Response<T>>(`${this.baseUrl}${url}`).pipe(
      map((response) => this.handleResponse(response)),
      catchError((error) => this.handleHttpError(error)),
    );
  }
}
