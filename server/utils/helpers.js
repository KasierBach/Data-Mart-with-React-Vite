const pool = require('../config/db');

// Helper to log audit events
async function logAudit(username, action, details, req) {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    try {
        await pool.query(
            'INSERT INTO audit_logs (username, action, details, ip_address) VALUES ($1, $2, $3, $4)',
            [username, action, details, ip]
        );
    } catch (err) {
        console.error('Audit log error:', err);
    }
}

module.exports = { logAudit };
