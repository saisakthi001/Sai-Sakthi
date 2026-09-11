-- ==========================================================
-- StudyMate Database Schema (SQLite)
-- Tables: users, subjects, topics, study_sessions, tasks
-- ==========================================================

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    college TEXT DEFAULT 'Springfield Institute of Technology',
    course TEXT DEFAULT 'B.Sc. Computer Science',
    year TEXT DEFAULT '2nd Year',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Subjects Table
CREATE TABLE IF NOT EXISTS subjects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    teacher TEXT NOT NULL,
    description TEXT,
    total_topics INTEGER DEFAULT 5,
    color TEXT DEFAULT '#3B82F6',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Topics Table
CREATE TABLE IF NOT EXISTS topics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    subject_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    completed INTEGER DEFAULT 0, -- 0 for Pending, 1 for Completed
    completed_at TIMESTAMP,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
);

-- 4. Study Sessions Table
CREATE TABLE IF NOT EXISTS study_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    subject_id INTEGER NOT NULL,
    topic TEXT NOT NULL,
    date TEXT NOT NULL,         -- Format: YYYY-MM-DD
    start_time TEXT NOT NULL,   -- e.g. '08:00 AM'
    end_time TEXT NOT NULL,     -- e.g. '09:30 AM'
    notes TEXT,
    status TEXT DEFAULT 'Pending', -- 'Pending' or 'Completed'
    duration_minutes INTEGER DEFAULT 60,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
);

-- 5. Tasks Table
CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    subject_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    due_date TEXT NOT NULL,
    priority TEXT DEFAULT 'Medium', -- 'Low', 'Medium', 'High'
    status TEXT DEFAULT 'Pending',   -- 'Pending' or 'Completed'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
);
