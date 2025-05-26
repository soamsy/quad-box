<script>
  import { SHAPE_URLS } from "./constants"
  export let position = '0-0-0'
  export let boxColor = null
  export let shapeName = null
  export let shapeOuterColor = null

  const translationMap = {
    'x-0': '-translate-x-[20svmin]',
    'x-1': '-translate-x-0',
    'x-2': 'translate-x-[20svmin]',
    'y-0': '-translate-y-[20svmin]',
    'y-1': '-translate-y-0',
    'y-2': 'translate-y-[20svmin]',
    'z-0': '-translate-z-[20svmin]',
    'z-1': '-translate-z-0',
    'z-2': 'translate-z-[20svmin]',
  }

  const calculateBoxClassNames = (x, y, z, shapeName) => {
    let classNames = []
    classNames.push(translationMap[`x-${x}`])
    classNames.push(translationMap[`y-${y}`])
    classNames.push(translationMap[`z-${z}`])
    if (shapeName.includes('heart')) {
      classNames.push('heart')
    }
    return classNames.join(' ')
  }

  const calculateBoxStyle = (boxColor, shapeName, shapeOuterColor) => {
    let style = ''
    if (boxColor) {
      style += `--face-bg-color: ${boxColor};`
    } else if (shapeOuterColor) {
      style += `--face-bg-color: ${shapeOuterColor};`
    }

    if (shapeName) {
      style += `--shape-url: url('${SHAPE_URLS[shapeName]}');`
    }
    return style
  }

  $: [x, y, z] = position.split('-').map(Number)
  $: boxClassNames = calculateBoxClassNames(x, y, z, shapeName)
  $: boxStyle = calculateBoxStyle(boxColor, shapeName, shapeOuterColor)

</script>

<div class="cell {boxClassNames}" style="{boxStyle}">
    <div class="face translate-z-[10svmin]"></div>
    <div class="face -translate-z-[10svmin] rotate-y-180"></div>
    <div class="face translate-x-[10svmin] -rotate-y-90"></div>
    <div class="face -translate-x-[10svmin] rotate-y-90"></div>
    <div class="face translate-y-[10svmin] rotate-x-90"></div>
    <div class="face -translate-y-[10svmin] -rotate-x-90"></div>
</div>

<style>
  .cell {
    @apply absolute w-[20.1svmin] h-[20.1svmin] -left-[10.05svmin] -top-[10.05svmin];
    transform-style: preserve-3d;
  }

  .face {
    background-color: var(--face-bg-color);
    background-image: var(--shape-url);
    background-position: center;
    background-repeat: no-repeat;
    background-size: 80% 80%;
  }

  .cell.heart .face {
    background-size: 100% 95%;
  }

</style>