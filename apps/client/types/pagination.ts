export interface Pagination {
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface PaginationMeta extends Pagination {
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}

export interface PaginatedResponseWithMeta<T> {
  data: T[];
  pagination: PaginationMeta;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  status?: string;
  success?: boolean;
}

export interface ApiPaginatedResponse<T> {
  data: {
    data: T[];
    pagination: Pagination;
  };
  message?: string;
  status?: string;
  success?: boolean;
}

export interface ApiPaginatedResponseWithMeta<T> {
  data: {
    data: T[];
    pagination: PaginationMeta;
  };
  message?: string;
  status?: string;
  success?: boolean;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}
