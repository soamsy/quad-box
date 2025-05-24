<script>
  import ThemeSwapper from "./lib/ThemeSwapper.svelte";
  import Drawer from "./lib/Drawer.svelte";
  import Cube from "./lib/Cube.svelte";
  import { settings } from "./stores/settingsStore";
  import { generateGame } from "./lib/nback";

  $: theme = $settings.theme === 'dark' ? 'black' : 'bumblebee';

  const game = generateGame($settings);
  console.log(game)
</script>

<main data-theme={theme}>

<Drawer>
  <div class="w-full h-full dark:bg-neutral-800 bg-white menu menu-horizontal">
    <Cube />
  </div>
</Drawer>
</main>

<style>

</style>
