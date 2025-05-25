<script>
  import Drawer from "./lib/Drawer.svelte"
  import Cube from "./lib/Cube.svelte"
  import { settings } from "./stores/settingsStore"
  import { mobile, setMobile } from "./stores/mobileStore"
  import { generateGame } from "./lib/nback"
  import { onMount } from "svelte"

  $: theme = $settings.theme === 'dark' ? 'black' : 'bumblebee'
  $: isMobile = $mobile


  onMount(() => {
    setMobile()
  })

  window.addEventListener('resize', () => setMobile())
  window.addEventListener('orientationchange', setMobile)

  const game = generateGame($settings)
  console.log(game)
</script>

<main data-theme={theme}>

<Drawer>
    <Cube />
    {#if isMobile}
    <div class="stretch grid grid-rows-[1fr_7fr_2fr] md:grid-rows-[1fr_8fr_2fr] gap-1">
      <div class="w-full h-full flex items-center justify-between row-start-1 p-8">
        <div class="text-4xl ml-2" >{$settings.numTrials}</div>
        <button class="game-button text-4xl p-8 md:p-10">Play</button>
      </div>
      <div class="flex w-full h-full gap-1 row-start-3 md:mt-6">
        <button class="game-button-sm">A<span class="game-button-sm-hint">Position</span></button>
        <button class="game-button-sm">F<span class="game-button-sm-hint">Color</span></button>
        <button class="game-button-sm">J<span class="game-button-sm-hint">Shape</span></button>
        <button class="game-button-sm">L<span class="game-button-sm-hint">Audio</span></button>
      </div>
    </div>
    {:else}
    <div class="stretch grid grid-cols-[1fr_3fr_3fr_1fr] grid-rows-[1fr_6fr_1fr]">
      <div class="w-full h-full flex items-center justify-between col-start-1 col-span-4 px-2">
        <div></div>
        <button class="game-button text-5xl px-12 py-10 max-w-[90%] mr-4">Play</button>
      </div>
      <div class="game-button-lg-group row-start-2 col-start-1 pr-24">
        <button class="game-button-lg">A<span class="game-button-lg-hint">Position</span></button>
        <button class="game-button-lg">F<span class="game-button-lg-hint">Color</span></button>
      </div>
      <div class="game-button-lg-group row-start-2 col-start-4 pl-24">
        <button class="game-button-lg">L<span class="game-button-lg-hint">Audio</span></button>
        <button class="game-button-lg">J<span class="game-button-lg-hint">Shape</span></button>
      </div>
      <div class="w-full h-full flex items-center justify-center text-6xl ml-6 row-start-3 col-start-4">{$settings.numTrials}</div>
    </div>
    {/if}
</Drawer>
</main>

<style>

</style>
