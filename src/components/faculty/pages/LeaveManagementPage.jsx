import { useState } from 'react'
import { Calendar, Plane, Plus } from 'lucide-react'
import { leaveBalance, leaves as initialLeaves } from '../../../data/facultyData.js'
import { Panel, PrimaryButton, SecondaryButton, StatCard, StatusBadge } from '../shared/FacultyUI.jsx'

export default function LeaveManagementPage() {
  const [leaves, setLeaves] = useState(initialLeaves)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ type: 'Casual Leave', from: '', to: '', reason: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleApply = (e) => {
    e.preventDefault()
    if (!form.from || !form.to || !form.reason.trim()) return
    const newLeave = {
      id: `LV-${Date.now()}`,
      type: form.type,
      from: form.from,
      to: form.to,
      days: 1,
      status: 'Pending',
      reason: form.reason.trim(),
    }
    setLeaves((prev) => [newLeave, ...prev])
    setForm({ type: 'Casual Leave', from: '', to: '', reason: '' })
    setShowForm(false)
    setSubmitted(true)
    window.setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <section className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Casual Leave" value={`${leaveBalance.casual} days`} icon={Plane} hint="Available balance" />
        <StatCard label="Sick Leave" value={`${leaveBalance.sick} days`} icon={Calendar} hint="Available balance" />
        <StatCard label="Earned Leave" value={`${leaveBalance.earned} days`} icon={Calendar} hint="Available balance" />
        <StatCard label="Used This Year" value={`${leaveBalance.used} days`} icon={Plane} hint="Approved leaves taken" />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-slate-500">
          <span className="font-semibold text-slate-800">{leaves.length}</span> leave requests on record
        </p>
        <PrimaryButton onClick={() => setShowForm((v) => !v)}>
          <Plus size={14} />
          Apply Leave
        </PrimaryButton>
      </div>

      {submitted ? (
        <p className="rounded-xl border border-[#00A896]/20 bg-[#00A896]/5 px-4 py-2 text-xs font-medium text-[#005F6B]">
          Leave application submitted (demo). Awaiting admin approval.
        </p>
      ) : null}

      {showForm ? (
        <Panel title="Apply for Leave">
          <form onSubmit={handleApply} className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Leave Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#00A896]"
              >
                <option>Casual Leave</option>
                <option>Sick Leave</option>
                <option>Earned Leave</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">From Date</label>
              <input
                type="date"
                value={form.from}
                onChange={(e) => setForm((f) => ({ ...f, from: e.target.value }))}
                required
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#00A896] focus:ring-2 focus:ring-[#FF5E14]/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">To Date</label>
              <input
                type="date"
                value={form.to}
                onChange={(e) => setForm((f) => ({ ...f, to: e.target.value }))}
                required
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#00A896] focus:ring-2 focus:ring-[#FF5E14]/20"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-medium text-slate-500">Reason</label>
              <textarea
                value={form.reason}
                onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))}
                placeholder="Brief reason for leave…"
                required
                rows={3}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#00A896] focus:ring-2 focus:ring-[#FF5E14]/20"
              />
            </div>
            <div className="flex flex-wrap gap-2 sm:col-span-2">
              <PrimaryButton type="submit">
                <Plane size={14} />
                Submit Application
              </PrimaryButton>
              <SecondaryButton type="button" onClick={() => setShowForm(false)}>
                Cancel
              </SecondaryButton>
            </div>
          </form>
        </Panel>
      ) : null}

      <Panel title="Leave History">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-slate-500">
                <th className="px-3 py-3 font-medium">ID</th>
                <th className="px-3 py-3 font-medium">Type</th>
                <th className="px-3 py-3 font-medium">From</th>
                <th className="px-3 py-3 font-medium">To</th>
                <th className="px-3 py-3 font-medium">Days</th>
                <th className="px-3 py-3 font-medium">Reason</th>
                <th className="px-3 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map((row) => (
                <tr key={row.id} className="border-b border-slate-100">
                  <td className="px-3 py-3 font-medium text-slate-800">{row.id}</td>
                  <td className="px-3 py-3">{row.type}</td>
                  <td className="px-3 py-3">{row.from}</td>
                  <td className="px-3 py-3">{row.to}</td>
                  <td className="px-3 py-3">{row.days}</td>
                  <td className="max-w-[200px] truncate px-3 py-3 text-slate-600">{row.reason}</td>
                  <td className="px-3 py-3">
                    <StatusBadge status={row.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </section>
  )
}
