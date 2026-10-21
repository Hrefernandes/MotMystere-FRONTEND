import Grille from '../components/Grille'
import { useInputs } from '../hooks/inputs'

function Partie() {
  const { board, evaluations, currentRow } = useInputs()

  return (
    <main>
      <h1>Partie</h1>

      <Grille board={board} evaluations={evaluations} />

      <p>Ligne actuelle : {currentRow + 1}</p>
    </main>
  )
}

export default Partie