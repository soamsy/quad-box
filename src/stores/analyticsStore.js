import { writable } from 'svelte/store'
import { addGame, getLastRecentGame, getPlayTimeSince4AM  } from '../lib/gamedb'
import { formatSeconds } from '../lib/utils'

const loadAnalytics = async () => {
  const lastGame = await getLastRecentGame()
  const playTime = await getPlayTimeSince4AM()

  return {
    lastGame,
    playTime: playTime > 0 ? formatSeconds(playTime) : null,
  }
}

const createAnalyticsStore = () => {
  const { subscribe, set } = writable({})

  loadAnalytics().then(analytics => set(analytics))
  return {
    subscribe,
    scoreTrials: async (gameInfo, scoresheet, status) => {
      const scores = {}
      for (const tag of gameInfo.tags) {
        scores[tag] = { hits: 0, misses: 0 }
      }

      const hits = scoresheet.filter(answers => answers.success && answers.count > 0).length
      const possible = scoresheet.filter(answers => answers.count > 0 || ('success' in answers && answers.success === false)).length

      await addGame({
        ...gameInfo,
        hits,
        possible,
        completedTrials: scoresheet.length,
        status,
      })
      set(await loadAnalytics())
    }
  }
}

export const analytics = createAnalyticsStore()