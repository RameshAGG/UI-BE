export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?:  T | null;
  error?: any;
  statusCode: number;
    meta?: {
    total: number;
    offset: number;
    limit: number;
  };
} 

export interface ApiResponses<T> {
  success: boolean;
  message: string;
  data?: T | null;
  statusCode: number;
  pagination?: {
    total: number;
    offset: number;
    limit: number;
  };
}