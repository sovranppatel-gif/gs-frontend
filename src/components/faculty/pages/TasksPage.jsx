import { useMemo, useState } from 'react'
import { Calendar, ListTodo, Plus } from 'lucide-react'
import { tasks as initialTasks } from '../../../data/facultyData.js'
import { Panel, PrimaryButton, ProgressBar, StatusBadge } from '../shared/FacultyUI.jsx'

const TODAY = 'Jul 14, 2026'
const filters = ['Today', 'Pending', 'Completed']

export default function TasksPage() {
  const [tasks, setTasks] = useState(initialTasks)
  const [activeFilter, setActiveFilter] = useState('Pending')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', priority: 'Medium', deadline: '' })

  const filtered = useMemo(() => {
    if (activeFilter === 'Today') {
      return tasks.filter((t) => t.deadline === TODAY)
    }
    if (activeFilter === 'Pending') {
      return tasks.filter((t) => t.status === 'Pending')
    }
    return tasks.filter((t) => t.status === 'Completed')
  }, [tasks, activeFilter])

  const counts = {
    Today: tasks.filter((t) => t.deadline === TODAY).length,
    Pending: tasks.filter((t) => t.status === 'Pending').length,
    Completed: tasks.filter((t) => t.status === 'Completed').length,
  }

  const handleCreate = (e) => {
    e.preventDefault()
    if (!form.title.trim() || !form.deadline) return
    const newTask = {
      id: `T${Date.now()}`,
      title: form.title.trim(),
      priority: form.priority,
      deadline: form.deadline,
      progress: 0,
      status: 'Pending',
    }
    setTasks((prev) => [newTask, ...prev])
    setForm({ title: '', priority: 'Medium', deadline: '' })
    setShowForm(false)
    setActiveFilter('Pending')
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setActiveFilter(f)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                activeFilter === f
                  ? 'bg-gradient-to-r from-[#FF5E14] to-[#008C95] text-white shadow-sm'
                  : 'border border-slate-200 bg-white text-slate-600 hover:border-[#00A896]'
              }`}
            >
              {f}
              <span className="ml-1.5 opacity-80">({counts[f]})</span>
            </button>
          ))}
        </div>
        <PrimaryButton onClick={() => setShowForm((v) => !v)}>
          <Plus size={14} />
          Create Task
        </PrimaryButton>
      </div>

      {showForm ? (
        <Panel title="New Task">
          <form onSubmit={handleCreate} className="grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-medium text-slate-500">Task Title</label>
              <input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="What needs to be done?"
                required
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#00A896] focus:ring-2 focus:ring-[#FF5E14]/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Priority</label>
              <select
                value={form.priority}
                onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#00A896]"
              >
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Deadline</label>
              <input
                type="date"
                value={form.deadline}
                onChange={(e) => setForm((f) => ({ ...f, deadline: e.target.value }))}
                required
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#00A896] focus:ring-2 focus:ring-[#FF5E14]/20"
              />
            </div>
            <div className="sm:col-span-2">
              <PrimaryButton type="submit">
                <ListTodo size={14} />
                Add Task
              </PrimaryButton>
            </div>
          </form>
        </Panel>
      ) : null}

      <Panel title={`${activeFilter} Tasks`}>
        {filtered.length === 0 ? (
          <p className="py-10 text-center text-sm text-slate-400">No tasks in this category.</p>
        ) : (
          <div className="space-y-3">
            {filtered.map((task) => (
              <article
                key={task.id}
                className={`rounded-xl border p-4 ${
                  task.status === 'Completed'
                    ? 'border-emerald-100 bg-emerald-50/30'
                    : 'border-slate-100 bg-slate-50'
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-semibold text-slate-900">{task.title}</h3>
                      <StatusBadge status={task.priority} />
                      <StatusBadge status={task.status} />
                    </div>
                    <p className="mt-1 inline-flex items-center gap-1 text-xs text-slate-500">
                      <Calendar size={12} />
                      Deadline: {task.deadline}
                    </p>
                  </div>
                  <span className="text-[11px] font-medium text-slate-400">{task.id}</span>
                </div>
                <div className="mt-3">
                  <ProgressBar
                    value={task.progress}
                    label="Progress"
                    color={task.status === 'Completed' ? 'green' : 'orange'}
                  />
                </div>
              </article>
            ))}
          </div>
        )}
      </Panel>
    </section>
  )
}
