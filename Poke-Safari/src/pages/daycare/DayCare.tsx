import "./DayCare.css";
import GameScreen from "src/components/GameScreen/GameScreen";
import daycare from "src/assets/img/Zones/daycare.svg";
import Loading from "src/components/Spinners/Loading/Loading";
import useDayCare from "src/components/DayCare/hook/useDayCare";
import { Button, Image } from "react-bootstrap";

const DayCare = () => {

    const { gameScreen, eggIcon, eggs, setEggs, hatchingEgg, setHatchingEgg, loading, pokemon, hatchedPokemon, 
            HatchEgg, FirstLetterToUpper } = useDayCare();

    return(
        <GameScreen styles={ Object.assign({}, gameScreen, { backgroundImage: `url(${ daycare })` }) }>
            <div className="eggContainer">
                <div className="egg">
                    <Image className="eggIcon" src={ eggIcon }/>
                    <h5 className="eggCount"> x{ eggs }</h5>
                </div>
                {
                    loading ? <Loading/> :
                    <>
                        <div className="pokemonProbs" style={{ border: gameScreen.border, borderRadius: gameScreen.borderRadius }}>
                            {
                                pokemon.map(pokemon => (
                                    
                                    <div className="pokemon" key={ pokemon.name }>
                                        <Image title={ FirstLetterToUpper(pokemon.name) } src={ pokemon.sprite ? pokemon.sprite : '' }/>
                                        <h5>{ FirstLetterToUpper(pokemon.name) }</h5>
                                        <h5>{ pokemon.rate }%</h5>
                                    </div>
                                ))
                            }
                        </div>

                        <div className="hatchPokemonContainer">
                            <div className="hatchButtons">
                                <Button onClick={() => setEggs(oldEgg => oldEgg + 1)}>Egg Count ++</Button>
                                {
                                    eggs > 0 ?
                                        <Button 
                                            disabled={ hatchingEgg ? true : false }
                                            onClick={() => {

                                                setHatchingEgg(true);

                                                setTimeout(() => HatchEgg(), 2000);
                                            }} 
                                        >
                                                Hatch Egg!
                                        </Button> : null
                                }
                            </div>
                            <div className="hatchPokemon">
                                {
                                    hatchingEgg ? <Loading/> :

                                        hatchedPokemon ? 
                                        <>
                                            <audio autoPlay src={ hatchedPokemon.cry }></audio>
                                            <Image title={ FirstLetterToUpper(hatchedPokemon.name) } src={ hatchedPokemon.shiny ? hatchedPokemon.sprites.front_shiny : hatchedPokemon.sprites.front_default }/>
                                        </> : null
                                }
                            </div>
                        </div>
                    </>
                }
            </div>
        </GameScreen>    
    )
}

export default DayCare