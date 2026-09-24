import { useMemo, useState } from 'react'
import { StatusBadge, StatCard, Panel, PageToolbar, DataTable, Pagination, Modal, Tabs, useClientTable, downloadCsv, PrimaryButton, SecondaryButton } from '../shared/MasterAdminUI.jsx'
import { card } from '../../../utils/masterAdminTheme.js'

/**
 * Config-driven ERP module page.
 * config: { title, description, stats, columns, rows, searchKeys, filterKey, filters, addLabel, tabs, features }
 */
export default function ErpModulePage({ config, onNavigate }) {
  const {
    stats = [],
    columns = [],
    rows = [],
    searchKeys = ['name', 'title', 'id'],
    filterKey = 'status',
    filters,
    addLabel = 'Add New',
    tabs = [],
    features = [],
    emptyTitle,
    emptyDescription,
  } = config || {}

  const [activeTab, setActiveTab] = useState(tabs[0]?.id || tabs[0] || '')
  const [modalOpen, setModalOpen] = useState(false)
  const [selected, setSelected] = useState(null)

  const filterOptions = useMemo(() => {
    if (filters?.length) return filters
    const set = new Set(rows.map((r) => r[filterKey]).filter(Boolean))
    return [...set]
  }, [rows, filters, filterKey])

  const table = useClientTable(rows, { searchKeys, pageSize: 8, filterKey })

  const cols = useMemo(() => {
    const base = columns.map((c) => {
      if (c.key === 'status' || c.key === 'priority' || c.key === 'pinned') {
        return {
          ...c,
          render: (row) => <StatusBadge status={row[c.key]} />,
        }
      }
      return c
    })
    return [
      ...base,
      {
        key: '_actions',
        label: 'Actions',
        render: (row) => (
          <button
            type="button"
            className="text-xs font-semibold text-[#FF5E14] hover:underline"
            onClick={() => {
              setSelected(row)
              setModalOpen(true)
            }}
          >
            View
          </button>
        ),
      },
    ]
  }, [columns])

  return (
    <section className="space-y-3">
      {features.length > 0 ? (
        <div className={`${card} p-3`}>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Module capabilities</p>
          <div className="flex flex-wrap gap-2">
            {features.map((f) => (
              <span
                key={f}
                className="rounded-full border border-[#00A896]/25 bg-[#00A896]/10 px-2.5 py-1 text-[11px] font-medium text-[#005F6B]"
              >
                {f}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      {stats.length > 0 ? (
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((s) => (
            <StatCard key={s.label} label={s.label} value={s.value} icon={s.icon} hint={s.hint} />
          ))}
        </div>
      ) : null}

      {tabs.length > 0 ? (
        <Tabs
          tabs={tabs}
          active={activeTab}
          onChange={setActiveTab}
        />
      ) : null}

      <PageToolbar
        search={table.search}
        onSearch={table.setSearch}
        searchPlaceholder={`Search ${config?.title || 'records'}…`}
        filters={filterOptions}
        filterValue={table.filter}
        onFilter={table.setFilter}
        addLabel={addLabel}
        onAdd={() => {
          setSelected(null)
          setModalOpen(true)
        }}
        onExportCsv={() =>
          downloadCsv(
            `${(config?.title || 'export').toLowerCase().replaceAll(' ', '-')}.csv`,
            columns,
            table.filtered,
          )
        }
        onExportExcel={() =>
          downloadCsv(
            `${(config?.title || 'export').toLowerCase().replaceAll(' ', '-')}.xls`,
            columns,
            table.filtered,
          )
        }
        onExportPdf={() => window.print()}
      />

      <Panel title={activeTab ? `${config?.title || 'Records'} · ${activeTab}` : config?.title || 'Records'}>
        <DataTable
          columns={cols}
          rows={table.pageRows}
          emptyTitle={emptyTitle}
          emptyDescription={emptyDescription}
        />
        <Pagination page={table.page} pageSize={table.pageSize} total={table.total} onPageChange={table.setPage} />
      </Panel>

      {onNavigate && config?.related?.length ? (
        <div className="flex flex-wrap gap-2">
          {config.related.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => onNavigate(r)}
              className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-[#FF5E14]/40 hover:text-[#FF5E14]"
            >
              Open {r}
            </button>
          ))}
        </div>
      ) : null}

      <Modal
        open={modalOpen}
        title={selected ? `${config?.title || 'Record'} details` : `Create ${config?.title || 'record'}`}
        onClose={() => setModalOpen(false)}
        wide
        footer={
          <div className="flex justify-end gap-2">
            <SecondaryButton onClick={() => setModalOpen(false)}>Cancel</SecondaryButton>
            <PrimaryButton onClick={() => setModalOpen(false)}>
              {selected ? 'Save changes' : 'Create'}
            </PrimaryButton>
          </div>
        }
      >
        {selected ? (
          <dl className="grid gap-2 sm:grid-cols-2">
            {Object.entries(selected)
              .filter(([k]) => k !== '_actions')
              .map(([k, v]) => (
                <div key={k} className="rounded-lg bg-slate-50 px-3 py-2">
                  <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{k}</dt>
                  <dd className="mt-0.5 text-sm font-medium text-slate-800">{String(v)}</dd>
                </div>
              ))}
          </dl>
        ) : (
          <div className="grid gap-2 sm:grid-cols-2">
            {(columns.slice(0, 6) || []).map((c) => (
              <label key={c.key} className="block text-sm">
                <span className="mb-1 block text-xs font-medium text-slate-500">{c.label}</span>
                <input
                  className="h-10 w-full rounded-lg border border-slate-200 px-3 text-slate-800 outline-none focus:border-[#00A896]"
                  placeholder={c.label}
                />
              </label>
            ))}
          </div>
        )}
      </Modal>
    </section>
  )
}
