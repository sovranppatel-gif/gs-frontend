import { useState } from 'react'
import { BarChart3, BookOpen, Layers, Pencil, Play, Plus, Users } from 'lucide-react'
import { courses } from '../../../data/facultyData.js'
import { Panel, PrimaryButton, ProgressBar, SecondaryButton, StatusBadge } from '../shared/FacultyUI.jsx'

export default function CoursesPage() {
  const [filter, setFilter] = useState('Active')

  const filtered = courses.filter((c) => (filter === 'All' ? true : c.status === filter))
  const activeCount = courses.filter((c) => c.status === 'Active').length
  const completedCount = courses.filter((c) => c.status === 'Completed').length

  const CourseCard = ({ c }) => (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-medium text-[#008C95]">{c.code}</p>
          <h3 className="text-base font-semibold text-slate-900">{c.title}</h3>
          <p className="mt-0.5 text-xs text-slate-500">{c.duration}</p>
        </div>
        <StatusBadge status={c.status} />
      </div>
      <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">
        <span className="inline-flex items-center gap-1">
          <Users size={12} className="text-[#008C95]" />
          {c.students} students
        </span>
        <span className="inline-flex items-center gap-1">
          <Layers size={12} className="text-[#008C95]" />
          {c.batches} batch{c.batches > 1 ? 'es' : ''}
        </span>
        <span className="inline-flex items-center gap-1">
          <BookOpen size={12} className="text-[#008C95]" />
          {c.progress}% complete
        </span>
      </div>
      <div className="mt-3">
        <ProgressBar value={c.progress} label="Course Progress" color={c.progress === 100 ? 'green' : 'orange'} />
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {c.status === 'Active' ? (
          <PrimaryButton>
            <Play size={14} />
            Continue Teaching
          </PrimaryButton>
        ) : null}
        <SecondaryButton>
          <Pencil size={14} />
          Edit
        </SecondaryButton>
        <SecondaryButton>
          <BarChart3 size={14} />
          Analytics
        </SecondaryButton>
      </div>
    </article>
  )

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {['Active', 'Completed', 'All'].map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                filter === f
                  ? 'bg-gradient-to-r from-[#FF5E14] to-[#008C95] text-white'
                  : 'border border-slate-200 bg-white text-slate-600 hover:border-[#FF5E14]/40'
              }`}
            >
              {f}
              {f === 'Active' ? ` (${activeCount})` : f === 'Completed' ? ` (${completedCount})` : ''}
            </button>
          ))}
        </div>
        <PrimaryButton>
          <Plus size={14} />
          Create Course
        </PrimaryButton>
      </div>

      <Panel title={filter === 'All' ? 'All Courses' : `${filter} Courses`}>
        <div className="grid gap-3 md:grid-cols-2">
          {filtered.map((c) => (
            <CourseCard key={c.id} c={c} />
          ))}
        </div>
      </Panel>
    </section>
  )
}
