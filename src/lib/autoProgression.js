import { getLast48HoursGames, addGame } from './gamedb'
import { get } from 'svelte/store'
import { autoProgression } from '../stores/autoProgressionStore'
import { settings } from '../stores/settingsStore'
import { gameSettings } from '../stores/gameSettingsStore'

const takeUntil = (array, condition) => {
  const i = array.findIndex(condition)
  return array.slice(0, i === -1 ? array.length : i)
}

export const runAutoProgression = async (gameInfo) => {
  const $settings = get(settings)
  if (!$settings.enableAutoProgression) {
    return
  }
  const successCriteria = $settings.successCriteria
  const failureCriteria = $settings.failureCriteria
  const successComboRequired = $settings.successComboRequired
  const failureComboRequired = $settings.failureComboRequired

  const recentGames = await getLast48HoursGames(Math.max(successComboRequired, failureComboRequired))
  const sameGames = recentGames.filter(game => ['completed', 'tombstone'].includes(game.status) && game.title === gameInfo.title && game.nBack === gameInfo.nBack)
  const applicableGames = takeUntil(sameGames, game => game.status === 'tombstone')
  const successGames = applicableGames.slice(0, successComboRequired)
  const failureGames = applicableGames.slice(0, failureComboRequired)

  if (successGames.length >= successComboRequired && successGames.every(game => (game.total.percent * 100) >= successCriteria)) {
    gameSettings.setField('nBack', Math.min(gameInfo.nBack + 1, 12))
    await addGame({ ...gameInfo, status: 'tombstone' }) 
    autoProgression.advance()
  } else if (failureGames.length >= failureComboRequired && failureGames.every(game => (game.total.percent * 100) < failureCriteria)) {
    gameSettings.setField('nBack', Math.max(gameInfo.nBack - 1, 1))
    await addGame({ ...gameInfo, status: 'tombstone' }) 
    autoProgression.fallback()
  }
}