import useApp from "src/components/App/hook/useApp";
import useZone from "src/components/Zones/hook/useZone";
import { CatchedPokemon, Evolution } from "src/interfaces/interfaces";
import { useLazyQuery } from "@apollo/client";
import { GET_POKEMON } from "src/query/queries";
import { useNavigate } from "react-router-dom";
import { useCallback, useContext, useEffect, useState } from "react";
import { Context } from "src/context/AppContext";
import { message } from "antd";

const usePokemonDetails = () => {

    type Evolutions = Evolution & { icon: string, catched: boolean }

    const { saveFile, options, pokemonDetails, pokemonTeam, setPokemonTeam, totalPokemon, SaveGame } = useContext(Context);

    const [ getPokemon, { data } ] = useLazyQuery(GET_POKEMON);
    
    const  { FirstLetterToUpper, appConsts } = useApp();

    const { GetTypeIcon } = useZone();

    const navigate = useNavigate();

    const [ nickname, setNickname ] = useState<string | undefined>(pokemonDetails?.nickname ? pokemonDetails.nickname : FirstLetterToUpper(pokemonDetails?.name));

    const [ position, setPosition ] = useState<number>(0);

    const [ evolutions, setEvolutions ] = useState<Evolutions[]>([]);

    const [ loading, setLoading ] = useState<boolean>(true);

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

    useEffect(() => {
        
        

    },[])
    

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
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ position ])

    useEffect(() => {
        
        if(data)
        {
            // some pokemon have evolution from advances generations that the game doesn't have to play, 
            // we have to check it by using the pokemon id.

            if(data.pokemon.id <= totalPokemon)
            {
                if(pokemonDetails && pokemonDetails.evolution)
                {
                    const evolution = pokemonDetails.evolution;

                    const pokemon = saveFile?.myPokemons.find(pokemon => pokemon.name == evolution[position].evolution);

                    setEvolutions([...evolutions, {
                        evolution: evolution[position].evolution,
                        held_item: evolution[position].held_item,
                        item: evolution[position].item,
                        method: evolution[position].method,
                        icon: data.pokemon.sprites.front_default,
                        catched: pokemon ? true : false
                    }]);
                }
            }

            setPosition(oldPosition => oldPosition + 1)
        }   
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ data ])

    return{
        saveFile,
        options,
        appConsts,
        navigate,
        pokemonDetails,
        nickname,
        inTeam,
        pokemonTeam,
        evolutions,
        loading,
        onChange,
        addToTeam,
        removeFromTeam,
        GetTypeIcon,
        FirstLetterToUpper
    }
}

export default usePokemonDetails