// Returns { bpSys, bpDia, hr, o2, weight } each = { level: 'ok'|'warn'|'error', msg: string } or null
export function getDailyHints(formData, previousEntry) {
  const sys = parseInt(formData.bpSys)
  const dia = parseInt(formData.bpDia)
  const hr = parseInt(formData.hr)
  const o2 = parseInt(formData.o2)
  const weight = parseFloat(formData.weight)
  const hints = {}

  if (!isNaN(sys)) {
    if (sys >= 180) hints.bpSys = { level: 'error', msg: '⚠️ Critically high — call doctor now (≥ 180)' }
    else if (sys < 90) hints.bpSys = { level: 'error', msg: '⚠️ Very low — call doctor (< 90)' }
    else if (sys >= 130) hints.bpSys = { level: 'warn', msg: 'Above target — aim for < 130 mmHg' }
    else hints.bpSys = { level: 'ok', msg: '✓ Within target (< 130 mmHg)' }
  }

  if (!isNaN(dia)) {
    if (dia >= 120) hints.bpDia = { level: 'error', msg: '⚠️ Critically high — call doctor now (≥ 120)' }
    else if (dia < 60) hints.bpDia = { level: 'error', msg: '⚠️ Very low — call doctor (< 60)' }
    else if (dia >= 80) hints.bpDia = { level: 'warn', msg: 'Above target — aim for < 80 mmHg' }
    else hints.bpDia = { level: 'ok', msg: '✓ Within target (< 80 mmHg)' }
  }

  if (!isNaN(hr)) {
    if (hr > 120) hints.hr = { level: 'error', msg: '⚠️ High — monitor closely, contact doctor (> 120 bpm)' }
    else if (hr > 100) hints.hr = { level: 'warn', msg: 'Above normal range — target 60–100 bpm' }
    else if (hr < 50) hints.hr = { level: 'warn', msg: 'Below normal range — target 60–100 bpm (50–70 ok for CHF)' }
    else hints.hr = { level: 'ok', msg: '✓ Within target (60–100 bpm)' }
  }

  if (!isNaN(o2)) {
    if (o2 < 92) hints.o2 = { level: 'error', msg: '⚠️ Low saturation — call doctor (< 92%)' }
    else if (o2 < 95) hints.o2 = { level: 'warn', msg: 'Below target — aim for ≥ 95%' }
    else hints.o2 = { level: 'ok', msg: '✓ Good saturation (≥ 95%)' }
  }

  if (!isNaN(weight) && weight) {
    if (previousEntry?.weight) {
      const diff = weight - parseFloat(previousEntry.weight)
      if (diff >= 2) hints.weight = { level: 'error', msg: '⚠️ +' + diff.toFixed(1) + ' lbs from yesterday — call doctor same day' }
      else if (diff > 0) hints.weight = { level: 'warn', msg: '+' + diff.toFixed(1) + ' lbs from yesterday — monitor' }
      else if (diff < 0) hints.weight = { level: 'ok', msg: diff.toFixed(1) + ' lbs from yesterday' }
      else hints.weight = { level: 'ok', msg: 'Same as yesterday' }
    }
  }

  return hints
}

export function getDailyAlerts(formData, previousEntry) {
  const sys = parseInt(formData.bpSys)
  const dia = parseInt(formData.bpDia)
  const hr = parseInt(formData.hr)
  const o2 = parseInt(formData.o2)
  const weight = parseFloat(formData.weight)
  const alerts = []

  if (!isNaN(sys) && !isNaN(dia) && (sys >= 180 || dia >= 120))
    alerts.push('⚠️ BP is critically high (' + sys + '/' + dia + '). Call doctor now.')
  if (!isNaN(sys) && !isNaN(dia) && (sys < 90 || dia < 60))
    alerts.push('⚠️ BP is very low (' + sys + '/' + dia + '). Call doctor.')
  if (!isNaN(hr) && hr > 120)
    alerts.push('⚠️ Heart rate is high (' + hr + ' bpm). Monitor closely.')
  if (!isNaN(o2) && o2 < 92)
    alerts.push('⚠️ Oxygen saturation is low (' + o2 + '%). Call doctor.')
  if (formData.chest === 'yes')
    alerts.push('🚨 Chest pain reported. Consider calling 911 if severe.')
  if (!isNaN(weight) && weight && previousEntry?.weight) {
    const diff = weight - parseFloat(previousEntry.weight)
    if (diff >= 2) alerts.push('⚠️ Weight up ' + diff.toFixed(1) + ' lbs from yesterday. Call doctor if this continues.')
  }

  return alerts
}

export function getStepsHint(steps) {
  const val = parseInt(steps)
  if (isNaN(val) || !val) return null
  if (val >= 5000 && val <= 7500) return { level: 'ok', msg: '✓ Within goal (5,000–7,500/day)' }
  if (val > 7500) return { level: 'ok', msg: '✓ Above goal — great effort!' }
  if (val >= 3000) return { level: 'warn', msg: 'Below goal — aim for 5,000–7,500/day' }
  return { level: 'warn', msg: 'Low activity — work up gradually toward 5,000+/day' }
}
