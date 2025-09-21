import { COLOR_POOL, SHAPE_POOL, getAudioPool, POSITION_POOL, POSITION_POOL_2D, TETRIS_POOL, ICONS_A_POOL, ICONS_B_POOL, ALL_SHAPES_POOL } from "./constants.js"
import { createVoronoiPool } from "./voronoi.js"
import { createArtPool } from "./generative.js"
import { NBackGame } from "./nbackGame.js"
import { createGradientPool } from "./gradient.js"
import { shuffle } from "./utils.js"

export const generateGame = (gameSettings, globalSettings) => {
  const nbackGame = new NBackGame(gameSettings)
  nbackGame.addStimulus('position', getPositionPool(gameSettings))
  addNonTallyStimuli(nbackGame, gameSettings, globalSettings)
  return nbackGame.generateGame()
}

const addNonTallyStimuli = (nbackGame, gameSettings) => {
  const { enableAudio, enableShape, enableColor, enableImage } = gameSettings
  if (enableAudio) {
    nbackGame.addStimulus('audio', getAudioPool(gameSettings.audioSource))
  }
  if (enableShape) {
    nbackGame.addStimulus('shape', getShapePool(gameSettings))
  }
  if (enableColor) {
    nbackGame.addStimulus('color', getColorPool(gameSettings))
  }
  if (enableImage) {
    nbackGame.addStimulus('image', getImagePool(gameSettings))
  }
}

export const generateTallyGame = (gameSettings, globalSettings) => {
  if (globalSettings.mode === 'vtally') {
    return generateVisualTallyGame(gameSettings)
  } else {
    return generateDefaultTallyGame(gameSettings)
  }
}

const generateDefaultTallyGame = (gameSettings) => {
  const nbackGame = new NBackGame(gameSettings)
  generateWidthBasedStimuli(nbackGame, gameSettings, 'position', () => getPositionPool(gameSettings))
  addNonTallyStimuli(nbackGame, gameSettings)
  return nbackGame.generateGame()
}

const generateVisualTallyGame = (gameSettings) => {
  const nbackGame = new NBackGame(gameSettings)
  const { enableShape, enableColor, enableImage } = gameSettings
  if (enableShape) {
    generateWidthBasedStimuli(nbackGame, gameSettings, 'shape', () => getShapePool(gameSettings))
  }
  if (enableColor) {
    generateWidthBasedStimuli(nbackGame, gameSettings, 'color', () => getColorPool(gameSettings))
  }
  if (enableImage) {
    generateWidthBasedStimuli(nbackGame, gameSettings, 'image', () => getImagePool(gameSettings))
  }
  return nbackGame.generateGame()
}

const generateWidthBasedStimuli = (nbackGame, gameSettings, field, findPool) => {
  if (gameSettings.enablePositionWidthSequence) {
    const sequence = gameSettings.positionWidthSequence.slice(0, gameSettings.nBack)
    const maxWidth = sequence.reduce((a, b) => Math.max(a, b), 1)
    const allStimuli = createNTallyStimuli(maxWidth, field)
    nbackGame.addTallyStimuli(field, allStimuli.map(findPool), allStimuli, sequence)
  } else {
    const width = gameSettings.positionWidth
    const allStimuli = createNTallyStimuli(width, field)
    nbackGame.addTallyStimuli(field, allStimuli.map(findPool), allStimuli, [width])
  }
}

const createNTallyStimuli = (width, field) => {
  let allStimuli = []
  for (let i = 0; i < width; i++) {
    allStimuli.push(`${field}${i}`)
  }
  return allStimuli
}

const getPositionPool = (gameSettings) => {
  if (gameSettings.grid?.includes('2D')) {
    return POSITION_POOL_2D
  } else {
    return POSITION_POOL
  }
}

const getShapePool = (gameSettings) => {
  return pickN(getShapeSource(gameSettings), 16)
}

const getShapeSource = (gameSettings) => {
  switch (gameSettings.shapeSource) {
    case 'tetris':
      return TETRIS_POOL
    case 'iconsA':
      return ICONS_A_POOL
    case 'iconsB':
      return ICONS_B_POOL
    case 'all':
      return ALL_SHAPES_POOL
  }
  return SHAPE_POOL
}

const getColorPool = (gameSettings) => {
  return pickN(getColorSource(gameSettings), 16)
}

const getColorSource = (gameSettings) => {
  switch (gameSettings.colorSource) {
    case 'gradient':
      return createGradientPool()
    case 'generative':
      return createArtPool()
    case 'voronoi':
      return createVoronoiPool()
  }
  return COLOR_POOL
}

const getImagePool = (gameSettings) => {
  return gameSettings.imageSource === 'generative' ? createArtPool() : createVoronoiPool()
}

const pickN = (pool, num) => {
  return shuffle(pool.slice()).slice(0, Math.min(num, pool.length))
}