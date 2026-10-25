import Grille from '../components/Grille'
import { useInputs } from '../hooks/inputs'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { saveGame } from '../utils/score'
import '../style/Partie.css'
import Clavier from '../components/Clavier'
import CompteARebours from '../components/CompteARebours'

function Partie() {
  const navigate = useNavigate()

  const [searchParams] = useSearchParams()
  const mode = searchParams.get('mode') === 'daily'
    ? 'daily'
    : 'free'

  const requestedLength = Number(searchParams.get('length'))
  const wordLength = [5, 6, 7].includes(requestedLength)
    ? requestedLength
    : 5

  const difficulty = searchParams.get('difficulty') === 'hard'
    && mode === 'free'
    && wordLength === 5
    ? 'hard'
    : 'normal'

  const {
    board,
    evaluations,
    solutionTitle,
    status,
    essais,
    points,
    temps,
    isCheckingWord,
    inputError,
    keyStatuses,
    handleKeyDown,
    currentRow,
    shakeKey,
    shakeRow,
    isDailyCompleted,
  } = useInputs(mode, wordLength, difficulty)

  function continueToEndScreen() {
    saveGame({
      pseudo: localStorage.getItem('pseudo') || 'Anonyme',
      mot: solutionTitle,
      gagne: status === 'won',
      essais,
      points,
      temps,
      mode,
      difficulty,
      wordLength,
      date: new Date().toLocaleDateString('fr-CA', { timeZone: 'Europe/Paris' }),
    })

    navigate('/fin-de-partie', {
      state: {
        gagne: status === 'won',
        mot: solutionTitle,
        essais,
        points,
        mode,
        evaluations,
        wordLength,
        difficulty,
      },
    })
  }

    if (mode === 'daily' && isDailyCompleted) {
    return (
      <main className="partie">
        <button
          className="retour"
          type="button"
          aria-label="Retour à l'accueil"
          onClick={() => navigate('/')}
        >
          ← Accueil
        </button>

        <h1 className="partie-titre">Mot du jour terminé</h1>

        <p>Tu as déjà terminé le mot du jour.</p>

        <CompteARebours />

      <button
        className="bouton"
        type="button"
        onClick={() => navigate('/fin-de-partie', {
          state: {
            gagne: status === 'won',
            mot: solutionTitle,
            essais,
            points,
            mode,
            evaluations,
            wordLength,
            difficulty,
          },
        })}
      >
        Voir le résultat
      </button>
    </main>
  )
}
  return (
    <main className="partie">

       <button
          className="retour"
          type="button"
          aria-label="Retour à l'accueil"
          onClick={() => navigate('/')}
        >
          ← Accueil
        </button>
      <h1 className="partie-titre">Partie</h1>

      <Grille
        board={board}
        evaluations={evaluations}
        currentRow={currentRow}
        shakeKey={shakeKey}
        shakeRow={shakeRow}
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
            <div className="toast" role="alert">
              {inputError}
            </div>
          )}
        </>
      )}

      {status !== 'playing' && (
        <section className="partie-fin" aria-live="polite">
          {mode === 'daily' && <CompteARebours />}
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
