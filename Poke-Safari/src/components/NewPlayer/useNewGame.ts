import cave from 'src/assets/img/Zones/cave.svg';
import desert from 'src/assets/img/Zones/desert.svg';
import forest from 'src/assets/img/Zones/forest.svg';
import lake from 'src/assets/img/Zones/lake.svg';
import plains from 'src/assets/img/Zones/plains.svg';
import ruins from 'src/assets/img/Zones/ruins.svg';
import sea from 'src/assets/img/Zones/sea.svg';
import volcano from 'src/assets/img/Zones/crater.svg';

import safariZone from 'src/assets/json/safari_zones.json';

import frameStyles from 'src/utils/App/frameStyles';
import useApp from 'src/components/App/hook/useApp';
import playerIcons from 'src/utils/NewPlayer/playerIcons';
import { PokemonList, Portraits, SafariZone, SaveFile, StaticZone, ZonePokemon, Icon, Unlock } from 'src/interfaces/interfaces';
import { useContext, useEffect, useState } from 'react';
import { Context } from 'src/context/AppContext';

const useNewGame = () => {

    const { setSaveFile, allPokemons } = useContext(Context);
    
    const { appConsts } = useApp();
    
    const { frame_styles } = frameStyles();
    
    const { icons } = playerIcons();
    
    const [ openModal, setOpenModal ] = useState<boolean>(true);
    
    const portraits: Portraits[] = [
        {
            name: 'cave',
            src: cave
        },
        {
            name: 'desert',
            src: desert
        },
        {
            name: 'forest',
            src: forest
        },
        {
            name: 'lake',
            src: lake
        },
        {
            name: 'plains',
            src: plains
        },
        {
            name: 'ruins',
            src: ruins
        },
        {
            name: 'sea',
            src: sea
        },
        {
            name: 'volcano',
            src: volcano
        }
    ]

    const SafariZones = () => {
    
        let zoneID = 1;

        const sZones: SafariZone[] = [];

        zones.map(zone => {
        
            sZones.push({

                id: zoneID,
                name: zone.name,
                pokemon: GenerateZonesPokemon(zone.name),
                portrait: GetZonePortrait(zone.name),
                unlock: ZoneUnlock(zone.name),
            })

            zoneID++;
        })

        return sZones;

    }

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

                    const unlock = staticZone.pokemon[zonePokemon].unlock;

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
                                unlock: unlock,
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

    const GetZonePortrait = (zone: string) => {
        
        const portrait: Portraits | undefined = portraits.find(portrait => portrait.name == zone); 

        let src: string = ''

        if(portrait)
        {
            src = portrait.src;
        }

        return src;
    }

    const ZoneUnlock = (toCreateZone: string) => {

        let unlock: Unlock | null = null;

        const staticZone: StaticZone | undefined  = zones.find(zone => zone.name == toCreateZone);

        if(staticZone)
        {
            if(staticZone.unlock)
            {
                unlock = staticZone.unlock;
            }
        }

        return unlock;
    }

    const onFinish = (data: { playerName: string, playerIcon: string }) => {

        let newSaveFile: SaveFile | null = null;

        const icon: Icon | undefined = icons.find(icon => icon.name == data.playerIcon)

        if(icon)
        {
            newSaveFile = {
                seenPokemons: [],
                myPokemons: [],
                safariZones: safariZones,
                options: {
                    font: 'pkmndp',
                    frame: frame_styles[0],
                    icon: icon
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
    
        
        const saveFile: string | null = localStorage.getItem('saveFile')
        
        if(saveFile)
        {
            console.log('New game created successfully!');
            
            setSaveFile(JSON.parse(saveFile))
        }

    }, [ openModal, setSaveFile ])

    /*const method = (id: number, name: string | string[] | undefined) => {
        message.info(`This method is for the catch unlock with id: ${id}
        , and using these pokemon to unlock something: ${name}`);
    }*/

    const zones: StaticZone[] = safariZone.zones;

    const safariZones = SafariZones();

    return{
        openModal,
        onFinish
    }

}

export default useNewGame