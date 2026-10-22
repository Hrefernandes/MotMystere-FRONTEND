import { useNavigate } from 'react-router-dom'
import '../style/Score.css'

const PARTIES = [
  { pseudo: 'HAD',   mot: 'ARBRE', gagne: true,  essais: 3, points: 400, date: '2026-10-21' },
  { pseudo: 'Lilac', mot: 'LIVRE', gagne: true,  essais: 2, points: 500, date: '2026-10-21' },
  { pseudo: 'HAD',   mot: 'CANNE', gagne: false, essais: 6, points: 0,   date: '2026-10-22' },
  { pseudo: 'Lilac', mot: 'TABLE', gagne: true,  essais: 5, points: 200, date: '2026-10-22' },
]

function Scores() {
  const navigate = useNavigate()

  const meilleures = [...PARTIES]
    .sort((a, b) => b.points - a.points)
    .slice(0, 10)

  return (
    <main className="scores">
      <h1 className="scores-titre">Meilleures parties</h1>

      <ol className="scores-liste">
        {meilleures.map((partie, index) => (
          <li className="scores-ligne" key={index}>
            <span className="scores-rang">{index + 1}</span>

            <div className="scores-infos">
              <strong className="scores-pseudo">{partie.pseudo}</strong>
              <span className="scores-detail">
                {partie.mot} · {partie.essais} {partie.essais > 1 ? 'essais' : 'essai'}
              </span>
            </div>

            <span className={partie.gagne ? 'scores-points' : 'scores-points perdu'}>
              {partie.points} pts
            </span>
          </li>
        ))}
      </ol>

      <button className="bouton secondaire" type="button" onClick={() => navigate('/')}>
        Retour à l'accueil
      </button>
    </main>
  )
}

export default Scores