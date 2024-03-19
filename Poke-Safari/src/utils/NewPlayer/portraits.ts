import { Portraits } from "src/interfaces/interfaces"
import cave from 'src/assets/img/Zones/cave.svg';
import coronet from 'src/assets/img/Zones/coronet.svg';
import desert from 'src/assets/img/Zones/desert.svg';
import forest from 'src/assets/img/Zones/forest.svg';
import iceCave from 'src/assets/img/Zones/ice-cave.svg'
import lake from 'src/assets/img/Zones/lake.svg';
import plains from 'src/assets/img/Zones/plains.svg';
import powerPlant from 'src/assets/img/Zones/power_plant.svg';
import ruins from 'src/assets/img/Zones/ruins.svg';
import sea from 'src/assets/img/Zones/sea.svg';
import nationalPark from 'src/assets/img/Zones/national-park.svg';
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
            name: 'Power-Plant',
            src: powerPlant
        },
        {
            name: 'ruins',
            src: ruins
        },
        {
            name: 'National-Park',
            src: nationalPark
        },
        {
            name: 'sea',
            src: sea
        },
        {
            name: 'ice-cave',
            src: iceCave
        },
        {
            name: 'volcano',
            src: volcano
        },
        {
            name: 'Mt.Coronet',
            src: coronet
        }
    ]

    return{
        portraits
    }
}

export default zonePortraits