# AI Collaboration Guide

This document provides guidelines for AI assistants working with this codebase.

## Core Principles

1. **Type Safety First**
   - Always maintain strict TypeScript types
   - Never use `any` type unless absolutely necessary
   - Generate and validate types against interfaces

2. **Consistency**
   - Follow existing patterns in the codebase
   - Maintain file structure conventions
   - Use consistent naming patterns

3. **Documentation**
   - Update documentation with all changes
   - Keep README synchronized
   - Maintain clear, descriptive comments

## File Structure Guidelines

1. **Interface Files**
   - One interface file per domain concept
   - Export all related types
   - Include JSDoc comments for complex types

2. **Service Layer**
   - Pure business logic only
   - No HTTP/Express dependencies
   - Return typed Promises

3. **Controllers**
   - Thin request/response handling
   - Type-safe request/response objects
   - Forward errors to error handler

## Code Generation Rules

1. **Type Definitions**
   ```typescript
   // DO THIS:
   export interface NewFeatureRequest {
     name: string;
     config: FeatureConfig;
   }

   // NOT THIS:
   export interface NewFeatureRequest {
     [key: string]: any;
   }
   ```

2. **Error Handling**
   ```typescript
   // DO THIS:
   try {
     const result = await service.process();
     res.json({ success: true, data: result });
   } catch (error) {
     next(error);
   }

   // NOT THIS:
   const result = await service.process();
   res.json(result);
   ```

3. **Validation**
   ```typescript
   // DO THIS:
   [
     body('email').isEmail(),
     body('age').isInt({ min: 0 }),
     validateRequest
   ]

   // NOT THIS:
   if (!req.body.email || !req.body.age) {
     res.status(400).json({ error: 'Invalid input' });
   }
   ```

## Security Considerations

1. **Input Validation**
   - Validate all request inputs
   - Sanitize user data
   - Use express-validator

2. **Rate Limiting**
   - Apply rate limits to all endpoints
   - Use appropriate window sizes
   - Consider endpoint sensitivity

3. **Type Safety**
   - Maintain strict type checking
   - No implicit any
   - Validate all external data

## Best Practices for AI

1. **Code Generation**
   - Generate complete, working code
   - Include all necessary imports
   - Maintain consistent style

2. **Documentation Updates**
   - Update README for new features
   - Maintain instruction files
   - Add JSDoc comments

3. **Error Prevention**
   - Add type checking
   - Include validation
   - Handle edge cases

4. **Testing Considerations**
   - Update Thunder Client collection
   - Consider error scenarios
   - Test edge cases

## Common Patterns

1. **Controller Pattern**
   ```typescript
   export const handleRequest = async (
     req: TypedRequest,
     res: TypedResponse,
     next: NextFunction
   ) => {
     try {
       const result = await service.process(req.body);
       res.json({ success: true, data: result });
     } catch (error) {
       next(error);
     }
   };
   ```

2. **Service Pattern**
   ```typescript
   export const process = async (
     data: InputType
   ): Promise<OutputType> => {
     // Business logic here
     return result;
   };
   ```

3. **Route Pattern**
   ```typescript
   router.post(
     '/',
     createRateLimiter(),
     validateRequest,
     controller.handleRequest
   );
   ```

## Maintenance Guidelines

1. **Code Updates**
   - Maintain backward compatibility
   - Update all affected files
   - Keep documentation in sync

2. **Version Control**
   - Make atomic changes
   - Update package versions carefully
   - Consider dependencies

3. **Error Handling**
   - Use consistent error patterns
   - Maintain error types
   - Log appropriately

## Final Checklist

✓ Type Safety
  - [ ] Strict types defined
  - [ ] No implicit any
  - [ ] Validated inputs

✓ Security
  - [ ] Input validation
  - [ ] Rate limiting
  - [ ] Error handling

✓ Documentation
  - [ ] Updated README
  - [ ] JSDoc comments
  - [ ] API documentation

✓ Testing
  - [ ] Thunder Client updated
  - [ ] Error cases covered
  - [ ] Edge cases considered