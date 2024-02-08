import 'src/components/styles/GameScreen.css'
import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { Pokemon } from 'src/interfaces/interfaces';
import { GET_POKEMON } from 'src/query/queries';
import Loading from 'src/components/Spinners/Loading/Loading';
import { Image } from 'react-bootstrap';
import getAllPokes from 'src/utils/getAllPokes';
import background from 'src/assets/img/Zones/forest.svg'

const Index = () =>
{
    const { randomPokemon } = getAllPokes();

    const [pokemon, setPokemon] = useState<Pokemon>();

    const { data, loading, error }  = useQuery(GET_POKEMON, { variables: { "name": randomPokemon ? randomPokemon : 'pikachu'}});
    
    useEffect( () =>
    {
        if(data) setPokemon(data.pokemon)
        
    }, [data])

    return (
        <div className='index' id='gameScreen' style={{ backgroundImage: `url(${background})` }}>
            {
                error ? <h1 style={{color: 'red'}}>{error.message}</h1> :
                loading ? <Loading/> :    
                <div className='randomPokemon'>
                    <h1>{pokemon?.name.toUpperCase()}</h1>
                    <Image src={pokemon?.sprites.front_default}/>
                </div>
            }
        </div>
    )
};

export default Index;