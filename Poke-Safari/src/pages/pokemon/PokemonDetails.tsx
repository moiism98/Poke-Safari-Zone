import { useCallback, useContext, useEffect, useState } from "react";
import { Context } from "src/context/AppContext";
import { Image } from "react-bootstrap";
import { ArrowLeftOutlined, PlusOutlined, StarFilled } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import { Button, Typography, message } from "antd";
import { CatchedPokemon } from "src/interfaces/interfaces";
import GameScreen from "src/components/GameScreen/GameScreen";
import useApp from "src/components/App/hook/useApp";
import useZone from "src/components/Zones/hook/useZone";

const PokemonDetails = () => {

    const { saveFile, options, pokemonDetails, pokemonTeam, setPokemonTeam, SaveGame } = useContext(Context);
    
    const  { FirstLetterToUpper, appConsts } = useApp();

    const { GetTypeIcon } = useZone();

    const navigate = useNavigate();

    const [ nickname, setNickname ] = useState<string | undefined>(pokemonDetails?.nickname ? pokemonDetails.nickname : FirstLetterToUpper(pokemonDetails?.name));

    const onChange = (nickname: string) => {
        
        if(nickname.length <= 15)
        {
        
            if(saveFile)
            {
                const saveFileCopy = saveFile;
    
                const pokemon: CatchedPokemon | undefined = saveFileCopy.myPokemons.find(pkmn => pkmn.listId == pokemonDetails?.listId);
    
                if(pokemon)
                {
                    if(nickname != "")
                    {
                        pokemon.nickname = nickname;

                        setNickname(nickname);
                    }
                    else
                    {
                        pokemon.nickname = undefined;

                        setNickname(FirstLetterToUpper(pokemonDetails?.name))
                    }
                }
    
                SaveGame(saveFileCopy)
            }
        }
        else
        {
            message.error("Error: Nickname length exceded! (Max 15 characters)");
        }

    }

    const isInTeam = useCallback(() => {
        
        let isInTeam = false;

        if(pokemonDetails && pokemonTeam)
        {
            if(pokemonTeam.find(pokemon => pokemon.listId == pokemonDetails.listId))
            {
                isInTeam = true;
            }
        }
        
        return isInTeam;

    }, [ pokemonDetails, pokemonTeam ])

    const [ inTeam, setInTeam ] = useState<boolean>(isInTeam());

    const addToTeam = (pokemon: CatchedPokemon) => {
        
        if(pokemonTeam)
        {
            const teamPokemon = pokemonTeam.find(pkmn => pkmn.listId == pokemon.listId);

            if(!teamPokemon)
            {
                setPokemonTeam(oldTeam => [...oldTeam, pokemon]);
    
                setInTeam(true);
            }
        }

    }
    

    useEffect(() => {
        
        if(pokemonTeam && saveFile)
        {
            const saveFileCopy = saveFile;

            saveFileCopy.pokemonTeam = pokemonTeam;

            SaveGame(saveFileCopy);
        }

        setInTeam(isInTeam());

    }, [ pokemonTeam, saveFile, SaveGame, isInTeam ])

    return(
        <GameScreen>
            <ArrowLeftOutlined onClick={ () =>  navigate("..", { relative: "path" }) } style={{ width: '3%' }} className="backArrow d-flex ms-2"/>
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width:'100%', overflowY: 'auto'}}>
                {
                    pokemonDetails ? 
                        <div key={ pokemonDetails.id } style={{ display: 'flex', flexWrap:'wrap', width: '100%', height: '75%', alignItems: 'center', justifyContent: 'space-around'}}>
                            <audio autoPlay src={ pokemonDetails.cry }></audio>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems:'center', justifyContent: 'center', margin: '.5em'}}>
                                <div style={{ display: 'flex', alignItems:'center'}}>
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
                                    {pokemonDetails.shiny ? <StarFilled style={{ color: '#f9be19', marginRight: '.3em'}}/> : null}
                                    { pokemonDetails.types.map(type => <Image key={ type.type.name } width={30} height={30} style={{ margin: '0 .3em 0 0'}} title={ FirstLetterToUpper(type.type.name) } src={ GetTypeIcon(type.type.name) }/> )}
                                </div>
                                <Image width={200} height={200} src={ pokemonDetails.shiny ? pokemonDetails.sprites.front_shiny : pokemonDetails?.sprites.front_default }/>
                                { !inTeam ? 
                                    pokemonTeam.length < appConsts.maxTeam ? 
                                        <Button onClick={ () => addToTeam(pokemonDetails) } shape="round" icon={ <PlusOutlined /> }>Add to the team!</Button>
                                        : <h4>The team is full already!</h4> 
                                    : <h4>{ nickname ? nickname : FirstLetterToUpper(pokemonDetails.name) } is already part of the team!</h4> 
                                }
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', margin: '.3em' }}>
                                <h3>Height: { pokemonDetails.height } ft.</h3>
                                <h3>Weight: { pokemonDetails.weight } kg.</h3>
                                <h3>Moves: { pokemonDetails.moves.map(move => FirstLetterToUpper(move.move.name)).join(", ") } </h3>
                                { pokemonDetails.held_item ? <h3>Held item: <strong>{ FirstLetterToUpper(pokemonDetails.held_item.item.name) }</strong></h3> : null}
                                { pokemonDetails.ability ? <h3>Ability: <strong>{ FirstLetterToUpper(pokemonDetails.ability.ability.name) }</strong></h3> : null}
                            </div> 
                        </div>
                     : null
                }
                <div style={{ width: '100%', height: '25%' }}></div>
            </div>
        </GameScreen>
    )

}

export default PokemonDetails;

