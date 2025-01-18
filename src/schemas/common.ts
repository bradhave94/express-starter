import { z } from 'zod';

// Common field schemas
export const emailSchema = z.string()
  .email('Invalid email format')
  .max(100, 'Email cannot exceed 100 characters');

export const nameSchema = z.string()
  .min(2, 'Name must be at least 2 characters')
  .max(100, 'Name cannot exceed 100 characters');

export const prioritySchema = z.number()
  .int('Priority must be an integer')
  .min(1, 'Priority must be at least 1')
  .max(5, 'Priority must be at most 5')
  .optional()
  .default(3);

// Common object schemas
export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20)
});

export const timestampsSchema = z.object({
  createdAt: z.date(),
  updatedAt: z.date()
});

// Common response schemas
export const errorSchema = z.object({
  success: z.literal(false),
  error: z.object({
    status: z.number(),
    message: z.string(),
    errors: z.array(z.object({
      field: z.string(),
      message: z.string()
    })).optional()
  })
});

// Generic success response schema builder
export const successSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.literal(true),
    data: dataSchema
  });

// Utility types
export type PaginationParams = z.infer<typeof paginationSchema>;
export type ErrorResponse = z.infer<typeof errorSchema>;
export type SuccessResponse<T extends z.ZodTypeAny> = {
  success: true;
  data: z.infer<T>;
};
