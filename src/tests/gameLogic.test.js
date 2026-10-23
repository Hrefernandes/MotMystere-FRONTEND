import { expect, test } from 'vitest'
import { evaluateGuess } from '../utils/gameLogic'

test('un mot identique donne 5 lettres vertes', () => {
  const resultat = evaluateGuess('arbre', 'arbre')

  expect(resultat).toEqual(['correct', 'correct', 'correct', 'correct', 'correct'])
})

test('un mot sans aucune lettre commune donne 5 lettres grises', () => {
  const resultat = evaluateGuess('fumio', 'arbre')

  expect(resultat).toEqual(['absent', 'absent', 'absent', 'absent', 'absent'])
})

test('une lettre dans le mot mais mal placée est jaune', () => {
  const resultat = evaluateGuess('rxxxx', 'arbre')

  expect(resultat[0]).toBe('present')
})

test('lettres en double : le 2e L de LILAS reste gris car LIVRE n\'a qu\'un L', () => {
  const resultat = evaluateGuess('lilas', 'livre')

  expect(resultat).toEqual(['correct', 'correct', 'absent', 'absent', 'absent'])
})

test('lettres en double : ERRER contre ARBRE', () => {
  const resultat = evaluateGuess('errer', 'arbre')

  expect(resultat).toEqual(['present', 'correct', 'present', 'absent', 'absent'])
})