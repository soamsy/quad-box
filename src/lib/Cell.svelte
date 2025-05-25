<script>
  import Shape from "./Shape.svelte"
  export let trial = { position: '0-0-0' }
  export let highlight = false

  $: [x, y, z] = trial.position.split('-').map(Number)

  $: faceStyle = (highlight && trial.color && !trial.shape) ? `background-color: ${trial.color}; background-opacity: 0.95;` : ''

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
</script>

<div class="cell {translationMap[`x-${x}`]} {translationMap[`y-${y}`]} {translationMap[`z-${z}`]}">
    <div class="face translate-z-[10svmin]" style="{faceStyle}">
      {#if trial.shape && highlight}
      <Shape {trial} />
      {/if}
    </div>
    <div class="face -translate-z-[10svmin] rotate-y-180" style="{faceStyle}">
      {#if trial.shape && highlight}
      <Shape {trial} />
      {/if}
    </div>
    <div class="face translate-x-[10svmin] -rotate-y-90" style="{faceStyle}">
      {#if trial.shape && highlight}
      <Shape {trial} />
      {/if}
    </div>
    <div class="face -translate-x-[10svmin] rotate-y-90" style="{faceStyle}">
      {#if trial.shape && highlight}
      <Shape {trial} />
      {/if}
    </div>
    <div class="face translate-y-[10svmin] rotate-x-90" style="{faceStyle}">
      {#if trial.shape && highlight}
      <Shape {trial} />
      {/if}
    </div>
    <div class="face -translate-y-[10svmin] -rotate-x-90" style="{faceStyle}">
      {#if trial.shape && highlight}
      <Shape {trial} />
      {/if}
    </div>
</div>

<style>
  .cell {
    @apply absolute w-[20.1svmin] h-[20.1svmin] -left-[10.05svmin] -top-[10.05svmin];
    transform-style: preserve-3d;
  }

</style>