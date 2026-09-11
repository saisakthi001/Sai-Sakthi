# ==========================================================
# Database Initialization Script
# Creates database.db and seeds sample college data
# ==========================================================

import sqlite3
import os
from datetime import datetime, timedelta

def init_db():
    db_path = os.path.join(os.path.dirname(__file__), "database.db")
    schema_path = os.path.join(os.path.dirname(__file__), "schema.sql")

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Read and execute schema
    with open(schema_path, "r") as f:
        cursor.executescript(f.read())

    # Insert default student user if none exists
    cursor.execute("SELECT id FROM users WHERE email = 'student@studymate.edu'")
    user = cursor.fetchone()
    
    if not user:
        cursor.execute("""
            INSERT INTO users (name, email, password, college, course, year)
            VALUES ('Alex Johnson', 'student@studymate.edu', 'password123',
                    'Springfield Institute of Technology', 'B.Sc. Computer Science', '2nd Year')
        """)
        user_id = cursor.lastrowid

        # Insert Sample Subjects matching prompt requirements
        subjects_data = [
            ("Python", "Mr. Kumar", "Programming syntax, data structures, and OOP", 9, "#3B82F6"),
            ("Mathematics", "Dr. Sarah Vance", "Linear algebra and matrix calculus", 8, "#10B981"),
            ("Physics", "Prof. David Miller", "Quantum mechanics and wave fundamentals", 5, "#8B5CF6"),
            ("Data Structures", "Dr. Anita Roy", "Trees, graphs, and search algorithms", 7, "#F59E0B"),
            ("Database Management", "Prof. Alan Watts", "Relational SQL and normalization", 6, "#EC4899"),
            ("English", "Ms. Elena Gilbert", "Technical writing and presentation", 5, "#06B6D4"),
        ]

        subject_ids = {}
        for name, teacher, desc, total_topics, color in subjects_data:
            cursor.execute("""
                INSERT INTO subjects (user_id, name, teacher, description, total_topics, color)
                VALUES (?, ?, ?, ?, ?, ?)
            """, (user_id, name, teacher, desc, total_topics, color))
            subject_ids[name] = cursor.lastrowid

        # Sample Python topics
        python_topics = [
            ("Variables", 1), ("Data Types", 1), ("Operators", 1), ("Conditions", 1),
            ("Loops", 1), ("Functions", 1), ("Lists", 1), ("Dictionaries", 0), ("OOP", 0)
        ]
        for t_name, completed in python_topics:
            cursor.execute("INSERT INTO topics (subject_id, name, completed) VALUES (?, ?, ?)",
                           (subject_ids["Python"], t_name, completed))

        # Sample Mathematics topics
        math_topics = [
            ("Matrices", 1), ("Determinants", 1), ("Vectors", 1), ("Linear Systems", 1),
            ("Eigenvalues", 0), ("Calculus I", 0), ("Differential Equations", 0), ("Probability", 0)
        ]
        for t_name, completed in math_topics:
            cursor.execute("INSERT INTO topics (subject_id, name, completed) VALUES (?, ?, ?)",
                           (subject_ids["Mathematics"], t_name, completed))

        # Sample Physics topics
        physics_topics = [
            ("Quantum Physics", 1), ("Mechanics", 1), ("Thermodynamics", 1), ("Electromagnetism", 1), ("Optics", 0)
        ]
        for t_name, completed in physics_topics:
            cursor.execute("INSERT INTO topics (subject_id, name, completed) VALUES (?, ?, ?)",
                           (subject_ids["Physics"], t_name, completed))

        # Today's study sessions
        today = datetime.now().strftime("%Y-%m-%d")
        tomorrow = (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d")

        sessions_data = [
            (user_id, subject_ids["Python"], "Loops", today, "08:00 AM", "09:30 AM", "Review for and while loops with range()", "Completed", 90),
            (user_id, subject_ids["Mathematics"], "Matrices", today, "10:00 AM", "11:00 AM", "Solve practice questions 1-15", "Pending", 60),
            (user_id, subject_ids["Physics"], "Quantum Physics", today, "06:00 PM", "07:30 PM", "Photoelectric effect lecture notes", "Pending", 90),
            (user_id, subject_ids["Python"], "Functions & Recursion", tomorrow, "08:00 AM", "09:00 AM", "Practice recursive algorithms", "Pending", 60),
        ]
        for s in sessions_data:
            cursor.execute("""
                INSERT INTO study_sessions (user_id, subject_id, topic, date, start_time, end_time, notes, status, duration_minutes)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, s)

        # Tasks
        tasks_data = [
            (user_id, subject_ids["Python"], "Complete Python assignment", tomorrow, "High", "Pending"),
            (user_id, subject_ids["Mathematics"], "Study Mathematics", (datetime.now() + timedelta(days=2)).strftime("%Y-%m-%d"), "Medium", "Pending"),
            (user_id, subject_ids["Database Management"], "Submit project", (datetime.now() + timedelta(days=5)).strftime("%Y-%m-%d"), "High", "Pending"),
            (user_id, subject_ids["Physics"], "Prepare for exam", (datetime.now() + timedelta(days=7)).strftime("%Y-%m-%d"), "High", "Pending"),
        ]
        for t in tasks_data:
            cursor.execute("""
                INSERT INTO tasks (user_id, subject_id, name, due_date, priority, status)
                VALUES (?, ?, ?, ?, ?, ?)
            """, t)

        conn.commit()
        print("Database initialized successfully with sample college data in database.db!")

    conn.close()

if __name__ == "__main__":
    init_db()
