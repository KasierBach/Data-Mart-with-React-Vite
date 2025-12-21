import { useState } from 'react'
import { Target, ChevronLeft, ChevronRight } from 'lucide-react'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ComposedChart,
    Line,
    PieChart,
    Pie,
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

export function VicePrincipalDashboard(props: DashboardProps) {
    const {
        insights,
        educationData,
        ethnicityData,
        classStats,
        supportNeeds
    } = props;

    const ITEMS_PER_PAGE = 5;
    const [atRiskPage, setAtRiskPage] = useState(1);

    const totalAtRiskPages = Math.ceil(insights.atRiskList.length / ITEMS_PER_PAGE);
    const atRiskStart = (atRiskPage - 1) * ITEMS_PER_PAGE;
    const currentAtRisk = insights.atRiskList.slice(atRiskStart, atRiskStart + ITEMS_PER_PAGE);

    return (
        <div className="space-y-6">
            {/* Vice Principal Insight */}
            <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded shadow-sm flex items-start">
                <Target className="h-6 w-6 text-purple-600 mt-1 mr-3 flex-shrink-0" />
                <div>
                    <h3 className="text-lg font-bold text-purple-800">Giám sát Hiệu quả Đào tạo</h3>
                    <p className="text-purple-700 mt-1">
                        Tỷ lệ đạt chuẩn toàn trường ổn định. Tuy nhiên, sự chênh lệch giữa các nhóm học sinh (phân theo trình độ phụ huynh) đang ở mức <strong>15%</strong>.
                        <br />
                        <strong>Hành động:</strong> Cần chỉ đạo các tổ chuyên môn rà soát lại phương pháp giảng dạy cho nhóm yếu thế.
                        Kiểm tra đột xuất các lớp có tỷ lệ rớt môn Toán cao trên 20%.
                    </p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-t-4 border-t-purple-500">
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Lớp đạt chuẩn</CardTitle></CardHeader>
                    <CardContent><div className="text-2xl font-bold">12/15</div><p className="text-xs text-muted-foreground">Tỷ lệ 80%</p></CardContent>
                </Card>
                <Card className="border-t-4 border-t-indigo-500">
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Giáo viên Xuất sắc</CardTitle></CardHeader>
                    <CardContent><div className="text-2xl font-bold">5</div><p className="text-xs text-muted-foreground">Đề xuất khen thưởng</p></CardContent>
                </Card>
                <Card className="border-t-4 border-t-pink-500">
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Học sinh Cá biệt</CardTitle></CardHeader>
                    <CardContent><div className="text-2xl font-bold text-red-600">8</div><p className="text-xs text-muted-foreground">Cần gặp phụ huynh</p></CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Nhu cầu Hỗ trợ</CardTitle></CardHeader>
                    <CardContent className="h-[100px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={supportNeeds} innerRadius={30} outerRadius={40} dataKey="value" />
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                <Card className="border-t-4 border-t-orange-500">
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Tỷ lệ Chuyên cần</CardTitle></CardHeader>
                    <CardContent><div className="text-2xl font-bold text-orange-600">92%</div><p className="text-xs text-muted-foreground">-1% so với tuần trước</p></CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Vice Principal: Class Drill Down */}
                <Card className="col-span-2 shadow-sm border-t-4 border-t-red-600">
                    <CardHeader>
                        <CardTitle className="text-red-700">Điểm nóng về học vụ (Lớp rớt môn Toán cao)</CardTitle>
                        <CardDescription>Danh sách các lớp có tỷ lệ rớt môn Toán trên 15% - Cần can thiệp khẩn cấp.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader className="bg-red-50">
                                    <TableRow>
                                        <TableHead>Lớp</TableHead>
                                        <TableHead>Tỷ lệ rớt Toán</TableHead>
                                        <TableHead>Số lượng rớt</TableHead>
                                        <TableHead>Trạng thái</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {classStats.filter(c => c.failRate > 15).map((c) => (
                                        <TableRow key={c.name}>
                                            <TableCell className="font-bold">{c.name}</TableCell>
                                            <TableCell className="text-red-600 font-bold">{c.failRate}%</TableCell>
                                            <TableCell>{c.failCount} học sinh</TableCell>
                                            <TableCell><Badge variant="destructive">Cần chú ý</Badge></TableCell>
                                        </TableRow>
                                    ))}
                                    {classStats.filter(c => c.failRate <= 15).slice(0, 1).map((c) => (
                                        <TableRow key={c.name}>
                                            <TableCell className="font-bold">{c.name}</TableCell>
                                            <TableCell>{c.failRate}%</TableCell>
                                            <TableCell>{c.failCount} học sinh</TableCell>
                                            <TableCell><Badge variant="outline" className="border-blue-500 text-blue-600">Theo dõi</Badge></TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                {/* Comparison by Parent Edu */}
                <Card className="col-span-2 md:col-span-1">
                    <CardHeader>
                        <CardTitle>Phân tích Yếu tố Gia đình</CardTitle>
                        <CardDescription>Điểm số trung bình theo trình độ học vấn phụ huynh.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={educationData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" domain={[0, 100]} />
                                <YAxis dataKey="name" type="category" width={120} style={{ fontSize: '11px' }} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="Math" fill={THEME_COLORS.math} name="Toán" radius={[0, 4, 4, 0]} barSize={20} />
                                <Bar dataKey="Reading" fill={THEME_COLORS.reading} name="Đọc hiểu" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Correlation Chart (Scatter mock) replace with Bar for stability */}
                <Card className="col-span-2 md:col-span-1">
                    <CardHeader>
                        <CardTitle>Tương quan Rớt môn</CardTitle>
                        <CardDescription>Tỷ lệ rớt môn Toán so với Đọc hiểu ở các nhóm.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={educationData}>
                                <CartesianGrid stroke="#f5f5f5" />
                                <XAxis dataKey="name" scale="band" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="Math" barSize={20} fill="#413ea0" name="Toán" />
                                <Line type="monotone" dataKey="Reading" stroke="#ff7300" name="Đọc hiểu" />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Detailed Drill Down - Vice Principal */}
            <div className="grid gap-4 mt-6">
                <Card className="col-span-2 shadow-sm border-t-4 border-t-pink-500">
                    <CardHeader><CardTitle>Danh sách Học sinh Cá biệt & Cần Theo dõi</CardTitle></CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader className="bg-pink-50">
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Vấn đề chính</TableHead>
                                        <TableHead>Điểm Toán</TableHead>
                                        <TableHead>Điểm Đọc</TableHead>
                                        <TableHead>Điểm Viết</TableHead>
                                        <TableHead>Hành động đề xuất</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {currentAtRisk.map((s) => (
                                        <TableRow key={s.id}>
                                            <TableCell className="font-medium">{s.id}</TableCell>
                                            <TableCell className="text-red-500 font-medium">Học lực yếu (Dưới 50)</TableCell>
                                            <TableCell className={s.math_score < 50 ? "text-red-600 font-bold bg-red-50" : ""}>{s.math_score}</TableCell>
                                            <TableCell className={s.reading_score < 50 ? "text-red-600 font-bold bg-red-50" : ""}>{s.reading_score}</TableCell>
                                            <TableCell className={s.writing_score < 50 ? "text-red-600 font-bold bg-red-50" : ""}>{s.writing_score}</TableCell>
                                            <TableCell><Badge variant="outline" className="border-red-500 text-red-500 font-bold">Gặp Phụ huynh</Badge></TableCell>
                                        </TableRow>
                                    ))}
                                    {atRiskPage === 1 && (
                                        <TableRow>
                                            <TableCell className="font-medium">HS00X</TableCell>
                                            <TableCell className="text-orange-500 font-medium">Hạnh kiểm/Chuyên cần</TableCell>
                                            <TableCell>75</TableCell>
                                            <TableCell>80</TableCell>
                                            <TableCell>78</TableCell>
                                            <TableCell><Badge variant="outline" className="border-orange-500 text-orange-500 font-bold">Nhắc nhở</Badge></TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination Controls */}
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
                    </CardContent>
                </Card>
            </div>
            {/* DEEP DIVE: Ethnicity Gap */}
            <div className="mt-6">
                <Card className="border-t-4 border-t-violet-500 shadow-sm">
                    <CardHeader>
                        <CardTitle>Phân tích Công bằng Giáo dục: Sắc tộc</CardTitle>
                        <CardDescription>So sánh hiệu suất học tập giữa các nhóm sắc tộc khác nhau.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={ethnicityData} layout="vertical" margin={{ left: 40, right: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={true} />
                                <XAxis type="number" domain={[0, 100]} />
                                <YAxis dataKey="name" type="category" width={150} style={{ fontSize: '11px', fontWeight: 600 }} />
                                <Tooltip cursor={{ fill: '#f5f3ff' }} />
                                <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: '20px' }} />
                                <Bar dataKey="Math" name="Toán" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={25} />
                                <Bar dataKey="Reading" name="Đọc hiểu" fill="#d946ef" radius={[0, 4, 4, 0]} barSize={25} />
                                <Bar dataKey="Writing" name="Viết" fill="#f97316" radius={[0, 4, 4, 0]} barSize={25} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
