// services/mockApi/graphql.js

/**
 * Mock data for GraphQL API endpoints
 */

// Mock for GraphQL API
function graphql(url, options) {
    console.log(`Mock API: POST ${url}`);
    const requestBody = JSON.parse(options.body);

    return {
        status: 200,
        json: async () => ({
            data: {
                // Mock response based on the GraphQL query
                // This is a simplified example
                result: 'GraphQL mock response'
            }
        })
    };
}

module.exports = {
    graphql
};