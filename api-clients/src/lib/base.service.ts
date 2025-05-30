import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
// models
import { Response, CollectionResponse } from './models/response';

@Injectable({
  providedIn: 'root'
})
export class ApiBaseServiceFactory {
  constructor(private http: HttpClient) {}

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
    if (response.errors) {
      throw new Error(response.errors.join(', '));
    }
    return response;
  }

  /**
   * Handles HTTP errors
   * @param error The HTTP error
   * @private
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private handleError(error: any) {
    let errorMessage = 'An unknown error occurred';
    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    // You can customize error handling here (e.g., show toast, log to service)
    console.error('API Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  /**
   * Get a single resource
   * @param url The endpoint URL
   * @param params Optional query parameters
   */
  get<T>(url: string, params?: HttpParams): Observable<Response<T>> {
    return this.http.get<Response<T>>(`${this.baseUrl}${url}`, { params }).pipe(
      map((response) => this.handleResponse(response)),
      catchError((error) => this.handleError(error)),
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
        catchError((error) => this.handleError(error)),
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
      catchError((error) => this.handleError(error)),
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
      catchError((error) => this.handleError(error)),
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
      catchError((error) => this.handleError(error)),
    );
  }

  /**
   * Delete a resource
   * @param url The endpoint URL
   */
  delete<T>(url: string): Observable<Response<T>> {
    return this.http.delete<Response<T>>(`${this.baseUrl}${url}`).pipe(
      map((response) => this.handleResponse(response)),
      catchError((error) => this.handleError(error)),
    );
  }
}
