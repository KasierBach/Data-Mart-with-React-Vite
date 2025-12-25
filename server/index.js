const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const auditLogsRoutes = require('./routes/auditLogs');
const studentsRoutes = require('./routes/students');
const usersRoutes = require('./routes/users');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database connection
// (Prisma handles this automatically on first request)

// Routes
app.use('/api', authRoutes);
app.use('/api/audit-logs', auditLogsRoutes);
app.use('/api/students', studentsRoutes);
app.use('/api/users', usersRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start Server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
