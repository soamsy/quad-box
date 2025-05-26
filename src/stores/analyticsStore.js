import { writable } from 'svelte/store'
import { addGame, getLastNGames, getPlayTimeSince4AM  } from '../lib/gamedb'
import { formatSeconds } from '../lib/utils'

const loadAnalytics = async () => {
  const recentGames = await getLastNGames(10)
  const playTime = await getPlayTimeSince4AM()

  return {
    recentGames,
    playTime: formatSeconds(playTime),
  }
}

const createAnalyticsStore = () => {
  const { subscribe, set } = writable({recentGames: [], playTime: 0})

  loadAnalytics().then(analytics => set(analytics))
  return {
    subscribe,
    scoreTrials: async (gameInfo, scoresheet, status) => {
      const scores = {}
      for (const tag of gameInfo.tags) {
        scores[tag] = { hits: 0, misses: 0 }
      }

      for (const answers of scoresheet) {
        for (const tag of gameInfo.tags) {
          if (answers[tag]) {
            scores[tag].hits++
          } else {
            scores[tag].misses++
          }
        }
      }

      await addGame({
        ...gameInfo,
        scores,
        completedTrials: scoresheet.length,
        status
      })
      set(await loadAnalytics())
    }
  }
}

export const analytics = createAnalyticsStore()