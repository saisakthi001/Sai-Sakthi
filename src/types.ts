export interface User {
  id: string;
  name: string;
  email: string;
  college: string;
  course: string;
  year: string;
}

export interface Subject {
  id: string;
  name: string;
  teacher: string;
  description: string;
  color?: string;
  totalTopics: number;
}

export interface Topic {
  id: string;
  subjectId: string;
  name: string;
  completed: boolean;
  completedAt?: string;
}

export type SessionStatus = 'Pending' | 'Completed';

export interface StudySession {
  id: string;
  subjectId: string;
  topic: string;
  date: string; // YYYY-MM-DD
  startTime: string; // e.g. "08:00 AM" or "08:00"
  endTime: string;   // e.g. "09:30 AM" or "09:30"
  notes: string;
  status: SessionStatus;
  durationMinutes?: number;
}

export type TaskPriority = 'Low' | 'Medium' | 'High';
export type TaskStatus = 'Pending' | 'Completed';

export interface Task {
  id: string;
  name: string;
  subjectId: string;
  dueDate: string; // YYYY-MM-DD
  priority: TaskPriority;
  status: TaskStatus;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timeAgo: string;
  type: 'session' | 'task' | 'achievement' | 'general';
  read: boolean;
}

export interface DayStudyStats {
  day: string;
  shortDay: string;
  hours: number;
}

export type ActivePage =
  | 'login'
  | 'dashboard'
  | 'subjects'
  | 'schedule'
  | 'topics'
  | 'tasks'
  | 'profile'
  | 'flask_code';
