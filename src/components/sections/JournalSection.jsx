import { useState } from 'react'
import EditingBanner from '../EditingBanner.jsx'
import { formatDate } from '../../utils/formatters.js'

function today() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const MOOD_EMOJI = ['', '😞', '😔', '😐', '🙂', '😄']
const TOPIC_LABELS = { acceptance: 'Accepting diagnosis', family: 'Family connection', activity: 'Activity / getting out', diet: 'Diet discussion', meds: 'Medication conversation', anxiety: 'Anxiety / worry' }
const EMPTY_TOPICS = { acceptance: false, family: false, activity: false, diet: false, meds: false, anxiety: false }

const moodBorder = { 1: 'border-l-rose-600', 2: 'border-l-amber-500', 3: 'border-l-amber-500', 4: 'border-l-green-600', 5: 'border-l-green-700' }
const inputCls = 'px-3.5 py-3 border-2 border-gray-200 rounded-xl font-sans text-base text-gray-800 bg-stone-50 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-600/10 w-full'
const subTabBase = 'px-5 py-2.5 border-none bg-transparent cursor-pointer text-sm font-bold border-b-[3px] -mb-0.5 transition-colors font-sans'

export default function JournalSection({ entries, isEditor, onSave }) {
  const [subTab, setSubTab] = useState(isEditor ? 'log' : 'history')
  const [date, setDate] = useState(today())
  const [mood, setMood] = useState(null)
  const [text, setText] = useState('')
  const [topics, setTopics] = useState(EMPTY_TOPICS)
  const [editingId, setEditingId] = useState(null)
  const [saveStatus, setSaveStatus] = useState('')

  function toggleTopic(key) {
    setTopics(prev => ({ ...prev, [key]: !prev[key] }))
  }

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
      <div className="mb-7">
        <h2 className="font-serif text-3xl text-gray-800 mb-1.5">
          <i className="fa-solid fa-book mr-2 text-rose-500" />Journal
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed">Track Bill's overall mood, mental well-being, and emotional state. This helps the family and his doctors understand the full picture.</p>
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
            <i className="fa-solid fa-pen-nib text-teal-600" />New Journal Entry
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-extrabold uppercase tracking-[0.4px] text-gray-600">Date</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} className={inputCls} />
            </div>
          </div>

          <div className="flex flex-col gap-1.5 mb-5">
            <label className="text-xs font-extrabold uppercase tracking-[0.4px] text-gray-600">Overall Mood</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(val => (
                <button
                  key={val}
                  className={`w-[52px] h-[52px] border-[3px] rounded-xl text-2xl bg-white cursor-pointer transition hover:scale-110 ${mood === val ? 'border-teal-600 bg-teal-50' : 'border-gray-200'}`}
                  onClick={() => setMood(val)}
                  title={['', 'Very Low', 'Low', 'Okay', 'Good', 'Great'][val]}
                >
                  {MOOD_EMOJI[val]}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5 mb-5">
            <label className="text-xs font-extrabold uppercase tracking-[0.4px] text-gray-600">Journal Entry</label>
            <span className="text-xs text-gray-400 font-semibold">How is Bill doing emotionally? Is he engaged, withdrawn, hopeful, frustrated? Any conversations worth noting?</span>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              style={{ minHeight: 160 }}
              placeholder="Today Bill seemed more like himself. He watched the game and had a good laugh..."
              className={inputCls + ' resize-y'}
            />
          </div>

          <div className="flex flex-col gap-1.5 mb-6">
            <label className="text-xs font-extrabold uppercase tracking-[0.4px] text-gray-600">
              Topics Covered <span className="text-gray-400 normal-case font-semibold">(check all that apply)</span>
            </label>
            <div className="flex flex-wrap gap-2.5 mt-2">
              {Object.entries(TOPIC_LABELS).map(([key, label]) => (
                <label key={key} className="flex items-center gap-1.5 font-semibold text-sm cursor-pointer text-gray-700">
                  <input type="checkbox" checked={topics[key]} onChange={() => toggleTopic(key)} className="accent-teal-600" /> {label}
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 mt-6 pt-5 border-t-2 border-gray-100">
            <button
              className="px-8 py-3.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-sans text-[17px] font-extrabold transition active:scale-[0.98] cursor-pointer"
              onClick={handleSave}
            >
              <i className="fa-solid fa-floppy-disk mr-2" />{editingId ? 'Update Entry' : 'Save Journal Entry'}
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
          <div className="text-base font-extrabold text-gray-600 mb-3 uppercase tracking-[0.5px]">Journal History</div>
          {entries.length === 0 ? (
            <div className="text-center py-16 px-6 text-gray-400">
              <i className="fa-solid fa-book text-5xl mb-3 block" />
              <p className="text-base">No journal entries yet.</p>
            </div>
          ) : entries.map(e => (
            <div key={e.id} className={`bg-white rounded-2xl px-7 py-6 shadow-sm mb-4 border-l-[5px] ${moodBorder[e.mood || 3] || 'border-l-teal-600'}`}>
              <div className="flex justify-between items-start gap-2 mb-1.5">
                <div className="text-[13px] font-bold text-gray-400">{formatDate(e.date)}</div>
                {isEditor && (
                  <button
                    className="px-2.5 py-1 bg-teal-50 text-teal-600 border border-teal-600 rounded text-xs font-bold hover:bg-teal-600 hover:text-white transition whitespace-nowrap cursor-pointer"
                    onClick={() => handleEdit(e.id)}
                  >
                    <i className="fa-solid fa-pen mr-1" />Edit
                  </button>
                )}
              </div>
              {e.mood && <div className="text-[22px] mb-2">{MOOD_EMOJI[e.mood]}</div>}
              <div className="font-serif text-base leading-[1.7] text-gray-800">{e.text}</div>
              {e.topics && Object.entries(e.topics).some(([, v]) => v) && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {Object.entries(e.topics).filter(([, v]) => v).map(([k]) => (
                    <span key={k} className="bg-gray-100 text-gray-600 rounded-full px-3 py-1 text-xs font-bold">{k}</span>
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
