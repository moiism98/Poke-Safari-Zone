import { SaveFile } from "src/interfaces/interfaces";

const useContext = () => {

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
        GetSaveFile
    }
}

export default useContext;