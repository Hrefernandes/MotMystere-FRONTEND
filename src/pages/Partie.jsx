import Grille from '../components/Grille'
import { useInputs } from '../hooks/inputs'
import { useNavigate } from 'react-router-dom'
import { saveGame } from '../utils/score'
import '../style/Partie.css'

function Partie() {
  const navigate = useNavigate()

  const {
    board,
    evaluations,
    solutionTitle,
    status,
    essais,
    points,
    isCheckingWord,
    inputError,
  } = useInputs()

  function continueToEndScreen() {
    saveGame({
      pseudo: localStorage.getItem('pseudo') || 'Anonyme',
      mot: solutionTitle,
      gagne: status === 'won',
      essais,
      points,
      date: new Date().toLocaleDateString('fr-CA', { timeZone: 'Europe/Paris' }),
    })

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
    <main className="partie">
      <h1 className="partie-titre">Partie</h1>

      <Grille board={board} evaluations={evaluations} />

      {status === 'playing' && (
        <>
          {isCheckingWord && (
            <p className="partie-info" aria-live="polite">
              Vérification du mot...
            </p>
          )}

          {inputError && (
            <div className="toast" role="alert">
              {inputError}
            </div>
          )}
        </>
      )}

      {status !== 'playing' && (
        <section className="partie-fin" aria-live="polite">
          {status === 'won' ? (
            <p>
              Bravo, tu as trouvé le mot : <strong>{solutionTitle}</strong>
            </p>
          ) : (
            <p>
              Perdu ! Le mot était : <strong>{solutionTitle}</strong>
            </p>
          )}

          <button className="bouton" type="button" onClick={continueToEndScreen}>
            Continuer
          </button>
        </section>
      )}
    </main>
  )
}

export default Partie