<script>
  import { settings } from "../stores/settingsStore"
</script>
<img src={$settings.theme === 'dark' ? 'frame-dark.svg' : 'frame-light.svg'} alt="" class="w-full h-full">