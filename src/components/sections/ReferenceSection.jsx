const card = 'bg-white rounded-lg border border-gray-100 p-5 shadow-sm mb-3'
const cardTitle = 'text-sm font-bold text-gray-800 mb-3 flex items-center gap-2'

export default function ReferenceSection() {
  return (
    <section>
      <div className="mb-4">
        <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
          <i className="fa-solid fa-clipboard-list text-emerald-500 text-sm" />Reference Guide
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">Quick-reference targets and warning signs for Bill's CHF management.</p>
      </div>

      <div className={card}>
        <div className={cardTitle + ' text-rose-700'}>
          <i className="fa-solid fa-triangle-exclamation text-rose-500" />Emergency — Call 911 Immediately
        </div>
        <ul className="flex flex-col gap-2 list-none">
          {[
            ['fa-lungs', 'Sudden severe shortness of breath, especially at rest'],
            ['fa-heart-pulse', 'Chest pain or pressure'],
            ['fa-face-dizzy', 'Fainting or loss of consciousness'],
            ['fa-comment', 'Sudden confusion or inability to speak clearly'],
            ['fa-heart', 'Heart racing uncontrollably or "flopping" sensation'],
            ['fa-circle text-blue-500', 'Lips or fingertips turning blue'],
          ].map(([icon, text]) => (
            <li key={text} className="flex items-start gap-2 text-sm font-medium text-rose-700">
              <i className={`fa-solid ${icon} mt-0.5 w-4 shrink-0`} />{text}
            </li>
          ))}
        </ul>
      </div>

      <div className={card}>
        <div className={cardTitle + ' text-amber-700'}>
          <i className="fa-solid fa-phone text-amber-500" />Call Doctor Same Day
        </div>
        <ul className="flex flex-col gap-2 list-none">
          {[
            ['fa-scale-balanced', 'Weight gain of 2+ lbs in one day'],
            ['fa-scale-balanced', 'Weight gain of 5+ lbs in one week'],
            ['fa-person', 'Sudden increase in leg or ankle swelling'],
            ['fa-lungs', 'Shortness of breath worse than usual'],
            ['fa-stethoscope', 'BP above 180/120 or below 90/60'],
            ['fa-heart-pulse', 'Heart rate above 120 bpm at rest'],
          ].map(([icon, text]) => (
            <li key={text} className="flex items-start gap-2 text-sm font-medium text-amber-700">
              <i className={`fa-solid ${icon} mt-0.5 w-4 shrink-0`} />{text}
            </li>
          ))}
        </ul>
      </div>

      <div className={card}>
        <div className={cardTitle}><i className="fa-solid fa-bullseye text-teal-600" />Daily Target Ranges</div>
        <div className="flex flex-col gap-2">
          {[
            { label: 'Blood Pressure', range: '< 130/80 mmHg', note: 'Below 120/80 ideal', warn: false },
            { label: 'Resting Heart Rate', range: '60–100 bpm', note: '50–70 ideal for CHF', warn: false },
            { label: 'O₂ Saturation', range: '≥ 95%', note: 'Below 92% — call doctor', warn: false },
            { label: 'Sodium Intake', range: '< 2,000 mg/day', note: 'Critical for CHF', warn: true },
            { label: 'Fluid Intake', range: '1.5–2 L/day', note: 'Ask doctor for exact limit', warn: true },
            { label: 'Current Weight', range: '~244 lbs', note: 'Goal: gradual reduction', warn: false },
          ].map(item => (
            <div key={item.label} className={`rounded-md px-3 py-2.5 border-l-2 bg-gray-50 ${item.warn ? 'border-l-amber-400' : 'border-l-teal-500'}`}>
              <div className="text-[10px] font-semibold uppercase tracking-wide text-gray-500 mb-0.5">{item.label}</div>
              <div className={`text-sm font-bold ${item.warn ? 'text-amber-500' : 'text-teal-600'}`}>{item.range}</div>
              <div className="text-[11px] text-gray-500 mt-0.5">{item.note}</div>
            </div>
          ))}
        </div>
      </div>

      <div className={card}>
        <div className={cardTitle}><i className="fa-solid fa-pills text-teal-600" />About Bill's CHF</div>
        <div className="flex flex-col gap-2 text-xs text-gray-700 leading-relaxed">
          <p>Bill has <strong className="text-gray-800">congestive heart failure (CHF)</strong> — his heart muscle doesn't pump as efficiently as it should, causing fluid to build up. With consistent monitoring and lifestyle choices, it's a manageable condition.</p>
          <p>His most recent NT-proBNP was <strong className="text-gray-800">66 pg/mL</strong> (normal range) and BP improved to <strong className="text-gray-800">136/72</strong> (Feb 2026) — signs his CHF is currently <em>compensated</em>.</p>
          <p>Three most impactful habits: <strong className="text-gray-800">weigh every morning</strong>, <strong className="text-gray-800">keep sodium below 2,000mg</strong>, and <strong className="text-gray-800">take all medications on schedule</strong>.</p>
        </div>
      </div>

      <div className={card}>
        <div className={cardTitle}><i className="fa-solid fa-utensils text-teal-600" />Diet Quick Guide</div>
        <div className="flex flex-col gap-3">
          <div className="bg-green-50 rounded-md p-3 border border-green-100">
            <div className="text-xs font-semibold text-green-700 mb-2"><i className="fa-solid fa-circle-check mr-1.5" />Good Choices</div>
            <ul className="flex flex-col gap-1 text-xs text-gray-700 list-none">
              <li>🥦 Fresh/frozen vegetables (no added salt)</li>
              <li>🐔 Lean proteins: chicken, fish, turkey</li>
              <li>🍎 Fresh fruit</li>
              <li>🌾 Whole grains, oats, brown rice</li>
              <li>🥛 Low-fat dairy (in moderation)</li>
              <li>🌿 Herbs and spices instead of salt</li>
            </ul>
          </div>
          <div className="bg-red-50 rounded-md p-3 border border-red-100">
            <div className="text-xs font-semibold text-rose-600 mb-2"><i className="fa-solid fa-circle-xmark mr-1.5" />Limit or Avoid</div>
            <ul className="flex flex-col gap-1 text-xs text-gray-700 list-none">
              <li>🧂 Table salt and salty condiments</li>
              <li>🥫 Canned soups, processed meats</li>
              <li>🍟 Fast food (extremely high sodium)</li>
              <li>🍺 Alcohol (weakens heart muscle)</li>
              <li>🧀 High-sodium cheeses</li>
              <li>🥤 Excess fluids beyond daily limit</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
