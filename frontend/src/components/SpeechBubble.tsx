import React from 'react'
import { PlantEmotion } from '../types/plant'
import { MessageCircle, Volume2 } from 'lucide-react'

interface SpeechBubbleProps {
  text: string
  emotion: PlantEmotion
  plantName: string
  onSpeak?: () => void
}

const emotionBadgeMap: Record<PlantEmotion, { label: string; bg: string; text: string; icon: string }> = {
  happy: { label: 'Happy & Thriving', bg: 'bg-emerald-100 text-emerald-800 border-emerald-200', text: 'text-emerald-700', icon: '😊' },
  thirsty: { label: 'Thirsty & Dry', bg: 'bg-amber-100 text-amber-800 border-amber-200', text: 'text-amber-700', icon: '🥺' },
  hot: { label: 'Heat Stressed', bg: 'bg-rose-100 text-rose-800 border-rose-200', text: 'text-rose-700', icon: '🥵' },
  sad: { label: 'Needs Attention', bg: 'bg-indigo-100 text-indigo-800 border-indigo-200', text: 'text-indigo-700', icon: '😟' },
  warning: { label: 'Water Reservoir Low', bg: 'bg-amber-100 text-amber-800 border-amber-200', text: 'text-amber-700', icon: '⚠️' },
}

export const SpeechBubble: React.FC<SpeechBubbleProps> = ({
  text,
  emotion,
  plantName,
  onSpeak,
}) => {
  const badge = emotionBadgeMap[emotion]

  return (
    <div className="relative w-full max-w-md mx-auto my-3 animate-float">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-md border border-emerald-100/80 relative">
        {/* Header row */}
        <div className="flex items-center justify-between gap-2 mb-2 pb-1 border-b border-slate-100">
          <div className="flex items-center gap-1.5">
            <span className="text-lg">{badge.icon}</span>
            <span className="font-semibold text-slate-800 text-sm">{plantName}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${badge.bg}`}>
              {badge.label}
            </span>
          </div>

          {onSpeak && (
            <button
              onClick={onSpeak}
              className="p-1 text-slate-400 hover:text-emerald-600 transition-colors rounded-lg hover:bg-emerald-50"
              title="Read aloud"
              type="button"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Speech text */}
        <p className="text-slate-700 text-sm md:text-base leading-relaxed italic">
          "{text}"
        </p>

        {/* Speech triangle tail pointing down towards the plant pot */}
        <div
          className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-r border-b border-emerald-100/80 rotate-45"
        />
      </div>
    </div>
  )
}

