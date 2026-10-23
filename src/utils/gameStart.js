import motsSolutions from '../data/mots_solutions.json'

export function getRandomWord() {
    const randomIndex = Math.floor(Math.random() * motsSolutions.length)

    return motsSolutions[randomIndex]
}

function getDateKey() {
    return new Intl.DateTimeFormat('fr-CA', {
        timeZone: 'Europe/Paris',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).format(new Date())
}

function hashString(value) {
    let hash = 0

    for (let index = 0; index < value.length; index += 1) {
        hash = (hash * 31 + value.charCodeAt(index)) >>> 0
    }

    return hash
}

export function getDailyWord() {
    const dateKey = getDateKey()
    const wordIndex = hashString(dateKey) % motsSolutions.length

    return motsSolutions[wordIndex]
}

export function getDailyGameKey() {
    return `daily-${getDateKey()}`
}