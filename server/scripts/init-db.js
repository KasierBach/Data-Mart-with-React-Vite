const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function initDb() {
    const client = await pool.connect();
    try {
        const sqlPath = path.join(__dirname, 'init.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('Running init.sql...');
        await client.query(sql);
        console.log('Successfully initialized database schema!');
    } catch (err) {
        console.error('Error initializing database:', err);
    } finally {
        client.release();
        pool.end();
    }
}

initDb();
