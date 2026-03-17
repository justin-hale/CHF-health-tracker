export default function Header({ isEditor, syncStatus, gistToken, onOpenGistModal, onSync, onSignOut, onExport }) {
  const syncLabel = syncStatus === 'syncing'
    ? <><i className="fa-solid fa-spinner fa-spin mr-1.5" />Syncing…</>
    : syncStatus === 'synced'
    ? <><i className="fa-solid fa-circle-check mr-1.5" />Synced!</>
    : syncStatus === 'error'
    ? <><i className="fa-solid fa-circle-xmark mr-1.5" />Sync Failed</>
    : <><i className="fa-solid fa-cloud mr-1.5" />Sync</>

  const btnBase = 'px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white border-none rounded-lg font-sans font-bold text-sm cursor-pointer transition-colors disabled:bg-gray-200 disabled:text-gray-400'

  return (
    <header className="bg-white border-b-2 border-gray-200 px-6 sticky top-0 z-[100] shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between h-[72px] gap-4">
        <div className="flex items-center gap-3">
          <i className="fa-solid fa-heart text-rose-500 text-3xl" />
          <h1 className="font-serif text-[22px] text-rose-600 leading-tight">
            Bill's Health Tracker
            <span className="text-xs text-gray-400 font-sans font-semibold block">Kendrick Family</span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-3.5 py-1.5 rounded-full text-sm font-bold ${isEditor ? 'bg-amber-50 text-amber-700' : 'bg-teal-50 text-teal-600'}`}>
            {isEditor
              ? <><i className="fa-solid fa-pen mr-1.5" />Editor</>
              : <><i className="fa-solid fa-eye mr-1.5" />View Only</>}
          </span>
          {!gistToken && (
            <button className={btnBase} onClick={onOpenGistModal}>
              <i className="fa-solid fa-gear mr-1.5" />Setup Sync
            </button>
          )}
          {gistToken && (
            <button className={btnBase} onClick={onSync} disabled={syncStatus === 'syncing'}>
              {syncLabel}
            </button>
          )}
          {isEditor && (
            <button className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-white border-none rounded-lg font-sans font-bold text-sm cursor-pointer transition-colors" onClick={onExport}>
              <i className="fa-solid fa-file-export mr-1.5" />Export
            </button>
          )}
          <button className={btnBase} onClick={onSignOut}>
            <i className="fa-solid fa-right-from-bracket mr-1.5" />Sign Out
          </button>
        </div>
      </div>
    </header>
  )
}
