
const DB_NAME = "PushBoxNBack"
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
      if (cursor) {
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

export async function getLastWeekGames() {
  return await getGamesTimeRange(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), new Date(Date.now() + 24 * 60 * 60 * 1000))
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
        playTime.total += (cursor.value.timestamp - cursor.value.start) / 1000
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

export const deleteDB = async () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.deleteDatabase(DB_NAME)
    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
    request.onblocked = () => reject(new Error("Delete blocked: another tab may be using the database"))
  })
}