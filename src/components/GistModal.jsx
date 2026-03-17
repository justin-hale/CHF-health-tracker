import { useState } from 'react'

const inputCls = 'w-full px-3 py-2 border border-gray-200 rounded-md text-sm text-gray-900 bg-white outline-none transition focus:border-teal-600 focus:ring-1 focus:ring-teal-600/20'

export default function GistModal({ currentToken, onSave, onClose }) {
  const [token, setToken] = useState(currentToken || '')

  function handleSave() {
    if (!token.trim()) { alert('Please enter a GitHub token.'); return }
    onSave(token.trim())
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center p-6"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl border border-gray-100">
        <h2 className="font-semibold text-gray-900 text-base mb-1">
          <i className="fa-solid fa-gear mr-1.5 text-teal-600 text-sm" />Enable Cloud Sync
        </h2>
        <p className="text-gray-600 text-xs leading-relaxed mb-4">
          Enter your GitHub Personal Access Token. Stored only on this device and sent only to GitHub.
        </p>
        <div className="flex flex-col gap-1 mb-4">
          <label className="text-xs font-semibold text-gray-600">GitHub Personal Access Token</label>
          <span className="text-[11px] text-gray-500 mb-1">
            Needs <code className="bg-gray-100 px-1 rounded text-[11px]">gist</code> scope —{' '}
            <a href="https://github.com/settings/tokens/new" target="_blank" rel="noreferrer" className="text-teal-600 font-semibold">create one here</a>
          </span>
          <input
            type="password"
            value={token}
            onChange={e => setToken(e.target.value)}
            placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
            className={inputCls}
          />
        </div>
        <div className="flex gap-2 mt-4">
          <button
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-md font-sans text-sm font-semibold transition cursor-pointer"
            onClick={handleSave}
          >
            <i className="fa-solid fa-floppy-disk mr-1.5" />Save
          </button>
          <button
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md font-sans text-sm font-semibold transition cursor-pointer"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
