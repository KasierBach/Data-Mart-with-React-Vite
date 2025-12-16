import { useMemo } from 'react'
import { Users, BookOpen, PenTool, Calculator, AlertTriangle, Trophy, Target } from 'lucide-react'
import {
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    RadarChart,
    Radar,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ScatterChart,
    Scatter,
    Label,
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
import { DataRecord } from "../types"

interface DashboardChartsProps {
    data: DataRecord[]
}

// Modern/Premium Color Palette
const COLORS = [
    '#6366f1', // Indigo (Math/Primary)
    '#ec4899', // Pink (Reading/Secondary)
    '#14b8a6', // Teal (Writing/Tertiary)
    '#f59e0b', // Amber
    '#8b5cf6', // Violet
    '#3b82f6', // Blue
]

const THEME_COLORS = {
    male: '#3b82f6',   // Blue
    female: '#ec4899', // Pink
    math: '#6366f1',   // Indigo
    reading: '#10b981',// Emerald
    writing: '#f59e0b' // Amber
}

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

    return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="font-bold text-xs" style={{ pointerEvents: 'none' }}>
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

export function DashboardCharts({ data }: DashboardChartsProps) {
    // 1. Demographics: Gender Distribution
    const genderData = useMemo(() => {
        const counts: Record<string, number> = {}
        data.forEach(d => {
            const gender = d.gender.charAt(0).toUpperCase() + d.gender.slice(1)
            counts[gender] = (counts[gender] || 0) + 1
        })
        return Object.entries(counts).map(([name, value]) => ({ name, value }))
    }, [data])

    // 2. Demographics: Race/Ethnicity Distribution
    const raceData = useMemo(() => {
        const counts: Record<string, number> = {}
        data.forEach(d => {
            counts[d.race_ethnicity] = (counts[d.race_ethnicity] || 0) + 1
        })
        return Object.entries(counts)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => a.name.localeCompare(b.name))
    }, [data])

    // 3. Average Scores by Parental Education
    const educationData = useMemo(() => {
        const eduStats: Record<string, { math: number, reading: number, writing: number, count: number }> = {}

        data.forEach(d => {
            const edu = d.parental_education
            if (!eduStats[edu]) {
                eduStats[edu] = { math: 0, reading: 0, writing: 0, count: 0 }
            }
            eduStats[edu].math += d.math_score
            eduStats[edu].reading += d.reading_score
            eduStats[edu].writing += d.writing_score
            eduStats[edu].count += 1
        })

        return Object.entries(eduStats).map(([name, stats]) => ({
            name,
            Math: Math.round(stats.math / stats.count),
            Reading: Math.round(stats.reading / stats.count),
            Writing: Math.round(stats.writing / stats.count),
        }))
    }, [data])

    // 4. Score Distribution (Grouped into ranges)
    const scoreDistribution = useMemo(() => {
        const ranges = [
            { name: '0-20', min: 0, max: 20 },
            { name: '21-40', min: 21, max: 40 },
            { name: '41-60', min: 41, max: 60 },
            { name: '61-80', min: 61, max: 80 },
            { name: '81-100', min: 81, max: 100 },
        ]

        const distData = ranges.map(r => ({ name: r.name, Math: 0, Reading: 0, Writing: 0 }))

        data.forEach(d => {
            // Find range index
            const findRangeIndex = (score: number) => ranges.findIndex(r => score >= r.min && score <= r.max)

            const mathIdx = findRangeIndex(d.math_score)
            if (mathIdx !== -1) distData[mathIdx].Math++

            const readIdx = findRangeIndex(d.reading_score)
            if (readIdx !== -1) distData[readIdx].Reading++

            const writeIdx = findRangeIndex(d.writing_score)
            if (writeIdx !== -1) distData[writeIdx].Writing++
        })
        return distData
    }, [data])

    // 5. Radar Chart: Gender Comparison (Average Scores)
    const genderComparisonData = useMemo(() => {
        const stats: Record<string, { math: number, reading: number, writing: number, count: number }> = {
            'male': { math: 0, reading: 0, writing: 0, count: 0 },
            'female': { math: 0, reading: 0, writing: 0, count: 0 }
        }

        data.forEach(d => {
            const g = d.gender as 'male' | 'female'
            if (stats[g]) {
                stats[g].math += d.math_score
                stats[g].reading += d.reading_score
                stats[g].writing += d.writing_score
                stats[g].count += 1
            }
        })

        return [
            { subject: 'Math', male: stats.male.count ? Math.round(stats.male.math / stats.male.count) : 0, female: stats.female.count ? Math.round(stats.female.math / stats.female.count) : 0, fullMark: 100 },
            { subject: 'Reading', male: stats.male.count ? Math.round(stats.male.reading / stats.male.count) : 0, female: stats.female.count ? Math.round(stats.female.reading / stats.female.count) : 0, fullMark: 100 },
            { subject: 'Writing', male: stats.male.count ? Math.round(stats.male.writing / stats.male.count) : 0, female: stats.female.count ? Math.round(stats.female.writing / stats.female.count) : 0, fullMark: 100 },
        ]
    }, [data])

    // 6. Scatter Plot Data (Math vs Reading) - Limit points for performance if needed
    const scatterData = useMemo(() => {
        return data.map(d => ({
            x: d.math_score,
            y: d.reading_score,
            z: d.writing_score, // bubble size potentially
            gender: d.gender,
        }))
    }, [data])

    // 7. Pass Rate Stats (Ring Charts Data)
    const passRateStats = useMemo(() => {
        const total = data.length
        if (total === 0) return []

        const mathPass = data.filter(d => d.math_score >= 50).length
        const readingPass = data.filter(d => d.reading_score >= 50).length
        const writingPass = data.filter(d => d.writing_score >= 50).length

        return [
            { subject: 'Math', rate: Math.round((mathPass / total) * 100), pass: mathPass, fail: total - mathPass, color: THEME_COLORS.math },
            { subject: 'Reading', rate: Math.round((readingPass / total) * 100), pass: readingPass, fail: total - readingPass, color: THEME_COLORS.reading },
            { subject: 'Writing', rate: Math.round((writingPass / total) * 100), pass: writingPass, fail: total - writingPass, color: THEME_COLORS.writing },
        ]
    }, [data])


    const avgScores = useMemo(() => {
        if (data.length === 0) return { math: 0, reading: 0, writing: 0 }
        const totalMath = data.reduce((acc, curr) => acc + curr.math_score, 0)
        const totalReading = data.reduce((acc, curr) => acc + curr.reading_score, 0)
        const totalWriting = data.reduce((acc, curr) => acc + curr.writing_score, 0)
        return {
            math: Math.round(totalMath / data.length),
            reading: Math.round(totalReading / data.length),
            writing: Math.round(totalWriting / data.length)
        }
    }, [data])

    const insights = useMemo(() => {
        if (data.length === 0) return { atRisk: 0, topPerformers: 0, lowestSubject: { subject: 'N/A', score: 0 }, atRiskList: [], topList: [] }

        const atRisk = data.filter(d => d.math_score < 50 || d.reading_score < 50 || d.writing_score < 50).length
        const topPerformers = data.filter(d => (d.math_score + d.reading_score + d.writing_score) / 3 >= 90).length

        const scores = [
            { subject: 'Toán', score: avgScores.math },
            { subject: 'Đọc hiểu', score: avgScores.reading },
            { subject: 'Viết', score: avgScores.writing }
        ]
        const lowestSubject = scores.reduce((min, curr) => curr.score < min.score ? curr : min, scores[0])

        // Detailed Lists
        const atRiskList = data
            .filter(d => d.math_score < 50 || d.reading_score < 50 || d.writing_score < 50)
            .map(d => ({ ...d, avg: Math.round((d.math_score + d.reading_score + d.writing_score) / 3) }))
            .sort((a, b) => a.avg - b.avg)
            .slice(0, 5)

        const topList = data
            .filter(d => (d.math_score + d.reading_score + d.writing_score) / 3 >= 90)
            .map(d => ({ ...d, avg: Math.round((d.math_score + d.reading_score + d.writing_score) / 3) }))
            .sort((a, b) => b.avg - a.avg)
            .slice(0, 5)

        return { atRisk, topPerformers, lowestSubject, atRiskList, topList }
    }, [data, avgScores])

    if (data.length === 0) return null

    return (
        <div className="space-y-4">
            {/* Critical Insights Row (Principal View) */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-red-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-700">
                            Học sinh cần hỗ trợ
                        </CardTitle>
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{insights.atRisk}</div>
                        <p className="text-xs text-muted-foreground">
                            Có ít nhất 1 môn dưới 50đ
                        </p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-yellow-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-700">
                            Học sinh xuất sắc
                        </CardTitle>
                        <Trophy className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">{insights.topPerformers}</div>
                        <p className="text-xs text-muted-foreground">
                            Điểm trung bình {'>'}= 90
                        </p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-orange-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-700">
                            Cần cải thiện
                        </CardTitle>
                        <Target className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-600">{insights.lowestSubject.subject}</div>
                        <p className="text-xs text-muted-foreground">
                            Môn có điểm TB thấp nhất ({insights.lowestSubject.score})
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Key Metrics Row */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">
                            Tổng số học sinh
                        </CardTitle>
                        <Users className="h-4 w-4 text-gray-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.length}</div>
                        <p className="text-xs text-muted-foreground">
                            Hồ sơ đang quản lý
                        </p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">
                            Điểm TB Toán
                        </CardTitle>
                        <Calculator className="h-4 w-4" style={{ color: THEME_COLORS.math }} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold" style={{ color: THEME_COLORS.math }}>{avgScores.math}</div>
                        <p className="text-xs text-muted-foreground">
                            Điểm trung bình toàn trường
                        </p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">
                            Điểm TB Đọc hiểu
                        </CardTitle>
                        <BookOpen className="h-4 w-4" style={{ color: THEME_COLORS.reading }} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold" style={{ color: THEME_COLORS.reading }}>{avgScores.reading}</div>
                        <p className="text-xs text-muted-foreground">
                            Điểm trung bình toàn trường
                        </p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">
                            Điểm TB Viết
                        </CardTitle>
                        <PenTool className="h-4 w-4" style={{ color: THEME_COLORS.writing }} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold" style={{ color: THEME_COLORS.writing }}>{avgScores.writing}</div>
                        <p className="text-xs text-muted-foreground">
                            Điểm trung bình toàn trường
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Row 1: Demographics & Radial */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* Gender Pie */}
                <Card className="col-span-1 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold text-gray-700">Phân bố giới tính</CardTitle>
                        <CardDescription>Tỷ lệ nam và nữ trong dữ liệu</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={genderData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={85}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                    label={renderCustomizedLabel}
                                    labelLine={false}
                                >
                                    {genderData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={entry.name.toLowerCase() === 'female' ? THEME_COLORS.female : THEME_COLORS.male}
                                        />
                                    ))}
                                    <Label
                                        value={data.length}
                                        position="center"
                                        dy={-10}
                                        className='fill-gray-700 font-bold text-3xl'
                                    />
                                    <Label
                                        value="Học sinh"
                                        position="center"
                                        dy={15}
                                        className='fill-gray-500 font-medium text-sm'
                                    />
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    itemStyle={{ color: '#374151', fontWeight: 600 }}
                                />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Pass Rate Rings */}
                <Card className="col-span-1 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold text-gray-700">Tỷ lệ qua môn ({'>'}50đ)</CardTitle>
                        <CardDescription>Phần trăm học sinh đạt yêu cầu</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[250px] flex items-center justify-around">
                        {passRateStats.map((stat, index) => (
                            <div key={index} className="h-full flex-1 flex flex-col items-center justify-center relative">
                                <div className="h-[120px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Tooltip
                                                content={({ active, payload }) => {
                                                    if (active && payload && payload.length) {
                                                        const data = payload[0].payload;
                                                        return (
                                                            <div className="bg-white p-2 border border-blue-100 shadow-lg rounded-lg">
                                                                <p className="text-sm font-semibold text-gray-700">{data.name === 'pass' ? 'Đạt' : 'Chưa đạt'}</p>
                                                                <p className="text-sm text-gray-500">{data.value} học sinh</p>
                                                            </div>
                                                        );
                                                    }
                                                    return null;
                                                }}
                                            />
                                            <Pie
                                                data={[
                                                    { name: 'pass', value: stat.pass, fill: stat.color },
                                                    { name: 'fail', value: stat.fail, fill: '#e5e7eb' }
                                                ]}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={35}
                                                outerRadius={50}
                                                startAngle={90}
                                                endAngle={-270}
                                                dataKey="value"
                                                stroke="none"
                                            />
                                            <text
                                                x="50%"
                                                y="50%"
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                                className="fill-gray-700 font-bold text-sm"
                                            >
                                                {`${stat.rate}%`}
                                            </text>
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <span className="text-sm font-medium text-gray-500 mt-2">{stat.subject}</span>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Radar Chart */}
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>So sánh Nam/Nữ</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={genderComparisonData}>
                                <PolarGrid />
                                <PolarAngleAxis dataKey="subject" />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                                <Radar name="Male" dataKey="male" stroke={THEME_COLORS.male} fill={THEME_COLORS.male} fillOpacity={0.5} />
                                <Radar name="Female" dataKey="female" stroke={THEME_COLORS.female} fill={THEME_COLORS.female} fillOpacity={0.5} />
                                <Legend />
                                <Tooltip />
                            </RadarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Row 2: Distributions and Relations */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">

                {/* Race Bar Chart */}
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Phân bố nhóm sắc tộc</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2 h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={raceData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip cursor={{ fill: 'transparent' }} />
                                <Bar dataKey="value" name="Số lượng" fill={COLORS[0]} radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Scatter Plot */}
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Toán vs Đọc hiểu</CardTitle>
                        <CardDescription>Tương quan điểm số</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <ScatterChart
                                margin={{
                                    top: 20,
                                    right: 20,
                                    bottom: 20,
                                    left: 20,
                                }}
                            >
                                <CartesianGrid />
                                <XAxis type="number" dataKey="x" name="Math" unit="đ" />
                                <YAxis type="number" dataKey="y" name="Reading" unit="đ" />
                                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                                <Legend />
                                <Scatter name="Students" data={scatterData} fill={COLORS[1]} />
                            </ScatterChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                {/* Education vs Scores */}
                <Card>
                    <CardHeader>
                        <CardTitle>Điểm số theo học vấn phụ huynh</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={educationData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" domain={[0, 100]} />
                                <YAxis dataKey="name" type="category" width={120} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="Math" fill={THEME_COLORS.math} radius={[0, 4, 4, 0]} />
                                <Bar dataKey="Reading" fill={THEME_COLORS.reading} radius={[0, 4, 4, 0]} />
                                <Bar dataKey="Writing" fill={THEME_COLORS.writing} radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Score Distribution */}
                <Card>
                    <CardHeader>
                        <CardTitle>Phân phối phổ điểm</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={scoreDistribution}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="Math" stackId="a" fill={THEME_COLORS.math} />
                                <Bar dataKey="Reading" stackId="b" fill={THEME_COLORS.reading} />
                                <Bar dataKey="Writing" stackId="c" fill={THEME_COLORS.writing} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Detailed Lists Row */}
            <div className="grid gap-4 md:grid-cols-2">
                {/* At-Risk Students Table */}
                <Card className="border-t-4 border-t-red-500 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold text-gray-700">Danh sách cần hỗ trợ (Top 5)</CardTitle>
                        <CardDescription>Học sinh có điểm dưới trung bình</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Toán</TableHead>
                                    <TableHead>Đọc</TableHead>
                                    <TableHead>Viết</TableHead>
                                    <TableHead>TB</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {insights.atRiskList.map((student) => (
                                    <TableRow key={student.id}>
                                        <TableCell className="font-medium">{student.id}</TableCell>
                                        <TableCell className={student.math_score < 50 ? "text-red-600 font-bold" : ""}>{student.math_score}</TableCell>
                                        <TableCell className={student.reading_score < 50 ? "text-red-600 font-bold" : ""}>{student.reading_score}</TableCell>
                                        <TableCell className={student.writing_score < 50 ? "text-red-600 font-bold" : ""}>{student.writing_score}</TableCell>
                                        <TableCell>{student.avg}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Top Performers Table */}
                <Card className="border-t-4 border-t-yellow-500 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold text-gray-700">Bảng vàng thành tích (Top 5)</CardTitle>
                        <CardDescription>Học sinh có điểm trung bình cao nhất</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Toán</TableHead>
                                    <TableHead>Đọc</TableHead>
                                    <TableHead>Viết</TableHead>
                                    <TableHead>TB</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {insights.topList.map((student) => (
                                    <TableRow key={student.id}>
                                        <TableCell className="font-medium">{student.id}</TableCell>
                                        <TableCell className="text-green-600 font-bold">{student.math_score}</TableCell>
                                        <TableCell className="text-green-600 font-bold">{student.reading_score}</TableCell>
                                        <TableCell className="text-green-600 font-bold">{student.writing_score}</TableCell>
                                        <TableCell className="font-bold text-yellow-600">{student.avg}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
