import { Image } from "react-bootstrap";
import { Progress } from "antd";
import { useContext } from "react";
import { Context } from "src/context/AppContext";
import usePlayer from "./hook/usePlayer";

const PlayerContent = () => {

    const { saveFile, options, player } = useContext(Context);

    const { /*timePlayed,*/ CalculateLevelPercent } = usePlayer();

    const format = () => {

        return (
            <div className="progressFormat">
                <span>Lvl. { player.level }</span>
                <span>{ `${ player.experience > player.nextLevelExperience ? player.nextLevelExperience : player.experience} / ${player.nextLevelExperience}` }</span>
            </div>
        )
    };    

    return(
        <div className="player">
            <div className="playerTitle">
                <h1>Player name: <strong>{saveFile?.player?.name}</strong></h1>
                <Image title={ saveFile?.options.icon?.name } src={ saveFile?.options.icon?.icon }/>
            </div>
            <div className="playerStats">
                <div className="playerLevel">
                    <Progress 
                        style={{ fontFamily: options.appFont }} 
                        size={ 200 } 
                        format={ format } 
                        type="dashboard"
                        percent={ CalculateLevelPercent() }
                    />
                </div>
                <div className="playerNumbers" style={{ border: options.frame?.styles.border, borderRadius:  options.frame?.styles.borderRadius}}>
                    <h3>Pokemon's seen: { saveFile?.statistics.seen }</h3>
                    <h3>Pokemon's catched: { saveFile?.statistics.catched }</h3>
                    <h3>Pokemon's shiny: { saveFile?.statistics.shiny }</h3>
                    {/*<h3>Played time:{ timePlayed }</h3>*/}
                </div>
            </div>
        </div>    
    )
}

export default PlayerContent