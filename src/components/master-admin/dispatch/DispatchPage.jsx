import { PackageCheck, Route, Truck } from 'lucide-react'

const dispatchRows = [
  { id: 'DSP-6021', orderId: 'ORD-2026-1151', courier: 'Delhivery', status: 'In Transit', tracking: 'DLV8932101' },
  { id: 'DSP-6022', orderId: 'ORD-2026-1156', courier: 'Shiprocket', status: 'Packed', tracking: 'SRK7711209' },
  { id: 'DSP-6024', orderId: 'ORD-2026-1160', courier: 'DTDC', status: 'Out for Delivery', tracking: 'DTC6602132' },
]

export default function DispatchPage() {
  return (
    <section className="space-y-3">
      <div className="grid gap-2 sm:grid-cols-3">
        {[
          ['Dispatch Ready', '31', PackageCheck],
          ['In Transit', '18', Truck],
          ['Average Delivery SLA', '1.8 days', Route],
        ].map(([label, value, Icon]) => (
          <article key={label} className="rounded-lg border border-slate-200 bg-white p-3">
            <Icon size={16} className="text-[#008C95]" />
            <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
            <p className="text-sm text-slate-500">{label}</p>
          </article>
        ))}
      </div>
      <article className="rounded-lg border border-slate-200 bg-white p-3">
        <h2 className="text-lg font-semibold text-slate-900">Dispatch Queue</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-slate-500">
                <th className="px-3 py-3 font-medium">Dispatch ID</th>
                <th className="px-3 py-3 font-medium">Order ID</th>
                <th className="px-3 py-3 font-medium">Courier</th>
                <th className="px-3 py-3 font-medium">Status</th>
                <th className="px-3 py-3 font-medium">Tracking ID</th>
              </tr>
            </thead>
            <tbody>
              {dispatchRows.map((row) => (
                <tr key={row.id} className="border-b border-slate-100">
                  <td className="px-3 py-3">{row.id}</td>
                  <td className="px-3 py-3">{row.orderId}</td>
                  <td className="px-3 py-3">{row.courier}</td>
                  <td className="px-3 py-3">{row.status}</td>
                  <td className="px-3 py-3">{row.tracking}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  )
}
