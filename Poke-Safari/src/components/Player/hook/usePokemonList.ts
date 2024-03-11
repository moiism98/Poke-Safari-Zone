import useApp from "src/components/App/hook/useApp";
import { useCallback, useContext, useEffect, useState} from "react";
import { Context } from "src/context/AppContext";
import { CatchedPokemon } from "src/interfaces/interfaces";

const usePokemonList = () => {

    const { saveFile, pokemonTeam, setPokemonTeam , setPokemonDetails, SaveGame } = useContext(Context);

    const { FirstLetterToUpper } = useApp();

    const [ releasePokemon, setReleasePokemon ] = useState<CatchedPokemon>();

    const [ release, setRelease ] = useState<boolean>(false);

    const [ openModal, setOpenModal ] = useState<boolean>(false);

    const [ page, setPage ] = useState<number>();

    const [ pages, setPages ] = useState<number>();

    const [ offset, setOffset ] = useState<number>(0);

    const [ pokemon, setPokemon ] = useState<CatchedPokemon[]>();

    const [ totalPokemon, setTotalPokemon ] = useState<number>(0);

    const limit = 28;

    const onRelease = (releasePokemon: CatchedPokemon | undefined) => {

        const saveFileCopy = saveFile;
        
        if(saveFileCopy)
        {
            const teamPokemon = pokemonTeam.find(pokemon => pokemon.listId == releasePokemon?.listId);

            if(teamPokemon) // if we found the released pokemon on the team, we remove this pokemon from the team!
            {
                // remake the pokemon team discarding the ALL released pokemon! (inside myPokemon discard the pokemon already realeased and the current one released)

               saveFileCopy.pokemonTeam = saveFileCopy?.myPokemons.filter(pokemon => pokemon.listId != teamPokemon.listId && !pokemon.released); 

               setPokemonTeam(saveFileCopy.pokemonTeam);
            }

            const pokemon = saveFileCopy.myPokemons.find(pokemon => pokemon == releasePokemon)

            if(pokemon)
            {
                pokemon.released = true;
    
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
                    myPokemons.push(saveFile.myPokemons[pokemon]);
                else
                    pokemon = limit + offset;

                pokemon++;
            }
        }

        if(myPokemons)
        {
            setPokemon(myPokemons);
        }
        
    }, [ offset, totalPokemon, saveFile ])

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
       pokemon,
       onRelease,
       FirstLetterToUpper, 
    }
}

export default usePokemonList