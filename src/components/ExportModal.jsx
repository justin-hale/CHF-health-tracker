import { exportDailyCSV, exportVisitsCSV, printMedicalReport } from '../utils/export.js'

export default function ExportModal({ data, onClose }) {
  return (
    <div
      className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center p-6"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl border border-gray-100">
        <h2 className="font-semibold text-gray-900 text-base mb-1">
          <i className="fa-solid fa-file-export mr-1.5 text-teal-600 text-sm" />Export Data
        </h2>
        <p className="text-gray-600 text-xs leading-relaxed mb-4">
          Download as CSV for spreadsheets, or generate a formatted medical summary.
        </p>

        <div className="flex flex-col gap-2 mb-4">
          <button
            className="text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-md transition cursor-pointer"
            onClick={() => { exportDailyCSV(data.daily); onClose() }}
          >
            <div className="font-semibold text-sm text-gray-900"><i className="fa-solid fa-table mr-1.5 text-teal-600 text-xs" />Daily Vitals CSV</div>
            <div className="text-xs text-gray-500 mt-0.5">Date, BP, HR, O₂, weight, symptoms — {data.daily.length} entries</div>
          </button>
          <button
            className="text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-md transition cursor-pointer"
            onClick={() => { exportVisitsCSV(data.visits); onClose() }}
          >
            <div className="font-semibold text-sm text-gray-900"><i className="fa-solid fa-hospital mr-1.5 text-teal-600 text-xs" />Doctor Visits CSV</div>
            <div className="text-xs text-gray-500 mt-0.5">All visit notes and findings — {data.visits.length} visits</div>
          </button>
          <button
            className="text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-md transition cursor-pointer"
            onClick={() => { printMedicalReport(data); onClose() }}
          >
            <div className="font-semibold text-sm text-gray-900"><i className="fa-solid fa-print mr-1.5 text-teal-600 text-xs" />Print Medical Summary</div>
            <div className="text-xs text-gray-500 mt-0.5">Formatted report with vitals, flags, and visit notes</div>
          </button>
        </div>

        <button
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md font-sans text-sm font-semibold transition cursor-pointer"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  )
}
