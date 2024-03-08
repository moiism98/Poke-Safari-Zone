import GameScreen from "src/components/GameScreen/GameScreen";
import { useContext } from "react";
import { Context } from "src/context/AppContext"
import { Button, Image } from "react-bootstrap";
import { Link } from "react-router-dom";

const PokemonList = () => {

    const { saveFile, SaveGame, setPokemonDetails } = useContext(Context);

    /*const onConfirm = () => {

        const saveFileCopy = saveFile;

        if(saveFileCopy)
        {
            const pokemon = saveFileCopy.myPokemons.find(pokemon => pokemon == releasePokemon)
            if(pokemon)
            {
                pokemon.released = true;
    
                SaveGame(saveFileCopy);
            }
        }
        
        setConfirm(false);
    }*/

    return(
        <GameScreen>
            <div style={{ height: '100%', width:'100%', overflowY: 'auto'}}>
                {
                    saveFile ?

                        saveFile.myPokemons.map(pokemon => (

                            !pokemon.released ?

                            <Link key={ pokemon.listId } onClick={() => setPokemonDetails(pokemon) } to={`${pokemon.name}`}> 
                                <Image  
                                    src={ pokemon.shiny ? pokemon.sprites.front_shiny : pokemon.sprites.front_default }
                                    width={125}
                                    height={125}
                                />
                            </Link> : null
                        ))

                    : null
                }
            </div>
            <Button
                onClick={() => {
                    saveFile?.myPokemons.map(pokemon => {
                    
                        if(pokemon.released)
                        {
                            pokemon.released = false;
                        }
                    })

                    const saveFileCopy = saveFile;
                    
                    if(saveFileCopy)
                        SaveGame(saveFileCopy);
                }}
            >Take back pokes</Button>
        </GameScreen>    
    )
}

export default PokemonList