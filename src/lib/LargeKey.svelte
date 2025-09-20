<script>
  import { scores } from "../stores/scoreStore"
  import { feedback } from "../stores/feedbackStore"
  import { settings } from "../stores/settingsStore"
  export let field = ''
  export let display = ''
  export let isPlaying = false
  export let checkForMatch
  $: score = $scores[field]
  $: hotkeyField = field === 'image' ? 'shape' : field
</script>

<button tabindex="-1" disabled={$feedback[field] === 'disabled'} class="game-button-lg stimulus-button grid grid-rows-[4fr_2fr_10fr_6fr] {$settings.theme}-{$feedback[field]}" on:click={() => checkForMatch(field)}>
  <span class="text-xl">{display}</span>
  <div class="flex gap-4">
    {#if score && !isPlaying}
    <span class="text-xl">{score.hits}/{score.possible}</span>
    <span class="text-xl">{(score.percent * 100).toFixed(0)}%</span>
    {/if}
  </div>
  {$settings.hotkeys[hotkeyField]}
</button>