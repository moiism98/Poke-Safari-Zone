import useApp from "src/components/App/hook/useApp";
import useZone from "src/components/Zones/hook/useZone";
import { Ability, CatchedPokemon, Evolution, Held_Items, Item, Moves } from "src/interfaces/interfaces";
import { useLazyQuery } from "@apollo/client";
import { GET_POKEMON } from "src/query/queries";
import { useNavigate } from "react-router-dom";
import { createElement, useCallback, useContext, useEffect, useState } from "react";
import { Context } from "src/context/AppContext";
import { message } from "antd";

const usePokemonDetails = () => {

    type Evolutions = Evolution & { icon: string, catched: boolean }

    const { saveFile, options, player, totalPokemon, pokemonDetails, setPokemonDetails, pokemonTeam, setPokemonTeam, SaveGame } = useContext(Context);

    const [ getPokemon, { data } ] = useLazyQuery(GET_POKEMON);
    
    const  { FirstLetterToUpper, appConsts, getPokemonEvolution } = useApp();

    const { GetTypeIcon } = useZone();

    const navigate = useNavigate();

    const [ nickname, setNickname ] = useState<string | undefined>(pokemonDetails?.nickname ? pokemonDetails.nickname : FirstLetterToUpper(pokemonDetails?.name));

    const [ position, setPosition ] = useState<number>(0);

    const [ evolutions, setEvolutions ] = useState<Evolutions[]>([]);

    const [ loading, setLoading ] = useState<boolean>(true);

    const [ openBag, setOpenBag ] = useState<boolean>(false);

    const [ selectedItem, setSelectedItem ] = useState<Item | null>();

    const [ showEvolution, setShowEvolution ] = useState<number>(0);

    const [ rareCandyIcon, setRareCandyIcon ] = useState<string>();

    const [ rareCandy, setRareCandy ] = useState<number>(0);

    const [ evolving, setEvolving ] = useState<boolean>(false);

    const GetRareCandyIcon = async() => {
    
        await fetch('https://pokeapi.co/api/v2/item/50')
        .then(response => response.ok ? response.json() : console.warn('No data received!'))
        .then(data => setRareCandyIcon(data.sprites.default));
    }

    const RareCandyToEvolve = () => {

        if(pokemonDetails)
        {
            if(pokemonDetails.catch_rate <= 85) setRareCandy(50);
            else if(pokemonDetails.catch_rate <= 170) setRareCandy(25);
            else setRareCandy(15);
        }
    }

    useEffect(() => {
    
        GetRareCandyIcon();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const onChange = (nickname: string) => {
        
        if(nickname.length <= 15)
        {
            if(saveFile)
            {
                const saveFileCopy = saveFile;
    
                const pokemon: CatchedPokemon | undefined = saveFileCopy.myPokemons.find(pkmn => pkmn.listId == pokemonDetails?.listId);
    
                if(pokemon)
                {
                    if(nickname != "")
                    {
                        pokemon.nickname = nickname;

                        setNickname(nickname);
                    }
                    else
                    {
                        pokemon.nickname = undefined;

                        setNickname(FirstLetterToUpper(pokemonDetails?.name))
                    }
                }
    
                SaveGame(saveFileCopy)
            }
        }
        else
        {
            message.error("Error: Nickname length exceded! (Max 15 characters)");
        }

    }

    const isInTeam = useCallback(() => {
        
        let isInTeam = false;

        if(pokemonDetails && pokemonTeam)
        {
            if(pokemonTeam.find(pokemon => pokemon.listId == pokemonDetails.listId))
            {
                isInTeam = true;
            }
        }
        
        return isInTeam;

    }, [ pokemonDetails, pokemonTeam ])

    const [ inTeam, setInTeam ] = useState<boolean>(isInTeam());

    const addToTeam = (pokemon: CatchedPokemon) => {
        
        if(pokemonTeam)
        {
            const teamPokemon = pokemonTeam.find(pkmn => pkmn.listId == pokemon.listId);

            if(!teamPokemon)
            {
                setPokemonTeam(oldTeam => [...oldTeam, pokemon]);
    
                setInTeam(true);
            }
        }

    }

    const removeFromTeam = (pokemon: CatchedPokemon) => {

        if(pokemon)
        {
            setPokemonTeam(pokemonTeam.filter(pkmn => pkmn.listId != pokemon.listId));

            const saveFileCopy = saveFile;

            if(saveFileCopy)
            {
                const updatedTeam: CatchedPokemon[] = saveFileCopy.pokemonTeam.filter(pkmn => pkmn.listId != pokemon.listId);

                saveFileCopy.pokemonTeam = updatedTeam;

                SaveGame(saveFileCopy);
            }
        }
    }

    const GiveItem = () => {
        
        if(selectedItem)
        {
            if(pokemonDetails)
            {
                const saveFileCopy = saveFile;
    
                if(saveFileCopy)
                {
                    const pokemon: CatchedPokemon | undefined = saveFileCopy.myPokemons.find(pokemon => pokemon.listId == pokemonDetails.listId);

                    const bagItem: Item | undefined = saveFileCopy.bag.find(item => item.id == selectedItem.id);

                    if(pokemonDetails.held_item)
                    {    
                        const heldItem = pokemonDetails.held_item.item.name.split('-').map(item => (item)).join(" ");
    
                        const icon = createElement('img', { style: { margin: 0 }, src: pokemonDetails.held_item.item.icon});
    
                        message.info({
                            icon: icon,
                            content: `${ FirstLetterToUpper(heldItem) } was sent to the bag!`
                        });

                        const itemInBag: Item | undefined = saveFileCopy.bag.find(item => item.id == pokemonDetails.held_item?.item.id);
                        
                        if(itemInBag)
                        {
                            itemInBag.cuantity += 1;
                        }
                        else
                        {
                            const inShop: Item | undefined = saveFileCopy.shop.items.find(item => item.id == pokemonDetails.held_item?.item.id);

                            const toSaveItem: Item = {
                                id: pokemonDetails.held_item.item.id,
                                icon: pokemonDetails.held_item.item.icon,
                                name: pokemonDetails.held_item.item.name,
                                cuantity: 1,
                                price: 1,
                                sellPrice: pokemonDetails.held_item.item.price
                            }

                            if(inShop)
                            {
                                toSaveItem.price = inShop.price;

                                toSaveItem.sellPrice = inShop.price;
                            }

                            saveFileCopy.bag.push(toSaveItem);
                        }
                    }

                    const newHeldItem: Held_Items = {
                        item: {
                            id: selectedItem.id,
                            icon: selectedItem.icon,
                            name: selectedItem.name,
                            price: selectedItem.price ? selectedItem.price : 200
                        }
                    };
                
                    setPokemonDetails({ ...pokemonDetails, held_item: newHeldItem });

                    if(pokemon && bagItem)
                    {
                        pokemon.held_item = newHeldItem;
                        
                        bagItem.cuantity -= 1;
                    }

                    SaveGame(saveFileCopy);
    
                    setOpenBag(false);
        
                    setSelectedItem(null);
                }
            }

        }
        else
        {
            message.error("You have to select an item to equip it!");
        }
    }

    const GetItem = () => {

        if(pokemonDetails)
            {
                const saveFileCopy = saveFile;
    
                if(saveFileCopy)
                {
                    if(pokemonDetails.held_item)
                    {
                        const heldItem = pokemonDetails.held_item.item.name.split('-').map(item => (item)).join(" ");
    
                        const icon = createElement('img', { style: { margin: 0 }, src: pokemonDetails.held_item.item.icon});
    
                        message.info({
                            icon: icon,
                            content: `${ FirstLetterToUpper(heldItem) } was sent to the bag!`
                        });

                        const itemInBag: Item | undefined = saveFileCopy.bag.find(item => item.id == pokemonDetails.held_item?.item.id);
                        
                        if(itemInBag)
                        {
                            itemInBag.cuantity += 1;
                        }
                        else
                        {
                            const inShop: Item | undefined = saveFileCopy.shop.items.find(item => item.id == pokemonDetails.held_item?.item.id);

                            const toSaveItem: Item = {
                                id: pokemonDetails.held_item.item.id,
                                icon: pokemonDetails.held_item.item.icon,
                                name: pokemonDetails.held_item.item.name,
                                cuantity: 1,
                                price: 1,
                                sellPrice: pokemonDetails.held_item.item.price
                            }

                            if(inShop)
                            {
                                toSaveItem.price = inShop.price;

                                toSaveItem.sellPrice = inShop.price;
                            }

                            saveFileCopy.bag.push(toSaveItem);
                        }
                    }
                
                    setPokemonDetails({ ...pokemonDetails, held_item: null });

                    const pokemon: CatchedPokemon | undefined = saveFileCopy.myPokemons.find(pokemon => pokemon.listId == pokemonDetails.listId);

                    if(pokemon)
                    {
                        pokemon.held_item = null;
                    }

                    SaveGame(saveFileCopy);
                }
            }
    }
    
    const TriggerEvolution = (evolution: string) => {

        if(pokemonDetails)
        {
            setEvolving(true);
            
            getPokemon({ variables: { "name": evolution }})
        }
    }

    const EvolvePokemon = async() => {

        if(pokemonDetails)
        {
            const saveFileCopy = saveFile;
    
            if(saveFileCopy)
            {
                const ability: Ability | null = SetRandomAbility(data.pokemon.abilities);

                const moves: Moves[] | undefined = SetRandomMoveSet(data.pokemon.moves);

                const myPokemon: CatchedPokemon | undefined = saveFileCopy.myPokemons.find(pokemon => pokemon.id == data.pokemon.id);

                let cry: string = '';

                await fetch(`${appConsts.pokemonPoint}/${data.pokemon.id}`)
                .then(response => response.ok ? response.json() : console.warn("Data has not been received!"))
                .then(data => cry = data.cries.latest);

                let catch_rate: number = 0;

                await fetch(`${appConsts.pokeSpeciesPoint}/${data.pokemon.id}`)
                .then(response => response.ok ? response.json() : console.warn("Data has not been received!"))
                .then(data => catch_rate = data.capture_rate);

                let evolution: Evolution[] | null = [];

                await getPokemonEvolution(data.pokemon.id, data.pokemon.name)
                .then(data => {
                    
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
                
                if(ability && moves)
                {
                
                    const pokemonEvolution: CatchedPokemon = {
                        ...pokemonDetails, 
                        id: data.pokemon.id,
                        catched: myPokemon ? myPokemon.catched + 1 : 1, 
                        moves: moves,
                        cry: cry,
                        catch_rate: catch_rate,
                        evolution: evolution ? evolution : null,
                        name: data.pokemon.name,
                        seen: myPokemon ? myPokemon.seen + 1 : 1,
                        shiny: pokemonDetails.shiny ? true : false,
                        sprites: data.pokemon.sprites,
                        types: data.pokemon.types,
                        ability: ability,
                        height: data.pokemon.height, 
                        weight: data.pokemon.weight, 
                        listId: saveFileCopy.myPokemons.length + 1
                    };

                    if(!myPokemon) // if is the first time this pokemon is evolved...
                    {
                        saveFileCopy.statistics.seen += 1;

                        saveFileCopy.statistics.catched += 1;

                        saveFileCopy.seenPokemons.push({
                            id: pokemonEvolution.id,
                            name: pokemonEvolution.name,
                            sprite: pokemonEvolution.sprites.front_default
                        })
                    }

                    const releasePokemon = saveFileCopy.myPokemons.find(pokemon => pokemon.listId == pokemonDetails.listId);

                    if(releasePokemon) releasePokemon.released = true;

                    saveFileCopy.myPokemons.push(pokemonEvolution);
                    
                    setPokemonDetails(pokemonEvolution);

                    SaveGame(saveFileCopy);

                    setEvolving(false);
                }
            }
        }
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

    const SetRandomAbility = (abilities: Ability[]) => {
        
        let ability: Ability | null = null;

        if(abilities)
        {
            const random = RandomProbability(abilities.length);

            ability = abilities[random];
        }

        return ability;

    };

    useEffect(() => {
        
        if(pokemonTeam && saveFile)
        {
            const saveFileCopy = saveFile;

            saveFileCopy.pokemonTeam = pokemonTeam;

            SaveGame(saveFileCopy);
        }

        setInTeam(isInTeam());

    }, [ pokemonTeam, saveFile, SaveGame, isInTeam ])

    useEffect(() => {
        
        if(pokemonDetails && pokemonDetails.evolution)
        {
            if(position < pokemonDetails.evolution.length)
            {
                getPokemon({ variables: { "name": pokemonDetails.evolution[position].evolution }})
            }
            else
            {
                setLoading(false);
            }

            RareCandyToEvolve();
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ position, pokemonDetails ])

    useEffect(() => {
        
        if(pokemonDetails && data)
        {
            if(evolving)
            {
                EvolvePokemon();
            }
            else
            {

                // some pokemon have evolution from advances generations that the game doesn't have to play, 
                // we have to check it by using the pokemon id.
    
                if(pokemonDetails.evolution)
                {
                    const evolution = pokemonDetails.evolution;
    
                    const pokemon = saveFile?.myPokemons.find(pokemon => pokemon.name == evolution[position].evolution ? evolution[position].evolution : '');
    
                    setEvolutions([...evolutions, {
                        id: data.pokemon.id,
                        evolution: evolution[position].evolution,
                        held_item: evolution[position].held_item,
                        item: evolution[position].item,
                        method: evolution[position].method,
                        icon: data.pokemon.sprites.front_default,
                        catched: pokemon ? true : false
                    }]);
                }
    
                setPosition(oldPosition => oldPosition + 1)
            }
        }   
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ data, evolving ])

    useEffect(() => {
    
        if(evolutions)
        {            
            evolutions.forEach(evolution => {
                
                if(evolution.id <= totalPokemon)
                {
                    setShowEvolution(oldCount => oldCount + 1);
                }
            })
        }
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ evolutions ])

    return{
        saveFile,
        options,
        appConsts,
        player,
        totalPokemon,
        navigate,
        pokemonDetails,
        rareCandyIcon,
        rareCandy,
        openBag,
        setOpenBag,
        selectedItem,
        setSelectedItem,
        nickname,
        inTeam,
        pokemonTeam,
        evolutions,
        showEvolution,
        loading,
        evolving,
        TriggerEvolution,
        GetItem,
        GiveItem,
        onChange,
        addToTeam,
        removeFromTeam,
        GetTypeIcon,
        FirstLetterToUpper,
        SaveGame
    }
}

export default usePokemonDetails