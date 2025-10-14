import { writable } from 'svelte/store'
import { migrateSettings } from '../migrations/migrations'

const STORAGE_KEY = 'quad-box-settings'

const defaultSettings = {
  version: "v3",
  mode: 'quad',
  theme: 'dark',
  gameSettings: {
    quad: {
      nBack: 2,
      numTrials: 35,
      trialTime: 2500,
      matchChance: 25,
      interference: 20,
      enableAudio: true,
      enableShape: true,
      enableColor: true,
      enableImage: false,
      grid: 'rotate3D',
      rules: 'none',
      audioSource: 'letters2',
      colorSource: 'basic',
      shapeSource: 'basic',
      imageSource: 'voronoi',
    },
    dual: {
      nBack: 2,
      numTrials: 35,
      trialTime: 2500,
      matchChance: 30,
      interference: 20,
      enableAudio: true,
      enableShape: false,
      enableColor: false,
      enableImage: false,
      grid: 'rotate3D',
      rules: 'none',
      audioSource: 'letters2',
      colorSource: 'basic',
      shapeSource: 'basic',
      imageSource: 'voronoi',
    },
    custom: {
      nBack: 2,
      numTrials: 40,
      trialTime: 2500,
      matchChance: 25,
      interference: 20,
      enableAudio: true,
      enableShape: false,
      enableColor: true,
      enableImage: false,
      grid: 'rotate3D',
      rules: 'none',
      audioSource: 'letters2',
      colorSource: 'basic',
      shapeSource: 'basic',
      imageSource: 'voronoi',
    },
    customB: {
      nBack: 2,
      numTrials: 40,
      trialTime: 2500,
      matchChance: 25,
      interference: 20,
      enableAudio: true,
      enableShape: false,
      enableColor: false,
      enableImage: true,
      grid: 'rotate3D',
      rules: 'none',
      audioSource: 'letters2',
      colorSource: 'voronoi',
      shapeSource: 'basic',
      imageSource: 'generative',
    },
    tally: {
      nBack: 2,
      numTrials: 60,
      matchChance: 25,
      interference: 20,
      positionWidth: 2,
      enablePositionWidthSequence: false,
      positionWidthSequence: [2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      enableAudio: false,
      enableShape: false,
      enableColor: false,
      enableImage: false,
      grid: 'rotate3D',
      rules: 'tally',
      audioSource: 'letters2',
      colorSource: 'basic',
      shapeSource: 'basic',
      imageSource: 'voronoi',
    },
    vtally: {
      nBack: 2,
      numTrials: 60,
      matchChance: 25,
      interference: 20,
      positionWidth: 2,
      enablePositionWidthSequence: false,
      positionWidthSequence: [2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      enableShape: false,
      enableColor: false,
      enableImage: true,
      grid: 'rotate3D',
      rules: 'vtally',
      audioSource: 'letters2',
      colorSource: 'basic',
      shapeSource: 'basic',
      imageSource: 'generative',
    },
  },
  feedback: 'show',
  rotationSpeed: 35,
  enableAutoProgression: true,
  successCriteria: 80,
  successComboRequired: 1,
  failureCriteria: 50,
  failureComboRequired: 3,
  hotkeys: {
    'position': 'A',
    'color': 'F',
    'shape': 'J',
    'audio': 'L',
  },
  enabledModes: ['quad', 'dual', 'custom'],
}

const getDefaultSettings = () => structuredClone(defaultSettings)

const isPlainObject = obj => Object.prototype.toString.call(obj) === '[object Object]'

const deepMerge = (target, source) => {
  if (Array.isArray(target) && Array.isArray(source)) {
    return source.map((item, i) =>
      i in target ? deepMerge(target[i], item) : item
    )
  }

  if (isPlainObject(target) && isPlainObject(source)) {
    const result = { ...target }
    for (const key of Object.keys(source)) {
      if (key === '__proto__' || key === 'constructor') continue
      result[key] =
        key in target ? deepMerge(target[key], source[key]) : source[key]
    }
    return result
  }

  return Array.isArray(source) ? source.slice() : source
}

const loadSettings = () => {
  if (typeof localStorage === 'undefined') return getDefaultSettings()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    let savedSettings = raw ? JSON.parse(raw) : {}
    savedSettings = migrateSettings(savedSettings)
    return deepMerge(getDefaultSettings(), savedSettings)
  } catch (e) {
    console.error('Failed to load settings from localStorage:', e)
    return getDefaultSettings()
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
  const loadedSettings = loadSettings()
  const { subscribe, get, set, update } = writable(loadedSettings)

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
      set(getDefaultSettings())
      saveSettings(getDefaultSettings())
    }
  }
}

export const settings = createSettingsStore()