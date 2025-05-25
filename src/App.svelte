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
import { addGame } from "./lib/gamedb"

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
let gameInfo
let presentation
let timeoutCancelFns

const resetRuntimeData = () => {
  isPlaying = false
  trials = []
  currentTrial = {}
  trialsIndex = 0
  gameInfo = {}
  presentation = { highlight: false }
  timeoutCancelFns = []
}

resetRuntimeData()

$: theme = $settings.theme === 'dark' ? 'black' : 'bumblebee'
$: isMobile = $mobile
$: gameSettings = $settings.gameSettings[$settings.mode]
$: game = generateGame(gameSettings)
$: trialDisplay = game.trials.length - trialsIndex
$: title = isPlaying ? gameInfo.title : game.meta.title

const scoreTrials = () => {
  const scores = {}
  for (const tag of gameInfo.tags) {
    scores[tag] = { hits: 0, misses: 0 }
  }

  for (let i = 0; i < trialsIndex; i++) {
    const trial = trials[i]
    for (const tag of gameInfo.tags) {
      if (trial.answers[tag]) {
        scores[tag].hits++
      } else {
        scores[tag].misses++
      }
    }
  }

  analytics.addGame
  addGame({
    ...gameInfo,
    scores,
    completedTrials: trialsIndex,
    status: trialsIndex >= trials.length ? 'completed' : 'incomplete'
  })
}

const detectMissedStimuli = () => {
  feedback.reset()
  for (const match of currentTrial.matches) {
    if (!(match in currentTrial.answers)) {
      currentTrial.answers[match] = false
      feedback.apply(match, 'late-failure')
    }
  }
}

const selectTrial = (i) => {
  currentTrial = trials[i]
  trialsIndex = i
}

const playTrial = async (i) => {
  if (i >= trials.length) {
    endGame()
    return
  }

  selectTrial(i)
  presentation.highlight = true
  const audioWait = audioPlayer.play(currentTrial.audio)
  const presentationWait = delay(Math.min(2000, gameInfo.trialTime - 350)).then(() => presentation.highlight = false)
  const trialWait = delay(gameInfo.trialTime)
  await Promise.all([audioWait, presentationWait, trialWait])
  detectMissedStimuli()
  await playTrial(i + 1)
}

const startGame = async () => {
  if (isPlaying) {
    return
  }

  isPlaying = true
  gameInfo = { ...game.meta }
  trials = structuredClone(game.trials)
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
  scoreTrials()
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

const checkForMatch = (type) => {
  if (!isPlaying) {
    return
  }

  if (type in currentTrial && !(type in currentTrial.answers)) {
    const isSuccess = currentTrial.matches.includes(type)
    currentTrial.answers[type] = isSuccess
    feedback.apply(type, isSuccess ? 'success' : 'failure')
  }
}

const handleKey = (key) => {
  switch (key) {
    case ' ':
      startGame()
      break
    case 'A':
      checkForMatch('position')
      break
    case 'F':
      checkForMatch('color')
      break
    case 'J':
      checkForMatch('shape')
      break
    case 'L':
      checkForMatch('audio')
      break
  }
}

document.addEventListener('keydown', e => handleKey(e.key))

</script>

<main data-theme={theme} class={$settings.theme}>

<Drawer {title}>
    <Cube trial={currentTrial} {presentation} />
    {#if isMobile}
    <div class="stretch grid grid-rows-[1fr_7fr_2fr] md:grid-rows-[1fr_8fr_2fr] gap-1">
      <div class="w-full h-full flex items-center justify-between row-start-1 p-8">
        <div class="text-4xl ml-2 select-none" >{trialDisplay}</div>
        <button class="game-button text-4xl p-8 md:p-10" on:click={toggleGame}>{#if isPlaying} Stop {:else} Play {/if}</button>
      </div>
      <div class="flex w-full h-full gap-1 row-start-3 md:mt-6">
        <button class="game-button-sm {$feedback.position}" on:click={() => checkForMatch('position')}>A<span class="game-button-sm-hint">Position</span></button>
        <button class="game-button-sm {$feedback.color}" on:click={() => checkForMatch('color')}>F<span class="game-button-sm-hint">Color</span></button>
        <button class="game-button-sm {$feedback.shape}" on:click={() => checkForMatch('shape')}>J<span class="game-button-sm-hint">Shape</span></button>
        <button class="game-button-sm {$feedback.audio}" on:click={() => checkForMatch('audio')}>L<span class="game-button-sm-hint">Audio</span></button>
      </div>
    </div>
    {:else}
    <div class="stretch grid grid-cols-[1fr_3fr_3fr_1fr] grid-rows-[1fr_6fr_1fr]">
      <div class="w-full h-full flex items-center justify-between col-start-1 col-span-4 px-2">
        <div></div>
        <button class="game-button text-5xl px-12 py-10 max-w-[90%] mr-4" on:click={toggleGame}>{#if isPlaying} Stop {:else} Play {/if}</button>
      </div>
      <div class="game-button-lg-group row-start-2 col-start-1 pr-24">
        <button disabled={$feedback.position === 'disabled'} class="game-button-lg {$feedback.position}" on:click={() => checkForMatch('position')}>A<span class="game-button-lg-hint">Position</span></button>
        <button disabled={$feedback.color === 'disabled'} class="game-button-lg {$feedback.color}" on:click={() => checkForMatch('color')}>F<span class="game-button-lg-hint">Color</span></button>
      </div>
      <div class="game-button-lg-group row-start-2 col-start-4 pl-24">
        <button disabled={$feedback.audio === 'disabled'} class="game-button-lg {$feedback.audio}" on:click={() => checkForMatch('audio')}>L<span class="game-button-lg-hint">Audio</span></button>
        <button disabled={$feedback.shape === 'disabled'} class="game-button-lg {$feedback.shape}" on:click={() => checkForMatch('shape')}>J<span class="game-button-lg-hint">Shape</span></button>
      </div>
      <div class="w-full h-full flex items-center justify-center text-6xl ml-6 row-start-3 col-start-4 select-none">{trialDisplay}</div>
    </div>
    {/if}
</Drawer>
</main>

<style>
.game-button-sm.disabled {
  display: none;
}

button.success {
  background-color: #738e41;
}

.dark button.success {
  background-color: #4d744e;
}

button.failure {
  background-color: #f1483c;
}

.dark button.failure {
  background-color: #903535;
}

button.late-failure {
  background-color: #F49F31;
}

.dark button.late-failure {
  background-color: #a6712c;
}


</style>
