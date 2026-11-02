import { PlantProfile } from '../types/plant'

export const PLANT_PROFILES: Record<string, PlantProfile> = {
  monstera: {
    id: 'monstera',
    name: 'Monty',
    species: 'monstera',
    speciesDisplayName: 'Monstera Deliciosa',
    description: 'Tropical foliage plant that loves moderate moisture, warmth, and bright filtered light.',
    preferredMoisture: { min: 45, max: 75 },
    preferredTemp: { min: 19, max: 29 },
    preferredHumidity: { min: 50, max: 80 },
    preferredLight: { min: 500, max: 850 },
    wateringThreshold: 35,
    autoWatering: true,
  },
  succulent: {
    id: 'succulent',
    name: 'Spike',
    species: 'succulent',
    speciesDisplayName: 'Jade / Succulent',
    description: 'Drought-tolerant desert plant that prefers dry soil, low watering, and plenty of sunlight.',
    preferredMoisture: { min: 15, max: 40 },
    preferredTemp: { min: 18, max: 32 },
    preferredHumidity: { min: 30, max: 55 },
    preferredLight: { min: 650, max: 1000 },
    wateringThreshold: 20,
    autoWatering: false,
  },
  basil: {
    id: 'basil',
    name: 'Pesto',
    species: 'basil',
    speciesDisplayName: 'Sweet Basil',
    description: 'Fast-growing kitchen herb requiring consistently moist soil, lots of direct light, and mild warmth.',
    preferredMoisture: { min: 55, max: 80 },
    preferredTemp: { min: 20, max: 28 },
    preferredHumidity: { min: 45, max: 75 },
    preferredLight: { min: 600, max: 950 },
    wateringThreshold: 45,
    autoWatering: true,
  },
  snake_plant: {
    id: 'snake_plant',
    name: 'Zippy',
    species: 'snake_plant',
    speciesDisplayName: 'Snake Plant (Sansevieria)',
    description: 'Indestructible air-purifying plant that thrives in low light and very infrequent watering.',
    preferredMoisture: { min: 20, max: 50 },
    preferredTemp: { min: 16, max: 32 },
    preferredHumidity: { min: 30, max: 65 },
    preferredLight: { min: 250, max: 700 },
    wateringThreshold: 25,
    autoWatering: false,
  },
}

export const DEFAULT_PROFILE: PlantProfile = PLANT_PROFILES.monstera

