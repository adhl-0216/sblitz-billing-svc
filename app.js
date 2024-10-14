// app.js
const express = require('express');
const { Pool } = require('pg');
const config = require('./config')

function createApp(config) {
    const app = express();
    const PORT = config.port || 3000;

    // PostgreSQL connection pool
    const pool = new Pool({
        connectionString: config.databaseUrl,
    });

    // Define routes
    app.get('/', (req, res) => {
        res.json({ message: 'actually working?' });
    });

    // Start the server
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });

    return app; // Return the app instance
}

createApp(config.dev);
