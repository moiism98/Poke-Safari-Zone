import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from 'src/components/Navbar/Navbar';
import Pokedex from 'src/pages/pokédex/Pokédex';
import Index from 'src/pages/index/Index';
import appUtils from 'src/utils/appUtils';
import Date from 'src/components/Date/Date';

function App() {

  const { GetBackground, SetFont } = appUtils();

  SetFont('pkmndp'); // sets the selected font family.

  GetBackground(); // when app loads displays correspondant background...

  setInterval(() => GetBackground(), 1000); // ...and then checks the hour every second to see if it has to change the background.

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
