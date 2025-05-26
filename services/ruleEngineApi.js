// services/ruleEngineApi.js
// Handles rule engine API calls

const config = require('../config');

/**
 * Makes a call to the rule engine API to check customer eligibility
 * @param {Object} options - The options for the API call
 * @param {string} options.environment - The environment to use (e.g., 'DEV', 'PROD')
 * @param {string} options.personalId - The personal ID of the customer
 * @param {string} options.personalIdType - The type of personal ID (e.g., 'XID')
 * @param {Array<string>} options.rules - Array of rule names to check
 * @param {Object} options.requestContext - Additional context for the request
 * @param {string} options.accessToken - The access token for authentication
 * @returns {Promise<Object>} - The API response
 */
async function checkCustomerEligibility(options) {
    try {
        const {
            environment = config.defaultEnvironment,
            personalId,
            personalIdType = 'XID',
            rules = ['RULE.01'],
            requestContext = {},
            accessToken
        } = options;

        // Get the base URL from config based on environment
        const envConfig = config.environments[environment];
        const baseUrl = envConfig.apis.ruleEngine;

        // Construct the full URL
        const url = `${baseUrl}/restofur1`;

        // Prepare the request body
        const requestBody = {
            personald: personalId,
            personalIdType,
            rules,
            requestContext
        };

        // Prepare headers
        const headers = {
            'appi_d1': 'XP100',
            '1appn_ame': 'RR',
            'authorization': `Bearer ${accessToken}`,
            'charset': 'UTF-8',
            'content-type': 'application/json'
        };

        // Make the API call
        const response = await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify(requestBody)
        });

        // Parse and return the response
        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error('Error checking customer eligibility:', error);
        throw error;
    }
}

/**
 * Populates the API caller form with the rule engine API call details
 */
function populateRuleEngineApiCall() {
    // Get form elements
    const apiUrlInput = document.getElementById('api-url');
    const apiMethodSelect = document.getElementById('api-method');
    const apiRequestBodyTextarea = document.getElementById('api-request-body');
    const apiHeadersTableBody = document.querySelector('#api-headers-table tbody');

    // Clear existing headers
    apiHeadersTableBody.innerHTML = '';

    // Set URL and method
    const environment = config.defaultEnvironment;
    const envConfig = config.environments[environment];
    const baseUrl = envConfig.apis.ruleEngine;
    apiUrlInput.value = `${baseUrl}/fRR`;
    apiMethodSelect.value = 'POST';

    // Set request body
    const requestBody = {
        personald: "xxx",
        personalIdType: "XID",
        rules: ["RULE.01"],
        requestContext: {
            metadata: {

            }
        }
    };
    apiRequestBodyTextarea.value = JSON.stringify(requestBody, null, 2);

    // Add headers
    const headers = [
        { key: 'apoxxd', value: 'xxxx' }]

    // Add header rows
    headers.forEach(header => {
        const row = apiHeadersTableBody.insertRow();
        row.innerHTML = `
            <td><input type="text" placeholder="Key" class="api-header-key" value="${header.key}" /></td>
            <td><input type="text" placeholder="Value" class="api-header-value" value="${header.value}" /></td>
            <td><button type="button" class="remove-header-btn">✖</button></td>
        `;
        row.querySelector('.remove-header-btn').addEventListener('click', () => {
            row.remove();
        });
    });

    // Switch to the body tab
    const bodyTab = document.querySelector('.tab[data-tab="body"]');
    if (bodyTab) {
        bodyTab.click();
    }
}

module.exports = {
    checkCustomerEligibility,
    populateRuleEngineApiCall
};
