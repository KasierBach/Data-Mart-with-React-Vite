import { BookOpen } from 'lucide-react'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    ScatterChart,
    Scatter,
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

export function HeadDeptDashboard(props: DashboardProps) {
    const {
        avgScores,
        teacherStats,
        scoreDistribution,
        correlationData
    } = props;
    return (
        <div className="space-y-6">
            {/* Head Dept Insight */}
            <div className="bg-teal-50 border-l-4 border-teal-500 p-4 rounded shadow-sm flex items-start">
                <BookOpen className="h-6 w-6 text-teal-600 mt-1 mr-3 flex-shrink-0" />
                <div>
                    <h3 className="text-lg font-bold text-teal-800">Chất lượng Bộ môn & Giảng dạy</h3>
                    <p className="text-teal-700 mt-1">
                        Điểm trung bình môn <strong>Toán</strong> đang cao hơn <strong>Đọc hiểu</strong> khoảng 5 điểm.
                        <br />
                        <strong>Đề xuất:</strong> Tổ chức hội thảo chuyên đề "Đổi mới phương pháp dạy Đọc hiểu" vào tháng tới.
                        Rà soát lại đề cương ôn tập môn Viết cho khối 11.
                    </p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">TB Môn Toán</CardTitle></CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-blue-600">{avgScores.math}</div>
                        <p className="text-xs text-muted-foreground">Cao nhất khối</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">TB Môn Đọc</CardTitle></CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-green-600">{avgScores.reading}</div>
                        <p className="text-xs text-muted-foreground">Đạt chỉ tiêu</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">TB Môn Viết</CardTitle></CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-yellow-600">{avgScores.writing}</div>
                        <p className="text-xs text-muted-foreground">Cần cải thiện</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Detailed Subject Distribution */}
                <Card className="col-span-2">
                    <CardHeader>
                        <CardTitle>Phổ điểm chi tiết từng môn</CardTitle>
                        <CardDescription>So sánh phân phối điểm số để phát hiện sự lệch chuẩn.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={scoreDistribution}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="Math" fill={THEME_COLORS.math} name="Toán" />
                                <Bar dataKey="Reading" fill={THEME_COLORS.reading} name="Đọc hiểu" />
                                <Bar dataKey="Writing" fill={THEME_COLORS.writing} name="Viết" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle>Tiến độ Giảng dạy (Mô phỏng)</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        {['Toán 10', 'Toán 11', 'Toán 12', 'Văn 10', 'Văn 11'].map((cls, i) => (
                            <div key={i} className="space-y-1">
                                <div className="flex justify-between text-sm font-medium">
                                    <span>{cls}</span>
                                    <span>{85 + i * 2}%</span>
                                </div>
                                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-teal-500" style={{ width: `${85 + i * 2}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle>Đánh giá Giáo viên (Mô phỏng)</CardTitle></CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
                                { subject: 'Chuyên môn', A: 90, fullMark: 100 },
                                { subject: 'Kỷ luật', A: 85, fullMark: 100 },
                                { subject: 'Sáng tạo', A: 65, fullMark: 100 },
                                { subject: 'Tương tác', A: 80, fullMark: 100 },
                                { subject: 'Hồ sơ', A: 95, fullMark: 100 },
                            ]}>
                                <PolarGrid />
                                <PolarAngleAxis dataKey="subject" />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                                <Radar name="Trung bình Khoa" dataKey="A" stroke="#14b8a6" fill="#14b8a6" fillOpacity={0.6} />
                                <Tooltip />
                            </RadarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
            <div className="mt-6">
                <Card>
                    <CardHeader><CardTitle>Chi tiết Đánh giá Giảng viên</CardTitle></CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Tên GV</TableHead>
                                    <TableHead>Điểm TB</TableHead>
                                    <TableHead>Tỷ lệ trượt</TableHead>
                                    <TableHead>Đánh giá</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {teacherStats.slice(0, 5).map((t) => (
                                    <TableRow key={t.name}>
                                        <TableCell className="font-bold">{t.name}</TableCell>
                                        <TableCell className="font-bold text-blue-600">{t.avgScore}đ</TableCell>
                                        <TableCell className={t.failRate > 10 ? "text-red-500 font-bold" : ""}>{t.failRate}%</TableCell>
                                        <TableCell>
                                            {t.avgScore > 75 ? <Badge className="bg-green-600">Đạt chuẩn cao</Badge>
                                                : <Badge variant="outline" className="border-orange-500 text-orange-600">Cần bồi dưỡng</Badge>}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
            {/* DEEP DIVE: Correlation */}
            <div className="mt-6">
                <Card className="border-t-4 border-t-emerald-500 shadow-sm">
                    <CardHeader>
                        <CardTitle>Phân tích Tương quan: Tự nhiên vs Xã hội</CardTitle>
                        <CardDescription>Biểu đồ phân tán (Scatter Plot) thể hiện mối liên hệ năng lực giữa Toán và Đọc hiểu.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                <CartesianGrid />
                                <XAxis type="number" dataKey="math" name="Điểm Toán" unit="" domain={[0, 100]} />
                                <YAxis type="number" dataKey="reading" name="Điểm Đọc" unit="" domain={[0, 100]} />
                                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                                <Legend />
                                <Scatter name="Học sinh" data={correlationData} fill="#059669" shape="circle" />
                            </ScatterChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
