import { useCallback, useEffect, useState } from 'react'
import {
  getDailyGameKey,
  getDailyWord,
  getRandomWord,
} from '../utils/gameStart'
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

function getSavedGame(storageKey) {
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

export function useInputs(mode = 'free') {
  const gameKey = mode === 'daily'
    ? getDailyGameKey()
    : `free-${crypto.randomUUID()}`

  const storageKey = `mot-mystere-${mode}-${gameKey}`
  const savedGame = getSavedGame(storageKey)

  const isRestoredDailyGame = mode === 'daily'
    && savedGame !== null
    && savedGame.status !== 'playing'

  const [solution] = useState(() => (
    mode === 'daily'
      ? getDailyWord()
      : getRandomWord()
  ))

  const [solutionTitle, setSolutionTitle] = useState(
    () => savedGame?.solutionTitle ?? solution,
  )
  const [board, setBoard] = useState(
    () => savedGame?.board ?? createEmptyBoard(),
  )
  const [currentRow, setCurrentRow] = useState(
    () => savedGame?.currentRow ?? 0,
  )
  const [currentColumn, setCurrentColumn] = useState(
    () => savedGame?.currentColumn ?? 0,
  )
  const [guesses, setGuesses] = useState(
    () => savedGame?.guesses ?? [],
  )
  const [evaluations, setEvaluations] = useState(
    () => savedGame?.evaluations
      ?? Array.from({ length: NUMBER_OF_ROWS }, () => null),
  )
  const [status, setStatus] = useState(
    () => savedGame?.status ?? 'playing',
  )
  const [isCheckingWord, setIsCheckingWord] = useState(false)
  const [inputError, setInputError] = useState('')
  const [shakeKey, setShakeKey] = useState(0)

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
          setShakeKey((key) => key + 1)
          return
        }


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

  useEffect(() => {
    if (mode !== 'daily') {
      return
    }

    const savedGame = {
      gameKey,
      solution,
      board,
      currentRow,
      currentColumn,
      guesses,
      evaluations,
      status,
      solutionTitle,
    }

    localStorage.setItem(storageKey, JSON.stringify(savedGame))
  }, [
    mode,
    gameKey,
    solution,
    board,
    currentRow,
    currentColumn,
    guesses,
    evaluations,
    status,
    solutionTitle,
    storageKey,
  ])

  const isDailyCompleted = mode === 'daily' && status !== 'playing'

  const keyStatuses = {}

  evaluations.forEach((evaluationRow, rowIndex) => {
    if (!evaluationRow) {
      return
    }

    evaluationRow.forEach((letterStatus, columnIndex) => {
      const letter = board[rowIndex][columnIndex]

      if (!letter) {
        return
      }

      const previousStatus = keyStatuses[letter]

      if (
        previousStatus === 'correct'
        || (previousStatus === 'present' && letterStatus === 'absent')
      ) {
        return
      }

      keyStatuses[letter] = letterStatus
    })
  })

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
    keyStatuses,
    handleKeyDown,
    shakeKey,
    essais: guesses.length,
    points: status === 'won' ? (NUMBER_OF_ROWS - currentRow) * 100 : 0,
    isDailyCompleted: isRestoredDailyGame,
  }
}