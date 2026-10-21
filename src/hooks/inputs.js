import { useCallback, useEffect, useState } from 'react'
import { getRandomWord } from '../utils/gameStart'
import { evaluateGuess } from '../utils/gameLogic'

const NUMBER_OF_ROWS = 6
const WORD_LENGTH = 5

function createEmptyBoard() {
  return Array.from(
    { length: NUMBER_OF_ROWS },
    () => Array(WORD_LENGTH).fill(''),
  )
}

export function useInputs() {
  const [solution] = useState(() => getRandomWord())
  const [board, setBoard] = useState(createEmptyBoard)
  const [currentRow, setCurrentRow] = useState(0)
  const [currentColumn, setCurrentColumn] = useState(0)
  const [guesses, setGuesses] = useState([])
  const [evaluations, setEvaluations] = useState(
    Array.from({ length: NUMBER_OF_ROWS }, () => null),
  )

  const handleKeyDown = useCallback((event) => {
    if (currentRow >= NUMBER_OF_ROWS) {
      return
    }

    if (/^[a-zA-Z]$/.test(event.key)) {
      if (currentColumn >= WORD_LENGTH) {
        return
      }

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

      if (currentColumn !== WORD_LENGTH) {
        return
      }

      const guess = board[currentRow].join('')
      const evaluation = evaluateGuess(guess, solution)

      setGuesses((currentGuesses) => [...currentGuesses, guess])

      setEvaluations((currentEvaluations) => {
        const newEvaluations = [...currentEvaluations]
        newEvaluations[currentRow] = evaluation
        return newEvaluations
      })

      setCurrentRow((row) => row + 1)
      setCurrentColumn(0)
    }
  }, [board, currentColumn, currentRow, solution])

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
    currentRow,
  }
}