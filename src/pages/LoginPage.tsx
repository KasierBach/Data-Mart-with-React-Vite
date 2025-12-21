import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { GraduationCap, User, Lock } from "lucide-react";

export function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username.trim()) {
            toast.error("Vui lòng nhập tên đăng nhập!");
            return;
        }
        if (!password) {
            toast.error("Vui lòng nhập mật khẩu!");
            return;
        }
        const success = await login(username.trim(), password);
        if (success) {
            toast.success("Đăng nhập thành công!");
            navigate("/");
        } else {
            toast.error("Sai tên đăng nhập hoặc mật khẩu!");
        }
    };

    // Danh sách tài khoản demo để hiển thị
    const demoAccounts = [
        { username: 'principal', password: 'principal123', role: 'Hiệu trưởng' },
        { username: 'vice_principal', password: 'viceprincipal123', role: 'Ban giám hiệu' },
        { username: 'head_dept', password: 'headdept123', role: 'Trưởng khoa' },
        { username: 'teacher', password: 'teacher123', role: 'Giáo viên' },
        { username: 'academic_affairs', password: 'academic123', role: 'Giáo vụ' },
        { username: 'qa_testing', password: 'qatesting123', role: 'Khảo thí' },
        { username: 'student_affairs', password: 'studentaffairs123', role: 'CTSV' },
        { username: 'student', password: 'student123', role: 'Học sinh' },
    ];

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
            <div className="w-full max-w-md space-y-6 bg-card p-8 rounded-lg shadow-lg border">
                <div className="flex flex-col items-center justify-center text-center space-y-2">
                    <div className="flex items-center gap-2 font-bold text-2xl text-primary">
                        <GraduationCap className="h-8 w-8" />
                        <span>Student's Datamart</span>
                    </div>
                    <h2 className="text-xl font-semibold tracking-tight">
                        Đăng nhập vào hệ thống
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Nhập tài khoản để truy cập Dashboard
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none" htmlFor="username">
                            Tên đăng nhập
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <input
                                id="username"
                                type="text"
                                className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                placeholder="Nhập username..."
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                autoComplete="username"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none" htmlFor="password">
                            Mật khẩu
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <input
                                id="password"
                                type="password"
                                className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                placeholder="Nhập password..."
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="current-password"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
                    >
                        Đăng nhập
                    </button>
                </form>

                <div className="border-t pt-4">
                    <p className="text-xs text-muted-foreground text-center mb-3">
                        Tài khoản demo (click để điền tự động)
                    </p>
                    <div className="grid grid-cols-1 gap-2 text-xs max-h-48 overflow-y-auto">
                        {demoAccounts.map((acc) => (
                            <button
                                key={acc.username}
                                type="button"
                                onClick={() => {
                                    setUsername(acc.username);
                                    setPassword(acc.password);
                                }}
                                className="flex items-center justify-between px-3 py-2 rounded border hover:bg-muted/50 transition-colors text-left"
                            >
                                <div className="flex flex-col">
                                    <span className="font-medium text-primary">{acc.role}</span>
                                    <span className="text-muted-foreground font-mono text-[10px]">
                                        {acc.username} / {acc.password}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
