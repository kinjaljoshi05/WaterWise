import { HealthAssessment, PlantProfile, PumpState, SensorData } from '../types/plant'

export function generatePlantResponse(
  message: string,
  sensor: SensorData,
  profile: PlantProfile,
  health: HealthAssessment,
  pumpState: PumpState
): string {
  const q = message.toLowerCase().trim()

  // 1. Water & Thirst queries
  if (
    q.includes('water') ||
    q.includes('thirsty') ||
    q.includes('drink') ||
    q.includes('hydrate') ||
    q.includes('dry')
  ) {
    if (q.includes('last') || q.includes('when')) {
      if (pumpState.lastWateredTime) {
        const date = new Date(pumpState.lastWateredTime)
        return `You last watered me at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}. My soil moisture is currently sitting at ${sensor.soilMoisture}%.`
      }
      return `I don't have a record of a recent watering session today. My current soil moisture is ${sensor.soilMoisture}%. Target for a ${profile.speciesDisplayName} is ${profile.preferredMoisture.min}% - ${profile.preferredMoisture.max}%.`
    }

    if (sensor.soilMoisture < profile.wateringThreshold) {
      return `Yes, please! My soil moisture is down to ${sensor.soilMoisture}%, which is below my threshold of ${profile.wateringThreshold}%. A small sip would be lovely! 🥺💧`
    }
    if (sensor.soilMoisture > profile.preferredMoisture.max) {
      return `No thanks! My soil is very moist at ${sensor.soilMoisture}%. Giving me more water right now might cause root rot. Let me breathe a bit!`
    }
    return `I'm good right now! My soil moisture is ${sensor.soilMoisture}%, right in my sweet spot (${profile.preferredMoisture.min}% to ${profile.preferredMoisture.max}%).`
  }

  // 2. Temperature queries
  if (
    q.includes('temp') ||
    q.includes('temperature') ||
    q.includes('hot') ||
    q.includes('cold') ||
    q.includes('warm') ||
    q.includes('chilly')
  ) {
    if (sensor.temperature > profile.preferredTemp.max) {
      return `Whew, it is pretty warm here! The sensor reads ${sensor.temperature}°C. As a ${profile.speciesDisplayName}, I prefer staying under ${profile.preferredTemp.max}°C. Could you find me a cooler spot? 🥵`
    }
    if (sensor.temperature < profile.preferredTemp.min) {
      return `Brrr! It's feeling chilly at ${sensor.temperature}°C. I do best between ${profile.preferredTemp.min}°C and ${profile.preferredTemp.max}°C. Please keep me away from cold drafts!`
    }
    return `The temperature is lovely! It's ${sensor.temperature}°C, which is comfortably within my target of ${profile.preferredTemp.min}°C to ${profile.preferredTemp.max}°C.`
  }

  // 3. Light / Sunlight queries
  if (
    q.includes('light') ||
    q.includes('sun') ||
    q.includes('sunlight') ||
    q.includes('dark') ||
    q.includes('bright') ||
    q.includes('window')
  ) {
    if (sensor.light < profile.preferredLight.min) {
      return `It feels quite dim here! My light sensor reading is ${sensor.light} (target: ${profile.preferredLight.min}–${profile.preferredLight.max}). Could you move me closer to bright indirect daylight? ⛅`
    }
    if (sensor.light > profile.preferredLight.max) {
      return `It's super bright right now (reading: ${sensor.light})! If this is harsh direct midday sun, my leaves might get sunburned. Filtered light is best for me!`
    }
    return `The light level is great! My sensor is reading ${sensor.light}, which provides plenty of energy for photosynthesis.`
  }

  // 4. Tank / Reservoir queries
  if (q.includes('tank') || q.includes('reservoir') || q.includes('pump')) {
    if (sensor.waterLevel < 20) {
      return `Warning! My water reservoir is almost empty at ${sensor.waterLevel}%. The pump safety mechanism will block watering until you refill the tank! ⚠️`
    }
    return `The water tank is currently at ${sensor.waterLevel}%, and the pump status is ${pumpState.status}. Plenty of water available if I need a drink!`
  }

  // 5. Why are you sad / Why are you hot / How are you feeling
  if (q.includes('why') && (q.includes('sad') || q.includes('unhappy') || q.includes('mad'))) {
    if (health.emotion === 'thirsty') {
      return `I'm feeling down because my soil is too dry (${sensor.soilMoisture}%). I really need a quick watering!`
    }
    if (health.emotion === 'hot') {
      return `I'm drooping because it's ${sensor.temperature}°C in here! That's too hot for me.`
    }
    if (sensor.light < profile.preferredLight.min) {
      return `I'm feeling sad because I'm not getting enough light (${sensor.light}). Plant photosynthesis needs photons!`
    }
    if (sensor.waterLevel < 20) {
      return `I'm anxious because the water tank is empty (${sensor.waterLevel}%), so auto-watering won't work.`
    }
    return `Actually, I'm feeling quite well! Health score is ${health.score}/100. Thanks for checking in!`
  }

  if (
    q.includes('how are you') ||
    q.includes('how do you feel') ||
    q.includes('status') ||
    q.includes('feeling')
  ) {
    return `Hello! My name is ${profile.name}. I'm currently feeling ${health.emotion.toUpperCase()}! Overall health index is ${health.score}/100. Soil: ${sensor.soilMoisture}%, Temp: ${sensor.temperature}°C, Light: ${sensor.light}.`
  }

  // 6. Greetings
  if (
    q.includes('hello') ||
    q.includes('hi') ||
    q.includes('hey') ||
    q.includes('good morning') ||
    q.includes('good afternoon')
  ) {
    return `Hey there, plant parent! 🌱 ${profile.name} here. I'm soaking in the room and monitoring my soil. How can I help you today?`
  }

  // 7. General fallback with context
  return `I heard you! Right now my sensors show: Soil Moisture: ${sensor.soilMoisture}%, Temp: ${sensor.temperature}°C, Humidity: ${sensor.humidity}%, Light: ${sensor.light}. Overall status is "${health.status}". Ask me about water, sunlight, or temperature anytime!`
}

