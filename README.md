# TypeScript Express API

A production-ready TypeScript Express API with comprehensive security features, logging, and monitoring, powered by Bun.

## Features

- TypeScript with strict mode
- Express.js framework
- CORS configuration with dynamic origin support
- Rate limiting (100 requests per 10 seconds)
- Request validation with Zod schemas
- Security headers with Helmet.js
- Built-in logging with Bun's console
- Error handling with consistent response format
- Request logging with performance metrics
- Clean architecture with dependency injection
- Strongly typed endpoints with Zod schema inference
- XSS protection with recursive sanitization

## Project Structure

```
/src
  /controllers    - Request handlers with typed responses
  /routes        - API route definitions with Zod schemas
  /services      - Business logic implementation
  /middleware    - Custom middleware (security, logging, etc.)
  /interfaces    - TypeScript interfaces and Zod schemas
  /config        - Configuration management
  /utils         - Utility functions
  server.ts      - Application entry point
/public
  *.html         - Test pages for endpoints
```

## Prerequisites

- Bun >= 1.0.0

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   bun install
   ```
3. Copy `.env.example` to `.env` and update the values
4. Build the project:
   ```bash
   bun run build
   ```

## Environment Variables

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `ALLOWED_ORIGINS` - Comma-separated list of allowed CORS origins
- `ADDITIONAL_ORIGINS` - Additional CORS origins for dynamic configuration
- `RATE_LIMIT_WINDOW_MS` - Rate limit window in milliseconds (default: 10000)
- `RATE_LIMIT_MAX_REQUESTS` - Maximum requests per window (default: 100)

## Available Scripts

- `bun run dev` - Start development server with hot reload
- `bun run build` - Build for production
- `bun start` - Start production server
- `bun run lint` - Run ESLint
- `bun run format` - Format code with Prettier
- `bun test` - Run tests

## Adding New Endpoints

Quick guide for adding endpoints:

1. Define Zod schema in `/src/routes/{endpoint-name}.ts`
2. Create service in `/src/services/{endpoint-name}.ts`
3. Add controller in `/src/controllers/{endpoint-name}.ts`
4. Create route file with validation middleware
5. Register route in `/src/routes/index.ts`
6. Create test page in `/public/test-{endpoint-name}.html`
7. Update documentation

See `/instructions/04-adding-endpoints.md` for detailed guide.

## API Documentation

### Endpoint 1

#### GET /endpoint1
- Returns user data
- Response type: `Endpoint1Response`
- Rate limited to 100 requests per 10 seconds

#### POST /endpoint1
- Creates new user data
- Validated with Zod schema
- Required fields:
  - name (string, 2-100 chars)
  - email (string, valid email format)
  - category (enum: general, support, billing, technical)
- Optional fields:
  - description (string, 10-1000 chars)
  - priority (number, 1-5, default: 3)
  - attachments (array of files, max 5, 5MB each)
- Rate limited to 100 requests per 10 seconds

### Endpoint 2

#### GET /endpoint2
- Returns typed data
- Response type: `Endpoint2Response`
- Rate limited to 100 requests per 10 seconds

#### POST /endpoint2
- Creates new typed data
- Validated with Zod schema
- Required fields:
  - type (string, regex: task1|task2|task3)
  - data (object)
- Optional fields:
  - priority (number, 1-5)
  - tags (string[])
  - dryRun (boolean)
- Rate limited to 100 requests per 10 seconds

## Security

- CORS configuration with whitelisted origins
- Rate limiting (100 requests per 10 seconds)
- Request validation with Zod schemas
- Security headers with Helmet.js
- XSS protection with recursive sanitization
- Type-safe request/response handling

## Error Handling

All errors are logged and returned in a consistent format:

```json
{
  "success": false,
  "error": {
    "status": number,
    "message": string,
    "errors": [
      {
        "field": string,
        "message": string
      }
    ]
  }
}
```

## Testing

Each endpoint comes with a dedicated test page that allows you to:
- Test valid requests
- Test invalid inputs
- Test rate limiting
- View detailed error messages
- Test all validation rules

Access test pages at:
- `/test-endpoint1.html`
- `/test-endpoint2.html`