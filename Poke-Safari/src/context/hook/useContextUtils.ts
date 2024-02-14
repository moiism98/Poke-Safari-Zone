import { SaveFile } from "src/interfaces/interfaces";
import SetAppFont from "src/utils/Context/setAppFont";
import SetFrame from "src/utils/Context/setFrame";

const useContextUtils = () => {

    const { appFont, setAppFont } = SetAppFont();

    const { frame, setFrame, frame_styles } = SetFrame();

    const GetSaveFile = () => {

        let saveFile: SaveFile = JSON.parse(localStorage.getItem('saveFile'));

        if(!saveFile)
        {
            const newSaveFile: SaveFile = {
                seenPokemons: [],
                myPokemons: [],
                safariZones: [],
                options: {
                    font: 'pkmndp',
                    frame: frame_styles[0],
                    icon: ''
                },
                bag: [],
                player: null
            };

            localStorage.setItem('saveFile', JSON.stringify(newSaveFile));

            saveFile = newSaveFile;
        }

        return saveFile;

    }

    return {
        options: {

            appFont,
            setAppFont,
            frame,
            setFrame,
            frame_styles,
        },
        GetSaveFile
    }
}

export default useContextUtils;