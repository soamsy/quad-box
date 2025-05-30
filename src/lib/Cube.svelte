<script>
  export let trial = {}
  export let presentation = {}
  import Cell from "./Cell.svelte"
  import Frame from "./Frame.svelte"
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
    if (trial.shape || trial.shapeColor) {
      return ''
    } else if (trial.color) {
      return $settings.theme === 'dark' ? DARK_PALETTE[trial.color] : LIGHT_PALETTE[trial.color]
    } else {
      return $settings.theme === 'dark' ? '#FDFDFD' : '#313131'
    }
  }

  $: rotationTime = (3400 / $settings.rotationSpeed).toFixed(0)
  $: shapeName = findShapeName(trial)
  $: shapeOuterColor = $settings.theme === 'dark' ? (trial.color ? '#FDFDFD' : '#EEEEEE') : '#FAFAFA'
  $: boxColor = findBoxColor(trial)
  $: highlight = presentation.highlight

</script>

<div class="flex absolute items-center justify-center w-full h-full perspective-[65svmin]"
  class:perspective-[150svmin]={$mobile}>
  <div class="scene absolute transform-3d"
  class:-translate-z-[10svmin]={!$mobile}
  class:-translate-z-[-10svmin]={$mobile}
  class:mb-10={$mobile}
  style="animation-duration: {rotationTime}s;"
  >
    <Cell
      show={trial.position && highlight}
      position={trial.position}
      {boxColor}
      {shapeName}
      {shapeOuterColor}
      voronoi={trial.shapeColor} />
    <div class="frame absolute w-[60.3svmin] h-[60.3svmin] -translate-z-[30.15svmin] -left-[30.15svmin] -top-[30.15svmin]"><Frame /></div>
    <div class="frame absolute w-[60.3svmin] h-[60.3svmin] -translate-z-[10.05svmin] -left-[30.15svmin] -top-[30.15svmin]"><Frame /></div>
    <div class="frame absolute w-[60.3svmin] h-[60.3svmin] translate-z-[10.05svmin] -left-[30.15svmin] -top-[30.15svmin]"><Frame /></div>
    <div class="frame absolute w-[60.3svmin] h-[60.3svmin] translate-z-[30.15svmin] -left-[30.15svmin] -top-[30.15svmin]"><Frame /></div>

    <div class="frame absolute w-[60.3svmin] h-[60.3svmin] -translate-y-[30.15svmin] -left-[30.15svmin] -top-[30.15svmin] rotate-x-90"><Frame /></div>
    <div class="frame absolute w-[60.3svmin] h-[60.3svmin] -translate-y-[10.05svmin] -left-[30.15svmin] -top-[30.15svmin] rotate-x-90"><Frame /></div>
    <div class="frame absolute w-[60.3svmin] h-[60.3svmin] translate-y-[10.05svmin] -left-[30.15svmin] -top-[30.15svmin] rotate-x-90"><Frame /></div>
    <div class="frame absolute w-[60.3svmin] h-[60.3svmin] translate-y-[30.15svmin] -left-[30.15svmin] -top-[30.15svmin] rotate-x-90"><Frame /></div>

    <div class="frame absolute w-[60.3svmin] h-[60.3svmin] -translate-x-[30.15svmin] -left-[30.15svmin] -top-[30.15svmin] rotate-y-90"><Frame /></div>
    <div class="frame absolute w-[60.3svmin] h-[60.3svmin] -translate-x-[10.05svmin] -left-[30.15svmin] -top-[30.15svmin] rotate-y-90"><Frame /></div>
    <div class="frame absolute w-[60.3svmin] h-[60.3svmin] translate-x-[10.05svmin] -left-[30.15svmin] -top-[30.15svmin] rotate-y-90"><Frame /></div>
    <div class="frame absolute w-[60.3svmin] h-[60.3svmin] translate-x-[30.15svmin] -left-[30.15svmin] -top-[30.15svmin] rotate-y-90"><Frame /></div>
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
