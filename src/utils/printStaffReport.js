// Dedicated print view for the Staff list — same private hidden-iframe
// approach as printAdmissionReport.js / printUniversityDirectory.js.
const INSTITUTE_NAME = 'GROW SKILLS TECH'

function esc(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function line(value) {
  const text = esc(value).trim()
  return text || '—'
}

function buildReportHtml(rows) {
  const generatedAt = new Date().toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  const tableRows = rows.length
    ? rows
        .map(
          (row) => `<tr>
            <td>
              <strong>${line(row.fullName)}</strong>
              <div class="muted">${line(row.employeeId)}</div>
            </td>
            <td>${line(row.departmentName)}<div class="muted">${line(row.designationName)}</div></td>
            <td>${line(row.employmentType)}</td>
            <td>${line(row.joiningDateLabel)}</td>
            <td><span class="status status-${esc(String(row.status || '').toLowerCase().replace(/\s+/g, '-'))}">${line(row.status)}</span></td>
          </tr>`,
        )
        .join('')
    : `<tr><td colspan="5" class="empty">No staff match the current search or filters.</td></tr>`

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Staff_Report_${new Date().toISOString().slice(0, 10)}</title>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; padding: 24px; font-family: "Segoe UI", Arial, sans-serif; color: #0f172a; background: #fff; }
    .sheet { max-width: 960px; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; padding: 16px 18px; border-radius: 10px; background: linear-gradient(90deg, #FF5E14, #008C95); color: #fff; }
    .brand h1 { margin: 0; font-size: 20px; letter-spacing: 0.04em; }
    .brand p { margin: 4px 0 0; font-size: 12px; opacity: 0.92; text-transform: uppercase; letter-spacing: 0.08em; }
    .meta { text-align: right; font-size: 12px; line-height: 1.5; }
    table { width: 100%; border-collapse: collapse; font-size: 12.5px; margin-top: 18px; }
    th, td { border: 1px solid #e2e8f0; padding: 8px 10px; text-align: left; vertical-align: top; }
    th { background: #f1f5f9; font-size: 11px; text-transform: uppercase; letter-spacing: 0.04em; color: #475569; }
    .muted { font-size: 11px; color: #64748b; font-weight: 400; margin-top: 2px; }
    .empty { text-align: center; color: #64748b; padding: 20px; }
    .status { display: inline-block; padding: 2px 8px; border-radius: 999px; font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.03em; }
    .status-active { background: #dcfce7; color: #15803d; }
    .status-probation { background: #fef3c7; color: #92400e; }
    .status-notice-period { background: #ffedd5; color: #9a3412; }
    .status-resigned, .status-relieved { background: #fee2e2; color: #b91c1c; }
    .status-archived { background: #e2e8f0; color: #475569; }
    .footer { margin-top: 16px; font-size: 11px; color: #64748b; }
    @media print { body { padding: 0; } .header { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
  </style>
</head>
<body>
  <div class="sheet">
    <div class="header">
      <div class="brand">
        <h1>${esc(INSTITUTE_NAME)} PVT. LTD.</h1>
        <p>Staff Report</p>
      </div>
      <div class="meta">Generated: ${esc(generatedAt)}<br/>${rows.length} record${rows.length === 1 ? '' : 's'}</div>
    </div>
    <table>
      <thead><tr><th>Employee</th><th>Department / Designation</th><th>Type</th><th>Joining Date</th><th>Status</th></tr></thead>
      <tbody>${tableRows}</tbody>
    </table>
    <div class="footer">This is a computer-generated staff report from ${esc(INSTITUTE_NAME)}.</div>
  </div>
</body>
</html>`
}

function cleanupPrintFrame(frame) {
  if (!frame) return
  try {
    if (frame.parentNode) frame.parentNode.removeChild(frame)
  } catch {
    // ignore
  }
}

function printHtmlDocument(html) {
  const existing = document.getElementById('staff-report-print-frame')
  if (existing) cleanupPrintFrame(existing)

  const frame = document.createElement('iframe')
  frame.id = 'staff-report-print-frame'
  frame.setAttribute('aria-hidden', 'true')
  frame.title = 'Staff report print'
  Object.assign(frame.style, { position: 'fixed', right: '0', bottom: '0', width: '0', height: '0', border: '0', opacity: '0', pointerEvents: 'none' })
  document.body.appendChild(frame)

  const frameWindow = frame.contentWindow
  const frameDoc = frame.contentDocument || frameWindow?.document
  if (!frameWindow || !frameDoc) {
    cleanupPrintFrame(frame)
    throw new Error('Unable to prepare the report for printing')
  }

  frameDoc.open()
  frameDoc.write(html)
  frameDoc.close()

  const triggerPrint = () => {
    try {
      frameWindow.focus()
      frameWindow.print()
    } catch (err) {
      cleanupPrintFrame(frame)
      throw err instanceof Error ? err : new Error('Unable to open print dialog')
    }
    const remove = () => cleanupPrintFrame(frame)
    if (typeof frameWindow.onafterprint !== 'undefined') frameWindow.onafterprint = remove
    window.setTimeout(remove, 60_000)
  }

  if (frameDoc.readyState === 'complete') window.setTimeout(triggerPrint, 100)
  else frame.onload = () => window.setTimeout(triggerPrint, 100)
}

export function printStaffReport(rows = []) {
  printHtmlDocument(buildReportHtml(rows))
}
