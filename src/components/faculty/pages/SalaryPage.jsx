import { Banknote, Download, IndianRupee, Receipt, TrendingUp } from 'lucide-react'
import { salary } from '../../../data/facultyData.js'
import { Panel, PrimaryButton, StatCard, StatusBadge, formatINR } from '../shared/FacultyUI.jsx'

const breakdownRows = [
  { key: 'basic', label: 'Basic Salary' },
  { key: 'hra', label: 'HRA' },
  { key: 'allowances', label: 'Allowances' },
  { key: 'bonus', label: 'Bonus' },
  { key: 'incentive', label: 'Incentive' },
  { key: 'tax', label: 'Tax Deduction', deduct: true },
]

export default function SalaryPage() {
  const gross =
    salary.basic + salary.hra + salary.allowances + salary.bonus + salary.incentive

  return (
    <section className="space-y-4">
      <article className="overflow-hidden rounded-2xl border border-[#00A896]/20 bg-gradient-to-br from-[#06151C] via-[#0A2A35] to-[#005F6B] p-5 text-white shadow-[0_18px_45px_rgba(0,0,0,0.2)] sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#00E5CC]">Current Salary</p>
            <p className="mt-2 text-3xl font-bold sm:text-4xl">{formatINR(salary.current)}</p>
            <p className="mt-1 text-sm text-slate-300">Pay period: {salary.month}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-right">
            <p className="text-[11px] uppercase tracking-wide text-slate-400">Net Pay</p>
            <p className="text-xl font-semibold text-[#FF7A00]">{formatINR(salary.net)}</p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <PrimaryButton className="!text-sm">
            <Download size={14} />
            Download Salary Slip
          </PrimaryButton>
        </div>
      </article>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Gross Earnings" value={formatINR(gross)} icon={IndianRupee} />
        <StatCard label="Net Pay" value={formatINR(salary.net)} icon={Banknote} />
        <StatCard label="Tax Deducted" value={formatINR(salary.tax)} icon={Receipt} />
        <StatCard label="Incentive" value={formatINR(salary.incentive)} icon={TrendingUp} hint="Performance bonus" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Salary Breakdown">
          <ul className="space-y-2">
            {breakdownRows.map((row) => (
              <li
                key={row.key}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm"
              >
                <span className="text-slate-600">{row.label}</span>
                <span className={`font-semibold ${row.deduct ? 'text-rose-600' : 'text-slate-900'}`}>
                  {row.deduct ? '−' : ''}
                  {formatINR(salary[row.key])}
                </span>
              </li>
            ))}
            <li className="flex items-center justify-between rounded-xl border border-[#00A896]/25 bg-[#00A896]/5 px-4 py-3 text-sm">
              <span className="font-semibold text-slate-800">Net Salary</span>
              <span className="text-lg font-bold text-[#008C95]">{formatINR(salary.net)}</span>
            </li>
          </ul>
        </Panel>

        <Panel title="Earnings Summary">
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-100 p-4">
              <p className="text-xs text-slate-500">Fixed Components</p>
              <p className="mt-1 text-xl font-semibold text-slate-900">
                {formatINR(salary.basic + salary.hra + salary.allowances)}
              </p>
              <p className="mt-1 text-[11px] text-slate-400">Basic + HRA + Allowances</p>
            </div>
            <div className="rounded-xl border border-slate-100 p-4">
              <p className="text-xs text-slate-500">Variable Components</p>
              <p className="mt-1 text-xl font-semibold text-[#FF5E14]">
                {formatINR(salary.bonus + salary.incentive)}
              </p>
              <p className="mt-1 text-[11px] text-slate-400">Bonus + Incentive</p>
            </div>
            <div className="rounded-xl border border-rose-100 bg-rose-50/50 p-4">
              <p className="text-xs text-rose-600">Total Deductions</p>
              <p className="mt-1 text-xl font-semibold text-rose-700">{formatINR(salary.tax)}</p>
            </div>
          </div>
        </Panel>
      </div>

      <Panel
        title="Payment History"
        action={
          <PrimaryButton>
            <Download size={14} />
            Export All Slips
          </PrimaryButton>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-slate-500">
                <th className="px-3 py-3 font-medium">Month</th>
                <th className="px-3 py-3 font-medium">Net Amount</th>
                <th className="px-3 py-3 font-medium">Status</th>
                <th className="px-3 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {salary.history.map((row) => (
                <tr key={row.month} className="border-b border-slate-100">
                  <td className="px-3 py-3 font-medium text-slate-800">{row.month}</td>
                  <td className="px-3 py-3 font-semibold text-slate-900">{formatINR(row.net)}</td>
                  <td className="px-3 py-3">
                    <StatusBadge status={row.status} />
                  </td>
                  <td className="px-3 py-3">
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#008C95] hover:text-[#FF5E14]"
                    >
                      <Download size={12} />
                      Slip
                    </button>
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
