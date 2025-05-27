import { writable } from 'svelte/store'
import { addGame, getLastNGames, getPlayTimeSince4AM  } from '../lib/gamedb'
import { formatSeconds } from '../lib/utils'

const findTotalScore = (game) => {
  let total = 0
  let possible = 0
  for (const score of Object.values(game.scores)) {
    total += score.hits
    possible += score.hits + score.misses
  }
  return total > 0 ? total / possible : 0
}

const loadAnalytics = async () => {
  const lastGameList = await getLastNGames(1)
  const lastGame = lastGameList?.[0]
  const playTime = await getPlayTimeSince4AM()

  const score = lastGame ? findTotalScore(lastGame) : null
  const lastTotalScore = score ?? Math.round(score * 100).toFixed(0)

  return {
    lastGame,
    lastTotalScore,
    playTime: formatSeconds(playTime),
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

      console.log(scoresheet)
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
    }
  }
}

export const analytics = createAnalyticsStore()