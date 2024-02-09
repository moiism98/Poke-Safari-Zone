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

interface Moves
{
    move: string
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
    held_item: string
}