<script>
  import { onMount, onDestroy } from 'svelte'
  import { Chart, registerables } from 'chart.js'
  import 'chartjs-adapter-date-fns'
  import { getAllCompletedGames } from '../lib/gamedb'
  import { settings } from '../stores/settingsStore'

  Chart.register(...registerables)
  Chart.defaults.font.family = 'Go Mono'
  Chart.defaults.font.size = 24
  Chart.defaults.font.weight = 'normal'
  let chart
  let canvas

  const getColorFromTitle = (title) => {
    const hash = [...title].reduce((acc, c) => acc + c.charCodeAt(0) + 60, 0)
    const hue = hash % 360
    return `hsl(${hue}, 70%, ${$settings.theme === 'dark' ? '70' : '20'}%)`
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
      options: {
        responsive: true,
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'day',
              tooltipFormat: 'PP',
            },
            title: {
              display: true,
              text: 'Date'
            }
          },
          y: {
            min: 0,
            suggestedMax: 4,
            title: {
              display: true,
              text: 'Score'
            }
          }
        },
        plugins: {
          legend: {
            display: true
          },
          tooltip: {
            callbacks: {
              label: ctx => `${ctx.dataset.label}: ${ctx.parsed.y.toFixed(2)}`
            }
          }
        }
      }
    })
  })

  onDestroy(() => {
    if (chart) chart.destroy()
  })
</script>

<div>
  <canvas bind:this={canvas}></canvas>
</div>

<style>
  canvas {
    width: 100%;
    height: 70svh;
  }
</style>