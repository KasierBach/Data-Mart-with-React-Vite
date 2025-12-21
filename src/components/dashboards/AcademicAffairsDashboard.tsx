import { AlertTriangle } from 'lucide-react'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
} from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { DashboardProps } from "./types"
import { THEME_COLORS } from "./constants"

export function AcademicAffairsDashboard(props: DashboardProps) {
    const {
        data,
        insights,
        passRateStats
    } = props;
    return (
        <div className="space-y-6">
            {/* Academic Insight */}
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded shadow-sm flex items-start">
                <AlertTriangle className="h-6 w-6 text-red-600 mt-1 mr-3 flex-shrink-0" />
                <div>
                    <h3 className="text-lg font-bold text-red-800 flex items-center">Cảnh báo Học vụ & Quy chế</h3>
                    <p className="text-red-700 mt-1">
                        Phát hiện <strong>{data.filter(d => (d.math_score < 50 ? 1 : 0) + (d.reading_score < 50 ? 1 : 0) + (d.writing_score < 50 ? 1 : 0) >= 2).length}</strong> trường hợp rớt 2 môn trở lên (Buộc thôi học / Cảnh báo mức 2).
                        <br />
                        <strong>Hành động:</strong> Gửi thông báo nhắc nhở đến GVCN và Phụ huynh trước ngày 25.
                    </p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card className="border-l-4 border-l-red-500 shadow-sm">
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Cảnh báo học vụ (3 mức)</CardTitle></CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-red-600">
                            {data.filter(d => (d.math_score < 50 ? 1 : 0) + (d.reading_score < 50 ? 1 : 0) + (d.writing_score < 50 ? 1 : 0) >= 2).length}
                        </div>
                        <div className="text-xs text-muted-foreground mt-2 space-y-1">
                            <div className="flex justify-between"><span>Mức 1:</span> <strong>5</strong></div>
                            <div className="flex justify-between"><span>Mức 2:</span> <strong>2</strong></div>
                            <div className="flex justify-between"><span>Mức 3:</span> <strong>1</strong></div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="shadow-sm">
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Đăng ký tín chỉ</CardTitle></CardHeader>
                    <CardContent><div className="text-3xl font-bold text-blue-600">95%</div><p className="text-xs text-muted-foreground">Hoàn thành</p></CardContent>
                </Card>
                <Card className="shadow-sm">
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Lịch thi</CardTitle></CardHeader>
                    <CardContent><div className="text-3xl font-bold text-gray-600">Tuần 18</div><p className="text-xs text-muted-foreground">Sắp diễn ra</p></CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader><CardTitle>Tỷ lệ rớt theo môn học</CardTitle><CardDescription>Thống kê số lượng sinh viên không đạt yêu cầu.</CardDescription></CardHeader>
                    <CardContent className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={passRateStats} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis dataKey="subject" type="category" width={100} />
                                <Tooltip />
                                <Bar dataKey="fail" fill={THEME_COLORS.math} name="Số HS rớt" barSize={30} label={{ position: 'right' }} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle>Xu hướng Đăng ký môn (Mô phỏng)</CardTitle></CardHeader>
                    <CardContent className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={[
                                { year: '2020', students: 800 },
                                { year: '2021', students: 850 },
                                { year: '2022', students: 900 },
                                { year: '2023', students: 880 },
                                { year: '2024', students: 950 },
                            ]}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="year" />
                                <YAxis />
                                <Tooltip />
                                <Area type="monotone" dataKey="students" stroke="#82ca9d" fill="#82ca9d" name="Tổng sinh viên" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Detailed Drill Down - Academic Affairs */}
            <div className="grid gap-4 mt-6">
                <Card className="col-span-2 shadow-sm border-t-4 border-t-red-600">
                    <CardHeader><CardTitle>Danh sách Cảnh báo Học vụ (Dự kiến Buộc thôi học)</CardTitle></CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader className="bg-red-100">
                                <TableRow>
                                    <TableHead>Mã SV</TableHead>
                                    <TableHead>Số môn nợ</TableHead>
                                    <TableHead>GPA Tích lũy</TableHead>
                                    <TableHead>Tình trạng</TableHead>
                                    <TableHead>Hạn xử lý</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell className="font-bold">SV0015</TableCell>
                                    <TableCell className="text-red-600 font-bold">4</TableCell>
                                    <TableCell>1.8/4.0</TableCell>
                                    <TableCell><Badge variant="destructive">Cảnh báo mức 3</Badge></TableCell>
                                    <TableCell>30/12/2024</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-bold">SV0102</TableCell>
                                    <TableCell className="text-red-600 font-bold">3</TableCell>
                                    <TableCell>1.9/4.0</TableCell>
                                    <TableCell><Badge variant="destructive" className="bg-orange-500">Cảnh báo mức 2</Badge></TableCell>
                                    <TableCell>15/01/2025</TableCell>
                                </TableRow>
                                {insights.atRiskList.slice(0, 3).map(s => (
                                    <TableRow key={s.id}>
                                        <TableCell className="font-bold">{s.id}</TableCell>
                                        <TableCell className="text-red-600 font-bold">2</TableCell>
                                        <TableCell>2.1/4.0</TableCell>
                                        <TableCell><Badge variant="outline" className="border-yellow-500 text-yellow-600">Cảnh báo mức 1</Badge></TableCell>
                                        <TableCell>Theo dõi</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div >
    )
}
