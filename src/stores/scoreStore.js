import { writable } from 'svelte/store'
import { analytics } from './analyticsStore'

const createScoreStore = () => {
  const { subscribe, set } = writable({})

  analytics.subscribe($analytics => {
    if (!$analytics.lastGame || $analytics.lastGame.status !== 'completed') {
      set({})
      return
    }

    set({
      ...$analytics.lastGame.scores,
      total: $analytics.lastGame.total,
    })
  })

  return {
    subscribe,
    set,
  }
}

export const scores = createScoreStore()