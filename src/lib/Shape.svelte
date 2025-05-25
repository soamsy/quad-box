<script>
import { settings } from "../stores/settingsStore"
export let trial = {}
$: shape = trial.shape
$: fill = trial.color
$: backgroundColor = $settings.theme === 'dark' ? (fill === '#FFFFFF' ? '#EEEEEE' : '#FDFDFD') : '#FAFAFA'
$: strokeColor = $settings.theme === 'dark' ? '#333' : '#222'
</script>

<div class="shape" style="background-color: {backgroundColor};">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 110 110" class="{shape === 'heart' ? 'w-[100%] h-[95%]' : 'w-[80%] h-[80%]'}">
    <use href="#{shape}" fill="{fill}" stroke="{strokeColor}" stroke-width="1" />
  </svg>
</div>


<style>
  .shape {
    @apply w-full h-full flex items-center justify-center;
  }
</style>