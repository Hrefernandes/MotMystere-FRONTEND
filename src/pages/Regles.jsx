import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { Draggable } from 'gsap/Draggable'
import { InertiaPlugin } from 'gsap/InertiaPlugin'
import '../style/Regles.css'

gsap.registerPlugin(Draggable, InertiaPlugin)

function Regles() {

  const navigate = useNavigate()
  const exemplesRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.bloc', {
        opacity: 0, scale: 0.6,
        duration: 0.6, stagger: 0.15, ease: 'back.out(1.7)',
      })

      gsap.utils.toArray('.bloc').forEach((bloc) => {
        Draggable.create(bloc, {
          type: 'x,y',
          bounds: bloc.parentElement,
          inertia: true,
        })
      })
    }, exemplesRef)

    return () => ctx.revert()
  }, [])

  return (
    <main className="regles">
      <h1>Règles du jeu</h1>

      <ol>
        <li>Trouve le mot de 5 lettres en 6 essais.</li>
        <li>Chaque proposition doit être un mot français.</li>
        <li>Après chaque essai, les lettres changent de couleur :</li>
      </ol>

      <ul className="exemples" ref={exemplesRef}>
        <li>
          <div className="zone">
            <div className="bloc"><span className="tuile vert">T</span></div>
          </div>
          <p>La lettre est dans le mot, à la bonne place.</p>
        </li>
        <li>
          <div className="zone">
            <div className="bloc"><span className="tuile jaune">R</span></div>
          </div>
          <p>La lettre est dans le mot, mais à une autre place.</p>
        </li>
        <li>
          <div className="zone">
            <div className="bloc"><span className="tuile gris">O</span></div>
          </div>
          <p>La lettre n'est pas dans le mot.</p>
        </li>
      </ul>

      <p className="points">
        Points : 1 essai = 600 · 2 = 500 · 3 = 400 · 4 = 300 · 5 = 200 · 6 = 100 · perdu = 0
      </p>

      <button className="bouton" type="button" onClick={() => navigate('/')}>
        Retour à l'accueil
      </button>
    </main>
  )
}

export default Regles