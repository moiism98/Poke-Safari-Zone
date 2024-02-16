import { useState } from 'react';
import './Date.css';
import useApp from '../App/hook/useApp';

const Date = () => {

    const { GetCustomDate } = useApp();
    
    const [ date, setDate ] = useState<string>(GetCustomDate());

    setInterval(() => setDate(GetCustomDate()), 1000);

    return <h3 id='date'>{date}</h3>    
}

export default Date;