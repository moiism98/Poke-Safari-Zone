import 'src/pages/pokédex/Pokedex.css';
import unknown from 'src/assets/img/Pokedex/pokedex-unknown.svg';
import pokedexTitle from 'src/assets/img/Pokedex/pokedex-title.svg';
import Loading from 'src/components/Spinners/Loading/Loading';
import GameScreen from 'src/components/GameScreen/GameScreen';
import { useContext, useEffect, useState } from 'react';
import { Image } from 'react-bootstrap';
import { useQuery } from '@apollo/client';
import { GET_ALL_POKEMON } from 'src/query/queries';
import { Link } from 'react-router-dom';
import { PlayerPokemon, PokemonList } from 'src/interfaces/interfaces';
import { LeftCircleFilled, RightCircleFilled } from '@ant-design/icons';
import { Context } from 'src/context/AppContext';
import usePokedex from 'src/components/Pokedex/hook/usePokedex';


const limit = 32;

const Pokedex = () =>{

    const { myPokemons } = usePokedex();

    const PokedexIcon = (myPokemons: PlayerPokemon[], pokemonId: number) => {

        let icon = '';
        
        const myPokemon: PlayerPokemon | undefined = myPokemons.find(pkmn => pkmn.id == pokemonId);
        
        if(myPokemon)
        {
            if(myPokemon.seen)
            {
                if(myPokemon.catched)
                {
                    // add a pokeball icon on bottom right corner
                }
                
                icon = myPokemon.sprites.front_default;
            }
        }
        else
            icon = unknown;

        return icon;
    }

    const { totalPokemon } = useContext(Context)

    const [ offset, setOffset ] = useState<number>(0)

    const [ pokedex, setPokedex ] = useState<PokemonList[]>()

    const { data, loading } = useQuery( GET_ALL_POKEMON, { variables: { "limit": limit, "offset": offset}} )

    useEffect(() => {
        
        if(data)
        {
            setPokedex(data.pokemons.results);
        }

    }, [ data ])

    return(
        
        <GameScreen>
            <div className='pokedexTitle'><Image src={ pokedexTitle }/></div>
            <div className='container' id='pokedex'>
            {
                loading ? <Loading/> :
                
                pokedex?.map(pokemon => (

                        // we only show the pokemon until the limit, possibly we have more pokemon saved than the limit is, but whe only want to show until the limit.

                        pokemon.id <= totalPokemon ? <Link key={pokemon.id} to={`/pokedex/${pokemon.id}`}><Image title={pokemon.name} src={ PokedexIcon(myPokemons, pokemon.id) }/></Link> : null
                    
                    ))
            }
            </div>
            <div className='pagination'>
                { 
                    // on first pokedex's page this button its not visible. 0 not greater or higher than 32

                    offset >= limit ? <LeftCircleFilled onClick={() => setOffset(offset => offset -= limit)}/> : null     
                }
                { 
                    // on the last pokedex's page 'next page button' is not visible. 354 + 32 <= 386? visible; 386 + 32 <= 386? not visible

                    offset + limit <= totalPokemon ? <RightCircleFilled onClick={() => setOffset(offset => offset += limit)}/> : null 
                }
            </div>
        </GameScreen>   
    )
}

export default Pokedex;