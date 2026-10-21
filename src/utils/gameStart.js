import motsSolutions from '../data/mots_solutions.json'

export function getRandomWord() {
    const randomIndex = Math.floor(Math.random() * motsSolutions.length)

    return motsSolutions[randomIndex]
}