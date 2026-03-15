export default function EditingBanner({ visible, onCancel }) {
  if (!visible) return null
  return (
    <div className="editing-banner visible">
      ✏️ Editing existing entry — changes will update the original record.
      <button className="btn-cancel-edit" onClick={onCancel}>✕ Cancel</button>
    </div>
  )
}
