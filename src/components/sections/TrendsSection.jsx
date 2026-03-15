import { useState, useMemo } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, ResponsiveContainer, Legend
} from 'recharts'

const RANGE_OPTIONS = [
  { label: '7 days', value: 7 },
  { label: '30 days', value: 30 },
  { label: '90 days', value: 90 },
  { label: 'All', value: Infinity },
]

function shortDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr + 'T12:00:00')
  return (d.getMonth() + 1) + '/' + d.getDate()
}

const CustomTooltipDate = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: 'white', border: '1px solid #e8e0d8', borderRadius: 8, padding: '8px 12px', fontSize: 13 }}>
      <div style={{ fontWeight: 700, marginBottom: 4 }}>{label}</div>
      {payload.map(p => (
        <div key={p.dataKey} style={{ color: p.color }}>
          {p.name}: <strong>{p.value ?? '—'}{p.unit || ''}</strong>
        </div>
      ))}
    </div>
  )
}

export default function TrendsSection({ entries }) {
  const [range, setRange] = useState(30)

  const chartData = useMemo(() => {
    const slice = range === Infinity ? entries : entries.slice(0, range)
    return slice
      .filter(e => e.date)
      .reverse()
      .map(e => ({
        label: shortDate(e.date) + (e.time ? ' ' + e.time : ''),
        date: e.date,
        weight: e.weight ? parseFloat(e.weight) : null,
        bpSys: e.bpSys ? parseInt(e.bpSys) : null,
        bpDia: e.bpDia ? parseInt(e.bpDia) : null,
        hr: e.hr ? parseInt(e.hr) : null,
        o2: e.o2 ? parseInt(e.o2) : null,
      }))
  }, [entries, range])

  // Baseline weight = earliest weight reading in the range
  const baselineWeight = useMemo(() => {
    const weights = chartData.map(d => d.weight).filter(w => w != null)
    return weights.length ? weights[0] : null
  }, [chartData])

  if (entries.length < 2) {
    return (
      <div className="empty-state" style={{ padding: '60px 24px' }}>
        <div className="empty-icon">📈</div>
        <p>At least 2 daily entries are needed to show trends.</p>
      </div>
    )
  }

  const chartProps = {
    margin: { top: 8, right: 16, left: 0, bottom: 0 },
  }

  return (
    <div>
      {/* Range selector */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {RANGE_OPTIONS.map(opt => (
          <button
            key={opt.value}
            onClick={() => setRange(opt.value)}
            style={{
              padding: '6px 16px',
              borderRadius: 20,
              border: '2px solid',
              borderColor: range === opt.value ? 'var(--teal)' : 'var(--gray-200)',
              background: range === opt.value ? 'var(--teal)' : 'white',
              color: range === opt.value ? 'white' : 'var(--gray-600)',
              fontFamily: 'Nunito, sans-serif',
              fontWeight: 700,
              fontSize: 13,
              cursor: 'pointer',
            }}
          >
            {opt.label}
          </button>
        ))}
        <span style={{ fontSize: 13, color: 'var(--gray-400)', alignSelf: 'center', marginLeft: 4 }}>
          {chartData.length} readings
        </span>
      </div>

      {/* Weight chart */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-title" style={{ marginBottom: 4 }}>
          <span className="card-icon">⚖️</span>Weight
          <span style={{ fontSize: 12, fontWeight: 400, color: 'var(--gray-400)', marginLeft: 8 }}>
            Daily morning weight — fluid retention warning: +2 lbs/day
          </span>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData} {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0ebe5" />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
            <YAxis
              domain={['auto', 'auto']}
              tick={{ fontSize: 11 }}
              tickFormatter={v => v + ' lbs'}
              width={64}
            />
            <Tooltip content={<CustomTooltipDate />} />
            {baselineWeight && (
              <ReferenceLine y={baselineWeight + 2} stroke="#e89c30" strokeDasharray="4 3" label={{ value: '+2 lbs', position: 'right', fontSize: 10, fill: '#e89c30' }} />
            )}
            {baselineWeight && (
              <ReferenceLine y={baselineWeight + 5} stroke="#c8553d" strokeDasharray="4 3" label={{ value: '+5 lbs', position: 'right', fontSize: 10, fill: '#c8553d' }} />
            )}
            <Line
              type="monotone"
              dataKey="weight"
              name="Weight"
              unit=" lbs"
              stroke="#2a7c8a"
              strokeWidth={2}
              dot={{ r: 3, fill: '#2a7c8a' }}
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Blood pressure chart */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-title" style={{ marginBottom: 4 }}>
          <span className="card-icon">❤️</span>Blood Pressure
          <span style={{ fontSize: 12, fontWeight: 400, color: 'var(--gray-400)', marginLeft: 8 }}>
            Target: &lt;130/80 mmHg
          </span>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData} {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0ebe5" />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
            <YAxis domain={[40, 'auto']} tick={{ fontSize: 11 }} tickFormatter={v => v} width={36} />
            <Tooltip content={<CustomTooltipDate />} />
            <ReferenceLine y={180} stroke="#c8553d" strokeDasharray="4 3" label={{ value: '180 alert', position: 'right', fontSize: 10, fill: '#c8553d' }} />
            <ReferenceLine y={130} stroke="#e89c30" strokeDasharray="4 3" label={{ value: '130 target', position: 'right', fontSize: 10, fill: '#e89c30' }} />
            <ReferenceLine y={80} stroke="#e89c30" strokeDasharray="4 3" label={{ value: '80 target', position: 'right', fontSize: 10, fill: '#e89c30' }} />
            <Line type="monotone" dataKey="bpSys" name="Systolic" unit=" mmHg" stroke="#c8553d" strokeWidth={2} dot={{ r: 3 }} connectNulls />
            <Line type="monotone" dataKey="bpDia" name="Diastolic" unit=" mmHg" stroke="#e89c30" strokeWidth={2} dot={{ r: 3 }} connectNulls />
            <Legend wrapperStyle={{ fontSize: 12 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Heart rate chart */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-title" style={{ marginBottom: 4 }}>
          <span className="card-icon">💓</span>Heart Rate
          <span style={{ fontSize: 12, fontWeight: 400, color: 'var(--gray-400)', marginLeft: 8 }}>
            Target: 60–100 bpm (50–70 ideal for CHF)
          </span>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData} {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0ebe5" />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
            <YAxis domain={[40, 'auto']} tick={{ fontSize: 11 }} tickFormatter={v => v + ' bpm'} width={56} />
            <Tooltip content={<CustomTooltipDate />} />
            <ReferenceLine y={120} stroke="#c8553d" strokeDasharray="4 3" label={{ value: '120 alert', position: 'right', fontSize: 10, fill: '#c8553d' }} />
            <ReferenceLine y={100} stroke="#e89c30" strokeDasharray="4 3" label={{ value: '100 target', position: 'right', fontSize: 10, fill: '#e89c30' }} />
            <ReferenceLine y={60} stroke="#4a9060" strokeDasharray="4 3" label={{ value: '60 target', position: 'right', fontSize: 10, fill: '#4a9060' }} />
            <Line type="monotone" dataKey="hr" name="Heart Rate" unit=" bpm" stroke="#c8553d" strokeWidth={2} dot={{ r: 3 }} connectNulls />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* O2 saturation chart */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-title" style={{ marginBottom: 4 }}>
          <span className="card-icon">🫁</span>Oxygen Saturation
          <span style={{ fontSize: 12, fontWeight: 400, color: 'var(--gray-400)', marginLeft: 8 }}>
            Target: ≥95% — below 92% requires immediate attention
          </span>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData} {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0ebe5" />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
            <YAxis domain={[85, 100]} tick={{ fontSize: 11 }} tickFormatter={v => v + '%'} width={44} />
            <Tooltip content={<CustomTooltipDate />} />
            <ReferenceLine y={92} stroke="#c8553d" strokeDasharray="4 3" label={{ value: '92% alert', position: 'right', fontSize: 10, fill: '#c8553d' }} />
            <ReferenceLine y={95} stroke="#e89c30" strokeDasharray="4 3" label={{ value: '95% target', position: 'right', fontSize: 10, fill: '#e89c30' }} />
            <Line type="monotone" dataKey="o2" name="O₂ Sat" unit="%" stroke="#2a7c8a" strokeWidth={2} dot={{ r: 3 }} connectNulls />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
