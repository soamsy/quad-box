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

<button tabindex="-1" class="game-button stimulus-button flex-1 h-full text-4xl grid grid-rows-[1fr 1fr 1fr] {$settings.theme}-{$feedback[field]} {$feedback[field]}" on:click={() => checkForMatch(field)}>
  <div class="text-sm sm:text-xl">{display}</div>
  {$settings.hotkeys[hotkeyField]}
  <div class="text-xl flex gap-2 sm:gap-4" class:invisible={!score || isPlaying}>
    <div>{score?.hits}/{score?.possible}</div>
    <div>{(score?.percent * 100).toFixed(0)}%</div>
  </div>
</button>


<style>
.game-button.grid {
  display: grid !important;
}

.game-button.disabled {
  display: none !important;
}
</style>