/**
 * HubSpot API Integration
 *
 * This script provides integration between HubSpot forms and the API.
 * It handles CSRF token management, form submissions, and error handling.
 *
 * Setup:
 * 1. Add this script to your HubSpot page's header
 * 2. Replace 'https://your-api-domain.com' with your actual API domain
 *
 * Endpoints:
 * - GET /csrf - Get a new CSRF token
 * - POST /endpoint1 - Submit form data
 *
 * Security:
 * - CSRF tokens are required for all POST requests
 * - Tokens are automatically refreshed when expired
 * - Origin headers are automatically included
 */

// api-integration.js - Copy this entire script into HubSpot
(() => {
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

    const api = new ApiClient('https://your-api-domain.com');

    async function handleFormSubmit(formData) {
        const submitButton = document.querySelector('input[type="submit"]');
        if (submitButton) {
            submitButton.disabled = true;
        }

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
        } finally {
            if (submitButton) {
                submitButton.disabled = false;
            }
        }
    }

    // Listen for HubSpot form submissions
    window.addEventListener('message', (e) => {
        if (e.data.type === 'hsFormCallback' && e.data.eventName === 'onFormSubmit') {
            const form = document.querySelector('form');
            if (form) {
                handleFormSubmit(new FormData(form));
            }
        }
    });

    // Also handle regular form submissions
    document.addEventListener('submit', (e) => {
        if (e.target.tagName === 'FORM') {
            e.preventDefault();
            handleFormSubmit(new FormData(e.target));
        }
    });
})();