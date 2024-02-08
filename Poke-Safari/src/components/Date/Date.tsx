import { useState } from 'react';
import appUtils from 'src/utils/appUtils';
import './Date.css';

const Date = () => {

    const { GetCustomDate } = appUtils();
    
    const [ date, setDate ] = useState<string>(GetCustomDate());

    setInterval(() => setDate(GetCustomDate()), 1000);

    return(
        <h3 id='date'>{date}</h3>    
    )
}

export default Date;