import type { Request, Response, NextFunction } from 'express';
import * as endpoint1Service from '../services/endpoint1';
import { ApiError } from '../utils/errors';
import { z } from 'zod';
import { nameSchema, emailSchema } from '../schemas/common';

// Response schema
export const endpoint1DataSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  category: z.string().optional(),
  createdAt: z.date().optional(),
  id: z.string().optional()
});

export const endpoint1ResponseSchema = z.object({
  message: z.string(),
  data: endpoint1DataSchema.optional()
});

// Infer response type
export type Endpoint1Response = z.infer<typeof endpoint1ResponseSchema>;
export type Endpoint1Data = z.infer<typeof endpoint1DataSchema>;

export const getData = async () => {
  const data = await endpoint1Service.getData();

  // Validate response data
  const result = endpoint1ResponseSchema.safeParse(data);
  if (!result.success) {
    console.error('Validation errors:', result.error.errors);
    throw ApiError.internal('Invalid response format');
  }

  return {
    success: true,
    data: result.data
  };
};

export const createData = async (data: Endpoint1Data) => {
  const response = await endpoint1Service.createData(data);

  // Validate response data
  const result = endpoint1ResponseSchema.safeParse(response);
  if (!result.success) {
    console.error('Validation errors:', result.error.errors);
    throw ApiError.internal('Invalid response format');
  }

  return {
    success: true,
    data: result.data
  };
};
