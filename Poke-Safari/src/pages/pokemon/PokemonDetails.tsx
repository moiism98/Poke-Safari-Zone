import "./PokemonDetails.css";
import Evolution from "./Evolution";
import GameScreen from "src/components/GameScreen/GameScreen";
import usePokemonDetails from "src/components/pokemon/hook/usePokemonDetails";
import { Image } from "react-bootstrap";
import { ArrowLeftOutlined, StarFilled, SettingFilled, SoundFilled } from '@ant-design/icons';
import { Dropdown, MenuProps, Modal, Tooltip, Typography } from "antd";
import { useEffect, useState } from "react";
import Loading from "src/components/Spinners/Loading/Loading";
import { Evolution as IEvolution } from "src/interfaces/interfaces";

const PokemonDetails = () => {

    const { 
        saveFile, options, appConsts, player, totalPokemon, evolving, bag, setBag,
        navigate, pokemonDetails, showEvolution, rareCandyIcon, rareCandy, 
        nickname,inTeam, pokemonTeam, openBag, setOpenBag, selectedItem, 
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
                            <span 
                                key={ evolution.id }
                                onClick={ () => onHeldItem(evolution) }
                            >
                                Equip with 
                                <Image 
                                    title={ FirstLetterToUpper(evolution.held_item) } 
                                    style={{ margin:0 }} 
                                    src={ saveFile?.shop.items.find(item => item.name == evolution.held_item)?.icon }
                                /> and evolve to { FirstLetterToUpper(evolution.evolution) }
                            </span> 
                        : evolution.method == 'use-item' ? 
                            <span 
                                key={ evolution.id }
                                onClick={ () => onUseItem(evolution) }
                            >
                                Use 
                                <Image 
                                    title={ evolution.item ? FirstLetterToUpper(evolution.item) : '' } 
                                    style={{ margin:0 }} src={ saveFile?.shop.items.find(item => item.name == evolution.item)?.icon }
                                /> 
                                and evolve to { FirstLetterToUpper(evolution.evolution) }
                            </span>                        
                        : 
                            <span 
                                key={ evolution.id }
                                onClick={ () => player.rareCandy >= rareCandy ? TriggerEvolution(evolution.evolution) : null } 
                            >
                                x{ rareCandy }<Image style={{ margin: 0 }} src={ rareCandyIcon }/> Evolves to { FirstLetterToUpper(evolution.evolution) }
                            </span>   
                        ),
                        disabled: onDisabled(evolution)
                    })

                : null
            })

            setChildren(children);
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ showEvolution ])

    const onDisabled = (evolution?: IEvolution) => {
    
        let disabled: boolean = true;

        if(pokemonDetails)
        {
            let pokemonEvolution = pokemonDetails.evolution ? pokemonDetails.evolution[0] : null;

            if(evolution)
            {
                pokemonEvolution = evolution;
            }

            if(pokemonEvolution && pokemonEvolution.method)
            {
                const method = pokemonEvolution.method;

                if(method == 'trade' && pokemonEvolution?.held_item)
                {
                    if(pokemonEvolution.held_item == pokemonDetails.held_item?.item.name)
                    {
                        disabled = false;
                    }
                }
                else if(pokemonEvolution.method == 'use-item')
                {
                    const item = bag.find(item => item.name == pokemonEvolution?.item);
                        
                    if(item && pokemonEvolution.item == item.name && item.cuantity > 0)
                    {
                        disabled = false;
                    }
                }
                else if(method == 'level-up' && player.rareCandy >= rareCandy || method == 'trade' && player.rareCandy >= rareCandy)
                {
                    disabled = false;
                }
            }
        }

        return disabled;
    }

    const onUseItem = (evolution: IEvolution) => {

        const saveFileCopy = saveFile;
                                    
        if(saveFileCopy)
        {
            const item = saveFileCopy.bag.find(item => item.name == evolution.item);

            if(item && item.cuantity > 0)
            {                
                item.cuantity -= 1;

                setBag(saveFileCopy.bag);

                SaveGame(saveFileCopy);

                TriggerEvolution(evolution.evolution);
            }
        }
    }

    const onHeldItem = (evolution: IEvolution) => {

        if(evolution.held_item == pokemonDetails?.held_item?.item.name)
        {
            TriggerEvolution(evolution.evolution);
        }
    }

    const items: MenuProps['items'] = [
        {
            key: 1,
            label:(
                pokemonDetails ?
                    !inTeam ? 
                        pokemonTeam.length < appConsts.maxTeam ? <span onClick={ () => addToTeam(pokemonDetails) }>Add pokemon to the team</span>
                            : <span>Team is full already!</span>
                    : <span onClick={ () => removeFromTeam(pokemonDetails) }>Remove from the team</span>
                : null  
            ),
            disabled: inTeam ? false : pokemonTeam.length == appConsts.maxTeam ? true : false 
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
                            <span 
                                key={ evolution.id }
                                onClick={ () => onHeldItem(evolution) }
                            >
                                Equip with 
                                <Image 
                                    title={ FirstLetterToUpper(evolution.held_item) } 
                                    style={{ margin:0 }} 
                                    src={ saveFile?.shop.items.find(item => item.name == evolution.held_item)?.icon }
                                /> and evolve to { FirstLetterToUpper(evolution.evolution) }
                            </span>      

                        : evolution.method == 'use-item' ? 
                            <span 
                                key={ evolution.id }
                                onClick={ () => onUseItem(evolution) }
                            >
                                Use 
                                <Image 
                                    title={ evolution.item ? FirstLetterToUpper(evolution.item) : '' } 
                                    style={{ margin:0 }} src={ saveFile?.shop.items.find(item => item.name == evolution.item)?.icon }
                                /> 
                                and evolve to { FirstLetterToUpper(evolution.evolution) }
                            </span>
                        
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
            disabled: onDisabled()
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
                { evolving ? <Loading/> : null }
                {
                    pokemonDetails ? 
                        <div className="pokemonDetails" style={{ height: pokemonDetails.evolution ? '75%' : '100%' }}>
                            <audio id="audio" src={ pokemonDetails.cry }></audio>
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
                                <SoundFilled onClick={() => {

                                    const audio: HTMLAudioElement = document.getElementById("audio");

                                    if(audio) audio.play()

                                }}/>
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

