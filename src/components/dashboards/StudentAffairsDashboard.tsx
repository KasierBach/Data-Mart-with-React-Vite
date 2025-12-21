import { Users } from 'lucide-react'
import {
    PieChart,
    Pie,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell,
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
import { DashboardProps } from "./types"
import { THEME_COLORS } from "./constants"

export function StudentAffairsDashboard(props: DashboardProps) {
    const {
        insights,
        raceData,
        atRiskDemographics,
        supportNeeds
    } = props;
    return (
        <div className="space-y-6">
            {/* Student Affairs Insight */}
            <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded shadow-sm flex items-start">
                <Users className="h-6 w-6 text-orange-600 mt-1 mr-3 flex-shrink-0" />
                <div>
                    <h3 className="text-lg font-bold text-orange-800">Hỗ trợ Sinh viên & Phong trào</h3>
                    <p className="text-orange-700 mt-1">
                        Đã tiếp nhận <strong>15</strong> đơn xin hỗ trợ tài chính trong tháng này.
                        <br />
                        <strong>Lưu ý:</strong> Tỷ lệ sinh viên dân tộc thiểu số tham gia các CLB học thuật còn thấp (dưới 10%).
                        Cần thiết kế chương trình "Bạn cùng tiến" để khuyến khích hòa nhập.
                    </p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Quỹ Học bổng</CardTitle></CardHeader>
                    <CardContent><div className="text-2xl font-bold text-green-600">120 Triệu</div><p className="text-xs text-muted-foreground">Giải ngân 40%</p></CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Hoạt động Ngoại khóa</CardTitle></CardHeader>
                    <CardContent><div className="text-2xl font-bold text-blue-600">18 CLB</div><p className="text-xs text-muted-foreground">Đang hoạt động</p></CardContent>
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
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader><CardTitle>Cơ cấu Đối tượng Sinh viên</CardTitle><CardDescription>Phân theo Sắc tộc/Nhóm</CardDescription></CardHeader>
                    <CardContent className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={raceData}
                                    cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value"
                                >
                                    {raceData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'][index % 5]} />
                                    ))}
                                    <Label width={30} position="center">Tỷ lệ</Label>
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle>Mức độ tham gia Phong trào</CardTitle></CardHeader>
                    <CardContent className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={[
                                { name: 'Tình nguyện', value: 85 },
                                { name: 'Văn nghệ', value: 60 },
                                { name: 'Thể thao', value: 75 },
                                { name: 'Nghiên cứu', value: 40 },
                            ]} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" domain={[0, 100]} />
                                <YAxis dataKey="name" type="category" width={100} />
                                <Tooltip />
                                <Bar dataKey="value" fill="#f97316" name="% Tham gia" radius={[0, 4, 4, 0]} barSize={30} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            <div className="mt-6">
                <Card className="border-t-4 border-t-orange-500">
                    <CardHeader><CardTitle>Danh sách Sinh viên Cần Hỗ trợ & Theo dõi</CardTitle></CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader><TableRow><TableHead>Mã SV</TableHead><TableHead>Họ tên</TableHead><TableHead>Vấn đề</TableHead><TableHead>Đề xuất hỗ trợ</TableHead><TableHead>Trạng thái</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {insights.atRiskList.slice(0, 3).map(s => (
                                    <TableRow key={s.id}>
                                        <TableCell>{s.id}</TableCell>
                                        <TableCell>Sinh viên {s.id}</TableCell>
                                        <TableCell className="text-red-500">Học lực yếu / Nguy cơ bỏ học</TableCell>
                                        <TableCell>Tư vấn tâm lý & Học vụ</TableCell>
                                        <TableCell><Badge variant="outline" className="text-red-500 border-red-500">Chưa xử lý</Badge></TableCell>
                                    </TableRow>
                                ))}
                                <TableRow><TableCell>SV099</TableCell><TableCell>Nguyễn Văn X</TableCell><TableCell className="text-orange-500">Khó khăn tài chính</TableCell><TableCell>Học bổng KKHT</TableCell><TableCell><Badge variant="outline" className="text-blue-500 border-blue-500">Đang xét duyệt</Badge></TableCell></TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
            {/* DEEP DIVE: At-Risk Demographics */}
            <div className="mt-6 grid gap-6 md:grid-cols-2">
                <Card className="border-t-4 border-t-orange-600 shadow-sm">
                    <CardHeader>
                        <CardTitle>Phân tích Nhóm Rủi ro: Giới tính</CardTitle>
                        <CardDescription>Tỷ lệ nam/nữ trong nhóm học sinh cần can thiệp.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={atRiskDemographics.gender}
                                    cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value"
                                >
                                    {atRiskDemographics.gender.map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={entry.name === 'male' ? THEME_COLORS.male : THEME_COLORS.female} />
                                    ))}
                                    <Label width={30} position="center">Tỷ lệ</Label>
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="border-t-4 border-t-orange-600 shadow-sm">
                    <CardHeader>
                        <CardTitle>Phân tích Nhóm Rủi ro: Gia đình</CardTitle>
                        <CardDescription>Trình độ học vấn phụ huynh của nhóm học sinh yếu.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={atRiskDemographics.education} layout="vertical" margin={{ left: 40 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis dataKey="name" type="category" width={140} style={{ fontSize: '11px' }} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="value" fill="#f97316" name="Số lượng HS" barSize={20} radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
