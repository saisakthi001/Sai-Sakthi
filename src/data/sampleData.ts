import { User, Subject, Topic, StudySession, Task, AppNotification, DayStudyStats } from '../types';

export const initialUser: User = {
  id: 'u_101',
  name: 'Alex Johnson',
  email: 'student@studymate.edu',
  college: 'Springfield Institute of Technology',
  course: 'B.Sc. Computer Science',
  year: '2nd Year (Semester 3)',
};

export const initialSubjects: Subject[] = [
  {
    id: 'sub_1',
    name: 'Python',
    teacher: 'Mr. Kumar',
    description: 'Foundations of programming, syntax, data structures, algorithms, and object-oriented design.',
    color: '#3B82F6', // Blue
    totalTopics: 9,
  },
  {
    id: 'sub_2',
    name: 'Mathematics',
    teacher: 'Dr. Sarah Vance',
    description: 'Linear algebra, matrix operations, vectors, eigenvalues, and multivariable calculus.',
    color: '#10B981', // Green
    totalTopics: 8,
  },
  {
    id: 'sub_3',
    name: 'Physics',
    teacher: 'Prof. David Miller',
    description: 'Classical mechanics, thermodynamics, wave optics, electromagnetism, and modern quantum physics.',
    color: '#8B5CF6', // Purple
    totalTopics: 5,
  },
  {
    id: 'sub_4',
    name: 'Data Structures',
    teacher: 'Dr. Anita Roy',
    description: 'Linear and non-linear data structures, trees, graph theory, hashing, and complexity analysis.',
    color: '#F59E0B', // Amber
    totalTopics: 7,
  },
  {
    id: 'sub_5',
    name: 'Database Management',
    teacher: 'Prof. Alan Watts',
    description: 'Relational database schema design, SQL, normalization forms, transaction control, and indexing.',
    color: '#EC4899', // Pink
    totalTopics: 6,
  },
  {
    id: 'sub_6',
    name: 'English',
    teacher: 'Ms. Elena Gilbert',
    description: 'Academic and technical writing, formal presentations, literature review, and communication skills.',
    color: '#06B6D4', // Cyan
    totalTopics: 5,
  },
];

export const initialTopics: Topic[] = [
  // Python topics (7 out of 9 completed ~ 78%)
  { id: 'top_1', subjectId: 'sub_1', name: 'Variables', completed: true },
  { id: 'top_2', subjectId: 'sub_1', name: 'Data Types', completed: true },
  { id: 'top_3', subjectId: 'sub_1', name: 'Operators', completed: true },
  { id: 'top_4', subjectId: 'sub_1', name: 'Conditions', completed: true },
  { id: 'top_5', subjectId: 'sub_1', name: 'Loops', completed: true },
  { id: 'top_6', subjectId: 'sub_1', name: 'Functions', completed: true },
  { id: 'top_7', subjectId: 'sub_1', name: 'Lists', completed: true },
  { id: 'top_8', subjectId: 'sub_1', name: 'Dictionaries', completed: false },
  { id: 'top_9', subjectId: 'sub_1', name: 'OOP', completed: false },

  // Mathematics topics (4 out of 8 completed = 50%)
  { id: 'top_10', subjectId: 'sub_2', name: 'Matrices', completed: true },
  { id: 'top_11', subjectId: 'sub_2', name: 'Determinants', completed: true },
  { id: 'top_12', subjectId: 'sub_2', name: 'Vectors', completed: true },
  { id: 'top_13', subjectId: 'sub_2', name: 'Linear Systems', completed: true },
  { id: 'top_14', subjectId: 'sub_2', name: 'Eigenvalues', completed: false },
  { id: 'top_15', subjectId: 'sub_2', name: 'Calculus I', completed: false },
  { id: 'top_16', subjectId: 'sub_2', name: 'Differential Equations', completed: false },
  { id: 'top_17', subjectId: 'sub_2', name: 'Probability', completed: false },

  // Physics topics (4 out of 5 completed = 80%)
  { id: 'top_18', subjectId: 'sub_3', name: 'Quantum Physics', completed: true },
  { id: 'top_19', subjectId: 'sub_3', name: 'Mechanics', completed: true },
  { id: 'top_20', subjectId: 'sub_3', name: 'Thermodynamics', completed: true },
  { id: 'top_21', subjectId: 'sub_3', name: 'Electromagnetism', completed: true },
  { id: 'top_22', subjectId: 'sub_3', name: 'Optics', completed: false },

  // Data Structures topics (3 out of 7 completed = 43%)
  { id: 'top_23', subjectId: 'sub_4', name: 'Arrays', completed: true },
  { id: 'top_24', subjectId: 'sub_4', name: 'Linked Lists', completed: true },
  { id: 'top_25', subjectId: 'sub_4', name: 'Stacks & Queues', completed: true },
  { id: 'top_26', subjectId: 'sub_4', name: 'Trees', completed: false },
  { id: 'top_27', subjectId: 'sub_4', name: 'Graphs', completed: false },
  { id: 'top_28', subjectId: 'sub_4', name: 'Sorting Algorithms', completed: false },
  { id: 'top_29', subjectId: 'sub_4', name: 'Hash Tables', completed: false },

  // Database Management topics (4 out of 6 completed = 67%)
  { id: 'top_30', subjectId: 'sub_5', name: 'ER Diagrams', completed: true },
  { id: 'top_31', subjectId: 'sub_5', name: 'Relational Model', completed: true },
  { id: 'top_32', subjectId: 'sub_5', name: 'SQL Basics', completed: true },
  { id: 'top_33', subjectId: 'sub_5', name: 'Normalization', completed: true },
  { id: 'top_34', subjectId: 'sub_5', name: 'Transactions', completed: false },
  { id: 'top_35', subjectId: 'sub_5', name: 'Indexing', completed: false },

  // English topics (3 out of 5 completed = 60%)
  { id: 'top_36', subjectId: 'sub_6', name: 'Technical Writing', completed: true },
  { id: 'top_37', subjectId: 'sub_6', name: 'Oral Presentation', completed: true },
  { id: 'top_38', subjectId: 'sub_6', name: 'Literature Review', completed: true },
  { id: 'top_39', subjectId: 'sub_6', name: 'Research Methodology', completed: false },
  { id: 'top_40', subjectId: 'sub_6', name: 'Vocabulary', completed: false },
];

const getTodayString = () => {
  const d = new Date();
  return d.toISOString().split('T')[0];
};

const getTomorrowString = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
};

const getDayOffsetString = (offset: number) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().split('T')[0];
};

export const initialSessions: StudySession[] = [
  // Today's schedule exactly matching prompt:
  {
    id: 'ses_1',
    subjectId: 'sub_1',
    topic: 'Loops',
    date: getTodayString(),
    startTime: '08:00 AM',
    endTime: '09:30 AM',
    notes: 'Review for and while loops with range() exercises and break/continue statements.',
    status: 'Completed',
    durationMinutes: 90,
  },
  {
    id: 'ses_2',
    subjectId: 'sub_2',
    topic: 'Matrices',
    date: getTodayString(),
    startTime: '10:00 AM',
    endTime: '11:00 AM',
    notes: 'Solve textbook practice questions for 3x3 matrix multiplication and rank calculations.',
    status: 'Pending',
    durationMinutes: 60,
  },
  {
    id: 'ses_3',
    subjectId: 'sub_3',
    topic: 'Quantum Physics',
    date: getTodayString(),
    startTime: '06:00 PM',
    endTime: '07:30 PM',
    notes: 'Watch lecture on photoelectric effect and review Schrödinger wave equation basics.',
    status: 'Pending',
    durationMinutes: 90,
  },
  // Additional sessions for full calendar schedule:
  {
    id: 'ses_4',
    subjectId: 'sub_1',
    topic: 'Functions & Recursion',
    date: getTomorrowString(),
    startTime: '08:00 AM',
    endTime: '09:00 AM',
    notes: 'Practice lambda functions, default arguments, and recursion call stack.',
    status: 'Pending',
    durationMinutes: 60,
  },
  {
    id: 'ses_5',
    subjectId: 'sub_4',
    topic: 'Trees & BST',
    date: getTomorrowString(),
    startTime: '02:00 PM',
    endTime: '03:30 PM',
    notes: 'Binary search tree in-order, pre-order, and post-order traversal algorithms.',
    status: 'Pending',
    durationMinutes: 90,
  },
  {
    id: 'ses_6',
    subjectId: 'sub_5',
    topic: 'SQL Joins & Group By',
    date: getDayOffsetString(2),
    startTime: '11:00 AM',
    endTime: '12:30 PM',
    notes: 'Inner, left, right outer joins and aggregate grouping practice.',
    status: 'Pending',
    durationMinutes: 90,
  },
];

export const initialTasks: Task[] = [
  {
    id: 'task_1',
    name: 'Complete Python assignment',
    subjectId: 'sub_1',
    dueDate: getTomorrowString(),
    priority: 'High',
    status: 'Pending',
  },
  {
    id: 'task_2',
    name: 'Study Mathematics',
    subjectId: 'sub_2',
    dueDate: getDayOffsetString(2),
    priority: 'Medium',
    status: 'Pending',
  },
  {
    id: 'task_3',
    name: 'Submit project',
    subjectId: 'sub_5',
    dueDate: getDayOffsetString(5),
    priority: 'High',
    status: 'Pending',
  },
  {
    id: 'task_4',
    name: 'Prepare for exam',
    subjectId: 'sub_3',
    dueDate: getDayOffsetString(7),
    priority: 'High',
    status: 'Pending',
  },
  {
    id: 'task_5',
    name: 'Revise English presentation slides',
    subjectId: 'sub_6',
    dueDate: getTodayString(),
    priority: 'Low',
    status: 'Completed',
  },
];

export const initialWeeklyHours: DayStudyStats[] = [
  { day: 'Monday', shortDay: 'Mon', hours: 2 },
  { day: 'Tuesday', shortDay: 'Tue', hours: 3 },
  { day: 'Wednesday', shortDay: 'Wed', hours: 1 },
  { day: 'Thursday', shortDay: 'Thu', hours: 4 },
  { day: 'Friday', shortDay: 'Fri', hours: 2 },
  { day: 'Saturday', shortDay: 'Sat', hours: 3 },
  { day: 'Sunday', shortDay: 'Sun', hours: 2 },
];

export const initialNotifications: AppNotification[] = [
  {
    id: 'notif_1',
    title: 'Upcoming Study Session',
    message: 'Mathematics study session starts in 30 minutes.',
    timeAgo: '25m ago',
    type: 'session',
    read: false,
  },
  {
    id: 'notif_2',
    title: 'Assignment Due Tomorrow',
    message: 'Python assignment is due tomorrow.',
    timeAgo: '2h ago',
    type: 'task',
    read: false,
  },
  {
    id: 'notif_3',
    title: 'Milestone Unlocked! 🎉',
    message: 'You completed 5 topics this week.',
    timeAgo: '1d ago',
    type: 'achievement',
    read: false,
  },
];
