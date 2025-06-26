<script>
  import { settings } from "../stores/settingsStore"
  $: frameSrc = $settings.theme === 'dark' ? 'frame-dark.svg' : 'frame-light.svg'
  $: classes = `absolute w-full h-full ${$$props.class}`
</script>

<img src={frameSrc} class={classes}>