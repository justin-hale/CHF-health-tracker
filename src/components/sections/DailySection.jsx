import { useState } from 'react'
import EditingBanner from '../EditingBanner.jsx'
import { getDailyHints, getDailyAlerts } from '../../utils/alerts.js'
import { formatDate, getBPFlag, formatSymptoms } from '../../utils/formatters.js'
import TrendsSection from './TrendsSection.jsx'

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

const inputCls = 'px-3.5 py-3 border-2 border-gray-200 rounded-xl font-sans text-base text-gray-800 bg-stone-50 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-600/10 w-full'
const selectCls = inputCls
const hintCls = { ok: 'text-green-600 text-xs mt-1 font-bold', warn: 'text-amber-500 text-xs mt-1 font-bold', error: 'text-rose-600 text-xs mt-1 font-bold' }
const flagDotCls = { ok: 'bg-green-600', warn: 'bg-amber-500', alert: 'bg-rose-600' }
const subTabBase = 'px-5 py-2.5 border-none bg-transparent cursor-pointer text-sm font-bold border-b-[3px] -mb-0.5 transition-colors font-sans'

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
    return <div className={hintCls[hint.level]}>{hint.msg}</div>
  }

  const sleepLabel = { good: 'Good', fair: 'Fair', poor: 'Poor' }
  const energyLabel = { '5': 'Great', '4': 'Good', '3': 'OK', '2': 'Low', '1': 'Very Low' }
  const medsIcon = e => e.meds === 'yes'
    ? <i className="fa-solid fa-circle-check text-green-600" />
    : e.meds === 'partial'
    ? <i className="fa-solid fa-triangle-exclamation text-amber-500" />
    : e.meds === 'no'
    ? <i className="fa-solid fa-circle-xmark text-rose-600" />
    : '—'

  return (
    <section>
      <div className="mb-7">
        <h2 className="font-serif text-3xl text-gray-800 mb-1.5">
          <i className="fa-solid fa-calendar-day mr-2 text-rose-500" />Daily Log
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed">Track Bill's vitals and symptoms every day. Morning is the best time for weight and blood pressure readings.</p>
      </div>

      {alerts.length > 0 && (
        <div
          className="bg-red-50 border-2 border-red-300 rounded-xl px-4 py-3.5 mb-5 text-[15px] font-bold text-rose-800"
          dangerouslySetInnerHTML={{ __html: '<i class="fa-solid fa-triangle-exclamation mr-2"></i>' + alerts.join('<br/>') }}
        />
      )}

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
        <button
          className={subTabBase + (subTab === 'trends' ? ' text-teal-600 border-teal-600' : ' text-gray-400 border-transparent hover:text-gray-700')}
          onClick={() => setSubTab('trends')}
        >
          <i className="fa-solid fa-chart-line mr-1.5" />Trends
        </button>
      </div>

      {subTab === 'log' && isEditor && (
        <div className="bg-white rounded-2xl p-7 shadow-sm mb-5">
          <EditingBanner visible={!!editingId} onCancel={handleCancelEdit} />
          <div className="text-lg font-extrabold text-gray-800 mb-5 flex items-center gap-2">
            <i className="fa-solid fa-calendar text-teal-600" />Today's Entry
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-extrabold uppercase tracking-[0.4px] text-gray-600">Date</label>
              <input type="date" value={form.date} onChange={e => set('date', e.target.value)} className={inputCls} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-extrabold uppercase tracking-[0.4px] text-gray-600">Time of Reading</label>
              <input type="time" value={form.time} onChange={e => set('time', e.target.value)} className={inputCls} />
            </div>
          </div>

          <div className="text-[15px] font-extrabold text-gray-800 mb-3 flex items-center gap-2">
            <i className="fa-solid fa-heart text-rose-500" />Heart &amp; Blood Pressure
          </div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 mb-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-extrabold uppercase tracking-[0.4px] text-gray-600">Systolic BP <span className="text-gray-400 normal-case font-semibold">(top number)</span></label>
              <input type="number" value={form.bpSys} onChange={e => set('bpSys', e.target.value)} placeholder="e.g. 130" min="60" max="250" className={inputCls} />
              <Hint hint={hints.bpSys} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-extrabold uppercase tracking-[0.4px] text-gray-600">Diastolic BP <span className="text-gray-400 normal-case font-semibold">(bottom number)</span></label>
              <input type="number" value={form.bpDia} onChange={e => set('bpDia', e.target.value)} placeholder="e.g. 80" min="40" max="150" className={inputCls} />
              <Hint hint={hints.bpDia} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-extrabold uppercase tracking-[0.4px] text-gray-600">Heart Rate <span className="text-gray-400 normal-case font-semibold">bpm</span></label>
              <input type="number" value={form.hr} onChange={e => set('hr', e.target.value)} placeholder="e.g. 72" min="30" max="200" className={inputCls} />
              <Hint hint={hints.hr} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-extrabold uppercase tracking-[0.4px] text-gray-600">Oxygen Saturation <span className="text-gray-400 normal-case font-semibold">% (if measured)</span></label>
              <input type="number" value={form.o2} onChange={e => set('o2', e.target.value)} placeholder="e.g. 97" min="80" max="100" className={inputCls} />
              <Hint hint={hints.o2} />
            </div>
          </div>

          <div className="text-[15px] font-extrabold text-gray-800 mb-3 flex items-center gap-2">
            <i className="fa-solid fa-scale-balanced text-teal-600" />Weight
          </div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 mb-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-extrabold uppercase tracking-[0.4px] text-gray-600">Morning Weight <span className="text-gray-400 normal-case font-semibold">lbs — after bathroom, before eating</span></label>
              <input type="number" value={form.weight} onChange={e => set('weight', e.target.value)} placeholder="e.g. 244" step="0.1" className={inputCls} />
              <Hint hint={hints.weight} />
            </div>
          </div>

          <div className="text-[15px] font-extrabold text-gray-800 mb-3 flex items-center gap-2">
            <i className="fa-solid fa-thermometer-half text-amber-500" />Symptoms
          </div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 mb-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-extrabold uppercase tracking-[0.4px] text-gray-600">Shortness of Breath</label>
              <select value={form.sob} onChange={e => set('sob', e.target.value)} className={selectCls}>
                <option value="">-- Select --</option>
                <option value="none">None</option>
                <option value="mild">Mild (light activity)</option>
                <option value="moderate">Moderate (walking)</option>
                <option value="severe">Severe (at rest)</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-extrabold uppercase tracking-[0.4px] text-gray-600">Swelling (Ankles / Legs)</label>
              <select value={form.swelling} onChange={e => set('swelling', e.target.value)} className={selectCls}>
                <option value="">-- Select --</option>
                <option value="none">None</option>
                <option value="mild">Mild</option>
                <option value="moderate">Moderate</option>
                <option value="severe">Severe</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-extrabold uppercase tracking-[0.4px] text-gray-600">Energy Level</label>
              <select value={form.energy} onChange={e => set('energy', e.target.value)} className={selectCls}>
                <option value="">-- Select --</option>
                <option value="5">😄 Great</option>
                <option value="4">🙂 Good</option>
                <option value="3">😐 OK</option>
                <option value="2">😔 Low</option>
                <option value="1">😞 Very Low / Exhausted</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-extrabold uppercase tracking-[0.4px] text-gray-600">Sleep Quality</label>
              <select value={form.sleep} onChange={e => set('sleep', e.target.value)} className={selectCls}>
                <option value="">-- Select --</option>
                <option value="good">Good (slept well)</option>
                <option value="fair">Fair (some interruptions)</option>
                <option value="poor">Poor (restless / couldn't sleep)</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-extrabold uppercase tracking-[0.4px] text-gray-600">Chest Pain / Pressure?</label>
              <select value={form.chest} onChange={e => set('chest', e.target.value)} className={selectCls}>
                <option value="none">No</option>
                <option value="mild">Mild / discomfort</option>
                <option value="yes">Yes — notable pain</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-extrabold uppercase tracking-[0.4px] text-gray-600">Medications Taken?</label>
              <select value={form.meds} onChange={e => set('meds', e.target.value)} className={selectCls}>
                <option value="yes">✅ All taken</option>
                <option value="partial">⚠️ Missed some</option>
                <option value="no">❌ None taken</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 mb-6">
            <label className="text-xs font-extrabold uppercase tracking-[0.4px] text-gray-600">
              Additional Notes <span className="text-gray-400 normal-case font-semibold">anything unusual — diet, activity, how he seems</span>
            </label>
            <textarea
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
              placeholder="e.g. Bill seemed more tired than usual. Had soup for dinner. Took a short walk around the block..."
              className={inputCls + ' resize-y min-h-[100px]'}
            />
          </div>

          <div className="flex items-center gap-3 mt-6 pt-5 border-t-2 border-gray-100">
            <button
              className="px-8 py-3.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-sans text-[17px] font-extrabold transition active:scale-[0.98] cursor-pointer"
              onClick={handleSave}
            >
              <i className="fa-solid fa-floppy-disk mr-2" />{editingId ? 'Update Entry' : 'Save Daily Entry'}
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
          <div className="text-base font-extrabold text-gray-600 mb-3 uppercase tracking-[0.5px]">Recent Daily Entries</div>
          {entries.length === 0 ? (
            <div className="text-center py-16 px-6 text-gray-400">
              <i className="fa-solid fa-clipboard-list text-5xl mb-3 block" />
              <p className="text-base">No entries yet. Start logging daily to see history here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr>
                    <th className="text-left px-3 py-2.5 bg-gray-100 text-gray-600 font-extrabold text-xs uppercase tracking-[0.4px]"></th>
                    <th className="text-left px-3 py-2.5 bg-gray-100 text-gray-600 font-extrabold text-xs uppercase tracking-[0.4px]">Date / Time</th>
                    <th className="text-left px-3 py-2.5 bg-gray-100 text-gray-600 font-extrabold text-xs uppercase tracking-[0.4px]">BP</th>
                    <th className="text-left px-3 py-2.5 bg-gray-100 text-gray-600 font-extrabold text-xs uppercase tracking-[0.4px]">HR</th>
                    <th className="text-left px-3 py-2.5 bg-gray-100 text-gray-600 font-extrabold text-xs uppercase tracking-[0.4px]">O₂</th>
                    <th className="text-left px-3 py-2.5 bg-gray-100 text-gray-600 font-extrabold text-xs uppercase tracking-[0.4px]">Weight</th>
                    <th className="text-left px-3 py-2.5 bg-gray-100 text-gray-600 font-extrabold text-xs uppercase tracking-[0.4px]">Symptoms</th>
                    <th className="text-left px-3 py-2.5 bg-gray-100 text-gray-600 font-extrabold text-xs uppercase tracking-[0.4px]">Meds</th>
                    {isEditor && <th className="text-left px-3 py-2.5 bg-gray-100 text-gray-600 font-extrabold text-xs uppercase tracking-[0.4px]"></th>}
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
                          <td className="px-3 py-3 border-b border-gray-100 align-top w-7 pr-0">
                            <button
                              className="bg-transparent border-none cursor-pointer text-gray-400 text-xs p-0 leading-none align-middle transition hover:text-teal-600"
                              onClick={() => toggleRow(e.id)}
                              title="Show details"
                            >
                              <i className={`fa-solid ${expanded ? 'fa-chevron-down' : 'fa-chevron-right'}`} />
                            </button>
                          </td>
                          <td className="px-3 py-3 border-b border-gray-100 align-top font-bold text-teal-600 whitespace-nowrap">
                            {formatDate(e.date)}
                            {e.time && <><br /><span className="text-[11px] text-gray-400 font-semibold">{e.time}</span></>}
                          </td>
                          <td className="px-3 py-3 border-b border-gray-100 align-top">
                            <span className={`inline-block w-2 h-2 rounded-full mr-1.5 ${flagDotCls[bpFlag] || 'bg-gray-300'}`}></span>
                            {e.bpSys || '—'}/{e.bpDia || '—'}
                          </td>
                          <td className="px-3 py-3 border-b border-gray-100 align-top">{e.hr || '—'}</td>
                          <td className="px-3 py-3 border-b border-gray-100 align-top">{e.o2 ? e.o2 + '%' : '—'}</td>
                          <td className="px-3 py-3 border-b border-gray-100 align-top">{e.weight ? e.weight + ' lbs' : '—'}</td>
                          <td className="px-3 py-3 border-b border-gray-100 align-top text-[13px]">{formatSymptoms(e)}</td>
                          <td className="px-3 py-3 border-b border-gray-100 align-top">{medsIcon(e)}</td>
                          {isEditor && (
                            <td className="px-3 py-3 border-b border-gray-100 align-top">
                              <button
                                className="px-2.5 py-1 bg-teal-50 text-teal-600 border border-teal-600 rounded text-xs font-bold hover:bg-teal-600 hover:text-white transition whitespace-nowrap cursor-pointer"
                                onClick={() => handleEdit(e.id)}
                              >
                                <i className="fa-solid fa-pen mr-1" />Edit
                              </button>
                            </td>
                          )}
                        </tr>
                        {expanded && (
                          <tr key={`detail-${e.id}`}>
                            <td colSpan={colCount} className="px-4 py-3 bg-gray-100 border-b-2 border-gray-200">
                              <div className="grid grid-cols-[repeat(auto-fill,minmax(170px,1fr))] gap-x-4 gap-y-2 text-[13px]">
                                <div><div className="text-[11px] font-extrabold uppercase tracking-[0.4px] text-gray-400 mb-0.5">Shortness of Breath</div><div className="text-gray-800 font-semibold">{e.sob || '—'}</div></div>
                                <div><div className="text-[11px] font-extrabold uppercase tracking-[0.4px] text-gray-400 mb-0.5">Swelling</div><div className="text-gray-800 font-semibold">{e.swelling || '—'}</div></div>
                                <div><div className="text-[11px] font-extrabold uppercase tracking-[0.4px] text-gray-400 mb-0.5">Chest Pain</div><div className="text-gray-800 font-semibold">{e.chest || '—'}</div></div>
                                <div><div className="text-[11px] font-extrabold uppercase tracking-[0.4px] text-gray-400 mb-0.5">Energy</div><div className="text-gray-800 font-semibold">{energyLabel[e.energy] || e.energy || '—'}</div></div>
                                <div><div className="text-[11px] font-extrabold uppercase tracking-[0.4px] text-gray-400 mb-0.5">Sleep</div><div className="text-gray-800 font-semibold">{sleepLabel[e.sleep] || e.sleep || '—'}</div></div>
                                <div><div className="text-[11px] font-extrabold uppercase tracking-[0.4px] text-gray-400 mb-0.5">Medications</div><div className="text-gray-800 font-semibold">{medsIcon(e)}</div></div>
                              </div>
                              {e.notes && (
                                <div className="mt-2.5 pt-2.5 border-t border-gray-200 text-[13px] leading-relaxed text-gray-600 whitespace-pre-wrap">
                                  <strong className="text-[11px] uppercase tracking-[0.4px] text-gray-400">Notes</strong><br />
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
      )}

      {subTab === 'trends' && (
        <TrendsSection entries={entries} />
      )}
    </section>
  )
}
