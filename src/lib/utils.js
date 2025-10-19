
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

export const getTruncatedDate = (timestamp) => {
  const date = new Date(timestamp)
  if (date.getHours() < 4) {
    date.setDate(date.getDate() - 1)
  }
  date.setHours(0,0,0,0)
  return date
}

export const getGameDay = (timestamp) => {
  const truncatedDate = getTruncatedDate(timestamp)
  return getLocalDateString(truncatedDate)
}

export const getLocalDateString = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const pick = (pool) => {
  return pool[Math.floor(Math.random() * pool.length)]
}

export const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const tmp = array[i]
    array[i] = array[j]
    array[j] = tmp
  }
  return array
}

export const seededRandom = (seed) => {
  let m = 2 ** 31 - 1 // Large prime number
  let a = 48271       // Multiplier
  let c = 1           // Increment
  let state = seed % m
  for (let i = 0; i < 10; i++) {
    state = (a * state + c) % m
  }

  return () => {
    state = (a * state + c) % m
    return state / m // Normalize to [0, 1)
  }
}