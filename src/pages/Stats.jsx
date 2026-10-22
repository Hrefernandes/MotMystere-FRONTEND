import { useNavigate } from 'react-router-dom'
import { getGames } from '../utils/score'
import { calculateStats } from '../utils/stats'
import '../style/Stats.css'

function Stats() {
  const navigate = useNavigate()
  const stats = calculateStats(getGames())

  const pourcentage =
    stats.jouees === 0 ? 0 : Math.round((stats.victoires / stats.jouees) * 100)

  const chiffres = [
    { valeur: stats.jouees, nom: 'Parties jouées' },
    { valeur: `${pourcentage} %`, nom: 'Victoires' },
    { valeur: stats.serieActuelle, nom: 'Série en cours' },
    { valeur: stats.meilleureSerie, nom: 'Meilleure série' },
  ]

  const maximum = Math.max(...stats.repartition, 1)

  return (
    <main className="stats">
      <h1 className="stats-titre">Statistiques</h1>

      <ul className="stats-chiffres">
        {chiffres.map((chiffre) => (
          <li className="stats-chiffre" key={chiffre.nom}>
            <strong className="stats-valeur">{chiffre.valeur}</strong>
            <span className="stats-nom">{chiffre.nom}</span>
          </li>
        ))}
      </ul>

      <section className="stats-repartition">
        <h2 className="stats-sous-titre">Répartition des essais</h2>

        <ol className="stats-barres">
          {stats.repartition.map((nombre, index) => (
            <li className="stats-ligne" key={index}>
              <span className="stats-essai">{index + 1}</span>
              <div className="stats-piste">
                <div
                  className="stats-barre"
                  style={{ width: `${(nombre / maximum) * 100}%` }}
                />
              </div>
              <span className="stats-nombre">{nombre}</span>
            </li>
          ))}
        </ol>
      </section>

      <button className="bouton secondaire" type="button" onClick={() => navigate('/')}>
        Retour à l'accueil
      </button>
    </main>
  )
}

export default Stats