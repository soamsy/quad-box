import { writable } from "svelte/store"

export const recentGamesState = writable({
  filter: 'completed',
})