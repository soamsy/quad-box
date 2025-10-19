<script>
import Grid from "./Grid.svelte"
import LargeKey from "./LargeKey.svelte"
import SmallKey from "./SmallKey.svelte"
import { generateGame } from "./nback"
import { onDestroy } from "svelte"
import { audioPlayer } from "./audioPlayer"
import { runAutoProgression } from "./autoProgression"
import { settings } from "../stores/settingsStore"
import { feedback } from "../stores/feedbackStore"
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
  presentation = { highlight: false }
  timeoutCancelFns = []
  gameMeta = {}
  gameId++
}

resetRuntimeData()

const applyGame = (game, isPlaying) => {
  if (!isPlaying) {
    gameMeta = { ...game.meta }
    gameDisplayInfo.set(gameMeta)
  }
}

$: isMobile = $mobile
$: gameSettings = $settings.gameSettings[$settings.mode]
$: game = generateGame(gameSettings, $settings, gameId)
$: applyGame(game, $isPlaying)
$: trialDisplay = $settings.feedback === 'show' ? game.trials.length - trialsIndex : ''

const playTrial = async (i) => {
  if (!$isPlaying) {
    return
  }

  if (i >= trials.length) {
    await delay(700)
    await endGame('completed')
    return
  }

  selectTrial(i)
  presentation.highlight = true
  const audioWait = currentTrial.audio ? makeCancellable(audioPlayer.play(currentTrial.audio)) : Promise.resolve()
  const presentationWait = delay(Math.min(2000, $gameDisplayInfo.trialTime - 350)).then(() => presentation.highlight = false)
  const trialWait = delay($gameDisplayInfo.trialTime)
  await Promise.all([audioWait, presentationWait, trialWait])
  detectMissedStimuli()
  await playTrial(i + 1)
}

const selectTrial = (i) => {
  currentTrial = trials[i]
  if (i < trials.length - 1) {
    nextTrial = trials[i+1]
  }
  trialsIndex = i
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
  nextTrial = trials[0]
  scoresheet = new Array(trials.length).fill().map(() => ({}))
  selectTrial(0)
  try {
    await delay(700)
    await playTrial(0)
  } catch (e) {
    if (e.message === 'Game cancelled') {
      console.debug('Game cancelled', e)
    } else {
      throw e
    }
  }
}

const endGame = async (status) => {
  if (!$isPlaying) {
    return
  }

  const gameInfoRecord = { ...gameMeta, timestamp: Date.now() }
  if (trialsIndex > gameInfoRecord.nBack) {
    await analytics.scoreTrials(gameInfoRecord, status === 'completed' ? scoresheet : scoresheet.slice(0, trialsIndex), status)
    if (status === 'completed') {
      await runAutoProgression(gameInfoRecord)
    }
  } else {
    console.debug('Game not recorded', trialsIndex, gameInfoRecord, scoresheet, trials)
  }
  timeoutCancelFns.forEach(fn => fn())
  resetRuntimeData()
  feedback.reset()
}

const toggleGame = () => {
  if ($isPlaying) {
    endGame('cancelled')
  } else {
    startGame()
  }
}

const detectMissedStimuli = () => {
  if (!('tags' in $gameDisplayInfo)) {
    return
  }
  let updates = {}
  for (const tag of $gameDisplayInfo.tags) {
    if (currentTrial.matches.includes(tag) &&!(tag in scoresheet[trialsIndex])) {
      scoresheet[trialsIndex][tag] = false
      updates[tag] = 'late-failure'
    } else {
      updates[tag] = 'blank'
    }
  }
  feedback.apply(updates)
}

const checkForMatch = (type) => {
  if (!$isPlaying || trialsIndex < $gameDisplayInfo.nBack) {
    return
  }

  if (type in currentTrial && !(type in scoresheet[trialsIndex])) {
    const isSuccess = currentTrial.matches.includes(type)
    scoresheet[trialsIndex][type] = isSuccess
    feedback.apply({ [type]: isSuccess ? 'success' : 'failure' })
  }
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
      rejectFn(new Error('Game cancelled'))
      timeoutId = undefined
    }
  }

  timeoutCancelFns.push(cancel)

  return promise
}

const makeCancellable = (originalPromise) => {
  let cancelFn

  const wrappedPromise = new Promise((resolve, reject) => {
    cancelFn = () => reject(new Error('Game cancelled'))
    originalPromise.then(resolve, reject)
  })

  timeoutCancelFns.push(cancelFn)

  return wrappedPromise
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

  const hotkeys = $settings.hotkeys
  for (const [action, key] of Object.entries(hotkeys)) {
    if (key.toUpperCase() === event.key.toUpperCase()) {
      checkForMatch(action)
      if (action === 'shape') {
        checkForMatch('image')
      }
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


<Grid trial={currentTrial} {nextTrial} {presentation} {gameId} />
{#if isMobile}
<div class="stretch grid grid-rows-[1fr_7fr_2fr] md:grid-rows-[1fr_8fr_2fr] gap-1">
  <div class="w-full h-full flex items-center justify-between row-start-1 p-8">
    <div class="text-4xl ml-2 select-none opacity-30" >{trialDisplay}</div>
    <button class="game-button text-4xl p-8 md:p-10"
      on:click={toggleGame}
      on:keydown={suppressKey}
      on:keypress={suppressKey}
      on:keyup={suppressKey}
      tabindex="-1"
    >{#if $isPlaying} Stop {:else} Play {/if}</button>
  </div>
  <div class="grid grid-cols-[repeat(auto-fit,minmax(0,1fr))] grid-rows-1 max-w-full gap-1 row-start-3 md:mt-6">
    <SmallKey field="position" display="Position" isPlaying={$isPlaying} {checkForMatch}></SmallKey>
    <SmallKey field="color" display="Color" isPlaying={$isPlaying} {checkForMatch}></SmallKey>
    <SmallKey field="shape" display="Shape" isPlaying={$isPlaying} {checkForMatch}></SmallKey>
    <SmallKey field="image" display="Image" isPlaying={$isPlaying} {checkForMatch}></SmallKey>
    <SmallKey field="audio" display="Audio" isPlaying={$isPlaying} {checkForMatch}></SmallKey>
  </div>
</div>
{:else}
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
  <div class="game-button-lg-group row-start-2 col-start-1 pr-24">
    {#if !gameSettings.enableImage}
    <LargeKey field="color" display="Color" isPlaying={$isPlaying} {checkForMatch}></LargeKey>
    {/if}
    <LargeKey field="position" display="Position" isPlaying={$isPlaying} {checkForMatch}></LargeKey>
  </div>
  <div class="game-button-lg-group row-start-2 col-start-4 pl-24">
    {#if gameSettings.enableImage}
    <LargeKey field="image" display="Image" isPlaying={$isPlaying} {checkForMatch}></LargeKey>
    {:else}
    <LargeKey field="shape" display="Shape" isPlaying={$isPlaying} {checkForMatch}></LargeKey>
    {/if}
    <LargeKey field="audio" display="Audio" isPlaying={$isPlaying} {checkForMatch}></LargeKey>
  </div>
  <div class="w-full h-full flex items-center justify-center text-6xl ml-6 row-start-3 col-start-4 select-none opacity-30">{trialDisplay}</div>
</div>
{/if}