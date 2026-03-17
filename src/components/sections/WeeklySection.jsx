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

const inp = 'w-full px-3 py-2 border border-gray-200 rounded-md text-sm text-gray-900 bg-white outline-none transition focus:border-teal-600 focus:ring-1 focus:ring-teal-600/20'
const lbl = 'block text-xs font-semibold text-gray-600 mb-1'
const subTabBase = 'px-3.5 py-2 border-none bg-transparent cursor-pointer text-xs font-semibold border-b-2 -mb-px transition-colors font-sans uppercase tracking-wide'
const subHead = 'text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-2 mt-4 flex items-center gap-1.5 first:mt-0'

export default function WeeklySection({ entries, isEditor, onSave }) {
  const [subTab, setSubTab] = useState(isEditor ? 'log' : 'history')
  const [form, setForm] = useState(EMPTY_FORM)
  const [editingId, setEditingId] = useState(null)
  const [saveStatus, setSaveStatus] = useState('')

  function set(field, value) { setForm(prev => ({ ...prev, [field]: value })) }
  const stepsHint = getStepsHint(form.steps)
  const hintCls = { ok: 'text-green-600 text-[11px] mt-0.5 font-semibold', warn: 'text-amber-500 text-[11px] mt-0.5 font-semibold', error: 'text-rose-600 text-[11px] mt-0.5 font-semibold' }

  function handleSave() {
    if (!form.date) { alert('Please enter a date.'); return }
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
    <section>
      <div className="mb-4">
        <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
          <i className="fa-solid fa-chart-bar text-teal-500 text-sm" />Weekly Check-In
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">Once a week — ideally on the same day. Captures bigger-picture health trends.</p>
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
            <div className={subHead}><i className="fa-solid fa-calendar text-blue-400" />Week</div>
            <div>
              <label className={lbl}>Week of</label>
              <input type="date" value={form.date} onChange={e => set('date', e.target.value)} className={inp} />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-sm mb-3">
            <div className={subHead}><i className="fa-solid fa-person-walking text-green-500" />Activity &amp; Exercise</div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={lbl}>Days Active</label>
                <select value={form.activeDays} onChange={e => set('activeDays', e.target.value)} className={inp}>
                  <option value="">— Select —</option>
                  {[0,1,2,3,4,5,6,7].map(n => <option key={n} value={n}>{n} day{n !== 1 ? 's' : ''}</option>)}
                </select>
              </div>
              <div>
                <label className={lbl}>Activity Type</label>
                <select value={form.activityType} onChange={e => set('activityType', e.target.value)} className={inp}>
                  <option value="">— Select —</option>
                  <option value="bed-rest">Mostly bed rest</option>
                  <option value="light-indoor">Light indoor movement</option>
                  <option value="short-walks">Short walks (&lt; 10 min)</option>
                  <option value="walks">Walks (10–30 min)</option>
                  <option value="moderate">Moderate exercise</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className={lbl}>Avg Daily Steps <span className="font-normal text-gray-500">(if tracked)</span></label>
                <input type="number" value={form.steps} onChange={e => set('steps', e.target.value)} placeholder="e.g. 3500" className={inp} />
                {stepsHint && <div className={hintCls[stepsHint.level]}>{stepsHint.msg}</div>}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-sm mb-3">
            <div className={subHead}><i className="fa-solid fa-utensils text-orange-400" />Diet &amp; Fluids</div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={lbl}>Sodium Adherence</label>
                <select value={form.sodium} onChange={e => set('sodium', e.target.value)} className={inp}>
                  <option value="">— Select —</option>
                  <option value="excellent">✅ Excellent (&lt;2000mg)</option>
                  <option value="good">🙂 Good (occasional slips)</option>
                  <option value="fair">⚠️ Fair (frequent high days)</option>
                  <option value="poor">❌ Poor (no restriction)</option>
                </select>
              </div>
              <div>
                <label className={lbl}>Fluid Restriction</label>
                <select value={form.fluids} onChange={e => set('fluids', e.target.value)} className={inp}>
                  <option value="">— Select —</option>
                  <option value="good">✅ Within limit</option>
                  <option value="fair">⚠️ Sometimes over</option>
                  <option value="poor">❌ Frequently over</option>
                  <option value="unsure">❓ Not tracking</option>
                </select>
              </div>
              <div>
                <label className={lbl}>Alcohol This Week</label>
                <select value={form.alcohol} onChange={e => set('alcohol', e.target.value)} className={inp}>
                  <option value="">— Select —</option>
                  <option value="none">None</option>
                  <option value="1-2">1–2 drinks</option>
                  <option value="3-5">3–5 drinks</option>
                  <option value="more">More than 5</option>
                </select>
              </div>
              <div>
                <label className={lbl}>Tobacco Use</label>
                <select value={form.tobacco} onChange={e => set('tobacco', e.target.value)} className={inp}>
                  <option value="">— Select —</option>
                  <option value="none">None / Non-smoker</option>
                  <option value="quit-attempt">Attempting to quit</option>
                  <option value="reduced">Reduced</option>
                  <option value="same">Same as usual</option>
                  <option value="increased">Increased</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-sm mb-3">
            <div className={subHead}><i className="fa-solid fa-pills text-purple-400" />Medications &amp; Symptoms</div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={lbl}>Medication Adherence</label>
                <select value={form.meds} onChange={e => set('meds', e.target.value)} className={inp}>
                  <option value="">— Select —</option>
                  <option value="all">✅ All doses taken</option>
                  <option value="mostly">🙂 Mostly (missed 1–2)</option>
                  <option value="some">⚠️ Some missed</option>
                  <option value="poor">❌ Many missed</option>
                </select>
              </div>
              <div>
                <label className={lbl}>New Symptoms</label>
                <select value={form.newSymptoms} onChange={e => set('newSymptoms', e.target.value)} className={inp}>
                  <option value="none">None</option>
                  <option value="minor">Minor</option>
                  <option value="notable">Notable</option>
                  <option value="serious">Serious / called doctor</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-sm mb-3">
            <div className={subHead}><i className="fa-solid fa-note-sticky text-yellow-400" />Notes</div>
            <textarea
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
              placeholder="Overall how was Bill this week? Any patterns, concerns, improvements…"
              className={inp + ' resize-y min-h-[80px]'}
            />
          </div>

          <button className="w-full px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-md font-sans text-sm font-semibold transition cursor-pointer" onClick={handleSave}>
            <i className="fa-solid fa-floppy-disk mr-1.5" />{editingId ? 'Update Check-In' : 'Save Check-In'}
          </button>
          {saveStatus && <div className="text-center mt-2 text-xs font-semibold text-green-600"><i className="fa-solid fa-circle-check mr-1" />{saveStatus}</div>}
        </div>
      )}

      {subTab === 'history' && (
        <div>
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Check-In History</div>
          {entries.length === 0 ? (
            <div className="text-center py-12 text-gray-500"><i className="fa-solid fa-chart-bar text-3xl mb-2 block" /><p className="text-sm">No weekly check-ins yet.</p></div>
          ) : entries.map(e => {
            const details = [
              ['Active Days', e.activeDays != null && e.activeDays !== '' ? e.activeDays + ' days' : null],
              ['Activity', e.activityType || null],
              ['Avg Steps', e.steps ? e.steps + '/day' : null],
              ['Sodium', e.sodium || null],
              ['Fluids', e.fluids || null],
              ['Alcohol', e.alcohol || null],
              ['Tobacco', e.tobacco || null],
              ['Medications', e.meds || null],
              ['New Symptoms', e.newSymptoms && e.newSymptoms !== 'none' ? e.newSymptoms : null],
            ].filter(([, v]) => v)
            return (
              <div key={e.id} className="bg-white rounded-lg border border-gray-100 p-4 shadow-sm mb-3">
                <div className="flex justify-between items-start flex-wrap gap-2 mb-3">
                  <div className="font-semibold text-sm text-gray-900">Week of {formatDate(e.date)}</div>
                  {isEditor && (
                    <button className="px-2 py-0.5 text-teal-600 border border-teal-200 rounded text-[11px] font-semibold hover:bg-teal-600 hover:text-white transition cursor-pointer" onClick={() => handleEdit(e.id)}>
                      Edit
                    </button>
                  )}
                </div>
                {details.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1.5 text-xs">
                    {details.map(([label, val]) => (
                      <div key={label} className="flex justify-between gap-2">
                        <span className="text-gray-500 font-medium">{label}</span>
                        <span className="text-gray-800 font-semibold text-right">{val}</span>
                      </div>
                    ))}
                  </div>
                )}
                {e.notes && <div className="mt-2 pt-2 border-t border-gray-100 text-xs text-gray-600 leading-relaxed">{e.notes}</div>}
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
