import React from 'react'
import { Droplet, Thermometer, Sun, Wind, Container, Sparkles, ArrowRight, AlertCircle, Heart } from 'lucide-react'
import { HealthAssessment, PlantProfile, PumpState, SensorData } from '../types/plant'
import { PlantAvatar } from '../components/PlantAvatar'
import { SpeechBubble } from '../components/SpeechBubble'

interface HomePageProps {
  sensorData: SensorData
  profile: PlantProfile
  health: HealthAssessment
  pumpState: PumpState
  onNavigateTab: (tab: 'live' | 'chat' | 'control' | 'history' | 'profile') => void
  onTriggerQuickWater: () => void
}

export const HomePage: React.FC<HomePageProps> = ({
  sensorData,
  profile,
  health,
  pumpState,
  onNavigateTab,
  onTriggerQuickWater,
}) => {
  // Score color helper
  const getScoreColor = (score: number) => {
    if (score >= 80) return { text: 'text-emerald-600', stroke: '#059669', bg: 'bg-emerald-50' }
    if (score >= 60) return { text: 'text-amber-600', stroke: '#d97706', bg: 'bg-amber-50' }
    return { text: 'text-rose-600', stroke: '#e11d48', bg: 'bg-rose-50' }
  }

  const scoreTheme = getScoreColor(health.score)

  return (
    <div className="space-y-6 pb-20 md:pb-8 animate-in fade-in duration-300">
      {/* Hero Character Card */}
      <div className="relative overflow-hidden bg-gradient-to-b from-emerald-50/70 via-teal-50/40 to-white rounded-3xl p-6 border border-emerald-100/90 shadow-sm">
        {/* Decorative background circles */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-200/30 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-teal-200/30 rounded-full blur-2xl pointer-events-none" />

        {/* Top meta row */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-full">
            <Heart className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
            <span>Health Status: {health.status}</span>
          </div>

          {/* Circular Score Badge */}
          <div className="flex items-center gap-2 bg-white/90 px-3 py-1.5 rounded-2xl shadow-2xs border border-slate-100">
            <div className="relative w-8 h-8 flex items-center justify-center">
              <svg className="w-8 h-8 -rotate-90" viewBox="0 0 36 36">
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="3.5"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke={scoreTheme.stroke}
                  strokeWidth="3.5"
                  strokeDasharray={`${(health.score / 100) * 88} 88`}
                  strokeLinecap="round"
                />
              </svg>
              <span className={`absolute text-[11px] font-extrabold ${scoreTheme.text}`}>
                {health.score}
              </span>
            </div>
            <div className="text-left">
              <span className="text-[10px] uppercase font-bold text-slate-400 block leading-none">
                Score
              </span>
              <span className="text-xs font-bold text-slate-700">100 Max</span>
            </div>
          </div>
        </div>

        {/* Speech Bubble */}
        <SpeechBubble
          text={health.speechBubble}
          emotion={health.emotion}
          plantName={profile.name}
        />

        {/* Plant Character Avatar */}
        <div className="my-2 flex justify-center">
          <PlantAvatar
            emotion={health.emotion}
            species={profile.species}
            size="lg"
            isWatering={pumpState.isPumpRunning}
          />
        </div>

        {/* Quick Action Button Pill */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={() => onNavigateTab('chat')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs border border-slate-200 transition-all cursor-pointer active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Chat with {profile.name}</span>
          </button>

          <button
            onClick={onTriggerQuickWater}
            disabled={pumpState.isPumpRunning || pumpState.status === 'cooldown' || sensorData.waterLevel < 20}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold shadow-xs transition-all cursor-pointer active:scale-95 ${
              sensorData.waterLevel < 20
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : pumpState.isPumpRunning
                ? 'bg-sky-600 text-white animate-pulse'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200'
            }`}
          >
            <Droplet className="w-4 h-4" />
            <span>
              {pumpState.isPumpRunning
                ? 'Watering in Progress...'
                : sensorData.waterLevel < 20
                ? 'Tank Empty (Locked)'
                : 'Quick Water (5s)'}
            </span>
          </button>
        </div>
      </div>

      {/* Quick Sensor Metric Cards */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-base font-bold text-slate-800">Live Telemetry Overview</h2>
          <button
            onClick={() => onNavigateTab('live')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
          >
            <span>Full Graphs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {/* Soil Moisture */}
          <div
            onClick={() => onNavigateTab('live')}
            className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-2xs hover:border-emerald-200 transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between text-slate-400 mb-1.5">
              <span className="text-xs font-medium text-slate-500">Soil Moisture</span>
              <Droplet className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-slate-800">{sensorData.soilMoisture}</span>
              <span className="text-xs font-semibold text-slate-400">%</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Target: {profile.preferredMoisture.min}–{profile.preferredMoisture.max}%
            </p>
          </div>

          {/* Temperature */}
          <div
            onClick={() => onNavigateTab('live')}
            className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-2xs hover:border-emerald-200 transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between text-slate-400 mb-1.5">
              <span className="text-xs font-medium text-slate-500">Temperature</span>
              <Thermometer className="w-4 h-4 text-amber-500" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-slate-800">{sensorData.temperature}</span>
              <span className="text-xs font-semibold text-slate-400">°C</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Target: {profile.preferredTemp.min}–{profile.preferredTemp.max}°C
            </p>
          </div>

          {/* Humidity */}
          <div
            onClick={() => onNavigateTab('live')}
            className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-2xs hover:border-emerald-200 transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between text-slate-400 mb-1.5">
              <span className="text-xs font-medium text-slate-500">Humidity</span>
              <Wind className="w-4 h-4 text-sky-500" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-slate-800">{sensorData.humidity}</span>
              <span className="text-xs font-semibold text-slate-400">%</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Target: {profile.preferredHumidity.min}–{profile.preferredHumidity.max}%
            </p>
          </div>

          {/* Relative Light */}
          <div
            onClick={() => onNavigateTab('live')}
            className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-2xs hover:border-emerald-200 transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between text-slate-400 mb-1.5">
              <span className="text-xs font-medium text-slate-500">Light Intensity</span>
              <Sun className="w-4 h-4 text-amber-500" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-slate-800">{sensorData.light}</span>
              <span className="text-xs font-semibold text-slate-400">/1023</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">LDR relative ADC</p>
          </div>

          {/* Water Reservoir */}
          <div
            onClick={() => onNavigateTab('control')}
            className={`p-3.5 rounded-2xl border shadow-2xs transition-all cursor-pointer col-span-2 md:col-span-1 ${
              sensorData.waterLevel < 20
                ? 'bg-rose-50/80 border-rose-200 text-rose-800'
                : 'bg-white border-slate-100 hover:border-emerald-200'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-slate-500">Water Tank</span>
              <Container className={`w-4 h-4 ${sensorData.waterLevel < 20 ? 'text-rose-600' : 'text-teal-600'}`} />
            </div>
            <div className="flex items-baseline gap-1">
              <span className={`text-xl font-bold ${sensorData.waterLevel < 20 ? 'text-rose-700' : 'text-slate-800'}`}>
                {sensorData.waterLevel}
              </span>
              <span className="text-xs font-semibold text-slate-400">%</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {sensorData.waterLevel < 20 ? '⚠️ Low reservoir' : 'Pump ready'}
            </p>
          </div>
        </div>
      </div>

      {/* Smart Recommendations List */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-2xs">
        <h3 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>Care Insights & AI Recommendations</span>
        </h3>
        <div className="space-y-2">
          {health.recommendations.map((rec, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50/70 border border-slate-100 text-xs text-slate-700 leading-relaxed"
            >
              <AlertCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{rec}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

