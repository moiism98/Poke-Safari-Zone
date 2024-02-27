import { Input, Button, Form, Select } from 'antd';
import { PokemonList, SafariZone, SaveFile, StaticZone, ZonePokemon, icon } from 'src/interfaces/interfaces';
import { useContext, useEffect, useState } from 'react';
import { Context } from 'src/context/AppContext';
import { Image } from 'react-bootstrap';
import safariZone from 'src/assets/json/safari_zones.json'
import Modal from 'antd/es/modal';
import frameStyles from 'src/utils/App/frameStyles';
import playerIcons from 'src/utils/NewPlayer/playerIcons';
import useApp from 'src/components/App/hook/useApp';

import cave from 'src/assets/img/Zones/cave.svg';
import desert from 'src/assets/img/Zones/desert.svg';
import forest from 'src/assets/img/Zones/forest.svg';
import lake from 'src/assets/img/Zones/lake.svg';
import plains from 'src/assets/img/Zones/plains.svg';
import ruins from 'src/assets/img/Zones/ruins.svg';
import sea from 'src/assets/img/Zones/sea.svg';
import volcano from 'src/assets/img/Zones/crater.svg';



const zones: StaticZone[] = safariZone.zones;


const NewGame = () => {

    const { setSaveFile, allPokemons } = useContext(Context);

    const { appConsts } = useApp();

    const { frame_styles } = frameStyles();

    const { icons } = playerIcons()

    const { Option } = Select;

    const [ openModal, setOpenModal ] = useState<boolean>(true);

    const GenerateZonesPokemon = ( toCreateZone: string ) => {

        const pokemon: ZonePokemon[] = []

        if(allPokemons)
        {
            let zonePokemon = 0;

            const staticZone: StaticZone | undefined  = zones.find(zone => zone.name == toCreateZone);

            if(staticZone)
            {
                while(zonePokemon < staticZone.pokemon.length)
                {
                    const poke: PokemonList | undefined = allPokemons.find(pkmn => pkmn.name == staticZone.pokemon[zonePokemon].name)

                    const unlocked = staticZone.pokemon[zonePokemon].unlocked;

                    if(poke)
                    {
                        fetch(`https://pokeapi.co/api/v2/pokemon-species/${poke.id}/`)
                        .then(response => response.ok ? response.json() : console.warn("Problems have been found, it's not possible to connect!"))
                        .then(data => { 
                            pokemon.push(
                            {
                                id: poke.id,
                                name: poke.name,
                                encounter_rate: data.pal_park_encounters[0].rate,
                                catch_rate: data.capture_rate,
                                unlocked: unlocked,
                                catched: 0,
                                seen: 0
                            }
                        )})
                    }

                    zonePokemon++
                }
            }
        }

        return pokemon;
    }

    const ZoneUnlocked = (toCreateZone: string) => {

        let unlocked = null;

        const staticZone: StaticZone | undefined  = zones.find(zone => zone.name == toCreateZone);

        if(staticZone)
        {
            if(staticZone.unlocked)
            {
                unlocked = staticZone.unlocked;
            }
        }

        return unlocked;
    }

    const safariZones: SafariZone[] = [
        {
            id: 1,
            name: 'Cave',
            portrait: cave,
            pokemon: GenerateZonesPokemon('cave'),
            unlocked: ZoneUnlocked('cave')
        },
        {
            id: 2,
            name: 'Desert',
            portrait: desert,
            pokemon: GenerateZonesPokemon('desert'),
            unlocked: ZoneUnlocked('desert')
        },
        {
            id: 3,
            name: 'Forest',
            portrait: forest,
            pokemon: GenerateZonesPokemon('forest'),
            unlocked: ZoneUnlocked('forest')
        },
        {
            id: 4,
            name: 'Lake',
            portrait: lake,
            pokemon: GenerateZonesPokemon('lake'),
            unlocked: ZoneUnlocked('lake')
        },
        {
            id: 5,
            name: 'Plains',
            portrait: plains,
            pokemon: GenerateZonesPokemon('plains'),
            unlocked: ZoneUnlocked('plains')
        },
        {
            id: 6,
            name: 'Ruins',
            portrait: ruins,
            pokemon: GenerateZonesPokemon('ruins'),
            unlocked: ZoneUnlocked('ruins')
        },
        {
            id: 7,
            name: 'Sea',
            portrait: sea,
            pokemon: GenerateZonesPokemon('sea'),
            unlocked: ZoneUnlocked('sea')
        },
        {
            id: 8,
            name: 'Volcano',
            portrait: volcano,
            pokemon: GenerateZonesPokemon('volcano'),
            unlocked: ZoneUnlocked('volcano')
        }
    ]

    const onFinish = (data: { playerName: string, playerIcon: string }) => {

        let newSaveFile: SaveFile | null = null;

        const icon: icon | undefined = icons.find(icon => icon.name == data.playerIcon)

        if(icon)
        {
            newSaveFile = {
                seenPokemons: [],
                myPokemons: [],
                safariZones: safariZones,
                options: {
                    font: 'pkmndp',
                    frame: frame_styles[0],
                    icon: icon,
                    createDate: new Date()
                },
                bag: [],
                player: {
                    name: data.playerName,
                    experience: 0,
                    level: 1,
                    nextLevelExperience: appConsts.nextLevelExperience
                },
                statistics:{
                    seen: 0,
                    catched: 0,
                    shiny: 0
                }
            };
        }

        localStorage.setItem('saveFile', JSON.stringify(newSaveFile))

        setOpenModal(false);
    }

    

    // when we close the modal, we update the saveFile state (with the localStorage value) to reload the index component!

    useEffect(() => {
    
        console.log('New game created successfully!');

        const saveFile: string | null = localStorage.getItem('saveFile')

        if(saveFile)
        {
            setSaveFile(JSON.parse(saveFile))
        }

    }, [ openModal, setSaveFile ])

    return(
        <Modal
            open = { openModal }
            footer =  { <></> }
            closeIcon = { false }
            title='Create a new game!'
        >
            <Form 
                onFinish={ onFinish }
            >

                <Form.Item<string>
                    label = "Player name: "
                    name = "playerName"
                    rules={[

                        { required: true, message: "Please don't forget to introduce a player's name!" }, 
                        { type: 'string', min: 3, message: "Player's name must be have at least 3 characters..." }
                    ]}
                >
                    <Input placeholder="Introduce a player's name..." allowClear/>
                </Form.Item>

                <Form.Item name="playerIcon" label="Player icon" rules={[{ required: true, message: 'Please select an icon!' }]}>
                    <Select
                        placeholder="Select an icon..."
                        allowClear
                    >
                        {
                            icons.map(icon => (
                                    
                                <Option key={icon.id} value={icon.name}>
                
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <span>{icon.name}</span>
                                        <Image src={icon.icon}/>
                                    </div>
                                
                                </Option>
                            ))
                        }

                    </Select>
                </Form.Item>

                <Form.Item style={{display:'flex', justifyContent: 'flex-end', paddingTop: '2em', margin: 0}}>
                    <Button type='primary' htmlType='submit'> BEGIN ! </Button>
                </Form.Item>

            </Form>
        </Modal>    
    )
}

export default NewGame