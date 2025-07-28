<script>
  import { SHAPE_URLS } from "./constants"
  import { createVoronoiSvg } from "./voronoi"
  export let show = false
  export let flash = false
  export let position = '0-0-0'
  export let boxColor = null
  export let shapeName = null
  export let shapeOuterColor = null
  export let voronoi = null
  export let opacity = 1.0
  export let grid = 'rotate3D'

  const svgToDataUrl = (svgString) => {
    const encoded = encodeURIComponent(svgString)
      .replace(/'/g, '%27')
      .replace(/"/g, '%22')
    return `data:image/svg+xml,${encoded}`
  }

  const calculateBoxClassNames = (position, shapeName, show, flash) => {
    if (!show) {
      return 'hidden'
    }

    let classNames = ['p' + position]
    if (shapeName.includes('heart')) {
      classNames.push('heart')
    }
    if (flash) {
      classNames.push('flash')
    }
    return classNames.join(' ')
  }

  const calculateBoxStyle = (boxColor, shapeName, shapeOuterColor, voronoi) => {
    let style = ''
    if (boxColor) {
      style += `--face-bg-color: ${boxColor};`
    } else if (shapeOuterColor) {
      style += `--face-bg-color: ${shapeOuterColor};`
    }

    if (shapeName) {
      style += `--shape-url: url('${SHAPE_URLS[shapeName]}');`
    } else if (voronoi) {
      const [id, splits] = voronoi.split('-')
      style += `--shape-url: url('${svgToDataUrl(createVoronoiSvg(id, splits))}');`
    }
    if (opacity < 0.9999) {
      style += `--face-opacity: ${opacity};`
    }
    return style
  }

  $: boxClassNames = calculateBoxClassNames(position ?? '0-0-0', shapeName, show, flash)
  $: boxStyle = calculateBoxStyle(boxColor, shapeName, shapeOuterColor, voronoi, opacity)

</script>

{#if grid === 'static2D'}
<div class="cell2d {boxClassNames}" style="{boxStyle}">
  <div class="face"></div>
</div>
{:else}
<div class="cell {boxClassNames}" style="{boxStyle}">
  <div class="face translate-z-[10svmin]"></div>
  <div class="face -translate-z-[10svmin] rotate-y-180"></div>
  <div class="face translate-x-[10svmin] -rotate-y-90"></div>
  <div class="face -translate-x-[10svmin] rotate-y-90"></div>
  <div class="face translate-y-[10svmin] rotate-x-90"></div>
  <div class="face -translate-y-[10svmin] -rotate-x-90"></div>
</div>
{/if}
<style>
  .cell {
    @apply absolute w-[20.1svmin] h-[20.1svmin] left-[20.1svmin] top-[20.1svmin];
    transform-style: preserve-3d;
  }

  .cell2d {
    @apply absolute w-[27.1svmin] h-[27.1svmin] left-[27.1svmin] top-[27.1svmin];
  }

  .face {
    @apply absolute w-full h-full;
    background-color: var(--face-bg-color);
    background-image: var(--shape-url);
    opacity: var(--face-opacity, 1.0);
    background-position: center;
    background-repeat: no-repeat;
    background-size: 80% 80%;
  }

  .flash .face {
    outline: 2px solid #7774;
  }

  .cell.heart .face {
    background-size: 100% 95%;
  }

  .p0-0   { transform: translate(-27.1svmin, -27.1svmin); }
  .p0-1   { transform: translate(-27.1svmin,     0svmin); }
  .p0-2   { transform: translate(-27.1svmin,  27.1svmin); }
  .p1-0   { transform: translate(0,          -27.1svmin); }
  .p1-1   { transform: translate(0,              0svmin); }
  .p1-2   { transform: translate(0,           27.1svmin); }
  .p2-0   { transform: translate(27.1svmin,  -27.1svmin); }
  .p2-1   { transform: translate(27.1svmin,      0svmin); }
  .p2-2   { transform: translate(27.1svmin,   27.1svmin); }

  .p0-0-0 { transform: translate3d(-20.1svmin, -20.1svmin, -20.1svmin); }
  .p0-0-1 { transform: translate3d(-20.1svmin, -20.1svmin, 0         ); }
  .p0-0-2 { transform: translate3d(-20.1svmin, -20.1svmin, 20.1svmin ); }
  .p0-1-0 { transform: translate3d(-20.1svmin, 0         , -20.1svmin); }
  .p0-1-1 { transform: translate3d(-20.1svmin, 0         , 0         ); }
  .p0-1-2 { transform: translate3d(-20.1svmin, 0         , 20.1svmin ); }
  .p0-2-0 { transform: translate3d(-20.1svmin, 20.1svmin , -20.1svmin); }
  .p0-2-1 { transform: translate3d(-20.1svmin, 20.1svmin , 0         ); }
  .p0-2-2 { transform: translate3d(-20.1svmin, 20.1svmin , 20.1svmin ); }
  .p1-0-0 { transform: translate3d(0         , -20.1svmin, -20.1svmin); }
  .p1-0-1 { transform: translate3d(0         , -20.1svmin, 0         ); }
  .p1-0-2 { transform: translate3d(0         , -20.1svmin, 20.1svmin ); }
  .p1-1-0 { transform: translate3d(0         , 0         , -20.1svmin); }
  .p1-1-1 { transform: translate3d(0         , 0         , 0         ); }
  .p1-1-2 { transform: translate3d(0         , 0         , 20.1svmin ); }
  .p1-2-0 { transform: translate3d(0         , 20.1svmin , -20.1svmin); }
  .p1-2-1 { transform: translate3d(0         , 20.1svmin , 0         ); }
  .p1-2-2 { transform: translate3d(0         , 20.1svmin , 20.1svmin ); }
  .p2-0-0 { transform: translate3d(20.1svmin , -20.1svmin, -20.1svmin); }
  .p2-0-1 { transform: translate3d(20.1svmin , -20.1svmin, 0         ); }
  .p2-0-2 { transform: translate3d(20.1svmin , -20.1svmin, 20.1svmin ); }
  .p2-1-0 { transform: translate3d(20.1svmin , 0         , -20.1svmin); }
  .p2-1-1 { transform: translate3d(20.1svmin , 0         , 0         ); }
  .p2-1-2 { transform: translate3d(20.1svmin , 0         , 20.1svmin ); }
  .p2-2-0 { transform: translate3d(20.1svmin , 20.1svmin , -20.1svmin); }
  .p2-2-1 { transform: translate3d(20.1svmin , 20.1svmin , 0         ); }
  .p2-2-2 { transform: translate3d(20.1svmin , 20.1svmin , 20.1svmin ); }

</style>
