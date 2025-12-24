import { Role } from '@/types';

// Helper function to get role display name
export const getRoleDisplayName = (role: Role): string => {
    const roleMap: Record<Role, string> = {
        principal: 'Hiệu trưởng',
        vice_principal: 'Ban giám hiệu',
        head_dept: 'Trưởng khoa',
        teacher: 'Giáo viên',
        academic_affairs: 'Giáo vụ',
        qa_testing: 'Khảo thí',
        student_affairs: 'Công tác sinh viên',
        student: 'Học sinh',
        no_role: 'Chưa phân quyền',
    };
    return roleMap[role] || role;
};

// Helper function to get role badge color
export const getRoleBadgeColor = (role: Role): string => {
    const colorMap: Record<Role, string> = {
        principal: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        vice_principal: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
        head_dept: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
        teacher: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
        academic_affairs: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        qa_testing: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        student_affairs: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
        student: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
        no_role: 'bg-slate-100 text-slate-500 border border-slate-200 dark:bg-slate-900/50 dark:text-slate-400',
    };
    return colorMap[role] || 'bg-gray-100 text-gray-800';
};

// Roles that can access audit logs
export const AUDIT_LOG_ROLES: Role[] = ['principal', 'vice_principal', 'head_dept'];

export const canAccessAuditLogs = (role: Role): boolean => {
    return AUDIT_LOG_ROLES.includes(role);
};

// Roles that can manage students
export const MANAGE_STUDENT_ROLES: Role[] = ['principal', 'vice_principal'];

export const canManageStudents = (role: Role): boolean => {
    return MANAGE_STUDENT_ROLES.includes(role);
};
