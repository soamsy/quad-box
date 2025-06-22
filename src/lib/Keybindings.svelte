<script>
  import { settings } from '../stores/settingsStore'

  let editingKey = null

  const startEditing = (action) => {
    editingKey = action
    window.addEventListener('keydown', handleKeyDown, { once: true })
  }

  const handleKeyDown = (event) => {
    if (!editingKey || event.key === 'Escape' || event.key === 'Space') {
      return
    }

    event.preventDefault()

    const keyCombo = event.key.length === 1 ? event.key.toUpperCase() : event.key
    $settings.hotkeys[editingKey] = keyCombo
    settings.update('hotkeys', $settings.hotkeys)

    editingKey = null
  }

  const resetToDefault = () => {
    $settings.hotkeys = {
      'position': 'A',
      'color': 'F',
      'shape': 'J',
      'audio': 'L',
    }
    settings.update('hotkeys', $settings.hotkeys)
  }

</script>

<div class="p-4 max-w-md mx-auto rounded-xl space-y-4">
  <h2 class="text-xl font-bold">Customize Keybindings</h2>
  {#each Object.entries($settings.hotkeys) as [action, key] (action)}
    <div class="flex items-center justify-between gap-2">
      <span class="capitalize">{action}</span>
      <button
        class="btn btn-accent btn-lg px-12"
        on:click={() => startEditing(action)}
      >
        {editingKey === action ? 'Press new keys...' : key}
      </button>
    </div>
  {/each}
  <button class="btn btn-primary w-full p-4 text-2xl" on:click={() => resetToDefault()}>Reset to Default</button>
</div>
