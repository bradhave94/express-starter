# Architecture Guide

This document explains the architectural decisions and patterns used in this TypeScript Express API.

## Core Principles

1. **Type Safety**
   - Strict TypeScript configuration
   - Interface segregation for each endpoint
   - Type-safe request/response handling

2. **Clean Architecture**
   - Separation of concerns
   - Dependency injection
   - Business logic isolation in services

3. **Security First**
   - CORS with dynamic origin configuration
   - Rate limiting per endpoint
   - Request validation and sanitization
   - Security headers

## Layer Responsibilities

### Controllers
- Handle HTTP requests/responses
- Input validation
- Type conversion
- No business logic

### Services
- Contain business logic
- Handle data processing
- Return typed responses
- Independent of HTTP layer

### Middleware
- Cross-cutting concerns
- Request preprocessing
- Error handling
- Logging and monitoring

### Interfaces
- Define data structures
- Ensure type safety
- Document API contracts
- Separate by domain

## Bun-Specific Considerations

1. **Environment Variables**
   - Use `Bun.env` instead of `process.env`
   - Configure envalid with Bun.env
   - Keep environment validation strict

2. **Server Setup**
   ```typescript
   // Standard Express setup with Bun
   app.listen(config.port, () => {
     console.log(`Server running in ${config.env} mode on port ${config.port}`);
   }).on('error', (err) => {
     console.error('Server failed to start:', err);
     process.exit(1);
   });
   ```

3. **Crypto Operations**
   - Use `node:crypto` for compatibility
   - Consider Bun's crypto API for future updates

## Best Practices

1. Always maintain type safety
2. Keep controllers thin
3. Implement proper error handling
4. Use dependency injection
5. Follow SOLID principles
6. Document code changes
7. Use `node:crypto` for cryptographic operations
8. Configure environment with envalid using `Bun.env`
9. Implement proper server error handling