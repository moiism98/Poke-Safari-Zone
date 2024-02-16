import { useQuery } from '@apollo/client';
import { createContext, useState, useEffect, useCallback } from 'react';
import { ContextOptions, Frame, IContext, PokemonList, SaveFile } from 'src/interfaces/interfaces';
import { GET_ALL_POKEMON } from 'src/query/queries';
import useContext from './hook/useContext';

export const Context = createContext({} as IContext);

export const AppContext = ( { children }: { children: React.ReactNode } ) => {

    const { GetSaveFile } = useContext();

    const [ saveFile, setSaveFile ] = useState<SaveFile | null>(GetSaveFile());

    const [ pokemons, setPokemons ] = useState<PokemonList[]>();

    const [ appFont, setAppFont ] = useState<string>();

    const [ frame, setFrame ] = useState<Frame>();

    const options: ContextOptions = {
        appFont: appFont,
        setAppFont: setAppFont,
        frame: frame,
        setFrame: setFrame
    }

    const [ randomPokemon, setRandomPokemon ] = useState<string>();

    const { data } = useQuery( GET_ALL_POKEMON, { variables: { "limit": 386 , "offset": 0}} ) // limit = 1350 get all pokes

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

    useEffect(() =>
    {
        if(data)
        {
            setPokemons(data.pokemons.results);

            GetAllPokes()
        }

    },[ data, GetAllPokes ])

    useEffect(() => {
        
        if(appFont)
        {
            document.body.style.setProperty('font-family', appFont);

            const saveFileCopy: SaveFile | null = saveFile;

            if(saveFileCopy)
            {
                saveFileCopy.options.font = appFont;
    
                setSaveFile(saveFileCopy);
    
                localStorage.setItem('saveFile', JSON.stringify(saveFile));
            }


        }

        if(frame)
        {
            const saveFileCopy: SaveFile | null = saveFile;

            if(saveFileCopy)
            {
                saveFileCopy.options.frame = frame;
    
                setSaveFile(saveFileCopy);
    
                localStorage.setItem('saveFile', JSON.stringify(saveFile));
            }

        }

    }, [ saveFile, appFont, frame ])

    useEffect(() => {
        
        if(saveFile)
        {
            document.body.style.setProperty('font-family', saveFile.options.font);

            setAppFont(saveFile.options.font);

            setFrame(saveFile.options.frame);
        }

    }, [ saveFile ])

    return (
      <Context.Provider value={{ saveFile, setSaveFile, pokemons, setPokemons, options, randomPokemon, ReloadPokemon }}>
          {children}
      </Context.Provider>
  )
}

export default AppContext;