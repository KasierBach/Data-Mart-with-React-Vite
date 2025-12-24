const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

const users = [
    { username: 'principal', password: 'principal123', role: 'principal', name: 'Nguyễn Văn An', email: 'principal@school.edu.vn', phone: '0901234567' },
    { username: 'vice_principal', password: 'viceprincipal123', role: 'vice_principal', name: 'Trần Thị Bình', email: 'viceprincipal@school.edu.vn', phone: '0902345678' },
    { username: 'teacher', password: 'teacher123', role: 'teacher', name: 'Lê Văn Cường', email: 'teacher@school.edu.vn', phone: '0903456789' },
    { username: 'head_dept', password: 'headdept123', role: 'head_dept', name: 'Phạm Thị Dung', email: 'headdept@school.edu.vn', phone: '0904567890' },
    { username: 'academic_affairs', password: 'academic123', role: 'academic_affairs', name: 'Hoàng Văn Em', email: 'academic@school.edu.vn', phone: '0905678901' },
    { username: 'qa_testing', password: 'qatesting123', role: 'qa_testing', name: 'Ngô Thị Phương', email: 'qa@school.edu.vn', phone: '0906789012' },
    { username: 'student_affairs', password: 'studentaffairs123', role: 'student_affairs', name: 'Đặng Văn Giang', email: 'studentaffairs@school.edu.vn', phone: '0907890123' },
    { username: 'student', password: 'student123', role: 'student', name: 'Vũ Minh Hùng', email: 'student@school.edu.vn', phone: '0908901234' },
];

async function seedUsers() {
    try {
        console.log('Connecting to database...');
        const client = await pool.connect();

        // First, add the missing columns if they don't exist
        console.log('Adding email and phone columns if not exist...');
        await client.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS email VARCHAR(100)');
        await client.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(20)');

        for (const user of users) {
            const username = user.username.replace(/'/g, "''");
            const password = user.password.replace(/'/g, "''");
            const role = user.role.replace(/'/g, "''");
            const name = user.name.replace(/'/g, "''");
            const email = user.email.replace(/'/g, "''");
            const phone = user.phone.replace(/'/g, "''");

            const query = `
                INSERT INTO users (username, password, role, name, email, phone)
                VALUES ('${username}', '${password}', '${role}', '${name}', '${email}', '${phone}')
                ON CONFLICT (username) 
                DO UPDATE SET password = '${password}', role = '${role}', name = '${name}', email = '${email}', phone = '${phone}'
            `;
            await client.query(query);
            console.log(`User ${user.username} upserted.`);
        }

        console.log('All users seeded successfully!');
        client.release();
        pool.end();
    } catch (err) {
        console.error('Error seeding users:', err);
        pool.end();
    }
}

seedUsers();
