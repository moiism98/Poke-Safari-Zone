import useApp from "src/components/App/hook/useApp";
import GameScreen from "src/components/GameScreen/GameScreen";
import shop from "src/assets/img/Zones/shop.svg";
import { Image } from "react-bootstrap";
import { useEffect, useState } from "react";

const Shop = () => {

    const getEggIcon = async() => {

        await fetch("https://pokeapi.co/api/v2/item/483/")
        .then(response => response.ok ? response.json() : console.warn("Data not received!"))
        .then(data => setEggIcon(data.sprites.default));
    }

    const [ eggIcon, setEggIcon ] = useState<string>();

    const [ eggCount ] = useState<number>(0);

    useEffect(() => {
        
        getEggIcon()

    }, [])

    const { gameScreen } = useApp();
    
    return(
        <GameScreen styles={ Object.assign({}, gameScreen, { backgroundImage: `url(${ shop })` }) }>
            <div style={{width: '100%', height: '100%'}}>
                <div style={{ display: "flex", alignItems:'center', justifyContent: 'center', padding:'.3em', width: '10%', height: '5%'/*, backgroundColor: 'red'*/ }}>
                    <Image width={40} height={40} src={ eggIcon }/>
                    <h5 style={{ margin: 0, color: 'white' }}> x{ eggCount }</h5>
                </div>
            </div>
        </GameScreen>    
    )
}

export default Shop