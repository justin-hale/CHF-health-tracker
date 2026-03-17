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
    <div className="fixed inset-0 bg-gradient-to-br from-rose-600 to-teal-600 flex items-center justify-center z-[9999] p-6">
      <div className="bg-white rounded-xl px-8 py-10 max-w-sm w-full shadow-xl">
        <div className="flex items-center gap-2.5 mb-6">
          <i className="fa-solid fa-heart text-rose-500 text-2xl" />
          <div>
            <h1 className="font-semibold text-gray-900 text-base leading-tight">Bill's Health Tracker</h1>
            <p className="text-xs text-gray-500">Kendrick Family — private health record</p>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block text-xs font-semibold text-gray-600 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter password"
              autoFocus
              className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm outline-none transition focus:border-teal-600 focus:ring-1 focus:ring-teal-600/20"
            />
          </div>
          <button
            className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-md font-sans text-sm font-semibold transition cursor-pointer disabled:bg-gray-200 disabled:text-gray-500"
            type="submit"
            disabled={loading}
          >
            {loading ? <><i className="fa-solid fa-spinner fa-spin mr-1.5" />Checking…</> : 'Sign In'}
          </button>
        </form>
        {error && <div className="text-rose-600 text-xs mt-2">{error}</div>}
      </div>
    </div>
  )
}
