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

<div class="flex absolute items-center justify-center w-full h-full select-none perspective-[60svmin] overflow-hidden">
  <div class="scene absolute w-[60.3svmin] h-[60.3svmin] transform-3d -translate-z-[10svmin]"
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
    <Frame class="-translate-z-[30.15svmin]" />
    <Frame class="-translate-z-[10.05svmin]" />
    <Frame class="translate-z-[10.05svmin]" />
    <Frame class="translate-z-[30.15svmin]" />

    <Frame class="-translate-y-[30.15svmin] rotate-x-90" />
    <Frame class="-translate-y-[10.05svmin] rotate-x-90" />
    <Frame class="translate-y-[10.05svmin] rotate-x-90" />
    <Frame class="translate-y-[30.15svmin] rotate-x-90" />

    <Frame class="-translate-x-[30.15svmin] rotate-y-90" />
    <Frame class="-translate-x-[10.05svmin] rotate-y-90" />
    <Frame class="translate-x-[10.05svmin] rotate-y-90" />
    <Frame class="translate-x-[30.15svmin] rotate-y-90" />
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
