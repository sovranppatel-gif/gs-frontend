const INSTITUTE = 'GROW SKILLS TECH'
const TAGLINE = 'IT TRAINING CENTER'

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

function photoHtml(src, opts = {}) {
  const {
    width = '76px',
    height = width,
    radius = '12px',
    ring = '2px solid rgba(255,255,255,.9)',
  } = opts
  if (src) {
    return `<img src="${String(src).replace(/"/g, '&quot;')}" alt="Photo" style="width:${width};height:${height};object-fit:cover;border-radius:${radius};box-shadow:0 8px 18px rgba(15,23,42,.15);outline:${ring};background:#e2e8f0;flex-shrink:0;" />`
  }
  return `<div style="width:${width};height:${height};flex-shrink:0;border-radius:${radius};outline:${ring};background:linear-gradient(135deg,#f1f5f9,#e2e8f0);display:flex;align-items:center;justify-content:center;font-size:9px;color:#94a3b8;font-weight:800;letter-spacing:.12em;">PHOTO</div>`
}

function field(label, value, light = false, full = false) {
  const labelColor = light ? 'rgba(255,255,255,.5)' : '#94a3b8'
  const valueColor = light ? '#fff' : '#0f172a'
  return `<div style="min-width:0;${full ? 'grid-column:1 / -1;' : ''}">
    <div style="font-size:7px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:${labelColor}">${esc(label)}</div>
    <div style="font-size:11px;font-weight:800;color:${valueColor};line-height:1.35;word-break:break-word;overflow-wrap:anywhere;white-space:normal;">${line(value)}</div>
  </div>`
}

function chip(text, tone = 'teal') {
  const styles = {
    teal: 'background:rgba(0,140,149,.12);color:#008C95;',
    orange: 'background:rgba(255,94,20,.12);color:#FF5E14;',
    slate: 'background:#f1f5f9;color:#475569;',
    glass: 'background:rgba(255,255,255,.15);color:#fff;',
  }
  return `<span style="display:inline-block;max-width:100%;border-radius:4px;padding:3px 7px;font-size:9px;font-weight:800;line-height:1.35;word-break:break-word;overflow-wrap:anywhere;white-space:normal;${styles[tone] || styles.teal}">${esc(text)}</span>`
}

function securityStrip() {
  return `<div class="sec-strip" aria-hidden="true"><span></span><span></span><span></span><span></span></div>`
}

function qrMark(invert = false) {
  return `<div class="qr ${invert ? 'qr-invert' : ''}" aria-hidden="true"></div>`
}

function classicHtml(s) {
  return `<div class="card neo">
    ${securityStrip()}
    <div class="neo-banner">
      <div class="neo-brand-row">
        <div class="neo-brand">
          <div class="brand">${INSTITUTE}</div>
          <div class="sub">Advanced ID Label</div>
        </div>
        <span class="valid">VALID</span>
      </div>
    </div>
    <div class="neo-body">
      <div class="neo-top">
        ${photoHtml(s.photo, { width: '78px', height: '92px', radius: '12px', ring: '2px solid rgba(0,168,150,.4)' })}
        <div class="neo-namewrap">
          <div class="name">${line(s.name)}</div>
          <div class="chip-row">${chip(s.course, 'teal')}</div>
        </div>
      </div>
      <div class="neo-grid">
        ${field('Father', s.fatherName, false, true)}
        ${field('ID / Roll', s.rollNo, false, true)}
        ${field('DOB', s.dob)}
        ${field('Blood', s.bloodGroup)}
        ${field('Phone', s.phone)}
        ${field('Session', s.session)}
      </div>
      <div class="neo-foot">
        <span>${TAGLINE}</span>
        ${qrMark()}
      </div>
    </div>
  </div>`
}

function horizontalHtml(s) {
  return `<div class="card wallet">
    <div class="wallet-accent"></div>
    <div class="wallet-side">
      <div class="side-label">ADVANCED LABEL</div>
    </div>
    <div class="wallet-body">
      ${photoHtml(s.photo, { width: '92px', height: '110px', radius: '12px' })}
      <div class="wallet-info">
        <div class="chips">${chip('STUDENT PASS', 'orange')} ${chip(s.session, 'slate')}</div>
        <div class="name">${line(s.name)}</div>
        <div class="course">${line(s.course)}</div>
        <div class="grid2" style="margin-top:10px;border-top:1px solid #f1f5f9;padding-top:8px">
          ${field('Father', s.fatherName, false, true)}
          ${field('ID', s.rollNo, false, true)}
          ${field('DOB', s.dob)}
          ${field('Phone', s.phone)}
          ${field('Blood', s.bloodGroup)}
          ${field('Session', s.session)}
        </div>
      </div>
      <div class="wallet-qr">${qrMark()}</div>
    </div>
  </div>`
}

function minimalHtml(s) {
  return `<div class="card frost">
    ${securityStrip()}
    <div class="frost-inner">
      <div class="frost-top">
        <div>
          <div class="brand dark">${INSTITUTE}</div>
          <div class="sub muted">Clean Label</div>
        </div>
        <div class="icon-pill">ID</div>
      </div>
      <div class="frost-row">
        ${photoHtml(s.photo, { width: '78px', height: '92px', radius: '12px', ring: '1px solid #e2e8f0' })}
        <div style="min-width:0;flex:1">
          <div class="label-orange">MEMBER</div>
          <div class="name">${line(s.name)}</div>
          <div class="course">${line(s.course)}</div>
        </div>
      </div>
      <div class="frost-grid">
        ${field('ID / Roll', s.rollNo, false, true)}
        ${field('Father', s.fatherName, false, true)}
        ${field('DOB', s.dob)}
        ${field('Phone', s.phone)}
        ${field('Blood', s.bloodGroup)}
        ${field('Session', s.session)}
      </div>
      <div class="frost-qr">${qrMark()}</div>
    </div>
  </div>`
}

function darkHtml(s) {
  return `<div class="card obsidian">
    <div class="obs-edge"></div>
    <div class="obs-inner">
      <div class="obs-top">
        <div>
          <div class="brand">${INSTITUTE}</div>
          <div class="sub soft">Night Pass Label</div>
        </div>
        ${chip('ACTIVE', 'glass')}
      </div>
      <div class="obs-panel">
        ${photoHtml(s.photo, { width: '78px', height: '92px', radius: '12px', ring: '2px solid rgba(0,168,150,.45)' })}
        <div class="obs-cols">
          <div class="name light">${line(s.name)}</div>
          <div class="course mint">${line(s.course)}</div>
        </div>
      </div>
      <div class="grid2" style="margin-top:12px">
        ${field('Father', s.fatherName, true, true)}
        ${field('ID / Roll', s.rollNo, true, true)}
        ${field('DOB', s.dob, true)}
        ${field('Blood', s.bloodGroup, true)}
        ${field('Phone', s.phone, true)}
        ${field('Session', s.session, true)}
      </div>
      <div class="obs-foot-row">
        <div class="obs-foot">${TAGLINE}</div>
        ${qrMark(true)}
      </div>
    </div>
  </div>`
}

function campusHtml(s) {
  return `<div class="card spectrum">
    <div class="spec-mesh"></div>
    <div class="spec-inner">
      ${securityStrip()}
      <div class="spec-top">
        <div>
          <div class="brand">${INSTITUTE}</div>
          <div class="sub soft">Spectrum Label</div>
        </div>
        ${qrMark(true)}
      </div>
      <div class="spec-glass">
        ${photoHtml(s.photo, { width: '96px', height: '96px', radius: '999px', ring: '3px solid rgba(255,255,255,.85)' })}
        <div class="name light center" style="margin-top:10px;width:100%">${line(s.name)}</div>
        <div class="course soft center" style="width:100%">${line(s.course)}</div>
        <div class="grid2" style="margin-top:12px;width:100%;text-align:left">
          ${field('ID / Roll', s.rollNo, true, true)}
          ${field('Father', s.fatherName, true, true)}
          ${field('DOB', s.dob, true)}
          ${field('Phone', s.phone, true)}
          ${field('Blood', s.bloodGroup, true)}
          ${field('Session', s.session, true)}
        </div>
      </div>
    </div>
  </div>`
}

const BUILDERS = {
  classic: classicHtml,
  horizontal: horizontalHtml,
  minimal: minimalHtml,
  dark: darkHtml,
  campus: campusHtml,
}

/**
 * Open a print window with the selected student ID card design.
 * @param {object} student normalized student row
 * @param {string} cardType classic | horizontal | minimal | dark | campus
 */
export function printStudentIdCard(student, cardType = 'classic') {
  if (!student) throw new Error('No student selected')
  const build = BUILDERS[cardType] || BUILDERS.classic
  const cardMarkup = build(student)
  const title = `ID Card — ${student.name || student.admissionId || 'Student'}`

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${esc(title)}</title>
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #eef2f6;
      font-family: "Segoe UI", system-ui, Arial, sans-serif;
      padding: 28px;
      color: #0f172a;
    }
    .card {
      position: relative;
      width: 380px;
      overflow: hidden;
      border-radius: 16px;
      background: #fff;
      box-shadow: 0 18px 42px rgba(15,23,42,.14);
    }
    .brand { font-size: 12px; font-weight: 900; letter-spacing: .08em; }
    .brand.dark { color: #0f172a; }
    .sub { font-size: 9px; margin-top: 2px; text-transform: uppercase; letter-spacing: .12em; font-weight: 700; }
    .sub.muted { color: #94a3b8; }
    .sub.soft { color: rgba(255,255,255,.7); }
    .name {
      font-size: 13px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: .02em;
      line-height: 1.3;
      color: #0f172a;
      word-break: break-word;
      overflow-wrap: anywhere;
      white-space: normal;
    }
    .name.light { color: #fff; }
    .name.center, .course.center { text-align: center; }
    .course {
      font-size: 11px;
      font-weight: 700;
      color: #008C95;
      line-height: 1.35;
      word-break: break-word;
      overflow-wrap: anywhere;
      white-space: normal;
    }
    .course.mint { color: #5fd4c8; }
    .course.soft { color: rgba(255,255,255,.9); }
    .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .label-orange { font-size: 8px; font-weight: 800; letter-spacing: .16em; color: #FF5E14; }
    .chip-row { margin: 6px 0 0; }

    .sec-strip { display: flex; height: 6px; width: 100%; }
    .sec-strip span { display: block; height: 100%; }
    .sec-strip span:nth-child(1) { width: 38%; background: #008C95; }
    .sec-strip span:nth-child(2) { width: 24%; background: #FF5E14; }
    .sec-strip span:nth-child(3) { width: 18%; background: #00A896; }
    .sec-strip span:nth-child(4) { width: 20%; background: #1e293b; }

    .qr {
      width: 44px; height: 44px; flex-shrink: 0; border-radius: 6px;
      background:
        linear-gradient(#0f172a 0 0) 0 0 / 40% 40%,
        linear-gradient(#0f172a 0 0) 100% 0 / 40% 40%,
        linear-gradient(#0f172a 0 0) 0 100% / 40% 40%,
        linear-gradient(#0f172a 0 0) 100% 100% / 28% 28%,
        linear-gradient(#0f172a 0 0) 50% 50% / 18% 18%;
      background-repeat: no-repeat;
      background-color: #fff;
      border: 1px solid #e2e8f0;
    }
    .qr-invert {
      background-color: rgba(255,255,255,.92);
      border-color: transparent;
    }

    .neo-banner {
      position: relative;
      min-height: 72px;
      overflow: hidden;
      background: linear-gradient(135deg, #0a6f76, #008C95 55%, #00A896);
      color: #fff;
      padding: 14px 16px 40px;
    }
    .neo-brand-row { display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; }
    .neo-brand { position: relative; z-index: 1; }
    .neo-body { position: relative; padding: 8px 14px 14px; }
    .neo-top { display: flex; align-items: flex-end; gap: 12px; margin-top: -34px; }
    .neo-namewrap { min-width: 0; flex: 1; padding-bottom: 2px; }
    .neo-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      background: #f8fafc;
      border: 1px solid #f1f5f9;
      border-radius: 12px;
      padding: 12px;
      margin-top: 10px;
    }
    .neo-foot {
      margin-top: 10px;
      padding-top: 8px;
      border-top: 1px dashed #e2e8f0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
      font-size: 8px;
      font-weight: 800;
      color: #94a3b8;
      letter-spacing: .12em;
    }
    .valid {
      background: #FF5E14;
      color: #fff;
      border-radius: 4px;
      padding: 3px 8px;
      font-size: 8px;
      font-weight: 900;
      flex-shrink: 0;
      letter-spacing: .06em;
    }

    .wallet { width: 560px; display: flex; }
    .wallet-accent {
      width: 10px; flex-shrink: 0;
      background: linear-gradient(180deg, #FF5E14, #008C95, #0B1C24);
    }
    .wallet-side {
      position: relative;
      width: 56px;
      flex-shrink: 0;
      background: #0B1C24;
      overflow: hidden;
    }
    .side-label {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      writing-mode: vertical-rl;
      transform: rotate(180deg);
      color: rgba(255,255,255,.88);
      font-size: 9px;
      font-weight: 800;
      letter-spacing: .2em;
    }
    .wallet-body {
      position: relative;
      flex: 1;
      display: flex;
      gap: 14px;
      padding: 14px;
      align-items: flex-start;
      min-width: 0;
    }
    .wallet-info { position: relative; z-index: 1; flex: 1; min-width: 0; }
    .chips { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 8px; }
    .wallet-qr { position: absolute; right: 12px; bottom: 12px; }

    .frost { background: #fff; }
    .frost-inner { position: relative; padding: 16px; }
    .frost-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; margin-bottom: 14px; }
    .icon-pill {
      width: 28px; height: 28px; border-radius: 6px; flex-shrink: 0;
      background: rgba(0,140,149,.1); color: #008C95;
      display: flex; align-items: center; justify-content: center;
      font-size: 10px; font-weight: 900;
    }
    .frost-row { display: flex; gap: 12px; align-items: flex-start; }
    .frost-grid {
      margin-top: 14px;
      padding-top: 12px;
      border-top: 1px solid #e2e8f0;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }
    .frost-qr { display: flex; justify-content: flex-end; margin-top: 10px; }

    .obsidian { background: #07161c; color: #fff; }
    .obs-edge {
      position: absolute; left: 0; top: 0; bottom: 0; width: 4px;
      background: linear-gradient(180deg, #00A896, #008C95, #FF5E14);
    }
    .obs-inner { position: relative; padding: 16px 16px 16px 18px; }
    .obs-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; margin-bottom: 12px; }
    .obs-panel {
      display: flex; gap: 12px; align-items: flex-start;
      background: rgba(255,255,255,.05);
      border: 1px solid rgba(255,255,255,.1);
      border-radius: 12px;
      padding: 10px;
    }
    .obs-cols { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 6px; }
    .obs-foot-row {
      margin-top: 12px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,.1);
      display: flex; justify-content: space-between; align-items: center; gap: 8px;
    }
    .obs-foot {
      font-size: 8px; letter-spacing: .16em; color: rgba(255,255,255,.4); font-weight: 600;
    }

    .spectrum {
      background: linear-gradient(135deg, #0a6f76, #008C95 45%, #FF5E14);
      color: #fff;
    }
    .spec-mesh {
      position: absolute; inset: 0;
      background:
        radial-gradient(circle at 20% 20%, rgba(255,255,255,.32), transparent 40%),
        radial-gradient(circle at 80% 70%, rgba(0,0,0,.18), transparent 45%);
    }
    .spec-inner { position: relative; padding: 0 16px 16px; }
    .spec-top {
      display: flex; justify-content: space-between; align-items: flex-start; gap: 8px;
      margin: 12px 0 10px;
    }
    .spec-glass {
      display: flex; flex-direction: column; align-items: center;
      background: rgba(255,255,255,.12);
      border: 1px solid rgba(255,255,255,.25);
      border-radius: 14px;
      padding: 14px;
    }

    @media print {
      body { background: #fff; padding: 0; }
      .card { box-shadow: none; }
    }
  </style>
</head>
<body>
  ${cardMarkup}
</body>
</html>`

  // Prefer Blob URL window; fall back to iframe (avoids popup blockers)
  try {
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const printWindow = window.open(url, '_blank')
    if (printWindow) {
      const revoke = () => {
        try {
          URL.revokeObjectURL(url)
        } catch {
          /* ignore */
        }
      }
      const runPrint = () => {
        try {
          printWindow.focus()
          printWindow.print()
        } catch {
          /* ignore */
        }
      }
      if (printWindow.document?.readyState === 'complete') {
        window.setTimeout(runPrint, 300)
      } else {
        printWindow.addEventListener('load', () => window.setTimeout(runPrint, 300))
        window.setTimeout(runPrint, 800)
      }
      printWindow.addEventListener('afterprint', () => {
        revoke()
        try {
          printWindow.close()
        } catch {
          /* ignore */
        }
      })
      window.setTimeout(revoke, 120_000)
      return
    }
    URL.revokeObjectURL(url)
  } catch {
    /* fall through to iframe */
  }

  const iframe = document.createElement('iframe')
  iframe.setAttribute('title', 'Print student ID card')
  iframe.setAttribute(
    'style',
    'position:fixed;left:-10000px;top:0;width:900px;height:1200px;border:0;opacity:0;',
  )
  document.body.appendChild(iframe)

  const frameWindow = iframe.contentWindow
  const frameDoc = frameWindow?.document
  if (!frameWindow || !frameDoc) {
    iframe.remove()
    throw new Error('Unable to open print preview')
  }

  frameDoc.open()
  frameDoc.write(html)
  frameDoc.close()

  const cleanup = () => {
    window.setTimeout(() => {
      try {
        iframe.remove()
      } catch {
        /* ignore */
      }
    }, 1000)
  }

  const triggerPrint = () => {
    try {
      frameWindow.focus()
      frameWindow.print()
    } finally {
      cleanup()
    }
  }

  window.setTimeout(triggerPrint, 400)
}
