<script>
  import { settings } from '../stores/settingsStore';
  import { Triangle } from '@lucide/svelte';
  $: mode = $settings.mode;

  const darkColors = new Map([
    ['quad', 'bg-rose-900'],
    ['dual', 'bg-cyan-800'],
    ['custom', 'bg-gray-700']
  ]);

  const lightColors = new Map([
    ['quad', 'bg-rose-400'],
    ['dual', 'bg-cyan-400'],
    ['custom', 'bg-gray-400']
  ]);

  const modes = [...lightColors.keys()];

  $: bg = $settings.theme === 'light' ? lightColors.get(mode) : darkColors.get(mode);

  const nextMode = () => {
    let nextIndex = modes.indexOf(mode) + 1;
    if (nextIndex > modes.length - 1) {
      nextIndex = 0;
    }
    settings.update('mode', modes[nextIndex]);
  }

  const prevMode = () => {
    let prevIndex = modes.indexOf(mode) - 1;
    if (prevIndex < 0) {
      prevIndex = modes.length - 1;
    }
    settings.update('mode', modes[prevIndex]);
  }
</script>

<div class="flex bg- items-center justify-around">
  <div on:click={prevMode} class="btn rounded px-2 -rotate-90"><Triangle class="fill-base-100" /></div>
  <div class="flex-grow flex items-center justify-center mx-2 p-1 text-2xl select-none transition-colors duration-100 {bg}">{mode.toUpperCase()}</div>
  <div on:click={nextMode} class="btn rounded px-2 rotate-90"><Triangle class="fill-base-100" /></div>
</div>


