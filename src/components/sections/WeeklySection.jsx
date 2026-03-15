import { useState } from 'react'
import EditingBanner from '../EditingBanner.jsx'
import { formatDate } from '../../utils/formatters.js'
import { getStepsHint } from '../../utils/alerts.js'

function today() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const EMPTY_FORM = {
  date: today(),
  activeDays: '', activityType: '', steps: '',
  sodium: '', fluids: '', alcohol: '', tobacco: '',
  meds: '', newSymptoms: 'none', notes: '',
}

export default function WeeklySection({ entries, isEditor, onSave }) {
  const [subTab, setSubTab] = useState(isEditor ? 'log' : 'history')
  const [form, setForm] = useState(EMPTY_FORM)
  const [editingId, setEditingId] = useState(null)
  const [saveStatus, setSaveStatus] = useState('')

  function set(field, value) { setForm(prev => ({ ...prev, [field]: value })) }

  const stepsHint = getStepsHint(form.steps)

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
      date: e.date || '', activeDays: e.activeDays || '',
      activityType: e.activityType || '', steps: e.steps || '',
      sodium: e.sodium || '', fluids: e.fluids || '',
      alcohol: e.alcohol || '', tobacco: e.tobacco || '',
      meds: e.meds || '', newSymptoms: e.newSymptoms || 'none', notes: e.notes || '',
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

  return (
    <section className="section active">
      <div className="section-header">
        <h2>📊 Weekly Check-In</h2>
        <p>Do this once a week — ideally on the same day each week. This captures bigger-picture health trends.</p>
      </div>

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
            <div className="card-title"><span className="card-icon">📆</span>This Week's Check-In</div>

            <div className="form-grid-2" style={{ marginBottom: 20 }}>
              <div className="field">
                <label>Week of</label>
                <input type="date" value={form.date} onChange={e => set('date', e.target.value)} />
              </div>
            </div>

            <div className="card-title" style={{ fontSize: 15, marginBottom: 12 }}>🏃 Activity & Exercise</div>
            <div className="form-grid" style={{ marginBottom: 24 }}>
              <div className="field">
                <label>Days Active This Week</label>
                <select value={form.activeDays} onChange={e => set('activeDays', e.target.value)}>
                  <option value="">-- Select --</option>
                  {[0,1,2,3,4,5,6,7].map(n => <option key={n} value={n}>{n} day{n !== 1 ? 's' : ''}</option>)}
                </select>
              </div>
              <div className="field">
                <label>Typical Activity Type</label>
                <select value={form.activityType} onChange={e => set('activityType', e.target.value)}>
                  <option value="">-- Select --</option>
                  <option value="bed-rest">Mostly bed rest</option>
                  <option value="light-indoor">Light indoor movement</option>
                  <option value="short-walks">Short walks (&lt; 10 min)</option>
                  <option value="walks">Walks (10–30 min)</option>
                  <option value="moderate">Moderate exercise</option>
                </select>
              </div>
              <div className="field">
                <label>Avg Daily Steps <span className="hint">(if tracked)</span></label>
                <input type="number" value={form.steps} onChange={e => set('steps', e.target.value)} placeholder="e.g. 3500" />
                {stepsHint && <div className={`field-hint ${stepsHint.level}`}>{stepsHint.msg}</div>}
              </div>
            </div>

            <div className="card-title" style={{ fontSize: 15, marginBottom: 12 }}>🍽️ Diet & Fluid Intake</div>
            <div className="form-grid" style={{ marginBottom: 24 }}>
              <div className="field">
                <label>Sodium Adherence</label>
                <select value={form.sodium} onChange={e => set('sodium', e.target.value)}>
                  <option value="">-- Select --</option>
                  <option value="excellent">✅ Excellent (&lt;2000mg most days)</option>
                  <option value="good">🙂 Good (occasional slips)</option>
                  <option value="fair">⚠️ Fair (frequent high-sodium days)</option>
                  <option value="poor">❌ Poor (no restriction)</option>
                </select>
              </div>
              <div className="field">
                <label>Fluid Restriction Adherence</label>
                <select value={form.fluids} onChange={e => set('fluids', e.target.value)}>
                  <option value="">-- Select --</option>
                  <option value="good">✅ Staying within limit</option>
                  <option value="fair">⚠️ Sometimes over limit</option>
                  <option value="poor">❌ Frequently over limit</option>
                  <option value="unsure">❓ Unsure / not tracking</option>
                </select>
              </div>
              <div className="field">
                <label>Alcohol This Week</label>
                <select value={form.alcohol} onChange={e => set('alcohol', e.target.value)}>
                  <option value="">-- Select --</option>
                  <option value="none">None</option>
                  <option value="1-2">1–2 drinks</option>
                  <option value="3-5">3–5 drinks</option>
                  <option value="more">More than 5</option>
                </select>
              </div>
              <div className="field">
                <label>Tobacco Use</label>
                <select value={form.tobacco} onChange={e => set('tobacco', e.target.value)}>
                  <option value="">-- Select --</option>
                  <option value="none">None / Non-smoker</option>
                  <option value="quit-attempt">Attempting to quit</option>
                  <option value="reduced">Reduced</option>
                  <option value="same">Same as usual</option>
                  <option value="increased">Increased</option>
                </select>
              </div>
            </div>

            <div className="card-title" style={{ fontSize: 15, marginBottom: 12 }}>💊 Medications & Appointments</div>
            <div className="form-grid" style={{ marginBottom: 24 }}>
              <div className="field">
                <label>Medication Adherence This Week</label>
                <select value={form.meds} onChange={e => set('meds', e.target.value)}>
                  <option value="">-- Select --</option>
                  <option value="all">✅ All doses taken</option>
                  <option value="mostly">🙂 Mostly (missed 1–2)</option>
                  <option value="some">⚠️ Some missed</option>
                  <option value="poor">❌ Many missed</option>
                </select>
              </div>
              <div className="field">
                <label>Any New Symptoms This Week?</label>
                <select value={form.newSymptoms} onChange={e => set('newSymptoms', e.target.value)}>
                  <option value="none">No new symptoms</option>
                  <option value="minor">Minor new symptoms</option>
                  <option value="notable">Notable new symptoms</option>
                  <option value="serious">Serious / called doctor</option>
                </select>
              </div>
            </div>

            <div className="field" style={{ marginBottom: 24 }}>
              <label>Weekly Summary Notes</label>
              <textarea value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Overall how was Bill this week? Any patterns, concerns, improvements to note..." />
            </div>

            <div className="save-row">
              <button className="btn-save" onClick={handleSave}>
                {editingId ? '💾 Update Check-In' : '💾 Save Weekly Check-In'}
              </button>
              <span className="save-status">{saveStatus}</span>
            </div>
          </div>
        </div>
      )}

      {subTab === 'history' && (
        <div className="sub-panel active">
          <div className="history-section">
            <div className="history-title">Weekly Check-In History</div>
            {entries.length === 0 ? (
              <div className="empty-state"><div className="empty-icon">📊</div><p>No weekly check-ins yet.</p></div>
            ) : entries.map(e => (
              <div key={e.id} className="card" style={{ borderLeft: '4px solid var(--teal)' }}>
                <div className="card-action-row">
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 16 }}>Week of {formatDate(e.date)}</div>
                    <div style={{ fontSize: 13, color: 'var(--gray-400)', marginTop: 2 }}>Active {e.activeDays || '?'} days · {e.activityType || '—'}</div>
                  </div>
                  {isEditor && <button className="btn-edit" onClick={() => handleEdit(e.id)}>Edit</button>}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px,1fr))', gap: 8, fontSize: 13, color: 'var(--gray-600)' }}>
                  <div>🧂 Sodium: {e.sodium || '—'}</div>
                  <div>💧 Fluids: {e.fluids || '—'}</div>
                  <div>💊 Meds: {e.meds || '—'}</div>
                  <div>🚬 Tobacco: {e.tobacco || '—'}</div>
                  {e.steps && <div>👣 Steps: {e.steps}/day</div>}
                  {e.alcohol && <div>🍺 Alcohol: {e.alcohol}</div>}
                  {e.newSymptoms && e.newSymptoms !== 'none' && <div>🩺 Symptoms: {e.newSymptoms}</div>}
                </div>
                {e.notes && (
                  <div style={{ marginTop: 12, fontSize: 14, lineHeight: 1.6, color: 'var(--gray-600)', borderTop: '1px solid var(--gray-100)', paddingTop: 12 }}>
                    {e.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
