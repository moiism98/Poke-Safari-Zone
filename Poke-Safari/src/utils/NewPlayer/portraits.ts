import { Portraits } from "src/interfaces/interfaces"
import cave from 'src/assets/img/Zones/cave.svg';
import desert from 'src/assets/img/Zones/desert.svg';
import forest from 'src/assets/img/Zones/forest.svg';
import lake from 'src/assets/img/Zones/lake.svg';
import plains from 'src/assets/img/Zones/plains.svg';
import ruins from 'src/assets/img/Zones/ruins.svg';
import sea from 'src/assets/img/Zones/sea.svg';
import volcano from 'src/assets/img/Zones/crater.svg';

const zonePortraits = () => {

    const portraits: Portraits[] = [
        {
            name: 'cave',
            src: cave
        },
        {
            name: 'desert',
            src: desert
        },
        {
            name: 'forest',
            src: forest
        },
        {
            name: 'lake',
            src: lake
        },
        {
            name: 'plains',
            src: plains
        },
        {
            name: 'ruins',
            src: ruins
        },
        {
            name: 'sea',
            src: sea
        },
        {
            name: 'volcano',
            src: volcano
        }
    ]

    return{
        portraits
    }
}

export default zonePortraits