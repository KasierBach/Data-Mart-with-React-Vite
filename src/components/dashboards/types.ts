import { DataRecord } from "../../types";

export interface DashboardProps {
    data: DataRecord[];
    avgScores: {
        math: number;
        reading: number;
        writing: number;
    };
    insights: {
        atRisk: number;
        topPerformers: number;
        lowestSubject: { subject: string; score: number };
        atRiskList: any[];
        topList: any[];
    };
    scoreDistribution: any[];
    passRateStats: any[];
    educationData: any[];
    raceData: any[];
    trendData: any[];
    ethnicityData: any[];
    correlationData: any[];
    atRiskDemographics: any;
    facultyStats: any[];
    classStats: any[];
    teacherStats: any[];
    supportNeeds: any[];
    enrichedData: any[];
}
