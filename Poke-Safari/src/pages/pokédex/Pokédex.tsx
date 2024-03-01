import 'src/pages/pokédex/Pokedex.css';
import unknown from 'src/assets/img/Pokedex/pokedex-unknown.svg';
import pokedexTitle from 'src/assets/img/Pokedex/pokedex-title.svg';
import Loading from 'src/components/Spinners/Loading/Loading';
import GameScreen from 'src/components/GameScreen/GameScreen';
import { useContext, useEffect, useState } from 'react';
import { Image } from 'react-bootstrap';
import { useQuery } from '@apollo/client';
import { GET_ALL_POKEMON } from 'src/query/queries';
//import { Link } from 'react-router-dom';
import { APIPokemon, SeenPokemon } from 'src/interfaces/interfaces';
import { Context } from 'src/context/AppContext';
import { Pagination } from 'antd';
import useApp from 'src/components/App/hook/useApp';


const limit = 32;

const Pokedex = () =>{

    const PokedexIcon = (pokemonId: number) => {

        const seen: SeenPokemon | undefined = saveFile?.seenPokemons.find(pokemon => pokemon.id == pokemonId)

        return seen ? seen.sprite : unknown;
    }

    const { totalPokemon, saveFile } = useContext(Context);

    const { FirstLetterToUpper } = useApp()

    const [ offset, setOffset ] = useState<number>(0);

    const [ page, setPage ] = useState<number>();

    const [ pages, setPages ] = useState<number>();

    const [ pokedex, setPokedex ] = useState<APIPokemon[]>()

    const { data, loading } = useQuery( GET_ALL_POKEMON, { variables: { "limit": limit, "offset": offset}} )

    useEffect(() => {
        
        if(data)
        {
            setPokedex(data.pokemons.results);
        }

    }, [ data ])

    useEffect(() => {
        
        if(pokedex)
        {
            setPages(Math.round(totalPokemon / limit))

            setPage((offset + limit) / limit)
        }
    
    }, [ pokedex, offset, totalPokemon ])

    return(
        
        <GameScreen>
            <div className='pokedexTitle'><Image src={ pokedexTitle }/></div>
            
            <div className='container' id='pokedex'>
            {
                loading ? <Loading/> :
                
                pokedex?.map(pokemon => (

                        // we only show the pokemon until the limit, possibly we have more pokemon saved than the limit is, but whe only want to show until the limit.

                        //pokemon.id <= totalPokemon ? <Link key={pokemon.id} to={`/pokedex/${pokemon.id}`}><Image title={pokemon.name} src={ PokedexIcon(pokemon.id) }/></Link> : null
                        pokemon.id <= totalPokemon ? <Image key={ pokemon.id } title={ FirstLetterToUpper(pokemon.name) } src={ PokedexIcon(pokemon.id) }/> : null

                    ))
            }
            </div>
            <Pagination 
                current={ page } 
                total={ pages ? pages * 10 : 50 } 
                onChange={(page) => setOffset(page != 1 ? (page * limit) - limit : 0)} 
                style={{margin: '1em'}}
                showSizeChanger={false}
            />
        </GameScreen>   
    )
}

export default Pokedex;