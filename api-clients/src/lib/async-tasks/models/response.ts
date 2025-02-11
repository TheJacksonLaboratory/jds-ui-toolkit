import { BaseResponse } from './base-response';
import { Paging } from './paging';

export interface Response<T> extends BaseResponse {
  object?: T;
}

export interface CollectionResponse<T> extends BaseResponse {
  data: T[];
  paging?: Paging;
}