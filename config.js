// config.js
const devConfig = {
    port: 3000,
    databaseUrl: 'postgres://admin:admin@db:5432/sblitz_billing_dev', // Update with your DB credentials
};

const prodConfig = {
    port: 80,
    databaseUrl: process.env.DATABASE_URL, // Use environment variable for production
};

const testConfig = {
    port: 3001,
    databaseUrl: 'postgres://admin:admin@db:5432/sblitz_billing_test', // Example test DB URL
};

const config = {
    dev: devConfig,
    prod: prodConfig,
    test: testConfig,
};

module.exports = config;
