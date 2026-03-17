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
      <div className="bg-white rounded-3xl px-10 py-12 max-w-md w-full text-center shadow-2xl">
        <i className="fa-solid fa-heart text-rose-500 text-5xl mb-4 block" />
        <h1 className="font-serif text-3xl text-gray-800 mb-2">Bill's Health Tracker</h1>
        <p className="text-gray-600 mb-8 leading-relaxed">This is a private family health record. Enter the password to view.</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 text-left">
            <label className="block font-extrabold text-xs uppercase tracking-wide text-gray-600 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter password"
              autoFocus
              className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl font-sans text-base outline-none transition-colors focus:border-teal-600"
            />
          </div>
          <button
            className="w-full py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-sans text-lg font-extrabold transition-colors mt-2 disabled:bg-gray-200 disabled:text-gray-400"
            type="submit"
            disabled={loading}
          >
            {loading ? <><i className="fa-solid fa-spinner fa-spin mr-2" />Checking…</> : 'Enter'}
          </button>
        </form>
        {error && <div className="text-rose-600 text-sm mt-3">{error}</div>}
      </div>
    </div>
  )
}
