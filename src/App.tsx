import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from "react-router-dom"
import { Toaster } from "@/components/ui/sonner"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { toast } from "sonner"
import { DataRecord } from "./types"
import { DashboardPage } from "./pages/DashboardPage"
import { StudentListPage } from "./pages/StudentListPage"
import { LayoutDashboard, Users, GraduationCap, LogOut, User, ChevronDown, Mail, Phone, History, Shield, Settings } from "lucide-react"
import { AuthProvider, useAuth } from "./context/AuthContext"
import { LoginPage } from "./pages/LoginPage"
import { AuditLogPage } from "./pages/AuditLogPage"
import { getRoleDisplayName, getRoleBadgeColor, canAccessAuditLogs, canManageStudents } from "./utils/roleHelpers"
import { API_ENDPOINTS } from "./config/api"
import { UsersPage } from "./pages/UsersPage"
import { ProfileDialog } from "./components/ProfileDialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


function NavLink({ to, children, icon: Icon }: { to: string; children: React.ReactNode; icon: any }) {
    const location = useLocation()
    const isActive = location.pathname === to

    return (
        <Link
            to={to}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted"
                }`}
        >
            <Icon className="h-4 w-4" />
            <span className="font-medium">{children}</span>
        </Link>
    )
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useAuth();

    if (isLoading) return <div>Loading...</div>;

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
}

function AppContent() {
    const [data, setData] = useState<DataRecord[]>([])
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [profileOpen, setProfileOpen] = useState(false)
    const { user, logout } = useAuth();

    // Load Data from API
    const loadData = async () => {
        try {
            const response = await fetch(API_ENDPOINTS.STUDENTS);
            if (!response.ok) throw new Error("Failed to fetch");
            const jsonData = await response.json();
            setData(jsonData);
            toast.success("Đã tải dữ liệu từ Database!");
        } catch (error) {
            console.error("Error loading data:", error);
            toast.error("Không thể kết nối Server! Vui lòng kiểm tra.");
            setData([]); // Or keep previous
        }
    }

    useEffect(() => {
        if (user) {
            loadData();
        }
    }, [user]);

    // Actions
    const handleRefresh = async () => {
        setIsRefreshing(true)
        await loadData();
        setIsRefreshing(false)
    }

    // Mock handlers for now (since we haven't implemented Full CRUD API in frontend yet)
    // In a real app, these would call fetch('...', { method: 'POST' }) etc.
    const handleReset = async () => { handleRefresh(); }
    const handleDelete = (id: number) => {
        setData(prev => prev.filter(item => item.id !== id));
        toast.info("Chức năng xóa trên DB chưa được kích hoạt ở frontend này.");
    }
    const handleAddRecord = (record: DataRecord) => {
        setData(prev => [...prev, record]);
    }
    const handleUpdateRecord = (updatedRecord: DataRecord) => {
        setData(prev => prev.map(item => item.id === updatedRecord.id ? updatedRecord : item));
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Toaster richColors position="top-right" />

            {/* Navbar */}
            {user && (
                <header className="border-b bg-card">
                    <div className="mx-auto max-w-7xl px-4 md:px-8 h-16 flex items-center justify-between">
                        <div className="flex items-center gap-8">
                            <div className="flex items-center gap-2 font-bold text-xl">
                                <GraduationCap className="h-6 w-6 text-primary" />
                                <span>Student's Datamart</span>
                            </div>

                            <nav className="hidden md:flex items-center gap-2">
                                <NavLink to="/" icon={LayoutDashboard}>Dashboard</NavLink>
                                {canManageStudents(user.role) && (
                                    <NavLink to="/students" icon={Users}>Students</NavLink>
                                )}
                                {canAccessAuditLogs(user.role) && (
                                    <NavLink to="/audit-logs" icon={History}>Logs</NavLink>
                                )}
                                {user.role === 'principal' && (
                                    <NavLink to="/users" icon={Shield}>Users</NavLink>
                                )}
                            </nav>

                        </div>

                        <div className="flex items-center gap-3">
                            <ThemeToggle />

                            {/* User Account Dropdown */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors border">
                                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                            <User className="h-4 w-4 text-primary" />
                                        </div>
                                        <div className="hidden sm:block text-left">
                                            <p className="text-sm font-medium leading-tight">{user.name}</p>
                                            <p className="text-xs text-muted-foreground">{user.username}</p>
                                        </div>
                                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-64">
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-2">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <User className="h-5 w-5 text-primary" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-semibold">{user.name}</p>
                                                    <p className="text-xs text-muted-foreground">@{user.username}</p>
                                                </div>
                                            </div>
                                            <div className="pt-1">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                                                    {getRoleDisplayName(user.role)}
                                                </span>
                                            </div>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-xs text-muted-foreground" disabled>
                                        <span>Vai trò: {getRoleDisplayName(user.role)}</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-xs text-muted-foreground" disabled>
                                        <span>Username: {user.username}</span>
                                    </DropdownMenuItem>
                                    {user.email && (
                                        <DropdownMenuItem className="text-xs text-muted-foreground" disabled>
                                            <Mail className="h-3 w-3 mr-2" />
                                            <span>{user.email}</span>
                                        </DropdownMenuItem>
                                    )}
                                    {user.phone && (
                                        <DropdownMenuItem className="text-xs text-muted-foreground" disabled>
                                            <Phone className="h-3 w-3 mr-2" />
                                            <span>{user.phone}</span>
                                        </DropdownMenuItem>
                                    )}
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => setProfileOpen(true)} className="cursor-pointer">
                                        <Settings className="h-4 w-4 mr-2" />
                                        <span>Cài đặt tài khoản</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={logout}
                                        className="text-red-600 dark:text-red-400 cursor-pointer"
                                    >
                                        <LogOut className="h-4 w-4 mr-2" />
                                        <span>Đăng xuất</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </header>
            )}

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8">
                <div className="mx-auto max-w-7xl">
                    <Routes>
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/" element={
                            <ProtectedRoute>
                                <DashboardPage data={data} />
                            </ProtectedRoute>
                        } />
                        <Route
                            path="/students"
                            element={
                                <ProtectedRoute>
                                    {user && canManageStudents(user.role) ? (
                                        <StudentListPage
                                            data={data}
                                            onAdd={handleAddRecord}
                                            onUpdate={handleUpdateRecord}
                                            onDelete={handleDelete}
                                            onRefresh={handleRefresh}
                                            onReset={handleReset}
                                            isRefreshing={isRefreshing}
                                        />
                                    ) : (
                                        <Navigate to="/" replace />
                                    )}
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/audit-logs"
                            element={
                                <ProtectedRoute>
                                    {user && canAccessAuditLogs(user.role) ? (
                                        <AuditLogPage />
                                    ) : (
                                        <Navigate to="/" replace />
                                    )}
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/users"
                            element={
                                <ProtectedRoute>
                                    {user && user.role === 'principal' ? (
                                        <UsersPage />
                                    ) : (
                                        <Navigate to="/" replace />
                                    )}
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </div>
            </main>
            <ProfileDialog open={profileOpen} onOpenChange={setProfileOpen} />
        </div>
    )
}

export default function App() {
    return (
        <Router>
            <AuthProvider>
                <AppContent />
            </AuthProvider>
        </Router>
    )
}
