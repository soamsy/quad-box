import { COLOR_POOL, SHAPE_POOL, NUMBER_AUDIO_POOL, LETTER_AUDIO_POOL, LETTER_2_AUDIO_POOL, POSITION_POOL } from "./constants"
import { createVoronoiPool } from "./voronoi"

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

const generateStimuli = (trials, type, pool, nBack, matchChance, interference) => {
  const matches = generateMatches(trials, nBack, matchChance)
  let stimuli = new Array(trials.length)
  for (let i = 0; i < stimuli.length; i++) {
    if (i < nBack) {
      trials[i][type] = pick(pool)
      continue
    }

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
  }
}

const getAudioPool = (globalSettings) => {
  switch (globalSettings.audioSource) {
    case 'letters':
      return LETTER_AUDIO_POOL
    case 'numbers':
      return NUMBER_AUDIO_POOL
    default:
      return LETTER_2_AUDIO_POOL
  }
}

export const generateGame = (settings, globalSettings) => {
  const isVisual = globalSettings.mode === 'visual'
  const { nBack, numTrials, trialTime, enableAudio, enableShape, enableColor, enableShapeColor, matchChance, interference } = settings
  let trials = new Array(numTrials).fill().map(() => ({ matches: [], answers: {} }))
  if (isVisual) {
    let tags = []
    for (let i = 1; i <= settings.vcount; i++) {
      tags.push(`visual${i}`)
      generateStimuli(trials, `visual${i}`, createVoronoiPool(), nBack, matchChance, interference)
    }
    let title = 'visual'
    return {
      meta: { nBack, numTrials, trialTime, title, tags, matchChance, interference },
      trials: trials,
    }
  }
  let tags = ['position']
  generateStimuli(trials, 'position', POSITION_POOL, nBack, matchChance, interference)
  if (enableAudio) {
    tags.push('audio')
    generateStimuli(trials, 'audio', getAudioPool(globalSettings), nBack, matchChance, interference)
  }
  if (enableShape) {
    tags.push('shape')
    generateStimuli(trials, 'shape', SHAPE_POOL, nBack, matchChance, interference)
  }
  if (enableShapeColor) {
    tags.push('shapeColor')
    generateStimuli(trials, 'shapeColor', createVoronoiPool(), nBack, matchChance, interference)
  }
  if (enableColor) {
    tags.push('color')
    generateStimuli(trials, 'color', COLOR_POOL, nBack, matchChance, interference)
  }
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
