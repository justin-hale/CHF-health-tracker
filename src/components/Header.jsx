export default function Header({ isEditor, syncStatus, gistToken, onOpenGistModal, onSync, onSignOut }) {
  const syncLabel = syncStatus === 'syncing' ? '⏳ Syncing…' : syncStatus === 'synced' ? '✅ Synced!' : syncStatus === 'error' ? '❌ Sync Failed' : '☁️ Sync'

  return (
    <header>
      <div className="header-inner">
        <div className="header-brand">
          <span className="logo">❤️</span>
          <h1>Bill's Health Tracker<span>Kendrick Family</span></h1>
        </div>
        <div className="header-status">
          <span className={'mode-badge ' + (isEditor ? 'editor' : 'reader')}>
            {isEditor ? '✏️ Editor' : '👁 View Only'}
          </span>
          {!gistToken && (
            <button className="sync-btn" onClick={onOpenGistModal}>⚙️ Setup Sync</button>
          )}
          {gistToken && (
            <button className="sync-btn" onClick={onSync} disabled={syncStatus === 'syncing'}>
              {syncLabel}
            </button>
          )}
          <button className="sync-btn" onClick={onSignOut}>🔒 Sign Out</button>
        </div>
      </div>
    </header>
  )
}
