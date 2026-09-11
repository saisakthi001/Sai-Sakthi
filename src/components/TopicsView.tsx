import React, { useState } from 'react';
import {
  CheckSquare,
  Plus,
  Trash2,
  BookOpen,
  CheckCircle2,
  Circle,
  TrendingUp,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useStudy } from '../context/StudyContext';

export const TopicsView: React.FC = () => {
  const {
    subjects,
    topics,
    addTopic,
    toggleTopic,
    deleteTopic,
    selectedSubjectIdForTopics,
    setSelectedSubjectIdForTopics,
    setActivePage,
  } = useStudy();

  const [newTopicNames, setNewTopicNames] = useState<{ [subjectId: string]: string }>({});
  const [collapsedSubjects, setCollapsedSubjects] = useState<{ [subjectId: string]: boolean }>({});

  const handleAddTopic = (subjectId: string) => {
    const text = newTopicNames[subjectId]?.trim();
    if (!text) return;

    addTopic(subjectId, text);
    setNewTopicNames(prev => ({ ...prev, [subjectId]: '' }));
  };

  const toggleCollapse = (subjectId: string) => {
    setCollapsedSubjects(prev => ({
      ...prev,
      [subjectId]: !prev[subjectId],
    }));
  };

  // Filter if a specific subject was targeted
  const displayedSubjects = selectedSubjectIdForTopics
    ? subjects.filter(s => s.id === selectedSubjectIdForTopics)
    : subjects;

  return (
    <div id="topics-view" className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <CheckSquare className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            <span>Topics / Progress</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Check off completed syllabus topics to automatically update your course & dashboard progress.
          </p>
        </div>

        {selectedSubjectIdForTopics && (
          <button
            onClick={() => setSelectedSubjectIdForTopics(null)}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50"
          >
            Show All Subjects
          </button>
        )}
      </div>

      {/* Subject Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setSelectedSubjectIdForTopics(null)}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
            selectedSubjectIdForTopics === null
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          All Subjects ({subjects.length})
        </button>

        {subjects.map(s => (
          <button
            key={s.id}
            onClick={() => setSelectedSubjectIdForTopics(s.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              selectedSubjectIdForTopics === s.id
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: s.color || '#3B82F6' }}
            />
            <span>{s.name}</span>
          </button>
        ))}
      </div>

      {/* Empty State */}
      {subjects.length === 0 ? (
        <div className="py-16 px-4 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs max-w-lg mx-auto">
          <BookOpen className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            No subjects added yet.
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            Create subjects first so you can organize syllabus topics and track your curriculum completion.
          </p>
          <button
            onClick={() => setActivePage('subjects')}
            className="mt-5 px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl hover:bg-blue-700 shadow-sm"
          >
            + Add Your First Subject
          </button>
        </div>
      ) : (
        /* Subjects & Topics List */
        <div className="space-y-6">
          {displayedSubjects.map(subject => {
            const subjectTopics = topics.filter(t => t.subjectId === subject.id);
            const completedCount = subjectTopics.filter(t => t.completed).length;
            const totalCount = Math.max(subjectTopics.length, subject.totalTopics || 1);
            const percentage =
              totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
            const isCollapsed = !!collapsedSubjects[subject.id];

            return (
              <div
                key={subject.id}
                id={`subject-topics-${subject.id}`}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs overflow-hidden"
              >
                {/* Subject Header with Progress Bar */}
                <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800/80">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span
                        className="w-4 h-4 rounded-full shadow-2xs"
                        style={{ backgroundColor: subject.color || '#3B82F6' }}
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                            {subject.name}
                          </h2>
                          {percentage === 100 && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                              <Sparkles className="w-3 h-3" />
                              All Complete!
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          Instructor: {subject.teacher}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                          Progress: <span className="text-blue-600 dark:text-blue-400 font-bold text-sm">{percentage}%</span>
                        </div>
                        <div className="text-[11px] text-slate-400 font-medium">
                          {completedCount} of {subjectTopics.length} topics done
                        </div>
                      </div>

                      <button
                        onClick={() => toggleCollapse(subject.id)}
                        className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                        title={isCollapsed ? 'Expand topics' : 'Collapse topics'}
                      >
                        {isCollapsed ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4 w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: subject.color || '#3B82F6',
                      }}
                    />
                  </div>
                </div>

                {/* Topics Items */}
                {!isCollapsed && (
                  <div className="p-5 sm:p-6 space-y-4">
                    {subjectTopics.length === 0 ? (
                      <p className="text-xs text-slate-400 py-3 text-center">
                        No topics listed for this subject yet. Add a syllabus topic below!
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                        {subjectTopics.map(topicItem => (
                          <div
                            key={topicItem.id}
                            id={`topic-item-${topicItem.id}`}
                            onClick={() => toggleTopic(topicItem.id)}
                            className={`group flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer select-none ${
                              topicItem.completed
                                ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200/80 dark:border-emerald-900/40 text-emerald-900 dark:text-emerald-200'
                                : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-blue-300 dark:hover:border-blue-700'
                            }`}
                          >
                            <div className="flex items-center gap-3 overflow-hidden">
                              <div
                                className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-colors ${
                                  topicItem.completed
                                    ? 'bg-emerald-600 text-white shadow-xs'
                                    : 'border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 group-hover:border-blue-500'
                                }`}
                              >
                                {topicItem.completed ? (
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                ) : (
                                  <span className="w-2 h-2 rounded-xs" />
                                )}
                              </div>
                              <span
                                className={`text-sm font-medium truncate ${
                                  topicItem.completed
                                    ? 'line-through text-slate-400 dark:text-slate-500'
                                    : 'text-slate-800 dark:text-slate-200'
                                }`}
                              >
                                {topicItem.name}
                              </span>
                            </div>

                            <button
                              onClick={e => {
                                e.stopPropagation();
                                deleteTopic(topicItem.id);
                              }}
                              className="p-1 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity rounded"
                              title="Delete topic"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add Topic Input Inline */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2">
                      <input
                        id={`add-topic-input-${subject.id}`}
                        type="text"
                        placeholder={`Add new topic to ${subject.name}...`}
                        value={newTopicNames[subject.id] || ''}
                        onChange={e =>
                          setNewTopicNames(prev => ({
                            ...prev,
                            [subject.id]: e.target.value,
                          }))
                        }
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddTopic(subject.id);
                          }
                        }}
                        className="flex-1 px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900 dark:text-white"
                      />
                      <button
                        id={`add-topic-btn-${subject.id}`}
                        onClick={() => handleAddTopic(subject.id)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs transition-colors cursor-pointer shrink-0"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Topic</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
