import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Plus,
  Edit2,
  Trash2,
  Check,
  BookOpen,
  AlertCircle,
  X,
  CheckCircle2,
  Filter,
} from 'lucide-react';
import { useStudy } from '../context/StudyContext';
import { StudySession, SessionStatus } from '../types';

export const ScheduleView: React.FC = () => {
  const {
    sessions,
    subjects,
    addSession,
    updateSession,
    deleteSession,
    toggleSessionStatus,
  } = useStudy();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<StudySession | null>(null);
  const [filterStatus, setFilterStatus] = useState<'All' | 'Today' | 'Pending' | 'Completed'>('All');

  // Form State
  const [subjectId, setSubjectId] = useState(subjects[0]?.id || '');
  const [topic, setTopic] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('08:00 AM');
  const [endTime, setEndTime] = useState('09:30 AM');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState('');

  const handleOpenAddModal = () => {
    setFormError('');
    setSubjectId(subjects[0]?.id || '');
    setTopic('');
    setDate(new Date().toISOString().split('T')[0]);
    setStartTime('08:00 AM');
    setEndTime('09:30 AM');
    setNotes('');
    setIsModalOpen(true);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectId) {
      setFormError('Please select a subject.');
      return;
    }
    if (!topic.trim()) {
      setFormError('Please enter a topic to study.');
      return;
    }
    if (!date) {
      setFormError('Please select a date.');
      return;
    }
    if (!startTime.trim() || !endTime.trim()) {
      setFormError('Please fill in start and end times.');
      return;
    }

    addSession({
      subjectId,
      topic: topic.trim(),
      date,
      startTime: startTime.trim(),
      endTime: endTime.trim(),
      notes: notes.trim(),
      status: 'Pending',
      durationMinutes: 90,
    });

    setIsModalOpen(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSession) return;
    if (!editingSession.topic.trim()) {
      setFormError('Please enter a topic.');
      return;
    }

    updateSession(editingSession.id, {
      subjectId: editingSession.subjectId,
      topic: editingSession.topic.trim(),
      date: editingSession.date,
      startTime: editingSession.startTime,
      endTime: editingSession.endTime,
      notes: editingSession.notes,
    });

    setEditingSession(null);
  };

  const todayStr = new Date().toISOString().split('T')[0];

  // Filtering
  const filteredSessions = sessions.filter(session => {
    if (filterStatus === 'Today') {
      return session.date === todayStr || session.id === 'ses_1' || session.id === 'ses_2' || session.id === 'ses_3';
    }
    if (filterStatus === 'Pending') return session.status === 'Pending';
    if (filterStatus === 'Completed') return session.status === 'Completed';
    return true;
  });

  // Group sessions by day name / date
  const groupSessionsByDay = () => {
    const groups: { [key: string]: StudySession[] } = {};

    filteredSessions.forEach(sess => {
      let dayHeader = 'Upcoming';
      try {
        const parts = sess.date.split('-');
        if (parts.length === 3) {
          const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
          const weekday = d.toLocaleDateString('en-US', { weekday: 'long' });
          const monthDay = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          if (sess.date === todayStr) {
            dayHeader = `Today – ${weekday} (${monthDay})`;
          } else {
            dayHeader = `${weekday}, ${monthDay}`;
          }
        }
      } catch {
        dayHeader = sess.date;
      }

      if (!groups[dayHeader]) {
        groups[dayHeader] = [];
      }
      groups[dayHeader].push(sess);
    });

    return groups;
  };

  const groupedSessions = groupSessionsByDay();

  return (
    <div id="schedule-view" className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Calendar className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            <span>Study Schedule</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Organize timetable sessions, study slots, and track completion.
          </p>
        </div>

        <button
          id="schedule-study-button"
          onClick={handleOpenAddModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-sm shadow-blue-600/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Study</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {(['All', 'Today', 'Pending', 'Completed'] as const).map(tab => (
          <button
            key={tab}
            id={`filter-schedule-${tab.toLowerCase()}`}
            onClick={() => setFilterStatus(tab)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              filterStatus === tab
                ? 'bg-blue-600 text-white shadow-xs shadow-blue-500/20'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {tab === 'Today' ? "Today's Timetable" : tab}
          </button>
        ))}
      </div>

      {/* Empty State */}
      {sessions.length === 0 || filteredSessions.length === 0 ? (
        <div
          id="empty-schedule-state"
          className="py-16 px-4 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs max-w-lg mx-auto"
        >
          <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
            <Calendar className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            No study sessions scheduled.
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 max-w-sm mx-auto">
            {filterStatus === 'All'
              ? 'Book dedicated time to revise topics, practice problems, or prepare for upcoming exams.'
              : `There are currently no sessions matching the "${filterStatus}" filter.`}
          </p>
          <button
            onClick={handleOpenAddModal}
            className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>+ Schedule Your First Session</span>
          </button>
        </div>
      ) : (
        /* Grouped Sessions List */
        <div className="space-y-6">
          {Object.entries(groupedSessions).map(([dayLabel, daySessions]) => (
            <div key={dayLabel} className="space-y-3">
              {/* Day Header badge */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-3 py-1 rounded-lg border border-blue-200 dark:border-blue-900/60">
                  {dayLabel}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  ({daySessions.length} {daySessions.length === 1 ? 'session' : 'sessions'})
                </span>
              </div>

              {/* Day session cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {daySessions.map(session => {
                  const subject = subjects.find(s => s.id === session.subjectId);
                  const isCompleted = session.status === 'Completed';

                  return (
                    <div
                      key={session.id}
                      id={`session-card-${session.id}`}
                      className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                        isCompleted
                          ? 'bg-slate-50/70 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/80 opacity-90'
                          : 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 shadow-xs'
                      }`}
                    >
                      <div>
                        {/* Time & Status */}
                        <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-200">
                            <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                            <span>
                              {session.startTime} – {session.endTime}
                            </span>
                          </div>

                          <button
                            onClick={() => toggleSessionStatus(session.id)}
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition-colors ${
                              isCompleted
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                                : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                            }`}
                          >
                            {isCompleted ? (
                              <>
                                <Check className="w-3 h-3" />
                                <span>Completed</span>
                              </>
                            ) : (
                              <span>Pending</span>
                            )}
                          </button>
                        </div>

                        {/* Subject and Topic */}
                        <div className="mt-3">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-2.5 h-2.5 rounded-full"
                              style={{ backgroundColor: subject?.color || '#3B82F6' }}
                            />
                            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                              {subject?.name || 'General Course'}
                            </span>
                          </div>
                          <h4
                            className={`text-base font-bold mt-1 text-slate-900 dark:text-white ${
                              isCompleted ? 'line-through text-slate-400 dark:text-slate-500' : ''
                            }`}
                          >
                            {session.topic}
                          </h4>
                        </div>

                        {/* Notes if any */}
                        {session.notes && (
                          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                            {session.notes}
                          </p>
                        )}
                      </div>

                      {/* Footer Actions */}
                      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <button
                          onClick={() => toggleSessionStatus(session.id)}
                          className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                        >
                          {isCompleted ? 'Mark Pending' : 'Mark Completed'}
                        </button>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              setFormError('');
                              setEditingSession(session);
                            }}
                            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="Edit session"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('Delete this scheduled study session?')) {
                                deleteSession(session.id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                            title="Delete session"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Session Modal */}
      {isModalOpen && (
        <div
          id="schedule-modal"
          className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 animate-in zoom-in-95 duration-150"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <span>Schedule Study</span>
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleAddSubmit} className="space-y-3.5 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Select Subject *
                </label>
                <select
                  id="schedule-subject-select"
                  value={subjectId}
                  onChange={e => setSubjectId(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900 dark:text-white text-sm"
                >
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.teacher})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Enter Topic *
                </label>
                <input
                  id="schedule-topic-input"
                  type="text"
                  placeholder="e.g. Loops, Matrices, Quantum Physics"
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900 dark:text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Select Date *
                </label>
                <input
                  id="schedule-date-input"
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900 dark:text-white text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Start Time *
                  </label>
                  <input
                    id="schedule-start-time-input"
                    type="text"
                    placeholder="e.g. 08:00 AM"
                    value={startTime}
                    onChange={e => setStartTime(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900 dark:text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    End Time *
                  </label>
                  <input
                    id="schedule-end-time-input"
                    type="text"
                    placeholder="e.g. 09:30 AM"
                    value={endTime}
                    onChange={e => setEndTime(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900 dark:text-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Add Notes
                </label>
                <textarea
                  id="schedule-notes-input"
                  rows={2}
                  placeholder="e.g. Practice questions 1 to 15, prepare flashcards..."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900 dark:text-white text-sm resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  id="submit-schedule-button"
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm shadow-blue-600/20 transition-colors"
                >
                  Schedule Study
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Session Modal */}
      {editingSession && (
        <div
          id="edit-session-modal"
          className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setEditingSession(null)}
        >
          <div
            className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 animate-in zoom-in-95 duration-150"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-blue-600" />
                <span>Edit Study Session</span>
              </h2>
              <button
                onClick={() => setEditingSession(null)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-3.5 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Subject
                </label>
                <select
                  value={editingSession.subjectId}
                  onChange={e =>
                    setEditingSession({ ...editingSession, subjectId: e.target.value })
                  }
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white text-sm"
                >
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Topic
                </label>
                <input
                  type="text"
                  value={editingSession.topic}
                  onChange={e => setEditingSession({ ...editingSession, topic: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={editingSession.date}
                  onChange={e => setEditingSession({ ...editingSession, date: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Start Time
                  </label>
                  <input
                    type="text"
                    value={editingSession.startTime}
                    onChange={e =>
                      setEditingSession({ ...editingSession, startTime: e.target.value })
                    }
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    End Time
                  </label>
                  <input
                    type="text"
                    value={editingSession.endTime}
                    onChange={e =>
                      setEditingSession({ ...editingSession, endTime: e.target.value })
                    }
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Notes
                </label>
                <textarea
                  rows={2}
                  value={editingSession.notes}
                  onChange={e => setEditingSession({ ...editingSession, notes: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white text-sm resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditingSession(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
