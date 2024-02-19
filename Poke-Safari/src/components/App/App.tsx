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
import Zone from 'src/components/Zones/Zone';

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
              <Route path="pokedex" Component={ Pokedex }/>
              <Route path="safari-zones" Component={ Zones }/>
              <Route path="safari-zones/:name" Component={ Zone }/>
          </Routes>
        <Date/>
      </Router>
    </>
  )

}

export default App
