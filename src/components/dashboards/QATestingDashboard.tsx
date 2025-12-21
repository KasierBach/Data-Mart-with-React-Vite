import { PenTool } from 'lucide-react'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ScatterChart,
    Scatter,
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

export function QATestingDashboard(props: DashboardProps) {
    const {
        scoreDistribution
    } = props;
    return (
        <div className="space-y-6">
            {/* QA Insight */}
            <div className="bg-slate-50 border-l-4 border-slate-500 p-4 rounded shadow-sm flex items-start">
                <PenTool className="h-6 w-6 text-slate-800 mt-1 mr-3 flex-shrink-0" />
                <div>
                    <h3 className="text-lg font-bold text-slate-800">Kiểm định & Đảm bảo Chất lượng thi</h3>
                    <p className="text-slate-700 mt-1">
                        Phổ điểm tuân theo phân phối chuẩn, độ lệch chuẩn ở mức cho phép.
                        <br />
                        <strong>Cảnh báo:</strong> Đề thi môn Toán có độ phân hóa chưa cao ở nhóm điểm 8-10 (Quá nhiều điểm 10).
                        Cần điều chỉnh ma trận đề thi kỳ tới (Tăng 10% câu hỏi vận dụng cao).
                    </p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Độ tin cậy (Cronbach's Alpha)</CardTitle></CardHeader>
                    <CardContent><div className="text-2xl font-bold text-green-600">0.85</div><p className="text-xs text-muted-foreground">Rất tốt</p></CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Độ khó đề thi (P)</CardTitle></CardHeader>
                    <CardContent><div className="text-2xl font-bold text-blue-600">0.62</div><p className="text-xs text-muted-foreground">Trung bình khó</p></CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Độ phân cách (D)</CardTitle></CardHeader>
                    <CardContent><div className="text-2xl font-bold text-purple-600">0.35</div><p className="text-xs text-muted-foreground">Khá tốt</p></CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Số lượng phúc khảo</CardTitle></CardHeader>
                    <CardContent><div className="text-2xl font-bold text-orange-600">12</div><p className="text-xs text-muted-foreground">Đơn toàn trường</p></CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="col-span-2 md:col-span-1">
                    <CardHeader><CardTitle>Phân bố phổ điểm thực tế</CardTitle><CardDescription>Kiểm tra dạng phân phối chuẩn (Bell Curve).</CardDescription></CardHeader>
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

                <Card className="col-span-2 md:col-span-1">
                    <CardHeader><CardTitle>Phân tích Câu hỏi (Item Analysis - Môn Toán)</CardTitle></CardHeader>
                    <CardContent className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                <CartesianGrid />
                                <XAxis type="number" dataKey="difficulty" name="Độ khó" unit="" domain={[0, 1]} />
                                <YAxis type="number" dataKey="discrimination" name="Độ phân cách" unit="" domain={[-0.2, 1]} />
                                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                                <Legend />
                                <Scatter name="Câu hỏi trắc nghiệm" data={[
                                    { difficulty: 0.9, discrimination: 0.2 },
                                    { difficulty: 0.8, discrimination: 0.35 },
                                    { difficulty: 0.5, discrimination: 0.5 },
                                    { difficulty: 0.3, discrimination: 0.6 },
                                    { difficulty: 0.2, discrimination: 0.4 },
                                    { difficulty: 0.85, discrimination: 0.15 }, // Bad item
                                ]} fill="#8884d8" />
                            </ScatterChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            <div className="mt-6">
                <Card>
                    <CardHeader><CardTitle>Chi tiết Phân tích Câu hỏi (Item Analysis)</CardTitle></CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader><TableRow><TableHead>Mã Câu hỏi</TableHead><TableHead>Độ khó (P)</TableHead><TableHead>Độ phân cách (D)</TableHead><TableHead>Đánh giá</TableHead><TableHead>Hành động</TableHead></TableRow></TableHeader>
                            <TableBody>
                                <TableRow><TableCell>Q10 (Toán)</TableCell><TableCell>0.9</TableCell><TableCell>0.20</TableCell><TableCell className="text-yellow-600">Quá dễ</TableCell><TableCell>Giảm tải</TableCell></TableRow>
                                <TableRow><TableCell>Q15 (Toán)</TableCell><TableCell>0.85</TableCell><TableCell>0.15</TableCell><TableCell className="text-red-600">Phân loại kém</TableCell><TableCell>Loại bỏ/Sửa</TableCell></TableRow>
                                <TableRow><TableCell>Q22 (Đọc)</TableCell><TableCell>0.5</TableCell><TableCell>0.50</TableCell><TableCell className="text-green-600">Tốt</TableCell><TableCell>Lưu ngân hàng đề</TableCell></TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
            {/* DEEP DIVE: Score Distribution Comparison */}
            <div className="mt-6">
                <Card className="border-t-4 border-t-slate-600 shadow-sm">
                    <CardHeader>
                        <CardTitle>So sánh Phân phối Điểm số (Bell Curve)</CardTitle>
                        <CardDescription>Đánh giá độ lệch chuẩn và độ khó giữa các môn thi.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={scoreDistribution}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="Math" stroke={THEME_COLORS.math} strokeWidth={3} name="Toán" dot={false} />
                                <Line type="monotone" dataKey="Reading" stroke={THEME_COLORS.reading} strokeWidth={3} name="Đọc hiểu" dot={false} />
                                <Line type="monotone" dataKey="Writing" stroke={THEME_COLORS.writing} strokeWidth={3} name="Viết" dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div >
    )
}
