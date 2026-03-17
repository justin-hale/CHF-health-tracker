export default function EditingBanner({ visible, onCancel }) {
  if (!visible) return null
  return (
    <div className="bg-amber-50 border-2 border-amber-300 rounded-xl px-4 py-2.5 text-sm font-bold text-amber-800 mb-4 flex items-center gap-3">
      <i className="fa-solid fa-pen text-amber-600" />
      Editing existing entry — changes will update the original record.
      <button
        className="ml-auto px-3.5 py-1.5 bg-white text-amber-800 border border-amber-300 rounded-lg text-xs font-bold cursor-pointer hover:bg-amber-100 transition"
        onClick={onCancel}
      >
        <i className="fa-solid fa-xmark mr-1" />Cancel
      </button>
    </div>
  )
}
