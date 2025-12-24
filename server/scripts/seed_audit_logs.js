const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

const auditLogs = [
    { username: 'principal', action: 'LOGIN', details: 'User principal logged in successfully', ip: '192.168.1.1' },
    { username: 'principal', action: 'VIEW_DASHBOARD', details: 'Viewed main dashboard', ip: '192.168.1.1' },
    { username: 'vice_principal', action: 'LOGIN', details: 'User vice_principal logged in', ip: '192.168.1.2' },
    { username: 'teacher', action: 'LOGIN', details: 'User teacher logged in', ip: '192.168.1.3' },
    { username: 'teacher', action: 'UPDATE_SCORE', details: 'Updated math score for student ID 123', ip: '192.168.1.3' },
    { username: 'student', action: 'LOGIN', details: 'User student logged in', ip: '192.168.1.4' },
    { username: 'student', action: 'VIEW_SCORE', details: 'Viewed personal score report', ip: '192.168.1.4' },
    { username: 'admin', action: 'SYSTEM_BACKUP', details: 'Performed automated system backup', ip: '10.0.0.1' },
    { username: 'academic_affairs', action: 'EXPORT_REPORT', details: 'Exported semester grades CSV', ip: '192.168.1.5' },
    { username: 'qa_testing', action: 'LOGIN', details: 'User qa_testing logged in', ip: '192.168.1.6' }
];

async function seedAuditLogs() {
    const client = await pool.connect();
    try {
        console.log('Seeding audit logs...');

        // Optional: clear old logs if needed, but append is usually safer for logs. 
        // We will just insert new ones.

        for (const log of auditLogs) {
            const username = log.username.replace(/'/g, "''");
            const action = log.action.replace(/'/g, "''");
            const details = log.details.replace(/'/g, "''");
            const ip = log.ip.replace(/'/g, "''");

            const query = `
                INSERT INTO audit_logs (username, action, details, ip_address, created_at)
                VALUES ('${username}', '${action}', '${details}', '${ip}', NOW() - (random() * interval '7 days'))
            `;
            await client.query(query);
        }

        console.log(`Successfully seeded ${auditLogs.length} audit logs.`);
    } catch (err) {
        console.error('Error seeding audit logs:', err);
    } finally {
        client.release();
        pool.end();
    }
}

seedAuditLogs();
