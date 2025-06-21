<script>
  export let trial = {}
  export let presentation = {}
  export let trialsIndex = 0
  export let trialsCount = 0
  import { createVoronoiSvg } from "./voronoi"
  import { settings } from "../stores/settingsStore"
  import { mobile } from "../stores/mobileStore"

  const svgToDataUrl = (svgString) => {
    const encoded = encodeURIComponent(svgString)
      .replace(/'/g, '%27')
      .replace(/"/g, '%22')
    return `data:image/svg+xml,${encoded}`
  }

  const createVoronoiStyle = (svg) => {
    if (!svg) {
      return 'display: none;'
    }
    const [id, splits] = svg.split('-')
    return `--shape-url: url('${svgToDataUrl(createVoronoiSvg(id, splits))}');`
  }

  const createFaceStyle = (theme) => {
    return `--face-bg-color: ${theme === 'dark' ? '#EEEEEE' : '#FAFAFA'};`
  }

  const calculateRotationStyle = (trialsIndex) => {
    if ($settings.rotationSpeed === 0) {
      return ''
    }
    const ticks = Math.floor(2000 / $settings.rotationSpeed)
    const deg = (trialsIndex % ticks) * 360 / ticks
    return `transform: rotate(${deg}deg);`
  }

  $: highlight = presentation.highlight
  $: flash = presentation.flash
  $: visual1 = createVoronoiStyle(trial.visual1)
  $: visual2 = createVoronoiStyle(trial.visual2)
  $: visual3 = createVoronoiStyle(trial.visual3)
  $: visual4 = createVoronoiStyle(trial.visual4)
  $: rotationStyle = calculateRotationStyle(trialsIndex, trialsCount)

</script>

<div class="flex absolute items-center justify-center w-full h-full select-none overflow-hidden"
  class:perspective-[85svmin]={$mobile}>
  <div class="scene absolute w-[60.3svmin] h-[60.3svmin]"
  class:mb-10={$mobile}
  >
    <div class="grid grid-cols-2 grid-rows-2 gap-2 w-full h-full" style="{createFaceStyle($settings.theme) + rotationStyle}">
      {#if highlight}
      <div class="cell border-2 border-neutral-900 dark:border-neutral-50" class:flash style="{visual1}"></div>
      <div class="cell border-2 border-neutral-900 dark:border-neutral-50" class:flash style="{visual2}"></div>
      <div class="cell border-2 border-neutral-900 dark:border-neutral-50" class:flash style="{visual3}"></div>
      <div class="cell border-2 border-neutral-900 dark:border-neutral-50" class:flash style="{visual4}"></div>
      {/if}
    </div>
  </div>
</div>

<style>
  .cell {
    @apply w-full h-full;
    background-color: var(--face-bg-color);
    background-image: var(--shape-url);
    background-position: center;
    background-repeat: no-repeat;
    background-size: 80% 80%;
    transition: outline-color 0.1s ease-in-out;
    outline-color: hsla(0, 0%, 0%, 0);
  }

  .flash .cell {
    @apply outline-2 outline-dotted;
    outline-color: hsl(10, 10%, 90%, 0.5);
  }
</style>
