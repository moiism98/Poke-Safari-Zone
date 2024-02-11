import day from 'src/assets/img/Backgrounds/day.svg';
import afternoon from 'src/assets/img/Backgrounds/afternoon.svg';
import night from 'src/assets/img/Backgrounds/night.svg';

const appUtils = () => {

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
        else if(hours >= 16 && hours <= 20) background = afternoon;
        else background = night;

        document.body.style.setProperty('background-image', `url(${background})`);
        
    }

    const SetFont = (font: string) =>
    {
        document.body.style.setProperty('font-family', font);
    }

    return{
        GetBackground,
        SetFont,
        GetCustomDate
    }
}

export default appUtils;