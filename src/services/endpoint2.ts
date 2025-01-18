import type { Endpoint2Response, Endpoint2Data } from '../controllers/endpoint2';

export const getData = async (): Promise<Endpoint2Response> => {
  // Implement your business logic here
  return {
    message: 'Endpoint 2 data',
    data: {
      id: crypto.randomUUID(),
      type: 'task1',
      data: { status: 'pending' },
      priority: 3,
      tags: ['api', 'task'],
      createdAt: new Date()
    }
  };
};

export const createData = async (data: Endpoint2Data): Promise<Endpoint2Response> => {
  // Validate task type
  if (!['task1', 'task2', 'task3'].includes(data.type)) {
    throw new Error('invalid task type');
  }

  // Handle dry run if requested
  if (data.dryRun) {
    return {
      message: 'Dry run successful',
      data: {
        ...data,
        id: 'dry-run-id',
        createdAt: new Date()
      }
    };
  }

  // Implement your business logic here
  return {
    message: 'Task created successfully',
    data: {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date()
    }
  };
};
