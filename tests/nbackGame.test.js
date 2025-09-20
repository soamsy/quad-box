import { describe, it, expect, vi } from 'vitest'
import { NBackGame } from '../src/lib/nbackGame.js'

vi.mock('../src/lib/utils.js', () => ({
  pick: vi.fn((pool) => {
    return pool && pool.length > 0 ? pool[0] : 'default'
  }),
  shuffle: vi.fn((array) => array)
}))

describe('NBackGame', () => {
  const mockGameSettings = {
    nBack: 2,
    numTrials: 12,
    trialTime: 3000,
    matchChance: 50,
    interference: 20,
    positionWidth: 2,
    enablePositionWidthSequence: false,
    positionWidthSequence: [1, 2]
  }

  const mockStimulusPool = ['a', 'b', 'c']
  const mockTallyStimuli = {
    pools: [['x', 'y', 'z'], ['x', 'y', 'z']],
    tags: ['position0', 'position1'],
    sequence: [2, 1]
  }

  describe('generateGame', () => {
    it('should generate a game with correct structure for regular stimuli', () => {
      const game = new NBackGame(mockGameSettings, vi.fn(() => 0.99))
      game.addStimulus('position', mockStimulusPool)
      game.addStimulus('audio', mockStimulusPool)
      game.addStimulus('shape', mockStimulusPool)

      const result = game.generateGame()

      expect(result).toEqual({
        trials: [
          { matches: [], position: 'a', audio: 'a', shape: 'a' },
          { matches: [], position: 'a', audio: 'a', shape: 'a' },
          {
            matches: ['position', 'audio', 'shape'],
            position: 'a',
            audio: 'a',
            shape: 'a'
          },
          {
            matches: ['position', 'audio', 'shape'],
            position: 'a',
            audio: 'a',
            shape: 'a'
          },
          {
            matches: ['position', 'audio', 'shape'],
            position: 'a',
            audio: 'a',
            shape: 'a'
          },
          { matches: [], position: 'b', audio: 'b', shape: 'b' },
          { matches: [], position: 'b', audio: 'b', shape: 'b' },
          { matches: [], position: 'a', audio: 'a', shape: 'a' },
          { matches: [], position: 'a', audio: 'a', shape: 'a' },
          { matches: [], position: 'b', audio: 'b', shape: 'b' },
          { matches: [], position: 'b', audio: 'b', shape: 'b' },
          { matches: [], position: 'a', audio: 'a', shape: 'a' }
        ],
        meta: {
          nBack: 2,
          numTrials: 12,
          trialTime: 3000,
          matchChance: 50,
          interference: 20,
          title: 'tri',
          tags: [ 'position', 'audio', 'shape' ]
        }
      })
    })

    it('should generate a game with correct structure for tally stimuli', () => {
      const game = new NBackGame(mockGameSettings, vi.fn(() => 0.99))
      game.addTallyStimuli('positions', mockTallyStimuli.pools, mockTallyStimuli.tags, mockTallyStimuli.sequence)

      const result = game.generateGame()
      expect(result).toEqual({
        trials: [
          { matches: [], position0: 'x', position1: 'y' },
          { matches: [], position0: 'x' },
          { matches: ['position0', 'position1'], position0: 'x', position1: 'y' },
          { matches: ['position0'], position0: 'x' },
          { matches: ['position0', 'position1'], position0: 'x', position1: 'y' },
          { matches: [], position0: 'y' },
          { matches: [], position0: 'z', position1: 'default' },
          { matches: [], position0: 'x' },
          { matches: [], position0: 'x', position1: 'y' },
          { matches: [], position0: 'y' },
          { matches: [], position0: 'z', position1: 'default' },
          { matches: [], position0: 'x' }
        ],
        meta: {
          nBack: 2,
          numTrials: 12,
          trialTime: 3000,
          matchChance: 50,
          interference: 20,
          title: 'tally custom',
          tags: [ 'position0', 'position1' ],
          mode: 'tally',
          positionWidth: 2,
          enablePositionWidthSequence: false,
          positionWidthSequence: [ 1, 2 ]
        }
      })
    })
  })

  describe('createTitle', () => {
    it('should create correct titles for regular games', () => {
      const game = new NBackGame(mockGameSettings)

      const dualResult = game.createDefaultTitle(['audio'])
      expect(dualResult).toBe('dual')

      const quadResult = game.createDefaultTitle(['audio', 'shape', 'color'])
      expect(quadResult).toBe('quad')

      const triResult = game.createDefaultTitle(['audio', 'shape'])
      expect(triResult).toBe('tri')

      const customResult = game.createDefaultTitle(['shape', 'color'])
      expect(customResult).toBe('custom')
    })

    it('should create correct titles for tally games', () => {
      const game = new NBackGame(mockGameSettings)

      game.addTallyStimuli('positions', mockTallyStimuli.pools, mockTallyStimuli.tags, mockTallyStimuli.sequence)

      const dualResult = game.createTitle(['audio'])
      expect(dualResult).toBe('tally dual')

      const quadResult = game.createTitle(['audio', 'shape', 'color'])
      expect(quadResult).toBe('tally quad')
    })
  })

  describe('generateMatches', () => {

    it('should generate some true matches', () => {
      const gameSettings = { ...mockGameSettings, nBack: 3, numTrials: 20 }
      const game = new NBackGame(gameSettings, vi.fn(() => 1))
      const matches = game.generateMatches()
      expect(matches).toEqual([
        false, false, false,
        true, true, true, true,
        false, false, false, false, false, false, false, false, false, false, false, false, false
      ])
      expect(matches).toHaveLength(20)
    })
  })

})