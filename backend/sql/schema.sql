-- Language table
CREATE TABLE IF NOT EXISTS language (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(25) NOT NULL UNIQUE
);

-- Level table
CREATE TABLE IF NOT EXISTS level (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(15) NOT NULL UNIQUE CHECK (name IN  ('Beginner', 'Intermediate', 'Advanced'))
);

-- Tutor table
CREATE TABLE IF NOT EXISTS tutor (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name VARCHAR(25) NOT NULL,
    last_name VARCHAR(25) NOT NULL,
    email VARCHAR(50) NOT NULL,
    phone_number VARCHAR(12),
    address Text
);

-- Course table
CREATE TABLE IF NOT EXISTS course (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(50) NOT NULL,
    description VARCHAR(100),
    tutor_id INTEGER,
    language_id INTEGER,
    format VARCHAR(15) CHECK (format IN ('In-person', 'Online')),
    total_hours INTEGER,
    level_id INTEGER,
    FOREIGN KEY (tutor_id) REFERENCES tutor(id) ON DELETE SET NULL,
    FOREIGN KEY (language_id) REFERENCES language(id) ON DELETE CASCADE,
    FOREIGN KEY (level_id) REFERENCES level(id) ON DELETE SET NULL
);

-- Student table
CREATE TABLE IF NOT EXISTS student (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name VARCHAR(25) NOT NULL,
    last_name VARCHAR(25) NOT NULL,
    email VARCHAR(30) NOT NULL,
    phone_number VARCHAR(25),
    year INTEGER,
    course_id INTEGER,
    dlpt_score INTEGER,
    level_id INTEGER,
    address VARCHAR(60),
    FOREIGN KEY (course_id) REFERENCES course(id) ON DELETE SET NULL,
    FOREIGN KEY (level_id) REFERENCES level(id) ON DELETE SET NULL
);

-- Scheduled Session table
CREATE TABLE IF NOT EXISTS scheduled_session (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_id INTEGER NOT NULL,
    session_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    location VARCHAR(40),
    status VARCHAR(25) NOT NULL CHECK (status IN ('Scheduled', 'Completed', 'Cancelled')) DEFAULT 'Scheduled',
    approved BOOLEAN NOT NULL,
    FOREIGN KEY (course_id) REFERENCES course(id) ON DELETE CASCADE
);

-- Attendance table
CREATE TABLE IF NOT EXISTS attendance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id INTEGER NOT NULL,
    student_id INTEGER NOT NULL,
    attended BOOLEAN DEFAULT 0,
    FOREIGN KEY (session_id) REFERENCES scheduled_session(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES student(id) ON DELETE CASCADE
);

-- ChangeCourse table
CREATE TABLE IF NOT EXISTS change_course (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_id INTEGER NOT NULL,
    change_type VARCHAR(9) NOT NULL CHECK (change_type IN ('Format', 'Other')) DEFAULT 'Format',
    status VARCHAR(25) NOT NULL,
    submitted_by INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES course(id) ON DELETE CASCADE,
    FOREIGN KEY (submitted_by) REFERENCES student(id) ON DELETE SET NULL
);

-- Test table
CREATE TABLE IF NOT EXISTS test (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    score INTEGER NOT NULL CHECK(score >= 0 AND score <= 100),
    date DATE NOT NULL,
    description VARCHAR(50),
    FOREIGN KEY (student_id) REFERENCES student(id) ON DELETE CASCADE
);