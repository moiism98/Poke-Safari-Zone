export type CatchedPokemon = APIPokemon & PlayerPokemon
export type WildPokemon = APIPokemon & PlayerPokemon & ZonePokemon

//#region CONTEXT

export interface IContext {
    saveFile: SaveFile | null
    setSaveFile: React.Dispatch<React.SetStateAction<SaveFile | null>>
    player: ContextPlayer
    options: ContextOptions
    totalPokemon: number
    allPokemons: PokemonList[] | undefined,
    pokemonTeam: CatchedPokemon[]
    setPokemonTeam: React.Dispatch<React.SetStateAction<CatchedPokemon[]>>
    pokemonDetails: CatchedPokemon | undefined
    setPokemonDetails: React.Dispatch<React.SetStateAction<CatchedPokemon | undefined>>
    setAllPokemons: React.Dispatch<React.SetStateAction<PokemonList[] | undefined>>
    randomPokemon: string | undefined
    onPokemonUnlocked: (id: number, pokemon: string, zone: string, duration?: number) => void
    SaveGame: (saveFileCopy: SaveFile) => void
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

//#endregion

//#region SAVEFILE

export interface SaveFile {

    seenPokemons: SeenPokemon[],
    myPokemons: CatchedPokemon[],
    safariZones: SafariZone[],
    options: Options,
    bag: Item[],
    player: Player | null
    statistics: Statistics,
    pokemonTeam: CatchedPokemon[]
}

    //#region POKEMON

    export interface SeenPokemon {
        id: number
        name: string
        sprite: string
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
        abilities?: Ability[],
        held_items?: Held_Items[]
    }

    export interface PlayerPokemon {

        id: number
        name: string
        nickname?: string
        seen: number
        catched: number
        ability?: Ability,
        held_item?: Held_Items | null
        shiny: boolean
        cry?: string
        released?: boolean
        listId?: number
    }

    export interface ZonePokemon {
        id: number
        name: string
        encounter_rate: number
        catch_rate: number
        seen: number
        catched: number
        unlock?: Unlock | null
    }

    export interface PokemonList
    {
        id: number,
        name: string,
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

    export interface Held_Items
    {
        item: {
            name: string
        }
    }

    //#endregion

    //#region SAFARI ZONE

    export interface SafariZone {
    
        id: number
        name: string
        portrait: string
        pokemon: ZonePokemon[] | null
        reward?: ZoneReward[]
        unlock: Unlock | null
    }
    
    export interface StaticZone {
        name: string
        pokemon: { name: string, unlock: Unlock | null }[]
        unlock: Unlock | null
    }
    
    export interface Portraits {
        
        name: string
        src: string
    }
    
    interface ZoneReward {
    
        id: number
        name: string
        icon: string
        cuantity: number 
    }

    //#endregion

    //#region OPTIONS
    
    interface Options {
    
        font: string
        frame: Frame
        icon: Icon | null
    }
    
    export interface Icon {
    
        id: number;
        name: string;
        icon: string;
    }
    
    interface Item {
    
        id: number
        name: string
        cuantity: number
        icon: string
    }

    export interface Frame{
        name: string,
        styles: {
            border: string,
            borderRadius?: string
        }
    }

    //#endregion

    //#region PLAYER

    export interface Player {

        name: string
        level: number
        experience: number
        nextLevelExperience: number
    }

    //#endregion

    interface Statistics {
        seen: number
        catched: number,
        shiny: number
    }

    //#region GAME UNLOCKS

    export interface Unlock {
        type: UnlockType | null
        description: string
        unlocked: boolean
    }

    interface UnlockType {
        type: string
        cuantity: number
        pokemon: string | string[] | null
    }

    //#endregion

//#endregion



