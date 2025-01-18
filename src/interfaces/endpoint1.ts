export interface Endpoint1Data {
  name: string;
  email: string;
}

export interface Endpoint1Response {
  message: string;
  data?: Endpoint1Data;
}

// Request body for POST /endpoint1
export interface CreateEndpoint1Request {
  name: string;
  email: string;
}