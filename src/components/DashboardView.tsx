import React from 'react';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  TrendingUp,
  Calendar,
  Bell,
  ArrowRight,
  Plus,
  AlertCircle,
  Sparkles,
  Check,
  ChevronRight,
} from 'lucide-react';
import { useStudy } from '../context/StudyContext';

export const DashboardView: React.FC = () => {
  const {
    currentUser,
    totalSubjects,
    completedTopicsCount,
    totalTopicsCount,
    overallProgressPercent,
    todayStudyTimeString,
    todaySessions,
    toggleSessionStatus,
    weeklyHours,
    subjectProgressList,
    notifications,
    dismissNotification,
    setActivePage,
    setSelectedSubjectIdForTopics,
    subjects,
  } = useStudy();

  // Dynamic greeting based on current local time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const studentName = currentUser?.name ? currentUser.name.split(' ')[0] : 'Student';

  // Find max weekly hours for bar chart scaling
  const maxWeeklyHour = Math.max(...weeklyHours.map(d => d.hours), 5);

  return (
    <div id="dashboard-view" className="space-y-6 animate-in fade-in duration-200">
      {/* Header Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            {getGreeting()}, {studentName}! 👋
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Here is your daily study overview. Keep up the consistent momentum today!
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="dashboard-schedule-btn"
            onClick={() => setActivePage('schedule')}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/50 border border-blue-200 dark:border-blue-800/60 rounded-xl transition-all shadow-2xs"
          >
            <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Plan Session</span>
          </button>
          <button
            id="dashboard-add-subject-btn"
            onClick={() => setActivePage('subjects')}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-sm shadow-blue-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add Subject</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Subjects */}
        <div
          id="summary-card-subjects"
          onClick={() => setActivePage('subjects')}
          className="group p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs hover:border-blue-400/50 dark:hover:border-blue-500/50 transition-all cursor-pointer relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Subjects
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              {totalSubjects}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              enrolled courses
            </span>
          </div>
          <div className="mt-2.5 flex items-center text-xs text-blue-600 dark:text-blue-400 font-medium group-hover:underline">
            <span>Manage subjects</span>
            <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </div>
        </div>

        {/* Card 2: Topics Completed */}
        <div
          id="summary-card-topics"
          onClick={() => setActivePage('topics')}
          className="group p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs hover:border-emerald-400/50 dark:hover:border-emerald-500/50 transition-all cursor-pointer relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Topics Completed
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              {completedTopicsCount}
            </span>
            <span className="text-sm font-semibold text-slate-400 dark:text-slate-500">
              / {totalTopicsCount}
            </span>
          </div>
          <div className="mt-2.5 flex items-center text-xs text-emerald-600 dark:text-emerald-400 font-medium group-hover:underline">
            <span>Review syllabus progress</span>
            <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </div>
        </div>

        {/* Card 3: Today's Study Time */}
        <div
          id="summary-card-study-time"
          onClick={() => setActivePage('schedule')}
          className="group p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs hover:border-amber-400/50 dark:hover:border-amber-500/50 transition-all cursor-pointer relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Today's Study Time
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              {todayStudyTimeString}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              logged today
            </span>
          </div>
          <div className="mt-2.5 flex items-center text-xs text-amber-600 dark:text-amber-400 font-medium group-hover:underline">
            <span>View today's timetable</span>
            <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </div>
        </div>

        {/* Card 4: Overall Progress */}
        <div
          id="summary-card-progress"
          onClick={() => setActivePage('topics')}
          className="group p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs hover:border-indigo-400/50 dark:hover:border-indigo-500/50 transition-all cursor-pointer relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Overall Progress
            </span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              {overallProgressPercent}%
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              curriculum total
            </span>
          </div>
          {/* Visual Mini Progress Bar */}
          <div className="mt-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${overallProgressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Grid: Today's Schedule & Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule (2 cols on large screen) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-5 sm:p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span>Today's Schedule</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Scheduled study sessions for your current classes
                </p>
              </div>

              <button
                id="today-schedule-view-all"
                onClick={() => setActivePage('schedule')}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center gap-1 hover:underline"
              >
                <span>Full Schedule</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {todaySessions.length === 0 ? (
              <div className="py-10 text-center">
                <Calendar className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  No study sessions scheduled.
                </p>
                <button
                  onClick={() => setActivePage('schedule')}
                  className="mt-3 px-3.5 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  + Schedule a Session
                </button>
              </div>
            ) : (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      <th className="pb-3 px-3 font-semibold">Time</th>
                      <th className="pb-3 px-3 font-semibold">Subject</th>
                      <th className="pb-3 px-3 font-semibold">Topic</th>
                      <th className="pb-3 px-3 font-semibold text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm">
                    {todaySessions.map(session => {
                      const subject = subjects.find(s => s.id === session.subjectId);
                      const isCompleted = session.status === 'Completed';

                      return (
                        <tr
                          key={session.id}
                          className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                        >
                          <td className="py-3.5 px-3 font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">
                            <span className="inline-flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              {session.startTime}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 font-semibold text-slate-900 dark:text-white">
                            <div className="flex items-center gap-2">
                              <span
                                className="w-2.5 h-2.5 rounded-full shrink-0"
                                style={{ backgroundColor: subject?.color || '#3B82F6' }}
                              />
                              <span>{subject?.name || 'General'}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-3 text-slate-600 dark:text-slate-300">
                            {session.topic}
                          </td>
                          <td className="py-3.5 px-3 text-right whitespace-nowrap">
                            <button
                              id={`toggle-session-${session.id}`}
                              onClick={() => toggleSessionStatus(session.id)}
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                                isCompleted
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 hover:bg-emerald-200'
                                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 hover:bg-amber-200'
                              }`}
                            >
                              {isCompleted ? (
                                <>
                                  <Check className="w-3 h-3" />
                                  <span>Completed</span>
                                </>
                              ) : (
                                <>
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                                  <span>Pending</span>
                                </>
                              )}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Weekly Study Hours Bar Chart */}
          <div className="p-5 sm:p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  Weekly Study Hours
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Daily distribution of focused hours spent studying
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  Total: {weeklyHours.reduce((acc, h) => acc + h.hours, 0)} hrs
                </span>
              </div>
            </div>

            {/* Custom Responsive Clean Bar Chart */}
            <div className="mt-6 pt-4">
              <div className="h-44 flex items-end justify-between gap-2 sm:gap-4 px-2">
                {weeklyHours.map(day => {
                  const barHeightPercent = Math.round((day.hours / maxWeeklyHour) * 100);
                  const isToday =
                    day.day.toLowerCase() ===
                    new Date()
                      .toLocaleDateString('en-US', { weekday: 'long' })
                      .toLowerCase();

                  return (
                    <div
                      key={day.day}
                      className="flex-1 flex flex-col items-center gap-2 group relative h-full justify-end"
                    >
                      {/* Tooltip on hover */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 px-2 py-1 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[11px] font-semibold rounded pointer-events-none whitespace-nowrap shadow-md z-10">
                        {day.day}: {day.hours} {day.hours === 1 ? 'hour' : 'hours'}
                      </div>

                      {/* Bar Value above bar */}
                      <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                        {day.hours}h
                      </span>

                      {/* Bar */}
                      <div className="w-full max-w-[38px] bg-slate-100 dark:bg-slate-800 rounded-t-lg overflow-hidden flex flex-col justify-end h-32">
                        <div
                          className={`w-full rounded-t-lg transition-all duration-500 ${
                            isToday
                              ? 'bg-blue-600 dark:bg-blue-500 shadow-sm shadow-blue-500/30'
                              : 'bg-blue-400/80 dark:bg-blue-600/70 group-hover:bg-blue-500'
                          }`}
                          style={{ height: `${Math.max(barHeightPercent, 10)}%` }}
                        />
                      </div>

                      {/* Day Label */}
                      <span
                        className={`text-xs font-semibold ${
                          isToday
                            ? 'text-blue-600 dark:text-blue-400 font-bold'
                            : 'text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        {day.shortDay}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Subject Progress & Notifications */}
        <div className="space-y-6">
          {/* Notifications Box */}
          <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-500" />
                <span>Notifications</span>
              </h2>
              <span className="text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full">
                {notifications.length} New
              </span>
            </div>

            <div className="mt-3 space-y-2.5">
              {notifications.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">No new notifications</p>
              ) : (
                notifications.map(notif => (
                  <div
                    key={notif.id}
                    className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800/80 flex items-start justify-between gap-3 text-xs group"
                  >
                    <div className="space-y-0.5 flex-1">
                      <p className="text-slate-800 dark:text-slate-200 font-medium leading-snug">
                        {notif.message}
                      </p>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {notif.timeAgo}
                      </span>
                    </div>
                    <button
                      onClick={() => dismissNotification(notif.id)}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs px-1 opacity-60 group-hover:opacity-100"
                      title="Dismiss"
                    >
                      ×
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Subject Progress Chart */}
          <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Subject Progress</span>
              </h2>
              <button
                onClick={() => setActivePage('topics')}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                All Topics
              </button>
            </div>

            <div className="mt-4 space-y-3.5">
              {subjectProgressList.map(item => (
                <div
                  key={item.subjectId}
                  onClick={() => {
                    setSelectedSubjectIdForTopics(item.subjectId);
                    setActivePage('topics');
                  }}
                  className="group cursor-pointer p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div className="flex items-center justify-between text-xs font-medium mb-1.5">
                    <span className="text-slate-800 dark:text-slate-200 font-semibold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {item.subjectName}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400 font-bold">
                      {item.percentage}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${item.percentage}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500">
                    <span>
                      {item.completed} / {item.total} topics
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
