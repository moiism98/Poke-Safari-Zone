import { SaveFile } from "src/interfaces/interfaces";
import SetAppFont from "src/utils/Context/setAppFont";
import SetFrame from "src/utils/Context/setFrame";

const useContextUtils = () => {

    const { appFont, setAppFont } = SetAppFont();

    const { frame, setFrame, frame_styles } = SetFrame();

    const GetSaveFile = () => {

        const save: string | null = localStorage.getItem('saveFile');

        let saveFile: SaveFile | null = null;

        if(save)
        {
            saveFile = JSON.parse(save);
    
            if(!saveFile)
            {
                localStorage.setItem('saveFile', JSON.stringify(null));
    
                saveFile = null;
            }
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