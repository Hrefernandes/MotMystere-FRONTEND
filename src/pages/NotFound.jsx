import { useNavigate } from 'react-router-dom'
import '../style/NotFound.css'

function NotFound() {
  const navigate = useNavigate()

  return (
    <main className="introuvable">
      <div className="introuvable-tuiles" aria-hidden="true">
        <span className="tuile vert">4</span>
        <span className="tuile jaune">0</span>
        <span className="tuile gris">4</span>
      </div>

      <h1 className="introuvable-titre">Page introuvable</h1>

      <button className="bouton" type="button" onClick={() => navigate('/')}>
        Retour à l'accueil
      </button>
    </main>
  )
}

export default NotFound