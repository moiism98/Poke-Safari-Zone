import Loading from 'src/components/Spinners/Loading/Loading';
import unlocked from 'src/assets/img/Pokedex/pokedex-unknown.svg';
import useZone from "src/components/Zones/hook/useZone";
import useApp from 'src/components/App/hook/useApp';
import { Container, Image } from "react-bootstrap";
import { Popover } from "antd";
import { ArrowLeftOutlined  } from '@ant-design/icons';

const ZoneContent = () => {

    const { styles, zone, pokemonZone, loaded, options, navigate, GetTypeIcon } = useZone()

    const { FirstLetterToUpper } = useApp();

    return(
        
        zone ? 
            <Container className="zoneContainer" style={ styles.container }>
                <ArrowLeftOutlined onClick={ () => navigate('..', { relative: 'path' }) } style={{ width: '3%', color: 'white' }} className="backArrow d-flex ms-2"/>
                <div className="content">
                    <h1 className="zoneName">{ FirstLetterToUpper(zone.name) }</h1>
                    <div className="encounterContainer">
                        <h3 className="m-2">Encounters:</h3>
                        <div className="encounterContent">
                            {
                                !loaded ? <Loading/> : pokemonZone ? 
                                
                                pokemonZone.map(pokemon => (
                                    
                                    <Popover key={ pokemon.id } className="popOver" style={ styles.popOver } trigger='hover' content={
                                        
                                        pokemon.unlock ? <span style={{ fontFamily: options.appFont }}>{ pokemon.unlock.description }</span> :

                                        pokemon.seen ?

                                            <div style={{ display: 'flex', flexDirection: 'column', fontFamily: options.appFont }}> 
                                                <span>Pokemon: { FirstLetterToUpper(pokemon.name) }</span>
                                                <span>Seen: { pokemon.seen }</span>
                                                <span>Pokemon's caught: { pokemon.caught }</span>
                                                <span>Types: { pokemon.types.map(type => <Image key={ type.type.name } className="encounterTypes" title={ FirstLetterToUpper(type.type.name) } src={ GetTypeIcon(type.type.name) }/> )}</span>
                                            </div> :

                                            <span style={{ fontFamily: options.appFont }}>?????????????</span>
                                    }>

                                        <Image style={ pokemon.unlock ? styles.encounterLocked : pokemon.seen != 0 ? styles.encounterSeen : styles.encounterNotSeen } src={ pokemon.unlock ? unlocked : pokemon.sprites?.front_default }/>
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