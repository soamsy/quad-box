<script>
  import { Keyboard } from "@lucide/svelte"
  import Keybindings from "./Keybindings.svelte"
  let show = false
  const openModal = async () => {
    show = true
  }

  const closeModal = () => {
    show = false
  }

  const handleKeydown = (event) => {
    if (event.key === "Escape") closeModal()
  }

  const handleBackdropClick = (event) => {
    event.stopPropagation()
    if (event.target.classList.contains('modal')) closeModal()
  }
</script>

<button class="btn btn-primary flex items-center justify-center" on:click={openModal}>
  Keybindings
  <Keyboard class="btn btn-square btn-ghost h-8 lg:h-6" />
</button>


{#if show}
  <div class="modal modal-open" on:click={handleBackdropClick} on:keydown={handleKeydown} tabindex="0">
    <div class="modal-box">
      <Keybindings />
      <div class="prose grid grid-cols-2 gap-2">
        <div><span class="text-black dark:text-white">Space:</span> Start Game</div>
        <div><span class="text-black dark:text-white">Esc:</span> End Game</div>
        <div><span class="text-black dark:text-white">PgDown:</span> Next Mode</div>
        <div><span class="text-black dark:text-white">PgUp:</span> Previous Mode</div>
      </div>
    </div>
  </div>
{/if}