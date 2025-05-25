<script>
  import Cell from "./Cell.svelte"
  import { POSITION_POOL } from "./constants"
  import { settings } from "../stores/settingsStore"
  import { mobile } from "../stores/mobileStore"

  $: rotationTime = (3000 / $settings.rotationSpeed).toFixed(0)
</script>

<div class="flex relative items-center justify-center w-full h-full perspective-distant">
  <div class="scene absolute transform-3d -translate-z-[5svmin] bg-red-500" class:mb-20={$mobile} style="animation-duration: {rotationTime}s">
  {#each POSITION_POOL as position}
    <Cell {position} />
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