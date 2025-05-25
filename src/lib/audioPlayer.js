import { ALL_AUDIO } from "./constants"

class AudioPlayer {
  constructor({ cache = true, volume = 1.0 } = {}) {
    this.cache = cache
    this.volume = volume
    this.audioCache = new Map()
    this.location = 'audio/'
  }

  preload(url) {
    if (this.cache && this.audioCache.has(url)) return
    if (!ALL_AUDIO.includes(url)) return

    const audio = new Audio(this.location + url)
    audio.volume = this.volume
    this.audioCache.set(url, audio)
  }

  play(url) {
    return new Promise((resolve, reject) => {
      if (!ALL_AUDIO.includes(url)) return

      let audio
      if (this.cache && this.audioCache.has(url)) {
        // Clone to allow overlapping playbacks
        const original = this.audioCache.get(url)
        audio = original.cloneNode(true)
      } else {
        audio = new Audio(this.location + url)
        audio.volume = this.volume
        if (this.cache) this.audioCache.set(url, audio)
      }

      audio.onended = resolve
      audio.onerror = reject

      audio.play().catch(reject)
    })
  }

  setVolume(value) {
    this.volume = value
  }

  clearCache() {
    this.audioCache.clear()
  }
}

export const audioPlayer = new AudioPlayer()
