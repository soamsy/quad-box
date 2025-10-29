<script>
  import { settings } from '../stores/settingsStore'
  import { Triangle } from '@lucide/svelte'
  import { CircleHelp } from '@lucide/svelte'
  import { onDestroy } from 'svelte'
  $: mode = $settings.mode

  const formatMode = (mode) => {
    return (mode === 'custom' ? 'custom a' : (mode === 'customB' ? 'custom b' : mode)).toUpperCase()
  }
  let showModeDropdown = false
  let showTallyExplanation = false

  const darkColors = new Map([
    ['quad', 'bg-rose-900'],
    ['dual', 'bg-cyan-800'],
    ['custom', 'bg-orange-800'],
    ['customB', 'bg-yellow-700'],
    ['tally', 'bg-indigo-800'],
    ['vtally', 'bg-emerald-800'],
  ])

  const lightColors = new Map([
    ['quad', 'bg-rose-400'],
    ['dual', 'bg-cyan-400'],
    ['custom', 'bg-orange-400'],
    ['customB', 'bg-yellow-400'],
    ['tally', 'bg-indigo-400'],
    ['vtally', 'bg-emerald-400'],
  ])

  const allModes = [...lightColors.keys()]

  $: modes = [...$settings.enabledModes].sort((a, b) => allModes.indexOf(a) - allModes.indexOf(b))
  $: displayModes = new Map(
    allModes.map(m => [m, modes.includes(m)]),
  )

  $: bg = $settings.theme === 'light' ? lightColors.get(mode) : darkColors.get(mode)

  const nextMode = () => {
    if (modes.length <= 1) return
    let nextIndex = modes.indexOf(mode) + 1
    if (nextIndex > modes.length - 1) {
      nextIndex = 0
    }
    settings.update('mode', modes[nextIndex])
  }

  const prevMode = () => {
    if (modes.length <= 1) return
    let prevIndex = modes.indexOf(mode) - 1
    if (prevIndex < 0) {
      prevIndex = modes.length - 1
    }
    settings.update('mode', modes[prevIndex])
  }

  const handleKey = (event) => {
    switch (event.code) {
      case 'PageUp':
        prevMode()
        break
      case 'PageDown':
        nextMode()
        break
    }
  }

  const handleClickOutside = (event) => {
    if (!event.target.closest('#mode-dropdown')) {
      showModeDropdown = false
    }
  }

  document.addEventListener('keydown', handleKey)
  document.addEventListener('click', handleClickOutside)

  onDestroy(async () => {
    document.removeEventListener('keydown', handleKey)
    document.removeEventListener('click', handleClickOutside)
  })
</script>

<div class="flex bg- items-center justify-around relative">
  <div on:click={prevMode} class="btn rounded border-0 px-2 -rotate-90"><Triangle class="fill-base-100" /></div>
  <div class="flex-grow flex items-center justify-center mx-2 p-1 text-2xl select-none transition-colors duration-100 cursor-pointer relative {bg}" on:click|stopPropagation={() => {
    showModeDropdown = !showModeDropdown
  }}>
  {formatMode(mode)}
  {#if mode.includes('tally')}
    <div class="absolute right-6 top-1/2 -translate-y-1/2" on:click|stopPropagation={() => {
      showTallyExplanation = true
    }}>
      <CircleHelp class="h-5 mb-2 dark:hover:text-cyan-300 light:hover:text-cyan-100" />
    </div>
  {/if}
  </div>
  {#if showModeDropdown}
  <div id='mode-dropdown' class="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-60 rounded shadow-lg z-10 grid grid-cols-10 items-center justify-center place-items-center { $settings.theme === 'light' ? 'bg-base-200 text-base-content' : 'bg-base-300 text-base-content' }">
  {#each Array.from(displayModes) as [m, enabled] (m)}
    <input class="duration-0 checkbox m-0 w-10 h-10 col-span-2" type="checkbox" id={m} checked={enabled} on:click={() => {
      settings.update('enabledModes', $settings.enabledModes.includes(m) ? $settings.enabledModes.filter(mode => mode !== m) : [...$settings.enabledModes, m])
    }} />
    <div
      on:click={e => {
        e.stopPropagation()
        settings.update('mode', m)
        showModeDropdown = false
      }}
      class="p-2 w-full col-span-8 text-center text-xl select-none transition-colors duration-100 cursor-pointer relative { $settings.theme === 'light' ? lightColors.get(m) : darkColors.get(m) }"
    >
      {formatMode(m)}

      {#if m.includes('tally')}
        <div class="absolute right-1 top-1/2 -translate-y-1/2" on:click|stopPropagation={() => {
          showTallyExplanation = true
        }}>
          <CircleHelp class="dark:hover:text-cyan-300 light:hover:text-cyan-100" />
        </div>
      {/if}
    </div>
  {/each}
  </div>
  {/if}
  <div on:click={nextMode} class="btn rounded border-0 px-2 rotate-90"><Triangle class="fill-base-100" /></div>
</div>

<div class="fixed inset-0 bg-opacity-50 flex items-center justify-center z-20" class:hidden={!showTallyExplanation} on:click={() => showTallyExplanation = false}>
  <div class="bg-base-200 text-base-content p-6 rounded shadow-lg max-w-lg mx-4" on:click|stopPropagation>
    <h2 class="text-xl font-bold mb-4">Tally Modes</h2>
    <div class="prose text-sm flex flex-col gap-2 ml-4">
      <p>Tally mode changes how matches are handled. Instead of pressing a hotkey for every stimulus that matches during a trial, you enter the <italic>count</italic> of how many stimuli matched.</p>
      <p>Because only one input is needed per trial, there’s no fixed trial timer. The game advances when you enter a number, and will be as fast as you're able to keep up.</p>
    </div>
    <div class="flex justify-end w-full"><button class="btn btn-primary mt-4" on:click={() => showTallyExplanation = false}>Close</button></div>
  </div>
</div>