// API Configuration
// Change this when deploying to production

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const API_ENDPOINTS = {
    // Auth
    LOGIN: `${API_BASE_URL}/api/login`,

    // Students
    STUDENTS: `${API_BASE_URL}/api/students`,

    // Audit Logs
    AUDIT_LOGS: `${API_BASE_URL}/api/audit-logs`,

    // Users
    USERS: `${API_BASE_URL}/api/users`,

    // Health check
    HEALTH: `${API_BASE_URL}/api/health`,
};

export default API_BASE_URL;
