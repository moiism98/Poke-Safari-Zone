import useApp from "src/components/App/hook/useApp";
import { ReactElement, createElement, useCallback, useContext, useEffect, useState} from "react";
import { Context } from "src/context/AppContext";
import { CatchedPokemon } from "src/interfaces/interfaces";
import { message } from "antd";
import usePokemonDetails from "src/components/pokemon/hook/usePokemonDetails";

const usePokemonList = () => {

    const { saveFile, player, setPokemonTeam, setPokemonDetails, setMyPokemon, SaveGame } = useContext(Context);

    const { FirstLetterToUpper } = useApp();

    const { rareCandyIcon } = usePokemonDetails()

    const [ releasePokemon, setReleasePokemon ] = useState<CatchedPokemon>();

    const [ release, setRelease ] = useState<boolean>(false);

    const [ openModal, setOpenModal ] = useState<boolean>(false);

    const [ page, setPage ] = useState<number>();

    const [ pages, setPages ] = useState<number>();

    const [ offset, setOffset ] = useState<number>(0);

    const [ totalPokemon, setTotalPokemon ] = useState<number>(0);

    const limit = 28;

    const onRelease = (releasePokemon: CatchedPokemon | undefined) => {

        const saveFileCopy = saveFile;
        
        if(saveFileCopy)
        {
            const pokemon = saveFileCopy.myPokemons.find(pokemon => pokemon.listId == releasePokemon?.listId);

            if(pokemon)
            {
                // delete the pokemon from myPokemon and pokemonTeam arrays!

                const listPokemonIndex = saveFileCopy.myPokemons.findIndex(myPokemon => myPokemon.listId == pokemon.listId);

                saveFileCopy.myPokemons.splice(listPokemonIndex, 1);

                // if we found the released pokemon on the team, we remove this pokemon from the team!
                
                // remake the pokemon team discarding the ALL released pokemon! (inside myPokemon discard the pokemon already realeased and the current one released)

                const pokemonTeamIndex = saveFileCopy.pokemonTeam.findIndex(teamPokemon => teamPokemon.listId == pokemon.listId);

                saveFileCopy.pokemonTeam.splice(pokemonTeamIndex, 1);

                setPokemonTeam(saveFileCopy.pokemonTeam);

                let rareCandy: number = 0;

                if(pokemon.catch_rate <= 85) rareCandy = 10;
                else if(pokemon.catch_rate <= 170) rareCandy = 5;
                else rareCandy = 2;

                if(saveFileCopy.player)
                    saveFileCopy.player.rareCandy += rareCandy;

                player.setRareCandy(oldRareCandy => oldRareCandy + rareCandy);

                const icon: ReactElement = createElement('img', { style: { margin: 0 }, src: rareCandyIcon })
                    
                message.info({
                    icon: icon,
                    content: `You have received ${ rareCandy } rare candy!`
                })

                setMyPokemon(saveFileCopy.myPokemons);
    
                SaveGame(saveFileCopy);
            }
        }
        
        setOpenModal(false);
    }

    const PaginatePokemonList = useCallback(() => {
        
        const myPokemons: CatchedPokemon[] = []

        if(saveFile && totalPokemon)
        {
            let pokemon = offset;

            while(pokemon < limit + offset)
            {
                if(pokemon < totalPokemon)
                {
                    myPokemons.push(saveFile.myPokemons[pokemon]);
                }
                else
                    pokemon = limit + offset;

                pokemon++;
            }
        }

        if(myPokemons)
        {
            setMyPokemon(myPokemons);
        }
        
    }, [ offset, totalPokemon, saveFile, setMyPokemon ])

    useEffect(() => {
    
        // set total pages

        if(totalPokemon)
        {
            setPages(Math.ceil(totalPokemon / limit));
        }

        // set current page (depends on offset)

        setPage(( offset + limit ) / limit);

        // returns the current page's zones

        PaginatePokemonList();

    }, [ offset, totalPokemon, PaginatePokemonList ])

    useEffect(() => {
    
        if(saveFile)
        {
            setTotalPokemon(saveFile.myPokemons.length);
        }
    
    }, [ saveFile ])


    return  {
       setPokemonDetails,
       releasePokemon,
       setReleasePokemon,
       release,
       setRelease,
       openModal,
       setOpenModal,
       page,
       pages,
       limit,
       setOffset,
       onRelease,
       FirstLetterToUpper, 
    }
}

export default usePokemonList