import { ApiResponse } from '../interfaces/api-response.interface';

export class ResponseUtil {
  static success<T>(
    data: T,
    message: string = 'Success',
    statusCode: number = 200,
  ): ApiResponse<T> {
    return {
      success: true,
      message,
      data,
      statusCode,
    };
  }

  static error(
    message: string = 'Error',
    statusCode: number = 400,
    error?: any,
  ): ApiResponse<null> {
    return {
      success: false,
      message,
      error,
      statusCode,
    };
  }
} 