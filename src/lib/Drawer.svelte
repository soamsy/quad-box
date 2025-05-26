<script>
export let title
import { ChartColumn, PanelLeftClose, PanelLeftOpen } from '@lucide/svelte'
import { onMount } from 'svelte'
import { settings } from '../stores/settingsStore'
import GameSettings from './GameSettings.svelte'
import ModeSwapper from './ModeSwapper.svelte'
import ThemeSwapper from './ThemeSwapper.svelte'
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

$: gameSettings = $settings.gameSettings[$settings.mode]
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
    <div class="flex gap-4 text-2xl lg:text-lg select-none">
      <div>N = {gameSettings.nBack}</div>
      <div>{title.toUpperCase()}</div>
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
      class="top-0 left-0 h-full overflow-y-auto w-90 sm:w-72 bg-base-200 border-r-1 shadow-lg transform transition-transform duration-150 z-50"
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
        <div class="flex flex-col gap-1">
          <label class="text-lg">Rotation Speed: {$settings.rotationSpeed}
            <input type="range" min="1" max="120" bind:value={$settings.rotationSpeed} step="1" class="range" />
          </label>
        </div>
        <div class="grid grid-cols-[4fr_6fr] items-center gap-4">
          <span class="text-lg">Feedback:</span>
          <select bind:value={$settings.feedback} id="feedback-select" class="select">
            <option value="hide">Hide</option>
            <option value="show">Show</option>
          </select>
        </div>
        <div class="grid grid-cols-[4fr_6fr] items-center gap-4">
          <span class="text-lg">Sounds:</span>
          <select bind:value={$settings.audioSource} id="audio-select" class="select">
            <option value="letters">Letters</option>
            <option value="numbers">Numbers</option>
          </select>
        </div>
      </div>
      <div class="my-10"></div>
    </nav>

    <div class="relative w-screen h-full transition-transform duration-150 dark:bg-[#232323] bg-white">
      <slot />
    </div>
  </div>
</div>