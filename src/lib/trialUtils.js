import { LIGHT_PALETTE, DARK_PALETTE } from "./constants"
import { getSvgUrl } from "./svg"

export const createSvgId = (shape, color, image, settings) => {
  if (image) {
    return `${image}-${settings.theme}`
  }

  if (shape && !color) {
    return `basicShape-${shape}-inner-${settings.theme}`
  } else if (shape) {
    if (color.startsWith('gradient')) {
      return `gradientShape-${shape}-${color}-${settings.theme}`
    } else if (color.startsWith('generative')) {
      return `generativeShape-${shape}-${color}-${settings.theme}`
    } else if (color.startsWith('voronoi')) {
      return `voronoiShape-${shape}-${color}-${settings.theme}`
    } else {
      return `basicShape-${shape}-${color}-${settings.theme}`
    }
  }

  if (!shape && color) {
    if (color.startsWith('gradient')) {
      return `gradientShape-bg-${color}-${settings.theme}`
    }
    if (color.startsWith('generative')) {
      return `generativeShape-bg-${color}-${settings.theme}`
    }
    if (color.startsWith('voronoi')) {
      return `voronoiShape-bg-${color}-${settings.theme}`
    }
  }

  return ''
}

export const findBoxColor = (shape, color, image, settings) => {
  if (shape || image) {
    return ''
  } else if (color) {
    return settings.theme === 'dark' ? DARK_PALETTE[color] : LIGHT_PALETTE[color]
  } else {
    return settings.theme === 'dark' ? '#FDFDFD' : '#313131'
  }
}

export const findShapeOuterColor = (color, settings) => {
  return settings.theme === 'dark' ? (color ? '#FDFDFD' : '#EEEEEE') : '#FAFAFA'
}

export const cacheNextTrial = (trial, settings) => {
  if (trial) {
    setTimeout(() => {
      const svgId = createSvgId(trial.shape, trial.color, trial.image, settings)
      getSvgUrl(svgId)
    }, 0)
  }
}