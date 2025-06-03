<script>
  import { onMount } from "svelte"
  import { getLastWeekGames } from "../lib/gamedb"
  import { settings } from "../stores/settingsStore"
  import { recentGamesState } from "../stores/recentGamesStore"
  import { formatSeconds } from "./utils"

  let games = []

  onMount(async () => {
    games = await getLastWeekGames()
  })

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return $settings.theme === "light" ? "bg-green-400" : "bg-green-700"
      case "cancelled":
        return $settings.theme === "light" ? "bg-red-400" : "bg-red-700"
      default:
        return $settings.theme === "light" ? "bg-gray-400" : "bg-gray-700"
    }
  }

  const getStatusClass = (status) => {
    let className = getStatusColor(status)
    className += " text-white py-1 px-2 rounded"
    return className
  }

  const getPercentColor = (percent) => {
    if (percent > 0.7) {
      return $settings.theme === "light" ? "bg-[#2BFF24]" : "bg-[#0BaF04]"
    } if (percent > 0.6) {
      return $settings.theme === "light" ? "bg-[#B9FF24]" : "bg-[#60AF00]"
    } if (percent > 0.5) {
      return $settings.theme === "light" ? "bg-[#FFFF24]" : "bg-[#8E8E08]"
    } else if (percent > 0.4) {
      return $settings.theme === "light" ? "bg-[#FFA324]" : "bg-[#A95C00]"
    } else {
      return $settings.theme === "light" ? "bg-[#FF3131]" : "bg-[#CC2525]"
    }
  }

  const getPercentClass = (percent) => {
    if (percent === undefined) {
      return
    }
    let className = getPercentColor(percent)
    className += ' py-1 px-2 rounded'
    className += $settings.theme === "light" ? " text-black" : " text-white"
    return className
  }

  const formatPercent = (percent) => {
    if (percent === undefined) {
      return ''
    }
    return (percent * 100).toFixed(0) + '%'
  }

  const getDayLabel = (timestamp) => {
    const today = new Date()
    const input = new Date(timestamp)
    today.setHours(0, 0, 0, 0)
    input.setHours(0, 0, 0, 0)

    const diffDays = Math.round((today - input) / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return '1 day ago'
    return `${diffDays} days ago`
  }

  $: filteredGames = $recentGamesState.filter === "completed" ? games.filter(game => game.status === "completed") : games.filter(game => ['completed', 'cancelled'].includes(game.status))
</script>

<table class="table table-auto">
  <thead>
    <tr>
      <th>Date</th>
      <th>Game</th>
      <th>N</th>
      <th>Score</th>
      {#if $recentGamesState.filter !== "completed"}
      <th>Status</th>
      {/if}
      <th>Position</th>
      <th>Audio</th>
      <th>Color</th>
      <th>Shape</th>
      <th>Time</th>
    </tr>
  </thead>
  <tbody>
    {#each filteredGames as game (game.id)}
      <tr>
        <td>{getDayLabel(game.timestamp)}</td>
        <td>{game.title.toUpperCase()}</td>
        <th>{game.nBack}</th>
        <td><span class={getPercentClass(game?.total?.percent)}>{formatPercent(game?.total?.percent)}</span></td>

        <td><span class={getPercentClass(game?.scores?.position?.percent)}>{formatPercent(game?.scores?.position?.percent)}</span></td>
        <td><span class={getPercentClass(game?.scores?.audio?.percent)}>{formatPercent(game?.scores?.audio?.percent)}</span></td>
        <td><span class={getPercentClass(game?.scores?.color?.percent)}>{formatPercent(game?.scores?.color?.percent)}</span></td>
        <td><span class={getPercentClass(game?.scores?.shapeColor?.percent ?? game?.scores?.shape?.percent)}>{formatPercent(game?.scores?.shapeColor?.percent ?? game?.scores?.shape?.percent)}</span></td>
        <td>{formatSeconds(game.trialTime * game.completedTrials / 1000)}</td>
        {#if $recentGamesState.filter !== "completed"}
          <td><span class={getStatusClass(game.status)}>{game.status}</span></td>
        {/if}
      </tr>
    {/each}
  </tbody>
</table>

<style>

</style>