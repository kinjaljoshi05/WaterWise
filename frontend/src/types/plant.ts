export type PlantSpecies = 'monstera' | 'succulent' | 'basil' | 'snake_plant'

export type PlantEmotion = 'happy' | 'thirsty' | 'hot' | 'sad' | 'warning'

export type DataSource = 'simulated' | 'esp32'

export interface SensorData {
  soilMoisture: number // 0 - 100%
  temperature: number // Celsius
  humidity: number // 0 - 100%
  light: number // 0 - 1023 (LDR raw analog reading)
  waterLevel: number // 0 - 100% (tank percentage)
  timestamp: string // ISO string
  source: DataSource
}

export interface PlantProfile {
  id: string
  name: string
  species: PlantSpecies
  speciesDisplayName: string
  description: string
  preferredMoisture: { min: number; max: number }
  preferredTemp: { min: number; max: number }
  preferredHumidity: { min: number; max: number }
  preferredLight: { min: number; max: number }
  wateringThreshold: number
  autoWatering: boolean
}

export interface HealthAssessment {
  score: number // 0 - 100
  emotion: PlantEmotion
  status: 'Thriving' | 'Good' | 'Needs Attention' | 'Critical'
  summary: string
  speechBubble: string
  recommendations: string[]
  parameterStatuses: {
    moisture: 'optimal' | 'warning' | 'critical'
    temperature: 'optimal' | 'warning' | 'critical'
    humidity: 'optimal' | 'warning' | 'critical'
    light: 'optimal' | 'warning' | 'critical'
    waterTank: 'optimal' | 'warning' | 'critical'
  }
}

export type SimulationScenario =
  | 'healthy'
  | 'thirsty'
  | 'hot'
  | 'dark'
  | 'low_tank'
  | 'custom'

export interface PumpState {
  status: 'idle' | 'watering' | 'cooldown' | 'inhibited'
  isPumpRunning: boolean
  remainingTimeSeconds: number
  lastWateredTime: string | null
  totalWateringsToday: number
  blockReason?: string
}

export interface HistoryPoint {
  time: string
  moisture: number
  temperature: number
  humidity: number
  light: number
  healthScore: number
}

export interface PlantEvent {
  id: string
  timestamp: string
  type: 'watering' | 'alert' | 'mode_change' | 'system'
  title: string
  description: string
  severity: 'info' | 'warning' | 'critical' | 'success'
}

export interface ChatMessage {
  id: string
  sender: 'user' | 'plant'
  text: string
  timestamp: string
  emotion?: PlantEmotion
}

