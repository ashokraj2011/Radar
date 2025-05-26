// services/mockApi/ruleMetadata.js

/**
 * Mock data for Rule Metadata API endpoints
 */

// Mock for /rules endpoint
function rules() {
    console.log('Mock API: GET /rules');

    return {
        status: 200,
        json: async () => [
            { name: 'CustomerEligibility', description: 'Determines if a customer is eligible for a service' },
            { name: 'LoanApproval', description: 'Determines if a loan should be approved' },
            { name: 'FraudDetection', description: 'Detects potentially fraudulent transactions' },
            { name: 'AccountUpgrade', description: 'Determines if an account is eligible for upgrade' },
            { name: 'DiscountEligibility', description: 'Determines if a customer is eligible for discounts' }
        ]
    };
}

// Mock for /rule/{ruleName} endpoint
function rule(url) {
    console.log(`Mock API: GET ${url}`);

    // Extract ruleName from URL
    const urlParts = url.split('/');
    const ruleName = urlParts[urlParts.length - 1];

    return {
        status: 200,
        json: async () => ({
            "op": "or",
            "terms": [
                {
                    "field": {
                        "name": "age",
                        "namespace": "customer",
                        "datasource": "DB1",
                        "evaluation_group": "1"
                    },
                    "comp": "equal to",
                    "value": "3544"
                },
                {
                    "field": {
                        "name": "salary",
                        "datasource": "DB1",
                        "namespace": "customer",
                        "evaluation_group": "1"
                    },
                    "comp": "greater than",
                    "value": "5000"
                },
                {
                    "field": {
                        "name": "location",
                        "datasource": "WI",
                        "namespace": "branch",
                        "evaluation_group": "2"
                    },
                    "comp": "equal to",
                    "value": "Mumbai"
                },
                {
                    "op": "or",
                    "terms": [
                        {
                            "field": {
                                "name": "balance",
                                "datasource": "DB1",
                                "namespace": "customer.accounts",
                                "evaluation_group": "3"
                            },
                            "comp": "greater than",
                            "value": "50000"
                        },
                        {
                            "field": {
                                "datasource": "DB1",
                                "name": "registrationDate",
                                "namespace": "customer",
                                "evaluation_group": "3"
                            },
                            "comp": "greater than",
                            "value": "2000-03-26T00:00:00"
                        }
                    ]
                }
            ]
        })
    };
}

module.exports = {
    rules,
    rule
};