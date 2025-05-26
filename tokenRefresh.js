// tokenRefresh.js
// Handles token refresh functionality

const config = require('./config');
const remote = require('@electron/remote');
const { dialog } = remote;

// Function to set up token refresh button
function setupTokenRefresh() {
    document.getElementById('refresh-token')?.addEventListener('click', async () => {
        try {
            // Show loading indicator if available
            if (typeof window.showLoading === 'function') {
                window.showLoading();
            }

            // Prepare request bodies with credentials
            const nonProdBody = new URLSearchParams({
                client_id: config.tokenRefresh.credentials.nonProd.client_id,
                client_secret: config.tokenRefresh.credentials.nonProd.client_secret,
                grant_type: config.tokenRefresh.credentials.grant_type,
                scope: config.tokenRefresh.credentials.scope,
                intent: config.tokenRefresh.credentials.intent
            });

            const prodBody = new URLSearchParams({
                client_id: config.tokenRefresh.credentials.prod.client_id,
                client_secret: config.tokenRefresh.credentials.prod.client_secret,
                grant_type: config.tokenRefresh.credentials.grant_type,
                scope: config.tokenRefresh.credentials.scope,
                intent: config.tokenRefresh.credentials.intent
            });

            // Refresh both tokens in parallel
            const [nonProdResponse, prodResponse] = await Promise.all([
                fetch(config.tokenRefresh.nonProd, { 
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: nonProdBody
                }),
                fetch(config.tokenRefresh.prod, { 
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: prodBody
                })
            ]);

            // Get the token values
            const nonProdToken = await nonProdResponse.text();
            const prodToken = await prodResponse.text();

            // Print responses to console
            console.log('Non-Production Token Response:');
            console.log(nonProdToken);
            console.log('Production Token Response:');
            console.log(prodToken);

            // Hide loading indicator if available
            if (typeof window.hideLoading === 'function') {
                window.hideLoading();
            }

            // Show success notification
            alert('All tokens refreshed successfully');
        } catch (err) {
            // Hide loading indicator if available
            if (typeof window.hideLoading === 'function') {
                window.hideLoading();
            }

            dialog.showErrorBox('Token Error', err.message);
        }
    });
}

module.exports = { setupTokenRefresh };