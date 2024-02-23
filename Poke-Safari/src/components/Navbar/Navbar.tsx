import'./NavBar.css';
import  pokeball from 'src/assets/img/Navbar/pokeball_32x32.svg';
import frameStyles from 'src/utils/App/frameStyles';
import playerIcons from 'src/utils/NewPlayer/playerIcons';
import { Image, Navbar, Nav, NavDropdown, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { Context } from "src/context/AppContext";
import { Frame } from 'src/interfaces/interfaces';
import { Modal, Popover, message } from 'antd';
import { CloseOutlined  } from '@ant-design/icons';

function NavBar() {

    const { saveFile, options, setSaveFile } = useContext(Context);

    const { frame_styles } = frameStyles();

    const navigate = useNavigate();

    const { icons } = playerIcons();

    const [openPopover, setOpenPopover] = useState<boolean>(false);

    const [openModal, setOpenModal] = useState<boolean>(false);

    const [save, setSave] = useState<boolean>(false);

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

        navigate('/')

        window.location.reload()
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

    }, [save, saveFile, setSaveFile])

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
                        <Nav.Link onClick={() => navigate('/player')}>Player Stats</Nav.Link>
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
                            <NavDropdown.Item onClick={() => { message.success('Saved successfully!') }}>Save Game</NavDropdown.Item>
                            <NavDropdown.Item onClick={() => setOpenModal(true)}>Delete Game</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    </Navbar.Collapse>
                    {
                        saveFile != null ?
                        <div style={{ display: 'flex', alignItems: 'center', color: 'white', margin: '0 1em 0 1em' }}>
                            <span style={{ marginRight: '.5em' }}>Have a nice hunting time, <strong style={{color: 'red'}}>{ saveFile?.player?.name }</strong> !</span>
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