import type { Request, Response, NextFunction } from 'express';
import * as endpoint2Service from '../services/endpoint2';
import { ApiError } from '../utils/errors';
import { z } from 'zod';
import { prioritySchema } from '../schemas/common';

// Response schema
export const endpoint2DataSchema = z.object({
  id: z.string(),
  type: z.string()
    .regex(/^(task1|task2|task3)$/, 'Task type must be task1, task2, or task3')
    .refine(val => !val.includes('test'), 'Task type cannot include "test" in production'),
  data: z.record(z.unknown()),
  priority: prioritySchema,
  tags: z.array(z.string()).max(10, 'Maximum 10 tags allowed').optional(),
  dryRun: z.boolean().optional(),
  createdAt: z.date()
});

export const endpoint2ResponseSchema = z.object({
  message: z.string(),
  data: endpoint2DataSchema.optional()
});

// Infer response type
export type Endpoint2Response = z.infer<typeof endpoint2ResponseSchema>;
export type Endpoint2Data = z.infer<typeof endpoint2DataSchema>;

export const getData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await endpoint2Service.getData();

    // Validate response data
    const result = endpoint2ResponseSchema.safeParse(data);
    if (!result.success) {
      console.error('Validation errors:', result.error.errors);
      throw ApiError.internal('Invalid response format');
    }

    res.json({
      success: true,
      data: result.data
    });
  } catch (error) {
    next(error);
  }
};

export const createData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await endpoint2Service.createData(req.body);

    // Validate response data
    const result = endpoint2ResponseSchema.safeParse(data);
    if (!result.success) {
      console.error('Validation errors:', result.error.errors);
      throw ApiError.internal('Invalid response format');
    }

    res.status(201).json({
      success: true,
      data: result.data
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('already exists')) {
        next(ApiError.badRequest('Task already exists', 'TASK_EXISTS'));
      } else if (error.message.includes('invalid task type')) {
        next(ApiError.badRequest('Invalid task type', 'INVALID_TASK_TYPE'));
      } else {
        next(error);
      }
    } else {
      next(error);
    }
  }
};
