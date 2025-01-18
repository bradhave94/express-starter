export interface Endpoint2Data {
  type: string;
  data: Record<string, unknown>;
}

export interface Endpoint2Response {
  message: string;
  data?: Endpoint2Data;
}

// Request body for POST /endpoint2
export interface CreateEndpoint2Request {
  type: string;
  data: Record<string, unknown>;
}