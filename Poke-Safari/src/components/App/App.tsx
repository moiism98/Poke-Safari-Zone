import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from 'src/components/Navbar/Navbar';
import Pokedex from 'src/pages/pokédex/Pokédex';
import Index from 'src/pages/index/Index';
import appUtils from 'src/utils/App/appUtils';
import Date from 'src/components/Date/Date';
import '@ionic/react/css/core.css';
import { setupIonicReact } from '@ionic/react';



function App() {

  const { GetBackground } = appUtils();
  
  GetBackground(); // when app loads displays correspondant background...
  
  setInterval(() => GetBackground(), 1000); // ...and then checks the hour every second to see if it has to change the background.
  
  setupIonicReact();

  return (
    <>
      <Router>
        <NavBar/>
          <Routes>
              <Route path="/" Component={ Index }/>
              <Route path="pokedex" Component={ Pokedex }/>
          </Routes>
        <Date/>
      </Router>
    </>
  )

}

export default App
