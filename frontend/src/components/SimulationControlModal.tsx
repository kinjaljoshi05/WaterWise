import React from 'react'
import { X, Play, Pause, RotateCcw, AlertTriangle, CheckCircle2, ShieldCheck } from 'lucide-react'
import { SensorData, SimulationScenario } from '../types/plant'
import { SCENARIO_PRESETS } from '../services/simulationEngine'

interface SimulationControlModalProps {
  isOpen: boolean
  onClose: () => void
  currentScenario: SimulationScenario
  onSelectScenario: (scenario: SimulationScenario) => void
  isAutoFluctuating: boolean
  onToggleFluctuation: () => void
  sensorData: SensorData
  onUpdateManualSensor: (field: keyof Omit<SensorData, 'timestamp' | 'source'>, value: number) => void
}

const SCENARIOS: { id: SimulationScenario; label: string; icon: string; desc: string }[] = [
  { id: 'healthy', label: 'Healthy & Thriving', icon: '🌿', desc: 'Moisture 62%, Temp 23.5°C, Light 740, Tank 85%' },
  { id: 'thirsty', label: 'Thirsty Soil', icon: '💧', desc: 'Moisture 18% (dry), Temp 26°C, Tank 78%' },
  { id: 'hot', label: 'Scorching Heat', icon: '☀️', desc: 'Temp 36.8°C (stressed), Moisture 26%, Light 960' },
  { id: 'dark', label: 'Night / Low Light', icon: '🌙', desc: 'Light 130 (very dim), Moisture 56%, Temp 20.4°C' },
  { id: 'low_tank', label: 'Low Water Tank', icon: '🪣', desc: 'Tank 8% (depleted), pump lockout safety triggered' },
]

export const SimulationControlModal: React.FC<SimulationControlModalProps> = ({
  isOpen,
  onClose,
  currentScenario,
  onSelectScenario,
  isAutoFluctuating,
  onToggleFluctuation,
  sensorData,
  onUpdateManualSensor,
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 p-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
              <h2 className="text-lg font-bold text-slate-800">Simulation Control Panel</h2>
            </div>
            <p className="text-xs text-slate-500">Test all plant companion states & IoT safety guards</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Safety Banner */}
        <div className="my-4 p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start gap-2.5">
          <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold block text-amber-900">SIMULATION ENGINE ACTIVE</span>
            Data is generated locally for UI/UX demonstration. Real ESP32 pump relay commands are isolated.
          </div>
        </div>

        {/* Live Drift Switch */}
        <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200 mb-5">
          <div>
            <p className="font-semibold text-sm text-slate-800">Live Organic Fluctuation</p>
            <p className="text-xs text-slate-500">Simulate natural micro-drifting of sensor telemetry</p>
          </div>
          <button
            onClick={onToggleFluctuation}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              isAutoFluctuating
                ? 'bg-emerald-600 text-white shadow-xs hover:bg-emerald-700'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
          >
            {isAutoFluctuating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isAutoFluctuating ? 'Drifting ON' : 'Paused'}
          </button>
        </div>

        {/* Preset Scenarios */}
        <div className="space-y-2 mb-6">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
            Select College Demo Scenario
          </label>
          <div className="grid grid-cols-1 gap-2">
            {SCENARIOS.map((s) => {
              const isSelected = currentScenario === s.id
              return (
                <button
                  key={s.id}
                  onClick={() => onSelectScenario(s.id)}
                  className={`flex items-center justify-between p-3 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50/70 ring-1 ring-emerald-500'
                      : 'border-slate-200 hover:border-emerald-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl p-1 bg-white rounded-xl shadow-xs border border-slate-100">
                      {s.icon}
                    </span>
                    <div>
                      <p className="font-semibold text-sm text-slate-800">{s.label}</p>
                      <p className="text-xs text-slate-500">{s.desc}</p>
                    </div>
                  </div>
                  {isSelected && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
                </button>
              )
            })}
          </div>
        </div>

        {/* Fine-grain Manual Tweaking */}
        <div className="space-y-3.5 pt-4 border-t border-slate-100">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
            Fine-tune Sensor Values
          </label>

          {/* Soil Moisture */}
          <div>
            <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
              <span>Soil Moisture</span>
              <span className="font-bold text-emerald-700">{sensorData.soilMoisture}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={sensorData.soilMoisture}
              onChange={(e) => onUpdateManualSensor('soilMoisture', Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
          </div>

          {/* Temperature */}
          <div>
            <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
              <span>Temperature</span>
              <span className="font-bold text-amber-700">{sensorData.temperature}°C</span>
            </div>
            <input
              type="range"
              min="10"
              max="45"
              step="0.5"
              value={sensorData.temperature}
              onChange={(e) => onUpdateManualSensor('temperature', Number(e.target.value))}
              className="w-full accent-amber-600 cursor-pointer"
            />
          </div>

          {/* Relative Light */}
          <div>
            <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
              <span>Light Intensity (LDR Raw ADC)</span>
              <span className="font-bold text-amber-600">{sensorData.light} / 1023</span>
            </div>
            <input
              type="range"
              min="0"
              max="1023"
              value={sensorData.light}
              onChange={(e) => onUpdateManualSensor('light', Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Water Reservoir */}
          <div>
            <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
              <span>Water Tank Level</span>
              <span className={`font-bold ${sensorData.waterLevel < 20 ? 'text-rose-600' : 'text-sky-700'}`}>
                {sensorData.waterLevel}% {sensorData.waterLevel < 20 && '(LOW ALERT)'}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={sensorData.waterLevel}
              onChange={(e) => onUpdateManualSensor('waterLevel', Number(e.target.value))}
              className="w-full accent-sky-600 cursor-pointer"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-2xl shadow-sm transition-colors text-sm"
          >
            Apply & View Plant Buddy
          </button>
        </div>
      </div>
    </div>
  )
}

