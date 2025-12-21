import { useState } from 'react'
import { Info, Activity, CheckCircle, Trophy, AlertTriangle, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react'
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Label,
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
import { Button } from "@/components/ui/button"
import { DashboardProps } from "./types"
import { THEME_COLORS } from "./constants"

export function PrincipalDashboard(props: DashboardProps) {
    const {
        data,
        avgScores,
        insights,
        trendData,
        facultyStats,
        passRateStats,
        educationData
    } = props;

    const ITEMS_PER_PAGE = 5;

    // Pagination states
    const [atRiskPage, setAtRiskPage] = useState(1);
    const [topPage, setTopPage] = useState(1);

    // Pagination calculations for At Risk
    const totalAtRiskPages = Math.ceil(insights.atRiskList.length / ITEMS_PER_PAGE);
    const atRiskStart = (atRiskPage - 1) * ITEMS_PER_PAGE;
    const currentAtRisk = insights.atRiskList.slice(atRiskStart, atRiskStart + ITEMS_PER_PAGE);

    // Pagination calculations for Top Performers
    const totalTopPages = Math.ceil(insights.topList.length / ITEMS_PER_PAGE);
    const topStart = (topPage - 1) * ITEMS_PER_PAGE;
    const currentTop = insights.topList.slice(topStart, topStart + ITEMS_PER_PAGE);

    return (
        <div className="space-y-6">
            {/* Context / Insight Banner */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded shadow-sm flex items-start">
                <Info className="h-6 w-6 text-blue-500 mt-1 mr-3 flex-shrink-0" />
                <div>
                    <h3 className="text-lg font-bold text-blue-800">Tổng quan Chiến lược & KPIs</h3>
                    <p className="text-blue-700 mt-1">
                        Hiệu suất toàn trường đạt <strong>{Math.round((avgScores.math + avgScores.reading + avgScores.writing) / 3)}/100</strong>, tăng nhẹ so với kỳ trước.
                        <br />
                        <strong>Điểm nhấn:</strong> Môn Toán có sự cải thiện rõ rệt (+3%).
                        <strong> Cần lưu ý:</strong> Tỷ lệ học sinh trong nhóm "Cần hỗ trợ" (At-Risk) môn Đọc hiểu đang tăng nhẹ.
                        Đề xuất phân bổ thêm ngân sách cho thư viện và CLB Đọc sách.
                    </p>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="shadow-sm border-t-4 border-t-blue-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Điểm TB Toàn trường</CardTitle>
                        <Activity className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{Math.round((avgScores.math + avgScores.reading + avgScores.writing) / 3)}</div>
                        <p className="text-xs text-muted-foreground flex items-center mt-1">
                            <TrendingUp className="h-3 w-3 text-green-500 mr-1" /> +2.5% so với tháng trước
                        </p>
                        <div className="h-1 w-full bg-gray-100 mt-3 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500" style={{ width: `${Math.round((avgScores.math + avgScores.reading + avgScores.writing) / 3)}%` }}></div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-t-4 border-t-green-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tỷ lệ Đạt chuẩn</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                            {Math.round((data.filter(d => (d.math_score + d.reading_score + d.writing_score) / 3 >= 50).length / data.length) * 100)}%
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Mục tiêu: 95%</p>
                        <div className="h-1 w-full bg-gray-100 mt-3 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500" style={{ width: `${Math.round((data.filter(d => (d.math_score + d.reading_score + d.writing_score) / 3 >= 50).length / data.length) * 100)}%` }}></div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-t-4 border-t-yellow-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Học sinh Tiềm năng</CardTitle>
                        <Trophy className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">{insights.topPerformers}</div>
                        <p className="text-xs text-muted-foreground mt-1">Điểm TB {'>'}= 90</p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-t-4 border-t-red-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Cảnh báo rủi ro</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{insights.atRisk}</div>
                        <p className="text-xs text-muted-foreground mt-1">Học sinh dưới chuẩn</p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Area */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                {/* Trend Chart - Main Feature */}
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Xu hướng Hiệu suất Học tập (Học kỳ I)</CardTitle>
                        <CardDescription>Theo dõi sự tiến bộ của học sinh qua các tháng.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trendData}>
                                <defs>
                                    <linearGradient id="colorMath" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={THEME_COLORS.math} stopOpacity={0.8} />
                                        <stop offset="95%" stopColor={THEME_COLORS.math} stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorReading" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={THEME_COLORS.reading} stopOpacity={0.8} />
                                        <stop offset="95%" stopColor={THEME_COLORS.reading} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" />
                                <YAxis domain={[0, 100]} />
                                <CartesianGrid strokeDasharray="3 3" />
                                <Tooltip />
                                <Legend />
                                <Area type="monotone" dataKey="Math" stroke={THEME_COLORS.math} fillOpacity={1} fill="url(#colorMath)" name="Toán" />
                                <Area type="monotone" dataKey="Reading" stroke={THEME_COLORS.reading} fillOpacity={1} fill="url(#colorReading)" name="Đọc hiểu" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Department Performance */}
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Hiệu suất theo Khoa</CardTitle>
                        <CardDescription>Dựa trên tỷ lệ hoàn thành mục tiêu.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={facultyStats.slice(0, 5)}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis domain={[0, 100]} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="total" name="Tổng HS" fill={THEME_COLORS.purple} radius={[4, 4, 0, 0]} />
                                <Bar dataKey="failRate" name="% Rớt" fill={THEME_COLORS.math} radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle>Phân bố Chất lượng</CardTitle>
                        <CardDescription>Tỷ lệ Giỏi - Khá - TB - Yếu</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={[
                                        { name: 'Giỏi', value: insights.topPerformers, fill: '#22c55e' },
                                        { name: 'Khá', value: data.length - insights.topPerformers - insights.atRisk, fill: '#3b82f6' },
                                        { name: 'Yếu/Kém', value: insights.atRisk, fill: '#ef4444' }
                                    ]}
                                    cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value"
                                >
                                    <Label width={30} position="center">Tổng quan</Label>
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="col-span-2">
                    <CardHeader>
                        <CardTitle>Cảnh báo sụt giảm theo Môn</CardTitle>
                        <CardDescription>Các bộ môn có tỷ lệ trượt cao cần can thiệp ngay.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={passRateStats} layout="vertical" margin={{ left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis dataKey="subject" type="category" width={80} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="fail" fill="#ef4444" name="Chưa đạt" stackId="a" />
                                <Bar dataKey="pass" fill="#22c55e" name="Đạt chuẩn" stackId="a" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Detailed Drill Down - Principal */}
            <div className="grid gap-4">
                <Card className="col-span-2 shadow-sm border-t-4 border-t-blue-500">
                    <CardHeader>
                        <CardTitle>Chi tiết: Danh sách Cảnh báo Rủi ro & Tiềm năng</CardTitle>
                        <CardDescription>Danh sách chi tiết các học sinh cần lưu ý (Dưới chuẩn và Xuất sắc).</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* At Risk Table */}
                        <div>
                            <h4 className="font-semibold text-red-600 mb-2 flex items-center"><AlertTriangle className="w-4 h-4 mr-2" /> Cảnh báo Rủi ro (Dưới chuẩn - {insights.atRisk})</h4>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader className="bg-red-50">
                                        <TableRow>
                                            <TableHead>ID</TableHead>
                                            <TableHead>Họ tên</TableHead>
                                            <TableHead>Điểm TB</TableHead>
                                            <TableHead>Vấn đề chính</TableHead>
                                            <TableHead>Trạng thái</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {currentAtRisk.length > 0 ? (
                                            currentAtRisk.map((s) => (
                                                <TableRow key={s.id}>
                                                    <TableCell className="font-medium">{s.id}</TableCell>
                                                    <TableCell>Học sinh {s.id}</TableCell>
                                                    <TableCell className="font-bold text-red-600">{Math.round((s.math_score + s.reading_score + s.writing_score) / 3)}</TableCell>
                                                    <TableCell className="text-red-500">
                                                        {s.math_score < 50 ? 'Toán yếu ' : ''}
                                                        {s.reading_score < 50 ? 'Đọc yếu ' : ''}
                                                        {s.writing_score < 50 ? 'Viết yếu' : ''}
                                                    </TableCell>
                                                    <TableCell><Badge variant="destructive" className="bg-red-600">Cần can thiệp</Badge></TableCell>
                                                </TableRow>
                                            ))
                                        ) : <TableRow><TableCell colSpan={5} className="text-center py-4">Không có học sinh rủi ro</TableCell></TableRow>}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Pagination Controls for At Risk */}
                            <div className="flex items-center justify-between mt-4">
                                <div className="text-xs text-muted-foreground italic">
                                    Đang hiển thị {atRiskStart + 1} - {Math.min(atRiskStart + ITEMS_PER_PAGE, insights.atRiskList.length)} trên tổng số {insights.atRiskList.length} học sinh.
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setAtRiskPage(p => Math.max(1, p - 1))}
                                        disabled={atRiskPage === 1}
                                        className="h-8 px-2"
                                    >
                                        <ChevronLeft className="h-4 w-4 mr-1" /> Trước
                                    </Button>
                                    <span className="text-xs font-medium">Trang {atRiskPage} / {totalAtRiskPages || 1}</span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setAtRiskPage(p => Math.min(totalAtRiskPages, p + 1))}
                                        disabled={atRiskPage === totalAtRiskPages || totalAtRiskPages === 0}
                                        className="h-8 px-2"
                                    >
                                        Sau <ChevronRight className="h-4 w-4 ml-1" />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Top Performers Table */}
                        <div>
                            <h4 className="font-semibold text-yellow-600 mb-2 flex items-center"><Trophy className="w-4 h-4 mr-2" /> Học sinh Tiềm năng (Top Performers - {insights.topList.length})</h4>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader className="bg-yellow-50">
                                        <TableRow>
                                            <TableHead>ID</TableHead>
                                            <TableHead>Họ tên</TableHead>
                                            <TableHead>Điểm TB</TableHead>
                                            <TableHead>Môn Nổi bật</TableHead>
                                            <TableHead>Xếp loại</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {currentTop.length > 0 ? (
                                            currentTop.map((s) => (
                                                <TableRow key={s.id}>
                                                    <TableCell className="font-medium">{s.id}</TableCell>
                                                    <TableCell>Học sinh {s.id}</TableCell>
                                                    <TableCell className="font-bold text-green-600">{Math.round((s.math_score + s.reading_score + s.writing_score) / 3)}</TableCell>
                                                    <TableCell>
                                                        {Math.max(s.math_score, s.reading_score, s.writing_score) === s.math_score ? 'Toán' :
                                                            Math.max(s.math_score, s.reading_score, s.writing_score) === s.reading_score ? 'Đọc' : 'Viết'}
                                                        {' (' + Math.max(s.math_score, s.reading_score, s.writing_score) + ')'}
                                                    </TableCell>
                                                    <TableCell><Badge className="bg-yellow-500 hover:bg-yellow-600">Xuất sắc</Badge></TableCell>
                                                </TableRow>
                                            ))
                                        ) : <TableRow><TableCell colSpan={5} className="text-center py-4">Chưa có dữ liệu</TableCell></TableRow>}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Pagination Controls for Top Performers */}
                            <div className="flex items-center justify-between mt-4">
                                <div className="text-xs text-muted-foreground italic">
                                    Đang hiển thị {topStart + 1} - {Math.min(topStart + ITEMS_PER_PAGE, insights.topList.length)} trên tổng số {insights.topList.length} học sinh.
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setTopPage(p => Math.max(1, p - 1))}
                                        disabled={topPage === 1}
                                        className="h-8 px-2"
                                    >
                                        <ChevronLeft className="h-4 w-4 mr-1" /> Trước
                                    </Button>
                                    <span className="text-xs font-medium">Trang {topPage} / {totalTopPages || 1}</span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setTopPage(p => Math.min(totalTopPages, p + 1))}
                                        disabled={topPage === totalTopPages || totalTopPages === 0}
                                        className="h-8 px-2"
                                    >
                                        Sau <ChevronRight className="h-4 w-4 ml-1" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
            {/* DEEP DIVE: Parental Education */}
            <div className="mt-6">
                <Card className="border-t-4 border-t-cyan-500 shadow-sm">
                    <CardHeader>
                        <CardTitle>Phân tích Chuyên sâu: Tác động của Trình độ Phụ huynh</CardTitle>
                        <CardDescription>So sánh điểm số trung bình giữa các nhóm trình độ học vấn của cha mẹ.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={educationData} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" interval={0} angle={-15} textAnchor="end" height={80} style={{ fontSize: '11px' }} />
                                <YAxis domain={[0, 100]} />
                                <Tooltip cursor={{ fill: '#f3f4f6' }} />
                                <Legend verticalAlign="top" />
                                <Bar dataKey="Math" name="Toán" fill={THEME_COLORS.math} radius={[4, 4, 0, 0]} />
                                <Bar dataKey="Reading" name="Đọc hiểu" fill={THEME_COLORS.reading} radius={[4, 4, 0, 0]} />
                                <Bar dataKey="Writing" name="Viết" fill={THEME_COLORS.writing} radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
