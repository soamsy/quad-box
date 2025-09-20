export const migrateToV2 = (settings) => {
  if (settings?.version !== 'v1') {
    return settings
  }

  settings.version = 'v2'
  const globalAudioSource = settings.audioSource
  if (globalAudioSource) {
    for (const [_, subSettings] of Object.entries(settings.gameSettings)) {
      subSettings.audioSource = globalAudioSource
    }
    delete settings.audioSource
  }

  const globalPatternSource = settings['patternSource']
  if (globalPatternSource) {
    for (const [_, subSettings] of Object.entries(settings.gameSettings)) {
      subSettings.imageSource = globalPatternSource
    }
    delete settings.patternSource
  }

  for (const [_, subSettings] of Object.entries(settings.gameSettings)) {
    subSettings.enableImage = subSettings.enableShapeColor
    delete subSettings.enableShapeColor
  }

  return settings
}