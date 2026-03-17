export default function ReferenceSection() {
  return (
    <section>
      <div className="mb-7">
        <h2 className="font-serif text-3xl text-gray-800 mb-1.5">
          <i className="fa-solid fa-clipboard-list mr-2 text-rose-500" />Reference Guide
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed">Quick-reference targets and warning signs for Bill's CHF management. Based on his medical records and standard CHF guidelines.</p>
      </div>

      <div className="bg-white rounded-2xl p-7 shadow-sm mb-5">
        <div className="text-lg font-extrabold text-gray-800 mb-5 flex items-center gap-2">
          <i className="fa-solid fa-triangle-exclamation text-rose-600" />Emergency — Call 911 Immediately
        </div>
        <div className="bg-red-50 rounded-xl p-5 border-2 border-red-200">
          <ul className="flex flex-col gap-2.5 list-none">
            <li className="text-base font-bold text-rose-800"><i className="fa-solid fa-lungs mr-2" />Sudden severe shortness of breath, especially at rest</li>
            <li className="text-base font-bold text-rose-800"><i className="fa-solid fa-heart-pulse mr-2" />Chest pain or pressure</li>
            <li className="text-base font-bold text-rose-800"><i className="fa-solid fa-face-dizzy mr-2" />Fainting or loss of consciousness</li>
            <li className="text-base font-bold text-rose-800"><i className="fa-solid fa-comment mr-2" />Sudden confusion or inability to speak clearly</li>
            <li className="text-base font-bold text-rose-800"><i className="fa-solid fa-heart mr-2" />Heart racing uncontrollably or "flopping" sensation</li>
            <li className="text-base font-bold text-rose-800"><i className="fa-solid fa-circle mr-2 text-blue-600" />Lips or fingertips turning blue</li>
          </ul>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-7 shadow-sm mb-5">
        <div className="text-lg font-extrabold text-gray-800 mb-5 flex items-center gap-2">
          <i className="fa-solid fa-phone text-amber-500" />Call Doctor Same Day (Not Emergency)
        </div>
        <div className="bg-amber-50 rounded-xl p-5 border-2 border-amber-200">
          <ul className="flex flex-col gap-2.5 list-none">
            <li className="text-[15px] font-bold text-amber-800"><i className="fa-solid fa-scale-balanced mr-2" />Weight gain of 2+ lbs in one day</li>
            <li className="text-[15px] font-bold text-amber-800"><i className="fa-solid fa-scale-balanced mr-2" />Weight gain of 5+ lbs in one week</li>
            <li className="text-[15px] font-bold text-amber-800"><i className="fa-solid fa-person mr-2" />Sudden increase in leg or ankle swelling</li>
            <li className="text-[15px] font-bold text-amber-800"><i className="fa-solid fa-lungs mr-2" />Shortness of breath that is worse than usual</li>
            <li className="text-[15px] font-bold text-amber-800"><i className="fa-solid fa-stethoscope mr-2" />BP above 180/120 or below 90/60</li>
            <li className="text-[15px] font-bold text-amber-800"><i className="fa-solid fa-heart-pulse mr-2" />Heart rate above 120 bpm at rest</li>
          </ul>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-7 shadow-sm mb-5">
        <div className="text-lg font-extrabold text-gray-800 mb-5 flex items-center gap-2">
          <i className="fa-solid fa-bullseye text-teal-600" />Daily Target Ranges
        </div>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-3">
          {[
            { label: 'Blood Pressure', range: '< 130/80 mmHg', note: 'Below 120/80 is ideal', warn: false },
            { label: 'Resting Heart Rate', range: '60–100 bpm', note: '50–70 is ideal for CHF', warn: false },
            { label: 'Oxygen Saturation', range: '≥ 95%', note: 'Below 92% — call doctor', warn: false },
            { label: 'Sodium Intake', range: '< 2,000 mg/day', note: 'Critical for CHF', warn: true },
            { label: 'Fluid Intake', range: '1.5–2 L/day', note: 'Ask doctor for exact limit', warn: true },
            { label: 'Current Weight', range: '~244 lbs', note: 'Goal: gradual, safe reduction', warn: false },
          ].map(item => (
            <div key={item.label} className={`bg-gray-100 rounded-xl px-4 py-3.5 border-l-4 ${item.warn ? 'border-l-amber-500' : 'border-l-teal-600'}`}>
              <div className="text-xs font-extrabold uppercase tracking-[0.4px] text-gray-600 mb-1">{item.label}</div>
              <div className={`text-base font-bold ${item.warn ? 'text-amber-500' : 'text-teal-600'}`}>{item.range}</div>
              <div className="text-xs text-gray-400 mt-0.5">{item.note}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-7 shadow-sm mb-5">
        <div className="text-lg font-extrabold text-gray-800 mb-5 flex items-center gap-2">
          <i className="fa-solid fa-pills text-teal-600" />About Bill's CHF
        </div>
        <div className="flex flex-col gap-3">
          <p className="text-[15px] leading-[1.7] text-gray-600">Bill has <strong>congestive heart failure (CHF)</strong>, which means his heart muscle doesn't pump blood as efficiently as it should. This causes fluid to build up in the lungs and body. It is a manageable condition — with consistent daily monitoring and lifestyle choices, CHF patients can maintain a good quality of life.</p>
          <p className="text-[15px] leading-[1.7] text-gray-600">His most recent NT-proBNP (heart strain marker) was <strong>66 pg/mL</strong> (well within normal range), and his blood pressure has improved to <strong>136/72</strong> (Feb 2026). These are encouraging signs that his CHF is currently <em>compensated</em> — meaning his heart is managing reasonably well.</p>
          <p className="text-[15px] leading-[1.7] text-gray-600">The three most impactful daily habits are: <strong>weighing himself every morning</strong> (fluid changes happen fast), <strong>keeping sodium below 2,000mg</strong>, and <strong>taking all medications on schedule</strong>.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-7 shadow-sm mb-5">
        <div className="text-lg font-extrabold text-gray-800 mb-5 flex items-center gap-2">
          <i className="fa-solid fa-utensils text-teal-600" />Diet Quick Guide
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-green-50 rounded-xl p-4">
            <div className="font-extrabold text-green-600 mb-2.5"><i className="fa-solid fa-circle-check mr-2" />Good Choices</div>
            <ul className="flex flex-col gap-1.5 text-sm text-gray-700 list-none">
              <li>🥦 Fresh or frozen vegetables (no added salt)</li>
              <li>🐔 Lean proteins: chicken, fish, turkey</li>
              <li>🍎 Fresh fruit</li>
              <li>🌾 Whole grains, oats, brown rice</li>
              <li>🥛 Low-fat dairy (in moderation)</li>
              <li>🌿 Herbs and spices for flavor instead of salt</li>
            </ul>
          </div>
          <div className="bg-red-50 rounded-xl p-4">
            <div className="font-extrabold text-rose-600 mb-2.5"><i className="fa-solid fa-circle-xmark mr-2" />Limit or Avoid</div>
            <ul className="flex flex-col gap-1.5 text-sm text-gray-700 list-none">
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
