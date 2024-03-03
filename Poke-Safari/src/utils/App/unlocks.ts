import { message } from "antd"
import { useContext } from "react"
import { Context } from "src/context/AppContext";
import {  SaveFile, Unlock, WildPokemon, ZonePokemon} from "src/interfaces/interfaces";

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

                const allPokemon = saveFileCopy.safariZones[zone].pokemon;

                if(allPokemon)
                {
                    let zonePokemon = 0;

                    while(zonePokemon < allPokemon.length)
                    {
                        const toUnlockPokemon = allPokemon[zonePokemon];

                        if(allPokemon[zonePokemon].unlock)
                        {
                            const unlock: Unlock | null | undefined = allPokemon[zonePokemon].unlock;

                            if(unlock && unlock.type)
                            {
                                const cuantity = unlock.type.cuantity;

                                switch(unlock.type.type)
                                {
                                    case 'catch': catchUnlock(saveFileCopy, cuantity, toUnlockPokemon, safariZone.name); break;
                                    case 'seen': console.log(`Pokemon: ${allPokemon[zonePokemon].name}; Unlock type: ${unlock.type.type}`); break;
                                    case 'pokemon': pokemonUnlock(saveFileCopy, unlock, cuantity, pokemon, toUnlockPokemon, safariZone.name); break;
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

    const catchUnlock = (saveFile: SaveFile, cuantity: number, toUnlockPokemon: ZonePokemon, zone: string) => {

        if(saveFile.statistics.catched == cuantity)
        {
            toUnlockPokemon.unlock = null;

            SaveGame(saveFile);

            onPokemonUnlocked(toUnlockPokemon.id, toUnlockPokemon.name, zone);
        }
    }

    const pokemonUnlock = (saveFile: SaveFile, unlock: Unlock, cuantity: number, pokemon: WildPokemon, toUnlockPokemon: ZonePokemon, zone: string) => {
        
        // the method only will be triggered for the pokemon catched, not 
        // for all pokemon with the pokemon unlock type!

        if(unlock.type?.pokemon == pokemon.name)
        {
            if(pokemon.catched == cuantity)
            {
                toUnlockPokemon.unlock = null;

                SaveGame(saveFile);

                onPokemonUnlocked(toUnlockPokemon.id, toUnlockPokemon.name, zone);
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