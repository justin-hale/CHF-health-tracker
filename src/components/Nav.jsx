const TABS = [
  { id: 'daily',     icon: 'fa-calendar-day',    label: 'Daily Log' },
  { id: 'weekly',    icon: 'fa-chart-bar',        label: 'Weekly Check-In' },
  { id: 'journal',   icon: 'fa-book',             label: 'Journal' },
  { id: 'visits',    icon: 'fa-hospital',         label: 'Doctor Visits' },
  { id: 'reference', icon: 'fa-clipboard-list',   label: 'Reference Guide' },
]

export default function Nav({ activeSection, onSelect }) {
  return (
    <nav className="bg-white border-b-2 border-gray-200 px-6">
      <div className="max-w-6xl mx-auto flex gap-1 overflow-x-auto scrollbar-hide">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => onSelect(tab.id)}
            className={
              'px-5 py-3.5 border-none bg-transparent font-sans font-bold text-[15px] cursor-pointer border-b-[3px] whitespace-nowrap transition-colors -mb-0.5 ' +
              (activeSection === tab.id
                ? 'text-rose-600 border-rose-600'
                : 'text-gray-400 border-transparent hover:text-gray-800')
            }
          >
            <i className={`fa-solid ${tab.icon} mr-1.5`} />{tab.label}
          </button>
        ))}
      </div>
    </nav>
  )
}
