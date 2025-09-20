class ShapeSvgPool {
  constructor() {
    this.shapes = new Map()
    this.loaded = false
    this.loadPromise = null
    this.defaultSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    this.defaultSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
    this.defaultSvg.innerHTML = '<rect x="0" y="0" width="400" height="400"></rect>'
  }

  async load() {
    if (this.loaded) {
      return
    }

    if (this.loadPromise) {
      return this.loadPromise
    }

    this.loadPromise = this._loadShapes()
    await this.loadPromise
    this.loaded = true
  }

  async _loadShapes() {
    const response = await fetch('sprites/shapes.html')
    const text = await response.text()

    const parser = new DOMParser()
    const doc = parser.parseFromString(text, 'text/html')

    doc.querySelectorAll('svg').forEach(svg => {
      const id = svg.getAttribute('id')
      if (id) {
        this.shapes.set(id, svg)
      }
    })
  }

  getShapeSvg(id) {
    const svg = this.shapes.get(id)
    if (svg) {
      return svg.cloneNode(true)
    }
    return this.defaultSvg.cloneNode(true)
  }

  hasShape(id) {
    return this.shapes.has(id)
  }

  getAllShapeIds() {
    return Array.from(this.shapes.keys())
  }

  isLoaded() {
    return this.loaded
  }
}

const shapeSvgPool = new ShapeSvgPool()
shapeSvgPool.load()
export default shapeSvgPool
