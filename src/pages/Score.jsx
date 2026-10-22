import { useNavigate } from 'react-router-dom'
import { getGames } from '../utils/score'
import '../style/Score.css'

function Scores() {
  const navigate = useNavigate()

  const meilleures = [...getGames()]
    .sort((a, b) => b.points - a.points)
    .slice(0, 10)

  return (
    <main className="scores">
      <h1 className="scores-titre">Meilleures parties</h1>

      {meilleures.length === 0 ? (
        <p className="scores-vide">Aucune partie enregistrée pour le moment.</p>
      ) : (
        <ol className="scores-liste">
          {meilleures.map((partie, index) => (
            <li className="scores-ligne" key={index}>
              <span className="scores-rang">{index + 1}</span>

              <div className="scores-infos">
                <strong className="scores-pseudo">{partie.pseudo}</strong>
                <span className="scores-detail">
                  {partie.mot.toUpperCase()} · {partie.essais} {partie.essais > 1 ? 'essais' : 'essai'}
                </span>
              </div>

              <span className={partie.gagne ? 'scores-points' : 'scores-points perdu'}>
                {partie.points} pts
              </span>
            </li>
          ))}
        </ol>
      )}

      <button className="bouton secondaire" type="button" onClick={() => navigate('/')}>
        Retour à l'accueil
      </button>
    </main>
  )
}

export default Scores