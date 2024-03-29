export type CaughtPokemon = APIPokemon & PlayerPokemon
export type WildPokemon = APIPokemon & PlayerPokemon & ZonePokemon

//#region CONTEXT

export interface IContext {
    saveFile: SaveFile | null
    setSaveFile: React.Dispatch<React.SetStateAction<SaveFile | null>>
    player: ContextPlayer
    options: ContextOptions
    totalPokemon: number
    allPokemons: PokemonList[] | undefined,
    setAllPokemons: React.Dispatch<React.SetStateAction<PokemonList[] | undefined>>
    myPokemon: CaughtPokemon[]
    setMyPokemon: React.Dispatch<React.SetStateAction<CaughtPokemon[]>>
    pokemonTeam: CaughtPokemon[]
    setPokemonTeam: React.Dispatch<React.SetStateAction<CaughtPokemon[]>>
    pokemonDetails: CaughtPokemon | undefined
    setPokemonDetails: React.Dispatch<React.SetStateAction<CaughtPokemon | undefined>>
    randomPokemon: string | undefined
    bag: Item[]
    setBag: React.Dispatch<React.SetStateAction<Item[]>>
    eggs: number,
    setEggs: React.Dispatch<React.SetStateAction<number>>
    onPokemonUnlocked: (id: number, pokemon: string, zone: string, duration?: number) => void
    onZoneUnlocked: (zone: string) => void
    onLevelUnlocked: (itemId: number, unlock: string) => void
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
    money: number
    setMoney: React.Dispatch<React.SetStateAction<number>>
    rareCandy: number
    setRareCandy: React.Dispatch<React.SetStateAction<number>>
    listId: number
    setListId: React.Dispatch<React.SetStateAction<number>>
}

//#endregion

//#region SAVEFILE

export interface SaveFile {

    seenPokemons: SeenPokemon[]
    myPokemons: CaughtPokemon[]
    safariZones: SafariZone[]
    dayCare: DayCare
    options: Options
    bag: Item[]
    shop: Shop
    player: Player | null
    statistics: Statistics
    pokemonTeam: CaughtPokemon[]
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
        caught: number
        ability?: Ability,
        held_item?: Held_Items | null
        shiny: boolean
        cry?: string
        released?: boolean
        listId?: number
        evolution: Evolution[] | null
        catch_rate: number
    }

    export interface ZonePokemon {
        id: number
        name: string
        encounter_rate: number
        catch_rate: number
        seen: number
        caught: number
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
            id: number
            name: string
            icon: string
            price: number
            url?: string
        }
    }

    export interface Evolution
    {
        id: number
        item: string | null
        held_item: string | null
        method: string
        evolution: string
    }

    //#endregion

    //#region SAFARI ZONE

    export interface SafariZone {
    
        id: number
        name: string
        portrait: string
        pokemon: ZonePokemon[] | null
        rewards?: Item[]
        unlock: Unlock | null
    }
    
    export interface StaticZone {
        name: string
        pokemon: { name: string, unlock: Unlock | null }[]
        unlock: Unlock | null
        rewards?: Item[]
    }
    
    export interface Portraits {
        
        name: string
        src: string
    }

    //#endregion

    //#region SHOP

    interface Shop{
        items: Item[]
        unlock: Unlock | null
    }

    export interface Item {
    
        id: number
        name: string
        cuantity: number
        icon: string
        price?: number
        sellPrice?: number
    }

    //#endregion

    //#region DAYCARE

    interface DayCare{
        pokemon: DayCarePokemon[]
        unlock: Unlock | null
    }

    export interface DayCarePokemon{
        name: string
        rate: number
        sprite?: string
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

        listId: number
        name: string
        money: number
        rareCandy: number
        level: number
        experience: number
        nextLevelExperience: number
        pokemonDetails: CaughtPokemon | undefined
    }

    //#endregion

    interface Statistics {
        seen: number
        caught: number,
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



