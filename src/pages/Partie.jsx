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
    solutionTitle,
    status,
    essais,
    points,
    isCheckingWord,
    inputError,
  } = useInputs()

  function continueToEndScreen() {
    navigate('/fin-de-partie', {
      state: {
        gagne: status === 'won',
        mot: solutionTitle,
        essais,
        points,
      },
    })
  }

  return (
    <main>
      <h1>Partie</h1>

      <Grille board={board} evaluations={evaluations} />

      {status === 'playing' && (
        <>
          {isCheckingWord && (
            <p aria-live="polite">
              Vérification du mot...
            </p>
          )}

          {inputError && (
            <p role="alert">
              {inputError}
            </p>
          )}
        </>
      )}

      {status !== 'playing' && (
        <section aria-live="polite">
          {status === 'won' ? (
            <p>
              Bravo, tu as trouvé le mot : <strong>{solutionTitle}</strong>
            </p>
          ) : (
            <p>
              Perdu ! Le mot était : <strong>{solutionTitle}</strong>
            </p>
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