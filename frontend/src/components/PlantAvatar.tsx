import React from 'react'
import { PlantEmotion, PlantSpecies } from '../types/plant'

interface PlantAvatarProps {
  emotion: PlantEmotion
  species?: PlantSpecies
  size?: 'sm' | 'md' | 'lg'
  isWatering?: boolean
}

export const PlantAvatar: React.FC<PlantAvatarProps> = ({
  emotion,
  size = 'lg',
  isWatering = false,
}) => {
  // Dimensions based on size prop
  const dimensionClass = {
    sm: 'w-24 h-24',
    md: 'w-44 h-44',
    lg: 'w-64 h-64 md:w-72 md:h-72',
  }[size]

  return (
    <div className={`relative flex items-center justify-center ${dimensionClass} select-none`}>
      {/* Watering droplet animation overlay */}
      {isWatering && (
        <div className="absolute inset-0 pointer-events-none flex justify-center items-start pt-2 z-20">
          <div className="flex gap-4">
            <span className="text-sky-500 animate-droplet text-2xl font-bold">💧</span>
            <span className="text-sky-500 animate-droplet delay-150 text-xl font-bold">💧</span>
            <span className="text-sky-500 animate-droplet delay-300 text-2xl font-bold">💧</span>
          </div>
        </div>
      )}

      {/* Main SVG Character */}
      <svg
        viewBox="0 0 240 240"
        className="w-full h-full drop-shadow-lg overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="leafGrad" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#059669" />
          </radialGradient>
          <radialGradient id="potGrad" cx="40%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#fb923c" />
            <stop offset="100%" stopColor="#c2410c" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ambient shadow */}
        <ellipse cx="120" cy="225" rx="55" ry="10" fill="#0f172a" opacity="0.12" />

        {/* --- LEAF SYSTEM (Sways naturally with emotion) --- */}
        <g
          className={`transform-origin-bottom ${
            emotion === 'hot' || emotion === 'thirsty'
              ? 'scale-y-95 transition-transform duration-700'
              : 'animate-sway'
          }`}
          style={{ transformOrigin: '120px 170px' }}
        >
          {/* Stem */}
          <path
            d="M 120 170 Q 120 120 120 85"
            stroke="#059669"
            strokeWidth="8"
            strokeLinecap="round"
            fill="none"
          />

          {/* Left Leaf */}
          <path
            d={
              emotion === 'thirsty' || emotion === 'sad'
                ? 'M 120 135 C 75 145 50 175 60 185 C 80 180 105 155 120 135 Z' // Drooping down
                : emotion === 'hot'
                ? 'M 120 135 C 70 140 45 160 55 170 C 75 165 105 150 120 135 Z'
                : 'M 120 135 C 70 120 50 90 75 80 C 100 85 115 115 120 135 Z' // Perky up
            }
            fill="url(#leafGrad)"
            stroke="#047857"
            strokeWidth="2.5"
            className="transition-all duration-500"
          />

          {/* Right Leaf */}
          <path
            d={
              emotion === 'thirsty' || emotion === 'sad'
                ? 'M 120 125 C 165 140 190 170 180 180 C 160 175 135 150 120 125 Z' // Drooping
                : emotion === 'hot'
                ? 'M 120 125 C 170 135 195 155 185 165 C 165 160 135 145 120 125 Z'
                : 'M 120 125 C 170 110 190 80 165 70 C 140 75 125 105 120 125 Z' // Perky up
            }
            fill="#10b981"
            stroke="#047857"
            strokeWidth="2.5"
            className="transition-all duration-500"
          />

          {/* Top Bud / Leaf */}
          <path
            d={
              emotion === 'thirsty' || emotion === 'sad'
                ? 'M 120 85 C 100 70 95 45 110 50 C 120 55 125 75 120 85 Z'
                : 'M 120 85 C 105 55 120 30 135 40 C 140 60 130 75 120 85 Z'
            }
            fill="#34d399"
            stroke="#047857"
            strokeWidth="2"
            className="transition-all duration-500"
          />
        </g>

        {/* --- POT & FACE CONTAINER --- */}
        {/* Pot Rim */}
        <rect
          x="62"
          y="155"
          width="116"
          height="16"
          rx="8"
          fill="#ea580c"
          stroke="#9a3412"
          strokeWidth="3"
        />

        {/* Pot Body */}
        <path
          d="M 72 171 L 168 171 L 156 220 C 154 225 150 227 145 227 L 95 227 C 90 227 86 225 84 220 Z"
          fill="url(#potGrad)"
          stroke="#9a3412"
          strokeWidth="3"
        />

        {/* --- POT FACE (EXPRESSION DYNAMICS) --- */}
        <g id="pot-face" className="transition-all duration-300">
          {/* 1. HAPPY EXPRESSION */}
          {emotion === 'happy' && (
            <>
              {/* Happy Eyes (sparkling arches or circles) */}
              <circle cx="102" cy="192" r="5" fill="#1e293b" className="animate-blink" />
              <circle cx="138" cy="192" r="5" fill="#1e293b" className="animate-blink" />
              <circle cx="104" cy="190" r="1.5" fill="#ffffff" />
              <circle cx="140" cy="190" r="1.5" fill="#ffffff" />
              {/* Cheerful rosy cheeks */}
              <ellipse cx="94" cy="198" rx="6" ry="3.5" fill="#f87171" opacity="0.6" />
              <ellipse cx="146" cy="198" rx="6" ry="3.5" fill="#f87171" opacity="0.6" />
              {/* Big happy smile */}
              <path
                d="M 108 200 Q 120 213 132 200"
                stroke="#1e293b"
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
              />
            </>
          )}

          {/* 2. THIRSTY EXPRESSION */}
          {emotion === 'thirsty' && (
            <>
              {/* Pleading oval eyes */}
              <ellipse cx="102" cy="192" rx="5" ry="6" fill="#1e293b" />
              <ellipse cx="138" cy="192" rx="5" ry="6" fill="#1e293b" />
              <circle cx="103" cy="189" r="2" fill="#ffffff" />
              <circle cx="139" cy="189" r="2" fill="#ffffff" />
              {/* Worried eyebrows */}
              <path d="M 96 183 L 107 186" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 144 183 L 133 186" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
              {/* Quivering wavy mouth */}
              <path
                d="M 110 205 Q 115 201 120 205 Q 125 208 130 204"
                stroke="#1e293b"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
              />
              {/* Sweat / Tear drop */}
              <path
                d="M 148 190 C 153 190 155 197 151 201 C 147 205 145 201 148 190 Z"
                fill="#38bdf8"
              />
            </>
          )}

          {/* 3. HOT / STRESSED EXPRESSION */}
          {emotion === 'hot' && (
            <>
              {/* Squinting dizzy eyes */}
              <path d="M 97 190 L 107 194" stroke="#1e293b" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M 97 194 L 107 190" stroke="#1e293b" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M 133 190 L 143 194" stroke="#1e293b" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M 133 194 L 143 190" stroke="#1e293b" strokeWidth="3.5" strokeLinecap="round" />
              {/* Hot flushed cheeks */}
              <ellipse cx="94" cy="198" rx="8" ry="4" fill="#ef4444" opacity="0.75" />
              <ellipse cx="146" cy="198" rx="8" ry="4" fill="#ef4444" opacity="0.75" />
              {/* Panting mouth with tongue */}
              <path
                d="M 111 201 Q 120 207 129 201"
                stroke="#1e293b"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 117 203 C 117 212 123 212 123 203 Z"
                fill="#f43f5e"
                stroke="#9f1239"
                strokeWidth="1.5"
              />
              {/* Sweat drop on forehead */}
              <path
                d="M 120 178 C 124 178 126 183 122 187 C 118 190 117 186 120 178 Z"
                fill="#38bdf8"
              />
            </>
          )}

          {/* 4. SAD / LOW LIGHT EXPRESSION */}
          {emotion === 'sad' && (
            <>
              {/* Droopy half-closed eyes */}
              <ellipse cx="102" cy="194" rx="5" ry="4" fill="#1e293b" />
              <ellipse cx="138" cy="194" rx="5" ry="4" fill="#1e293b" />
              <path d="M 97 191 L 107 193" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 143 191 L 133 193" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
              {/* Downturned sad mouth */}
              <path
                d="M 110 207 Q 120 199 130 207"
                stroke="#1e293b"
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
              />
              {/* Subtle tear drop */}
              <circle cx="98" cy="204" r="2" fill="#60a5fa" />
            </>
          )}

          {/* 5. WARNING / LOW TANK EXPRESSION */}
          {emotion === 'warning' && (
            <>
              {/* Wide alert eyes */}
              <circle cx="102" cy="192" r="6" fill="#1e293b" />
              <circle cx="138" cy="192" r="6" fill="#1e293b" />
              <circle cx="103" cy="190" r="2.5" fill="#ffffff" />
              <circle cx="139" cy="190" r="2.5" fill="#ffffff" />
              {/* Straight nervous mouth */}
              <line x1="110" y1="205" x2="130" y2="205" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
              {/* Warning badge on pot */}
              <g transform="translate(112, 163)">
                <polygon points="8,0 16,14 0,14" fill="#f59e0b" stroke="#78350f" strokeWidth="1" />
                <line x1="8" y1="4" x2="8" y2="9" stroke="#78350f" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="8" cy="11.5" r="0.8" fill="#78350f" />
              </g>
            </>
          )}
        </g>
      </svg>
    </div>
  )
}

