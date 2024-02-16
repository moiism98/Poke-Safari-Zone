import bug from 'src/assets/img/poke-types/bug.svg';
import dark from 'src/assets/img/poke-types/dark.svg';
import dragon from 'src/assets/img/poke-types/dragon.svg';
import electric from 'src/assets/img/poke-types/electric.svg';
import fairy from 'src/assets/img/poke-types/fairy.svg';
import fighting from 'src/assets/img/poke-types/fighting.svg';
import fire from 'src/assets/img/poke-types/fire.svg';
import flying from 'src/assets/img/poke-types/flying.svg';
import ghost from 'src/assets/img/poke-types/ghost.svg';
import grass from 'src/assets/img/poke-types/grass.svg';
import ground from 'src/assets/img/poke-types/ground.svg';
import ice from 'src/assets/img/poke-types/ice.svg';
import normal from 'src/assets/img/poke-types/normal.svg';
import poison from 'src/assets/img/poke-types/poison.svg';
import psychic from 'src/assets/img/poke-types/psychic.svg';
import rock from 'src/assets/img/poke-types/rock.svg';
import steel from 'src/assets/img/poke-types/steel.svg';
import water from 'src/assets/img/poke-types/water.svg';

const typesImages: string[] = [
    bug,
    dark,
    dragon,
    electric,
    fairy,
    fighting,
    fire,
    flying,
    ghost,
    grass,
    ground,
    ice,
    normal,
    poison,
    psychic,
    rock,
    steel,
    water,
]
const pokeTypes = () => {

        const GetTypeIcon = (pokeType: string) => 
        {
            return typesImages.find(type => type.includes(pokeType))
        }
        
        
        return {
            GetTypeIcon
        }
}

export default pokeTypes;