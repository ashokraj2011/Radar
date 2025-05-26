// services/mockApi/generic.js

/**
 * Generic mock data for any API endpoint not specifically handled
 */

// Generic mock for any other API
function generic(url, options) {
    console.log(`Mock API: ${options.method || 'GET'} ${url}`);

    return {
        status: 200,
        json: async () => ({
            message: 'This is a generic mock response',
            url,
            method: options.method || 'GET',
            headers: options.headers ? (options.headers.entries ? Object.fromEntries(options.headers.entries()) : options.headers) : {},
            body: options.body
        }),
        text: async () => 'This is a generic mock response'
    };
}

module.exports = {
    generic
};