import GameScreen from "src/components/GameScreen/GameScreen"
import useApp from "src/components/App/hook/useApp"
import { useContext } from "react"
import { Context } from "src/context/AppContext"
import { Image } from "react-bootstrap"
import { Popover } from "antd"

const PokemonList = () => {

    const { saveFile } = useContext(Context);

    const  {FirstLetterToUpper } = useApp();


    return(
        <GameScreen>
            <div style={{ height: '100%', width:'100%', overflowY: 'auto'}}>
                {
                    saveFile ?

                        saveFile.myPokemons.map(pokemon => (
                            <Popover
                                content={(
                                    <div style={{display: 'flex', flexDirection: 'column'}}>
                                        <span style={pokemon.shiny ? {color: '#f9be19'} :{color: 'lightskyblue'}}><strong>{FirstLetterToUpper(pokemon.name)}</strong></span>
                                        <span>Height:<strong>{ pokemon.height } ft.</strong></span>
                                        <span>Weight:<strong>{ pokemon.weight } kg.</strong></span>
                                        <span>Moves: <strong>{ pokemon.moves.map(move => FirstLetterToUpper(move.move.name)).join(", ") }</strong></span>
                                        { pokemon.held_item ? <span>Held item: <strong>{ FirstLetterToUpper(pokemon.held_item.item.name) }</strong></span> : null}
                                    </div>    
                                )}
                            >
                                <Image 
                                    key={pokemon.id} 
                                    src={pokemon.shiny ? pokemon.sprites.front_shiny : pokemon.sprites.front_default}
                                    width={125}
                                    height={125}
                                />
                            </Popover>
                        ))

                    : null
                }
            </div>
        </GameScreen>    
    )
}

export default PokemonList