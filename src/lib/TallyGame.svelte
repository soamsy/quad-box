<script>
import Grid from "./Grid.svelte"
import NumberKey from "./NumberKey.svelte"
import { generateTallyGame } from "./nback"
import { onDestroy } from "svelte"
import { audioPlayer } from "./audioPlayer"
import { settings } from "../stores/settingsStore"
import { tallyFeedback } from "../stores/tallyFeedbackStore"
import { analytics } from "../stores/analyticsStore"
import { mobile } from "../stores/mobileStore"
import { isPlaying, gameInfo } from "../stores/gameRunningStore"
import { get } from "svelte/store"

let trials
let currentTrial
let trialsIndex
let scoresheet = []
let presentation
let timeoutCancelFns
let gameId = 0

const resetRuntimeData = () => {
  isPlaying.set(false)
  gameInfo.set({})
  trials = []
  currentTrial = {}
  trialsIndex = 0
  scoresheet = []
  presentation = { highlight: false, flash: false }
  timeoutCancelFns = []
  gameId++
}

resetRuntimeData()

const applyGame = (game, isPlaying) => {
  if (!isPlaying) {
    gameInfo.set(game.meta)
  }
}

// $: isMobile = $mobile
$: gameSettings = $settings.gameSettings[$settings.mode]
$: game = generateTallyGame(gameSettings, $settings, gameId)
$: applyGame(game, $isPlaying)
$: trialDisplay = $settings.feedback === 'show' ? game.trials.length - trialsIndex : ''
$: keys = gameInfo.getNumberKeys($gameInfo)

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
  if (currentTrial.audio) {
    audioPlayer.play(currentTrial.audio)
  }
}

const startGame = async () => {
  if ($isPlaying) {
    return
  }
  isPlaying.set(true)
  gameInfo.set({ ...game.meta, start: Date.now() })
  audioPlayer.cacheAudioSource($settings.audioSource)
  trials = structuredClone(game.trials)
  scoresheet = new Array(trials.length).fill().map(() => ({}))
  presentation.highlight = true
  selectTrial(0)
}

const endGame = async (status) => {
  if (!$isPlaying) {
    return
  }

  const gameInfoRecord = { ...get(gameInfo), timestamp: Date.now() }
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

  if (trialsIndex < gameInfo.nBack) {
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

<Grid trial={currentTrial} {presentation} />
<div class="stretch grid grid-cols-[1fr_3fr_3fr_1fr] grid-rows-[1fr_6fr_1fr]">
  <div class="w-full h-full flex items-center justify-between col-start-1 col-span-4 px-2">
    <div></div>
    <button class="game-button text-5xl px-12 py-10 max-w-[90%] mr-4"
      on:click={toggleGame}
      on:keydown={suppressKey}
      on:keypress={suppressKey}
      on:keyup={suppressKey}
      tabindex="-1"
    >{#if $isPlaying} Stop {:else} Play {/if}</button>
  </div>
  <div class="w-full h-full flex gap-2 items-center justify-around py-1 row-start-4 col-start-1 col-span-4">
    {#each keys as key (key)}
      <NumberKey count={key} {handleCount}>{key}</NumberKey>
    {/each}
  </div>
  <div class="w-full h-full flex items-center justify-center text-6xl row-start-3 col-start-4 select-none opacity-30">{trialDisplay}</div>
</div>