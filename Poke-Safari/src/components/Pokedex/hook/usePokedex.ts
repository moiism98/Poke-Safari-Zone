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
            seen: true,
            catched: false,
            seen_count: 3,
            catched_count: 0,
        },
        {
            id: 10,
            name: 'caterpie',
            sprites: {
                front_default: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10.png",
                front_shiny: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/10.png"
            },
            seen: true,
            catched: true,
            seen_count: 5,
            catched_count: 3,
        },
        {
            id: 19,
            name: 'rattata',
            sprites: {
                front_default: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/19.png",
                front_shiny: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/19.png"
            },
            seen: true,
            catched: false,
            seen_count: 3,
            catched_count: 1,
        },
        {
            id: 29,
            name: 'nidoran-f',
            sprites: {
                front_default: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/29.png",
                front_shiny: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/29.png"
            },
            seen: true,
            catched: false,
            seen_count: 0,
            catched_count: 0,
        },
        {
            id: 45,
            name: 'vileplume',
            sprites: {
                "front_default": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/45.png",
                "front_shiny": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/45.png"
            },
            seen: true,
            catched: false,
            seen_count: 1,
            catched_count: 0,
        },
        {
            id: 35,
            name: 'clefairy',
            sprites:{
                "front_default": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/35.png",
                "front_shiny": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/35.png"
            },
            seen: true,
            catched: false,
            seen_count: 0,
            catched_count: 0,
        },
        {
            id: 59,
            name: 'arcanine',
            sprites:{
                "front_default": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/59.png",
                "front_shiny": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/59.png"
            },
            seen: true,
            catched: false,
            seen_count: 0,
            catched_count: 0,
        },
        {
            id: 64,
            name: 'kadabra',
            sprites:{
                "front_default": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/64.png",
                "front_shiny": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/64.png"
            },
            seen: true,
            catched: false,
            seen_count: 1,
            catched_count: 0,
        }
    ];

    return {
        myPokemons
    }
}

export default usePokedex