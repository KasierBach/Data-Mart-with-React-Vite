import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom"
import { Toaster } from "@/components/ui/sonner"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { toast } from "sonner"
import { DataRecord } from "./types"
import { DashboardPage } from "./pages/DashboardPage"
import { StudentListPage } from "./pages/StudentListPage"
import { LayoutDashboard, Users, GraduationCap } from "lucide-react"

// Mock data and CSV functions (Keep existing logic)
const initialMockData: DataRecord[] = [
    { id: 1, gender: "male", race_ethnicity: "A", parental_education: "some college", math_label: "Math", math_score: 50, reading_label: "Reading", reading_score: 47, writing_label: "Writing", writing_score: 54, status: "active", lastUpdate: "2024-01-15" },
]

function parseCSV(csvText: string): DataRecord[] {
    const lines = csvText.split(/\r?\n/).filter(line => line.trim() !== '')
    const records: DataRecord[] = []
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i]
        const values: string[] = []
        let current = ''
        let inQuote = false
        for (let j = 0; j < line.length; j++) {
            const char = line[j]
            if (char === '"') {
                inQuote = !inQuote
            } else if (char === ',' && !inQuote) {
                values.push(current)
                current = ''
            } else {
                current += char
            }
        }
        values.push(current)
        if (values.length >= 9) {
            records.push({
                id: i,
                gender: values[0],
                race_ethnicity: values[1],
                parental_education: values[2],
                math_label: values[3],
                math_score: parseInt(values[4]) || 0,
                reading_label: values[5],
                reading_score: parseInt(values[6]) || 0,
                writing_label: values[7],
                writing_score: parseInt(values[8]) || 0,
                status: "active",
                lastUpdate: "2024-01-15"
            })
        }
    }
    return records
}

async function fetchCSVData(): Promise<DataRecord[]> {
    try {
        const response = await fetch('/data.csv')
        if (!response.ok) throw new Error(`Failed to fetch CSV: ${response.status} ${response.statusText}`)
        const csvText = await response.text()
        return parseCSV(csvText)
    } catch (error) {
        console.error('Error loading CSV:', error)
        return []
    }
}

const STORAGE_KEY = "student_performance_records"

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

export default function App() {
    const [data, setData] = useState<DataRecord[]>(initialMockData)
    const [isLoaded, setIsLoaded] = useState(false)
    const [isRefreshing, setIsRefreshing] = useState(false)

    // Load Data
    useEffect(() => {
        const loadData = async () => {
            const saved = localStorage.getItem(STORAGE_KEY)
            if (saved) {
                try {
                    const parsed = JSON.parse(saved)
                    if (parsed.length > 0 && typeof parsed[0].math_score === 'number') {
                        setData(parsed)
                        setIsLoaded(true)
                        return
                    }
                } catch { }
            }
            const csvData = await fetchCSVData()
            if (csvData.length > 0) {
                setData(csvData)
                toast.success("Đã tải dữ liệu từ CSV!")
            } else {
                setData(initialMockData)
                toast.error("Không thể tải dữ liệu CSV! Đang dùng mẫu.")
            }
            setIsLoaded(true)
        }
        loadData()
    }, [])

    // Save Data
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
        }
    }, [data, isLoaded])

    // Actions
    const handleRefresh = async () => {
        setIsRefreshing(true)
        await new Promise(resolve => setTimeout(resolve, 1000))
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved) {
            try {
                const parsed = JSON.parse(saved)
                setData(parsed)
                toast.success("Đã làm mới dữ liệu!")
            } catch {
                setData(initialMockData)
            }
        }
        setIsRefreshing(false)
    }

    const handleReset = async () => {
        const csvData = await fetchCSVData()
        if (csvData.length > 0) {
            setData(csvData)
            toast.success("Đã reset về dữ liệu gốc từ CSV!")
        } else {
            setData(initialMockData)
        }
    }

    const handleDelete = (id: number) => {
        setData(prev => prev.filter(item => item.id !== id))
        toast.success("Đã xóa bản ghi!")
    }

    const handleAddRecord = (record: DataRecord) => {
        setData(prev => [...prev, record])
        toast.success("Đã thêm bản ghi mới!")
    }

    const handleUpdateRecord = (updatedRecord: DataRecord) => {
        setData(prev => prev.map(item => item.id === updatedRecord.id ? updatedRecord : item))
        toast.success("Đã cập nhật bản ghi!")
    }

    return (
        <Router>
            <div className="min-h-screen bg-background flex flex-col">
                <Toaster richColors position="top-right" />

                {/* Navbar */}
                <header className="border-b bg-card">
                    <div className="mx-auto max-w-7xl px-4 md:px-8 h-16 flex items-center justify-between">
                        <div className="flex items-center gap-8">
                            <div className="flex items-center gap-2 font-bold text-xl">
                                <GraduationCap className="h-6 w-6 text-primary" />
                                <span>Student's Datamart View   </span>
                            </div>

                            <nav className="hidden md:flex items-center gap-2">
                                <NavLink to="/" icon={LayoutDashboard}>Dashboard</NavLink>
                                <NavLink to="/students" icon={Users}>Students</NavLink>
                            </nav>
                        </div>

                        <div className="flex items-center gap-4">
                            <ThemeToggle />
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 p-4 md:p-8">
                    <div className="mx-auto max-w-7xl">
                        <Routes>
                            <Route path="/" element={<DashboardPage data={data} />} />
                            <Route
                                path="/students"
                                element={
                                    <StudentListPage
                                        data={data}
                                        onAdd={handleAddRecord}
                                        onUpdate={handleUpdateRecord}
                                        onDelete={handleDelete}
                                        onRefresh={handleRefresh}
                                        onReset={handleReset}
                                        isRefreshing={isRefreshing}
                                    />
                                }
                            />
                        </Routes>
                    </div>
                </main>
            </div>
        </Router>
    )
}
