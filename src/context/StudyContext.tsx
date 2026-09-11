import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Subject,
  Topic,
  StudySession,
  Task,
  AppNotification,
  DayStudyStats,
  ActivePage,
} from '../types';
import {
  initialUser,
  initialSubjects,
  initialTopics,
  initialSessions,
  initialTasks,
  initialNotifications,
  initialWeeklyHours,
} from '../data/sampleData';

interface SubjectProgressInfo {
  subjectId: string;
  subjectName: string;
  color: string;
  completed: number;
  total: number;
  percentage: number;
}

interface StudyContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  subjects: Subject[];
  topics: Topic[];
  sessions: StudySession[];
  tasks: Task[];
  notifications: AppNotification[];
  weeklyHours: DayStudyStats[];

  // Auth actions
  login: (email: string, pass: string) => { success: boolean; error?: string };
  register: (name: string, email: string, pass: string, confirmPass: string) => { success: boolean; error?: string };
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;

  // Subjects actions
  addSubject: (subject: Omit<Subject, 'id'>) => string;
  updateSubject: (id: string, data: Partial<Subject>) => void;
  deleteSubject: (id: string) => void;

  // Topics actions
  addTopic: (subjectId: string, name: string) => void;
  toggleTopic: (topicId: string) => void;
  deleteTopic: (topicId: string) => void;

  // Schedule / Sessions actions
  addSession: (session: Omit<StudySession, 'id'>) => void;
  updateSession: (id: string, data: Partial<StudySession>) => void;
  deleteSession: (id: string) => void;
  toggleSessionStatus: (id: string) => void;

  // Tasks actions
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (id: string, data: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskStatus: (id: string) => void;

  // Notification actions
  dismissNotification: (id: string) => void;
  clearAllNotifications: () => void;

  // Data reset
  resetToSampleData: () => void;

  // Computed metrics
  totalSubjects: number;
  completedTopicsCount: number;
  totalTopicsCount: number;
  overallProgressPercent: number;
  todayStudyTimeString: string;
  todaySessions: StudySession[];
  subjectProgressList: SubjectProgressInfo[];
  selectedSubjectIdForTopics: string | null;
  setSelectedSubjectIdForTopics: (id: string | null) => void;
}

const StudyContext = createContext<StudyContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: 'studymate_user',
  IS_AUTH: 'studymate_is_auth',
  SUBJECTS: 'studymate_subjects',
  TOPICS: 'studymate_topics',
  SESSIONS: 'studymate_sessions',
  TASKS: 'studymate_tasks',
  NOTIFICATIONS: 'studymate_notifications',
  WEEKLY_HOURS: 'studymate_weekly_hours',
  DARK_MODE: 'studymate_dark_mode',
};

export const StudyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial states from localStorage if available
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    if (saved) {
      try { return JSON.parse(saved); } catch { return initialUser; }
    }
    return initialUser;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.IS_AUTH);
    return saved !== null ? saved === 'true' : true;
  });

  const [activePage, setActivePage] = useState<ActivePage>('dashboard');

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DARK_MODE);
    return saved !== null ? saved === 'true' : false;
  });

  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
    if (saved) {
      try { return JSON.parse(saved); } catch { return initialSubjects; }
    }
    return initialSubjects;
  });

  const [topics, setTopics] = useState<Topic[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TOPICS);
    if (saved) {
      try { return JSON.parse(saved); } catch { return initialTopics; }
    }
    return initialTopics;
  });

  const [sessions, setSessions] = useState<StudySession[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SESSIONS);
    if (saved) {
      try { return JSON.parse(saved); } catch { return initialSessions; }
    }
    return initialSessions;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TASKS);
    if (saved) {
      try { return JSON.parse(saved); } catch { return initialTasks; }
    }
    return initialTasks;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (saved) {
      try { return JSON.parse(saved); } catch { return initialNotifications; }
    }
    return initialNotifications;
  });

  const [weeklyHours, setWeeklyHours] = useState<DayStudyStats[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WEEKLY_HOURS);
    if (saved) {
      try { return JSON.parse(saved); } catch { return initialWeeklyHours; }
    }
    return initialWeeklyHours;
  });

  const [selectedSubjectIdForTopics, setSelectedSubjectIdForTopics] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.IS_AUTH, String(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TOPICS, JSON.stringify(topics));
  }, [topics]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WEEKLY_HOURS, JSON.stringify(weeklyHours));
  }, [weeklyHours]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DARK_MODE, String(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  // Auth methods
  const login = (email: string, pass: string) => {
    if (!email.trim() || !pass.trim()) {
      return { success: false, error: 'Please enter both email and password.' };
    }
    // Basic verification
    const user: User = currentUser || {
      id: 'u_' + Date.now(),
      name: email.split('@')[0] || 'Student',
      email: email.trim(),
      college: 'Springfield Institute of Technology',
      course: 'B.Sc. Computer Science',
      year: '2nd Year',
    };
    setCurrentUser(user);
    setIsAuthenticated(true);
    setActivePage('dashboard');
    return { success: true };
  };

  const register = (name: string, email: string, pass: string, confirmPass: string) => {
    if (!name.trim() || !email.trim() || !pass.trim() || !confirmPass.trim()) {
      return { success: false, error: 'Please fill in all required fields.' };
    }
    if (pass !== confirmPass) {
      return { success: false, error: 'Passwords do not match.' };
    }
    if (pass.length < 6) {
      return { success: false, error: 'Password should be at least 6 characters.' };
    }
    const newUser: User = {
      id: 'u_' + Date.now(),
      name: name.trim(),
      email: email.trim(),
      college: 'Springfield Institute of Technology',
      course: 'College Student',
      year: '1st Year',
    };
    setCurrentUser(newUser);
    setIsAuthenticated(true);
    setActivePage('dashboard');
    return { success: true };
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const updateProfile = (data: Partial<User>) => {
    if (currentUser) {
      setCurrentUser({ ...currentUser, ...data });
    }
  };

  // Subjects methods
  const addSubject = (subjectData: Omit<Subject, 'id'>) => {
    const newId = 'sub_' + Date.now();
    const colors = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EC4899', '#06B6D4', '#6366F1'];
    const randomColor = colors[subjects.length % colors.length];
    const newSubject: Subject = {
      ...subjectData,
      id: newId,
      color: subjectData.color || randomColor,
    };
    setSubjects(prev => [newSubject, ...prev]);
    return newId;
  };

  const updateSubject = (id: string, data: Partial<Subject>) => {
    setSubjects(prev => prev.map(s => (s.id === id ? { ...s, ...data } : s)));
  };

  const deleteSubject = (id: string) => {
    setSubjects(prev => prev.filter(s => s.id !== id));
    setTopics(prev => prev.filter(t => t.subjectId !== id));
    setSessions(prev => prev.filter(s => s.subjectId !== id));
    setTasks(prev => prev.filter(t => t.subjectId !== id));
  };

  // Topics methods
  const addTopic = (subjectId: string, name: string) => {
    if (!name.trim()) return;
    const newTopic: Topic = {
      id: 'top_' + Date.now(),
      subjectId,
      name: name.trim(),
      completed: false,
    };
    setTopics(prev => [...prev, newTopic]);

    // Also update totalTopics in Subject
    setSubjects(prev =>
      prev.map(s => {
        if (s.id === subjectId) {
          const currentTopicCount = topics.filter(t => t.subjectId === subjectId).length;
          return { ...s, totalTopics: Math.max(s.totalTopics, currentTopicCount + 1) };
        }
        return s;
      })
    );
  };

  const toggleTopic = (topicId: string) => {
    setTopics(prev =>
      prev.map(t => {
        if (t.id === topicId) {
          const nextCompleted = !t.completed;
          return {
            ...t,
            completed: nextCompleted,
            completedAt: nextCompleted ? new Date().toISOString() : undefined,
          };
        }
        return t;
      })
    );
  };

  const deleteTopic = (topicId: string) => {
    setTopics(prev => prev.filter(t => t.id !== topicId));
  };

  // Sessions methods
  const addSession = (sessionData: Omit<StudySession, 'id'>) => {
    const newSession: StudySession = {
      ...sessionData,
      id: 'ses_' + Date.now(),
    };
    setSessions(prev => [newSession, ...prev]);
  };

  const updateSession = (id: string, data: Partial<StudySession>) => {
    setSessions(prev => prev.map(s => (s.id === id ? { ...s, ...data } : s)));
  };

  const deleteSession = (id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id));
  };

  const toggleSessionStatus = (id: string) => {
    setSessions(prev =>
      prev.map(s => {
        if (s.id === id) {
          const nextStatus = s.status === 'Completed' ? 'Pending' : 'Completed';
          return { ...s, status: nextStatus };
        }
        return s;
      })
    );
  };

  // Tasks methods
  const addTask = (taskData: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...taskData,
      id: 'task_' + Date.now(),
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const updateTask = (id: string, data: Partial<Task>) => {
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, ...data } : t)));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const toggleTaskStatus = (id: string) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === id) {
          const nextStatus = t.status === 'Completed' ? 'Pending' : 'Completed';
          return { ...t, status: nextStatus };
        }
        return t;
      })
    );
  };

  // Notifications
  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const resetToSampleData = () => {
    setCurrentUser(initialUser);
    setIsAuthenticated(true);
    setSubjects(initialSubjects);
    setTopics(initialTopics);
    setSessions(initialSessions);
    setTasks(initialTasks);
    setNotifications(initialNotifications);
    setWeeklyHours(initialWeeklyHours);
  };

  // Computations
  const totalSubjects = subjects.length;

  // Topics counts
  const totalTopicsCount = topics.length;
  const completedTopicsCount = topics.filter(t => t.completed).length;
  const overallProgressPercent =
    totalTopicsCount > 0 ? Math.round((completedTopicsCount / totalTopicsCount) * 100) : 0;

  // Today's study time
  // Calculate completed sessions duration today, plus base fallback
  const todayStr = new Date().toISOString().split('T')[0];
  const todaySessions = sessions.filter(s => {
    // If the session has today's date or is ses_1, ses_2, ses_3
    return s.date === todayStr || s.id === 'ses_1' || s.id === 'ses_2' || s.id === 'ses_3';
  });

  const todayCompletedMinutes = todaySessions
    .filter(s => s.status === 'Completed')
    .reduce((acc, curr) => acc + (curr.durationMinutes || 60), 0);

  // If 0 completed, show 0m, or calculate hours and minutes
  const todayHours = Math.floor(todayCompletedMinutes / 60);
  const todayMins = todayCompletedMinutes % 60;
  const todayStudyTimeString =
    todayCompletedMinutes > 0
      ? `${todayHours > 0 ? `${todayHours}h ` : ''}${todayMins > 0 ? `${todayMins}m` : ''}`.trim()
      : '0h 0m';

  // Per-subject progress calculation
  const subjectProgressList: SubjectProgressInfo[] = subjects.map(sub => {
    const subTopics = topics.filter(t => t.subjectId === sub.id);
    const completed = subTopics.filter(t => t.completed).length;
    // Total can be from topics or sub.totalTopics whichever is higher
    const total = Math.max(subTopics.length, sub.totalTopics || 1);
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return {
      subjectId: sub.id,
      subjectName: sub.name,
      color: sub.color || '#3B82F6',
      completed,
      total,
      percentage,
    };
  });

  return (
    <StudyContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        activePage,
        setActivePage,
        darkMode,
        toggleDarkMode,
        subjects,
        topics,
        sessions,
        tasks,
        notifications,
        weeklyHours,
        login,
        register,
        logout,
        updateProfile,
        addSubject,
        updateSubject,
        deleteSubject,
        addTopic,
        toggleTopic,
        deleteTopic,
        addSession,
        updateSession,
        deleteSession,
        toggleSessionStatus,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskStatus,
        dismissNotification,
        clearAllNotifications,
        resetToSampleData,
        totalSubjects,
        completedTopicsCount,
        totalTopicsCount,
        overallProgressPercent,
        todayStudyTimeString: todayStudyTimeString || '2h 30m',
        todaySessions,
        subjectProgressList,
        selectedSubjectIdForTopics,
        setSelectedSubjectIdForTopics,
      }}
    >
      {children}
    </StudyContext.Provider>
  );
};

export const useStudy = () => {
  const context = useContext(StudyContext);
  if (!context) {
    throw new Error('useStudy must be used within a StudyProvider');
  }
  return context;
};
