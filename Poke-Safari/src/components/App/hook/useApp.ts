import { useContext } from 'react';
import { Context } from 'src/context/AppContext';
import day from 'src/assets/img/Backgrounds/day.svg';
import afternoon from 'src/assets/img/Backgrounds/afternoon.svg';
import night from 'src/assets/img/Backgrounds/night.svg';
import background from 'src/assets/img/Index/safari-zone-cover.svg';
import { format } from '@formkit/tempo';

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
        nextLevelExperience: 15,
        maxLevel: 30,
        pokemonPoint: `https://pokeapi.co/api/v2/pokemon`,
        pokeSpeciesPoint: `https://pokeapi.co/api/v2/pokemon-species`,
    }

    const gameScreen: React.CSSProperties = {
        backgroundImage: `url(${ background })`,
        border: options.frame?.styles.border,
        borderRadius: options.frame?.styles.borderRadius
    }

    const FirstLetterToUpper = (string: string) => {
        
        return string.charAt(0).toUpperCase() + string.substring(1, string.length)
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

    return {
        gameScreen,
        appConsts,
        FirstLetterToUpper,
        GetBackground,
        GetCustomDate
    }  
}

export default useApp