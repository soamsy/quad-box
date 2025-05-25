import { writable } from 'svelte/store'

export const mobile = writable(false)

export const setMobile = () => {
  mobile.update(() => window.innerWidth * 1.13 < window.innerHeight)
}
