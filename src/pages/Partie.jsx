import Grille from '../components/Grille'
import { useInputs } from '../hooks/inputs'
import { useNavigate } from 'react-router-dom'
import '../style/Partie.css'
import Clavier from '../components/Clavier'

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
    keyStatuses,
    handleKeyDown,
    currentRow,
    shakeKey,
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
    <main className="partie">
      <h1 className="partie-titre">Partie</h1>

      <Grille
        board={board}
        evaluations={evaluations}
        currentRow={currentRow}
        shakeKey={shakeKey}
      />

      <Clavier
        onKeyDown={handleKeyDown}
        keyStatuses={keyStatuses}
        disabled={status !== 'playing' || isCheckingWord}
      />

      {status === 'playing' && (
        <>
          {isCheckingWord && (
            <p className="partie-info" aria-live="polite">
              Vérification du mot...
            </p>
          )}

          {inputError && (
            <div className="erreurDiv" role="alert">
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