<script>
export let title
import { PanelLeftClose, PanelLeftOpen } from '@lucide/svelte'
import { onMount } from 'svelte'
import { settings } from '../stores/settingsStore'
import { scores } from '../stores/scoreStore'
import { analytics } from '../stores/analyticsStore'
import { mobile } from '../stores/mobileStore'
import { autoProgression } from '../stores/autoProgressionStore'
import GameSettings from './GameSettings.svelte'
import ModeSwapper from './ModeSwapper.svelte'
import ThemeSwapper from './ThemeSwapper.svelte'
import ChartPopup from "./ChartPopup.svelte"
import InfoPopup from './InfoPopup.svelte'
export let isPlaying = false
let open = false

const toggle = () => open = !open
const close = () => open = false

let drawerRef
let panelButtonRef

const handleClickOutside = (event) => {
  if (open && !drawerRef.contains(event.target) && !panelButtonRef.contains(event.target)) {
    close()
  }
}

const updateSuccessCriteria = (value) => {
  settings.update('successCriteria', value)
  if ($settings.failureCriteria > value) {
    settings.update('failureCriteria', value)
  }
}

const updateFailureCriteria = (value) => {
  settings.update('failureCriteria', value)
  if ($settings.successCriteria < value) {
    settings.update('successCriteria', value)
  }
}

onMount(() => {
  document.addEventListener('click', handleClickOutside)
  return () => {
    document.removeEventListener('click', handleClickOutside)
  }
})

$: gameSettings = $settings.gameSettings[$settings.mode]
</script>

<div class="relative flex flex-col h-svh overflow-hidden">
  <div class="w-full h-16 lg:h-10 grid grid-cols-3 items-center bg-base-200 border-b-1 py-1 text-lg"
  class:text-2xl={$mobile}
  class:grid-cols-[1fr_3fr_1fr]={$mobile}
  class:grid-cols-[3fr_2fr_3fr]={!$mobile}
  >
    <div class="flex gap-2">
      <div on:click|stopPropagation={toggle} bind:this={panelButtonRef}>
        {#if open}
          <PanelLeftClose class="btn btn-square btn-ghost h-8 lg:h-6" />
        {:else}
          <PanelLeftOpen class="btn btn-square btn-ghost h-8 lg:h-6" />
        {/if}
      </div>
    </div>
    <div class="justify-self-center flex gap-4 select-none px-6"
      class:advance={$autoProgression.advance} 
      class:fallback={$autoProgression.fallback}>
      <div>N = {gameSettings.nBack}</div>
      <div>{title.toUpperCase()}</div>
      {#if $scores.total && $mobile}
      <div>{($scores.total.percent * 100).toFixed(0)}%</div>
      {/if}
    </div>
    <div class="justify-self-end flex items-center gap-4 pr-2">
      {#if !isPlaying && !$mobile && $analytics.playTime}
      <div>Today: {$analytics.playTime}</div>
      {/if}
      {#if $scores.total && !isPlaying && !$mobile}
      <div>Last: {($scores.total.percent * 100).toFixed(0)}%</div>
      {/if}
      <div class="flex">
        <InfoPopup />
        <ChartPopup />
      </div>
    </div>
  </div>

  <div class="flex-auto flex relative overflow-x-hidden w-fit duration-0">
    <nav
      bind:this={drawerRef}
      class="absolute top-0 left-0 h-full overflow-y-auto w-86 sm:w-72 bg-base-200 border-r-1 shadow-lg transform transition-transform duration-150 z-50"
      class:-translate-x-86={!open} class:sm:-translate-x-72={!open}
      >
      <div class="flex w-full flex-col px-4 gap-2">
        <div class="text-xl font-semibold flex justify-between items-center pt-4">
          <span>Settings</span>
          <ThemeSwapper />
        </div>
        <div class="w-full border-b-1 my-1"></div>
        <ModeSwapper />
        <GameSettings />
        <div class="py-2 divider"></div>
        <div class="grid grid-cols-[4fr_6fr] items-center gap-4">
          <span class="text-lg">Feedback:</span>
          <select bind:value={$settings.feedback} id="feedback-select" class="select">
            <option value="show">Show</option>
            <option value="hide">Hide</option>
          </select>
        </div>
        <div class="grid grid-cols-[4fr_6fr] items-center gap-4">
          <span class="text-lg">Sounds:</span>
          <select bind:value={$settings.audioSource} id="audio-select" class="select">
            <option value="letters">Letters</option>
            <option value="numbers">Numbers</option>
          </select>
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-lg">Rotation speed: {$settings.rotationSpeed}
            <input type="range" min="1" max="120" bind:value={$settings.rotationSpeed} step="1" class="range" />
          </label>
        </div>
        <div class="divider"></div>
        <div class="grid grid-cols-[8fr_2fr] items-center gap-4">
          <label for="enable-auto-progression" class="text-lg">Auto progression:</label>
          <input id="enable-auto-progression" type="checkbox" bind:checked={$settings.enableAutoProgression} class="toggle" />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-lg">When ≥ {$settings.successCriteria}%
            <input disabled={!$settings.enableAutoProgression} type="range" min="0" max="100" value={$settings.successCriteria} on:input={(e) => updateSuccessCriteria(+e.target.value)} step="1" class="range" />
          </label>
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-lg">Win after: {$settings.successComboRequired} in a row
            <input disabled={!$settings.enableAutoProgression} type="range" min="1" max="9" bind:value={$settings.successComboRequired} step="1" class="range" />
          </label>
        </div>
        <div class="flex flex-col gap-1 mt-4">
          <label class="text-lg">When &lt; {$settings.failureCriteria}%
            <input disabled={!$settings.enableAutoProgression} type="range" min="0" max="100" value={$settings.failureCriteria} on:input={(e) => updateFailureCriteria(+e.target.value)} step="1" class="range" />
          </label>
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-lg">Lose after: {$settings.failureComboRequired} in a row
            <input disabled={!$settings.enableAutoProgression} type="range" min="1" max="9" bind:value={$settings.failureComboRequired} step="1" class="range" />
          </label>
        </div>
      </div>
      <div class="my-10"></div>
    </nav>

    <div class="relative w-screen h-full transition-transform duration-150 dark:bg-[#232323] bg-[#FBFBFB]">
      <slot />
    </div>
  </div>
</div>