import React from 'react'
import { Sparkles, SlidersHorizontal, Sprout } from 'lucide-react'
import { DataSource, SimulationScenario } from '../types/plant'

interface HeaderProps {
  plantName: string
  speciesDisplayName: string
  dataSource: DataSource
  currentScenario: SimulationScenario
  isAutoFluctuating: boolean
  onOpenSimulationModal: () => void
}

export const Header: React.FC<HeaderProps> = ({
  plantName,
  speciesDisplayName,
  dataSource,
  currentScenario,
  isAutoFluctuating,
  onOpenSimulationModal,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-emerald-100 shadow-xs px-4 py-3">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
        {/* Brand & Plant Name */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-sm shadow-emerald-200">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-slate-800 text-base leading-tight tracking-tight">
                {plantName}
              </h1>
              <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                {speciesDisplayName}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Plant Buddy IoT Companion</p>
          </div>
        </div>

        {/* Status Pills & Simulation Switcher */}
        <div className="flex items-center gap-2">
          {/* SIMULATED / HARDWARE BADGE */}
          <button
            onClick={onOpenSimulationModal}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
              dataSource === 'simulated'
                ? 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                : 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
            }`}
            title="Click to change simulation scenario or settings"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                dataSource === 'simulated' ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'
              }`}
            />
            <span className="tracking-wide">
              {dataSource === 'simulated' ? `SIMULATED (${currentScenario.toUpperCase()})` : 'ESP32 LIVE'}
            </span>
            <SlidersHorizontal className="w-3.5 h-3.5 ml-0.5 text-amber-700" />
          </button>
        </div>
      </div>
    </header>
  )
}

