export default function ReferenceSection() {
  return (
    <section className="section active">
      <div className="section-header">
        <h2>📋 Reference Guide</h2>
        <p>Quick-reference targets and warning signs for Bill's CHF management. Based on his medical records and standard CHF guidelines.</p>
      </div>

      <div className="card">
        <div className="card-title"><span className="card-icon">🚨</span>Emergency — Call 911 Immediately</div>
        <div style={{ background: 'var(--red-pale)', borderRadius: 'var(--radius-sm)', padding: 20, border: '2px solid #f0a090' }}>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <li style={{ fontSize: 16, fontWeight: 700, color: 'var(--rust-dark)' }}>🫁 Sudden severe shortness of breath, especially at rest</li>
            <li style={{ fontSize: 16, fontWeight: 700, color: 'var(--rust-dark)' }}>💗 Chest pain or pressure</li>
            <li style={{ fontSize: 16, fontWeight: 700, color: 'var(--rust-dark)' }}>😵 Fainting or loss of consciousness</li>
            <li style={{ fontSize: 16, fontWeight: 700, color: 'var(--rust-dark)' }}>🗣️ Sudden confusion or inability to speak clearly</li>
            <li style={{ fontSize: 16, fontWeight: 700, color: 'var(--rust-dark)' }}>💓 Heart racing uncontrollably or "flopping" sensation</li>
            <li style={{ fontSize: 16, fontWeight: 700, color: 'var(--rust-dark)' }}>🔵 Lips or fingertips turning blue</li>
          </ul>
        </div>
      </div>

      <div className="card">
        <div className="card-title"><span className="card-icon">📞</span>Call Doctor Same Day (Not Emergency)</div>
        <div style={{ background: 'var(--amber-light)', borderRadius: 'var(--radius-sm)', padding: 20, border: '2px solid #f0c85a' }}>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <li style={{ fontSize: 15, fontWeight: 700, color: '#7a5010' }}>⚖️ Weight gain of 2+ lbs in one day</li>
            <li style={{ fontSize: 15, fontWeight: 700, color: '#7a5010' }}>⚖️ Weight gain of 5+ lbs in one week</li>
            <li style={{ fontSize: 15, fontWeight: 700, color: '#7a5010' }}>🦵 Sudden increase in leg or ankle swelling</li>
            <li style={{ fontSize: 15, fontWeight: 700, color: '#7a5010' }}>😮‍💨 Shortness of breath that is worse than usual</li>
            <li style={{ fontSize: 15, fontWeight: 700, color: '#7a5010' }}>🩺 BP above 180/120 or below 90/60</li>
            <li style={{ fontSize: 15, fontWeight: 700, color: '#7a5010' }}>💗 Heart rate above 120 bpm at rest</li>
          </ul>
        </div>
      </div>

      <div className="card">
        <div className="card-title"><span className="card-icon">🎯</span>Daily Target Ranges</div>
        <div className="reference-grid">
          <div className="reference-item"><div className="ref-label">Blood Pressure</div><div className="ref-range">&lt; 130/80 mmHg</div><div className="ref-note">Below 120/80 is ideal</div></div>
          <div className="reference-item"><div className="ref-label">Resting Heart Rate</div><div className="ref-range">60–100 bpm</div><div className="ref-note">50–70 is ideal for CHF</div></div>
          <div className="reference-item"><div className="ref-label">Oxygen Saturation</div><div className="ref-range">≥ 95%</div><div className="ref-note">Below 92% — call doctor</div></div>
          <div className="reference-item warn"><div className="ref-label">Sodium Intake</div><div className="ref-range">&lt; 2,000 mg/day</div><div className="ref-note">Critical for CHF</div></div>
          <div className="reference-item warn"><div className="ref-label">Fluid Intake</div><div className="ref-range">1.5–2 L/day</div><div className="ref-note">Ask doctor for exact limit</div></div>
          <div className="reference-item"><div className="ref-label">Current Weight</div><div className="ref-range">~244 lbs</div><div className="ref-note">Goal: gradual, safe reduction</div></div>
        </div>
      </div>

      <div className="card">
        <div className="card-title"><span className="card-icon">💊</span>About Bill's CHF</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--gray-600)' }}>Bill has <strong>congestive heart failure (CHF)</strong>, which means his heart muscle doesn't pump blood as efficiently as it should. This causes fluid to build up in the lungs and body. It is a manageable condition — with consistent daily monitoring and lifestyle choices, CHF patients can maintain a good quality of life.</p>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--gray-600)' }}>His most recent NT-proBNP (heart strain marker) was <strong>66 pg/mL</strong> (well within normal range), and his blood pressure has improved to <strong>136/72</strong> (Feb 2026). These are encouraging signs that his CHF is currently <em>compensated</em> — meaning his heart is managing reasonably well.</p>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--gray-600)' }}>The three most impactful daily habits are: <strong>weighing himself every morning</strong> (fluid changes happen fast), <strong>keeping sodium below 2,000mg</strong>, and <strong>taking all medications on schedule</strong>.</p>
        </div>
      </div>

      <div className="card">
        <div className="card-title"><span className="card-icon">🍽️</span>Diet Quick Guide</div>
        <div className="form-grid-2">
          <div style={{ background: 'var(--green-pale)', borderRadius: 'var(--radius-sm)', padding: 16 }}>
            <div style={{ fontWeight: 800, color: 'var(--green)', marginBottom: 10 }}>✅ Good Choices</div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6, fontSize: 14, color: 'var(--gray-700)' }}>
              <li>🥦 Fresh or frozen vegetables (no added salt)</li>
              <li>🐔 Lean proteins: chicken, fish, turkey</li>
              <li>🍎 Fresh fruit</li>
              <li>🌾 Whole grains, oats, brown rice</li>
              <li>🥛 Low-fat dairy (in moderation)</li>
              <li>🌿 Herbs and spices for flavor instead of salt</li>
            </ul>
          </div>
          <div style={{ background: 'var(--red-pale)', borderRadius: 'var(--radius-sm)', padding: 16 }}>
            <div style={{ fontWeight: 800, color: 'var(--rust)', marginBottom: 10 }}>❌ Limit or Avoid</div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6, fontSize: 14, color: 'var(--gray-700)' }}>
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
