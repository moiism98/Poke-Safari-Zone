export interface IContext{
    pokemons: PokemonList[] | undefined, 
    setPokemons: React.Dispatch<React.SetStateAction<PokemonList[] | undefined>>,
    appFont: string,
    setAppFont: React.Dispatch<React.SetStateAction<string>>,
    frame: Frame,
    setFrame: React.Dispatch<React.SetStateAction<Frame>>,
    frame_styles: Frame[]
    randomPokemon: string | undefined,
    ReloadPokemon: () => void | undefined
    Pokedex: (offset: number) => void | undefined
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