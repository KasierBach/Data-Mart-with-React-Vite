const express = require('express');
const router = express.Router();
const prisma = require('../utils/prisma');
const { logAudit } = require('../utils/helpers');

// Middleware to check if user is principal
const isPrincipal = async (req, res, next) => {
    // In a real app, you would verify the JWT token here to get the user role
    // For this simple example, we assume the frontend sends the role in a header or we trust the request for now
    // BUT safest is to check the user exists and has role 'principal'
    // Since we don't have full auth middleware yet, we will proceed.
    // Ideally: if (req.user.role !== 'principal') return res.status(403).send('Forbidden');
    next();
};

// Get all users (id, username, role, name, etc.) - EXCLUDING PASSWORD
router.get('/', isPrincipal, async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                username: true,
                role: true,
                name: true,
                email: true,
                phone: true
            },
            orderBy: {
                id: 'asc'
            }
        });
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Update user role
router.put('/:username/role', isPrincipal, async (req, res) => {
    const { username } = req.params;
    const { newRole, adminUsername } = req.body; // adminUsername is who performed the action

    if (!newRole) {
        return res.status(400).json({ error: 'New role is required' });
    }

    try {
        // 1. Check if user exists
        const user = await prisma.user.findUnique({
            where: { username: username }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const oldRole = user.role;

        // 2. Update role
        await prisma.user.update({
            where: { username: username },
            data: { role: newRole }
        });

        // 3. Log audit
        await logAudit(
            adminUsername || 'unknown_principal',
            'UPDATE_ROLE',
            `Changed role for user ${username} from ${oldRole} to ${newRole}`,
            req
        );

        res.json({ success: true, message: `Role updated to ${newRole}` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error updating role' });
    }
});

// Update user profile (Self update)
router.put('/:username/profile', async (req, res) => {
    const { username } = req.params;
    const { name, email, phone, currentPassword, newPassword } = req.body;

    try {
        // 1. Get current user
        const user = await prisma.user.findUnique({
            where: { username: username }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // 2. Prepare update data
        const updateData = { name, email, phone };

        // 3. Handle password change if requested
        if (newPassword) {
            // Verify current password
            if (user.password !== currentPassword) {
                return res.status(401).json({ error: 'Mật khẩu hiện tại không đúng' });
            }
            updateData.password = newPassword;
        }

        const updatedUser = await prisma.user.update({
            where: { username: username },
            data: updateData,
            select: {
                username: true,
                role: true,
                name: true,
                email: true,
                phone: true
            }
        });

        // 4. Log audit
        await logAudit(
            username,
            'UPDATE_PROFILE',
            `User updated profile${newPassword ? ' and changed password' : ''}`,
            req
        );

        res.json({ success: true, user: updatedUser, message: 'Cập nhật thông tin thành công' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error updating profile' });
    }
});

module.exports = router;
