import { useState, useEffect } from 'react'
import { CONFIG } from './config.js'
import { hashPassword } from './utils/crypto.js'
import { loadFromLocalStorage, saveToLocalStorage, loadFromGist, pushToGist, syncToGist } from './utils/storage.js'
import LockScreen from './components/LockScreen.jsx'
import Header from './components/Header.jsx'
import Nav from './components/Nav.jsx'
import GistModal from './components/GistModal.jsx'
import DailySection from './components/sections/DailySection.jsx'
import WeeklySection from './components/sections/WeeklySection.jsx'
import JournalSection from './components/sections/JournalSection.jsx'
import VisitsSection from './components/sections/VisitsSection.jsx'
import ReferenceSection from './components/sections/ReferenceSection.jsx'

export default function App() {
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [isEditor, setIsEditor] = useState(false)
  const [data, setData] = useState({ daily: [], weekly: [], journal: [], visits: [] })
  const [gistToken, setGistToken] = useState(null)
  const [activeSection, setActiveSection] = useState('daily')
  const [showGistModal, setShowGistModal] = useState(false)
  const [syncStatus, setSyncStatus] = useState('idle')

  useEffect(() => {
    try {
      const session = JSON.parse(localStorage.getItem('bills-session') || 'null')
      if (session) {
        if (session.role === 'editor' && session.hash === CONFIG.EDITOR_TOKEN_HASH) {
          doUnlock(true)
        } else if (session.role === 'viewer' && session.hash === CONFIG.VIEW_PASSWORD_HASH) {
          doUnlock(false)
        } else {
          localStorage.removeItem('bills-session')
        }
      }
    } catch (e) {}
  }, [])

  async function attemptUnlock(password) {
    const hash = await hashPassword(password)
    if (hash === CONFIG.EDITOR_TOKEN_HASH) {
      await doUnlock(true)
      return true
    } else if (hash === CONFIG.VIEW_PASSWORD_HASH) {
      await doUnlock(false)
      return true
    }
    return false
  }

  async function doUnlock(editor) {
    const localData = loadFromLocalStorage()
    const token = localStorage.getItem('bills-gist-token') || null
    const merged = await loadFromGist(CONFIG.GIST_ID, token, localData)

    setIsEditor(editor)
    setIsUnlocked(true)
    setGistToken(token)
    setData(merged)

    localStorage.setItem('bills-session', JSON.stringify({
      role: editor ? 'editor' : 'viewer',
      hash: editor ? CONFIG.EDITOR_TOKEN_HASH : CONFIG.VIEW_PASSWORD_HASH,
    }))
  }

  function signOut() {
    localStorage.removeItem('bills-session')
    location.reload()
  }

  function mutateData(updater) {
    setData(prev => {
      const next = updater(prev)
      saveToLocalStorage(next)
      if (gistToken) pushToGist(CONFIG.GIST_ID, gistToken, next)
      return next
    })
  }

  function saveDaily(entry, isEdit) {
    mutateData(prev => {
      let daily = isEdit
        ? prev.daily.map(e => e.id === entry.id ? entry : e)
        : [entry, ...prev.daily]
      daily.sort((a, b) => {
        const aKey = (a.date || '') + 'T' + (a.time || '00:00')
        const bKey = (b.date || '') + 'T' + (b.time || '00:00')
        return bKey > aKey ? 1 : -1
      })
      return { ...prev, daily }
    })
  }

  function saveWeekly(entry, isEdit) {
    mutateData(prev => {
      let weekly = isEdit
        ? prev.weekly.map(e => e.id === entry.id ? entry : e)
        : [entry, ...prev.weekly.filter(e => e.date !== entry.date)]
      weekly.sort((a, b) => new Date(b.date) - new Date(a.date))
      return { ...prev, weekly }
    })
  }

  function saveJournal(entry, isEdit) {
    mutateData(prev => {
      const journal = isEdit
        ? prev.journal.map(e => e.id === entry.id ? entry : e)
        : [entry, ...prev.journal]
      return { ...prev, journal }
    })
  }

  function saveVisit(entry, isEdit) {
    mutateData(prev => {
      const visits = isEdit
        ? prev.visits.map(e => e.id === entry.id ? entry : e)
        : [entry, ...prev.visits]
      return { ...prev, visits }
    })
  }

  async function handleSyncToGist() {
    if (!gistToken) return
    setSyncStatus('syncing')
    try {
      await syncToGist(CONFIG.GIST_ID, gistToken, data)
      setSyncStatus('synced')
      setTimeout(() => setSyncStatus('idle'), 2000)
    } catch {
      setSyncStatus('error')
    }
  }

  async function handleSaveGistConfig(token) {
    localStorage.setItem('bills-gist-token', token)
    setGistToken(token)
    setShowGistModal(false)
    setSyncStatus('syncing')
    try {
      await syncToGist(CONFIG.GIST_ID, token, data)
      setSyncStatus('synced')
      setTimeout(() => setSyncStatus('idle'), 2000)
    } catch {
      setSyncStatus('error')
    }
  }

  if (!isUnlocked) {
    return <LockScreen onUnlock={attemptUnlock} />
  }

  return (
    <div id="app">
      <Header
        isEditor={isEditor}
        syncStatus={syncStatus}
        gistToken={gistToken}
        onOpenGistModal={() => setShowGistModal(true)}
        onSync={handleSyncToGist}
        onSignOut={signOut}
      />
      <Nav activeSection={activeSection} onSelect={setActiveSection} />
      <main>
        {activeSection === 'daily' && <DailySection entries={data.daily} isEditor={isEditor} onSave={saveDaily} />}
        {activeSection === 'weekly' && <WeeklySection entries={data.weekly} isEditor={isEditor} onSave={saveWeekly} />}
        {activeSection === 'journal' && <JournalSection entries={data.journal} isEditor={isEditor} onSave={saveJournal} />}
        {activeSection === 'visits' && <VisitsSection entries={data.visits} isEditor={isEditor} onSave={saveVisit} />}
        {activeSection === 'reference' && <ReferenceSection />}
      </main>
      {showGistModal && (
        <GistModal
          currentToken={gistToken}
          onSave={handleSaveGistConfig}
          onClose={() => setShowGistModal(false)}
        />
      )}
    </div>
  )
}
