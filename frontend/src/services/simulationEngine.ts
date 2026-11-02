import { SensorData, SimulationScenario } from '../types/plant'

export const SCENARIO_PRESETS: Record<SimulationScenario, Omit<SensorData, 'timestamp' | 'source'>> = {
  healthy: {
    soilMoisture: 62,
    temperature: 23.5,
    humidity: 60,
    light: 740,
    waterLevel: 85,
  },
  thirsty: {
    soilMoisture: 18,
    temperature: 26.2,
    humidity: 42,
    light: 710,
    waterLevel: 78,
  },
  hot: {
    soilMoisture: 26,
    temperature: 36.8,
    humidity: 32,
    light: 960,
    waterLevel: 60,
  },
  dark: {
    soilMoisture: 56,
    temperature: 20.4,
    humidity: 71,
    light: 130,
    waterLevel: 82,
  },
  low_tank: {
    soilMoisture: 32,
    temperature: 24.1,
    humidity: 52,
    light: 680,
    waterLevel: 8,
  },
  custom: {
    soilMoisture: 50,
    temperature: 24.0,
    humidity: 55,
    light: 650,
    waterLevel: 70,
  },
}

export function createInitialSensorData(scenario: SimulationScenario = 'healthy'): SensorData {
  const preset = SCENARIO_PRESETS[scenario]
  return {
    ...preset,
    timestamp: new Date().toISOString(),
    source: 'simulated',
  }
}

/**
 * Adds realistic organic jitter to simulated readings
 */
export function applyFluctuation(current: SensorData): SensorData {
  // Minor clamp helpers
  const clamp = (val: number, min: number, max: number) => Math.min(max, Math.max(min, val))
  const randomDrift = (magnitude: number) => (Math.random() - 0.5) * magnitude

  // Slight natural drifting
  const newMoisture = Math.round(clamp(current.soilMoisture + randomDrift(1.2), 0, 100))
  const newTemp = Math.round(clamp(current.temperature + randomDrift(0.4), 10, 48) * 10) / 10
  const newHumidity = Math.round(clamp(current.humidity + randomDrift(1.5), 10, 99))
  const newLight = Math.round(clamp(current.light + randomDrift(15), 0, 1023))
  // Tank slowly decreases only if pump was running, or micro drift
  const newTank = clamp(current.waterLevel, 0, 100)

  return {
    soilMoisture: newMoisture,
    temperature: newTemp,
    humidity: newHumidity,
    light: newLight,
    waterLevel: newTank,
    timestamp: new Date().toISOString(),
    source: 'simulated',
  }
}

