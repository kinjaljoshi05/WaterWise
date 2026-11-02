import React, { useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from 'recharts'
import {
  Calendar,
  Droplet,
  Heart,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react'
import { HistoryPoint, PlantEvent, PlantProfile } from '../types/plant'

interface HealthHistoryPageProps {
  history: HistoryPoint[]
  events: PlantEvent[]
  profile: PlantProfile
}

// Sample 7-day health trend data for comprehensive visualization
const WEEKLY_HEALTH_DATA = [
  { day: 'Mon', score: 92, waterings: 1, avgMoisture: 58 },
  { day: 'Tue', score: 88, waterings: 0, avgMoisture: 52 },
  { day: 'Wed', score: 79, waterings: 1, avgMoisture: 48 },
  { day: 'Thu', score: 85, waterings: 1, avgMoisture: 60 },
  { day: 'Fri', score: 90, waterings: 0, avgMoisture: 55 },
  { day: 'Sat', score: 74, waterings: 2, avgMoisture: 42 },
  { day: 'Sun', score: 94, waterings: 1, avgMoisture: 62 },
]

export const HealthHistoryPage: React.FC<HealthHistoryPageProps> = ({
  history,
  events,
  profile,
}) => {
  const [activeTab, setActiveTab] = useState<'trends' | 'events'>('trends')

  return (
    <div className="space-y-6 pb-20 md:pb-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Health History & Logs</h2>
          <p className="text-xs text-slate-500">
            Weekly analytics, sensor trends and automated irrigation audit trail
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-2xl gap-1 text-xs font-semibold self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('trends')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeTab === 'trends' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-600'
            }`}
          >
            Weekly Trends
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeTab === 'events' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-600'
            }`}
          >
            Activity & Events ({events.length})
          </button>
        </div>
      </div>

      {/* Weekly Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium text-slate-500">7-Day Avg Health</span>
            <Heart className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-800">86.4<span className="text-xs text-slate-400">/100</span></p>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">↑ +4% vs last week</p>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium text-slate-500">Irrigation Cycles</span>
            <Droplet className="w-4 h-4 text-sky-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-800">6 <span className="text-xs text-slate-400">runs</span></p>
          <p className="text-[11px] text-slate-500 font-medium mt-1">~0.85 cycles / day</p>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium text-slate-500">Avg Soil Moisture</span>
            <TrendingUp className="w-4 h-4 text-teal-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-800">53.8<span className="text-xs text-slate-400">%</span></p>
          <p className="text-[11px] text-slate-500 font-medium mt-1">Within optimal zone</p>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium text-slate-500">Stress Incidents</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-extrabold text-slate-800">1 <span className="text-xs text-slate-400">event</span></p>
          <p className="text-[11px] text-amber-600 font-medium mt-1">Low light resolved</p>
        </div>
      </div>

      {activeTab === 'trends' ? (
        <div className="space-y-6">
          {/* 7-Day Health Score Bar Chart */}
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-800 text-base">7-Day Daily Health Score</h3>
                <p className="text-xs text-slate-500">Calculated composite score (0–100)</p>
              </div>
              <span className="text-xs font-semibold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full border border-emerald-200">
                Thriving Standard
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={WEEKLY_HEALTH_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: '16px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="score" fill="#10b981" radius={[8, 8, 0, 0]} name="Health Score" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Moisture vs Temperature Combined Chart */}
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-2xs">
            <h3 className="font-bold text-slate-800 text-base mb-1">
              Live Sensor Correlation (Moisture & Temperature)
            </h3>
            <p className="text-xs text-slate-500 mb-4">Real-time rolling snapshot window</p>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <YAxis yAxisId="left" domain={[0, 100]} tick={{ fontSize: 11, fill: '#059669' }} />
                  <YAxis yAxisId="right" orientation="right" domain={[15, 45]} tick={{ fontSize: 11, fill: '#d97706' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: '16px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      fontSize: '12px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="moisture"
                    name="Moisture (%)"
                    stroke="#059669"
                    strokeWidth={2.5}
                    dot={false}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="temperature"
                    name="Temperature (°C)"
                    stroke="#f59e0b"
                    strokeWidth={2.5}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      ) : (
        /* Event Log & Audit Trail */
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-2xs space-y-3">
          <h3 className="font-bold text-slate-800 text-base mb-2">Automated Event & Watering Log</h3>
          <div className="space-y-2.5">
            {events.map((evt) => (
              <div
                key={evt.id}
                className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs"
              >
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    evt.severity === 'success'
                      ? 'bg-emerald-100 text-emerald-700'
                      : evt.severity === 'warning'
                      ? 'bg-amber-100 text-amber-700'
                      : evt.severity === 'critical'
                      ? 'bg-rose-100 text-rose-700'
                      : 'bg-sky-100 text-sky-700'
                  }`}
                >
                  {evt.type === 'watering' ? (
                    <Droplet className="w-4 h-4" />
                  ) : (
                    <Clock className="w-4 h-4" />
                  )}
                </div>

                <div className="flex-1 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">{evt.title}</span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">{evt.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

