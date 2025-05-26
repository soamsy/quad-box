<script>
import Drawer from "./lib/Drawer.svelte"
import Cube from "./lib/Cube.svelte"
import { settings } from "./stores/settingsStore"
import { feedback } from "./stores/feedbackStore"
import { analytics } from "./stores/analyticsStore"
import { mobile, setMobile } from "./stores/mobileStore"
import { generateGame } from "./lib/nback"
import { onMount } from "svelte"
import { ALL_AUDIO } from "./lib/constants"
import { audioPlayer } from "./lib/audioPlayer"

onMount(() => {
  setMobile()
  ALL_AUDIO.forEach(audio => {
    audioPlayer.preload(audio)
  })
})
window.addEventListener('resize', () => setMobile())
window.addEventListener('orientationchange', () => setMobile())

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
$: trialDisplay = game.trials.length - trialsIndex
$: title = isPlaying ? gameInfo.title : game.meta.title

const playTrial = async (i) => {
  if (i >= trials.length) {
    endGame()
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
  gameInfo = { ...game.meta }
  trials = structuredClone(game.trials)
  scoresheet = new Array(trials.length).fill().map(() => ({}))
  selectTrial(0)
  try {
    await delay(1000)
    await playTrial(0)
  } catch {
    // ignore
  }
}

const endGame = () => {
  if (!isPlaying) {
    return
  }
  analytics.scoreTrials(gameInfo, scoresheet.slice(0, trialsIndex), trialsIndex >= trials.length ? 'completed' : 'incomplete')
  timeoutCancelFns.forEach(fn => fn())
  resetRuntimeData()
  feedback.reset()
}

const toggleGame = () => {
  if (isPlaying) {
    endGame()
  } else {
    startGame()
  }
}

const detectMissedStimuli = () => {
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

const handleKey = (code) => {
  switch (code) {
    case 'Space':
      startGame()
      break
    case 'KeyA':
      checkForMatch('position')
      break
    case 'KeyF':
      checkForMatch('color')
      break
    case 'KeyJ':
      checkForMatch('shape')
      break
    case 'KeyL':
      checkForMatch('audio')
      break
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

document.addEventListener('keydown', e => handleKey(e.code))

</script>

<main data-theme={theme} class={$settings.theme}>

<Drawer {title}>
    <Cube trial={currentTrial} {presentation} />
    {#if isMobile}
    <div class="stretch grid grid-rows-[1fr_7fr_2fr] md:grid-rows-[1fr_8fr_2fr] gap-1">
      <div class="w-full h-full flex items-center justify-between row-start-1 p-8">
        <div class="text-4xl ml-2 select-none opacity-30" >{trialDisplay}</div>
        <button class="game-button text-4xl p-8 md:p-10" on:click={toggleGame}>{#if isPlaying} Stop {:else} Play {/if}</button>
      </div>
      <div class="flex w-full h-full gap-1 row-start-3 md:mt-6">
        <button class="game-button-sm {$feedback.position}" on:click={() => checkForMatch('position')} on:touchmove={() => checkForMatch('position')}>A<span class="game-button-sm-hint">Position</span></button>
        <button class="game-button-sm {$feedback.color}" on:click={() => checkForMatch('color')} on:touchmove={() => checkForMatch('color')}>F<span class="game-button-sm-hint">Color</span></button>
        <button class="game-button-sm {$feedback.shape}" on:click={() => checkForMatch('shape')} on:touchmove={() => checkForMatch('shape')}>J<span class="game-button-sm-hint">Shape</span></button>
        <button class="game-button-sm {$feedback.audio}" on:click={() => checkForMatch('audio')} on:touchmove={() => checkForMatch('audio')}>L<span class="game-button-sm-hint">Audio</span></button>
      </div>
    </div>
    {:else}
    <div class="stretch grid grid-cols-[1fr_3fr_3fr_1fr] grid-rows-[1fr_6fr_1fr]">
      <div class="w-full h-full flex items-center justify-between col-start-1 col-span-4 px-2">
        <div></div>
        <button class="game-button text-5xl px-12 py-10 max-w-[90%] mr-4" on:click={toggleGame}>{#if isPlaying} Stop {:else} Play {/if}</button>
      </div>
      <div class="game-button-lg-group row-start-2 col-start-1 pr-24">
        <button disabled={$feedback.color === 'disabled'} class="game-button-lg {$feedback.color}" on:click={() => checkForMatch('color')} on:touchmove={() => checkForMatch('color')}>F<span class="game-button-lg-hint">Color</span></button>
        <button disabled={$feedback.position === 'disabled'} class="game-button-lg {$feedback.position}" on:click={() => checkForMatch('position')} on:touchmove={() => checkForMatch('position')}>A<span class="game-button-lg-hint">Position</span></button>
      </div>
      <div class="game-button-lg-group row-start-2 col-start-4 pl-24">
        <button disabled={$feedback.shape === 'disabled'} class="game-button-lg {$feedback.shape}" on:click={() => checkForMatch('shape')} on:touchmove={() => checkForMatch('shape')}>J<span class="game-button-lg-hint">Shape</span></button>
        <button disabled={$feedback.audio === 'disabled'} class="game-button-lg {$feedback.audio}" on:click={() => checkForMatch('audio')} on:touchmove={() => checkForMatch('audio')}>L<span class="game-button-lg-hint">Audio</span></button>
      </div>
      <div class="w-full h-full flex items-center justify-center text-6xl ml-6 row-start-3 col-start-4 select-none opacity-30">{trialDisplay}</div>
    </div>
    {/if}
</Drawer>
</main>

<style>
</style>
