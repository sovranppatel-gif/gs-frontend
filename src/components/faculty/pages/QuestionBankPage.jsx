import { useMemo, useState } from 'react'
import { Download, Pencil, Plus, Trash2, Upload } from 'lucide-react'
import { questionBank } from '../../../data/facultyData.js'
import {
  Panel,
  PrimaryButton,
  SearchInput,
  SecondaryButton,
  StatusBadge,
} from '../shared/FacultyUI.jsx'

const typeFilters = ['All', 'MCQ', 'Theory', 'Programming']
const difficultyFilters = ['All', 'Easy', 'Medium', 'Hard']

const typeColors = {
  MCQ: 'bg-[#00A896]/15 text-[#005F6B]',
  Theory: 'bg-sky-100 text-sky-700',
  Programming: 'bg-[#FF5E14]/15 text-[#FF5E14]',
}

export default function QuestionBankPage() {
  const [query, setQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('All')
  const [difficultyFilter, setDifficultyFilter] = useState('All')

  const filtered = useMemo(() => {
    return questionBank.filter((q) => {
      const search =
        !query ||
        q.question.toLowerCase().includes(query.toLowerCase()) ||
        q.subject.toLowerCase().includes(query.toLowerCase()) ||
        q.topic.toLowerCase().includes(query.toLowerCase())
      const typeMatch = typeFilter === 'All' || q.type === typeFilter
      const diffMatch = difficultyFilter === 'All' || q.difficulty === difficultyFilter
      return search && typeMatch && diffMatch
    })
  }, [query, typeFilter, difficultyFilter])

  const counts = {
    total: questionBank.length,
    mcq: questionBank.filter((q) => q.type === 'MCQ').length,
    theory: questionBank.filter((q) => q.type === 'Theory').length,
    programming: questionBank.filter((q) => q.type === 'Programming').length,
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <PrimaryButton>
          <Plus size={14} />
          Add Question
        </PrimaryButton>
        <SecondaryButton>
          <Upload size={14} />
          Import
        </SecondaryButton>
        <SecondaryButton>
          <Download size={14} />
          Export
        </SecondaryButton>
        <div className="min-w-[200px] flex-1">
          <SearchInput
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search questions, topics, subjects…"
          />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-2xl font-semibold text-slate-900">{counts.total}</p>
          <p className="text-sm text-slate-500">Total Questions</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-2xl font-semibold text-[#008C95]">{counts.mcq}</p>
          <p className="text-sm text-slate-500">MCQ</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-2xl font-semibold text-sky-600">{counts.theory}</p>
          <p className="text-sm text-slate-500">Theory</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-2xl font-semibold text-[#FF5E14]">{counts.programming}</p>
          <p className="text-sm text-slate-500">Programming</p>
        </article>
      </div>

      <Panel title="Filters">
        <div className="space-y-3">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Question Type</p>
            <div className="flex flex-wrap gap-2">
              {typeFilters.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTypeFilter(t)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                    typeFilter === t
                      ? 'bg-gradient-to-r from-[#FF5E14] to-[#008C95] text-white'
                      : 'border border-slate-200 bg-white text-slate-600 hover:border-[#FF5E14]/30'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Difficulty</p>
            <div className="flex flex-wrap gap-2">
              {difficultyFilters.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDifficultyFilter(d)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                    difficultyFilter === d
                      ? 'bg-gradient-to-r from-[#FF5E14] to-[#008C95] text-white'
                      : 'border border-slate-200 bg-white text-slate-600 hover:border-[#FF5E14]/30'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Panel>

      <Panel title={`Question List (${filtered.length})`}>
        <div className="space-y-3">
          {filtered.map((q) => (
            <div
              key={q.id}
              className="rounded-xl border border-slate-100 bg-slate-50 p-4 transition hover:border-[#008C95]/30 hover:bg-white"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${typeColors[q.type]}`}
                    >
                      {q.type}
                    </span>
                    <StatusBadge status={q.difficulty} />
                    <span className="text-[11px] text-slate-400">
                      {q.subject} · {q.topic}
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-medium text-slate-800">{q.question}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-[#008C95]/40 hover:text-[#008C95]"
                    aria-label="Edit question"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    type="button"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-rose-300 hover:text-rose-600"
                    aria-label="Delete question"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {filtered.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-500">No questions match your filters.</p>
        ) : null}
      </Panel>
    </section>
  )
}
