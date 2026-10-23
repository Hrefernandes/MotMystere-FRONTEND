export const NUMBER_OF_ROWS = 6
export const WORD_LENGTH = 5

export function createEmptyBoard() {
  return Array.from(
    { length: NUMBER_OF_ROWS },
    () => Array(WORD_LENGTH).fill(''),
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