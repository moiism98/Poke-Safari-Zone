import { useQuery } from '@apollo/client';
import { createContext, useState, useEffect, useCallback } from 'react';
import { ContextOptions, ContextPlayer, Frame, IContext, PokemonList, SaveFile } from 'src/interfaces/interfaces';
import { GET_ALL_POKEMON } from 'src/query/queries';
import useContext from './hook/useContext';

export const Context = createContext({} as IContext);

export const AppContext = ( { children }: { children: React.ReactNode } ) => {

    const { GetSaveFile } = useContext();

    const [ saveFile, setSaveFile ] = useState<SaveFile | null>(GetSaveFile());

    const [ totalPokemon ] = useState(386);

    const [ allPokemons, setAllPokemons ] = useState<PokemonList[]>();

    const [ appFont, setAppFont ] = useState<string>();

    const [ frame, setFrame ] = useState<Frame>();

    const [ level, setLevel ] = useState<number>(0);

    const [ experience, setExperience ] = useState<number>(0)

    const [ nextLevelExperience, setNextLevelExperience ] = useState<number>(0)


    const options: ContextOptions = {
        appFont: appFont,
        setAppFont: setAppFont,
        frame: frame,
        setFrame: setFrame
    }

    const player: ContextPlayer = {
        level: level,
        setLevel: setLevel,
        experience: experience,
        setExperience: setExperience,
        nextLevelExperience: nextLevelExperience,
        setNextLevelExperience: setNextLevelExperience
    }

    const [ randomPokemon, setRandomPokemon ] = useState<string>();

    const { data } = useQuery( GET_ALL_POKEMON, { variables: { "limit": totalPokemon , "offset": 0}} ) // limit = 1350 get all pokes

    const GetAllPokes = useCallback(() =>
    {
        if(allPokemons)
        {
            const pokemon: number = Math.floor(Math.random() * allPokemons.length);
            
            const randomPokemonName: string = allPokemons[pokemon].name;

            setRandomPokemon(randomPokemonName);
        }
        
    },[ allPokemons ])

    const ReloadPokemon = () => {
      
        GetAllPokes();
    }

    const SaveGame = useCallback((saveFileCopy: SaveFile) => {

        setSaveFile(saveFileCopy)

        localStorage.setItem('saveFile', JSON.stringify(saveFile))

    }, [ saveFile ])

    useEffect(() =>
    {
        if(data)
        {
            setAllPokemons(data.pokemons.results);

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
    
                SaveGame(saveFileCopy)
            }
        }

        if(frame)
        {
            const saveFileCopy: SaveFile | null = saveFile;

            if(saveFile && saveFileCopy)
            {
                saveFileCopy.options.frame = frame;

                SaveGame(saveFileCopy)
            }

        }

        if(level)
        {
           //console.log(`Rise to level ${ level }`)
        }

    }, [ saveFile, appFont, frame, level, SaveGame ])

    useEffect(() => {
        
        if(saveFile)
        {
            document.body.style.setProperty('font-family', saveFile.options.font);

            setAppFont(saveFile.options.font);

            setFrame(saveFile.options.frame);

            if(saveFile.player)
            {
                setLevel(saveFile.player.level)

                setExperience(saveFile.player.experience)

                setNextLevelExperience(saveFile.player.nextLevelExperience)
            }
        }

    }, [ saveFile ])

    return (
      <Context.Provider value={{ saveFile, player, options, setSaveFile, totalPokemon, allPokemons, setAllPokemons, randomPokemon, SaveGame, ReloadPokemon }}>
          {children}
      </Context.Provider>
  )
}

export default AppContext;