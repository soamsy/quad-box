<script>
  import { CircleHelp } from '@lucide/svelte'
  import { settings } from '../stores/settingsStore'
  import { deleteDB } from './gamedb'

  let show = false
  let tab = 'how-to-play'
  let confirmResetAll = false
  let isDeleting = false
  const openModal = async () => {
    show = true
  }

  const closeModal = () => {
    show = false
    confirmResetAll = false
  }

  const handleKeydown = (event) => {
    if (event.key === "Escape") closeModal()
  }

  const handleBackdropClick = (event) => {
    if (event.target.classList.contains('modal')) closeModal()
  }

  const resetSettings = () => {
    settings.reset()
    alert("Settings reset to default.")
    show = false
  }

  const resetAll = async () => {
    isDeleting = true
    await deleteDB()
    settings.reset()
    isDeleting = false
    alert("App fully reset.")
    confirmResetAll = false
    show = false
  }
</script>

<button class="flex items-center justify-center" on:click={openModal}>
  <CircleHelp class="btn btn-square btn-ghost h-8 lg:h-6" />
</button>
{#if show}
  <div class="modal modal-open whitespace-normal" on:click={handleBackdropClick} on:keydown={handleKeydown} tabindex="0">
    <div class="modal-box help-box w-[90%] max-w-3xl">
      <div role="tablist" class="tabs tabs-lift relative">
        <a role="tab"
          class="tab"
          class:tab-active={tab === 'how-to-play'}
          on:click={() => tab = 'how-to-play'}>
          How to Play
        </a>
        <a role="tab"
          class="tab"
          class:tab-active={tab === 'misc'}
          on:click={() => tab = 'misc'}>
          Reset App
        </a>
      </div>
      {#if tab === 'how-to-play'}
      <div class="prose max-w-none text-gray-800 dark:text-gray-200 text-sm sm:text-base md:text-lg overflow-y-auto h-[70svh] mt-2">
        <p>
          3D Quad N-Back is a working memory game. A cube will repeatedly flash in a 3D grid, and you must remember cues that appeared
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
          You can press multiple keys if more than one aspect matches. The game continues with a new cube every few seconds.
          After a set amount of trials, you'll be scored on your accuracy.
          If you do well enough, you're n-back level will be advanced by 1.
          Stay focused and try to get as high a score as possible!
        </p>
      </div>
      {:else if tab === 'misc'}
      <div class="prose text-gray-800 dark:text-gray-200 flex flex-col gap-2 overflow-y-auto h-[70svh] w-full mt-2">
        <div class="mt-6">
          <p class="mb-2">Reset all game settings to their default values.</p>
          <p class="text-sm">
            This will not affect your game history or performance data.
          </p>
          <button class="btn btn-info mt-4 text-xl" on:click={resetSettings}>
            Reset Settings
          </button>
        </div>
        <div class="divider" />
        <div>
          <p class="mb-2 text-red-600 dark:text-rose-500 font-semibold">Danger Zone</p>
          <p class="text-sm">
            This will erase all app data including settings and game history. This action is irreversible.
          </p>

          {#if !confirmResetAll}
            <button class="btn btn-error mt-4 text-xl dark:bg-rose-500" on:click={() => confirmResetAll = true}>
              Reset Entire App
            </button>
          {:else}
            <div class="mt-4 space-y-2">
              <p class="text-sm text-red-600 dark:text-rose-500 font-medium">Are you absolutely sure?</p>
              <button class="btn btn-error dark:bg-rose-500 w-full" on:click={() => resetAll()}>
                Yes, erase everything
                {#if isDeleting}
                  <span class="loading loading-spinner"></span>
                {/if}
              </button>
              <button class="btn w-full" on:click={() => confirmResetAll = false}>
                Cancel
              </button>
            </div>
          {/if}
        </div>
      </div>
      {/if}
      <div class="modal-action flex flex-row-reverse items-center justify-between mt-2">
        <button class="btn" on:click={closeModal}>Close</button>
        <a class="link" href="https://ko-fi.com/soasoa" target="_blank">Donate☕</a>
        <a class="link" href="https://github.com/soamsy/quad-box" target="_blank">Github</a>
      </div>
    </div>
  </div>
{/if}
