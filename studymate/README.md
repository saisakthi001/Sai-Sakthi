# StudyMate – Student Study Planner

A complete, modern, responsive study planner web application built for college students. Helps students organize subjects, track syllabus topics, schedule study blocks, and manage academic deadlines.

---

## 🛠️ Technology Stack
- **Frontend:** HTML5, CSS3, JavaScript (Responsive layout with mobile support)
- **Backend:** Python 3 (Flask web framework)
- **Database:** SQLite3 (`database.db`)

---

## 📁 Project Structure
\`\`\`
studymate/
├── app.py              # Main Flask application with routes and business logic
├── database.db         # SQLite database file storing users, subjects, topics, etc.
├── schema.sql          # Database table creation queries
├── init_db.py          # Database initialization and sample data seeder
├── templates/          # HTML templates rendered by Flask (Jinja2)
│   ├── base.html       # Base layout with sidebar navigation
│   ├── login.html      # Sign in page
│   ├── register.html   # Account registration page
│   ├── dashboard.html  # Main overview with summary cards and schedule
│   ├── subjects.html   # Subject management (Add, Edit, Delete)
│   ├── schedule.html   # Timetable and study slot scheduler
│   ├── topics.html     # Syllabus checklist with progress tracking
│   ├── tasks.html      # Task management with priorities
│   └── profile.html    # Student settings and profile
├── static/
│   ├── css/
│   │   └── style.css   # Clean modern styling with blue & neutral palette
│   └── js/
│       └── script.js   # Client-side helpers (modals, auto-close alerts)
└── README.md           # Setup and learning guide
\`\`\`

---

## 🚀 How to Run the Flask Application

### Step 1: Install Python
Ensure Python 3.8 or higher is installed on your computer. Check by typing:
\`\`\`bash
python --version
# or on macOS / Linux:
python3 --version
\`\`\`

### Step 2: Install Flask
Install the lightweight Flask library:
\`\`\`bash
pip install Flask
\`\`\`

### Step 3: Initialize the SQLite Database
Run the initialization script. This creates \`database.db\` and pre-populates it with real sample college data (Python, Mathematics, Physics, study sessions, and tasks):
\`\`\`bash
python init_db.py
\`\`\`

### Step 4: Run the Application
Start the Flask development server:
\`\`\`bash
python app.py
\`\`\`

### Step 5: Open in Your Browser
Visit:
👉 **[http://127.0.0.1:5000](http://127.0.0.1:5000)**

---

## 🔑 Demo Account Credentials
- **Email:** \`student@studymate.edu\`
- **Password:** \`password123\`

Or click **Create Account** on the login page to register your own profile.

---

## 💡 How the Database Works (Beginner Explanation)

1. **`users` Table:**
   Stores student accounts. When you sign in, Flask queries:
   \`SELECT * FROM users WHERE email = ? AND password = ?\`
   If found, the student's ID is stored in \`session['user_id']\`.

2. **`subjects` Table:**
   Each subject belongs to a student via \`user_id\` foreign key. Stores name, teacher, description, and color.

3. **`topics` Table:**
   Contains syllabus topics under each subject (\`subject_id\`). When the checkbox is clicked, an update query runs:
   \`UPDATE topics SET completed = 1 WHERE id = ?\`
   The application recalculates completed topics / total topics to derive the progress percentage!

4. **`study_sessions` Table:**
   Timetable entries with date, start time, end time, and 'Pending'/'Completed' status.

5. **`tasks` Table:**
   Assignments and study deadlines with priority levels ('High', 'Medium', 'Low').
