import { useEffect, useRef, useState } from 'react'
import { getDailyGameKey, getDailyWord, getRandomWord, } from '../utils/gameStart'
import { getKeyStatuses, createEmptyBoard, getGameConfig } from '../utils/gameBoard'
import { getSavedGame, saveDailyGame } from '../utils/gameStorage'
import { useGameKeyboard } from '../hooks/useGameKeyboard'


export function useInputs(
  mode = 'free',
  wordLength = 5,
  difficulty = 'normal',
) {
  const { attempts, multiplier } = getGameConfig(wordLength)

  const pointMultiplier = difficulty === 'hard'
    ? 1.5
    : multiplier

  const freeGameId = useRef(crypto.randomUUID()).current

  const gameKey = mode === 'daily'
    ? getDailyGameKey()
    : `free-${wordLength}-${difficulty}-${freeGameId}`

  const storageKey = `mot-mystere-${mode}-${wordLength}-${difficulty}-${gameKey}`

  const savedGame = getSavedGame(storageKey)

  const isRestoredDailyGame = mode === 'daily'
    && savedGame !== null
    && savedGame.status !== 'playing'

  const [solution] = useState(() => (
    mode === 'daily'
      ? getDailyWord()
      : getRandomWord(wordLength)
  ))

  const [solutionTitle, setSolutionTitle] = useState(() => savedGame?.solutionTitle ?? solution)
  const [board, setBoard] = useState(() => (
    savedGame?.board ?? createEmptyBoard(wordLength, attempts)
  ))
  const [currentRow, setCurrentRow] = useState(() => savedGame?.currentRow ?? 0)
  const [currentColumn, setCurrentColumn] = useState(() => savedGame?.currentColumn ?? 0)
  const [guesses, setGuesses] = useState(() => savedGame?.guesses ?? [])
  const [evaluations, setEvaluations] = useState(() => savedGame?.evaluations ??
    Array.from({ length: attempts }, () => null)
  )
  const [status, setStatus] = useState(() => savedGame?.status ?? 'playing')
  const [isCheckingWord, setIsCheckingWord] = useState(false)
  const [inputError, setInputError] = useState('')
  const [shakeKey, setShakeKey] = useState(0)
  const [shakeRow, setShakeRow] = useState(null)
  const [startedAt] = useState(
    () => savedGame?.startedAt ?? Date.now(),
  )
  const temps = savedGame?.temps
    ?? Math.max(0, Math.floor((Date.now() - startedAt) / 1000))

  const handleKeyDown = useGameKeyboard({
    board,
    currentRow,
    currentColumn,
    wordLength,
    numberOfRows: attempts,
    difficulty,
    evaluations,
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
    setShakeRow
  })

  useEffect(() => {
    if (mode !== 'daily') {
      return
    }

    saveDailyGame(storageKey, {
      gameKey,
      solution,
      startedAt,
      board,
      currentRow,
      currentColumn,
      guesses,
      evaluations,
      status,
      solutionTitle,
      temps: savedGame?.temps
        ?? Math.max(0, Math.floor((Date.now() - startedAt) / 1000))
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
    startedAt,
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
    shakeRow,
    temps,
    essais: guesses.length,
    points: status === 'won'
      ? Math.round((attempts - currentRow) * 100 * pointMultiplier)
      : 0,
    isDailyCompleted: isRestoredDailyGame,
  }
}