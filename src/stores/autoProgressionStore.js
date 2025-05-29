import { writable } from 'svelte/store'


const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const repeat = async (n, fn) => {
  for (let i = 0; i < n; i++) {
    await fn()
  }
}

const createAutoProgressionStore = () => {
  const autoProgression = writable({ advance: false, fallback: false })

  return {
    ...autoProgression,
    advance: async () => {
      await repeat(4, async () => {
        autoProgression.set({ advance: true, fallback: false })
        await delay(500)
        autoProgression.set({ advance: false, fallback: false })
        await delay(500)
      })
    },
    fallback: async () => {
      await repeat(4, async () => {
        autoProgression.set({ advance: false, fallback: true })
        await delay(500)
        autoProgression.set({ advance: false, fallback: false })
        await delay(500)
      })
    },
    clear: () => {
      autoProgression.set({ advance: false, fallback: false })
    }
  }
}

export const autoProgression = createAutoProgressionStore()