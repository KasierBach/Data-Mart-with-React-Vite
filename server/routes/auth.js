const express = require('express');
const router = express.Router();
const prisma = require('../utils/prisma');
const { logAudit } = require('../utils/helpers');

// Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await prisma.user.findUnique({
            where: { username: username }
        });

        if (user) {
            if (user.password === password) {
                await logAudit(username, 'LOGIN_SUCCESS', `User ${username} logged in successfully`, req);
                res.json({
                    success: true,
                    user: {
                        username: user.username,
                        role: user.role,
                        name: user.name,
                        email: user.email,
                        phone: user.phone
                    }
                });
            } else {
                await logAudit(username, 'LOGIN_FAILED', `Invalid password attempt for user ${username}`, req);
                res.status(401).json({ success: false, message: 'Invalid credentials' });
            }
        } else {
            await logAudit(username || 'unknown', 'LOGIN_FAILED', `User not found: ${username}`, req);
            res.status(401).json({ success: false, message: 'User not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
