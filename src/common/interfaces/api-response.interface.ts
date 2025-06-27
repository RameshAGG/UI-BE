export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T | null;
  error?: any;  // For error details if success=false
  statusCode: number;
  meta?: {      // For pagination and other metadata
    total: number;
    offset: number;
    limit: number;
    hasMore?: boolean; // Useful for clients
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