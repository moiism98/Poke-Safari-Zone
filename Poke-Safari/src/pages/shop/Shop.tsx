import useApp from "src/components/App/hook/useApp";
import GameScreen from "src/components/GameScreen/GameScreen";
import shop from "src/assets/img/Zones/shop.svg";
import { useContext } from "react";
import { Context } from "src/context/AppContext";
import { /*useEffect, */useState } from "react";
import { InputNumber } from "antd";
import { Image } from "react-bootstrap"
import { valueType } from "antd/es/statistic/utils";

const Shop = () => {

    const { saveFile } = useContext(Context);
    
    const { gameScreen, FirstLetterToUpper } = useApp();

    const [ pokeMoney ] = useState<number>(50000);

    const [ moneyToSpent, setMoneyToSpent ] = useState<number>(0);

    const onStep = (itemPrice: number, info: { offset: valueType, type: "up" | "down" }) => {
       
        switch(info.type)
        {
            case 'up': setMoneyToSpent(oldPrice => oldPrice + itemPrice); break;

            case 'down': setMoneyToSpent(oldPrice => oldPrice - itemPrice); break;
        }
    }
    
    return(
        <GameScreen styles={ Object.assign({}, gameScreen, { backgroundImage: `url(${ shop })` }) }>
            <div style={{ width: '100%', height: '100%' }}>
                <div style={{ display: "flex", alignItems:'center', justifyContent: 'space-around', width: '100%', height:'5%', color:'white', margin: '1em'}}>
                    <h3 style={{ color:'white' }}>$ { pokeMoney }</h3>
                    <h3 style={{ color:'white' }}>$ { moneyToSpent }</h3>
                </div>
                <div style={{ display: "flex", width: '100%', height:'95%' }}>
                    <div style={{ display: "flex", flexDirection: 'row', flexWrap:'wrap' , alignItems:'center', justifyContent: 'center', width: '50%', height:'85%', overflowY:'auto' }}>
                        {
                            saveFile?.shop.items.map(item => (
                                
                                <div key={ item.id }>
                                    <Image title={ FirstLetterToUpper(item.name) } width={35} height={35} src={ item.icon }/>
                                    <InputNumber keyboard onStep={(_value, info) => onStep(item.price ? item.price : 0, info)} defaultValue={0} min={0} max={ item.price ? Math.floor(pokeMoney / item.price) : 0 } /> 
                                </div>
                                
                            ))
                        }
                    </div>
                    <div style={{ display: "flex", alignItems:'center', justifyContent: 'center', width: '50%', height:'75%'}}>
                        <h3>BAG ITEMS</h3>
                    </div>
                </div>
            </div>
        </GameScreen>    
    )
}

export default Shop