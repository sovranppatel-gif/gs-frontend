import { useState } from 'react'
import { HelpCircle, LifeBuoy, Mail, MessageSquarePlus } from 'lucide-react'
import { faqs, supportTickets } from '../../../data/facultyData.js'
import { Panel, PrimaryButton, StatusBadge } from '../shared/FacultyUI.jsx'

export default function SupportPage() {
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [category, setCategory] = useState('Technical')
  const [openFaq, setOpenFaq] = useState(0)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setSubject('')
    setMessage('')
    setCategory('Technical')
  }

  return (
    <section className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Raise a Ticket">
          <form onSubmit={handleSubmit} className="space-y-3">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#00A896]"
            >
              <option>Technical</option>
              <option>LMS / Portal</option>
              <option>HR / Payroll</option>
              <option>Other</option>
            </select>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Subject"
              required
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#00A896] focus:ring-2 focus:ring-[#FF5E14]/20"
            />
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your issue…"
              required
              rows={4}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#00A896] focus:ring-2 focus:ring-[#FF5E14]/20"
            />
            <PrimaryButton>
              <MessageSquarePlus size={14} />
              Submit Ticket
            </PrimaryButton>
            {submitted ? (
              <p className="text-xs font-medium text-[#008C95]">
                Ticket submitted (demo). Faculty support will reply within 24 hours.
              </p>
            ) : null}
          </form>
        </Panel>

        <Panel title="Your Tickets">
          <ul className="space-y-2">
            {supportTickets.map((t) => (
              <li
                key={t.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-100 px-3 py-2.5 text-sm"
              >
                <div>
                  <p className="font-medium text-slate-800">{t.subject}</p>
                  <p className="text-[11px] text-slate-400">
                    {t.id} · {t.date}
                  </p>
                </div>
                <StatusBadge status={t.status} />
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <Panel title="FAQs / Help Center">
        <div className="space-y-2">
          {faqs.map((f, i) => (
            <div key={f.q} className="rounded-xl border border-slate-100">
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-semibold text-slate-800"
              >
                <HelpCircle size={14} className="shrink-0 text-[#008C95]" />
                {f.q}
              </button>
              {openFaq === i ? (
                <p className="border-t border-slate-50 px-4 py-3 text-sm text-slate-600">{f.a}</p>
              ) : null}
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Contact Institute">
        <div className="flex flex-wrap gap-4 text-sm text-slate-700">
          <p className="inline-flex items-center gap-2">
            <Mail size={14} className="text-[#FF5E14]" />
            faculty-support@growskillstech.edu
          </p>
          <p className="inline-flex items-center gap-2">
            <LifeBuoy size={14} className="text-[#008C95]" />
            Helpline: +91 1800-123-4567
          </p>
        </div>
      </Panel>
    </section>
  )
}
