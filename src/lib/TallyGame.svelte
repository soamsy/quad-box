<script>
import Grid from "./Grid.svelte"
import NumberKey from "./NumberKey.svelte"
import VisualCrank from "./VisualCrank.svelte"
import { generateTallyGame } from "./nback"
import { onDestroy } from "svelte"
import { audioPlayer } from "./audioPlayer"
import { settings } from "../stores/settingsStore"
import { tallyFeedback } from "../stores/tallyFeedbackStore"
import { analytics } from "../stores/analyticsStore"
import { mobile } from "../stores/mobileStore"
import { isPlaying, gameDisplayInfo } from "../stores/gameRunningStore"

let trials
let currentTrial
let nextTrial
let trialsIndex
let scoresheet = []
let presentation
let timeoutCancelFns
let gameMeta = {}
let gameId = 0

const resetRuntimeData = () => {
  isPlaying.set(false)
  gameDisplayInfo.set({})
  trials = []
  currentTrial = {}
  nextTrial = {}
  trialsIndex = 0
  scoresheet = []
  presentation = { highlight: false, flash: false }
  timeoutCancelFns = []
  gameMeta = {}
  gameId++
}

resetRuntimeData()

const applyNewGame = (game, isPlaying) => {
  if (!isPlaying) {
    gameMeta = { ...game.meta }
    gameDisplayInfo.set(gameMeta)
  }
}

$: isMobile = $mobile
$: gameSettings = $settings.gameSettings[$settings.mode]
$: game = generateTallyGame(gameSettings, $settings, gameId)
$: applyNewGame(game, $isPlaying)
$: trialDisplay = $settings.feedback === 'show' ? game.trials.length - trialsIndex : ''
$: keys = gameDisplayInfo.getNumberKeys($gameDisplayInfo)

const flashCube = async () => {
  presentation.flash = true
  try {
    await delay(350)
  } catch {
    // ignore
  }
  presentation.flash = false
}

const delay = async (ms) => {
  let timeoutId
  let rejectFn

  const promise = new Promise((resolve, reject) => {
    rejectFn = reject
    timeoutId = setTimeout(resolve, ms)
  })

  const cancel = () => {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId)
      rejectFn(new Error('Timeout cancelled'))
      timeoutId = undefined
    }
  }

  timeoutCancelFns.push(cancel)

  return promise
}

const selectTrial = (i) => {
  timeoutCancelFns.forEach(fn => fn())
  timeoutCancelFns = []
  if (i >= trials.length) {
    endGame('completed')
    return
  }
  flashCube()
  currentTrial = trials[i]
  trialsIndex = i
  if (i < trials.length - 1) {
    nextTrial = trials[i+1]
  }
  if (currentTrial.audio) {
    audioPlayer.play(currentTrial.audio)
  }
}

const startGame = async () => {
  if ($isPlaying) {
    return
  }
  isPlaying.set(true)
  gameMeta = { ...game.meta, start: Date.now() }
  gameDisplayInfo.set(gameMeta)
  audioPlayer.cacheAudioSource(gameSettings.audioSource)
  trials = structuredClone(game.trials)
  scoresheet = new Array(trials.length).fill().map(() => ({}))
  presentation.highlight = true
  selectTrial(0)
}

const endGame = async (status) => {
  if (!$isPlaying) {
    return
  }

  if (status === 'completed') {
    try {
      await delay(100)
    } catch {
      // ignore
    }
  }

  const gameInfoRecord = { ...gameMeta, timestamp: Date.now() }
  if (trialsIndex > gameInfoRecord.nBack) {
    await analytics.scoreTallyTrials(gameInfoRecord, status === 'completed' ? scoresheet : scoresheet.slice(0, trialsIndex), status)
  } else {
    console.debug('Game not recorded', trialsIndex, gameInfoRecord, scoresheet, trials)
  }
  timeoutCancelFns.forEach(fn => fn())
  resetRuntimeData()
  tallyFeedback.reset()
}

const toggleGame = () => {
  if ($isPlaying) {
    endGame('cancelled')
  } else {
    startGame()
  }
}

const handleCount = (count) => {
  if (!isPlaying || scoresheet.length <= trialsIndex || scoresheet[trialsIndex].success !== undefined) {
    return
  }

  if (trialsIndex < gameDisplayInfo.nBack) {
    selectTrial(trialsIndex + 1)
    return
  }

  tallyFeedback.reset()
  scoresheet[trialsIndex].success = count === currentTrial.matches.length
  scoresheet[trialsIndex].count = currentTrial.matches.length
  if (scoresheet[trialsIndex].success) {
    tallyFeedback.apply({ [count]: 'success' })
  } else {
    tallyFeedback.apply({ [count]: 'failure', [currentTrial.matches.length]: 'success' })
  }
  selectTrial(trialsIndex + 1)
}

const handleKey = (event) => {
  switch (event.code) {
    case 'Space':
      startGame()
      break
    case 'Escape':
      endGame('cancelled')
      break
  }

  for (const key of keys) {
    if (key.toString() === event.key) {
      handleCount(key)
    }
  }
}

const suppressKey = (event) => {
  event.preventDefault()
}

document.addEventListener('keydown', handleKey)

onDestroy(async () => {
  await endGame('cancelled')
  document.removeEventListener('keydown', handleKey)
})

</script>

{#if $settings.mode === 'vtally'}
<VisualCrank trial={currentTrial} {nextTrial} {presentation} trialIndex={trialsIndex} />
{:else}
<Grid trial={currentTrial} {nextTrial} {presentation} {gameId} />
{/if}
<div class="stretch grid grid-cols-[1fr_3fr_3fr_1fr] "
  class:grid-rows-[10fr_70fr_8fr]={!isMobile}
  class:grid-rows-[8fr_60fr_15fr]={isMobile}>
{#if isMobile}
  <div class="w-full h-full flex items-center justify-center text-4xl row-start-1 col-start-1 select-none opacity-30 p-8 pl-10">{trialDisplay}</div>
  <div class="w-full h-full flex items-center justify-center row-start-1 col-start-4 col-span-1 p-8">
    <button class="game-button text-4xl p-8"
      on:click={toggleGame}
      on:keydown={suppressKey}
      on:keypress={suppressKey}
      on:keyup={suppressKey}
      tabindex="-1"
    >{#if $isPlaying} Stop {:else} Play {/if}</button>
  </div>
{:else}
  <div class="w-full h-full flex items-center justify-center text-6xl row-start-1 col-start-1 select-none opacity-30">{trialDisplay}</div>
  <div class="w-full h-full flex items-center justify-between row-start-1 col-start-4 col-span-1 px-2">
    <div></div>
    <button class="game-button text-5xl px-12 py-10 max-w-[90%] mr-4"
      on:click={toggleGame}
      on:keydown={suppressKey}
      on:keypress={suppressKey}
      on:keyup={suppressKey}
      tabindex="-1"
    >{#if $isPlaying} Stop {:else} Play {/if}</button>
  </div>
{/if}
  <div class="w-full h-full flex gap-1 items-center justify-around py-1 row-start-3"
    class:col-start-2={!isMobile}
    class:col-span-2={!isMobile}
    class:coll-start-1={isMobile}
    class:col-span-4={isMobile}>
    {#each keys as key (key)}
      <NumberKey count={key} {handleCount}>{key}</NumberKey>
    {/each}
  </div>
</div>