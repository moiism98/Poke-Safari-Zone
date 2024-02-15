import 'src/pages/index/Index.css'
import { useContext, useEffect, useState } from 'react';
import { Context } from 'src/context/AppContext';
import { useQuery } from '@apollo/client';
import { Pokemon } from 'src/interfaces/interfaces';
import { GET_POKEMON } from 'src/query/queries';
import { useNavigate } from 'react-router-dom';
import { Image } from 'react-bootstrap';
import { ReloadOutlined  } from '@ant-design/icons';
import { Button } from 'antd';
import Loading from 'src/components/Spinners/Loading/Loading';
import background from 'src/assets/img/Index/safari-zone-cover.svg';
import gameTitle from 'src/assets/img/Index/game-title.svg';
import NewPlayer from 'src/components/NewPlayer/NewGame';

const Index = () =>
{
    // create an index custom hook for all of this

    const navigate = useNavigate();

    const { randomPokemon, ReloadPokemon, options, saveFile } = useContext(Context);

    const [ pokemon, setPokemon ] = useState<Pokemon>();

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

    return (
        saveFile != null ?
        <div id='gameScreen' style={{ backgroundImage: `url(${background})`, border: options.frame?.styles.border, borderRadius: options.frame?.styles.borderRadius }}>
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
            <div><Button style={{fontFamily: options.appFont}} className='play' onClick={ () => { navigate("/pokedex") }}>PLAY</Button></div>
        </div> 
        :
        <NewPlayer/>
    )
};

export default Index;