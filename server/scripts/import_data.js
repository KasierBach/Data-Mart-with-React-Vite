const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const csv = require('csv-parser');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const csvFilePath = path.join(__dirname, '../Data Mart Kết quả học tập.csv');

async function importData() {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Optional: Clear existing data
        await client.query('DELETE FROM fact_scores_15dec');

        const results = [];
        fs.createReadStream(csvFilePath)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', async () => {
                console.log(`Found ${results.length} records. Importing to fact_scores_15dec...`);

                for (const row of results) {
                    // CSV Columns: gender,race_ethnicity,parental_education,math,math_score,reading,reading_score,writing,writing_score
                    const query = `
            INSERT INTO fact_scores_15dec (
                gender, race_ethnicity, parental_education, 
                math, math_score, 
                reading, reading_score, 
                writing, writing_score
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          `;
                    const values = [
                        row.gender,
                        row.race_ethnicity,
                        row.parental_education,
                        row.math,
                        parseInt(row.math_score) || 0,
                        row.reading,
                        parseInt(row.reading_score) || 0,
                        row.writing,
                        parseInt(row.writing_score) || 0
                    ];
                    await client.query(query, values);
                }

                await client.query('COMMIT');
                console.log('Data import completed successfully!');
                process.exit(0);
            });
    } catch (e) {
        await client.query('ROLLBACK');
        console.error('Error importing data:', e);
        process.exit(1);
    } finally {
        client.release();
    }
}

importData();
