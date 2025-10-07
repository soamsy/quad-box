<script>
  import { onDestroy } from "svelte"
  import { gameSettings } from "../stores/gameSettingsStore"
  import { settings } from "../stores/settingsStore"
  import { Info, Settings } from "@lucide/svelte"

  let isShowingNBackSettingsPopup = false

  const clampNumber = (field, min, value, max) => {
    if (value < min || max < value) {
      return
    }
    gameSettings.setField(field, value)
  }

  const toggleShapeOrColor = (event, field) => {
    gameSettings.setField(field, event.target.checked)
    if (event.target.value) {
      gameSettings.setField('enableImage', false)
    }
  }

  const toggleShapeAndColor = (event) => {
    gameSettings.setField('enableImage', event.target.checked)
    if (event.target.value) {
      gameSettings.setField('enableShape', false)
      gameSettings.setField('enableColor', false)
    }
  }

  const toggleNBackSettingsPopup = () => {
    isShowingNBackSettingsPopup = !isShowingNBackSettingsPopup
  }

  const handleClickOutside = (event) => {
    if (isShowingNBackSettingsPopup && !document.getElementById('nback-settings-popup')?.contains(event.target)) {
      isShowingNBackSettingsPopup = false
    }
  }

  const toggleVariableNBack = (event) => {
    if (event.target.checked) {
      gameSettings.setField('rules', 'variable')
    } else {
      gameSettings.setField('rules', 'none')
    }
  }

  document.addEventListener('click', handleClickOutside)

  onDestroy(() => {
    document.removeEventListener('click', handleClickOutside)
  })

  const updatePositionWidthSequence = (width, value) => {
    const positionWidthSequence = [...$gameSettings.positionWidthSequence]
    positionWidthSequence[width] = value
    gameSettings.setField('positionWidthSequence', positionWidthSequence)
  }

  const range = (n) => Array.from({ length: n }, (_, i) => i)

  const audioOptions = new Map([
    ['letters2','Letters M1'],
    ['letters3','Letters M2'],
    ['letters5','Letters F1'],
    ['letters4','Letters F2'],
    ['letters','Letters F3'],
    ['numbers','Numbers'],
    ['nato','NATO'],
    ['syl5','5 syllables'],
    ['syl10','10 syllables'],
  ])
  const shapeOptions = new Map([
    ['basic', 'Basic'],
    ['tetris', 'Tetris'],
    ['iconsA', 'Icons A'],
    ['iconsB', 'Icons B'],
    ['all', 'All Shapes'],
  ])
  const colorOptions = new Map([
    ['basic','Basic'],
    ['gradient','Gradient'],
    ['voronoi','Voronoi'],
    ['generative','Generative Art'],
  ])

  $: numTrials = $gameSettings.numTrials
</script>


<div class="flex gap-2 items-center justify-between">
  <div class="flex flex-col gap-1 flex-auto">
    <label class="text-base" for="nback-range">N-back: {$gameSettings.nBack}</label>
    <input id="nback-range" type="range" min="1" max="12" bind:value={$gameSettings.nBack} class="range" />
  </div>
  {#if $settings.mode !== 'tally' && $settings.mode !== 'vtally'}
  <div id="nback-settings-popup" class="cursor-pointer relative select-none" on:click={() => toggleNBackSettingsPopup()}>
    <div class="relative">
      {#if $gameSettings.rules === 'variable'}
        <span class="absolute top-0 right-[-0.25rem] z-10 rounded bg-amber-500 w-2 h-2"></span>
      {/if}
      <span class="transition-transform" class:rotate-90={isShowingNBackSettingsPopup}><Settings /></span>
    </div>
    {#if isShowingNBackSettingsPopup}
    <div class="absolute top-0 right-8 bg-[#020202] border-b-neutral-500 border-2 shadow-lg flex items-center justify-center z-10" on:click={() => toggleNBackSettingsPopup()}>
      <div class="p-2 w-40 select-auto" on:click|stopPropagation>
        <div class="flex flex-col gap-4">
          <div class="grid grid-cols-[6fr_4fr] items-center gap-4">
            <label for="variable-nback" class="text-base">Variable N-Back:</label>
            <input id="variable-nback" type="checkbox" checked={$gameSettings.rules === 'variable'} on:change={toggleVariableNBack} class="toggle" />
          </div>
        </div>
        <p class="mt-4 text-xs">Makes N change randomly each trial</p>
      </div>
    </div>
    {/if}
  </div>
  {/if}
</div>
{#if 'trialTime' in $gameSettings}
<div class="flex flex-col gap-1">
  <label class="text-base">Trial time: {$gameSettings.trialTime}ms
    <input type="range" min="1000" max="5000" bind:value={$gameSettings.trialTime} step="100" class="range" />
  </label>
</div>
{/if}
<div class="grid grid-cols-[6fr_4fr] items-center gap-4">
  <label for="num-trials" class="text-base">Num trials:</label>
  <input id="num-trials" type="number" min="10" max="999" value={numTrials} on:input={(e) => clampNumber('numTrials', 10, +e.target.value, 999)} step="1" class="input" />
</div>
<div class="flex flex-col gap-1">
  <label class="text-base">
    <span class="flex items-center justify-between">
      Match chance: {$gameSettings.matchChance}%
      <div class="relative group inline-block">
        <Info size="16" />
        <div class="alert absolute right-full top-1/2 -translate-y-1/2 ml-2 hidden group-hover:block text-xs p-2 rounded shadow w-48 z-10">
          Chance of a stimulus from n trials ago repeating.
        </div>
      </div>
    </span>
    <input type="range" min="5" max="75" bind:value={$gameSettings.matchChance} step="1" class="range" />
  </label>
</div>
<div class="flex flex-col gap-1">
  <label class="text-base">
    <span class="flex items-center justify-between">
      Interference: {$gameSettings.interference}%
      <div class="relative group inline-block">
        <Info size="16" />
        <div class="alert absolute right-full top-1/2 -translate-y-1/2 ml-2 hidden group-hover:block text-xs p-2 rounded shadow w-48 z-10">
          Chance of using repeats from n±1 trials ago.<br><br>
          Increases difficulty.
        </div>
      </div>
    </span>
    <input type="range" min="0" max="75" bind:value={$gameSettings.interference} step="1" class="range" />
  </label>
</div>
{#if $settings.mode !== 'vtally'}
<div class="flex flex-col gap-1">
  <div class="grid grid-cols-[4fr_6fr] items-center gap-4">
    <span class="text-base">Grid:</span>
    <select bind:value={$gameSettings.grid} class="select h-8">
      <option value="rotate3D">3D</option>
      <option value="static2D">2D</option>
    </select>
  </div>
</div>
{/if}
{#if $settings.mode === 'tally' || $settings.mode === 'vtally'}
  <div class="grid grid-cols-[82fr_18fr] items-center gap-4">
    <label for="enable-position-width-sequence">Define { $settings.mode === 'vtally' ? 'visual' : 'position' } chain:</label>
    <input id="enable-position-width-sequence" type="checkbox" bind:checked={$gameSettings.enablePositionWidthSequence} class="toggle" />
  </div>
  {#if $gameSettings.enablePositionWidthSequence}
    <div class="flex flex-col gap-1">
      {#each range($gameSettings.nBack) as width (width)}
        <label class="text-base flex gap-1">W{width+1}:
          <input type="range" min="1" max="4" value={$gameSettings.positionWidthSequence[width]} on:input={(e) => updatePositionWidthSequence(width, +e.target.value)} class="range" />
          {$gameSettings.positionWidthSequence[width]}
        </label>
      {/each}
    </div>
  {:else}
    <div class="flex flex-col gap-1">
      <label class="text-base">Concurrent { $settings.mode === 'vtally' ? 'visuals' : 'positions' }: {$gameSettings.positionWidth}
        <input type="range" min="1" max="4" bind:value={$gameSettings.positionWidth} class="range" />
      </label>
    </div>
  {/if}
{/if}
{#if $settings.mode.startsWith('custom') || $settings.mode === 'tally' || $settings.mode === 'vtally'}
{#if $settings.mode !== 'vtally'}
  <div class="grid grid-cols-[2fr_1fr_3fr] items-center gap-4">
    <label for="enable-audio" class="text-base">Audio:</label>
    <input id="enable-audio" type="checkbox" bind:checked={$gameSettings.enableAudio} class="toggle" />
    <select bind:value={$gameSettings.audioSource} class="select h-8">
      {#each audioOptions as [id, description] (id) }
        <option value={id}>{description}</option>
      {/each}
    </select>
  </div>
{/if}
  <div class="grid grid-cols-[2fr_1fr_3fr] items-center gap-4">
    <label for="enable-color" class="text-base">Color:</label>
    <input id="enable-color" type="checkbox" checked={$gameSettings.enableColor} on:input={(e) => toggleShapeOrColor(e, 'enableColor')} class="toggle" />
    <select bind:value={$gameSettings.colorSource} class="select h-8">
      {#each colorOptions as [id, description] (id) }
        <option value={id}>{description}</option>
      {/each}
    </select>
  </div>
  <div class="grid grid-cols-[2fr_1fr_3fr] items-center gap-4">
    <label for="enable-shape" class="text-base">Shape:</label>
    <input id="enable-shape" type="checkbox" checked={$gameSettings.enableShape} on:input={(e) => toggleShapeOrColor(e, 'enableShape')} class="toggle" />
    <select bind:value={$gameSettings.shapeSource} class="select h-8">
      {#each shapeOptions as [id, description] (id) }
        <option value={id}>{description}</option>
      {/each}
    </select>
  </div>
  <div class="grid grid-cols-[2fr_1fr_3fr] items-center gap-4">
    <label for="enable-shape-color" class="text-base">Image:</label>
    <input id="enable-shape-color" type="checkbox" checked={$gameSettings.enableImage} on:input={(e) => toggleShapeAndColor(e)} class="toggle" />
    <select bind:value={$gameSettings.imageSource} class="select h-8">
      <option value="voronoi">Voronoi</option>
      <option value="generative">Generative Art</option>
    </select>
  </div>
{:else}
<div class="grid grid-cols-[4fr_6fr] items-center gap-4">
  <span class="text-base">Audio:</span>
  <select bind:value={$gameSettings.audioSource} id="audio-select" class="select h-8">
    {#each audioOptions as [id, description] (id) }
      <option value={id}>{description}</option>
    {/each}
  </select>
</div>
{/if}

{#if $settings.mode === 'quad'}
<div class="grid grid-cols-[4fr_6fr] items-center gap-4">
  <label for="enable-color" class="text-base">Color:</label>
  <select bind:value={$gameSettings.colorSource} class="select h-8">
    {#each colorOptions as [id, description] (id) }
      <option value={id}>{description}</option>
    {/each}
  </select>
</div>
<div class="grid grid-cols-[4fr_6fr] items-center gap-4">
  <label for="enable-shape" class="text-base">Shape:</label>
  <select bind:value={$gameSettings.shapeSource} class="select h-8">
    {#each shapeOptions as [id, description] (id) }
      <option value={id}>{description}</option>
    {/each}
  </select>
</div>
{/if}
