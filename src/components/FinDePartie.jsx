import { useLocation, useNavigate } from 'react-router-dom'

function FinDePartie() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const {
    gagne = false,
    mot = '',
    essais = 0,
    points = 0,
  } = state ?? {}

  const wiktionaryUrl = `https://fr.wiktionary.org/wiki/${encodeURIComponent(mot)}`

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
          <button className="fin-bouton" type="button" onClick={() => navigate('/partie')}>
            Rejouer
          </button>
          <button className="fin-bouton secondaire" type="button" onClick={() => navigate('/')}>
            Accueil
          </button>
        </div>
      </div>
    </div>
  )
}

export default FinDePartie