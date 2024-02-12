import SetAppFont from "src/utils/Context/setAppFont";
import SetFrame from "src/utils/Context/setFrame";

const useContextUtils = () => {

    const { appFont, setAppFont } = SetAppFont();
    const { frame, setFrame, frame_styles } = SetFrame();

    return{
        appFont,
        setAppFont,
        frame,
        setFrame,
        frame_styles
    }
}

export default useContextUtils;