import { expect, test } from 'vitest'
import { calculateStats } from '../utils/stats'


test('avec 0 partie, tout est à zéro', () => {
  const stats = calculateStats([])

  expect(stats.jouees).toBe(0)
  expect(stats.victoires).toBe(0)
  expect(stats.totalPoints).toBe(0)
})

test('on compte les parties jouées et les victoires', () => {
  const stats = calculateStats([
    { gagne: true, essais: 2, points: 500 },
    { gagne: false, essais: 6, points: 0 },
    { gagne: true, essais: 4, points: 300 },
  ])

  expect(stats.jouees).toBe(3)
  expect(stats.victoires).toBe(2)
})

test('le total des points additionne toutes les parties', () => {
  const stats = calculateStats([
    { gagne: true, essais: 2, points: 500 },
    { gagne: true, essais: 4, points: 300 },
  ])

  expect(stats.totalPoints).toBe(800)
})