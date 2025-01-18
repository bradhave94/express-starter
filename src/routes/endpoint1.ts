import { Router } from 'express';
import * as endpoint1Controller from '../controllers/endpoint1';
import { formLimiter, sanitizeResponse } from '../middleware/security';
import { z } from 'zod';
import type { Request, Response, NextFunction } from 'express';
import { emailSchema, nameSchema, prioritySchema } from '../schemas/common';
import { ValidationError } from '../utils/errors';

// Define Zod schema for endpoint1
const endpoint1Schema = z.object({
  name: nameSchema,
  email: emailSchema,
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description cannot exceed 1000 characters')
    .optional(),
  category: z.enum(['general', 'support', 'billing', 'technical'], {
    errorMap: () => ({ message: 'Category must be one of: general, support, billing, technical' })
  }),
  priority: prioritySchema,
  attachments: z.array(
    z.object({
      filename: z.string(),
      size: z.number().max(5 * 1024 * 1024, 'File size cannot exceed 5MB'),
      type: z.string().regex(/^(image|document)\/.*$/, 'Invalid file type')
    })
  ).max(5, 'Maximum 5 attachments allowed').optional()
});

// Infer TypeScript type from schema
type Endpoint1Input = z.infer<typeof endpoint1Schema>;

// Zod validation middleware
const validateEndpoint1 = (req: Request, res: Response, next: NextFunction) => {
  const result = endpoint1Schema.safeParse(req.body);

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

router.get('/', endpoint1Controller.getData);

router.post('/',
  formLimiter,           // Rate limiting
  validateEndpoint1,     // Zod validation
  sanitizeResponse,      // Response sanitization
  endpoint1Controller.createData
);

export default router;
