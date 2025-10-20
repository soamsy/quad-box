<script>
  export let trial = {}
  export let nextTrial = {}
  export let presentation = {}
  export let gameId = 0
  import Cell from "./Cell.svelte"
  import Frame from "./Frame.svelte"
  import { settings } from "../stores/settingsStore"
  import { gameSettings } from "../stores/gameSettingsStore"
  import { gameDisplayInfo } from "../stores/gameRunningStore"
  import { mobile } from "../stores/mobileStore"
  import { cacheNextTrial, createSvgId, findBoxColor, findShapeOuterColor } from "./trialUtils"
  import { seededRandom } from './utils.js'

  const range = (n) => Array.from({ length: n }, (_, i) => i)


  const currentRotationRandom = () => {
    const now = Date.now()
    const seed = Math.floor(now / 7200000) * 7200000 // 2 hrs * 60 min * 60 sec * 1000 ms
    const random = seededRandom(seed)
    return random
  }

  const determineRotationStart = () => {
    const random = currentRotationRandom()
    return {
      x: (random() * 360).toFixed(2),
      z: (random() * 360).toFixed(2),
      y: (random() * 360).toFixed(2),
    }
  }
  const rotationStart = determineRotationStart()

  $: rotationTime = (3400 / $settings.rotationSpeed).toFixed(0)
  $: svgId = createSvgId(trial.shape, trial.color, trial.image, $settings)
  $: shapeOuterColor = findShapeOuterColor(trial.color, $settings)
  $: boxColor = findBoxColor(trial.shape, trial.color, trial.image, $settings)
  $: cacheNextTrial(nextTrial, $settings)
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
  style="
  animation-duration: {rotationTime}s;
  --rotation-start-x: {rotationStart.x}deg;
  --rotation-start-y: {rotationStart.y}deg;
  --rotation-start-z: {rotationStart.z}deg;
  "
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

  @keyframes spin {
    from {
      transform: rotateX(var(--rotation-start-x, 0deg)) rotateY(var(--rotation-start-y, 0deg)) rotateZ(var(--rotation-start-z, 0deg));
    }
    to {
      transform: rotateX(calc(var(--rotation-start-x, 0deg) + 360deg))
                rotateY(calc(var(--rotation-start-y, 0deg) + 360deg))
                rotateZ(calc(var(--rotation-start-z, 0deg) + 360deg));
    }
  }
</style>
