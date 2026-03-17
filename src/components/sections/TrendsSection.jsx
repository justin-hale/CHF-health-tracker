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
    <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-[13px]">
      <div className="font-bold mb-1">{label}</div>
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

  const baselineWeight = useMemo(() => {
    const weights = chartData.map(d => d.weight).filter(w => w != null)
    return weights.length ? weights[0] : null
  }, [chartData])

  if (entries.length < 2) {
    return (
      <div className="text-center py-16 px-6 text-gray-400">
        <i className="fa-solid fa-chart-line text-5xl mb-3 block" />
        <p className="text-base">At least 2 daily entries are needed to show trends.</p>
      </div>
    )
  }

  const chartProps = {
    margin: { top: 8, right: 16, left: 0, bottom: 0 },
  }

  const cardCls = 'bg-white rounded-2xl p-7 shadow-sm mb-5'
  const cardTitleCls = 'text-lg font-extrabold text-gray-800 mb-1 flex items-center gap-2'

  return (
    <div>
      <div className="flex gap-2 mb-6 flex-wrap">
        {RANGE_OPTIONS.map(opt => (
          <button
            key={opt.value}
            onClick={() => setRange(opt.value)}
            className={`px-4 py-1.5 rounded-full border-2 font-sans font-bold text-[13px] cursor-pointer transition ${
              range === opt.value
                ? 'border-teal-600 bg-teal-600 text-white'
                : 'border-gray-200 bg-white text-gray-600 hover:border-teal-600'
            }`}
          >
            {opt.label}
          </button>
        ))}
        <span className="text-[13px] text-gray-400 self-center ml-1">{chartData.length} readings</span>
      </div>

      <div className={cardCls}>
        <div className={cardTitleCls}>
          <i className="fa-solid fa-scale-balanced text-teal-600" />Weight
          <span className="text-xs font-normal text-gray-400 ml-2">Daily morning weight — fluid retention warning: +2 lbs/day</span>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData} {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
            <YAxis domain={['auto', 'auto']} tick={{ fontSize: 11 }} tickFormatter={v => v + ' lbs'} width={64} />
            <Tooltip content={<CustomTooltipDate />} />
            {baselineWeight && (
              <ReferenceLine y={baselineWeight + 2} stroke="#f59e0b" strokeDasharray="4 3" label={{ value: '+2 lbs', position: 'right', fontSize: 10, fill: '#f59e0b' }} />
            )}
            {baselineWeight && (
              <ReferenceLine y={baselineWeight + 5} stroke="#e11d48" strokeDasharray="4 3" label={{ value: '+5 lbs', position: 'right', fontSize: 10, fill: '#e11d48' }} />
            )}
            <Line type="monotone" dataKey="weight" name="Weight" unit=" lbs" stroke="#0d9488" strokeWidth={2} dot={{ r: 3, fill: '#0d9488' }} connectNulls />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className={cardCls}>
        <div className={cardTitleCls}>
          <i className="fa-solid fa-heart text-rose-500" />Blood Pressure
          <span className="text-xs font-normal text-gray-400 ml-2">Target: &lt;130/80 mmHg</span>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData} {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
            <YAxis domain={[40, 'auto']} tick={{ fontSize: 11 }} tickFormatter={v => v} width={36} />
            <Tooltip content={<CustomTooltipDate />} />
            <ReferenceLine y={180} stroke="#e11d48" strokeDasharray="4 3" label={{ value: '180 alert', position: 'right', fontSize: 10, fill: '#e11d48' }} />
            <ReferenceLine y={130} stroke="#f59e0b" strokeDasharray="4 3" label={{ value: '130 target', position: 'right', fontSize: 10, fill: '#f59e0b' }} />
            <ReferenceLine y={80} stroke="#f59e0b" strokeDasharray="4 3" label={{ value: '80 target', position: 'right', fontSize: 10, fill: '#f59e0b' }} />
            <Line type="monotone" dataKey="bpSys" name="Systolic" unit=" mmHg" stroke="#e11d48" strokeWidth={2} dot={{ r: 3 }} connectNulls />
            <Line type="monotone" dataKey="bpDia" name="Diastolic" unit=" mmHg" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} connectNulls />
            <Legend wrapperStyle={{ fontSize: 12 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className={cardCls}>
        <div className={cardTitleCls}>
          <i className="fa-solid fa-heart-pulse text-rose-500" />Heart Rate
          <span className="text-xs font-normal text-gray-400 ml-2">Target: 60–100 bpm (50–70 ideal for CHF)</span>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData} {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
            <YAxis domain={[40, 'auto']} tick={{ fontSize: 11 }} tickFormatter={v => v + ' bpm'} width={56} />
            <Tooltip content={<CustomTooltipDate />} />
            <ReferenceLine y={120} stroke="#e11d48" strokeDasharray="4 3" label={{ value: '120 alert', position: 'right', fontSize: 10, fill: '#e11d48' }} />
            <ReferenceLine y={100} stroke="#f59e0b" strokeDasharray="4 3" label={{ value: '100 target', position: 'right', fontSize: 10, fill: '#f59e0b' }} />
            <ReferenceLine y={60} stroke="#16a34a" strokeDasharray="4 3" label={{ value: '60 target', position: 'right', fontSize: 10, fill: '#16a34a' }} />
            <Line type="monotone" dataKey="hr" name="Heart Rate" unit=" bpm" stroke="#e11d48" strokeWidth={2} dot={{ r: 3 }} connectNulls />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className={cardCls}>
        <div className={cardTitleCls}>
          <i className="fa-solid fa-lungs text-teal-600" />Oxygen Saturation
          <span className="text-xs font-normal text-gray-400 ml-2">Target: ≥95% — below 92% requires immediate attention</span>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData} {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
            <YAxis domain={[85, 100]} tick={{ fontSize: 11 }} tickFormatter={v => v + '%'} width={44} />
            <Tooltip content={<CustomTooltipDate />} />
            <ReferenceLine y={92} stroke="#e11d48" strokeDasharray="4 3" label={{ value: '92% alert', position: 'right', fontSize: 10, fill: '#e11d48' }} />
            <ReferenceLine y={95} stroke="#f59e0b" strokeDasharray="4 3" label={{ value: '95% target', position: 'right', fontSize: 10, fill: '#f59e0b' }} />
            <Line type="monotone" dataKey="o2" name="O₂ Sat" unit="%" stroke="#0d9488" strokeWidth={2} dot={{ r: 3 }} connectNulls />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
