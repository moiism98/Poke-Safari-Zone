import { Image, Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import  pokeball from '../../assets/img/Navbar/pokeball_32x32.svg';
import'./NavBar.css'

function NavBar() {
    return (
        <Navbar bg="dark" data-bs-theme="dark" id="gameMenu">
            <Navbar.Brand><Link to="/"><Image src={ pokeball }></Image></Link></Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
                <Nav.Link href="/pokedex">Pokédex</Nav.Link>
                <Nav.Link href="/safari-zones">Safari Zones</Nav.Link>
                <Nav.Link href="/options">Options</Nav.Link>
            </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}

export default NavBar;