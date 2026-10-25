import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getGames } from '../utils/score'
import '../style/Score.css'

function getToday() {
  return new Date().toLocaleDateString('fr-CA', {
    timeZone: 'Europe/Paris',
  })
}

function getDailyRanking(games) {
  return games
    .filter((game) => (
      game.mode === 'daily'
      && game.date === getToday()
    ))
    .sort((a, b) => (
      b.points - a.points
      || (a.temps ?? Infinity) - (b.temps ?? Infinity)
    ))
    .slice(0, 10)
}

function getGeneralRanking(games) {
  return [...games]
    .sort((a, b) => (
      b.points - a.points
      || (a.temps ?? Infinity) - (b.temps ?? Infinity)
    ))
    .slice(0, 10)
}


function Scores() {
  const navigate = useNavigate()
  const [onglet, setOnglet] = useState('daily')

  const [selectedLength, setSelectedLength] = useState('all')
  const [selectedMode, setSelectedMode] = useState('all')

  const games = getGames()

  const filteredGames = games.filter((game) => {
    const matchesLength = selectedLength === 'all'
      || game.wordLength === Number(selectedLength)

    const matchesMode = selectedMode === 'all'
      || getGameMode(game) === selectedMode

    return matchesLength && matchesMode
  })

  const classement = onglet === 'daily'
    ? getDailyRanking(games)
    : getGeneralRanking(filteredGames)

  return (
    <main className="scores">
      <h1 className="scores-titre">Meilleures parties</h1>
        <section className="scores-filtres" aria-label="Filtres des scores">
      <label htmlFor="filtre-longueur">
        Longueur
      </label>
    
      <select
        id="filtre-longueur"
        value={selectedLength}
        onChange={(event) => setSelectedLength(event.target.value)}
      >
        <option value="all">Toutes</option>
        <option value="5">5 lettres</option>
        <option value="6">6 lettres</option>
        <option value="7">7 lettres</option>
      </select>
    
      <label htmlFor="filtre-mode">
        Mode
      </label>
    
      <select
        id="filtre-mode"
        value={selectedMode}
        onChange={(event) => setSelectedMode(event.target.value)}
      >
        <option value="all">Tous les modes</option>
        <option value="free">Partie libre</option>
        <option value="hard">Partie difficile</option>
        <option value="daily">Mot du jour</option>
      </select>
    </section>
      <div className="scores-onglets" role="tablist">
        <button
          className={`bouton ${onglet === 'daily' ? '' : 'secondaire'}`}
          type="button"
          role="tab"
          aria-selected={onglet === 'daily'}
          onClick={() => setOnglet('daily')}
        >
          Mot du jour
        </button>

        <button
          className={`bouton ${onglet === 'general' ? '' : 'secondaire'}`}
          type="button"
          role="tab"
          aria-selected={onglet === 'general'}
          onClick={() => setOnglet('general')}
        >
          Classement général
        </button>
      </div>
      {classement.length === 0 ? (
        <p className="scores-vide">Aucune partie enregistrée pour le moment.</p>
      ) : (
        <ol className="scores-liste">
          {classement.map((partie, index) => (
            <li className="scores-ligne" key={index}>
              <span className="scores-rang">{index + 1}</span>

              <div className="scores-infos">
                <strong className="scores-pseudo">{partie.pseudo}</strong>
                <span className="scores-detail">
                  {partie.mot.toUpperCase()} · {partie.essais}{' '}
                  {partie.essais > 1 ? 'essais' : 'essai'}
                </span>
                <span className="scores-mode">
                  {partie.wordLength} lettres · {getModeLabel(partie)}
                </span>
              </div>

              <span className="scores-temps">
                {partie.temps == null
                  ? 'Temps indisponible'
                  : formatDuration(partie.temps)}
              </span>

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

function getGameMode(game) {
  if (game.mode === 'daily') {
    return 'daily'
  }

  if (game.difficulty === 'hard') {
    return 'hard'
  }

  return 'free'
}

function getModeLabel(game) {
  if (game.mode === 'daily') {
    return 'Mot du jour'
  }

  if (game.difficulty === 'hard') {
    return 'Difficile'
  }

  return 'Partie libre'
}

function formatDuration(seconds) {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60

  return `${minutes} min ${String(remainingSeconds).padStart(2, '0')} s`
}

export default Scores