import { useState } from 'react'

export default function GistModal({ currentToken, onSave, onClose }) {
  const [token, setToken] = useState(currentToken || '')

  function handleSave() {
    if (!token.trim()) { alert('Please enter a GitHub token.'); return }
    onSave(token.trim())
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-card">
        <h2>⚙️ Enable Cloud Sync</h2>
        <p>Enter your GitHub Personal Access Token to enable saving data to the cloud. This is stored only on this device and never sent anywhere except GitHub.</p>
        <div className="field">
          <label>GitHub Personal Access Token</label>
          <span className="hint">Needs <code>gist</code> scope only — <a href="https://github.com/settings/tokens/new" target="_blank" rel="noreferrer" style={{ color: 'var(--teal)' }}>create one here</a></span>
          <input
            type="password"
            value={token}
            onChange={e => setToken(e.target.value)}
            placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
          />
        </div>
        <div className="modal-actions">
          <button className="btn-save" onClick={handleSave}>Save</button>
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  )
}
