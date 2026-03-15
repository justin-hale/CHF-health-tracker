import { useState } from 'react'
import EditingBanner from '../EditingBanner.jsx'
import { formatDate } from '../../utils/formatters.js'

function today() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const EMPTY_FORM = {
  date: today(), doctor: '', type: 'cardiology', nextDate: '',
  reason: '', findings: '', medsChange: '', actions: '', tags: '',
}

const TYPE_LABEL = {
  cardiology: 'Cardiology', ep: 'Electrophysiology', primary: 'Primary Care',
  er: 'Emergency', test: 'Test/Procedure', other: 'Other'
}

export default function VisitsSection({ entries, isEditor, onSave }) {
  const [subTab, setSubTab] = useState(isEditor ? 'log' : 'history')
  const [form, setForm] = useState(EMPTY_FORM)
  const [editingId, setEditingId] = useState(null)
  const [saveStatus, setSaveStatus] = useState('')

  function set(field, value) { setForm(prev => ({ ...prev, [field]: value })) }

  function handleSave() {
    if (!form.date) { alert('Please enter a visit date.'); return }
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
      date: e.date || '', doctor: e.doctor || '', type: e.type || 'cardiology',
      nextDate: e.nextDate || '', reason: e.reason || '', findings: e.findings || '',
      medsChange: e.medsChange || '', actions: e.actions || '', tags: e.tags || '',
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
        <h2>🏥 Doctor Visits</h2>
        <p>Record notes from each appointment. Bring these summaries to help the doctor see patterns over time.</p>
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
            <div className="card-title"><span className="card-icon">📝</span>Log a Visit</div>

            <div className="form-grid-2" style={{ marginBottom: 20 }}>
              <div className="field">
                <label>Date of Visit</label>
                <input type="date" value={form.date} onChange={e => set('date', e.target.value)} />
              </div>
              <div className="field">
                <label>Doctor / Provider</label>
                <input type="text" value={form.doctor} onChange={e => set('doctor', e.target.value)} placeholder="e.g. Dr. Smith — Cardiology" />
              </div>
            </div>
            <div className="form-grid-2" style={{ marginBottom: 20 }}>
              <div className="field">
                <label>Type of Visit</label>
                <select value={form.type} onChange={e => set('type', e.target.value)}>
                  <option value="cardiology">Cardiology Follow-Up</option>
                  <option value="ep">EP (Electrophysiology)</option>
                  <option value="primary">Primary Care</option>
                  <option value="er">Emergency / ER</option>
                  <option value="test">Test / Procedure</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="field">
                <label>Next Appointment</label>
                <input type="date" value={form.nextDate} onChange={e => set('nextDate', e.target.value)} />
              </div>
            </div>

            <div className="field" style={{ marginBottom: 16 }}>
              <label>Reason for Visit / Concerns Brought</label>
              <textarea value={form.reason} onChange={e => set('reason', e.target.value)} placeholder="What we wanted to discuss..." />
            </div>
            <div className="field" style={{ marginBottom: 16 }}>
              <label>Doctor's Findings &amp; Notes</label>
              <textarea value={form.findings} onChange={e => set('findings', e.target.value)} style={{ minHeight: 140 }} placeholder="What the doctor said, exam findings, test results reviewed..." />
            </div>
            <div className="field" style={{ marginBottom: 16 }}>
              <label>Medications Changed</label>
              <textarea value={form.medsChange} onChange={e => set('medsChange', e.target.value)} placeholder="Any new prescriptions, dosage changes, or medications stopped..." />
            </div>
            <div className="field" style={{ marginBottom: 16 }}>
              <label>Action Items / Follow-Up</label>
              <textarea value={form.actions} onChange={e => set('actions', e.target.value)} placeholder="Things we need to do, tests ordered, referrals made..." />
            </div>
            <div className="field" style={{ marginBottom: 24 }}>
              <label>Tags / Keywords <span className="hint">comma-separated</span></label>
              <input type="text" value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="e.g. EF stable, new medication, weight up" />
            </div>

            <div className="save-row">
              <button className="btn-save" onClick={handleSave}>
                {editingId ? '💾 Update Visit' : '💾 Save Visit Notes'}
              </button>
              <span className="save-status">{saveStatus}</span>
            </div>
          </div>
        </div>
      )}

      {subTab === 'history' && (
        <div className="sub-panel active">
          <div className="history-section">
            <div className="history-title">Visit History</div>
            {entries.length === 0 ? (
              <div className="empty-state"><div className="empty-icon">🏥</div><p>No visits logged yet.</p></div>
            ) : entries.map(e => (
              <div key={e.id} className="visit-card">
                <div className="visit-header">
                  <div>
                    <div className="visit-title">{e.doctor || TYPE_LABEL[e.type] || 'Doctor Visit'}</div>
                    {e.nextDate && <div style={{ fontSize: 13, color: 'var(--gray-400)', marginTop: 4 }}>Next appointment: {formatDate(e.nextDate)}</div>}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span className="visit-date">{formatDate(e.date)}</span>
                    {isEditor && <button className="btn-edit" onClick={() => handleEdit(e.id)}>Edit</button>}
                  </div>
                </div>
                {e.reason && <div style={{ marginBottom: 10 }}><strong style={{ fontSize: 13, color: 'var(--gray-600)' }}>REASON:</strong><br /><div className="visit-body">{e.reason}</div></div>}
                {e.findings && <div style={{ marginBottom: 10 }}><strong style={{ fontSize: 13, color: 'var(--gray-600)' }}>FINDINGS:</strong><br /><div className="visit-body">{e.findings}</div></div>}
                {e.medsChange && <div style={{ marginBottom: 10 }}><strong style={{ fontSize: 13, color: 'var(--gray-600)' }}>MEDICATION CHANGES:</strong><br /><div className="visit-body">{e.medsChange}</div></div>}
                {e.actions && <div style={{ marginBottom: 10 }}><strong style={{ fontSize: 13, color: 'var(--gray-600)' }}>ACTION ITEMS:</strong><br /><div className="visit-body">{e.actions}</div></div>}
                {e.tags && (
                  <div className="visit-tags">
                    {e.tags.split(',').map((t, i) => <span key={i} className="visit-tag">{t.trim()}</span>)}
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
