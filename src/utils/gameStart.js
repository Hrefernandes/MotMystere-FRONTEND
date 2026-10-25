import motsSolutions5 from '../data/mots_solutions_5.json'
import motsSolutions6 from '../data/mots_solutions_6.json'
import motsSolutions7 from '../data/mots_solutions_7.json'

const WORD_LISTS = {
    5: motsSolutions5,
    6: motsSolutions6,
    7: motsSolutions7,
}

export function getRandomWord(wordLength = 5) {
    const motsSolutions = WORD_LISTS[wordLength]

    if (!motsSolutions) {
        throw new Error(`Aucune liste disponible pour ${wordLength} lettres.`)
    }

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
    const wordIndex = hashString(dateKey) % motsSolutions5.length

    return motsSolutions5[wordIndex]
}

export function getDailyGameKey() {
    return `daily-${getDateKey()}`
}