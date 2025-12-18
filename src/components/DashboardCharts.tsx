import { useMemo } from 'react'
import { Users, BookOpen, PenTool, AlertTriangle, Trophy, Target, TrendingUp, Info, Activity, CheckCircle, User } from 'lucide-react'
import {
    PieChart,
    Pie,
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
    LineChart,
    Line,
    AreaChart,
    Area,
    ComposedChart,
    Label,
    ScatterChart,
    Scatter,
    Cell,
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
import { DataRecord, Role } from "../types"

interface DashboardChartsProps {
    data: DataRecord[]
    role: Role
}

export const THEME_COLORS = {
    male: '#3b82f6',   // blue-500
    female: '#ec4899', // pink-500
    math: '#ef4444',   // red-500
    reading: '#22c55e',// green-500
    writing: '#eab308', // yellow-500
    purple: '#8b5cf6',
    teal: '#14b8a6',
    orange: '#f97316'
};

export function DashboardCharts({ data, role }: DashboardChartsProps) {

    // --- V2: Data Enrichment (Mocking Faculties, Classes, Teachers) ---
    const enrichedData = useMemo(() => {
        const faculties = ['Khoa Toán', 'Khoa Văn', 'Khoa Lý', 'Khoa Hóa', 'Khoa Ngoại Ngữ'];
        const teachers: Record<string, string[]> = {
            'Khoa Toán': ['Thầy Hùng', 'Cô Lan', 'Thầy Minh'],
            'Khoa Văn': ['Cô Mai', 'Thầy Tuấn'],
            'Khoa Lý': ['Thầy Đức', 'Cô Hằng'],
            'Khoa Hóa': ['Cô Phương', 'Thầy Bình'],
            'Khoa Ngoại Ngữ': ['Ms. Sarah', 'Mr. John']
        };

        return data.map((d, index) => {
            // Deterministic assignment based on ID or index
            const facultyIdx = index % faculties.length;
            const faculty = faculties[facultyIdx];
            const facultyTeachers = teachers[faculty];
            const teacher = facultyTeachers[index % facultyTeachers.length];
            // Classes: 10A1, 10A2...
            const classId = `10A${(index % 5) + 1}`;

            return {
                ...d,
                faculty,
                teacher,
                classId,
                status: (d.math_score + d.reading_score + d.writing_score) / 3 >= 80 ? 'Gioi'
                    : (d.math_score + d.reading_score + d.writing_score) / 3 >= 50 ? 'Kha'
                        : 'Yeu'
            };
        });
    }, [data]);

    // Use Enriched Data for Averages
    const avgScores = useMemo(() => {
        if (enrichedData.length === 0) return { math: 0, reading: 0, writing: 0 }
        const totalMath = enrichedData.reduce((acc, curr) => acc + curr.math_score, 0)
        const totalReading = enrichedData.reduce((acc, curr) => acc + curr.reading_score, 0)
        const totalWriting = enrichedData.reduce((acc, curr) => acc + curr.writing_score, 0)
        return {
            math: Math.round(totalMath / enrichedData.length),
            reading: Math.round(totalReading / enrichedData.length),
            writing: Math.round(totalWriting / enrichedData.length)
        }
    }, [enrichedData])

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

        const topList = data
            .filter(d => (d.math_score + d.reading_score + d.writing_score) / 3 >= 90)
            .map(d => ({ ...d, avg: Math.round((d.math_score + d.reading_score + d.writing_score) / 3) }))
            .sort((a, b) => b.avg - a.avg)
            .slice(0, 5)

        return { atRisk, topPerformers, lowestSubject, atRiskList, topList }
    }, [data, avgScores])

    // --- Chart Data Preparation (Common) ---

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

    // 7. Pass Rate Stats
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

    // 3. Education (Grouped)
    const educationData = useMemo(() => {
        const eduStats: Record<string, { math: number, reading: number, writing: number, count: number }> = {}
        data.forEach(d => {
            const edu = d.parental_education
            if (!eduStats[edu]) eduStats[edu] = { math: 0, reading: 0, writing: 0, count: 0 }
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

    // Race Data
    const raceData = useMemo(() => {
        const counts: Record<string, number> = {}
        data.forEach(d => {
            counts[d.race_ethnicity] = (counts[d.race_ethnicity] || 0) + 1
        })
        return Object.entries(counts)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => a.name.localeCompare(b.name))
    }, [data])


    // --- Mock Trend Data (for Principal/Vice Principal) ---
    const trendData = useMemo(() => {
        // Mocking 6 months of data based on current averages with some noise
        const months = ['Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12', 'Tháng 1', 'Tháng 2'];
        return months.map((month, i) => ({
            name: month,
            Math: Math.min(100, Math.max(0, avgScores.math + (i - 3) * 1.5 + (Math.random() * 5 - 2.5))),
            Reading: Math.min(100, Math.max(0, avgScores.reading + (i - 3) * 1 + (Math.random() * 5 - 2.5))),
            Writing: Math.min(100, Math.max(0, avgScores.writing + (i - 3) * 0.5 + (Math.random() * 5 - 2.5))),
        }));
    }, [avgScores]);

    // --- NEW: Deep Dive Analytics Data Preparation ---

    // 1. Ethnicity Performance Gap (for Vice Principal)
    const ethnicityData = useMemo(() => {
        const groups: Record<string, { math: number, reading: number, writing: number, count: number }> = {}
        data.forEach(d => {
            const race = d.race_ethnicity
            if (!groups[race]) groups[race] = { math: 0, reading: 0, writing: 0, count: 0 }
            groups[race].math += d.math_score
            groups[race].reading += d.reading_score
            groups[race].writing += d.writing_score
            groups[race].count += 1
        })
        return Object.entries(groups).map(([name, stats]) => ({
            name,
            Math: Math.round(stats.math / stats.count),
            Reading: Math.round(stats.reading / stats.count),
            Writing: Math.round(stats.writing / stats.count),
            Count: stats.count
        })).sort((a, b) => b.Math - a.Math) // Sort by Math score
    }, [data])

    // 2. Correlation Data (for Head Dept) - Sampling to improve performance if large dataset
    const correlationData = useMemo(() => {
        // Take every nth item if data > 500 to prevent rendering lag
        const step = data.length > 500 ? Math.ceil(data.length / 500) : 1;
        return data.filter((_, i) => i % step === 0).map(d => ({
            math: d.math_score,
            reading: d.reading_score,
            writing: d.writing_score,
            size: 1 // uniform size for scatter
        }))
    }, [data])

    // 3. At-Risk Detail Demographics (for Student Affairs)
    const atRiskDemographics = useMemo(() => {
        const riskGroup = data.filter(d => d.math_score < 50 || d.reading_score < 50 || d.writing_score < 50);
        const totalRisk = riskGroup.length || 1;

        // By Gender
        const byGender = riskGroup.reduce((acc: any, curr) => {
            acc[curr.gender] = (acc[curr.gender] || 0) + 1;
            return acc;
        }, {});

        // By Parental Education
        const byEdu = riskGroup.reduce((acc: any, curr) => {
            acc[curr.parental_education] = (acc[curr.parental_education] || 0) + 1;
            return acc;
        }, {});

        return {
            gender: Object.entries(byGender).map(([name, value]) => ({ name, value: value as number })),
            education: Object.entries(byEdu).map(([name, value]) => ({ name, value: value as number })).sort((a, b) => b.value - a.value)
        }
    }, [data])

    // --- V2 NEW ANALYTICS ---

    // 1. Principal: Faculty Performance (Fail Rates & Quality)
    const facultyStats = useMemo(() => {
        const stats: Record<string, { total: number, fail: number, excellent: number, good: number, weak: number }> = {};
        enrichedData.forEach(d => {
            if (!stats[d.faculty]) stats[d.faculty] = { total: 0, fail: 0, excellent: 0, good: 0, weak: 0 };
            stats[d.faculty].total++;
            // Fail if any subject < 50
            if (d.math_score < 50 || d.reading_score < 50 || d.writing_score < 50) stats[d.faculty].fail++;

            if (d.status === 'Gioi') stats[d.faculty].excellent++;
            else if (d.status === 'Kha') stats[d.faculty].good++;
            else stats[d.faculty].weak++;
        });

        return Object.entries(stats).map(([name, s]) => ({
            name,
            failRate: Math.round((s.fail / s.total) * 100),
            excellent: s.excellent,
            good: s.good,
            weak: s.weak,
            total: s.total
        })).sort((a, b) => b.failRate - a.failRate); // Sort by highest failure rate
    }, [enrichedData]);

    // 2. Vice Principal: Class Drill Down (Math Failure)
    const classStats = useMemo(() => {
        const stats: Record<string, { total: number, failMath: number }> = {};
        enrichedData.forEach(d => {
            if (!stats[d.classId]) stats[d.classId] = { total: 0, failMath: 0 };
            stats[d.classId].total++;
            if (d.math_score < 50) stats[d.classId].failMath++;
        });
        return Object.entries(stats).map(([name, s]) => ({
            name,
            failRate: Math.round((s.failMath / s.total) * 100),
            failCount: s.failMath
        })).sort((a, b) => b.failRate - a.failRate);
    }, [enrichedData]);

    // 3. Head Dept: Teacher Performance
    const teacherStats = useMemo(() => {
        const stats: Record<string, { total: number, totalScore: number, fail: number }> = {};
        enrichedData.forEach(d => {
            if (!stats[d.teacher]) stats[d.teacher] = { total: 0, totalScore: 0, fail: 0 };
            stats[d.teacher].total++;
            const avg = (d.math_score + d.reading_score + d.writing_score) / 3;
            stats[d.teacher].totalScore += avg;
            if (avg < 50) stats[d.teacher].fail++;
        });
        return Object.entries(stats).map(([name, s]) => ({
            name,
            avgScore: Math.round(s.totalScore / s.total),
            failRate: Math.round((s.fail / s.total) * 100)
        })).sort((a, b) => a.avgScore - b.avgScore); // Lowest score first
    }, [enrichedData]);

    // 4. Student Affairs: Support Needs
    const supportNeeds = useMemo(() => {
        const types = [
            { name: 'Học tập', value: insights.atRisk, fill: '#ef4444' }, // Academic
            { name: 'Tâm lý', value: Math.round(insights.atRisk * 0.4), fill: '#8b5cf6' }, // Psych (Simulated 40% of At Risk)
            { name: 'Kinh tế', value: Math.round(insights.atRisk * 0.2), fill: '#eab308' }, // Financial (Simulated 20%)
        ];
        return types;
    }, [insights]);

    // 4. Score Distribution Comparison (for QA)
    // Re-using scoreDistribution but ensuring it works for overlay logic
    // (scoreDistribution already calculated above is fine)

    // Role-based Rendering Logic
    const renderContentByRole = () => {
        switch (role) {
            case 'principal': // 1. Hiệu trưởng (Chiến lược)
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
                                    <CardDescription>So sánh giữa các bộ môn chính.</CardDescription>
                                </CardHeader>
                                <CardContent className="h-[350px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={[
                                            { name: 'Khoa Tự nhiên', score: avgScores.math, target: 80 },
                                            { name: 'Khoa Xã hội', score: (avgScores.reading + avgScores.writing) / 2, target: 85 },
                                        ]}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis domain={[0, 100]} />
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey="score" name="Thực tế" fill={THEME_COLORS.male} radius={[4, 4, 0, 0]} />
                                            <Bar dataKey="target" name="Mục tiêu" fill={THEME_COLORS.writing} radius={[4, 4, 0, 0]} />
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
                                                    {insights.atRiskList.length > 0 ? (
                                                        insights.atRiskList.slice(0, 5).map((s) => (
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
                                        {insights.atRiskList.length > 5 && <div className="mt-2 text-xs text-muted-foreground text-center italic">Đang hiển thị 5/{insights.atRiskList.length} học sinh.</div>}
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
                                                    {insights.topList.length > 0 ? (
                                                        insights.topList.slice(0, 5).map((s) => (
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

            case 'vice_principal': // 2. Ban giám hiệu (Giám sát)
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
                            <Card className="border-t-4 border-t-orange-500">
                                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Tỷ lệ Chuyên cần</CardTitle></CardHeader>
                                <CardContent><div className="text-2xl font-bold text-orange-600">92%</div><p className="text-xs text-muted-foreground">-1% so với tuần trước</p></CardContent>
                            </Card>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
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
                                                {insights.atRiskList.slice(0, 5).map((s) => (
                                                    <TableRow key={s.id}>
                                                        <TableCell className="font-medium">{s.id}</TableCell>
                                                        <TableCell className="text-red-500 font-medium">Học lực yếu (Dưới 50)</TableCell>
                                                        <TableCell className={s.math_score < 50 ? "text-red-600 font-bold bg-red-50" : ""}>{s.math_score}</TableCell>
                                                        <TableCell className={s.reading_score < 50 ? "text-red-600 font-bold bg-red-50" : ""}>{s.reading_score}</TableCell>
                                                        <TableCell className={s.writing_score < 50 ? "text-red-600 font-bold bg-red-50" : ""}>{s.writing_score}</TableCell>
                                                        <TableCell><Badge variant="outline" className="border-red-500 text-red-500 font-bold">Gặp Phụ huynh</Badge></TableCell>
                                                    </TableRow>
                                                ))}
                                                <TableRow>
                                                    <TableCell className="font-medium">HS00X</TableCell>
                                                    <TableCell className="text-orange-500 font-medium">Hạnh kiểm/Chuyên cần</TableCell>
                                                    <TableCell>75</TableCell>
                                                    <TableCell>80</TableCell>
                                                    <TableCell>78</TableCell>
                                                    <TableCell><Badge variant="outline" className="border-orange-500 text-orange-500 font-bold">Nhắc nhở</Badge></TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </div>
                                    <div className="mt-2 text-xs text-muted-foreground text-center">Hiển thị mẫu các trường hợp điển hình.</div>
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

            case 'head_dept': // 3. Trưởng khoa (Quản lý chat luong)
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
                                        <TableHeader><TableRow><TableHead>Mã GV</TableHead><TableHead>Họ tên</TableHead><TableHead>Chuyên môn</TableHead><TableHead>Kỷ luật</TableHead><TableHead>Đánh giá chung</TableHead></TableRow></TableHeader>
                                        <TableBody>
                                            <TableRow><TableCell>GV01</TableCell><TableCell>Nguyễn Văn A</TableCell><TableCell>90</TableCell><TableCell>95</TableCell><TableCell><Badge className="bg-green-600">Xuất sắc</Badge></TableCell></TableRow>
                                            <TableRow><TableCell>GV02</TableCell><TableCell>Trần Thị B</TableCell><TableCell>85</TableCell><TableCell>88</TableCell><TableCell><Badge className="bg-blue-600">Tốt</Badge></TableCell></TableRow>
                                            <TableRow><TableCell>GV03</TableCell><TableCell>Phạm Văn C</TableCell><TableCell>75</TableCell><TableCell>80</TableCell><TableCell><Badge className="bg-yellow-600">Khá</Badge></TableCell></TableRow>
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

            case 'teacher': // 4. Giáo viên (Theo dõi lớp)
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

            case 'academic_affairs': // 5. Phòng đào tạo
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

            case 'qa_testing': // 6. Khảo thí
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

            case 'student_affairs': // 7. Công tác sinh viên
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
                                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Tư vấn Tâm lý</CardTitle></CardHeader>
                                <CardContent><div className="text-2xl font-bold text-purple-600">8 Cas</div><p className="text-xs text-muted-foreground">Đã xử lý xong</p></CardContent>
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
                                                {atRiskDemographics.gender.map((entry, index) => (
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

            case 'student': // 8. Sinh viên / Phụ huynh


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

            default:
                return (
                    <div className="text-center p-10 text-muted-foreground">
                        Select a role to view the specific dashboard.
                    </div>
                )
        }
    }

    if (data.length === 0) return null

    return (
        <div className="space-y-4">
            {renderContentByRole()}
        </div>
    )
}
