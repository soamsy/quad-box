import { shuffle, pick } from "./utils.js"

export class NBackGame {
  constructor(gameSettings, randomFn=Math.random) {
    this.stimuli = new Map()
    this.tallyStimuli = new Map()
    this.gameSettings = gameSettings
    this.nBack = gameSettings.nBack
    this.numTrials = gameSettings.numTrials
    this.matchChance = gameSettings.matchChance
    this.interference = gameSettings.interference
    this.rules = gameSettings.rules
    this.randomFn = randomFn
  }

  addStimulus(tag, pool) {
    this.stimuli.set(tag, pool)
  }

  addTallyStimuli(group, pools, tags, sequence) {
    this.tallyStimuli.set(group, {
      pools,
      tags,
      sequence,
    })
  }

  generateGame() {
    let trials = new Array(this.numTrials).fill().map(() => ({ matches: [] }))
    let tags = []
    const nSequence = this.generateNSequence()
    if (this.rules === 'variable') {
      trials.forEach((trial, i) => {
        if (i >= this.nBack) {
          trial.variableNBack = nSequence[i]
        }
      })
    }
    for (const [tag, pool] of this.stimuli) {
      tags.push(tag)
      this.generateStimuli(trials, tag, pool, nSequence)
    }

    for (const [_, { tags: groupTags, sequence, pools }] of this.tallyStimuli) {
      groupTags.forEach(tag => tags.push(tag))
      this.generateTallyStimuli(trials, groupTags, sequence, pools)
    }

    let title = this.createTitle(tags)
    let meta = (({ nBack, numTrials, trialTime, matchChance, interference, rules }) =>
                  ({ nBack, numTrials, trialTime, matchChance, interference, rules }))(this.gameSettings)

    meta = { ...meta, title, tags }
    if (this.tallyStimuli.size > 0) {
      meta = { ...meta,
        mode: 'tally',
        positionWidth: this.gameSettings.positionWidth,
        enablePositionWidthSequence: this.gameSettings.enablePositionWidthSequence,
        positionWidthSequence: this.gameSettings.positionWidthSequence,
      }
    }

    return {
      trials,
      meta,
    }
  }

  createTitle(tags) {
    const title = this.createDefaultTitle(tags)
    if (this.tallyStimuli.size > 0) {
      const prefix = this.rules === 'vtally' ? 'vtally' : 'tally'
      return prefix + ' ' + title
    }
    return this.createDefaultTitle(tags)
  }

  createDefaultTitle(tags) {
    const has = (tag) => tags.includes(tag)
    if (has('audio') && !has('shape') && !has('color') && !has('image')) {
      return 'dual'
    } else if (has('audio') && has('shape') && has('color')) {
      return 'quad'
    } else if (has('audio') && (has('shape') !== has('color') || has('image'))) {
      return 'tri'
    } else {
      return 'custom'
    }
  }

  generateNSequence() {
    if (this.rules === 'variable') {
      return new Array(this.numTrials).fill().map(() => Math.floor(Math.pow(this.random(), this.random() < 0.5 ? 0.25 : 0.6) * this.nBack) + 1)
    } else {
      return new Array(this.numTrials).fill(this.nBack)
    }
  }

  generateStimuli(trials, tag, pool, nSequence) {
    const matches = this.generateMatches()
    let stimuli = new Array(trials.length)
    for (let i = 0; i < stimuli.length; i++) {
      if (i < this.nBack) {
        trials[i][tag] = pick(pool)
        continue
      }

      const n = nSequence[i]
      if (matches[i]) {
        trials[i][tag] = trials[i-n][tag]
        trials[i].matches.push(tag)
      } else {
        const available = pool.filter(stimulus => stimulus !== trials[i-n][tag])
        let difficultStimuli = [trials[i-n+1][tag]]
        if (0 <= i-n-1) {
          difficultStimuli.push(trials[i-n-1][tag])
        }
        difficultStimuli = difficultStimuli.filter(stimulus => available.includes(stimulus))
        shuffle(difficultStimuli)
        if (this.random() * 100 < this.interference && difficultStimuli.length > 0) {
          trials[i][tag] = difficultStimuli[0]
        } else {
          trials[i][tag] = pick(available)
        }
      }
    }
  }

  /**
   * Generates stimuli for a tag group like ['position0', 'position1', 'position2']
   * with no overlap, and according to a sequence rule like [3, 2, 1, 1].
   * E.g. if sequence is [3,2,1,1], the first trial will have all 3 positions,
   * the second trial will have 2 positions, the third and fourth trials will
   * have 1 position each, then the pattern repeats.
   */
  generateTallyStimuli(trials, tags, sequence, pools) {
    const n = this.nBack
    const tagMatches = tags.map(_ => this.generateMatches())
    let stimuli = new Array(trials.length)
    for (let i = 0; i < stimuli.length; i += 1) {
      const width = sequence[i % sequence.length]
      tags.forEach((tag, tagIndex) => {
        if (tagIndex >= width) {
          return
        }
        const pool = pools[tagIndex % pools.length]
        const matches = tagMatches[tagIndex]
        const otherTags = tags.filter(otherTag => otherTag !== tag)
        let banned = otherTags.map(otherTag => trials[i][otherTag]).filter(stimulus => stimulus)
        let localPool = pool.filter(stimulus => !banned.includes(stimulus))
        if (i < n) {
          trials[i][tag] = pick(localPool)
          return
        }
        banned = banned.concat(otherTags.map(otherTag => trials[i-n][otherTag]).filter(stimulus => stimulus))
        localPool = localPool.filter(stimulus => !banned.includes(stimulus))

        if (matches[i]) {
          trials[i][tag] = trials[i-n][tag]
          trials[i].matches.push(tag)
        } else {
          const available = localPool.filter(stimulus => stimulus !== trials[i-n][tag])
          let difficultStimuli = [trials[i-n+1][tag]]
          if (0 <= i-n-1) {
            difficultStimuli.push(trials[i-n-1][tag])
          }
          difficultStimuli = difficultStimuli.filter(stimulus => available.includes(stimulus))
          shuffle(difficultStimuli)
          if (this.random() * 100 < this.interference && difficultStimuli.length > 0) {
            trials[i][tag] = difficultStimuli[0]
          } else {
            trials[i][tag] = pick(available)
          }
        }
      })
    }
  }

  generateMatches() {
    if (this.nBack >= this.numTrials) {
      return new Array(this.numTrials).fill(false)
    }
    const matchableTrials = this.numTrials - this.nBack
    const halfChance = this.matchChance / 2
    const guaranteedMatches = matchableTrials * halfChance / 100
    const rest = matchableTrials - guaranteedMatches
    const restChance = 100 * guaranteedMatches / rest
    let extraMatches = 0
    for (let i = 0; i < rest; i++) {
      if (this.random() * 100 < restChance) {
        extraMatches++
      }
    }

    const totalMatches = Math.round(guaranteedMatches + extraMatches)
    let matches = new Array(matchableTrials).fill(false)
    for (let i = 0; i < totalMatches && i < matches.length; i++) {
      matches[i] = true
    }
    shuffle(matches)
    const prefixMatches = new Array(this.nBack).fill(false)
    return prefixMatches.concat(matches)
  }

  random() {
    return this.randomFn()
  }
}