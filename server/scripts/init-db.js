const fs = require('fs');
const path = require('path');
const prisma = require('../utils/prisma');

async function initDb() {
    try {
        const sqlPath = path.join(__dirname, '../init.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('Running init.sql using Prisma...');
        // Split SQL by semicolon and filter out empty statements to execute safely
        const statements = sql.split(';').filter(s => s.trim().length > 0);

        for (const statement of statements) {
            await prisma.$executeRawUnsafe(statement);
        }

        console.log('Successfully initialized database schema!');
    } catch (err) {
        console.error('Error initializing database:', err);
    } finally {
        await prisma.$disconnect();
    }
}

initDb();
