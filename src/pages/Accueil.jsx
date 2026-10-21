import { useState, useEffect, useRef } from "react"

import gsap from 'gsap' // animation GSAP
import { Draggable } from 'gsap/Draggable' // Drag un pièce
import { InertiaPlugin } from 'gsap/InertiaPlugin' // Effet d'inertie d'une pièce

import { useNavigate } from "react-router-dom"
import '../style/Accueil.css'

gsap.registerPlugin(Draggable, InertiaPlugin) // activation des plugins

function Accueil() {

  const [pseudo, setPseudo] = useState(localStorage.getItem('pseudo') || '') // recup son pseudo si il en a un
  const [erreurs, setErreurs] = useState('')

  const tuilesRef = useRef(null) // composant gardera la valeur et si elle change elle ne recharge pas le composant
  const navigate = useNavigate()

  function partieStart(e) {
    e.preventDefault()
    if (pseudo.trim().length < 3) {
      setErreurs('Le pseudo doit contenir au moins 3 caractères')
      return
    }
    setErreurs('')
    localStorage.setItem('pseudo', pseudo.trim())
    navigate('/partie')
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.bloc', {
        opacity: 0, y: -40, scale: 0.6,
        duration: 0.6, stagger: 0.1, ease: 'back.out(1.7)',
      })

      Draggable.create('.bloc', { type: 'x,y', bounds: window, inertia: true })
    }, tuilesRef)

    return () => ctx.revert()
  }, [])

  
    return (

      <main className="accueil">

        <div className="tuiles" ref={tuilesRef} aria-hidden="true">
          <div className="bloc" ><span className="tuile vert">T</span></div>
          <div className="bloc" ><span className="tuile jaune">R</span></div>
          <div className="bloc" ><span className="tuile gris">O</span></div>
          <div className="bloc" ><span className="tuile vert">U</span></div>
          <div className="bloc" ><span className="tuile gris">V</span></div>
        </div>

        <p className="phraseAccroche">Trouve le bon mot, 5 lettres 6 essais</p>

        <form className="formulaire" onSubmit={partieStart}>
          <label htmlFor="pseudo">Ton pseudo</label>
          <input
            id="pseudo"
            className="champ"
            type="text"
            value={pseudo}
            onChange={(e) => setPseudo(e.target.value)}
          />
          {erreurs && <p className="erreur" role="alert">{erreurs}</p>}
          <button className="bouton" type="submit">Jouer !</button>
        </form>
      </main>
  )
}

export default Accueil