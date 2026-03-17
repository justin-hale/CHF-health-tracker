import { useState } from 'react'
import EditingBanner from '../EditingBanner.jsx'
import { formatDate } from '../../utils/formatters.js'

function today() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const MOOD_ICON = ['', 'fa-face-sad-tear', 'fa-face-frown', 'fa-face-meh', 'fa-face-smile', 'fa-face-grin-wide']
const MOOD_LABEL = ['', 'Very Low', 'Low', 'Okay', 'Good', 'Great']
const MOOD_STYLE = [
  null,
  { iconCls: 'text-rose-500',  selCls: 'bg-rose-50 border-rose-400 ring-1 ring-rose-400/30',   borderCls: 'border-l-rose-500'  },
  { iconCls: 'text-amber-500', selCls: 'bg-amber-50 border-amber-400 ring-1 ring-amber-400/30', borderCls: 'border-l-amber-500' },
  { iconCls: 'text-yellow-500',selCls: 'bg-yellow-50 border-yellow-400 ring-1 ring-yellow-400/30', borderCls: 'border-l-yellow-500' },
  { iconCls: 'text-lime-500',  selCls: 'bg-lime-50 border-lime-400 ring-1 ring-lime-400/30',   borderCls: 'border-l-lime-500'  },
  { iconCls: 'text-green-500', selCls: 'bg-green-50 border-green-400 ring-1 ring-green-400/30', borderCls: 'border-l-green-500' },
]
const TOPIC_LABELS = { acceptance: 'Accepting diagnosis', family: 'Family connection', activity: 'Activity / getting out', diet: 'Diet discussion', meds: 'Medication conversation', anxiety: 'Anxiety / worry' }
const EMPTY_TOPICS = { acceptance: false, family: false, activity: false, diet: false, meds: false, anxiety: false }

const inp = 'w-full px-3 py-2 border border-gray-200 rounded-md text-sm text-gray-900 bg-white outline-none transition focus:border-teal-600 focus:ring-1 focus:ring-teal-600/20'
const lbl = 'block text-xs font-semibold text-gray-600 mb-1'
const subTabBase = 'px-3.5 py-2 border-none bg-transparent cursor-pointer text-xs font-semibold border-b-2 -mb-px transition-colors font-sans uppercase tracking-wide'
const subHead = 'text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-2 mt-4 flex items-center gap-1.5 first:mt-0'

export default function JournalSection({ entries, isEditor, onSave }) {
  const [subTab, setSubTab] = useState(isEditor ? 'log' : 'history')
  const [date, setDate] = useState(today())
  const [mood, setMood] = useState(null)
  const [text, setText] = useState('')
  const [topics, setTopics] = useState(EMPTY_TOPICS)
  const [editingId, setEditingId] = useState(null)
  const [saveStatus, setSaveStatus] = useState('')

  function toggleTopic(key) { setTopics(prev => ({ ...prev, [key]: !prev[key] })) }

  function handleSave() {
    if (!date) { alert('Please enter a date.'); return }
    if (!text) { alert('Please write something in the journal entry.'); return }
    const entry = { id: editingId || Date.now(), date, mood, text, topics }
    onSave(entry, !!editingId)
    setSaveStatus('Saved!')
    setTimeout(() => setSaveStatus(''), 3000)
    setEditingId(null)
    setDate(today())
    setMood(null)
    setText('')
    setTopics(EMPTY_TOPICS)
    setSubTab('history')
  }

  function handleEdit(id) {
    const e = entries.find(x => x.id === id)
    if (!e) return
    setDate(e.date || '')
    setMood(e.mood || null)
    setText(e.text || '')
    setTopics(e.topics ? { ...EMPTY_TOPICS, ...e.topics } : EMPTY_TOPICS)
    setEditingId(id)
    setSubTab('log')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleCancelEdit() {
    setEditingId(null)
    setDate(today())
    setMood(null)
    setText('')
    setTopics(EMPTY_TOPICS)
    setSubTab('history')
  }

  return (
    <section>
      <div className="mb-4">
        <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
          <i className="fa-solid fa-book text-violet-500 text-sm" />Journal
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">Track mood, mental well-being, and emotional state.</p>
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
            <div className={subHead}><i className="fa-solid fa-calendar text-blue-400" />Date &amp; Mood</div>
            <div className="flex flex-col gap-3">
              <div>
                <label className={lbl}>Date</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} className={inp} />
              </div>
              <div>
                <label className={lbl}>Overall Mood</label>
                <div className="flex gap-2 mt-1">
                  {[1, 2, 3, 4, 5].map(val => (
                    <button
                      key={val}
                      className={`flex-1 flex flex-col items-center gap-1 py-2 border rounded-md bg-white cursor-pointer transition hover:scale-105 ${mood === val ? MOOD_STYLE[val].selCls : 'border-gray-200'}`}
                      onClick={() => setMood(val)}
                      title={MOOD_LABEL[val]}
                    >
                      <i className={`fa-regular ${MOOD_ICON[val]} text-lg ${MOOD_STYLE[val].iconCls}`} />
                      <span className={`text-[10px] font-semibold ${mood === val ? MOOD_STYLE[val].iconCls : 'text-gray-500'}`}>{MOOD_LABEL[val]}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-sm mb-3">
            <div className={subHead}><i className="fa-solid fa-pen-nib text-violet-400" />Entry</div>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              style={{ minHeight: 140 }}
              placeholder="How is Bill doing emotionally? Is he engaged, withdrawn, hopeful, frustrated?"
              className={inp + ' resize-y'}
            />
          </div>

          <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-sm mb-3">
            <div className={subHead}><i className="fa-solid fa-tags text-teal-400" />Topics Covered</div>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(TOPIC_LABELS).map(([key, label]) => (
                <label key={key} className={`flex items-center gap-2 px-3 py-2.5 rounded-md border cursor-pointer text-xs font-medium transition ${topics[key] ? 'bg-teal-50 border-teal-400 text-teal-700' : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300'}`}>
                  <input type="checkbox" checked={topics[key]} onChange={() => toggleTopic(key)} className="accent-teal-600 shrink-0" /> {label}
                </label>
              ))}
            </div>
          </div>

          <button className="w-full px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-md font-sans text-sm font-semibold transition cursor-pointer" onClick={handleSave}>
            <i className="fa-solid fa-floppy-disk mr-1.5" />{editingId ? 'Update Entry' : 'Save Entry'}
          </button>
          {saveStatus && <div className="text-center mt-2 text-xs font-semibold text-green-600"><i className="fa-solid fa-circle-check mr-1" />{saveStatus}</div>}
        </div>
      )}

      {subTab === 'history' && (
        <div>
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Journal History</div>
          {entries.length === 0 ? (
            <div className="text-center py-12 text-gray-500"><i className="fa-solid fa-book text-3xl mb-2 block" /><p className="text-sm">No journal entries yet.</p></div>
          ) : entries.map(e => (
            <div key={e.id} className={`bg-white rounded-lg border border-gray-100 p-4 shadow-sm mb-3 border-l-4 ${MOOD_STYLE[e.mood]?.borderCls || 'border-l-gray-300'}`}>
              <div className="flex justify-between items-start flex-wrap gap-2 mb-3">
                <div className="flex items-center gap-2">
                  {e.mood && <i className={`fa-regular ${MOOD_ICON[e.mood]} text-lg ${MOOD_STYLE[e.mood]?.iconCls || ''}`} />}
                  <div>
                    <div className="font-semibold text-sm text-gray-900">{formatDate(e.date)}</div>
                    {e.mood && <div className="text-[11px] text-gray-500">{MOOD_LABEL[e.mood]}</div>}
                  </div>
                </div>
                {isEditor && (
                  <button className="px-2 py-0.5 text-teal-600 border border-teal-200 rounded text-[11px] font-semibold hover:bg-teal-600 hover:text-white transition cursor-pointer" onClick={() => handleEdit(e.id)}>
                    Edit
                  </button>
                )}
              </div>
              <div className="font-serif text-sm leading-relaxed text-gray-800">{e.text}</div>
              {e.topics && Object.entries(e.topics).some(([, v]) => v) && (
                <div className="flex flex-wrap gap-1.5 mt-3 pt-2 border-t border-gray-100">
                  {Object.entries(e.topics).filter(([, v]) => v).map(([k]) => (
                    <span key={k} className="bg-gray-100 text-gray-600 rounded px-2 py-0.5 text-[11px] font-medium">{TOPIC_LABELS[k] || k}</span>
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
