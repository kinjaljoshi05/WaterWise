import React, { useState } from 'react'
import {
  Power,
  Droplet,
  ShieldAlert,
  ShieldCheck,
  Clock,
  Sliders,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  StopCircle,
} from 'lucide-react'
import { PlantProfile, PumpState, SensorData } from '../types/plant'

interface PlantControlPageProps {
  sensorData: SensorData
  profile: PlantProfile
  pumpState: PumpState
  onToggleAutoWatering: () => void
  onTriggerManualWater: (durationSeconds: number) => void
  onEmergencyStop: () => void
  onUpdateWateringThreshold: (threshold: number) => void
}

export const PlantControlPage: React.FC<PlantControlPageProps> = ({
  sensorData,
  profile,
  pumpState,
  onToggleAutoWatering,
  onTriggerManualWater,
  onEmergencyStop,
  onUpdateWateringThreshold,
}) => {
  const [selectedDuration, setSelectedDuration] = useState<number>(5)
  const isTankLow = sensorData.waterLevel < 20

  const getPumpStatusBadge = () => {
    switch (pumpState.status) {
      case 'watering':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-800 border border-sky-300 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-sky-500 animate-ping" />
            WATERING ({pumpState.remainingTimeSeconds}s)
          </span>
        )
      case 'cooldown':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            COOLDOWN ({pumpState.remainingTimeSeconds}s)
          </span>
        )
      case 'inhibited':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
            SAFETY INHIBITED
          </span>
        )
      default:
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-300">
            <span className="w-2 h-2 rounded-full bg-slate-400" />
            IDLE / READY
          </span>
        )
    }
  }

  return (
    <div className="space-y-6 pb-20 md:pb-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Irrigation & Pump Control</h2>
          <p className="text-xs text-slate-500">
            Local ESP32 relay safety guard with automatic low-tank lockout
          </p>
        </div>
        <div>{getPumpStatusBadge()}</div>
      </div>

      {/* Safety Alert if Tank Low */}
      {isTankLow && (
        <div className="p-4 rounded-3xl bg-rose-50 border-2 border-rose-200 text-rose-900 shadow-xs flex items-start gap-3">
          <ShieldAlert className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-sm">PUMP LOCKOUT ACTIVE: RESERVOIR CRITICALLY LOW</h4>
            <p className="text-xs text-rose-800 leading-relaxed">
              The water reservoir is at <strong>{sensorData.waterLevel}%</strong> (below the 20% safety floor).
              To prevent mini DC submersible pump burnout from dry running, all automatic and manual watering commands are hardware-inhibited until the reservoir is refilled.
            </p>
          </div>
        </div>
      )}

      {/* Pump Control Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Manual Watering Trigger Card */}
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Droplet className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Manual Irrigation</h3>
                <p className="text-xs text-slate-400">Trigger on-demand watering cycle</p>
              </div>
            </div>
          </div>

          {/* Duration Selector */}
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1.5 block">
              Cycle Duration (Hard Limit: 5 seconds max)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[3, 4, 5].map((sec) => (
                <button
                  key={sec}
                  type="button"
                  onClick={() => setSelectedDuration(sec)}
                  className={`py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    selectedDuration === sec
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-emerald-300'
                  }`}
                >
                  {sec} Seconds
                </button>
              ))}
            </div>
          </div>

          {/* Action Trigger Buttons */}
          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={() => onTriggerManualWater(selectedDuration)}
              disabled={isTankLow || pumpState.isPumpRunning || pumpState.status === 'cooldown'}
              className={`flex-1 py-3 px-4 rounded-2xl font-bold text-sm shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98 ${
                isTankLow
                  ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                  : pumpState.isPumpRunning
                  ? 'bg-sky-600 text-white animate-pulse'
                  : pumpState.status === 'cooldown'
                  ? 'bg-amber-100 text-amber-700 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200'
              }`}
            >
              <Droplet className="w-4 h-4" />
              <span>
                {pumpState.isPumpRunning
                  ? `Pumping (${pumpState.remainingTimeSeconds}s)...`
                  : pumpState.status === 'cooldown'
                  ? `Cooldown (${pumpState.remainingTimeSeconds}s)`
                  : isTankLow
                  ? 'Watering Blocked'
                  : `Start ${selectedDuration}s Watering`}
              </span>
            </button>

            {/* Emergency Stop Button */}
            {pumpState.isPumpRunning && (
              <button
                type="button"
                onClick={onEmergencyStop}
                className="py-3 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-bold text-sm shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                title="Immediate Pump Kill-switch"
              >
                <StopCircle className="w-4 h-4" />
                <span>STOP</span>
              </button>
            )}
          </div>

          <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center justify-between">
            <span>Cooldown safety gap:</span>
            <span className="font-semibold text-slate-700">30 seconds between cycles</span>
          </div>
        </div>

        {/* Automatic Smart Watering Mode Card */}
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
                <Power className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Smart Auto-Watering</h3>
                <p className="text-xs text-slate-400">Autonomous microcontroller regulation</p>
              </div>
            </div>

            {/* Toggle Switch */}
            <button
              type="button"
              onClick={onToggleAutoWatering}
              className={`w-13 h-7 rounded-full p-1 transition-colors cursor-pointer flex items-center ${
                profile.autoWatering ? 'bg-emerald-600 justify-end' : 'bg-slate-300 justify-start'
              }`}
            >
              <div className="w-5 h-5 bg-white rounded-full shadow-xs transition-transform" />
            </button>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600 leading-relaxed">
            When enabled, the ESP32 automatically energizes the relay whenever capacitive moisture drops below the threshold and reservoir water is verified.
          </div>

          {/* Moisture Trigger Threshold Slider */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>Auto-trigger Moisture Threshold</span>
              <span className="text-emerald-700 font-bold">{profile.wateringThreshold}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="60"
              value={profile.wateringThreshold}
              onChange={(e) => onUpdateWateringThreshold(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
              <span>Dry (10%)</span>
              <span>Damp (35%)</span>
              <span>Moist (60%)</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Current soil reading: <strong>{sensorData.soilMoisture}%</strong></span>
          </div>
        </div>
      </div>

      {/* Safety Architecture Reference Box */}
      <div className="p-4 rounded-3xl bg-emerald-50/70 border border-emerald-200/80 text-xs text-emerald-900 space-y-2">
        <div className="flex items-center gap-2 font-bold text-sm text-emerald-950">
          <ShieldCheck className="w-5 h-5 text-emerald-700" />
          <span>Local Microcontroller Safety Priority Architecture</span>
        </div>
        <p className="leading-relaxed">
          The ESP32 firmware executes local fail-safes regardless of cloud connectivity:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-emerald-800">
          <li><strong>Relay Active-LOW Guard:</strong> Output pin starts HIGH to prevent unintended startup pulsing.</li>
          <li><strong>Hard Timer Limit:</strong> Even if cloud connection drops, pump shuts off strictly after 5,000 ms.</li>
          <li><strong>Dry-Run Interlock:</strong> If water level is &lt; 20%, relay trigger commands are locally rejected.</li>
          <li><strong>Enforced Cooldown:</strong> 30,000 ms mandatory rest period prevents over-saturation and pump fatigue.</li>
        </ul>
      </div>
    </div>
  )
}

