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
    setSaveStatus('✅ Saved!')
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
    <section className="section active">
      <div className="section-header">
        <h2>📓 Journal</h2>
        <p>Track Bill's overall mood, mental well-being, and emotional state. This helps the family and his doctors understand the full picture.</p>
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
            <div className="card-title"><span className="card-icon">✍️</span>New Journal Entry</div>

            <div className="form-grid-2" style={{ marginBottom: 20 }}>
              <div className="field">
                <label>Date</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} />
              </div>
            </div>

            <div className="field" style={{ marginBottom: 20 }}>
              <label>Overall Mood</label>
              <div className="mood-picker">
                {[1, 2, 3, 4, 5].map(val => (
                  <button
                    key={val}
                    className={'mood-btn' + (mood === val ? ' selected' : '')}
                    onClick={() => setMood(val)}
                    title={['', 'Very Low', 'Low', 'Okay', 'Good', 'Great'][val]}
                  >
                    {MOOD_EMOJI[val]}
                  </button>
                ))}
              </div>
            </div>

            <div className="field" style={{ marginBottom: 20 }}>
              <label>Journal Entry</label>
              <span className="hint">How is Bill doing emotionally? Is he engaged, withdrawn, hopeful, frustrated? Any conversations worth noting?</span>
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                style={{ minHeight: 160 }}
                placeholder="Today Bill seemed more like himself. He watched the game and had a good laugh..."
              />
            </div>

            <div className="field" style={{ marginBottom: 24 }}>
              <label>Topics Covered <span className="hint">(check all that apply)</span></label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 8 }}>
                {Object.entries(TOPIC_LABELS).map(([key, label]) => (
                  <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
                    <input type="checkbox" checked={topics[key]} onChange={() => toggleTopic(key)} /> {label}
                  </label>
                ))}
              </div>
            </div>

            <div className="save-row">
              <button className="btn-save" onClick={handleSave}>
                {editingId ? '💾 Update Entry' : '💾 Save Journal Entry'}
              </button>
              <span className="save-status">{saveStatus}</span>
            </div>
          </div>
        </div>
      )}

      {subTab === 'history' && (
        <div className="sub-panel active">
          <div className="history-section">
            <div className="history-title">Journal History</div>
            {entries.length === 0 ? (
              <div className="empty-state"><div className="empty-icon">📓</div><p>No journal entries yet.</p></div>
            ) : entries.map(e => (
              <div key={e.id} className={`journal-entry mood-${e.mood || 3}`}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 6 }}>
                  <div className="journal-date" style={{ marginBottom: 0 }}>{formatDate(e.date)}</div>
                  {isEditor && <button className="btn-edit" onClick={() => handleEdit(e.id)}>Edit</button>}
                </div>
                {e.mood && <div className="journal-mood">{MOOD_EMOJI[e.mood]}</div>}
                <div className="journal-text">{e.text}</div>
                {e.topics && Object.entries(e.topics).some(([, v]) => v) && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
                    {Object.entries(e.topics).filter(([, v]) => v).map(([k]) => (
                      <span key={k} className="visit-tag" style={{ background: 'var(--gray-100)', color: 'var(--gray-600)' }}>{k}</span>
                    ))}
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
