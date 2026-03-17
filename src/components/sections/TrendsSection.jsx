import { useState, useMemo } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, ResponsiveContainer, Legend
} from 'recharts'

const RANGE_OPTIONS = [
  { label: '7d', value: 7 },
  { label: '30d', value: 30 },
  { label: '90d', value: 90 },
  { label: 'All', value: Infinity },
]

function shortDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr + 'T12:00:00')
  return (d.getMonth() + 1) + '/' + d.getDate()
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-200 rounded-md px-3 py-2 text-xs shadow-md">
      <div className="font-semibold text-gray-700 mb-1">{label}</div>
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
      <div className="text-center py-12 text-gray-500">
        <i className="fa-solid fa-chart-line text-3xl mb-2 block" />
        <p className="text-sm">At least 2 daily entries needed to show trends.</p>
      </div>
    )
  }

  const cardCls = 'bg-white rounded-lg border border-gray-100 p-4 shadow-sm mb-3'
  const chartTitleCls = 'text-xs font-semibold text-gray-700 mb-3 flex items-center gap-1.5'

  return (
    <div>
      <div className="flex items-center gap-1.5 mb-4">
        {RANGE_OPTIONS.map(opt => (
          <button
            key={opt.value}
            onClick={() => setRange(opt.value)}
            className={`px-3 py-1 rounded border text-xs font-semibold cursor-pointer transition ${
              range === opt.value
                ? 'border-teal-600 bg-teal-600 text-white'
                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-400'
            }`}
          >
            {opt.label}
          </button>
        ))}
        <span className="text-[11px] text-gray-500 ml-1">{chartData.length} readings</span>
      </div>

      <div className={cardCls}>
        <div className={chartTitleCls}>
          <i className="fa-solid fa-scale-balanced text-teal-600" />Weight
          <span className="font-normal text-gray-500 ml-1">fluid warning: +2 lbs/day</span>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={chartData} margin={{ top: 4, right: 40, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="label" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
            <YAxis domain={['auto', 'auto']} tick={{ fontSize: 10 }} tickFormatter={v => v + ' lbs'} width={60} />
            <Tooltip content={<CustomTooltip />} />
            {baselineWeight && <ReferenceLine y={baselineWeight + 2} stroke="#f59e0b" strokeDasharray="4 3" label={{ value: '+2 lbs', position: 'right', fontSize: 9, fill: '#f59e0b' }} />}
            {baselineWeight && <ReferenceLine y={baselineWeight + 5} stroke="#e11d48" strokeDasharray="4 3" label={{ value: '+5 lbs', position: 'right', fontSize: 9, fill: '#e11d48' }} />}
            <Line type="monotone" dataKey="weight" name="Weight" unit=" lbs" stroke="#0d9488" strokeWidth={1.5} dot={{ r: 2, fill: '#0d9488' }} connectNulls />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className={cardCls}>
        <div className={chartTitleCls}>
          <i className="fa-solid fa-heart text-rose-500" />Blood Pressure
          <span className="font-normal text-gray-500 ml-1">target: &lt;130/80 mmHg</span>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={chartData} margin={{ top: 4, right: 40, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="label" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
            <YAxis domain={[40, 'auto']} tick={{ fontSize: 10 }} width={30} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={180} stroke="#e11d48" strokeDasharray="4 3" label={{ value: '180', position: 'right', fontSize: 9, fill: '#e11d48' }} />
            <ReferenceLine y={130} stroke="#f59e0b" strokeDasharray="4 3" label={{ value: '130', position: 'right', fontSize: 9, fill: '#f59e0b' }} />
            <ReferenceLine y={80} stroke="#f59e0b" strokeDasharray="4 3" label={{ value: '80', position: 'right', fontSize: 9, fill: '#f59e0b' }} />
            <Line type="monotone" dataKey="bpSys" name="Systolic" unit=" mmHg" stroke="#e11d48" strokeWidth={1.5} dot={{ r: 2 }} connectNulls />
            <Line type="monotone" dataKey="bpDia" name="Diastolic" unit=" mmHg" stroke="#f59e0b" strokeWidth={1.5} dot={{ r: 2 }} connectNulls />
            <Legend wrapperStyle={{ fontSize: 11 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className={cardCls}>
        <div className={chartTitleCls}>
          <i className="fa-solid fa-heart-pulse text-rose-500" />Heart Rate
          <span className="font-normal text-gray-500 ml-1">target: 60–100 bpm</span>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={chartData} margin={{ top: 4, right: 40, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="label" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
            <YAxis domain={[40, 'auto']} tick={{ fontSize: 10 }} tickFormatter={v => v + ' bpm'} width={50} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={120} stroke="#e11d48" strokeDasharray="4 3" label={{ value: '120', position: 'right', fontSize: 9, fill: '#e11d48' }} />
            <ReferenceLine y={100} stroke="#f59e0b" strokeDasharray="4 3" label={{ value: '100', position: 'right', fontSize: 9, fill: '#f59e0b' }} />
            <ReferenceLine y={60} stroke="#16a34a" strokeDasharray="4 3" label={{ value: '60', position: 'right', fontSize: 9, fill: '#16a34a' }} />
            <Line type="monotone" dataKey="hr" name="Heart Rate" unit=" bpm" stroke="#e11d48" strokeWidth={1.5} dot={{ r: 2 }} connectNulls />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className={cardCls}>
        <div className={chartTitleCls}>
          <i className="fa-solid fa-lungs text-teal-600" />Oxygen Saturation
          <span className="font-normal text-gray-500 ml-1">target: ≥95%</span>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={chartData} margin={{ top: 4, right: 40, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="label" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
            <YAxis domain={[85, 100]} tick={{ fontSize: 10 }} tickFormatter={v => v + '%'} width={38} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={92} stroke="#e11d48" strokeDasharray="4 3" label={{ value: '92%', position: 'right', fontSize: 9, fill: '#e11d48' }} />
            <ReferenceLine y={95} stroke="#f59e0b" strokeDasharray="4 3" label={{ value: '95%', position: 'right', fontSize: 9, fill: '#f59e0b' }} />
            <Line type="monotone" dataKey="o2" name="O₂ Sat" unit="%" stroke="#0d9488" strokeWidth={1.5} dot={{ r: 2 }} connectNulls />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
