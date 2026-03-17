const TABS = [
  { id: 'daily',     icon: 'fa-calendar-day',   label: 'Daily' },
  { id: 'weekly',    icon: 'fa-chart-bar',       label: 'Weekly' },
  { id: 'journal',   icon: 'fa-book',            label: 'Journal' },
  { id: 'visits',    icon: 'fa-hospital',        label: 'Visits' },
  { id: 'reference', icon: 'fa-clipboard-list',  label: 'Guide' },
]

export default function Nav({ activeSection, onSelect }) {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-[57px] z-10">
      <div className="max-w-5xl mx-auto flex">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => onSelect(tab.id)}
            className={
              'flex-1 flex flex-col items-center gap-1 py-2.5 border-none bg-transparent cursor-pointer border-b-2 -mb-px transition-colors font-sans ' +
              (activeSection === tab.id
                ? 'text-rose-600 border-rose-600'
                : 'text-gray-500 border-transparent hover:text-gray-600')
            }
          >
            <i className={`fa-solid ${tab.icon} text-base`} />
            <span className="text-[11px] font-semibold uppercase tracking-wide">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}
