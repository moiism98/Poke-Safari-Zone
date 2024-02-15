import 'src/pages/pokédex/Pokedex.css'
import background from 'src/assets/img/Index/safari-zone-cover.svg';
import unknown from 'src/assets/img/Pokedex/pokedex-unknown.svg';
import pokedexTitle from 'src/assets/img/Pokedex/pokedex-title.svg';
import Loading from 'src/components/Spinners/Loading/Loading';
import { useContext, useEffect, useState } from 'react';
import { Image } from 'react-bootstrap';
import { useQuery } from '@apollo/client';
import { GET_ALL_POKEMON } from 'src/query/queries';
import { Link } from 'react-router-dom';
import { Context } from 'src/context/AppContext';
import { MyPokemon, PokemonList } from 'src/interfaces/interfaces';
import { LeftCircleFilled, RightCircleFilled } from '@ant-design/icons';



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

    const totalPokemon: number = 386; // 386 deaoxys id, the limit is 3rd gen.

    const { options } = useContext(Context)

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
        
        <div id="gameScreen" style={{ backgroundImage: `url(${background})`, border: options.frame?.styles?.border, borderRadius: options.frame?.styles?.borderRadius}}>
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
        </div>   
    )
}

export default Pokedex;