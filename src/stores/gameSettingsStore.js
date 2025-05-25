import { settings } from './settingsStore'
import { get } from 'svelte/store'
import { writable } from 'svelte/store'

export const gameSettings = (() => {
  const getGameSettings = () => get(settings).gameSettings[get(settings).mode]
  const internal = writable(getGameSettings())

  settings.subscribe($settings => {
    const current = $settings.gameSettings[$settings.mode]
    internal.set(current)
  })

  return {
    subscribe: internal.subscribe,
    set: () => {
      settings.update()
    },
    setField: (field, value) => {
      getGameSettings()[field] = value
      settings.update()
    }
  }
})()
