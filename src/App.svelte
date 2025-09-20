<script>
import Drawer from "./lib/Drawer.svelte"
import DefaultGame from "./lib/DefaultGame.svelte"
import TallyGame from "./lib/TallyGame.svelte"
import ErrorDisplay from "./lib/ErrorDisplay.svelte"
import { settings } from "./stores/settingsStore"
import { setMobile } from "./stores/mobileStore"
import { onMount, onDestroy } from "svelte"

$: theme = $settings.theme === 'dark' ? 'black' : 'bumblebee'

onMount(() => {
  setMobile()
})
const onResize = () => setMobile()
const onOrientationChange = () => setMobile()

window.addEventListener('resize', onResize)
window.addEventListener('orientationchange', onOrientationChange)

const handleTouchStart = (event) => {
  for (const touch of event.changedTouches) {
    const target = document.elementFromPoint(touch.clientX, touch.clientY)
    if (target?.classList.contains('stimulus-button')) {
      target.click()
    }
  }
}
document.addEventListener('touchstart', handleTouchStart)
const handleTouchMove = (event) => {
  for (const touch of event.touches) {
    const target = document.elementFromPoint(touch.clientX, touch.clientY)
    if (target?.classList.contains('stimulus-button')) {
      target.click()
    }
  }
}
document.addEventListener('touchmove', handleTouchMove)

onDestroy(async () => {
  window.removeEventListener('resize', onResize)
  window.removeEventListener('orientationchange', onOrientationChange)
  document.removeEventListener('touchstart', handleTouchStart)
  document.removeEventListener('touchmove', handleTouchMove)
})

</script>

<main data-theme={theme} class={$settings.theme}>
<ErrorDisplay />
<Drawer>
  {#if $settings.mode === 'tally' || $settings.mode === 'vtally'}
  <TallyGame />
  {:else}
  <DefaultGame />
  {/if}
</Drawer>
</main>

<style>
</style>
