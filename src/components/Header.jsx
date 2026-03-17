export default function Header({ isEditor, syncStatus, gistToken, onOpenGistModal, onSync, onSignOut, onExport }) {
  const syncLabel = syncStatus === 'syncing'
    ? <><i className="fa-solid fa-spinner fa-spin" /><span className="hidden sm:inline ml-1">Syncing…</span></>
    : syncStatus === 'synced'
    ? <><i className="fa-solid fa-circle-check" /><span className="hidden sm:inline ml-1">Synced</span></>
    : syncStatus === 'error'
    ? <><i className="fa-solid fa-circle-xmark" /><span className="hidden sm:inline ml-1">Sync Failed</span></>
    : <><i className="fa-solid fa-cloud" /><span className="hidden sm:inline ml-1">Sync</span></>

  const btnBase = 'px-2 sm:px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded font-sans font-semibold text-xs cursor-pointer transition-colors disabled:bg-gray-200 disabled:text-gray-500'

  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-6 sticky top-0 z-[100]">
      <div className="max-w-5xl mx-auto flex items-center justify-between h-14 gap-4">
        <div className="flex items-center gap-2.5 shrink-0">
          <i className="fa-solid fa-heart text-rose-500 text-xl" />
          <div>
            <div className="font-semibold text-gray-900 text-sm leading-tight">Bill's Health Tracker</div>
            <div className="text-[11px] text-gray-500 hidden sm:block">Kendrick Family</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className={`px-2 sm:px-2.5 py-1 rounded text-xs font-semibold ${isEditor ? 'bg-amber-50 text-amber-700' : 'bg-teal-50 text-teal-600'}`}>
            <i className={`fa-solid ${isEditor ? 'fa-pen' : 'fa-eye'}`} />
            <span className="hidden sm:inline ml-1">{isEditor ? 'Editor' : 'View Only'}</span>
          </span>
          {!gistToken && (
            <button className={btnBase} onClick={onOpenGistModal}>
              <i className="fa-solid fa-gear" /><span className="hidden sm:inline ml-1">Setup Sync</span>
            </button>
          )}
          {gistToken && (
            <button className={btnBase} onClick={onSync} disabled={syncStatus === 'syncing'}>
              {syncLabel}
            </button>
          )}
          {isEditor && (
            <button className="px-2 sm:px-3 py-1.5 bg-teal-500 hover:bg-teal-400 text-white rounded font-sans font-semibold text-xs cursor-pointer transition-colors" onClick={onExport}>
              <i className="fa-solid fa-file-export" /><span className="hidden sm:inline ml-1">Export</span>
            </button>
          )}
          <button className={btnBase} onClick={onSignOut}>
            <i className="fa-solid fa-right-from-bracket" /><span className="hidden sm:inline ml-1">Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  )
}
