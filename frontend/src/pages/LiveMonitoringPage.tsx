import React, { useState } from 'react'
import {
  Droplet,
  Thermometer,
  Wind,
  Sun,
  Container,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Info,
} from 'lucide-react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
} from 'recharts'
import { HealthAssessment, HistoryPoint, PlantProfile, SensorData } from '../types/plant'

interface LiveMonitoringPageProps {
  sensorData: SensorData
  profile: PlantProfile
  health: HealthAssessment
  history: HistoryPoint[]
}

export const LiveMonitoringPage: React.FC<LiveMonitoringPageProps> = ({
  sensorData,
  profile,
  health,
  history,
}) => {
  const [selectedSensor, setSelectedSensor] = useState<
    'moisture' | 'temperature' | 'humidity' | 'light'
  >('moisture')

  // Helpers for parameter badge
  const renderStatusBadge = (status: 'optimal' | 'warning' | 'critical') => {
    if (status === 'optimal') {
      return (
        <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
          <CheckCircle className="w-3 h-3" />
          Optimal
        </span>
      )
    }
    if (status === 'warning') {
      return (
        <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
          <AlertTriangle className="w-3 h-3" />
          Warning
        </span>
      )
    }
    return (
      <span className="flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
        <XCircle className="w-3 h-3" />
        Critical
      </span>
    )
  }

  // Chart configuration
  const chartConfigs = {
    moisture: {
      title: 'Soil Moisture Trend',
      unit: '%',
      color: '#059669',
      fill: '#10b981',
      domain: [0, 100],
      key: 'moisture',
      target: `${profile.preferredMoisture.min}–${profile.preferredMoisture.max}%`,
    },
    temperature: {
      title: 'Ambient Temperature Trend',
      unit: '°C',
      color: '#f59e0b',
      fill: '#fbbf24',
      domain: [15, 45],
      key: 'temperature',
      target: `${profile.preferredTemp.min}–${profile.preferredTemp.max}°C`,
    },
    humidity: {
      title: 'Relative Humidity Trend',
      unit: '%',
      color: '#0284c7',
      fill: '#38bdf8',
      domain: [10, 100],
      key: 'humidity',
      target: `${profile.preferredHumidity.min}–${profile.preferredHumidity.max}%`,
    },
    light: {
      title: 'LDR Relative Light Intensity Trend',
      unit: '/1023',
      color: '#eab308',
      fill: '#facc15',
      domain: [0, 1023],
      key: 'light',
      target: `${profile.preferredLight.min}–${profile.preferredLight.max}`,
    },
  }

  const activeConfig = chartConfigs[selectedSensor]

  return (
    <div className="space-y-6 pb-20 md:pb-8 animate-in fade-in duration-300">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 px-1">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Live IoT Sensors</h2>
          <p className="text-xs text-slate-500">
            Real-time acquisition from ESP32 DevKit V1 ADC1 & DHT11
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto text-xs text-slate-500 bg-white px-3 py-1.5 rounded-2xl border border-slate-200 shadow-2xs">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>Last polled: {new Date(sensorData.timestamp).toLocaleTimeString()}</span>
          <span className="font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded text-[10px]">
            {sensorData.source.toUpperCase()}
          </span>
        </div>
      </div>

      {/* 5 Sensor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* 1. Soil Moisture Card */}
        <div
          onClick={() => setSelectedSensor('moisture')}
          className={`p-4 rounded-3xl bg-white border transition-all cursor-pointer relative shadow-2xs ${
            selectedSensor === 'moisture'
              ? 'border-emerald-500 ring-2 ring-emerald-500/20'
              : 'border-slate-100 hover:border-emerald-200'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Droplet className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 text-sm">Soil Moisture</h3>
                <span className="text-[10px] text-slate-400 font-mono">ADC1_CH6 (GPIO 34)</span>
              </div>
            </div>
            {renderStatusBadge(health.parameterStatuses.moisture)}
          </div>

          <div className="flex items-baseline gap-1 my-2">
            <span className="text-3xl font-extrabold text-slate-800">
              {sensorData.soilMoisture}
            </span>
            <span className="text-sm font-semibold text-slate-400">%</span>
          </div>

          {/* Moisture Progress Bar */}
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden my-2">
            <div
              className={`h-full transition-all duration-500 ${
                sensorData.soilMoisture < profile.wateringThreshold
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(100, Math.max(0, sensorData.soilMoisture))}%` }}
            />
          </div>

          <div className="flex justify-between text-[11px] text-slate-500 font-medium">
            <span>Water threshold: {profile.wateringThreshold}%</span>
            <span>Ideal: {profile.preferredMoisture.min}–{profile.preferredMoisture.max}%</span>
          </div>
        </div>

        {/* 2. Temperature Card */}
        <div
          onClick={() => setSelectedSensor('temperature')}
          className={`p-4 rounded-3xl bg-white border transition-all cursor-pointer relative shadow-2xs ${
            selectedSensor === 'temperature'
              ? 'border-amber-500 ring-2 ring-amber-500/20'
              : 'border-slate-100 hover:border-amber-200'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Thermometer className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 text-sm">Temperature</h3>
                <span className="text-[10px] text-slate-400 font-mono">DHT11 (GPIO 4)</span>
              </div>
            </div>
            {renderStatusBadge(health.parameterStatuses.temperature)}
          </div>

          <div className="flex items-baseline gap-1 my-2">
            <span className="text-3xl font-extrabold text-slate-800">
              {sensorData.temperature}
            </span>
            <span className="text-sm font-semibold text-slate-400">°C</span>
          </div>

          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden my-2">
            <div
              className={`h-full transition-all duration-500 ${
                sensorData.temperature > profile.preferredTemp.max
                  ? 'bg-rose-500'
                  : sensorData.temperature < profile.preferredTemp.min
                  ? 'bg-sky-400'
                  : 'bg-amber-500'
              }`}
              style={{
                width: `${Math.min(100, Math.max(0, ((sensorData.temperature - 10) / 35) * 100))}%`,
              }}
            />
          </div>

          <div className="flex justify-between text-[11px] text-slate-500 font-medium">
            <span>Target: {profile.preferredTemp.min}–{profile.preferredTemp.max}°C</span>
            <span>Range: 10–45°C</span>
          </div>
        </div>

        {/* 3. Relative Humidity Card */}
        <div
          onClick={() => setSelectedSensor('humidity')}
          className={`p-4 rounded-3xl bg-white border transition-all cursor-pointer relative shadow-2xs ${
            selectedSensor === 'humidity'
              ? 'border-sky-500 ring-2 ring-sky-500/20'
              : 'border-slate-100 hover:border-sky-200'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
                <Wind className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 text-sm">Air Humidity</h3>
                <span className="text-[10px] text-slate-400 font-mono">DHT11 (GPIO 4)</span>
              </div>
            </div>
            {renderStatusBadge(health.parameterStatuses.humidity)}
          </div>

          <div className="flex items-baseline gap-1 my-2">
            <span className="text-3xl font-extrabold text-slate-800">
              {sensorData.humidity}
            </span>
            <span className="text-sm font-semibold text-slate-400">%</span>
          </div>

          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden my-2">
            <div
              className="h-full bg-sky-500 transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(0, sensorData.humidity))}%` }}
            />
          </div>

          <div className="flex justify-between text-[11px] text-slate-500 font-medium">
            <span>Target: {profile.preferredHumidity.min}–{profile.preferredHumidity.max}%</span>
            <span>RH Sensor</span>
          </div>
        </div>

        {/* 4. Light Intensity (LDR) Card */}
        <div
          onClick={() => setSelectedSensor('light')}
          className={`p-4 rounded-3xl bg-white border transition-all cursor-pointer relative shadow-2xs ${
            selectedSensor === 'light'
              ? 'border-yellow-500 ring-2 ring-yellow-500/20'
              : 'border-slate-100 hover:border-yellow-200'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-2xl bg-yellow-50 text-yellow-600 flex items-center justify-center">
                <Sun className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 text-sm">Light Intensity</h3>
                <span className="text-[10px] text-slate-400 font-mono">LDR Module (GPIO 35)</span>
              </div>
            </div>
            {renderStatusBadge(health.parameterStatuses.light)}
          </div>

          <div className="flex items-baseline gap-1 my-2">
            <span className="text-3xl font-extrabold text-slate-800">
              {sensorData.light}
            </span>
            <span className="text-sm font-semibold text-slate-400">/ 1023</span>
          </div>

          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden my-2">
            <div
              className="h-full bg-yellow-400 transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(0, (sensorData.light / 1023) * 100))}%` }}
            />
          </div>

          <div className="flex justify-between text-[11px] text-slate-500 font-medium">
            <span>Relative analog scale</span>
            <span>Indoor target: {profile.preferredLight.min}+</span>
          </div>
        </div>

        {/* 5. Water Reservoir Tank Card */}
        <div
          className={`p-4 rounded-3xl border shadow-2xs relative ${
            sensorData.waterLevel < 20
              ? 'bg-rose-50/70 border-rose-300'
              : 'bg-white border-slate-100'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div
                className={`w-9 h-9 rounded-2xl flex items-center justify-center ${
                  sensorData.waterLevel < 20
                    ? 'bg-rose-100 text-rose-600'
                    : 'bg-teal-50 text-teal-600'
                }`}
              >
                <Container className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 text-sm">Water Reservoir</h3>
                <span className="text-[10px] text-slate-400 font-mono">HW-038 (GPIO 32)</span>
              </div>
            </div>
            {renderStatusBadge(health.parameterStatuses.waterTank)}
          </div>

          <div className="flex items-baseline gap-1 my-2">
            <span
              className={`text-3xl font-extrabold ${
                sensorData.waterLevel < 20 ? 'text-rose-700' : 'text-slate-800'
              }`}
            >
              {sensorData.waterLevel}
            </span>
            <span className="text-sm font-semibold text-slate-400">% Tank</span>
          </div>

          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden my-2">
            <div
              className={`h-full transition-all duration-500 ${
                sensorData.waterLevel < 20 ? 'bg-rose-500' : 'bg-teal-500'
              }`}
              style={{ width: `${Math.min(100, Math.max(0, sensorData.waterLevel))}%` }}
            />
          </div>

          <div className="flex justify-between text-[11px] text-slate-500 font-medium">
            <span>Low cutoff safety: 20%</span>
            <span>{sensorData.waterLevel < 20 ? '⚠️ Pump Inhibited' : '✅ Reservoir OK'}</span>
          </div>
        </div>
      </div>

      {/* LDR Electrical Note */}
      <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">IoT Sensor Calibration Note:</span> Light readings are
          measured via the analog LDR voltage divider (0–1023 scale) on GPIO 35. As per college project specifications, raw ADC values are preserved directly rather than converted to inaccurate Lux estimations (a calibrated I2C sensor such as BH1750 is required for certified Lux).
        </div>
      </div>

      {/* Recharts Historical Trend Section */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="font-bold text-slate-800 text-base">{activeConfig.title}</h3>
            <p className="text-xs text-slate-500">Live data rolling window ({history.length} snapshots)</p>
          </div>

          {/* Sensor Select Buttons */}
          <div className="flex bg-slate-100 p-1 rounded-xl gap-1 text-xs font-semibold self-start sm:self-auto">
            <button
              onClick={() => setSelectedSensor('moisture')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedSensor === 'moisture' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              Moisture
            </button>
            <button
              onClick={() => setSelectedSensor('temperature')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedSensor === 'temperature' ? 'bg-white text-amber-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              Temp
            </button>
            <button
              onClick={() => setSelectedSensor('humidity')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedSensor === 'humidity' ? 'bg-white text-sky-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              Humidity
            </button>
            <button
              onClick={() => setSelectedSensor('light')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedSensor === 'light' ? 'bg-white text-yellow-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              Light
            </button>
          </div>
        </div>

        {/* Chart */}
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="sensorGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={activeConfig.fill} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={activeConfig.fill} stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis
                domain={activeConfig.domain}
                tick={{ fontSize: 11, fill: '#94a3b8' }}
                unit={activeConfig.unit}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  fontSize: '12px',
                }}
              />
              <Area
                type="monotone"
                dataKey={activeConfig.key}
                stroke={activeConfig.color}
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#sensorGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

