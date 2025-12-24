export interface DataRecord {
    id: number
    gender: string
    race_ethnicity: string
    parental_education: string
    math: string
    math_score: number
    reading: string
    reading_score: number
    writing: string
    writing_score: number
    status: "active" | "inactive" | "pending"
    lastUpdate: string
}

export type Role = 'principal' | 'vice_principal' | 'head_dept' | 'teacher' | 'academic_affairs' | 'qa_testing' | 'student_affairs' | 'student' | 'no_role';
