# Adding New Endpoints Guide

This document provides step-by-step instructions for adding new endpoints to the API.

## Step 1: Define Schema and Types

Create a Zod schema in `/src/routes/{endpoint-name}.ts`:

```typescript
import { z } from 'zod';

// Request schema
const newEndpointSchema = z.object({
  field1: z.string()
    .min(2, 'Field1 must be at least 2 characters')
    .max(100, 'Field1 cannot exceed 100 characters'),
  field2: z.number()
    .int('Field2 must be an integer')
    .min(1, 'Field2 must be at least 1')
    .max(100, 'Field2 must be at most 100'),
  optionalField: z.string()
    .email('Invalid email format')
    .optional(),
  enumField: z.enum(['option1', 'option2', 'option3'], {
    errorMap: () => ({ message: 'EnumField must be one of: option1, option2, option3' })
  })
});

// Infer types from schema
type CreateNewEndpointRequest = z.infer<typeof newEndpointSchema>;

// Response types
interface NewEndpointResponse {
  message: string;
  data?: NewEndpointData;
}

// Data types
interface NewEndpointData {
  field1: string;
  field2: number;
  createdAt: Date;
}
```

## Step 2: Create Service

Add service in `/src/services/{endpoint-name}.ts`:

```typescript
import { NewEndpointResponse } from '../interfaces/{endpoint-name}';
import type { CreateNewEndpointRequest } from '../routes/{endpoint-name}';

export const getData = async (): Promise<NewEndpointResponse> => {
  // Implement business logic
  return {
    message: 'Data retrieved successfully',
    data: {
      field1: 'example',
      field2: 123,
      createdAt: new Date()
    }
  };
};

export const createData = async (data: CreateNewEndpointRequest): Promise<NewEndpointResponse> => {
  // Implement business logic
  return {
    message: 'Data created successfully',
    data: {
      ...data,
      createdAt: new Date()
    }
  };
};
```

## Step 3: Create Controller

Add controller in `/src/controllers/{endpoint-name}.ts`:

```typescript
import { Request, Response, NextFunction } from 'express';
import * as endpointService from '../services/{endpoint-name}';
import { ApiResponse } from '../interfaces/common';
import type { NewEndpointResponse } from '../interfaces/{endpoint-name}';
import type { CreateNewEndpointRequest } from '../routes/{endpoint-name}';

export const getData = async (
  req: Request,
  res: Response<ApiResponse<NewEndpointResponse>>,
  next: NextFunction
) => {
  try {
    const data = await endpointService.getData();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const createData = async (
  req: Request<{}, {}, CreateNewEndpointRequest>,
  res: Response<ApiResponse<NewEndpointResponse>>,
  next: NextFunction
) => {
  try {
    const data = await endpointService.createData(req.body);
    res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};
```

## Step 4: Create Route

Add route file in `/src/routes/{endpoint-name}.ts`:

```typescript
import { Router } from 'express';
import { formLimiter, sanitizeResponse } from '../middleware/security';
import * as controller from '../controllers/{endpoint-name}';
import { z } from 'zod';

const router = Router();

// Zod validation middleware
const validateRequest = (schema: z.ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      error: {
        status: 400,
        message: 'Validation failed',
        errors: result.error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      }
    });
  }

  // Add typed data to request
  req.body = result.data;
  next();
};

router.get('/',
  formLimiter,
  controller.getData
);

router.post('/',
  formLimiter,                    // Rate limiting
  validateRequest(requestSchema), // Zod validation
  sanitizeResponse,               // Response sanitization
  controller.createData
);

export default router;
```

## Step 5: Create Test Page

Create a test page in `/public/test-{endpoint-name}.html`:

```html
<!DOCTYPE html>
<html>
<head>
    <title>New Endpoint Test</title>
    <style>
        .test-button { margin: 5px; padding: 5px; }
        .error { color: red; }
        .success { color: green; }
        .test-group { margin: 20px 0; padding: 10px; border: 1px solid #ccc; }
        pre { background: #f5f5f5; padding: 10px; }
    </style>
</head>
<body>
    <h1>New Endpoint Tests</h1>

    <!-- Valid Tests -->
    <div class="test-group">
        <h2>Valid Tests</h2>
        <button class="test-button" onclick="testValidRequest()">Test Valid Request</button>
        <button class="test-button" onclick="testWithOptionalFields()">Test With Optional Fields</button>
    </div>

    <!-- Invalid Tests -->
    <div class="test-group">
        <h2>Invalid Tests</h2>
        <button class="test-button" onclick="testInvalidField1()">Test Invalid Field1</button>
        <button class="test-button" onclick="testInvalidField2()">Test Invalid Field2</button>
    </div>

    <!-- Rate Limit Test -->
    <div class="test-group">
        <h2>Rate Limit Test</h2>
        <button class="test-button" onclick="testRateLimit()">Test Rate Limit</button>
    </div>

    <div id="result"></div>

    <script>
        const API_URL = 'http://localhost:3000';
        const resultDiv = document.getElementById('result');

        function displayResult(response, error = false) {
            const pre = document.createElement('pre');
            pre.className = error ? 'error' : 'success';
            pre.textContent = typeof response === 'string' ? response : JSON.stringify(response, null, 2);
            resultDiv.insertBefore(pre, resultDiv.firstChild);
        }

        async function makeRequest(endpoint, data = null, method = 'GET') {
            try {
                const response = await fetch(`${API_URL}${endpoint}`, {
                    method,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: data ? JSON.stringify(data) : undefined
                });
                const result = await response.json();
                displayResult(result, !response.ok);
                return result;
            } catch (error) {
                displayResult(`Error: ${error.message}`, true);
                throw error;
            }
        }

        // Test functions...
    </script>
</body>
</html>
```

## Step 6: Register Route

Update `/src/routes/index.ts`:

```typescript
import { Router } from 'express';
import newEndpointRouter from './{endpoint-name}';

const router = Router();
router.use('/{endpoint-name}', newEndpointRouter);

export default router;
```

## Step 7: Update Documentation

1. Add endpoint documentation to README.md
2. Update Thunder Client collection (thunder-collection.json)
3. Add any necessary security policies

## Checklist

✓ Schema and Types
  - [ ] Zod schema definition
  - [ ] Type inference setup
  - [ ] Response types
  - [ ] Validation rules

✓ Service implementation
  - [ ] Business logic
  - [ ] Error handling
  - [ ] Type safety

✓ Controller implementation
  - [ ] Request handling
  - [ ] Response formatting
  - [ ] Error forwarding

✓ Route configuration
  - [ ] Rate limiting
  - [ ] Zod validation
  - [ ] Response sanitization
  - [ ] Route registration

✓ Test Page
  - [ ] Valid test cases
  - [ ] Invalid test cases
  - [ ] Rate limit tests
  - [ ] UI implementation

✓ Security
  - [ ] Zod validation
  - [ ] Rate limiting
  - [ ] XSS protection
  - [ ] Type safety

✓ Documentation
  - [ ] README update
  - [ ] API documentation
  - [ ] Thunder Client collection

## Best Practices

1. **Schema Design**
   - Define comprehensive schemas
   - Include validation messages
   - Use appropriate Zod methods
   - Consider edge cases

2. **Type Safety**
   - Use Zod type inference
   - Define response types
   - Maintain strict type checking

3. **Validation**
   - Validate all inputs with Zod
   - Include detailed error messages
   - Handle edge cases
   - Test all validation rules

4. **Error Handling**
   - Use try-catch blocks
   - Forward errors to error handler
   - Return consistent error responses
   - Include field-specific errors

5. **Testing**
   - Create comprehensive test page
   - Test all validation rules
   - Verify error messages
   - Test rate limiting
   - Test XSS protection
