import 'src/pages/pokédex/Pokedex.css'
import background from 'src/assets/img/Index/safari-zone-cover.svg';
import unknown from 'src/assets/img/Pokedex/pokedex-unknown.svg';
import { useContext, useEffect, useState } from 'react';
import { Button, Image } from 'react-bootstrap';
import { useQuery } from '@apollo/client';
import { PokemonList } from 'src/interfaces/interfaces';
import { GET_ALL_POKEMON } from 'src/query/queries';
import { Link } from 'react-router-dom';
import { IonIcon } from '@ionic/react';
import { arrowBackCircleSharp, arrowForwardCircleSharp } from 'ionicons/icons';
import pokedexTitle from 'src/assets/img/Pokedex/pokedex-title.svg';
import Loading from 'src/components/Spinners/Loading/Loading';
import { Context } from 'src/context/AppContext';

interface MyPokemon {

    id: number, 
    name: string, 
    sprites: {
        front_default: string, 
        front_shiny: string
    }, 
    seen: boolean, 
    catched: boolean 

}

const Pokedex = () =>{

    const myPokemons: MyPokemon[] = [
        {
            id: 1,
            name: 'bulbasaur',
            sprites: {
                front_default: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
                front_shiny: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/1.png"
            },
            seen: true,
            catched: false
        },
        {
            id: 10,
            name: 'caterpie',
            sprites: {
                front_default: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10.png",
                front_shiny: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/10.png"
            },
            seen: true,
            catched: true
        },
        {
            id: 19,
            name: 'rattata',
            sprites: {
                front_default: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/19.png",
                front_shiny: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/19.png"
            },
            seen: true,
            catched: false
        },
        {
            id: 29,
            name: 'nidoran-f',
            sprites: {
                front_default: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/29.png",
                front_shiny: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/29.png"
            },
            seen: true,
            catched: false
        },
        {
            id: 45,
            name: 'vileplume',
            sprites: {
                "front_default": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/45.png",
                "front_shiny": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/45.png"
            },
            seen: true,
            catched: false
        },
        {
            id: 35,
            name: 'clefairy',
            sprites:{
                "front_default": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/35.png",
                "front_shiny": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/35.png"
            },
            seen: true,
            catched: false
        },
        {
            id: 59,
            name: 'arcanine',
            sprites:{
                "front_default": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/59.png",
                "front_shiny": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/59.png"
            },
            seen: true,
            catched: false
        },
        {
            id: 64,
            name: 'kadabra',
            sprites:{
                "front_default": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/64.png",
                "front_shiny": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/64.png"
            },
            seen: true,
            catched: false
        }
    ];

    const PokedexIcon = (myPokemons: MyPokemon[], pokemonId: number) => {

        let icon = '';
        
        const myPokemon: MyPokemon | undefined = myPokemons.find(pkmn => pkmn.id == pokemonId);
        
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

    const limit = 32;

    const { frame } = useContext(Context)

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
        
        <div id="gameScreen" style={{ backgroundImage: `url(${background})`, border: frame.styles?.border, borderRadius: frame.styles?.borderRadius}}>
            <div className='pokedexTitle'><Image src={ pokedexTitle }/></div>
            <div className='container' id='pokedex'>
            {
                loading ? <Loading/> :
                
                pokedex?.map(pokemon => (<Link to={`/pokedex/${pokemon.id}`}><Image key={pokemon.id} title={pokemon.name} src={ PokedexIcon(myPokemons, pokemon.id) }/></Link>))
            }
            </div>
            <div className='pagination'>
                <Button onClick={() => setOffset(offset => offset -= limit)} variant='link'>
                    <IonIcon color='dark' size='large' title='Previous page' icon={ arrowBackCircleSharp }/>
                </Button>
                <Button onClick={() => setOffset(offset => offset += limit)} variant='link'>
                    <IonIcon color='dark' size='large' title='Next page' icon={ arrowForwardCircleSharp }/>
                </Button>
            </div>
        </div>   
    )
}

export default Pokedex;