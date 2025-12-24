import { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import { API_ENDPOINTS } from "@/config/api"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Shield } from "lucide-react"
import { toast } from "sonner"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { getRoleDisplayName, getRoleBadgeColor } from "@/utils/roleHelpers"
import { Role } from "@/types"

interface UserRecord {
    id: number;
    username: string;
    role: Role;
    name: string;
    email: string;
    phone: string;
}

const ROLES: Role[] = [
    'principal',
    'vice_principal',
    'head_dept',
    'teacher',
    'academic_affairs',
    'qa_testing',
    'student_affairs',
    'student',
    'no_role'
];

export function UsersPage() {
    const [users, setUsers] = useState<UserRecord[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const { user: currentUser } = useAuth()

    const loadUsers = async () => {
        try {
            setIsLoading(true);
            // Assuming we pass auth headers or the backend knows us (session)
            // But since this is a simple implementation without full JWT interception yet:
            const response = await fetch(API_ENDPOINTS.USERS);

            if (!response.ok) {
                throw new Error("Failed to fetch users");
            }

            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("Không thể tải danh sách người dùng.");
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        loadUsers();
    }, []);

    const handleRoleChange = async (username: string, newRole: Role) => {
        if (!currentUser) return;

        // Optimistic update
        const originalUsers = [...users];
        setUsers(prev => prev.map(u =>
            u.username === username ? { ...u, role: newRole } : u
        ));

        try {
            const response = await fetch(`${API_ENDPOINTS.USERS}/${username}/role`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    newRole,
                    adminUsername: currentUser.username
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update role');
            }

            toast.success(`Đã cập nhật vai trò cho ${username}`);
        } catch (error) {
            console.error("Error updating role:", error);
            toast.error("Cập nhật thất bại.");
            // Revert on error
            setUsers(originalUsers);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Quản lý Người dùng</h1>
                    <p className="text-muted-foreground">Phân quyền và quản lý tài khoản hệ thống</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Danh sách tài khoản
                    </CardTitle>
                    <CardDescription>
                        Chỉ có Hiệu trưởng mới có thể thay đổi vai trò của người dùng.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Username</TableHead>
                                <TableHead>Họ tên</TableHead>
                                <TableHead>Vai trò hiện tại</TableHead>
                                <TableHead>Hành động</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((u) => (
                                <TableRow key={u.id}>
                                    <TableCell className="font-medium">{u.username}</TableCell>
                                    <TableCell>{u.name}</TableCell>
                                    <TableCell>
                                        <Badge className={`hover:bg-opacity-80 ${getRoleBadgeColor(u.role)}`}>
                                            {getRoleDisplayName(u.role)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="w-48">
                                            <Select
                                                value={u.role}
                                                onValueChange={(val: Role) => handleRoleChange(u.username, val)}
                                                // Prevent changing own role or if not principal
                                                disabled={u.username === currentUser?.username}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {ROLES.map((role) => (
                                                        <SelectItem key={role} value={role}>
                                                            {getRoleDisplayName(role)}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
