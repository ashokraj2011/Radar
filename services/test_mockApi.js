// Test script for mockApi.js
// This script simulates the issue and verifies that our fix works

// Import the mockApi module
const mockApi = require('./mockApi');

// Check if we're in a browser/Electron environment or Node.js
const isBrowser = typeof window !== 'undefined' && typeof window.fetch === 'function';

// If we're in Node.js, we need to provide a global fetch function
if (!isBrowser) {
    console.log('Running in Node.js environment, setting up mock globals...');

    // Mock window object if not available
    if (typeof window === 'undefined') {
        global.window = {};
    }

    // Mock fetch function if not available
    if (typeof fetch === 'undefined') {
        global.fetch = async (url, options) => {
            console.log(`Mock fetch called with URL: ${url}`);
            return {
                status: 200,
                json: async () => ({ message: 'Mock response' }),
                text: async () => 'Mock response text'
            };
        };
    }

    // Mock Headers class if not available
    if (typeof Headers === 'undefined') {
        global.Headers = class Headers {
            constructor(init) {
                this.headers = {};
                if (init) {
                    Object.entries(init).forEach(([key, value]) => {
                        this.headers[key.toLowerCase()] = value;
                    });
                }
            }

            append(key, value) {
                this.headers[key.toLowerCase()] = value;
            }

            get(key) {
                return this.headers[key.toLowerCase()];
            }

            entries() {
                return Object.entries(this.headers);
            }
        };
    }
}

// Initialize the mock API
mockApi.initMockApi(true);

// Test with a plain JavaScript object for headers
async function testWithPlainObject() {
    console.log('Testing with plain JavaScript object for headers...');

    try {
        // Simulate a fetch call with plain object headers
        const response = await fetch('http://example.com/api', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer dummy-token'
            },
            body: JSON.stringify({ test: 'data' })
        });

        // Parse the response
        const data = await response.json();
        console.log('Response with plain object headers:', data);
        console.log('Test passed: No error occurred with plain object headers');
    } catch (error) {
        console.error('Test failed: Error occurred with plain object headers:', error);
    }
}

// Test with a Headers object for headers
async function testWithHeadersObject() {
    console.log('\nTesting with Headers object for headers...');

    try {
        // Check if Headers is available (it's a Web API, not available in Node.js by default)
        if (typeof Headers === 'undefined') {
            console.log('Headers API not available in this environment. Skipping this test.');
            return;
        }

        // Create a Headers object
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer dummy-token');

        // Simulate a fetch call with Headers object
        const response = await fetch('http://example.com/api', {
            method: 'POST',
            headers,
            body: JSON.stringify({ test: 'data' })
        });

        // Parse the response
        const data = await response.json();
        console.log('Response with Headers object:', data);
        console.log('Test passed: No error occurred with Headers object');
    } catch (error) {
        console.error('Test failed: Error occurred with Headers object:', error);
    }
}

// Run the tests
async function runTests() {
    await testWithPlainObject();
    await testWithHeadersObject();

    // Restore the original fetch function
    mockApi.restoreFetch();
    console.log('\nTests completed.');
}

// Run the tests
runTests();
