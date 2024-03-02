import { message } from "antd"
import { useContext } from "react"
import { Context } from "src/context/AppContext";
import { Unlock } from "src/interfaces/interfaces";

const useUnlocks = () => {

    const { saveFile, SaveGame, onPokemonUnlocked } = useContext(Context);
    
    //#region POKEMON UNLOCKS

    const CheckUnlock = (pokemon: string) => {

        console.log(pokemon);

        if(saveFile)
        {
            let zone = 0;

            while(zone < saveFile.safariZones.length)
            {
                const allPokemon = saveFile.safariZones[zone].pokemon;

                const zoneName = saveFile.safariZones[zone].name;

                if(allPokemon)
                {
                    let zonePokemon = 0;

                    while(zonePokemon < allPokemon.length)
                    {
                        const pokemonName = allPokemon[zonePokemon].name;

                        if(allPokemon[zonePokemon].unlock)
                        {
                            const unlock: Unlock | null | undefined = allPokemon[zonePokemon].unlock;

                            if(unlock && unlock.type)
                            {
                                const cuantity = unlock.type.cuantity;

                                switch(unlock.type.type)
                                {
                                    case 'catch': catchUnlock(cuantity, zoneName, pokemonName); break;
                                    case 'seen':console.log(`Pokemon: ${allPokemon[zonePokemon].name}; Unlock type: ${unlock.type.type}`); break;
                                    case 'pokemon': console.log(`Pokemon: ${allPokemon[zonePokemon].name}; Unlock type: ${unlock.type.type}`); break;
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

    const catchUnlock = (cuantity: number, zone: string, pokemon: string) => {

        if(saveFile)
        {
            const saveFileCopy = saveFile;

            if(saveFileCopy.statistics.catched == cuantity)
            {
                const safariZone = saveFileCopy.safariZones.find(zn => zn.name == zone);

                if(safariZone)
                {
                    const safariPokemon = safariZone.pokemon?.find(pkmn => pkmn.name == pokemon);

                    if(safariPokemon && safariPokemon.unlock)
                    {
                        safariPokemon.unlock = null;

                        SaveGame(saveFileCopy);

                        onPokemonUnlocked(safariPokemon.id, safariPokemon.name, safariZone.name);
                    }
                }
            }
        }
    }

    const unlockMetapod = () => {

        if(saveFile)
        {
            const saveFileCopy = saveFile;

            const forest = saveFileCopy.safariZones.find(zone => zone.name == 'forest');

            if(forest)
            {
                const pokemon = forest.pokemon?.find(pokemon => pokemon.name == 'caterpie');
                
                if(pokemon)
                {
                    const toUnlockId = pokemon.id + 1;

                    const toUnlock = forest.pokemon?.find(pokemon => pokemon.id == toUnlockId);

                    if(toUnlock && toUnlock.unlock && pokemon.catched == 1)
                    {
                        toUnlock.unlock = null;
    
                        SaveGame(saveFileCopy);
    
                        onPokemonUnlocked(toUnlock.id, toUnlock.name, forest.name);
                    }
                }
            }
        }
    }

    const unlockKakuna = () => {

        if(saveFile)
        {
            const saveFileCopy = saveFile;

            const forest = saveFileCopy.safariZones.find(zone => zone.name == 'forest');

            if(forest)
            {
                const pokemon = forest.pokemon?.find(pokemon => pokemon.name == 'weedle');

                if(pokemon)
                {
                    const toUnlockId = pokemon.id + 1;

                    const toUnlock = forest.pokemon?.find(pokemon => pokemon.id == toUnlockId);

                    if(toUnlock && toUnlock.unlock && pokemon.catched == 1)
                    {
                        toUnlock.unlock = null;
    
                        SaveGame(saveFileCopy);
    
                        onPokemonUnlocked(toUnlock.id, toUnlock.name, forest.name);
                    }
                }
            }
        }
    }


    //#endregion


    const LevelUnlock = () => {
        message.info("SHOW LEVEL UNLOCK!");
    }

    const PokemonUnlock = () => {
        unlockMetapod();
        unlockKakuna();
    }

    return {
        LevelUnlock,
        PokemonUnlock,
        CheckUnlock
    }
}

export default useUnlocks;