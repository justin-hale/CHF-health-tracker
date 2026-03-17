export default function EditingBanner({ visible, onCancel }) {
  if (!visible) return null
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-md px-3 py-2 text-xs font-semibold text-amber-700 mb-3 flex items-center gap-2">
      <i className="fa-solid fa-pen text-amber-500 text-[11px]" />
      Editing existing entry — changes will update the original record.
      <button
        className="ml-auto px-2.5 py-1 bg-white text-amber-700 border border-amber-200 rounded text-xs font-semibold cursor-pointer hover:bg-amber-100 transition"
        onClick={onCancel}
      >
        <i className="fa-solid fa-xmark mr-1" />Cancel
      </button>
    </div>
  )
}
