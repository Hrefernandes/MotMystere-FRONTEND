import Accueil from './pages/Accueil'
import Partie from './pages/Partie'
import FinDePartie from './components/FinDePartie'
import Regles from './pages/Regles'
import Scores from './pages/Score'
import Stats from './pages/Stats'
import NotFound from './pages/NotFound'

import { Route, Routes } from 'react-router-dom'
import './style/App.css'

function App() {

  return (
    <Routes>
      <Route path="/" element={<Accueil />} />
      <Route path="/partie" element={<Partie />} />
      <Route path="/fin-de-partie" element={<FinDePartie />} />
      <Route path="/regles" element={<Regles />} />
      <Route path="/scores" element={<Scores />} />
      <Route path="/stats" element={<Stats />} />
      <Route path="/*" element={<NotFound />} />
    </Routes>
  )
}

export default App
