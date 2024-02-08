import { useQuery } from '@apollo/client';
import { GET_ALL_POKEMON } from 'src/query/queries';
import { useCallback, useEffect, useState } from 'react';
import { PokemonList } from 'src/interfaces/interfaces';

const GetAllPokes = () =>
{   
    const [ pokemons, setPokemons ] = useState<PokemonList[]>();
    
    const { data } = useQuery( GET_ALL_POKEMON, { variables: { "limit": 386 , "offset": 0}} ) // limit = 1350 get all pokes
    
    const [randomPokemon, setRandomPokemon] = useState<string>();

    const GetAllPokes = useCallback(() =>
    {
        if(pokemons)
        {
            const pokemon: number = Math.floor(Math.random() * pokemons.length);
            
            const randomPokemonName: string = pokemons[pokemon].name;

            setRandomPokemon(randomPokemonName);
        }
        
    },[ pokemons ])

    useEffect(() =>
    {
        if(data) setPokemons(data.pokemons.results)

        GetAllPokes();

    },[ data, GetAllPokes ])

    

    return {
        randomPokemon
    }
}

export default GetAllPokes;
