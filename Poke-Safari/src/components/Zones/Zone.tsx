import GameScreen from "src/components/GameScreen/GameScreen"
import Loading from "../Spinners/Loading/Loading";
import usePokedex from "../Pokedex/hook/usePokedex";
import unlocked from 'src/assets/img/Pokedex/pokedex-unknown.svg';
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"
import { Context } from "src/context/AppContext";
import { SafariZone, ZonePokemon, WildPokemon, PlayerPokemon } from "src/interfaces/interfaces";
import { Container, Image } from "react-bootstrap";
import { useLazyQuery } from "@apollo/client";
import { GET_POKEMON } from "src/query/queries";
import { Popover } from "antd";
import { ArrowLeftOutlined  } from '@ant-design/icons';
import pokeTypes from "src/utils/Index/pokeTypes";

const Zone = () => {

    const { pathname } = useLocation();

    const navigate = useNavigate();
    
    const { saveFile, options } = useContext(Context);

    const { GetTypeIcon } = pokeTypes()

    const zoneId = pathname.split('/')[2]

    const [ zone ] = useState<SafariZone | undefined>(saveFile?.safariZones.find(zone => zone.name.toLowerCase() == zoneId));

    const [ position, setPosition ] = useState<number>(0);

    const [ loaded, setLoaded ] = useState(false)

    const [ pokemonZone, setPokemonZone ] = useState<WildPokemon[]>([]);

    const [ getPokemon, { data } ] = useLazyQuery(GET_POKEMON);

    const { myPokemons } = usePokedex();
    
    useEffect(() => {

        if(zone && zone.pokemon)
        {
            if(position < zone.pokemon.length)
                getPokemon({ variables: { "name": zone.pokemon[position].name } });
            else
                setLoaded(true)
        }
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ position ])

    useEffect(() => {

        if(data)
        {
            if(zone)
            {   
                const zonePoke: ZonePokemon | undefined = zone.pokemon?.find(pkmn => pkmn.id == data.pokemon.id);

                if(zonePoke)
                {
                    const myPokemon: PlayerPokemon | undefined = myPokemons.find(pokemon => pokemon.id == zonePoke.id);

                    const wildPokemon: WildPokemon = {
                        id: zonePoke.id,
                        name: zonePoke.name,
                        catch_rate: zonePoke.catch_rate,
                        encounter_rate: zonePoke.encounter_rate,
                        unlocked: zonePoke.unlocked,
                        abilities: data.pokemon.abilities,
                        height: data.pokemon.height,
                        held_items: data.pokemon.held_items,
                        moves: data.pokemon.moves,
                        sprites: data.pokemon.sprites,
                        types: data.pokemon.types,
                        weight: data.pokemon.weight,
                        seen: myPokemon?.seen ? true : false,
                        seen_count: myPokemon?.seen_count ? myPokemon?.seen_count : 0,
                        catched: myPokemon?.catched ? true : false,
                        catched_count: myPokemon?.catched_count ? myPokemon?.catched_count : 0
                    };

                    const pokemonZoneCopy = pokemonZone?.map(pkmn => pkmn)
                    
                    pokemonZoneCopy?.push(wildPokemon);

                    setPokemonZone(pokemonZoneCopy);

                    console.log(wildPokemon)
        
                    setPosition(oldPosition => oldPosition + 1);      
                }
            }
        }


    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ data ])

    const FirstLetterToUpper = (string: string) => {
        
        return string.charAt(0).toUpperCase() + string.substring(1, string.length)
    }

    return(
        <GameScreen>
            {
                zone ? 
                    <Container style={{ backgroundImage: `url(${zone.portrait})`, backgroundSize: 'cover', height: '100%', width: '100%', padding: '1em' }}>
                        <ArrowLeftOutlined onClick={ () => navigate('/safari-zones') } style={{ height: '5%' }} className="d-flex ms-2"/>
                        <div style={{ height:'100%', color: 'white' }}>
                            <h1 style={{ display:"flex", flexDirection: "column", alignItems: 'center', justifyContent: 'center', height:'25%' }}>{ zone.name }</h1>
                            <div style={{ display:"flex", flexDirection: 'column', alignItems: 'center', justifyContent: 'space-evenly', height:'70%', overflowY: 'scroll' }}>
                                <h3 className="m-2">Encounters:</h3>
                                <div style={{ display:"flex", flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' }}>
                                    {
                                        !loaded ? <Loading/> : pokemonZone ? 
                                        
                                        pokemonZone.map(pokemon => (
                                            
                                            <Popover style={{ fontFamily: options.appFont}} key={pokemon.id} trigger='hover' content={
                                                
                                                pokemon.unlocked? <span>{pokemon.unlocked.unlock}</span> :

                                                <div style={{ display: 'flex', flexDirection: 'column', fontFamily: options.appFont }}>
                                                    <span>Pokemon: { FirstLetterToUpper(pokemon.name) }</span>
                                                    <span>Seen: { pokemon.seen_count }</span>
                                                    <span>Catched: { pokemon.catched_count }</span>
                                                    <span>Types: { pokemon.types.map(type => <Image title={ FirstLetterToUpper(type.type.name) } style={{height: '1.5em', margin:'.3em'}} src={ GetTypeIcon(type.type.name) }/> )}</span>
                                                </div>
                                            }>

                                                <Image style={ pokemon.unlocked?.unlocked != null ? { width: '20%', height: '20%'} : !pokemon.seen ? { filter: 'brightness(0%)'} : {} } src={ pokemon.unlocked != null ? unlocked : pokemon.sprites.front_default }/>
                                            </Popover>
                                            
                                        ))
                                        : null    
                                    
                                    }
                                </div>
                            </div>
                        </div>
                    </Container>
                : null       
            }
        </GameScreen>    
    )

}

export default Zone