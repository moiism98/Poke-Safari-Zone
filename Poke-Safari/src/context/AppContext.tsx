import useContext from './hook/useContext';
import zonePortraits from 'src/utils/NewPlayer/portraits';
import { useQuery } from '@apollo/client';
import { createContext, useState, useEffect, useCallback } from 'react';
import { CatchedPokemon, ContextOptions, ContextPlayer, Frame, IContext, Item, PokemonList, Portraits, SaveFile } from 'src/interfaces/interfaces';
import { GET_ALL_POKEMON } from 'src/query/queries';
import { notification } from 'antd';
import { Image } from 'react-bootstrap';

export const Context = createContext({} as IContext);

export const AppContext = ( { children }: { children: React.ReactNode } ) => {

    const { GetSaveFile } = useContext();

    const { portraits } = zonePortraits();

    const [ saveFile, setSaveFile ] = useState<SaveFile | null>(GetSaveFile());

    const [ totalPokemon ] = useState(386);

    const [ allPokemons, setAllPokemons ] = useState<PokemonList[]>();

    const [ pokemonDetails, setPokemonDetails ] = useState<CatchedPokemon>();

    const GetPokemonTeam = () => {

        let save: CatchedPokemon[] = [];

        if(saveFile)
        {
            save = saveFile.pokemonTeam;
        }

        return save;
    }

    const [ pokemonTeam, setPokemonTeam ] = useState<CatchedPokemon[]>(GetPokemonTeam());

    const GetBag = () => {
        
        let bag: Item[] = []

        if(saveFile)
        {
            bag = saveFile.bag;
        }

        return bag;

    }

    const [ bag, setBag ] = useState<Item[]>(GetBag());
    
    const [ eggs, setEggs ] = useState<number>(0);

    const [ appFont, setAppFont ] = useState<string>();

    const [ frame, setFrame ] = useState<Frame>();

    const [ level, setLevel ] = useState<number>(0);

    const [ experience, setExperience ] = useState<number>(0);

    const [ nextLevelExperience, setNextLevelExperience ] = useState<number>(0);

    const [ money, setMoney ] = useState<number>(0);

    const [ rareCandy, setRareCandy ] = useState<number>(0);


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
        setNextLevelExperience: setNextLevelExperience,
        money: money,
        setMoney: setMoney,
        rareCandy: rareCandy,
        setRareCandy: setRareCandy
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

    const onPokemonUnlocked = async(id: number, pokemon: string, zone: string, duration?: number) => {
        
        let sprite: string = '';

        await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
        .then(response => response.ok ? response.json() : console.warn("No data received!"))
        .then(data => sprite = data.sprites.front_default);

        notification.open({
            message: <h5 className='unlockMessage'><strong>{ pokemon.substring(0, 1).toUpperCase() + pokemon.substring(1, pokemon.length) }</strong> has been unlocked!</h5>,
            description: 
            <div className='unlockNotification'>
                <Image className='unlockIcon' src={ sprite }/>
                <h5 className='unlockDescription'>Now { pokemon } will appear on { zone }!</h5>
            </div>,
            duration: duration ? duration : 3,
            closeIcon: false,
            placement: 'topRight'
        })
    }

    const onZoneUnlocked = (zone: string) => {
        
        const zonePortait: Portraits | undefined = portraits.find(portrait => portrait.name == zone);

        if(zonePortait)
        {
            notification.open({
                message: <h5 className='unlockMessage'><strong>{ zone.substring(0, 1).toUpperCase() + zone.substring(1, zone.length) }</strong> has been unlocked!</h5>,
                description: <div className='unlockNotification'><Image width={300} height={150} src={ zonePortait.src }/></div>,
                duration: 3,
                closeIcon: false,
                placement: 'topRight'
            })
        }
    }

    const onLevelUnlocked = async(itemId: number, unlock: string) => {
        
        let icon: string = '';

        await fetch(`https://pokeapi.co/api/v2/item/${itemId}`)
        .then(response => response.ok ? response.json() : console.warn("No data received!"))
        .then(data => icon = data.sprites.default);

        notification.open({
            message: <h5 className='unlockMessage'><Image style={{ margin: 0 }} src={ icon }/> { unlock } have been unlocked!</h5>,
            duration: 3,
            closeIcon: false,
            placement: 'topRight'
        })
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

        if(pokemonTeam)
        {
            const saveFileCopy: SaveFile | null = saveFile;

            if(saveFile && saveFileCopy)
            {
                saveFileCopy.pokemonTeam = pokemonTeam;

                SaveGame(saveFileCopy)
            }
        }

    }, [ saveFile, appFont, frame, level, pokemonTeam, SaveGame ])

    useEffect(() => {
        
        if(saveFile)
        {
            document.body.style.setProperty('font-family', saveFile.options.font);

            setAppFont(saveFile.options.font);

            setFrame(saveFile.options.frame);
            
            setBag(saveFile.bag);

            setPokemonTeam(saveFile.pokemonTeam);

            const egg: Item | undefined = saveFile.bag.find(item => item.name == 'mystery-egg');

            if(egg && egg.cuantity)
            {
                setEggs(egg.cuantity);
            }

            if(saveFile.player)
            {
                setLevel(saveFile.player.level);

                setMoney(saveFile.player.money);

                setRareCandy(saveFile.player.rareCandy);

                setExperience(saveFile.player.experience);

                setNextLevelExperience(saveFile.player.nextLevelExperience);

                setPokemonDetails(saveFile.player.pokemonDetails);
            }
        }

    }, [ saveFile ])

    return (
      <Context.Provider value={{ saveFile, player, options, bag, setBag, eggs, setEggs, setSaveFile, totalPokemon, allPokemons, pokemonTeam, setPokemonTeam, pokemonDetails, setPokemonDetails, setAllPokemons, randomPokemon, onPokemonUnlocked, onZoneUnlocked, onLevelUnlocked, SaveGame, ReloadPokemon }}>
          {children}
      </Context.Provider>
  )
}

export default AppContext;