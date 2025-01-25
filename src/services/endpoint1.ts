import type { Endpoint1Response, Endpoint1Data } from '../controllers/endpoint1';

export const getData = async (): Promise<Endpoint1Response> => {
  return {
    message: 'Endpoint 1 data',
    data: {
      id: crypto.randomUUID(),
      name: 'John Doe',
      email: 'john@example.com',
      category: 'general',
      createdAt: new Date()
    }
  };
};

export const createData = async (data: Endpoint1Data): Promise<Endpoint1Response> => {
  // Implement your business logic here
  return {
    message: 'Data created successfully',
    data: {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date()
    }
  };
};
