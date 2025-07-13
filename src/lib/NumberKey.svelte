<script>
  import { tallyFeedback } from "../stores/tallyFeedbackStore"
  import { settings } from "../stores/settingsStore"
  export let count = 0
  export let handleCount
  $: className = $settings.theme + '-' + $tallyFeedback[count]
</script>

<button class="game-button flex-1 h-full text-4xl grid grid-rows-[1fr 1fr 1fr] {className}" on:click={() => handleCount(count)}>
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
