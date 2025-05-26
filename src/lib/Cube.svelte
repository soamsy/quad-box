<script>
  export let trial = {}
  export let presentation = {}
  import Cell from "./Cell.svelte"
  import { POSITION_POOL } from "./constants"
  import { settings } from "../stores/settingsStore"
  import { mobile } from "../stores/mobileStore"
  import { LIGHT_PALETTE, DARK_PALETTE } from "./constants"

  const findShapeName = (trial) => {
    if (trial.shape && !trial.color) {
      return `${trial.shape}-${$settings.theme}-inner`
    } else if (trial.shape) {
      return `${trial.shape}-${$settings.theme}-${trial.color}`
    } else {
      return ''
    }
  }

  const findBoxColor = (trial) => {
    if (trial.shape) {
      return ''
    } else if (trial.color) {
      return $settings.theme === 'dark' ? DARK_PALETTE[trial.color] : LIGHT_PALETTE[trial.color]
    } else {
      return $settings.theme === 'dark' ? '#FDFDFD' : '#313131'
    }
  }

  $: rotationTime = (3400 / $settings.rotationSpeed).toFixed(0)
  $: shapeName = findShapeName(trial)
  $: shapeOuterColor = $settings.theme === 'dark' ? (trial.color ? '#EEEEEE' : '#FDFDFD') : '#FAFAFA'
  $: boxColor = findBoxColor(trial)
  $: highlight = presentation.highlight

</script>

<div class="flex relative items-center justify-center w-full h-full perspective-[900px]">
  <div class="scene absolute transform-3d -translate-z-[10vmin] bg-red-500" class:mb-20={$mobile} style="animation-duration: {rotationTime}s">
  {#each POSITION_POOL as position (position)}
    <Cell {position} 
      boxColor={trial.position === position && highlight ? boxColor : ''}
      shapeName={trial.position === position && highlight ? shapeName : ''}
      shapeOuterColor={trial.position === position && highlight ? shapeOuterColor : ''} />
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