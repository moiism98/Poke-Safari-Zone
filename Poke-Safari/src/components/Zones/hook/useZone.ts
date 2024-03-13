import pokeTypes from "src/utils/Index/pokeTypes";
import useApp from "src/components/App/hook/useApp";
import { useLazyQuery } from "@apollo/client";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Context } from "src/context/AppContext";
import { Evolution, SafariZone, WildPokemon, ZonePokemon } from "src/interfaces/interfaces";
import { GET_POKEMON } from "src/query/queries";

const useZone = () => {

    const { getPokemonEvolution } = useApp();

    const GenerateEncounterPokemon = async() => {

        if(data)
        {
            if(zone)
            {   
                const zonePoke: ZonePokemon | undefined = zone.pokemon?.find(pkmn => pkmn.id == data.pokemon.id);

                
                if(zonePoke)
                {
                    let evolution: Evolution[] | null = [];

                    await getPokemonEvolution(zonePoke.id, zonePoke.name).then(data => {

                        if(data)
                        {
                            data.map(evo => {

                                evolution?.push({
                                    item: evo.item,
                                    held_item: evo.held_item,
                                    evolution: evo.evolution,
                                    method: evo.method
                                });
                            })
                        }
                        else
                        {
                            evolution = null;
                        }
                        
                    });

                    console.log(evolution);

                    const savedZone = saveFile?.safariZones.find(zn => zn.name == zone.name)

                    if(savedZone)
                    {
                        const myPokemon: ZonePokemon | undefined = savedZone.pokemon?.find(pokemon => pokemon.id == zonePoke.id);
    
                        if(myPokemon)
                        {
                            const wildPokemon: WildPokemon = {
                                id: zonePoke.id,
                                name: zonePoke.name,
                                encounter_rate: zonePoke.encounter_rate,
                                catch_rate: zonePoke.catch_rate,
                                unlock: zonePoke.unlock,
                                abilities: data.pokemon.abilities,
                                height: data.pokemon.height,
                                held_items: data.pokemon.held_items,
                                moves: data.pokemon.moves,
                                sprites: data.pokemon.sprites,
                                types: data.pokemon.types,
                                weight: data.pokemon.weight,
                                seen: myPokemon.seen,
                                catched: myPokemon.catched,
                                shiny: false,
                                evolution: evolution
                            };
        
                            const pokemonZoneCopy = pokemonZone?.map(pkmn => pkmn)
                            
                            pokemonZoneCopy?.push(wildPokemon);
        
                            setPokemonZone(pokemonZoneCopy);
        
                            // console.log(wildPokemon)
                
                            setPosition(oldPosition => oldPosition + 1);      
                        }

                    }

                }
            }
        }
    }

    const { pathname } = useLocation();

    const navigate = useNavigate();
    
    const { saveFile, options } = useContext(Context);

    const { GetTypeIcon } = pokeTypes();

    const zoneId = pathname.split('/')[2]

    const [ zone ] = useState<SafariZone | undefined>(saveFile?.safariZones.find(zone => zone.name.toLowerCase() == zoneId));

    const [ position, setPosition ] = useState<number>(0);

    const [ loaded, setLoaded ] = useState(false)

    const [ pokemonZone, setPokemonZone ] = useState<WildPokemon[]>([]);

    const [ getPokemon, { data } ] = useLazyQuery(GET_POKEMON);    

    useEffect(() => {

        if(zone && zone.pokemon)
        {
            if(position < zone.pokemon.length)
                getPokemon({ variables: { "name": zone.pokemon[position].name } });
            else
                setLoaded(true);
        }
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ position ])

    useEffect(() => {

        GenerateEncounterPokemon();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ data ])

    const styles = {
        container: {
            backgroundImage: `url(${zone?.portrait})`
        },
        popOver: {
            fontFamily: options.appFont
        },
        encounterLocked: {
            width: '15%', 
            height: '15%'
        },
        encounterNotSeen: {
            filter: 'brightness(0%)'
        },
        encounterSeen: {
            filter: 'brightness(100%)'
        }
    }

    

    return {
        styles,
        zone,
        pokemonZone,
        loaded,
        options,
        navigate,
        GetTypeIcon
    }

}

export default useZone