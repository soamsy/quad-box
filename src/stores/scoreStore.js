import { writable } from 'svelte/store'
import { analytics } from './analyticsStore'

const createScoreStore = () => {
  const { subscribe, set } = writable({})

  analytics.subscribe($analytics => {
    if (!$analytics.lastGame || $analytics.lastGame.status !== 'completed') {
      set({})
      return
    }

    const game = $analytics.lastGame

    set({
      accuracy: game.hits / game.possible,
      speed: (game.timestamp - game.start) / 1000 / game.completedTrials,
    })
  })

  return {
    subscribe,
    set,
  }
}

export const scores = createScoreStore()