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
    isDailyCompleted,
  } = useInputs(mode)

  function continueToEndScreen() {
    saveGame({
      pseudo: localStorage.getItem('pseudo') || 'Anonyme',
      mot: solutionTitle,
      gagne: status === 'won',
      essais,
      points,
      mode,
      date: new Date().toLocaleDateString('fr-CA', { timeZone: 'Europe/Paris' }),
    })

    navigate('/fin-de-partie', {
      state: {
        gagne: status === 'won',
        mot: solutionTitle,
        essais,
        points,
        mode,
      },
    })
  }

  if (mode === 'daily' && isDailyCompleted) {
    return (
      <main className="partie">
        <h1 className="partie-titre">Mot du jour terminé</h1>

        <p>Tu as déjà terminé le mot du jour.</p>

        <CompteARebours />

        <button
          className="bouton"
          type="button"
          onClick={() =>
            navigate('/fin-de-partie', {
              state: {
                gagne: status === 'won',
                mot: solutionTitle,
                essais,
                points,
                mode,
              },
            })
          }
        >
          Voir le résultat
        </button>
      </main>
    )
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
            <div className="toast" role="alert">
              {inputError}