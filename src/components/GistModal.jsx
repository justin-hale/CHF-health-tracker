import { useState } from 'react'

const inputCls = 'w-full px-3.5 py-3 border-2 border-gray-200 rounded-xl font-sans text-base text-gray-800 bg-stone-50 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-600/10'

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
      <div className="bg-white rounded-2xl p-9 max-w-lg w-full shadow-2xl">
        <h2 className="font-serif text-2xl text-gray-800 mb-2">
          <i className="fa-solid fa-gear mr-2 text-teal-600" />Enable Cloud Sync
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-5">
          Enter your GitHub Personal Access Token to enable saving data to the cloud. This is stored only on this device and never sent anywhere except GitHub.
        </p>
        <div className="flex flex-col gap-1.5 mb-4">
          <label className="text-xs font-extrabold uppercase tracking-[0.4px] text-gray-600">GitHub Personal Access Token</label>
          <span className="text-xs text-gray-400 font-semibold">
            Needs <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">gist</code> scope only —{' '}
            <a href="https://github.com/settings/tokens/new" target="_blank" rel="noreferrer" className="text-teal-600 font-bold">create one here</a>
          </span>
          <input
            type="password"
            value={token}
            onChange={e => setToken(e.target.value)}
            placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
            className={inputCls}
          />
        </div>
        <div className="flex gap-3 mt-6">
          <button
            className="px-8 py-3.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-sans text-[17px] font-extrabold transition active:scale-[0.98] cursor-pointer"
            onClick={handleSave}
          >
            <i className="fa-solid fa-floppy-disk mr-2" />Save
          </button>
          <button
            className="px-6 py-3 bg-gray-100 text-gray-600 border-none rounded-xl font-sans text-[15px] font-bold cursor-pointer hover:bg-gray-200 transition"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
