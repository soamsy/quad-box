<script>
import Drawer from "./lib/Drawer.svelte"
import Cube from "./lib/Cube.svelte"
import LargeKey from "./lib/LargeKey.svelte"
import SmallKey from "./lib/SmallKey.svelte"
import ErrorDisplay from "./lib/ErrorDisplay.svelte"
import { settings } from "./stores/settingsStore"
import { feedback } from "./stores/feedbackStore"
import { analytics } from "./stores/analyticsStore"
import { mobile, setMobile } from "./stores/mobileStore"
import { generateGame } from "./lib/nback"
import { onMount, onDestroy } from "svelte"
import { getAudioPool } from "./lib/constants"
import { audioPlayer } from "./lib/audioPlayer"
import { runAutoProgression } from "./lib/autoProgression"

let isPlaying
let trials
let currentTrial
let trialsIndex
let scoresheet = []
let gameInfo
let presentation
let timeoutCancelFns
let gameId = 0

const resetRuntimeData = () => {
  isPlaying = false
  trials = []
  currentTrial = {}
  trialsIndex = 0
  scoresheet = []
  gameInfo = {}
  presentation = { highlight: false }
  timeoutCancelFns = []
  gameId++
}

resetRuntimeData()

$: theme = $settings.theme === 'dark' ? 'black' : 'bumblebee'
$: isMobile = $mobile
$: gameSettings = $settings.gameSettings[$settings.mode]
$: game = generateGame(gameSettings, $settings, gameId)
$: trialDisplay = $settings.feedback === 'show' ? game.trials.length - trialsIndex : ''
$: title = isPlaying ? gameInfo.title : game.meta.title

const playTrial = async (i) => {
  if (!isPlaying) {
    return
  }

  if (i >= trials.length) {
    await delay(700)
    await endGame('completed')
    return
  }

  selectTrial(i)
  presentation.highlight = true
  const audioWait = currentTrial.audio ? audioPlayer.play(currentTrial.audio) : Promise.resolve()
  const presentationWait = delay(Math.min(2000, gameInfo.trialTime - 350)).then(() => presentation.highlight = false)
  const trialWait = delay(gameInfo.trialTime)
  await Promise.all([audioWait, presentationWait, trialWait])
  detectMissedStimuli()
  await playTrial(i + 1)
}

const selectTrial = (i) => {
  currentTrial = trials[i]
  trialsIndex = i
}

const startGame = async () => {
  if (isPlaying) {
    return
  }
  isPlaying = true
  cacheAudioFiles()
  gameInfo = { ...game.meta }
  trials = structuredClone(game.trials)
  scoresheet = new Array(trials.length).fill().map(() => ({}))
  selectTrial(0)
  try {
    await delay(700)
    await playTrial(0)
  } catch (e) {
    if (e.message === 'Timeout cancelled') {
      console.debug('Game cancelled', e)
    } else {
      throw e
    }
  }
}

const endGame = async (status) => {
  if (!isPlaying) {
    return
  }

  if (trialsIndex > gameInfo.nBack) {
    gameInfo.timestamp = Date.now()
    await analytics.scoreTrials(gameInfo, status === 'completed' ? scoresheet : scoresheet.slice(0, trialsIndex), status)
    if (status === 'completed') {
      await runAutoProgression(gameInfo)
    }
  } else {
    console.debug('Game not recorded', trialsIndex, gameInfo, scoresheet, trials)
  }
  timeoutCancelFns.forEach(fn => fn())
  resetRuntimeData()
  feedback.reset()
}

const toggleGame = () => {
  if (isPlaying) {
    endGame('cancelled')
  } else {
    startGame()
  }
}

const detectMissedStimuli = () => {
  if (!('tags' in gameInfo)) {
    return
  }
  let updates = {}
  for (const tag of gameInfo.tags) {
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
  if (!isPlaying || trialsIndex < gameInfo.nBack) {
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
      rejectFn(new Error('Timeout cancelled'))
      timeoutId = undefined
    }
  }

  timeoutCancelFns.push(cancel)

  return promise
}

onMount(() => {
  setMobile()
})

const cacheAudioFiles = () => {
  getAudioPool($settings.audioSource).forEach(audio => {
    audioPlayer.preload(audio)
  })
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
        checkForMatch('shapeColor')
      }
    }
  }
}

const suppressKey = (event) => {
  event.preventDefault()
}

const onResize = () => setMobile()
const onOrientationChange = () => setMobile()
window.addEventListener('resize', onResize)
window.addEventListener('orientationchange', onOrientationChange)
document.addEventListener('keydown', handleKey)

const handleTouchStart = (event) => {
  for (const touch of event.changedTouches) {
    const target = document.elementFromPoint(touch.clientX, touch.clientY)
    if (target?.classList.contains('stimulus-button')) {
      target.click()
    }
  }
}
document.addEventListener('touchstart', handleTouchStart)
const handleTouchMove = (event) => {
  for (const touch of event.touches) {
    const target = document.elementFromPoint(touch.clientX, touch.clientY)
    if (target?.classList.contains('stimulus-button')) {
      target.click()
    }
  }
}
document.addEventListener('touchmove', handleTouchMove)

onDestroy(async () => {
  await endGame('cancelled')
  window.removeEventListener('resize', onResize)
  window.removeEventListener('orientationchange', onOrientationChange)
  document.removeEventListener('keydown', handleKey)
  document.removeEventListener('touchstart', handleTouchStart)
  document.removeEventListener('touchmove', handleTouchMove)
})

</script>

<main data-theme={theme} class={$settings.theme}>
<ErrorDisplay />
<Drawer {title} {isPlaying}>
    <Cube trial={currentTrial} {presentation} />
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
        >{#if isPlaying} Stop {:else} Play {/if}</button>
      </div>
      <div class="grid grid-cols-[repeat(auto-fit,minmax(0,1fr))] grid-rows-1 max-w-full gap-1 row-start-3 md:mt-6">
        <SmallKey field="position" display="Position" {isPlaying} {checkForMatch}></SmallKey>
        <SmallKey field="color" display="Color" {isPlaying} {checkForMatch}></SmallKey>
        <SmallKey field="shape" display="Shape" {isPlaying} {checkForMatch}></SmallKey>
        <SmallKey field="shapeColor" display="Pattern" {isPlaying} {checkForMatch}></SmallKey>
        <SmallKey field="audio" display="Audio" {isPlaying} {checkForMatch}></SmallKey>
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
        >{#if isPlaying} Stop {:else} Play {/if}</button>
      </div>
      <div class="game-button-lg-group row-start-2 col-start-1 pr-24">
        {#if !gameSettings.enableShapeColor}
        <LargeKey field="color" display="Color" {isPlaying} {checkForMatch}></LargeKey>
        {/if}
        <LargeKey field="position" display="Position" {isPlaying} {checkForMatch}></LargeKey>
      </div>
      <div class="game-button-lg-group row-start-2 col-start-4 pl-24">
        {#if gameSettings.enableShapeColor}
        <LargeKey field="shapeColor" display="Pattern" {isPlaying} {checkForMatch}></LargeKey>
        {:else}
        <LargeKey field="shape" display="Shape" {isPlaying} {checkForMatch}></LargeKey>
        {/if}
        <LargeKey field="audio" display="Audio" {isPlaying} {checkForMatch}></LargeKey>
      </div>
      <div class="w-full h-full flex items-center justify-center text-6xl ml-6 row-start-3 col-start-4 select-none opacity-30">{trialDisplay}</div>
    </div>
    {/if}
</Drawer>
</main>

<style>
</style>
