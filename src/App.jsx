import Accueil from './pages/Accueil'
import Partie from './pages/Partie'
import { Route, Routes } from 'react-router-dom'
import './App.css'

function App() {

  return (
    <Routes>
      <Route path="/" element={<Accueil />} />
      <Route path="/partie" element={<Partie />} />
    </Routes>
  )
}

export default App
