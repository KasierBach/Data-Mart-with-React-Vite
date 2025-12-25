const prisma = require('./utils/prisma');

async function listTables() {
    try {
        const tables = await prisma.$queryRaw`SELECT table_name FROM information_schema.tables WHERE table_schema='public'`;
        console.log('Tables in public schema:');
        console.table(tables);
    } catch (err) {
        console.error('Error listing tables:', err.message);
    } finally {
        await prisma.$disconnect();
    }
}

listTables();
