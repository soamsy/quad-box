<script>
  export let trial = {}
  export let nextTrial = {}
  export let presentation = {}
  export let trialIndex = 0
  import Cell from "./Cell.svelte"
  import { settings } from "../stores/settingsStore"
  import { cacheNextTrial, createSvgId, findBoxColor, findShapeOuterColor } from "./trialUtils"

  const createCells = (trial) => {
    const cells = []
    const maxWidth = 4
    for (let i = 0; i < maxWidth; i++) {
      if (!(`shape${i}` in trial || `color${i}` in trial || `image${i}` in trial)) {
        break
      }
      cells.push({
        id: i,
        ...(`shape${i}` in trial ? { shape: trial[`shape${i}`] } : {}),
        ...(`color${i}` in trial ? { color: trial[`color${i}`] } : {}),
        ...(`image${i}` in trial ? { image: trial[`image${i}`] } : {}),
      })
    }

    return cells
  }

  const calculateRotationStyle = () => {
    if ($settings.rotationSpeed === 0) {
      return ''
    }

    const ticks = Math.floor(2000 / $settings.rotationSpeed)
    const angle = (trialIndex % ticks) * 2 * Math.PI / ticks

    const radius = 7
    const x = Math.cos(angle) * radius
    const y = Math.sin(angle) * radius

    return `transform: translate(${x}svmin, ${y}svmin);`
  }

  const cacheNext = (nextTrial) => {
    for (const cell of createCells(nextTrial)) {
      cacheNextTrial(cell, $settings)
    }
  }

  $: cacheNext(nextTrial)

</script>

<div class="visual-crank-container">
  <div class="visual-grid" style={calculateRotationStyle()}>
    {#each createCells(trial) as cell (cell.id)}
      <div class="cell-wrapper">
        <Cell
          grid="visualCrank"
          position="0"
          show={true}
          flash={false}
          boxColor={findBoxColor(cell.shape, cell.color, cell.image, $settings)}
          svgId={createSvgId(cell.shape, cell.color, cell.image, $settings)}
          shapeOuterColor={findShapeOuterColor(cell.color, $settings)}
        />
      </div>
    {/each}
  </div>
</div>

<style>
  .visual-crank-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }

  .visual-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, 1fr);
    gap: 5px;
    width: 58svmin;
    height: 58svmin;
  }

  .cell-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
  }
</style>