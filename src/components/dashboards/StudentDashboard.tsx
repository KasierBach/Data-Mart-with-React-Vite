import { User } from 'lucide-react'
import {
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    Legend,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
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

export function StudentDashboard(props: DashboardProps) {
    const {
        avgScores
    } = props;
    return (
        <div className="space-y-6">
            {/* Student Insight */}
            <div className="bg-sky-50 border-l-4 border-sky-500 p-4 rounded shadow-sm flex items-start">
                <User className="h-6 w-6 text-sky-600 mt-1 mr-3 flex-shrink-0" />
                <div>
                    <h3 className="text-lg font-bold text-sky-800">Góc học tập của bạn</h3>
                    <p className="text-sky-700 mt-1">
                        Chào em, năng lực môn <strong>Toán</strong> của em đang rất tốt (Top 5% lớp).
                        Tuy nhiên, môn <strong>Viết</strong> cần cải thiện thêm kỹ năng lập luận.
                        <br />
                        <strong>Lời khuyên:</strong> Nên dành thêm 30 phút mỗi ngày đọc sách tham khảo tại thư viện.
                    </p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md">
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-blue-100">Điểm TB Tích lũy</CardTitle></CardHeader>
                    <CardContent><div className="text-4xl font-bold">82</div><p className="text-xs text-blue-100 mt-1">GPA: 3.2/4.0</p></CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Xếp hạng lớp</CardTitle></CardHeader>
                    <CardContent><div className="text-3xl font-bold text-gray-700">5/40</div><p className="text-xs text-muted-foreground">Tăng 2 bậc</p></CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Bài tập về nhà</CardTitle></CardHeader>
                    <CardContent><div className="text-3xl font-bold text-green-600">100%</div><p className="text-xs text-muted-foreground">Đã hoàn thành</p></CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Chuyên cần</CardTitle></CardHeader>
                    <CardContent><div className="text-3xl font-bold text-purple-600">98%</div><p className="text-xs text-muted-foreground">Nghỉ: 1 buổi</p></CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader><CardTitle>Biểu đồ năng lực cá nhân</CardTitle><CardDescription>So sánh với trung bình lớp</CardDescription></CardHeader>
                    <CardContent className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
                                { subject: 'Toán', A: 85, B: avgScores.math, fullMark: 100 },
                                { subject: 'Đọc hiểu', A: 78, B: avgScores.reading, fullMark: 100 },
                                { subject: 'Viết', A: 70, B: avgScores.writing, fullMark: 100 },
                                { subject: 'Lý', A: 88, B: 75, fullMark: 100 },
                                { subject: 'Hóa', A: 90, B: 78, fullMark: 100 },
                                { subject: 'Anh', A: 65, B: 72, fullMark: 100 },
                            ]}>
                                <PolarGrid />
                                <PolarAngleAxis dataKey="subject" />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                                <Radar name="Bạn" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                                <Radar name="TB Lớp" dataKey="B" stroke="#9ca3af" fill="#9ca3af" fillOpacity={0.3} />
                                <Legend />
                                <Tooltip />
                            </RadarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Lộ trình điểm số</CardTitle>
                        <CardDescription>Tiến bộ qua các bài kiểm tra.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={[
                                { name: '15p L1', score: 7.5 },
                                { name: '15p L2', score: 8.0 },
                                { name: '1 Tiết', score: 7.0 },
                                { name: 'GK', score: 8.5 },
                                { name: 'Cuối kỳ', score: 9.0 },
                            ]}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis domain={[0, 10]} />
                                <Tooltip />
                                <Line type="monotone" dataKey="score" stroke="#22c55e" strokeWidth={3} name="Điểm số" />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            <div className="mt-6">
                <Card>
                    <CardHeader><CardTitle>Chi tiết Điểm số từng môn</CardTitle></CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader><TableRow><TableHead>Môn học</TableHead><TableHead>Kiểm tra 1</TableHead><TableHead>Kiểm tra 2</TableHead><TableHead>Giữa kỳ</TableHead><TableHead>Cuối kỳ</TableHead><TableHead>Trung bình</TableHead></TableRow></TableHeader>
                            <TableBody>
                                <TableRow><TableCell className="font-medium">Toán</TableCell><TableCell>8.5</TableCell><TableCell>9.0</TableCell><TableCell>8.8</TableCell><TableCell>9.5</TableCell><TableCell className="font-bold text-green-600">9.0</TableCell></TableRow>
                                <TableRow><TableCell className="font-medium">Đọc hiểu</TableCell><TableCell>7.0</TableCell><TableCell>7.5</TableCell><TableCell>7.2</TableCell><TableCell>8.0</TableCell><TableCell className="font-bold text-blue-600">7.4</TableCell></TableRow>
                                <TableRow><TableCell className="font-medium">Viết</TableCell><TableCell>6.5</TableCell><TableCell>7.0</TableCell><TableCell>6.8</TableCell><TableCell>7.5</TableCell><TableCell className="font-bold">7.0</TableCell></TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
