<script>
  import { scores } from "../stores/scoreStore"
  import { feedback } from "../stores/feedbackStore"
  export let field = ''
  export let display = ''
  export let isPlaying = false
  export let checkForMatch
  $: score = $scores[field]
</script>

<button class="game-button-sm {$feedback[field]}" on:click={() => checkForMatch(field)} on:touchmove={() => checkForMatch(field)}>
<slot></slot>
  <div class="game-button-sm-hint">{display}</div>
  {#if score && !isPlaying}
  <div class="absolute top-[17%] text-xl flex gap-4">
    <div>{score.hits}/{score.possible}</div>
    <div>{(score.percent * 100).toFixed(0)}%</div>
  </div>
  {/if}
</button>