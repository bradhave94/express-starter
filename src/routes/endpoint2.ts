import { Router } from 'express';
import * as endpoint2Controller from '../controllers/endpoint2';
import { formLimiter, sanitizeResponse } from '../middleware/security';
import { z } from 'zod';
import type { Request, Response, NextFunction } from 'express';
import { prioritySchema } from '../schemas/common';
import { ValidationError } from '../utils/errors';

// Define Zod schema for endpoint2
const endpoint2Schema = z.object({
  type: z.string()
    .regex(/^(task1|task2|task3)$/, 'Task type must be task1, task2, or task3')
    .refine(val => !val.includes('test'), 'Task type cannot include "test" in production'),
  data: z.record(z.unknown()),  // object with any properties
  priority: prioritySchema,
  tags: z.array(z.string()).max(10, 'Maximum 10 tags allowed').optional(),
  dryRun: z.boolean().optional()
});

// Infer TypeScript type from schema
type Endpoint2Input = z.infer<typeof endpoint2Schema>;

// Zod validation middleware
const validateEndpoint2 = (req: Request, res: Response, next: NextFunction) => {
  const result = endpoint2Schema.safeParse(req.body);

  if (!result.success) {
    const validationError = new ValidationError(
      result.error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }))
    );
    return res.status(validationError.status).json(validationError.toResponse());
  }

  // Add typed data to request
  req.body = result.data;
  next();
};

const router = Router();

router.get('/', endpoint2Controller.getData);

router.post('/',
  formLimiter,           // Rate limiting
  validateEndpoint2,     // Zod validation
  sanitizeResponse,      // Response sanitization
  endpoint2Controller.createData
);

export default router;
