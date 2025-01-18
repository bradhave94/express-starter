export interface ErrorResponse {
  status: number;
  message: string;
  errors?: any[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ErrorResponse;
}

export interface RequestWithRateLimit extends Express.Request {
  rateLimit?: {
    remaining: number;
    limit: number;
    reset: Date;
  };
}