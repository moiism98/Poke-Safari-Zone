import Loading from 'src/components/Spinners/Loading/Loading';
import unlocked from 'src/assets/img/Pokedex/pokedex-unknown.svg';
import useZone from "../../components/Zones/hook/useZone";
import { Container, Image } from "react-bootstrap";
import { Popover } from "antd";
import { ArrowLeftOutlined  } from '@ant-design/icons';
import useApp from '../App/hook/useApp';

const ZoneContent = () => {



    const { styles, zone, pokemonZone, loaded, options, navigate, GetTypeIcon } = useZone()

    const { FirstLetterToUpper } = useApp();

    return(
        
        zone ? 
            <Container className="zoneContainer" style={ styles.container }>
                <ArrowLeftOutlined onClick={ () => navigate('/safari-zones') } className="backArrow d-flex ms-2"/>
                <div className="content">
                    <h1 className="zoneName">{ zone.name }</h1>
                    <div className="encounterContainer">
                        <h3 className="m-2">Encounters:</h3>
                        <div className="encounterContent">
                            {
                                !loaded ? <Loading/> : pokemonZone ? 
                                
                                pokemonZone.map(pokemon => (
                                    
                                    <Popover className="popOver" style={ styles.popOver } key={ pokemon.id } trigger='hover' content={
                                        
                                        pokemon.unlocked? <span>{ pokemon.unlocked.unlock }</span> :

                                        <div style={{ display: 'flex', flexDirection: 'column', fontFamily: options.appFont }}>
                                            <span>Pokemon: { FirstLetterToUpper(pokemon.name) }</span>
                                            <span>Seen: { pokemon.seen }</span>
                                            <span>Catched: { pokemon.catched }</span>
                                            <span>Types: { pokemon.types.map(type => <Image className="encounterTypes" title={ FirstLetterToUpper(type.type.name) } src={ GetTypeIcon(type.type.name) }/> )}</span>
                                        </div>
                                    }>

                                        <Image style={ pokemon.unlocked?.unlocked != null ? styles.encounterLocked : pokemon.seen != 0 ? styles.encounterSeen : styles.encounterNotSeen } src={ pokemon.unlocked != null ? unlocked : pokemon.sprites.front_default }/>
                                    </Popover>
                                    
                                ))
                                : null    
                            
                            }
                        </div>
                    </div>
                </div>
            </Container>
        : null        
    )
}

export default ZoneContent