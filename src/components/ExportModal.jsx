import { exportDailyCSV, exportVisitsCSV, printMedicalReport } from '../utils/export.js'

export default function ExportModal({ data, onClose }) {
  return (
    <div
      className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center p-6"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl p-9 max-w-lg w-full shadow-2xl">
        <h2 className="font-serif text-2xl text-gray-800 mb-2">
          <i className="fa-solid fa-file-export mr-2 text-teal-600" />Export Data
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-5">
          Download data as CSV for spreadsheets, or generate a formatted medical summary for clinical staff.
        </p>

        <div className="flex flex-col gap-3 my-5">
          <button
            className="text-left px-5 py-3.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-sans font-extrabold text-[17px] transition active:scale-[0.98] cursor-pointer"
            onClick={() => { exportDailyCSV(data.daily); onClose() }}
          >
            <i className="fa-solid fa-table mr-2" />Download Daily Vitals CSV
            <span className="block text-xs font-normal opacity-80 mt-0.5">
              Date, BP, HR, O₂, weight, symptoms — {data.daily.length} entries
            </span>
          </button>
          <button
            className="text-left px-5 py-3.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-sans font-extrabold text-[17px] transition active:scale-[0.98] cursor-pointer"
            onClick={() => { exportVisitsCSV(data.visits); onClose() }}
          >
            <i className="fa-solid fa-hospital mr-2" />Download Doctor Visits CSV
            <span className="block text-xs font-normal opacity-80 mt-0.5">
              All visit notes and findings — {data.visits.length} visits
            </span>
          </button>
          <button
            className="text-left px-5 py-3.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-sans font-extrabold text-[17px] transition active:scale-[0.98] cursor-pointer"
            onClick={() => { printMedicalReport(data); onClose() }}
          >
            <i className="fa-solid fa-print mr-2" />Print Medical Summary
            <span className="block text-xs font-normal opacity-80 mt-0.5">
              Formatted report with vitals, flags, and visit notes — opens print dialog
            </span>
          </button>
        </div>

        <button
          className="px-6 py-3 bg-gray-100 text-gray-600 border-none rounded-xl font-sans text-[15px] font-bold cursor-pointer hover:bg-gray-200 transition"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  )
}
