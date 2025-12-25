const prisma = require('./utils/prisma');

async function debug() {
    console.log('--- Database Audit ---');

    const tables = ['user', 'auditLog', 'factScore'];

    for (const table of tables) {
        try {
            const count = await prisma[table].count();
            console.log(`Table ${table} (count): SUCCESS (Count: ${count})`);
            const data = await prisma[table].findMany({ take: 1 });
            console.log(`Table ${table} (findMany): SUCCESS`);
        } catch (err) {
            console.error(`Table ${table}: FAILED`);
            console.error(`  Error message: ${err.message}`);
            if (err.code) console.error(`  Error code: ${err.code}`);
        }
    }

    await prisma.$disconnect();
}

debug();
