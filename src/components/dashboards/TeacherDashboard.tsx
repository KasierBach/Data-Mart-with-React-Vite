import { Target, Trophy } from 'lucide-react'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LineChart,
    Line,
} from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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

export function TeacherDashboard(props: DashboardProps) {
    const {
        data,
        avgScores,
        insights,
        scoreDistribution
    } = props;
    return (
        <div className="space-y-6">
            {/* Teacher Insight */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 bg-green-50 border border-green-200 p-4 rounded-lg flex items-start">
                    <Target className="h-5 w-5 text-green-600 mt-1 mr-2" />
                    <div>
                        <h3 className="font-bold text-green-800">Mục tiêu tuần tới</h3>
                        <ul className="list-disc list-inside text-sm text-green-700 mt-2 space-y-1">
                            <li>Kèm cặp {insights.atRiskList.length} học sinh có học lực yếu.</li>
                            <li>Tổ chức ôn tập cho nhóm môn {insights.lowestSubject.subject} (TB thấp nhất: {insights.lowestSubject.score}).</li>
                        </ul>
                    </div>
                </div>
                <div className="flex-1 bg-yellow-50 border border-yellow-200 p-4 rounded-lg flex items-start">
                    <Trophy className="h-5 w-5 text-yellow-600 mt-1 mr-2" />
                    <div>
                        <h3 className="font-bold text-yellow-800">Khen thưởng</h3>
                        <p className="text-sm text-yellow-700 mt-2">
                            Đề xuất tuyên dương <strong>{insights.topList.length}</strong> học sinh có thành tích xuất sắc trong buổi sinh hoạt lớp.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Sĩ số lớp</CardTitle></CardHeader>
                    <CardContent><div className="text-3xl font-bold">{data.length}</div><p className="text-xs text-muted-foreground">Vắng: 0</p></CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Điểm TB Lớp</CardTitle></CardHeader>
                    <CardContent><div className="text-3xl font-bold text-blue-600">{Math.round((avgScores.math + avgScores.reading + avgScores.writing) / 3)}</div><p className="text-xs text-muted-foreground">Xếp hạng: 2/15</p></CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Nộp bài tập</CardTitle></CardHeader>
                    <CardContent><div className="text-3xl font-bold text-green-600">98%</div><p className="text-xs text-muted-foreground">Đã thu đủ</p></CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Yếu/Kém</CardTitle></CardHeader>
                    <CardContent><div className="text-3xl font-bold text-red-600">{insights.atRisk}</div><p className="text-xs text-muted-foreground">Cần phụ đạo</p></CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Phân bố điểm lớp</CardTitle>
                        <CardDescription>Biểu đồ cột chồng thể hiện phân khúc điểm số của cả 3 môn.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={scoreDistribution}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="Math" fill={THEME_COLORS.math} stackId="a" name="Toán" />
                                <Bar dataKey="Reading" fill={THEME_COLORS.reading} stackId="a" name="Đọc" />
                                <Bar dataKey="Writing" fill={THEME_COLORS.writing} stackId="a" name="Viết" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Tiến độ học tập (Mô phỏng)</CardTitle>
                        <CardDescription>So sánh điểm kiểm tra 15p, 1 tiết và Cuối kỳ.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={[
                                { name: 'Tuần 1', score: 70 },
                                { name: 'Tuần 2', score: 72 },
                                { name: 'Tuần 3', score: 68 },
                                { name: 'Tuần 4', score: 75 },
                                { name: 'Tuần 5', score: 78 },
                                { name: 'GK', score: 82 },
                            ]}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="score" stroke="#8884d8" strokeWidth={2} name="TB Lớp" />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Danh sách Học sinh cần lưu ý</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader><TableRow><TableHead>ID</TableHead><TableHead>Họ tên (Mã)</TableHead><TableHead>Toán</TableHead><TableHead>Đọc</TableHead><TableHead>Viết</TableHead><TableHead>Ghi chú</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {insights.atRiskList.slice(0, 8).map((s) => (
                                <TableRow key={s.id}>
                                    <TableCell className="font-medium">{s.id}</TableCell>
                                    <TableCell>Học sinh {s.id}</TableCell>
                                    <TableCell className={s.math_score < 50 ? "text-red-500 font-bold bg-red-50" : ""}>{s.math_score}</TableCell>
                                    <TableCell className={s.reading_score < 50 ? "text-red-500 font-bold bg-red-50" : ""}>{s.reading_score}</TableCell>
                                    <TableCell className={s.writing_score < 50 ? "text-red-500 font-bold bg-red-50" : ""}>{s.writing_score}</TableCell>
                                    <TableCell className="text-sm italic text-gray-500">
                                        {s.math_score < 50 ? 'Mất gốc Toán' : 'Kỹ năng đọc yếu'}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
