import { Delaunay } from 'd3-delaunay'

const seededRandom = (seed) => {
  let m = 2 ** 31 - 1 // Large prime number
  let a = 48271       // Multiplier
  let c = 0           // Increment
  let state = seed % m

  return () => {
    state = (a * state + c) % m
    return state / m // Normalize to [0, 1)
  }
}

export const createVoronoiSvg = (seed, splits) => {
  let random = seededRandom(seed)
  const nextColor = () => {
    const hue = Math.floor(random() * 360)
    const saturation = Math.floor(30 + random() * 60)
    const lightness = Math.floor(20 + (random() * 70))

    return `hsl(${hue}, ${saturation}%, ${lightness}%)`
  }

  const generateVoronoiSvg = (id, splits) => {
    const width = 110
    const height = 110

    const points = Array.from({ length: splits }, () => [
      random() * width * 0.8 + width * 0.1,
      random() * height * 0.8 + height * 0.1
    ])

    const delaunay = Delaunay.from(points)
    const voronoi = delaunay.voronoi([0, 0, width, height])

    let svgContent = `<svg id="voronoi-${id}" width="${width}" height="${height}" class="voronoi" xmlns="http://www.w3.org/2000/svg">`

    for (let i = 0; i < splits; i++) {
      const path = voronoi.renderCell(i)
      const color = nextColor()
      svgContent += `<path d="${path}" fill="${color}" stroke="#000" stroke-width="0.5"/>`
    }

    svgContent += '</svg>'
    return svgContent
  }

  return generateVoronoiSvg(seed, splits)
}


export const createVoronoiPool = () => {
  const splitPool = [3, 3, 3, 4, 4, 5, 5, 6]
  const seedPool = []
  for (let i = 0; i < 16; i++) {
    let seed = Math.floor(Math.random() * 1000000000)
    while (seedPool.includes(seed)) {
      seed = Math.floor(Math.random() * 1000000000)
    }
    seedPool.push(seed)
  }
  const pool = []
  for (const seed of seedPool) {
    const split = splitPool[Math.floor(Math.random() * splitPool.length)]
    pool.push(`${seed}-${split}`)
  }
  return pool
}