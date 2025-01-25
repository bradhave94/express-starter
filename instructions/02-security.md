# Security Guide

This document outlines the security measures and best practices implemented in the API.

## CORS Configuration

1. **Origin Whitelisting**
   - Default allowed origins: www.example.com
   - Dynamic origin addition via ADDITIONAL_ORIGINS
   - Strict origin checking

2. **CORS Options**
   - Allowed methods: GET, POST, PUT, DELETE
   - Credentials enabled
   - Headers validated

## Rate Limiting

1. **Default Configuration**
   - 100 requests per 10 seconds
   - Per endpoint implementation
   - IP-based tracking

2. **Custom Limits**
   - Configurable via environment variables
   - Separate limits per route possible
   - Response headers included

## Input Validation

1. **Zod Schema Validation**
   - Type-safe schema definitions
   - Runtime type checking
   - Automatic TypeScript type inference
   - Detailed error messages
   - Custom validation rules

2. **Validation Features**
   - Required and optional fields
   - String constraints (min/max length, regex, email)
   - Number constraints (min/max, integer)
   - Array validation with item constraints
   - Object shape validation
   - Enum validation
   - Custom refinements
   - Default values

3. **Type Safety**
   - TypeScript integration with Zod schemas
   - Inferred types from schemas
   - Strict null checks
   - Compile-time type checking

## XSS Protection

1. **Response Sanitization**
   - All response data sanitized
   - HTML tags stripped
   - Script content removed
   - Recursive sanitization for nested objects

## Best Practices

1. Define comprehensive Zod schemas for each endpoint
2. Use proper error responses with detailed validation messages
3. Implement rate limiting appropriate for your endpoint's needs
4. Keep security headers updated
5. Log security events
6. Regular security audits
7. Test validation with edge cases
8. Document schema requirements
9. Validate all environment variables through envalid
10. Use `node:crypto` for cryptographic operations
11. Consider SQLite for rate limiting storage

## Bun-Specific Security Considerations

1. **Environment Variables**
   - Use `Bun.env` for environment variables
   - Validate all env variables through envalid
   - Keep sensitive data in `.env`

2. **Crypto Operations**
   ```typescript
   // Use node:crypto for compatibility
   import { randomUUID } from 'node:crypto';

   // Instead of
   // import crypto from 'crypto';
   ```

3. **Performance Considerations**
   - Leverage Bun's fast startup time
   - Use Bun's built-in fetch when applicable
   - Consider Bun's SQLite for rate limiting storage
