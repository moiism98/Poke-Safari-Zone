import { useEffect, useState } from "react"
import { Frame } from "src/interfaces/interfaces";

const SetFrame = () => {

    const frame_styles: Frame[] = [
        {
            name: 'default',
            styles: {
                border: '10px solid #52506e',
                borderRadius: '5px'
            }
        },
        {
            name: 'purple',
            styles: {
                border: '18px ridge #92ABEF'
            }
        },
        {
            name: 'fireRed',
            styles: {
                border: '10px solid #d04028',
                borderRadius: '5px'
            }
        },
        {
            name: 'leafGreen',
            styles: {
                border: '10px solid #38ae40',
                borderRadius: '5px'
            }
        },
        {
            name: 'classic',
            styles:{
                border: '10px double #000000',
                borderRadius: '5px'
            }
        }
    ]

    const GetGameScreenFrame = () => {
        
        let frame: Frame = JSON.parse(localStorage.getItem('frame'));

        if(!frame)
        {
            const defaultStyle: Frame = {
                name: 'default',
                styles: {
                    border: '10px solid #52506e',
                    borderRadius: '5px'
                }
            }

            localStorage.setItem('frame', JSON.stringify(defaultStyle));

            frame = defaultStyle;
        }

        return frame;
    }

    const SetGameScreenFrame = (frame: Frame) => {
        
        localStorage.setItem('frame', JSON.stringify(frame));

        return frame;
    }

    const [ frame, setFrame ] = useState<Frame>(GetGameScreenFrame());

    useEffect(() => {

        if(frame)
        {
            SetGameScreenFrame(frame);
        }

    }, [ frame ])

    return{
        frame,
        setFrame,
        frame_styles
    }
}

export default SetFrame