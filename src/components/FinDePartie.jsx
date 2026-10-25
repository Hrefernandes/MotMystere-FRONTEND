import { useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import '../style/FinDePartie.css'

const RESULT_SYMBOLS = {
  correct: '🟩',
  present: '🟨',
  absent: '⬛',
}

function FinDePartie() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const [shareStatus, setShareStatus] = useState('')

  const {
    gagne = false,
    mot = '',
    essais = 0,
    points = 0,
    mode = 'free',
    evaluations = [],
    wordLength,
    difficulty,
  } = state ?? {}

  const wiktionaryUrl = `https://fr.wiktionary.org/wiki/${encodeURIComponent(mot)}`

  const maxAttempts = wordLength === 7
    ? 8
    : wordLength === 6
      ? 7
      : 6

  async function handleShare() {
    const shareText = createShareText({
      essais,
      evaluations,
    })

    if (!navigator.clipboard) {
      setShareStatus(
        'La copie est indisponible dans ce navigateur.',
      )
      return
    }

    try {
      await navigator.clipboard.writeText(shareText)
      setShareStatus('Résultat copié dans le presse-papiers !')
    } catch {
      setShareStatus(
        'Impossible de copier le résultat. Vérifie les permissions du navigateur.',
      )
    }
  }

  return (
    <div className="finFond" >
      <div className="finPartie">
        <h2 className="fin-titre">{gagne ? 'Bravo !' : 'Perdu...'}</h2>

        {gagne ? (
          <>
            <p>
              Trouvé en {essais} {essais > 1 ? 'essais' : 'essai'}
            </p>

            <p>
              Le mot mystère était :{' '}
              <a
                className="fin-mot"
                href={wiktionaryUrl}
                target="_blank"
                rel="noreferrer"
              >
                {mot}
              </a>
            </p>
          </>
        ) : (
          <>
            <p>Perdu...</p>

            <p>
              Le mot était :{' '}
              <a
                className="fin-mot"
                href={wiktionaryUrl}
                target="_blank"
                rel="noreferrer"
              >
                {mot}
              </a>
            </p>
          </>
        )}

        <p className="fin-points">+ {points} points</p>

        <div className="fin-boutons">
          <button
            className="fin-bouton"
            type="button"
            onClick={handleShare}
          >
            Partager
          </button>

          {mode === 'free' && (
            <button
              className="fin-bouton"
              type="button"
              onClick={() => navigate(
                `/partie?mode=free&length=${wordLength}&difficulty=${difficulty}`,
              )}
            >
              Rejouer
            </button>
          )}
          <button className="fin-bouton secondaire" type="button" onClick={() => navigate('/')}>
            Accueil
          </button>
        </div>

        {shareStatus && (
          <p
            className="fin-share-status"
            role="status"
            aria-live="polite"
          >
            {shareStatus}
          </p>
        )}
      </div>
    </div>
  )
}

function getShareDate() {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    timeZone: 'Europe/Paris',
  }).format(new Date())
}

function createShareText({ essais, evaluations }) {
  const rows = evaluations
    .filter(Boolean)
    .map((evaluationRow) => (
      evaluationRow
        .map((status) => RESULT_SYMBOLS[status] ?? '⬛')
        .join('')
    ))

  return [
    `Le Mot Mystère ${getShareDate()} · ${essais}/${maxAttempts}`,
    ...rows,
  ].join('\n')
}



export default FinDePartie