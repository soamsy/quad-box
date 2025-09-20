import { get, writable } from 'svelte/store'
import { gameSettings } from './gameSettingsStore'
import { settings } from './settingsStore'

const createFeedbackStore = () => {
  const defaultFeedback = {
    position: 'blank',
    color: 'blank',
    shape: 'blank',
    image: 'blank',
    audio: 'blank',
  }

  const updateDefaultFeedback = ($gameSettings) => {
    defaultFeedback.position = 'blank'
    defaultFeedback.color = $gameSettings.enableColor ? 'blank' : 'disabled'
    defaultFeedback.shape = $gameSettings.enableShape ? 'blank' : 'disabled'
    defaultFeedback.image = $gameSettings.enableImage ? 'blank' : 'disabled'
    defaultFeedback.audio = $gameSettings.enableAudio ? 'blank' : 'disabled'
  }

  updateDefaultFeedback(get(gameSettings))

  const feedbackStore = writable(defaultFeedback)

  gameSettings.subscribe(($gameSettings) => {
    updateDefaultFeedback($gameSettings)
    feedbackStore.update((current) => {
      const updates = {}
      for (const key in defaultFeedback) {
        if (['blank', 'disabled'].includes(current[key]) && key in defaultFeedback) {
          updates[key] = defaultFeedback[key]
        }
      }
      return {
        ...current,
        ...updates,
      }
    })
  })

  let timeouts = []
  const reset = () => {
    feedbackStore.set(defaultFeedback)
    timeouts.forEach(timeout => clearTimeout(timeout))
    timeouts = []
  }

  let hideFeedback = get(settings).feedback === 'hide'
  settings.subscribe($settings => {
    hideFeedback = $settings.feedback === 'hide'
    reset()
  })

  const apply = (updates) => {
    if (hideFeedback) {
      return
    }

    feedbackStore.update((current) => {
      return {
        ...current,
        ...updates,
      }
    })

    if (Object.values(updates).includes('late-failure')) {
      const currentTimeout = setTimeout(() => {
        feedbackStore.update((current) => {
          let updates = {}
          for (const key in current) {
            if (current[key] === 'late-failure') {
              updates[key] = defaultFeedback[key]
            }
          }
          return {
            ...current,
            ...updates,
          }
        })
      }, 500)
      timeouts.push(currentTimeout)
    }
  }

  return {
    ...feedbackStore,
    reset,
    apply,
  }
}


export const feedback = createFeedbackStore()

