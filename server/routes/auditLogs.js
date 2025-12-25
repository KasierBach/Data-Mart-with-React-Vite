const express = require('express');
const router = express.Router();
const prisma = require('../utils/prisma');

// Get all audit logs
router.get('/', async (req, res) => {
    try {
        const logs = await prisma.auditLog.findMany({
            take: 100,
            orderBy: {
                created_at: 'desc'
            }
        });
        res.json(logs);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Delete single audit log
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.auditLog.delete({
            where: { id: parseInt(id) }
        });
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Clear all audit logs
router.delete('/', async (req, res) => {
    try {
        await prisma.auditLog.deleteMany();
        res.json({ success: true, message: 'All logs cleared' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

module.exports = router;
