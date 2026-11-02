import { HealthAssessment, PlantEmotion, PlantProfile, SensorData } from '../types/plant'

export function assessPlantHealth(
  sensor: SensorData,
  profile: PlantProfile
): HealthAssessment {
  // Parameter status assessments
  const paramStatus = {
    moisture: 'optimal' as 'optimal' | 'warning' | 'critical',
    temperature: 'optimal' as 'optimal' | 'warning' | 'critical',
    humidity: 'optimal' as 'optimal' | 'warning' | 'critical',
    light: 'optimal' as 'optimal' | 'warning' | 'critical',
    waterTank: 'optimal' as 'optimal' | 'warning' | 'critical',
  }

  // 1. Soil Moisture
  let moistureScore = 100
  if (sensor.soilMoisture < profile.wateringThreshold) {
    paramStatus.moisture = sensor.soilMoisture < profile.wateringThreshold * 0.6 ? 'critical' : 'warning'
    const diff = profile.wateringThreshold - sensor.soilMoisture
    moistureScore = Math.max(20, 100 - diff * 3.5)
  } else if (sensor.soilMoisture > profile.preferredMoisture.max + 15) {
    paramStatus.moisture = 'warning'
    moistureScore = Math.max(40, 100 - (sensor.soilMoisture - profile.preferredMoisture.max) * 2.5)
  } else if (
    sensor.soilMoisture < profile.preferredMoisture.min
  ) {
    paramStatus.moisture = 'warning'
    moistureScore = 80
  }

  // 2. Temperature
  let tempScore = 100
  if (sensor.temperature > profile.preferredTemp.max + 4) {
    paramStatus.temperature = 'critical'
    tempScore = Math.max(25, 100 - (sensor.temperature - profile.preferredTemp.max) * 8)
  } else if (sensor.temperature > profile.preferredTemp.max) {
    paramStatus.temperature = 'warning'
    tempScore = 75
  } else if (sensor.temperature < profile.preferredTemp.min - 4) {
    paramStatus.temperature = 'critical'
    tempScore = Math.max(30, 100 - (profile.preferredTemp.min - sensor.temperature) * 8)
  } else if (sensor.temperature < profile.preferredTemp.min) {
    paramStatus.temperature = 'warning'
    tempScore = 80
  }

  // 3. Humidity
  let humidityScore = 100
  if (sensor.humidity < profile.preferredHumidity.min - 15) {
    paramStatus.humidity = 'warning'
    humidityScore = 65
  } else if (sensor.humidity < profile.preferredHumidity.min) {
    paramStatus.humidity = 'warning'
    humidityScore = 80
  } else if (sensor.humidity > profile.preferredHumidity.max + 15) {
    paramStatus.humidity = 'warning'
    humidityScore = 75
  }

  // 4. Light
  let lightScore = 100
  if (sensor.light < profile.preferredLight.min * 0.5) {
    paramStatus.light = 'critical'
    lightScore = 40
  } else if (sensor.light < profile.preferredLight.min) {
    paramStatus.light = 'warning'
    lightScore = 70
  } else if (sensor.light > profile.preferredLight.max + 200) {
    paramStatus.light = 'warning'
    lightScore = 75
  }

  // 5. Water Tank
  if (sensor.waterLevel < 15) {
    paramStatus.waterTank = 'critical'
  } else if (sensor.waterLevel < 25) {
    paramStatus.waterTank = 'warning'
  }

  // Weighted overall score
  const totalScore = Math.round(
    moistureScore * 0.4 +
    tempScore * 0.25 +
    lightScore * 0.2 +
    humidityScore * 0.15
  )

  // Determine Emotion
  let emotion: PlantEmotion = 'happy'
  if (paramStatus.waterTank === 'critical') {
    emotion = 'warning'
  } else if (sensor.soilMoisture < profile.wateringThreshold) {
    emotion = 'thirsty'
  } else if (sensor.temperature > profile.preferredTemp.max + 3) {
    emotion = 'hot'
  } else if (sensor.light < profile.preferredLight.min * 0.6 || totalScore < 60) {
    emotion = 'sad'
  } else if (paramStatus.waterTank === 'warning') {
    emotion = 'warning'
  } else {
    emotion = 'happy'
  }

  // Status descriptor
  let status: 'Thriving' | 'Good' | 'Needs Attention' | 'Critical' = 'Thriving'
  if (totalScore < 50 || paramStatus.moisture === 'critical') {
    status = 'Critical'
  } else if (totalScore < 70 || paramStatus.waterTank === 'critical' || paramStatus.temperature === 'warning') {
    status = 'Needs Attention'
  } else if (totalScore < 85) {
    status = 'Good'
  } else {
    status = 'Thriving'
  }

  // Speech bubble & recommendations
  const recommendations: string[] = []
  let speechBubble = ''

  if (emotion === 'warning') {
    speechBubble = `Heads up! My water reservoir is down to ${sensor.waterLevel}%. Please refill it so I can stay hydrated!`
    recommendations.push('Refill the water reservoir tank.')
  } else if (emotion === 'thirsty') {
    speechBubble = `My soil moisture is at ${sensor.soilMoisture}%. I'm getting quite thirsty! Could you give me some water?`
    recommendations.push(`Soil moisture (${sensor.soilMoisture}%) is below your target (${profile.wateringThreshold}%). Run watering cycle.`)
  } else if (emotion === 'hot') {
    speechBubble = `Whew, it's ${sensor.temperature}°C! That's too toasty for a ${profile.speciesDisplayName}. Mind moving me somewhere cooler?`
    recommendations.push(`Ambient temperature (${sensor.temperature}°C) is above preferred ceiling (${profile.preferredTemp.max}°C). Move away from heat sources.`)
  } else if (emotion === 'sad') {
    if (sensor.light < profile.preferredLight.min) {
      speechBubble = `It's pretty dim here (light level: ${sensor.light}). Could you move me closer to the window or turn on a grow light?`
      recommendations.push(`Light intensity (${sensor.light}) is below preferred minimum (${profile.preferredLight.min}). Increase ambient lighting.`)
    } else {
      speechBubble = `I'm feeling a bit under the weather today. Check my sensor dials so we can fix things up together!`
      recommendations.push('Review moisture and temperature deviations.')
    }
  } else {
    speechBubble = `I'm feeling fantastic! Soil moisture is ${sensor.soilMoisture}% and temperature is ${sensor.temperature}°C. Thanks for taking such great care of me!`
    recommendations.push('All parameters within ideal target range. Keep up the good routine!')
  }

  if (sensor.waterLevel < 25 && emotion !== 'warning') {
    recommendations.push('Water reservoir is under 25%. Plan a refill soon.')
  }

  const summary = `${profile.name} (${profile.speciesDisplayName}) is currently ${status.toLowerCase()} with a health index of ${totalScore}/100.`

  return {
    score: totalScore,
    emotion,
    status,
    summary,
    speechBubble,
    recommendations,
    parameterStatuses: paramStatus,
  }
}

