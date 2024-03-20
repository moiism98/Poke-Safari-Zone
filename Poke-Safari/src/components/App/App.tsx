import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { Context } from 'src/context/AppContext';
import NavBar from 'src/components/Navbar/Navbar';
import Pokedex from 'src/pages/pokédex/Pokédex';
import Index from 'src/pages/index/Index';
import Date from 'src/components/Date/Date';
import useApp from './hook/useApp';
import Zones from 'src/pages/zones/Zones';
import Zone from 'src/pages/zone/Zone';
import Playground from 'src/pages/playground/Playground';
import Player from 'src/pages/player/Player';
import PokemonList from 'src/pages/player/PokemonList';
import PokemonDetails from 'src/pages/pokemon/PokemonDetails';
import DayCare from 'src/pages/daycare/DayCare';
import Shop from 'src/pages/shop/Shop';
import NotFound from 'src/pages/error/NotFound';

function App() {

  const { GetBackground } = useApp();
  
  const { saveFile } = useContext(Context)

  // when no save file created, set a default font using a useEffect.

  useEffect(() => {

    if(!saveFile)
    {
      document.body.style.setProperty('font-family', 'pkmndp');
    }
    
  }, [ saveFile ])
  
  GetBackground(); // when app loads displays correspondant background...
  
  setInterval(() => GetBackground(), 1000); // ...and then checks the hour every second to see if it has to change the background.

  return (
    <>
      <Router>
        <NavBar/>
          <Routes>
              <Route path="/" Component={ Index }/>
              <Route path="/player" Component={ Player }/>
              <Route path="/player/pokemon" Component={ PokemonList }/>
              <Route path="/player/pokemon/:name" Component={ PokemonDetails }/>
              <Route path="/pokedex" Component={ Pokedex }/>
              <Route path="/zones" Component={ Zones }/>
              <Route path="/zones/:name" Component={ Zone }/>
              <Route path="/play" Component={ Zones }/>
              <Route path="/play/:zoneName" Component={ Playground }/>
              <Route path="/daycare" Component={ DayCare }/>
              <Route path="/shop" Component={ Shop }/>
              <Route path='*' Component={NotFound}/>
          </Routes>
        <Date/>
      </Router>
    </>
  )

}

export default App
