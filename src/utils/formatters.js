export function formatDate(d) {
  if (!d) return '—'
  const dt = new Date(d + 'T12:00:00')
  return dt.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
}

export function getBPFlag(sys, dia) {
  if (!sys) return 'ok'
  if (sys >= 180 || dia >= 120) return 'alert'
  if (sys > 130 || dia > 80) return 'warn'
  return 'ok'
}

export function formatSymptoms(e) {
  const parts = []
  if (e.sob && e.sob !== 'none') parts.push('SOB: ' + e.sob)
  if (e.swelling && e.swelling !== 'none') parts.push('Swelling: ' + e.swelling)
  if (e.chest && e.chest !== 'none') parts.push('Chest: ' + e.chest)
  if (e.energy) {
    const labels = { '5': 'Great', '4': 'Good', '3': 'OK', '2': 'Low', '1': 'Very Low' }
    parts.push('Energy: ' + (labels[e.energy] || e.energy))
  }
  return parts.length ? parts.join(' · ') : 'None reported'
}
