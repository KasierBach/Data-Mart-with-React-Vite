export interface DataRecord {
    id: number
    gender: string
    race_ethnicity: string
    parental_education: string
    math_label: string
    math_score: number
    reading_label: string
    reading_score: number
    writing_label: string
    writing_score: number
    status: "active" | "inactive" | "pending"
    lastUpdate: string
}
