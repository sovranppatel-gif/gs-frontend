import {
  AreaTrendChart,
  BarMetricChart,
  DonutChart,
  LineTrendChart,
  MultiLineChart,
} from '../shared/MasterAdminCharts.jsx'
import { Panel, StatCard } from '../shared/MasterAdminUI.jsx'
import {
  analyticsSeries,
  coursePopularity,
  dashboardStats,
  feeDonut,
  kpiTrend,
} from '../../../data/master-admin/dummyData.js'
import {
  Activity,
  GraduationCap,
  TrendingUp,
  Wallet,
} from 'lucide-react'

export default function AnalyticsPage() {
  return (
    <section className="space-y-3">
      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Institute KPI Score" value="92" icon={Activity} hint="Health composite" />
        <StatCard label="Student Growth YoY" value="+12.5%" icon={TrendingUp} hint="vs last year" />
        <StatCard label="Fee Collection" value="₹48.2L" icon={Wallet} hint="This month" />
        <StatCard label="Placement Offers" value="312" icon={GraduationCap} hint="YTD" />
      </div>

      <div className="grid gap-2 xl:grid-cols-2">
        <Panel title="Admissions Analytics">
          <LineTrendChart data={analyticsSeries.admissions} yLabel="Admissions" height={250} />
        </Panel>
        <Panel title="Student Growth">
          <AreaTrendChart data={analyticsSeries.studentGrowth} yLabel="Students" height={250} />
        </Panel>
      </div>

      <div className="grid gap-2 xl:grid-cols-2">
        <Panel title="Revenue vs Expenses (₹L)">
          <MultiLineChart
            data={analyticsSeries.revenueExpense}
            series={[
              { key: 'revenue', label: 'Revenue' },
              { key: 'expenses', label: 'Expenses' },
            ]}
            height={250}
          />
        </Panel>
        <Panel title="Attendance Analytics (week)">
          <BarMetricChart data={analyticsSeries.attendance} yLabel="Attendance %" height={250} />
        </Panel>
      </div>

      <div className="grid gap-2 xl:grid-cols-3">
        <Panel title="Fee Collection Mix">
          <DonutChart data={feeDonut} height={240} />
        </Panel>
        <Panel title="Course Popularity">
          <BarMetricChart data={coursePopularity} height={240} />
        </Panel>
        <Panel title="Faculty Performance">
          <BarMetricChart data={analyticsSeries.facultyPerf} yLabel="Score" height={240} />
        </Panel>
      </div>

      <div className="grid gap-2 lg:grid-cols-2">
        <Panel title="Placement Analytics">
          <BarMetricChart data={analyticsSeries.placements} yLabel="Offers" height={240} />
        </Panel>
        <Panel title="Overall Institute KPI Trend">
          <MultiLineChart
            data={kpiTrend}
            series={[
              { key: 'admissions', label: 'Admissions' },
              { key: 'revenue', label: 'Revenue' },
              { key: 'attendance', label: 'Attendance' },
            ]}
            height={240}
          />
        </Panel>
      </div>

      <Panel title="All Institute Statistics">
        <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {dashboardStats.map((s) => (
            <div key={s.key} className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-3">
              <p className="text-[11px] font-medium text-slate-500">{s.label}</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">{s.value}</p>
            </div>
          ))}
        </div>
      </Panel>
    </section>
  )
}
