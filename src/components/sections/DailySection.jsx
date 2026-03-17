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

const inp = 'w-full px-3 py-2 border border-gray-200 rounded-md text-sm text-gray-900 bg-white outline-none transition focus:border-teal-600 focus:ring-1 focus:ring-teal-600/20'
const lbl = 'block text-xs font-semibold text-gray-600 mb-1'
const hintCls = { ok: 'text-green-600 text-[11px] mt-0.5 font-semibold', warn: 'text-amber-500 text-[11px] mt-0.5 font-semibold', error: 'text-rose-600 text-[11px] mt-0.5 font-semibold' }
const flagDotCls = { ok: 'bg-green-500', warn: 'bg-amber-400', alert: 'bg-rose-500' }
const subTabBase = 'px-3.5 py-2 border-none bg-transparent cursor-pointer text-xs font-semibold border-b-2 -mb-px transition-colors font-sans uppercase tracking-wide'
const subHead = 'text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-2 mt-4 flex items-center gap-1.5 first:mt-0'

export default function DailySection({ entries, isEditor, onSave }) {
  const [subTab, setSubTab] = useState(isEditor ? 'log' : 'history')
  const [form, setForm] = useState(EMPTY_FORM)
  const [editingId, setEditingId] = useState(null)
  const [saveStatus, setSaveStatus] = useState('')

  const previousEntry = entries[0] || null
  const hints = getDailyHints(form, previousEntry)
  const alerts = getDailyAlerts(form, previousEntry)

  function set(field, value) { setForm(prev => ({ ...prev, [field]: value })) }

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

  const Hint = ({ hint }) => hint ? <div className={hintCls[hint.level]}>{hint.msg}</div> : null

  const sleepLabel = { good: 'Good', fair: 'Fair', poor: 'Poor' }
  const energyLabel = { '5': 'Great', '4': 'Good', '3': 'OK', '2': 'Low', '1': 'Very Low' }
  const medsIcon = e => e.meds === 'yes'
    ? <i className="fa-solid fa-circle-check text-green-500" />
    : e.meds === 'partial'
    ? <i className="fa-solid fa-triangle-exclamation text-amber-400" />
    : e.meds === 'no'
    ? <i className="fa-solid fa-circle-xmark text-rose-500" />
    : '—'

  return (
    <section>
      <div className="mb-4">
        <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
          <i className="fa-solid fa-calendar-day text-rose-500 text-sm" />Daily Log
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">Track Bill's vitals and symptoms every day. Morning is best for weight and BP.</p>
      </div>

      {alerts.length > 0 && (
        <div
          className="bg-red-50 border border-red-200 rounded-md px-3 py-2 mb-3 text-xs font-semibold text-rose-700"
          dangerouslySetInnerHTML={{ __html: '<i class="fa-solid fa-triangle-exclamation mr-1.5"></i>' + alerts.join('<br/>') }}
        />
      )}

      <div className="flex border-b border-gray-200 mb-4">
        {isEditor && (
          <button className={subTabBase + (subTab === 'log' ? ' text-teal-600 border-teal-600' : ' text-gray-500 border-transparent hover:text-gray-700')} onClick={() => setSubTab('log')}>
            <i className="fa-solid fa-pen-to-square mr-1" />Log
          </button>
        )}
        <button className={subTabBase + (subTab === 'history' ? ' text-teal-600 border-teal-600' : ' text-gray-500 border-transparent hover:text-gray-700')} onClick={() => setSubTab('history')}>
          <i className="fa-solid fa-clock-rotate-left mr-1" />History
        </button>
        <button className={subTabBase + (subTab === 'trends' ? ' text-teal-600 border-teal-600' : ' text-gray-500 border-transparent hover:text-gray-700')} onClick={() => setSubTab('trends')}>
          <i className="fa-solid fa-chart-line mr-1" />Trends
        </button>
      </div>

      {subTab === 'log' && isEditor && (
        <div className="mb-4">
          <EditingBanner visible={!!editingId} onCancel={handleCancelEdit} />

          <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-sm mb-3">
            <div className={subHead}><i className="fa-solid fa-calendar text-blue-400" />Date &amp; Time</div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className={lbl}>Date</label><input type="date" value={form.date} onChange={e => set('date', e.target.value)} className={inp} /></div>
              <div><label className={lbl}>Time of Reading</label><input type="time" value={form.time} onChange={e => set('time', e.target.value)} className={inp} /></div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-sm mb-3">
            <div className={subHead}><i className="fa-solid fa-heart text-rose-400" />Vitals</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className={lbl}>Systolic BP <span className="font-normal text-gray-500">(top)</span></label>
                <input type="number" value={form.bpSys} onChange={e => set('bpSys', e.target.value)} placeholder="e.g. 130" min="60" max="250" className={inp} />
                <Hint hint={hints.bpSys} />
              </div>
              <div>
                <label className={lbl}>Diastolic BP <span className="font-normal text-gray-500">(bottom)</span></label>
                <input type="number" value={form.bpDia} onChange={e => set('bpDia', e.target.value)} placeholder="e.g. 80" min="40" max="150" className={inp} />
                <Hint hint={hints.bpDia} />
              </div>
              <div>
                <label className={lbl}>Heart Rate <span className="font-normal text-gray-500">bpm</span></label>
                <input type="number" value={form.hr} onChange={e => set('hr', e.target.value)} placeholder="e.g. 72" min="30" max="200" className={inp} />
                <Hint hint={hints.hr} />
              </div>
              <div>
                <label className={lbl}>O₂ Saturation <span className="font-normal text-gray-500">%</span></label>
                <input type="number" value={form.o2} onChange={e => set('o2', e.target.value)} placeholder="e.g. 97" min="80" max="100" className={inp} />
                <Hint hint={hints.o2} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-sm mb-3">
            <div className={subHead}><i className="fa-solid fa-scale-balanced text-teal-400" />Weight</div>
            <div>
              <label className={lbl}>Morning Weight <span className="font-normal text-gray-500">lbs — after bathroom, before eating</span></label>
              <input type="number" value={form.weight} onChange={e => set('weight', e.target.value)} placeholder="e.g. 244" step="0.1" className={inp} />
              <Hint hint={hints.weight} />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-sm mb-3">
            <div className={subHead}><i className="fa-solid fa-thermometer-half text-amber-400" />Symptoms</div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={lbl}>Shortness of Breath</label>
                <select value={form.sob} onChange={e => set('sob', e.target.value)} className={inp}>
                  <option value="">— Select —</option>
                  <option value="none">None</option>
                  <option value="mild">Mild (light activity)</option>
                  <option value="moderate">Moderate (walking)</option>
                  <option value="severe">Severe (at rest)</option>
                </select>
              </div>
              <div>
                <label className={lbl}>Swelling (Ankles / Legs)</label>
                <select value={form.swelling} onChange={e => set('swelling', e.target.value)} className={inp}>
                  <option value="">— Select —</option>
                  <option value="none">None</option>
                  <option value="mild">Mild</option>
                  <option value="moderate">Moderate</option>
                  <option value="severe">Severe</option>
                </select>
              </div>
              <div>
                <label className={lbl}>Energy Level</label>
                <select value={form.energy} onChange={e => set('energy', e.target.value)} className={inp}>
                  <option value="">— Select —</option>
                  <option value="5">😄 Great</option>
                  <option value="4">🙂 Good</option>
                  <option value="3">😐 OK</option>
                  <option value="2">😔 Low</option>
                  <option value="1">😞 Very Low</option>
                </select>
              </div>
              <div>
                <label className={lbl}>Sleep Quality</label>
                <select value={form.sleep} onChange={e => set('sleep', e.target.value)} className={inp}>
                  <option value="">— Select —</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair (some interruptions)</option>
                  <option value="poor">Poor (restless)</option>
                </select>
              </div>
              <div>
                <label className={lbl}>Chest Pain / Pressure</label>
                <select value={form.chest} onChange={e => set('chest', e.target.value)} className={inp}>
                  <option value="none">No</option>
                  <option value="mild">Mild / discomfort</option>
                  <option value="yes">Yes — notable pain</option>
                </select>
              </div>
              <div>
                <label className={lbl}>Medications Taken</label>
                <select value={form.meds} onChange={e => set('meds', e.target.value)} className={inp}>
                  <option value="yes">✅ All taken</option>
                  <option value="partial">⚠️ Missed some</option>
                  <option value="no">❌ None taken</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-sm mb-3">
            <div className={subHead}><i className="fa-solid fa-note-sticky text-yellow-400" />Notes</div>
            <textarea
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
              placeholder="Anything unusual — diet, activity, how he seems…"
              className={inp + ' resize-y min-h-[80px]'}
            />
          </div>

          <button className="w-full px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-md font-sans text-sm font-semibold transition cursor-pointer" onClick={handleSave}>
            <i className="fa-solid fa-floppy-disk mr-1.5" />{editingId ? 'Update Entry' : 'Save Entry'}
          </button>
          {saveStatus && <div className="text-center mt-2 text-xs font-semibold text-green-600"><i className="fa-solid fa-circle-check mr-1" />{saveStatus}</div>}
        </div>
      )}

      {subTab === 'history' && (
        <div>
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Recent Entries</div>
          {entries.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <i className="fa-solid fa-clipboard-list text-3xl mb-2 block" />
              <p className="text-sm">No entries yet.</p>
            </div>
          ) : entries.slice(0, 60).map(e => {
            const bpFlag = getBPFlag(e.bpSys, e.bpDia)
            const bpChipCls = {
              ok: 'bg-green-50 text-green-700 border border-green-200',
              warn: 'bg-amber-50 text-amber-700 border border-amber-200',
              alert: 'bg-rose-50 text-rose-700 border border-rose-200',
            }[bpFlag] || 'bg-gray-100 text-gray-600'
            const details = [
              ['Heart Rate', e.hr ? e.hr + ' bpm' : null],
              ['O₂ Sat', e.o2 ? e.o2 + '%' : null],
              ['Shortness of Breath', e.sob],
              ['Swelling', e.swelling],
              ['Chest Pain', e.chest && e.chest !== 'none' ? e.chest : null],
              ['Energy', energyLabel[e.energy] || e.energy || null],
              ['Sleep', sleepLabel[e.sleep] || e.sleep || null],
            ].filter(([, v]) => v)
            return (
              <div key={e.id} className="bg-white rounded-lg border border-gray-100 p-4 shadow-sm mb-3">
                <div className="flex justify-between items-start flex-wrap gap-2 mb-3">
                  <div>
                    <div className="font-semibold text-sm text-gray-900">{formatDate(e.date)}</div>
                    {e.time && <div className="text-[11px] text-gray-500 mt-0.5">{e.time}</div>}
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {(e.bpSys || e.bpDia) && (
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${bpChipCls}`}>
                        BP {e.bpSys || '—'}/{e.bpDia || '—'}
                      </span>
                    )}
                    {e.weight && (
                      <span className="text-[11px] font-semibold bg-teal-50 text-teal-700 border border-teal-200 px-2 py-0.5 rounded">
                        {e.weight} lbs
                      </span>
                    )}
                    <span className="text-[11px] font-medium">{medsIcon(e)}</span>
                    {isEditor && (
                      <button className="px-2 py-0.5 text-teal-600 border border-teal-200 rounded text-[11px] font-semibold hover:bg-teal-600 hover:text-white transition cursor-pointer" onClick={() => handleEdit(e.id)}>
                        Edit
                      </button>
                    )}
                  </div>
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
                {e.notes && (
                  <div className="mt-2 pt-2 border-t border-gray-100 text-xs text-gray-600 leading-relaxed">{e.notes}</div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {subTab === 'trends' && <TrendsSection entries={entries} />}
    </section>
  )
}
