import { useLazyQuery } from "@apollo/client";
import { Button, message } from "antd";
import { StarFilled } from '@ant-design/icons';
import { useContext, useEffect, useState } from "react";
import { Image } from "react-bootstrap";
import { SeenPokemon, WildPokemon, ZonePokemon } from "src/interfaces/interfaces";
import { GET_POKEMON } from "src/query/queries";
import { Context } from "src/context/AppContext";
import useApp from "src/components/App/hook/useApp";
import GameScreen from "src/components/GameScreen/GameScreen"
import usePlayground from "src/components/Playground/hook/usePlayground";
import Loading from "src/components/Spinners/Loading/Loading";
import useZone from "src/components/Zones/hook/useZone";

const Playground = () => {

    const { options, saveFile, SaveGame } = useContext(Context);
    
    const { appConsts } = useApp();

    const buttonStyles: React.CSSProperties = {
        fontFamily: options.appFont,
        margin: '.5em',
        width:'130px'
    }


    const { RandomProbability, SetRandomMoveSet, SetRandomAbility } = usePlayground();

    const { gameScreen, FirstLetterToUpper } = useApp();

    const { zone } = useZone();
    
    const [ getPokemon, { data }] = useLazyQuery(GET_POKEMON);
    
    const [ wildPokemon, setWildPokemon ] = useState<WildPokemon>();

    const [ loading, setLoading ] = useState<boolean>();

    const [ catchRate, setCatchRate ] = useState<number>(appConsts.defaultRateValue);

    const [ fleeRate, setFleeRate ] = useState<number>(appConsts.defaultRateValue);

    const [ disable, setDisable ] = useState<boolean>(false);

    const [ catching, setCatching ] = useState<boolean>(false);

    const [ pokemonTurn, setPokemonTurn ] = useState<boolean>(false);

    const [ fled, setFled ] = useState<boolean>(false);

    const [ caught, setCaught ] = useState<boolean>(false);

    const GetWildPokemon = () => {
        
        let wildPokemon: ZonePokemon | null = null;

        let spawned = false;

        while(!spawned)
        {
            if(zone && zone.pokemon)
            {
                const probability: number = RandomProbability(100)
    
                const pokemon: number = Math.floor(Math.random() * zone.pokemon.length);
                
                if(!zone.pokemon[pokemon].unlocked)
                {
                    if(zone.pokemon[pokemon].encounter_rate >= probability)
                    {
                        wildPokemon = zone.pokemon[pokemon];
                        
                        spawned = true;
                    }
                }
    
            }
        }

        return wildPokemon;

    }

    const GenerateWildPokemon = () =>
    {
        const randomPokemon = GetWildPokemon();

        if(randomPokemon)
        {
            getPokemon({ variables: { "name": randomPokemon.name } });
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }

    const SpawnWildPokemon = () => {
    
        if(data)
        {
            setLoading(true)

            const moves = SetRandomMoveSet(data.pokemon.moves);

            const ability = SetRandomAbility(data.pokemon.abilities);

            const zonePokemon = zone?.pokemon?.find(pokemon => pokemon.id == data.pokemon.id);

            if(moves && ability && zonePokemon)
            {
            
                const wildPokemon: WildPokemon = {
                    id: data.pokemon.id,
                    name: data.pokemon.name,
                    types: data.pokemon.types,
                    moves: moves,
                    height: data.pokemon.height,
                    weight: data.pokemon.weight,
                    held_items: data.pokemon.held_items,
                    sprites: data.pokemon.sprites,
                    abilities: data.pokemon.abilities,
                    ability: ability,
                    catch_rate: zonePokemon.catch_rate,
                    encounter_rate: zonePokemon.encounter_rate,
                    unlocked: zonePokemon.unlocked,
                    shiny: RandomProbability(100) <= appConsts.shinyProbability ? true : false,
                    catched: 0,
                    seen: 0,
                }

                const seenPokemon: SeenPokemon | undefined = saveFile?.seenPokemons.find(pokemon => pokemon.id == wildPokemon.id)

                if(saveFile?.statistics && !seenPokemon)
                {
                    saveFile?.seenPokemons.push({id: wildPokemon.id, name: wildPokemon.name, sprite: wildPokemon.sprites.front_default})

                    saveFile.statistics.seen++;
                }

                const safariZone = saveFile?.safariZones.find(savedZone => savedZone.name == zone?.name);

                const znPokemon = safariZone?.pokemon?.find(poke => poke.id == wildPokemon.id);

                if(znPokemon)
                {
                    znPokemon.seen++;
                }

                const saveFileCopy = saveFile;

                if(saveFileCopy)
                {
                    SaveGame(saveFileCopy)
                }

                setWildPokemon(wildPokemon);
            }
            else
            {
                console.warn("Unable to create the wild pokemon!");
            }
        }

        setCatchRate(appConsts.defaultRateValue);

        setFleeRate(appConsts.defaultRateValue);

        setTimeout(() => setLoading(false), 3000);
    }

    const CatchPokemon = () => {
        
        if(wildPokemon)
        {
            // Pokemon catch rate (over 100%) + extra bait/rock combat catch rate.

            const totalCatchRate = Math.round((wildPokemon.catch_rate * 100) / appConsts.maxCatchRate) + Math.round((catchRate / 100) * appConsts.maxCatchRate);

            const catchProbability = RandomProbability(appConsts.maxCatchRate);
            
            if(totalCatchRate >= catchProbability)
            {
                const safariZone = saveFile?.safariZones.find(savedZone => savedZone.name == zone?.name);

                const zonePokemon = safariZone?.pokemon?.find(poke => poke.id == wildPokemon.id);

                if(zonePokemon)
                {
                    zonePokemon.catched++;
                }
                
                const saveFileCopy = saveFile;
                
                if(saveFileCopy)
                {
                    if(!saveFile.myPokemons.find(pokemon => pokemon.id == wildPokemon.id))
                    {
                        saveFileCopy.statistics.catched++;
                    }

                    if(wildPokemon.shiny)
                    {
                        saveFileCopy.statistics.shiny++;
                    }
                    
                    saveFileCopy.myPokemons.push(wildPokemon)

                    SaveGame(saveFileCopy)
                }

                setCaught(true);
            }
            else
            {
                WaitForPokemon();
            }

            setCatching(false);
        }
    }

    const WaitForPokemon = () => {
    
        const probability = RandomProbability(100);

        if(fleeRate >= probability)
        {
            setFled(true);
        }
        else
        {
            message.info(`${ wildPokemon?.name.toUpperCase() } is watching carefully!`);
        }

        setPokemonTurn(false);
    }

    const ThrowRock = () => {

        setPokemonTurn(true)

        if(catchRate && fleeRate < appConsts.maxModRateValue)
        {
            setCatchRate(oldRate => oldRate + appConsts.rateModdifier)
    
            setFleeRate(oldRate => oldRate + appConsts.rateModdifier)
        }
    }

    const ThrowBait = () => {

        setPokemonTurn(true)

        if(catchRate && fleeRate > appConsts.rateModdifier)
        {
            setCatchRate(oldRate => oldRate - appConsts.rateModdifier)
    
            setFleeRate(oldRate => oldRate - appConsts.rateModdifier)
        }
    }

    useEffect(() => {

        GenerateWildPokemon();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
    
        SpawnWildPokemon();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ data ])

    useEffect(() => {
        
        if(catching)
        {
            setDisable(true);
        }
        else if(pokemonTurn)
        {
            setTimeout(() => WaitForPokemon(), 3000)

            setDisable(true);
        }
        else
        {
            setDisable(false);
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ catching, pokemonTurn ])

    useEffect(() => {
    
        if(caught)
        {
            message.success(`Gotcha! ${ wildPokemon?.name.toUpperCase() } was caught!`);

            GenerateWildPokemon();

            setCaught(false)
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ caught, wildPokemon?.name ])

    useEffect(() => {
    
        if(fled)
        {
            message.error(`Wild ${ wildPokemon?.name.toUpperCase() } fled!`);

            GenerateWildPokemon();

            setFled(false)
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ fled, wildPokemon?.name ])

    return(
        <GameScreen styles={ Object.assign({}, gameScreen, { backgroundImage: `url(${zone?.portrait})` }) }>
            { catching || pokemonTurn ? <Loading/> : null }
            {
                loading ? <Loading/> : 
                wildPokemon ? 
                <>
                    <div className="d-flex" style={{ display: 'flex', alignItems:'center', justifyContent:'space-evenly' }}>
                        <h3>+ { catchRate } % Catch Rate</h3>
                        <h3>+ { fleeRate } % Flee Rate</h3>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', width:' 100%', height: '100%' }}>
                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-around', height: '100%', margin: '1em'}}>
                            <div style={{ display: 'flex', alignItems: 'center'}}>
                                <h2 style={{marginRight: '.3em'}}>{ FirstLetterToUpper(wildPokemon.name) }</h2> 
                                <span>{ wildPokemon.shiny ? <StarFilled style={{ color: '#f9be19' }} /> : null}</span>
                            </div>
                            <Image style={{ height: '75%'}} src={ wildPokemon.shiny ? wildPokemon.sprites.front_shiny : wildPokemon.sprites.front_default }/>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around',  width:' 100%', height: '100%', margin: '1em' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding:'.5em', fontSize: '1.5em', width:' 60%', height: '50%', backgroundColor: 'white', margin: '1em', border: gameScreen.border, borderRadius: gameScreen.borderRadius, boxSizing: 'border-box', overflow: 'auto'}}>
                                <span style={{ height: '100%', padding: '.2em' }}>Wild <strong style={{color: 'red'}}>{ wildPokemon.name }</strong> appeared! What will { saveFile?.player?.name } do?</span>
                            </div>
                            <div style={{ display:'flex', flexDirection:'column', justifyContent:'center', width:'40%', height: '100%', margin: '1em', boxSizing: 'border-box', overflow: 'auto'}}>
                                <div style={{ display:'flex', flexWrap:'wrap', alignItems:'center', justifyContent: 'space-around'}}>
                                    <Button disabled = { disable } style={ buttonStyles } onClick={ () => { setCatching(true); setTimeout(() => CatchPokemon(), 3000); }}>Catch pokémon!</Button>
                                    <Button disabled = { disable } style={ buttonStyles } onClick={ () => ThrowBait() }>Throw bait</Button>
                                    <Button disabled = { disable } style={ buttonStyles } onClick={ () => GenerateWildPokemon() }>Run away!</Button>
                                    <Button disabled = { disable } style={ buttonStyles } onClick={ () => ThrowRock() }>Throw rock</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
                : null
            }
        </GameScreen>    
    )

}

export default Playground;