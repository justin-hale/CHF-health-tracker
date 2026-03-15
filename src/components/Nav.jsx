const TABS = [
  { id: 'daily', icon: '📅', label: 'Daily Log' },
  { id: 'weekly', icon: '📊', label: 'Weekly Check-In' },
  { id: 'journal', icon: '📓', label: 'Journal' },
  { id: 'visits', icon: '🏥', label: 'Doctor Visits' },
  { id: 'reference', icon: '📋', label: 'Reference Guide' },
]

export default function Nav({ activeSection, onSelect }) {
  return (
    <nav>
      <div className="nav-inner">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={'nav-tab' + (activeSection === tab.id ? ' active' : '')}
            onClick={() => onSelect(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>{tab.label}
          </button>
        ))}
      </div>
    </nav>
  )
}
