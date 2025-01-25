import { beforeAll, afterAll, afterEach } from 'bun:test';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from '../config';
import routes from '../routes';
import { errorHandler } from '../middleware/error';
import { requestLogger } from '../middleware/requestLogger';
import { csrfProtection } from '../middleware/csrf';

// Create test app
const app = express();

// Add logging middleware first
app.use(requestLogger);

// Handle favicon requests before any other middleware
app.use((req, res, next) => {
  if (req.url === '/favicon.ico') {
    return res.status(204).end();
  }
  next();
});

// Security middleware
app.use(helmet());

// Strict security check before any other middleware
app.use((req, res, next) => {
  const origin = req.headers.origin;
  const userAgent = req.headers['user-agent'];
  const secFetchSite = req.headers['sec-fetch-site'];
  const secFetchMode = req.headers['sec-fetch-mode'];

  // Block if no origin or user-agent
  if (!origin || !userAgent) {
    return res.status(403).json({
      success: false,
      error: {
        status: 403,
        message: 'Invalid request 1'
      }
    });
  }

  // Block if not from a browser
  if (!secFetchSite || !secFetchMode) {
    console.log('Blocked: Missing Sec-Fetch headers');
    return res.status(403).json({
      success: false,
      error: {
        status: 403,
        message: 'Invalid request 2'
      }
    });
  }

  // Check if origin is in allowed list
  if (!config.cors.origins.includes(origin)) {
    console.log('Blocked: Origin not in allowed list:', origin);
    return res.status(403).json({
      success: false,
      error: {
        status: 403,
        message: 'Origin not allowed'
      }
    });
  }

  next();
});

// CORS configuration
app.use(cors({
  origin: config.cors.origins,
  credentials: config.cors.credentials,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  exposedHeaders: ['x-csrf-token']  // Important: expose the CSRF token header
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', routes);
app.use(errorHandler);

let server: ReturnType<typeof app.listen>;

beforeAll(() => {
  // Start server on a different port for testing
  const testPort = 3001;
  server = app.listen(testPort);
});

afterAll(() => {
  server?.close();
});

afterEach(() => {
  // Clean up any test data or mocks here
});