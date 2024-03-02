import { useQuery } from "@apollo/client";
import { useContext, useEffect, useState } from "react";
import { Context } from "src/context/AppContext";
import { APIPokemon } from "src/interfaces/interfaces";
import { GET_POKEMON } from "src/query/queries";
import { Image } from 'react-bootstrap';
import { ReloadOutlined } from '@ant-design/icons';
import Loading from "../Spinners/Loading/Loading";
import gameTitle from 'src/assets/img/Index/game-title.svg';

const IndexContainer = () => {

    // create an index custom hook for all of this

    const { randomPokemon, ReloadPokemon } = useContext(Context);

    const [ pokemon, setPokemon ] = useState<APIPokemon>();

    const { data, loading, error, refetch }  = useQuery(GET_POKEMON, { variables: { "name": randomPokemon ? randomPokemon : 'pikachu'}});
    

    useEffect( () =>
    {
        if(error)
        {
            refetch();
        }
        else if(data) 
        {
            setPokemon(data.pokemon); 
        }

    }, [ data, error, refetch ])


    return(
        <>
            <div className='container' id='indexContainer'>
                    <div>
                        <ReloadOutlined className='d-flex' onClick={() => ReloadPokemon()} aria-label='Reload pokémon'/>
                        <Image style={{width:'50%'}} src={ gameTitle }/>
                    </div>
                    {
                        error ? <Loading/> :
                        loading ? <Loading/> : 
                        <>
                            
                            <div id='randomPokemon'>

                                <h1>{pokemon?.name.toUpperCase()}</h1>

                                <Image src={pokemon?.sprites.front_default}/>

                            </div>  

                        </>
                    }
            </div>   
        </>
    )
}

export default IndexContainer