import { useContext } from 'react';
import { Context } from 'src/context/AppContext';
import day from 'src/assets/img/Backgrounds/day.svg';
import afternoon from 'src/assets/img/Backgrounds/afternoon.svg';
import night from 'src/assets/img/Backgrounds/night.svg';
import background from 'src/assets/img/Index/safari-zone-cover.svg';
import { format } from '@formkit/tempo';
import { Evolution } from 'src/interfaces/interfaces';

const useApp = () => {

    const { options } = useContext(Context)

    const appConsts = {
        maxTeam: 6,
        shinyProbability: 1,
        maxCatchRate: 255,
        rateModdifier: 5,
        maxModRateValue: 60,
        defaultRateValue: 20,
        minFleeRate: 25,
        nextLevelExperience: 5,
        maxLevel: 30,
        pokemonPoint: `https://pokeapi.co/api/v2/pokemon`,
        pokeSpeciesPoint: `https://pokeapi.co/api/v2/pokemon-species`,
    }

    const gameScreen: React.CSSProperties = {
        backgroundImage: `url(${ background })`,
        border: options.frame?.styles.border,
        borderRadius: options.frame?.styles.borderRadius
    }

    const FirstLetterToUpper = (string: string | undefined) => {
        
        if(string)
        {
            return string.charAt(0).toUpperCase() + string.substring(1, string.length)
        }

    }

    const GetCustomDate = () => {

        const dateFormat: string = "ddd DD/MM/YYYY HH:mm:ss";

        return format({ date: new Date(), format: dateFormat, locale: "en"});
    }

    const GetBackground = () => {
        
        const date = new Date();

        const hours: number = date.getHours();

        let background: string = '';

        if(hours >= 8 && hours <= 15) background = day;
        else if(hours >= 16 && hours <= 20)  background = afternoon;
        else 
        {
            document.getElementById("date")?.style.setProperty('color' , 'rgba(255, 255, 255, 0.55)');
         
            background = night;
        }

        document.body.style.setProperty('background-image', `url(${background})`);
        
    }

    const getPokemonEvolution = async(id: number, name: string) => {
    
        if(id && name)
        {
        
            let evolution_src: string = '';
    
            await fetch(`${appConsts.pokeSpeciesPoint}/${id}`)
            .then(response => response.ok ? response.json() : console.warn('No data received!'))
            .then(data => evolution_src = data.evolution_chain.url);

            let evolution: Evolution[] | null = [];

            await fetch(evolution_src)
            .then(response => response.ok ? response.json() : console.warn('No data received!'))
            .then(data => {

                if(data.chain.evolves_to.length > 0)
                {

                    if(data.chain.evolves_to[0].evolves_to)
                    {
                        /*  
                            In the first conditional we check if we found the same pokemon at the evolution chain.
                            If we found 'ourselves' on it, we omit this case, because we do not want to evolve
                            clefairy on clefairy, this happen when the pokemon we want to evolve is in the middle of his evolution chain.
                            E.g we want clefairy's evolution who is in the middle of his evolution chain (cleffa - clefairy - clefable)
                            cleffa would pass through this conditional because clefairy is his next evolution but clefairy doesn't
                            so we ignore this first conditional.
                        */

                        if(data.chain.evolves_to[0].evolution_details[0] && data.chain.evolves_to[0].species.name != name)
                        {
                            // we loop the array because some pokemon has more than one evolution.

                            data.chain.evolves_to.map((evo: { evolution_details: { trigger: { name: string; }; held_item: { name: string }; item: { name: string } }[]; species: { name: string; }; }) => {
                                
                                //console.log(evo);

                                evolution?.push({ 
                                
                                    held_item: evo.evolution_details[0].held_item?.name,
                                    item: evo.evolution_details[0].item?.name,
                                    method: evo.evolution_details[0].trigger?.name,
                                    evolution: evo.species?.name
            
                                }) 
                            
                            })
                        }
                        else if(data.chain.evolves_to[0].evolves_to[0])
                        {
                            // this conditional is for the last pokemon evolution ever, again we loop the evos array
                            // because some pokemon has more then 1 evolution.

                            data.chain.evolves_to[0].evolves_to.map((evo: { evolution_details: { trigger: { name: string; }; held_item: { name: string }; item: { name: string } }[]; species: { name: string; };  }) =>
                                { 
                                    //console.log(evo);

                                    evolution?.push({ 
                                    
                                        held_item: evo.evolution_details[0].held_item?.name,
                                        item: evo.evolution_details[0].item?.name,
                                        method: evo.evolution_details[0].trigger?.name,
                                        evolution: evo.species?.name
            
                                    })
                                }
                            )
                        }
                    }
                }

            });

            // evolution is null when the pokemon is a full evolution (e.g mantine) 
            // or he doesn't have any evolution (e.g torkoal)

            if(evolution.length == 0) evolution = null;

            return evolution;
        }
    }

    return {
        gameScreen,
        appConsts,
        getPokemonEvolution,
        FirstLetterToUpper,
        GetBackground,
        GetCustomDate
    }  
}

export default useApp