// services/mockApi/ruleEngine.js

/**
 * Mock data for Rule Engine API endpoints
 */

// Mock for /execute endpoint
function execute(url, options) {
    console.log(`Mock API: POST ${url}`);
    const requestBody = JSON.parse(options.body);

    return {
        status: 200,
        json: async () => ({
            result: true,
            status: 'success',
            executionTime: '120ms',
            evaluationData: {
                customer: {
                    age: 35,
                    salary: 75000,
                    registrationDate: '2019-05-15T00:00:00'
                },
                branch: {
                    location: 'Mumbai'
                },
                'customer.accounts': {
                    balance: 60000
                }
            },
            ruleName: requestBody.ruleName,
            environment: requestBody.environment,
            personaType: requestBody.personaType,
            personaId: requestBody.personaId,
            timestamp: new Date().toISOString()
        })
    };
}

// Mock for /history endpoint
function history(url) {
    console.log(`Mock API: GET ${url}`);

    // Extract ruleName and personaId from URL
    const urlParts = url.split('/');
    const ruleName = urlParts[urlParts.length - 2];
    const personaId = urlParts[urlParts.length - 1];

    return {
        status: 200,
        json: async () => [
            {
                timestamp: new Date().toISOString(),
                status: 'success',
                result: {
                    ruleName,
                    personaId,
                    result: true,
                    executionTime: '120ms'
                }
            },
            {
                timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
                status: 'success',
                result: {
                    ruleName,
                    personaId,
                    result: false,
                    executionTime: '115ms'
                }
            },
            {
                timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
                status: 'error',
                result: {
                    ruleName,
                    personaId,
                    error: 'Data source unavailable',
                    executionTime: '50ms'
                }
            }
        ]
    };
}

module.exports = {
    execute,
    history
};