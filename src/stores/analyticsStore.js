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
    addGame: async (trial) => {
      await addGame(trial)
      set(await loadAnalytics())
    },
  }
}

export const analytics = createAnalyticsStore()