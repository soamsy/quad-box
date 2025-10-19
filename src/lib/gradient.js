import { seededRandom } from './utils.js'

const seedSpace = 100000000
const divisions = 16
const partitionSize = seedSpace / divisions

export const createGradient = (gradientId, theme) => {
  const seed = parseInt(gradientId.replace('gradient_', ''))
  let random = seededRandom(seed)
  let colorId = 0
  let firstHue
  let secondHue

  const range = (start, end) => {
    if (end === undefined) {
      end = start
      start = 0
    }
    return start + Math.round(random() * (end - start))
  }

  const rollColor = () => {
    const hue = Math.floor(range(360))
    let lightness
    let saturation
    const roll = random()
    if (theme === 'dark') {
      const useDarkEnd = roll < 0.10
      const useLightEnd = roll > 0.90
      if (useDarkEnd) {
        saturation = range(3, 15)
        lightness = range(3, 30)
      } else if (useLightEnd) {
        saturation = range(80, 90)
        lightness = range(60, 80)
      } else {
        saturation = range(65, 95)
        lightness = range(20, 85)
      }
    } else {
      const useDarkEnd = roll < 0.10
      const useLightEnd = roll > 0.90
      if (useDarkEnd) {
        saturation = range(5, 17)
        lightness = range(3, 21)
      } else if (useLightEnd) {
        saturation = range(80, 90)
        lightness = range(80, 90)
      } else {
        saturation = range(75, 95)
        lightness = range(35, 70)
      }
    }

    return [hue, Math.floor(saturation), Math.floor(lightness)]
  }

  const nextColor = () => {
    let [hue, saturation, lightness] = rollColor()
    if (90 < hue && hue < 150 && (lightness < 50 || saturation < 40)) {
      [hue, saturation, lightness] = rollColor()
    }

    if (colorId === 0) {
      firstHue = 360 * seed / seedSpace
      hue = firstHue
    } else if (colorId === 1) {
      for (let i = 0; i < 10; i++) {
        const diff = Math.abs(hue - firstHue)
        if (50 < diff && diff < 310) {
          break
        }
        [hue, saturation, lightness] = rollColor()
      }
      secondHue = hue
    } else if (colorId === 2) {
      for (let i = 0; i < 10; i++) {
        const diff = Math.abs(hue - secondHue)
        if (50 < diff && diff < 310) {
          break
        }
        [hue, saturation, lightness] = rollColor()
      }
    }
    colorId++

    return `hsl(${Math.floor(hue)}, ${Math.floor(saturation)}%, ${Math.floor(lightness)}%)`
  }

  let stopOffsets
  if (random() < 0.3) {
    stopOffsets = `
        <stop offset="0%"  stop-color="${nextColor()}"/>
        <stop offset="33%" stop-color="${nextColor()}"/>
        <stop offset="66%" stop-color="${nextColor()}"/>
        <stop offset="100%" stop-color="${nextColor()}"/>
    `.trim()
  } else {
    stopOffsets = `
        <stop offset="0%"  stop-color="${nextColor()}"/>
        <stop offset="50%" stop-color="${nextColor()}"/>
        <stop offset="100%" stop-color="${nextColor()}"/>
    `.trim()
  }

  const vertical = `<linearGradient id="${gradientId}" x1="0%" y1="0%" x2="0%" y2="100%">${stopOffsets}</linearGradient>`
  const horizontal = `<linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="0%">${stopOffsets}</linearGradient>`
  const radial = `<radialGradient id="${gradientId}" cx="50%" cy="50%" r="50%">${stopOffsets}</radialGradient>`
  const diagonal = `<linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="100%">${stopOffsets}</linearGradient>`
  let pool = [vertical, horizontal, radial, diagonal]
  return pool[Math.floor(random() * pool.length)]
}

export const createGradientPool = () => {
  const seedPool = []
  for (let i = 0; i < divisions; i++) {
    const start = i * partitionSize
    let seed = start + Math.floor(Math.random() * partitionSize)
    while (seedPool.includes(seed)) {
      seed = start + Math.floor(Math.random() * partitionSize)
    }
    seedPool.push(seed)
  }
  return seedPool.map(s => 'gradient_' + Math.floor(s).toString())
}