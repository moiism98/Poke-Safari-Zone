import {  useState } from "react";

const SetAppFont = () => {

    const [ appFont, setAppFont ] = useState<string>();

    return {

        appFont,
        setAppFont
    }
}

export default SetAppFont