import { DataRecord } from "../types"
import { DashboardCharts } from "../components/DashboardCharts"

interface DashboardPageProps {
    data: DataRecord[]
}

export function DashboardPage({ data }: DashboardPageProps) {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
                <p className="text-muted-foreground">
                    Tổng quan về tình hình học tập và nhân khẩu học của học sinh.
                </p>
            </div>

            {/* Charts Section */}
            <DashboardCharts data={data} />
        </div>
    )
}
