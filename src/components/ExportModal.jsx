import { exportDailyCSV, exportVisitsCSV, printMedicalReport } from '../utils/export.js'

export default function ExportModal({ data, onClose }) {
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-card">
        <h2>📤 Export Data</h2>
        <p>Download data as CSV for spreadsheets, or generate a formatted medical summary for clinical staff.</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, margin: '20px 0' }}>
          <button className="btn-save" style={{ textAlign: 'left' }} onClick={() => { exportDailyCSV(data.daily); onClose() }}>
            📊 Download Daily Vitals CSV
            <span style={{ display: 'block', fontSize: 12, fontWeight: 400, opacity: 0.8, marginTop: 2 }}>
              Date, BP, HR, O₂, weight, symptoms — {data.daily.length} entries
            </span>
          </button>
          <button className="btn-save" style={{ textAlign: 'left' }} onClick={() => { exportVisitsCSV(data.visits); onClose() }}>
            🏥 Download Doctor Visits CSV
            <span style={{ display: 'block', fontSize: 12, fontWeight: 400, opacity: 0.8, marginTop: 2 }}>
              All visit notes and findings — {data.visits.length} visits
            </span>
          </button>
          <button className="btn-save" style={{ background: 'var(--teal)', textAlign: 'left' }} onClick={() => { printMedicalReport(data); onClose() }}>
            🖨️ Print Medical Summary
            <span style={{ display: 'block', fontSize: 12, fontWeight: 400, opacity: 0.8, marginTop: 2 }}>
              Formatted report with vitals, flags, and visit notes — opens print dialog
            </span>
          </button>
        </div>

        <button className="btn-secondary" onClick={onClose}>Close</button>
      </div>
    </div>
  )
}
