import { message } from "antd"
import { useCallback, useContext, useState } from "react";
import { Context } from "src/context/AppContext";
import unlocks from "src/utils/App/unlocks";

const usePlayer = () => {

    const { player, saveFile, SaveGame } = useContext(Context);

    const { LevelUnlock } = unlocks();

    const [ levelUp, setLevelUp ] = useState<boolean>(false);

    const CalculateLevelPercent = () => {

        return  Math.floor((player.experience * 100) / player.nextLevelExperience);
    }

    const SaveExperience = useCallback(() => {
    
        if(player.experience)
        {
            const saveFileCopy = saveFile;

            if(saveFileCopy && saveFileCopy.player)
            {
                saveFileCopy.player.experience = player.experience;

                SaveGame(saveFileCopy);
            }
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ player.experience ])

    const SavePlayerStats = useCallback(() => {
        
        if(player.level)
        {
            const saveFileCopy = saveFile;

            if(saveFileCopy && saveFileCopy.player)
            {
                saveFileCopy.player.level = player.level;

                saveFileCopy.player.experience = player.experience;

                saveFileCopy.player.nextLevelExperience = player.nextLevelExperience;

                SaveGame(saveFileCopy);
            }
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ player.level ])

    const SavePlayer = useCallback(() => {
        
        if(levelUp)
        {
            SavePlayerStats();

            setLevelUp(false);
        }

    }, [ levelUp, SavePlayerStats ])

    const LevelUp = useCallback(() => {

        if(player.experience != 0 && player.experience >= player.nextLevelExperience)
        {
            message.info(`LEVEL UP! You have reached level ${ player.level + 1 }!`);

            LevelUnlock(player.level + 1);

            setTimeout(() => {
                
                player.setLevel(level => level + 1);
                
                player.setExperience(player.experience - player.nextLevelExperience);
    
                player.setNextLevelExperience(nextLvl => nextLvl + 15);

                setLevelUp(true);
            
            }, 2000)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ player ])    

    return {
        player,
        CalculateLevelPercent,
        SaveExperience,
        SavePlayer,
        LevelUp
    }
}

export default usePlayer;