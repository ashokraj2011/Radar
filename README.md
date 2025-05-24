# Ruliad Navigator Application

This is an Electron-based desktop application for the Ruliad Navigator, providing a user interface for interacting with rule engines and related services.

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [PostgreSQL](https://www.postgresql.org/) (for database connectivity)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ashokraj2011/Radar.git
   cd Radar
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Configuration

The application uses a configuration file (`config.json`) to manage different environments. The default configuration includes:

- Database connection settings
- API endpoints
- Token refresh URLs

### Configuration Structure

The `config.json` file has the following structure:

```json
{
  "environments": {
    "DEV": {
      "db": {
        "host": "localhost",
        "port": 5432,
        "user": "postgres",
        "password": "",
        "database": "postgres"
      },
      "apis": {
        "ruleEngine": "http://localhost:8080/ruleengine",
        "ruleMetadata": "http://localhost:8081/metadata",
        "graphql": "http://localhost:4000/graphql",
        "queryGenerator": "http://localhost:8080/query-generator"
      }
    },
    // Other environments (UAT, PRE_PROD, PROD, LOCAL)
  },
  "defaultEnvironment": "DEV",
  "tokenRefresh": {
    "nonProd": "http://localhost:8080/auth/refresh",
    "prod": "https://api.example.com/auth/refresh"
  }
}
```

### Customizing Configuration

You can modify the `config.json` file to match your local development environment:

1. Update the database connection settings
2. Configure API endpoints
3. Set the default environment

## Running the Application

To start the application in development mode:

```bash
npm start
```

This will launch the Electron application with the login screen.

## Development Workflow

1. The application starts with `main.js` as the entry point
2. It loads configuration from `config.json`
3. The main window loads `login.html` first
4. After authentication, the main application interface is loaded

## Project Structure

- `main.js` - Main Electron process file
- `preload.js` - Preload script for the renderer process
- `login.html` - Login page
- `index.html` - Main application page
- `config.js` - Configuration loader
- `config.json` - Application configuration
- `db.js` - Database connection utilities
- `components/` - UI components
- `services/` - Service modules
- `utils/` - Utility functions

## Dependencies

- `electron` - Framework for building cross-platform desktop applications
- `@electron/remote` - Remote module for Electron
- `pg` - PostgreSQL client for Node.js

## License

ISC