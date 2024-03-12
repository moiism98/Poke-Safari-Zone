import "./Shop.css";
import GameScreen from "src/components/GameScreen/GameScreen";
import shop from "src/assets/img/Zones/shop.svg";
import { Button, InputNumber, Popover } from "antd";
import { Image } from "react-bootstrap"
import useShop from "src/components/shop/hook/useShop";

const Shop = () => {

    const { gameScreen, options, pokeMoney, moneyToSpent, saveFile, bag, item, isPurchasing, setItem, setIsPurchasing, onStep, 
        purchaseItem, sellItem, FirstLetterToUpper } = useShop();
    
    return(
        <GameScreen styles={ Object.assign({}, gameScreen, { backgroundImage: `url(${ shop })` }) }>
            <div className="shop">
                <div className="pokeMoney">
                    <h3>$ { pokeMoney }</h3>
                    <h3>Total: $ { moneyToSpent }</h3>
                </div>
                <div className="itemContainer">
                    <h3 className="shopText">SHOP ITEMS</h3>
                    <div className="items">
                        <div>
                            {
                                saveFile?.shop.items.map(item => (

                                    <Popover
                                        trigger="hover"
                                        key={ item.id }
                                        content={
                                            <div className="itemPopover" style={{ fontFamily: options.appFont }}>
                                                <h5>{ FirstLetterToUpper(item.name) }</h5>
                                                <h5>Price: ${ item.price ? item.price : 0 }</h5>
                                            </div>
                                        }
                                    >
                                        <Image
                                            title={ FirstLetterToUpper(item.name) }
                                            src={ item.icon }
                                            onClick={() => {
                                                    
                                                setItem(item);

                                                setIsPurchasing(true);
                                            }}
                                        />
                                    </Popover>
                                ))
                            }
                        </div>
                    </div>
                    <h3 className="shopText">BAG ITEMS</h3>
                    <div className="items">
                        <div>
                            {
                                bag.map(item => (
                                    
                                    <Popover
                                        key={ item.id }
                                        trigger="hover"
                                        content={
                                            <div className="itemPopover" style={{ fontFamily: options.appFont}}>
                                                <div className="sellItemPopover">
                                                    <h5>{ FirstLetterToUpper(item.name) }</h5>
                                                    <h5>x{ item.cuantity }</h5>
                                                </div>
                                                <h5>Sell price: ${ item.sellPrice ? item.sellPrice : 0 }</h5>
                                            </div>
                                        }
                                    >
                                        <Image
                                            title={ FirstLetterToUpper(item.name) } 
                                            src={ item.icon }
                                            onClick={() => {
                                                
                                                setItem(item);

                                                setIsPurchasing(false);
                                            }}
                                        />
                                    </Popover>
                                ))
                            }
                        </div>
                    </div>
                </div>
                <div className="actionContainer">
                    {
                        item && item.price ? 
                        <div className="action">
                            <Image title={ FirstLetterToUpper(item.name) } src={ item.icon }/>
                            <InputNumber keyboard onStep={(value, info) => onStep(value, item.price, info)} defaultValue={1} min={1} max={ isPurchasing ? Math.floor(pokeMoney / item.price) : item.cuantity } />
                            {
                                isPurchasing ? <Button onClick={ () => purchaseItem() }>Purchase</Button>
                                : <Button onClick={ () => sellItem() }>Sell</Button>
                                
                            }
                        </div> : null
                    }
                </div>
            </div>
        </GameScreen>    
    )
}

export default Shop