import { useEffect, useState } from 'react'
import { secondesAvantMinuit } from '../utils/countdown'

function formater(total) {
  const h = String(Math.floor(total / 3600)).padStart(2, '0')
  const m = String(Math.floor((total % 3600) / 60)).padStart(2, '0')
  const s = String(total % 60).padStart(2, '0')
  return `${h}:${m}:${s}`
}

function CompteARebours() {
  const [reste, setReste] = useState(secondesAvantMinuit())

  useEffect(() => {
    const id = setInterval(() => setReste(secondesAvantMinuit()), 1000)
    return () => clearInterval(id)
  }, [])

  return <p className="compte">Prochain mot dans {formater(reste)}</p>
}

export default CompteARebours