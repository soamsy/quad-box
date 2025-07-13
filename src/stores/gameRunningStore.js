import { derived, writable } from 'svelte/store'

export const isPlaying = writable(false)
const createGameInfo = () => {
  const { subscribe, set, update } = writable({})

  return {
    subscribe,
    set,
    update,
    getMaxWidth: () => {
      let max = 1
      let current
      gameInfo.subscribe(value => current = value)()
      if (current?.enablePositionWidthSequence && Array.isArray(current?.positionWidthSequence)) {
        max = Math.max(...current.positionWidthSequence)
      } else {
        max = current?.positionWidth ?? 1
      }
      return max
    },
    getNumberKeys: () => {
      const max = gameInfo.getMaxWidth()
      let keys = []
      for (let i = 0; i <= max; i++) {
        keys.push(i)
      }
      return keys
    }
  }
}

export const gameInfo = createGameInfo()
export const title = derived(gameInfo, ($gameInfo) => $gameInfo?.title ?? '')