import'./NavBar.css';
import  pokeball from 'src/assets/img/Navbar/pokeball_32x32.svg';
import frameStyles from 'src/utils/App/frameStyles';
import playerIcons from 'src/utils/NewPlayer/playerIcons';
import useApp from 'src/components/App/hook/useApp';
import { Image, Navbar, Nav, NavDropdown, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { Context } from "src/context/AppContext";
import { /*CatchedPokemon,*/ Frame } from 'src/interfaces/interfaces';
import { Modal, /*Popconfirm,*/ Popover } from 'antd';
import { CloseOutlined  } from '@ant-design/icons';

function NavBar() {

    const { saveFile, options, pokemonTeam, /*SaveGame, */setSaveFile/*, setPokemonTeam*/, setPokemonDetails } = useContext(Context);

    const { FirstLetterToUpper } = useApp()

    const navigate = useNavigate();
    
    const { frame_styles } = frameStyles();
    
    const { icons } = playerIcons();

    const [ openPopover, setOpenPopover ] = useState<boolean>(false);

    const [ openModal, setOpenModal ] = useState<boolean>(false);

    const [ save, setSave ] = useState<boolean>(false);

    const title = (
        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', padding: '.5em' }}>
            <span>Select an icon to change it!</span>
            <CloseOutlined onClick={() => setOpenPopover(false)}/>
        </div>
    )

    const content = (
        <>
            {
                icons.map(icon => (
                <Image key={icon.id} src={icon.icon} id={icon.name} title={icon.name} onClick={(img) => {
                        
                        const saveFileCopy = saveFile;

                        const iconSelected = icons.find(icon => icon.name == img.currentTarget.id);

                        if(iconSelected && saveFileCopy)
                        {
                            saveFileCopy.options.icon = iconSelected
                            
                            localStorage.setItem('saveFile', JSON.stringify(saveFileCopy))

                            setOpenPopover(false);

                            setSave(true);
                        }
                    
                    }} 
                /> 
                
                ))
            }
        </>
    );

    const isItemActive = (fontId: string, frameId: string) => {
        
        let active: boolean = false;

        if(fontId != '')
        {
            if(fontId == options.appFont)
                active = true;
        }
        else if(frameId != '')
        {
            if(frameId == options.frame?.name)
                active = true;
        }
        else
            console.warn('You have to feed the method with the correspondant props!');

        return active;
    }  
    
    const deleteGame = () => {

        console.log('Save deleted successfully!')

        localStorage.removeItem('saveFile');

        navigate('/');

        window.location.reload();
    }

    useEffect(() => {

        if(save)
        {
            console.log('Icon saved successfully!');

            const saveFile: string | null = localStorage.getItem('saveFile');

            if(saveFile)
            {
                setSaveFile(JSON.parse(saveFile))
            }


            setSave(false)
        }

    }, [ save, saveFile, setSaveFile ])

    return (
        <>
            <Navbar className="justify-content-between" expand="md" bg="dark" data-bs-theme="dark" id="gameMenu">
                <Container fluid style={{ minHeight:'75px' }}>
                    <Navbar.Brand><Link to="/"><Image src={ pokeball }></Image></Link></Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link onClick={() => navigate('/play')}>PLAY</Nav.Link>
                        <Nav.Link onClick={() => navigate('/pokedex')}>Pokédex</Nav.Link>
                        <Nav.Link onClick={() => navigate('/zones')}>Safari Zones</Nav.Link>
                        {
                            saveFile?.dayCare.unlock ?

                            <Popover content={ <span style={{ fontFamily: options.appFont }}>{ saveFile?.dayCare.unlock.description }</span> }>
                                <Nav.Link style={{ color: 'rgba(255, 255, 255, 0.25)' }}>Day Care</Nav.Link>
                            </Popover>
                            
                            : <Nav.Link onClick={() => navigate('/daycare')}>Day Care</Nav.Link>
                        }
                        {
                            saveFile?.shop.unlock ?

                            <Popover content={ <span style={{ fontFamily: options.appFont }}>{ saveFile?.shop.unlock.description }</span> }>
                                <Nav.Link style={{ color: 'rgba(255, 255, 255, 0.25)' }}>Shop</Nav.Link>
                            </Popover>

                            : <Nav.Link onClick={() => navigate('/shop')}>Shop</Nav.Link>
                        }
                        <NavDropdown title="Player" id="basic-nav-dropdown">
                            <NavDropdown.Item onClick={() => navigate('/player')}>Staticstics</NavDropdown.Item>
                            <NavDropdown.Item onClick={() => navigate('/player/pokemon')}>Pokemon List</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title="Options" id="basic-nav-dropdown">
                            <NavDropdown title="Select font" id="optionsFont">

                                <NavDropdown.Item id="pkmndp" 
                                    onClick={(item) => { options.setAppFont(item.currentTarget.id) }} 
                                    active={isItemActive('pkmndp', '')}>
                                        Diamond/Pearl
                                </NavDropdown.Item>

                                <NavDropdown.Item id="pkmnem" 
                                    onClick={(item) => { options.setAppFont(item.currentTarget.id)}} 
                                    active={isItemActive('pkmnem', '')}>
                                        Emerald
                                </NavDropdown.Item>

                                <NavDropdown.Item id="pkmnrs" 
                                    onClick={(item) => { options.setAppFont(item.currentTarget.id)}} 
                                    active={isItemActive('pkmnrs', '')}>
                                        Ruby/Sapphire
                                </NavDropdown.Item>

                                <NavDropdown.Item id="pkmnfl" 
                                    onClick={(item) => { options.setAppFont(item.currentTarget.id)}} 
                                    active={isItemActive('pkmnfl', '')}>
                                        Leaf Green/Fire Red
                                </NavDropdown.Item>

                            </NavDropdown>
                            <NavDropdown title="Select frame" id="optionsFrame">

                                <NavDropdown.Item id="default" 
                                    onClick={(item) => { 

                                        const frame: Frame | undefined = frame_styles.find(style => style.name == item.currentTarget.id)

                                        if(frame)
                                            options.setFrame(frame)
                                    }}
                                    active={isItemActive('', 'default')}>
                                        Ruby/Sapphire Default
                                </NavDropdown.Item>

                                <NavDropdown.Item id="purple" 
                                    onClick={(item) => { 

                                        const frame: Frame | undefined = frame_styles.find(style => style.name == item.currentTarget.id)

                                        if(frame)
                                            options.setFrame(frame)
                                    }}
                                    active={isItemActive('', 'purple')}>
                                        Fancy Purple
                                </NavDropdown.Item>

                                <NavDropdown.Item id="fireRed" 
                                    onClick={(item) => { 

                                        const frame: Frame | undefined = frame_styles.find(style => style.name == item.currentTarget.id)

                                        if(frame)
                                            options.setFrame(frame)
                                    }}
                                    active={isItemActive('', 'fireRed')}>
                                        FireRed
                                </NavDropdown.Item>

                                <NavDropdown.Item id="leafGreen" 
                                    onClick={(item) => { 

                                        const frame: Frame | undefined = frame_styles.find(style => style.name == item.currentTarget.id)

                                        if(frame)
                                            options.setFrame(frame)
                                    }}
                                    active={isItemActive('', 'leafGreen')}>
                                        LeafGreen
                                </NavDropdown.Item>

                                <NavDropdown.Item id="classic" 
                                    onClick={(item) => { 

                                        const frame: Frame | undefined = frame_styles.find(style => style.name == item.currentTarget.id)

                                        if(frame)
                                            options.setFrame(frame)
                                    }}
                                    active={isItemActive('', 'classic')}>
                                        Classic GBC
                                </NavDropdown.Item>

                            </NavDropdown>
                            <NavDropdown.Divider />
                            <NavDropdown.Item onClick={() => setOpenModal(true)}>Delete Game</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    <div className='pokemonTeam'>
                        {
                            pokemonTeam?.map(pokemon => (
                                <div key={ pokemon.listId }>
                                    <Image 
                                        onClick={() => {

                                            setPokemonDetails(pokemon);
                                            
                                            navigate(`/player/pokemon/${pokemon.name}`);
                                        }} 
                                        title={ FirstLetterToUpper(pokemon.name) } 
                                        width={75} height={75}
                                        style={{ cursor:'pointer' }}
                                        src={ pokemon.shiny ? pokemon.sprites.front_shiny : pokemon.sprites.front_default }/>

                                </div>
                            ))
                        }
                    </div>
                    </Navbar.Collapse>
                    {
                        saveFile != null ?
                            <div className='playerIcon'>
                                <span>Have a nice hunting time, <strong>{ saveFile?.player?.name }</strong> !</span>
                                <Popover 
                                    trigger='click' 
                                    open={ openPopover }
                                    onOpenChange={() => setOpenPopover(true)}
                                    title={ title } 
                                    content={ content } 
                                    className='d-flex m-1'
                                >
                                    <Image title={ saveFile?.options.icon?.name } src={ saveFile?.options.icon?.icon } />
                                </Popover>  
                            </div> : null
                    }
                </Container>
            </Navbar>

            <Modal
                title='Are you sure you want to delete the game?'
                closeIcon={ false }
                open={ openModal }
                onOk={ deleteGame }
                onCancel={() => setOpenModal(false)}
            />
        </>
    )
}

export default NavBar;