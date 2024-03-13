import useApp from "src/components/App/hook/useApp";
import usePlayer from "src/components/Player/hook/usePlayer";
import { useContext, useEffect, useState } from "react";
import { Ability, CatchedPokemon, DayCarePokemon, Held_Items, Item, Moves } from "src/interfaces/interfaces";
import { Context } from "src/context/AppContext";
import { useLazyQuery } from "@apollo/client";
import { GET_POKEMON } from "src/query/queries";
import { message } from "antd";

const useDayCare = () => {

    const { saveFile, player, eggs, setEggs, SaveGame } = useContext(Context);

    const [ getPokemon, { data }] = useLazyQuery(GET_POKEMON);

    const { appConsts, gameScreen, FirstLetterToUpper } = useApp();

    const { SavePlayer, SaveExperience, LevelUp } = usePlayer();

    const [ pokemon, setPokemon ] = useState<DayCarePokemon[]>([]);

    const [ position, setPosition ] = useState<number>(0);

    const [ loading, setLoading ] = useState<boolean>(true);

    const [ eggIcon, setEggIcon ] = useState<string>();

    const [ hatchedPokemon, setHatchedPokemon ] = useState<CatchedPokemon>();

    const [ hatchingEgg, setHatchingEgg ] = useState<boolean>(false);

    const GetEggIcon = async() => {

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

    const CalculateMaxProbability = () => {
        
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

    const HatchEgg = () => {
        
        if(pokemon)
        {
            const maxProbability = CalculateMaxProbability();

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

                    setEggs(oldCount => oldCount - 1);

                    const egg: Item | undefined = saveFileCopy.bag.find(item => item.name == 'mystery-egg');

                    if(egg && egg.cuantity)
                    {
                        egg.cuantity -= 1;

                        if(egg.cuantity <= 0)
                        {
                            const eggIndex: number = saveFileCopy.bag.indexOf(egg);

                            if(eggIndex != -1)
                            {
                                saveFileCopy.bag.splice(eggIndex, 1);
                            }
                        }
                    }
    
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
        
        GetEggIcon();

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

    return{
        gameScreen,
        eggIcon,
        eggs,
        setEggs,
        hatchingEgg,
        setHatchingEgg,
        loading,
        pokemon,
        hatchedPokemon,
        HatchEgg,
        FirstLetterToUpper
    }
}

export default useDayCare;