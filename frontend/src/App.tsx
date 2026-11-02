import React, { useState, useEffect, useRef } from 'react'
import {
  ChatMessage,
  HistoryPoint,
  PlantEvent,
  PlantProfile,
  PumpState,
  SensorData,
  SimulationScenario,
} from './types/plant'
import { DEFAULT_PROFILE } from './data/plantProfiles'
import { assessPlantHealth } from './services/plantHealthEngine'
import {
  applyFluctuation,
  createInitialSensorData,
  SCENARIO_PRESETS,
} from './services/simulationEngine'
import { generatePlantResponse } from './services/chatEngine'

import { Header } from './components/Header'
import { Navigation, NavTab } from './components/Navigation'
import { SimulationControlModal } from './components/SimulationControlModal'

import { HomePage } from './pages/HomePage'
import { LiveMonitoringPage } from './pages/LiveMonitoringPage'
import { TalkToPlantPage } from './pages/TalkToPlantPage'
import { PlantControlPage } from './pages/PlantControlPage'
import { HealthHistoryPage } from './pages/HealthHistoryPage'
import { PlantProfilePage } from './pages/PlantProfilePage'

export const App: React.FC = () => {
  // Navigation
  const [currentTab, setCurrentTab] = useState<NavTab>('home')

  // Plant Profile
  const [profile, setProfile] = useState<PlantProfile>(DEFAULT_PROFILE)

  // Simulation & Sensor Data
  const [currentScenario, setCurrentScenario] = useState<SimulationScenario>('healthy')
  const [isAutoFluctuating, setIsAutoFluctuating] = useState<boolean>(true)
  const [isSimModalOpen, setIsSimModalOpen] = useState<boolean>(false)
  const [sensorData, setSensorData] = useState<SensorData>(() => createInitialSensorData('healthy'))

  // Historical Telemetry snapshots for charts
  const [history, setHistory] = useState<HistoryPoint[]>(() => {
    const now = new Date()
    return Array.from({ length: 8 }, (_, i) => {
      const t = new Date(now.getTime() - (7 - i) * 120000)
      return {
        time: t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        moisture: 58 + Math.round((Math.random() - 0.5) * 6),
        temperature: 23.5 + Math.round((Math.random() - 0.5) * 2 * 10) / 10,
        humidity: 60 + Math.round((Math.random() - 0.5) * 8),
        light: 740 + Math.round((Math.random() - 0.5) * 40),
        healthScore: 92,
      }
    })
  })

  // Pump State & Safety Guards
  const [pumpState, setPumpState] = useState<PumpState>({
    status: 'idle',
    isPumpRunning: false,
    remainingTimeSeconds: 0,
    lastWateredTime: null,
    totalWateringsToday: 1,
  })

  // Events & Audit Trail
  const [events, setEvents] = useState<PlantEvent[]>([
    {
      id: 'init-1',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      type: 'system',
      title: 'Plant Buddy System Initialized',
      description: 'Connected in simulation verification mode. Local ADC calibration verified.',
      severity: 'info',
    },
    {
      id: 'init-2',
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      type: 'watering',
      title: 'Scheduled Morning Watering',
      description: 'Auto-watering cycle completed: 5 seconds runtime. Soil moisture reached 62%.',
      severity: 'success',
    },
  ])

  // Chat Messenger State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'plant',
      text: `Hello! I'm ${profile.name}, your intelligent plant companion 🌱. Ask me anything about how I'm feeling, my soil moisture, sunlight, or water!`,
      timestamp: new Date().toISOString(),
      emotion: 'happy',
    },
  ])

  // Compute live plant health & emotion
  const healthAssessment = assessPlantHealth(sensorData, profile)

  // 1. Organic Sensor Fluctuation & History Rolling Buffer
  useEffect(() => {
    if (!isAutoFluctuating) return

    const timer = setInterval(() => {
      setSensorData((prev) => {
        // Do not drift while pump is actively watering
        if (pumpState.isPumpRunning) return prev
        const updated = applyFluctuation(prev)

        // Append to rolling history
        const now = new Date()
        const newPoint: HistoryPoint = {
          time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          moisture: updated.soilMoisture,
          temperature: updated.temperature,
          humidity: updated.humidity,
          light: updated.light,
          healthScore: healthAssessment.score,
        }

        setHistory((prevHistory) => [...prevHistory.slice(-24), newPoint])
        return updated
      })
    }, 4000)

    return () => clearInterval(timer)
  }, [isAutoFluctuating, pumpState.isPumpRunning, healthAssessment.score])

  // 2. Autonomous Watering Logic (Local Microcontroller Emulation)
  useEffect(() => {
    if (!profile.autoWatering) return
    if (pumpState.status !== 'idle' || pumpState.isPumpRunning) return

    // Trigger auto watering if soil is dry AND water reservoir is safe
    if (sensorData.soilMoisture < profile.wateringThreshold && sensorData.waterLevel >= 20) {
      triggerWateringCycle(5, 'Automatic threshold trigger: Soil dry')
    }
  }, [sensorData.soilMoisture, sensorData.waterLevel, profile.autoWatering, profile.wateringThreshold, pumpState.status])

  // 3. Pump Countdown & Cooldown Timer Tick (1Hz)
  useEffect(() => {
    if (pumpState.status === 'idle') return

    const interval = setInterval(() => {
      setPumpState((prev) => {
        if (prev.status === 'watering') {
          if (prev.remainingTimeSeconds <= 1) {
            // Watering completed -> transition to cooldown (30 seconds)
            // Simulate post-watering moisture bump (+20%) and slight tank depletion (-4%)
            setSensorData((s) => ({
              ...s,
              soilMoisture: Math.min(85, s.soilMoisture + 22),
              waterLevel: Math.max(0, s.waterLevel - 4),
            }))

            addEvent(
              'watering',
              'Irrigation Cycle Finished',
              'Pump turned off safely after runtime limit. 30s cooldown active.',
              'success'
            )

            return {
              ...prev,
              status: 'cooldown',
              isPumpRunning: false,
              remainingTimeSeconds: 30,
              lastWateredTime: new Date().toISOString(),
              totalWateringsToday: prev.totalWateringsToday + 1,
            }
          }
          return { ...prev, remainingTimeSeconds: prev.remainingTimeSeconds - 1 }
        }

        if (prev.status === 'cooldown') {
          if (prev.remainingTimeSeconds <= 1) {
            return {
              ...prev,
              status: 'idle',
              remainingTimeSeconds: 0,
            }
          }
          return { ...prev, remainingTimeSeconds: prev.remainingTimeSeconds - 1 }
        }

        return prev
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [pumpState.status])

  // Helper to add events
  const addEvent = (
    type: 'watering' | 'alert' | 'mode_change' | 'system',
    title: string,
    description: string,
    severity: 'info' | 'warning' | 'critical' | 'success'
  ) => {
    setEvents((prev) => [
      {
        id: `evt-${Date.now()}-${Math.random()}`,
        timestamp: new Date().toISOString(),
        type,
        title,
        description,
        severity,
      },
      ...prev.slice(0, 49),
    ])
  }

  // Watering cycle execution
  const triggerWateringCycle = (durationSeconds: number, reason: string) => {
    if (sensorData.waterLevel < 20) {
      addEvent('alert', 'Watering Blocked', 'Reservoir below 20% safety threshold.', 'critical')
      return
    }

    if (pumpState.status !== 'idle') return

    setPumpState({
      status: 'watering',
      isPumpRunning: true,
      remainingTimeSeconds: Math.min(5, durationSeconds), // ESP32 hard safety ceiling: 5s
      lastWateredTime: pumpState.lastWateredTime,
      totalWateringsToday: pumpState.totalWateringsToday,
    })

    addEvent('watering', 'Water Pump Activated', `${reason}. Running for ${durationSeconds}s.`, 'info')
  }

  // Emergency Stop Kill Switch
  const handleEmergencyStop = () => {
    setPumpState({
      status: 'idle',
      isPumpRunning: false,
      remainingTimeSeconds: 0,
      lastWateredTime: pumpState.lastWateredTime,
      totalWateringsToday: pumpState.totalWateringsToday,
    })
    addEvent('alert', 'Manual Emergency Stop', 'User triggered immediate pump shutdown.', 'warning')
  }

  // Scenario Selector
  const handleSelectScenario = (scenario: SimulationScenario) => {
    setCurrentScenario(scenario)
    const preset = SCENARIO_PRESETS[scenario]
    setSensorData({
      ...preset,
      timestamp: new Date().toISOString(),
      source: 'simulated',
    })

    addEvent('system', `Simulation Scenario: ${scenario.toUpperCase()}`, `Updated simulated sensor profile.`, 'info')
  }

  // Manual sensor tweaking
  const handleUpdateManualSensor = (
    field: keyof Omit<SensorData, 'timestamp' | 'source'>,
    value: number
  ) => {
    setCurrentScenario('custom')
    setSensorData((prev) => ({
      ...prev,
      [field]: value,
      timestamp: new Date().toISOString(),
    }))
  }

  // Chat message sending
  const handleSendMessage = (text: string) => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMsg])

    // Generate plant response based on live state
    setTimeout(() => {
      const replyText = generatePlantResponse(
        text,
        sensorData,
        profile,
        healthAssessment,
        pumpState
      )

      const plantMsg: ChatMessage = {
        id: `reply-${Date.now()}`,
        sender: 'plant',
        text: replyText,
        timestamp: new Date().toISOString(),
        emotion: healthAssessment.emotion,
      }

      setMessages((prev) => [...prev, plantMsg])
    }, 400)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Header */}
      <Header
        plantName={profile.name}
        speciesDisplayName={profile.speciesDisplayName}
        dataSource={sensorData.source}
        currentScenario={currentScenario}
        isAutoFluctuating={isAutoFluctuating}
        onOpenSimulationModal={() => setIsSimModalOpen(true)}
      />

      {/* Navigation Bar (Desktop & Mobile) */}
      <Navigation
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        hasAlert={sensorData.waterLevel < 20 || healthAssessment.score < 60}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-4">
        {currentTab === 'home' && (
          <HomePage
            sensorData={sensorData}
            profile={profile}
            health={healthAssessment}
            pumpState={pumpState}
            onNavigateTab={setCurrentTab}
            onTriggerQuickWater={() => triggerWateringCycle(5, 'Manual quick watering from Home')}
          />
        )}

        {currentTab === 'live' && (
          <LiveMonitoringPage
            sensorData={sensorData}
            profile={profile}
            health={healthAssessment}
            history={history}
          />
        )}

        {currentTab === 'chat' && (
          <TalkToPlantPage
            sensorData={sensorData}
            profile={profile}
            health={healthAssessment}
            pumpState={pumpState}
            messages={messages}
            onSendMessage={handleSendMessage}
            onClearMessages={() => setMessages([])}
          />
        )}

        {currentTab === 'control' && (
          <PlantControlPage
            sensorData={sensorData}
            profile={profile}
            pumpState={pumpState}
            onToggleAutoWatering={() =>
              setProfile((p) => {
                const next = !p.autoWatering
                addEvent('mode_change', 'Auto-Watering Toggled', `Switched to ${next ? 'Automatic' : 'Manual'} mode`, 'info')
                return { ...p, autoWatering: next }
              })
            }
            onTriggerManualWater={(dur) => triggerWateringCycle(dur, 'Manual user command')}
            onEmergencyStop={handleEmergencyStop}
            onUpdateWateringThreshold={(th) =>
              setProfile((p) => ({ ...p, wateringThreshold: th }))
            }
          />
        )}

        {currentTab === 'history' && (
          <HealthHistoryPage
            history={history}
            events={events}
            profile={profile}
          />
        )}

        {currentTab === 'profile' && (
          <PlantProfilePage
            currentProfile={profile}
            onSaveProfile={(updated) => {
              setProfile(updated)
              addEvent('mode_change', 'Plant Profile Updated', `Configured targets for ${updated.name} (${updated.speciesDisplayName})`, 'info')
            }}
          />
        )}
      </main>

      {/* Simulation Scenario Modal */}
      <SimulationControlModal
        isOpen={isSimModalOpen}
        onClose={() => setIsSimModalOpen(false)}
        currentScenario={currentScenario}
        onSelectScenario={handleSelectScenario}
        isAutoFluctuating={isAutoFluctuating}
        onToggleFluctuation={() => setIsAutoFluctuating((prev) => !prev)}
        sensorData={sensorData}
        onUpdateManualSensor={handleUpdateManualSensor}
      />
    </div>
  )
}

export default App
