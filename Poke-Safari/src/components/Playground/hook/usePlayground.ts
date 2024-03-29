import usePlayer from "src/components/Player/hook/usePlayer";
import useApp from "src/components/App/hook/useApp";
import useZone from "src/components/Zones/hook/useZone";
import useUnlocks from "src/utils/App/unlocks";
import { ReactElement, createElement, useContext, useEffect, useState } from "react";
import { Moves, Ability, WildPokemon, ZonePokemon, SeenPokemon, Held_Items, Evolution, Item } from "src/interfaces/interfaces";
import { message } from "antd";
import { Context } from "src/context/AppContext";
import { GET_POKEMON } from "src/query/queries";
import { useLazyQuery } from "@apollo/client";

const usePlayground = () => {

    const { options, saveFile, SaveGame, player } = useContext(Context);
    
    const { SavePlayer, LevelUp, SaveExperience } = usePlayer();
    
    const { appConsts, gameScreen, getPokemonEvolution } = useApp();

    const { CheckUnlock } = useUnlocks();

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


    const styles = {
        frame: {
            border: gameScreen.border,
            borderRadius: gameScreen.borderRadius
        },
        button: {
            fontFamily: options.appFont,
            margin: '.5em',
            width:'130px'
        }
        
    }

    const RandomProbability = (max: number) => {
    
        return Math.floor(Math.random() * max);
    }

    const IsShiny = () => {
    
        let shiny = false;

        if(RandomProbability(100) <= appConsts.shinyProbability)
        {
            shiny = true;
        }

        return shiny;
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

    const SetRandomAbility = (abilities: Ability[]) => {
        
        let ability: Ability | null = null;

        if(abilities)
        {
            const random = RandomProbability(abilities.length);

            ability = abilities[random];
        }

        return ability;

    };

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

    const GetWildPokemon = () => {
        
        let wildPokemon: ZonePokemon | null = null;

        let found = false;

        while(!found)
        {
            if(zone && zone.pokemon)
            {
                const probability: number = RandomProbability(100)
    
                const pokemon: number = Math.floor(Math.random() * zone.pokemon.length);
                
                if(!zone.pokemon[pokemon].unlock) // only spawn a pokemon if its unlocked!!!
                {
                    if(zone.pokemon[pokemon].encounter_rate >= probability)
                    {
                        wildPokemon = zone.pokemon[pokemon];
                        
                        found = true;
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

    const SpawnWildPokemon = async() => {
    
        if(data)
        {
            setLoading(true)

            const ability = SetRandomAbility(data.pokemon.abilities);
            
            let held_item: Held_Items | null = null;
            
            SetRandomHeldItem(data.pokemon.held_items).then(data => held_item = data);
            
            const moves = SetRandomMoveSet(data.pokemon.moves);

            const shiny: boolean = IsShiny();

            const zonePokemon: ZonePokemon | undefined = zone?.pokemon?.find(pokemon => pokemon.id == data.pokemon.id);

            let cry: string = '';

            await fetch(`${appConsts.pokemonPoint}/${data.pokemon.id}`)
            .then(response => response.ok ? response.json() : console.warn("Data has not been received!"))
            .then(data => cry = data.cries.latest);

            if(moves && ability && zonePokemon)
            {
                let evolution: Evolution[] | null = [];

                await getPokemonEvolution(zonePokemon.id, zonePokemon.name).then(data => {

                    if(data)
                    {
                        data.map(evo => {

                            evolution?.push({
                                id: evo.id,
                                item: evo.method == 'level-up' ? "rare-candy" : evo.item,
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

                // generate the wild pokemon

                const wildPokemon: WildPokemon = {
                    id: data.pokemon.id,
                    name: data.pokemon.name,
                    types: data.pokemon.types,
                    moves: moves,
                    height: data.pokemon.height,
                    weight: data.pokemon.weight,
                    held_item: held_item,
                    sprites: data.pokemon.sprites,
                    ability: ability,
                    catch_rate: zonePokemon.catch_rate,
                    encounter_rate: zonePokemon.encounter_rate,
                    shiny: shiny,
                    caught: zonePokemon.caught,
                    seen: zonePokemon.seen,
                    cry: cry,
                    evolution: evolution
                }

                SaveSeenPokemon(wildPokemon);

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

    const SaveSeenPokemon = (wildPokemon: WildPokemon) => {

        // check if the pokemon has been seen before, if it was, add 1 on global app count. (at player stats)

        const seenPokemon: SeenPokemon | undefined = saveFile?.seenPokemons.find(pokemon => pokemon.id == wildPokemon.id)

        if(saveFile?.statistics && !seenPokemon)
        {
            saveFile?.seenPokemons.push({id: wildPokemon.id, name: wildPokemon.name, sprite: wildPokemon.sprites.front_default})

            saveFile.statistics.seen++;
        }

        // get the zone's pokemon and add 1 on that pokemon's seen count.

        //const safariZone = saveFile?.safariZones.find(savedZone => savedZone.name == zone?.name);

        const znPokemon = zone?.pokemon?.find(poke => poke.id == wildPokemon.id);

        if(znPokemon)
        {
            znPokemon.seen++;
        }

        wildPokemon.seen++;

        CheckUnlock(wildPokemon);

        // save the data at localstorage.

        const saveFileCopy = saveFile;

        if(saveFileCopy)
        {
            SaveGame(saveFileCopy);
        }

    }

    const CatchPokemon = async() => {
        
        if(wildPokemon)
        {
            // Pokemon catch rate (over 100%) + extra bait/rock combat catch rate.

            const totalCatchRate = Math.round((wildPokemon.catch_rate * 100) / appConsts.maxCatchRate) + Math.round((catchRate / 100) * appConsts.maxCatchRate);

            const catchProbability = RandomProbability(appConsts.maxCatchRate);
            
            if(totalCatchRate >= catchProbability)
            {
                // verify if the pokemon has been caught before or not.

                //const safariZone = saveFile?.safariZones.find(savedZone => savedZone.name == zone?.name);

                const zonePokemon = zone?.pokemon?.find(poke => poke.id == wildPokemon.id);

                // if it was, we add 1 on global app count.

                if(zonePokemon)
                {
                    zonePokemon.caught++;
                }

                wildPokemon.caught++;

                const saveFileCopy = saveFile;

                if(saveFileCopy && saveFileCopy.player)
                {
                    /* 
                        this id is unique for our caught pokemon, so we can difference between 2 or more same pokemons
                        2 aron are not the same between them, so we can add them both to our team for instance... 
                    */
                   
                    wildPokemon.listId = player.listId;

                    player.setListId(id => id + 1);

                    saveFileCopy.player.listId += 1;
                }
                
                SavecaughtPokemon(wildPokemon);

                CheckUnlock(wildPokemon);

                // calculate the experience earned in the combat.

                const earnedExperience = GainExperience(wildPokemon.catch_rate);

                message.success(`Gotcha! ${ wildPokemon?.name.toUpperCase() } was caught!`);
                
                message.info(`You've received ${ earnedExperience } exp points!`);

                await GetRareCandy(wildPokemon.catch_rate);

                await GetReward();
                
                player.setExperience(prevExperience => prevExperience + earnedExperience);

                setCaught(true);
            }
            else
            {
                WaitForPokemon();
            }

            setCatching(false);
        }
    }

    // save pokemon and statistics at localstorage.

    const SavecaughtPokemon = (wildPokemon: WildPokemon) => {

        const saveFileCopy = saveFile;
                
        if(saveFileCopy)
        {
            // if we caught a NEW pokemon we add 1 on the global app count.

            if(!saveFile.myPokemons.find(pokemon => pokemon.id == wildPokemon.id))
            {
                saveFileCopy.statistics.caught++;
            }

            // same with shinies pokemon.

            if(wildPokemon.shiny)
            {
                saveFileCopy.statistics.shiny++;
            }
            
            saveFileCopy.myPokemons.push(wildPokemon)

            SaveGame(saveFileCopy)
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

    // the experience received its not fixed in one value. ( 1-2, 2-3, 4-5 ... max 5 min 1)

    const RandomIntInclusiveNumber = (min: number, max: number) => {
        
        // The maximum and minimum are inclusives.

        return Math.floor(Math.random() * (max - min + 1) + min); 
    }

    // CHANGE THIS METHOD

    // player is going to receive more exp point depending on pokemon's catch rate: less catch rate, more exp. (harder to catch)

    const GainExperience = (catchRate: number) => {

        let experience: number = 1;

        if(catchRate <= 51)
        {
            experience = 5;
        }
        else if(catchRate <= 102)
        {
            experience = RandomIntInclusiveNumber(4, 5);
        }
        else if(catchRate <= 153)
        {
            experience = RandomIntInclusiveNumber(3, 4);
        }
        else if(catchRate <= 204)
        {
            experience = RandomIntInclusiveNumber(2, 3);
        }
        else if(catchRate < 255)
        {
            experience = RandomIntInclusiveNumber(1, 2);
        }

        return experience;
    }

    // generates rare candy, the amount of earned candies will depend on pokemon's catch rate! 
    // candies will allow players evolve his pokemon!

    const GetRareCandy = async(catchRate: number) => {
        
        let rareCandyIcon: string = '';

        await fetch(`https://pokeapi.co/api/v2/item/50`)
        .then(response => response.ok ? response.json() : console.warn('No data received!'))
        .then(data => rareCandyIcon = data.sprites.default);

        let rareCandy: number = 1;

        if(catchRate <= 85) rareCandy = 10;
        else if(catchRate <= 170) rareCandy = 5;
        else rareCandy = 3;

        const saveFileCopy = saveFile;

        if(saveFileCopy && saveFileCopy.player)
        {
            saveFileCopy.player.rareCandy += rareCandy;

            player.setRareCandy(oldRareCandy => oldRareCandy + rareCandy);

            SaveGame(saveFileCopy);

            const icon: ReactElement = createElement('img', { style: { margin: 0 }, src: rareCandyIcon })
                    
            message.info({
                icon: icon,
                content: `You have received ${ rareCandy } rare candy!`
            })
        }
    }

    // generates a random zone reward, we will use them to earn money!

    const GetReward = async() => {

        const rewardProb: number = RandomIntInclusiveNumber(0, 1);

        if(rewardProb != 0)
        {
            if(zone && zone.rewards)
            {
                const reward: Item = zone.rewards[RandomProbability(zone.rewards.length)];

                const saveFileCopy = saveFile;

                if(saveFileCopy)
                {
                    const bagItem = saveFileCopy.bag.find(item => item.id == reward.id);

                    if(bagItem)
                    {
                        bagItem.cuantity += 1;
                    }
                    else
                    {
                        let rewardIcon: string = ''

                        await fetch(`https://pokeapi.co/api/v2/item/${reward.id}`)
                        .then(response => response.ok ? response.json() : console.warn('No data received!'))
                        .then(data => rewardIcon = data.sprites.default);

                        saveFileCopy.bag.push({
                            id: reward.id,
                            name: reward.name,
                            icon: rewardIcon,
                            cuantity: 1,
                            sellPrice: reward.sellPrice,
                            price: 1
                        })
                    }

                    SaveGame(saveFileCopy);

                    const icon: ReactElement = createElement('img', { style: { margin: 0 }, src: reward.icon })
                    
                    message.info({
                        icon: icon,
                        content: `You have received ${reward.name}`
                    })
                }
            
            }
        }
    }

    // once the page its loaded we load a random pokemon.

    useEffect(() => {

        GenerateWildPokemon();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // and when the data is received, we spawn it!

    useEffect(() => {
    
        SpawnWildPokemon();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ data ])


    // while we are catching a pokemon or it's its turn whe set the disable to true, so we can't trigger again any button.

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

    // if the pokemon got caught or flee, we show the correspondant message and reload another pokemon.

    useEffect(() => {
    
        if(caught && wildPokemon)
        {            
            setTimeout(() => GenerateWildPokemon(), 100);

            setCaught(false)
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ caught, wildPokemon?.name ])

    useEffect(() => {
    
        if(fled)
        {
            message.error(`Wild ${ wildPokemon?.name.toUpperCase() } fled!`);

            setTimeout(() => GenerateWildPokemon(), 100);

            setFled(false)
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ fled, wildPokemon?.name ])
    

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
    
    return {
        wildPokemon,
        catchRate,
        fleeRate,
        pokemonTurn,
        loading,
        disable,
        styles,
        catching,
        setCatching,
        GenerateWildPokemon,
        CatchPokemon, 
        ThrowBait,
        ThrowRock
    }

}

export default usePlayground