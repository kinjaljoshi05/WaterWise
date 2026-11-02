import React from 'react'
import { Home, Activity, MessageSquareHeart, Power, LineChart, Settings } from 'lucide-react'

export type NavTab = 'home' | 'live' | 'chat' | 'control' | 'history' | 'profile'

interface NavigationProps {
  currentTab: NavTab
  onSelectTab: (tab: NavTab) => void
  hasAlert?: boolean
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onSelectTab,
  hasAlert = false,
}) => {
  const tabs: { id: NavTab; label: string; icon: React.FC<{ className?: string }>; badge?: boolean }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'live', label: 'Sensors', icon: Activity },
    { id: 'chat', label: 'Chat', icon: MessageSquareHeart },
    { id: 'control', label: 'Control', icon: Power, badge: hasAlert },
    { id: 'history', label: 'History', icon: LineChart },
    { id: 'profile', label: 'Profile', icon: Settings },
  ]

  return (
    <>
      {/* Desktop / Tablet Sub-Header Navigation */}
      <nav className="hidden md:flex max-w-4xl mx-auto px-4 mt-3 mb-1">
        <div className="flex bg-white/80 backdrop-blur-xs p-1.5 rounded-2xl border border-emerald-100 shadow-xs w-full justify-between gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = currentTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`relative flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 flex-1 ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
                {tab.badge && !isActive && (
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                )}
              </button>
            )
          })}
        </div>
      </nav>

      {/* Mobile Fixed Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-2 py-1 shadow-lg pb-safe">
        <div className="flex items-center justify-around">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = currentTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-colors relative ${
                  isActive ? 'text-emerald-600 font-semibold' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <div className={`p-1 rounded-lg ${isActive ? 'bg-emerald-50 text-emerald-600' : ''}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] mt-0.5 tracking-tight">{tab.label}</span>
                {tab.badge && !isActive && (
                  <span className="absolute top-1.5 right-2 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
                )}
              </button>
            )
          })}
        </div>
      </nav>
    </>
  )
}

