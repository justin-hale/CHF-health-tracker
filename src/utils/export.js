// Triggers a CSV file download in the browser
function downloadCSV(filename, csvString) {
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function escapeCsv(val) {
  if (val == null || val === '') return ''
  const s = String(val)
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return '"' + s.replace(/"/g, '""') + '"'
  }
  return s
}

function row(cells) {
  return cells.map(escapeCsv).join(',')
}

export function exportDailyCSV(entries) {
  const headers = ['Date','Time','Systolic BP','Diastolic BP','Heart Rate','O2 Sat (%)','Weight (lbs)','Shortness of Breath','Swelling','Energy','Sleep','Chest Pain','Medications','Notes']
  const energyLabel = { '5':'Great','4':'Good','3':'OK','2':'Low','1':'Very Low' }
  const lines = [
    row(headers),
    ...entries.map(e => row([
      e.date, e.time,
      e.bpSys, e.bpDia, e.hr, e.o2, e.weight,
      e.sob, e.swelling,
      energyLabel[e.energy] || e.energy,
      e.sleep, e.chest, e.meds,
      e.notes,
    ]))
  ]
  downloadCSV('daily-vitals.csv', lines.join('\n'))
}

export function exportVisitsCSV(entries) {
  const headers = ['Date','Doctor','Type','Reason','Findings','Medication Changes','Action Items','Tags']
  const lines = [
    row(headers),
    ...entries.map(e => row([e.date, e.doctor, e.type, e.reason, e.findings, e.medsChange, e.actions, e.tags]))
  ]
  downloadCSV('doctor-visits.csv', lines.join('\n'))
}

// Opens a new window with a formatted medical summary, auto-triggers print dialog
export function printMedicalReport(data) {
  const { daily, visits } = data

  function fmtDate(d) {
    if (!d) return '—'
    const dt = new Date(d + 'T12:00:00')
    return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  // Compute summary stats from last 30 days of daily entries
  const recent = daily.slice(0, 30)
  const avg = (arr) => {
    const vals = arr.filter(v => v != null && !isNaN(v))
    return vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : null
  }
  const avgBpSys = avg(recent.map(e => parseFloat(e.bpSys)))
  const avgBpDia = avg(recent.map(e => parseFloat(e.bpDia)))
  const avgHr    = avg(recent.map(e => parseFloat(e.hr)))
  const avgO2    = avg(recent.map(e => parseFloat(e.o2)))
  const avgWeight = avg(recent.map(e => parseFloat(e.weight)))

  // Flag counts
  const bpAlerts = recent.filter(e => parseInt(e.bpSys) >= 180 || parseInt(e.bpDia) >= 120).length
  const bpWarn   = recent.filter(e => parseInt(e.bpSys) >= 130 || parseInt(e.bpDia) >= 80).length - bpAlerts
  const hrAlerts = recent.filter(e => parseInt(e.hr) > 120).length
  const o2Alerts = recent.filter(e => parseInt(e.o2) < 92).length

  // Weight gain events
  const weightGainEvents = []
  for (let i = 0; i < recent.length - 1; i++) {
    const diff = parseFloat(recent[i].weight) - parseFloat(recent[i + 1].weight)
    if (diff >= 2) weightGainEvents.push({ date: recent[i].date, gain: diff.toFixed(1) })
  }

  const dateRange = recent.length > 0
    ? `${fmtDate(recent[recent.length - 1].date)} – ${fmtDate(recent[0].date)}`
    : 'No data'

  const energyLabel = { '5':'Great','4':'Good','3':'OK','2':'Low','1':'Very Low' }

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"/>
<title>Medical Summary — Bill Kendrick</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: Georgia, serif; font-size: 13px; color: #222; padding: 32px; line-height: 1.5; }
  h1 { font-size: 22px; margin-bottom: 4px; }
  h2 { font-size: 15px; margin: 24px 0 10px; text-transform: uppercase; letter-spacing: 0.5px; color: #555; border-bottom: 1px solid #ccc; padding-bottom: 4px; }
  .meta { color: #666; font-size: 12px; margin-bottom: 24px; }
  .stats-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; margin-bottom: 8px; }
  .stat-box { border: 1px solid #ddd; border-radius: 6px; padding: 10px 12px; text-align: center; }
  .stat-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.4px; color: #777; margin-bottom: 4px; }
  .stat-value { font-size: 20px; font-weight: bold; color: #222; }
  .stat-sub { font-size: 10px; color: #999; margin-top: 2px; }
  .alert-box { background: #fff3f3; border: 1px solid #f0a090; border-radius: 6px; padding: 10px 14px; margin-bottom: 8px; font-size: 12px; }
  .warn-box  { background: #fffbec; border: 1px solid #f0c85a; border-radius: 6px; padding: 10px 14px; margin-bottom: 8px; font-size: 12px; }
  .ok-box    { background: #f0faf4; border: 1px solid #8cc; border-radius: 6px; padding: 10px 14px; margin-bottom: 8px; font-size: 12px; }
  table { width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 8px; }
  th { background: #f5f5f5; text-align: left; padding: 6px 8px; font-size: 10px; text-transform: uppercase; letter-spacing: 0.4px; color: #666; border-bottom: 2px solid #ddd; }
  td { padding: 5px 8px; border-bottom: 1px solid #eee; vertical-align: top; }
  tr:nth-child(even) td { background: #fafafa; }
  .flag-r { color: #c0392b; font-weight: bold; }
  .flag-y { color: #e67e22; }
  .visit-block { margin-bottom: 20px; border: 1px solid #ddd; border-radius: 6px; padding: 14px 16px; }
  .visit-block h3 { font-size: 14px; margin-bottom: 4px; }
  .visit-date-badge { display: inline-block; background: #2a7c8a; color: white; border-radius: 12px; padding: 2px 10px; font-size: 11px; margin-bottom: 10px; }
  .visit-section-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.4px; color: #888; margin-top: 8px; margin-bottom: 2px; }
  .visit-body { font-size: 12px; color: #444; white-space: pre-wrap; }
  @media print {
    body { padding: 16px; }
    .no-print { display: none; }
  }
</style>
</head>
<body>
<h1>Medical Summary — Bill Kendrick</h1>
<div class="meta">CHF Patient &nbsp;·&nbsp; Report generated ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} &nbsp;·&nbsp; Data range: ${dateRange} (last ${recent.length} daily readings)</div>

<h2>Average Vitals (Last 30 Days)</h2>
<div class="stats-grid">
  <div class="stat-box"><div class="stat-label">Blood Pressure</div><div class="stat-value">${avgBpSys != null ? avgBpSys + '/' + avgBpDia : '—'}</div><div class="stat-sub">Target &lt;130/80</div></div>
  <div class="stat-box"><div class="stat-label">Heart Rate</div><div class="stat-value">${avgHr ?? '—'}</div><div class="stat-sub">Target 60–100 bpm</div></div>
  <div class="stat-box"><div class="stat-label">O₂ Saturation</div><div class="stat-value">${avgO2 != null ? avgO2 + '%' : '—'}</div><div class="stat-sub">Target ≥95%</div></div>
  <div class="stat-box"><div class="stat-label">Weight</div><div class="stat-value">${avgWeight ?? '—'}</div><div class="stat-sub">lbs avg</div></div>
  <div class="stat-box"><div class="stat-label">Readings</div><div class="stat-value">${recent.length}</div><div class="stat-sub">days logged</div></div>
</div>

<h2>Clinical Flags (Last 30 Days)</h2>
${bpAlerts > 0 ? `<div class="alert-box">⚠️ <strong>${bpAlerts} reading(s)</strong> with critically high BP (≥180/120) — immediate attention warranted</div>` : ''}
${bpWarn > 0 ? `<div class="warn-box">🟡 <strong>${bpWarn} reading(s)</strong> with elevated BP (≥130/80) — above target</div>` : ''}
${hrAlerts > 0 ? `<div class="alert-box">⚠️ <strong>${hrAlerts} reading(s)</strong> with HR &gt;120 bpm</div>` : ''}
${o2Alerts > 0 ? `<div class="alert-box">⚠️ <strong>${o2Alerts} reading(s)</strong> with O₂ saturation &lt;92%</div>` : ''}
${weightGainEvents.length > 0 ? `<div class="warn-box">⚖️ <strong>${weightGainEvents.length} day(s)</strong> with weight gain ≥2 lbs from prior reading: ${weightGainEvents.map(e => fmtDate(e.date) + ' (+' + e.gain + ' lbs)').join(', ')}</div>` : ''}
${bpAlerts === 0 && hrAlerts === 0 && o2Alerts === 0 && weightGainEvents.length === 0 ? `<div class="ok-box">✓ No critical clinical flags in the last 30 days</div>` : ''}

<h2>Daily Vitals Log</h2>
<table>
  <thead><tr><th>Date</th><th>Time</th><th>BP (mmHg)</th><th>HR (bpm)</th><th>O₂ (%)</th><th>Weight (lbs)</th><th>SOB</th><th>Swelling</th><th>Energy</th><th>Sleep</th><th>Meds</th><th>Notes</th></tr></thead>
  <tbody>
    ${recent.map(e => {
      const sys = parseInt(e.bpSys), dia = parseInt(e.bpDia)
      const bpClass = (sys >= 180 || dia >= 120) ? 'flag-r' : (sys >= 130 || dia >= 80) ? 'flag-y' : ''
      const hrVal = parseInt(e.hr)
      const hrClass = hrVal > 120 ? 'flag-r' : hrVal > 100 ? 'flag-y' : ''
      const o2Val = parseInt(e.o2)
      const o2Class = o2Val < 92 ? 'flag-r' : o2Val < 95 ? 'flag-y' : ''
      return `<tr>
        <td>${fmtDate(e.date)}</td>
        <td>${e.time || '—'}</td>
        <td class="${bpClass}">${e.bpSys || '—'}/${e.bpDia || '—'}</td>
        <td class="${hrClass}">${e.hr || '—'}</td>
        <td class="${o2Class}">${e.o2 ? e.o2 + '%' : '—'}</td>
        <td>${e.weight ? e.weight + ' lbs' : '—'}</td>
        <td>${e.sob || '—'}</td>
        <td>${e.swelling || '—'}</td>
        <td>${energyLabel[e.energy] || e.energy || '—'}</td>
        <td>${e.sleep || '—'}</td>
        <td>${e.meds === 'yes' ? '✓ All' : e.meds === 'partial' ? '⚠ Partial' : e.meds === 'no' ? '✗ None' : '—'}</td>
        <td>${e.notes ? e.notes.substring(0, 120) + (e.notes.length > 120 ? '…' : '') : ''}</td>
      </tr>`
    }).join('')}
  </tbody>
</table>

${visits.length > 0 ? `<h2>Doctor Visit Notes</h2>
${visits.map(v => `<div class="visit-block">
  <h3>${v.doctor || 'Doctor Visit'}</h3>
  <span class="visit-date-badge">${fmtDate(v.date)}</span>
  ${v.reason ? `<div class="visit-section-label">Reason for Visit</div><div class="visit-body">${v.reason}</div>` : ''}
  ${v.findings ? `<div class="visit-section-label">Findings</div><div class="visit-body">${v.findings}</div>` : ''}
  ${v.medsChange ? `<div class="visit-section-label">Medication Changes</div><div class="visit-body">${v.medsChange}</div>` : ''}
  ${v.actions ? `<div class="visit-section-label">Action Items</div><div class="visit-body">${v.actions}</div>` : ''}
</div>`).join('')}` : ''}

<script>window.onload = () => window.print()</script>
</body>
</html>`

  const win = window.open('', '_blank')
  win.document.write(html)
  win.document.close()
}
