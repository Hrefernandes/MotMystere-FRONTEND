import { useEffect, useState } from 'react'
import { getDailyGameKey, getDailyWord, getRandomWord, } from '../utils/gameStart'

import { getKeyStatuses, createEmptyBoard, NUMBER_OF_ROWS } from '../utils/gameboard'
import { getSavedGame, saveDailyGame } from '../utils/gameStorage'
import { useGameKeyboard } from '../hooks/useGameKeyboard'


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

  const [solutionTitle, setSolutionTitle] = useState(() => savedGame?.solutionTitle ?? solution)
  const [board, setBoard] = useState(() => savedGame?.board ?? createEmptyBoard())
  const [currentRow, setCurrentRow] = useState(() => savedGame?.currentRow ?? 0)
  const [currentColumn, setCurrentColumn] = useState(() => savedGame?.currentColumn ?? 0)
  const [guesses, setGuesses] = useState(() => savedGame?.guesses ?? [])
  const [evaluations, setEvaluations] = useState(() => savedGame?.evaluations ??
    Array.from({ length: NUMBER_OF_ROWS }, () => null)
  )
  const [status, setStatus] = useState(() => savedGame?.status ?? 'playing')
  const [isCheckingWord, setIsCheckingWord] = useState(false)
  const [inputError, setInputError] = useState('')
  const [shakeKey, setShakeKey] = useState(0)

  const handleKeyDown = useGameKeyboard({
    board,
    currentRow,
    currentColumn,
    isCheckingWord,
    solution,
    status,
    setBoard,
    setCurrentColumn,
    setCurrentRow,
    setEvaluations,
    setGuesses,
    setInputError,
    setIsCheckingWord,
    setShakeKey,
    setSolutionTitle,
    setStatus,
  })

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

    saveDailyGame(storageKey, {
      gameKey,
      solution,
      board,
      currentRow,
      currentColumn,
      guesses,
      evaluations,
      status,
      solutionTitle,
    })
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

  const keyStatuses = getKeyStatuses(board, evaluations)

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