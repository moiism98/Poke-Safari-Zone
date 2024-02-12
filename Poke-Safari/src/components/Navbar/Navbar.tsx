import'./NavBar.css';
import { Image, Navbar, Nav, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { Context } from "src/context/AppContext";
import  pokeball from 'src/assets/img/Navbar/pokeball_32x32.svg';
import { Frame } from 'src/interfaces/interfaces';

function NavBar() {

    const { appFont, setAppFont, frame, setFrame, frame_styles } = useContext(Context)

    const isItemActive = (fontId: string, frameId: string) => {
        
        let active: boolean = false;

        if(fontId != '')
        {
            if(fontId == appFont)
                active = true;
        }
        else if(frameId != '')
        {
            if(frameId == frame.name)
                active = true;
        }
        else
            console.warn('You have to feed the method with the correspondant props!');

        return active;
    }

    return (
        <Navbar bg="dark" data-bs-theme="dark" id="gameMenu">
            <Navbar.Brand><Link to="/"><Image src={ pokeball }></Image></Link></Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
                <Nav.Link href="/pokedex">Pokédex</Nav.Link>
                <Nav.Link href="/safari-zones">Safari Zones</Nav.Link>
                <NavDropdown title="Options" id="basic-nav-dropdown">
                    <NavDropdown title="Select font" id="optionsFont">

                        <NavDropdown.Item id="pkmndp" 
                            onClick={(item) => { setAppFont(item.currentTarget.id)}} 
                            active={isItemActive('pkmndp', '')}>
                                Diamond/Pearl
                        </NavDropdown.Item>

                        <NavDropdown.Item id="pkmnem" 
                            onClick={(item) => { setAppFont(item.currentTarget.id)}} 
                            active={isItemActive('pkmnem', '')}>
                                Emerald
                        </NavDropdown.Item>

                        <NavDropdown.Item id="pkmnrs" 
                            onClick={(item) => { setAppFont(item.currentTarget.id)}} 
                            active={isItemActive('pkmnrs', '')}>
                                Ruby/Sapphire
                        </NavDropdown.Item>

                        <NavDropdown.Item id="pkmnfl" 
                            onClick={(item) => { setAppFont(item.currentTarget.id)}} 
                            active={isItemActive('pkmnfl', '')}>
                                Leaf Green/Fire Red
                        </NavDropdown.Item>

                    </NavDropdown>
                    <NavDropdown title="Select frame" id="optionsFrame">

                        <NavDropdown.Item id="default" 
                            onClick={(item) => { 

                                const frame: Frame | undefined = frame_styles.find(style => style.name == item.currentTarget.id)

                                if(frame)
                                    setFrame(frame)
                            }}
                            active={isItemActive('', 'default')}>
                                Ruby/Sapphire Default
                        </NavDropdown.Item>

                        <NavDropdown.Item id="purple" 
                            onClick={(item) => { 

                                const frame: Frame | undefined = frame_styles.find(style => style.name == item.currentTarget.id)

                                if(frame)
                                    setFrame(frame)
                            }}
                            active={isItemActive('', 'purple')}>
                                Fancy Purple
                        </NavDropdown.Item>

                        <NavDropdown.Item id="fireRed" 
                            onClick={(item) => { 

                                const frame: Frame | undefined = frame_styles.find(style => style.name == item.currentTarget.id)

                                if(frame)
                                    setFrame(frame)
                            }}
                            active={isItemActive('', 'fireRed')}>
                                FireRed
                        </NavDropdown.Item>

                        <NavDropdown.Item id="leafGreen" 
                            onClick={(item) => { 

                                const frame: Frame | undefined = frame_styles.find(style => style.name == item.currentTarget.id)

                                if(frame)
                                    setFrame(frame)
                            }}
                            active={isItemActive('', 'leafGreen')}>
                                LeafGreen
                        </NavDropdown.Item>

                        <NavDropdown.Item id="classic" 
                            onClick={(item) => { 

                                const frame: Frame | undefined = frame_styles.find(style => style.name == item.currentTarget.id)

                                if(frame)
                                    setFrame(frame)
                            }}
                            active={isItemActive('', 'classic')}>
                                Classic GBC
                        </NavDropdown.Item>

                    </NavDropdown>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="#action/3.4">Save Game </NavDropdown.Item>
                </NavDropdown>
            </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}

export default NavBar;