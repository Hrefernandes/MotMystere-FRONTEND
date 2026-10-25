export function evaluateGuess(guess, solution) {
  const result = Array(guess.length).fill('absent')
  const remainingLetters = {}

  for (const letter of solution) {
    remainingLetters[letter] = (remainingLetters[letter] ?? 0) + 1
  }


  for (let index = 0; index < guess.length; index += 1) {
    if (guess[index] === solution[index]) {
      result[index] = 'correct'
      remainingLetters[guess[index]] -= 1
    }
  }

  for (let index = 0; index < guess.length; index += 1) {
    if (result[index] === 'correct') {
      continue
    }

    const letter = guess[index]

    if (remainingLetters[letter] > 0) {
      result[index] = 'present'
      remainingLetters[letter] -= 1
    }
  }

  return result
}