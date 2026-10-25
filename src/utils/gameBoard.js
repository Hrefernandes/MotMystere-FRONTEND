export const GAME_CONFIG = {
  5: {
    attempts: 6,
    multiplier: 1,
  },
  6: {
    attempts: 7,
    multiplier: 1.5,
  },
  7: {
    attempts: 8,
    multiplier: 2,
  },
}

export function getGameConfig(wordLength) {
  return GAME_CONFIG[wordLength] ?? GAME_CONFIG[5]
}

export function createEmptyBoard(wordLength, numberOfRows) {
  return Array.from(
    { length: numberOfRows },
    () => Array(wordLength).fill(''),
  )
}

export function getKeyStatuses(board, evaluations) {
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

  return keyStatuses
}