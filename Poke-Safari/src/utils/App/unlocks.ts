import { message } from "antd"
import { useContext } from "react"
import { Context } from "src/context/AppContext";
import {  SafariZone, SaveFile, Unlock, WildPokemon, ZonePokemon} from "src/interfaces/interfaces";

const useUnlocks = () => {

    const { saveFile, SaveGame, onPokemonUnlocked } = useContext(Context);
    
    //#region POKEMON UNLOCKS

    const CheckUnlock = (pokemon: WildPokemon) => {

        if(saveFile)
        {
            const saveFileCopy = saveFile;

            let zone = 0;

            while(zone < saveFileCopy.safariZones.length)
            {
                const safariZone = saveFileCopy.safariZones[zone];

                // we need to take the zone's total unlocked pokemon amount to those unlocks which needs to catch all of this zone pokemons!
                // only used on 'zone' unlock type!

                let availablePokemon: number = 0;

                safariZone.pokemon?.forEach(pokemon => pokemon.unlock ? availablePokemon++ : 0);

                const allPokemon = saveFileCopy.safariZones[zone].pokemon;

                // check if the looped zone has an unlock!

                if(safariZone.unlock && safariZone.unlock.type)
                {
                    // zone where the unlocks are done!

                    const keyZone: SafariZone | undefined = saveFile.safariZones.find(zone => zone.name == safariZone.unlock?.type?.pokemon);
                    
                    switch(safariZone.unlock.type.type)
                    {
                        case 'zone': zoneUnlock(keyZone, saveFileCopy, safariZone.unlock.type.cuantity, safariZone.name, undefined, availablePokemon, safariZone); break;
                        case 'seen': seenUnlock(saveFileCopy, safariZone.unlock?.type?.cuantity, safariZone.name, undefined, safariZone); break;
                    }
                }

                // check if every looped zone pokemon has an unlock!

                if(allPokemon)
                {
                    let zonePokemon = 0;

                    while(zonePokemon < allPokemon.length)
                    {
                        // pokemon who is going to be unlocked!

                        const toUnlockPokemon = allPokemon[zonePokemon];

                        if(allPokemon[zonePokemon].unlock)
                        {
                            // entire pokemon unlock!

                            const unlock: Unlock | null | undefined = allPokemon[zonePokemon].unlock;

                            if(unlock && unlock.type)
                            {
                                const cuantity: number = unlock.type.cuantity;

                                const keyZone: SafariZone | undefined = saveFileCopy.safariZones.find(zone => zone.name == unlock.type?.pokemon);

                                switch(unlock.type.type)
                                {
                                    case 'catch': catchUnlock(saveFileCopy, cuantity, safariZone.name, toUnlockPokemon); break;
                                    case 'seen': seenUnlock(saveFileCopy, cuantity, safariZone.name, toUnlockPokemon); break;
                                    case 'pokemon': pokemonUnlock(saveFileCopy, unlock, cuantity, pokemon, toUnlockPokemon, safariZone); break;
                                    case 'zone': zoneUnlock(keyZone, saveFileCopy, cuantity, safariZone.name, toUnlockPokemon, availablePokemon); break;
                                    case 'level': break;
                                }
                            }
                        }
                        zonePokemon++;
                    }
                }
                zone++;
            }
        }        
    }

    const catchUnlock = (saveFile: SaveFile, cuantity: number, zone: string, toUnlockPokemon?: ZonePokemon, toUnlockZone?: SafariZone) => {

        if(saveFile.statistics.catched == cuantity)
        {
            if(toUnlockPokemon)
            {
                toUnlockPokemon.unlock = null;
    
                onPokemonUnlocked(toUnlockPokemon.id, toUnlockPokemon.name, zone);
            }
            else if(toUnlockZone)
            {
                toUnlockZone.unlock = null;

                message.info(`You have unlocked the ${zone}!`);
            }
            
            SaveGame(saveFile);
        }
    }

    const seenUnlock = (saveFile: SaveFile, cuantity: number, zone: string, toUnlockPokemon?: ZonePokemon, toUnlockZone?: SafariZone) => {

        if(saveFile.statistics.seen == cuantity)
        {
            if(toUnlockPokemon)
            {
                toUnlockPokemon.unlock = null;
    
                onPokemonUnlocked(toUnlockPokemon.id, toUnlockPokemon.name, zone);
            }
            else if(toUnlockZone)
            {
                toUnlockZone.unlock = null;

                console.log(`You have unlocked the ${zone}!`)
            }
            SaveGame(saveFile);

        }
    }

    const pokemonUnlock = (saveFile: SaveFile, unlock: Unlock, cuantity: number, pokemon: WildPokemon, toUnlockPokemon: ZonePokemon, zone: SafariZone) => {
        
        // the method only will be triggered for the pokemon catched, not 
        // for all pokemon with the pokemon unlock type!

        let isUnlocked: boolean = false;

        if(unlock.type?.pokemon)
        {
            if(Array.isArray(unlock.type.pokemon))
            {
                if(zone && zone.pokemon)
                {
                    const keyPokemon: string[] = Array.from(unlock.type.pokemon);
    
                    //let cuantity: number = 0;
    
                    let keyPokemonCatched: number = 0;

                    let kPokemon: number = 0;
    
                    while(kPokemon < keyPokemon.length)
                    {
                        let pokemon = 0;
    
                        while(pokemon < zone.pokemon.length)
                        {
                            
                            if(keyPokemon[kPokemon] == zone.pokemon[pokemon].name && zone.pokemon[pokemon].catched > 0)
                            {
                                keyPokemonCatched++;

                                pokemon = zone.pokemon.length;
                            }

                            pokemon++;
                        }
    
                        kPokemon++;
                    }
    
                    /*unlock.type.pokemon.forEach(pokemon => {
                    
                        zone?.pokemon?.forEach(zonePokemon => {
                            
                            zonePokemon.name == pokemon ? zonePokemon.catched > 0 ? cuantity++ : null : null
        
                        })
                    
                    })*/
    
                    if(keyPokemonCatched == keyPokemon.length)
                    {
                        isUnlocked = true;
                    }
                
                }
            }
            else 
            {
                if(unlock.type.pokemon == pokemon.name)
                {
                    if(pokemon.catched == cuantity)
                    {
                        isUnlocked = true;
                    }
                }
            }
        }

        if(isUnlocked)
        {
            toUnlockPokemon.unlock = null;
        
            SaveGame(saveFile);

            onPokemonUnlocked(toUnlockPokemon.id, toUnlockPokemon.name, zone.name);
        }

    }

    const zoneUnlock = (keyZone: SafariZone | undefined, saveFile: SaveFile, cuantity: number, zone: string, toUnlockPokemon?: ZonePokemon, availablePokemon?: number, toUnlockZone?: SafariZone) => {
        
        if(keyZone)
        {
            let isUnlocked: boolean = false;
    
            if(toUnlockPokemon) // if we are going to unlock a pokemon.
            {
                if(cuantity != 0) // there is not unlocks with this contition at the moment!
                {
                    let catchedAmount = 0;
        
                    keyZone.pokemon?.forEach(pokemon => pokemon.catched > 0 ? catchedAmount++ : null);
        
                    if(cuantity == catchedAmount)
                    {
                        isUnlocked = true; 
                    }
                }
                else
                {
                    const totalPokemon = keyZone.pokemon?.length;
    
                    if(totalPokemon && availablePokemon)
                    {
                        let catchedAmount = 0;
        
                        keyZone.pokemon?.forEach(pokemon => pokemon.catched > 0 ? catchedAmount++ : null);
        
                        if(totalPokemon - availablePokemon == catchedAmount) // available pokemon are those one which are unlocked!
                        {
                            isUnlocked = true;
                        }
                    }
                }
    
                if(isUnlocked)
                {
                    toUnlockPokemon.unlock = null;
        
                    SaveGame(saveFile);
    
                    onPokemonUnlocked(toUnlockPokemon.id, toUnlockPokemon.name, zone, 5); 
                }
            }
            else if(toUnlockZone) // if we are going to unlock a zone.
            {
                if(cuantity != 0) // there is not unlocks with this contition at the moment!
                {
                    console.log(0);
                }
                else
                {
                    let catchedAmount = 0;
    
                    keyZone.pokemon?.forEach(pokemon => pokemon.catched > 0 ? catchedAmount++ : null)
    
                    if(keyZone.pokemon?.length == catchedAmount)
                    {
                        toUnlockZone.unlock = null;
    
                        SaveGame(saveFile);
    
                        message.success(`You have unlocked the ${toUnlockZone.name}!`);
    
                        // onZoneUnlocked(); method quite similar to onPokemonUnlocked
                    }
                }
            }
        }
    }

    //#endregion


    const LevelUnlock = () => {
        message.info("SHOW LEVEL UNLOCK!");
    }

    return {
        LevelUnlock,
        CheckUnlock
    }
}

export default useUnlocks;