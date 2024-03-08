import GameScreen from "src/components/GameScreen/GameScreen";
import useApp from "src/components/App/hook/useApp";
import './PokemonList.css';
import { useContext, useState} from "react";
import { Context } from "src/context/AppContext"
import { Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FloatButton, Modal } from "antd";
import { DeleteFilled } from '@ant-design/icons';
import { CatchedPokemon } from "src/interfaces/interfaces";

const PokemonList = () => {

    const { saveFile, pokemonTeam, setPokemonTeam , setPokemonDetails, SaveGame } = useContext(Context);

    const { FirstLetterToUpper } = useApp();

    const [ releasePokemon, setReleasePokemon ] = useState<CatchedPokemon>();

    const [ release, setRelease ] = useState<boolean>(false);

    const [ openModal, setOpenModal ] = useState<boolean>(false);

    const onRelease = (releasePokemon: CatchedPokemon | undefined) => {

        const saveFileCopy = saveFile;
        
        if(saveFileCopy)
        {
            const teamPokemon = pokemonTeam.find(pokemon => pokemon.listId == releasePokemon?.listId);

            if(teamPokemon) // if we found the released pokemon on the team, we remove this pokemon from the team!
            {
                // remake the pokemon team discarding the ALL released pokemon! (inside myPokemon discard the pokemon already realeased and the current one released)

               saveFileCopy.pokemonTeam = saveFileCopy?.myPokemons.filter(pokemon => pokemon.listId != teamPokemon.listId && !pokemon.released); 

               setPokemonTeam(saveFileCopy.pokemonTeam);
            }

            const pokemon = saveFileCopy.myPokemons.find(pokemon => pokemon == releasePokemon)

            if(pokemon)
            {
                pokemon.released = true;
    
                SaveGame(saveFileCopy);
            }
        }
        
        setOpenModal(false);
    }


    return(
        <>
            <GameScreen>
                <div className="pokemonList">
                    {
                        saveFile ?

                            saveFile.myPokemons.map(pokemon => (
    
                                !pokemon.released ?

                                    !release ?

                                        <Link key={ pokemon.listId } onClick={() => setPokemonDetails(pokemon) } to={`${pokemon.name}`}> 
                                            <Image  
                                                title={ pokemon.nickname ? pokemon.nickname : FirstLetterToUpper(pokemon.name) }
                                                src={ pokemon.shiny ? pokemon.sprites.front_shiny : pokemon.sprites.front_default }
                                            />
                                        </Link> 

                                        :
                                        <>
                                            <Image 
                                                className='releasePokemon'
                                                key={ pokemon.listId }
                                                title={ pokemon.nickname ? pokemon.nickname : FirstLetterToUpper(pokemon.name) }
                                                src={ pokemon.shiny ? pokemon.sprites.front_shiny : pokemon.sprites.front_default }
                                                onClick={() => {

                                                    setOpenModal(true);

                                                    setReleasePokemon(pokemon);
                                                }}
                                            />
                                        </>
                                
                                : null
                            ))

                        : null

                    }
                </div>

                {/*<Button
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
                >
                    Take back pokes
                </Button>*/}

            </GameScreen>

            <FloatButton  
                className="releaseButton"
                tooltip={ release ? <div>Click to exit from release pokemon mode!</div> : <div>Click to enter on release pokemon mode!</div>}
                icon= { <DeleteFilled /> } 
                onClick={() => setRelease(oldValue => !oldValue)}
            />

            <Modal
                open={ openModal }
                closeIcon={ false }
                title={`Are you sure you want to release ${ releasePokemon?.nickname ? releasePokemon.nickname : FirstLetterToUpper(releasePokemon?.name) }?`}
                okText={`Release ${ releasePokemon?.nickname ? releasePokemon.nickname : FirstLetterToUpper(releasePokemon?.name) }`}
                onOk={() => {

                    onRelease(releasePokemon);

                    setOpenModal(false)
                }}
                onCancel={() => setOpenModal(false)}
            />
        </>
    )
}

export default PokemonList