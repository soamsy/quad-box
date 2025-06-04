import { writable } from 'svelte/store'

export const error = writable({
  message: '',
  stacktrace: '',
})
