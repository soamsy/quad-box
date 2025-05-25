
export const formatSeconds = (seconds) => {
  const hours = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)

  const paddedMins = mins.toString().padStart(2, '0')
  const paddedSecs = secs.toString().padStart(2, '0')

  if (hours > 0) {
    return `${hours}h ${paddedMins}m ${paddedSecs}s`
  } else {
    return `${mins}m ${paddedSecs}s`
  }
}