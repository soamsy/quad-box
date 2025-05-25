<script>
  export let trial = {}
  export let presentation = {}
  import Cell from "./Cell.svelte"
  import { POSITION_POOL } from "./constants"
  import { settings } from "../stores/settingsStore"
  import { mobile } from "../stores/mobileStore"
  import { LIGHT_PALETTE, DARK_PALETTE } from "./constants";

  $: rotationTime = (3400 / $settings.rotationSpeed).toFixed(0)
  $: lightColor = LIGHT_PALETTE?.[trial.color] ?? '#313131'
  $: darkColor = (trial.shape) ? LIGHT_PALETTE?.[trial.color] ?? '#FFFFFF' : DARK_PALETTE?.[trial.color] ?? '#FFFFFF'
  $: color = $settings.theme === 'dark' ? darkColor : lightColor
  $: coloredTrial = { ...trial, color }
</script>

<div class="flex relative items-center justify-center w-full h-full perspective-[900px]">
  <div class="scene absolute transform-3d -translate-z-[10vmin] bg-red-500" class:mb-20={$mobile} style="animation-duration: {rotationTime}s">
  {#each POSITION_POOL as position (position)}
    <Cell {position} trial={trial.position === position ? coloredTrial : { position }} highlight={presentation.highlight} />
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