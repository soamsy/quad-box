<script>
  import { analytics } from '../stores/analyticsStore'
  import { mobile } from '../stores/mobileStore'
  import ProgressChart from './ProgressChart.svelte'
  import { ChartColumn } from '@lucide/svelte'

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
  <ChartColumn class="btn btn-square btn-ghost h-8 lg:h-6" />
</button>
{#if show}
  <div class="modal modal-open" on:click={handleBackdropClick} on:keydown={handleKeydown} tabindex="0">
    <div class="modal-box w-[90%] max-w-[1500px]">
      <ProgressChart />
      <div class="modal-action flex flex-row-reverse items-center justify-between select-none">
        <button class="btn" on:click={closeModal}>Close</button>
        {#if $mobile && $analytics.playTime}
        <div>Today: {$analytics.playTime}</div>
        {/if}
      </div>
    </div>
  </div>
{/if}
