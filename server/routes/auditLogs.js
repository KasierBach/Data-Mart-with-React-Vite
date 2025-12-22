const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Get all audit logs
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 100');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Delete single audit log
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM audit_logs WHERE id = $1', [id]);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Clear all audit logs
router.delete('/', async (req, res) => {
    try {
        await pool.query('DELETE FROM audit_logs');
        res.json({ success: true, message: 'All logs cleared' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

module.exports = router;
