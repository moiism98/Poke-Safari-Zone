import 'src/pages/pokédex/Pokedex.css'
import background from 'src/assets/img/Index/safari-zone-cover.svg';
import unknown from 'src/assets/img/Pokedex/pokedex-unknown.svg'
import { Context } from 'src/context/AppContext';
import { useContext } from 'react';
import { Image } from 'react-bootstrap';

const Pokedex = () =>{

    const { pokemons } = useContext(Context);

    return(
        
        <div className="default-frame" id="gameScreen" style={{ backgroundImage: `url(${background})`}}>
            <div className='container' id='pokedex'>
            {
                pokemons?.map(pokemon => (<Image className='unknown' key={pokemon.id} src={unknown}/>))
            }
            </div>
        </div>   
    )
}

export default Pokedex;