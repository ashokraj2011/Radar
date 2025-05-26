// services/mockApi/queryGenerator.js

/**
 * Mock data for Query Generator API endpoints
 */

// Mock for Query Generator API
function queryGenerator(url, options) {
    console.log(`Mock API: POST ${url}`);

    return {
        status: 200,
        json: async () => ({
            query: 'SELECT * FROM customers WHERE id = :id',
            parameters: { id: '12345' }
        })
    };
}

module.exports = {
    queryGenerator
};