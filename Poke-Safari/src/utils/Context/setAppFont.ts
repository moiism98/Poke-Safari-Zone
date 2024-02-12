import { useEffect, useState } from "react";

const SetAppFont = () => {

    const GetAppFont = () => {
        
        let savedFont: string | null = localStorage.getItem('font');

        if(!savedFont)
        {
            localStorage.setItem('font', 'pkmndp')
            
            savedFont = 'pkmndp';
        }

        return savedFont

    }

    const SetAppFont = (font: string) =>
    {
        document.body.style.setProperty('font-family', font);

        localStorage.setItem('font', font);
    }


    const [ appFont, setAppFont ] = useState<string>(GetAppFont());

    useEffect(() => {

        if(appFont)
        {
            SetAppFont(appFont);
        }
        
    }, [ appFont ])

    return{
        appFont,
        setAppFont,
    }
}

export default SetAppFont