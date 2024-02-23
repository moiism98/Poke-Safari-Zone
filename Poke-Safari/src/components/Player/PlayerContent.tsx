import { Image } from "react-bootstrap";
import { Progress } from "antd";
import { useContext } from "react";
import { Context } from "src/context/AppContext";
import usePlayer from "./hook/usePlayer";

const PlayerContent = () => {

    const { saveFile, options, player } = useContext(Context);

    const { timePlayed, ShinyCount, CalculateLevelPercent } = usePlayer();

    const format = () => {

        return (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ margin: '.2em' }}>Lvl. { player.level }</span>
                <span style={{ margin: '.2em' }}>{ `${ player.experience > player.nextLevelExperience ? player.nextLevelExperience : player.experience} / ${player.nextLevelExperience}` }</span>
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
                <div className="playerNumbers">
                    <h3>Pokemon's seen: { saveFile?.seenPokemons.length }</h3>
                    <h3>Pokemon's catched: { saveFile?.myPokemons.length }</h3>
                    <h3>Pokemon's shiny: { ShinyCount() }</h3>
                    <h3>Played time: { timePlayed } </h3>
                </div>
            </div>
        </div>    
    )
}

export default PlayerContent