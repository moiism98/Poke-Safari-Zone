import useApp from "src/components/App/hook/useApp";
import usePlayer from "src/components/Player/hook/usePlayer";
import { useContext, useEffect, useState } from "react";
import { Ability, CatchedPokemon, DayCarePokemon, Evolution, Held_Items, Item, Moves } from "src/interfaces/interfaces";
import { Context } from "src/context/AppContext";
import { useLazyQuery } from "@apollo/client";
import { GET_POKEMON } from "src/query/queries";
import { message } from "antd";

const useDayCare = () => {

    const { saveFile, player, eggs, setEggs, SaveGame } = useContext(Context);

    const [ getPokemon, { data }] = useLazyQuery(GET_POKEMON);

    const { appConsts, gameScreen, getPokemonEvolution, FirstLetterToUpper } = useApp();

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

    const SetRandomHeldItem = async(held_items: Held_Items[]) => {
        
        let item: Held_Items | null = null;

        let icon: string = '';

        let price: number = 0;

        if(held_items && held_items.length > 0)
        {
            const randomItem: Held_Items | null = held_items[RandomIntInclusiveNumber(0, held_items.length)];

            if(randomItem && randomItem.item.url)
            {
                const urlElements: string[] = randomItem.item.url.split('/');

                const itemId: number = +urlElements[urlElements.length - 2];

                await fetch(randomItem.item.url)
                .then(response => response.ok ? response.json() : console.warn("Data not received!"))
                .then(data => { 

                    icon = data.sprites.default;
                    
                    price = data.cost;
                });
    
                item = {
                    item:{
                        id: itemId,
                        name: randomItem.item.name,
                        icon: icon,
                        price: price
                    }
                };
            }

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
                    
                let held_item: Held_Items | null = null;

                SetRandomHeldItem(data.pokemon.held_items).then(data => held_item = data);

                let catchRate: number = 0;

                await fetch(`${appConsts.pokeSpeciesPoint}/${data.pokemon.id}`)
                .then(response => response.ok ? response.json() : console.warn("No data received!"))
                .then(data => catchRate = data.capture_rate);
                
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
                .then(data => cry = data.cries.latest);

                let evolution: Evolution[] | null = [];

                await getPokemonEvolution(data.pokemon.id, data.pokemon.name).then(data => {

                    if(data)
                    {
                        data.map(evo => {
                            
                            evolution?.push({
                                id: evo.id,
                                item: evo.method == 'level-up' ? "rare-candy" : evo.item,
                                held_item: evo.held_item,
                                evolution: evo.evolution,
                                method: evo.method
                            })
                        })
                    }
                    else
                    {
                        evolution = null;
                    }
                    
                });
        
                if(ability && moves)
                {
                    const catchedPokemon: CatchedPokemon = {
                        
                        id: data.pokemon.id,
                        listId: player.listId,
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
                        evolution: evolution,
                        catch_rate: catchRate,
                        catched: 1,
                        seen: 1, 
                    }

                    player.setListId(id => id + 1);
                    
                    if(saveFileCopy.player)
                        saveFileCopy.player.listId += 1;
                    
                    setHatchedPokemon(catchedPokemon);
                    
                    setHatchingEgg(false);

                    setEggs(oldCount => oldCount - 1);

                    const egg: Item | undefined = saveFileCopy.bag.find(item => item.name == 'mystery-egg');

                    if(egg && egg.cuantity)
                    {
                        egg.cuantity -= 1;
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