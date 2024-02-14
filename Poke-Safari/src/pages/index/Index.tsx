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
import NewPlayer from 'src/components/NewPlayer/NewPlayer';

const Index = () =>
{
    // create an index custom hook for all of this

    const navigate = useNavigate();

    const { randomPokemon, ReloadPokemon, options, saveFile } = useContext(Context);

    const [ pokemon, setPokemon ] = useState<Pokemon>();

    const { data, loading, error }  = useQuery(GET_POKEMON, { variables: { "name": randomPokemon ? randomPokemon : 'pikachu'}});
    

    useEffect( () =>
    {
        if(data) 
            setPokemon(data.pokemon); 

    }, [ data ])

    return (
        saveFile.player != null ?
        <div id='gameScreen' style={{ backgroundImage: `url(${background})`, border: options.frame?.styles.border, borderRadius: options.frame?.styles.borderRadius }}>
            <div className='container' id='indexContainer'>
                <div>
                    <Button onClick={() => ReloadPokemon()} className='d-flex' type='link'><ReloadOutlined aria-label='Reload pokémon'/></Button>
                    <Image style={{width:'50%'}} src={ gameTitle }/>
                </div>
                {
                    error ? <h1 style={{color: 'red'}}>{error.message}</h1> :
                    loading ? <Loading/> : 
                    <>
                        
                        <div id='randomPokemon'>

                            <h1>{pokemon?.name.toUpperCase()}</h1>

                            <Image src={pokemon?.sprites.front_default}/>

                        </div>  

                    </>
                }
            </div>   
            <div><Button className='play' onClick={ () => { navigate("/pokedex") }}>PLAY</Button></div>
        </div> 
        : 
        <NewPlayer/>
    )
};

export default Index;