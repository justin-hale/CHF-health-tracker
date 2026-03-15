import { useState } from 'react'
import EditingBanner from '../EditingBanner.jsx'
import { getDailyHints, getDailyAlerts } from '../../utils/alerts.js'
import { formatDate, getBPFlag, formatSymptoms } from '../../utils/formatters.js'

function today() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
function nowTime() {
  const d = new Date()
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

const EMPTY_FORM = {
  date: today(), time: nowTime(),
  bpSys: '', bpDia: '', hr: '', o2: '', weight: '',
  sob: '', swelling: '', energy: '', sleep: '',
  chest: 'none', meds: 'yes', notes: '',
}

export default function DailySection({ entries, isEditor, onSave }) {
  const [subTab, setSubTab] = useState(isEditor ? 'log' : 'history')
  const [form, setForm] = useState(EMPTY_FORM)
  const [editingId, setEditingId] = useState(null)
  const [saveStatus, setSaveStatus] = useState('')
  const [expandedRows, setExpandedRows] = useState(new Set())

  const previousEntry = entries[0] || null
  const hints = getDailyHints(form, previousEntry)
  const alerts = getDailyAlerts(form, previousEntry)

  function set(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function handleSave() {
    if (!form.date) { alert('Please enter a date.'); return }
    const entry = { ...form, id: editingId || Date.now() }
    onSave(entry, !!editingId)
    setSaveStatus('✅ Saved!')
    setTimeout(() => setSaveStatus(''), 3000)
    setEditingId(null)
    setForm(EMPTY_FORM)
    setSubTab('history')
  }

  function handleEdit(id) {
    const e = entries.find(x => x.id === id)
    if (!e) return
    setForm({
      date: e.date || '', time: e.time || '',
      bpSys: e.bpSys || '', bpDia: e.bpDia || '',
      hr: e.hr || '', o2: e.o2 || '', weight: e.weight || '',
      sob: e.sob || '', swelling: e.swelling || '',
      energy: e.energy || '', sleep: e.sleep || '',
      chest: e.chest || 'none', meds: e.meds || 'yes', notes: e.notes || '',
    })
    setEditingId(id)
    setSubTab('log')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleCancelEdit() {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setSubTab('history')
  }

  function toggleRow(id) {
    setExpandedRows(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const Hint = ({ hint }) => {
    if (!hint) return null
    return <div className={`field-hint ${hint.level}`}>{hint.msg}</div>
  }

  const sleepLabel = { good: 'Good', fair: 'Fair', poor: 'Poor' }
  const energyLabel = { '5': 'Great', '4': 'Good', '3': 'OK', '2': 'Low', '1': 'Very Low' }
  const medsIcon = e => e.meds === 'yes' ? '✅ All taken' : e.meds === 'partial' ? '⚠️ Missed some' : e.meds === 'no' ? '❌ None' : '—'

  return (
    <section className="section active">
      <div className="section-header">
        <h2>📅 Daily Log</h2>
        <p>Track Bill's vitals and symptoms every day. Morning is the best time for weight and blood pressure readings.</p>
      </div>

      {alerts.length > 0 && (
        <div className="alert-banner visible" dangerouslySetInnerHTML={{ __html: alerts.join('<br/>') }} />
      )}

      <div className="sub-tabs">
        {isEditor && (
          <button className={'sub-tab' + (subTab === 'log' ? ' active' : '')} onClick={() => setSubTab('log')}>📝 Log</button>
        )}
        <button className={'sub-tab' + (subTab === 'history' ? ' active' : '')} onClick={() => setSubTab('history')}>📋 History</button>
      </div>

      {subTab === 'log' && isEditor && (
        <div className="sub-panel active">
          <div className="card">
            <EditingBanner visible={!!editingId} onCancel={handleCancelEdit} />
            <div className="card-title"><span className="card-icon">📆</span>Today's Entry</div>

            <div className="form-grid-2" style={{ marginBottom: 20 }}>
              <div className="field">
                <label>Date</label>
                <input type="date" value={form.date} onChange={e => set('date', e.target.value)} />
              </div>
              <div className="field">
                <label>Time of Reading</label>
                <input type="time" value={form.time} onChange={e => set('time', e.target.value)} />
              </div>
            </div>

            <div className="card-title" style={{ fontSize: 15, marginBottom: 12 }}>❤️ Heart & Blood Pressure</div>
            <div className="form-grid" style={{ marginBottom: 24 }}>
              <div className="field">
                <label>Systolic BP <span className="hint">(top number)</span></label>
                <input type="number" value={form.bpSys} onChange={e => set('bpSys', e.target.value)} placeholder="e.g. 130" min="60" max="250" />
                <Hint hint={hints.bpSys} />
              </div>
              <div className="field">
                <label>Diastolic BP <span className="hint">(bottom number)</span></label>
                <input type="number" value={form.bpDia} onChange={e => set('bpDia', e.target.value)} placeholder="e.g. 80" min="40" max="150" />
                <Hint hint={hints.bpDia} />
              </div>
              <div className="field">
                <label>Heart Rate <span className="hint">bpm</span></label>
                <input type="number" value={form.hr} onChange={e => set('hr', e.target.value)} placeholder="e.g. 72" min="30" max="200" />
                <Hint hint={hints.hr} />
              </div>
              <div className="field">
                <label>Oxygen Saturation <span className="hint">% (if measured)</span></label>
                <input type="number" value={form.o2} onChange={e => set('o2', e.target.value)} placeholder="e.g. 97" min="80" max="100" />
                <Hint hint={hints.o2} />
              </div>
            </div>

            <div className="card-title" style={{ fontSize: 15, marginBottom: 12 }}>⚖️ Weight</div>
            <div className="form-grid" style={{ marginBottom: 24 }}>
              <div className="field">
                <label>Morning Weight <span className="hint">lbs — after bathroom, before eating</span></label>
                <input type="number" value={form.weight} onChange={e => set('weight', e.target.value)} placeholder="e.g. 244" step="0.1" />
                <Hint hint={hints.weight} />
              </div>
            </div>

            <div className="card-title" style={{ fontSize: 15, marginBottom: 12 }}>🌡️ Symptoms</div>
            <div className="form-grid" style={{ marginBottom: 16 }}>
              <div className="field">
                <label>Shortness of Breath</label>
                <select value={form.sob} onChange={e => set('sob', e.target.value)}>
                  <option value="">-- Select --</option>
                  <option value="none">None</option>
                  <option value="mild">Mild (light activity)</option>
                  <option value="moderate">Moderate (walking)</option>
                  <option value="severe">Severe (at rest)</option>
                </select>
              </div>
              <div className="field">
                <label>Swelling (Ankles / Legs)</label>
                <select value={form.swelling} onChange={e => set('swelling', e.target.value)}>
                  <option value="">-- Select --</option>
                  <option value="none">None</option>
                  <option value="mild">Mild</option>
                  <option value="moderate">Moderate</option>
                  <option value="severe">Severe</option>
                </select>
              </div>
              <div className="field">
                <label>Energy Level</label>
                <select value={form.energy} onChange={e => set('energy', e.target.value)}>
                  <option value="">-- Select --</option>
                  <option value="5">😄 Great</option>
                  <option value="4">🙂 Good</option>
                  <option value="3">😐 OK</option>
                  <option value="2">😔 Low</option>
                  <option value="1">😞 Very Low / Exhausted</option>
                </select>
              </div>
              <div className="field">
                <label>Sleep Quality</label>
                <select value={form.sleep} onChange={e => set('sleep', e.target.value)}>
                  <option value="">-- Select --</option>
                  <option value="good">Good (slept well)</option>
                  <option value="fair">Fair (some interruptions)</option>
                  <option value="poor">Poor (restless / couldn't sleep)</option>
                </select>
              </div>
              <div className="field">
                <label>Chest Pain / Pressure?</label>
                <select value={form.chest} onChange={e => set('chest', e.target.value)}>
                  <option value="none">No</option>
                  <option value="mild">Mild / discomfort</option>
                  <option value="yes">Yes — notable pain</option>
                </select>
              </div>
              <div className="field">
                <label>Medications Taken?</label>
                <select value={form.meds} onChange={e => set('meds', e.target.value)}>
                  <option value="yes">✅ All taken</option>
                  <option value="partial">⚠️ Missed some</option>
                  <option value="no">❌ None taken</option>
                </select>
              </div>
            </div>

            <div className="field" style={{ marginBottom: 24 }}>
              <label>Additional Notes <span className="hint">anything unusual — diet, activity, how he seems</span></label>
              <textarea value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="e.g. Bill seemed more tired than usual. Had soup for dinner. Took a short walk around the block..." />
            </div>

            <div className="save-row">
              <button className="btn-save" onClick={handleSave}>
                {editingId ? '💾 Update Entry' : '💾 Save Daily Entry'}
              </button>
              <span className="save-status">{saveStatus}</span>
            </div>
          </div>
        </div>
      )}

      {subTab === 'history' && (
        <div className="sub-panel active">
          <div className="history-section">
            <div className="history-title">Recent Daily Entries</div>
            {entries.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📋</div>
                <p>No entries yet. Start logging daily to see history here.</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="history-table">
                  <thead>
                    <tr>
                      <th></th>
                      <th>Date / Time</th>
                      <th>BP</th>
                      <th>HR</th>
                      <th>O₂</th>
                      <th>Weight</th>
                      <th>Symptoms</th>
                      <th>Meds</th>
                      {isEditor && <th></th>}
                    </tr>
                  </thead>
                  <tbody>
                    {entries.slice(0, 60).map(e => {
                      const bpFlag = getBPFlag(e.bpSys, e.bpDia)
                      const expanded = expandedRows.has(e.id)
                      const colCount = isEditor ? 9 : 8
                      return (
                        <>
                          <tr key={e.id} id={`row-${e.id}`}>
                            <td style={{ width: 28, paddingRight: 0 }}>
                              <button className="expand-btn" onClick={() => toggleRow(e.id)} title="Show details">
                                {expanded ? '▼' : '▶'}
                              </button>
                            </td>
                            <td className="date-cell">
                              {formatDate(e.date)}
                              {e.time && <><br /><span style={{ fontSize: 11, color: 'var(--gray-400)', fontWeight: 600 }}>{e.time}</span></>}
                            </td>
                            <td><span className={`flag-dot ${bpFlag}`}></span>{e.bpSys || '—'}/{e.bpDia || '—'}</td>
                            <td>{e.hr || '—'}</td>
                            <td>{e.o2 ? e.o2 + '%' : '—'}</td>
                            <td>{e.weight ? e.weight + ' lbs' : '—'}</td>
                            <td style={{ fontSize: 13 }}>{formatSymptoms(e)}</td>
                            <td>{e.meds === 'yes' ? '✅' : e.meds === 'partial' ? '⚠️' : e.meds === 'no' ? '❌' : '—'}</td>
                            {isEditor && <td><button className="btn-edit" onClick={() => handleEdit(e.id)}>Edit</button></td>}
                          </tr>
                          {expanded && (
                            <tr key={`detail-${e.id}`} className="detail-row">
                              <td colSpan={colCount}>
                                <div className="detail-grid">
                                  <div><div className="detail-field-label">Shortness of Breath</div><div className="detail-field-val">{e.sob || '—'}</div></div>
                                  <div><div className="detail-field-label">Swelling</div><div className="detail-field-val">{e.swelling || '—'}</div></div>
                                  <div><div className="detail-field-label">Chest Pain</div><div className="detail-field-val">{e.chest || '—'}</div></div>
                                  <div><div className="detail-field-label">Energy</div><div className="detail-field-val">{energyLabel[e.energy] || e.energy || '—'}</div></div>
                                  <div><div className="detail-field-label">Sleep</div><div className="detail-field-val">{sleepLabel[e.sleep] || e.sleep || '—'}</div></div>
                                  <div><div className="detail-field-label">Medications</div><div className="detail-field-val">{medsIcon(e)}</div></div>
                                </div>
                                {e.notes && (
                                  <div className="detail-notes">
                                    <strong style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '.4px', color: 'var(--gray-400)' }}>Notes</strong><br />
                                    {e.notes}
                                  </div>
                                )}
                              </td>
                            </tr>
                          )}
                        </>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
