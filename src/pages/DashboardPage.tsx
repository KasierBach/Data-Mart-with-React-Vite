import { DataRecord } from "../types"
import { DashboardCharts } from "../components/DashboardCharts"
import { useAuth } from "../context/AuthContext"

interface DashboardPageProps {
    data: DataRecord[]
}

export function DashboardPage({ data }: DashboardPageProps) {
    const { user } = useAuth()
    const role = user?.role || 'principal' // Default fallback for dev

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
                <p className="text-muted-foreground">
                    Tổng quan về tình hình học tập và nhân khẩu học của học sinh.
                </p>
                <div className="inline-block">
                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                        View Role: {role.replace(/_/g, ' ').toUpperCase()}
                    </span>
                </div>
            </div>

            {/* Charts Section */}
            <DashboardCharts data={data} role={role} />
        </div>
    )
}
