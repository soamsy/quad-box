<script>
import "@mariohamann/activity-graph"
import { settings } from "../stores/settingsStore"
import { getYearOfPlayTime } from "../lib/gamedb"
import { onMount } from "svelte"
import { getLocalDateString } from "../lib/utils"


let activity = []
onMount(async () => {
  const playTime = await getYearOfPlayTime()
  let days = []
  for (let i = 0; i < 365; i++) {
    let date = new Date(Date.now() + (-364 + i) * 24 * 60 * 60 * 1000)
    const day = getLocalDateString(date)
    if (day in playTime) {
      date.setDate(date.getDate() + 1)
      const displayDay = getLocalDateString(date)
      for (let j = 0; j < playTime[day] && j < 300; j += 1) {
        days.push(displayDay)
      }
    }
  }
  activity = days
})

const start = getLocalDateString(new Date(Date.now() - 363 * 24 * 60 * 60 * 1000))
const end = getLocalDateString(new Date(Date.now() + 2 * 24 * 60 * 60 * 1000))
</script>

<div class="flex items-center justify-center w-full overflow-x-auto">
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