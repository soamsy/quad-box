<script>
  export let trial = {}
  export let presentation = {}
  import Cell from "./Cell.svelte"
  import { POSITION_POOL } from "./constants"
  import { settings } from "../stores/settingsStore"
  import { mobile } from "../stores/mobileStore"
  import { LIGHT_PALETTE, DARK_PALETTE } from "./constants";

  $: lightColor = LIGHT_PALETTE?.[trial.color] ?? '#fff'
  $: darkColor = DARK_PALETTE?.[trial.color] ?? '#111'
  $: rotationTime = (3000 / $settings.rotationSpeed).toFixed(0)
  $: color = $settings.theme === 'dark' ? darkColor : lightColor
  $: coloredTrial = trial.color ? { ...trial, color } : trial
</script>

<div class="flex relative items-center justify-center w-full h-full perspective-distant">
  <div class="scene absolute transform-3d -translate-z-[5svmin] bg-red-500" class:mb-20={$mobile} style="animation-duration: {rotationTime}s">
  {#each POSITION_POOL as position (position)}
    <Cell {position} trial={trial.position === position ? coloredTrial : { position }} {presentation} />
  {/each}
  </div>
</div>

<style>
  .scene {
    animation: 60s linear 0s infinite normal forwards running spin;
    will-change: transform;
  }

  @keyframes spin {
    0% {
      transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg);
    }
    100% {
      transform: rotateX(360deg) rotateY(360deg) rotateZ(360deg);
    }
  }
</style>