import './Grille.css'

function Grille() {
  const lignes = Array.from({ length: 6 })
  const cases = Array.from({ length: 5 })

  return (
    <section className="grille" aria-label="Grille de jeu">
      {lignes.map((_, ligneIndex) => (
        <div className="grille-ligne" key={ligneIndex}>
          {cases.map((_, caseIndex) => (
            <div
              className="grille-case"
              key={`${ligneIndex}-${caseIndex}`}
              aria-label={`Ligne ${ligneIndex + 1}, case ${caseIndex + 1}`}
            />
          ))}
        </div>
      ))}
    </section>
  )
}

export default Grille