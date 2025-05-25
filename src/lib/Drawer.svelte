<script>
import { onMount } from 'svelte'
import { settings } from '../stores/settingsStore'
import { PanelLeft, ChartBar, ChartArea, ChartCandlestick, ChartBarStacked, ChartColumn, PanelLeftClose, SquareChevronLeft, PanelLeftOpen } from '@lucide/svelte'
import ThemeSwapper from './ThemeSwapper.svelte'
import ModeSwapper from './ModeSwapper.svelte'
let open = false

const toggle = () => open = !open
const close = () => open = false

let drawerRef
let panelButtonRef

function handleClickOutside(event) {
  if (open && !drawerRef.contains(event.target) && !panelButtonRef.contains(event.target)) {
    close()
  }
}

onMount(() => {
  document.addEventListener('click', handleClickOutside)
  return () => {
    document.removeEventListener('click', handleClickOutside)
  }
})
</script>

<div class="relative flex flex-col h-svh overflow-hidden">
  <div class="w-full h-16 lg:h-10 flex items-center justify-between bg-base-200 border-b-1 py-1">
    <div flex gap-4 pl-2>
      <div on:click|stopPropagation={toggle} bind:this={panelButtonRef}>
        {#if open}
          <PanelLeftClose class="btn btn-square btn-ghost h-8 lg:h-6" />
        {:else}
          <PanelLeftOpen class="btn btn-square btn-ghost h-8 lg:h-6" />
        {/if}
      </div>
    </div>
    <div class="flex gap-4 text-2xl lg:text-lg">
      <div>N = {$settings.nBack}</div>
      <div>QUAD</div>
    </div>
    <div class="flex gap-4 pr-2">
      <div>
        <ChartColumn class="btn btn-square btn-ghost h-8 lg:h-6" />
      </div>
    </div>
  </div>

  <div class="flex-auto flex overflow-x-hidden w-fit duration-150" class:-translate-x-90={!open} class:sm:-translate-x-72={!open}>

    <nav
      bind:this={drawerRef}
      class="top-0 left-0 h-full w-90 sm:w-72 bg-base-200 border-r-1 shadow-lg transform transition-transform duration-150 z-50"
    >
      <div class="flex w-full flex-col px-4 gap-2">
        <div class="text-xl font-semibold flex justify-between items-center pt-4">
          <span>Settings</span>
          <ThemeSwapper />
        </div>
        <div class="w-full border-b-1 my-1"></div>
        <ModeSwapper />
        <div class="flex flex-col gap-1">
          <label class="text-lg">N-back: {$settings.nBack}
            <input type="range" min="1" max="12" bind:value={$settings.nBack} class="range" />
          </label>
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-lg">Trial Time: {$settings.trialTime}ms
            <input type="range" min="1000" max="5000" bind:value={$settings.trialTime} step="100" class="range" />
          </label>
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-lg">Match Chance: {$settings.matchChance}%
            <input type="range" min="0" max="100" bind:value={$settings.matchChance} step="1" class="range" />
          </label>
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-lg">Interference: {$settings.interference}%
            <input type="range" min="0" max="100" bind:value={$settings.interference} step="1" class="range" />  
          </label>
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-lg">Rotation Speed: {$settings.rotationSpeed}
            <input type="range" min="1" max="120" bind:value={$settings.rotationSpeed} step="1" class="range" />
          </label>
        </div>
        <div class="grid grid-cols-[4fr_6fr] items-center gap-4">
          <span class="text-lg">Feedback:</span>
          <select bind:value={$settings.feedback} id="feedback-select" class="select">
            <option value="none">None</option>
            <option value="show">Show</option>
          </select>
        </div>
        <div class="grid grid-cols-[4fr_6fr] items-center gap-4">
          <span class="text-lg">Audio:</span>
          <select bind:value={$settings.audioSource} id="audio-select" class="select">
            <option value="numbers">Numbers</option>
            <option value="primes">Primes</option>
          </select>
        </div>
      </div>
    </nav>

    <div class="relative w-screen h-full transition-transform duration-150 dark:bg-neutral-800 bg-white">
      <slot />
    </div>
  </div>
</div>