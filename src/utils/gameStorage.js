export function getSavedGame(storageKey) {
  const savedGame = localStorage.getItem(storageKey)

  if (!savedGame) {
    return null
  }

  try {
    return JSON.parse(savedGame)
  } catch {
    localStorage.removeItem(storageKey)
    return null
  }
}

export function saveDailyGame(storageKey, game) {
  localStorage.setItem(storageKey, JSON.stringify(game))
}