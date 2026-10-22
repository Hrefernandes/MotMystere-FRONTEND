import '../style/Grille.css'

function Grille({
  board,
  evaluations,
  currentRow,
  shakeKey,
}) {
  return (
    <section className="grille" aria-label="Grille de jeu">
      {board.map((ligne, ligneIndex) => (
        <div
          className={`grille-ligne ${
            ligneIndex === currentRow && shakeKey > 0
              ? 'grille-ligne--shake'
              : ''
          }`}
          key={`${ligneIndex}-${ligneIndex === currentRow ? shakeKey : 0}`}
        >
          {ligne.map((lettre, caseIndex) => {
            const evaluation = evaluations[ligneIndex]?.[caseIndex] ?? ''

            return (
              <div
                className={`grille-case grille-case--${evaluation}`}
                key={`${ligneIndex}-${caseIndex}`}
                aria-label={`Ligne ${ligneIndex + 1}, case ${caseIndex + 1}`}
              >
                {lettre.toUpperCase()}
              </div>
            )
          })}
        </div>
      ))}
    </section>
  )
}

export default Grille