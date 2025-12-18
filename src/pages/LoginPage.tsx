import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { GraduationCap } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../components/ui/select";
import { Role } from "../types";

export function LoginPage() {
    const [username, setUsername] = useState<Role | "">(""); // Type as Role or empty
    const [password, setPassword] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();

    const roles: { value: Role; label: string }[] = [
        { value: 'principal', label: 'Hiệu trưởng (Principal)' },
        { value: 'vice_principal', label: 'Ban giám hiệu (Vice Principal)' },
        { value: 'head_dept', label: 'Trưởng khoa (Head of Dept)' },
        { value: 'teacher', label: 'Giáo viên (Teacher)' },
        { value: 'academic_affairs', label: 'Giáo vụ (Academic Affairs)' },
        { value: 'qa_testing', label: 'Khảo thí (QA/Testing)' },
        { value: 'student_affairs', label: 'Công tác sinh viên (Student Affairs)' },
        { value: 'student', label: 'Học sinh (Student)' },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username) {
            toast.error("Vui lòng chọn vai trò!");
            return;
        }
        const success = await login(username, password);
        if (success) {
            toast.success("Đăng nhập thành công!");
            navigate("/");
        } else {
            toast.error("Sai tên đăng nhập hoặc mật khẩu!");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
            <div className="w-full max-w-md space-y-8 bg-card p-8 rounded-lg shadow-lg border">
                <div className="flex flex-col items-center justify-center text-center space-y-2">
                    <div className="flex items-center gap-2 font-bold text-2xl text-primary">
                        <GraduationCap className="h-8 w-8" />
                        <span>Student's Datamart</span>
                    </div>
                    <h2 className="text-xl font-semibold tracking-tight">
                        Đăng nhập vào hệ thống
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Chọn vai trò để truy cập Dashboard (Demo)
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="role-select">
                            Vai trò / Tài khoản
                        </label>
                        <Select onValueChange={(val) => setUsername(val as Role)} defaultValue={username || undefined}>
                            <SelectTrigger id="role-select">
                                <SelectValue placeholder="Chọn vai trò của bạn" />
                            </SelectTrigger>
                            <SelectContent>
                                {roles.map((role) => (
                                    <SelectItem key={role.value} value={role.value}>
                                        {role.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="password">
                            Mật khẩu
                        </label>
                        <input
                            id="password"
                            type="password"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
                    >
                        Đăng nhập
                    </button>
                </form>

                <div className="text-center text-xs text-muted-foreground">
                    <p>Mật khẩu demo chung:</p>
                    <p className="font-mono bg-muted inline-block px-2 py-1 rounded mt-1">password</p>
                </div>
            </div>
        </div>
    );
}
