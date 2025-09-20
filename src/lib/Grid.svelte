<script>
  export let trial = {}
  export let presentation = {}
  import Cell from "./Cell.svelte"
  import Frame from "./Frame.svelte"
  import { settings } from "../stores/settingsStore"
  import { gameSettings } from "../stores/gameSettingsStore"
  import { gameDisplayInfo } from "../stores/gameRunningStore"
  import { mobile } from "../stores/mobileStore"
  import { createSvgId, findBoxColor, findShapeOuterColor } from "./trialUtils"

  const range = (n) => Array.from({ length: n }, (_, i) => i)

  $: rotationTime = (3400 / $settings.rotationSpeed).toFixed(0)
  $: svgId = createSvgId(trial.shape, trial.color, trial.image, $settings)
  $: shapeOuterColor = findShapeOuterColor(trial.color, $settings)
  $: boxColor = findBoxColor(trial.shape, trial.color, trial.image, $settings)
  $: highlight = presentation.highlight
  $: flash = presentation.flash
  $: grid = gameDisplayInfo.grid ?? $gameSettings.grid ?? 'rotate3D'
</script>

{#if trial.variableNBack}
<div class="flex absolute z-10 items-center justify-center w-full h-full select-none pointer-events-none text-9xl md:text-[10rem] font-bold text-gray-700 dark:text-gray-300 opacity-80 [text-shadow:_1px_1px_0_black,_-1px_1px_0_black,_1px_-1px_0_black,_-1px_-1px_0_black]">
  {trial.variableNBack}
</div>
{/if}
{#if grid === 'static2D'}
<div class="flex absolute items-center justify-center w-full h-full select-none overflow-hidden">
  <div class="absolute w-[81.3svmin] h-[81.3svmin] mb-10">
    {#if trial.position0}
      {#each range(gameDisplayInfo.getMaxWidth()) as i (i)}
        {#if trial[`position${i}`]}
        <Cell
          show={true}
          flash={flash}
          transparent={false}
          position={trial[`position${i}`]}
          {boxColor}
          {svgId}
          {shapeOuterColor}
          grid={grid}
          />
        {/if}
      {/each}
    {:else}
    <Cell
      show={trial.position && highlight}
      position={trial.position}
      {boxColor}
      {svgId}
      {shapeOuterColor}
      grid={grid}
      />
    {/if}
    <Frame />
  </div>
</div>
{:else}
<div class="flex absolute items-center justify-center w-full h-full select-none perspective-[60svmin] overflow-hidden">
  <div class="scene absolute w-[60.3svmin] h-[60.3svmin] transform-3d -translate-z-[10svmin]"
  class:mb-10={$mobile}
  style="animation-duration: {rotationTime}s;"
  >
    {#if trial.position0}
      {#each range(gameDisplayInfo.getMaxWidth()) as i (i)}
        {#if trial[`position${i}`]}
        <Cell
          show={true}
          flash={flash}
          transparent={trial.position1 ? true : false}
          position={trial[`position${i}`]}
          {boxColor}
          {svgId}
          {shapeOuterColor}
           />
        {/if}
      {/each}
    {:else}
    <Cell
      show={trial.position && highlight}
      position={trial.position}
      {boxColor}
      {svgId}
      {shapeOuterColor} />
    {/if}
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
{/if}

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
