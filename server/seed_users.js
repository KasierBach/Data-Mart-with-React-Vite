const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const users = [
    { username: 'principal', password: 'password', role: 'principal', name: 'Hiệu Trưởng' },
    { username: 'vice_principal', password: 'password', role: 'vice_principal', name: 'Phó Hiệu Trưởng' },
    { username: 'teacher', password: 'password', role: 'teacher', name: 'Giáo Viên' },
    { username: 'head_dept', password: 'password', role: 'head_dept', name: 'Trưởng Khoa' },
    { username: 'academic_affairs', password: 'password', role: 'academic_affairs', name: 'Giáo Vụ' },
    { username: 'qa_testing', password: 'password', role: 'qa_testing', name: 'Khảo Thí' },
    { username: 'student_affairs', password: 'password', role: 'student_affairs', name: 'Công Tác Sinh Viên' },
    { username: 'student', password: 'password', role: 'student', name: 'Học Sinh' },
    // Ensure existing ones match new role names if needed, or just add new ones
];

async function seedUsers() {
    try {
        console.log('Connecting to database...');
        await pool.connect();

        for (const user of users) {
            const query = `
        INSERT INTO users (username, password, role, name)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (username) 
        DO UPDATE SET role = $3, name = $4; -- Update if exists to ensure role matches
      `;
            await pool.query(query, [user.username, user.password, user.role, user.name]);
            console.log(`User ${user.username} upserted.`);
        }

        console.log('All users seeded successfully.');
    } catch (err) {
        console.error('Error seeding users:', err);
    } finally {
        await pool.end();
    }
}

seedUsers();
