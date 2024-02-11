import { useQuery } from '@apollo/client';
import { createContext, useState, useEffect, useCallback } from 'react';
import { IContext, PokemonList } from 'src/interfaces/interfaces';
import { GET_ALL_POKEMON } from 'src/query/queries';

export const Context = createContext({} as IContext);

export const AppContext = ( { children }: { children: React.ReactNode } ) => {

    const [ pokemons, setPokemons ] = useState<PokemonList[]>();

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

    return (
      <Context.Provider value={{ pokemons, setPokemons, randomPokemon, ReloadPokemon }}>
          {children}
      </Context.Provider>
  )
}

export default AppContext;