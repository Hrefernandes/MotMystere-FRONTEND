import { getDailyGameKey } from './gameStart'

export function isDailyDone() {
  try {
    const brut = localStorage.getItem(`mot-mystere-daily-${getDailyGameKey()}`)
    const sauvegarde = brut ? JSON.parse(brut) : null
    return sauvegarde !== null && sauvegarde.status !== 'playing'
  } catch {
    return false
  }
}