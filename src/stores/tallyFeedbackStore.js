import { get, writable } from 'svelte/store'
import { gameSettings } from './gameSettingsStore'
import { settings } from './settingsStore'

const createFeedbackStore = () => {
  const defaultFeedback = {
    0: 'blank',
    1: 'blank',
    2: 'blank',
    3: 'blank',
    4: 'blank',
    5: 'blank',
    6: 'blank',
    7: 'blank',
    8: 'blank',
    9: 'blank',
  }

  const updateDefaultFeedback = () => {
    defaultFeedback[0] = 'blank'
    defaultFeedback[1] = 'blank'
    defaultFeedback[2] = 'blank'
    defaultFeedback[3] = 'blank'
    defaultFeedback[4] = 'blank'
    defaultFeedback[5] = 'blank'
    defaultFeedback[6] = 'blank'
    defaultFeedback[7] = 'blank'
    defaultFeedback[8] = 'blank'
    defaultFeedback[9] = 'blank'
  }

  updateDefaultFeedback()

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

    const currentTimeout = setTimeout(() => {
      feedbackStore.update((current) => {
        let updates = {}
        for (const key in current) {
          updates[key] = defaultFeedback[key]
        }
        return {
          ...current,
          ...updates,
        }
      })
    }, 2000)
    timeouts.push(currentTimeout)
  }

  return {
    ...feedbackStore,
    reset,
    apply,
  }
}


export const tallyFeedback = createFeedbackStore()

