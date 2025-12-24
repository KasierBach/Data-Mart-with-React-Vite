-- Create Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL,
    name VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(20)
);

-- Create Data Mart Table
CREATE TABLE IF NOT EXISTS fact_scores_15dec (
    id SERIAL PRIMARY KEY,
    gender              VARCHAR(10),
    race_ethnicity      VARCHAR(50),
    parental_education  VARCHAR(100),

    math                VARCHAR(20),
    math_score          INTEGER,

    reading             VARCHAR(20),
    reading_score       INTEGER,

    writing             VARCHAR(20),
    writing_score       INTEGER
);

-- Insert Default Users
INSERT INTO users (username, password, role, name) VALUES
('principal', 'password', 'principal', 'Hiệu Trưởng'),
('vice_principal', 'password', 'vice_principal', 'Ban Giám Hiệu'),
('head_dept', 'password', 'head_dept', 'Trưởng Khoa'),
('teacher', 'password', 'teacher', 'Giáo Viên'),
('academic_affairs', 'password', 'academic_affairs', 'Giáo Vụ'),
('qa_testing', 'password', 'qa_testing', 'Khảo Thí'),
('student_affairs', 'password', 'student_affairs', 'Công Tác Sinh Viên'),
('student', 'password', 'student', 'Học Sinh')
ON CONFLICT (username) DO UPDATE SET role = EXCLUDED.role, name = EXCLUDED.name;

-- Create Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    username VARCHAR(50),
    action VARCHAR(50) NOT NULL,
    details TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_username ON audit_logs(username);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);

