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

const inp = 'w-full px-3 py-2 border border-gray-200 rounded-md text-sm text-gray-900 bg-white outline-none transition focus:border-teal-600 focus:ring-1 focus:ring-teal-600/20'
const lbl = 'block text-xs font-semibold text-gray-600 mb-1'
const subTabBase = 'px-3.5 py-2 border-none bg-transparent cursor-pointer text-xs font-semibold border-b-2 -mb-px transition-colors font-sans uppercase tracking-wide'
const subHead = 'text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-2 mt-4 flex items-center gap-1.5 first:mt-0'

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
    setSaveStatus('Saved!')
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
    <section>
      <div className="mb-4">
        <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
          <i className="fa-solid fa-hospital text-amber-500 text-sm" />Doctor Visits
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">Record notes from each appointment. Bring summaries to help the doctor see patterns.</p>
      </div>

      <div className="flex border-b border-gray-200 mb-4">
        {isEditor && (
          <button className={subTabBase + (subTab === 'log' ? ' text-teal-600 border-teal-600' : ' text-gray-500 border-transparent hover:text-gray-700')} onClick={() => setSubTab('log')}>
            <i className="fa-solid fa-pen-to-square mr-1" />Log
          </button>
        )}
        <button className={subTabBase + (subTab === 'history' ? ' text-teal-600 border-teal-600' : ' text-gray-500 border-transparent hover:text-gray-700')} onClick={() => setSubTab('history')}>
          <i className="fa-solid fa-clock-rotate-left mr-1" />History
        </button>
      </div>

      {subTab === 'log' && isEditor && (
        <div className="mb-4">
          <EditingBanner visible={!!editingId} onCancel={handleCancelEdit} />

          <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-sm mb-3">
            <div className={subHead}><i className="fa-solid fa-calendar text-blue-400" />Visit Details</div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className={lbl}>Doctor / Provider</label><input type="text" value={form.doctor} onChange={e => set('doctor', e.target.value)} placeholder="e.g. Dr. Smith" className={inp} /></div>
              <div>
                <label className={lbl}>Type of Visit</label>
                <select value={form.type} onChange={e => set('type', e.target.value)} className={inp}>
                  <option value="cardiology">Cardiology Follow-Up</option>
                  <option value="ep">EP (Electrophysiology)</option>
                  <option value="primary">Primary Care</option>
                  <option value="er">Emergency / ER</option>
                  <option value="test">Test / Procedure</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div><label className={lbl}>Date of Visit</label><input type="date" value={form.date} onChange={e => set('date', e.target.value)} className={inp} /></div>
              <div><label className={lbl}>Next Appointment</label><input type="date" value={form.nextDate} onChange={e => set('nextDate', e.target.value)} className={inp} /></div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-sm mb-3">
            <div className={subHead}><i className="fa-solid fa-notes-medical text-rose-400" />Clinical Notes</div>
            <div className="flex flex-col gap-3">
              <div>
                <label className={lbl}>Reason / Concerns Brought</label>
                <textarea value={form.reason} onChange={e => set('reason', e.target.value)} placeholder="What we wanted to discuss…" className={inp + ' resize-y min-h-[80px]'} />
              </div>
              <div>
                <label className={lbl}>Doctor's Findings &amp; Notes</label>
                <textarea value={form.findings} onChange={e => set('findings', e.target.value)} placeholder="What the doctor said, exam findings, test results…" className={inp + ' resize-y min-h-[80px]'} />
              </div>
              <div>
                <label className={lbl}>Medications Changed</label>
                <textarea value={form.medsChange} onChange={e => set('medsChange', e.target.value)} placeholder="New prescriptions, dosage changes, stopped meds…" className={inp + ' resize-y min-h-[80px]'} />
              </div>
              <div>
                <label className={lbl}>Action Items / Follow-Up</label>
                <textarea value={form.actions} onChange={e => set('actions', e.target.value)} placeholder="Tests ordered, referrals, things to do…" className={inp + ' resize-y min-h-[80px]'} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-sm mb-3">
            <label className={lbl}>Tags <span className="font-normal text-gray-500">comma-separated</span></label>
            <input type="text" value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="e.g. EF stable, new medication, weight up" className={inp} />
          </div>

          <button className="w-full px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-md font-sans text-sm font-semibold transition cursor-pointer" onClick={handleSave}>
            <i className="fa-solid fa-floppy-disk mr-1.5" />{editingId ? 'Update Visit' : 'Save Visit'}
          </button>
          {saveStatus && <div className="text-center mt-2 text-xs font-semibold text-green-600"><i className="fa-solid fa-circle-check mr-1" />{saveStatus}</div>}
        </div>
      )}

      {subTab === 'history' && (
        <div>
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Visit History</div>
          {entries.length === 0 ? (
            <div className="text-center py-12 text-gray-500"><i className="fa-solid fa-hospital text-3xl mb-2 block" /><p className="text-sm">No visits logged yet.</p></div>
          ) : entries.map(e => (
            <div key={e.id} className="bg-white rounded-lg border border-gray-100 p-4 shadow-sm mb-3">
              <div className="flex justify-between items-start flex-wrap gap-2 mb-3">
                <div>
                  <div className="font-semibold text-sm text-gray-900">{e.doctor || TYPE_LABEL[e.type] || 'Doctor Visit'}</div>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-[11px] font-semibold text-white bg-teal-600 px-2 py-0.5 rounded">{formatDate(e.date)}</span>
                    <span className="text-[11px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{TYPE_LABEL[e.type]}</span>
                    {e.nextDate && <span className="text-[11px] text-gray-500">Next: {formatDate(e.nextDate)}</span>}
                  </div>
                </div>
                {isEditor && (
                  <button className="px-2 py-0.5 text-teal-600 border border-teal-200 rounded text-[11px] font-semibold hover:bg-teal-600 hover:text-white transition cursor-pointer" onClick={() => handleEdit(e.id)}>
                    Edit
                  </button>
                )}
              </div>
              {(e.reason || e.findings || e.medsChange || e.actions) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs">
                  {e.reason && <div><div className="text-[10px] font-semibold uppercase tracking-wide text-gray-500 mb-0.5">Reason</div><div className="text-gray-700 whitespace-pre-wrap leading-relaxed">{e.reason}</div></div>}
                  {e.findings && <div><div className="text-[10px] font-semibold uppercase tracking-wide text-gray-500 mb-0.5">Findings</div><div className="text-gray-700 whitespace-pre-wrap leading-relaxed">{e.findings}</div></div>}
                  {e.medsChange && <div><div className="text-[10px] font-semibold uppercase tracking-wide text-gray-500 mb-0.5">Medication Changes</div><div className="text-gray-700 whitespace-pre-wrap leading-relaxed">{e.medsChange}</div></div>}
                  {e.actions && <div><div className="text-[10px] font-semibold uppercase tracking-wide text-gray-500 mb-0.5">Action Items</div><div className="text-gray-700 whitespace-pre-wrap leading-relaxed">{e.actions}</div></div>}
                </div>
              )}
              {e.tags && (
                <div className="flex flex-wrap gap-1.5 mt-3 pt-2 border-t border-gray-100">
                  {e.tags.split(',').map((t, i) => (
                    <span key={i} className="bg-teal-50 text-teal-600 rounded px-2 py-0.5 text-[11px] font-medium">{t.trim()}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
