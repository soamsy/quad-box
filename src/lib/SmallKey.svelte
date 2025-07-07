<script>
  import { feedback } from "../stores/feedbackStore"
  import { settings } from "../stores/settingsStore"
  export let field = 0
  export let display = ''
  export let handleCount
  $: className = $settings.theme + '-' + $feedback[field]
</script>

<button class="game-button stimulus-button flex-1 h-full text-4xl grid grid-rows-[1fr 1fr 1fr] {className}" on:click={() => handleCount(field)}>
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
