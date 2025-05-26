// dialogs.js
// Core logic for Ruliad Navigator: dialogs and token refresh functionality

const config = require('./config');
const { ipcRenderer } = require('electron');
const remote = require('@electron/remote');
const { dialog } = remote;
const fs = require('fs');
const db = require('./db');

// Function to handle adhoc request calls
function callAdhocRequest() {
    // Implementation of callAdhocRequest
    console.log('Call adhoc request');
    // Add your implementation here
}

// Function to save adhoc requests
function saveAdhocRequest() {
    // Implementation of saveAdhocRequest
    console.log('Save adhoc request');
    // Add your implementation here
}

window.addEventListener('DOMContentLoaded', async () => {
    // Initialize DB
    try {
        await db.initializeDatabase(config.defaultEnvironment);
    } catch (err) {
        console.error('DB init error:', err);
        dialog.showErrorBox('Database Error', err.message);
    }

    // Note: Token refresh functionality has been moved to tokenRefresh.js
    // to resolve circular dependency issues

    // Import and call setupDialogListeners from components/dialogs.js
    require('./components/dialogs').setupDialogListeners();

    document.getElementById('adhoc-request')?.addEventListener('click', () => {
        document.getElementById('adhoc-dialog').showModal();
    });

    document.getElementById('call-adhoc')?.addEventListener('click', callAdhocRequest);
    document.getElementById('save-adhoc')?.addEventListener('click', saveAdhocRequest);
    document.getElementById('close-adhoc')?.addEventListener('click', () => {
        document.getElementById('adhoc-dialog').close();
    });

    document.getElementById('open-settings')?.addEventListener('click', () => {
        // Pre-fill settings fields from config
        const cfg = Object.assign({}, config);
        document.getElementById('settings-env').value = cfg.defaultEnvironment;
        document.getElementById('db-host').value = cfg.environments[cfg.defaultEnvironment].db.host;
        document.getElementById('db-port').value = cfg.environments[cfg.defaultEnvironment].db.port;
        document.getElementById('db-user').value = cfg.environments[cfg.defaultEnvironment].db.user;
        document.getElementById('db-password').value = cfg.environments[cfg.defaultEnvironment].db.password;
        document.getElementById('db-name').value = cfg.environments[cfg.defaultEnvironment].db.database;
        document.getElementById('api-ruleengine').value = cfg.environments[cfg.defaultEnvironment].apis.ruleEngine;
        document.getElementById('api-rulemetadata').value = cfg.environments[cfg.defaultEnvironment].apis.ruleMetadata;
        document.getElementById('api-graphql').value = cfg.environments[cfg.defaultEnvironment].apis.graphql;
        document.getElementById('token-nonprod').value = cfg.tokenRefresh.nonProd;
        document.getElementById('token-prod').value = cfg.tokenRefresh.prod;
        document.getElementById('client-id-nonprod').value = cfg.tokenRefresh.credentials.nonProd.client_id;
        document.getElementById('client-secret-nonprod').value = cfg.tokenRefresh.credentials.nonProd.client_secret;
        document.getElementById('client-id-prod').value = cfg.tokenRefresh.credentials.prod.client_id;
        document.getElementById('client-secret-prod').value = cfg.tokenRefresh.credentials.prod.client_secret;
        document.getElementById('settings-dialog').showModal();
    });

    document.getElementById('cancel-settings')?.addEventListener('click', () => {
        document.getElementById('settings-dialog').close();
    });

    document.getElementById('settings-form')?.addEventListener('submit', async e => {
        e.preventDefault();
        // collect and save config
        const newCfg = Object.assign({}, config);
        newCfg.defaultEnvironment = document.getElementById('settings-env').value;
        const env = newCfg.defaultEnvironment;
        newCfg.environments[env].db.host = document.getElementById('db-host').value;
        newCfg.environments[env].db.port = +document.getElementById('db-port').value;
        newCfg.environments[env].db.user = document.getElementById('db-user').value;
        newCfg.environments[env].db.password = document.getElementById('db-password').value;
        newCfg.environments[env].db.database = document.getElementById('db-name').value;
        newCfg.environments[env].apis.ruleEngine = document.getElementById('api-ruleengine').value;
        newCfg.environments[env].apis.ruleMetadata = document.getElementById('api-rulemetadata').value;
        newCfg.environments[env].apis.graphql = document.getElementById('api-graphql').value;
        newCfg.tokenRefresh.nonProd = document.getElementById('token-nonprod').value;
        newCfg.tokenRefresh.prod = document.getElementById('token-prod').value;
        newCfg.tokenRefresh.credentials.nonProd.client_id = document.getElementById('client-id-nonprod').value;
        newCfg.tokenRefresh.credentials.nonProd.client_secret = document.getElementById('client-secret-nonprod').value;
        newCfg.tokenRefresh.credentials.prod.client_id = document.getElementById('client-id-prod').value;
        newCfg.tokenRefresh.credentials.prod.client_secret = document.getElementById('client-secret-prod').value;
        try {
            await ipcRenderer.invoke('save-config', newCfg);
            alert('Settings saved');
            document.getElementById('settings-dialog').close();
        } catch (err) {
            dialog.showErrorBox('Save Error', err.message);
        }
    });
});

// Export functions for use in other modules
module.exports = {
    callAdhocRequest,
    saveAdhocRequest
};
