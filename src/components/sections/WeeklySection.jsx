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

const inputCls = 'px-3.5 py-3 border-2 border-gray-200 rounded-xl font-sans text-base text-gray-800 bg-stone-50 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-600/10 w-full'
const subTabBase = 'px-5 py-2.5 border-none bg-transparent cursor-pointer text-sm font-bold border-b-[3px] -mb-0.5 transition-colors font-sans'

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

  const hintCls = { ok: 'text-green-600 text-xs mt-1 font-bold', warn: 'text-amber-500 text-xs mt-1 font-bold', error: 'text-rose-600 text-xs mt-1 font-bold' }

  return (
    <section>
      <div className="mb-7">
        <h2 className="font-serif text-3xl text-gray-800 mb-1.5">
          <i className="fa-solid fa-chart-bar mr-2 text-rose-500" />Weekly Check-In
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed">Do this once a week — ideally on the same day each week. This captures bigger-picture health trends.</p>
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
            <i className="fa-solid fa-calendar text-teal-600" />This Week's Check-In
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-extrabold uppercase tracking-[0.4px] text-gray-600">Week of</label>
              <input type="date" value={form.date} onChange={e => set('date', e.target.value)} className={inputCls} />
            </div>
          </div>

          <div className="text-[15px] font-extrabold text-gray-800 mb-3 flex items-center gap-2">
            <i className="fa-solid fa-person-walking text-teal-600" />Activity &amp; Exercise
          </div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 mb-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-extrabold uppercase tracking-[0.4px] text-gray-600">Days Active This Week</label>
              <select value={form.activeDays} onChange={e => set('activeDays', e.target.value)} className={inputCls}>
                <option value="">-- Select --</option>
                {[0,1,2,3,4,5,6,7].map(n => <option key={n} value={n}>{n} day{n !== 1 ? 's' : ''}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-extrabold uppercase tracking-[0.4px] text-gray-600">Typical Activity Type</label>
              <select value={form.activityType} onChange={e => set('activityType', e.target.value)} className={inputCls}>
                <option value="">-- Select --</option>
                <option value="bed-rest">Mostly bed rest</option>
                <option value="light-indoor">Light indoor movement</option>
                <option value="short-walks">Short walks (&lt; 10 min)</option>
                <option value="walks">Walks (10–30 min)</option>
                <option value="moderate">Moderate exercise</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-extrabold uppercase tracking-[0.4px] text-gray-600">Avg Daily Steps <span className="text-gray-400 normal-case font-semibold">(if tracked)</span></label>
              <input type="number" value={form.steps} onChange={e => set('steps', e.target.value)} placeholder="e.g. 3500" className={inputCls} />
              {stepsHint && <div className={hintCls[stepsHint.level]}>{stepsHint.msg}</div>}
            </div>
          </div>

          <div className="text-[15px] font-extrabold text-gray-800 mb-3 flex items-center gap-2">
            <i className="fa-solid fa-utensils text-teal-600" />Diet &amp; Fluid Intake
          </div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 mb-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-extrabold uppercase tracking-[0.4px] text-gray-600">Sodium Adherence</label>
              <select value={form.sodium} onChange={e => set('sodium', e.target.value)} className={inputCls}>
                <option value="">-- Select --</option>
                <option value="excellent">✅ Excellent (&lt;2000mg most days)</option>
                <option value="good">🙂 Good (occasional slips)</option>
                <option value="fair">⚠️ Fair (frequent high-sodium days)</option>
                <option value="poor">❌ Poor (no restriction)</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-extrabold uppercase tracking-[0.4px] text-gray-600">Fluid Restriction Adherence</label>
              <select value={form.fluids} onChange={e => set('fluids', e.target.value)} className={inputCls}>
                <option value="">-- Select --</option>
                <option value="good">✅ Staying within limit</option>
                <option value="fair">⚠️ Sometimes over limit</option>
                <option value="poor">❌ Frequently over limit</option>
                <option value="unsure">❓ Unsure / not tracking</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-extrabold uppercase tracking-[0.4px] text-gray-600">Alcohol This Week</label>
              <select value={form.alcohol} onChange={e => set('alcohol', e.target.value)} className={inputCls}>
                <option value="">-- Select --</option>
                <option value="none">None</option>
                <option value="1-2">1–2 drinks</option>
                <option value="3-5">3–5 drinks</option>
                <option value="more">More than 5</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-extrabold uppercase tracking-[0.4px] text-gray-600">Tobacco Use</label>
              <select value={form.tobacco} onChange={e => set('tobacco', e.target.value)} className={inputCls}>
                <option value="">-- Select --</option>
                <option value="none">None / Non-smoker</option>
                <option value="quit-attempt">Attempting to quit</option>
                <option value="reduced">Reduced</option>
                <option value="same">Same as usual</option>
                <option value="increased">Increased</option>
              </select>
            </div>
          </div>

          <div className="text-[15px] font-extrabold text-gray-800 mb-3 flex items-center gap-2">
            <i className="fa-solid fa-pills text-teal-600" />Medications &amp; Appointments
          </div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 mb-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-extrabold uppercase tracking-[0.4px] text-gray-600">Medication Adherence This Week</label>
              <select value={form.meds} onChange={e => set('meds', e.target.value)} className={inputCls}>
                <option value="">-- Select --</option>
                <option value="all">✅ All doses taken</option>
                <option value="mostly">🙂 Mostly (missed 1–2)</option>
                <option value="some">⚠️ Some missed</option>
                <option value="poor">❌ Many missed</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-extrabold uppercase tracking-[0.4px] text-gray-600">Any New Symptoms This Week?</label>
              <select value={form.newSymptoms} onChange={e => set('newSymptoms', e.target.value)} className={inputCls}>
                <option value="none">No new symptoms</option>
                <option value="minor">Minor new symptoms</option>
                <option value="notable">Notable new symptoms</option>
                <option value="serious">Serious / called doctor</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 mb-6">
            <label className="text-xs font-extrabold uppercase tracking-[0.4px] text-gray-600">Weekly Summary Notes</label>
            <textarea
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
              placeholder="Overall how was Bill this week? Any patterns, concerns, improvements to note..."
              className={inputCls + ' resize-y min-h-[100px]'}
            />
          </div>

          <div className="flex items-center gap-3 mt-6 pt-5 border-t-2 border-gray-100">
            <button
              className="px-8 py-3.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-sans text-[17px] font-extrabold transition active:scale-[0.98] cursor-pointer"
              onClick={handleSave}
            >
              <i className="fa-solid fa-floppy-disk mr-2" />{editingId ? 'Update Check-In' : 'Save Weekly Check-In'}
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
          <div className="text-base font-extrabold text-gray-600 mb-3 uppercase tracking-[0.5px]">Weekly Check-In History</div>
          {entries.length === 0 ? (
            <div className="text-center py-16 px-6 text-gray-400">
              <i className="fa-solid fa-chart-bar text-5xl mb-3 block" />
              <p className="text-base">No weekly check-ins yet.</p>
            </div>
          ) : entries.map(e => (
            <div key={e.id} className="bg-white rounded-2xl p-7 shadow-sm mb-5 border-l-4 border-teal-600">
              <div className="flex justify-between items-start flex-wrap gap-2 mb-3">
                <div>
                  <div className="font-extrabold text-base text-gray-800">Week of {formatDate(e.date)}</div>
                  <div className="text-[13px] text-gray-400 mt-0.5">Active {e.activeDays || '?'} days · {e.activityType || '—'}</div>
                </div>
                {isEditor && (
                  <button
                    className="px-2.5 py-1 bg-teal-50 text-teal-600 border border-teal-600 rounded text-xs font-bold hover:bg-teal-600 hover:text-white transition whitespace-nowrap cursor-pointer"
                    onClick={() => handleEdit(e.id)}
                  >
                    <i className="fa-solid fa-pen mr-1" />Edit
                  </button>
                )}
              </div>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-2 text-[13px] text-gray-600">
                <div><i className="fa-solid fa-shaker mr-1 text-gray-400" />Sodium: {e.sodium || '—'}</div>
                <div><i className="fa-solid fa-droplet mr-1 text-gray-400" />Fluids: {e.fluids || '—'}</div>
                <div><i className="fa-solid fa-pills mr-1 text-gray-400" />Meds: {e.meds || '—'}</div>
                <div><i className="fa-solid fa-smoking mr-1 text-gray-400" />Tobacco: {e.tobacco || '—'}</div>
                {e.steps && <div><i className="fa-solid fa-shoe-prints mr-1 text-gray-400" />Steps: {e.steps}/day</div>}
                {e.alcohol && <div><i className="fa-solid fa-wine-bottle mr-1 text-gray-400" />Alcohol: {e.alcohol}</div>}
                {e.newSymptoms && e.newSymptoms !== 'none' && <div><i className="fa-solid fa-stethoscope mr-1 text-gray-400" />Symptoms: {e.newSymptoms}</div>}
              </div>
              {e.notes && (
                <div className="mt-3 text-sm leading-relaxed text-gray-600 border-t border-gray-100 pt-3">
                  {e.notes}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
