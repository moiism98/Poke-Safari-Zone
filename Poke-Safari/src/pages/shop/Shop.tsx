import "./Shop.css";
import useApp from "src/components/App/hook/useApp";
import GameScreen from "src/components/GameScreen/GameScreen";
import shop from "src/assets/img/Zones/shop.svg";
import { useContext } from "react";
import { Context } from "src/context/AppContext";
import { /*useEffect, */useState } from "react";
import { Button, InputNumber } from "antd";
import { Image } from "react-bootstrap"
import { valueType } from "antd/es/statistic/utils";
import { Item } from "src/interfaces/interfaces";

const Shop = () => {

    const { saveFile } = useContext(Context);
    
    const { gameScreen, FirstLetterToUpper } = useApp();

    const [ pokeMoney ] = useState<number>(50000);

    const [ moneyToSpent, setMoneyToSpent ] = useState<number>(0);

    const [ item, setItem ] = useState<Item>();

    const onStep = (itemPrice: number | undefined, info: { offset: valueType, type: "up" | "down" }) => {
       
        if(itemPrice)
        {
            switch(info.type)
            {
                case 'up': setMoneyToSpent(oldPrice => oldPrice + itemPrice); break;
    
                case 'down': setMoneyToSpent(oldPrice => oldPrice - itemPrice); break;
            }
        }
    }
    
    return(
        <GameScreen styles={ Object.assign({}, gameScreen, { backgroundImage: `url(${ shop })` }) }>
            <div style={{ width: '100%', height: '100%' }}>
                <div style={{ display: "flex", alignItems:'center', justifyContent: 'space-around', width: '100%', height:'5%', color:'white', margin: '1em'}}>
                    <h3 style={{ color:'white' }}>$ { pokeMoney }</h3>
                    <h3 style={{ color:'white' }}>$ { moneyToSpent }</h3>
                </div>
                <div style={{ display: "flex", alignItems:'center', justifyContent: 'center', width: '100%', height:'80%' }}>
                    <div style={{ width: '50%', overflowY:'auto' }}>
                        {
                            saveFile?.shop.items.map(item => (
                                
                                <Image 
                                    key={ item.id } 
                                    style={{ cursor: 'pointer', margin:'.3em' }} 
                                    title={ FirstLetterToUpper(item.name) } 
                                    width={45} height={45} 
                                    src={ item.icon }
                                    onClick={() => setItem(item) }
                                />
                            ))
                        }
                    </div>
                    <div style={{ display: "flex", alignItems:'center', justifyContent: 'center', width: '50%', height:'75%'}}>
                        <h3>BAG ITEMS</h3>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems:'center', justifyContent:'center', width: '100%', height:'10%'}}>
                    {
                        item && item.price ? 
                        <div className="purchase">
                            <Image title={ FirstLetterToUpper(item.name) } src={ item.icon }/>
                            <InputNumber keyboard onStep={(_value, info) => onStep( item.price, info)} defaultValue={0} min={0} max={ Math.floor(pokeMoney / item.price) } />
                            <Button>Purchase</Button>
                        </div> : null
                    }
                </div>
            </div>
        </GameScreen>    
    )
}

export default Shop