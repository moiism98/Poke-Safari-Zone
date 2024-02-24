import { message } from "antd"
import { useCallback, useContext, useEffect/*, useState */} from "react";
import { Context } from "src/context/AppContext";

const usePlayer = () => {

    const { player } = useContext(Context);

    const CalculateLevelPercent = () => {

        return  Math.floor((player.experience * 100) / player.nextLevelExperience);
    }

    /*const GetTimePlayed = () => {

        let timePlayed = ""

        if(saveFile && saveFile.options.saveDate && saveFile.options.createDate)
        {
            const totalTime = new Date().getTime() - new Date(saveFile?.options.createDate).getTime(); 

            const hoursPlayed = Math.trunc(totalTime / ( 1000 * 60 * 60 ));
            const minPlayed = Math.trunc(totalTime / ( 1000 * 60  ));

            timePlayed = `${hoursPlayed}:${minPlayed} h`;
        }

        return timePlayed;
    }*/

    const LevelUp = useCallback(() => {

        if(player.experience != 0 && player.experience == player.nextLevelExperience)
        {
            message.info("Level up!");

            setTimeout(() => {
                
                player.setLevel(level => level + 1);
                
                player.setExperience(0);
    
                player.setNextLevelExperience(nextLvl => nextLvl + 15)
            
            }, 2000)
        }
    }, [ player ])

    useEffect(() => {
        
        LevelUp();

    }, [ LevelUp ])

    //const [ timePlayed, setTimePlayed ] = useState<string>(GetTimePlayed());

    //setInterval(() => setTimePlayed(GetTimePlayed()), 1000)
    

    return {
        //timePlayed,
        CalculateLevelPercent,
    }
}

export default usePlayer;