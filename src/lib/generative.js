import { line, curveBasis, curveCardinal, curveCatmullRom, curveMonotoneX, curveNatural } from 'd3-shape'
import { seededRandom } from './utils.js'

const seedSpace = 100000000
const divisions = 16
const partitionSize = seedSpace / divisions

const curveTypes = [
  curveBasis,
  curveCardinal,
  curveCatmullRom,
  curveMonotoneX,
  curveNatural
]

const repeat = (value, times) => {
  return Array(times).fill(value)
}

const generateOrganicShape = (random, centerX, centerY, radius, points = 8) => {
  const angleStep = (Math.PI * 2) / points
  const vertices = []

  for (let i = 0; i < points; i++) {
    const angle = i * angleStep
    const variance = 0.7 + random() * 0.6
    const r = radius * variance
    const x = centerX + Math.cos(angle) * r
    const y = centerY + Math.sin(angle) * r
    vertices.push([x, y])
  }

  vertices.push(vertices[0])

  const curveType = curveTypes[Math.floor(random() * curveTypes.length)]

  const lineGenerator = line()
    .x(d => d[0])
    .y(d => d[1])
    .curve(curveType)

  return lineGenerator(vertices)
}

const generateCube = (random, centerX, centerY, size) => {
  const depth = size * (0.3 + random() * 0.4)
  const angle = Math.PI / 6

  const front = [
    [centerX - size / 2, centerY - size / 2],
    [centerX + size / 2, centerY - size / 2],
    [centerX + size / 2, centerY + size / 2],
    [centerX - size / 2, centerY + size / 2],
    [centerX - size / 2, centerY - size / 2]
  ]

  const shiftX = depth * Math.cos(angle) * (random() < 0.5 ? 1 : -1)
  const shiftY = depth * Math.sin(angle)
  const back = [
    [centerX - size / 2 + shiftX, centerY - size / 2 - shiftY],
    [centerX + size / 2 + shiftX, centerY - size / 2 - shiftY],
    [centerX + size / 2 + shiftX, centerY + size / 2 - shiftY],
    [centerX - size / 2 + shiftX, centerY + size / 2 - shiftY],
    [centerX - size / 2 + shiftX, centerY - size / 2 - shiftY]
  ]

  const left = [
    front[0],
    back[0],
    back[3],
    front[3],
    front[0]
  ]

  const right = [
    front[1],
    back[1],
    back[2],
    front[2],
    front[1]
  ]

  const top = [
    front[0],
    back[0],
    back[1],
    front[1],
    front[0]
  ]

  const connectors = [
    [[front[0][0], front[0][1]], [back[0][0], back[0][1]]],
    [[front[1][0], front[1][1]], [back[1][0], back[1][1]]],
    [[front[2][0], front[2][1]], [back[2][0], back[2][1]]],
  ]

  return { front, back, left, right, top, connectors }
}


const generateSpiral = (random, centerX, centerY, turns = 5) => {
  const points = []
  const angleStep = 0.1
  const maxAngle = turns * Math.PI * 2
  const a = 15 + random() * 75
  const b = 0.9 + random() * 2.3

  for (let angle = 0; angle < maxAngle; angle += angleStep) {
    const r = a + b * angle
    const x = centerX + r * Math.cos(angle)
    const y = centerY + r * Math.sin(angle)
    points.push([x, y])
  }

  const curveType = curveTypes[Math.floor(random() * curveTypes.length)]
  const lineGenerator = line()
    .x(d => d[0])
    .y(d => d[1])
    .curve(curveType)

  return lineGenerator(points)
}


const generateSquigglePattern = (random, range, width, height, waveCount = 5) => {
  const points = []

  const fixed = [
    [[0, 0], [width, height]],
    [[0, 0], [width, height / 2]],
    [[0, 0], [width / 2, height]],
    [[width / 2, 0], [width / 2, height]],
    [[width / 2, 0], [0, height]],
    [[width / 2, 0], [width, height]],
    [[width, 0], [width / 2, height]],
    [[width, 0], [0, height]],
    [[width, 0], [0, height / 2]],
    [[0, height / 2], [width, 0]],
    [[0, height / 2], [width, height / 2]],
    [[0, height / 2], [width, height]],
  ]
  let [start, end] = fixed[Math.floor(random() * fixed.length)]
  if ((start[0] === 0 || start[0] === width)) {
    start[1] = range(0, height)
  }
  if ((start[1] === 0 || start[1] === height)) {
    start[0] = range(0, width)
  }
  if ((end[0] === 0 || end[0] === width)) {
    end[1] = range(0, height)
  }
  if ((end[1] === 0 || end[1] === height)) {
    end[0] = range(0, width)
  }
  points.push(start)

  let [startX, startY] = start
  let [endX, endY] = end
  const xDistance = endX - startX
  const yDistance = endY - startY

  const useWiggles = random() < 0.5
  for (let i = 1; i < 20; i++) {
    const amplitude = random() * (height / 16)
    let x = (i / 20) * xDistance + startX
    let y = (i / 20) * yDistance + startY
    if (random() < 0.2 && useWiggles) {
      x += Math.cos((i / 20) * Math.PI * waveCount) * amplitude
      y += Math.sin((i / 20) * Math.PI * waveCount) * amplitude
    }
    points.push([x, y])
  }

  points.push(end)

  const curveType = curveTypes[Math.floor(random() * curveTypes.length)]
  const lineGenerator = line()
    .x(d => d[0])
    .y(d => d[1])
    .curve(curveType)

  return lineGenerator(points)
}
const generatePolygon = (random, centerX, centerY, radius, sides) => {
  const points = []
  for (let i = 0; i < sides; i++) {
    const angle = (i * 2 * Math.PI) / sides - Math.PI / 2
    const x = centerX + radius * Math.cos(angle)
    const y = centerY + radius * Math.sin(angle)
    points.push([x, y])
  }
  points.push(points[0])
  return points
}
const generateStar = (random, centerX, centerY, outerRadius, innerRadius, points) => {
  const vertices = []
  for (let i = 0; i < points * 2; i++) {
    const angle = (i * Math.PI) / points - Math.PI / 2
    const radius = i % 2 === 0 ? outerRadius : innerRadius
    const x = centerX + radius * Math.cos(angle)
    const y = centerY + radius * Math.sin(angle)
    vertices.push([x, y])
  }
  vertices.push(vertices[0])
  return vertices
}
const generatePyramid = (random, centerX, centerY, size) => {
  const height = size * (0.8 + random() * 0.4)
  const depth = size * (0.3 + random() * 0.4)
  const angle = Math.PI / 6
  const base = [
    [centerX - size / 2, centerY + size / 4],
    [centerX + size / 2, centerY + size / 4],
    [centerX + size / 2, centerY + size / 4 + size / 2],
    [centerX - size / 2, centerY + size / 4 + size / 2],
    [centerX - size / 2, centerY + size / 4]
  ]
  const apexX = centerX + (random() < 0.5 ? 1 : -1) * depth * Math.cos(angle)
  const apexY = centerY - height
  const apex = [apexX, apexY]
  const face1 = [base[0], base[1], apex, base[0]]
  const face2 = [base[1], base[2], apex, base[1]]
  const face3 = [base[2], base[3], apex, base[2]]
  const face4 = [base[3], base[0], apex, base[3]]

  return { base, face1, face2, face3, face4, apex }
}
const generateCylinder = (random, centerX, centerY, radius, height) => {
  const segments = 8
  const top = []
  const bottom = []

  for (let i = 0; i <= segments; i++) {
    const angle = (i * 2 * Math.PI) / segments
    const topX = centerX + radius * Math.cos(angle)
    const topY = centerY - height / 2
    const bottomX = centerX + radius * Math.cos(angle) * 0.8
    const bottomY = centerY + height / 2

    top.push([topX, topY])
    bottom.push([bottomX, bottomY])
  }
  const sides = []
  for (let i = 0; i < segments; i++) {
    sides.push([
      top[i], top[i+1], bottom[i+1], bottom[i], top[i]
    ])
  }

  return { top, bottom, sides }
}
const generateTexture = (random, x, y, width, height) => {
  const elements = []
  const type = Math.floor(random() * 3)

  if (type === 0) {
    const spacing = 5 + random() * 10
    for (let i = 0; i < width; i += spacing) {
      elements.push(`<line x1="${x + i}" y1="${y}" x2="${x + i - height}" y2="${y + height}" stroke="black" stroke-width="0.5" />`)
    }
  } else if (type === 1) {
    const spacing = 5 + random() * 10
    for (let i = 0; i < width; i += spacing) {
      elements.push(`<line x1="${x + i}" y1="${y}" x2="${x + i - height}" y2="${y + height}" stroke="black" stroke-width="0.5" />`)
    }
    for (let i = 0; i < width; i += spacing) {
      elements.push(`<line x1="${x + i}" y1="${y + height}" x2="${x + i + height}" y2="${y}" stroke="black" stroke-width="0.5" />`)
    }
  } else {
    const dotSpacing = 3 + random() * 7
    for (let i = 0; i < width; i += dotSpacing) {
      for (let j = 0; j < height; j += dotSpacing) {
        if (random() > 0.3) {
          elements.push(`<circle cx="${x + i}" cy="${y + j}" r="0.5" fill="black" />`)
        }
      }
    }
  }

  return elements
}
const generateFractal = (random, centerX, centerY, size, depth = 3) => {
  if (depth === 0) {
    return []
  }

  const elements = []
  const newSize = size * (0.4 + random() * 0.3)
  if (random() < 0.5) {
    elements.push(`<circle cx="${centerX}" cy="${centerY}" r="${newSize/2}" fill="none" stroke="black" stroke-width="1" />`)
  } else {
    elements.push(`<rect x="${centerX - newSize/2}" y="${centerY - newSize/2}" width="${newSize}" height="${newSize}" fill="none" stroke="black" stroke-width="1" />`)
  }
  const branches = 2 + Math.floor(random() * 4)
  for (let i = 0; i < branches; i++) {
    const angle = (i * 2 * Math.PI) / branches
    const distance = size * (0.6 + random() * 0.3)
    const newX = centerX + distance * Math.cos(angle)
    const newY = centerY + distance * Math.sin(angle)

    elements.push(...generateFractal(random, newX, newY, newSize * 0.7, depth - 1))
  }

  return elements
}

export const createArtSvg = (seed, theme, width = 400, height = 400) => {
  let random = seededRandom(seed)
  let colorId = 0
  let firstHue

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
        saturation = range(5, 17)
        lightness = range(3, 21)
      } else if (useLightEnd) {
        saturation = range(80, 90)
        lightness = range(80, 90)
      } else {
        saturation = range(63, 95)
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
      const diff = Math.abs(hue - firstHue)
      if (diff < 20 || diff > 340) {
        lightness = random() < 0.5 ? range(0, 2) : range(98, 100)
      }
    }
    colorId++

    return `hsl(${Math.floor(hue)}, ${Math.floor(saturation)}%, ${Math.floor(lightness)}%)`
  }

  const organicElement = () => {
    const centerX = range(28, width - 28)
    const centerY = range(28, height - 28)
    const radius = range(40, Math.min(width, height) / 2)
    const path = generateOrganicShape(random, centerX, centerY, radius)
    const opacity = 0.7 + random() * 0.3
    return [`<path d="${path}" fill="${nextColor()}" fill-opacity="${opacity}" />`, `<path d="${path}" fill="${nextColor()}" fill-opacity="${opacity}" />`]
  }

  const cubeElement = () => {
    const centerX = range(50, width - 50)
    const centerY = range(50, height - 50)
    const size = range(30, Math.min(width, height) / 2)
    const cube = generateCube(random, centerX, centerY, size)
    const faceColor = nextColor()
    const darkFaceColor = random() < 0.5 ? nextColor() : faceColor
    const topFaceColor = random() < 0.5 ? nextColor() : faceColor
    const edgeColor = nextColor()
    const paths = []
    paths.push(`<path d="M${cube.back.map(p => p.join(',')).join(' L')} Z" fill="${faceColor}" fill-opacity="0.6" />`)
    paths.push(`<path d="M${cube.left.map(p => p.join(',')).join(' L')} Z" fill="${nextColor()}" stroke="${edgeColor}" stroke-width="1" />`)
    paths.push(`<path d="M${cube.right.map(p => p.join(',')).join(' L')} Z" fill="${darkFaceColor}" stroke="${edgeColor}" stroke-width="1" />`)
    paths.push(`<path d="M${cube.top.map(p => p.join(',')).join(' L')} Z" fill="${topFaceColor}" stroke="${edgeColor}" stroke-width="1" />`)
    cube.connectors.forEach(connector => {
      paths.push(`<line x1="${connector[0][0]}" y1="${connector[0][1]}" x2="${connector[1][0]}" y2="${connector[1][1]}" stroke="${edgeColor}" stroke-width="1" />`)
    })
    paths.push(`<path d="M${cube.front.map(p => p.join(',')).join(' L')} Z" fill="${faceColor}" stroke="${edgeColor}" stroke-width="1" />`)
    return paths
  }

  const spiralElement = () => {
    const centerX = range(100, width - 100)
    const centerY = range(100, height - 100)
    const turns = 3 + Math.floor(random() * 5)
    const path = generateSpiral(random, centerX, centerY, turns)
    const color = nextColor()
    const strokeWidth = 3 + random() * 5

    return [`<path d="${path}" fill="none" stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="round" />`]
  }

  const squiggleElement = () => {
    const path = generateSquigglePattern(random, range, width, height)
    const color = nextColor()
    const strokeWidth = 10 + random() * 30

    return [`<path d="${path}" fill="none" stroke="${color}" stroke-width="${strokeWidth}" />`]
  }

  const dotElement = () => {
    const x = random() * width
    const y = random() * height
    const radius = 20 + random() * 32.5
    const color = nextColor()
    const opacity = 0.3 + random() * 0.7
    return [`<circle cx="${x}" cy="${y}" r="${radius}" fill="${color}" fill-opacity="${opacity}" />`]
  }

  const polygonElement = () => {
    const centerX = range(28, width - 28)
    const centerY = range(28, height - 28)
    const radius = range(20, Math.min(width, height) / 3)
    const sides = 3 + Math.floor(random() * 7)
    const points = generatePolygon(random, centerX, centerY, radius, sides)

    const lineGenerator = line()
      .x(d => d[0])
      .y(d => d[1])

    const path = lineGenerator(points)
    const color = nextColor()
    const opacity = 0.4 + random() * 0.6
    const strokeWidth = 1 + random() * 3

    return [`<path d="${path}" fill="${color}" fill-opacity="${opacity}" stroke="${nextColor()}" stroke-width="${strokeWidth}" />`]
  }

  const starElement = () => {
    const centerX = range(28, width - 28)
    const centerY = range(28, height - 28)
    const outerRadius = range(20, Math.min(width, height) / 3)
    const innerRadius = outerRadius * (0.3 + random() * 0.3)
    const points = range(5, 10)
    const vertices = generateStar(random, centerX, centerY, outerRadius, innerRadius, points)

    const lineGenerator = line()
      .x(d => d[0])
      .y(d => d[1])

    const path = lineGenerator(vertices)
    const color = nextColor()
    const opacity = 0.5 + random() * 0.5

    return [`<path d="${path}" fill="${color}" fill-opacity="${opacity}" />`]
  }

  const pyramidElement = () => {
    const centerX = range(50, width - 50)
    const centerY = range(50, height - 50)
    const size = range(30, Math.min(width, height) / 3)
    const pyramid = generatePyramid(random, centerX, centerY, size)

    const faceColor = nextColor()
    const darkFaceColor = nextColor()
    const baseColor = nextColor()
    const edgeColor = nextColor()

    const paths = []
    paths.push(`<path d="M${pyramid.base.map(p => p.join(',')).join(' L')} Z" fill="${baseColor}" stroke="${edgeColor}" stroke-width="1" />`)
    paths.push(`<path d="M${pyramid.face1.map(p => p.join(',')).join(' L')} Z" fill="${faceColor}" stroke="${edgeColor}" stroke-width="1" fill-opacity="0.8" />`)
    paths.push(`<path d="M${pyramid.face2.map(p => p.join(',')).join(' L')} Z" fill="${darkFaceColor}" stroke="${edgeColor}" stroke-width="1" fill-opacity="0.8" />`)
    paths.push(`<path d="M${pyramid.face3.map(p => p.join(',')).join(' L')} Z" fill="${faceColor}" stroke="${edgeColor}" stroke-width="1" fill-opacity="0.8" />`)
    paths.push(`<path d="M${pyramid.face4.map(p => p.join(',')).join(' L')} Z" fill="${darkFaceColor}" stroke="${edgeColor}" stroke-width="1" fill-opacity="0.8" />`)

    return paths
  }

  const cylinderElement = () => {
    const centerX = range(50, width - 50)
    const centerY = range(50, height - 50)
    const radius = range(20, Math.min(width, height) / 4)
    const heightVal = range(40, Math.min(width, height) / 2)
    const cylinder = generateCylinder(random, centerX, centerY, radius, heightVal)

    const topColor = nextColor()
    const sideColor = nextColor()
    const edgeColor = nextColor()

    const elements = []
    elements.push(`<path d="M${cylinder.top.map(p => p.join(',')).join(' L')} Z" fill="${topColor}" stroke="${edgeColor}" stroke-width="1" fill-opacity="0.7" />`)
    elements.push(`<path d="M${cylinder.bottom.map(p => p.join(',')).join(' L')} Z" fill="${topColor}" stroke="${edgeColor}" stroke-width="1" fill-opacity="0.9" />`)
    cylinder.sides.forEach(side => {
      elements.push(`<path d="M${side.map(p => p.join(',')).join(' L')} Z" fill="${sideColor}" stroke="${edgeColor}" stroke-width="1" fill-opacity="0.8" />`)
    })

    return elements
  }

  const textureElement = () => {
    const x = range(0, width - 100)
    const y = range(0, height - 100)
    const texWidth = range(50, 100)
    const texHeight = range(50, 100)
    const elements = generateTexture(random, x, y, texWidth, texHeight)
    return elements
  }

  const fractalElement = () => {
    const centerX = range(50, width - 50)
    const centerY = range(50, height - 50)
    const size = range(30, Math.min(width, height) / 3)
    const elements = generateFractal(random, centerX, centerY, size)
    return elements
  }

  const gradientElement = () => {
    const centerX = range(28, width - 28)
    const centerY = range(28, height - 28)
    const radius = range(30, Math.min(width, height) / 2)
    const gradientId = `gradient-${random()}`

    const color1 = nextColor()
    const color2 = nextColor()

    const gradient = `
      <defs>
        <radialGradient id="${gradientId}" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="${color1}" />
          <stop offset="100%" stop-color="${color2}" />
        </radialGradient>
      </defs>
    `

    return [gradient, `<circle cx="${centerX}" cy="${centerY}" r="${radius}" fill="url(#${gradientId})" />`]
  }

  const baseColor = nextColor()

  const styleA = [...repeat(cubeElement, range(1, 2)), ...repeat(squiggleElement, range(0, 1))]
  const styleB = repeat(squiggleElement, range(3, 5))
  const styleC = repeat(organicElement, range(2, 3))
  const styleD = [...repeat(dotElement, range(1, 1)), ...repeat(spiralElement, range(1, 1)), ...repeat(organicElement, range(1, 2))]
  const styleE = [...repeat(dotElement, range(1, 2)), ...repeat(squiggleElement, range(2, 3))]
  const styleF = [...repeat(spiralElement, range(1, 1)), ...repeat(organicElement, range(1, 2))]
  const styleG = [...repeat(polygonElement, range(2, 4)), ...repeat(starElement, range(1, 3))]
  const styleH = [...repeat(pyramidElement, range(1, 2)), ...repeat(cylinderElement, range(1, 2))]
  const styleI = [...repeat(fractalElement, range(1, 3)), ...repeat(gradientElement, range(1, 2))]
  const styleJ = [...repeat(textureElement, range(3, 6)), ...repeat(polygonElement, range(1, 2))]
  const styleK = [...repeat(gradientElement, range(1, 2)), ...repeat(starElement, range(2, 4))]
  const styleL = [...repeat(cylinderElement, range(1, 2)), ...repeat(squiggleElement, range(1, 3))]
  const styleM = [...repeat(fractalElement, range(1, 2)), ...repeat(spiralElement, range(1, 2)), ...repeat(textureElement, range(1, 2))]
  const styleN = [...repeat(polygonElement, range(2, 4)), ...repeat(starElement, range(1, 3)), ...repeat(dotElement, range(1, 3))]

  const styleChaos = [
    ...repeat(cubeElement, range(1, 2)),
    ...repeat(squiggleElement, range(0, 4)),
    ...repeat(organicElement, range(0, 2)),
    ...repeat(dotElement, range(0, 4)),
    ...repeat(spiralElement, range(0, 2)),
    ...repeat(polygonElement, range(0, 3)),
    ...repeat(starElement, range(0, 1)),
    ...repeat(pyramidElement, range(0, 1)),
    ...repeat(cylinderElement, range(0, 1)),
    ...repeat(textureElement, range(2, 4))
  ]

  const styleMinimal = [
    ...repeat(textureElement, range(3, 4)),
    ...repeat(gradientElement, range(1, 1)),
    ...repeat(pyramidElement, range(1, 1))
  ]

  const styles = [styleA, styleB, styleC, styleD, styleE, styleF, styleG, styleH, styleI, styleJ, styleK, styleL, styleM, styleN, styleChaos, styleMinimal]
  const style = styles[Math.floor((seed / seedSpace) * styles.length)]

  const defs = []
  const otherElements = []

  for (let f of style) {
    const el = f()
    if (el.some(e => e && e.includes('<defs>'))) {
      defs.push(...el.filter(e => e && e.includes('<defs>')))
      otherElements.push(...el.filter(e => e && !e.includes('<defs>')))
    } else {
      otherElements.push(...el)
    }
  }

  const useGradientBackground = random() < 0.65
  const bgGradientId = `bg-gradient-${random()}`
  if (useGradientBackground) {
    defs.push(`
      <defs>
        <linearGradient id="${bgGradientId}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${baseColor}" />
          <stop offset="100%" stop-color="${nextColor()}" />
        </linearGradient>
      </defs>
    `)
  }

  return `${defs.length > 0 ? defs.join('\n  ') : ''}
          <rect width="100%" height="100%" fill="${useGradientBackground ? 'url(#' + bgGradientId + ')' : baseColor}" />
          ${otherElements.join('\n  ')}`
}


export const createArtPool = () => {
  const seedPool = []
  for (let i = 0; i < divisions; i++) {
    const start = i * partitionSize
    let seed = start + Math.floor(Math.random() * partitionSize)
    while (seedPool.includes(seed)) {
      seed = start + Math.floor(Math.random() * partitionSize)
    }
    seedPool.push(seed)
  }
  return seedPool.map(s => 'generative_' + Math.floor(s).toString())
}