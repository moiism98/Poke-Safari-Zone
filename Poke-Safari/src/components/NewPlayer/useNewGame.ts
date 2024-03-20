import safariZone from 'src/assets/json/safari_zones.json';
import dayCare from "src/assets/json/daycare.json";
import shop from "src/assets/json/shop_items.json";
import frameStyles from 'src/utils/App/frameStyles';
import useApp from 'src/components/App/hook/useApp';
import zonePortraits from 'src/utils/NewPlayer/portraits';
import playerIcons from 'src/utils/NewPlayer/playerIcons';
import { PokemonList, Portraits, SafariZone, SaveFile, StaticZone, ZonePokemon, Icon, Unlock, Item } from 'src/interfaces/interfaces';
import { useContext, useEffect, useState } from 'react';
import { Context } from 'src/context/AppContext';

const useNewGame = () => {

    const { setSaveFile, allPokemons } = useContext(Context);
    
    const { appConsts } = useApp();
    
    const { frame_styles } = frameStyles();
    
    const { icons } = playerIcons();

    const { portraits } = zonePortraits();
    
    const [ openModal, setOpenModal ] = useState<boolean>(true);

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
                rewards: ZoneRewards(zone.name)
            })

            zoneID++;
        })

        return sZones;

    }

    const ShopItems = () => {

        const items: Item[] = [];

        shop.items.map(async item => {
            await fetch(`https://pokeapi.co/api/v2/item/${item.id}/`)
            .then(response => response.ok ? response.json() : console.warn("No data received!"))
            .then(data => items.push({
                id: item.id,
                name: item.name,
                price: item.price,
                sellPrice: item.sellPrice,
                icon: data.sprites.default ? data.sprites.default : '',
                cuantity: 0
            }))
        })

        return items;
    }

    const ZoneRewards = (toCreateZone: string) => {
        
        const items: Item[] = [];

        const zone: StaticZone | undefined = zones.find(zone => zone.name == toCreateZone);

        if(zone)
        {
            zone.rewards?.map(async item => {

                let icon = ''; 

                await fetch(`https://pokeapi.co/api/v2/item/${item.id}`)
                .then(response => response.ok ? response.json() : console.warn('No data received!'))
                .then(data => icon = data.sprites.default)

                items.push({
                    id: item.id,
                    name: item.name,
                    icon: icon,
                    sellPrice: item.sellPrice,
                    price: 1,
                    cuantity: 0
                });
            })

        }
        
        return items;
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
                        fetch(`${appConsts.pokeSpeciesPoint}/${poke.id}`)
                        .then(response => response.ok ? response.json() : console.warn("Problems have been found, it's not possible to connect!"))
                        .then(data => { 
                            pokemon.push(
                            {
                                id: poke.id,
                                name: poke.name,
                                encounter_rate: data.pal_park_encounters[0].rate,
                                catch_rate: data.capture_rate,
                                unlock: unlock,
                                caught: 0,
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

        const icon: Icon | undefined = icons.find(icon => icon.name == data.playerIcon);

        if(icon)
        {
            newSaveFile = {
                seenPokemons: [],
                myPokemons: [],
                safariZones: safariZones,
                dayCare: {
                    unlock: dayCare.unlock,
                    pokemon: dayCare.pokemon
                },
                options: {
                    font: 'pkmndp',
                    frame: frame_styles[0],
                    icon: icon
                },
                bag: [
                    {
                        id: 483,
                        icon: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/mystery-egg.png',
                        name: 'mystery-egg',
                        cuantity: 0,
                        price: 1,
                        sellPrice: 1
                    }
                ],
                shop: {
                    unlock: shop.unlock,
                    items: shopItems
                },
                player: {
                    name: data.playerName,
                    money: 5000,
                    rareCandy: 0,
                    experience: 0,
                    level: 1,
                    nextLevelExperience: appConsts.nextLevelExperience,
                    pokemonDetails: undefined,
                    listId: 0
                },
                statistics:{
                    seen: 0,
                    caught: 0,
                    shiny: 0
                },
                pokemonTeam: []
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

    const zones: StaticZone[] = safariZone.zones;

    const safariZones = SafariZones();

    const shopItems = ShopItems();

    return{
        openModal,
        onFinish
    }

}

export default useNewGame