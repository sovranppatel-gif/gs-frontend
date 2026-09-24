import { Package, Pill } from 'lucide-react'

const productRows = [
  { sku: 'MED-001', name: 'Paracetamol 650', salt: 'Acetaminophen', category: 'Analgesic', brand: 'Cipla', mrp: '₹34' },
  { sku: 'MED-012', name: 'Azithromycin 500', salt: 'Azithromycin', category: 'Antibiotic', brand: 'Sun Pharma', mrp: '₹118' },
  { sku: 'MED-023', name: 'Cetirizine 10', salt: 'Cetirizine Hydrochloride', category: 'Allergy', brand: 'Mankind', mrp: '₹28' },
]

export default function ProductsPage() {
  return (
    <section className="space-y-3">
      <div className="grid gap-2 sm:grid-cols-3">
        {[
          ['Total Products', '126', Package],
          ['Prescription Required', '39', Pill],
          ['Active Categories', '18', Package],
        ].map(([label, value, Icon]) => (
          <article key={label} className="rounded-lg border border-slate-200 bg-white p-3">
            <Icon size={16} className="text-[#008C95]" />
            <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
            <p className="text-sm text-slate-500">{label}</p>
          </article>
        ))}
      </div>

      <article className="rounded-lg border border-slate-200 bg-white p-3">
        <h2 className="text-lg font-semibold text-slate-900">Product Catalog</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-slate-500">
                <th className="px-3 py-3 font-medium">SKU</th>
                <th className="px-3 py-3 font-medium">Name</th>
                <th className="px-3 py-3 font-medium">Salt</th>
                <th className="px-3 py-3 font-medium">Category</th>
                <th className="px-3 py-3 font-medium">Brand</th>
                <th className="px-3 py-3 font-medium">MRP</th>
              </tr>
            </thead>
            <tbody>
              {productRows.map((row) => (
                <tr key={row.sku} className="border-b border-slate-100">
                  <td className="px-3 py-3">{row.sku}</td>
                  <td className="px-3 py-3">{row.name}</td>
                  <td className="px-3 py-3">{row.salt}</td>
                  <td className="px-3 py-3">{row.category}</td>
                  <td className="px-3 py-3">{row.brand}</td>
                  <td className="px-3 py-3">{row.mrp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  )
}
