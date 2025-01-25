# Type System Guide

This document explains the type system implementation and best practices.

## Interface Structure

1. **Request Types**
   ```typescript
   interface CreateEndpoint1Request {
     name: string;
     email: string;
   }
   ```

2. **Response Types**
   ```typescript
   interface Endpoint1Response {
     message: string;
     data?: Endpoint1Data;
   }
   ```

3. **Data Types**
   ```typescript
   interface Endpoint1Data {
     name: string;
     email: string;
   }
   ```

## Type Safety Guidelines

1. **Controller Types**
   - Use Request/Response generics
   - Type request bodies
   - Type response data

2. **Service Types**
   - Return typed promises
   - Use interface segregation
   - Avoid any type

3. **Error Types**
   - Type error responses
   - Use discriminated unions
   - Handle all cases

## Best Practices

1. Use strict TypeScript configuration
2. Avoid type assertions
3. Implement proper generics
4. Document complex types
5. Use utility types when appropriate
6. Keep interfaces focused and small
7. Use type imports for better tree-shaking
8. Maintain proper environment variable types
9. Keep Express types for request/response handling

## Bun-Specific Type Considerations

1. **Environment Types**
   ```typescript
   // Use Bun's types for env
   declare global {
     namespace NodeJS {
       interface ProcessEnv {
         PORT: string;
         NODE_ENV: 'development' | 'production' | 'test';
         // ... other env vars
       }
     }
   }
   ```

2. **Express Integration**
   - Keep Express types for request/response
   - Use type imports for better tree-shaking
   - Consider Bun's native types for future updates