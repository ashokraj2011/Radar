// services/mockApi/index.js

/**
 * Mock API service to intercept and mock all API calls
 */

// Import mock data for different API types
const ruleEngineMocks = require('./ruleEngine');
const ruleMetadataMocks = require('./ruleMetadata');
const graphqlMocks = require('./graphql');
const queryGeneratorMocks = require('./queryGenerator');
const tokenRefreshMocks = require('./tokenRefresh');
const genericMocks = require('./generic');

// Flag to determine whether to use mock APIs or real APIs
let useMockApis = true;

// Store original fetch function
const originalFetch = window.fetch;

/**
 * Determines which mock to use based on the URL and options
 * @param {string} url - The URL to fetch
 * @param {Object} options - The fetch options
 * @returns {Object} - The mock response
 */
function getMockResponse(url, options = {}) {
    // Rule Engine API
    if (url.includes('/ruleengine')) {
        if (url.includes('/execute')) {
            return ruleEngineMocks.execute(url, options);
        } else if (url.includes('/history')) {
            return ruleEngineMocks.history(url);
        }
    }

    // Rule Metadata API
    if (url.includes('/metadata')) {
        if (url.includes('/rules')) {
            return ruleMetadataMocks.rules();
        } else if (url.includes('/rule/')) {
            return ruleMetadataMocks.rule(url);
        }
    }

    // GraphQL API
    if (url.includes('/graphql')) {
        return graphqlMocks.graphql(url, options);
    }

    // Query Generator API
    if (url.includes('/query-generator')) {
        return queryGeneratorMocks.queryGenerator(url, options);
    }

    // Token refresh
    if (url.includes('/auth/refresh')) {
        if (url.includes('localhost') || url.includes('non-prod')) {
            return tokenRefreshMocks.nonProd();
        } else {
            return tokenRefreshMocks.prod();
        }
    }

    // Default to generic mock
    return genericMocks.generic(url, options);
}

/**
 * Mock implementation of the fetch API
 * @param {string} url - The URL to fetch
 * @param {Object} options - The fetch options
 * @returns {Promise<Response>} - A promise that resolves to a Response object
 */
async function mockFetch(url, options = {}) {
    if (!useMockApis) {
        // Use the original fetch if mock APIs are disabled
        return originalFetch(url, options);
    }

    try {
        // Get the appropriate mock response
        const mockResponse = getMockResponse(url, options);

        // Create a custom response object that mimics the Response interface
        const response = {
            status: mockResponse.status,
            statusText: mockResponse.status === 200 ? 'OK' : 'Error',
            ok: mockResponse.status >= 200 && mockResponse.status < 300,
            headers: new Headers({
                'Content-Type': 'application/json'
            }),

            // Implement json() method
            json: mockResponse.json || (async () => ({})),

            // Implement text() method
            text: mockResponse.text || (async () => ''),

            // Add other methods as needed
            blob: async () => new Blob(),
            arrayBuffer: async () => new ArrayBuffer(0),
            formData: async () => new FormData()
        };

        // Add ability to iterate over headers
        response.headers.forEach = (callback) => {
            response.headers.entries().forEach(([key, value]) => {
                callback(value, key);
            });
        };

        return response;
    } catch (error) {
        console.error('Error in mock fetch:', error);
        throw error;
    }
}

/**
 * Initializes the mock API service
 * @param {boolean} useMock - Whether to use mock APIs or real APIs
 */
function initMockApi(useMock = true) {
    useMockApis = useMock;

    // Replace the global fetch function with our mock
    window.fetch = function(url, options) {
        return mockFetch(url, options);
    };

    console.log(`Mock API service initialized. Using ${useMockApis ? 'mock' : 'real'} APIs.`);
}

/**
 * Restores the original fetch function
 */
function restoreFetch() {
    window.fetch = originalFetch;
    console.log('Original fetch function restored.');
}

/**
 * Toggles between mock and real APIs
 * @returns {boolean} - The new state of useMockApis
 */
function toggleMockApi() {
    useMockApis = !useMockApis;
    console.log(`Switched to ${useMockApis ? 'mock' : 'real'} APIs.`);
    return useMockApis;
}

/**
 * Gets the current state of the mock API service
 * @returns {boolean} - Whether mock APIs are being used
 */
function isUsingMockApi() {
    return useMockApis;
}

module.exports = {
    initMockApi,
    restoreFetch,
    toggleMockApi,
    isUsingMockApi
};