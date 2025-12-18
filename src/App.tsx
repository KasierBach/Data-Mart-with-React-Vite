import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from "react-router-dom"
import { Toaster } from "@/components/ui/sonner"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { toast } from "sonner"
import { DataRecord } from "./types"
import { DashboardPage } from "./pages/DashboardPage"
import { StudentListPage } from "./pages/StudentListPage"
import { LayoutDashboard, Users, GraduationCap, LogOut } from "lucide-react"
import { AuthProvider, useAuth } from "./context/AuthContext"
import { LoginPage } from "./pages/LoginPage"

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
    const { user, logout } = useAuth();

    // Load Data from API
    const loadData = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/students');
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
                                <span>Student's Datamart ({user.name})</span>
                            </div>

                            <nav className="hidden md:flex items-center gap-2">
                                <NavLink to="/" icon={LayoutDashboard}>Dashboard</NavLink>
                                <NavLink to="/students" icon={Users}>Students</NavLink>
                            </nav>
                        </div>

                        <div className="flex items-center gap-4">
                            <ThemeToggle />
                            <button onClick={logout} className="p-2 hover:bg-muted rounded-full" title="Logout">
                                <LogOut className="h-5 w-5" />
                            </button>
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
                                    <StudentListPage
                                        data={data}
                                        onAdd={handleAddRecord}
                                        onUpdate={handleUpdateRecord}
                                        onDelete={handleDelete}
                                        onRefresh={handleRefresh}
                                        onReset={handleReset}
                                        isRefreshing={isRefreshing}
                                    />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </div>
            </main>
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
