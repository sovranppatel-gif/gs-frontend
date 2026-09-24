import { Clock3, ShieldAlert, ShoppingCart } from 'lucide-react'

const orderRows = [
  { id: 'ORD-2026-1142', type: 'Franchise', status: 'Pending Approval', amount: '₹38,420', payment: 'Credit' },
  { id: 'ORD-2026-1148', type: 'Customer Rx', status: 'Packed', amount: '₹1,360', payment: 'Prepaid' },
  { id: 'ORD-2026-1151', type: 'Franchise', status: 'Shipped', amount: '₹54,980', payment: 'Credit' },
  { id: 'ORD-2026-1154', type: 'Customer', status: 'Delivered', amount: '₹740', payment: 'COD' },
]

export default function OrdersPage() {
  return (
    <section className="space-y-3">
      <div className="grid gap-2 sm:grid-cols-3">
        {[
          ['Total Orders Today', '84', ShoppingCart],
          ['Need Approval', '19', ShieldAlert],
          ['Average Processing Time', '34 min', Clock3],
        ].map(([label, value, Icon]) => (
          <article key={label} className="rounded-lg border border-slate-200 bg-white p-3">
            <Icon size={16} className="text-[#008C95]" />
            <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
            <p className="text-sm text-slate-500">{label}</p>
          </article>
        ))}
      </div>
      <article className="rounded-lg border border-slate-200 bg-white p-3">
        <h2 className="text-lg font-semibold text-slate-900">Order Lifecycle Monitor</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-slate-500">
                <th className="px-3 py-3 font-medium">Order ID</th>
                <th className="px-3 py-3 font-medium">Type</th>
                <th className="px-3 py-3 font-medium">Status</th>
                <th className="px-3 py-3 font-medium">Amount</th>
                <th className="px-3 py-3 font-medium">Payment</th>
              </tr>
            </thead>
            <tbody>
              {orderRows.map((row) => (
                <tr key={row.id} className="border-b border-slate-100">
                  <td className="px-3 py-3">{row.id}</td>
                  <td className="px-3 py-3">{row.type}</td>
                  <td className="px-3 py-3">{row.status}</td>
                  <td className="px-3 py-3">{row.amount}</td>
                  <td className="px-3 py-3">{row.payment}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  )
}
