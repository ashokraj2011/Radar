// services/mockApi/tokenRefresh.js

/**
 * Mock data for Token Refresh API endpoints
 */

// Mock for non-prod token refresh
function nonProd() {
    console.log('Mock API: POST token refresh (non-prod)');

    return {
        status: 200,
        text: async () => 'mock-non-prod-token-' + Date.now()
    };
}

// Mock for prod token refresh
function prod() {
    console.log('Mock API: POST token refresh (prod)');

    return {
        status: 200,
        text: async () => 'mock-prod-token-' + Date.now()
    };
}

module.exports = {
    nonProd,
    prod
};