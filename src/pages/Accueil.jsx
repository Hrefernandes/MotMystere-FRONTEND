import { useState } from "react"
import { useNavigate } from "react-router-dom"

function Accueil() {

  const [pseudo, setPseudo] = useState(localStorage.getItem('pseudo') || '')
  const [erreurs, setErreurs] = useState('')

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

  
  return (
    <>
      <h1>Mistery Word</h1>
      <p>Trouve le bon mot, 5 lettres 6 essais</p>

      <form onSubmit={partieStart}>
        {erreurs && <p role="alert">{erreurs}</p>} 
        <label>Ton pseudo</label>
        <input id="pseudo" type="text" value={pseudo} onChange={(e) => setPseudo(e.target.value)} />
        <p>Pseudo : {pseudo}</p>
        <button type="submit" >Jouer !</button>
      </form>
    </>
  )
}

export default Accueil