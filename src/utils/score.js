export function getGames() {
  try {
    const brut = localStorage.getItem('parties')
    const parties = brut ? JSON.parse(brut) : []
    return Array.isArray(parties) ? parties : []
  } catch {
    return []
  }
}

export function saveGame(partie) {
  try {
    localStorage.setItem('parties', JSON.stringify([...getGames(), partie]))
  } catch {
  }
}