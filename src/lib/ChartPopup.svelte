<script>
  import { analytics } from '../stores/analyticsStore'
  import { mobile } from '../stores/mobileStore'
  import { recentGamesState } from '../stores/recentGamesStore'
  import ProgressChart from './ProgressChart.svelte'
  import { ChartColumn } from '@lucide/svelte'
  import RecentGames from './RecentGames.svelte'
  import TimeStats from './TimeStats.svelte'

  let show = false
  let tab = 'recent-games'
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
      <div role="tablist" class="tabs tabs-lift relative">
        <a role="tab" 
          class="tab" 
          class:tab-active={tab === 'recent-games'} 
          on:click={() => tab = 'recent-games'}>
          Recent Games
        </a>
        <a role="tab" 
          class="tab"
          class:tab-active={tab === 'progress-chart'}
          on:click={() => tab = 'progress-chart'}>
          Progress Chart
        </a>
      </div>
      <div class="w-full h-[65svh] overflow-y-auto">
        {#if tab === 'recent-games'}
        <RecentGames />
        {:else}
        <TimeStats />
        <div class="h-[50svh]">
          <ProgressChart />
        </div>
        {/if}
      </div>
      <div class="flex flex-row-reverse items-center justify-between select-none">
        <button class="btn" on:click={closeModal}>Close</button>
        {#if $mobile}
          <div class="flex flex-col gap-2 text-sm">
          {#if tab === 'recent-games'}
            <span class="">
              Show cancelled
              <input type="checkbox" class="toggle" checked={$recentGamesState.filter !== 'completed'} on:click={() => $recentGamesState.filter = $recentGamesState.filter === 'completed' ? 'all' : 'completed'} />
            </span>
          {/if}
          {#if $analytics.playTime}
            <div>Today: {$analytics.playTime}</div>
          {/if}
          </div>
        {:else}
          {#if tab === 'recent-games'}
            <div class="text-sm">
              <span class="">
                Show cancelled
                <input type="checkbox" class="toggle" checked={$recentGamesState.filter !== 'completed'} on:click={() => $recentGamesState.filter = $recentGamesState.filter === 'completed' ? 'all' : 'completed'} />
              </span>
            </div>
          {/if}
        {/if}


      </div>
    </div>
  </div>
{/if}
