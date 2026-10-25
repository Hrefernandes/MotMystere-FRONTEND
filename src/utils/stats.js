export function calculateStats(parties) {
  const gagnees = parties.filter((partie) => partie.gagne)
  const repartition = Array(8).fill(0)

  gagnees.forEach((partie) => {
    if (partie.essais >= 1 && partie.essais <= repartition.length) {
      repartition[partie.essais - 1] += 1
    }
  })

  let serieActuelle = 0
  let meilleureSerie = 0

  parties.forEach((partie) => {
    if (partie.gagne) {
      serieActuelle += 1
      meilleureSerie = Math.max(meilleureSerie, serieActuelle)
    } else {
      serieActuelle = 0
    }
  })

  return {
    jouees: parties.length,
    victoires: gagnees.length,
    serieActuelle,
    meilleureSerie,
    repartition,
    totalPoints: parties.reduce(
      (somme, partie) => somme + (partie.points ?? 0),
      0,
    ),
  }
}