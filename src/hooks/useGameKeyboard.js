import { evaluateGuess } from '../utils/gameLogic'
import { findFrenchWiktionaryTitle } from '../utils/wiktionary'

export function useGameKeyboard({
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
}) {
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
    },
        [
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

    return handleKeyDown
}