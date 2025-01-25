import { describe, expect, test } from 'bun:test';
import './setup';
import { config } from '../config';

const testPort = 3001;
const testUrl = `http://localhost:${testPort}/endpoint1`;
const csrfUrl = `http://localhost:${testPort}/csrf`;
const testOrigin = config.cors.origins[0];

const defaultHeaders = {
  'Origin': testOrigin,
  'User-Agent': 'Bun Test Runner',
  'Sec-Fetch-Site': 'cross-site',
  'Sec-Fetch-Mode': 'cors',
  'Host': `localhost:${testPort}`
};

describe('GET /csrf', () => {
  test('returns CSRF token with valid origin', async () => {
    const response = await fetch(csrfUrl, {
      headers: defaultHeaders
    });
    expect(response.status).toBe(200);
    const csrfToken = response.headers.get('x-csrf-token');
    expect(csrfToken).toBeDefined();
  });

  test('returns 403 with invalid origin', async () => {
    const response = await fetch(csrfUrl, {
      headers: {
        ...defaultHeaders,
        'Origin': 'http://invalid.com'
      }
    });
    expect(response.status).toBe(403);
  });
});

describe('GET /endpoint1', () => {
  test('returns data with valid origin', async () => {
    const response = await fetch(testUrl, {
      headers: defaultHeaders
    });
    expect(response.status).toBe(200);
  });

  test('returns 403 with invalid origin', async () => {
    const response = await fetch(testUrl, {
      headers: {
        ...defaultHeaders,
        'Origin': 'http://invalid.com'
      }
    });
    expect(response.status).toBe(403);
  });
});

describe('POST /endpoint1', () => {
  test('returns 400 without required fields but with CSRF token', async () => {
    // First get CSRF token
    const getResponse = await fetch(csrfUrl, {
      headers: defaultHeaders
    });
    const csrfToken = getResponse.headers.get('x-csrf-token');
    expect(csrfToken).toBeDefined();

    if (!csrfToken) {
      throw new Error('CSRF token not received');
    }

    // Then use token in POST request
    const response = await fetch(testUrl, {
      method: 'POST',
      headers: {
        ...defaultHeaders,
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken
      }
    });
    expect(response.status).toBe(400);
  });

  test('returns 403 without CSRF token', async () => {
    const response = await fetch(testUrl, {
      method: 'POST',
      headers: {
        ...defaultHeaders,
        'Content-Type': 'application/json'
      }
    });
    expect(response.status).toBe(403);
  });
});