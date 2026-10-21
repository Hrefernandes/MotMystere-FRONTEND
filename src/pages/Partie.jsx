import Grille from '../components/Grille'
import { useInputs } from '../hooks/inputs'
import { useNavigate } from 'react-router-dom'

function Partie() {
  const navigate = useNavigate()
  const {
    board,
    evaluations,
    currentRow,
    solution,
    status,
    essais,
    points,
  } = useInputs()

  function continueToEndScreen() {
    navigate('/fin-de-partie', {
      state: {
        gagne: status === 'won',
        mot: solution,
        essais,
        points,
      },
    })
  }

  return (
    <main>
      <h1>Partie</h1>

      <Grille board={board} evaluations={evaluations} />

      {status === 'playing' ? (
        <p>Ligne actuelle : {currentRow + 1}</p>
      ) : (
        <section aria-live="polite">
          {status === 'won' ? (
            <p>Bravo, tu as trouvé le mot !</p>
          ) : (
            <p>Perdu ! Le mot était : <strong>{solution}</strong></p>
          )}

          <button type="button" onClick={continueToEndScreen}>
            Continuer
          </button>
        </section>
      )}
    </main>
  )
}

export default Partie