# ==========================================================
# StudyMate – Student Study Planner
# Backend: Python (Flask)
# Database: SQLite3
# Beginner-Friendly Code with Clean Variable Names & Comments
# ==========================================================

from flask import Flask, render_template, request, redirect, url_for, session, flash, jsonify
import sqlite3
import os
from datetime import datetime

# Initialize the Flask application
app = Flask(__name__)

# Secret key required for handling secure user sessions
app.secret_key = "studymate_secret_key_student_planner"

# Path to the SQLite database
DATABASE = os.path.join(os.path.dirname(__file__), "database.db")


# ----------------------------------------------------------
# Database Helper Function
# Connects to SQLite and returns rows accessible like Python dictionaries
# ----------------------------------------------------------
def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row  # Enables access by column name (e.g., row['name'])
    return conn


# ----------------------------------------------------------
# 1. Authentication Routes: Login, Register, Logout
# ----------------------------------------------------------
@app.route("/", methods=["GET", "POST"])
@app.route("/login", methods=["GET", "POST"])
def login():
    """Handles student sign-in with email and password."""
    if request.method == "POST":
        email = request.form.get("email", "").strip()
        password = request.form.get("password", "").strip()

        # Validation: Check if fields are empty
        if not email or not password:
            flash("Please enter both email and password.", "error")
            return render_template("login.html")

        conn = get_db_connection()
        user = conn.execute(
            "SELECT * FROM users WHERE email = ? AND password = ?",
            (email, password)
        ).fetchone()
        conn.close()

        if user:
            # Store student info in session
            session["user_id"] = user["id"]
            session["user_name"] = user["name"]
            session["user_email"] = user["email"]
            flash(f"Welcome back, {user['name']}! 👋", "success")
            return redirect(url_for("dashboard"))
        else:
            flash("Invalid email or password.", "error")

    return render_template("login.html")


@app.route("/register", methods=["GET", "POST"])
def register():
    """Handles student account creation."""
    if request.method == "POST":
        name = request.form.get("name", "").strip()
        email = request.form.get("email", "").strip()
        password = request.form.get("password", "").strip()
        confirm_password = request.form.get("confirm_password", "").strip()

        # Basic Validation
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

        # Insert new student record
        conn.execute(
            """
            INSERT INTO users (name, email, password, college, course, year)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (name, email, password, "Springfield Institute of Technology", "College Student", "1st Year")
        )
        conn.commit()

        user = conn.execute("SELECT * FROM users WHERE email = ?", (email,)).fetchone()
        conn.close()

        session["user_id"] = user["id"]
        session["user_name"] = user["name"]
        session["user_email"] = user["email"]
        return redirect(url_for("dashboard"))

    return render_template("register.html")


@app.route("/logout")
def logout():
    """Ends the current user session."""
    session.clear()
    flash("You have been successfully logged out.", "info")
    return redirect(url_for("login"))


# ----------------------------------------------------------
# 2. Dashboard Route
# Computes summary statistics: subjects, topics, study time, progress
# ----------------------------------------------------------
@app.route("/dashboard")
def dashboard():
    """Main student dashboard displaying progress metrics and today's schedule."""
    if "user_id" not in session:
        return redirect(url_for("login"))

    user_id = session["user_id"]
    conn = get_db_connection()

    # Card 1: Total Subjects
    subjects = conn.execute("SELECT * FROM subjects WHERE user_id = ?", (user_id,)).fetchall()
    total_subjects = len(subjects)

    # Card 2: Topics Completed / Total
    total_topics_row = conn.execute(
        """
        SELECT COUNT(*) as count FROM topics 
        WHERE subject_id IN (SELECT id FROM subjects WHERE user_id = ?)
        """,
        (user_id,)
    ).fetchone()
    total_topics = total_topics_row["count"] if total_topics_row else 0

    completed_topics_row = conn.execute(
        """
        SELECT COUNT(*) as count FROM topics 
        WHERE completed = 1 AND subject_id IN (SELECT id FROM subjects WHERE user_id = ?)
        """,
        (user_id,)
    ).fetchone()
    completed_topics = completed_topics_row["count"] if completed_topics_row else 0

    # Card 4: Overall Progress Percentage
    overall_progress = round((completed_topics / total_topics * 100)) if total_topics > 0 else 0

    # Card 3: Today's Study Sessions
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

    # Subject progress for progress chart
    subject_progress_list = []
    for sub in subjects:
        sub_id = sub["id"]
        sub_completed = conn.execute(
            "SELECT COUNT(*) as count FROM topics WHERE subject_id = ? AND completed = 1", (sub_id,)
        ).fetchone()["count"]
        sub_total = conn.execute(
            "SELECT COUNT(*) as count FROM topics WHERE subject_id = ?", (sub_id,)
        ).fetchone()["count"]
        calc_total = max(sub_total, sub["total_topics"] or 1)
        sub_percentage = round((sub_completed / calc_total) * 100) if calc_total > 0 else 0
        subject_progress_list.append({
            "name": sub["name"],
            "percentage": sub_percentage,
            "completed": sub_completed,
            "total": calc_total,
            "color": sub["color"]
        })

    conn.close()

    return render_template(
        "dashboard.html",
        total_subjects=total_subjects,
        completed_topics=completed_topics,
        total_topics=total_topics,
        overall_progress=overall_progress,
        today_study_time="2h 30m",
        today_sessions=today_sessions,
        subject_progress=subject_progress_list
    )


# ----------------------------------------------------------
# 3. Subjects Management Routes
# ----------------------------------------------------------
@app.route("/subjects")
def subjects():
    """Displays all enrolled subjects with teacher name, progress %, and topic count."""
    if "user_id" not in session:
        return redirect(url_for("login"))

    user_id = session["user_id"]
    conn = get_db_connection()
    raw_subjects = conn.execute("SELECT * FROM subjects WHERE user_id = ?", (user_id,)).fetchall()

    subjects_with_stats = []
    for sub in raw_subjects:
        sub_id = sub["id"]
        completed_cnt = conn.execute(
            "SELECT COUNT(*) as count FROM topics WHERE subject_id = ? AND completed = 1", (sub_id,)
        ).fetchone()["count"]
        total_cnt = conn.execute(
            "SELECT COUNT(*) as count FROM topics WHERE subject_id = ?", (sub_id,)
        ).fetchone()["count"]
        calc_total = max(total_cnt, sub["total_topics"] or 1)
        pct = round((completed_cnt / calc_total) * 100) if calc_total > 0 else 0
        subjects_with_stats.append({
            "id": sub["id"],
            "name": sub["name"],
            "teacher": sub["teacher"],
            "description": sub["description"],
            "completed_topics": completed_cnt,
            "total_topics": calc_total,
            "progress_percent": pct,
            "color": sub["color"]
        })

    conn.close()
    return render_template("subjects.html", subjects=subjects_with_stats)


@app.route("/subjects/add", methods=["POST"])
def add_subject():
    """Adds a new subject to the database."""
    if "user_id" not in session:
        return redirect(url_for("login"))

    name = request.form.get("name", "").strip()
    teacher = request.form.get("teacher", "").strip()
    description = request.form.get("description", "").strip()
    total_topics = int(request.form.get("total_topics", 5) or 5)

    if not name:
        flash("Please enter a subject name.", "error")
        return redirect(url_for("subjects"))

    if not teacher:
        flash("Please fill in all required fields.", "error")
        return redirect(url_for("subjects"))

    conn = get_db_connection()
    conn.execute(
        """
        INSERT INTO subjects (user_id, name, teacher, description, total_topics, color)
        VALUES (?, ?, ?, ?, ?, ?)
        """,
        (session["user_id"], name, teacher, description, total_topics, "#3B82F6")
    )
    conn.commit()
    conn.close()
    flash(f"Subject '{name}' added successfully!", "success")
    return redirect(url_for("subjects"))


@app.route("/subjects/delete/<int:subject_id>", methods=["POST"])
def delete_subject(subject_id):
    """Deletes a subject and cascades deletion to topics, sessions, and tasks."""
    if "user_id" not in session:
        return redirect(url_for("login"))

    conn = get_db_connection()
    conn.execute("DELETE FROM subjects WHERE id = ? AND user_id = ?", (subject_id, session["user_id"]))
    conn.execute("DELETE FROM topics WHERE subject_id = ?", (subject_id,))
    conn.execute("DELETE FROM study_sessions WHERE subject_id = ?", (subject_id,))
    conn.execute("DELETE FROM tasks WHERE subject_id = ?", (subject_id,))
    conn.commit()
    conn.close()

    flash("Subject deleted successfully.", "info")
    return redirect(url_for("subjects"))


# ----------------------------------------------------------
# 4. Study Schedule Routes
# ----------------------------------------------------------
@app.route("/schedule", methods=["GET", "POST"])
def schedule():
    """Allows scheduling study slots and viewing calendar/list timetable."""
    if "user_id" not in session:
        return redirect(url_for("login"))

    user_id = session["user_id"]
    conn = get_db_connection()

    if request.method == "POST":
        subject_id = request.form.get("subject_id")
        topic = request.form.get("topic", "").strip()
        date = request.form.get("date", "").strip()
        start_time = request.form.get("start_time", "").strip()
        end_time = request.form.get("end_time", "").strip()
        notes = request.form.get("notes", "").strip()

        if not subject_id or not topic or not date or not start_time or not end_time:
            flash("Please fill in all required fields.", "error")
        else:
            conn.execute(
                """
                INSERT INTO study_sessions (user_id, subject_id, topic, date, start_time, end_time, notes, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, 'Pending')
                """,
                (user_id, subject_id, topic, date, start_time, end_time, notes)
            )
            conn.commit()
            flash("Study session scheduled successfully!", "success")

    sessions_list = conn.execute(
        """
        SELECT s.*, sub.name as subject_name, sub.color as subject_color
        FROM study_sessions s
        JOIN subjects sub ON s.subject_id = sub.id
        WHERE s.user_id = ?
        ORDER BY s.date ASC, s.start_time ASC
        """,
        (user_id,)
    ).fetchall()

    subjects_list = conn.execute("SELECT * FROM subjects WHERE user_id = ?", (user_id,)).fetchall()
    conn.close()

    return render_template("schedule.html", sessions=sessions_list, subjects=subjects_list)


@app.route("/schedule/toggle/<int:session_id>", methods=["POST"])
def toggle_session(session_id):
    """Toggles session status between Pending and Completed."""
    conn = get_db_connection()
    session_row = conn.execute("SELECT status FROM study_sessions WHERE id = ?", (session_id,)).fetchone()
    if session_row:
        new_status = "Completed" if session_row["status"] == "Pending" else "Pending"
        conn.execute("UPDATE study_sessions SET status = ? WHERE id = ?", (new_status, session_id))
        conn.commit()
    conn.close()
    return redirect(url_for("schedule"))


@app.route("/schedule/delete/<int:session_id>", methods=["POST"])
def delete_session(session_id):
    """Deletes a study session."""
    conn = get_db_connection()
    conn.execute("DELETE FROM study_sessions WHERE id = ?", (session_id,))
    conn.commit()
    conn.close()
    flash("Session removed from schedule.", "info")
    return redirect(url_for("schedule"))


# ----------------------------------------------------------
# 5. Topics / Progress Routes
# ----------------------------------------------------------
@app.route("/topics")
def topics():
    """Lists each subject with its syllabus topics and completion checkboxes."""
    if "user_id" not in session:
        return redirect(url_for("login"))

    user_id = session["user_id"]
    conn = get_db_connection()

    subjects_data = conn.execute("SELECT * FROM subjects WHERE user_id = ?", (user_id,)).fetchall()
    topics_by_subject = {}

    for sub in subjects_data:
        sub_id = sub["id"]
        sub_topics = conn.execute("SELECT * FROM topics WHERE subject_id = ?", (sub_id,)).fetchall()
        completed = sum(1 for t in sub_topics if t["completed"] == 1)
        total = max(len(sub_topics), sub["total_topics"] or 1)
        pct = round((completed / total) * 100) if total > 0 else 0

        topics_by_subject[sub_id] = {
            "subject": sub,
            "topics": sub_topics,
            "completed": completed,
            "total": total,
            "percentage": pct
        }

    conn.close()
    return render_template("topics.html", topics_data=topics_by_subject)


@app.route("/topics/toggle/<int:topic_id>", methods=["POST"])
def toggle_topic(topic_id):
    """Toggles a topic's completed checkbox, automatically updating progress."""
    conn = get_db_connection()
    topic = conn.execute("SELECT completed FROM topics WHERE id = ?", (topic_id,)).fetchone()
    if topic:
        new_val = 0 if topic["completed"] == 1 else 1
        now_ts = datetime.now() if new_val == 1 else None
        conn.execute("UPDATE topics SET completed = ?, completed_at = ? WHERE id = ?", (new_val, now_ts, topic_id))
        conn.commit()
    conn.close()
    return redirect(url_for("topics"))


@app.route("/topics/add", methods=["POST"])
def add_topic():
    """Adds a new topic to a given subject."""
    subject_id = request.form.get("subject_id")
    name = request.form.get("name", "").strip()

    if not name:
        flash("Please enter a topic name.", "error")
        return redirect(url_for("topics"))

    conn = get_db_connection()
    conn.execute("INSERT INTO topics (subject_id, name, completed) VALUES (?, ?, 0)", (subject_id, name))
    conn.commit()
    conn.close()
    return redirect(url_for("topics"))


# ----------------------------------------------------------
# 6. Tasks Management Routes
# ----------------------------------------------------------
@app.route("/tasks", methods=["GET", "POST"])
def tasks():
    """Allows adding and completing academic tasks (assignments, exams, projects)."""
    if "user_id" not in session:
        return redirect(url_for("login"))

    user_id = session["user_id"]
    conn = get_db_connection()

    if request.method == "POST":
        name = request.form.get("name", "").strip()
        subject_id = request.form.get("subject_id")
        due_date = request.form.get("due_date", "").strip()
        priority = request.form.get("priority", "Medium")

        if not name or not subject_id or not due_date:
            flash("Please fill in all required fields.", "error")
        else:
            conn.execute(
                """
                INSERT INTO tasks (user_id, subject_id, name, due_date, priority, status)
                VALUES (?, ?, ?, ?, ?, 'Pending')
                """,
                (user_id, subject_id, name, due_date, priority)
            )
            conn.commit()
            flash("Task added successfully!", "success")

    tasks_list = conn.execute(
        """
        SELECT t.*, sub.name as subject_name, sub.color as subject_color
        FROM tasks t
        JOIN subjects sub ON t.subject_id = sub.id
        WHERE t.user_id = ?
        ORDER BY t.due_date ASC
        """,
        (user_id,)
    ).fetchall()

    subjects_list = conn.execute("SELECT * FROM subjects WHERE user_id = ?", (user_id,)).fetchall()
    conn.close()

    return render_template("tasks.html", tasks=tasks_list, subjects=subjects_list)


@app.route("/tasks/toggle/<int:task_id>", methods=["POST"])
def toggle_task(task_id):
    """Marks task as Completed or Pending."""
    conn = get_db_connection()
    task = conn.execute("SELECT status FROM tasks WHERE id = ?", (task_id,)).fetchone()
    if task:
        new_status = "Completed" if task["status"] == "Pending" else "Pending"
        conn.execute("UPDATE tasks SET status = ? WHERE id = ?", (new_status, task_id))
        conn.commit()
    conn.close()
    return redirect(url_for("tasks"))


@app.route("/tasks/delete/<int:task_id>", methods=["POST"])
def delete_task(task_id):
    """Deletes a task."""
    conn = get_db_connection()
    conn.execute("DELETE FROM tasks WHERE id = ?", (task_id,))
    conn.commit()
    conn.close()
    flash("Task removed.", "info")
    return redirect(url_for("tasks"))


# ----------------------------------------------------------
# 7. Profile / Settings Route
# ----------------------------------------------------------
@app.route("/profile", methods=["GET", "POST"])
def profile():
    """Allows students to view and edit their profile details."""
    if "user_id" not in session:
        return redirect(url_for("login"))

    user_id = session["user_id"]
    conn = get_db_connection()

    if request.method == "POST":
        name = request.form.get("name", "").strip()
        email = request.form.get("email", "").strip()
        college = request.form.get("college", "").strip()
        course = request.form.get("course", "").strip()
        year = request.form.get("year", "").strip()

        conn.execute(
            """
            UPDATE users SET name = ?, email = ?, college = ?, course = ?, year = ?
            WHERE id = ?
            """,
            (name, email, college, course, year, user_id)
        )
        conn.commit()
        session["user_name"] = name
        session["user_email"] = email
        flash("Profile updated successfully! ✅", "success")

    user = conn.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
    conn.close()

    return render_template("profile.html", user=user)


# ----------------------------------------------------------
# Start Server Locally
# ----------------------------------------------------------
if __name__ == "__main__":
    print("==========================================================")
    print("🎓 StudyMate – Student Study Planner is running!")
    print("🌐 Open in browser: http://127.0.0.1:5000")
    print("==========================================================")
    app.run(debug=True, port=5000)
