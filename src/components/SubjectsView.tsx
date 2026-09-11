import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  User,
  CheckCircle2,
  Clock,
  ArrowRight,
  AlertCircle,
  X,
  Layers,
  Search,
} from 'lucide-react';
import { useStudy } from '../context/StudyContext';
import { Subject } from '../types';

export const SubjectsView: React.FC = () => {
  const {
    subjects,
    subjectProgressList,
    addSubject,
    updateSubject,
    deleteSubject,
    topics,
    setActivePage,
    setSelectedSubjectIdForTopics,
  } = useStudy();

  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [viewingSubject, setViewingSubject] = useState<Subject | null>(null);

  // Add Subject Form State
  const [name, setName] = useState('');
  const [teacher, setTeacher] = useState('');
  const [description, setDescription] = useState('');
  const [totalTopics, setTotalTopics] = useState(5);
  const [formError, setFormError] = useState('');

  // Handle Add Subject submit
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError('Please enter a subject name.');
      return;
    }
    if (!teacher.trim()) {
      setFormError('Please fill in all required fields (Teacher Name).');
      return;
    }

    addSubject({
      name: name.trim(),
      teacher: teacher.trim(),
      description: description.trim() || 'No description provided.',
      totalTopics: Number(totalTopics) || 5,
    });

    // Reset and close
    setName('');
    setTeacher('');
    setDescription('');
    setTotalTopics(5);
    setFormError('');
    setIsAddModalOpen(false);
  };

  // Handle Edit Subject submit
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSubject) return;
    if (!editingSubject.name.trim()) {
      setFormError('Please enter a subject name.');
      return;
    }

    updateSubject(editingSubject.id, {
      name: editingSubject.name.trim(),
      teacher: editingSubject.teacher.trim(),
      description: editingSubject.description.trim(),
      totalTopics: Number(editingSubject.totalTopics) || 1,
    });

    setEditingSubject(null);
    setFormError('');
  };

  const filteredSubjects = subjects.filter(
    s =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.teacher.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div id="subjects-view" className="space-y-6 animate-in fade-in duration-200">
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <BookOpen className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            <span>My Subjects</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your academic courses, professors, and syllabus milestones.
          </p>
        </div>

        <button
          id="add-subject-button"
          onClick={() => {
            setFormError('');
            setIsAddModalOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-sm shadow-blue-600/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Subject</span>
        </button>
      </div>

      {/* Search Bar */}
      {subjects.length > 0 && (
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="subject-search-input"
            type="text"
            placeholder="Search subjects by name or teacher..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
          />
        </div>
      )}

      {/* Empty State */}
      {subjects.length === 0 ? (
        <div
          id="empty-subjects-state"
          className="py-16 px-4 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs max-w-lg mx-auto"
        >
          <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
            <BookOpen className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            No subjects added yet.
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 max-w-sm mx-auto">
            Add your college courses to start organizing study schedules, topics, and exam preparations.
          </p>
          <button
            id="empty-add-subject-btn"
            onClick={() => setIsAddModalOpen(true)}
            className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition-all shadow-sm shadow-blue-600/25"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Your First Subject</span>
          </button>
        </div>
      ) : filteredSubjects.length === 0 ? (
        <div className="py-12 text-center text-slate-500 dark:text-slate-400 text-sm bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          No subjects matched "{searchQuery}". Try a different search.
        </div>
      ) : (
        /* Subjects Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSubjects.map(subject => {
            const progressInfo = subjectProgressList.find(p => p.subjectId === subject.id) || {
              completed: 0,
              total: subject.totalTopics,
              percentage: 0,
            };

            return (
              <div
                key={subject.id}
                id={`subject-card-${subject.id}`}
                className="group p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                {/* Card Top */}
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-3.5 h-3.5 rounded-full shrink-0 shadow-2xs"
                        style={{ backgroundColor: subject.color || '#3B82F6' }}
                      />
                      <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {subject.name}
                      </h3>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      <button
                        id={`edit-subject-${subject.id}`}
                        onClick={() => {
                          setFormError('');
                          setEditingSubject(subject);
                        }}
                        className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Edit Subject"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        id={`delete-subject-${subject.id}`}
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete "${subject.name}"?`)) {
                            deleteSubject(subject.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                        title="Delete Subject"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Teacher */}
                  <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>Teacher: {subject.teacher}</span>
                  </div>

                  {/* Description */}
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {subject.description}
                  </p>
                </div>

                {/* Progress & Topics Meta */}
                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-3">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-500 dark:text-slate-400">Progress:</span>
                    <span className="text-blue-600 dark:text-blue-400 font-bold">
                      {progressInfo.percentage}%
                    </span>
                  </div>

                  {/* Visual Progress Bar */}
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${progressInfo.percentage}%`,
                        backgroundColor: subject.color || '#3B82F6',
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
                    <span>Topics:</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {progressInfo.completed} / {progressInfo.total} completed
                    </span>
                  </div>

                  {/* View Subject Button */}
                  <button
                    id={`view-subject-${subject.id}`}
                    onClick={() => setViewingSubject(subject)}
                    className="w-full mt-2 py-2 px-3 text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-xl transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>View Subject</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Subject Modal */}
      {isAddModalOpen && (
        <div
          id="add-subject-modal"
          className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setIsAddModalOpen(false)}
        >
          <div
            className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 animate-in zoom-in-95 duration-150"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <span>Add Subject</span>
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-xs flex items-center gap-2 border border-red-200 dark:border-red-900/50">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleAddSubmit} className="space-y-3.5 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Subject Name *
                </label>
                <input
                  id="add-subject-name"
                  type="text"
                  placeholder="e.g. Python, Calculus, Physics"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900 dark:text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Teacher Name *
                </label>
                <input
                  id="add-subject-teacher"
                  type="text"
                  placeholder="e.g. Mr. Kumar, Dr. Sarah Vance"
                  value={teacher}
                  onChange={e => setTeacher(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900 dark:text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  id="add-subject-description"
                  rows={2}
                  placeholder="Brief overview of course curriculum or goals..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900 dark:text-white text-sm resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Total Topics (Estimated)
                </label>
                <input
                  id="add-subject-total-topics"
                  type="number"
                  min="1"
                  max="100"
                  value={totalTopics}
                  onChange={e => setTotalTopics(Number(e.target.value))}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900 dark:text-white text-sm"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  id="submit-add-subject"
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm shadow-blue-600/20 transition-colors"
                >
                  Add Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Subject Modal */}
      {editingSubject && (
        <div
          id="edit-subject-modal"
          className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setEditingSubject(null)}
        >
          <div
            className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 animate-in zoom-in-95 duration-150"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-blue-600" />
                <span>Edit Subject</span>
              </h2>
              <button
                onClick={() => setEditingSubject(null)}
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

            <form onSubmit={handleEditSubmit} className="space-y-3.5 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Subject Name
                </label>
                <input
                  type="text"
                  value={editingSubject.name}
                  onChange={e => setEditingSubject({ ...editingSubject, name: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900 dark:text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Teacher Name
                </label>
                <input
                  type="text"
                  value={editingSubject.teacher}
                  onChange={e => setEditingSubject({ ...editingSubject, teacher: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900 dark:text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={editingSubject.description}
                  onChange={e => setEditingSubject({ ...editingSubject, description: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900 dark:text-white text-sm resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Total Topics
                </label>
                <input
                  type="number"
                  min="1"
                  value={editingSubject.totalTopics}
                  onChange={e =>
                    setEditingSubject({ ...editingSubject, totalTopics: Number(e.target.value) })
                  }
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900 dark:text-white text-sm"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditingSubject(null)}
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

      {/* View Subject Details Modal */}
      {viewingSubject && (
        <div
          id="view-subject-modal"
          className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setViewingSubject(null)}
        >
          <div
            className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 animate-in zoom-in-95 duration-150"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <span
                  className="w-3.5 h-3.5 rounded-full"
                  style={{ backgroundColor: viewingSubject.color || '#3B82F6' }}
                />
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {viewingSubject.name}
                </h2>
              </div>
              <button
                onClick={() => setViewingSubject(null)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
                <User className="w-4 h-4 text-slate-400" />
                <span>Instructor: {viewingSubject.teacher}</span>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Course Overview:
                </span>
                <p className="text-slate-600 dark:text-slate-300 mt-1 leading-relaxed text-sm">
                  {viewingSubject.description}
                </p>
              </div>

              {/* Topics preview */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Course Syllabus Topics
                  </span>
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                    {topics.filter(t => t.subjectId === viewingSubject.id && t.completed).length} /{' '}
                    {topics.filter(t => t.subjectId === viewingSubject.id).length} completed
                  </span>
                </div>

                <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                  {topics.filter(t => t.subjectId === viewingSubject.id).length === 0 ? (
                    <p className="text-xs text-slate-400 py-2">No individual topics listed yet.</p>
                  ) : (
                    topics
                      .filter(t => t.subjectId === viewingSubject.id)
                      .map(t => (
                        <div
                          key={t.id}
                          className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 text-xs"
                        >
                          <span
                            className={
                              t.completed
                                ? 'line-through text-slate-400'
                                : 'text-slate-700 dark:text-slate-300'
                            }
                          >
                            {t.name}
                          </span>
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                              t.completed
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                                : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                            }`}
                          >
                            {t.completed ? 'Done' : 'Pending'}
                          </span>
                        </div>
                      ))
                  )}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <button
                onClick={() => {
                  setViewingSubject(null);
                  setSelectedSubjectIdForTopics(viewingSubject.id);
                  setActivePage('topics');
                }}
                className="px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Manage Topics / Progress</span>
              </button>
              <button
                onClick={() => {
                  setViewingSubject(null);
                  setActivePage('schedule');
                }}
                className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5"
              >
                <Clock className="w-4 h-4" />
                <span>Schedule Study</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
