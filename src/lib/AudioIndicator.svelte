<script>
  export let presentation = {}
  import { AudioLines } from "@lucide/svelte"
</script>

<div class="audio-indicator-container">
  <AudioLines
    class="audio-icon {presentation.flash ? 'pulse' : ''}"
    strokeWidth={1.25}
  />
</div>

<style>
  .audio-indicator-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }

  :global(.audio-icon) {
    width: 30svmin;
    height: 30svmin;
    opacity: 0.25;
    transform: scale(1);
    transition: opacity 0.15s ease-out, transform 0.15s ease-out;
  }

  :global(.audio-icon.pulse) {
    opacity: 1;
    transform: scale(1.12);
  }
</style>
