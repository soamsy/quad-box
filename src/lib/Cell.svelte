<script>
  import { getSvgUrl } from "./svg"

  export let show = false
  export let flash = false
  export let transparent = false
  export let position = '0-0-0'
  export let boxColor = null
  export let svgId = null
  export let shapeOuterColor = null
  export let grid = 'rotate3D'

  const calculateBoxClassNames = (position, svgId, show, flash, transparent) => {
    if (!show) {
      return 'hidden'
    }

    let classNames = ['p' + position]
    if (svgId && (svgId.includes('-bg-') || svgId.includes('-full_'))) {
      classNames.push('no-padding')
    } else if (svgId && svgId.includes('-big_')) {
      classNames.push('little-padding')
    }
    if (flash) {
      classNames.push('flash')
    }
    if (transparent) {
      classNames.push('see-through')
    }
    return classNames.join(' ')
  }

  const calculateBoxStyle = (boxColor, svgId, shapeOuterColor, transparent) => {
    let style = ''
    if (boxColor) {
      style += `--face-bg-color: ${boxColor}${transparent ? '3A' : ''};`
    } else if (shapeOuterColor) {
      style += `--face-bg-color: ${shapeOuterColor}${transparent ? '2A' : ''};`
    }

    if (svgId) {
      style += `--shape-url: url('${getSvgUrl(svgId)}');`
    }

    if (transparent) {
      style += `--face-size: 72%;`
    }

    return style
  }

  $: boxClassNames = calculateBoxClassNames(position ?? '0-0-0', svgId, show, flash, transparent)
  $: boxStyle = calculateBoxStyle(boxColor, svgId, shapeOuterColor, transparent)

</script>

{#if grid === 'static2D'}
<div class="cell2d {boxClassNames}" style="{boxStyle}">
  <div class="face"></div>
</div>
{:else if grid === 'visualCrank'}
<div class="visualCell {boxClassNames}" style="{boxStyle}">
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
    background-size: var(--face-size, 82%) var(--face-size, 82%);
    transition: filter 0.05s ease-out;
  }


  .flash .face {
    filter: drop-shadow(0 0 8px #111111);
  }

  :global(.dark) .flash .face {
    filter: drop-shadow(0 0 8px #FFFFFF);
  }

  .see-through .face {
    outline: 3px solid #0009;
  }

  :global(.dark) .see-through .face {
    outline: 3px solid #FFF9;
  }

  .no-padding .face {
    background-size: 100% 100%;
  }

  .little-padding .face {
    background-size: 95% 95%;
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
