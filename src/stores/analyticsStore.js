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

      for (const answers of scoresheet) {
        for (const tag of gameInfo.tags) {
          if (tag in answers) {
            if (answers[tag]) {
              scores[tag].hits++
            } else {
              scores[tag].misses++
            }
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
    },

    scoreTallyTrials: async (gameInfo, scoresheet, status) => {
      const scores = { tally: { hits: 0, misses: 0 } }

      scores.tally.hits = scoresheet.filter(answers => answers.success && answers.count > 0).length
      scores.tally.possible = scoresheet.filter(answers => answers.count > 0 || ('success' in answers && answers.success === false)).length

      await addGame({
        ...gameInfo,
        scores,
        completedTrials: scoresheet.length,
        status,
      })
      set(await loadAnalytics())
    }
  }
}

export const analytics = createAnalyticsStore()