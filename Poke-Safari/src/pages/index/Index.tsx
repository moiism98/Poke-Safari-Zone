import 'src/components/styles/GameScreen.css'
import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { Pokemon } from 'src/interfaces/interfaces';
import { GET_POKEMON } from 'src/query/queries';
import { useNavigate } from 'react-router-dom';
import { Button, Image } from 'react-bootstrap';
import { IonIcon } from '@ionic/react';
import { reloadOutline } from 'ionicons/icons';
import Loading from 'src/components/Spinners/Loading/Loading';
import getAllPokes from 'src/utils/getAllPokes';
import background from 'src/assets/img/Zones/forest.svg';
import pokeTypes from 'src/utils/pokeTypes';

const Index = () =>
{
    const navigate = useNavigate();

    const { randomPokemon, ReloadPokemon } = getAllPokes();

    const [pokemon, setPokemon] = useState<Pokemon>();

    const { data, loading, error }  = useQuery(GET_POKEMON, { variables: { "name": randomPokemon ? randomPokemon : 'pikachu'}});
    
    useEffect( () =>
    {
        if(data) 
        {
            setPokemon(data.pokemon); 
            
            // console.log(pokemon);
        }

    }, [data, randomPokemon, pokemon])

    const PickTypeIcon = (pokeType: string) => {
        
        return pokeTypes.find(type => type.includes(pokeType))
    }

    return (
        <div className='index' id='gameScreen' style={{ backgroundImage: `url(${background})` }}>
            <div className='container' id='indexContainer'>
                {
                    error ? <h1 style={{color: 'red'}}>{error.message}</h1> :
                    loading ? <Loading/> : 
                    <>
                        <div><Button onClick={() => ReloadPokemon()} className='d-flex' variant='link'><IonIcon color='dark' size='large' icon={reloadOutline} aria-label="Reload random pokémon"/></Button></div>
                        
                        <div id='randomPokemon'>

                            <h1>{pokemon?.name.toUpperCase()}</h1>
                            <Image src={pokemon?.sprites.front_default}/>
                            <h4>Abilities: {pokemon?.abilities.map(pkmAbility => pkmAbility.ability.name).join(', ')}</h4>
                            <div style={{display: 'flex', justifyContent:'center', alignItems:'center'}}>
                                <h4>Type(s)</h4>
                                {
                                    pokemon?.types.map(pkmType => (<Image key={pkmType.type.name} style={{width: '1.25em', height: '1.25em'}} title={ pkmType.type.name } src={ PickTypeIcon(pkmType.type.name) }/>))
                                }
                            </div>
                        </div>  

                        <div><Button className='play' variant='light' onClick={ () => { navigate("/pokedex") }}>PLAY</Button></div>
                    </>
                }
            </div>   
        </div>
    )
};

export default Index;