<script>
  import { gameSettings } from "../stores/gameSettingsStore"
  import { settings } from "../stores/settingsStore"

  const clampNumber = (field, min, value, max) => {
    const clampedValue = Math.max(min, Math.min(value, max))
    gameSettings.setField(field, clampedValue)
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
  <label class="text-lg">Trial Time: {$gameSettings.trialTime}ms
    <input type="range" min="1000" max="5000" bind:value={$gameSettings.trialTime} step="100" class="range" />
  </label>
</div>
<div class="grid grid-cols-[6fr_4fr] items-center gap-4">
  <label for="num-trials" class="text-lg">Num Trials:</label>
  <input id="num-trials" type="number" min="10" max="900" value={numTrials} on:input={(e) => clampNumber('numTrials', 10, +e.target.value, 900)} step="1" class="input" />
</div>
<div class="flex flex-col gap-1">
  <label class="text-lg">Match Chance: {$gameSettings.matchChance}%
    <input type="range" min="5" max="75" bind:value={$gameSettings.matchChance} step="1" class="range" />
  </label>
</div>
<div class="flex flex-col gap-1">
  <label class="text-lg">Interference: {$gameSettings.interference}%
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