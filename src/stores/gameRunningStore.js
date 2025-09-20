import { derived, writable, get } from 'svelte/store'

export const isPlaying = writable(false)
const createGameDisplayInfo = () => {
  const { subscribe, set, update } = writable({})

  return {
    subscribe,
    set,
    update,
    getMaxWidth: () => {
      let max = 1
      let current
      gameDisplayInfo.subscribe(value => current = value)()
      if (current?.enablePositionWidthSequence && Array.isArray(current?.positionWidthSequence)) {
        max = Math.max(...current.positionWidthSequence)
      } else {
        max = current?.positionWidth ?? 1
      }
      return max
    },
    getNumberKeys: () => {
      const current = get(gameDisplayInfo)
      let keys = []
      for (let i = 0; i <= (current?.tags?.length ?? 0); i++) {
        keys.push(i)
      }
      return keys
    }
  }
}

export const gameDisplayInfo = createGameDisplayInfo()
export const title = derived(gameDisplayInfo, ($gameInfo) => {
  if (!$gameInfo?.title) return ''

  if ($gameInfo.title.startsWith('tally ')) {
    return 'tally'
  } else if ($gameInfo.title.startsWith('vtally ')) {
    return 'vtally'
  }

  return $gameInfo.title
})