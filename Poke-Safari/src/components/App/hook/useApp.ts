import { useContext } from 'react';
import { Context } from 'src/context/AppContext';
import day from 'src/assets/img/Backgrounds/day.svg';
import afternoon from 'src/assets/img/Backgrounds/afternoon.svg';
import night from 'src/assets/img/Backgrounds/night.svg';
import background from 'src/assets/img/Index/safari-zone-cover.svg';

const useApp = () => {

    const { options } = useContext(Context)

    const gameScreen = {
        backgroundImage: `url(${ background })`,
        border: options.frame?.styles.border,
        borderRadius: options.frame?.styles.borderRadius
    }

    const GetCustomDate = () => {

        const date = new Date();

        const weekDay: string = date.toDateString().substring(0, 3);

        const monthDay: string = date.toLocaleDateString().split('/')[0];

        const month: string = date.toLocaleDateString().split('/')[1];

        const customDate: string = `${weekDay} ${+monthDay < 10 ? '0' + monthDay : monthDay}/${+month < 10 ? '0' + month : month}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()}`
        
        // console.log(customDate);

        return customDate;
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
        GetBackground,
        GetCustomDate
    }  
}

export default useApp