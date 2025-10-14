export const migrateToV3 = (settings) => {
  if (settings?.version !== 'v2') {
    return settings
  }

  settings.version = 'v3'

  if (!settings.enabledModes) {
    settings.enabledModes = ['quad', 'dual', 'custom', 'customB']
    if (settings.enableTallyBeta) {
      settings.enabledModes.push('tally')
    }
    if (settings.enableVisualTallyBeta) {
      settings.enabledModes.push('vtally')
    }
  }

  delete settings.enableTallyBeta
  delete settings.enableVisualTallyBeta

  return settings
}