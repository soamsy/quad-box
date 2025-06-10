<script>
  import { feedback } from "../stores/feedbackStore"
  import { settings } from "../stores/settingsStore"
  export let count = 0
  export let display = ''
  export let handleCount
</script>

<button class="game-button stimulus-button flex-1 h-full text-4xl grid grid-rows-[1fr 1fr 1fr] {$settings.theme}-{$feedback[count]} {$feedback[count]}" on:click={() => handleCount(count)}>
  <slot></slot>
</button>


<style>
.game-button.grid {
  display: grid !important;
}

.game-button.disabled {
  display: none !important;
}
</style>