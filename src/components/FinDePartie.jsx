import { useLocation, useNavigate } from 'react-router-dom'
import '../style/FinDePartie.css'

function FinDePartie() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const {
    gagne = false,
    mot = '',
    essais = 0,
    points = 0,
  } = state ?? {}

  return (
    <div className="finFond" >
      <div className="finPartie">
        <h2 className="fin-titre">{gagne ? 'Bravo !' : 'Perdu...'}</h2>

        {gagne ? (
          <p>Trouvé en {essais} {essais > 1 ? 'essais' : 'essai'}</p>
        ) : (
          <p>Le mot était : <strong className="fin-mot">{mot}</strong></p>
        )}

        <p className="fin-points">+ {points} points</p>

        <div className="fin-boutons">
          <button className="fin-bouton" type="button">
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