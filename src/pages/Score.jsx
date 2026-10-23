import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getGames } from '../utils/score'
import '../style/Score.css'

const aujourdhui = () =>
  new Date().toLocaleDateString('fr-CA', { timeZone: 'Europe/Paris' })

function trier(a, b) {
  return (
    b.points - a.points ||
    (a.temps ?? Infinity) - (b.temps ?? Infinity) ||
    a.essais - b.essais ||
    b.date.localeCompare(a.date)
  )
}

function Scores() {
  const navigate = useNavigate()
  const [onglet, setOnglet] = useState('daily')

  const parties = getGames()

  const meilleures = parties
    .filter((partie) =>
      onglet === 'daily'
        ? partie.mode === 'daily' && partie.date === aujourdhui()
        : partie.mode !== 'daily'
    )
    .sort(trier)
    .slice(0, 10)

  return (
    <main className="scores">
      <h1 className="scores-titre">Meilleures parties</h1>

      <div className="scores-onglets">
        <button
          className={onglet === 'daily' ? 'scores-onglet actif' : 'scores-onglet'}
          type="button"
          onClick={() => setOnglet('daily')}
        >
          Mot du jour
        </button>
        <button
          className={onglet === 'free' ? 'scores-onglet actif' : 'scores-onglet'}
          type="button"
          onClick={() => setOnglet('free')}
        >
          Général
        </button>
      </div>

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
                  {' · '}
                  {new Date(partie.date).toLocaleDateString('fr-FR')}
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