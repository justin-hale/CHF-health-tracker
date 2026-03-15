import { useState } from 'react'

export default function LockScreen({ onUnlock }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!password) return
    setLoading(true)
    setError('')
    const ok = await onUnlock(password)
    if (!ok) {
      setError('Incorrect password. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div id="lock-screen">
      <div className="lock-card">
        <span className="heart-icon">❤️</span>
        <h1>Bill's Health Tracker</h1>
        <p>This is a private family health record. Enter the password to view.</p>
        <form onSubmit={handleSubmit}>
          <div className="lock-input-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter password"
              autoFocus
            />
          </div>
          <button className="lock-btn" type="submit" disabled={loading}>
            {loading ? 'Checking…' : 'Enter'}
          </button>
        </form>
        {error && <div className="lock-error" style={{ display: 'block' }}>{error}</div>}
      </div>
    </div>
  )
}
