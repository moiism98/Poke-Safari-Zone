import useApp from "src/components/App/hook/useApp";
import GameScreen from "src/components/GameScreen/GameScreen";
import daycare from "src/assets/img/Zones/daycare.svg";
import Loading from "src/components/Spinners/Loading/Loading";
import { useContext, useEffect, useState } from "react";
import { Ability, CatchedPokemon, DayCarePokemon, Held_Items, Moves } from "src/interfaces/interfaces";
import { Context } from "src/context/AppContext";
import { useLazyQuery } from "@apollo/client";
import { GET_POKEMON } from "src/query/queries";
import { Button, Image } from "react-bootstrap";
import { message } from "antd";
import usePlayer from "src/components/Player/hook/usePlayer";

const DayCare = () => {

    const { saveFile, player, SaveGame } = useContext(Context);

    const [ getPokemon, { data }] = useLazyQuery(GET_POKEMON);

    const { appConsts, gameScreen, FirstLetterToUpper } = useApp();

    const { SavePlayer, SaveExperience, LevelUp } = usePlayer();

    const [ pokemon, setPokemon ] = useState<DayCarePokemon[]>([]);

    const [ position, setPosition ] = useState<number>(0);

    const [ loading, setLoading ] = useState<boolean>(true);

    const [ eggIcon, setEggIcon ] = useState<string>();

    const [ eggCount, setEggCount ] = useState<number>(0);

    const [ hatchedPokemon, setHatchedPokemon ] = useState<CatchedPokemon>();

    const [ hatchingEgg, setHatchingEgg ] = useState<boolean>(false);

    const getEggIcon = async() => {

        await fetch("https://pokeapi.co/api/v2/item/483/")
        .then(response => response.ok ? response.json() : console.warn("Data not received!"))
        .then(data => setEggIcon(data.sprites.default));
    }

    const RandomProbability = (max: number) => {
    
        return Math.floor(Math.random() * max);
    }

    const RandomIntInclusiveNumber = (min: number, max: number) => {
        
        // The maximum and minimum are inclusives.

        return Math.floor(Math.random() * (max - min + 1) + min); 
    }
    
    const SetRandomMoveSet = (moves: Moves[]) => {

        if(moves)
        {
            let move = 0;
            
            const pokeMoves: Moves[] = [];

            const maxMoves = RandomIntInclusiveNumber(1, 4)
    
            while(move < maxMoves)
            {
                const newMove = moves[RandomProbability(moves.length)];

                const existingMove = pokeMoves.find(move => move.move == newMove.move);

                if(!existingMove)
                {
                    pokeMoves.push(newMove);
                
                    move++;
                }
            }
    
            //const randomMoveSet = pokeMoves.map(move => move.move.name).join(', ');
    
            return pokeMoves;
        }
    }

    // this method take the higher rate on the array as max % of probability, so the 100% will be the higher rate number in the array!

    const calculateMaxProbability = () => {
        
        let maxProbability = 0;

            let position = 0;

            while(position < pokemon.length)
            {
                
                if( pokemon[position].rate > maxProbability)
                {
                    maxProbability = pokemon[position].rate;
                }

                position++;
            
            }

        return maxProbability;
    }

    const IsShiny = () => {
    
        let shiny = false;

        if(RandomProbability(100) <= appConsts.shinyProbability)
        {
            shiny = true;
        }

        return shiny;
    }

    const SetRandomAbility = (abilities: Ability[]) => {
        
        let ability: Ability | null = null;

        if(abilities)
        {
            const random = RandomProbability(abilities.length);

            ability = abilities[random];
        }

        return ability;

    }

    const SetRandomHeldItem = (held_items: Held_Items[]) => {
        
        let item = null;

        if(held_items && held_items.length > 0)
        {
            item = held_items[RandomProbability(held_items.length)];
        }

        return item;
    }

    const hatchEgg = () => {
        
        if(pokemon)
        {
            const maxProbability = calculateMaxProbability();

            const probability = RandomProbability(maxProbability);

            const pokemonInProbability = pokemon.filter(pokemon => pokemon.rate >= probability);

            const hatchedPokemon = pokemonInProbability[RandomProbability(pokemonInProbability.length)];

            if(hatchedPokemon)
            {
                getPokemon({ variables: { "name": hatchedPokemon.name } });
            }
        }
    }

    const SaveHatchedPokemon = async(data) => {

        if(data)
        {
            const saveFileCopy = saveFile;
    
            if(saveFileCopy)
            {
                const pokemon: CatchedPokemon | undefined = saveFileCopy.myPokemons.find(myPokemon => myPokemon.id == data.pokemon.id);
                
                const ability = SetRandomAbility(data.pokemon.abilities);
                    
                const held_item = SetRandomHeldItem(data.pokemon.held_items);
                
                const moves = SetRandomMoveSet(data.pokemon.moves);
        
                const shiny: boolean = IsShiny();
                
                if(shiny)
                {
                    saveFileCopy.statistics.shiny++;
                }

                if(!pokemon)
                {
    
                    saveFileCopy.seenPokemons.push({
                        id: data.pokemon.id,
                        name: data.pokemon.name,
                        sprite: data.pokemon.sprites.front_default
                    })
    
                    
    
                    saveFileCopy.statistics.catched++;
                    saveFileCopy.statistics.seen++;
                }
        
                let cry: string = '';
        
                await fetch(`${appConsts.pokemonPoint}/${data.pokemon.id}`)
                .then(response => response.ok ? response.json() : console.warn("Data has not been received!"))
                .then(data => cry = data.cries.latest)
        
                if(ability && moves)
                {
                    const catchedPokemon: CatchedPokemon = {
                        
                        id: data.pokemon.id,
                        listId: saveFileCopy.myPokemons.length + 1,
                        name: data.pokemon.name,
                        types: data.pokemon.types,
                        moves: moves,
                        height: data.pokemon.height,
                        weight: data.pokemon.weight,
                        held_item: held_item,
                        sprites: data.pokemon.sprites,
                        ability: ability,
                        shiny: shiny,
                        cry: cry,
                        catched: 1,
                        seen: 1, 
                    }
                    
                    setHatchedPokemon(catchedPokemon);
                    
                    setHatchingEgg(false);

                    setEggCount(oldCount => oldCount - 1);
    
                    saveFileCopy.myPokemons.push(catchedPokemon);
    
                    player.setExperience(oldExperience => oldExperience + 3);
        
                    message.success(`${FirstLetterToUpper(catchedPokemon.name)} hatched from egg!`);
    
                    message.info(`You've received 3 exp points!`);
    
                    SaveGame(saveFileCopy);     

                }
            }
        }
    }


    useEffect(() => {
        
        getEggIcon();

    }, [])

    useEffect(() => {
        
        if(saveFile)
        {
            if(position < saveFile.dayCare.pokemon.length)
            {
                getPokemon({ variables: { "name": saveFile.dayCare.pokemon[position].name } });
            }
            else
            {
                setLoading(false);
            }
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ position ])

    useEffect(() => {
        
        if(hatchingEgg)
        {
            SaveHatchedPokemon(data);
        }
        else
        {
            if(data && saveFile)
            {
                const rate: number = saveFile?.dayCare?.pokemon[position]?.rate;

                if(rate)
                {
                    setPokemon([...pokemon, {
                        name: data.pokemon.name,
                        rate: rate,
                        sprite: data.pokemon.sprites?.front_default
                    }]);
        
                    setPosition(oldPosition => oldPosition + 1);
                }
            }
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ data, hatchedPokemon ])

    // save player's experience every time he/she catch a pokemon.

    useEffect(() => {
        
        SaveExperience();
        
    }, [ SaveExperience ])
    
    // save the player every time he/she level up

    useEffect(() => {
        
        SavePlayer();
        
    }, [ SavePlayer ])

    useEffect(() => {
    
        LevelUp();

    }, [ LevelUp ])

    return(
        <GameScreen styles={ Object.assign({}, gameScreen, { backgroundImage: `url(${ daycare })` }) }>
            <div style={{ width: '100%', height: '100%'}}>
                <div style={{ display: "flex", alignItems:'center', justifyContent: 'center', padding:'.3em', width: '10%', height: '5%', margin: '1em' }}>
                    <Image width={40} height={40} src={ eggIcon }/>
                    <h5 style={{ margin: 0, color: '#000' }}> x{ eggCount }</h5>
                </div>
                {
                    loading ? <Loading/> :
                    <>
                        <div style={{ display: 'flex', flexWrap:'wrap', alignItems: 'center', justifyContent: 'center', overflow: 'auto', width: '100%', height: '40%', backgroundColor: 'white', border: gameScreen.border, borderRadius: gameScreen.borderRadius }}>
                            {
                                pokemon.map(pokemon => (
                                    
                                    <div key={ pokemon.name } style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', width: '30%', height:'15%', padding: '.1em'}}>
                                        <Image title={ FirstLetterToUpper(pokemon.name) } src={ pokemon.sprite ? pokemon.sprite : '' } width={75} height={75}/>
                                        <h5>{ FirstLetterToUpper(pokemon.name) }</h5>
                                        <h5>{ pokemon.rate }%</h5>
                                    </div>
                                ))
                            }
                        </div>

                        <div style={{ display:'flex', alignItems: 'center', justifyContent: 'center', width:'100%', height: '55%'}}>
                            <div style={{ display:'flex', flexDirection:'column', alignItems: 'center', justifyContent: 'space-evenly', width:'25%', height: '100%' }}>
                                <Button onClick={() => setEggCount(oldEgg => oldEgg + 1)}>Egg Count ++</Button>
                                {
                                    eggCount > 0 ?
                                        <Button 
                                            disabled={ hatchingEgg ? true : false }
                                            onClick={() => {

                                                setHatchingEgg(true);

                                                setTimeout(() => hatchEgg(), 2000);
                                            }} 
                                        >
                                                Hatch Egg!
                                        </Button> : null
                                }
                            </div>
                            <div style={{ display:'flex', alignItems: 'center', justifyContent: 'center', width:'75%', height: '100%' }}>
                                {
                                    hatchingEgg ? <Loading/> :

                                        hatchedPokemon ? 
                                        <>
                                            <audio autoPlay src={ hatchedPokemon.cry }></audio>
                                            <Image title={ FirstLetterToUpper(hatchedPokemon.name) } width={150} height={150} src={ hatchedPokemon.shiny ? hatchedPokemon.sprites.front_shiny : hatchedPokemon.sprites.front_default }/>
                                        </> : null
                                }
                            </div>
                        </div>
                    </>
                }
            </div>
        </GameScreen>    
    )
}

export default DayCare