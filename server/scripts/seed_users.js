const prisma = require('../utils/prisma');

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
        console.log('Seeding users using Prisma...');

        for (const user of users) {
            await prisma.user.upsert({
                where: { username: user.username },
                update: {
                    password: user.password,
                    role: user.role,
                    name: user.name,
                    email: user.email,
                    phone: user.phone
                },
                create: user
            });
            console.log(`User ${user.username} upserted.`);
        }

        console.log('All users seeded successfully!');
    } catch (err) {
        console.error('Error seeding users:', err.message || err);
    } finally {
        await prisma.$disconnect();
    }
}

seedUsers();
