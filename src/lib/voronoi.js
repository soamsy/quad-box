import { Delaunay } from 'd3-delaunay'
import { seededRandom } from './utils.js'

const seedSpace = 100000000
const divisions = 16
const partitionSize = seedSpace / divisions

export const createVoronoiSvg = (seed, splits, theme, padding=0) => {
  let random = seededRandom(seed)
  let colorId = 0
  let firstHue

  const range = (start, end) => {
    if (end === undefined) {
      end = start
      start = 0
    }
    return start + random() * (end - start)
  }

  const rollColor = () => {
    const hue = Math.floor(range(360))
    let lightness
    let saturation
    const roll = random()
    if (theme === 'dark') {
      const useDarkEnd = roll < 0.18
      const useLightEnd = roll > 0.90
      if (useDarkEnd) {
        saturation = range(3, 15)
        lightness = range(0, 30)
      } else if (useLightEnd) {
        saturation = range(80, 90)
        lightness = range(60, 80)
      } else {
        saturation = range(55, 95)
        lightness = range(20, 85)
      }
    } else {
      const useDarkEnd = roll < 0.15
      const useLightEnd = roll > 0.80
      if (useDarkEnd) {
        saturation = range(0, 12)
        lightness = range(3, 21)
      } else if (useLightEnd) {
        saturation = range(80, 90)
        lightness = range(90, 100)
      } else {
        saturation = range(58, 93)
        lightness = range(45, 80)
      }
    }

    return [hue, Math.floor(saturation), Math.floor(lightness)]
  }

  const nextColor = () => {
    let [hue, saturation, lightness] = rollColor()
    if (90 < hue && hue < 150 && (lightness < 50 || saturation < 40)) {
      [hue, saturation, lightness] = rollColor() // deprioritize greens
    }

    if (colorId === 0) {
      firstHue = 360 * seed / seedSpace
      hue = firstHue
    } else if (colorId === 1) {
      const diff = Math.abs(hue - firstHue)
      if (diff < 20 || diff > 340) {
        lightness = random() < 0.5 ? range(0, 2) : range(98, 100)
      }
    }
    colorId++

    return `hsl(${Math.floor(hue)}, ${Math.floor(saturation)}%, ${Math.floor(lightness)}%)`
  }

  const findPoints = (n) => {
    const points = []
    const useOneDimensionShifts = random() < 0.2
    const useBarStrips = random() < 0.25
    for (let i = 0; i < n; i++) {
      let point
      let isTooClose
      let attempts = 0
      do {
        point = [range(padding + 8, 400 - padding - 8), range(padding + 12, 400 - padding - 12)]
        if (useOneDimensionShifts && points.length > 0) {
          point = (useBarStrips || random() < 0.5) ? [points[points.length - 1][0], point[1]] : [point[0], points[points.length - 1][1]]
        }
        isTooClose = points.some(([x, y]) => {
          const dx = x - point[0]
          const dy = y - point[1]
          return Math.sqrt(dx * dx + dy * dy) < 30
        })
        attempts++
      } while (isTooClose && attempts < 100)
      points.push(point)
    }
    return points
  }

  const generateVoronoiSvg = (id, splits) => {
    const width = 400
    const height = 400

    const points = findPoints(splits)
    const delaunay = Delaunay.from(points)
    const voronoi = delaunay.voronoi([0, 0, width, height])

    let svgContent = ``
    for (let i = 0; i < splits; i++) {
      const path = voronoi.renderCell(i)
      const color = nextColor()
      svgContent += `<path d="${path}" fill="${color}" stroke="#000A" stroke-width="1"></path>`
    }
    return svgContent
  }

  return generateVoronoiSvg(seed, splits)
}


export const createVoronoiPool = () => {
  const splitPool = [3, 3, 3, 3, 4, 4, 4, 5, 5]
  const seedPool = []
  for (let i = 0; i < divisions; i++) {
    const start = i * partitionSize
    let seed = start + Math.floor(Math.random() * partitionSize)
    while (seedPool.includes(seed)) {
      seed = start + Math.floor(Math.random() * partitionSize)
    }
    seedPool.push(seed)
  }
  const pool = []
  for (const seed of seedPool) {
    const split = splitPool[Math.floor(Math.random() * splitPool.length)]
    pool.push(`voronoi_${seed}_${split}`)
  }
  return pool
}