import { useState } from 'react'
import { Bell, Eye, KeyRound, Languages, Lock, Mail, Moon, Shield, Sun } from 'lucide-react'
import { Panel, PrimaryButton } from '../shared/FacultyUI.jsx'
import { useFacultyTheme } from '../FacultyTheme.jsx'

export default function SettingsPage() {
  const { isDark, toggleTheme } = useFacultyTheme()
  const [language, setLanguage] = useState('English')
  const [prefs, setPrefs] = useState({
    email: true,
    push: true,
    sms: false,
    assignments: true,
    attendance: true,
    classes: true,
    leave: true,
    salary: false,
  })
  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    showEmail: false,
    showPhone: false,
    showRating: true,
    activityStatus: true,
  })
  const [pwd, setPwd] = useState({ current: '', next: '', confirm: '' })
  const [pwdMsg, setPwdMsg] = useState('')

  const togglePref = (key) => setPrefs((p) => ({ ...p, [key]: !p[key] }))
  const togglePrivacy = (key) => setPrivacy((p) => ({ ...p, [key]: !p[key] }))

  const handlePassword = (e) => {
    e.preventDefault()
    if (pwd.next !== pwd.confirm) {
      setPwdMsg('New passwords do not match.')
      return
    }
    if (pwd.next.length < 6) {
      setPwdMsg('Password must be at least 6 characters.')
      return
    }
    setPwdMsg('Password updated (demo only).')
    setPwd({ current: '', next: '', confirm: '' })
  }

  return (
    <section className="space-y-4">
      <Panel title="Appearance">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {isDark ? <Moon size={18} className="text-[#008C95]" /> : <Sun size={18} className="text-[#FF5E14]" />}
            <div>
              <p className="text-sm font-semibold text-slate-900">{isDark ? 'Dark Mode' : 'Light Mode'}</p>
              <p className="text-xs text-slate-500">Preference saved locally for this portal.</p>
            </div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={isDark}
            onClick={toggleTheme}
            className={`relative h-8 w-14 rounded-full transition ${isDark ? 'bg-[#008C95]' : 'bg-slate-300'}`}
          >
            <span
              className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition ${
                isDark ? 'left-7' : 'left-1'
              }`}
            />
          </button>
        </div>
      </Panel>

      <Panel title="Language">
        <div className="flex items-center gap-3">
          <Languages size={18} className="text-[#FF5E14]" />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="rounded-full border border-slate-200 px-4 py-2 text-sm outline-none focus:border-[#00A896]"
          >
            {['English', 'Hindi', 'Gujarati', 'Tamil', 'Telugu'].map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>
      </Panel>

      <Panel title="Notification Preferences">
        <ul className="space-y-3">
          {[
            ['email', 'Email notifications'],
            ['push', 'Push notifications'],
            ['sms', 'SMS alerts'],
            ['assignments', 'Assignment submissions'],
            ['attendance', 'Attendance reminders'],
            ['classes', 'Live class reminders'],
            ['leave', 'Leave approval updates'],
            ['salary', 'Salary slip alerts'],
          ].map(([key, label]) => (
            <li key={key} className="flex items-center justify-between gap-3 text-sm">
              <span className="inline-flex items-center gap-2 text-slate-700">
                <Bell size={14} className="text-[#008C95]" />
                {label}
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={prefs[key]}
                onClick={() => togglePref(key)}
                className={`relative h-7 w-12 rounded-full transition ${prefs[key] ? 'bg-[#008C95]' : 'bg-slate-300'}`}
              >
                <span
                  className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition ${
                    prefs[key] ? 'left-5' : 'left-0.5'
                  }`}
                />
              </button>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel title="Privacy Settings">
        <ul className="space-y-3">
          {[
            ['profileVisible', 'Profile visible to students', Eye],
            ['showEmail', 'Show email on profile', Mail],
            ['showPhone', 'Show phone on profile', Lock],
            ['showRating', 'Show faculty rating publicly', Shield],
            ['activityStatus', 'Show online / teaching status', Eye],
          ].map(([key, label, Icon]) => (
            <li key={key} className="flex items-center justify-between gap-3 text-sm">
              <span className="inline-flex items-center gap-2 text-slate-700">
                <Icon size={14} className="text-[#FF5E14]" />
                {label}
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={privacy[key]}
                onClick={() => togglePrivacy(key)}
                className={`relative h-7 w-12 rounded-full transition ${privacy[key] ? 'bg-[#008C95]' : 'bg-slate-300'}`}
              >
                <span
                  className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition ${
                    privacy[key] ? 'left-5' : 'left-0.5'
                  }`}
                />
              </button>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel title="Change Password">
        <form onSubmit={handlePassword} className="max-w-md space-y-3">
          {[
            ['current', 'Current password'],
            ['next', 'New password'],
            ['confirm', 'Confirm new password'],
          ].map(([key, label]) => (
            <div key={key}>
              <label className="mb-1 block text-xs font-medium text-slate-500">{label}</label>
              <input
                type="password"
                value={pwd[key]}
                onChange={(e) => setPwd((p) => ({ ...p, [key]: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#00A896] focus:ring-2 focus:ring-[#FF5E14]/20"
              />
            </div>
          ))}
          <PrimaryButton>
            <KeyRound size={14} />
            Update Password
          </PrimaryButton>
          {pwdMsg ? <p className="text-xs font-medium text-[#008C95]">{pwdMsg}</p> : null}
        </form>
      </Panel>
    </section>
  )
}
