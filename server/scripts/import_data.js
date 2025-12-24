const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const csv = require('csv-parser');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

const csvFilePath = path.join(__dirname, '../../data/Data Mart Kết quả học tập.csv');

async function importData() {
    const client = await pool.connect();
    try {
        // Clear existing data and reset ID sequence
        console.log('Clearing existing data and resetting ID sequence...');
        await client.query('DELETE FROM fact_scores_15dec');
        await client.query('ALTER SEQUENCE fact_scores_15dec_id_seq RESTART WITH 1');

        const results = [];
        fs.createReadStream(csvFilePath)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', async () => {
                console.log(`Found ${results.length} records. Importing in chunks...`);

                const CHUNK_SIZE = 50;
                for (let i = 0; i < results.length; i += CHUNK_SIZE) {
                    const chunk = results.slice(i, i + CHUNK_SIZE);
                    const values = chunk.map(row => {
                        const gender = (row.gender || '').replace(/'/g, "''");
                        const race = (row.race_ethnicity || '').replace(/'/g, "''");
                        const parental = (row.parental_education || '').replace(/'/g, "''");
                        const math = (row.math || '').replace(/'/g, "''");
                        const math_score = parseInt(row.math_score) || 0;
                        const reading = (row.reading || '').replace(/'/g, "''");
                        const reading_score = parseInt(row.reading_score) || 0;
                        const writing = (row.writing || '').replace(/'/g, "''");
                        const writing_score = parseInt(row.writing_score) || 0;

                        return `('${gender}', '${race}', '${parental}', '${math}', ${math_score}, '${reading}', ${reading_score}, '${writing}', ${writing_score})`;
                    }).join(',');

                    const query = `
                        INSERT INTO fact_scores_15dec (
                            gender, race_ethnicity, parental_education, 
                            math, math_score, 
                            reading, reading_score, 
                            writing, writing_score
                        )
                        VALUES ${values}
                    `;

                    await client.query(query);
                    console.log(`Imported chunk ${i / CHUNK_SIZE + 1}`);
                }

                console.log('Data import completed successfully!');
                client.release();
                pool.end();
                process.exit(0);
            });
    } catch (e) {
        console.error('Error importing data:', e);
        client.release();
        pool.end();
        process.exit(1);
    }
}

importData();
