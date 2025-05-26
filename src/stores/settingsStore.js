import { writable } from 'svelte/store'

const STORAGE_KEY = 'quad-box-settings'

const defaultSettings = {
  version: "v1",
  mode: 'quad',
  theme: 'dark',
  gameSettings: {
    quad: {
      nBack: 2,
      numTrials: 30,
      trialTime: 2500,
      matchChance: 25,
      interference: 20,
      enableAudio: true,
      enableShape: true,
      enableColor: true,
      enableShapeColor: false,
    },
    dual: {
      nBack: 2,
      numTrials: 30,
      trialTime: 2500,
      matchChance: 30,
      interference: 20,
      enableAudio: true,
      enableShape: false,
      enableColor: false,
      enableShapeColor: false,
    },
    custom: {
      nBack: 2,
      numTrials: 30,
      trialTime: 2500,
      matchChance: 25,
      interference: 20,
      enableAudio: true,
      enableShape: false,
      enableColor: true,
      enableShapeColor: false,
    }
  },
  feedback: 'show',
  rotationSpeed: 35,
  audioSource: 'letters',
}

const loadSettings = () => {
  if (typeof localStorage === 'undefined') return defaultSettings
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const savedSettings = raw ? JSON.parse(raw) : {}
    return { ...defaultSettings, ...savedSettings }
  } catch (e) {
    console.error('Failed to load settings from localStorage:', e)
    return defaultSettings
  }
}

const saveSettings = (settings) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  } catch (e) {
    console.error('Failed to save settings to localStorage:', e)
  }
}

const createSettingsStore = () => {
  const { subscribe, get, set, update } = writable(loadSettings())

  return {
    subscribe,
    get,
    set: (value) => {
      saveSettings(value)
      set(value)
    },
    update: (key, value) => {
      update(current => {
        const updated = { ...current, [key]: value }
        saveSettings(updated)
        return updated
      })
    },
    reset: () => {
      set(defaultSettings)
      saveSettings(defaultSettings)
    }
  }
}

export const settings = createSettingsStore()