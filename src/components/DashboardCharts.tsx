import { useMemo } from 'react'
import { Info } from 'lucide-react'
import { PrincipalDashboard } from './dashboards/PrincipalDashboard'
import { VicePrincipalDashboard } from './dashboards/VicePrincipalDashboard'
import { HeadDeptDashboard } from './dashboards/HeadDeptDashboard'
import { TeacherDashboard } from './dashboards/TeacherDashboard'
import { AcademicAffairsDashboard } from './dashboards/AcademicAffairsDashboard'
import { QATestingDashboard } from './dashboards/QATestingDashboard'
import { StudentAffairsDashboard } from './dashboards/StudentAffairsDashboard'
import { StudentDashboard } from './dashboards/StudentDashboard'
import { DashboardProps } from './dashboards/types'
import { THEME_COLORS } from './dashboards/constants'
import { DataRecord, Role } from "../types"

interface DashboardChartsProps {
    data: DataRecord[]
    role: Role
}

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

    // Prepare props for role-specific dashboards
    const dashboardProps: DashboardProps = {
        data,
        avgScores,
        insights,
        scoreDistribution,
        passRateStats,
        educationData,
        raceData,
        trendData,
        ethnicityData,
        correlationData,
        atRiskDemographics,
        facultyStats,
        classStats,
        teacherStats,
        supportNeeds,
        enrichedData
    }

    const renderContentByRole = () => {
        switch (role) {
            case 'principal':
                return <PrincipalDashboard {...dashboardProps} />
            case 'vice_principal':
                return <VicePrincipalDashboard {...dashboardProps} />
            case 'head_dept':
                return <HeadDeptDashboard {...dashboardProps} />
            case 'teacher':
                return <TeacherDashboard {...dashboardProps} />
            case 'academic_affairs':
                return <AcademicAffairsDashboard {...dashboardProps} />
            case 'qa_testing':
                return <QATestingDashboard {...dashboardProps} />
            case 'student_affairs':
                return <StudentAffairsDashboard {...dashboardProps} />
            case 'student':
                return <StudentDashboard {...dashboardProps} />
            default:
                return (
                    <div className="text-center p-10 text-muted-foreground bg-white rounded-lg border flex flex-col items-center gap-2">
                        <Info className="h-10 w-10 text-gray-300" />
                        <p>Chọn vai trò để xem báo cáo chi tiết.</p>
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
