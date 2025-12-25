const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const prisma = require('../utils/prisma');

const csvFilePath = path.join(__dirname, '../../data/Data Mart Kết quả học tập.csv');

async function importData() {
    try {
        console.log('Clearing existing data using Prisma...');
        await prisma.factScore.deleteMany();

        // Note: Prisma doesn't have a built-in cross-DB "reset sequence" method easily,
        // so we use raw SQL for resetting the auto-increment ID if needed.
        await prisma.$executeRawUnsafe('ALTER SEQUENCE fact_scores_15dec_id_seq RESTART WITH 1');

        const results = [];
        fs.createReadStream(csvFilePath)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', async () => {
                console.log(`Found ${results.length} records. Importing using Prisma createMany...`);

                const dataToImport = results.map(row => ({
                    gender: row.gender,
                    race_ethnicity: row.race_ethnicity,
                    parental_education: row.parental_education,
                    math: row.math,
                    math_score: parseInt(row.math_score) || 0,
                    reading: row.reading,
                    reading_score: parseInt(row.reading_score) || 0,
                    writing: row.writing,
                    writing_score: parseInt(row.writing_score) || 0,
                }));

                // Prisma createMany is very efficient for bulk inserts
                await prisma.factScore.createMany({
                    data: dataToImport
                });

                console.log('Data import completed successfully!');
                await prisma.$disconnect();
                process.exit(0);
            });
    } catch (e) {
        console.error('Error importing data:', e);
        await prisma.$disconnect();
        process.exit(1);
    }
}

importData();
