import { LIGHT_PALETTE, DARK_PALETTE } from "./constants"
import { createArtSvg } from "./generative"
import { createGradient } from "./gradient"
import { createVoronoiSvg } from "./voronoi"
import shapeSvgPool from "./shapeSvgPool.js"

class SvgLruCache {
  constructor(maxSize) {
    this.maxSize = maxSize
    this.cache = new Map()
  }

  get(key) {
    const item = this.cache.get(key)
    if (item) {
      this.cache.delete(key)
      this.cache.set(key, item)
      return item
    }
    return undefined
  }

  store(id, svgString) {
    if (this.cache.has(id)) {
      this.delete(id)
    } else if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value
      this.delete(firstKey)
    }

    const blob = new Blob([svgString], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    this.cache.set(id, url)
  }

  has(id) {
    return this.cache.has(id)
  }

  delete(id) {
    const url = this.cache.delete(id)
    if (url) {
      URL.revokeObjectURL(this.cache.get(id))
    }
    return url
  }

  size() {
    return this.cache.size
  }

  clear() {
    for (const id of this.cache.keys()) {
      this.delete(id)
    }
    this.cache.clear()
  }
}

const changeToSymbol = (svg) => {
  const newEl = document.createElementNS('http://www.w3.org/2000/svg', 'symbol')
  for (const { name, value } of svg.attributes) {
    newEl.setAttribute(name, value)
  }
  while (svg.firstChild) {
    newEl.appendChild(svg.firstChild)
  }
  return newEl
}

const getStroke = (theme) => {
  return theme === 'dark' ? '#121212' : '#030303'
}

const getShapeSvg = (shape, fill, stroke) => {
  const shapeSvg = shapeSvgPool.getShapeSvg(shape)
  if (fill) {
    shapeSvg.setAttribute('fill', fill)
  }
  if (stroke) {
    shapeSvg.setAttribute('stroke', stroke)
    shapeSvg.setAttribute('stroke-width', '1%')
  }
  shapeSvg.setAttribute('width', '400')
  shapeSvg.setAttribute('height', '400')
  return shapeSvg
}

const createBasicShape = (shape, color, theme) => {
  const fill = theme === 'dark' ? DARK_PALETTE[color] : LIGHT_PALETTE[color]
  const stroke = getStroke(theme)
  const shapeSvg = getShapeSvg(shape, fill, stroke)
  return shapeSvg.outerHTML
}

const createGradientShape = (shape, color, theme) => {
  const fill = `url(#${color})`
  const stroke = getStroke(theme)
  const gradient = createGradient(color, theme)
  const shapeSvg = getShapeSvg(shape, fill, stroke)
  shapeSvg.insertAdjacentHTML('beforeend', gradient)
  return shapeSvg.outerHTML
}

const wrapInSvgTag = (svgObjects, width=400, height=400) => {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">` + svgObjects + `</svg>`
}

const createUseElement = (shape, fill) => {
  const useElement = document.createElement('use')
  useElement.setAttribute('href', `#${shape}`)
  if (fill) {
    useElement.setAttribute('fill', fill)
  }
  return useElement
}

const createClippedShape = (shape, svgObjects, theme) => {
  if (shape === 'bg') {
    return wrapInSvgTag(svgObjects)
  }
  const mask = document.createElement('mask')
  mask.setAttribute('id', 'mask')

  const defs = document.createElement('defs')
  const symbolSvg = changeToSymbol(getShapeSvg(shape, null, null), 'symbol')
  defs.appendChild(symbolSvg)

  const maskUse = createUseElement(shape, '#FFF')
  const outlineUse = createUseElement(shape, null)
  mask.appendChild(maskUse)
  defs.appendChild(mask)

  const group = document.createElementNS('http://www.w3.org/2000/svg', 'g')
  group.setAttribute('mask', 'url(#mask)')
  group.insertAdjacentHTML('beforeend', svgObjects)

  const parentSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  parentSvg.appendChild(defs)
  parentSvg.appendChild(outlineUse)
  parentSvg.appendChild(group)
  parentSvg.setAttribute('width', 400)
  parentSvg.setAttribute('height', 400)
  parentSvg.setAttribute('stroke', getStroke(theme))
  parentSvg.setAttribute('stroke-width', '1%')
  parentSvg.setAttribute('stroke-linecap', 'round')
  parentSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
  return parentSvg.outerHTML
}

const createGenerativeShape = (shape, artId, theme) => {
  const artSvgObjects = createArtSvg(artId.replace('generative_', ''), theme, 400, 400)
  return createClippedShape(shape, artSvgObjects, theme)
}

const createVoronoiShape = (shape, voronoiId, theme) => {
  const [seed, splits] = voronoiId.replace('voronoi_', '').split('_')
  const voronoiSvgObjects = createVoronoiSvg(seed, splits, theme, shape === 'bg' ? 0 : 100)
  return createClippedShape(shape, voronoiSvgObjects, theme)
}

const getSvgString = (id) => {
  const parts = id.split('-')
  let first = parts[0]
  let rest = parts.slice(1, parts.length)
  if (first.includes('_')) {
    const subParts = first.split('_')
    first = subParts[0]
    rest = subParts.slice(1, subParts.length).concat(rest)
  }
  switch (first) {
    case 'basicShape':
      return createBasicShape(...rest)
    case 'gradientShape':
      return createGradientShape(...rest)
    case 'generativeShape':
      return createGenerativeShape(...rest)
    case 'voronoiShape':
      return createVoronoiShape(...rest)
    case 'voronoi':
      return wrapInSvgTag(createVoronoiSvg(...rest))
    case 'generative':
      return wrapInSvgTag(createArtSvg(...rest))
  }
  return undefined
}

const cache = new SvgLruCache(256)
export const getSvgUrl = (id) => {
  if (cache.has(id)) {
    return cache.get(id)
  }

  const svgString = getSvgString(id)
  if (!svgString) {
    return ''
  }

  cache.store(id, svgString)
  return cache.get(id)
}
