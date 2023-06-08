export interface SearchParam {
  offset: number;
  limit: number;
  startDate: Date;
  endDate: Date;
}

export interface PageData<T> {
  pageNum: number;
  pageSize: number;
  total: number;
  data: T[];
}

/** Response Data Model **/
export type Response<T = any> = {
  code: string;
  message: string;
  success: boolean;
  data: T;
};

export interface ListResponseData<T = any> {
  limit: string,
  offset: number,
  totalElements: 0,
  totalPages: 0,
  rows: T[],
}

export enum WorkStatus {
  IDE = 1,
  IN_PROGRESS,
  SUCCESS,
  ERROR
}
