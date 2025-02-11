export interface BaseResponse {
  errors?: Error[];
  info?: Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
}