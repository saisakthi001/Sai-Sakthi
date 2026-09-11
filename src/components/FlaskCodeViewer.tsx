import React, { useState } from 'react';
import {
  Code2,
  Database,
  FileText,
  Copy,
  Check,
  Download,
  Terminal,
  Layers,
  BookOpen,
  Info,
} from 'lucide-react';

export const FlaskCodeViewer: React.FC = () => {
  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<'app.py' | 'schema.sql' | 'init_db.py' | 'README.md' | 'dashboard.html'>('app.py');

  const copyToClipboard = (code: string, fileName: string) => {
    navigator.clipboard.writeText(code);
    setCopiedFile(fileName);
    setTimeout(() => setCopiedFile(null), 2000);
  };

  const files = {
    'app.py': `# ==========================================================
# StudyMate – Student Study Planner (Flask + SQLite)
# Beginner-Friendly Code with Clean Variable Names & Comments
# ==========================================================

from flask import Flask, render_template, request, redirect, url_for, session, flash, jsonify
import sqlite3
import os
from datetime import datetime

app = Flask(__name__)
app.secret_key = "studymate_super_secret_key"
DATABASE = "database.db"

# ----------------------------------------------------------
# Database Helper Function
# Connects to SQLite and returns rows accessible like dictionaries
# ----------------------------------------------------------
def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row  # Enables access by column name (e.g., row['name'])
    return conn

# ----------------------------------------------------------
# 1. Login & Registration Routes
# ----------------------------------------------------------
@app.route("/", methods=["GET", "POST"])
@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        email = request.form.get("email", "").strip()
        password = request.form.get("password", "").strip()

        if not email or not password:
            flash("Please enter both email and password.", "error")
            return render_template("login.html")

        conn = get_db_connection()
        user = conn.execute("SELECT * FROM users WHERE email = ? AND password = ?", (email, password)).fetchone()
        conn.close()

        if user:
            session["user_id"] = user["id"]
            session["user_name"] = user["name"]
            flash(f"Welcome back, {user['name']}!", "success")
            return redirect(url_for("dashboard"))
        else:
            flash("Invalid email or password.", "error")

    return render_template("login.html")

@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        name = request.form.get("name", "").strip()
        email = request.form.get("email", "").strip()
        password = request.form.get("password", "").strip()
        confirm_password = request.form.get("confirm_password", "").strip()

        if not name or not email or not password or not confirm_password:
            flash("Please fill in all required fields.", "error")
            return render_template("register.html")

        if password != confirm_password:
            flash("Passwords do not match.", "error")
            return render_template("register.html")

        conn = get_db_connection()
        existing_user = conn.execute("SELECT id FROM users WHERE email = ?", (email,)).fetchone()
        if existing_user:
            conn.close()
            flash("An account with this email already exists.", "error")
            return render_template("register.html")

        conn.execute(
            "INSERT INTO users (name, email, password, college, course, year) VALUES (?, ?, ?, ?, ?, ?)",
            (name, email, password, "Springfield Institute of Technology", "B.Sc. Computer Science", "2nd Year")
        )
        conn.commit()
        user = conn.execute("SELECT * FROM users WHERE email = ?", (email,)).fetchone()
        conn.close()

        session["user_id"] = user["id"]
        session["user_name"] = user["name"]
        return redirect(url_for("dashboard"))

    return render_template("register.html")

@app.route("/logout")
def logout():
    session.clear()
    flash("You have been logged out.", "info")
    return redirect(url_for("login"))

# ----------------------------------------------------------
# 2. Main Dashboard
# Computes summary stats: subjects, topics, study time, progress
# ----------------------------------------------------------
@app.route("/dashboard")
def dashboard():
    if "user_id" not in session:
        return redirect(url_for("login"))

    user_id = session["user_id"]
    conn = get_db_connection()

    # Card 1: Total Subjects
    subjects = conn.execute("SELECT * FROM subjects WHERE user_id = ?", (user_id,)).fetchall()
    total_subjects = len(subjects)

    # Card 2: Topics Completed / Total
    total_topics_row = conn.execute(
        "SELECT COUNT(*) as count FROM topics WHERE subject_id IN (SELECT id FROM subjects WHERE user_id = ?)",
        (user_id,)
    ).fetchone()
    total_topics = total_topics_row["count"] if total_topics_row else 0

    completed_topics_row = conn.execute(
        "SELECT COUNT(*) as count FROM topics WHERE completed = 1 AND subject_id IN (SELECT id FROM subjects WHERE user_id = ?)",
        (user_id,)
    ).fetchone()
    completed_topics = completed_topics_row["count"] if completed_topics_row else 0

    # Card 4: Overall Progress %
    overall_progress = round((completed_topics / total_topics * 100)) if total_topics > 0 else 0

    # Card 3: Today's Study Sessions & Duration
    today_str = datetime.now().strftime("%Y-%m-%d")
    today_sessions = conn.execute(
        """
        SELECT s.*, sub.name as subject_name, sub.color as subject_color
        FROM study_sessions s
        JOIN subjects sub ON s.subject_id = sub.id
        WHERE s.user_id = ? AND s.date = ?
        ORDER BY s.start_time ASC
        """,
        (user_id, today_str)
    ).fetchall()

    conn.close()
    return render_template(
        "dashboard.html",
        total_subjects=total_subjects,
        completed_topics=completed_topics,
        total_topics=total_topics,
        overall_progress=overall_progress,
        today_study_time="2h 30m",
        today_sessions=today_sessions
    )

# ----------------------------------------------------------
# 3. Subjects Management (Add, Edit, Delete)
# ----------------------------------------------------------
@app.route("/subjects")
def subjects():
    if "user_id" not in session:
        return redirect(url_for("login"))

    conn = get_db_connection()
    subjects = conn.execute("SELECT * FROM subjects WHERE user_id = ?", (session["user_id"],)).fetchall()
    conn.close()
    return render_template("subjects.html", subjects=subjects)

@app.route("/subjects/add", methods=["POST"])
def add_subject():
    if "user_id" not in session:
        return redirect(url_for("login"))

    name = request.form.get("name", "").strip()
    teacher = request.form.get("teacher", "").strip()
    description = request.form.get("description", "").strip()
    total_topics = int(request.form.get("total_topics", 5))

    if not name:
        flash("Please enter a subject name.", "error")
        return redirect(url_for("subjects"))

    conn = get_db_connection()
    conn.execute(
        "INSERT INTO subjects (user_id, name, teacher, description, total_topics, color) VALUES (?, ?, ?, ?, ?, ?)",
        (session["user_id"], name, teacher, description, total_topics, "#3B82F6")
    )
    conn.commit()
    conn.close()
    flash(f"Subject '{name}' added successfully!", "success")
    return redirect(url_for("subjects"))

# ----------------------------------------------------------
# 4. Topics / Progress Toggle
# ----------------------------------------------------------
@app.route("/topics")
def topics():
    if "user_id" not in session:
        return redirect(url_for("login"))

    conn = get_db_connection()
    subjects = conn.execute("SELECT * FROM subjects WHERE user_id = ?", (session["user_id"],)).fetchall()
    all_topics = conn.execute(
        "SELECT * FROM topics WHERE subject_id IN (SELECT id FROM subjects WHERE user_id = ?)",
        (session["user_id"],)
    ).fetchall()
    conn.close()
    return render_template("topics.html", subjects=subjects, topics=all_topics)

@app.route("/topics/toggle/<int:topic_id>", methods=["POST"])
def toggle_topic(topic_id):
    conn = get_db_connection()
    topic = conn.execute("SELECT completed FROM topics WHERE id = ?", (topic_id,)).fetchone()
    if topic:
        new_status = 0 if topic["completed"] == 1 else 1
        conn.execute("UPDATE topics SET completed = ? WHERE id = ?", (new_status, topic_id))
        conn.commit()
    conn.close()
    return redirect(url_for("topics"))

# ----------------------------------------------------------
# Application Runner
# ----------------------------------------------------------
if __name__ == "__main__":
    print("StudyMate is running at http://127.0.0.1:5000")
    app.run(debug=True, port=5000)
`,
    'schema.sql': `-- ==========================================================
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
`,
    'init_db.py': `# ==========================================================
# Database Initialization Script
# Creates database.db and seeds sample college data
# ==========================================================

import sqlite3
from datetime import datetime, timedelta

def init_db():
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()

    # Read and execute schema
    with open("schema.sql", "r") as f:
        cursor.executescript(f.read())

    # Insert default user if none exists
    cursor.execute("SELECT id FROM users WHERE email = 'student@studymate.edu'")
    if not cursor.fetchone():
        cursor.execute("""
            INSERT INTO users (name, email, password, college, course, year)
            VALUES ('Alex Johnson', 'student@studymate.edu', 'password123',
                    'Springfield Institute of Technology', 'B.Sc. Computer Science', '2nd Year')
        """)
        user_id = cursor.lastrowid

        # Insert Sample Subjects
        subjects = [
            ("Python", "Mr. Kumar", "Programming syntax, data structures, and OOP", 9, "#3B82F6"),
            ("Mathematics", "Dr. Sarah Vance", "Linear algebra and matrix calculus", 8, "#10B981"),
            ("Physics", "Prof. David Miller", "Quantum mechanics and wave fundamentals", 5, "#8B5CF6"),
            ("Data Structures", "Dr. Anita Roy", "Trees, graphs, and search algorithms", 7, "#F59E0B"),
            ("Database Management", "Prof. Alan Watts", "Relational SQL and normalization", 6, "#EC4899"),
            ("English", "Ms. Elena Gilbert", "Technical writing and presentation", 5, "#06B6D4"),
        ]

        for name, teacher, desc, total_topics, color in subjects:
            cursor.execute("""
                INSERT INTO subjects (user_id, name, teacher, description, total_topics, color)
                VALUES (?, ?, ?, ?, ?, ?)
            """, (user_id, name, teacher, desc, total_topics, color))

        conn.commit()
        print("Database initialized and sample data seeded successfully in database.db!")

    conn.close()

if __name__ == "__main__":
    init_db()
`,
    'README.md': `# StudyMate – Student Study Planner (Flask + SQLite)

A clean, modern, beginner-friendly web application designed to help college students organize subjects, track topic progress, schedule study sessions, and manage academic deadlines.

---

## 🚀 How to Run Locally

### 1. Prerequisites
Make sure Python 3.8+ is installed on your computer.

\`\`\`bash
python --version
\`\`\`

### 2. Install Flask
Open your terminal and install Flask:

\`\`\`bash
pip install Flask
\`\`\`

### 3. Initialize the SQLite Database
Run the initialization script to generate \`database.db\` and pre-populate it with sample college courses (Python, Mathematics, Physics, etc.):

\`\`\`bash
python init_db.py
\`\`\`

### 4. Start the Application
\`\`\`bash
python app.py
\`\`\`

Open your browser and visit:
👉 **http://127.0.0.1:5000**

---

## 🔑 Demo Login Credentials
- **Email:** student@studymate.edu
- **Password:** password123

---

## 🗄️ Database Architecture (SQLite)
The application uses 5 relational tables:
1. **users**: Student profile info (name, email, password, college, course, year).
2. **subjects**: Courses taken by students with teacher name, color, and syllabus total.
3. **topics**: Individual syllabus topics linked to each subject with completion status.
4. **study_sessions**: Timetable slots with date, start/end time, topic, and pending/completed status.
5. **tasks**: College assignments with subject foreign key, due date, and Low/Medium/High priority.
`,
    'dashboard.html': `<!-- templates/dashboard.html -->
{% extends "base.html" %}
{% block title %}Dashboard – StudyMate{% endblock %}

{% block content %}
<div class="greeting-section">
  <h1>Good Morning, {{ session['user_name'] }}! 👋</h1>
  <p>Here is your daily study overview. Keep up the consistent momentum today!</p>
</div>

<!-- 4 Summary Cards -->
<div class="metrics-grid">
  <div class="metric-card">
    <span class="label">Total Subjects</span>
    <div class="number">{{ total_subjects }}</div>
    <span class="subtext">enrolled courses</span>
  </div>
  <div class="metric-card">
    <span class="label">Topics Completed</span>
    <div class="number">{{ completed_topics }} / {{ total_topics }}</div>
    <span class="subtext">syllabus progress</span>
  </div>
  <div class="metric-card">
    <span class="label">Today's Study Time</span>
    <div class="number">{{ today_study_time }}</div>
    <span class="subtext">logged today</span>
  </div>
  <div class="metric-card">
    <span class="label">Overall Progress</span>
    <div class="number">{{ overall_progress }}%</div>
    <div class="progress-bar">
      <div class="fill" style="width: {{ overall_progress }}%;"></div>
    </div>
  </div>
</div>

<!-- Today's Schedule -->
<div class="section-card">
  <h2>Today's Schedule</h2>
  <table class="schedule-table">
    <thead>
      <tr>
        <th>Time</th>
        <th>Subject</th>
        <th>Topic</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      {% for session in today_sessions %}
      <tr>
        <td>{{ session['start_time'] }}</td>
        <td>{{ session['subject_name'] }}</td>
        <td>{{ session['topic'] }}</td>
        <td>
          <span class="status-pill {{ session['status'] | lower }}">
            {{ session['status'] }}
          </span>
        </td>
      </tr>
      {% endfor %}
    </tbody>
  </table>
</div>
{% endblock %}
`,
  };

  return (
    <div id="flask-code-viewer" className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Code2 className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            <span>Python & SQLite Project Architecture</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Explore the clean, beginner-friendly Python Flask and SQLite backend code designed for this project.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => copyToClipboard(files[selectedFile], selectedFile)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            {copiedFile === selectedFile ? (
              <>
                <Check className="w-4 h-4" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Current File</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Highlights Banner */}
      <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              SQLite & Flask Code Ready for Local Execution
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              All files are also saved in the project's <code className="font-mono bg-blue-100 dark:bg-blue-900/50 px-1 py-0.5 rounded">studymate/</code> directory.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-blue-700 dark:text-blue-300 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-blue-200 dark:border-blue-800">
          <Terminal className="w-3.5 h-3.5" />
          <span>python app.py</span>
        </div>
      </div>

      {/* File Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {(['app.py', 'schema.sql', 'init_db.py', 'README.md', 'dashboard.html'] as const).map(fileName => (
          <button
            key={fileName}
            onClick={() => setSelectedFile(fileName)}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-medium transition-all whitespace-nowrap flex items-center gap-2 ${
              selectedFile === fileName
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {fileName.endsWith('.py') ? (
              <Code2 className="w-3.5 h-3.5 text-blue-500" />
            ) : fileName.endsWith('.sql') ? (
              <Database className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <FileText className="w-3.5 h-3.5 text-amber-500" />
            )}
            <span>{fileName}</span>
          </button>
        ))}
      </div>

      {/* Code Viewer Container */}
      <div className="bg-slate-950 text-slate-200 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500/80" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
            <span className="ml-2 font-semibold text-slate-300">{selectedFile}</span>
          </div>
          <span>UTF-8 • Python / SQL / Jinja2</span>
        </div>

        <pre className="p-5 text-xs font-mono leading-relaxed overflow-x-auto max-h-[550px] scrollbar-thin scrollbar-thumb-slate-700">
          <code>{files[selectedFile]}</code>
        </pre>
      </div>
    </div>
  );
};
