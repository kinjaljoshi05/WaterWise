import React, { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Sparkles, Trash2, Sprout } from 'lucide-react'
import { ChatMessage, HealthAssessment, PlantProfile, PumpState, SensorData } from '../types/plant'
import { generatePlantResponse } from '../services/chatEngine'

interface TalkToPlantPageProps {
  sensorData: SensorData
  profile: PlantProfile
  health: HealthAssessment
  pumpState: PumpState
  messages: ChatMessage[]
  onSendMessage: (text: string) => void
  onClearMessages: () => void
}

const QUICK_PROMPTS = [
  'How are you feeling?',
  'Do you need water?',
  'Why are you sad?',
  'Is the temperature suitable?',
  'Do you need more sunlight?',
  'When did I last water you?',
]

export const TalkToPlantPage: React.FC<TalkToPlantPageProps> = ({
  sensorData,
  profile,
  health,
  pumpState,
  messages,
  onSendMessage,
  onClearMessages,
}) => {
  const [inputText, setInputText] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!inputText.trim()) return
    onSendMessage(inputText)
    setInputText('')
  }

  const handleSelectQuickPrompt = (prompt: string) => {
    onSendMessage(prompt)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] md:h-[680px] bg-white rounded-3xl border border-slate-100 shadow-2xs overflow-hidden mb-20 md:mb-8 animate-in fade-in duration-300">
      {/* Chat Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-emerald-50/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-xs">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm leading-tight flex items-center gap-2">
              <span>Chat with {profile.name}</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
                Context-Aware AI
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              Live reading: Moisture {sensorData.soilMoisture}%, Temp {sensorData.temperature}°C
            </p>
          </div>
        </div>

        <button
          onClick={onClearMessages}
          className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-white transition-colors"
          title="Clear chat history"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50">
        {messages.map((m) => {
          const isPlant = m.sender === 'plant'
          return (
            <div
              key={m.id}
              className={`flex items-start gap-2.5 max-w-[85%] ${
                isPlant ? 'self-start mr-auto' : 'self-end ml-auto flex-row-reverse'
              }`}
            >
              {/* Avatar Icon */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-2xs text-xs font-bold ${
                  isPlant
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-700 text-white'
                }`}
              >
                {isPlant ? '🌱' : <User className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div>
                <div
                  className={`p-3.5 rounded-2xl text-sm leading-relaxed shadow-2xs ${
                    isPlant
                      ? 'bg-white text-slate-800 border border-slate-100 rounded-tl-xs'
                      : 'bg-emerald-600 text-white rounded-tr-xs'
                  }`}
                >
                  {m.text}
                </div>
                <div
                  className={`text-[10px] text-slate-400 mt-1 px-1 flex items-center gap-1.5 ${
                    isPlant ? 'justify-start' : 'justify-end'
                  }`}
                >
                  <span>{new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  {m.emotion && isPlant && (
                    <span className="font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded text-[9px]">
                      {m.emotion.toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompt Suggestion Chips */}
      <div className="px-4 py-2 border-t border-slate-100 bg-white overflow-x-auto flex gap-1.5 no-scrollbar">
        {QUICK_PROMPTS.map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSelectQuickPrompt(prompt)}
            className="text-xs font-medium bg-slate-50 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 border border-slate-200/70 hover:border-emerald-300 px-3 py-1.5 rounded-full shrink-0 transition-all cursor-pointer"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Field Form */}
      <form onSubmit={handleSend} className="p-3 border-t border-slate-100 bg-white flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Ask ${profile.name} anything about its condition...`}
          className="flex-1 bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-2xl px-4 py-2.5 text-sm outline-hidden transition-all text-slate-800"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 text-white rounded-2xl font-semibold shadow-xs transition-colors flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  )
}

