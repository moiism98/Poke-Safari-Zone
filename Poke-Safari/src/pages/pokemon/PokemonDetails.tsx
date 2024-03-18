import "./PokemonDetails.css";
import Evolution from "./Evolution";
import GameScreen from "src/components/GameScreen/GameScreen";
import usePokemonDetails from "src/components/pokemon/hook/usePokemonDetails";
import { Image } from "react-bootstrap";
import { ArrowLeftOutlined, StarFilled, SettingFilled } from '@ant-design/icons';
import { Dropdown, MenuProps, Modal, Tooltip, Typography } from "antd";
import { useEffect, useState } from "react";

const PokemonDetails = () => {

    const { 
        saveFile, options, appConsts, player, totalPokemon, 
        navigate, pokemonDetails, showEvolution, rareCandyIcon, rareCandy, 
        loading, nickname,inTeam, pokemonTeam, openBag, setOpenBag, selectedItem, 
        setSelectedItem, TriggerEvolution, onChange, addToTeam, removeFromTeam, GiveItem, 
        GetItem, GetTypeIcon, FirstLetterToUpper, SaveGame
    } = usePokemonDetails();

    type children = { key: string | number, label: JSX.Element, disabled: boolean }

    const [ children, setChildren ] = useState<children[]>([]);

    useEffect(() => {
    
        if(showEvolution >= 1)
        {
            const children: children[] = [];

            pokemonDetails?.evolution?.map(evolution => {
                
                evolution.id <= totalPokemon ?

                    children.push({
                        key: evolution.evolution,
                        label: (
                            evolution.method == 'trade' && evolution.held_item ?
                            <span key={ evolution.id }><Image style={{ margin:0 }} src={ saveFile?.shop.items.find(item => item.name == evolution.held_item)?.icon }/> Evolves to { FirstLetterToUpper(evolution.evolution) }</span>      

                        : evolution.method == 'use-item' ? 
                            <span key={ evolution.id }><Image style={{ margin:0 }} src={ saveFile?.shop.items.find(item => item.name == evolution.item)?.icon }/> Evolves to { FirstLetterToUpper(evolution.evolution) }</span>
                        
                        : 
                            <span 
                                key={ evolution.id }
                                onClick={ () => player.rareCandy >= rareCandy ? TriggerEvolution(evolution.evolution) : null } 
                            >
                                x{ rareCandy }<Image style={{ margin: 0 }} src={ rareCandyIcon }/> Evolves to { FirstLetterToUpper(evolution.evolution) }
                            </span>   
                        ),
                        disabled: evolution.method == 'level-up' && rareCandy >= player.rareCandy ? true : false 
                    })

                : null
            })

            setChildren(children);
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ showEvolution ])

    const items: MenuProps['items'] = [
        {
            key: 1,
            label:(
                pokemonDetails ?
                    !inTeam ? 
                        pokemonTeam.length < appConsts.maxTeam ? <span onClick={ () => addToTeam(pokemonDetails) }>Add pokemon to the team</span>
                            : null
                    : <span onClick={ () => removeFromTeam(pokemonDetails) }>Remove from the team</span>
                : null  
            )
        },
        {
            key: 2,
            label:( <span onClick={ () => setOpenBag(true) }>Give item</span> )
        },
        {
            key: 3,
            label: ( 
                <span 
                    onClick={() => { if(pokemonDetails?.held_item) GetItem(); }}
                >Get item
                </span> 
            ),
            disabled: pokemonDetails?.held_item ? false : true
        },
        showEvolution > 1 ? // only shows evolve pokemon button if the pokemon has any evolution form!
        {
            key: 4,
            label: 'Select evolution',
            children: children
        } : showEvolution != 0 ?
        {
            key: 4,
            label: (
                pokemonDetails?.evolution?.map(evolution => (

                    evolution.id <= totalPokemon ?

                        evolution.method == 'trade' && evolution.held_item ?
                            <span key={ evolution.id }><Image style={{ margin:0 }} src={ saveFile?.shop.items.find(item => item.name == evolution.held_item)?.icon }/> Evolves to { FirstLetterToUpper(evolution.evolution) }</span>      

                        : evolution.method == 'use-item' ? 
                            <span key={ evolution.id }><Image style={{ margin:0 }} src={ saveFile?.shop.items.find(item => item.name == evolution.item)?.icon }/> Evolves to { FirstLetterToUpper(evolution.evolution) }</span>
                        
                        : 
                            <span 
                                key={ evolution.id }
                                onClick={ () => player.rareCandy >= rareCandy ? TriggerEvolution(evolution.evolution) : null } 
                            >
                                x{ rareCandy }<Image style={{ margin: 0 }} src={ rareCandyIcon }/> Evolves to { FirstLetterToUpper(evolution.evolution) }
                            </span>
                    : null
                ))
            ),
            disabled: pokemonDetails && pokemonDetails.evolution ? 
                pokemonDetails.evolution[0].method == 'level-up' && player.rareCandy >= rareCandy ? false : true
            : false
        }
        : null
    ];    

    return(
        <GameScreen>
            <Modal
                open={ openBag }
                title='Select an item from bag'
                closeIcon={false}
                onOk={() => GiveItem()}
                onCancel={() => { setOpenBag(false); setSelectedItem(null); }}
            >
                <>
                    {
                        saveFile?.bag.map(item => (

                            item.cuantity && item.cuantity > 0 ?
                            <Image 
                                key={ item.id }
                                title={ FirstLetterToUpper(item.name) } 
                                src={item.icon}
                                style={ item.name == selectedItem?.name ? { scale: '1.25', cursor: 'pointer' } : { cursor: 'pointer'} }
                                onClick={() => setSelectedItem(item)}
                            /> : null
                        ))
                    }
                </>
            </Modal>
            <div className="detailsHeader">
                <div className="arrow">
                    <ArrowLeftOutlined onClick={ () =>  { 
                            navigate("..", { relative: "path" }) ;

                            const saveFileCopy = saveFile;

                            if(saveFileCopy && saveFileCopy.player)
                            {
                                saveFileCopy.player.pokemonDetails = undefined;

                                SaveGame(saveFileCopy);
                            }
                        }}
                    />
                </div>
                <div className="rareCandy">
                    <Image src={ rareCandyIcon }/>
                    <h4>x{ player.rareCandy }</h4>
                </div>
            </div>
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
                                    <Dropdown 
                                        trigger={['click']} 
                                        menu={{ items: items }}
                                    >
                                        <Tooltip title='Actions'><SettingFilled/></Tooltip>
                                    </Dropdown>
                                </div>
                                <Image className="pokemonIcon" src={ pokemonDetails.shiny ? pokemonDetails.sprites.front_shiny : pokemonDetails?.sprites.front_default }/>
                            </div>
                            <div className='stats'>
                                <h3>Height: { pokemonDetails.height / 10 } m.</h3>
                                <h3>Weight: { pokemonDetails.weight / 10 } kg.</h3>
                                <h3>Moves: { pokemonDetails.moves.map(move => FirstLetterToUpper(move.move.name)).join(", ") } </h3>
                                { 
                                    pokemonDetails.held_item ? 
                                        <h3>Held item: &nbsp;
                                            <strong>{ FirstLetterToUpper(pokemonDetails.held_item.item?.name) }</strong>
                                            { pokemonDetails.held_item.item?.icon ? <Image title={FirstLetterToUpper(pokemonDetails.held_item.item?.name)} src={pokemonDetails.held_item?.item.icon}/> : null }
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

