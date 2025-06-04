<script>
  import { error } from '../stores/errorStore'
</script>

{#if $error && $error.message}
<div class="modal modal-open" role="dialog">
  <div class="modal-box overflow-x-visible max-w-min min-w-80">
    <h3 class="text-lg font-bold">{$error.message}</h3>
    {#if $error.stacktrace}
    <textarea class="w-full min-w-80 h-64 whitespace-pre resize">{$error.stacktrace}</textarea>
    {/if}
    <div class="modal-action">
      <button class="game-button" on:click={() => $error = {}}>Close</button>
    </div>
  </div>
</div>
{/if}