function countLetters(word) {
  return [...word].reduce((counts, letter) => {
    counts[letter] = (counts[letter] ?? 0) + 1
    return counts
  }, {})
}

export function validateHardModeGuess(guess, board, evaluations) {
  const requiredLetters = {}
  const fixedLetters = {}

  evaluations.forEach((evaluationRow, rowIndex) => {
    if (!evaluationRow) {
      return
    }

    evaluationRow.forEach((status, columnIndex) => {
      const letter = board[rowIndex][columnIndex]

      if (status === 'correct') {
        fixedLetters[columnIndex] = letter
      }

      if (status === 'present') {
        requiredLetters[letter] = (requiredLetters[letter] ?? 0) + 1
      }
    })
  })

  for (const [columnIndex, letter] of Object.entries(fixedLetters)) {
    if (guess[Number(columnIndex)] !== letter) {
      return `La lettre « ${letter.toUpperCase()} » doit rester en position ${Number(columnIndex) + 1}.`
    }
  }

  const guessLetters = countLetters(guess)

  for (const [letter, requiredCount] of Object.entries(requiredLetters)) {
    const actualCount = guessLetters[letter] ?? 0

    if (actualCount < requiredCount) {
      return `La lettre « ${letter.toUpperCase()} » révélée en jaune doit être réutilisée.`
    }
  }

  return null
}