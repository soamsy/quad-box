import { COLOR_POOL, SHAPE_POOL, getAudioPool, POSITION_POOL, POSITION_POOL_2D } from "./constants"
import { createVoronoiPool } from "./voronoi"
import { createArtPool } from "./generative"

const pick = (pool) => {
  return pool[Math.floor(Math.random() * pool.length)]
}

const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const tmp = array[i]
    array[i] = array[j]
    array[j] = tmp
  }
  return array
}

const getPositionPool = (settings) => {
  if (settings.grid?.includes('2D')) {
    return POSITION_POOL_2D
  } else {
    return POSITION_POOL
  }
}

const generateMatches = (trials, nBack, matchChance) => {
  if (nBack >= trials.length) {
    return trials.map(() => false)
  }
  const matchableTrials = trials.length - nBack
  const halfChance = matchChance / 2
  const guaranteedMatches = matchableTrials * halfChance / 100
  const rest = matchableTrials - guaranteedMatches
  const restChance = 100 * guaranteedMatches / rest
  let extraMatches = 0
  for (let i = 0; i < rest; i++) {
    if (Math.random() * 100 < restChance) {
      extraMatches++
    }
  }
  const totalMatches = Math.round(guaranteedMatches + extraMatches)
  let matches = new Array(matchableTrials).fill(false)
  for (let i = nBack; i < nBack + totalMatches && i < matches.length; i++) {
    matches[i] = true
  }
  shuffle(matches)
  const prefixMatches = new Array(nBack).fill(false)
  return prefixMatches.concat(matches)
}

const generateStimuli = (trials, tags, types, stimulusPool, nBack, matchChance, interference, sequence) => {
  for (const type of types) {
    if (!tags.includes(type)) {
      tags.push(type)
    }
  }

  if (!sequence) {
    sequence = [1]
  }

  const type_matches = types.map(_ => generateMatches(trials, nBack, matchChance))
  let stimuli = new Array(trials.length)
  for (let i = 0; i < stimuli.length; i += 1) {
    const width = sequence[i % sequence.length]
    types.forEach((type, typeIndex) => {
      if (typeIndex >= width) {
        return
      }
      const matches = type_matches[typeIndex]
      const otherTypes = types.filter(otherType => otherType !== type)
      let banned = otherTypes.map(otherType => trials[i][otherType]).filter(stimulus => stimulus)
      let pool = stimulusPool.filter(stimulus => !banned.includes(stimulus))
      if (i < nBack) {
        trials[i][type] = pick(pool)
        return
      }
      banned = banned.concat(otherTypes.map(otherType => trials[i-nBack][otherType]).filter(stimulus => stimulus))
      pool = pool.filter(stimulus => !banned.includes(stimulus))

      if (matches[i]) {
        trials[i][type] = trials[i-nBack][type]
        trials[i].matches.push(type)
      } else {
        const available = pool.filter(stimulus => stimulus !== trials[i-nBack][type])
        let difficultStimuli = [trials[i-nBack+1][type]]
        if (0 <= i-nBack-1) {
          difficultStimuli.push(trials[i-nBack-1][type])
        }
        difficultStimuli = difficultStimuli.filter(stimulus => available.includes(stimulus))
        shuffle(difficultStimuli)
        if (Math.random() * 100 < interference && difficultStimuli.length > 0) {
          trials[i][type] = difficultStimuli[0]
        } else {
          trials[i][type] = pick(available)
        }
      }
    })
  }
}

const generateSingleWidthStimuli = (trials, tags, { nBack, enableAudio, enableShape, enableColor, enableShapeColor, matchChance, interference }, globalSettings) => {
  if (enableAudio) {
    generateStimuli(trials, tags, ['audio'], getAudioPool(globalSettings.audioSource), nBack, matchChance, interference)
  }
  if (enableShape) {
    generateStimuli(trials, tags, ['shape'], SHAPE_POOL, nBack, matchChance, interference)
  }
  if (enableShapeColor) {
    const pool = globalSettings.patternSource === 'generative' ? createArtPool() : createVoronoiPool()
    generateStimuli(trials, tags, ['shapeColor'], pool, nBack, matchChance, interference)
  }
  if (enableColor) {
    generateStimuli(trials, tags, ['color'], COLOR_POOL, nBack, matchChance, interference)
  }
}

export const generateGame = (settings, globalSettings) => {
  const { nBack, numTrials, trialTime, enableAudio, enableShape, enableColor, enableShapeColor, matchChance, interference, enableVariableNBack } = settings
  let trials = new Array(numTrials).fill().map(() => ({ matches: [], answers: {} }))
  let tags = []
  let nBackSequence = Array(numTrials).fill(nBack)
  if (enableVariableNBack) {
    nBackSequence = nBackSequence.map(() => Math.floor(Math.pow(Math.random(), 0.5) * nBack) + 1)
  }
  generateStimuli(trials, tags, ['position'], getPositionPool(settings), nBack, matchChance, interference)
  generateSingleWidthStimuli(trials, tags, settings, globalSettings)
  let title = tags.join('-')

  if (enableAudio && !enableShape && !enableColor && !enableShapeColor) {
    title = 'dual'
  } else if (enableAudio && enableShape && enableColor) {
    title = 'quad'
  } else if (enableAudio && (enableColor != enableShape || enableShapeColor)) {
    title = 'tri'
  } else {
    title = 'custom'
  }

  const game = {
    meta: { nBack, numTrials, trialTime, title, tags, matchChance, interference },
    trials: trials,
  }
  
  return game
}

export const generateTallyGame = (settings, globalSettings) => {
  const { nBack, numTrials, enableAudio, enableShape, enableColor, enableShapeColor, matchChance, interference, positionWidth, enablePositionWidthSequence, positionWidthSequence } = settings
  let trials = new Array(numTrials).fill().map(() => ({ matches: [], answers: {} }))
  let tags = []
  if (settings.enablePositionWidthSequence) {
    const sequence = settings.positionWidthSequence.slice(0, settings.nBack)
    const maxWidth = sequence.reduce((a, b) => Math.max(a, b), 1)
    let allPositionStimuli = []
    for (let i = 0; i < maxWidth; i++) {
      allPositionStimuli.push(`position${i}`)
    }
    generateStimuli(trials, tags, allPositionStimuli, getPositionPool(settings), nBack, matchChance, interference, sequence)
  } else {
    const width = settings.positionWidth
    let allPositionStimuli = []
    for (let i = 0; i < width; i++) {
      allPositionStimuli.push(`position${i}`)
    }
    generateStimuli(trials, tags, allPositionStimuli, getPositionPool(settings), nBack, matchChance, interference, [width])
  }
  generateSingleWidthStimuli(trials, tags, settings, globalSettings)
  let title = tags.join('-')

  if (enableAudio && !enableShape && !enableColor && !enableShapeColor) {
    title = 'tally dual'
  } else if (enableAudio && enableShape && enableColor) {
    title = 'tally quad'
  } else if (enableAudio && (enableColor != enableShape || enableShapeColor)) {
    title = 'tally tri'
  } else {
    title = 'tally custom'
  }

  const game = {
    meta: { nBack, numTrials, title, tags, matchChance, interference, positionWidth, enablePositionWidthSequence, positionWidthSequence, mode: 'tally' },
    trials: trials,
  }

  return game
}
