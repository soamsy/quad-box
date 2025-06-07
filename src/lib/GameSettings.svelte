<script>
  import { gameSettings } from "../stores/gameSettingsStore"
  import { settings } from "../stores/settingsStore"
  import { Info } from "@lucide/svelte"

  const clampNumber = (field, min, value, max) => {
    if (value < min || max < value) {
      return
    }
    gameSettings.setField(field, value)
  }

  const toggleShapeOrColor = (event, field) => {
    gameSettings.setField(field, event.target.checked)
    if (event.target.value) {
      gameSettings.setField('enableShapeColor', false)
    }
  }

  const toggleShapeAndColor = (event) => {
    gameSettings.setField('enableShapeColor', event.target.checked)
    if (event.target.value) {
      gameSettings.setField('enableShape', false)
      gameSettings.setField('enableColor', false)
    }
  }

  $: numTrials = $gameSettings.numTrials
</script>


<div class="flex flex-col gap-1">
  <label class="text-lg">N-back: {$gameSettings.nBack}
    <input type="range" min="1" max="12" bind:value={$gameSettings.nBack} class="range" />
  </label>
</div>
<div class="flex flex-col gap-1">
  <label class="text-lg">Trial time: {$gameSettings.trialTime}ms
    <input type="range" min="1000" max="5000" bind:value={$gameSettings.trialTime} step="100" class="range" />
  </label>
</div>
<div class="grid grid-cols-[6fr_4fr] items-center gap-4">
  <label for="num-trials" class="text-lg">Num trials:</label>
  <input id="num-trials" type="number" min="10" max="999" value={numTrials} on:input={(e) => clampNumber('numTrials', 10, +e.target.value, 999)} step="1" class="input" />
</div>
<div class="flex flex-col gap-1">
  <label class="text-lg">
    <span class="flex items-center justify-between">
      Match chance: {$gameSettings.matchChance}%
      <div class="relative group inline-block">
        <Info size="16" />
        <div class="alert absolute right-full top-1/2 -translate-y-1/2 ml-2 hidden group-hover:block text-xs p-2 rounded shadow w-48 z-10">
          Chance of a stimuli from n trials ago repeating.
        </div>
      </div>
    </span>
    <input type="range" min="5" max="75" bind:value={$gameSettings.matchChance} step="1" class="range" />
  </label>
</div>
<div class="flex flex-col gap-1">
  <label class="text-lg">
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
{#if $settings.mode === 'custom'}
<div class="grid grid-cols-[7fr_3fr] items-center gap-4">
  <label for="enable-audio" class="text-lg">Audio:</label>
  <input id="enable-audio" type="checkbox" bind:checked={$gameSettings.enableAudio} class="toggle" />
</div>
<div class="grid grid-cols-[7fr_3fr] items-center gap-4">
  <label for="enable-color" class="text-lg">Color:</label>
  <input id="enable-color" type="checkbox" checked={$gameSettings.enableColor} on:input={(e) => toggleShapeOrColor(e, 'enableColor')} class="toggle" />
</div>
<div class="grid grid-cols-[7fr_3fr] items-center gap-4">
  <label for="enable-shape" class="text-lg">Shape:</label>
  <input id="enable-shape" type="checkbox" checked={$gameSettings.enableShape} on:input={(e) => toggleShapeOrColor(e, 'enableShape')} class="toggle" />
</div>
<div class="grid grid-cols-[7fr_3fr] items-center gap-4">
  <label for="enable-shape-color" class="text-lg">Pattern:</label>
  <input id="enable-shape-color" type="checkbox" checked={$gameSettings.enableShapeColor} on:input={(e) => toggleShapeAndColor(e)} class="toggle" />
</div>
{/if}