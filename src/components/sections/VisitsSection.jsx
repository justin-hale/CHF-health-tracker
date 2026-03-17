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

const inputCls = 'px-3.5 py-3 border-2 border-gray-200 rounded-xl font-sans text-base text-gray-800 bg-stone-50 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-600/10 w-full'
const subTabBase = 'px-5 py-2.5 border-none bg-transparent cursor-pointer text-sm font-bold border-b-[3px] -mb-0.5 transition-colors font-sans'

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
      <div className="mb-7">
        <h2 className="font-serif text-3xl text-gray-800 mb-1.5">
          <i className="fa-solid fa-hospital mr-2 text-rose-500" />Doctor Visits
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed">Record notes from each appointment. Bring these summaries to help the doctor see patterns over time.</p>
      </div>

      <div className="flex border-b-2 border-gray-200 mb-5">
        {isEditor && (
          <button
            className={subTabBase + (subTab === 'log' ? ' text-teal-600 border-teal-600' : ' text-gray-400 border-transparent hover:text-gray-700')}
            onClick={() => setSubTab('log')}
          >
            <i className="fa-solid fa-pen-to-square mr-1.5" />Log
          </button>
        )}
        <button
          className={subTabBase + (subTab === 'history' ? ' text-teal-600 border-teal-600' : ' text-gray-400 border-transparent hover:text-gray-700')}
          onClick={() => setSubTab('history')}
        >
          <i className="fa-solid fa-clock-rotate-left mr-1.5" />History
        </button>
      </div>

      {subTab === 'log' && isEditor && (
        <div className="bg-white rounded-2xl p-7 shadow-sm mb-5">
          <EditingBanner visible={!!editingId} onCancel={handleCancelEdit} />
          <div className="text-lg font-extrabold text-gray-800 mb-5 flex items-center gap-2">
            <i className="fa-solid fa-pen-to-square text-teal-600" />Log a Visit
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-extrabold uppercase tracking-[0.4px] text-gray-600">Date of Visit</label>
              <input type="date" value={form.date} onChange={e => set('date', e.target.value)} className={inputCls} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-extrabold uppercase tracking-[0.4px] text-gray-600">Doctor / Provider</label>
              <input type="text" value={form.doctor} onChange={e => set('doctor', e.target.value)} placeholder="e.g. Dr. Smith — Cardiology" className={inputCls} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-extrabold uppercase tracking-[0.4px] text-gray-600">Type of Visit</label>
              <select value={form.type} onChange={e => set('type', e.target.value)} className={inputCls}>
                <option value="cardiology">Cardiology Follow-Up</option>
                <option value="ep">EP (Electrophysiology)</option>
                <option value="primary">Primary Care</option>
                <option value="er">Emergency / ER</option>
                <option value="test">Test / Procedure</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-extrabold uppercase tracking-[0.4px] text-gray-600">Next Appointment</label>
              <input type="date" value={form.nextDate} onChange={e => set('nextDate', e.target.value)} className={inputCls} />
            </div>
          </div>

          <div className="flex flex-col gap-1.5 mb-4">
            <label className="text-xs font-extrabold uppercase tracking-[0.4px] text-gray-600">Reason for Visit / Concerns Brought</label>
            <textarea value={form.reason} onChange={e => set('reason', e.target.value)} placeholder="What we wanted to discuss..." className={inputCls + ' resize-y min-h-[100px]'} />
          </div>
          <div className="flex flex-col gap-1.5 mb-4">
            <label className="text-xs font-extrabold uppercase tracking-[0.4px] text-gray-600">Doctor's Findings &amp; Notes</label>
            <textarea value={form.findings} onChange={e => set('findings', e.target.value)} style={{ minHeight: 140 }} placeholder="What the doctor said, exam findings, test results reviewed..." className={inputCls + ' resize-y'} />
          </div>
          <div className="flex flex-col gap-1.5 mb-4">
            <label className="text-xs font-extrabold uppercase tracking-[0.4px] text-gray-600">Medications Changed</label>
            <textarea value={form.medsChange} onChange={e => set('medsChange', e.target.value)} placeholder="Any new prescriptions, dosage changes, or medications stopped..." className={inputCls + ' resize-y min-h-[100px]'} />
          </div>
          <div className="flex flex-col gap-1.5 mb-4">
            <label className="text-xs font-extrabold uppercase tracking-[0.4px] text-gray-600">Action Items / Follow-Up</label>
            <textarea value={form.actions} onChange={e => set('actions', e.target.value)} placeholder="Things we need to do, tests ordered, referrals made..." className={inputCls + ' resize-y min-h-[100px]'} />
          </div>
          <div className="flex flex-col gap-1.5 mb-6">
            <label className="text-xs font-extrabold uppercase tracking-[0.4px] text-gray-600">Tags / Keywords <span className="text-gray-400 normal-case font-semibold">comma-separated</span></label>
            <input type="text" value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="e.g. EF stable, new medication, weight up" className={inputCls} />
          </div>

          <div className="flex items-center gap-3 mt-6 pt-5 border-t-2 border-gray-100">
            <button
              className="px-8 py-3.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-sans text-[17px] font-extrabold transition active:scale-[0.98] cursor-pointer"
              onClick={handleSave}
            >
              <i className="fa-solid fa-floppy-disk mr-2" />{editingId ? 'Update Visit' : 'Save Visit Notes'}
            </button>
            {saveStatus && (
              <span className="text-sm font-bold text-green-600">
                <i className="fa-solid fa-circle-check mr-1" />{saveStatus}
              </span>
            )}
          </div>
        </div>
      )}

      {subTab === 'history' && (
        <div>
          <div className="text-base font-extrabold text-gray-600 mb-3 uppercase tracking-[0.5px]">Visit History</div>
          {entries.length === 0 ? (
            <div className="text-center py-16 px-6 text-gray-400">
              <i className="fa-solid fa-hospital text-5xl mb-3 block" />
              <p className="text-base">No visits logged yet.</p>
            </div>
          ) : entries.map(e => (
            <div key={e.id} className="bg-white rounded-2xl p-6 shadow-sm mb-4">
              <div className="flex justify-between items-start flex-wrap gap-2 mb-4">
                <div>
                  <div className="font-serif text-xl text-gray-800">{e.doctor || TYPE_LABEL[e.type] || 'Doctor Visit'}</div>
                  {e.nextDate && <div className="text-[13px] text-gray-400 mt-1">Next appointment: {formatDate(e.nextDate)}</div>}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-white bg-teal-600 px-3 py-1 rounded-full">{formatDate(e.date)}</span>
                  {isEditor && (
                    <button
                      className="px-2.5 py-1 bg-teal-50 text-teal-600 border border-teal-600 rounded text-xs font-bold hover:bg-teal-600 hover:text-white transition whitespace-nowrap cursor-pointer"
                      onClick={() => handleEdit(e.id)}
                    >
                      <i className="fa-solid fa-pen mr-1" />Edit
                    </button>
                  )}
                </div>
              </div>
              {e.reason && <div className="mb-2.5"><strong className="text-[13px] text-gray-600 uppercase tracking-wide">Reason:</strong><br /><div className="text-[15px] leading-[1.7] text-gray-600 whitespace-pre-wrap">{e.reason}</div></div>}
              {e.findings && <div className="mb-2.5"><strong className="text-[13px] text-gray-600 uppercase tracking-wide">Findings:</strong><br /><div className="text-[15px] leading-[1.7] text-gray-600 whitespace-pre-wrap">{e.findings}</div></div>}
              {e.medsChange && <div className="mb-2.5"><strong className="text-[13px] text-gray-600 uppercase tracking-wide">Medication Changes:</strong><br /><div className="text-[15px] leading-[1.7] text-gray-600 whitespace-pre-wrap">{e.medsChange}</div></div>}
              {e.actions && <div className="mb-2.5"><strong className="text-[13px] text-gray-600 uppercase tracking-wide">Action Items:</strong><br /><div className="text-[15px] leading-[1.7] text-gray-600 whitespace-pre-wrap">{e.actions}</div></div>}
              {e.tags && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {e.tags.split(',').map((t, i) => (
                    <span key={i} className="bg-teal-50 text-teal-600 rounded-full px-3 py-1 text-xs font-bold">{t.trim()}</span>
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
