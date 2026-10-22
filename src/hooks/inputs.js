import { useCallback, useEffect, useState } from 'react'
import { getRandomWord } from '../utils/gameStart'
import { evaluateGuess } from '../utils/gameLogic'
import { findFrenchWiktionaryTitle } from '../utils/wiktionary'

const NUMBER_OF_ROWS = 6
const WORD_LENGTH = 5

function createEmptyBoard() {
  return Array.from(
    { length: NUMBER_OF_ROWS },
    () => Array(WORD_LENGTH).fill(''),
  )
}

async function isFrenchWord(word) {
  const normalizedWord = normalizeWord(word)

  const searchParams = new URLSearchParams({
    action: 'query',
    list: 'search',
    srsearch: word,
    format: 'json',
    origin: '*',
  })

  const searchResponse = await fetch(
    `https://fr.wiktionary.org/w/api.php?${searchParams.toString()}`,
  )

  if (!searchResponse.ok) {
    throw new Error('Impossible de contacter le Wiktionnaire')
  }

  const searchData = await searchResponse.json()
  const searchResults = searchData.query?.search ?? []

  const matchingTitles = searchResults
    .map((result) => result.title)
    .filter((title) => normalizeWord(title) === normalizedWord)

  if (matchingTitles.length === 0) {
    return false
  }

  const categoryParams = new URLSearchParams({
    action: 'query',
    titles: matchingTitles.join('|'),
    prop: 'categories',
    cllimit: 'max',
    format: 'json',
    origin: '*',
  })

  const categoryResponse = await fetch(
    `https://fr.wiktionary.org/w/api.php?${categoryParams.toString()}`,
  )

  if (!categoryResponse.ok) {
    throw new Error('Impossible de récupérer les catégories Wiktionary')
  }

  const categoryData = await categoryResponse.json()
  const pages = Object.values(categoryData.query?.pages ?? {})

  return pages.some((page) =>
    page.categories?.some((category) =>
      normalizeWord(category.title).includes('en francais'),
    ),
  )
}

function normalizeWord(word) {
  return word
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

export function useInputs() {
  const [solution] = useState(() => getRandomWord())
  const [solutionTitle, setSolutionTitle] = useState(solution)
  const [board, setBoard] = useState(createEmptyBoard)
  const [currentRow, setCurrentRow] = useState(0)
  const [currentColumn, setCurrentColumn] = useState(0)
  const [guesses, setGuesses] = useState([])
  const [evaluations, setEvaluations] = useState(
    Array.from({ length: NUMBER_OF_ROWS }, () => null),
  )
  const [status, setStatus] = useState('playing')
  const [isCheckingWord, setIsCheckingWord] = useState(false)
  const [inputError, setInputError] = useState('')

  const handleKeyDown = useCallback(async (event) => {
    if (status !== 'playing' || currentRow >= NUMBER_OF_ROWS) {
      return
    }

    if (/^[a-zA-Z]$/.test(event.key)) {
      if (currentColumn >= WORD_LENGTH) {
        return
      }

      setInputError('')

      const letter = event.key.toLowerCase()

      setBoard((currentBoard) => {
        const newBoard = currentBoard.map((row) => [...row])
        newBoard[currentRow][currentColumn] = letter
        return newBoard
      })

      setCurrentColumn((column) => column + 1)
      return
    }

    if (event.key === 'Backspace') {
      event.preventDefault()

      if (currentColumn === 0) {
        return
      }

      setBoard((currentBoard) => {
        const newBoard = currentBoard.map((row) => [...row])
        newBoard[currentRow][currentColumn - 1] = ''
        return newBoard
      })

      setCurrentColumn((column) => column - 1)
      return
    }

    if (event.key === 'Enter') {
      event.preventDefault()

      if (currentColumn !== WORD_LENGTH || isCheckingWord) {
        return
      }

      const guess = board[currentRow].join('')

      setIsCheckingWord(true)
      setInputError('')

      try {

        const wiktionaryTitle = await findFrenchWiktionaryTitle(guess)

        if (!wiktionaryTitle) {
          setInputError('Ce n\'est pas un mot français.')
          return
        }
        const wordExists = await isFrenchWord(guess)


        const evaluation = evaluateGuess(guess, solution)

        setGuesses((currentGuesses) => [...currentGuesses, guess])

        setEvaluations((currentEvaluations) => {
          const newEvaluations = [...currentEvaluations]
          newEvaluations[currentRow] = evaluation
          return newEvaluations
        })

        if (guess === solution) {
          setSolutionTitle(wiktionaryTitle)
          setStatus('won')
          return
        }

        if (currentRow === NUMBER_OF_ROWS - 1) {
          const solutionWiktionaryTitle = await findFrenchWiktionaryTitle(solution)

          setSolutionTitle(solutionWiktionaryTitle ?? solution)
          setStatus('lost')
          return
        }

        setCurrentRow((row) => row + 1)
        setCurrentColumn(0)
      } catch (error) {
        setInputError(
          'La vérification du mot est impossible pour le moment. Réessaie.',
        )
      } finally {
        setIsCheckingWord(false)
      }
    }
  }, [
    board,
    currentColumn,
    currentRow,
    isCheckingWord,
    solution,
    status,
  ])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])

  return {
    board,
    guesses,
    evaluations,
    solution,
    solutionTitle,
    currentRow,
    status,
    isCheckingWord,
    inputError,
    essais: guesses.length,
    points: status === 'won' ? (NUMBER_OF_ROWS - currentRow) * 100 : 0,
  }
}