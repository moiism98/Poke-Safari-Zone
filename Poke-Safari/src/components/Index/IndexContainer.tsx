import { useQuery } from "@apollo/client";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "src/context/AppContext";
import { APIPokemon } from "src/interfaces/interfaces";
import { GET_POKEMON } from "src/query/queries";
import { Image } from 'react-bootstrap';
import { ReloadOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import Loading from "../Spinners/Loading/Loading";
import gameTitle from 'src/assets/img/Index/game-title.svg';

const IndexContainer = () => {

    // create an index custom hook for all of this

    const navigate = useNavigate();

    const { randomPokemon, ReloadPokemon, saveFile } = useContext(Context);

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
            <div><Button style={{fontFamily: saveFile?.options.font}} className='play' onClick={ () => { navigate("/pokedex") }}>PLAY</Button></div>    
        </>
    )
}

export default IndexContainer