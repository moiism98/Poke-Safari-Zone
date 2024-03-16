import "./PokemonDetails.css";
import Evolution from "./Evolution";
import GameScreen from "src/components/GameScreen/GameScreen";
import usePokemonDetails from "src/components/pokemon/hook/usePokemonDetails";
import { Image } from "react-bootstrap";
import { ArrowLeftOutlined, StarFilled, SettingFilled } from '@ant-design/icons';
import { Dropdown, MenuProps, Modal, Tooltip, Typography, message } from "antd";
import { createElement, useState } from "react";
import { CatchedPokemon, Held_Items, Item } from "src/interfaces/interfaces";

const PokemonDetails = () => {

    const { saveFile, options, appConsts, navigate, pokemonDetails, setPokemonDetails, loading, nickname, inTeam, 
        pokemonTeam, onChange, addToTeam, removeFromTeam, GetTypeIcon, FirstLetterToUpper, SaveGame } = usePokemonDetails();

    const [ openBag, setOpenBag ] = useState<boolean>(false);

    const [ selectedItem, setSelectedItem ] = useState<Item | null>();

    const items: MenuProps['items'] = [
        {
            key: '1',
            label:(
                pokemonDetails ?
                    !inTeam ? 
                        pokemonTeam.length < appConsts.maxTeam ? <span onClick={() => addToTeam(pokemonDetails)}>Add pokemon to the team</span>
                            : null
                    : <span onClick={ () => removeFromTeam(pokemonDetails) }>Remove from the team</span>
                : null  
            )
        },
        {
            key: 2,
            label:( <span onClick={() => setOpenBag(true) }>Give item</span> )
        },
        {
            key: 3,
            label: ( 
                <span 
                    onClick={() => {

                        if(pokemonDetails?.held_item)
                            GetItem(); 
                    }
        }
                >Get item
                </span> 
            ),
            disabled: pokemonDetails?.held_item ? false : true
        }
    ];

    const GiveItem = () => {
        
        if(selectedItem)
        {
            if(pokemonDetails)
            {
                const saveFileCopy = saveFile;
    
                if(saveFileCopy)
                {
                    const pokemon: CatchedPokemon | undefined = saveFileCopy.myPokemons.find(pokemon => pokemon.listId == pokemonDetails.listId);

                    const bagItem: Item | undefined = saveFileCopy.bag.find(item => item.id == selectedItem.id);

                    if(pokemonDetails.held_item)
                    {    
                        const heldItem = pokemonDetails.held_item.item.name.split('-').map(item => (item)).join(" ");
    
                        const icon = createElement('img', { style: { margin: 0 }, src: pokemonDetails.held_item.item.icon});
    
                        message.info({
                            icon: icon,
                            content: `${ FirstLetterToUpper(heldItem) } was sent to the bag!`
                        });

                        const itemInBag: Item | undefined = saveFileCopy.bag.find(item => item.id == pokemonDetails.held_item?.item.id);
                        
                        if(itemInBag)
                        {
                            itemInBag.cuantity += 1;
                        }
                        else
                        {
                            const inShop: Item | undefined = saveFileCopy.shop.items.find(item => item.id == pokemonDetails.held_item?.item.id);

                            const toSaveItem: Item = {
                                id: pokemonDetails.held_item.item.id,
                                icon: pokemonDetails.held_item.item.icon,
                                name: pokemonDetails.held_item.item.name,
                                cuantity: 1,
                                price: 1,
                                sellPrice: 200
                            }

                            if(inShop)
                            {
                                toSaveItem.price = inShop.price;

                                toSaveItem.sellPrice = inShop.price;
                            }

                            saveFileCopy.bag.push(toSaveItem);
                        }
                    }

                    const newHeldItem: Held_Items = {
                        item: {
                            id: selectedItem.id,
                            icon: selectedItem.icon,
                            name: selectedItem.name
                        }
                    };
                
                    setPokemonDetails({ ...pokemonDetails, held_item: newHeldItem });

                    if(pokemon && bagItem)
                    {
                        pokemon.held_item = newHeldItem;
                        
                        bagItem.cuantity -= 1;
                    }

                    SaveGame(saveFileCopy);
    
                    setOpenBag(false);
        
                    setSelectedItem(null);
                }
            }

        }
        else
        {
            message.error("You have to select an item to equip it!");
        }
    }

    const GetItem = () => {

        if(pokemonDetails)
            {
                const saveFileCopy = saveFile;
    
                if(saveFileCopy)
                {
                    if(pokemonDetails.held_item)
                    {
                        const heldItem = pokemonDetails.held_item.item.name.split('-').map(item => (item)).join(" ");
    
                        const icon = createElement('img', { style: { margin: 0 }, src: pokemonDetails.held_item.item.icon});
    
                        message.info({
                            icon: icon,
                            content: `${ FirstLetterToUpper(heldItem) } was sent to the bag!`
                        });

                        const itemInBag: Item | undefined = saveFileCopy.bag.find(item => item.id == pokemonDetails.held_item?.item.id);
                        
                        if(itemInBag)
                        {
                            itemInBag.cuantity += 1;
                        }
                        else
                        {
                            const inShop: Item | undefined = saveFileCopy.shop.items.find(item => item.id == pokemonDetails.held_item?.item.id);

                            const toSaveItem: Item = {
                                id: pokemonDetails.held_item.item.id,
                                icon: pokemonDetails.held_item.item.icon,
                                name: pokemonDetails.held_item.item.name,
                                cuantity: 1,
                                price: 1,
                                sellPrice: 200
                            }

                            if(inShop)
                            {
                                toSaveItem.price = inShop.price;

                                toSaveItem.sellPrice = inShop.price;
                            }

                            saveFileCopy.bag.push(toSaveItem);
                        }
                    }
                
                    setPokemonDetails({ ...pokemonDetails, held_item: null });

                    const pokemon: CatchedPokemon | undefined = saveFileCopy.myPokemons.find(pokemon => pokemon.listId == pokemonDetails.listId);

                    if(pokemon)
                    {
                        pokemon.held_item = null;
                    }

                    SaveGame(saveFileCopy);
                }
            }
    }
    

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
                                title={ FirstLetterToUpper(item.name) } 
                                src={item.icon}
                                style={ item.name == selectedItem?.name ? { scale: '1.25', cursor: 'pointer' } : { cursor: 'pointer'} }
                                onClick={() => setSelectedItem(item)}
                            /> : null
                        ))
                    }
                </>
            </Modal>
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
                                <h3>Height: { pokemonDetails.height } ft.</h3>
                                <h3>Weight: { pokemonDetails.weight } kg.</h3>
                                <h3>Moves: { pokemonDetails.moves.map(move => FirstLetterToUpper(move.move.name)).join(", ") } </h3>
                                { 
                                    pokemonDetails.held_item ? 
                                        <h3>Held item: &nbsp;
                                            <strong>{ FirstLetterToUpper(pokemonDetails.held_item.item.name) }</strong>
                                            { pokemonDetails.held_item.item.icon ? <Image title={FirstLetterToUpper(pokemonDetails.held_item.item.name)} src={pokemonDetails.held_item?.item.icon}/> : null }
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

