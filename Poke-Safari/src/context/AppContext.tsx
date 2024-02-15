import { useQuery } from '@apollo/client';
import { createContext, useState, useEffect, useCallback } from 'react';
import { IContext, PokemonList, SaveFile } from 'src/interfaces/interfaces';
import { GET_ALL_POKEMON } from 'src/query/queries';
import useContextUtils from './hook/useContextUtils';

export const Context = createContext({} as IContext);

export const AppContext = ( { children }: { children: React.ReactNode } ) => {

    const { options, GetSaveFile } = useContextUtils();

    const [ saveFile, setSaveFile ] = useState<SaveFile | null>(GetSaveFile());

    const [ pokemons, setPokemons ] = useState<PokemonList[]>();

    const [ randomPokemon, setRandomPokemon ] = useState<string>();

    const { data, refetch } = useQuery( GET_ALL_POKEMON, { variables: { "limit": 386 , "offset": 0}} ) // limit = 1350 get all pokes

    const GetAllPokes = useCallback(() =>
    {
        if(pokemons)
        {
            const pokemon: number = Math.floor(Math.random() * pokemons.length);
            
            const randomPokemonName: string = pokemons[pokemon].name;

            setRandomPokemon(randomPokemonName);
        }
        
    },[ pokemons ])

    const ReloadPokemon = () => {
      
        GetAllPokes();
    }

    const Pokedex = (offset: number) => {
        refetch({"limit": '30', "offset": offset});
    }

    useEffect(() =>
    {
        if(data)
        {
            setPokemons(data.pokemons.results);

            GetAllPokes()
        }

    },[ data, GetAllPokes ])

    useEffect(() => {
        
        if(options.appFont)
        {
            document.body.style.setProperty('font-family', options.appFont);

            const saveFileCopy: SaveFile | null = saveFile;

            if(saveFileCopy)
            {
                saveFileCopy.options.font = options.appFont;
    
                setSaveFile(saveFileCopy);
    
                localStorage.setItem('saveFile', JSON.stringify(saveFile));
            }


        }

        if(options.frame)
        {
            const saveFileCopy: SaveFile | null = saveFile;

            if(saveFileCopy)
            {
                saveFileCopy.options.frame = options.frame;
    
                setSaveFile(saveFileCopy);
    
                localStorage.setItem('saveFile', JSON.stringify(saveFile));
            }

        }

    }, [ saveFile, options.appFont, options.frame ])

    useEffect(() => {
        
        if(saveFile)
        {
            document.body.style.setProperty('font-family', saveFile.options.font);

            options.setAppFont(saveFile.options.font);

            options.setFrame(saveFile.options.frame);
        }

    }, [ saveFile, options ])

    return (
      <Context.Provider value={{ saveFile, setSaveFile, pokemons, setPokemons, options, randomPokemon, ReloadPokemon, Pokedex }}>
          {children}
      </Context.Provider>
  )
}

export default AppContext;