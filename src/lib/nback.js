import { COLOR_POOL, SHAPE_POOL, getAudioPool, POSITION_POOL, POSITION_POOL_2D } from "./constants.js"
import { createVoronoiPool } from "./voronoi.js"
import { createArtPool } from "./generative.js"
import { NBackGame } from "./nbackGame.js"

const getPositionPool = (gameSettings) => {
  if (gameSettings.grid?.includes('2D')) {
    return POSITION_POOL_2D
  } else {
    return POSITION_POOL
  }
}

const addNonTallyStimuli = (nbackGame, gameSettings, globalSettings) => {
  const { enableAudio, enableShape, enableColor, enableShapeColor } = gameSettings
  if (enableAudio) {
    nbackGame.addStimulus('audio', getAudioPool(globalSettings.audioSource))
  }
  if (enableShape) {
    nbackGame.addStimulus('shape', SHAPE_POOL)
  }
  if (enableColor) {
    nbackGame.addStimulus('color', COLOR_POOL)
  }
  if (enableShapeColor) {
    const pool = globalSettings.patternSource === 'generative' ? createArtPool() : createVoronoiPool()
    nbackGame.addStimulus('shapeColor', pool)
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
