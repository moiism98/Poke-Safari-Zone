import { PlayerPokemon } from "src/interfaces/interfaces";

const usePokedex = () => {
    const myPokemons: PlayerPokemon[] = [
        {
            id: 1,
            name: 'bulbasaur',
            sprites: {
                front_default: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
                front_shiny: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/1.png"
            },
            seen: 0,
            caught: 0,
        },
        {
            id: 10,
            name: 'caterpie',
            sprites: {
                front_default: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10.png",
                front_shiny: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/10.png"
            },
            seen: 0,
            caught: 0
        },
        {
            id: 19,
            name: 'rattata',
            sprites: {
                front_default: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/19.png",
                front_shiny: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/19.png"
            },
            seen: 0,
            caught: 0
        },
        {
            id: 29,
            name: 'nidoran-f',
            sprites: {
                front_default: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/29.png",
                front_shiny: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/29.png"
            },
            seen: 0,
            caught: 0
        },
        {
            id: 45,
            name: 'vileplume',
            sprites: {
                "front_default": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/45.png",
                "front_shiny": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/45.png"
            },
            seen: 0,
            caught: 0
        },
        {
            id: 35,
            name: 'clefairy',
            sprites:{
                "front_default": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/35.png",
                "front_shiny": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/35.png"
            },
            seen: 0,
            caught: 0,
        },
        {
            id: 59,
            name: 'arcanine',
            sprites:{
                "front_default": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/59.png",
                "front_shiny": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/59.png"
            },
            seen: 0,
            caught: 0,
        },
        {
            id: 64,
            name: 'kadabra',
            sprites:{
                "front_default": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/64.png",
                "front_shiny": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/64.png"
            },
            seen: 0,
            caught: 0,
        }
    ];

    return {
        myPokemons
    }
}

export default usePokedex