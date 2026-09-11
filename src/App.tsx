import React from 'react';
import { StudyProvider, useStudy } from './context/StudyContext';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { SubjectsView } from './components/SubjectsView';
import { ScheduleView } from './components/ScheduleView';
import { TopicsView } from './components/TopicsView';
import { TasksView } from './components/TasksView';
import { ProfileView } from './components/ProfileView';
import { LoginView } from './components/LoginView';
import { FlaskCodeViewer } from './components/FlaskCodeViewer';
import { Sun, Moon, Sparkles, Bell } from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentUser, activePage, darkMode, toggleDarkMode, overallProgressPercent } = useStudy();

  // If user is not authenticated or explicitly navigated to login
  if (!currentUser || activePage === 'login') {
    return <LoginView />;
  }

  const renderActivePage = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardView />;
      case 'subjects':
        return <SubjectsView />;
      case 'schedule':
        return <ScheduleView />;
      case 'topics':
        return <TopicsView />;
      case 'tasks':
        return <TasksView />;
      case 'profile':
        return <ProfileView />;
      case 'flask_code':
        return <FlaskCodeViewer />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased transition-colors">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        {/* Top App Bar */}
        <header className="sticky top-0 z-20 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-block text-xs font-semibold text-slate-500 dark:text-slate-400">
              {currentUser.college} • {currentUser.course}
            </span>
          </div>

          {/* Quick Actions in Header */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick study progress indicator */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 rounded-xl text-xs font-semibold text-blue-700 dark:text-blue-300">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Overall Progress: {overallProgressPercent}%</span>
            </div>

            {/* Dark Mode Toggle Button */}
            <button
              id="top-dark-mode-btn"
              onClick={toggleDarkMode}
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* User chip */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                {currentUser.name ? currentUser.name.slice(0, 2).toUpperCase() : 'ST'}
              </div>
              <span className="hidden md:inline-block text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-[120px]">
                {currentUser.name}
              </span>
            </div>
          </div>
        </header>

        {/* Page View Body */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {renderActivePage()}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <StudyProvider>
      <AppContent />
    </StudyProvider>
  );
}
