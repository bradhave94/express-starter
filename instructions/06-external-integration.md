# External Frontend Integration Guide

This document explains how to integrate this API with external frontends like HubSpot, WordPress, or other CMS platforms.

## API Endpoints

1. **CSRF Token**
   ```
   GET /csrf
   ```
   - Returns a CSRF token in the `x-csrf-token` header
   - Required for all POST/PUT/DELETE requests
   - Token is single-use and must be refreshed after each mutation
   - Origin must be in allowed list

2. **Form Submission**
   ```
   POST /endpoint1
   ```
   - Requires valid CSRF token in `X-CSRF-Token` header
   - Accepts JSON data with required fields
   - Returns success/error response

## CORS and Security Setup

1. **Environment Configuration**
   ```env
   # In .env
   ALLOWED_ORIGINS=https://your-hubspot-domain.com,https://your-hubspot-domain.hubspot.com
   ```

2. **Security Considerations**
   - CORS origin checking
   - CSRF token protection
   - Rate limiting still applies
   - All security headers must be respected

## API Client Implementation

```javascript
class ApiClient {
    constructor(apiUrl) {
        this.apiUrl = apiUrl;
        this.csrfToken = null;
    }

    async refreshCsrfToken() {
        const response = await fetch(`${this.apiUrl}/csrf`, {
            headers: { 'Origin': window.location.origin }
        });
        this.csrfToken = response.headers.get('x-csrf-token');
    }

    async makeRequest(endpoint, data = null, method = 'GET') {
        if (!this.csrfToken && method !== 'GET') {
            await this.refreshCsrfToken();
        }

        const headers = { 'Origin': window.location.origin };
        if (method !== 'GET') {
            headers['Content-Type'] = 'application/json';
            headers['X-CSRF-Token'] = this.csrfToken;
        }

        const response = await fetch(`${this.apiUrl}${endpoint}`, {
            method,
            headers,
            body: data ? JSON.stringify(data) : undefined
        });

        if (response.status === 403) {
            await this.refreshCsrfToken();
            return this.makeRequest(endpoint, data, method);
        }

        return response;
    }
}
```

## HubSpot Integration

1. **Add API Client to HubSpot Page**
   ```html
   <script>
     // Initialize API client
     const api = new ApiClient('https://your-api-domain.com');
   </script>
   ```

2. **Form Submission Handler**
   ```javascript
   async function handleFormSubmit(formData) {
       try {
           const response = await api.makeRequest('/endpoint1', {
               name: formData.get('firstname') || formData.get('name'),
               email: formData.get('email'),
               category: formData.get('category') || 'general',
               priority: Number.parseInt(formData.get('priority')) || 3
           }, 'POST');

           const result = await response.json();
           alert(result.success ? 'Success!' : result.error || 'Failed to submit');
       } catch (error) {
           alert('Failed to submit. Please try again.');
       }
   }
   ```

3. **HubSpot Form Integration**
   ```javascript
   window.addEventListener('message', (e) => {
       if (e.data.type === 'hsFormCallback' && e.data.eventName === 'onFormSubmit') {
           const form = document.querySelector('form');
           if (form) {
               handleFormSubmit(new FormData(form));
           }
       }
   });
   ```

## WordPress Integration

1. **Add API Client to WordPress Theme**
   ```php
   <?php
   // In your theme's functions.php
   function enqueue_api_client() {
       wp_enqueue_script('api-client', get_template_directory_uri() . '/js/api-client.js');
   }
   add_action('wp_enqueue_scripts', 'enqueue_api_client');
   ?>
   ```

2. **Form Integration**
   ```javascript
   document.querySelector('form').addEventListener('submit', async (e) => {
       e.preventDefault();
       const formData = new FormData(e.target);
       handleFormSubmit(formData);
   });
   ```

## Error Handling

1. **Common Error Types**
   - 403: CSRF token invalid/missing
   - 429: Rate limit exceeded
   - 400: Validation errors
   - 500: Server errors

2. **Error Handler Example**
   ```javascript
   function handleError(error, response) {
       if (response?.status === 403) {
           // Handle CSRF/authentication errors
           console.error('Authentication error:', error);
       } else if (response?.status === 429) {
           // Handle rate limiting
           console.error('Too many requests. Please try again later.');
       } else if (response?.status === 400) {
           // Handle validation errors
           const errors = error.errors || [];
           errors.forEach(err => {
               console.error(`${err.field}: ${err.message}`);
           });
       } else {
           // Handle other errors
           console.error('An unexpected error occurred:', error);
       }
   }
   ```

## Best Practices

1. **Security**
   - Always use HTTPS in production
   - Validate all user input
   - Handle errors gracefully
   - Don't expose sensitive data in error messages

2. **Performance**
   - Cache the CSRF token
   - Implement loading states
   - Handle network errors
   - Add request timeouts

3. **User Experience**
   - Show loading indicators
   - Display clear error messages
   - Provide success feedback
   - Handle form resubmission

4. **Maintenance**
   - Log errors for debugging
   - Monitor API usage
   - Keep dependencies updated
   - Document custom implementations

## Testing

1. **Test Cases**
   - CSRF token retrieval
   - Form submissions with valid token
   - Form submissions with expired token
   - Rate limit handling
   - Network error recovery

2. **Test Environment**
   ```javascript
   // Test configuration
   const api = new ApiClient('http://localhost:3000');

   // Test CSRF flow
   async function testCsrfFlow() {
       await api.refreshCsrfToken();  // Get initial token
       const response = await api.makeRequest('/endpoint1', {
           name: 'Test User',
           email: 'test@example.com'
       }, 'POST');
       console.assert(response.ok, 'Request failed');
   }
   ```

## Troubleshooting

1. **Common Issues**
   - CORS errors: Check allowed origins in .env
   - CSRF token missing: Ensure /csrf endpoint is called before POST
   - Rate limiting: Implement exponential backoff
   - Validation failures: Check request payload format

2. **Debug Mode**
   ```javascript
   // Enable console logging
   const api = new ApiClient('https://your-api-domain.com');
   console.log('CSRF Token:', api.csrfToken);
   ```

Remember to update the API URL and customize error handling based on your specific needs.