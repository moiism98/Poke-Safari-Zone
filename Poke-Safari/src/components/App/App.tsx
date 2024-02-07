import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from '../Navbar/Navbar';
import Pokedex from '../../pages/pokédex/Pokédex';
import Index from '../../pages/index/Index';

function App() {
  return (
    <>
      <Router>
        <NavBar/>
          <Routes>
              <Route path="/" Component={ Index }/>
              <Route path="pokedex" Component={ Pokedex }/>
          </Routes>
      </Router>
    </>
  )
}

export default App
