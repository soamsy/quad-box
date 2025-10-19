import { getGameDay, getTruncatedDate } from "./utils"
const DB_NAME = "QuadBoxNBack"
const DB_VERSION = 1
const STORE_NAME = "games"

const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = (event) => {
      const db = event.target.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, {
          keyPath: "id",
          autoIncrement: true,
        })
        store.createIndex("status", "status")
        store.createIndex("timestamp", "timestamp")
        store.createIndex("status_timestamp", ["status", "timestamp"])
      }
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function addGame(gameInfo) {
  const db = await openDB()
  const tx = db.transaction(STORE_NAME, "readwrite")
  const store = tx.objectStore(STORE_NAME)
  await store.add(gameInfo)
  await tx.complete
  db.close()
}

export async function getLastRecentGame() {
  const db = await openDB()
  const tx = db.transaction(STORE_NAME, "readonly")
  const store = tx.objectStore(STORE_NAME)
  const index = store.index("timestamp")

  const twoHoursAgo = Date.now() - 120 * 60 * 1000
  const keyRange = IDBKeyRange.lowerBound(twoHoursAgo)

  return new Promise((resolve, reject) => {
    const cursorRequest = index.openCursor(keyRange, "prev")

    cursorRequest.onsuccess = (event) => {
      const cursor = event.target.result
      if (cursor && cursor.value.status === "tombstone") {
        cursor.continue()
      } else if (cursor) {
        addScoreMetadata(cursor.value)
        resolve(cursor.value)
      } else {
        resolve(null)
      }
      db.close()
    }

    cursorRequest.onerror = () => {
      db.close()
      reject(cursorRequest.error)
    }
  })
}

export async function getAllCompletedGames() {
  const db = await openDB()
  const tx = db.transaction(STORE_NAME, "readonly")
  const store = tx.objectStore(STORE_NAME)
  const index = store.index("status_timestamp")

  const games = []

  return new Promise((resolve, reject) => {
    const keyRange = IDBKeyRange.bound(["completed", 0], ["completed", Infinity])
    const cursorRequest = index.openCursor(keyRange, "prev")

    cursorRequest.onsuccess = (event) => {
      const cursor = event.target.result
      if (cursor) {
        addScoreMetadata(cursor.value)
        games.push(cursor.value)
        cursor.continue()
      } else {
        db.close()
        resolve(games)
      }
    }

    cursorRequest.onerror = () => {
      db.close()
      reject(cursorRequest.error)
    }
  })
}

export async function getLast48HoursGames() {
  return await getGamesTimeRange(new Date(Date.now() - 48 * 60 * 60 * 1000), new Date(Date.now() + 24 * 60 * 60 * 1000))
}

export async function getLastMonthGames() {
  return await getGamesTimeRange(new Date(Date.now() - 28 * 24 * 60 * 60 * 1000), new Date(Date.now() + 24 * 60 * 60 * 1000))
}

export async function getGamesTimeRange(start, end) {
  const db = await openDB()
  const tx = db.transaction(STORE_NAME, "readonly")
  const store = tx.objectStore(STORE_NAME)
  const index = store.index("timestamp")

  const games = []

  return new Promise((resolve, reject) => {
    const keyRange = IDBKeyRange.bound(start.getTime(), end.getTime())
    const cursorRequest = index.openCursor(keyRange, "prev")

    cursorRequest.onsuccess = (event) => {
      const cursor = event.target.result
      if (cursor) {
        addScoreMetadata(cursor.value)
        games.push(cursor.value)
        cursor.continue()
      } else {
        db.close()
        resolve(games)
      }
    }

    cursorRequest.onerror = () => {
      db.close()
      reject(cursorRequest.error)
    }
  })
}

export async function getPlayTimeSince4AM() {
  const db = await openDB()
  const tx = db.transaction(STORE_NAME, "readonly")
  const store = tx.objectStore(STORE_NAME)
  const index = store.index("timestamp")

  const now = new Date()
  const fourAM = new Date(now)
  fourAM.setHours(4, 0, 0, 0)
  if (now < fourAM) {
    fourAM.setDate(fourAM.getDate() - 1)
  }

  const lowerBound = fourAM.getTime()
  const playTime = { total: 0 }

  return new Promise((resolve, reject) => {
    const range = IDBKeyRange.lowerBound(lowerBound)
    const cursorRequest = index.openCursor(range)

    cursorRequest.onsuccess = (event) => {
      const cursor = event.target.result
      if (cursor) {
        if (cursor.value.status !== "tombstone") {
          addScoreMetadata(cursor.value)
          playTime.total += cursor.value.elapsedSeconds
        }
        cursor.continue()
      } else {
        db.close()
        resolve(playTime.total)
      }
    }

    cursorRequest.onerror = () => {
      db.close()
      reject(cursorRequest.error)
    }
  })
}

export const getYearOfPlayTime = async () => {
  const db = await openDB()
  const tx = db.transaction(STORE_NAME, "readonly")
  const store = tx.objectStore(STORE_NAME)
  const index = store.index("timestamp")

  const now = new Date()
  const oneYearAgo = new Date(now)
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
  oneYearAgo.setHours(4, 0, 0, 0)

  const lowerBound = oneYearAgo.getTime()
  let games = {}

  return new Promise((resolve, reject) => {
    const range = IDBKeyRange.lowerBound(lowerBound)
    const cursorRequest = index.openCursor(range)

    cursorRequest.onsuccess = (event) => {
      const cursor = event.target.result
      if (cursor) {
        if (cursor.value.status !== "tombstone") {
          addScoreMetadata(cursor.value)
          const day = getGameDay(cursor.value.timestamp)
          if (!games[day]) {
            games[day] = 0
          }
          games[day] += cursor.value.elapsedSeconds / 60
        }
        cursor.continue()
      } else {
        db.close()
        resolve(games)
      }
    }

    cursorRequest.onerror = () => {
      db.close()
      reject(cursorRequest.error)
    }
  })
}


const addScoreMetadata = (game) => {
  if (game.status === 'tombstone') {
    return game
  }
  if ('start' in game) {
    game.elapsedSeconds = (game.timestamp - game.start) / 1000
  } else {
    game.elapsedSeconds = game.trialTime * game.completedTrials / 1000
  }
  game.dayTimestamp = getTruncatedDate(game.timestamp).getTime()
  game.total = { hits: 0, misses: 0, percent: 0, possible: 0, ncalc: 0 }
  if (game?.mode === 'tally' || game?.scores?.tally) {
    game.total.hits = game.scores.tally.hits
    game.total.possible = game.scores.tally.possible
    game.total.misses = game.scores.tally.possible - game.scores.tally.hits
    game.total.percent = 0
    if (game.scores.tally.hits > 0) {
      game.total.percent = game.scores.tally.hits / game.scores.tally.possible
    }
  } else {
    for (const tag of game.tags) {
      game.total.hits += game.scores[tag].hits
      game.total.misses += game.scores[tag].misses
      game.scores[tag].possible = game.scores[tag].hits + game.scores[tag].misses
      game.scores[tag].percent = 0
      if (game.scores[tag].hits > 0) {
        game.scores[tag].percent = game.scores[tag].hits / game.scores[tag].possible
      }
    }
  }

  game.total.possible = game.total.hits + game.total.misses
  if (game.total.hits > 0) {
    game.total.percent = game.total.hits / game.total.possible
  }

  if (game.total.percent >= 0.4 && game?.mode !== 'tally') {
    game.ncalc = game.nBack + (game.total.percent - 0.5) * 2.7
  }

  if (game?.mode === 'tally') {
    game.total.averageTrialTime = (game.timestamp - game.start) / game.completedTrials
  }
}

export const deleteDB = async () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.deleteDatabase(DB_NAME)
    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
    request.onblocked = () => reject(new Error("Delete blocked: another tab may be using the database"))
  })
}