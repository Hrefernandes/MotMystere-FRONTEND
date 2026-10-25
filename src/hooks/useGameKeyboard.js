import { evaluateGuess } from '../utils/gameLogic'
import { findFrenchWiktionaryTitle } from '../utils/wiktionary'
import { useCallback, useEffect } from 'react'
import { validateHardModeGuess } from '../utils/hardMode'

export function useGameKeyboard({
    board,
    currentRow,
    currentColumn,
    wordLength,
    numberOfRows,
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
    setShakeRow,
    difficulty,
    evaluations,
}) {
    const handleKeyDown = useCallback(async (event) => {
        if (status !== 'playing' || currentRow >= numberOfRows) {
            return
        }

        if (/^[a-zA-Z]$/.test(event.key)) {
            if (currentColumn >= wordLength) {
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

            if (currentColumn !== wordLength || isCheckingWord) {
                return
            }

            const guess = board[currentRow].join('')

            setIsCheckingWord(true)
            setInputError('')

            try {
                if (difficulty === 'hard') {
                    const hardModeError = validateHardModeGuess(
                        guess,
                        board,
                        evaluations,
                    )

                    if (hardModeError) {
                        setInputError(hardModeError)
                        setShakeKey((key) => key + 1)
                        setShakeRow(currentRow)
                        return
                    }
                }
                const wiktionaryTitle = await findFrenchWiktionaryTitle(guess)

                if (!wiktionaryTitle) {
                    setInputError('Ce n\'est pas un mot français.')
                    setShakeKey((key) => key + 1)
                    setShakeRow(currentRow)
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

                if (currentRow === numberOfRows - 1) {
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
    },
        [
            board,
            currentColumn,
            currentRow,
            difficulty,
            evaluations,
            isCheckingWord,
            numberOfRows,
            solution,
            status,
            wordLength,
        ])

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown)

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [handleKeyDown])

    return handleKeyDown
}