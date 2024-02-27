import Loading from "../Spinners/Loading/Loading";
import usePlayground from "./hook/usePlayground";
import useApp from "../App/hook/useApp";
import { Image } from "react-bootstrap";
import { Button } from "antd";
import { StarFilled } from '@ant-design/icons';
import { useContext } from "react";
import { Context } from "src/context/AppContext";

const PlaygroundContent = () => {

    const { saveFile } = useContext(Context)

    const { FirstLetterToUpper } = useApp();

    const { wildPokemon, catchRate, fleeRate, pokemonTurn, loading, disable, styles,
        catching, setCatching, GenerateWildPokemon, CatchPokemon, ThrowBait, ThrowRock } = usePlayground();

    return (
        <>
            { catching || pokemonTurn ? <Loading/> : null }
            {
                loading ? <Loading/> : 
                wildPokemon ? 
                <>
                    <div className="d-flex rates">
                        <h3 style={ styles.frame }>+ { catchRate } % Catch Rate</h3>
                        <h3 style={ styles.frame }>+ { fleeRate } % Flee Rate</h3>
                    </div>
                    <div className="pokemonContainer">
                        <div className="wildPokemon">
                            <div className="pokemonName">
                                <h2>{ FirstLetterToUpper(wildPokemon.name) }</h2> 
                                <span>{ wildPokemon.shiny ? <StarFilled/> : null}</span>
                            </div>
                            <Image src={ wildPokemon.shiny ? wildPokemon.sprites.front_shiny : wildPokemon.sprites.front_default }/>
                        </div>
                        <div className="actionsContainer">
                            <div className="actions-text" style={ styles.frame }>
                                <span>Wild <strong>{ wildPokemon.name }</strong> appeared! What will { saveFile?.player?.name } do?</span>
                            </div>
                            <div className="actions">
                                <div className="action-buttons">
                                    <Button 
                                        disabled = { disable } 
                                        style={ styles.button } 
                                        onClick={ () => { setCatching(true); setTimeout(() => CatchPokemon(), 3000); }}
                                    >   
                                        Catch pokémon!
                                    </Button>
                                    <Button disabled = { disable } style={ styles.button } onClick={ () => ThrowBait() }>Throw bait</Button>
                                    <Button disabled = { disable } style={ styles.button } onClick={ () => GenerateWildPokemon() }>Run away!</Button>
                                    <Button disabled = { disable } style={ styles.button } onClick={ () => ThrowRock() }>Throw rock</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
                : null
            }    
        </>
    )
}

export default PlaygroundContent