const prisma = require('./prisma');

// Helper to log audit events
async function logAudit(username, action, details, req) {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    try {
        await prisma.auditLog.create({
            data: {
                username: username,
                action: action,
                details: details,
                ip_address: ip
            }
        });
    } catch (err) {
        console.error('Audit log error:', err);
    }
}

module.exports = { logAudit };
