import { AlertTriangle, Boxes, CircleDot } from 'lucide-react'

const batchRows = [
  { medicine: 'Paracetamol 650', batch: 'PCM-A109', qty: 132, expiry: 'Jun 2026', status: 'Healthy' },
  { medicine: 'Cetirizine 10', batch: 'CTZ-B771', qty: 18, expiry: 'May 2026', status: 'Critical' },
  { medicine: 'Azithromycin 500', batch: 'AZI-C087', qty: 42, expiry: 'Sep 2026', status: 'Low' },
  { medicine: 'Amoxicillin 250', batch: 'AMX-E551', qty: 86, expiry: 'Dec 2026', status: 'Healthy' },
]

export default function InventoryPage() {
  return (
    <section className="space-y-3">
      <div className="grid gap-2 sm:grid-cols-3">
        {[
          ['Total Batches', '786', Boxes],
          ['Low Stock Batches', '14', AlertTriangle],
          ['Expiring in 90 Days', '27', CircleDot],
        ].map(([label, value, Icon]) => (
          <article key={label} className="rounded-lg border border-slate-200 bg-white p-3">
            <Icon size={16} className="text-[#008C95]" />
            <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
            <p className="text-sm text-slate-500">{label}</p>
          </article>
        ))}
      </div>
      <article className="rounded-lg border border-slate-200 bg-white p-3">
        <h2 className="text-lg font-semibold text-slate-900">Batch Level Inventory (FEFO Ready)</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-slate-500">
                <th className="px-3 py-3 font-medium">Medicine</th>
                <th className="px-3 py-3 font-medium">Batch No</th>
                <th className="px-3 py-3 font-medium">Quantity</th>
                <th className="px-3 py-3 font-medium">Expiry</th>
                <th className="px-3 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {batchRows.map((row) => (
                <tr key={row.batch} className="border-b border-slate-100">
                  <td className="px-3 py-3">{row.medicine}</td>
                  <td className="px-3 py-3">{row.batch}</td>
                  <td className="px-3 py-3">{row.qty}</td>
                  <td className="px-3 py-3">{row.expiry}</td>
                  <td className="px-3 py-3">{row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  )
}
