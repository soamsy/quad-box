<script>
import Drawer from "./lib/Drawer.svelte"
import Cube from "./lib/Cube.svelte"
import Grid from "./lib/Grid.svelte"
import LargeKey from "./lib/LargeKey.svelte"
import SmallKey from "./lib/SmallKey.svelte"
import ErrorDisplay from "./lib/ErrorDisplay.svelte"
import { settings } from "./stores/settingsStore"
import { feedback } from "./stores/feedbackStore"
import { analytics } from "./stores/analyticsStore"
import { mobile, setMobile } from "./stores/mobileStore"
import { generateGame } from "./lib/nback"
import { onMount, onDestroy } from "svelte"
import { LETTER_AUDIO_POOL, LETTER_2_AUDIO_POOL, NUMBER_AUDIO_POOL } from "./lib/constants"
import { audioPlayer } from "./lib/audioPlayer"

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
  presentation = { highlight: false, flash: false }
  timeoutCancelFns = []
  gameId++
}

resetRuntimeData()

$: theme = $settings.theme === 'dark' ? 'luxury' : 'cyberpunk'
$: isMobile = $mobile
$: gameSettings = $settings.gameSettings[$settings.mode]
$: game = generateGame(gameSettings, $settings, gameId)
$: trialDisplay = $settings.feedback === 'show' ? game.trials.length - trialsIndex : ''
$: title = isPlaying ? gameInfo.title : game.meta.title

const flashCube = async () => {
  presentation.flash = true
  try {
    await delay(200)
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
}

const startGame = async () => {
  if (isPlaying) {
    return
  }

  isPlaying = true
  gameInfo = { ...game.meta }
  gameInfo.start = Date.now()
  trials = structuredClone(game.trials)
  scoresheet = new Array(trials.length).fill().map(() => ({}))
  presentation.highlight = true
  selectTrial(0)
}

const endGame = async (status) => {
  if (!isPlaying) {
    return
  }

  if (trialsIndex > gameInfo.nBack) {
    gameInfo.timestamp = Date.now()
    await analytics.scoreTrials(gameInfo, status === 'completed' ? scoresheet : scoresheet.slice(0, trialsIndex), status)
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

const handleCount = (count) => {
  if (!isPlaying || scoresheet[trialsIndex].success !== undefined) {
    return
  }

  if (trialsIndex < gameInfo.nBack) {
    selectTrial(trialsIndex + 1)
    return
  }

  feedback.reset()
  scoresheet[trialsIndex].success = count === currentTrial.matches.length
  scoresheet[trialsIndex].count = currentTrial.matches.length
  if (scoresheet[trialsIndex].success) {
    feedback.apply({ [count]: 'success' })
  } else {
    feedback.apply({ [count]: 'failure', [currentTrial.matches.length]: 'success' })
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
    case 'Digit0':
    case 'Numpad0':
      handleCount(0)
      break
    case 'Digit1':
    case 'Numpad1':
      handleCount(1)
      break
    case 'Digit2':
    case 'Numpad2':
      handleCount(2)
      break
    case 'Digit3':
    case 'Numpad3':
      handleCount(3)
      break
    case 'Digit4':
    case 'Numpad4':
      handleCount(4)
      break
  }
}

onMount(() => {
  setMobile()
})

const cacheAudioFiles = (audioSource) => {
  switch (audioSource) {
    case 'letters':
      LETTER_AUDIO_POOL.forEach(audio => {
        audioPlayer.preload(audio)
      })
      break
    case 'numbers':
      NUMBER_AUDIO_POOL.forEach(audio => {
        audioPlayer.preload(audio)
      })
      break
    default:
      LETTER_2_AUDIO_POOL.forEach(audio => {
        audioPlayer.preload(audio)
      })
      break
  }
}

const onResize = () => setMobile()
const onOrientationChange = () => setMobile()
window.addEventListener('resize', onResize)
window.addEventListener('orientationchange', onOrientationChange)
document.addEventListener('keydown', handleKey)

const suppressKey = (event) => {
  event.preventDefault()
}

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

$: audioSource = $settings.audioSource
$: cacheAudioFiles(audioSource)

</script>

<main data-theme={theme} class={$settings.theme}>
<ErrorDisplay />
<Drawer {title} {isPlaying}>
    {#if $settings.mode === 'visual'}
    <Grid trial={currentTrial} {presentation} {trialsIndex} trialsCount={trials.length}/>
    {:else}
    <Cube trial={currentTrial} {presentation} />
    {/if}
    {#if isMobile}
    <div class="stretch grid grid-rows-[1fr_7fr_2fr] md:grid-rows-[1fr_8fr_2fr] gap-1">
      <div class="w-full h-full flex items-center justify-between row-start-1 p-8">
        <div class="text-4xl ml-2 select-none opacity-30" >{trialDisplay}</div>
        <button class="game-button text-4xl p-8 md:p-10"
          tabindex="-1"
          on:keydown={suppressKey}
          on:keypress={suppressKey}
          on:keyup={suppressKey}
          on:click={toggleGame}>{#if isPlaying} Stop {:else} Play {/if}</button>
      </div>
      <div class="grid grid-cols-[repeat(auto-fit,minmax(0,1fr))] grid-rows-1 max-w-full gap-1 row-start-3 md:mt-6">
        <SmallKey count={0} {handleCount}>0</SmallKey>
        <SmallKey field={1} {handleCount}>1</SmallKey>
        <SmallKey field={2} {handleCount}>2</SmallKey>
        <SmallKey field={3} {handleCount}>3</SmallKey>
        <SmallKey field={4} {handleCount}>3</SmallKey>
      </div>
    </div>
    {:else}
    <div class="stretch grid grid-cols-[1fr_3fr_3fr_1fr] grid-rows-[1fr_6fr_1fr]">
      <div class="w-full h-full flex items-center justify-between col-start-1 col-span-4 px-2">
        <div></div>
        <button class="game-button text-5xl px-12 py-10 max-w-[90%] mr-4"
          tabindex="-1"
          on:keydown={suppressKey}
          on:keypress={suppressKey}
          on:keyup={suppressKey}
          on:click={toggleGame}>{#if isPlaying} Stop {:else} Play {/if}</button>
      </div>
      <div class="game-button-lg-group row-start-2 col-start-1 pr-24">
        <LargeKey field={0} {handleCount}>0</LargeKey>
        <LargeKey field={1} {handleCount}>1</LargeKey>
        <LargeKey field={2} {handleCount}>2</LargeKey>
        <LargeKey field={3} {handleCount}>3</LargeKey>
        <LargeKey field={4} {handleCount}>4</LargeKey>
      </div>
      <div class="w-full h-full flex items-center justify-center text-6xl ml-6 row-start-3 col-start-4 select-none opacity-30">{trialDisplay}</div>
    </div>
    {/if}
</Drawer>
</main>

<style>
</style>
