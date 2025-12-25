const express = require('express');
const router = express.Router();
const prisma = require('../utils/prisma');

// Get all students
router.get('/', async (req, res) => {
    try {
        const students = await prisma.factScore.findMany({
            orderBy: {
                id: 'asc'
            }
        });
        res.json(students);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

module.exports = router;
