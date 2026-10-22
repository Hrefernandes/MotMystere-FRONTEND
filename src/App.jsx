import Accueil from './pages/Accueil'
import Partie from './pages/Partie'
import FinDePartie from './components/FinDePartie'
import { Route, Routes } from 'react-router-dom'
import './style/App.css'

function App() {

  return (
    <Routes>
      <Route path="/" element={<Accueil />} />
      <Route path="/partie" element={<Partie />} />
      <Route path="/fin-de-partie" element={<FinDePartie />} />
    </Routes>
  )
}

export default App
