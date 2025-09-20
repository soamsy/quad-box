import { COLOR_POOL, SHAPE_POOL, getAudioPool, POSITION_POOL, POSITION_POOL_2D, TETRIS_POOL, ICONS_A_POOL, ICONS_B_POOL } from "./constants.js"
import { createVoronoiPool } from "./voronoi.js"
import { createArtPool } from "./generative.js"
import { NBackGame } from "./nbackGame.js"
import { createGradientPool } from "./gradient.js"
import { shuffle } from "./utils.js"

const getPositionPool = (gameSettings) => {
  if (gameSettings.grid?.includes('2D')) {
    return POSITION_POOL_2D
  } else {
    return POSITION_POOL
  }
}

const addNonTallyStimuli = (nbackGame, gameSettings) => {
  const { enableAudio, enableShape, enableColor, enableImage } = gameSettings
  if (enableAudio) {
    nbackGame.addStimulus('audio', getAudioPool(gameSettings.audioSource))
  }
  if (enableShape) {
    let shapePool
    switch (gameSettings.shapeSource) {
      case 'tetris':
        shapePool = TETRIS_POOL
        break
      case 'iconsA':
        shapePool = ICONS_A_POOL
        break
      case 'iconsB':
        shapePool = ICONS_B_POOL
        break
      default:
        shapePool = SHAPE_POOL
        break
    }
    nbackGame.addStimulus('shape', shuffle(shapePool.slice()).slice(0, Math.min(16, shapePool.length)))
  }
  if (enableColor) {
    let colorPool
    switch (gameSettings.colorSource) {
      case 'gradient':
        colorPool = createGradientPool()
        break
      case 'generative':
        colorPool = createArtPool()
        break
      case 'voronoi':
        colorPool = createVoronoiPool()
        break
      default:
        colorPool = COLOR_POOL
        break
    }
    nbackGame.addStimulus('color', shuffle(colorPool.slice()).slice(0, Math.min(16, colorPool.length)))
  }
  if (enableImage) {
    const pool = gameSettings.imageSource === 'generative' ? createArtPool() : createVoronoiPool()
    nbackGame.addStimulus('image', pool)
  }
}

export const generateGame = (gameSettings, globalSettings) => {
  const nbackGame = new NBackGame(gameSettings)
  nbackGame.addStimulus('position', getPositionPool(gameSettings))
  addNonTallyStimuli(nbackGame, gameSettings, globalSettings)
  return nbackGame.generateGame()
}

export const generateTallyGame = (gameSettings, globalSettings) => {
  const nbackGame = new NBackGame(gameSettings)
  if (gameSettings.enablePositionWidthSequence) {
    const sequence = gameSettings.positionWidthSequence.slice(0, gameSettings.nBack)
    const maxWidth = sequence.reduce((a, b) => Math.max(a, b), 1)
    let allPositionStimuli = []
    for (let i = 0; i < maxWidth; i++) {
      allPositionStimuli.push(`position${i}`)
    }
    nbackGame.addTallyStimuli('position', getPositionPool(gameSettings), allPositionStimuli, sequence)
  } else {
    const width = gameSettings.positionWidth
    let allPositionStimuli = []
    for (let i = 0; i < width; i++) {
      allPositionStimuli.push(`position${i}`)
    }
    nbackGame.addTallyStimuli('position', getPositionPool(gameSettings), allPositionStimuli, [width])
  }
  addNonTallyStimuli(nbackGame, gameSettings, globalSettings)
  return nbackGame.generateGame()
}
