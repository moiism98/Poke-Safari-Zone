export type CatchedPokemon = APIPokemon & PlayerPokemon
export type WildPokemon = APIPokemon & PlayerPokemon & ZonePokemon

export interface IContext {
    saveFile: SaveFile | null
    setSaveFile: React.Dispatch<React.SetStateAction<SaveFile | null>>
    player: ContextPlayer,
    options: ContextOptions,
    totalPokemon: number,
    allPokemons: PokemonList[] | undefined, 
    setAllPokemons: React.Dispatch<React.SetStateAction<PokemonList[] | undefined>>,
    randomPokemon: string | undefined,
    ReloadPokemon: () => void | undefined
}

export interface ContextOptions {
    appFont: string | undefined,
    setAppFont: React.Dispatch<React.SetStateAction<string | undefined>>,
    frame: Frame | undefined,
    setFrame: React.Dispatch<React.SetStateAction<Frame | undefined>>
}

export interface ContextPlayer {

    level: number
    setLevel: React.Dispatch<React.SetStateAction<number>>
    experience: number
    setExperience: React.Dispatch<React.SetStateAction<number>>
    nextLevelExperience: number
    setNextLevelExperience: React.Dispatch<React.SetStateAction<number>>
}

export interface SaveFile {

    seenPokemons: SeenPokemon[],
    myPokemons: CatchedPokemon[],
    safariZones: SafariZone[],
    options: Options,
    bag: Bag[],
    player: Player | null
}

export interface SeenPokemon {
    id: number
    name: string
}

export interface SafariZone {

    id: number
    name: string
    portrait: string
    pokemon: ZonePokemon[] | null
    reward: ZoneReward[]
    unlock: ZoneUnlock | null
}

export interface StaticZone {
    name: string
    pokemon: { name: string, unlocked: ZoneUnlock | null }[]
}

interface ZoneReward {

    id: number
    name: string
    icon: string
    cuantity: number 
}

interface ZoneUnlock {

    id: number
    unlock: string
    unlocked: boolean
}

interface Options {

    font: string
    frame: Frame
    icon: icon | null
    createDate: Date
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
    nextLevelExperience: number
}

export interface PokemonList
{
    id: number,
    name: string
}

export interface APIPokemon 
{
    id: number,
    name: string,
    height: number,
    weight: number,
    sprites: Sprites,
    moves: Moves[],
    types: Types[]
    abilities: Ability[],
    held_items: Held_Items[]
}

export interface PlayerPokemon {

    id: number
    name: string
    sprites: Sprites 
    seen: number
    catched: number
    ability?: Ability,
    shiny?: boolean
}

export interface ZonePokemon {
    id: number
    name: string
    encounter_rate: number
    catch_rate: number
    seen: number
    catched: number
    unlocked: ZoneUnlock | null
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

export interface Ability
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