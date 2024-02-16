export interface IContext{
    saveFile: SaveFile | null
    setSaveFile: React.Dispatch<React.SetStateAction<SaveFile | null>>
    pokemons: PokemonList[] | undefined, 
    setPokemons: React.Dispatch<React.SetStateAction<PokemonList[] | undefined>>,
    options: ContextOptions,
    randomPokemon: string | undefined,
    ReloadPokemon: () => void | undefined
}

export interface ContextOptions {
    appFont: string | undefined,
    setAppFont: React.Dispatch<React.SetStateAction<string | undefined>>,
    frame: Frame | undefined,
    setFrame: React.Dispatch<React.SetStateAction<Frame | undefined>>
}

export interface SaveFile{

    seenPokemons: SeenPokemon[],
    myPokemons: Pokemon[],
    safariZones: SafariZone[],
    options: Options,
    bag: Bag[],
    player: Player | null
}

interface SeenPokemon {

    name: string
}

interface SafariZone {

    id: number
    name: string
    portrait: string
    pokemon: [
        {
            name: string
            icon: string
        }
    ]
    reward: [
        {
            id: number
            name: string
            icon: string
            cuantity: number 
        }
    ]
    unlock: {

        id: number
        unlock: string
        unlocked: boolean

    } | null
}

interface Options {

    font: string
    frame: Frame
    icon: icon | null
}

export interface icon {

    id: number;
    name: string;
    icon: string;
}

interface Bag {

    item: {

        id: number
        name: string
        cuantity: number
        icon: string
    }
}

export interface Player {

    name: string
    level: number
    experience: number
}

export interface PokemonList
{
    id: number,
    name: string
}

export interface Pokemon 
{
    id: number,
    name: string,
    height: number,
    weight: number,
    sprites: Sprites,
    moves: Moves[],
    types: Types[]
    abilities: Abilities[],
    held_items: Held_Items[]
}

export interface MyPokemon {

    id: number, 
    name: string, 
    sprites: {
        front_default: string, 
        front_shiny: string
    }, 
    seen: boolean, 
    catched: boolean 

}

interface Sprites
{
    front_default: string,
    front_shiny: string
}

export interface Moves
{
    move: {
        name: string
    }
}

interface Types
{
    type: {
        name: string
    }
}

interface Abilities
{
    ability: {
        name: string
    }
}

interface Held_Items
{
    held_item: {
        name: string
    }
}

export interface Frame{
    name: string,
    styles: {
        border: string,
        borderRadius?: string
    }
}