<script>
  import { scores } from "../stores/scoreStore"
  import { feedback } from "../stores/feedbackStore"
  import { settings } from "../stores/settingsStore"
  export let field = ''
  export let display = ''
  export let isPlaying = false
  export let checkForMatch
  $: score = $scores[field]
</script>

<button tabindex="-1" disabled={$feedback[field] === 'disabled'} class="game-button-lg stimulus-button {$settings.theme}-{$feedback[field]}" on:click={() => checkForMatch(field)}>
<slot></slot>
<span class="game-button-lg-hint">{display}</span>
{#if score && !isPlaying}
  <span class="absolute top-[20%] text-xl">{score.hits} / {score.possible}</span>
  <span class="absolute top-[30%] text-xl">{(score.percent * 100).toFixed(0)}%</span>
{/if}
</button>