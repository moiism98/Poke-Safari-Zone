import './PokemonList.css';
import GameScreen from "src/components/GameScreen/GameScreen";
import usePokemonList from "src/components/Player/hook/usePokemonList";
import { Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FloatButton, Modal, Pagination } from "antd";
import { DeleteFilled } from '@ant-design/icons';
import { useContext } from 'react';
import { Context } from 'src/context/AppContext';

const PokemonList = () => {

    const { pokemon, release, page, pages, setOffset, limit, openModal, setOpenModal, releasePokemon, setRelease, 
            setReleasePokemon, setPokemonDetails, onRelease, FirstLetterToUpper } = usePokemonList();

    const { saveFile, SaveGame } = useContext(Context);

    return(
        <>
            <GameScreen>
                <div className="pokemonList">
                    {
                        pokemon?.map(pokemon => (
    
                            !pokemon.released ?

                                !release ?

                                <Link 
                                    key={ pokemon.listId } 
                                    onClick={() => { 

                                        setPokemonDetails(pokemon); 

                                        const saveFileCopy = saveFile;

                                        if(saveFileCopy && saveFileCopy.player)
                                        {
                                            saveFileCopy.player.pokemonDetails = pokemon;

                                            SaveGame(saveFileCopy);
                                        }
                                    }} 
                                    to={`${pokemon.name}`}
                                > 
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
                    }
                </div>
                <Pagination 
                    current={ page } 
                    total={ pages ? pages * 10 : pages } 
                    onChange={ (page) => setOffset(page != 1 ? (page * limit) - limit : 0) }
                    style={{ margin: '1em' }}
                    showSizeChanger={ false }
                />
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