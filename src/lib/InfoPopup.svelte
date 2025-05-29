<script>
  import { CircleHelp } from '@lucide/svelte'

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
    if (event.target.classList.contains('modal')) closeModal()
  }
</script>

<button class="flex items-center justify-center" on:click={openModal}>
  <CircleHelp class="btn btn-square btn-ghost h-8 lg:h-6" />
</button>
{#if show}
  <div class="modal modal-open" on:click={handleBackdropClick} on:keydown={handleKeydown} tabindex="0">
    <div class="modal-box help-box w-[90%] max-w-3xl">
      <div class="prose max-w-none text-gray-800 dark:text-gray-200 text-sm sm:text-base md:text-lg">
        <h2 class="text-xl md:text-2xl font-bold mb-2">How to Play</h2>
        <p>
          3D Quad N-Back is a working memory game. You must watch a cube repeatedly appear in a 3D grid, and match items that appeared
          <strong>n steps ago</strong> across four different modalities:
        </p>
        <ul class="list-disc list-inside my-4">
          <li><strong>Position:</strong> where the cube appeared</li>
          <li><strong>Color:</strong> the color of the cube</li>
          <li><strong>Shape:</strong> the shape inside the cube</li>
          <li><strong>Audio:</strong> what was spoken</li>
        </ul>
        <p>
          For each new item, press the corresponding key if it matches the item shown
          <strong>n steps back</strong> in the sequence:
        </p>
        <ul class="list-disc list-inside my-4">
          <li><kbd class="px-2 py-1 kbd">A</kbd> – position match</li>
          <li><kbd class="px-2 py-1 kbd">F</kbd> – color match</li>
          <li><kbd class="px-2 py-1 kbd">J</kbd> – shape match</li>
          <li><kbd class="px-2 py-1 kbd">L</kbd> – audio match</li>
        </ul>
        <p>
          You can press multiple keys if more than one aspect matches. The game continues with a new item every few seconds.
          After a set amount of trials, you'll be scored on your accuracy. 
          If you do well enough, you're n-back level will be advanced by 1.
          Stay focused and try to get as high a score as possible!
        </p>
      </div>
      <div class="modal-action flex flex-row-reverse items-center justify-between">
        <button class="btn" on:click={closeModal}>Close</button>
        <a class="link" href="https://github.com/soamsy/quad-box" target="_blank">Github</a>
      </div>
    </div>
  </div>
{/if}
