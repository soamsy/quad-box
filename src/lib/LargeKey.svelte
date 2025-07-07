<script>
  import { feedback } from "../stores/feedbackStore"
  import { settings } from "../stores/settingsStore"
  export let field = 0
  export let handleCount
</script>

<button disabled={$feedback[field] === 'disabled'} class="game-button-lg stimulus-button {$settings.theme}-{$feedback[field]}" on:click={() => handleCount(field)}>
<slot></slot>
</button>
