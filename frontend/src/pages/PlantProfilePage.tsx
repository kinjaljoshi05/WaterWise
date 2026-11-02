import React, { useState } from 'react'
import {
  PlantProfile,
  PlantSpecies,
} from '../types/plant'
import { PLANT_PROFILES } from '../data/plantProfiles'
import {
  Save,
  RotateCcw,
  Sparkles,
  Info,
  CheckCircle,
  Sliders,
  Sprout,
} from 'lucide-react'

interface PlantProfilePageProps {
  currentProfile: PlantProfile
  onSaveProfile: (updated: PlantProfile) => void
}

export const PlantProfilePage: React.FC<PlantProfilePageProps> = ({
  currentProfile,
  onSaveProfile,
}) => {
  const [profile, setProfile] = useState<PlantProfile>(currentProfile)
  const [savedBanner, setSavedBanner] = useState(false)

  // Switch species and load its botanical defaults
  const handleSelectSpecies = (speciesKey: PlantSpecies) => {
    const preset = PLANT_PROFILES[speciesKey]
    setProfile({
      ...preset,
      name: profile.name, // retain custom chosen name
    })
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    onSaveProfile(profile)
    setSavedBanner(true)
    setTimeout(() => setSavedBanner(false), 3000)
  }

  const handleResetDefaults = () => {
    const preset = PLANT_PROFILES[profile.species]
    setProfile({ ...preset })
  }

  return (
    <div className="space-y-6 pb-20 md:pb-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Plant Profile & Calibration</h2>
          <p className="text-xs text-slate-500">
            Botanical thresholds tailor emotional expressions and watering criteria
          </p>
        </div>

        {savedBanner && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-2xl text-xs font-semibold animate-in fade-in">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Profile Saved!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Plant Identity Card */}
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-2xs space-y-4">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <Sprout className="w-4 h-4 text-emerald-600" />
            <span>Companion Identity</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">
                Plant Nickname
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-2xl px-4 py-2.5 text-sm font-semibold text-slate-800 outline-hidden"
                placeholder="e.g. Monty, Sprout, Leafy"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">
                Species Classification
              </label>
              <div className="text-sm font-semibold text-emerald-800 bg-emerald-50/70 border border-emerald-200 rounded-2xl px-4 py-2.5">
                {profile.speciesDisplayName}
              </div>
            </div>
          </div>
        </div>

        {/* Species Preset Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block px-1">
            Choose Botanical Species Preset
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(Object.keys(PLANT_PROFILES) as PlantSpecies[]).map((key) => {
              const spec = PLANT_PROFILES[key]
              const isSelected = profile.species === key
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleSelectSpecies(key)}
                  className={`p-4 rounded-3xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-500/20'
                      : 'bg-white border-slate-100 hover:border-emerald-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-slate-800 text-sm">{spec.speciesDisplayName}</span>
                    {isSelected && <CheckCircle className="w-4 h-4 text-emerald-600" />}
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">{spec.description}</p>
                  <div className="flex gap-3 text-[11px] font-semibold text-emerald-800 mt-2.5 pt-2 border-t border-slate-100">
                    <span>Moisture: {spec.preferredMoisture.min}–{spec.preferredMoisture.max}%</span>
                    <span>Temp: {spec.preferredTemp.min}–{spec.preferredTemp.max}°C</span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Fine-Grain Threshold Configuration */}
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-2xs space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-600" />
              <span>Target Thresholds & Tolerances</span>
            </h3>
            <button
              type="button"
              onClick={handleResetDefaults}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>
          </div>

          {/* Moisture Range */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>Target Soil Moisture Range</span>
              <span className="text-emerald-700 font-bold">
                {profile.preferredMoisture.min}% – {profile.preferredMoisture.max}%
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] text-slate-400">Min Moisture (%)</span>
                <input
                  type="range"
                  min="10"
                  max="60"
                  value={profile.preferredMoisture.min}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      preferredMoisture: { ...profile.preferredMoisture, min: Number(e.target.value) },
                    })
                  }
                  className="w-full accent-emerald-600"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-400">Max Moisture (%)</span>
                <input
                  type="range"
                  min="50"
                  max="95"
                  value={profile.preferredMoisture.max}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      preferredMoisture: { ...profile.preferredMoisture, max: Number(e.target.value) },
                    })
                  }
                  className="w-full accent-emerald-600"
                />
              </div>
            </div>
          </div>

          {/* Temperature Range */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>Comfort Temperature Range</span>
              <span className="text-amber-700 font-bold">
                {profile.preferredTemp.min}°C – {profile.preferredTemp.max}°C
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] text-slate-400">Min Temp (°C)</span>
                <input
                  type="range"
                  min="12"
                  max="24"
                  value={profile.preferredTemp.min}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      preferredTemp: { ...profile.preferredTemp, min: Number(e.target.value) },
                    })
                  }
                  className="w-full accent-amber-600"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-400">Max Temp (°C)</span>
                <input
                  type="range"
                  min="25"
                  max="38"
                  value={profile.preferredTemp.max}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      preferredTemp: { ...profile.preferredTemp, max: Number(e.target.value) },
                    })
                  }
                  className="w-full accent-amber-600"
                />
              </div>
            </div>
          </div>

          {/* Light Floor Target */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>Minimum Light Threshold (LDR ADC)</span>
              <span className="text-yellow-700 font-bold">{profile.preferredLight.min} / 1023</span>
            </div>
            <input
              type="range"
              min="100"
              max="800"
              step="50"
              value={profile.preferredLight.min}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  preferredLight: { ...profile.preferredLight, min: Number(e.target.value) },
                })
              }
              className="w-full accent-yellow-500"
            />
          </div>

          {/* Auto-Watering Trigger */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>Automatic Watering Trigger Point</span>
              <span className="text-sky-700 font-bold">Below {profile.wateringThreshold}%</span>
            </div>
            <input
              type="range"
              min="15"
              max="50"
              value={profile.wateringThreshold}
              onChange={(e) => setProfile({ ...profile, wateringThreshold: Number(e.target.value) })}
              className="w-full accent-sky-600"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-3">
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile Settings</span>
          </button>
        </div>
      </form>
    </div>
  )
}

