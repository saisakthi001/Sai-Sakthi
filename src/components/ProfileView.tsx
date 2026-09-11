import React, { useState } from 'react';
import {
  User,
  Save,
  Moon,
  Sun,
  LogOut,
  RotateCcw,
  CheckCircle2,
  Building2,
  GraduationCap,
  Mail,
  Calendar,
  ShieldCheck,
  Award,
} from 'lucide-react';
import { useStudy } from '../context/StudyContext';

export const ProfileView: React.FC = () => {
  const {
    currentUser,
    updateProfile,
    darkMode,
    toggleDarkMode,
    logout,
    resetToSampleData,
    totalSubjects,
    completedTopicsCount,
    overallProgressPercent,
  } = useStudy();

  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [college, setCollege] = useState(currentUser?.college || '');
  const [course, setCourse] = useState(currentUser?.course || '');
  const [year, setYear] = useState(currentUser?.year || '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: name.trim(),
      email: email.trim(),
      college: college.trim(),
      course: course.trim(),
      year: year.trim(),
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div id="profile-view" className="space-y-6 max-w-4xl animate-in fade-in duration-200">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
          <User className="w-7 h-7 text-blue-600 dark:text-blue-400" />
          <span>Profile & Settings</span>
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage your student identity, college information, and study environment preferences.
        </p>
      </div>

      {saveSuccess && (
        <div
          id="profile-save-success-alert"
          className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300 text-sm flex items-center gap-2.5 animate-in fade-in"
        >
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>Profile changes saved successfully!</span>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Student ID Card */}
        <div className="space-y-4">
          <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-2xl flex items-center justify-center shadow-md shadow-blue-500/20 mb-4">
              {name ? name.slice(0, 2).toUpperCase() : 'ST'}
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{name || 'Student'}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{email}</p>

            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 text-left text-xs">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="truncate">{college || 'College'}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <GraduationCap className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="truncate">{course || 'Degree Course'}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{year || 'Year'}</span>
              </div>
            </div>
          </div>

          {/* Quick Stats Badges */}
          <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Academic Milestones
            </h4>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400">Total Subjects</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{totalSubjects}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400">Topics Mastered</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {completedTopicsCount} topics
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400">Average Progress</span>
              <span className="font-bold text-blue-600 dark:text-blue-400">
                {overallProgressPercent}%
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Edit Profile Form and Preferences */}
        <div className="md:col-span-2 space-y-6">
          <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-white pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
              Student Information
            </h3>

            <form onSubmit={handleSave} className="space-y-4 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Student Name
                  </label>
                  <input
                    id="profile-name-input"
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900 dark:text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Email Address
                  </label>
                  <input
                    id="profile-email-input"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900 dark:text-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  College / University Name
                </label>
                <input
                  id="profile-college-input"
                  type="text"
                  value={college}
                  onChange={e => setCollege(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900 dark:text-white text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Course / Major
                  </label>
                  <input
                    id="profile-course-input"
                    type="text"
                    value={course}
                    onChange={e => setCourse(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900 dark:text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Academic Year / Semester
                  </label>
                  <input
                    id="profile-year-input"
                    type="text"
                    value={year}
                    onChange={e => setYear(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900 dark:text-white text-sm"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  id="profile-save-button"
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-sm shadow-blue-600/20 transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>

          {/* Preferences & System Actions */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
              Preferences & Account Actions
            </h3>

            {/* Dark Mode Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200">
                  {darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                    {darkMode ? 'Dark Mode Active' : 'Light Mode Active'}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Switch between dark and light appearance.
                  </p>
                </div>
              </div>

              <button
                id="profile-dark-mode-switch"
                onClick={toggleDarkMode}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors shadow-2xs"
              >
                Toggle {darkMode ? 'Light' : 'Dark'} Mode
              </button>
            </div>

            {/* Reset to Sample Data */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center">
                  <RotateCcw className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                    Reset Sample Demo Data
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Restore original sample courses (Python, Math, Physics) and timetable.
                  </p>
                </div>
              </div>

              <button
                id="profile-reset-data-button"
                onClick={() => {
                  if (confirm('Reset database to original sample college data?')) {
                    resetToSampleData();
                    alert('Sample data restored!');
                  }
                }}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-slate-700 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/50 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors shadow-2xs"
              >
                Reset Data
              </button>
            </div>

            {/* Logout */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-red-50/50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/40">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 flex items-center justify-center">
                  <LogOut className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                    Log Out of StudyMate
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    End current student session on this browser.
                  </p>
                </div>
              </div>

              <button
                id="profile-logout-button"
                onClick={() => {
                  if (confirm('Are you sure you want to log out?')) {
                    logout();
                  }
                }}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-red-600 hover:bg-red-700 text-white transition-colors shadow-2xs"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
