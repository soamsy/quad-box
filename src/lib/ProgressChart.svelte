<script>
  import { onMount, onDestroy } from 'svelte'
  import { Chart, registerables } from 'chart.js'
  import 'chartjs-adapter-date-fns'
  import { getAllCompletedGames } from '../lib/gamedb'
  import { settings } from '../stores/settingsStore'

  Chart.register(...registerables)
  Chart.defaults.font.family = 'Go Mono'
  Chart.defaults.font.size = 16
  Chart.defaults.font.weight = 'normal'
  let chart
  let canvas

  const getColorFromTitle = (title) => {
    const hash = [...title].reduce((acc, c) => acc + c.charCodeAt(0) + 60, 0)
    const hue = hash % 360
    return `hsl(${hue}, 70%, ${$settings.theme === 'dark' ? '70' : '20'}%)`
  }

  const getChartOptions = (theme) => {
    const isDark = theme === 'dark'
    return {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          ticks: {
            color: isDark ? '#ccc' : '#333',
          },
          type: 'time',
          time: {
            unit: 'day',
            tooltipFormat: 'PP',
          },
          grid: {
            color: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
          },
          title: {
            display: true,
            text: 'Date',
            color: isDark ? '#eee' : '#111'
          }
        },
        y: {
          min: 0,
          suggestedMax: 4,
          ticks: {
            color: isDark ? '#ccc' : '#333',
          },
          grid: {
            color: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
          },
          title: {
            display: true,
            text: 'Score',
            color: isDark ? '#eee' : '#111'
          }
        }
      },
      plugins: {
        legend: {
          labels: {
            color: isDark ? '#ccc' : '#333'
          }
        },
        tooltip: {
          backgroundColor: isDark ? '#333' : '#fff',
          titleColor: isDark ? '#fff' : '#000',
          bodyColor: isDark ? '#eee' : '#111',
          callbacks: {
            label: ctx => `${ctx.dataset.label}: ${ctx.parsed.y.toFixed(2)}`
          }
        }
      }
    }
  }

  const getDailyAveragesByTitle = (games) => {
    const grouped = {}

    for (const { ncalc, timestamp, title } of games) {
      if (!title) continue

      const day = new Date(timestamp)
      day.setHours(0, 0, 0, 0)
      const key = day.getTime()

      if (!grouped[title]) grouped[title] = {}
      if (!grouped[title][key]) grouped[title][key] = []

      grouped[title][key].push(ncalc)
    }

    const datasets = Object.entries(grouped).map(([title, dayGroup]) => {
      const data = Object.entries(dayGroup).map(([ts, vals]) => ({
        x: new Date(Number(ts)),
        y: vals.reduce((a, b) => a + b, 0) / vals.length,
      }))

      return {
        label: title,
        data,
        fill: false,
        tension: 0.3,
        borderWidth: 2,
        borderColor: getColorFromTitle(title),
      }
    })

    return datasets
  }

  onMount(async () => {
    const games = (await getAllCompletedGames()).filter(game => 'ncalc' in game)
    const datasets = getDailyAveragesByTitle(games)

    chart = new Chart(canvas.getContext('2d'), {
      type: 'line',
      data: {
        datasets
      },
      options: getChartOptions($settings.theme),
    })
    handleResize()
  })

  const handleResize = () => {
    if (chart) {
      chart.resize()
    }
  }
  window.addEventListener('resize', handleResize)

  onDestroy(() => {
    if (chart) {
      chart.destroy()
    }
    window.removeEventListener('resize', handleResize)
  })
</script>

<div class="w-full h-[65svh]">
  <canvas bind:this={canvas}></canvas>
</div>

<style>
</style>