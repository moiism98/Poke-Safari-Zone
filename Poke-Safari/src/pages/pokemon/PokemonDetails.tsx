import "./PokemonDetails.css";
import Evolution from "./Evolution";
import GameScreen from "src/components/GameScreen/GameScreen";
import usePokemonDetails from "src/components/pokemon/hook/usePokemonDetails";
import { Image } from "react-bootstrap";
import { ArrowLeftOutlined, PlusCircleFilled, MinusCircleFilled, StarFilled } from '@ant-design/icons';
import { Tooltip, Typography } from "antd";

const PokemonDetails = () => {

    const { saveFile, options, appConsts, navigate, pokemonDetails, loading, nickname, inTeam, 
        pokemonTeam, onChange, addToTeam, removeFromTeam, GetTypeIcon, FirstLetterToUpper } = usePokemonDetails();

    return(
        <GameScreen>
            <ArrowLeftOutlined onClick={ () =>  navigate("..", { relative: "path" }) } style={{ width: '3%' }} className="backArrow d-flex ms-2"/>
            <div className="detailsContainer">
                {
                    pokemonDetails ? 
                        <div className="pokemonDetails" style={{ height: pokemonDetails.evolution ? '75%' : '100%' }}>
                            { loading ? null : <audio autoPlay src={ pokemonDetails.cry }></audio> }
                            <div className="pokemonActions">
                                <div className="nickname">
                                    <Typography.Title 
                                        level={3}
                                        style={{ margin: '0 .3em 0 0', fontFamily: options.appFont }} 
                                        editable={{ 

                                            onChange: (nickname) => onChange(nickname), 
                                            text: nickname ? nickname : FirstLetterToUpper(pokemonDetails.name),
                                            tooltip: 'Click to nickname the pokémon! (Blank to remove the nickname)',
                                            maxLength: 15
                                        }}
                                    >
                                        { nickname ? nickname : FirstLetterToUpper(pokemonDetails.name) }
                                    </Typography.Title>
                                    { pokemonDetails.shiny ? <StarFilled className="shiny"/> : null }
                                    { pokemonDetails.types.map(type => <Image key={ type.type.name } className="type" title={ FirstLetterToUpper(type.type.name) } src={ GetTypeIcon(type.type.name) }/> )}
                                </div>
                                <Image className="pokemonIcon" src={ pokemonDetails.shiny ? pokemonDetails.sprites.front_shiny : pokemonDetails?.sprites.front_default }/>
                                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems:'center', justifyContent: 'space-evenly', width: '100%', height:'100%'}}>
                                    { 
                                        !inTeam ? 
                                            pokemonTeam.length < appConsts.maxTeam ? <Tooltip title='Add to the team'><PlusCircleFilled onClick={ () => addToTeam(pokemonDetails) } /></Tooltip>
                                                : null
                                        : <Tooltip title='Remove from team'><MinusCircleFilled onClick={ () => removeFromTeam(pokemonDetails) } /></Tooltip>
                                    }
                                </div>
                            </div>
                            <div className='stats'>
                                <h3>Height: { pokemonDetails.height } ft.</h3>
                                <h3>Weight: { pokemonDetails.weight } kg.</h3>
                                <h3>Moves: { pokemonDetails.moves.map(move => FirstLetterToUpper(move.move.name)).join(", ") } </h3>
                                { 
                                    pokemonDetails.held_item ? 
                                        <h3>Held item: &nbsp;
                                            <strong>{ FirstLetterToUpper(pokemonDetails.held_item.item.name) }</strong>
                                            <Image src={saveFile?.shop.items.find(item => item.name == pokemonDetails.held_item?.item.name)?.icon}/>
                                        </h3> 
                                    : null
                                }
                                { 
                                pokemonDetails.ability ? 
                                    <h3>Ability: &nbsp;
                                        <strong>{ FirstLetterToUpper(pokemonDetails.ability.ability.name) }</strong>
                                    </h3> 
                                    : null
                                }
                            </div> 
                        </div>
                    : null
                }
                <Evolution/>
            </div>
        </GameScreen>
    )

}

export default PokemonDetails;

