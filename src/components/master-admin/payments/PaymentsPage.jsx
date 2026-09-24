import { BadgeIndianRupee, CreditCard, Landmark } from 'lucide-react'

const paymentRows = [
  { id: 'PAY-9210', invoice: 'INV-2026-3001', party: 'SOS Whitefield', method: 'UPI', amount: '₹54,980', status: 'Success' },
  { id: 'PAY-9218', invoice: 'INV-2026-3008', party: 'SOS Hebbal', method: 'NEFT', amount: '₹32,120', status: 'Pending' },
  { id: 'PAY-9221', invoice: 'INV-2026-3012', party: 'Customer Order', method: 'Card', amount: '₹1,360', status: 'Success' },
]

export default function PaymentsPage() {
  return (
    <section className="space-y-3">
      <div className="grid gap-2 sm:grid-cols-3">
        {[
          ['Collected Today', '₹2,46,800', BadgeIndianRupee],
          ['Pending Settlements', '₹92,120', Landmark],
          ['Failed Transactions', '3', CreditCard],
        ].map(([label, value, Icon]) => (
          <article key={label} className="rounded-lg border border-slate-200 bg-white p-3">
            <Icon size={16} className="text-[#008C95]" />
            <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
            <p className="text-sm text-slate-500">{label}</p>
          </article>
        ))}
      </div>
      <article className="rounded-lg border border-slate-200 bg-white p-3">
        <h2 className="text-lg font-semibold text-slate-900">Payment Ledger</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-slate-500">
                <th className="px-3 py-2.5 font-medium">Payment ID</th>
                <th className="px-3 py-2.5 font-medium">Invoice</th>
                <th className="px-3 py-2.5 font-medium">Party</th>
                <th className="px-3 py-2.5 font-medium">Method</th>
                <th className="px-3 py-2.5 font-medium">Amount</th>
                <th className="px-3 py-2.5 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {paymentRows.map((row) => (
                <tr key={row.id} className="border-b border-slate-100">
                  <td className="px-3 py-2.5">{row.id}</td>
                  <td className="px-3 py-2.5">{row.invoice}</td>
                  <td className="px-3 py-2.5">{row.party}</td>
                  <td className="px-3 py-2.5">{row.method}</td>
                  <td className="px-3 py-2.5">{row.amount}</td>
                  <td className="px-3 py-2.5">{row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  )
}
