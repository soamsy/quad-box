import { COLOR_POOL, SHAPE_POOL, NUMBER_AUDIO_POOL, LETTER_AUDIO_POOL, POSITION_POOL } from "./constants"

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

const generateStimuli = (trials, type, pool, nBack, matchChance, interference) => {
  let stimuli = new Array(trials.length)
  for (let i = 0; i < stimuli.length; i++) {
    if (i < nBack) {
      trials[i][type] = pick(pool)
      continue
    }

    if (Math.random() * 100 < matchChance) {
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
  return globalSettings.audioSource === 'numbers' ? NUMBER_AUDIO_POOL : LETTER_AUDIO_POOL
}

export const generateGame = (settings, globalSettings) => {
  const { nBack, numTrials, trialTime, enableAudio, enableShape, enableColor, matchChance, interference } = settings
  let trials = new Array(numTrials).fill().map(() => ({ matches: [], answers: {} }))
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
  if (enableColor) {
    tags.push('color')
    generateStimuli(trials, 'color', COLOR_POOL, nBack, matchChance, interference)
  }
  let title = tags.join('-')

  if (enableAudio && !enableShape && !enableColor) {
    title = 'dual'
  } else if (enableAudio && enableShape && enableColor) {
    title = 'quad'
  } else if (enableAudio && (enableColor != enableShape)) {
    title = 'tri'
  } else {
    title = 'custom'
  }

  const game = {
    meta: { nBack, numTrials, trialTime, title, tags, matchChance, interference, timestamp: Date.now() },
    trials: trials,
  }
  
  return game
}