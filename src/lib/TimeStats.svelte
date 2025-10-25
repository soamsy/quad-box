<script>
import "@mariohamann/activity-graph"
import { settings } from "../stores/settingsStore"
import { getYearOfPlayTime } from "../lib/gamedb"
import { onMount, tick } from "svelte"
import { getGameDay, getLocalDateString } from "../lib/utils"

let activity = []
let scrollContainer
onMount(async () => {
  const playTime = await getYearOfPlayTime()
  let days = []
  for (let i = 0; i < 365; i++) {
    let date = new Date(Date.now() + (-364 + i) * 24 * 60 * 60 * 1000)
    const day = getGameDay(date)
    if (day in playTime) {
      date.setDate(date.getDate() + 1)
      for (let j = 0; j < playTime[day] && j < 300; j += 1) {
        days.push(getGameDay(date))
      }
    }
  }
  activity = days

  await tick()

  if (scrollContainer) {
    scrollContainer.scrollLeft = scrollContainer.scrollWidth / 2
  }
})

const start = getLocalDateString(new Date(Date.now() - 363 * 24 * 60 * 60 * 1000))
const end = getLocalDateString(new Date(Date.now() + 2 * 24 * 60 * 60 * 1000))
</script>

<div bind:this={scrollContainer} class="flex items-center justify-center w-full overflow-x-auto">
<activity-graph
class:activity-graph-dark={$settings.theme === 'dark'}
activity-data={activity}
range-start={start}
range-end={end}
activity-levels="0,1,15,30,45"
first-day-of-week="1"
>
</activity-graph>
</div>


<style>
  .activity-graph-dark {
    --activity-graph-text-color: #485058;
  }
</style>