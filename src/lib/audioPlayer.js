import { Howl } from "howler"
import { getAudioPool } from "./constants"

class AudioPlayer {
  constructor() {
    this.audioCache = new Map()
    this.location = 'audio/'
  }

  createHowl(url) {
    const prefix = this.location + url
    const isIOS = /iP(ad|hone|od)/.test(navigator.userAgent)
    return new Howl({
      src: [prefix + '.opus', prefix + '.mp3'],
      volume: 1.0,
      html5: isIOS,
    })
  }

  preload(url) {
    if (this.audioCache.has(url)) return
    this.audioCache.set(url, this.createHowl(url))
  }

  async play(url) {
    let howl
    if (this.audioCache.has(url)) {
      howl = this.audioCache.get(url)
    } else {
      howl = this.createHowl(url)
      this.audioCache.set(url, howl)
    }
    await this.playSoundAsync(howl)
  }

  async playSoundAsync(howl) {
    return new Promise((resolve, reject) => {
      const id = howl.play()
      if (id == null) return reject(new Error("Failed to play sound"))

      howl.once('end', resolve, id)
      howl.once('loaderror', reject, id)
      howl.once('playerror', reject, id)
    })
  }

  cacheAudioSource(audioSource) {
    getAudioPool(audioSource).forEach(audio => {
      this.preload(audio)
    })
  }

  clearCache() {
    this.audioCache.clear()
  }
}

export const audioPlayer = new AudioPlayer()
