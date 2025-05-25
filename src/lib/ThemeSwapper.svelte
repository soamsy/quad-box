<script>
  import { Moon, Sun } from "@lucide/svelte"
  import { settings } from "../stores/settingsStore"

  const toggleTheme = () => {
    settings.update('theme', $settings.theme === 'light' ? 'dark' : 'light')
  }
</script>

<span>
<label class="swap swap-rotate">
  <input on:click={toggleTheme} hidden type="checkbox" checked={$settings.theme === 'light'}/>
  <Moon class="swap-off h-8 w-8 fill-current" />
  <Sun class="swap-on h-8 w-8 fill-current" />
</label>
</span>