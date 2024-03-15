import Loading from "src/components/Spinners/Loading/Loading";
import usePokemonDetails from "src/components/pokemon/hook/usePokemonDetails";
import { Popover } from "antd";
import { Image } from "react-bootstrap";

const Evolution = () => {

    const { saveFile, pokemonDetails, evolutions, loading, FirstLetterToUpper } = usePokemonDetails();

    return(
        
        pokemonDetails && pokemonDetails.evolution ? loading ? <Loading/> :

        <div className="evolutions">
            <h3>Evolves to: </h3>
            {
                evolutions?.map(evolution => (evolution.method == 'use-item' ?
                        
                        evolution.item ? 

                            <Popover
                                key={ evolution.evolution }
                                content={
                                    <>
                                        <span>Evolve pokemon using </span>
                                        <Image 
                                            className="evolutionItemIcon" 
                                            title={ evolution.item } 
                                            src={ saveFile?.shop.items.find(item => item.name == evolution.item)?.icon }
                                        />
                                    </>
                                }
                            >
                                <Image
                                    className="evolutionIcon"
                                    title={ evolution.catched ? FirstLetterToUpper(evolution.evolution) : undefined }
                                    src={ evolution.icon }
                                    style={ saveFile?.myPokemons.find(pokemon => pokemon.name == evolution.evolution) ? { filter: 'brightness(100%)' } : { filter: 'brightness(0%)' }}
                                /> 
                            </Popover> 

                        : null

                    : 
                    evolution.method == 'trade' ? 
                            
                        evolution.held_item ? 
                            <Popover
                                key={ evolution.evolution }
                                content={
                                    <>
                                        <span>Evolve pokemon holding </span>
                                        <Image 
                                            className="evolutionItemIcon" 
                                            title={ evolution.held_item } 
                                            src={ saveFile?.shop.items.find(item => item.name == evolution.held_item)?.icon }
                                        />
                                    </>
                                }
                            >
                                <Image 
                                    title={ evolution.catched ? FirstLetterToUpper(evolution.evolution) : undefined } 
                                    className="evolutionIcon"
                                    src={ evolution.icon }
                                    style={ saveFile?.myPokemons.find(pokemon => pokemon.name == evolution.evolution) ? { filter: 'brightness(100%)' } : { filter: 'brightness(0%)' }}
                                /> 
                            </Popover> 
                        : null  

                    : evolution.method == 'level-up' ?
                        <Image 
                            title={ evolution.catched ? FirstLetterToUpper(evolution.evolution) : undefined } 
                            className="evolutionIcon" 
                            src={ evolution.icon }
                            style={ saveFile?.myPokemons.find(pokemon => pokemon.name == evolution.evolution) ? { filter: 'brightness(100%)' } : { filter: 'brightness(0%)' }}
                        /> 
                    : 
                        <Image 
                            title={ evolution.catched ? FirstLetterToUpper(evolution.evolution) : undefined } 
                            className="evolutionIcon" 
                            src={ evolution.icon }
                            style={ saveFile?.myPokemons.find(pokemon => pokemon.name == evolution.evolution) ? { filter: 'brightness(100%)' } : { filter: 'brightness(0%)' }}
                        /> 
                ))
            }
        </div> : null  
    )
}

export default Evolution;