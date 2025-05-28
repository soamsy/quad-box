<script>
  import { onMount, onDestroy } from 'svelte'
  import { Chart, registerables } from 'chart.js'
  import 'chartjs-adapter-date-fns'
  import { getAllCompletedGames } from '../lib/gamedb'

  Chart.register(...registerables)
  Chart.defaults.font.family = 'Go Mono'
  Chart.defaults.font.size = 24
  Chart.defaults.font.weight = 'normal'
  let chart
  let canvas

  const getDailyAverages = (games) => {
    const grouped = {}

    games.forEach(({ ncalc, timestamp }) => {
      const day = new Date(timestamp)
      day.setHours(0, 0, 0, 0)
      const key = day.getTime()

      if (!grouped[key]) {
        grouped[key] = []
      }
      grouped[key].push(ncalc)
    })

    return Object.entries(grouped).map(([timestamp, values]) => ({
      date: new Date(Number(timestamp)),
      avg: values.reduce((a, b) => a + b, 0) / values.length
    }))
  }

  onMount(async () => {
    const games = (await getAllCompletedGames()).filter(game => 'ncalc' in game)
    const dailyAverages = getDailyAverages(games)
    const labels = dailyAverages.map(dp => dp.date)
    const values = dailyAverages.map(dp => dp.avg)

    chart = new Chart(canvas.getContext('2d'), {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Average N-Scores',
          data: values,
          borderColor: 'rgba(75,192,192,1)',
          backgroundColor: 'rgba(75,192,192,0.2)',
          fill: true,
          tension: 0.3
        }]
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
          },
          y: {
            beginAtZero: true,
            suggestedMax: 5,
            title: {
              display: true,
              text: 'N-Score'
            }
          }
        },
        plugins: {
          legend: {
            display: true
          },
          tooltip: {
            callbacks: {
              label: ctx => `Average: ${ctx.parsed.y.toFixed(2)}`
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